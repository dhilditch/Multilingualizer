<?php

declare(strict_types=1);

final class MSA_Dated_Redirect
{
    public static function slug_from_path(string $path): ?string
    {
        if (!preg_match('#^/(\d{4})/(\d{2})/(\d{2})/([a-z0-9-]+)/?$#i', $path, $match)) {
            return null;
        }
        if (!checkdate((int) $match[2], (int) $match[3], (int) $match[1])) {
            return null;
        }
        return strtolower($match[4]);
    }

    public static function maybe_redirect(): void
    {
        if (is_admin() || !is_404()) {
            return;
        }
        $path = (string) wp_parse_url(wp_unslash($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);
        $slug = self::slug_from_path($path);
        if ($slug === null) {
            return;
        }
        $post = get_page_by_path($slug, OBJECT, 'post');
        if (!$post instanceof WP_Post || $post->post_status !== 'publish') {
            return;
        }
        wp_safe_redirect(get_permalink($post), 301, 'Multilingualizer dated permalink migration');
        exit;
    }
}
