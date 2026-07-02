'use strict';

const { esc } = require('./render');

const CITY_LABEL = { 'jeju-si': '제주시', 'seogwipo-si': '서귀포시' };

/* 좋은 앵커텍스트 기반 내부링크 모음 */
const relatedUseLinks = `
  <ul>
    <li><a href="/jeju/use/hotel/">호텔 이용 시 프런트·객실 출입 확인</a></li>
    <li><a href="/jeju/use/pension/">펜션·독채 숙소 이용 전 확인</a></li>
    <li><a href="/jeju/use/night/">야간 예약 시 출입·이동 기준</a></li>
    <li><a href="/jeju/use/outer-area/">읍면 외곽 지역 이동 기준</a></li>
  </ul>`;

const checkLinks = `
  <ul>
    <li><a href="/jeju/check/address/">방문 주소 정확히 확인하기</a></li>
    <li><a href="/jeju/check/accommodation-access/">숙소 출입 방식 확인</a></li>
    <li><a href="/jeju/check/outer-area-fee/">외곽 이동비 기준 확인</a></li>
    <li><a href="/jeju/check/time/">예약 가능 시간 확인</a></li>
  </ul>`;

const opsBlock = `
  <h2>운영 기준 · 개인정보 · 불법·선정적 서비스 불가 안내</h2>
  <p>간다GO는 관련 법령을 준수하며, 예약 확인과 연락에 필요한 최소한의 정보만 처리합니다. 자세한 내용은
  <a href="/jeju/privacy-policy/">개인정보 처리방침</a>에서 확인할 수 있습니다. 본 사이트는 건전한 관리·릴랙스 목적의
  지역 안내만 제공하며, <a href="/jeju/illegal-service-notice/">불법·선정적 서비스는 제공하거나 안내하지 않습니다</a>.
  허위 후기나 별점, 상위노출 보장 표현은 사용하지 않으며, 모든 콘텐츠는
  <a href="/jeju/content-policy/">콘텐츠 작성 기준</a>에 따라 <a href="/jeju/authors/">편집팀 작성·운영 책임자 검수</a>를 거칩니다.</p>`;

function whwBlock(name) {
  return `
  <h2>Who · How · Why</h2>
  <div class="whw">
    <div class="card"><h3><span>Who</span> · 누가</h3><p>간다GO 편집팀이 ${esc(name)} 지역의 이동·숙소·예약 기준을 정리하고, 운영 책임자가 검수합니다.</p></div>
    <div class="card"><h3><span>How</span> · 어떻게</h3><p>실제 확인 가능한 지역·이동 정보를 기준으로 작성하며, 변경 사항이 확인되면 갱신합니다.</p></div>
    <div class="card"><h3><span>Why</span> · 왜</h3><p>${esc(name)} 방문 전 숙소 위치와 이동 가능 여부를 쉽게 확인하도록 돕기 위해 만들었습니다.</p></div>
  </div>`;
}

function faqHtml(faqs) {
  return `
  <h2>자주 묻는 질문</h2>
  <div class="faq">
    ${faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n    ')}
  </div>`;
}

/* 공통 FAQ (지역 페이지) */
function regionFaqs(name) {
  return [
    { q: `${name} 전 지역 방문이 가능한가요?`, a: '실제 방문 주소, 숙소 위치, 예약 가능 시간, 외곽 이동 기준을 확인한 뒤 안내합니다.' },
    { q: '호텔이나 리조트에서도 이용할 수 있나요?', a: '숙소 정책, 객실 출입 가능 여부, 프런트 확인 방식 등을 먼저 확인해야 합니다.' },
    { q: '펜션이나 독채 숙소도 가능한가요?', a: '주소 확인, 주차 가능 여부, 야간 진입 가능 여부, 외곽 이동 기준을 함께 확인해야 합니다.' },
    { q: '외곽 지역은 추가 이동 기준이 있나요?', a: '이동 거리와 예약 시간에 따라 기준이 달라질 수 있어 상담 시 최종 확인됩니다.' },
    { q: '불법·선정적 서비스도 가능한가요?', a: '불법·선정적 서비스는 제공하거나 안내하지 않습니다.' },
    { q: '개인정보는 어떻게 처리하나요?', a: '예약 확인과 연락에 필요한 최소 정보만 확인하며, 개인정보 처리방침을 따릅니다.' },
  ];
}

/* ------------------- 생활권/읍면동 상세 본문 ------------------------- */
function regionArticle(item, opts) {
  const { cityLabel, cityUrl, lifeName, lifeUrl, kind } = opts;
  const nearby = item.nearby.map((n) => `<span class="tag">${esc(n)}</span>`).join('');
  const keywords = (item.keywords || []).map((k) => esc(k)).join(', ');

  return `
  <article class="article">
    <h2>${esc(item.name)} 지역 개요</h2>
    <p>${esc(item.lead)} ${esc(item.focus)}</p>
    <div class="tag-row">${nearby}</div>

    <h2>상위 행정구역 · ${esc(cityLabel)}</h2>
    <p>${esc(item.name)}은(는) <a href="${cityUrl}">${esc(cityLabel)} 출장마사지 지역 안내</a>에 속하며,
    ${esc(cityLabel)}는 제주도 전체 이용 기준의 두 축 가운데 하나입니다. 제주도 전체 생활권 구성은
    <a href="/jeju/">제주도 출장마사지 생활권 안내</a> 메인에서 한눈에 확인할 수 있습니다.</p>

    <h2>${esc(lifeName)} 생활권 설명</h2>
    <p>${esc(item.name)}은(는) <a href="${lifeUrl}">${esc(lifeName)} 숙소 생활권 안내</a>에 포함됩니다.
    ${esc(item.focus)}</p>

    <h2>가까운 공항·항만·인접 지역</h2>
    <p>${esc(item.transport)} 인접 지역으로는 ${esc(item.nearby.join(', '))} 등이 있어, 실제 숙소 위치에 따라
    이동 동선을 확인하는 것이 좋습니다.</p>

    <h2>이용 장소별 확인 기준</h2>
    <p>${esc(item.name)}에서 자주 이용되는 숙소 형태는 ${esc(item.accommodations.join(', '))} 등입니다.
    숙소 형태에 따라 확인할 내용이 달라집니다.</p>
    ${relatedUseLinks}

    <h2>예약 전 확인사항</h2>
    <p>${esc(item.name)} 방문 전에는 방문 주소, 숙소 출입 방식, 예약 가능 시간, 외곽 이동 기준을 미리 확인해 주세요.</p>
    ${checkLinks}
    <ul class="checklist" style="margin-top:1rem">
      <li>방문 주소(도로명·동·호수)를 정확히 확인했나요?</li>
      <li>${esc(cityLabel)} 내 정확한 위치를 확인했나요?</li>
      <li>숙소 출입 방식(프런트·카드키·공동현관)을 확인했나요?</li>
      <li>야간 방문·외곽 이동 기준을 확인했나요?</li>
    </ul>

    ${opsBlock}
    ${faqHtml(regionFaqs(item.name))}
    ${whwBlock(item.name)}

    <p class="muted" style="margin-top:2rem;font-size:0.85rem">주요 키워드: ${keywords}</p>
  </article>`;
}

/* ---------------------------- 도시 메인 ----------------------------- */
function cityArticle(cityLabel, cityUrl, lifeList, dongList) {
  const lifeCards = lifeList.map((l) =>
    `<a class="card" href="/jeju/life/${l.slug}/"><h3>${esc(l.name)}</h3><p>${esc(l.desc)}</p><span class="card-arrow">${esc(l.name)} 생활권 보기 →</span></a>`
  ).join('\n      ');
  const dongCards = dongList.map((d) =>
    `<a class="card" href="${cityUrl}${d.slug}/"><h3>${esc(d.name)}</h3><p>${esc(d.desc)}</p></a>`
  ).join('\n      ');

  return `
  <article class="article">
    <h2>${esc(cityLabel)} 생활권 안내</h2>
    <p>${esc(cityLabel)}는 제주도 출장마사지 이용 기준의 두 축 가운데 하나입니다. 공항 인접 숙소, 도심 호텔·오피스텔,
    해변 펜션, 읍면 외곽 이동 기준이 지역마다 달라, 아래 생활권별로 확인 내용을 나눠 정리했습니다.
    제주도 전체 안내는 <a href="/jeju/">제주도 출장마사지 생활권 안내</a>에서 확인할 수 있습니다.</p>
  </article>

  <section class="section">
    <h2>${esc(cityLabel)} 주요 생활권</h2>
    <div class="grid grid-3">
      ${lifeCards}
    </div>
  </section>

  <section class="section">
    <h2>${esc(cityLabel)} 핵심 읍·면·동</h2>
    <div class="grid grid-3">
      ${dongCards}
    </div>
  </section>

  <section class="section">
    <div class="article">
      ${opsBlock}
      ${faqHtml(regionFaqs(cityLabel))}
      ${whwBlock(cityLabel)}
    </div>
  </section>`;
}

/* --------------------------- 생활권 메인 ---------------------------- */
function lifeArticle(item, opts) {
  const { cityLabel, cityUrl, dongLinks } = opts;
  const nearby = item.nearby.map((n) => `<span class="tag">${esc(n)}</span>`).join('');
  const keywords = (item.keywords || []).map((k) => esc(k)).join(', ');
  const dongHtml = dongLinks && dongLinks.length
    ? `<ul>${dongLinks.map((d) => `<li><a href="${d.url}">${esc(d.name)} 지역 안내</a></li>`).join('')}</ul>`
    : '';

  return `
  <article class="article">
    <h2>${esc(item.name)} 생활권 개요</h2>
    <p>${esc(item.lead)} ${esc(item.focus)}</p>
    <div class="tag-row">${nearby}</div>

    <h2>상위 행정구역 · ${esc(cityLabel)}</h2>
    <p>${esc(item.name)} 생활권은 <a href="${cityUrl}">${esc(cityLabel)} 출장마사지 지역 안내</a>에 속합니다.
    제주도 전체 생활권 구성은 <a href="/jeju/">제주도 출장마사지 생활권 안내</a> 메인에서 확인할 수 있습니다.</p>

    <h2>가까운 공항·항만·인접 지역</h2>
    <p>${esc(item.transport)} 대표 인접 지역으로는 ${esc(item.nearby.join(', '))} 등이 있습니다.</p>
    ${dongHtml}

    <h2>이용 장소별 확인 기준</h2>
    <p>${esc(item.name)} 생활권에서 자주 이용되는 숙소 형태는 ${esc(item.accommodations.join(', '))} 등입니다.
    숙소 형태에 따라 확인 내용이 달라집니다.</p>
    ${relatedUseLinks}

    <h2>예약 전 확인사항</h2>
    <p>${esc(item.name)} 방문 전에는 방문 주소, 숙소 출입 방식, 예약 가능 시간, 외곽 이동 기준을 확인해 주세요.</p>
    ${checkLinks}

    ${opsBlock}
    ${faqHtml(regionFaqs(item.name))}
    ${whwBlock(item.name)}

    <p class="muted" style="margin-top:2rem;font-size:0.85rem">주요 키워드: ${keywords}</p>
  </article>`;
}

/* --------------------- 정보성 페이지 (use/check/policy) --------------- */
function usePage(item) {
  return `
  <article class="article">
    <h2>${esc(item.h1)}</h2>
    <p>${esc(item.intro)}</p>
    ${item.points.map(([t, d]) => `<h3>${esc(t)}</h3><p>${esc(d)}</p>`).join('\n    ')}
    ${opsBlock}
    ${whwBlock(item.name)}
  </article>`;
}

function checkPage(item) {
  const link = item.link
    ? `<p style="margin-top:1rem"><a href="${item.link.href}" class="btn btn-ghost">${esc(item.link.label)} →</a></p>` : '';
  return `
  <article class="article">
    <h2>${esc(item.h1)}</h2>
    <p>${esc(item.intro)}</p>
    <ul class="checklist" style="margin-top:1rem">
      ${item.checklist.map((c) => `<li>${esc(c)}</li>`).join('\n      ')}
    </ul>
    ${link}
    ${opsBlock}
  </article>`;
}

function policyPage(item, contactHtml) {
  const secs = item.sections.map(([t, d]) => `<h3>${esc(t)}</h3><p>${esc(d)}</p>`).join('\n    ');
  return `
  <article class="article">
    <h2>${esc(item.h1)}</h2>
    <p>${esc(item.intro)}</p>
    ${secs}
    ${item.isContact ? contactHtml : ''}
  </article>`;
}

module.exports = {
  esc, CITY_LABEL,
  regionArticle, cityArticle, lifeArticle,
  usePage, checkPage, policyPage,
  faqHtml, regionFaqs, whwBlock, opsBlock, relatedUseLinks, checkLinks,
};
