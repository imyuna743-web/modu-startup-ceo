import {countNumber} from './count-motion.js';
import {GAUGES,gaugeDescription,traitDetails,traitBonuses} from './background.js';

const shapes={
 award:'m8 14-2 8 6-3 6 3-2-8M19 8A7 7 0 1 1 5 8a7 7 0 0 1 14 0',
 chart:'M4 3v17h17M8 16v-5m5 5V7m5 9V4',
 book:'M12 6C9 3 5 3 3 4v15c3-1 6-1 9 2 3-3 6-3 9-2V4c-2-1-6-1-9 2Zm0 0v15',
 edu:'M2 8 12 3l10 5-10 5L2 8Zm4 2v7c4 3 8 3 12 0v-7M22 8v8',
 looks:'M19 10v3a7 7 0 0 1-14 0v-3a7 7 0 0 1 9-6.7M8 11h.01M15 11h.01M9 15c2 2 4 2 6 0M19 2v5M16.5 4.5h5',
 capital:'M20 6c0 2-4 3-8 3S4 8 4 6s4-3 8-3 8 1 8 3ZM4 6v5c0 2 4 3 8 3s8-1 8-3V6M4 11v5c0 2 4 3 8 3s8-1 8-3v-5',
 skill:'m8 5-6 7 6 7m8-14 6 7-6 7M14 3l-4 18',
 career:'M8 6V3h8v3M3 6h18v14H3V6Zm0 6c6 3 12 3 18 0M10 11h4v5h-4v-5',
 intelligence:'M12 5a3 3 0 0 0-6-1 4 4 0 0 0-3 6 4 4 0 0 0 1 7 4 4 0 0 0 8 1V5Zm0 0a3 3 0 0 1 6-1 4 4 0 0 1 3 6 4 4 0 0 1-1 7 4 4 0 0 1-8 1M6 4v4m-3 2h4l2 2m-5 5 4-2m10-11v4m3 2h-4l-2 2m5 5-4-2',
 grit:'M12 2c1 5 6 6 6 11a6 6 0 0 1-12 0c0-3 1-5 3-7 0 3 1 4 2 4 2-2 2-5 1-8ZM12 13c-3 3-3 6 0 6s3-3 0-6Z',
 origin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
 marital:'M12 14a5 5 0 1 1-10 0 5 5 0 0 1 10 0Zm10 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM9 3l3-2 3 2-3 4-3-4Z',
 family:'M9 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1 19v-3a5 5 0 0 1 7-4m15 7v-3a5 5 0 0 0-7-4M14 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 22v-2a4 4 0 0 1 8 0v2',
 housing:'m3 10 9-7 9 7v11h-6v-7H9v7H3V10Z',
 hobby:'M7 7h10c4 0 5 6 5 11 0 3-4 2-7-1H9c-3 3-7 4-7 1 0-5 1-11 5-11Zm0 3v5m-2.5-2.5h5m6-1h.01m3 3h.01M12 7V3',
 tone:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 1 1 17-5ZM8 9h8m-8 4h5',
 mbti:'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
 health:'M12 21 3 12C-3 4 7-1 12 6c5-7 15-2 9 6Z',
 product:'m12 2 9 5v10l-9 5-9-5V7Zm-9 5 9 5 9-5m-9 5v10',
 sales:'m3 10 15-6v16L3 14Zm4 5 2 6h4l-2-5m11-8v8',
 insight:'M21 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-2 7 4 5M8 12l3-4 3 2 3-4',
 management:'M5 4h14v17H5V4Zm4-2h6v4H9V2ZM8 10l1 1 2-2m2 1h3m-8 5 1 1 2-2m2 1h3',
 network:'M15 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm14 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM10 8l-4 7m8-7 4 7M8 18h8',
 cash:'M3 7V5a2 2 0 0 1 2-2h13v4M3 7h18v14H3V7Zm13 5h5v5h-5v-5Zm2 2.5h.01',
 reserve:'M3 3h18v17H3V3Zm3 17v2m12-2v2M16 11a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-4-4v8m-4-4h8',
 runway:'M6 2h12M6 22h12M7 2v5l5 5-5 5v5m10-20v5l-5 5 5 5v5M9 18h6',
 team:'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 10v-3a7 7 0 0 1 14 0v3m0-17a4 4 0 0 1 0 8m3 3a6 6 0 0 1 3 6',
 equity:'M10 2v12h12A10 10 0 1 1 10 2Zm4 0a10 10 0 0 1 8 8h-8V2Z',
 debt:'M5 3h14v19l-3-2-4 2-4-2-3 2V3Zm3 5h8m-8 4h8m-8 4h5',
 guarantee:'m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6l9-4Zm0 5v6m0 4h.01',
 risk:'m12 2 10 19H2L12 2Zm0 7v5m0 3h.01',
 person:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21v-3a7 7 0 0 1 14 0v3',
 close:'M6 6l12 12M18 6 6 18',
 check:'m5 12 4 4L19 6',
 lock:'M5 10h14v11H5V10Zm3 0V6a4 4 0 0 1 8 0v4m-4 4v3'
};
const bonusNames={health:'체력',product:'제품력',sales:'영업력',insight:'시장 이해',management:'운영력',network:'네트워크'};
export const statIcon=key=>`<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="${shapes[key]||shapes.mbti}"/></svg>`;
export const brandMark=()=>'<div class="brand-mark"><img src="assets/mv-logo-blue.png" width="40" height="40" alt="MV 로고"></div>';
export const statSymbol=(key,label)=>`<span class="stat-label"><span class="stat-symbol" aria-hidden="true">${statIcon(key)}</span><span class="stat-name">${label}</span></span>`;
export function gaugeBand(value){return value<20?'red':value<40?'orange':value<60?'yellow':value<90?'green':'blue';}
export function gaugesHTML(gauges){
 return `<div class="gauge-grid">${Object.entries(GAUGES).map(([key,label])=>`<div class="gauge-stat" data-band="${gaugeBand(gauges[key])}"><div class="gauge-value">${statSymbol(key,label)}<strong>${countNumber('gauge-'+key,gauges[key])}<small> / 100</small></strong></div><div class="bar" role="meter" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${gauges[key]}"><i style="width:${gauges[key]}%"></i></div><p>${gaugeDescription(key,gauges[key])}</p></div>`).join('')}</div>`;
}
export function traitsHTML(traits,esc){
 const bonuses=Object.entries(traitBonuses(traits)).filter(([,n])=>n>0);
 const total=bonuses.reduce((sum,[,n])=>sum+n,0);
 return `<div class="trait-grid">${traitDetails(traits).map(t=>`<div class="trait">${statSymbol(t.key,t.label)}<strong>${esc(t.value)}</strong></div>`).join('')}</div><div class="trait-bonus-total"><div class="bonus-heading"><strong>총 보너스</strong><b>+${total}</b></div><div class="bonus-list">${bonuses.map(([key,n])=>`<span>${statIcon(key)}${bonusNames[key]} <b>+${n}</b></span>`).join('')}</div></div>`;
}
export const permanentLockMessage=()=>`<div class="permanent-lock-message">${statIcon('lock')}<span>기본 능력치로 잠김</span></div>`;
