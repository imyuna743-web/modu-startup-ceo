import {roadmapStatus,syncRoadmap} from './plan-roadmap.js';
import {companyNameFor} from './founder-names.js';
const clip=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const RANKING_KEY='founder-run-ranking-v1';
export function evaluateRun(state){
 const original=state.planRevisions?.[0]?.plan||state.initialPlan;
 const goals=roadmapStatus(syncRoadmap({...state,initialPlan:original})),n=goals.length||1;
 const completed=goals.filter(g=>g.reachedMonth!==null).length,onTime=goals.filter(g=>g.status==='done').length;
 const history=state.history||[],profit=history.reduce((s,r)=>s+(Number.isFinite(r.profit)?r.profit:0),0);
 const months=Math.max(0,...history.map(r=>r.month||0));
 const relationships=Object.entries(state.relations||{}).filter(([id])=>id!=='ai_agent'&&state.seats?.[id]).map(([,v])=>clip(v/100));
 const pieces=[
  {label:'계획 달성',score:Math.round(completed/n*500),max:500,detail:`처음 세운 목표 ${completed} / ${goals.length}개 달성`},
  {label:'기한 준수',score:Math.round(onTime/n*150),max:150,detail:`기한 안에 ${onTime}개 달성`},
  {label:'수익성',score:Math.round(clip(profit/Math.max(1000,(state.initialInvestment||1000)*5))*150),max:150,detail:'누적 월간 손익 ÷ 최초 개인 투자금의 5배 (최소 1,000만 원 기준)'},
  {label:'건강',score:Math.round(clip(state.health/100)*100),max:100,detail:'마지막 체력'},
  {label:'관계',score:Math.round((relationships.length?relationships.reduce((a,b)=>a+b,0)/relationships.length:0)*100),max:100,detail:'만난 인물의 평균 관계 점수 (음수는 0점)'}
 ];
 const score=pieces.reduce((sum,p)=>sum+p.score,0),grade=score>=900?'S':score>=750?'A':score>=600?'B':score>=400?'C':'D';
 return {score,grade,pieces,months,eligible:!!state.ending&&months>0&&goals.length>0&&!state.legacyConditions,group:state.mode==='custom'?'custom':state.difficulty||'normal'};
}
export function legacyRunId(s){let h=2166136261;const source=JSON.stringify([s.name,s.industry,s.portrait,s.initialFinances,s.gauges,s.traits]);for(const c of source)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return `legacy-${h.toString(16)}`;}
export function recordRun(records,state,industryLabel,now=new Date().toISOString()){
 const e=evaluateRun(state);if(!e.eligible)return records;
 const id=state.runId||legacyRunId(state);if(records.some(r=>r.id===id))return records;
 return [...records,{id,name:state.name,company:companyNameFor(state),industry:industryLabel,score:e.score,grade:e.grade,group:e.group,ending:state.ending,months:e.months,auto:!!state.autoSummary,date:now}].slice(-200);
}
export function rankRuns(records,group){return records.filter(r=>r.group===group).sort((a,b)=>b.score-a.score||a.date.localeCompare(b.date)).map((r,i,all)=>({...r,rank:all.findIndex(x=>x.score===r.score)+1}));}
export function readRankings(storage){try{const rows=JSON.parse(storage.getItem(RANKING_KEY));return Array.isArray(rows)?rows.filter(r=>typeof r.id==='string'&&Number.isFinite(r.score)&&typeof r.date==='string'):[];}catch{return [];}}
export function evaluationView(state){const e=evaluateRun(state);return `<section class="run-evaluation"><div class="evaluation-total"><span>경영 평가</span><strong>${e.grade}<b>${e.score.toLocaleString()}<small> / 1,000</small></b></strong><button class="quiet" data-action="rankings">내 기록 순위</button></div><div class="evaluation-pieces">${e.pieces.map(p=>`<div><span>${p.label}</span><b>${p.score}<small> / ${p.max}</small></b><div class="bar"><i style="width:${p.score/p.max*100}%"></i></div></div>`).join('')}</div><details><summary>평가 기준</summary><ul>${e.pieces.map(p=>`<li>${p.label}: ${p.detail}</li>`).join('')}</ul><p>최초 계획을 기준으로 평가해요. 순위는 이 브라우저의 완료 기록끼리, 같은 난이도에서 비교해요. 커스텀 모드는 별도 순위예요.</p></details></section>`;}
export function rankingsView(records,group='normal',currentId=''){
 const rows=rankRuns(records,group),groups={easy:'쉬움',normal:'보통',hard:'어려움',hardcore:'매우 어려움',custom:'커스텀'};
 return `<div class="ranking-tabs">${Object.entries(groups).map(([id,label])=>`<button class="quiet ${group===id?'active':''}" data-action="rankings" data-id="${id}" aria-pressed="${group===id}">${label}</button>`).join('')}</div><p class="ranking-scope">이 브라우저의 완료 기록 · 같은 점수는 공동 순위</p><ol class="run-ranking">${rows.map(r=>`<li class="${r.id===currentId?'current':''}"><b>${r.rank}</b><div><strong>${esc(r.company)}</strong><span>${esc(r.name)} · ${esc(r.industry)} · ${r.months}개월${r.auto?' · 자동 진행':''}</span></div><strong>${r.score}<small>${r.grade}</small></strong></li>`).join('')||'<li>아직 완료한 도전이 없어요.</li>'}</ol>`;
}
