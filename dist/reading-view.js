const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// These are original game-learning notes, not reproductions of linked articles.
const TOPICS=[
 [/폐업|실패|몰락/,['멈출 때도 순서가 필요해요','게임의 엔딩에서는 회사에 남은 현금과 부채를 먼저 정산하고, 대표가 회수할 몫과 개인 부담을 따로 계산해요. 회사의 매출이 컸다는 사실만으로 개인에게 이익이 남는 것은 아니에요.','엔딩 리포트의 회수액과 누적 개인 투입금을 나란히 확인해 보세요.']],
 [/멘탈|실수|성과|몬스터/,['대표의 체력도 회사의 자원이에요','게임에서는 현금이 충분해도 체력이 바닥나면 도전이 끝나요. 휴식을 일정에 넣으면 당장의 활동 한 주를 줄이지만 다음 달의 선택을 이어 갈 여유를 얻어요.','다음 달의 4주 중 한 주를 휴식으로 바꾸면 예상 체력이 어떻게 달라지나요?']],
 [/직원|채용|연봉|회식|위임|지시|회의|보고|AI|역할|전문가/,['사람을 늘리기 전에 맡길 일을 정해요','이 게임에서 직원과 공동창업자는 서로 다른 선택이에요. 직원 채용은 매달 비용에, 공동창업은 대표 지분에 영향을 줘요. 관계가 달라지면 이후에 만나는 사건도 달라질 수 있어요.','지금 필요한 것은 인원, 업무 분담, 아니면 우선순위 조정인가요?']],
 [/지분|이사회|주주|경영권|스톡옵션/,['지분과 현금은 다른 숫자예요','투자나 공동창업으로 회사의 자원이 늘어도 대표 지분은 줄 수 있어요. 엔딩 리포트에서는 회사의 결과와 대표 개인의 몫을 나누어 보여줘요.','선택지의 현금 변화와 대표 지분 변화를 함께 비교해 보세요.']],
 [/투자|기업 가치|자본|대출|사채|자금|개인 돈|정부|지원|인수|기업공개/,['들어오는 돈의 성격을 구분해요','게임에서 고객 매출, 투자금, 차입금은 모두 현금에 영향을 줄 수 있지만 같은 성과는 아니에요. 누적 매출에는 고객에게 판매한 금액을 기록하고, 대출과 개인 투입금은 별도로 남겨요.','지금의 선택은 매출을 만드는 일인가요, 시간을 벌기 위해 자금을 마련하는 일인가요?']],
 [/비용|마진|장부|증빙|세무|미수|현금|매출|입금|돈/,['매출에서 실제로 남는 돈을 확인해요','월말 손익은 매출에서 원가, 활동비, 고정비를 뺀 결과예요. 매출이 늘어도 지출이 더 크게 늘면 손실이 날 수 있어요. 월말 정산과 성장 기록을 함께 살펴보세요.','이번 달 비용 중 줄일 수 있는 항목과 꼭 유지할 항목을 하나씩 골라보세요.']],
 [/고객|시장|아이디어|해외|제휴|용역|제품|브랜딩|언론|방문/,['작은 검증을 다음 선택으로 연결해요','고객 만나기, 제품 만들기, 영업 나가기는 서로 다른 능력치를 키워요. 게임에서는 제품 준비와 고객 반응을 함께 개선해야 매출로 이어져요. 계획서의 고객과 판매 경로도 다시 확인해 보세요.','다음 한 주에 확인할 질문을 하나만 정한다면 무엇인가요?']]
];
export function readingModel(id,data){
 const ref=data.story?.letterRefs?.[id];if(!ref)return null;
 const topic=TOPICS.find(([pattern])=>pattern.test(ref.title))?.[1]||['선택의 기준을 한 문장으로 남겨요','게임에는 모든 상황에서 유리한 정답이 정해져 있지 않아요. 선택 전의 비용과 체력, 기대하는 변화와 이후의 실제 결과를 비교해 보세요. 기록은 다음 계획을 고칠 때 사용할 수 있어요.','이번 선택에서 가장 지키고 싶은 것은 무엇인가요?'];
 return {id,...ref,heading:topic[0],explanation:topic[1],question:topic[2]};
}
export function readingView(id,data){
 const r=readingModel(id,data);if(!r)return null;
 return {title:r.title,body:`<article class="in-site-reader"><div class="reader-meta">그만의 아침편지 · 명승은 <span>학습 노트</span></div>${r.gist?`<section class="reader-key"><span>원본 게임에 수록된 핵심 요약</span><p>${esc(r.gist)}</p></section>`:''}<section><h3>${esc(r.heading)}</h3><p>${esc(r.explanation)}</p></section><a class="primary reader-original" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">원문 읽기</a><footer>관련 자료 · ${esc(r.title)}<br><span>${esc(r.url)}</span><p>원문 사이트는 외부 화면 삽입을 허용하지 않아요. 이 화면은 원문 전문이 아닌, 게임에 수록된 요약과 별도로 작성한 플레이 학습 노트예요.</p></footer></article><div class="modal-actions"><button class="primary" data-action="reading-back">게임으로 돌아가기</button></div>`};
}
