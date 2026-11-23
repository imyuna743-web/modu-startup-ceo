import {evaluationView} from './run-evaluation.js';
import {roadmapView} from './plan-roadmap.js';
import {buildEndingReport,money,signedMoney} from './ending-report.js';
import {statIcon,statSymbol} from './stat-view.js';
import {endingMood,moodStyle} from './ending-mood.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=value=>Math.round(value).toLocaleString('ko-KR');
const delta=value=>value===null?'시작 기록 없음':`${value>0?'+':''}${num(value)}`;
export const moneyTone=value=>value>0?'money-positive':value<0?'money-negative':'money-neutral';
const metric=(icon,label,value,amount)=>`<div class="end-metric">${statSymbol(icon,label)}<strong class="${Number.isFinite(amount)?moneyTone(amount):''}">${esc(value)}</strong></div>`;
const financialRow=(label,value)=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`;

export function resultCardPreview(card){
 const mood=endingMood(card.ending);
 return `<div class="result-postcard" data-mood="${esc(card.ending)}" data-atmosphere="${mood.effect}" style="${moodStyle(mood)}" aria-label="${esc(card.name)} 대표의 ${esc(card.keyword)} 결과 카드">
  <img class="postcard-background" src="${esc(card.background)}" alt="${esc(card.keyword)} 엔딩 일러스트">
  <div class="postcard-shade"></div><div class="postcard-atmosphere" aria-hidden="true"></div><div class="postcard-brand"><img src="assets/mv-logo-blue.png" alt="">모두의 창업</div>
  <div class="postcard-title"><span>나의 창업 엔딩</span><strong>${esc(card.keyword)}</strong><p>${card.months}개월의 기록</p></div>
  <img class="postcard-portrait" src="${esc(card.standing||card.portrait)}" alt="${esc(card.name)} 대표 캐릭터">
  <div class="postcard-person"><strong>${esc(card.name)} 대표</strong><span>${esc(card.industry)}</span></div>
  <div class="postcard-bottom"><div><span>대표 레벨</span><b>Lv. ${card.level}</b></div><div><span>고객</span><b>${num(card.customers)}명</b></div><small class="postcard-mood-caption">${esc(mood.caption)}</small><small>${esc(card.place)} · ${esc(card.season)}</small></div>
 </div>`;
}

function financeView(report){
 const f=report.finances;
 if(!f.known)return `<div class="report-unavailable">${esc(f.reason)}<br>회사 현금 ${money(f.cash)}은 최종 지표에서 확인할 수 있어요.</div>`;
 return `<div class="personal-profit"><div><span>추정 개인 손익</span><strong class="${moneyTone(f.personalPL)}">${signedMoney(f.personalPL)}</strong><small>현재 회사 현금을 정산한다고 가정한 게임 내 추정치</small></div>
 <dl>${financialRow('추정 회수액',money(f.recovery))}${financialRow('− 누적 개인 투입',money(f.invested))}${financialRow('− 추정 개인 부담',money(f.personalBurden))}</dl></div>
 <div class="finance-columns"><dl class="end-ledger">${financialRow('최초 개인 투입',money(f.initialInvestment))}${financialRow('추가 개인 투입',money(f.additional))}${financialRow('개인 비상금 잔액',money(f.reserve))}${financialRow('대표 지분',`${f.equity}%`)}</dl>
 <dl class="end-ledger">${financialRow('회사 현금',money(f.cash))}${financialRow('회사 총부채',money(f.debt))}${financialRow('그중 가족 차입',money(f.familyDebt))}${financialRow('그중 개인 보증',money(f.guarantee))}</dl></div>
 <details class="finance-method"><summary>손익 계산 기준</summary><p>회사 현금으로 회사 부채를 먼저 갚고, 남은 현금에 대표 지분을 곱해 추정 회수액을 계산해요. 현금이 부채보다 적으면 부족분 중 가족 차입·개인 보증 한도만큼을 개인 부담으로 가정해요. 가족 차입과 보증은 총부채에 포함되어 있어 중복으로 빼지 않아요.</p><p>추정 개인 손익 = 추정 회수액 − 누적 개인 투입 − 추정 개인 부담. 실제 매각대금·급여·배당은 기록되지 않아 포함하지 않았어요. 기업가치, 설비의 처분가, 세금·정리 비용도 제외돼요. 상장·인수합병 엔딩도 같은 현금 정산 가정이며 실제 매각 수익을 뜻하지 않아요.</p></details>`;
}

export function endingView(state,data){
 const r=buildEndingReport(state,data),s=r.share,f=r.finances;
 return `<div class="ending-page" data-ending="${esc(state.ending)}">
 <section class="card ending-hero" data-tone="${r.ending.tone}"><div class="ending-intro">
  ${state.autoSummary?`<div class="end-auto-note">자동 진행 · ${esc(state.autoSummary.fromMonth)}개월 차부터 · ${esc(state.autoSummary.decisions)}번의 결정</div>`:''}
  <div class="end-kicker">나의 창업 엔딩</div><h2><span class="ending-keyword">${esc(r.ending.keyword)}</span>${esc(r.ending.title)}</h2><p class="ending-description">${esc(r.ending.body)}</p>
  <div class="ending-stats">${metric('runway','보낸 시간',`${r.months}개월`)}${metric('career','대표 레벨',`Lv. ${r.level}`)}${metric('team','고객',`${num(s.customers)}명`)}${metric('cash','회사 현금',money(s.cash))}</div>
  <div class="ending-actions"><button class="primary" data-action="new">새로 시작하기</button><button class="quiet" data-view="growth">성장 기록 보기</button></div>
 </div><div class="ending-share-preview">${resultCardPreview(s)}<button class="primary result-share-open" data-action="ending-card">${statIcon('equity')}결과 카드 저장 · 공유</button></div></section>
 <nav class="ending-report-nav" aria-label="엔딩 리포트 목차"><a href="#plan-retrospective">계획 복기</a><a href="#ending-finances">최종 지표 · 손익</a><a href="#ending-life">나에게 남은 것</a><a href="#ending-readings">아침편지</a></nav>
 <section class="card end-report-section" id="plan-retrospective"><div class="end-section-heading"><span>01</span><div><h2>계획 복기 리포트</h2></div><button class="quiet" data-action="initial-plan">원본 보기</button></div>
 ${evaluationView(state)}<div class="plan-comparison-wrap"><table class="plan-comparison"><thead><tr><th scope="col">항목</th><th scope="col">처음 계획서 원본</th><th scope="col">실제로 이뤄진 것</th></tr></thead><tbody>${r.comparisons.map(row=>`<tr><th scope="row">${esc(row.label)}</th><td data-label="처음 계획" class="${row.original==='미작성'?'plan-empty':''}">${esc(row.original)}</td><td data-label="실제 결과"><strong>${esc(row.actual)}</strong><small>${esc(row.note)}</small></td></tr>`).join('')}</tbody></table></div>

 ${state.initialPlan?.roadmap?roadmapView(state,{compact:true}):''}<h3 class="end-gap-title">처음 계획의 보완점 3가지</h3><div class="plan-gaps">${r.gaps.map((gap,i)=>`<article><div><span class="gap-number">${i+1}</span><span class="gap-kind">${esc(gap.kind)}</span></div><h4>${esc(gap.title)}</h4><p>${esc(gap.evidence)}</p><div class="gap-next"><b>다음 계획에는</b>${esc(gap.next.replace(/^다음 계획에는 /,''))}</div></article>`).join('')}</div></section>
 <section class="card end-report-section" id="ending-finances"><div class="end-section-heading"><span>02</span><div><h2>최종 지표와 개인 손익</h2><p>회사의 성과와 대표 개인의 돈을 나누어 봐요.</p></div></div>
 <div class="final-metrics">${metric('sales','누적 매출',signedMoney(r.metrics.revenue),r.metrics.revenue)}${metric('cash','누적 월간 손익',signedMoney(r.metrics.profit),r.metrics.profit)}${metric('product','마지막 월 매출',signedMoney(r.metrics.lastRevenue),r.metrics.lastRevenue)}${metric('insight','마지막 월 손익',signedMoney(r.metrics.lastProfit),r.metrics.lastProfit)}${metric('team','직원',`${r.metrics.team}명`)}${metric('equity','대표 지분',`${r.metrics.equity}%`)}${metric('management','모은 배움',`${r.metrics.lessons}개`)}${metric('person','기록된 결정',`${r.metrics.decisions}번`)}</div>
 <p class="end-footnote">누적 매출·손익은 ${state.history?.length||0}개월의 월말 정산 합계예요. 사건의 현금 효과·투자금·대출금은 월간 손익에 포함되지 않아요.</p>${financeView(r)}</section>
 <section class="card end-report-section" id="ending-life"><div class="end-section-heading"><span>03</span><div><h2>나에게 남은 것</h2><p>재산, 건강, 인간관계, 평판을 함께 돌아봐요.</p></div></div>
 <div class="life-outcomes"><article>${statSymbol('reserve','재산')}<strong>${f.known?money(f.wealth):'기록 없음'}</strong></article><article>${statSymbol('health','건강')}<strong>${r.health.final} / 100</strong></article><article>${statSymbol('network','인간관계')}<strong>${r.relations.length}명</strong></article><article>${statSymbol('sales','평판')}<strong>${r.reputation.value} / 100</strong></article></div>
 <details class="end-relations-fold"><summary>인간관계 <span>${r.relations.length}명</span></summary><div class="end-relation-cards">${r.relations.map(person=>`<button data-action="person" data-id="${esc(person.id)}"><img src="assets/${esc(person.file||'npc-mentor.png')}" alt="" loading="lazy"><strong>${esc(person.name)}</strong><span class="${person.value<0?'is-negative':''}">${person.value} / 100</span></button>`).join('')||'<p>기록된 인물이 없어요.</p>'}</div></details></section>
 <section class="card end-report-section" id="ending-readings"><div class="end-section-heading"><span>04</span><div><h2>이 결말 다음에 읽는 아침편지</h2><p>명승은의 그만의 아침편지에서, 이번 도전과 이어지는 글.</p></div></div>
 <div class="ending-readings">${r.readings.map(ref=>`<button class="ending-reading" data-action="reading" data-id="${esc(ref.id)}"><span>${ref.kind==='letter'?'아침편지':ref.kind==='video'?'관련 영상':'창업 FAQ'} · 이 안에서 읽기</span><h3>${esc(ref.title)}</h3>${ref.gist?`<p>${esc(ref.gist)}</p>`:''}<small>추천 이유 · ${esc(ref.reason)}</small></button>`).join('')}</div><p class="end-footnote">원본 게임에 연결된 글·자료를 바탕으로 골랐어요. 추천 이유는 이번 엔딩과의 연결 설명이며, 원문 인용이 아니에요.</p></section>
 </div>`;
}
