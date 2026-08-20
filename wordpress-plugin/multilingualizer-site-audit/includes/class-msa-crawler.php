<?php

declare(strict_types=1);

final class MSA_Crawler
{
    private const MAX_PAGE_BYTES = 2000000;
    private const MAX_PAGES = 10;

    public static function homepage(string $input): array
    {
        $url = self::normalise_url($input);
        return self::fetch_page($url);
    }

    public static function crawl(string $input): array
    {
        $start = self::normalise_url($input);
        $start_host = strtolower((string) wp_parse_url($start, PHP_URL_HOST));
        $pending = [$start];
        $seen = [];
        $pages = [];
        $failures = [];

        while ($pending && count($pages) < self::MAX_PAGES) {
            $url = array_shift($pending);
            if (isset($seen[$url])) {
                continue;
            }
            $seen[$url] = true;
            try {
                $page = self::fetch_page($url);
                $pages[] = $page;
                foreach ($page['links'] as $link) {
                    $host = strtolower((string) wp_parse_url($link, PHP_URL_HOST));
                    $path = (string) wp_parse_url($link, PHP_URL_PATH);
                    if (self::equivalent_host($host, $start_host) && !preg_match('/\.(?:avif|css|gif|ico|jpe?g|js|json|mp3|mp4|pdf|png|svg|webp|xml|zip)$/i', $path)) {
                        $link = strtok($link, '#');
                        if (!isset($seen[$link])) {
                            $pending[] = $link;
                        }
                    }
                }
            } catch (Throwable $error) {
                $failures[] = ['url' => $url, 'error' => $error->getMessage()];
            }
        }

        $source_words = array_sum(array_column($pages, 'estimated_source_words'));
        return [
            'requested_url' => $start,
            'source_words' => $source_words,
            'pages' => array_map([self::class, 'public_page'], $pages),
            'failures' => $failures,
            'truncated' => !empty($pending),
            'max_pages' => self::MAX_PAGES,
        ];
    }

    public static function normalise_url(string $input): string
    {
        $input = trim($input);
        if ($input === '') {
            throw new InvalidArgumentException('Enter a website URL.');
        }
        if (!preg_match('#^https?://#i', $input)) {
            $input = 'https://' . $input;
        }
        $parts = wp_parse_url($input);
        if (!$parts || !in_array(strtolower($parts['scheme'] ?? ''), ['http', 'https'], true)) {
            throw new InvalidArgumentException('Only HTTP and HTTPS websites can be checked.');
        }
        if (!empty($parts['user']) || !empty($parts['pass'])) {
            throw new InvalidArgumentException('Website URLs cannot contain credentials.');
        }
        $validated = wp_http_validate_url($input);
        if (!$validated) {
            throw new InvalidArgumentException('That website URL is not public or valid.');
        }
        return esc_url_raw($validated);
    }

    private static function fetch_page(string $url): array
    {
        $response = wp_safe_remote_get($url, [
            'timeout' => 10,
            'redirection' => 3,
            'limit_response_size' => self::MAX_PAGE_BYTES,
            'user-agent' => 'MultilingualizerSiteAudit/' . MSA_VERSION . ' (+https://www.multilingualizer.com/)',
            'headers' => ['Accept' => 'text/html,application/xhtml+xml;q=0.9'],
        ]);
        if (is_wp_error($response)) {
            throw new RuntimeException($response->get_error_message());
        }
        $status = wp_remote_retrieve_response_code($response);
        if ($status < 200 || $status >= 400) {
            throw new RuntimeException('The page returned HTTP ' . $status . '.');
        }
        $content_type = strtolower((string) wp_remote_retrieve_header($response, 'content-type'));
        if (!str_contains($content_type, 'text/html') && !str_contains($content_type, 'application/xhtml+xml')) {
            throw new RuntimeException('The URL did not return an HTML page.');
        }
        $page = MSA_Html_Audit::analyse(wp_remote_retrieve_body($response), $url);
        $page['status'] = $status;
        return $page;
    }

    private static function equivalent_host(string $left, string $right): bool
    {
        return preg_replace('/^www\./i', '', $left) === preg_replace('/^www\./i', '', $right);
    }

    private static function public_page(array $page): array
    {
        $page['link_count'] = count($page['links']);
        $page['image_count'] = count($page['images']);
        unset($page['links'], $page['images']);
        return $page;
    }
}
