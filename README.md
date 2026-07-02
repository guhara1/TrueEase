# 간다GO · 제주도 출장마사지 지역 안내

제주도 출장마사지·홈타이를 **생활권별 방문 가능 지역**으로 안내하는 정적 사이트입니다.
무의존성 Node 생성기로 데이터에서 모든 페이지를 생성하며, 헤더·푸터·가격표·스키마·내부링크가
**모든 페이지에 일관되게** 적용됩니다.

## 빠른 시작

```bash
node build.js          # public/ 에 전체 사이트 생성 (67 페이지)
npm run serve          # 빌드 후 로컬 미리보기 (npx serve)
```

생성 결과는 `public/` 에 있으며, 정적 호스팅(GitHub Pages, Netlify 등)에 그대로 배포할 수 있습니다.

## 구조

```
src/config.js          브랜드·전화·텔레그램 링크·가격표 (여기만 고치면 전체 반영)
src/data/life.js       제주 핵심 생활권 13
src/data/dong.js       제주시(12)·서귀포시(11) 핵심 읍·면·동
src/data/pages.js      이용 장소(9)·예약 전 확인(10)·운영 기준(5)
src/templates/render.js 레이아웃·헤더·푸터·가격표·스키마(JSON-LD)
src/templates/content.js 지역/정보 페이지 본문·FAQ·Who/How/Why
assets/css/tokens.css   프리미엄 팔레트 디자인 토큰 (Pretendard)
assets/css/components.css 컴포넌트 오버레이
build.js               생성기 (이미지 SVG·sitemap·robots 포함)
```

## 주요 설정 교체 위치

`src/config.js` 한 파일에서 관리합니다.

- **텔레그램 링크** — `SITE.telegram.build / partner / reserve` (현재 `https://t.me/gandago` 임시값)
- **상호 / 전화예약** — `SITE.brand` = 간다GO, `SITE.phone` = 0508-202-4723
- **배포 도메인** — `SITE.origin` (canonical·sitemap·og 기준)
- **가격표** — `PRICING` (60분 90,000 / 90분 150,000 추천 / 120분 180,000)

수정 후 `node build.js` 를 다시 실행하세요.

## SEO / 정책 준수

- **스키마**: `Organization`, `WebPage`, `BreadcrumbList`, `FAQPage`, `ImageObject` (JSON-LD).
  방문형 서비스이므로 `LocalBusiness`·`Review`·`AggregateRating`·가짜 별점은 **사용하지 않음**.
- **E-E-A-T**: 작성자(편집팀)·검수자(운영 책임자)·갱신일 명시, `작성자·검수자 안내` 페이지 제공.
- **선호 썸네일**: `og:image` + schema `ImageObject` 동시 지정 (페이지별 SVG OG 이미지 자동 생성).
- **내부링크**: 메인→도시→생활권→읍면동으로 롱테일 앵커텍스트 연결.
- **메타 디스크립션**: 전 페이지 80자 이내.
- **noindex**: 도항선 별도 기준 지역(우도면 등) 무리한 색인 지양.
- 상위노출 보장·과장 표현 미사용, 불법·선정적 서비스 불가 안내 명시.

> OG 이미지는 배포용 SVG 플레이스홀더입니다. 실제 사진(선정적 요소 없는 제주 숙소·지역 분위기)으로
> 교체하는 것을 권장합니다.
