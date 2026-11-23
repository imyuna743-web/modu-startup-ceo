// Original characters for this game adaptation. Conditions describe game rules.
const entries=[
 ['public_officer','오세진','정부·공공기관 담당자',42,'지원사업의 목적과 집행 기준을 함께 확인하는 담당자.','신뢰 · 기준 · 실행','2개월 차부터 지원 상담 가능',{trust:2,safety:2},'지원 조건과 할 수 있는 일을 먼저 맞춰 봐요.'],
 ['rival','장현수','경쟁자',33,'같은 시장에서 다른 답을 찾는 대표. 경쟁도 협업도 가능하다.','고객 · 속도 · 실력','고객 10명 또는 4개월 차부터',{growth:2,speed:1,quality:1},'남의 속도보다 고객이 무엇을 선택하는지 보죠.'],
 ['private_lender','최명호','사채업자',54,'빠른 자금 조달을 제안한다. 계약 조건과 상환 부담을 따져야 한다.','현금 · 기한 · 조건','현금이 월 고정비 3개월치 미만일 때',{cash:2,speed:2,safety:-1},'빨리 쓸 수 있는 돈일수록 갚을 조건부터 확인해야죠.'],
 ['foreign_investor','Alex Morgan','외국 투자자',40,'해외 수요와 사업의 확장 가능성을 숫자로 묻는 투자자.','성장 · 지표 · 신뢰','월 매출 1,000만 원 또는 8개월 차부터',{growth:2,trust:2},'다른 시장에서도 같은 가설이 통할지 작은 실험부터 보죠.'],
 ['creator','윤소이','인플루언서',27,'시청자가 납득할 만한 실제 경험을 콘텐츠로 만든다.','진정성 · 품질 · 약속','고객 10명 또는 인플루언서 업종에서',{quality:2,trust:2},'보여 줄 장점과 말해야 할 한계를 함께 정해요.'],
 ['freelancer','이준','프리랜서',30,'제작을 돕는 독립 실무자. 범위와 일정이 명확할수록 힘을 낸다.','품질 · 범위 · 일정','제품력 25 또는 3개월 차부터',{quality:2,people:1},'어디까지 만들고 언제 끝낼지부터 맞추면 좋아요.'],
 ['expert','차은경','분야 전문가',52,'작은 실험으로 중요한 가설부터 검증하게 돕는 전문가.','검증 · 품질 · 기준','2개월 차부터',{quality:2,safety:1},'가장 위험한 가설 하나를 먼저 확인해 봐요.'],
 ['lawyer','김하원','변호사',38,'계약의 역할·책임·분쟁 지점을 검토하는 법률 전문가.','계약 · 신뢰 · 책임','팀이 생기거나 4개월 차부터',{trust:2,safety:2},'좋을 때도 지킬 수 있는 약속을 문서로 남겨요.'],
 ['tax_advisor','백지훈','세무사',43,'신고 일정과 증빙 자료를 정리해 주는 세무 전문가.','증빙 · 기한 · 현금','첫 매출 이후',{cash:1,safety:2,trust:1},'실제 거래와 증빙을 제때 맞춰 두는 게 먼저예요.'],
 ['accountant','문서희','회계사',41,'매출과 비용, 돈의 흐름이 맞는지 살펴보는 회계 전문가.','숫자 · 검증 · 투명성','누적 매출 1,000만 원 또는 직원 채용 후',{trust:2,cash:1},'손익과 통장 잔액이 다른 이유를 하나씩 확인해요.'],
 ['patent_attorney','임도현','특허 변리사',36,'아이디어와 브랜드를 권리로 보호할 방법을 검토한다.','차별성 · 조사 · 권리','제품력 50 또는 기술·화장품 업종에서',{quality:2,safety:2},'공개하기 전에 기존 권리와 보호할 범위를 살펴봐요.'],
 ['pet','두부','반려동물',3,'잠깐 밖으로 나가 쉬도록 이끄는 작업실의 작은 동료.','돌봄 · 휴식 · 일상','3개월 차부터 또는 체력 60 미만일 때',{self:3,people:1},'두부가 문 앞에서 꼬리를 흔든다. 잠시 산책할 시간일지도.']
];
export const EXTRA_CAST=entries.map(([id,name,role,age,bio,focus,unlock,prefs,line])=>({id,name,role,age,bio,focus,unlock,prefs,line,file:id==='public_officer'?'npc-public-officer-v2.webp':`npc-${id}-v2.webp`}));
export function canMeetExtra(state,id){
 const total=(state.history||[]).reduce((sum,row)=>sum+(row.revenue||0),0);
 return ({public_officer:state.month>=2,rival:state.customers>=10||state.month>=4,private_lender:state.cash<(state.monthlyFixed||120)*3,foreign_investor:state.revenue>=1000||state.month>=8,creator:state.customers>=10||state.industry==='influencer',freelancer:state.skills.product>=25||state.month>=3,expert:state.month>=2,lawyer:state.team>0||state.seats?.cofounder||state.month>=4,tax_advisor:state.revenue>0,accountant:total>=1000||state.team>0,patent_attorney:state.skills.product>=50||['saas','cosmetics'].includes(state.industry),pet:state.month>=3||state.health<60})[id]===true;
}
const encounterTitles={public_officer:'지원사업 상담 제안',rival:'같은 고객, 다른 제품',private_lender:'급한 자금의 대가',foreign_investor:'해외 시장에서 온 관심',creator:'제품을 써 보고 싶어요',freelancer:'함께 만들 첫 작업',expert:'가설을 확인하는 질문',lawyer:'계약서를 펼쳐 볼 시간',tax_advisor:'첫 매출과 증빙 정리',accountant:'장부 속 숫자 맞추기',patent_attorney:'공개 전에 지킬 권리',pet:'작업실 앞 작은 손님'};
export const encounterTitle=id=>encounterTitles[id]||'함께 나눌 이야기';
const encounterLines={public_officer:'대표님, 지금 회사에 맞는 지원사업이 있는지 함께 찾아볼까요? 신청 조건과 필요한 자료부터 설명해 드릴게요.',rival:'우리 제품을 보는 고객들이 꽤 겹치네요. 대표님은 어떤 문제를 풀고 계세요?',private_lender:'급하게 자금이 필요하시다고 들었습니다. 제안은 드릴 수 있지만, 갚아야 할 금액과 기한부터 확인하시죠.',foreign_investor:'대표님 제품을 다른 시장에서도 써 볼 수 있을까요? 지금까지 확인한 고객 반응부터 듣고 싶어요.',creator:'대표님 제품을 직접 써 보고 싶어요. 솔직한 사용 경험을 콘텐츠로 이야기해도 괜찮을까요?',freelancer:'어떤 작업이 필요하세요? 이번에 만들 범위와 마감일부터 함께 정해 보면 좋겠어요.',expert:'지금 가장 확신이 없는 가설은 무엇인가요? 작게 시험할 방법부터 같이 찾아봐요.',lawyer:'계약서에서 서로의 역할과 책임이 분명한지 함께 살펴볼까요?',tax_advisor:'첫 매출이 생기셨군요. 지금부터 거래 증빙과 신고 일정을 정리해 두면 한결 편해져요.',accountant:'숫자가 많아졌네요. 매출과 실제 입금, 지출 기록을 나란히 맞춰볼까요?',patent_attorney:'제품과 브랜드를 공개하시기 전에 이미 등록된 권리와 보호할 범위를 함께 확인해 봐요.',pet:'멍! 꼬리를 흔들며 두부가 다가왔어요. 잠깐 함께 걸어볼까요?'};
export function encounterEvent(person){return {id:`meet_${person.id}`,chain:true,title:encounterTitle(person.id),text:encounterLines[person.id],who:person.id,cat:'people',plan:['team'],card:person.id==='pet'?'c_health':'c_alone',choices:[
 {label:person.id==='pet'?'잠시 산책하며 함께 시간을 보낸다':'필요한 일을 정리해 자세히 이야기한다',tags:['trust','people','quality'],fx:{health:person.id==='pet'?8:-3,network:2,seat:person.id,rel:{[person.id]:8}},out:'서로의 기대를 확인하고 다음에 연락할 수 있는 관계를 만들었다.'},
 {label:person.id==='pet'?'인사를 나누고 다음에 다시 만난다':'간단히 인사하고 연락처를 남긴다',tags:['caution','cash'],fx:{seat:person.id,rel:{[person.id]:2}},out:'당장 큰 약속은 하지 않고 다음 대화를 위한 연결을 남겼다.'}
]};}
export function requestEncounter(state,id,data){const person=EXTRA_CAST.find(p=>p.id===id);return person&&!state.seats?.[id]&&canMeetExtra(state,id)&&!state.pending&&!state.lastScene?.unread&&!state.ending?data.events.find(e=>e.id===`meet_${id}`):null;}
export function nextEncounter(state,data){
 const month=state.month-1;if(month<2||month-(state.lastEncounterMonth??-10)<3)return null;
 const person=EXTRA_CAST.find(p=>!state.seats?.[p.id]&&!(state.seenEvents||[]).includes(`meet_${p.id}`)&&canMeetExtra(state,p.id));
 if(!person)return null;state.lastEncounterMonth=month;return data.events.find(e=>e.id===`meet_${person.id}`);
}
const pair=(good,bad,card)=>({good,bad,card});
export const EXTRA_RELATIONSHIPS={
 public_officer:pair(['담당자의 보완 안내','성실하게 소통한 담당자가 제출 전 빠진 내용을 짚어 준다.','증빙과 실행 계획을 다시 점검한다',{management:5,hiddenRisk:-3,health:-3},'탈락을 피하는 보장이 아니라, 실제 할 수 있는 계획을 다듬는 기회가 되었다.'],['지원사업 정산의 빈칸','담당자는 약속한 보고와 증빙이 계속 늦어졌다고 말한다.','누락 자료와 다음 제출일을 정리한다',{cash:-20,management:3,hiddenRisk:-3,health:-4},'정산에 필요한 기록을 다시 맞췄다.'],'c_grant'),
 rival:pair(['경쟁자가 제안한 공동 행사','서로 존중해 온 경쟁사가 공동 홍보를 제안한다.','고객 정보 공유 범위를 정해 함께한다',{sales:5,network:4,cash:-40},'각자의 고객을 지키면서 새로운 접점을 함께 만들었다.'],['경쟁사의 가격 공세','관계가 나빠진 경쟁사가 공격적인 가격으로 고객을 흔든다.','차별화할 고객 경험에 집중한다',{product:4,health:-5},'가격을 따라 내리기보다 선택받을 이유를 다시 만들었다.'],'c_regular'),
 private_lender:pair(['숫자로 다시 쓰는 상환 협의','약속을 지킨 기록 덕분에 상환 계획을 논의할 여지가 생겼다.','추가 차입 없이 상환 조건을 확인한다',{management:4,hiddenRisk:-3,health:-3},'지금 갚을 수 있는 금액과 남은 책임을 문서로 확인했다.'],['급전을 권하는 연락','관계가 틀어진 대여자가 급한 돈과 추가 계약을 함께 제시한다.','새 계약을 보류하고 독립적인 검토를 받는다',{cash:-30,management:3,health:-4},'급한 상황에서도 추가 부담이 생기는 조건을 먼저 확인했다.'],'c_guarantee'),
 foreign_investor:pair(['해외 고객과의 연결','신뢰가 쌓인 투자자가 해외 고객 인터뷰를 주선한다.','작은 시장 검증부터 진행한다',{customers:3,insight:6,network:4,cash:-60},'해외에서도 같은 제품이 필요한지 직접 질문했다.'],['서로 다른 성장 기대','투자자는 약속한 확장 속도와 현재 숫자 사이의 차이를 지적한다.','현재 지표와 다음 검증 목표를 다시 합의한다',{management:4,health:-5},'큰 전망보다 확인할 수 있는 다음 단계를 정했다.'],'c_terms'),
 creator:pair(['믿고 추천하는 콘텐츠','크리에이터가 솔직한 사용 경험을 함께 콘텐츠로 만들자고 한다.','표현 범위와 결과 확인 방법을 정한다',{sales:6,customers:4,cash:-40},'고객이 궁금해한 장점과 한계를 함께 보여 주었다.'],['콘텐츠 표현을 둘러싼 갈등','협업 콘텐츠의 표현과 약속한 결과를 놓고 의견이 갈린다.','자료와 계약 범위를 확인해 수정한다',{cash:-30,health:-4,hiddenRisk:-2},'확인되지 않은 표현을 고치고 서로의 기대를 다시 맞췄다.'],'c_review'),
 freelancer:pair(['다음 작업을 위한 개선안','신뢰하는 프리랜서가 제작 시간을 줄일 방법을 제안한다.','작은 범위부터 적용해 본다',{product:5,management:3,cash:-40},'제작 범위를 나누고 확인 시간을 줄였다.'],['늘어난 수정 요청','프리랜서는 합의 없이 작업이 계속 늘어난다고 말한다.','범위와 추가 일정부터 다시 정한다',{cash:-30,management:3,health:-4},'해야 할 일과 다음에 할 일을 나누었다.'],'c_delegate'),
 expert:pair(['실험의 방향을 바꾼 질문','전문가는 가장 중요한 검증 항목을 먼저 짚어 준다.','고객에게 핵심 가설을 시험한다',{insight:6,product:3,health:-4},'많이 만드는 대신 틀릴 수 있는 가설을 먼저 확인했다.'],['무시했던 경고','전문가는 이전에 지적한 문제가 그대로 남았다고 말한다.','문제 원인부터 작은 실험으로 확인한다',{product:4,hiddenRisk:-4,health:-5},'성급한 확대를 멈추고 실패 원인을 검토했다.'],'c_pivot'),
 lawyer:pair(['계약서의 작은 빈틈','신뢰하는 변호사가 역할과 책임의 빈칸을 찾아냈다.','현재 거래에 맞게 계약을 검토한다',{management:5,hiddenRisk:-5,cash:-50},'표준 문구를 그대로 쓰기보다 실제 약속을 명확히 했다.'],['책임을 떠넘기는 조항','이전 검토를 건너뛴 계약에서 책임 범위의 충돌이 드러났다.','이행 기록을 모아 해결 방향을 검토한다',{cash:-60,health:-5,hiddenRisk:-3},'감정적인 대응을 멈추고 실제 기록을 정리했다.'],'c_equity'),
 tax_advisor:pair(['마감 전에 정리한 증빙','세무사가 거래 기록을 미리 맞추어 신고 준비를 돕는다.','누락 자료를 정리하고 일정을 확인한다',{management:5,hiddenRisk:-4,cash:-25},'통장과 증빙을 미리 맞추며 급한 마감을 줄였다.'],['마감 직전의 누락 자료','늦어진 전달 때문에 빠진 증빙이 한꺼번에 드러났다.','자료를 확보하고 처리 범위를 확인한다',{cash:-40,health:-5,management:2},'기억에 기대지 않고 거래 자료부터 다시 모았다.'],'c_books'),
 accountant:pair(['장부가 알려 준 비용','회계사가 숫자를 비교하다 반복되는 낭비를 발견했다.','비용 구조를 함께 점검한다',{management:5,costMod:-10,cash:-35},'매출이 늘어도 남는 돈이 적었던 이유를 찾았다.'],['맞지 않는 매출과 입금','기록 전달이 끊긴 사이 매출과 입금의 차이가 커졌다.','미수금과 거래 기록을 대조한다',{cash:-40,management:3,health:-4},'매출과 실제 들어온 현금을 나누어 다시 정리했다.'],'c_metric'),
 patent_attorney:pair(['공개 전에 확인한 권리','변리사가 브랜드와 기술의 보호 범위를 함께 검토한다.','기존 권리와 보호할 요소를 조사한다',{product:3,hiddenRisk:-5,cash:-50},'알리지 말아야 할 내용과 먼저 확인할 범위를 정리했다.'],['닮아 보이는 이름','브랜드 이름과 유사한 권리가 있다는 연락이 왔다.','사용 상황과 권리 범위를 검토한다',{cash:-50,management:3,health:-4},'성급히 결론내리기 전에 현재 사용과 권리 자료를 확인했다.'],'c_hidden'),
 pet:pair(['작은 동료와 산책','두부가 익숙한 산책 시간을 기다린다. 잠시 쉬어 갈 여유가 생겼다.','함께 산책하고 오늘의 일을 마무리한다',{health:15,cash:-5},'잠깐의 일상으로 다시 일할 힘을 얻었다.'],['바쁜 날에도 필요한 돌봄','바쁜 일정 속에 두부의 돌봄 시간이 계속 밀렸다.','돌봄 일정을 확보하고 도움을 구한다',{health:5,cash:-20},'회사 일정만큼 돌봄 시간도 먼저 정했다.'],'c_health')
};
export function extendGameContent(data){
 const story={...data.story,cast:data.story.cast.filter(p=>p.id!=='ai_agent'),peopleUnlock:{...data.story.peopleUnlock},seats:{...data.story.seats},adviceLines:{...data.story.adviceLines}},events=data.events.filter(e=>e.who!=='ai_agent');
 for(const person of EXTRA_CAST){if(story.cast.some(p=>p.id===person.id))continue;story.cast.push(person);story.peopleUnlock[person.id]=person.unlock;story.seats[person.id]={label:person.role,prefs:person.prefs};story.adviceLines[person.id]=Object.fromEntries(['trust','quality','cash','safety','self','people','growth','speed'].map(tag=>[tag,[person.line]]));events.push(encounterEvent(person));}
 return {...data,story,events};
}
