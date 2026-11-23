# 모두의 창업 · CEO로 살아남기

창업 자료를 활용한 브라우저 육성 게임입니다. `dist/`를 정적으로 서비스하며 빌드가 필요하지 않습니다.

## 화면과 시작 설정

- 증명사진 구도 초상화 8명: 20·30·40·50대 여성과 남성 각 1명.
- 블루 테마, 읽기 쉬운 비도트 UI, 캐릭터·이름·업종 선택.
- 기본 모드는 나이대별 프리셋 안에서 출발 조건을 무작위 배정합니다. 같은 나이대의 성별은 난이도와 수치 범위에 영향을 주지 않습니다.
- 커스텀 모드는 5가지 출발 조건을 각각 1–100으로 조절합니다. 별도의 펼침 영역에서 최종 체력(1–100)과 성장 능력치(0–100)도 직접 설정할 수 있습니다. 직접 설정한 값에는 보너스를 중복 적용하지 않습니다.
- 미리보기의 자금·조건·특성·능력치를 그대로 새 게임에 저장합니다. 화면을 켜 둔 동안 나이대별 추첨값을 유지하며, 얼굴이나 모드를 바꿔 다시 뽑을 수 없게 했습니다.

| 나이대 | 모드 | 기본 체력 | 학력 | 외모 | 자본 | 기술 | 경력 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 20대 | 쉬움 | 85–100 | 55–85 | 55–80 | 64–80 | 67–85 | 45–70 |
| 30대 | 보통 | 70–84 | 40–70 | 40–70 | 45–60 | 42–66 | 34–60 |
| 40대 | 어려움 | 55–69 | 25–60 | 30–60 | 30–44 | 25–50 | 20–45 |
| 50대 | 매우 어려움 | 40–54 | 10–45 | 20–50 | 15–29 | 10–33 | 10–33 |

이 표는 요청된 게임용 난이도 프리셋입니다. 개인의 실제 능력에 대한 모델이 아닙니다. 기본 체력에는 소폭 특성 보너스를 더하고 최종값을 100으로 제한합니다.

## 배경과 핵심 조건

무작위 특성은 지능, 끈기, 출신, 결혼 여부, 가족, 주거 여부, 취미, 말투, MBTI의 **9개**입니다. 기본·커스텀 두 모드 모두 무작위이며, 성장 능력치당 시작 보너스를 최대 +4로 제한합니다. 끈기와 MBTI는 일정에 맞춰 월말에 작은 효과를 더합니다. 주요 선택지를 잠그는 기준으로 쓰지 않습니다.

핵심 5개 조건은 `학력(edu), 외모(looks), 자본(capital), 보유 기술(skill), 경력(career)`입니다. 출발 조건은 고정되며 제품력·영업력·시장 이해·운영력·네트워크는 매달 성장합니다. 외모는 원본의 ‘첫 만남의 호감’ 수치이며 초상화와 별개입니다.

원본의 시작 조건 점수는 `자본×.40 + 기술×.25 + 경력×.20 + 학력×.08 + 외모×.07`입니다. 별 난이도는 `clamp(6-ceil(점수/20),1,5)`이며 점수가 낮을수록 별이 많습니다. 나이대 프리셋 이름과 실제 추첨된 조건의 별 난이도를 구분해 표시합니다.

자금은 원본의 곡선식 `round(50000*(자본/100)^3.3)`을 사용합니다. 업종의 초기 준비비와 소규모 시작 여부를 반영해 회사 현금을 산출하고, 개인 비상금은 `round(총자금*.5+경력*15)`입니다. 자본70 이상은 가족 차입15%, 자본85 이상은 보증대출20%가 추가됩니다. 부채에는 월0.6% 이자가 발생합니다.

## 실제 선택 조건

| 사건 / 선택 | 조건 |
| --- | --- |
| 지원사업 / 사업계획서 | 학력≥41 |
| 지원사업 / 현장 실적 발표 | 학력≤60 (41–60은 두 경로 모두 가능) |
| 대형 고객 / 직접 구현 | 보유 기술≥67 |
| 미디어 / 직접 출연 | 외모≥55 |
| 투자 / 지분10% 재협상 | 경력≥34 |
| 확장 / 두 번째 거점 | 현재 회사현금≥3,000만원 |
| 업무 위임·직원 의견·감원 | 직원≥1 |
| 팬데믹 / 기회 포착 | 자본≥40 AND 런웨이≥4개월 |
| 환율 급변 / 기회 포착 | 경력≥34 |
| 정책 변경 / 기회 포착 | 학력≥41 |
| 산유국 전쟁·외계인 침공 / 기회 포착 | 런웨이≥4개월 |
| 주식 폭락 / 기회 포착 | 런웨이≥6개월 |
| 주식 폭등 / 기회 포착 | 월매출≥500만원 |
| AI 붐 / 기회 포착 | 월매출≥400만원 |

기술67 이상이면 매달 4주 중 제품 만들기1주가 필요합니다. 원본의 ‘3점 중 제품1점’ 제약을 주간 일정에 맞춰 적용했습니다.

`conditions.js`는 UI와 엔진이 함께 사용하는 조건 평가기입니다. 원본의 게이지 범위, 플래그, 관계, 직원, 현금, 매출, 고객, 체력, 누적 위험, 지분, 런웨이, 경과 개월을 모두 검사합니다. 모든 조건은 AND입니다. 알 수 없는 조건은 통과시키지 않습니다.

사건 등장에도 업종·사업 단계·선행 사건·투자자/멘토 등의 존재를 적용합니다. 선택지는 3개로 자르지 않으며 잠긴 선택도 현재 수치와 요구조건을 보여줍니다. 채용·투자·지분·관계·부채·지연 효과를 실제 상태에 저장해 다음 사건에 연결합니다. ‘나의 조건’에서 잠금 상태를 확인할 수 있습니다.

자금이 부족하면 자금 대책을 열 수 있습니다. 개인 돈은 비상금과 투자 한계선, 가족 차입은 가족관계>-40, 보증대출은 기존 개인보증<30,000만원 조건을 검사합니다. 한계선은 게임 중 ‘나의 조건’에서 조절합니다.

## 원본에서 재구성한 부분

근거는 저장된 원본 `dist/game.html`의 `dn/Fu/cb/cd/vr/Db/Nb` 등 함수와 `content.json`의 `req`, `choices[].req`입니다. 원본 콘텐츠 출처는 [사업 2회차 : 또 창업을 한다면](https://www.letter4ceo.com/games/business-second-run.html), CC BY 4.0입니다. 전체 라이선스는 `game.html`, 화면 내 ‘자료와 제작 정보’에 보존했습니다.

이 버전은 월4주 육성 게임에 맞게 비용·실전 성장식을 재구성했습니다. 지능·출신·주거·취미·말투 등의 소폭 보너스는 이번 버전에 추가한 규칙입니다. 원본 미니게임은 기본(B등급) 결과로 처리하고 화면에 ‘기본 결과 기준’이라고 표시합니다. 세계 사건은 약10개월 간격에 무작위로 선택하고 후속 이야기를 연결합니다. 원본의 전체 세계경제 시뮬레이션을 그대로 실행하는 버전은 아닙니다.

## 파일

- `dist/index.html`, `life.css`, `life.js`: 기본 화면, 반응형 UI, 게임 흐름
- `dist/character-setup.js`: 초상화·모드·조건·특성·최종 수치 미리보기
- `dist/background.js`: 9개 특성, 5개 조건, 자금·난이도·보너스
- `dist/conditions.js`: 공통 조건 검사와 잠금 이유
- `dist/profile-view.js`: 조건 및 선택지 현황
- `dist/engine.js`: 일정·정산·사건·성장·저장 마이그레이션
- `dist/content.json`, `world-events.json`: 원본 업종·학습·일반 사건·8개 세계 사건 분기
- `dist/assets/portrait-*.webp`: 8개 초상화 + 이전 저장용 은퇴 초상화
- `art/portraits/`: 생성된 초상화 PNG와 제작 기록
- `dist/editor.html`, `editor.js`: 이전 원본 HTML/CSS 편집기

## 저장과 검증

브라우저 localStorage 키 `founder-life-v2`, 기본 저장 버전2에 `rulesVersion:3`을 추가했습니다. 이전 저장의 현금·능력치·체력·진행·초상화는 변경하지 않습니다. 새 조건은 기존 실전 능력치에 대응하고 자본은50으로 연결하며 배경은 저장된 시드에서 한 번 생성합니다. 진행 중인 사건은 원본 요구조건을 복원합니다.

`npm test`: 45개 테스트. 출발 조건 경계값, 복합 조건, UI와 동일한 선택 방어, 원본 자금식과 부채, 무작위 보너스 제한, 나이대·성별 일관성, 미리보기 일치, 커스텀 값, 자금난 탈출, 고용·투자 후속 조건, 지연 효과, 저장 호환, 8개 업종60개월 진행을 확인합니다.

## UI and saved-game update

- Geometric MV mark, icon-based condition cards, score bands, centered dialog controls, and a compact month calendar.
- Fixed starting-gauge failures are sorted last as gray locked cards; cash, team, stage and relationship gates remain temporary. Event choice indices stay attached to their original engine choices after sorting.
- Character creation shows the five adjustable conditions. Random background traits and final starting growth stats are revealed after starting. Experienced founders receive +4 management and +2 insight before custom final-value overrides.
- `founder-life-slots-v1` stores independent games. New games allocate new numbered slots; autosave updates only the selected slot. The prior `founder-life-v2` save imports into slot 1 and its original key remains intact as a backup.
- Editable, escaped, 80-character profile motto is saved per game.
- `locations.js` carries the reference game's 20 place names and original rent table: 14 rental locations and six scene-only locations. Rent adds to month-end fixed expenses once; changing locations has no up-front fee or invented stat boosts. Existing equipment purchases remain compatible with older saves.
- The advertising contact uses the original game's published `ad@venturesquare.net` address through a user-initiated mailto link. No message is sent by the game itself.
- MV logo generated with the built-in image-generation tool. Final prompt: refine a combined geometric M/V as one clean white mark on a solid cobalt square, centered with equal margins, no shading or texture. Asset: `dist/assets/mv-logo.png`.


## 대화, 계획서, 자동 진행

- 캐릭터 생성 후 초기 계획서 8개 항목(고객·가치·가격·고객 유입·자금 속도·팀·위험·개인 한계)을 한 장씩 표시합니다. 모든 항목은 복수 선택과 선택 해제, 기타 메모 병행, 이전, 다음, 건너뛰기, 전체 건너뛰기를 지원합니다. 작성 중인 위치와 메모도 슬롯에 저장합니다.
- 원본 계획서 자료를 `story-content.json`으로 보존했습니다. 가격 선택은 객단가 -20% / 기본 / +25%, 자금 속도는 기본 고정비 85% / 100% / 125%와 수요 90% / 100% / 120%, 공동창업은 지분 70%와 동료 등장, 채용은 직원 1명과 월 인건비, 개인 한계는 자금 대책의 실제 제한으로 연결됩니다. 기타와 빈 답변은 중립이며 메모로 남깁니다. 고객·가치·채널·위험은 이 버전에서 메모로 사용합니다. 복수 선택 시 가격·자금 비율은 평균, 팀원 합류는 함께 반영, 개인 한계는 더 낮은 한도를 적용하며 화면에 합산 기준을 표시합니다. 계획 효과는 완료 시 한 번만 적용됩니다. 이전 단일 선택 저장도 유지됩니다.
- 사건 발생 확인을 두 달 간격에서 **매달**로 늘렸습니다. 기존 업종·사업 단계·사건 중복·관계·자금 조건은 그대로 검사합니다.
- 사건 → 임시 선택 → 지인별 찬성/반대/조건부 의견 → 최종 결정 → 실제 결과·배움 카드 → 관련 아침편지 순서입니다. 조언을 따를 때 제안된 실제 선택지를 명시하고 그 선택의 효과만 한 번 적용합니다. 역할별 원본 선호와 조언 문장을 사용하고, 아직 잠긴 선택은 추천하지 않습니다.
- 원본의 62개 아침편지/FAQ/영상 주소와 원본에 포함된 요약 14개를 보존했습니다. 없는 원문 요약은 만들지 않습니다. 관련 자료는 최종 결정 전에도 펼쳐 읽고, 결과 카드와 창업 노트에서 다시 읽을 수 있습니다.
- 인물 8명은 원본의 관계 역할을 바탕으로 새로 만든 고정 캐릭터입니다. 실제 관계 수치, 만남 여부, 따른 조언 기록을 인물수첩에 표시합니다. 그림과 프롬프트는 `dist/assets/npc-*.png`, `docs/npc-art-prompts.md`입니다.
- 2배속 오토모드(단계 간 1.6초)는 일정·열린 선택·조언을 자동 선택합니다. 일시정지 또는 직접 선택으로 멈춥니다. 사건 창 닫기·조언 읽기·결과 확인은 오토를 끄지 않습니다. 탭을 벗어난 동안 타이머를 보류하고 돌아오면 이어갑니다. 사건·조언·결과 창에서도 오토를 켤 수 있습니다. `건너뛰고 결과보기`도 같은 `advanceAutomated` 함수를 반복하고 실제 엔딩 상태를 표시하며 성공 엔딩을 강제하지 않습니다.
- 창업 위키는 27개 용어의 설명·예시·분야·한영 검색을 제공합니다.

## 최근 화면 수정

- 캐릭터 생성 상단은 이어하기 한 개로 정리하고, 이어하기에서 항상 슬롯 목록을 엽니다. 슬롯별 빨간 삭제 버튼은 복구 가능한 삭제를 수행합니다. 삭제한 슬롯은 같은 목록에서 복구할 수 있고 슬롯 번호는 재사용하지 않습니다.
- 모든 능력치 아이콘 옆에 이름을 표시하고 숫자 두께를 500으로 낮췄습니다. 해금한 창업 노트는 분야별 색상으로 먼저, 미해금 노트는 회색으로 마지막에 표시합니다.
- 부동산 목록은 이름·설명·살펴보기로 정리했습니다. 상세에서 인물과 장소 배경, 월 임대료, 임대료 포함 월 고정비를 표시합니다. 방문 전용 장소는 임대할 수 없습니다.
- 배경은 부동산 20곳마다 별도의 일러스트와 4계절 변형을 사용합니다. 서로 다른 장소에 같은 배경을 배정하지 않습니다. 3–4월 봄, 5–8월 여름, 9–10월 가을, 11–2월 겨울이며 5년 동안 반복됩니다. 생성 프롬프트와 파일 경로는 `docs/property-art.md`와 각 문서에 기록합니다.
- 하단 자동 저장 안내와 진행 개월 배지를 제거했습니다. 원본 저작자와 CC BY 4.0 출처는 설정의 ‘자료와 제작 정보’에서 확인할 수 있습니다.

현재 `npm test`는 핵심 엔진, 저장 이전/삭제/복구, 계획서, 사건과 조언의 실제 조건, 계절 경계, 자동 진행 결정 일치 및 8개 업종 × 4개 나이대의 엔딩 도달을 검증합니다.


## Ending report and result cards

The ending screen has explicit keywords for all nine engine endings, labelled icon metrics, matching restart/history controls, and a 1200 × 1500 PNG card using the selected player portrait and the last completed month’s property background. Native file sharing is available where supported; other browsers download the PNG.

`ending-report.js` builds the initial-plan comparison, exactly three evidence-based plan review points, monthly totals, health and relationship summaries, and original morning-letter links. Free text and multi-select answers remain unchanged. Untracked customer segments and channels are not graded. New plans retain their initial fixed costs, team, equity, health and relationship baseline; new monthly records also retain weekly actions. Older saves continue to work without invented baselines. Reputation is explicitly presented using the existing network metric, not a new independent score.

Personal profit/loss is a labelled game-only cash-settlement estimate: subtract corporate debt from corporate cash, allocate the remaining positive cash by founder equity, then subtract cumulative personal investment and any assumed personal liability for the remaining debt (capped at family borrowing plus guarantees, themselves capped at total debt). Family borrowing and guarantees are already part of corporate debt and are not counted twice. Personal wealth adds the personal reserve to this estimated recovery less liability. Actual salary, dividends, exit proceeds, taxes, liquidation costs and non-cash business valuation are not recorded and are not invented. Legacy condition saves without reliable personal finance records show an unavailable result.

Validation: `npm test`, desktop and 390 px mobile UI review, card rendering and PNG download through the browser.
