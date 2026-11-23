import {ACTIONS,SKILLS,forecast,runMonth,requestFinancing,requiresProduct,costs} from './engine.js';
import {choiceAvailability} from './conditions.js';
import {finishInitialPlan} from './startup-plan.js';
import {prepareDecision,resolveDecision,groupAdvice,acknowledgeScene} from './story-engine.js';

export const AUTO_STEP_MS=1600; // Normal scene reading interval: 3200 ms. Auto plays at 2×.
export function autoChoiceScore(state,choice){
 const f=choice.fx||{};
 let score=choice.end?-1000:0;
 score+=Math.max(-35,Math.min(35,(f.cash||0)/Math.max(100,costs(state))*3));
 score+=(f.health||0)*(state.health<40?3:.6);
 for(const k of Object.keys(SKILLS))score+=(f[k]||0)*(k==='product'&&state.skills.product<30?3:.7);
 score+=(f.customers||0)*.4+(f.custPct||0)*.2-(f.costMod||0)*.12-(f.hiddenRisk||0)*.8+(f.equity||0)*.2-(f.debt||0)*.002;
 if(state.health+(f.health||0)<15)score-=200;
 if(state.cash+(f.cash||0)<costs(state))score-=30;
 if(choice.special==='inject')score+=80;
 if(choice.special==='family_loan')score+=40;
 if(choice.special==='guarantee_loan')score+=state.debt<5000?20:-60;
 if(choice.special==='layoff')score+=state.team>0&&state.cash<costs(state)*2?50:-40;
 return score;
}
export function pickAutoChoice(state){
 return state.pending?.choices.map((choice,index)=>({choice,index,score:autoChoiceScore(state,choice)}))
  .filter(x=>choiceAvailability(state,x.choice).ok).sort((a,b)=>b.score-a.score||a.index-b.index)[0]?.index??-1;
}
export function autoPlan(state,data){
 if(state.plan.length===4&&forecast(state,data).cashAfterCosts>=0&&(!requiresProduct(state)||state.plan.includes('build')))return state.plan;
 const choices=state.skills.product<30?
  [['build','build','study','rest'],['research','build','rest','rest'],['build','rest','rest','rest']]:
  [['research','build','sales','rest'],['build','sales','rest','rest'],['research','sales','rest','rest'],['build','study','rest','rest']];
 choices.push(['build','rest','rest','rest'],['research','rest','rest','rest'],['study','rest','rest','rest'],['rest','rest','rest','rest']);
 // Try preserving the player's unfinished plan first, while allowing a cheaper plan if needed.
 if(state.plan.length)choices.unshift([...state.plan,...Array(4-state.plan.length).fill('rest')]);
 const candidates=choices.filter(plan=>!requiresProduct(state)||plan.includes('build')).map(plan=>{
  const f=forecast({...state,plan},data);let score=(f.health-state.health)*(state.health<40?2:state.health<65?1.2:.15);
  for(const id of plan){const a=ACTIONS.find(a=>a.id===id);for(const [k,n]of Object.entries(a.fx))score+=Math.min(100-state.skills[k],n)*(k==='product'&&state.skills.product<30?3:.65);if(id==='sales')score+=8;}
  if(f.health<20)score-=200;
  score-=f.cost/Math.max(50,state.cash)*15;
  return {plan,f,score};
 }).sort((a,b)=>b.score-a.score);
 return (candidates.find(x=>x.f.cashAfterCosts>=0)||candidates.sort((a,b)=>a.f.cost-b.f.cost)[0]).plan;
}
export function advanceAutomated(state,data){
 if(state.initialPlan&&!state.initialPlan.completed)return {state:finishInitialPlan(state,data),kind:'plan'};
 if(state.lastScene?.unread)return {state:acknowledgeScene(state),kind:'acknowledge'};
 if(state.ending)return {state,kind:'ending'};
 if(state.pending){
  if(state.pending.phase!=='advice'){
   const index=pickAutoChoice(state);
   if(index<0)return {state,kind:'blocked',error:'선택 가능한 대응이 없어 자동 진행을 멈췄어요.'};
   return {state:prepareDecision(state,index,data.story),kind:'advice'};
  }
  const preferred=state.pending.selectedChoice;
  const groups=groupAdvice(state,data.story).filter(g=>g.members.length);
  const role=(groups.find(g=>g.index===preferred)||groups[0])?.stance||'self';
  const next=resolveDecision(state,role,data);
  return next===state?{state,kind:'blocked',error:'선택 조건이 달라져 자동 진행을 멈췄어요.'}:{state:next,kind:'result'};
 }
 const s={...state,plan:autoPlan(state,data)};
 if(forecast(s,data).cashAfterCosts<0){
  const next=requestFinancing(s,data);
  return next.pending?{state:next,kind:'event'}:{state,kind:'blocked',error:'자금을 마련하지 못해 자동 진행을 멈췄어요.'};
 }
 const result=runMonth(s,data);
 return result.error?{state,kind:'blocked',error:result.error}:{...result,kind:result.calendar?'event':'month'};
}
export function simulateToEnding(state,data,maxSteps=1200){
 let current=structuredClone(state),steps=0;const fromMonth=current.month,initialDecisions=current.adviceHistory?.length||0;
 while((!current.ending||current.lastScene?.unread)&&steps<maxSteps){
  const result=advanceAutomated(current,data);if(result.error)return {state:current,error:result.error,steps};
  current=result.state;steps++;
 }
 if(!current.ending)return {state:current,error:'자동 진행 한도에 도달했어요. 현재 지점부터 이어할 수 있어요.',steps};
 current.autoSummary={fromMonth,toMonth:Math.min(60,current.month-1),decisions:(current.adviceHistory?.length||0)-initialDecisions,steps};
 return {state:current,steps};
}
