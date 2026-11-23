import {normalizeCareer} from './career-economy.js';
import {buildStartingProfile,GAUGE_RANGES} from './background.js';

// Age and gender are presentation choices. Only the selected difficulty rolls conditions.
export const DIFFICULTIES={
 easy:{label:'쉬움',health:[85,100],ranges:GAUGE_RANGES['20s'],description:'여유 있는 자금과 높은 시작 능력치 · 악재가 드물게 발생'},
 normal:{label:'보통',health:[70,84],ranges:GAUGE_RANGES['30s'],description:'균형 잡힌 자금과 시작 능력치 · 보통 빈도의 악재'},
 hard:{label:'어려움',health:[55,69],ranges:GAUGE_RANGES['40s'],description:'적은 자금, 성장이 필요한 능력치 · 악재가 자주 발생'},
 hardcore:{label:'매우 어려움',health:[40,54],ranges:GAUGE_RANGES['50s'],description:'빠듯한 자금과 체력 · 악재가 매우 자주 발생'}
};
export function rollDifficultyStats(id='normal',rng=Math.random){
 const d=DIFFICULTIES[id]||DIFFICULTIES.normal;
 const draw=([lo,hi])=>lo+Math.floor(Math.max(0,Math.min(.999999999,Number(rng())||0))*(hi-lo+1));
 return {health:draw(d.health),gauges:Object.fromEntries(Object.entries(d.ranges).map(([key,range])=>[key,draw(range)]))};
}
export const SPECIAL_CHARACTERS=[
 {
  "id": "special-maker",
  "name": "한서율",
  "label": "오픈소스 메이커",
  "age": "20대",
  "ageGroup": "20s",
  "gender": "여성",
  "story": "말수는 적지만 버그 앞에서는 밤을 잊는다. 모두에게 열린 코드를 지속 가능한 구독으로 만든다.",
  "requirement": "고객 만나기 누적 36주",
  "metric": "researchWeeks",
  "target": 36,
  "unit": "주",
  "industry": "devtools",
  "industryLabel": "개발자 도구 구독",
  "bonuses": {
   "product": 12,
   "health": -5
  },
  "signatureAction": "build",
  "signatureEffects": {
   "product": 3,
   "health": -1
  },
  "signature": "제품 만들기마다 제품력 +3 · 체력 −1",
  "file": "standing-special-maker-v2.webp"
 },
 {
  "id": "special-campus",
  "name": "이준서",
  "label": "캠퍼스 연결왕",
  "age": "20대",
  "ageGroup": "20s",
  "gender": "남성",
  "story": "처음 보는 사람에게도 먼저 말을 건다. 동아리의 작은 행사를 대학 전체의 축제로 키운다.",
  "requirement": "한 도전에서 누적 매출 2억 원",
  "metric": "totalRevenue",
  "target": 20000,
  "unit": "만 원",
  "industry": "campus_events",
  "industryLabel": "캠퍼스 행사 플랫폼",
  "bonuses": {
   "network": 12,
   "management": -4
  },
  "signatureAction": "network",
  "signatureEffects": {
   "sales": 3,
   "health": -1
  },
  "signature": "동료 만나기마다 영업력 +3 · 체력 −1",
  "file": "standing-special-campus-v2.webp"
 },
 {
  "id": "special-restart",
  "name": "오유나",
  "label": "두 번째 설계자",
  "age": "30대",
  "ageGroup": "30s",
  "gender": "여성",
  "story": "실패했던 장부를 버리지 않았다. 손실의 원인을 끝까지 묻고, 위기의 작은 가게를 다시 세운다.",
  "requirement": "12개월 이상 운영한 뒤 폐업 엔딩",
  "metric": "closure",
  "target": 1,
  "unit": "회",
  "industry": "turnaround",
  "industryLabel": "소상공인 재기 스튜디오",
  "bonuses": {
   "management": 10,
   "insight": 5,
   "health": -5
  },
  "signatureAction": "study",
  "signatureEffects": {
   "management": 3,
   "hiddenRisk": -1
  },
  "signature": "창업 공부마다 운영력 +3 · 누적 위험 −1",
  "file": "standing-special-restart-v2.webp"
 },
 {
  "id": "special-global",
  "name": "강지호",
  "label": "국경 없는 세일즈",
  "age": "30대",
  "ageGroup": "30s",
  "gender": "남성",
  "story": "거절당한 제안서도 다음 언어로 다시 쓴다. 지역 브랜드를 해외의 첫 단골과 연결한다.",
  "requirement": "한 도전에서 고객 400명",
  "metric": "customers",
  "target": 400,
  "unit": "명",
  "industry": "export_brand",
  "industryLabel": "로컬 브랜드 수출사",
  "bonuses": {
   "sales": 12,
   "network": 6,
   "product": -5
  },
  "signatureAction": "sales",
  "signatureEffects": {
   "network": 3,
   "health": -2
  },
  "signature": "영업 나가기마다 네트워크 +3 · 체력 −2",
  "file": "standing-special-global-v2.webp"
 },
 {
  "id": "special-researcher",
  "name": "문해진",
  "label": "실험실의 개척자",
  "age": "40대",
  "ageGroup": "40s",
  "gender": "여성",
  "story": "좋은 결과보다 재현되는 결과를 믿는다. 오래 묵힌 센서 기술을 공장의 실제 문제에 적용한다.",
  "requirement": "한 도전에서 배움 카드 40개",
  "metric": "lessons",
  "target": 40,
  "unit": "개",
  "industry": "sensor_lab",
  "industryLabel": "산업용 센서 연구소",
  "bonuses": {
   "product": 15,
   "sales": -5
  },
  "signatureAction": "research",
  "signatureEffects": {
   "product": 3,
   "health": -2
  },
  "signature": "고객 만나기마다 제품력 +3 · 체력 −2",
  "file": "standing-special-researcher-v2.webp"
 },
 {
  "id": "special-artisan",
  "name": "장도현",
  "label": "한 치의 장인",
  "age": "40대",
  "ageGroup": "40s",
  "gender": "남성",
  "story": "빠르게 만드는 것보다 오래 쓰는 것을 고집한다. 손으로 익힌 공정을 주문 제작 브랜드로 바꾼다.",
  "requirement": "한 도전에서 흑자 36개월",
  "metric": "profitableMonths",
  "target": 36,
  "unit": "개월",
  "industry": "custom_workshop",
  "industryLabel": "맞춤 가구 공방",
  "bonuses": {
   "management": 12,
   "product": 6,
   "network": -4
  },
  "signatureAction": "build",
  "signatureEffects": {
   "management": 3,
   "health": -1
  },
  "signature": "제품 만들기마다 운영력 +3 · 체력 −1",
  "file": "standing-special-artisan-v2.webp"
 },
 {
  "id": "special-serial",
  "name": "백정원",
  "label": "판을 짜는 창업가",
  "age": "50대",
  "ageGroup": "50s",
  "gender": "여성",
  "story": "사람의 강점과 시장의 빈틈을 함께 읽는다. 여러 팀이 각자의 사업을 시작하는 작은 스튜디오를 만든다.",
  "requirement": "누적 매출 10억 원 이상으로 성장 엔딩",
  "metric": "growth",
  "target": 1,
  "unit": "회",
  "industry": "venture_studio",
  "industryLabel": "벤처 빌더 스튜디오",
  "bonuses": {
   "insight": 10,
   "network": 10,
   "health": -8
  },
  "signatureAction": "network",
  "signatureEffects": {
   "insight": 3,
   "health": -2
  },
  "signature": "동료 만나기마다 시장 이해 +3 · 체력 −2",
  "file": "standing-special-serial-v2.webp"
 },
 {
  "id": "special-community",
  "name": "유성호",
  "label": "동네의 연결점",
  "age": "50대",
  "ageGroup": "50s",
  "gender": "남성",
  "story": "새 고객보다 떠난 이웃의 안부부터 묻는다. 가게와 주민이 함께 소유하는 동네 장터를 꾸린다.",
  "requirement": "60개월 운영 완료 · 마지막 체력 80 이상",
  "metric": "healthyYears",
  "target": 1,
  "unit": "회",
  "industry": "community_market",
  "industryLabel": "동네 협동조합 마켓",
  "bonuses": {
   "health": 10,
   "network": 10,
   "sales": -5
  },
  "signatureAction": "rest",
  "signatureEffects": {
   "network": 2
  },
  "signature": "충분히 쉬기마다 네트워크 +2",
  "file": "standing-special-community-v2.webp"
 }
];
export const CHARACTER_KEY='founder-life-character-unlocks-v1';
const safe=n=>Number.isFinite(n)?Math.max(0,n):0;
export function characterProgress(state){
 const rows=state.history||[],months=Math.max(0,...rows.map(r=>safe(r.month))),totalRevenue=rows.reduce((sum,row)=>sum+safe(row.revenue),0);
 let streak=0,longest=0;
 for(const row of rows){streak=row.profit>0?streak+1:0;longest=Math.max(longest,streak);}
 const hard=state.mode!=='custom'&&['hard','hardcore'].includes(state.difficulty);
 return {hardStreak:hard?longest:0,hardFinale:hard&&months===60&&state.ending==='growth'&&state.health>=65?1:0,
 hardcoreFinale:state.mode!=='custom'&&state.difficulty==='hardcore'&&months===60&&state.ending==='growth'&&longest>=18?1:0,researchWeeks:rows.reduce((sum,row)=>sum+(row.actions||[]).filter(a=>a==='research').length,0),totalRevenue,
 customers:Math.max(safe(state.customers),...rows.map(r=>safe(r.customers))),lessons:state.lessons?.length||0,
 profitableMonths:rows.filter(r=>r.profit>0).length,months,product:Math.max(safe(state.skills?.product),...rows.map(r=>safe(r.skills?.product))),monthlyRevenue:Math.max(safe(state.revenue),...rows.map(r=>safe(r.revenue))),
 closure:['close','bankrupt'].includes(state.ending)&&months>=12?1:0,growth:state.ending==='growth'&&totalRevenue>=100000?1:0,
 healthyYears:!!state.ending&&months>=60&&state.health>=80?1:0};
}
export function mergeCharacterProgress(previous={},states=[]){
 const meta=normalizeCareer(previous),progress={...meta.progress};
 for(const state of states.filter(s=>s&&s.mode!=='custom'))for(const [key,value]of Object.entries(characterProgress(state)))progress[key]=Math.max(safe(progress[key]),value);
 return {...meta,progress};
}
export function readCharacterProgress(storage,states=[]){
 let meta={};try{const saved=JSON.parse(storage.getItem(CHARACTER_KEY));if(saved&&[1,2,3].includes(saved.version))meta=saved;}catch{}
 return mergeCharacterProgress(meta,states);
}
export function writeCharacterProgress(storage,meta){storage.setItem(CHARACTER_KEY,JSON.stringify(normalizeCareer(meta)));}
export function characterStatus(meta){const m=normalizeCareer(meta);return SPECIAL_CHARACTERS.map(p=>({...p,unlocked:m.earned.includes(p.id),qualified:safe(m.progress[p.metric])>=p.target,value:Math.min(p.target,safe(m.progress[p.metric]))}));}
export function signatureEffects(state){const p=SPECIAL_CHARACTERS.find(p=>p.id===state.portrait),count=p?(state.plan||[]).filter(id=>id===p.signatureAction).length:0;return count?Object.fromEntries(Object.entries(p.signatureEffects).map(([k,v])=>[k,v*count])):{};}
export function founderProfile(options){
 const profile=buildStartingProfile(options),p=SPECIAL_CHARACTERS.find(p=>p.id===options.portrait);
 if(!p)return profile;
 const health=Math.max(1,Math.min(100,profile.health+(Number.isFinite(options.overrides?.health)?0:p.bonuses.health||0)));
 const skills=Object.fromEntries(Object.entries(profile.skills).map(([key,value])=>[key,Math.max(0,Math.min(100,value+(Number.isFinite(options.overrides?.[key])?0:p.bonuses[key]||0)))]));
 return {...profile,health,skills,characterBonuses:p.bonuses};
}
export const difficultyLabel=state=>DIFFICULTIES[state.difficulty]?.label||(state.difficulty==='custom'?'커스텀':'보통');
