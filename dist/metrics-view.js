const finite=value=>typeof value==='number'&&Number.isFinite(value);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=value=>Math.round(value).toLocaleString('ko-KR');
const skillKeys=['product','sales','insight','management','network'];

// Compare actual values, including capped gains and choices after settlement.
// Older saves have no per-month skills; leave those unknown instead of guessing.
export function recentChanges(state){
 const history=state.history||[],last=history.at(-1),previous=history.at(-2);
 const initial=!state.legacyConditions?{cash:state.initialFinances?.cash,health:state.initialStats?.health,skills:state.initialStats?.skills,revenue:0,customers:0}:null;
 let baseline,basis;
 if(last?.before){baseline=last.before;basis=`${last.month}개월 차 시작 대비 · 사건 결과 포함`;}
 else if(previous){baseline=previous;basis=`${previous.month}개월 차 월말 기록 대비 · 사건 결과 포함`;}
 else if(!last||last.month===1){baseline=initial;basis='창업 시작 대비 · 사건 결과 포함';}
 else {baseline=null;basis='비교할 이전 기록이 없어요';}
 const diff=(current,before)=>finite(current)&&finite(before)?Math.round(current)-Math.round(before):null;
 return {basis,health:diff(state.health,baseline?.health),cash:diff(state.cash,baseline?.cash),customers:diff(state.customers,baseline?.customers),revenue:diff(state.revenue,baseline?.revenue),skills:Object.fromEntries(skillKeys.map(key=>[key,diff(state.skills?.[key],baseline?.skills?.[key])]))};
}

export function changeBadge(value,unit='',basis='전월 대비'){
 if(!finite(value))return '<span class="value-change change-unknown" title="비교할 이전 기록이 없어요. 다음 정산부터 표시돼요." aria-label="변화량 기록 없음">—</span>';
 const rounded=Math.round(value),tone=rounded>0?'up':rounded<0?'down':'flat',sign=rounded>0?'+':rounded<0?'−':'';
 const text=`${sign}${number(Math.abs(rounded))}${unit}`,label=`${basis}, ${rounded===0?'변화 없음':number(Math.abs(rounded))+unit+(rounded>0?' 증가':' 감소')}`;
 return `<span class="value-change change-${tone}" title="${esc(label)}" aria-label="${esc(label)}">${text}</span>`;
}

export function revenueSeries(history=[],{unit='month',year='recent'}={}){
 const monthly=history.filter(row=>finite(row.month)&&finite(row.revenue)).sort((a,b)=>a.month-b.month);
 const grouped=new Map();if(unit==='year')for(const row of monthly){const y=Math.floor((row.month-1)/12)+1,item=grouped.get(y)||{month:y,revenue:0,count:0,unit:'year'};item.revenue+=row.revenue;item.count++;grouped.set(y,item);}
 const valid=unit==='year'?[...grouped.values()]:monthly,rows=unit==='year'?valid:year==='recent'?valid.slice(-12):valid.filter(r=>Math.floor((r.month-1)/12)+1===Number(year)),max=Math.max(0,...rows.map(row=>row.revenue));
 const rough=Math.max(1,max/4),power=10**Math.floor(Math.log10(rough));
 const step=([1,2,5,10].find(n=>n*power>=rough)||10)*power,ceiling=step*4;
 const left=72,right=866,top=22,bottom=238;
 return {ceiling,step,left,right,top,bottom,points:rows.map((row,index)=>{
  const absolute=valid.indexOf(row),previous=valid[absolute-1];
  const prior=unit==='year'?(previous?.count===12&&row.count===12?previous.revenue:null):previous?.month===row.month-1?previous.revenue:row.month===1?0:null;
  return {...row,x:rows.length===1?(left+right)/2:left+index*(right-left)/(rows.length-1),y:bottom-Math.max(0,row.revenue)/ceiling*(bottom-top),change:finite(prior)?row.revenue-prior:null};
 })};
}

export function revenueReadout(point){return point?`<div><span>${point.unit==='year'?`${point.month}년 차 매출 · ${point.count}개월 집계`:`${point.month}개월 차 매출`}</span><strong>${number(point.revenue)}<small>만 원</small></strong></div><div class="revenue-comparison">${changeBadge(point.change,'만 원')}<span>${point.unit==='year'?(point.change===null?'집계 기간 확인':'전년 대비'):'전월 대비'}</span></div>`:'';}
function chartControls(history,unit,year){const years=[...new Set(history.map(r=>Math.floor((r.month-1)/12)+1))];return `<div class="chart-controls"><div role="group" aria-label="매출 집계 단위"><button class="quiet ${unit==='month'?'active':''}" data-action="chart-unit" data-id="month" aria-pressed="${unit==='month'}">월별</button><button class="quiet ${unit==='year'?'active':''}" data-action="chart-unit" data-id="year" aria-pressed="${unit==='year'}">연별</button></div>${unit==='month'?`<select class="field" id="chart-year" aria-label="매출을 볼 연차"><option value="recent">최근 12개월</option>${years.map(y=>`<option value="${y}" ${String(year)===String(y)?'selected':''}>${y}년 차</option>`).join('')}</select>`:''}</div>`;}
export function revenueChart(history=[],{unit='month',year='recent'}={}){
 const model=revenueSeries(history,{unit,year}),{points,left,right,top,bottom,step}=model;
 if(!points.length)return `<section class="card page-card revenue-card"><div class="revenue-chart-heading"><h2>${unit==='year'?'연별':'월별'} 매출</h2>${chartControls(history,unit,year)}</div><div class="chart-empty-grid" aria-label="아직 매출 기록 없음"></div></section>`;
 const selected=points.at(-1),line=points.map(p=>`${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '),area=`${points[0].x},${bottom} ${line} ${selected.x},${bottom}`;
 return `<section class="card page-card revenue-card"><div class="revenue-chart-heading"><h2>${unit==='year'?'연별':'월별'} 매출</h2>${chartControls(history,unit,year)}<span>${unit==='year'?'연간 합계':'월별 합계'} · 단위: 만 원</span></div><div class="revenue-chart-readout" id="revenue-readout" aria-live="polite">${revenueReadout(selected)}</div><div class="revenue-plot-scroll"><svg class="revenue-plot" viewBox="0 0 900 280" role="group" aria-label="${unit==='year'?'연별':'월별'} 매출 그래프"><defs><linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2e68e8" stop-opacity=".18"/><stop offset="100%" stop-color="#2e68e8" stop-opacity=".015"/></linearGradient></defs>${Array.from({length:5},(_,i)=>{const y=bottom-i*(bottom-top)/4;return `<line class="revenue-gridline" x1="${left}" y1="${y}" x2="${right}" y2="${y}"/><text class="revenue-axis" x="${left-12}" y="${y+5}" text-anchor="end">${number(i*step)}</text>`;}).join('')}${points.length>1?`<polygon points="${area}" fill="url(#revenue-fill)"/><polyline class="revenue-line" points="${line}"/>`:''}<line id="revenue-guide" class="revenue-guide" x1="${selected.x}" x2="${selected.x}" y1="${top}" y2="${bottom}"/>${points.map(p=>`<g class="revenue-point ${p===selected?'selected':''}" tabindex="0" role="button" aria-pressed="${p===selected}" aria-label="${p.month}${unit==='year'?'년':'개월'} 차 매출 ${number(p.revenue)}만 원" data-action="chart-point" data-chart-month="${p.month}" data-x="${p.x}"><title>${p.month}${unit==='year'?'년':'개월'} 차 · ${number(p.revenue)}만 원</title><circle class="revenue-hit" cx="${p.x}" cy="${p.y}" r="19"/><circle class="revenue-dot" cx="${p.x}" cy="${p.y}" r="5"/></g><text class="revenue-axis" x="${p.x}" y="266" text-anchor="middle">${p.month}${unit==='year'?'년':'개월'}</text>`).join('')}</svg></div><p class="revenue-chart-hint">점을 누르거나 마우스를 올려 확인하세요.</p></section>`;
}
