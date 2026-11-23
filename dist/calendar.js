import {roadmapStatus,goalDate} from './plan-roadmap.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const ANNUAL_EVENTS=[
 {month:2,key:'newyear',title:'설 연휴 운영',kind:'risk',who:'public_officer',description:'휴무·배송 지연·짧아지는 영업일에 대비해요.'},
 {month:3,key:'grant',title:'지원사업 신청',kind:'support',who:'public_officer',description:'계획과 증빙을 정리해 선발에 도전해요.'},
 {month:5,key:'selection',title:'지원사업 선발 발표',kind:'support',who:'public_officer',description:'3월 신청 시 결과를 확인해요.'},
 {month:6,key:'exhibition',title:'창업 전시회',kind:'exhibition',who:'creator',description:'고객을 만나고 제품 반응을 확인해요.'},
 {month:8,key:'overseas',title:'해외 출장·시장 조사',kind:'travel',who:'foreign_investor',description:'현지 방문 또는 온라인 상담을 선택해요.'},
 {month:9,key:'chuseok',title:'추석 연휴 운영',kind:'risk',who:'freelancer',description:'납기·재고·고객 응대의 빈틈을 점검해요.'},
 {month:11,key:'demo',title:'연말 데모데이',kind:'exhibition',who:'investor',description:'성과를 공유하고 다음 연결을 만들어요.'},
 {month:12,key:'settlement',title:'연말 결산',kind:'risk',who:'accountant',description:'미수금·증빙·지출을 정리해요.'}
];
export function calendarEntries(state,year){return ANNUAL_EVENTS.map(item=>{const elapsed=(year-1)*12+item.month,id=`calendar_${year}_${item.key}`,answered=state.seenEvents?.includes(id);return {...item,year,elapsed,id,answered,current:elapsed===state.month,requiresApplication:item.key==='selection'&&!state.flags?.includes(`grant_applied_${year}`)};});}
export function calendarEvent(state){
 if(state.ending)return null;
 const year=Math.floor((state.month-1)/12)+1,item=calendarEntries(state,year).find(x=>x.current&&!x.answered&&!x.requiresApplication);if(!item)return null;
 const choices=[],add=(label,fx,out,tags=['trust','safety'])=>choices.push({label,fx,out,tags});
 let text=item.description,card='c_shock';
 if(item.key==='grant'){
  card='c_grant';text='대표님, 올해 지원사업 신청이 열렸어요. 5월 발표 때 운영력과 시장 이해를 합쳐 90점 이상이면 선정돼요. 계획과 증빙을 준비해서 도전해 보실래요?';
  add('계획과 증빙을 준비해 신청한다',{cash:-20,health:-5,management:3,flag:`grant_applied_${year}`,seat:'public_officer',rel:{public_officer:3}},'신청서를 냈다. 5월 발표까지 제품과 시장 검증을 이어가기로 했다.');
  add('이번에는 고객 검증에 집중한다',{insight:2},'지원사업은 건너뛰고 고객을 만나는 시간을 확보했다.',['focus','cash']);
 }else if(item.key==='selection'){
  card='c_grant';const score=state.skills.management+state.skills.insight,selected=score>=90;text=`대표님, 선발 결과가 나왔어요. 현재 운영력과 시장 이해 합계는 ${score}/200점이에요. ${selected?'90점을 넘어 선정되셨어요! 협약을 진행할까요?':'이번에는 90점에 미치지 못했어요. 함께 피드백을 살펴볼까요?'}`;
  if(selected){add('협약을 진행하고 지원금으로 검증한다',{cash:600,health:-4,rel:{public_officer:5}},'지원금 600만 원을 확보했다. 고객 매출과 구분해 사용 계획을 정했다.');add('지금은 고객 사업에 집중한다',{product:3},'협약을 사양하고 현재 제품에 집중했다.',['focus']);}
  else{add('피드백을 정리해 다음 계획을 고친다',{management:5,insight:3,health:-3},'탈락 이유를 다음 실험과 계획에 반영했다.');add('올해는 신청보다 영업에 집중한다',{sales:3},'다음 매출을 만드는 일에 시간을 쓰기로 했다.',['growth']);}
 }else if(item.key==='exhibition'){
  card='c_customer';text='대표님, 이번 창업 전시회에서 고객에게 제품을 소개해 보면 어때요? 직접 부스를 운영할 수도 있고, 온라인으로 참여할 수도 있어요.';
  add('부스로 참가한다',{cash:-70,health:-8,customers:4,insight:5,seat:'creator'},'부스에서 고객의 질문을 듣고 다음 연락처를 남겼다.',['growth','quality']);
  add('온라인 소개 행사에 참가한다',{cash:-20,health:-3,sales:3,network:2},'작은 예산으로 제품 설명과 문의를 모았다.');add('이번 전시회는 건너뛴다',{},'제품과 일정에 집중하기로 했다.',['cash','self']);
 }else if(item.key==='overseas'){
  card='c_expand';text='대표님 제품에 관심 있는 해외 거래처를 찾았어요. 현지에서 직접 만나보실래요, 아니면 온라인 상담부터 시작할까요?';
  add('해외 출장에 참가한다',{cash:-180,health:-10,insight:7,network:6,customers:3,seat:'foreign_investor'},'현지 고객과 유통 환경을 살피고 작은 실험을 약속했다.',['growth','speed']);
  add('온라인 해외 상담에 참가한다',{cash:-30,health:-4,insight:4,network:3,seat:'foreign_investor'},'이동 없이 가설을 확인하고 다음 미팅을 잡았다.');add('국내 고객에 집중한다',{sales:1},'지금의 고객 기반부터 다지기로 했다.',['cash','focus']);
 }else if(item.key==='demo'){
  card='c_terms';text='올해 데모데이에서 대표님 회사의 성과를 들려주실래요? 투자자와 협업사를 만날 수 있어요. 참관만 하셔도 좋아요.';
  add('지표와 조건을 준비해 발표한다',{cash:-40,health:-6,network:6,management:3,seat:'investor'},'성과뿐 아니라 다음 검증 계획도 함께 발표했다.',['growth','trust']);add('참관하며 다른 팀의 발표를 듣는다',{cash:-10,health:-2,insight:3},'우리 회사에 필요한 질문을 적으며 발표를 들었다.');add('이번에는 건너뛴다',{},'일정을 비우고 기존 업무에 집중했다.',['self','cash']);
 }else if(item.key==='settlement'){
  card='c_books';text='대표님, 올해 장부를 보니 매출과 실제 입금 시점이 다른 항목이 있어요. 빠진 증빙도 함께 정리해 볼까요?';
  add('전문가와 미수금·증빙을 대조한다',{cash:-30,health:-3,management:5,hiddenRisk:-5,seat:'accountant'},'처리할 항목과 다음 기한을 명확히 했다.');add('직접 시간을 들여 정리한다',{health:-7,management:3,hiddenRisk:-2},'며칠을 써서 장부의 빈칸을 채웠다.',['cash']);add('다음 해로 미룬다',{hiddenRisk:7},'기록을 미룬 만큼 다음 점검의 부담이 남았다.',['speed']);
 }else{
  const online=['saas','influencer','education'].includes(state.industry);text=online?'대표님, 연휴에 담당자들의 휴가가 겹쳤어요. 문의 답변과 입금 확인이 늦어질 수 있는데, 미리 대응 일정을 정해 둘까요?':'대표님, 연휴를 앞두고 공급과 배송 일정이 밀리고 있어요. 고객에게 늦어질 수 있다고 먼저 알리고, 납기를 조정해 볼까요?';
  add('안내와 대체 일정을 미리 준비한다',{cash:-20,health:-3,management:3},'고객에게 가능한 일정을 알리고 갑작스러운 차질을 줄였다.');
  add('규모를 줄이고 휴식도 확보한다',{cash:-10,health:10,customers:-1},'일부 기회를 내려놓고 감당할 수 있는 일만 진행했다.',['self','safety']);
  add('기존 일정대로 강행한다',{cash:-50,health:-8,customers:-3,hiddenRisk:4},'예상보다 큰 지연으로 추가 비용과 고객 이탈이 생겼다.',['speed','growth']);
 }
 return {id:item.id,title:`${year}년 차 ${item.month}월 · ${item.title}`,text,who:item.who,cat:item.kind==='risk'?'management':'sales',card,calendar:item,choices};
}
export function annualCalendar(state,year){
 const entries=calendarEntries(state,year),kind={risk:'대비',support:'지원사업',exhibition:'행사',travel:'출장'};
 return `<div class="calendar-toolbar"><button class="quiet" data-action="calendar-year" data-year="${year-1}" ${year<=1?'disabled':''}>이전 연차</button><h3>${year}년 차</h3><button class="quiet" data-action="calendar-year" data-year="${year+1}" ${year>=5?'disabled':''}>다음 연차</button></div><div class="annual-calendar">${Array.from({length:12},(_,i)=>{const month=i+1,item=entries.find(x=>x.month===month),current=state.month===(year-1)*12+month;return `<article class="calendar-month ${current?'current':''} ${item?.kind||''}"><span>${month}월 ${current?'<b>이번 달</b>':''}</span>${item?`<small>${kind[item.kind]}</small><h4>${esc(item.title)}</h4><p>${esc(item.description)}</p><em>${item.answered?'선택 완료':item.requiresApplication?'3월 신청 시 발표':item.elapsed<state.month?'지난 일정':'예정'}</em>${current&&!item.answered&&!item.requiresApplication&&!state.ending?`<button class="quiet" data-action="calendar-join" ${state.pending||state.lastScene?.unread?'disabled':''}>${item.kind==='risk'?'대비하기':'참가 여부 결정'}</button>`:''}`:'<p>회사 운영·자유 일정</p>'}</article>`;}).join('')}</div><p class="calendar-footnote">게임용 연간 일정이에요. 연휴는 2월·9월로 고정하며 실제 연도별 공휴일·지원사업 일정과는 달라요.</p>`;
}
export function calendarChoices(state,formatEffects=()=> ''){
 const event=calendarEvent(state);if(!event)return '';
 const blocked=!!state.pending||!!state.lastScene?.unread;
 return `<section class="calendar-choice-card" aria-label="이번 달의 사건 선택"><span class="calendar-choice-kicker">이번 달의 선택</span><h3>${esc(event.title)}</h3><p>${esc(event.text)}</p><div>${event.choices.map((choice,index)=>`<button class="calendar-choice" data-action="calendar-choice" data-index="${index}" ${blocked?'disabled':''}><strong>${esc(choice.label)}</strong><small>예상 변화 · ${esc(formatEffects(choice.fx)||'능력치 변화 없음')}</small></button>`).join('')}</div></section>`;
}
export function assistantBriefing(state){
 const year=Math.floor((Math.min(state.month,60)-1)/12)+1,goal=roadmapStatus(state).find(x=>x.reachedMonth===null);
 const text=state.ending?'이번 도전이 끝났어요. 엔딩 리포트에서 처음 계획과 실제 결과를 나란히 살펴보세요.':state.pending?'사건의 선택지를 고르면 주변 사람의 조언을 들을 수 있어요. 마음이 바뀌면 선택지로 돌아가도 괜찮아요.':state.lastScene?.unread?'선택의 결과를 확인한 뒤 계속하기를 눌러 주세요. 다음 일정은 대표님이 직접 정할 수 있어요.':state.health<35?'체력이 많이 줄었어요. 할 일 고르기에서 휴식을 넣고 예상 남은 체력을 확인해 주세요.':state.plan.length===4?'4주가 모두 채워졌어요! 비용과 체력을 확인하고 이번 달 시작하기를 눌러보세요.':state.plan.length?`지금 ${state.plan.length}주를 채웠어요. 할 일을 더 골라 4주를 완성하세요. 일정의 ×를 누르면 바꿀 수 있어요.`:'할 일 고르기에서 버튼 하나를 누르면 일정에 1주가 추가돼요. 처음이라면 추천 일정으로 네 주를 채워보세요.';
 return `<section class="assistant-briefing"><img src="assets/npc-ai_agent.png" alt="안내 비서 모아"><div><span>안내 비서 모아</span><p>${esc(text)}</p>${goal&&!state.ending?`<small>다음 목표 · ${esc(goal.title)} · ${goalDate(goal.byMonth)}까지</small>`:''}</div><div class="assistant-actions"><button class="primary" data-action="help">플레이 배우기</button><button class="quiet" data-action="calendar-year" data-year="${year}">달력 보기</button></div></section>`;
}
