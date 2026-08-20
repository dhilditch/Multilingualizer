import * as cheerio from 'cheerio';

const RESOURCE_RULES = [
  ['Multilingualizer', 'Translation/localisation', /(?:^|\.)multilingualizer\.com$/i],
  ['Weglot', 'Translation/localisation', /(?:^|\.)weglot\.com$/i],
  ['GTranslate', 'Translation/localisation', /(?:^|\.)gtranslate\.(?:net|io)$/i],
  ['ConveyThis', 'Translation/localisation', /(?:^|\.)conveythis\.com$/i],
  ['Linguise', 'Translation/localisation', /(?:^|\.)linguise\.com$/i],
  ['Bablic', 'Translation/localisation', /(?:^|\.)bablic\.com$/i],
  ['Localize', 'Translation/localisation', /(?:^|\.)(?:localizecdn\.com|localizejs\.com)$/i],
  ['LangShop', 'Translation/localisation', /(?:^|\.)langshop\.app$/i],
  ['Google Translate widget', 'Translation/localisation', /(?:^|\.)translate\.google\.com$/i],
  ['Squarespace', 'Site platform', /(?:^|\.)(?:squarespace\.com|sqspcdn\.com|squarewebsites\.org)$/i],
  ['Shopify', 'Site platform/commerce', /(?:^|\.)(?:shopify\.com|shop\.app)$/i],
  ['Webflow', 'Site platform', /(?:^|\.)(?:website-files\.com|webflow\.com|d3e54v103j8qbb\.cloudfront\.net)$/i],
  ['Wix', 'Site platform', /(?:^|\.)(?:wixstatic\.com|parastorage\.com)$/i],
  ['Zoho Sites', 'Site platform', /(?:^|\.)(?:zohocdn\.com|zohostratus\.(?:com|eu)|nimbuspop\.com)$/i],
  ['GoDaddy Website Builder', 'Site platform', /(?:^|\.)wsimg\.com$/i],
  ['Super', 'Site platform', /(?:^|\.)super\.so$/i],
  ['Framer', 'Site platform', /(?:^|\.)(?:framer\.com|framerusercontent\.com)$/i],
  ['Tilda', 'Site platform', /(?:^|\.)tildacdn\.com$/i],
  ['Cargo', 'Site platform', /(?:^|\.)cargo\.site$/i],
  ['Format', 'Site platform', /(?:^|\.)format(?:-assets)?\.com$/i],
  ['Weebly', 'Site platform', /(?:^|\.)editmysite\.com$/i],
  ['Quickbutik', 'Site platform/commerce', /(?:^|\.)quickbutik\.com$/i],
  ['HugeDomains', 'Domain parking', /(?:^|\.)hugedomains\.com$/i],
  ['Google Tag Manager', 'Analytics/tag management', /(?:^|\.)googletagmanager\.com$/i, /\/gtm\.js(?:[?#]|$)/i],
  ['Google Analytics', 'Analytics/tag management', /(?:^|\.)googletagmanager\.com$/i, /\/gtag\/js(?:[?#]|$)/i],
  ['Google Analytics', 'Analytics/tag management', /(?:^|\.)google-analytics\.com$/i],
  ['Microsoft Clarity', 'Analytics', /(?:^|\.)clarity\.ms$/i],
  ['Hotjar', 'Analytics', /(?:^|\.)hotjar\.com$/i],
  ['Plausible', 'Analytics', /(?:^|\.)plausible\.io$/i],
  ['Fathom Analytics', 'Analytics', /(?:^|\.)usefathom\.com$/i],
  ['Cloudflare Web Analytics', 'Analytics', /(?:^|\.)cloudflareinsights\.com$/i],
  ['Ahrefs Web Analytics', 'Analytics', /(?:^|\.)analytics\.ahrefs\.com$/i],
  ['Matomo', 'Analytics', /(?:^|\.)matomo\.cloud$/i],
  ['Mixpanel', 'Analytics', /(?:^|\.)mixpanel\.com$/i],
  ['Amplitude', 'Analytics', /(?:^|\.)amplitude\.com$/i],
  ['FullStory', 'Analytics', /(?:^|\.)fullstory\.com$/i],
  ['Crazy Egg', 'Analytics', /(?:^|\.)crazyegg\.com$/i],
  ['Google Optimize', 'Analytics/testing', /(?:^|\.)googleoptimize\.com$/i],
  ['Sentry', 'Error monitoring', /(?:^|\.)sentry-cdn\.com$/i],
  ['HubSpot', 'CRM/marketing', /(?:^|\.)hs-(?:scripts|forms|analytics)\.com$/i],
  ['HubSpot', 'CRM/marketing', /(?:^|\.)hsforms\.net$/i],
  ['Klaviyo', 'CRM/marketing', /(?:^|\.)klaviyo\.com$/i],
  ['Mailchimp', 'CRM/marketing', /(?:^|\.)(?:mailchimp\.com|list-manage\.com)$/i],
  ['MailerLite', 'CRM/marketing', /(?:^|\.)(?:mailerlite\.com|mlcdn\.com)$/i],
  ['Mailjet', 'CRM/marketing', /(?:^|\.)(?:mailjet\.com|mjt\.lu)$/i],
  ['Zoho Campaigns', 'CRM/marketing', /(?:^|\.)campaigns\.zoho\.(?:com|eu)$/i],
  ['Pipedrive', 'CRM/marketing', /(?:^|\.)pipedrive\.com$/i],
  ['RevenueHunt', 'CRM/marketing', /(?:^|\.)revenuehunt\.com$/i],
  ['Affiliatly', 'Affiliate marketing', /(?:^|\.)affiliatly\.com$/i],
  ['ActiveCampaign', 'CRM/marketing', /(?:^|\.)activehosted\.com$/i],
  ['Zoho PageSense', 'Analytics/testing', /(?:^|\.)pagesense\.io$/i],
  ['Meta Pixel/Facebook SDK', 'Advertising/social', /(?:^|\.)facebook\.net$/i],
  ['Google AdSense/Ads', 'Advertising', /(?:^|\.)googlesyndication\.com$/i],
  ['Google Ads', 'Advertising', /(?:^|\.)googleadservices\.com$/i],
  ['LinkedIn', 'Advertising/social', /(?:^|\.)linkedin\.com$/i],
  ['Pinterest', 'Advertising/social', /(?:^|\.)pinterest\.com$/i],
  ['X/Twitter widgets', 'Social/embed', /(?:^|\.)twitter\.com$/i],
  ['Intercom', 'Support/chat', /(?:^|\.)intercomcdn\.com$/i],
  ['Crisp', 'Support/chat', /(?:^|\.)crisp\.chat$/i],
  ['Tidio', 'Support/chat', /(?:^|\.)tidio\.co$/i],
  ['Zendesk', 'Support/chat', /(?:^|\.)zdassets\.com$/i],
  ['Hej chat', 'Support/chat', /(?:^|\.)hej\.chat$/i],
  ['Gorgias', 'Support/chat', /(?:^|\.)gorgias\.(?:chat|help)$/i],
  ['Re:amaze', 'Support/chat', /(?:^|\.)reamaze\.com$/i],
  ['Landbot', 'Support/chat', /(?:^|\.)landbot\.io$/i],
  ['Chaty', 'Support/chat', /(?:^|\.)chaty\.app$/i],
  ['Smartarget', 'Support/chat', /(?:^|\.)smartarget\.online$/i],
  ['Calendly', 'Scheduling/forms', /(?:^|\.)calendly\.com$/i],
  ['Acuity Scheduling', 'Scheduling/forms', /(?:^|\.)acuityscheduling\.com$/i],
  ['Typeform', 'Scheduling/forms', /(?:^|\.)typeform\.com$/i],
  ['Jotform', 'Scheduling/forms', /(?:^|\.)jotform\.com$/i],
  ['Heyflow', 'Scheduling/forms', /(?:^|\.)heyflow\.(?:app|com)$/i],
  ['Mindbody', 'Scheduling/booking', /(?:^|\.)mindbodyonline\.com$/i],
  ['FareHarbor', 'Scheduling/booking', /(?:^|\.)fareharbor\.com$/i],
  ['OpenTable', 'Scheduling/booking', /(?:^|\.)opentable\.(?:com|ca)$/i],
  ['Beds24', 'Scheduling/booking', /(?:^|\.)beds24\.com$/i],
  ['BookVisit', 'Scheduling/booking', /(?:^|\.)bookvisit\.com$/i],
  ['Rezdy', 'Scheduling/booking', /(?:^|\.)rezdy\.com$/i],
  ['Eversports', 'Scheduling/booking', /(?:^|\.)eversports\.io$/i],
  ['Cloudbeds', 'Scheduling/booking', /(?:^|\.)cloudbeds\.com$/i],
  ['Stripe', 'Payments/commerce', /(?:^|\.)stripe\.com$/i],
  ['FoxyCart', 'Payments/commerce', /(?:^|\.)foxycart\.com$/i],
  ['Ecwid', 'Payments/commerce', /(?:^|\.)ecwid\.com$/i],
  ['Flywire', 'Payments/commerce', /(?:^|\.)flywire\.com$/i],
  ['CookieYes', 'Consent/privacy', /(?:^|\.)(?:cookieyes\.com|cdn-cookieyes\.com)$/i],
  ['Cookiebot', 'Consent/privacy', /(?:^|\.)cookiebot\.com$/i],
  ['iubenda', 'Consent/privacy', /(?:^|\.)iubenda\.com$/i],
  ['Usercentrics', 'Consent/privacy', /(?:^|\.)usercentrics\.eu$/i],
  ['CCM19', 'Consent/privacy', /(?:^|\.)ccm19\.de$/i],
  ['Cookie Script', 'Consent/privacy', /(?:^|\.)cookie-script\.com$/i],
  ['OneTrust', 'Consent/privacy', /(?:^|\.)cookielaw\.org$/i],
  ['Termly', 'Consent/privacy', /(?:^|\.)termly\.io$/i],
  ['ConsentManager', 'Consent/privacy', /(?:^|\.)consentmanager\.net$/i],
  ['Gatekeeper Consent', 'Consent/privacy', /(?:^|\.)gatekeeperconsent\.com$/i],
  ['Consent Framework', 'Consent/privacy', /(?:^|\.)consentframework\.com$/i],
  ['Google reCAPTCHA', 'Security', /(?:^|\.)google\.com$/i, /\/recaptcha\//i],
  ['Cloudflare Turnstile', 'Security', /(?:^|\.)challenges\.cloudflare\.com$/i],
  ['Google Maps', 'Maps', /(?:^|\.)maps\.googleapis\.com$/i],
  ['Google Maps', 'Maps', /(?:^|\.)maps\.google\.com$/i],
  ['Mapbox', 'Maps', /(?:^|\.)mapbox\.com$/i],
  ['Vimeo', 'Media/embed', /(?:^|\.)vimeo\.com$/i],
  ['YouTube', 'Media/embed', /(?:^|\.)(?:youtube\.com|youtube-nocookie\.com)$/i],
  ['Wistia', 'Media/embed', /(?:^|\.)wistia\.com$/i],
  ['SoundCloud', 'Media/embed', /(?:^|\.)soundcloud\.com$/i],
  ['Spotify', 'Media/embed', /(?:^|\.)spotify\.com$/i],
  ['Elfsight', 'Widgets', /(?:^|\.)elfsight(?:cdn)?\.com$/i],
  ['POWR', 'Widgets', /(?:^|\.)powr\.io$/i],
  ['Spark Plugin', 'Widgets', /(?:^|\.)sparkplugin\.com$/i],
  ['Ghost Plugins', 'Widgets', /(?:^|\.)ghostplugins\.dev$/i],
  ['SociableKIT', 'Widgets', /(?:^|\.)sociablekit\.com$/i],
  ['AddToAny', 'Social/share widgets', /(?:^|\.)addtoany\.com$/i],
  ['Embedly', 'Media/embed', /(?:^|\.)embedly\.com$/i],
  ['CodePen', 'Media/embed', /(?:^|\.)codepen\.io$/i],
  ['Zoho Forms', 'Scheduling/forms', /(?:^|\.)zohopublic\.(?:com|eu)$/i],
  ['Privado', 'Consent/privacy', /(?:^|\.)privado\.ai$/i],
  ['Zepto Apps', 'Ecommerce apps', /(?:^|\.)zeptoapps\.com$/i],
  ['Trustindex', 'Reviews/widgets', /(?:^|\.)trustindex\.io$/i],
  ['Reviews.io', 'Reviews/widgets', /(?:^|\.)reviews\.io$/i],
  ['Trustpilot', 'Reviews/widgets', /(?:^|\.)trustpilot\.com$/i],
  ['Klantenvertellen', 'Reviews/widgets', /(?:^|\.)klantenvertellen\.nl$/i],
  ['Givebutter', 'Fundraising', /(?:^|\.)givebutter\.com$/i],
  ['Donorbox', 'Fundraising', /(?:^|\.)donorbox\.org$/i],
  ['AddEvent', 'Events/calendar', /(?:^|\.)addevent\.com$/i],
  ['Sesamy', 'Membership/commerce', /(?:^|\.)sesamy\.com$/i],
  ['Substack', 'Publishing/newsletter', /(?:^|\.)substack\.com$/i],
  ['Canva', 'Media/embed', /(?:^|\.)canva\.com$/i],
  ['Ezoic', 'Advertising/optimisation', /(?:^|\.)(?:ezojs\.com|ezoicanalytics\.com)$/i],
  ['OptiMonk', 'Marketing/optimisation', /(?:^|\.)optimonk\.com$/i],
  ['Poptin', 'Marketing/optimisation', /(?:^|\.)popt\.in$/i],
  ['Klevu', 'Search/personalisation', /(?:^|\.)klevu\.com$/i],
  ['Fast Simon', 'Search/personalisation', /(?:^|\.)fastsimon\.com$/i],
  ['Bazaarvoice', 'Reviews/widgets', /(?:^|\.)bazaarvoice\.com$/i],
  ['Shareaholic', 'Social/share widgets', /(?:^|\.)shareaholic\.com$/i],
  ['ShareThis', 'Social/share widgets', /(?:^|\.)sharethis\.com$/i],
  ['AddThis', 'Social/share widgets', /(?:^|\.)addthis\.com$/i],
  ['Website Speedy', 'Performance', /(?:^|\.)b-cdn\.net$/i, /websitespeedy|wix-websitespeedy/i],
  ['n8n', 'Automation', /(?:^|\.)n8n\.[a-z0-9.-]+$/i],
  ['Adobe Fonts', 'Fonts', /(?:^|\.)typekit\.(?:net|com)$/i],
  ['Font Awesome', 'Fonts/icons', /(?:^|\.)fontawesome\.com$/i],
  ['Google Hosted Libraries', 'Development/CDN', /(?:^|\.)ajax\.googleapis\.com$/i],
  ['jsDelivr', 'Development/CDN', /(?:^|\.)jsdelivr\.net$/i],
  ['cdnjs', 'Development/CDN', /(?:^|\.)cdnjs\.cloudflare\.com$/i],
  ['unpkg', 'Development/CDN', /(?:^|\.)unpkg\.com$/i],
  ['jQuery CDN', 'Development/CDN', /(?:^|\.)jquery\.com$/i],
  ['Adobe Launch', 'Tag management', /(?:^|\.)adobedtm\.com$/i],
  ['Jetpack', 'WordPress service', /(?:^|\.)wp\.com$/i],
];

const INLINE_RULES = [
  ['Multilingualizer', 'Translation/localisation', 'multilingualizer-inline', /changeLanguageAndMove\s*\(/i],
  ['Microsoft Clarity', 'Analytics', 'clarity-inline', /\bclarity\s*\(\s*["'](?:set|event|consent|identify)/i],
  ['Hotjar', 'Analytics', 'hotjar-inline', /\b_hjSettings\s*=|\bhj\s*\(\s*["']/i],
  ['Meta Pixel/Facebook SDK', 'Advertising/social', 'meta-pixel-inline', /\bfbq\s*\(\s*["'](?:init|track)/i],
  ['HubSpot', 'CRM/marketing', 'hubspot-inline', /\b_hsq\s*=|\bhbspt\.forms\.create\s*\(/i],
  ['Intercom', 'Support/chat', 'intercom-inline', /\bIntercom\s*\(\s*["'](?:boot|update|show)/i],
  ['Crisp', 'Support/chat', 'crisp-inline', /\bCRISP_WEBSITE_ID\b|\b\$crisp\s*=/i],
  ['Tidio', 'Support/chat', 'tidio-inline', /\btidioChatApi\b/i],
  ['Google Analytics', 'Analytics/tag management', 'gtag-inline', /\bgtag\s*\(\s*["']config["']/i],
  ['Google Tag Manager', 'Analytics/tag management', 'data-layer-inline', /googletagmanager\.com\/gtm\.js/i],
];

function cleanHost(hostname) {
  return hostname.toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
}

function isSameSite(host, sourceHost) {
  const left = cleanHost(host);
  const right = cleanHost(sourceHost);
  return left === right || left.endsWith(`.${right}`) || right.endsWith(`.${left}`);
}

function classifyResource(host, resourceUrl) {
  for (const [name, category, hostPattern, urlPattern] of RESOURCE_RULES) {
    if (hostPattern.test(host) && (!urlPattern || urlPattern.test(resourceUrl))) return { name, category, confidence: 98 };
  }
  return { name: host, category: 'Unclassified third-party', confidence: 70 };
}

export function detectTechnologies(html, sourceUrl, pageKind = 'home') {
  const $ = cheerio.load(html);
  const sourceHost = cleanHost(new URL(sourceUrl).hostname);
  const found = new Map();
  const add = (technology) => {
    const key = `${technology.name}:${technology.host}:${technology.evidenceType}`;
    if (!found.has(key)) found.set(key, technology);
  };

  const resources = [
    ['script[src]', 'src', 'external-script'],
    ['iframe[src]', 'src', 'external-iframe'],
  ];
  for (const [selector, attribute, evidenceType] of resources) {
    $(selector).each((_, element) => {
      const raw = $(element).attr(attribute);
      if (!raw) return;
      let url;
      try { url = new URL(raw, sourceUrl); } catch { return; }
      if (!['http:', 'https:'].includes(url.protocol)) return;
      const host = cleanHost(url.hostname);
      if (!host || isSameSite(host, sourceHost)) return;
      const classification = classifyResource(host, url.href);
      add({
        ...classification,
        host,
        evidenceType,
        evidenceValue: url.href.slice(0, 2000),
        sourceUrl,
        pageKind,
      });
    });
  }

  for (const [name, category, marker, pattern] of INLINE_RULES) {
    if (!pattern.test(html)) continue;
    add({ name, category, host: '', evidenceType: 'inline-marker', evidenceValue: marker, sourceUrl, pageKind, confidence: 90 });
  }
  return [...found.values()].sort((left, right) => left.name.localeCompare(right.name) || left.host.localeCompare(right.host));
}
