PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS imports (
    id INTEGER PRIMARY KEY,
    imported_at TEXT NOT NULL,
    source_file TEXT NOT NULL,
    source_sha256 TEXT NOT NULL,
    source_rows INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY,
    source_key TEXT NOT NULL UNIQUE,
    wordpress_user_id INTEGER,
    customer_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    company TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT '',
    paid_order_count INTEGER NOT NULL DEFAULT 0,
    paid_total_minor INTEGER NOT NULL DEFAULT 0,
    paid_totals_json TEXT NOT NULL DEFAULT '{}',
    first_paid_order_at TEXT,
    last_paid_order_at TEXT,
    products_json TEXT NOT NULL DEFAULT '[]',
    imported_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    supplied_url TEXT NOT NULL,
    registered_platform TEXT NOT NULL DEFAULT '',
    registered_languages_json TEXT NOT NULL DEFAULT '[]',
    registration_ordinal INTEGER NOT NULL DEFAULT 0,
    active INTEGER,
    homepage_status INTEGER,
    final_homepage_url TEXT,
    detected_platform TEXT NOT NULL DEFAULT '',
    multilingualizer_status TEXT NOT NULL DEFAULT 'unknown',
    multilingualizer_evidence_json TEXT NOT NULL DEFAULT '[]',
    multilingual_status TEXT NOT NULL DEFAULT 'unknown',
    multilingual_tools_json TEXT NOT NULL DEFAULT '[]',
    multilingual_evidence_json TEXT NOT NULL DEFAULT '[]',
    title TEXT NOT NULL DEFAULT '',
    meta_description TEXT NOT NULL DEFAULT '',
    site_name TEXT NOT NULL DEFAULT '',
    what_they_do TEXT NOT NULL DEFAULT '',
    about_url TEXT,
    about_title TEXT NOT NULL DEFAULT '',
    about_text TEXT NOT NULL DEFAULT '',
    contact_url TEXT,
    emails_json TEXT NOT NULL DEFAULT '[]',
    phones_json TEXT NOT NULL DEFAULT '[]',
    social_profiles_json TEXT NOT NULL DEFAULT '[]',
    currencies_json TEXT NOT NULL DEFAULT '[]',
    min_price_minor INTEGER,
    max_price_minor INTEGER,
    visible_price_count INTEGER NOT NULL DEFAULT 0,
    products_services_json TEXT NOT NULL DEFAULT '[]',
    last_crawled_at TEXT,
    crawl_error TEXT,
    UNIQUE(client_id, domain)
);

CREATE INDEX IF NOT EXISTS sites_domain_idx ON sites(domain);
CREATE INDEX IF NOT EXISTS sites_status_idx
    ON sites(active, multilingualizer_status, detected_platform);
CREATE TABLE IF NOT EXISTS crawl_runs (
    id INTEGER PRIMARY KEY,
    started_at TEXT NOT NULL,
    finished_at TEXT,
    requested_sites INTEGER NOT NULL DEFAULT 0,
    completed_sites INTEGER NOT NULL DEFAULT 0,
    failed_sites INTEGER NOT NULL DEFAULT 0,
    options_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY,
    site_id INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    crawl_run_id INTEGER NOT NULL REFERENCES crawl_runs(id) ON DELETE CASCADE,
    page_kind TEXT NOT NULL,
    requested_url TEXT NOT NULL,
    final_url TEXT,
    http_status INTEGER,
    content_type TEXT,
    response_bytes INTEGER NOT NULL DEFAULT 0,
    response_ms INTEGER NOT NULL DEFAULT 0,
    fetched_at TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    text_excerpt TEXT NOT NULL DEFAULT '',
    html_path TEXT,
    content_sha256 TEXT,
    error TEXT,
    UNIQUE(site_id, crawl_run_id, page_kind)
);

CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY,
    site_id INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    contact_type TEXT NOT NULL,
    value TEXT NOT NULL,
    url TEXT NOT NULL DEFAULT '',
    source_url TEXT NOT NULL,
    confidence INTEGER NOT NULL,
    UNIQUE(site_id, contact_type, value, source_url)
);

CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY,
    site_id INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    page_kind TEXT NOT NULL,
    currency TEXT NOT NULL,
    amount_minor INTEGER NOT NULL,
    displayed TEXT NOT NULL,
    context TEXT NOT NULL,
    source_url TEXT NOT NULL,
    evidence_method TEXT NOT NULL,
    UNIQUE(site_id, page_kind, currency, amount_minor, context, source_url)
);

CREATE TABLE IF NOT EXISTS signals (
    id INTEGER PRIMARY KEY,
    site_id INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    signal_type TEXT NOT NULL,
    value TEXT NOT NULL,
    source_url TEXT NOT NULL,
    confidence INTEGER NOT NULL,
    evidence_method TEXT NOT NULL,
    UNIQUE(site_id, signal_type, value, source_url, evidence_method)
);

CREATE TABLE IF NOT EXISTS site_technologies (
    id INTEGER PRIMARY KEY,
    site_id INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    host TEXT NOT NULL DEFAULT '',
    evidence_type TEXT NOT NULL,
    evidence_value TEXT NOT NULL,
    source_url TEXT NOT NULL,
    page_kind TEXT NOT NULL,
    confidence INTEGER NOT NULL,
    UNIQUE(site_id, name, host, evidence_type, evidence_value, source_url)
);

CREATE INDEX IF NOT EXISTS site_technologies_name_idx
    ON site_technologies(name, category, site_id);
