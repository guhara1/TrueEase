'use strict';

/*
 * 사이트 전역 설정 (간다GO)
 * - 텔레그램 링크는 아래 한 줄만 교체하면 전체 사이트에 반영됩니다.
 * - 전화번호 / 상호 / 도메인 등 브랜드 정보도 이곳에서만 관리합니다.
 */

const SITE = {
  brand: '간다GO',
  brandEn: 'GandaGO',
  phone: '0508-202-4723',
  phoneHref: 'tel:05082024723',

  // 배포 도메인(canonical/sitemap 기준). 실제 도메인으로 교체하세요.
  origin: 'https://gandago.co.kr',

  // 푸터 오렌지 버튼 링크 (텔레그램). 실제 계정으로 교체하세요.
  telegram: {
    build: 'https://t.me/gandago',   // 웹사이트 제작문의
    partner: 'https://t.me/gandago', // 제휴문의
    reserve: 'https://t.me/gandago', // 예약 문의(가격표 CTA)
  },

  // 저자/검수 (E-E-A-T 신호)
  editorial: {
    author: '간다GO 편집팀',
    reviewer: '간다GO 운영 책임자',
    updated: '2026-07-02',
  },
};

// 이용 코스 요금표 (모든 지역 페이지에 노출)
const PRICING = {
  heading: '이용 코스와 요금 살펴보기',
  sub: '60·90·120분 코스별 기준 요금이며, 추가 비용 없이 있는 그대로 안내해 드립니다.',
  note: '지역·예약 시간대·이동 거리에 따라 상담 시 최종 확인됩니다.',
  detailHref: '/jeju/use/',
  detailLabel: '상세 요금 안내 보기',
  courses: [
    { name: '60분 코스', price: '90,000', unit: '원', duration: '60분', desc: '기본 컨디션·릴랙스 케어', featured: false },
    { name: '90분 코스', price: '150,000', unit: '원', duration: '90분', desc: '아로마 포함 추천 구성', featured: true, badge: '추천' },
    { name: '120분 코스', price: '180,000', unit: '원', duration: '120분', desc: '전신 집중 프리미엄 케어', featured: false },
  ],
};

module.exports = { SITE, PRICING };
