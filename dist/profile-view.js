import {countNumber} from './count-motion.js';
import {roadmapView,createRoadmap} from './plan-roadmap.js';
import {runway,growthStage} from './conditions.js';
import {statIcon,gaugesHTML,traitsHTML} from './stat-view.js';

export function profileView(s,data,esc){
 const run=runway(s);
 const metrics=[
  ['cash','회사 현금',countNumber('cash',s.cash)+'만'],
  ['reserve','개인 비상금',countNumber('reserve',s.reserve)+'만'],
  ['runway','런웨이',Number.isFinite(run)?countNumber('runway',run,1)+'개월':'순지출 없음'],
  ['team','직원',countNumber('team',s.team)+'명'],
  ['equity','대표 지분',countNumber('equity',s.equity)+'%'],
  ['debt','총부채',countNumber('debt',s.debt)+'만'],
  ['guarantee','개인 보증',countNumber('guarantee',s.guarantee)+'만'],
  ['risk','누적 위험',countNumber('hidden-risk',s.hiddenRisk)+'/100']
 ];
 return `<section class="card conditions-overview"><div class="section-title"><h2>기본 능력치</h2></div>${s.legacyConditions?'<p class="small-note">이전 저장 기록의 현금과 능력치는 유지했어요. 새 출발 조건은 기존 능력치를 기준으로 연결했습니다.</p>':''}${gaugesHTML(s.gauges)}<div class="founder-experience">${s.founderType==='experienced'?'기창업가 · 창업 경험 있음 · 운영력 +4 · 시장 이해 +2':'예비 창업가 · 창업 경험 없음'}</div></section>
 <section class="card conditions-overview"><div class="section-title"><h2>세부 능력치</h2><span class="stat-mode-tag">9가지 무작위 특성</span></div>${traitsHTML(s.traits,esc)}</section>
 <section class="card conditions-overview"><div class="section-title"><h2>경영 조건</h2><span class="stat-mode-tag">사업 ${growthStage(s,data)}단계</span></div><div class="business-condition-grid">${metrics.map(([key,label,value])=>`<div class="business-metric"><div class="business-icon">${statIcon(key)}</div><div><span>${label}</span><strong>${value}</strong></div></div>`).join('')}</div><label class="investment-setting">개인 자금 투입 기준<select class="field" id="investment-limit">${[['strict','더 넣지 않기'],['flex','최초 자기 투자금의 150%까지'],['open','남은 비상금 내에서 투입']].map(([id,label])=>`<option value="${id}" ${s.investmentLimit===id?'selected':''}>${label}</option>`).join('')}</select></label><p class="small-note">현재 누적 자기 투자 ${s.invested.toLocaleString()}만 원 · 최초 ${s.initialInvestment.toLocaleString()}만 원. 자금이 부족할 때 개인 돈·가족 차입·보증대출의 조건을 확인할 수 있어요.</p></section>
 <div class="condition-list-heading"><h2>나의 목표와 달성 날짜</h2><p>초기 계획을 실행 가능한 목표로 나눴어요. 충족 여부와 기한을 확인하세요.</p></div>${roadmapView(s.initialPlan?.roadmap?s:{...s,initialPlan:{...s.initialPlan,roadmap:createRoadmap(s,data)}})}`;
}
