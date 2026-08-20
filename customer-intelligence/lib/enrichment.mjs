const PARKING_RULES = [
  ['HugeDomains', /\bhugedomains\b|this domain is for sale|buy this domain/i],
  ['Sedo', /\bsedo domain parking\b|domain is for sale at sedo/i],
  ['Afternic', /\bafternic\b|domain may be for sale/i],
  ['Dan', /\bdan\.com\b.*domain|this domain is for sale/i],
  ['GoDaddy', /\bgodaddy\b.*(?:parked|domain for sale)|this web page is parked/i],
  ['Namecheap', /\bnamecheap\b.*(?:parked|domain for sale)/i],
];

const PARKING_HOSTS = new Map([
  ['hugedomains.com', 'HugeDomains'],
  ['expireddomains.com', 'ExpiredDomains.com'],
  ['domeeninimi.ee', 'Domeeninimi.ee'],
  ['sedo.com', 'Sedo'],
  ['afternic.com', 'Afternic'],
  ['dan.com', 'Dan'],
]);

const SECTOR_RULES = [
  ['Events and experiences', [
    /\bevent(?:s| management| agency| production)?\b/g, /\bwedding(?:s| planner| planning)?\b/g,
    /\bconference(?:s)?\b/g, /\bexhibition(?:s| stand)?\b/g, /\bexperiential\b/g,
    /\beventagentur\b/g, /\bveranstaltung(?:en)?\b/g, /\bévénement(?:s|iel)?\b/g, /\beventi\b/g,
  ]],
  ['Furniture and interiors', [
    /\bfurniture\b/g, /\binterior(?:s| design)?\b/g, /\bhome decor\b/g, /\bdesk(?:s)?\b/g,
    /\bmurphy bed(?:s)?\b/g, /\bcabinet(?:ry|s)?\b/g, /\bupholstery\b/g,
    /\bmöbel\b/g, /\bmeuble(?:s)?\b/g, /\bmobili\b/g, /\binterieur\b/g,
  ]],
  ['Travel and hospitality', [
    /\bhotel(?:s)?\b/g, /\bresort(?:s)?\b/g, /\btravel\b/g, /\btour(?:s|ism| operator)?\b/g,
    /\bholiday (?:home|rental|villa)s?\b/g, /\baccommodation\b/g, /\bguesthouse\b/g,
    /\bvoyage(?:s)?\b/g, /\breisen?\b/g, /\bturismo\b/g, /\bvacanze\b/g,
  ]],
  ['Food and drink', [
    /\brestaurant(?:s)?\b/g, /\bcafe\b/g, /\bcoffee\b/g, /\bfood\b/g, /\bcatering\b/g,
    /\bwinery\b/g, /\bwhisky\b/g, /\bbrewery\b/g, /\bbar\b/g,
    /\brestaurante\b/g, /\bcuisine\b/g, /\bwein\b/g, /\bvin(?:o|i)?\b/g,
  ]],
  ['Architecture and property', [
    /\barchitect(?:s|ure|ural)?\b/g, /\breal estate\b/g, /\bproperty\b/g, /\bconstruction\b/g,
    /\bbuilding design\b/g, /\blandscape architecture\b/g,
    /\barchitektur\b/g, /\bimmobilier\b/g, /\binmobiliaria\b/g, /\bvastgoed\b/g,
  ]],
  ['Creative and media', [
    /\bphotograph(?:y|er|ers)\b/g, /\bfilm(?:s|maker| production)?\b/g, /\bcreative (?:studio|agency)\b/g,
    /\bgraphic design\b/g, /\bbranding\b/g, /\billustrat(?:ion|or)\b/g, /\bartist(?:s)?\b/g,
    /\bfotograf(?:ie|ía|ia|o)\b/g, /\bcréati(?:f|ve)\b/g, /\bkreativagentur\b/g,
  ]],
  ['Fashion and beauty', [
    /\bfashion\b/g, /\bclothing\b/g, /\bjewellery\b/g, /\bjewelry\b/g, /\bbeauty\b/g,
    /\bcosmetic(?:s)?\b/g, /\bskincare\b/g, /\bhair salon\b/g,
    /\bmode\b/g, /\bbeauté\b/g, /\bkleidung\b/g, /\babbigliamento\b/g,
  ]],
  ['Health and wellbeing', [
    /\bhealth(?:care)?\b/g, /\bwellness\b/g, /\byoga\b/g, /\bfitness\b/g, /\btherapy\b/g,
    /\bclinic\b/g, /\bmedical\b/g, /\bpsycholog(?:y|ist)\b/g, /\bdent(?:al|ist)\b/g,
    /\bsanté\b/g, /\bgesundheit\b/g, /\bsalud\b/g, /\bbenessere\b/g,
  ]],
  ['Education and training', [
    /\bschool\b/g, /\buniversity\b/g, /\beducation\b/g, /\btraining\b/g, /\bcourse(?:s)?\b/g,
    /\bacademy\b/g, /\blearning\b/g, /\bworkshop(?:s)?\b/g,
    /\bécole\b/g, /\bschule\b/g, /\bformación\b/g, /\bopleiding\b/g,
  ]],
  ['Technology and software', [
    /\bsoftware\b/g, /\bsaas\b/g, /\btechnology\b/g, /\bplatform\b/g, /\bapp(?:lication)?\b/g,
    /\bcybersecurity\b/g, /\bdata (?:platform|software|analytics)\b/g,
    /\btechnologie\b/g, /\btechnología\b/g, /\btechnologiebedrijf\b/g,
  ]],
  ['Professional services', [
    /\bconsult(?:ing|ancy|ant)\b/g, /\blaw (?:firm|office)\b/g, /\blawyer(?:s)?\b/g,
    /\baccount(?:ing|ant|ancy)\b/g, /\brecruit(?:ment|ing)\b/g, /\bfinancial (?:services|advice)\b/g,
    /\bcoach(?:ing)?\b/g,
    /\bberatung\b/g, /\bconseil\b/g, /\bconsulenza\b/g, /\badvies\b/g,
  ]],
  ['Nonprofit and community', [
    /\bnonprofit\b/g, /\bnon-profit\b/g, /\bcharit(?:y|able)\b/g, /\bfoundation\b/g,
    /\bcommunity organisation\b/g, /\bngo\b/g, /\bdonat(?:e|ion)\b/g,
    /\bgemeinnützig\b/g, /\bassociazione\b/g, /\bassociation caritative\b/g,
  ]],
  ['Arts and culture', [
    /\bmuseum\b/g, /\bgallery\b/g, /\btheatre\b/g, /\btheater\b/g, /\borchestra\b/g,
    /\bcultural\b/g, /\barts? centre\b/g, /\bexhibition\b/g,
    /\bkunst\b/g, /\bcultura\b/g, /\bmusée\b/g, /\bmuseo\b/g,
  ]],
  ['Retail and ecommerce', [
    /\bonline store\b/g, /\bonline shop\b/g, /\bshop online\b/g, /\bretailer\b/g,
    /\bworldwide shipping\b/g, /\bfree shipping\b/g, /\badd to cart\b/g,
    /\bwebshop\b/g, /\bboutique en ligne\b/g, /\btienda online\b/g, /\bonlineshop\b/g,
  ]],
];

const BUSINESS_MODEL_RULES = [
  ['Ecommerce', [/\bshop\b/g, /\bstore\b/g, /\bshipping\b/g, /\badd to cart\b/g, /\bcollection(?:s)?\b/g, /\bwebshop\b/g, /\bonlineshop\b/g, /\btienda online\b/g, /\bboutique en ligne\b/g]],
  ['Agency or consultancy', [/\bagency\b/g, /\bconsult(?:ing|ancy|ant)\b/g, /\bwe help\b/g, /\bfor clients\b/g, /\bagentur\b/g, /\bagence\b/g, /\bagenzia\b/g, /\bberatung\b/g, /\bconseil\b/g]],
  ['Appointments or bookings', [/\bbook (?:now|online|a |your )/g, /\breservation(?:s)?\b/g, /\bappointment(?:s)?\b/g, /\bréservez\b/g, /\bbuchen\b/g, /\bprenota\b/g]],
  ['Hospitality or travel bookings', [/\bhotel\b/g, /\bresort\b/g, /\baccommodation\b/g, /\btour(?:s)?\b/g]],
  ['Courses or membership', [/\bcourse(?:s)?\b/g, /\bmembership\b/g, /\bsubscribe\b/g, /\bacademy\b/g]],
  ['Nonprofit or fundraising', [/\bdonate\b/g, /\bcharity\b/g, /\bnonprofit\b/g, /\bnon-profit\b/g]],
  ['Portfolio or studio', [/\bportfolio\b/g, /\bstudio\b/g, /\bselected work\b/g, /\bour work\b/g]],
  ['Publisher or media', [/\bmagazine\b/g, /\bpublication\b/g, /\bnewsletter\b/g, /\bjournal\b/g]],
  ['Software or subscription', [/\bsoftware\b/g, /\bsaas\b/g, /\bfree trial\b/g, /\bsubscription\b/g]],
  ['Professional services', [/\bservices\b/g, /\bpractice\b/g, /\bfirm\b/g, /\bsolutions\b/g]],
];

function normaliseText(values) {
  return values.flat().filter(Boolean).join(' ').replace(/\s+/g, ' ').toLowerCase().slice(0, 50_000);
}

function rankRules(text, rules) {
  return rules.map(([label, patterns], ordinal) => {
    const matched = [];
    let score = 0;
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      const matches = [...text.matchAll(pattern)];
      if (!matches.length) continue;
      score += Math.min(3, matches.length);
      matched.push(pattern.source);
    }
    return { label, score, matched, ordinal };
  }).filter(({ score }) => score > 0).sort((left, right) => right.score - left.score || left.ordinal - right.ordinal);
}

export function detectSiteState({ html = '', finalUrl = '', technologies = [] } = {}) {
  const technologyNames = new Set(technologies.map(({ name }) => name));
  if (technologyNames.has('HugeDomains')) return { state: 'parked', provider: 'HugeDomains', evidence: ['technology:HugeDomains'] };
  try {
    const host = new URL(finalUrl).hostname.toLowerCase().replace(/^www\./, '');
    for (const [parkingHost, provider] of PARKING_HOSTS) {
      if (host === parkingHost || host.endsWith(`.${parkingHost}`)) {
        return { state: 'parked', provider, evidence: [`redirect-host:${parkingHost}`] };
      }
    }
  } catch {
    // Marker-based detection below still works when the retained URL is invalid.
  }
  const haystack = `${finalUrl} ${html.slice(0, 100_000)}`;
  for (const [provider, pattern] of PARKING_RULES) {
    if (pattern.test(haystack)) return { state: 'parked', provider, evidence: [`marker:${provider}`] };
  }
  return { state: 'customer_site', provider: '', evidence: [] };
}

function consentUseCase(technologyNames, categories, businessModel) {
  const cases = [];
  if (categories.has('Advertising') || categories.has('Advertising/social')) cases.push('advertising pixels');
  if ([...categories].some((value) => value.startsWith('Analytics') || value === 'Tag management')) cases.push('analytics');
  if (categories.has('Media/embed') || categories.has('Maps') || categories.has('Social/embed')) cases.push('embedded media');
  if (categories.has('Scheduling/forms') || categories.has('Security')) cases.push('forms and anti-spam');
  if (businessModel === 'Ecommerce' || categories.has('Site platform/commerce') || categories.has('Ecommerce apps')) cases.push('ecommerce personalisation');
  if (technologyNames.has('HubSpot') || technologyNames.has('Klaviyo') || categories.has('CRM/marketing')) cases.push('marketing automation');
  if (!cases.length) return 'Basic consent only';
  return [...new Set(cases)].slice(0, 3).join(', ');
}

export function classifySite({
  title = '', metaDescription = '', siteName = '', whatTheyDo = '', aboutText = '',
  productsServices = [], technologies = [], detectedPlatform = '', siteState = 'customer_site',
} = {}) {
  if (siteState === 'parked') {
    return {
      sector: 'Parked domain', businessModel: 'No current customer business',
      consentUseCase: 'Not attributable to customer', peerGroup: 'Parked domain',
      confidence: 100, evidence: ['site_state:parked'],
    };
  }
  const technologyNames = new Set(technologies.map(({ name }) => name));
  const categories = new Set(technologies.map(({ category }) => category));
  const text = normaliseText([title, metaDescription, siteName, whatTheyDo, aboutText, productsServices]);
  const sectors = rankRules(text, SECTOR_RULES);
  const models = rankRules(text, BUSINESS_MODEL_RULES);
  if (technologyNames.has('Shopify') || categories.has('Payments/commerce')) {
    const ecommerce = models.find(({ label }) => label === 'Ecommerce');
    if (ecommerce) ecommerce.score += 4;
    else models.unshift({ label: 'Ecommerce', score: 4, matched: ['technology:commerce'], ordinal: -1 });
    models.sort((left, right) => right.score - left.score || left.ordinal - right.ordinal);
  }
  if ([...categories].some((value) => value.startsWith('Scheduling/booking'))) {
    models.unshift({ label: 'Appointments or bookings', score: 5, matched: ['technology:booking'], ordinal: -1 });
    models.sort((left, right) => right.score - left.score || left.ordinal - right.ordinal);
  }
  let sector = sectors[0]?.label ?? 'Unclassified';
  const businessModel = models[0]?.label ?? 'Unclassified';
  if (sector === 'Unclassified' && businessModel === 'Ecommerce') sector = 'Retail and ecommerce';
  const confidence = sectors[0]
    ? Math.min(95, 45 + (sectors[0].score * 10) + Math.max(0, sectors[0].score - (sectors[1]?.score ?? 0)) * 5)
    : (businessModel !== 'Unclassified' ? 45 : 0);
  const peerGroup = sector === 'Unclassified'
    ? businessModel
    : `${sector} · ${businessModel}`;
  return {
    sector,
    businessModel,
    consentUseCase: consentUseCase(technologyNames, categories, businessModel),
    peerGroup,
    confidence,
    evidence: [
      ...(sectors[0] ? [`sector:${sectors[0].matched.join('|')}`] : []),
      ...(models[0] ? [`model:${models[0].matched.join('|')}`] : []),
      ...(detectedPlatform ? [`platform:${detectedPlatform}`] : []),
    ],
  };
}
