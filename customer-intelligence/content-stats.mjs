import path from 'node:path';
import process from 'node:process';
import { DatabaseSync } from 'node:sqlite';
import { DEFAULT_DATABASE } from './lib/paths.mjs';

const databasePath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_DATABASE;
const database = new DatabaseSync(databasePath, { readOnly: true });

function one(sql, ...parameters) {
  return database.prepare(sql).get(...parameters);
}

function all(sql, ...parameters) {
  return database.prepare(sql).all(...parameters);
}

function percentage(numerator, denominator) {
  return denominator ? Number(((numerator / denominator) * 100).toFixed(1)) : 0;
}

const currentSiteWhere = "s.active=1 AND s.site_state='customer_site'";
const squarespaceWhere = `${currentSiteWhere} AND s.detected_platform='Squarespace'`;

function population(where) {
  return one(
    `SELECT COUNT(DISTINCT s.id) sites, COUNT(DISTINCT s.client_id) customers
       FROM sites s
      WHERE ${where}`,
  );
}

function technologyPopulation(name, where) {
  return one(
    `SELECT COUNT(DISTINCT s.id) sites, COUNT(DISTINCT s.client_id) customers
       FROM sites s
      WHERE ${where}
        AND (
          EXISTS (
            SELECT 1
              FROM site_technologies st
             WHERE st.site_id=s.id
               AND st.attributed_to_customer=1
               AND st.name=?
          )
          OR EXISTS (
            SELECT 1
              FROM json_each(s.multilingual_tools_json) tools
             WHERE tools.value=?
          )
        )`,
    name,
    name,
  );
}

function grouped(column, where, limit = 20) {
  const allowed = new Set(['country', 'sector', 'business_model']);
  if (!allowed.has(column)) throw new Error(`Unsupported group: ${column}`);
  const owner = column === 'country' ? 'c' : 's';
  const join = column === 'country' ? 'JOIN clients c ON c.id=s.client_id' : '';
  return all(
    `SELECT COALESCE(NULLIF(${owner}.${column},''),'Unclassified') label,
            COUNT(DISTINCT ${column === 'country' ? 'c.id' : 's.id'}) count
       FROM sites s
       ${join}
      WHERE ${where}
      GROUP BY label
      ORDER BY count DESC, label
      LIMIT ?`,
    limit,
  );
}

function languageSummary(where) {
  const rows = all(`SELECT s.registered_languages_json FROM sites s WHERE ${where}`);
  const numberOfLanguages = new Map();
  const combinations = new Map();
  let sitesWithData = 0;

  for (const row of rows) {
    let languages;
    try {
      languages = JSON.parse(row.registered_languages_json);
    } catch {
      continue;
    }
    if (!Array.isArray(languages) || languages.length === 0) continue;
    const normalised = [...new Set(languages.map((value) => String(value).trim().toLowerCase()).filter(Boolean))].sort();
    if (!normalised.length) continue;
    sitesWithData += 1;
    numberOfLanguages.set(normalised.length, (numberOfLanguages.get(normalised.length) || 0) + 1);
    const key = normalised.join('+');
    combinations.set(key, (combinations.get(key) || 0) + 1);
  }

  const sorted = (map, labelName) => [...map.entries()]
    .map(([label, count]) => ({ [labelName]: label, sites: count }))
    .sort((left, right) => right.sites - left.sites || String(left[labelName]).localeCompare(String(right[labelName])));

  return {
    sitesWithData,
    byLanguageCount: sorted(numberOfLanguages, 'languages'),
    leadingCombinations: sorted(combinations, 'combination').slice(0, 20),
  };
}

const historic = one(
  `SELECT COUNT(DISTINCT c.id) customers,
          SUM(CASE WHEN NULLIF(c.country,'') IS NULL THEN 1 ELSE 0 END) missingCountry,
          COUNT(DISTINCT NULLIF(c.country,'')) recordedCountries
     FROM clients c
    WHERE c.paid_order_count>0`,
);
const installations = one('SELECT COUNT(*) installations FROM sites');
const current = population(currentSiteWhere);
const squarespace = population(squarespaceWhere);
const multilingualDetected = population(`${currentSiteWhere} AND s.multilingual_status='detected'`);
const multilingualPossible = population(`${currentSiteWhere} AND s.multilingual_status='possible'`);
const multilingualizer = population(`${currentSiteWhere} AND s.multilingualizer_status='detected'`);
const squarespaceMultilingualizer = population(`${squarespaceWhere} AND s.multilingualizer_status='detected'`);

const affiliateTechnologies = ['HubSpot', 'Elfsight', 'CookieYes', 'Spark Plugin', 'Ghost Plugins'].map((name) => {
  const allCurrent = technologyPopulation(name, currentSiteWhere);
  const onSquarespace = technologyPopulation(name, squarespaceWhere);
  return {
    name,
    currentCustomers: allCurrent.customers,
    currentCustomerShare: percentage(allCurrent.customers, current.customers),
    currentSites: allCurrent.sites,
    squarespaceCustomers: onSquarespace.customers,
    squarespaceCustomerShare: percentage(onSquarespace.customers, squarespace.customers),
    squarespaceSites: onSquarespace.sites,
  };
});

const result = {
  generatedAt: new Date().toISOString(),
  database: databasePath,
  definitions: {
    historicCustomers: 'Unique clients with at least one paid order.',
    currentCustomers: 'Unique clients with an active, reachable site classified as the customer business.',
    technologyUse: 'Minimum observable public use on a current customer site. It does not prove payment, satisfaction or endorsement.',
  },
  populations: {
    historicCustomers: historic.customers,
    suppliedInstallations: installations.installations,
    current,
    squarespace,
    multilingualDetected,
    multilingualPossible,
    multilingualizer,
    squarespaceMultilingualizer: {
      ...squarespaceMultilingualizer,
      siteShare: percentage(squarespaceMultilingualizer.sites, squarespace.sites),
      customerShare: percentage(squarespaceMultilingualizer.customers, squarespace.customers),
    },
  },
  countries: {
    recordedCountries: historic.recordedCountries,
    missingCustomers: historic.missingCountry,
    leading: all(
      `SELECT c.country label, COUNT(DISTINCT c.id) customers
         FROM clients c
        WHERE c.paid_order_count>0 AND c.country<>''
        GROUP BY c.country
        ORDER BY customers DESC, label
        LIMIT 20`,
    ),
  },
  languages: {
    current: languageSummary(currentSiteWhere),
    squarespace: languageSummary(squarespaceWhere),
  },
  squarespaceSectors: grouped('sector', squarespaceWhere),
  squarespaceBusinessModels: grouped('business_model', squarespaceWhere),
  publicPriceEvidence: {
    ...one(`SELECT COUNT(DISTINCT s.id) sites FROM sites s WHERE ${squarespaceWhere} AND s.visible_price_count>0`),
    note: 'Deterministic public price evidence, not a complete ecommerce count.',
  },
  affiliateTechnologies,
};

console.log(JSON.stringify(result, null, 2));
database.close();
