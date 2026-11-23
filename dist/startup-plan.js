import {costs} from './engine.js';

import {PLAN_STEPS,planOptions,planAnswerValues} from './plan-options.js';
import {createRoadmap,syncRoadmap} from './plan-roadmap.js';
export {PLAN_STEPS,planOptions,planAnswerValues} from './plan-options.js';
export const freshInitialPlan=()=>({step:0,answers:{},completed:false,applied:false});
function validPlanValue(state,key,value,data){
 const step=PLAN_STEPS.find(x=>x.key===key);
 return !!step&&!state.initialPlan?.completed&&((value==='other'&&planAnswerValues(state.initialPlan?.answers?.[key]).includes('other'))||value===''||Object.hasOwn(planOptions(step,data,state.industry),value));
}
export function setPlanAnswer(state,key,value,text='',data){
 if(!validPlanValue(state,key,value,data))return state;
 const s=structuredClone(state);s.initialPlan??=freshInitialPlan();
 if(!value)delete s.initialPlan.answers[key];else s.initialPlan.answers[key]={values:[value],text:value==='other'?String(text).trimStart().slice(0,160):''};
 return s;
}
export function togglePlanAnswer(state,key,value,data){
 if(!value||!validPlanValue(state,key,value,data))return state;
 const s=structuredClone(state);s.initialPlan??=freshInitialPlan();
 const answer=s.initialPlan.answers[key],selected=planAnswerValues(answer);
 const values=selected.includes(value)?selected.filter(v=>v!==value):[...selected,value];
 if(values.length)s.initialPlan.answers[key]={values,text:answer?.text||''};else delete s.initialPlan.answers[key];
 return s;
}
export function toggleAllPlanAnswers(state,data){
 if(state.initialPlan?.completed)return state;
 const step=PLAN_STEPS[state.initialPlan?.step||0],values=Object.keys(planOptions(step,data,state.industry)),selected=planAnswerValues(state.initialPlan?.answers?.[step.key]);
 const s=structuredClone(state);s.initialPlan??=freshInitialPlan();
 if(values.every(id=>selected.includes(id)))delete s.initialPlan.answers[step.key];
 else s.initialPlan.answers[step.key]={values,text:''};
 return s;
}
export function randomizePlanAnswers(state,data,{all=false,rng=Math.random}={}){
 if(state.initialPlan?.completed)return state;
 const s=structuredClone(state);s.initialPlan??=freshInitialPlan();
 for(const step of all?PLAN_STEPS:[PLAN_STEPS[s.initialPlan.step]]){
  const values=Object.keys(planOptions(step,data,s.industry));
  const index=Math.min(values.length-1,Math.max(0,Math.floor(rng()*values.length)));
  s.initialPlan.answers[step.key]={values:[values[index]],text:''};
 }
 if(all)s.initialPlan.step=0;
 return s;
}
export function setPlanNote(state,key,text,data){
 if(!validPlanValue(state,key,'other',data))return state;
 const s=structuredClone(state);s.initialPlan??=freshInitialPlan();
 const selected=planAnswerValues(s.initialPlan.answers[key]);
 s.initialPlan.answers[key]={values:selected.includes('other')?[...selected]:[...selected,'other'],text:String(text).trimStart().slice(0,160)};
 return s;
}
export function movePlanStep(state,direction){
 const s=structuredClone(state);s.initialPlan??=freshInitialPlan();
 s.initialPlan.step=Math.max(0,Math.min(PLAN_STEPS.length-1,s.initialPlan.step+direction));return s;
}
export function planAnswerLabel(state,step,data){
 const answer=state.initialPlan?.answers?.[step.key],options=planOptions(step,data,state.industry);
 return planAnswerValues(answer).map(value=>value==='other'?answer.text?.trim():options[value]).filter(Boolean).join(' · ')||'미작성';
}
const average=values=>values.length?values.reduce((sum,n)=>sum+n,0)/values.length:null;
export function planEffects(answers){
 const selected=key=>planAnswerValues(answers[key]);
 const spending=selected('runway').map(value=>({lean:[.85,.9],normal:[1,1],aggressive:[1.25,1.2]})[value]).filter(Boolean);
 return {
  price:average(selected('price').map(value=>({low:.8,mid:1,high:1.25})[value]).filter(Number.isFinite)),
  fixed:average(spending.map(x=>x[0])),demand:average(spending.map(x=>x[1])),
  cofounder:selected('team').includes('cofounder'),hire:selected('team').includes('hire'),
  limit:selected('limit').includes('strict')?'strict':selected('limit').includes('flex')?'flex':null
 };
}
export function planSelectionHint(state,key){
 const selected=planAnswerValues(state.initialPlan?.answers[key]).filter(v=>v!=='other');
 if(selected.length<2)return '';
 const effect=planEffects(state.initialPlan.answers),number=n=>Number(n.toFixed(3)),percent=n=>`${n>=1?'+':''}${Number(((n-1)*100).toFixed(1))}%`;
 if(key==='price')return `평균 적용 · 객단가 ×${number(effect.price)}`;
 if(key==='runway')return `평균 적용 · 고정비 ${percent(effect.fixed)} · 고객 유입 ${percent(effect.demand)}`;
 if(key==='team')return `함께 시작 · ${[effect.cofounder?'공동창업자':'',effect.hire?'직원 1명':''].filter(Boolean).join(' · ')}`;
 if(key==='limit')return '더 낮은 한도 적용 · 처음 넣은 돈까지만';
 return '';
}
export function finishInitialPlan(state,data){
 if(state.initialPlan?.applied)return state;
 const s=structuredClone(state);s.initialPlan??=freshInitialPlan();const effect=planEffects(s.initialPlan.answers);
 if(s.planBeforeEdit){
  const previous=s.planBeforeEdit;
  s.initialPlan={...s.initialPlan,completed:true,applied:true,step:PLAN_STEPS.length-1,baseline:previous.baseline,revisedMonth:s.month};
  s.initialPlan.roadmap=createRoadmap(s,data);s.initialPlan.roadmapProgress={};
  s.planRevisions=[...(s.planRevisions||[]),{month:s.month,plan:previous}];delete s.planBeforeEdit;
  s.journal.unshift({month:s.month,title:'실행 계획 다시 세우기',text:`${s.month}개월 차의 상태를 기준으로 목표와 기한을 다시 정했다.`,type:'plan'});
  return syncRoadmap(s);
 }
 // Unanswered and free-text entries are neutral. Only explicit choices set rules.
 if(effect.price!==null)s.arpuMod=effect.price-1;
 if(effect.fixed!==null){s.baseFixed=Math.round(s.baseFixed*effect.fixed);s.demandMod=effect.demand-1;}
 if(effect.cofounder){s.seats.cofounder=true;s.equity=70;s.capacity+=1;s.relations.cofounder??=15;}
 if(effect.hire){s.team=1;s.seats.staff=true;s.relations.staff??=15;}
 if(effect.limit)s.investmentLimit=effect.limit;
 s.initialPlan.completed=true;s.initialPlan.applied=true;s.initialPlan.step=PLAN_STEPS.length-1;
 s.monthlyFixed=costs(s);
 s.initialPlan.baseline={fixed:s.monthlyFixed,team:s.team,equity:s.equity,health:s.health,relations:structuredClone(s.relations)};
 s.initialPlan.roadmap=createRoadmap(s,data);
 s.journal.unshift({month:1,title:'초기 계획서',text:'선택을 바탕으로 순서와 기한이 있는 실행 계획을 세웠다.',type:'plan'});
 return syncRoadmap(s);
}
export function startPlanRevision(state){
 if(state.ending||state.pending||state.lastScene?.unread||!state.initialPlan?.completed||state.planBeforeEdit)return state;
 return {...state,planBeforeEdit:structuredClone(state.initialPlan),initialPlan:{...freshInitialPlan(),answers:structuredClone(state.initialPlan.answers)}};
}
export function cancelPlanRevision(state){if(!state.planBeforeEdit)return state;const s={...state,initialPlan:state.planBeforeEdit};delete s.planBeforeEdit;return s;}
export function planChoiceHint(key,value){
 return ({price:{low:'객단가 ×0.8',mid:'객단가 유지',high:'객단가 ×1.25'},runway:{lean:'기본 고정비 −15% · 고객 유입 −10%',normal:'기본 비용·유입 유지',aggressive:'기본 고정비 +25% · 고객 유입 +20%'},team:{solo:'지분 100%',cofounder:'지분 70% · 공동창업자 합류',hire:'직원 1명 · 월 인건비 추가'},limit:{strict:'개인 비상금 추가 투입 불가',flex:'초기 투자금의 1.5배까지'}})[key]?.[value]||'';
}

