import {GAUGES} from './background.js';
const seatNames={family:'가족',friend:'친구',partner:'배우자',mentor:'멘토',investor:'투자자',customer:'고객',cofounder:'공동창업자',staff:'직원'};
const flagNames={seeded:'시드 투자 유치',funded:'투자 유치',series_a:'시리즈 A',hired_first:'첫 채용',skipped_books:'미룬 회계 처리',equity_verbal:'구두 지분 약속',copycat:'경쟁사의 모방'};
const fmt=n=>Number.isFinite(n)?Math.round(n*10)/10:'∞';
export function runway(s){if(s.cash<0)return 0;const burn=s.history?.length?(s.monthlyExpense??s.history.at(-1)?.expense??(s.revenue-s.profit))-s.revenue:(s.monthlyFixed??120);return burn<=0?Infinity:s.cash/burn;}
export function checkRequirements(s,req={}){
 const checks=[],push=(ok,text)=>checks.push({ok:!!ok,text});
 for(const [key,value]of Object.entries(req||{})){
  if(key==='g'){for(const [g,[min,max]]of Object.entries(value)){const current=s.gauges?.[g];const range=min<=1?`${max} 이하`:max>=100?`${min} 이상`:`${min}–${max}`;push(Number.isFinite(current)&&current>=min&&current<=max,`${GAUGES[g]||g} ${range} · 현재 ${current??'미설정'}`);}continue;}
  if(key==='flag'||key==='noFlag'){const has=s.flags?.includes(value);push(key==='flag'?has:!has,`${flagNames[value]||value} ${key==='flag'?'경험 필요':'이전'}`);continue;}
  if(key==='seat'||key==='noSeat'){const has=!!s.seats?.[value];push(key==='seat'?has:!has,`${seatNames[value]||value} ${key==='seat'?'관계 필요':'관계가 없을 때'}`);continue;}
  const values={minTeam:[s.team??0,'직원','명'],minCash:[s.cash,'회사 현금','만 원'],minRev:[s.revenue,'월 매출','만 원'],maxRev:[s.revenue,'월 매출','만 원'],minCustomers:[s.customers,'고객','명'],maxHealth:[s.health,'체력',''],minHidden:[s.hiddenRisk??5,'누적 위험',''],maxEquity:[s.equity??100,'대표 지분','%'],minRunway:[runway(s),'런웨이','개월'],maxRunway:[runway(s),'런웨이','개월'],minTurn:[Math.max(0,s.month-1),'진행 기간','개월']};
  if(key==='customerSample'){const n=s.industry==='influencer'?4:30;push(s.customers>=n,`고객 ${n}명 이상 · 현재 ${s.customers}명`);continue;}
  if(values[key]){const [current,label,unit]=values[key],isMax=key.startsWith('max');push(isMax?current<=value:current>=value,`${label} ${value}${unit} ${isMax?'이하':'이상'} · 현재 ${fmt(current)}${unit}`);}
  else push(false,'추가 조건을 확인할 수 없는 선택');
 }
 return {ok:checks.every(x=>x.ok),checks,reasons:checks.filter(x=>!x.ok).map(x=>x.text)};
}
export function choiceAvailability(s,c){
 const status=checkRequirements(s,c.req);const add=(ok,text)=>status.checks.push({ok:!!ok,text});
 if(c.special==='inject')add((s.reserve??0)>0&&s.investmentLimit!=='strict'&&(s.investmentLimit!=='flex'||(s.invested??0)<(s.initialInvestment??0)*1.5),`개인 비상금과 투자 한계선 · 비상금 ${Math.round(s.reserve??0).toLocaleString()}만 원`);
 if(c.special==='family_loan')add((s.relations?.family??0)>-40,`가족 관계 −40 초과 · 현재 ${s.relations?.family??0}`);
 if(c.special==='guarantee_loan')add((s.guarantee??0)<30000,`개인 보증 30,000만 원 미만 · 현재 ${Math.round(s.guarantee??0).toLocaleString()}만 원`);
 if(Number(c.fx?.cash)<0)add(s.cash+c.fx.cash>=0,`선택 비용 ${Math.abs(c.fx.cash).toLocaleString()}만 원 · 현재 현금 ${Math.round(s.cash).toLocaleString()}만 원`);
 status.ok=status.checks.every(x=>x.ok);status.reasons=status.checks.filter(x=>!x.ok).map(x=>x.text);return status;
}
export function growthStage(s,data){const tiers=data.industries[s.industry].stageRev||[0,1,400,1500,6000,20000];let result=0;for(let i=1;i<tiers.length;i++)if(s.revenue>=tiers[i])result=i;return result;}
export function eventAvailability(s,event,data){
 const status=checkRequirements(s,event.req),add=(ok,text)=>status.checks.push({ok:!!ok,text});
 if(event.ind)add(Array.isArray(event.ind)?event.ind.includes(s.industry):event.ind===s.industry,'해당 업종에서 발생');
 if(event.stage){const n=growthStage(s,data),[min,max]=event.stage;const pre=n===0&&event.prelaunchFrom&&s.month-1>=event.prelaunchFrom;add((n>=min&&n<=max)||pre,`사업 ${min}–${max}단계 · 현재 ${n}단계${event.prelaunchFrom?` (준비 중에는 ${event.prelaunchFrom}개월부터)`:''}`);}
 status.ok=status.checks.every(x=>x.ok);status.reasons=status.checks.filter(x=>!x.ok).map(x=>x.text);return status;
}
export const KEY_OPPORTUNITIES=[['e_grant','a'],['e_grant','b'],['e_big_client','c'],['e_influencer','a'],['e_angel','b'],['e_expand','a'],['e_overwork','c'],['e_focus','c']];

// Starting gauges stay fixed for the entire run. All other requirements may change.
export function hasPermanentGaugeLock(s,...requirements){
 return requirements.some(req=>Object.entries(req?.g||{}).some(([key,[min,max]])=>{
  const value=s.gauges?.[key];
  return Number.isFinite(value)&&(value<min||value>max);
 }));
}
export function choicesWithPermanentLast(s,choices,eventReq){
 return choices.map((choice,index)=>({choice,index,permanent:hasPermanentGaugeLock(s,eventReq,choice.req)}))
  .sort((a,b)=>Number(a.permanent)-Number(b.permanent));
}
