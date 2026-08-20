WITH eligible_items AS (
    SELECT oi.order_id, oi.order_item_name
    FROM wp_woocommerce_order_items oi
    JOIN wp_woocommerce_order_itemmeta product_meta
      ON product_meta.order_item_id = oi.order_item_id
     AND product_meta.meta_key = '_product_id'
    WHERE oi.order_item_type = 'line_item'
      AND CAST(product_meta.meta_value AS UNSIGNED) IN (4462, 5107, 7675)
), eligible_orders AS (
    SELECT DISTINCT order_id FROM eligible_items
), paid_orders AS (
    SELECT
        p.ID order_id,
        CAST(customer.meta_value AS UNSIGNED) user_id,
        p.post_date order_date,
        CAST(total.meta_value AS DECIMAL(12,2)) order_total,
        COALESCE(NULLIF(currency.meta_value, ''), 'UNK') currency,
        COALESCE(first_name.meta_value, '') first_name,
        COALESCE(last_name.meta_value, '') last_name,
        COALESCE(email.meta_value, '') email,
        COALESCE(company.meta_value, '') company,
        COALESCE(country.meta_value, '') country
    FROM eligible_orders e
    JOIN wp_posts p ON p.ID = e.order_id
    JOIN wp_postmeta customer
      ON customer.post_id = p.ID AND customer.meta_key = '_customer_user'
    JOIN wp_postmeta total
      ON total.post_id = p.ID AND total.meta_key = '_order_total'
    LEFT JOIN wp_postmeta currency
      ON currency.post_id = p.ID AND currency.meta_key = '_order_currency'
    LEFT JOIN wp_postmeta first_name
      ON first_name.post_id = p.ID AND first_name.meta_key = '_billing_first_name'
    LEFT JOIN wp_postmeta last_name
      ON last_name.post_id = p.ID AND last_name.meta_key = '_billing_last_name'
    LEFT JOIN wp_postmeta email
      ON email.post_id = p.ID AND email.meta_key = '_billing_email'
    LEFT JOIN wp_postmeta company
      ON company.post_id = p.ID AND company.meta_key = '_billing_company'
    LEFT JOIN wp_postmeta country
      ON country.post_id = p.ID AND country.meta_key = '_billing_country'
    WHERE p.post_status IN ('wc-completed', 'wc-processing')
      AND CAST(total.meta_value AS DECIMAL(12,2)) > 0
      AND CAST(customer.meta_value AS UNSIGNED) > 0
), ranked_orders AS (
    SELECT paid_orders.*,
           ROW_NUMBER() OVER (
               PARTITION BY user_id ORDER BY order_date DESC, order_id DESC
           ) recency_rank
    FROM paid_orders
), account_totals AS (
    SELECT user_id,
           COUNT(*) paid_order_count,
           MIN(order_date) first_paid_order_at,
           MAX(order_date) last_paid_order_at
    FROM paid_orders
    GROUP BY user_id
), currency_totals AS (
    SELECT user_id, currency, SUM(order_total) currency_total
    FROM paid_orders
    GROUP BY user_id, currency
), currency_rollup AS (
    SELECT user_id,
           GROUP_CONCAT(
               CONCAT(currency, ':', CAST(currency_total AS CHAR))
               ORDER BY currency SEPARATOR '|'
           ) paid_totals
    FROM currency_totals
    GROUP BY user_id
), product_rollup AS (
    SELECT po.user_id,
           GROUP_CONCAT(
               DISTINCT ei.order_item_name
               ORDER BY ei.order_item_name SEPARATOR '|'
           ) products
    FROM paid_orders po
    JOIN eligible_items ei ON ei.order_id = po.order_id
    GROUP BY po.user_id
)
SELECT
    totals.user_id wordpress_user_id,
    TRIM(CONCAT(latest.first_name, ' ', latest.last_name)) customer_name,
    latest.email,
    latest.company,
    latest.country,
    totals.paid_order_count,
    currencies.paid_totals,
    totals.first_paid_order_at,
    totals.last_paid_order_at,
    products.products,
    COALESCE(LENGTH(websites.meta_value), 0) websites_length,
    COALESCE(SUBSTRING(websites.meta_value, 1, 1900), '') websites_part_1,
    COALESCE(SUBSTRING(websites.meta_value, 1901, 1900), '') websites_part_2
FROM account_totals totals
JOIN ranked_orders latest
  ON latest.user_id = totals.user_id AND latest.recency_rank = 1
JOIN currency_rollup currencies ON currencies.user_id = totals.user_id
JOIN product_rollup products ON products.user_id = totals.user_id
LEFT JOIN wp_usermeta websites
  ON websites.user_id = totals.user_id AND websites.meta_key = 'wp_mlwebsites'
ORDER BY totals.user_id
