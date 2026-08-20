<?php

declare(strict_types=1);

final class MSA_Html_Audit
{
    public static function analyse(string $html, string $page_url): array
    {
        $document = new DOMDocument();
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML('<?xml encoding="utf-8" ?>' . $html, LIBXML_NONET | LIBXML_NOWARNING | LIBXML_NOERROR);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);
        $xpath = new DOMXPath($document);

        foreach ($xpath->query('//script|//style|//noscript|//svg|//template') ?: [] as $node) {
            $node->parentNode?->removeChild($node);
        }

        $main = $xpath->query('//body')->item(0);
        $visible_parts = [];
        if ($main) {
            foreach ($xpath->query('.//text()', $main) ?: [] as $text_node) {
                $visible_parts[] = $text_node->nodeValue;
            }
        }
        $visible_text = implode(' ', $visible_parts);
        $title = self::first_text($xpath, '//title');
        $description = self::first_attribute($xpath, '//meta[translate(@name,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="description"]', 'content');
        $alt_text = [];
        foreach ($xpath->query('//img[@alt]') ?: [] as $image) {
            $alt_text[] = $image->getAttribute('alt');
        }

        $links = [];
        foreach ($xpath->query('//a[@href]') ?: [] as $link) {
            $resolved = self::resolve_url($link->getAttribute('href'), $page_url);
            if ($resolved !== null) {
                $links[$resolved] = true;
            }
        }
        $images = [];
        foreach ($xpath->query('//img[@src]') ?: [] as $image) {
            $resolved = self::resolve_url($image->getAttribute('src'), $page_url);
            if ($resolved !== null) {
                $images[$resolved] = true;
            }
        }

        $html_node = $xpath->query('//html')->item(0);
        $h1_count = $xpath->query('//h1')?->length ?? 0;
        $metadata_text = implode(' ', array_filter([$title, $description, ...$alt_text]));

        return [
            'url' => $page_url,
            'title' => $title,
            'description' => $description,
            'h1' => self::first_text($xpath, '//h1'),
            'h1_count' => $h1_count,
            'lang' => $html_node instanceof DOMElement ? trim($html_node->getAttribute('lang')) : '',
            'hreflang_count' => $xpath->query('//link[@rel="alternate" and @hreflang]')?->length ?? 0,
            'visible_words' => MSA_Pricing::count_words($visible_text),
            'metadata_words' => MSA_Pricing::count_words($metadata_text),
            'estimated_source_words' => MSA_Pricing::count_words($visible_text) + MSA_Pricing::count_words($metadata_text),
            'links' => array_keys($links),
            'images' => array_keys($images),
        ];
    }

    private static function first_text(DOMXPath $xpath, string $query): string
    {
        $node = $xpath->query($query)->item(0);
        return $node ? trim((string) preg_replace('/\s+/u', ' ', $node->textContent)) : '';
    }

    private static function first_attribute(DOMXPath $xpath, string $query, string $attribute): string
    {
        $node = $xpath->query($query)->item(0);
        return $node instanceof DOMElement ? trim($node->getAttribute($attribute)) : '';
    }

    private static function resolve_url(string $value, string $base): ?string
    {
        $value = trim($value);
        if ($value === '' || str_starts_with($value, '#') || preg_match('/^(?:mailto|tel|javascript|data):/i', $value)) {
            return null;
        }
        if (preg_match('#^https?://#i', $value)) {
            return $value;
        }
        $parts = parse_url($base);
        if (!$parts || empty($parts['scheme']) || empty($parts['host'])) {
            return null;
        }
        if (str_starts_with($value, '//')) {
            return $parts['scheme'] . ':' . $value;
        }
        $origin = $parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '');
        if (str_starts_with($value, '/')) {
            return $origin . $value;
        }
        $path = $parts['path'] ?? '/';
        return $origin . rtrim(str_replace('\\', '/', dirname($path)), '/') . '/' . $value;
    }
}
