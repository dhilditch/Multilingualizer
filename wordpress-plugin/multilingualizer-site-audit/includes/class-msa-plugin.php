<?php

declare(strict_types=1);

final class MSA_Plugin
{
    private const AFFILIATE_URL = 'https://weglot.com/pricing?fp_ref=multilingualizer';

    public static function boot(): void
    {
        add_action('plugins_loaded', [MSA_Queue::class, 'maybe_install']);
        add_shortcode('multilingualizer_weglot_calculator', [self::class, 'shortcode']);
        add_action('wp_ajax_nopriv_msa_calculate', [self::class, 'calculate']);
        add_action('wp_ajax_msa_calculate', [self::class, 'calculate']);
        add_action('wp_ajax_nopriv_msa_homepage', [self::class, 'homepage']);
        add_action('wp_ajax_msa_homepage', [self::class, 'homepage']);
        add_action('wp_ajax_nopriv_msa_queue', [self::class, 'queue']);
        add_action('wp_ajax_msa_queue', [self::class, 'queue']);
        add_action('msa_process_audit', [self::class, 'process_audit'], 10, 1);
        add_action('msa_cleanup_audit_jobs', [MSA_Queue::class, 'cleanup']);
        add_action('rest_api_init', [self::class, 'register_worker_routes']);
    }

    public static function shortcode(): string
    {
        wp_enqueue_style('msa-calculator', MSA_URL . 'assets/calculator.css', [], MSA_VERSION);
        wp_enqueue_script('msa-calculator', MSA_URL . 'assets/calculator.js', [], MSA_VERSION, true);
        wp_localize_script('msa-calculator', 'msaCalculator', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'affiliateUrl' => self::AFFILIATE_URL,
        ]);

        ob_start();
        ?>
        <section class="msa" data-msa-calculator>
            <div class="msa__tabs" role="tablist" aria-label="Choose how to estimate your word count">
                <button type="button" class="msa__tab is-active" data-mode="words">Enter a word count</button>
                <button type="button" class="msa__tab" data-mode="text">Paste page text</button>
                <button type="button" class="msa__tab" data-mode="url">Check a homepage</button>
            </div>
            <form class="msa__form" data-form>
                <div data-panel="words"><label>Source words <input name="words" type="number" min="0" step="1" value="10000" required></label></div>
                <div data-panel="text" hidden><label>Page text <textarea name="text" rows="8" maxlength="500000" placeholder="Paste the visible contents of one or more pages"></textarea></label></div>
                <div data-panel="url" hidden><label>Website URL <input name="url" type="url" placeholder="https://example.com"></label></div>
                <div class="msa__row">
                    <label>Destination languages <input name="languages" type="number" min="1" max="20" value="1" required></label>
                    <label>Billing <select name="billing"><option value="monthly">Monthly</option><option value="annual">Annual</option></select></label>
                </div>
                <button type="submit" class="msa__button">Calculate my likely plan</button>
            </form>
            <div class="msa__result" data-result hidden aria-live="polite"></div>
            <form class="msa__queue" data-queue hidden>
                <h3>Check up to 10 pages</h3>
                <p>We can crawl the same public pages a visitor can reach and email your fuller word-count and site-readiness report.</p>
                <label>Email address <input name="email" type="email" maxlength="254" required></label>
                <label class="msa__consent"><input name="consent" type="checkbox" value="1" required> I am authorised to request an audit of this site and agree to the URL and email address being stored while the report is prepared.</label>
                <label class="msa__hp" aria-hidden="true">Leave blank <input name="company" tabindex="-1" autocomplete="off"></label>
                <button type="submit" class="msa__button">Email my full report</button>
                <div data-queue-result aria-live="polite"></div>
            </form>
            <p class="msa__note">Estimate only. Prices are in euros, exclude VAT and were checked on 20 August 2026. This page uses affiliate links, which may earn us a commission at no extra cost to you.</p>
        </section>
        <?php
        return (string) ob_get_clean();
    }

    public static function calculate(): void
    {
        self::rate_limit('calculate', 30);
        try {
            $text = isset($_POST['text']) ? sanitize_textarea_field(wp_unslash($_POST['text'])) : '';
            $words = $text !== '' ? MSA_Pricing::count_words($text) : absint($_POST['words'] ?? 0);
            wp_send_json_success(self::price($words));
        } catch (Throwable $error) {
            wp_send_json_error(['message' => $error->getMessage()], 400);
        }
    }

    public static function homepage(): void
    {
        self::rate_limit('homepage', 6);
        try {
            $page = MSA_Crawler::homepage(sanitize_text_field(wp_unslash($_POST['url'] ?? '')));
            $public = $page;
            $public['link_count'] = count($public['links']);
            $public['image_count'] = count($public['images']);
            unset($public['links'], $public['images']);
            wp_send_json_success(['homepage' => $public, 'price' => self::price($page['estimated_source_words'])]);
        } catch (Throwable $error) {
            wp_send_json_error(['message' => $error->getMessage()], 400);
        }
    }

    public static function queue(): void
    {
        self::rate_limit('queue', 3);
        try {
            if (!empty($_POST['company'])) {
                throw new InvalidArgumentException('The request could not be accepted.');
            }
            if (empty($_POST['consent'])) {
                throw new InvalidArgumentException('Consent is required before the audit can be queued.');
            }
            $email = sanitize_email(wp_unslash($_POST['email'] ?? ''));
            if (!$email || !is_email($email)) {
                throw new InvalidArgumentException('Enter a valid email address.');
            }
            $url = MSA_Crawler::normalise_url(sanitize_text_field(wp_unslash($_POST['url'] ?? '')));
            $languages = self::languages();
            $billing = sanitize_key($_POST['billing'] ?? 'monthly');
            (new MSA_Pricing())->calculate(0, $languages, $billing);
            $job = MSA_Queue::enqueue($email, $url, $languages, $billing);
            wp_schedule_single_event(time() + 30, 'msa_process_audit', [$job['job_uuid']]);
            wp_send_json_success(['job_id' => $job['job_uuid']], 202);
        } catch (Throwable $error) {
            wp_send_json_error(['message' => $error->getMessage()], 400);
        }
    }

    public static function process_audit(string $job_uuid): void
    {
        $job = MSA_Queue::claim_uuid($job_uuid, 'wordpress-fallback');
        if (!$job) {
            return;
        }
        try {
            $audit = MSA_Crawler::crawl($job['url']);
            $price = (new MSA_Pricing())->calculate($audit['source_words'], (int) $job['destination_languages'], $job['billing']);
            self::send_report($job, ['audit' => $audit, 'price' => $price]);
            MSA_Queue::complete((int) $job['id'], ['audit' => $audit, 'price' => $price]);
        } catch (Throwable $error) {
            wp_mail($job['email'], 'We could not complete your website audit', "We could not complete the audit of {$job['url']}.\n\n" . $error->getMessage());
            MSA_Queue::fail((int) $job['id'], $error->getMessage());
        }
    }

    public static function register_worker_routes(): void
    {
        register_rest_route('multilingualizer-audit/v1', '/jobs/claim', [
            'methods' => 'POST',
            'callback' => [self::class, 'worker_claim'],
            'permission_callback' => static fn(): bool => current_user_can('manage_options'),
        ]);
        register_rest_route('multilingualizer-audit/v1', '/jobs/(?P<id>\d+)/complete', [
            'methods' => 'POST',
            'callback' => [self::class, 'worker_complete'],
            'permission_callback' => static fn(): bool => current_user_can('manage_options'),
        ]);
    }

    public static function worker_claim(WP_REST_Request $request): WP_REST_Response
    {
        $worker_id = sanitize_text_field((string) ($request->get_param('worker_id') ?: 'external-worker'));
        $job = MSA_Queue::claim_next(substr($worker_id, 0, 100));
        return new WP_REST_Response($job, $job ? 200 : 204);
    }

    public static function worker_complete(WP_REST_Request $request): WP_REST_Response
    {
        $job = MSA_Queue::get((int) $request['id']);
        if (!$job || $job['status'] !== 'processing') {
            return new WP_REST_Response(['message' => 'The job is not available for completion.'], 409);
        }
        $success = filter_var($request->get_param('success'), FILTER_VALIDATE_BOOLEAN);
        if (!$success) {
            $error = sanitize_text_field((string) $request->get_param('error'));
            MSA_Queue::fail((int) $job['id'], $error ?: 'The external worker failed.');
            wp_mail($job['email'], 'We could not complete your website audit', "We could not complete the audit of {$job['url']}.\n\n{$error}");
            return new WP_REST_Response(['status' => 'failed'], 200);
        }
        $report = $request->get_json_params()['report'] ?? null;
        if (!is_array($report) || !isset($report['audit'], $report['price'])) {
            return new WP_REST_Response(['message' => 'A complete audit and price report is required.'], 400);
        }
        self::send_report($job, $report);
        MSA_Queue::complete((int) $job['id'], $report);
        return new WP_REST_Response(['status' => 'completed'], 200);
    }

    private static function send_report(array $job, array $report): void
    {
        $audit = $report['audit'];
        $price = $report['price'];
        $plan = !empty($price['plan']) ? $price['plan']['name'] . ' at €' . $price['plan']['price'] . ' per ' . $price['plan']['period'] : 'a custom Weglot quote';
        $lines = [
            'Your website audit', '',
            'Site: ' . ($audit['requestedUrl'] ?? $audit['requested_url'] ?? $job['url']),
            'Pages checked: ' . count($audit['pages'] ?? []) . (!empty($audit['truncated']) ? ' (10-page limit reached)' : ''),
            'Estimated source words: ' . number_format_i18n((int) ($audit['sourceWords'] ?? $audit['source_words'] ?? 0)),
            'Destination languages: ' . $job['destination_languages'],
            'Estimated translated words: ' . number_format_i18n((int) ($price['translatedWords'] ?? $price['translated_words'] ?? 0)),
            'Likely published plan: ' . $plan, '',
            'Review the current plans: ' . self::AFFILIATE_URL, '',
            'This is an estimate from publicly accessible HTML. Dynamic, gated and unlinked content may not be included.',
        ];
        if (!wp_mail($job['email'], 'Your Multilingualizer website audit', implode("\n", $lines))) {
            throw new RuntimeException('WordPress could not send the audit email.');
        }
    }

    private static function price(int $words): array
    {
        $billing = sanitize_key($_POST['billing'] ?? 'monthly');
        return (new MSA_Pricing())->calculate($words, self::languages(), $billing);
    }

    private static function languages(): int
    {
        return absint($_POST['languages'] ?? 1);
    }

    private static function rate_limit(string $action, int $limit): void
    {
        $address = sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
        $key = 'msa_rate_' . md5($action . '|' . $address);
        $count = (int) get_transient($key) + 1;
        set_transient($key, $count, MINUTE_IN_SECONDS);
        if ($count > $limit) {
            wp_send_json_error(['message' => 'Too many requests. Wait a minute and try again.'], 429);
        }
    }
}
