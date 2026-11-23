# 부동산 장소별 배경

부동산 20곳에 각 장소만의 실내 구도·가구·장비를 가진 배경을 배정했습니다. 다른 장소의 배경을 재사용하지 않습니다. 각 장소의 봄 원본을 기준으로 여름·가을·겨울은 창밖 풍경과 계절광만 바꿔 공간의 연속성을 유지했습니다.

총 80개 PNG를 `dist/assets/scene-{장소 ID}-{계절}.png`에 저장합니다. 계절은 `spring`, `summer`, `autumn`, `winter`이며 3–4월 봄, 5–8월 여름, 9–10월 가을, 11–2월 겨울입니다.

| 장소 | ID | 생성 프롬프트와 원본 기록 |
| --- | --- | --- |
| 홈오피스·사무실·동네 카페·콘텐츠 촬영실 | home, office, cafe, studio | [기존 4개 고유 장소](scene-art-prompts.md) |
| 공유오피스·별도 사무실·회의실·사장실 | cowork, suite, meeting, ceo | [업무 공간](property-art-office.md) |
| 카페 주방·화장품 샘플실·위탁생산 공장·물류 창고 | kitchen, coslab, factory, logistics | [제작·유통 공간](property-art-production.md) |
| 영상 편집실·서버실·라이브 방송 스튜디오·팝업 매장 | edit, server, live, market | [기술·상업 공간](property-art-tech.md) |
| 창업지원센터·투자 발표장·은행 상담실·위기 대응실 | center, pitch, bank, news | [공공·금융 공간](property-art-public.md) |

`dist/scenery.js`는 장소 ID와 현재 월만으로 해당 배경을 선택합니다. `tests/interaction.test.mjs`에서 80개 경로의 고유성, PNG 크기 및 파일 해시 중복 여부를 검사합니다. 생성 이미지와 계절 변형은 image_gen으로 제작했고, 각 담당 문서에 최종 프롬프트와 출처 파일을 기록했습니다.
