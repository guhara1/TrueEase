'use strict';

const { SITE, PRICING } = require('../config');

/* ------------------------------ helpers ------------------------------ */
const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const jsonld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj, null, 0)}</script>`;

const abs = (path) => SITE.origin.replace(/\/$/, '') + path;

/* --------------------------- global schema --------------------------- */
function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.brand,
    url: SITE.origin,
    telephone: SITE.phone,
    logo: abs('/assets/img/og-default.svg'),
    image: abs('/assets/img/og-default.svg'),
    sameAs: [SITE.telegram.reserve],
    description: '제주도 출장마사지·홈타이 생활권별 방문 가능 지역 안내',
  };
}

function webPageSchema(page) {
  const s = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.desc,
    url: abs(page.url),
    inLanguage: 'ko-KR',
    isPartOf: { '@type': 'WebSite', name: SITE.brand, url: SITE.origin },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: abs(page.image),
      caption: page.imageAlt || page.title,
    },
    author: { '@type': 'Organization', name: SITE.editorial.author },
    reviewedBy: { '@type': 'Person', name: SITE.editorial.reviewer },
    dateModified: SITE.editorial.updated,
  };
  return s;
}

function breadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.url),
    })),
  };
}

function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/* ------------------------------ head --------------------------------- */
function head(page) {
  const canonical = abs(page.url);
  const robots = page.noindex ? 'noindex, follow' : 'index, follow';
  const schemas = [organizationSchema(), webPageSchema(page)];
  if (page.crumbs && page.crumbs.length) schemas.push(breadcrumbSchema(page.crumbs));
  if (page.faqs && page.faqs.length) schemas.push(faqSchema(page.faqs));
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.desc)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.brand)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs(page.image)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.desc)}">
<meta name="twitter:image" content="${abs(page.image)}">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/components.css">
${schemas.map(jsonld).join('\n')}
</head>
<body>
<a class="skip-link" href="#main">본문 바로가기</a>`;
}

/* ----------------------------- header -------------------------------- */
const NAV = [
  ['/jeju/', '제주 홈'],
  ['/jeju/jeju-si/', '제주시'],
  ['/jeju/seogwipo-si/', '서귀포시'],
  ['/jeju/life/', '생활권'],
  ['/jeju/use/', '이용 장소'],
  ['/jeju/check/', '예약 전 확인'],
  ['/jeju/contact/', '문의하기'],
];

function header() {
  return `<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/jeju/">간다<span class="go">GO</span> <small>제주 출장마사지 지역 안내</small></a>
    <nav class="nav" aria-label="주요 메뉴">
      ${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('\n      ')}
    </nav>
    <a class="header-phone" href="${SITE.phoneHref}">전화예약 ${SITE.phone}</a>
  </div>
</header>`;
}

/* ---------------------------- breadcrumb ----------------------------- */
function breadcrumbHtml(crumbs) {
  if (!crumbs || !crumbs.length) return '';
  return `<div class="wrap"><nav class="crumbs" aria-label="위치"><ol>
    ${crumbs.map((c, i) =>
      i === crumbs.length - 1
        ? `<li aria-current="page">${esc(c.name)}</li>`
        : `<li><a href="${c.url}">${esc(c.name)}</a></li>`
    ).join('\n    ')}
  </ol></nav></div>`;
}

/* ------------------------- pricing (all pages) ----------------------- */
function pricingHtml() {
  return `<section class="pricing" aria-labelledby="pricing-h">
  <div class="wrap">
    <div class="head">
      <h2 id="pricing-h">${esc(PRICING.heading)}</h2>
      <p>${esc(PRICING.sub)}</p>
    </div>
    <div class="price-grid">
      ${PRICING.courses.map((c) => `<div class="price-card${c.featured ? ' featured' : ''}">
        ${c.badge ? `<span class="price-badge">${esc(c.badge)}</span>` : ''}
        <div class="name">${esc(c.name)}</div>
        <div class="price">${esc(c.price)}<span class="unit">${esc(c.unit)}</span></div>
        <div class="duration">${esc(c.duration)}</div>
        <div class="desc">${esc(c.desc)}</div>
        <a class="btn ${c.featured ? 'btn-orange' : 'btn-ghost'} btn-block" href="${SITE.telegram.reserve}" target="_blank" rel="noopener nofollow">예약 문의</a>
      </div>`).join('\n      ')}
    </div>
    <p class="foot">${esc(PRICING.note)} <a href="${PRICING.detailHref}">${esc(PRICING.detailLabel)} →</a></p>
  </div>
</section>`;
}

/* ------------------------------ footer ------------------------------- */
function footer() {
  return `${pricingHtml()}
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-cta">
      <h2>웹사이트 제작·제휴가 필요하신가요?</h2>
      <p>지역 안내 사이트 제작과 제휴 문의는 텔레그램으로 편하게 남겨주세요. 빠르게 안내해 드립니다.</p>
      <div class="footer-btns">
        <a class="btn btn-orange" href="${SITE.telegram.build}" target="_blank" rel="noopener nofollow">웹사이트 제작문의</a>
        <a class="btn btn-orange" href="${SITE.telegram.partner}" target="_blank" rel="noopener nofollow">제휴문의</a>
      </div>
    </div>

    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/jeju/">간다<span class="go">GO</span></a>
        <p class="biz-line">상호 <b>${esc(SITE.brand)}</b></p>
        <p class="biz-line">전화예약 <b><a href="${SITE.phoneHref}" style="color:#fff">${esc(SITE.phone)}</a></b></p>
        <p>제주도 출장마사지·홈타이 생활권별 방문 가능 지역 안내</p>
      </div>
      <div class="footer-col">
        <h4>지역 안내</h4>
        <ul>
          <li><a href="/jeju/jeju-si/">제주시 안내</a></li>
          <li><a href="/jeju/seogwipo-si/">서귀포시 안내</a></li>
          <li><a href="/jeju/life/">주요 생활권</a></li>
          <li><a href="/jeju/use/">이용 장소</a></li>
          <li><a href="/jeju/check/">예약 전 확인</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>운영 기준</h4>
        <ul>
          <li><a href="/jeju/privacy-policy/">개인정보 처리방침</a></li>
          <li><a href="/jeju/illegal-service-notice/">불법·선정적 서비스 불가 안내</a></li>
          <li><a href="/jeju/content-policy/">콘텐츠 작성 기준</a></li>
          <li><a href="/jeju/authors/">작성자·검수자 안내</a></li>
          <li><a href="/jeju/contact/">문의하기</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2026 ${esc(SITE.brand)}. All rights reserved.</span>
      <span class="footer-disclaimer">본 사이트는 지역·숙소·예약 전 확인사항을 안내하는 지역 안내 사이트이며, 불법·선정적 서비스는 제공하거나 안내하지 않습니다.</span>
    </div>
  </div>
</footer>
</body>
</html>`;
}

/* ------------------------- layout composer --------------------------- */
function layout(page, mainHtml) {
  return [
    head(page),
    header(),
    breadcrumbHtml(page.crumbs),
    `<main id="main">`,
    mainHtml,
    `</main>`,
    footer(),
  ].join('\n');
}

module.exports = {
  esc, abs, layout, header, footer, pricingHtml, breadcrumbHtml,
  NAV,
};
