import {PLAN_STEPS,planOptions,planAnswerValues} from './plan-options.js';

const n=value=>Number.isFinite(value)?value:0;
const display=value=>Math.round(value).toLocaleString('ko-KR');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const goalTimings=pace=>({lean:[6,7,8,10,12,12,30,60],normal:[6,7,8,9,10,12,24,60],aggressive:[6,7,8,9,10,12,18,60]})[pace]||[6,7,8,9,10,12,24,60];
const paceLabels={lean:'검증 우선',normal:'균형 성장',aggressive:'빠른 확장'};
export function createRoadmap(state,data){
 const answers=state.initialPlan?.answers||{},chosen=key=>planAnswerValues(answers[key]).filter(id=>id!=='other');
 const names=key=>{const step=PLAN_STEPS.find(x=>x.key===key),options=planOptions(step,data,state.industry);return chosen(key).map(id=>options[id]).filter(Boolean);};
 const paceValues=chosen('runway').map(id=>({lean:0,normal:1,aggressive:2})[id]).filter(Number.isFinite),paceScore=paceValues.length?paceValues.reduce((sum,v)=>sum+v,0)/paceValues.length:1;
 const pace=paceScore<.75?'lean':paceScore>1.25?'aggressive':'normal',timing=goalTimings(pace);
 const industry=data?.industries?.[state.industry],special=industry?.roadmap||{};
 const customers=special.customers||(['saas','influencer','education'].includes(state.industry)?5:10),productTarget=special.product||30,researchTarget=special.research||2;
 const priceValues=chosen('price').map(id=>({low:.8,mid:1,high:1.25})[id]).filter(Number.isFinite),price=priceValues.length?priceValues.reduce((sum,v)=>sum+v,0)/priceValues.length:1;
 const firstRevenue=Math.max(30,Math.ceil(customers*(data?.industries?.[state.industry]?.arpu||10)*price/10)*10),annualRevenue=Math.max(1000,Math.ceil(firstRevenue*({lean:6,normal:9,aggressive:12}[pace])/100)*100);
 const audience=names('customer').join(' · ')||'첫 고객 후보',value=names('value').join(' · ')||'고객이 가장 불편해하는 일',channel=names('acquire').join(' · ')||'직접 제안과 소개';
 const row=(id,title,metric,target,unit,action,why)=>({id,title,metric,target,unit,action,why});
 const milestones=[
  row('validate',special.validate||'고객 가설 확인','researchWeeks',researchTarget,'주',`고객 만나기를 누적 ${researchTarget}주 진행해 필요를 확인하세요.`,`만날 고객 · ${audience}`),
  row('launch',special.launch||'첫 제품 준비','product',productTarget,'점',`제품 만들기로 제품력 ${productTarget}점을 목표로 준비하세요.`,`집중할 가치 · ${value}`),
  row('customers','첫 유료 고객 확보','customers',customers,'명','영업 나가기로 첫 고객을 확보하세요.',`선택한 경로 · ${channel}`),
  row('sales','가격·판매 가설 확인','monthlyRevenue',firstRevenue,'만 원',`한 달 매출 ${display(firstRevenue)}만 원을 목표로 제품과 영업을 함께 개선하세요.`,'선택한 가격대와 업종 객단가를 바탕으로 잡은 목표예요.'),
  row('profit','첫 월간 흑자','profitableMonths',1,'개월','임대료·팀 비용과 활동비를 점검하고 흑자 한 달을 만드세요.',chosen('team').includes('hire')?'직원 인건비를 포함해 고정비를 확인하세요.':chosen('team').includes('cofounder')?'공동창업자와 역할을 나누고 비용을 점검하세요.':'혼자 감당할 업무와 휴식 시간을 먼저 정하세요.'),
  row('annual','첫해 매출 목표','totalRevenue',annualRevenue,'만 원',`12개월 안에 누적 매출 ${display(annualRevenue)}만 원을 기록하세요.`,'투자금·대출금은 매출 목표에 포함하지 않아요.'),
  row('expand',special.expand||'고객 기반 확대','customers',customers*10,'명','제품과 영업을 반복 개선하며 고객 기반을 넓히세요.',chosen('risk').includes('concentration')?'특정 고객 한 곳에만 의존하는 계획을 점검하세요.':`성장 속도 · ${paceLabels[pace]}`),
  row('sustain','5년 운영 완주','months',60,'개월','현금·체력·관계를 함께 지키며 60개월을 운영하세요.','목표를 놓쳤다면 기록을 보고 다음 실행 순서를 조정하세요.')
 ].map((item,index)=>({...item,order:index+1,byMonth:timing[index]}));
 const startMonth=state.planBeforeEdit?state.month:1;
 if(startMonth>1){
  const records=snapshots(state),latest=records.at(-1);
  for(const goal of milestones){
   goal.byMonth=Math.min(60,startMonth+goal.byMonth-1);
   if(goal.id==='annual')goal.title='다음 매출 목표';
   if(goal.id==='customers')goal.title='다음 고객 목표';
   if(goal.id==='launch')goal.title='제품 개선 목표';
   if(goal.id==='profit')goal.title='흑자 유지 목표';
   if(goal.metric==='researchWeeks'||goal.metric==='totalRevenue'||goal.metric==='profitableMonths')goal.target+=n(latest[goal.metric]);
   if(goal.metric==='product')goal.target=Math.min(100,Math.max(goal.target,state.skills.product+10));
   if(goal.metric==='customers')goal.target+=state.customers;
   if(goal.metric==='monthlyRevenue')goal.target=Math.max(goal.target,Math.ceil(state.revenue*1.1/10)*10);
   if(goal.metric==='months')goal.byMonth=60;
   goal.action=goal.metric==='researchWeeks'?`재계획 이후 고객 만나기 ${researchTarget}주를 더 진행하세요.`:goal.metric==='profitableMonths'?'재계획 이후 흑자 한 달을 추가로 만드세요.':goal.metric==='product'?`제품 만들기로 제품력 ${goal.target}점을 목표로 개선하세요.`:goal.metric==='customers'?`고객 ${display(goal.target)}명을 목표로 제품과 영업을 개선하세요.`:goal.metric==='totalRevenue'?`누적 매출 ${display(goal.target)}만 원을 목표로 판매를 이어가세요.`:goal.metric==='monthlyRevenue'?`한 달 매출 ${display(goal.target)}만 원을 목표로 가격·판매 가설을 검증하세요.`:goal.action;
  }
 }
 const risks=chosen('risk'),guardrails=['체력 40 미만이면 다음 일정에 휴식 1주 이상 넣기','현금이 월 고정비 3개월치 아래로 내려가면 확장 비용 점검'];
 if(risks.includes('quality')||risks.includes('delivery'))guardrails.push('품질·납기 문제가 생기면 다음 달 제품 만들기와 고객 만나기를 우선 배치');
 if(risks.includes('people'))guardrails.push('인력 갈등 사건이 생기면 인물수첩의 관계와 조언 확인');
 if(risks.includes('competitor')||risks.includes('outside'))guardrails.push('수요·경쟁 사건이 생기면 고객 가설과 가격대를 다시 점검');
 if(chosen('limit').includes('strict'))guardrails.push('개인 추가 투입 없이 처음 넣은 돈 안에서 운영');
 else if(chosen('limit').includes('flex'))guardrails.push(`개인 누적 투입은 ${display(Math.floor(state.initialInvestment*1.5))}만 원 이내로 관리`);
 return balanceRoadmap({version:3,industry:state.industry,industryLabel:industry?.label||'',pace,paceLabel:paceLabels[pace],createdMonth:startMonth,milestones,guardrails,defaulted:PLAN_STEPS.filter(step=>!chosen(step.key).length).map(step=>step.label)});
}

export function balanceRoadmap(plan){
 if(!plan?.milestones||plan.version>=4)return plan;
 const offset=Math.max(0,(plan.createdMonth||1)-1),customers=plan.milestones.find(g=>g.id==='customers')?.target||10;
 const deadlines={validate:6,launch:7,customers:8,sales:12,profit:18,annual:24,expand:48,sustain:60};
 const milestones=plan.milestones.filter(g=>!['retain','steady-profit','healthy-work','quality'].includes(g.id)).map(g=>({...g,byMonth:Math.min(60,(deadlines[g.id]||g.byMonth)+offset),...(g.id==='annual'?{title:'2년 차 누적 매출',target:g.target*2,action:`2년 차까지 누적 매출 ${display(g.target*2)}만 원을 기록하세요.`}:{}),...(g.id==='profit'?{title:'흑자 전환',action:'비용을 점검하며 2년 차 안에 월간 흑자를 만드세요.'}:{}),...(g.id==='expand'?{title:'4년 차 고객 기반',action:'핵심 고객 기반을 키우며 한 번의 판매를 지속적인 선택으로 바꾸세요.'}:{}),...(g.id==='sustain'?{title:'5년의 회사 운영',action:'현금과 건강을 지키며 다섯 번째 해를 마무리하세요.'}:{})}));
 const extra=(id,title,metric,target,unit,from,by,action,threshold)=>{const fromMonth=Math.min(60,from+offset),byMonth=Math.min(60,by+offset),adjusted=Math.min(target,byMonth-fromMonth+1),year=Math.ceil(byMonth/12);return {id,title:offset?title.replace(/^\d년 차/,year+'년 차'):title,metric,target:adjusted,unit,fromMonth,byMonth,threshold,action:action.replace(/\d개월 연속/,adjusted+'개월 연속').replace(/^\d년 차/,year+'년 차'),why:'반복해서 유지한 월말 기록으로 확인해요.'};};
 milestones.push(extra('retain','2년 차 · 고객 유지','customerStreak',3,'개월 연속',13,24,`고객 ${customers*5}명 이상을 3개월 연속 유지하세요.`,customers*5),extra('steady-profit','3년 차 · 안정적인 흑자','profitStreak',6,'개월 연속',25,36,'3년 차에 월간 흑자를 6개월 연속 이어 가세요.',0),extra('healthy-work','3년 차 · 무너지지 않는 일상','healthStreak',6,'개월 연속',25,36,'3년 차에 체력 40 이상을 6개월 연속 유지하세요.',40),extra('quality','4년 차 · 흔들리지 않는 품질','qualityStreak',6,'개월 연속',37,48,'4년 차에 제품력 70 이상을 6개월 연속 유지하세요.',70));
 return {...plan,version:4,milestones:milestones.sort((a,b)=>a.byMonth-b.byMonth).map((g,i)=>({...g,order:i+1}))};
}

function snapshots(state){
 const snapshots=[],history=[...(state.history||[])].sort((a,b)=>a.month-b.month);let researchWeeks=0,totalRevenue=0,profitableMonths=0,previousMonth=0;const streaks={customerStreak:0,profitStreak:0,healthStreak:0,qualityStreak:0},streakGoals=(state.initialPlan?.roadmap?.milestones||[]).filter(g=>g.metric.endsWith('Streak'));
 if(Number.isFinite(state.initialStats?.skills?.product))snapshots.push({month:0,product:state.initialStats.skills.product});
 for(const row of history){for(const goal of streakGoals){const valid=row.month>=goal.fromMonth&&({customerStreak:row.customers>=goal.threshold,profitStreak:row.profit>0,healthStreak:row.health>=goal.threshold,qualityStreak:row.skills?.product>=goal.threshold})[goal.metric];streaks[goal.metric]=valid?(row.month===previousMonth+1?streaks[goal.metric]+1:1):0;}previousMonth=row.month;researchWeeks+=(row.actions||[]).filter(id=>id==='research').length;totalRevenue+=n(row.revenue);profitableMonths+=row.profit>0?1:0;snapshots.push({month:row.month,...streaks,researchWeeks,product:row.skills?.product,customers:row.customers,monthlyRevenue:row.revenue,profitableMonths,totalRevenue,months:row.month});}
 snapshots.push({month:Math.max(0,state.month-1,state.lastDecisionMonth||0),researchWeeks,product:state.skills?.product,customers:state.customers,monthlyRevenue:state.revenue,profitableMonths,totalRevenue,months:Math.max(0,...history.map(row=>row.month))});
 return snapshots;
}
export function roadmapStatus(state){
 const roadmap=state.initialPlan?.roadmap;if(!roadmap?.milestones)return [];
 const records=snapshots(state),month=Math.max(0,state.month-1);
 return roadmap.milestones.map(goal=>{
  const reached=records.find(row=>(!goal.fromMonth||row.month>=goal.fromMonth)&&Number.isFinite(row[goal.metric])&&row[goal.metric]>=goal.target),saved=state.initialPlan.roadmapProgress?.[goal.id]?.month;
  const reachedMonth=Number.isFinite(saved)?Math.min(saved,reached?.month??saved):reached?.month??null;
  const value=Math.max(0,...records.map(row=>n(row[goal.metric]))),status=reachedMonth!==null?(reachedMonth<=goal.byMonth?'done':'late'):month>=goal.byMonth?'overdue':state.ending?'unfinished':'active';
  return {...goal,value,percent:Math.min(100,value/goal.target*100),reachedMonth,status};
 });
}
export function syncRoadmap(state){
 const old=state.initialPlan?.roadmap;
 if(old?.milestones&&(old.version||0)<4){const prior={...state.initialPlan.roadmapProgress};delete prior.annual;state={...state,initialPlan:{...state.initialPlan,roadmap:balanceRoadmap(old),roadmapProgress:prior}};}

 const progress={...state.initialPlan?.roadmapProgress};let changed=false;
 for(const goal of roadmapStatus(state))if(goal.reachedMonth!==null&&progress[goal.id]?.month!==goal.reachedMonth){progress[goal.id]={month:goal.reachedMonth};changed=true;}
 return changed?{...state,initialPlan:{...state.initialPlan,roadmapProgress:progress}}:state;
}
export const goalDate=month=>month===0?'시작 시점':`${Math.floor((Math.max(1,month)-1)/12)+1}년째 ${((Math.max(1,month)-1)%12)+1}월`;
const statusLabel=goal=>goal.reachedMonth!==null?`충족 · ${goalDate(goal.reachedMonth)} 달성${goal.status==='late'?' · 기한 이후':''}`:`미충족 · ${goal.status==='overdue'?'기한 경과':goal.status==='unfinished'?'도전 종료':'진행 중'}`;
export function roadmapView(state,{compact=false}={}){
 const plan=state.initialPlan?.roadmap;if(!plan)return '<p class="roadmap-missing">이 저장 게임에는 생성된 실행 계획이 없어요. 초기 선택 원본은 아래에서 볼 수 있어요.</p>';
 const goals=roadmapStatus(state),done=goals.filter(g=>g.reachedMonth!==null).length;
 return `<section class="roadmap ${compact?'roadmap-compact':''}"><div class="roadmap-heading"><div><span>${esc(plan.paceLabel)}</span><h3>나의 실행 계획</h3></div><b>${done} / ${goals.length} 달성</b></div><ol class="roadmap-list">${goals.map(goal=>`<li class="roadmap-goal ${goal.status}"><span class="roadmap-checkbox ${goal.reachedMonth!==null?'checked':''}" role="img" aria-label="${goal.reachedMonth!==null?'달성':'미달성'}">${goal.reachedMonth!==null?'✓':''}</span><div class="roadmap-goal-body"><div class="roadmap-goal-heading"><h4>${esc(goal.title)}</h4><span>${goalDate(goal.byMonth)}까지</span></div><p>${esc(goal.action)}</p>${compact?'':`<small>${esc(goal.why)}</small>`}<div class="roadmap-goal-progress"><span>${esc(statusLabel(goal))}</span><strong>${display(goal.value)} / ${display(goal.target)}${esc(goal.unit)}</strong></div><div class="quest-progress"><i style="width:${goal.percent}%"></i></div></div></li>`).join('')}</ol>${compact?'':`<div class="roadmap-guardrails"><h4>운영 중 점검할 기준</h4><ul>${plan.guardrails.map(rule=>`<li>${esc(rule)}</li>`).join('')}</ul></div>${plan.defaulted.length?`<p class="roadmap-defaults">미선택 항목: ${esc(plan.defaulted.join(' · '))}. 이 항목은 기본 가정으로 목표를 정했어요.</p>`:''}`}</section>`;
}
export function roadmapSummary(state){
 const goals=roadmapStatus(state);if(!goals.length)return '';
 const goal=goals.find(g=>g.reachedMonth===null),done=goals.filter(g=>g.reachedMonth!==null).length;
 return `<section class="card roadmap-summary"><div><span>나의 실행 계획 · ${done} / ${goals.length}</span><strong>${goal?`${goal.order}번째 목표 · ${esc(goal.title)}`:'모든 실행 목표 달성'}</strong><small>${goal?`${goalDate(goal.byMonth)}까지 · ${esc(statusLabel(goal))}`:'처음 세운 목표를 모두 채웠어요.'}</small></div><button class="quiet" data-action="initial-plan">계획 보기</button></section>`;
}
