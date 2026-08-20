<?php

declare(strict_types=1);

final class MSA_Queue
{
    public const SCHEMA_VERSION = '1';

    public static function install(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $table = self::table();
        $charset = $wpdb->get_charset_collate();
        dbDelta("CREATE TABLE {$table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            job_uuid char(36) NOT NULL,
            email varchar(254) NOT NULL,
            url text NOT NULL,
            destination_languages tinyint(3) unsigned NOT NULL DEFAULT 1,
            billing varchar(10) NOT NULL DEFAULT 'monthly',
            status varchar(20) NOT NULL DEFAULT 'queued',
            attempts tinyint(3) unsigned NOT NULL DEFAULT 0,
            worker_id varchar(100) NOT NULL DEFAULT '',
            created_at datetime NOT NULL,
            claimed_at datetime NULL,
            completed_at datetime NULL,
            error_message text NULL,
            report longtext NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY job_uuid (job_uuid),
            KEY status_created (status, created_at)
        ) {$charset};");
        update_option('msa_queue_schema_version', self::SCHEMA_VERSION, false);
        if (!wp_next_scheduled('msa_cleanup_audit_jobs')) {
            wp_schedule_event(time() + HOUR_IN_SECONDS, 'daily', 'msa_cleanup_audit_jobs');
        }
    }

    public static function maybe_install(): void
    {
        if (get_option('msa_queue_schema_version') !== self::SCHEMA_VERSION) {
            self::install();
        }
    }

    public static function enqueue(string $email, string $url, int $languages, string $billing): array
    {
        global $wpdb;
        $job = [
            'job_uuid' => wp_generate_uuid4(),
            'email' => $email,
            'url' => $url,
            'destination_languages' => $languages,
            'billing' => $billing,
            'status' => 'queued',
            'created_at' => current_time('mysql', true),
        ];
        $inserted = $wpdb->insert(self::table(), $job, ['%s', '%s', '%s', '%d', '%s', '%s', '%s']);
        if (!$inserted) {
            throw new RuntimeException('The audit could not be added to the queue.');
        }
        $job['id'] = (int) $wpdb->insert_id;
        return $job;
    }

    public static function claim_next(string $worker_id): ?array
    {
        global $wpdb;
        $table = self::table();
        for ($attempt = 0; $attempt < 3; $attempt++) {
            $id = (int) $wpdb->get_var("SELECT id FROM {$table} WHERE status = 'queued' ORDER BY created_at ASC, id ASC LIMIT 1");
            if (!$id) {
                return null;
            }
            $updated = $wpdb->query($wpdb->prepare(
                "UPDATE {$table} SET status = 'processing', worker_id = %s, claimed_at = UTC_TIMESTAMP(), attempts = attempts + 1 WHERE id = %d AND status = 'queued'",
                $worker_id,
                $id
            ));
            if ($updated === 1) {
                return self::get($id);
            }
        }
        return null;
    }

    public static function claim_uuid(string $job_uuid, string $worker_id): ?array
    {
        global $wpdb;
        $table = self::table();
        $updated = $wpdb->query($wpdb->prepare(
            "UPDATE {$table} SET status = 'processing', worker_id = %s, claimed_at = UTC_TIMESTAMP(), attempts = attempts + 1 WHERE job_uuid = %s AND status = 'queued'",
            $worker_id,
            $job_uuid
        ));
        if ($updated !== 1) {
            return null;
        }
        return $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table} WHERE job_uuid = %s", $job_uuid), ARRAY_A) ?: null;
    }

    public static function complete(int $id, array $report): bool
    {
        global $wpdb;
        return $wpdb->update(self::table(), [
            'status' => 'completed',
            'completed_at' => current_time('mysql', true),
            'report' => wp_json_encode($report),
            'error_message' => null,
        ], ['id' => $id, 'status' => 'processing'], ['%s', '%s', '%s', '%s'], ['%d', '%s']) === 1;
    }

    public static function fail(int $id, string $error): bool
    {
        global $wpdb;
        return $wpdb->update(self::table(), [
            'status' => 'failed',
            'completed_at' => current_time('mysql', true),
            'error_message' => substr($error, 0, 65535),
        ], ['id' => $id, 'status' => 'processing'], ['%s', '%s', '%s'], ['%d', '%s']) === 1;
    }

    public static function get(int $id): ?array
    {
        global $wpdb;
        return $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . self::table() . ' WHERE id = %d', $id), ARRAY_A) ?: null;
    }

    public static function cleanup(): int
    {
        global $wpdb;
        return (int) $wpdb->query(
            'DELETE FROM ' . self::table() . " WHERE status IN ('completed', 'failed') AND completed_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY)"
        );
    }

    public static function table(): string
    {
        global $wpdb;
        return $wpdb->prefix . 'msa_audit_jobs';
    }
}
