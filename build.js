'use strict';

/*
 * 간다GO · 정적 사이트 생성기 (무의존성 Node)
 * 실행: node build.js  →  public/ 에 모든 페이지 생성
 */

const fs = require('fs');
const path = require('path');

const { SITE } = require('./src/config');
const R = require('./src/templates/render');
const C = require('./src/templates/content');
const life = require('./src/data/life');
const { jejuSi, seogwipoSi } = require('./src/data/dong');
const { use, check, policy } = require('./src/data/pages');

const OUT = path.join(__dirname, 'public');
const CITY_LABEL = { 'jeju-si': '제주시', 'seogwipo-si': '서귀포시' };
const HOME = { name: '제주 홈', url: '/' };

/* --------------------------- fs helpers ------------------------------ */
function write(urlPath, html) {
  const rel = urlPath.endsWith('/') ? urlPath + 'index.html' : urlPath;
  const full = path.join(OUT, rel.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
  urls.push(urlPath);
}
const urls = [];

/* --------------------------- 이미지(SVG) ----------------------------- */
function svg(title, sub) {
  const t = title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const s = (sub || '간다GO 제주 지역 안내').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0e5a50"/><stop offset="0.6" stop-color="#0a423b"/><stop offset="1" stop-color="#08322c"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#c6a15b" stop-opacity="0"/><stop offset="0.5" stop-color="#c6a15b" stop-opacity="0.5"/><stop offset="1" stop-color="#c6a15b" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect y="300" width="1200" height="4" fill="url(#gold)"/>
  <text x="80" y="300" fill="#ffffff" font-family="Pretendard, sans-serif" font-size="70" font-weight="800">${t}</text>
  <text x="80" y="370" fill="#cfe3de" font-family="Pretendard, sans-serif" font-size="34" font-weight="500">${s}</text>
  <text x="80" y="560" fill="#c6a15b" font-family="Pretendard, sans-serif" font-size="30" font-weight="700">간다GO · 제주 출장마사지 지역 안내</text>
</svg>`;
}
function writeImg(name, title, sub) {
  const p = path.join(OUT, 'assets/img', name);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, svg(title, sub));
  return `/assets/img/${name}`;
}
function copyDir(srcDir, dstDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(dstDir, { recursive: true });
  for (const f of fs.readdirSync(srcDir)) {
    const s = path.join(srcDir, f);
    const d = path.join(dstDir, f);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}
function copyAssets() {
  // 소스 assets/(css·img 등)를 그대로 복사. 사용자가 올린 실제 이미지도 함께 배포됩니다.
  copyDir(path.join(__dirname, 'assets'), path.join(OUT, 'assets'));
}

/* ------------------------------ 메인 -------------------------------- */
function buildMain() {
  const img = writeImg('og-default.svg', '제주도 출장마사지', '생활권별 방문 가능 지역 안내');
  const lifeCards = (list) => list.map((l) =>
    `<a class="card" href="/jeju/life/${l.slug}/"><h3>${C.esc(l.name)}</h3><p>${C.esc(l.desc)}</p><span class="card-arrow">${C.esc(l.name)} 생활권 보기 →</span></a>`
  ).join('\n      ');
  const jejuLife = life.filter((l) => l.parent === 'jeju-si');
  const seogLife = life.filter((l) => l.parent === 'seogwipo-si');
  const useCards = use.map((u) =>
    `<a class="card" href="/jeju/use/${u.slug}/"><h3>${C.esc(u.name)}</h3><p>${C.esc(u.desc)}</p></a>`
  ).join('\n      ');

  const main = `
  <section class="hero hero-split">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">제주도 출장마사지 · 홈타이</span>
        <h1>제주도 출장마사지 · 생활권별 방문 가능 지역 안내</h1>
        <p>제주시, 서귀포, 제주공항, 연동, 노형, 애월, 중문, 성산, 함덕, 협재 등 주요 생활권과 호텔·리조트·펜션·자택 이용 전 확인사항을 안내합니다.</p>
        <div class="hero-cta">
          <a class="btn btn-orange" href="/jeju/jeju-si/">제주시 보기</a>
          <a class="btn btn-outline-light" href="/jeju/seogwipo-si/">서귀포시 보기</a>
          <a class="btn btn-outline-light" href="/jeju/life/">생활권 보기</a>
          <a class="btn btn-outline-light" href="/jeju/check/">예약 전 확인</a>
        </div>
      </div>
      <div class="hero-media">
        <img src="${SITE.heroImage}" alt="${C.esc(SITE.heroImageAlt)}" width="720" height="560" loading="eager">
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap wrap-narrow">
      <div class="article">
        <h2>제주는 행정구역보다 숙소 위치와 생활권 확인이 먼저입니다</h2>
        <p>제주는 제주시와 서귀포시로 크게 나뉘지만, 실제 이용 기준은 숙소 위치와 이동 동선에 따라 달라집니다.
        제주공항 인근 호텔, 신제주 오피스텔, 애월 펜션, 중문 리조트, 성산 관광 숙소, 협재 해변 숙소는 방문 기준이 서로 다릅니다.
        이 사이트는 <a href="/jeju/jeju-si/">제주시</a>·<a href="/jeju/seogwipo-si/">서귀포시</a>,
        <a href="/jeju/life/">생활권</a>, <a href="/jeju/use/">숙소 형태</a>,
        <a href="/jeju/check/outer-area-fee/">외곽 이동 기준</a>을 함께 안내합니다.</p>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap">
      <span class="eyebrow">제주시</span>
      <h2>제주시 주요 생활권 안내</h2>
      <div class="grid grid-3">
      ${lifeCards(jejuLife)}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <span class="eyebrow">서귀포시</span>
      <h2>서귀포시 주요 생활권 안내</h2>
      <div class="grid grid-3">
      ${lifeCards(seogLife)}
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap">
      <span class="eyebrow">이용 장소</span>
      <h2>이용 장소에 따라 확인할 내용이 다릅니다</h2>
      <div class="grid grid-4">
      ${useCards}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap wrap-narrow">
      <div class="article">
        <h2>예약 전 확인해야 할 내용</h2>
        <ul class="checklist">
          <li>방문 주소를 정확히 확인했나요?</li>
          <li>제주시인지 서귀포시인지 확인했나요?</li>
          <li>가까운 생활권을 확인했나요?</li>
          <li>호텔·리조트·펜션 출입 방식을 확인했나요?</li>
          <li>주차 또는 차량 진입이 가능한 위치인가요?</li>
          <li>야간 방문이 가능한 숙소인가요?</li>
          <li>외곽 이동 기준을 확인했나요?</li>
          <li>예약 가능 시간과 변경 기준을 확인했나요?</li>
          <li>개인정보 처리 기준을 확인했나요?</li>
          <li>불법·선정적 서비스 불가 안내를 확인했나요?</li>
        </ul>
        <p style="margin-top:1.2rem"><a class="btn btn-jade" href="/jeju/check/">예약 전 확인 자세히 보기</a></p>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap wrap-narrow">
      <div class="article">
        ${C.opsBlock}
        ${C.faqHtml(C.regionFaqs('제주도'))}
        ${C.whwBlock('제주도')}
      </div>
    </div>
  </section>`;

  const page = {
    title: '제주도 출장마사지｜제주시·서귀포·애월·중문·성산 홈타이 지역 안내',
    desc: '제주도 출장마사지·홈타이 제주시·서귀포·애월·중문·성산 생활권과 이용 기준 안내',
    url: '/', image: img, imageAlt: '제주도 출장마사지 생활권 안내 이미지',
    crumbs: [HOME], faqs: C.regionFaqs('제주도'),
  };
  write('/', R.layout(page, main));
}

/* ------------------------------ 도시 -------------------------------- */
function buildCity(citySlug) {
  const cityLabel = CITY_LABEL[citySlug];
  const url = `/jeju/${citySlug}/`;
  const dongList = citySlug === 'jeju-si' ? jejuSi : seogwipoSi;
  const lifeList = life.filter((l) => l.parent === citySlug);
  const img = writeImg(`og-${citySlug}.svg`, `${cityLabel} 출장마사지`, `${cityLabel} 생활권별 지역 안내`);

  const h1 = citySlug === 'jeju-si'
    ? '제주시 출장마사지 · 공항·연동·노형 생활권 안내'
    : '서귀포 출장마사지 · 중문·성산·서귀포 도심 생활권 안내';

  const main = `
  <section class="hero"><div class="wrap">
    <span class="eyebrow">${C.esc(cityLabel)}</span>
    <h1>${C.esc(h1)}</h1>
    <p>${C.esc(cityLabel)} 주요 생활권과 핵심 읍·면·동, 숙소 형태별 이용 기준을 안내합니다.</p>
  </div></section>
  <section class="section"><div class="wrap">
    ${C.cityArticle(cityLabel, url, lifeList, dongList)}
  </div></section>`;

  const page = {
    title: `${h1}｜간다GO`,
    desc: citySlug === 'jeju-si'
      ? '제주시 출장마사지 공항·연동·노형·이도·아라 생활권과 이용 기준 안내'
      : '서귀포 출장마사지 중문·성산·표선·대정 생활권과 이용 기준 안내',
    url, image: img, imageAlt: `${cityLabel} 출장마사지 생활권 안내 이미지`,
    crumbs: [HOME, { name: cityLabel, url }], faqs: C.regionFaqs(cityLabel),
  };
  write(url, R.layout(page, main));
}

/* ------------------------------ 생활권 ------------------------------ */
function buildLifeIndex() {
  const img = writeImg('og-life.svg', '제주 주요 생활권', '숙소 위치별 방문 가능 지역');
  const cards = life.map((l) =>
    `<a class="card" href="/jeju/life/${l.slug}/"><h3>${C.esc(l.name)}</h3><p>${C.esc(l.desc)}</p><span class="card-arrow">${C.esc(l.name)} 보기 →</span></a>`
  ).join('\n      ');
  const main = `
  <section class="hero"><div class="wrap">
    <span class="eyebrow">생활권</span>
    <h1>제주 주요 생활권 안내</h1>
    <p>제주는 숙소 위치와 이동 동선에 따라 이용 기준이 달라집니다. 생활권별로 확인 내용을 나눠 안내합니다.</p>
  </div></section>
  <section class="section"><div class="wrap"><div class="grid grid-3">
    ${cards}
  </div></div></section>`;
  const page = {
    title: '제주 생활권 안내｜제주공항·애월·중문·성산 생활권 | 간다GO',
    desc: '제주 출장마사지 생활권 안내 — 공항·연동·애월·중문·성산 등 지역별 이용 기준',
    url: '/jeju/life/', image: img, imageAlt: '제주 주요 생활권 안내 이미지',
    crumbs: [HOME, { name: '생활권', url: '/jeju/life/' }],
  };
  write('/jeju/life/', R.layout(page, main));
}

function buildLife() {
  for (const item of life) {
    const cityLabel = CITY_LABEL[item.parent];
    const cityUrl = `/jeju/${item.parent}/`;
    const url = `/jeju/life/${item.slug}/`;
    const img = writeImg(`og-life-${item.slug}.svg`, item.name, `${item.name} 숙소 생활권 안내`);
    const dongList = item.parent === 'jeju-si' ? jejuSi : seogwipoSi;
    const dongLinks = dongList.filter((d) => d.lifeSlug === item.slug)
      .map((d) => ({ name: d.name, url: `/jeju/${item.parent}/${d.slug}/` }));
    const main = `
    <section class="hero"><div class="wrap">
      <span class="eyebrow">${C.esc(cityLabel)} 생활권</span>
      <h1>${C.esc(item.h1)}</h1>
      <p>${C.esc(item.lead)}</p>
    </div></section>
    <section class="section"><div class="wrap wrap-narrow">
      ${C.lifeArticle(item, { cityLabel, cityUrl, dongLinks })}
    </div></section>`;
    const page = {
      title: `${item.h1}｜간다GO`, desc: item.desc, url, image: img,
      imageAlt: `${item.name} 숙소 생활권 안내 이미지`,
      crumbs: [HOME, { name: cityLabel, url: cityUrl }, { name: item.name, url }],
      faqs: C.regionFaqs(item.name),
    };
    write(url, R.layout(page, main));
  }
}

/* ------------------------------ 읍면동 ------------------------------ */
function buildDong(citySlug) {
  const cityLabel = CITY_LABEL[citySlug];
  const cityUrl = `/jeju/${citySlug}/`;
  const list = citySlug === 'jeju-si' ? jejuSi : seogwipoSi;
  for (const item of list) {
    const url = `/jeju/${citySlug}/${item.slug}/`;
    const lifeItem = life.find((l) => l.slug === item.lifeSlug);
    const lifeName = lifeItem ? lifeItem.name : item.name;
    const lifeUrl = `/jeju/life/${item.lifeSlug}/`;
    const img = writeImg(`og-${citySlug}-${item.slug}.svg`, item.name, item.h1.replace(/^[^·]+·\s*/, ''));
    const noindex = item.slug === 'udo-myeon'; // 도항선 별도 기준 — 무리한 색인 지양
    const main = `
    <section class="hero"><div class="wrap">
      <span class="eyebrow">${C.esc(cityLabel)} · ${C.esc(lifeName)}</span>
      <h1>${C.esc(item.h1)}</h1>
      <p>${C.esc(item.lead)}</p>
    </div></section>
    <section class="section"><div class="wrap wrap-narrow">
      ${C.regionArticle(item, { cityLabel, cityUrl, lifeName, lifeUrl, kind: 'dong' })}
    </div></section>`;
    const page = {
      title: `${item.h1}｜간다GO`, desc: item.desc, url, image: img,
      imageAlt: `${item.name} 지역 안내 이미지`, noindex,
      crumbs: [HOME, { name: cityLabel, url: cityUrl }, { name: item.name, url }],
      faqs: C.regionFaqs(item.name),
    };
    write(url, R.layout(page, main));
  }
}

/* --------------------------- use / check ----------------------------- */
function buildSectionIndex(slug, label, list, intro) {
  const img = writeImg(`og-${slug}.svg`, label, intro);
  const cards = list.map((it) =>
    `<a class="card" href="/jeju/${slug}/${it.slug}/"><h3>${C.esc(it.name)}</h3><p>${C.esc(it.desc)}</p></a>`
  ).join('\n      ');
  const main = `
  <section class="hero"><div class="wrap">
    <span class="eyebrow">${C.esc(label)}</span><h1>${C.esc(label)}</h1><p>${C.esc(intro)}</p>
  </div></section>
  <section class="section"><div class="wrap"><div class="grid grid-3">
    ${cards}
  </div></div></section>`;
  const page = {
    title: `${label}｜간다GO 제주 출장마사지 안내`, desc: intro,
    url: `/jeju/${slug}/`, image: img, imageAlt: `${label} 안내 이미지`,
    crumbs: [HOME, { name: label, url: `/jeju/${slug}/` }],
  };
  write(`/jeju/${slug}/`, R.layout(page, main));
}

function buildUse() {
  buildSectionIndex('use', '이용 장소', use, '호텔·리조트·펜션·자택 등 숙소 형태별 확인 기준을 안내합니다.');
  for (const item of use) {
    const url = `/jeju/use/${item.slug}/`;
    const img = writeImg(`og-use-${item.slug}.svg`, item.name, item.desc);
    const main = `<section class="section"><div class="wrap wrap-narrow"><h1>${C.esc(item.h1)}</h1>${C.usePage(item)}</div></section>`;
    write(url, R.layout({
      title: `${item.h1}｜간다GO`, desc: item.desc, url, image: img,
      imageAlt: `${item.name} 안내 이미지`,
      crumbs: [HOME, { name: '이용 장소', url: '/jeju/use/' }, { name: item.name, url }],
    }, main));
  }
}

function buildCheck() {
  buildSectionIndex('check', '예약 전 확인', check, '방문 주소·숙소 출입·외곽 이동·개인정보 등 예약 전 확인 항목을 안내합니다.');
  for (const item of check) {
    const url = `/jeju/check/${item.slug}/`;
    const img = writeImg(`og-check-${item.slug}.svg`, item.name, item.desc);
    const main = `<section class="section"><div class="wrap wrap-narrow"><h1>${C.esc(item.h1)}</h1>${C.checkPage(item)}</div></section>`;
    write(url, R.layout({
      title: `${item.h1}｜간다GO`, desc: item.desc, url, image: img,
      imageAlt: `${item.name} 안내 이미지`,
      crumbs: [HOME, { name: '예약 전 확인', url: '/jeju/check/' }, { name: item.name, url }],
    }, main));
  }
}

/* ------------------------------ 운영 기준 ---------------------------- */
function buildPolicy() {
  const contactHtml = `
    <h3>전화 예약</h3>
    <p><a class="btn btn-jade" href="${SITE.phoneHref}">전화예약 ${SITE.phone}</a></p>
    <h3>텔레그램 문의</h3>
    <p>
      <a class="btn btn-orange" href="${SITE.telegram.build}" target="_blank" rel="noopener nofollow" style="margin-right:.5rem">웹사이트 제작문의</a>
      <a class="btn btn-orange" href="${SITE.telegram.partner}" target="_blank" rel="noopener nofollow">제휴문의</a>
    </p>`;
  for (const item of policy) {
    const url = `/jeju/${item.slug}/`;
    const img = writeImg(`og-${item.slug}.svg`, item.name, item.desc);
    const main = `<section class="section"><div class="wrap wrap-narrow"><h1>${C.esc(item.h1)}</h1>${C.policyPage(item, contactHtml)}</div></section>`;
    write(url, R.layout({
      title: `${item.h1}｜간다GO`, desc: item.desc, url, image: img,
      imageAlt: `${item.name} 안내 이미지`,
      crumbs: [HOME, { name: item.name, url }],
    }, main));
  }
}

/* ---------------------------- sitemap/robots ------------------------- */
function buildSitemap() {
  const body = urls
    .filter((u) => u.endsWith('/'))
    .map((u) => `  <url><loc>${SITE.origin}${u}</loc><lastmod>${SITE.editorial.updated}</lastmod></url>`)
    .join('\n');
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n${body}\n</urlset>`
      .replace('sitemap.org', 'sitemaps.org'));
  fs.writeFileSync(path.join(OUT, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${SITE.origin}/sitemap.xml\n`);
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
}

/* ------------------------------- run -------------------------------- */
function run() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  copyAssets();
  buildMain();
  buildCity('jeju-si');
  buildCity('seogwipo-si');
  buildLifeIndex();
  buildLife();
  buildDong('jeju-si');
  buildDong('seogwipo-si');
  buildUse();
  buildCheck();
  buildPolicy();
  buildSitemap();
  console.log(`✅ 생성 완료: ${urls.length} 페이지`);
}

run();
