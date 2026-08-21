<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/class-msa-pricing.php';
require_once dirname(__DIR__) . '/includes/class-msa-html-audit.php';
require_once dirname(__DIR__) . '/includes/class-msa-dated-redirect.php';
require_once dirname(__DIR__) . '/includes/class-msa-plugin.php';

if (!function_exists('wp_strip_all_tags')) {
    function wp_strip_all_tags(string $text): string
    {
        return strip_tags($text);
    }
}

if (!function_exists('shortcode_atts')) {
    function shortcode_atts(array $defaults, array $attributes): array
    {
        return array_merge($defaults, array_intersect_key($attributes, $defaults));
    }
}

if (!function_exists('absint')) {
    function absint($value): int
    {
        return abs((int) $value);
    }
}

if (!function_exists('wp_kses_post')) {
    function wp_kses_post(string $html): string
    {
        return $html;
    }
}

if (!function_exists('wc_get_product')) {
    function wc_get_product(int $product_id): ?object
    {
        if ($product_id !== 4462) {
            return null;
        }

        return new class {
            public function is_visible(): bool
            {
                return true;
            }

            public function get_price_html(): string
            {
                return '<span class="price ajax-price" data-product-id="4462">€99.00</span>';
            }
        };
    }
}

$failures = 0;

function check(string $label, bool $condition): void
{
    global $failures;
    if (!$condition) {
        $failures++;
        fwrite(STDERR, "FAIL: {$label}\n");
        return;
    }
    fwrite(STDOUT, "PASS: {$label}\n");
}

$pricing = new MSA_Pricing();
$starter = $pricing->calculate(9000, 1, 'monthly');
check('9,000 words in one language selects Starter', $starter['plan']['name'] === 'Starter');

$business = $pricing->calculate(9000, 2, 'annual');
check('destination languages multiply the translated word allowance', $business['translated_words'] === 18000);
check('18,000 translated words selects Business', $business['plan']['name'] === 'Business');
check('annual billing selects the annual price', $business['plan']['price'] === 290);

$custom = $pricing->calculate(300000, 20, 'monthly');
check('usage above the published limits returns no plan', $custom['plan'] === null);

$html = <<<'HTML'
<!doctype html>
<html lang="en">
<head>
  <title>Small shop</title>
  <meta name="description" content="Handmade blue bowls">
</head>
<body>
  <nav>Home Shop Contact</nav>
  <main><h1>Blue bowls</h1><p>Made slowly in Athens.</p><img src="/bowl.jpg" alt="Blue ceramic bowl"></main>
  <script>this text must never count</script>
</body>
</html>
HTML;

$audit = MSA_Html_Audit::analyse($html, 'https://example.com/');
check('navigation, page body and SEO text are counted', $audit['estimated_source_words'] === 17);
check('script contents are excluded', $audit['estimated_source_words'] < 20);
check('page language is detected', $audit['lang'] === 'en');
check('relative image URLs are made absolute', $audit['images'][0] === 'https://example.com/bowl.jpg');

check(
    'dated post paths return the canonical post slug',
    MSA_Dated_Redirect::slug_from_path('/2026/08/20/weglot-pricing-calculator-squarespace/') === 'weglot-pricing-calculator-squarespace'
);
check(
    'ordinary post-name paths are not treated as legacy dates',
    MSA_Dated_Redirect::slug_from_path('/weglot-pricing-calculator-squarespace/') === null
);
check(
    'invalid calendar segments are not treated as legacy dates',
    MSA_Dated_Redirect::slug_from_path('/2026/99/99/weglot-pricing-calculator-squarespace/') === null
);

$dynamic_price = MSA_Plugin::price_shortcode(['product' => '4462']);
check('price shortcode preserves the AJAX Prices product wrapper', str_contains($dynamic_price, 'class="price ajax-price"'));
check('price shortcode identifies the WooCommerce product', str_contains($dynamic_price, 'data-product-id="4462"'));
check('price shortcode rejects unknown products', MSA_Plugin::price_shortcode(['product' => '9999']) === '');

exit($failures === 0 ? 0 : 1);
