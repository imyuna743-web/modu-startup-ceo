// Career rewards are local game progress. No client-side paid currency grants.
export const ACHIEVEMENT_TRACKS=[
 {id:'revenue',title:'매출의 계단',metric:'totalRevenue',unit:'만 원',icon:'cash',targets:[3000,20000,80000,180000],ids:['revenue-1000','revenue-10000','revenue-50000','revenue-100000']},
 {id:'customers',title:'고객의 선택',metric:'customers',unit:'명',icon:'network',targets:[25,90,200,400],ids:['customers-10','customers-50','customers-100','customers-200']},
 {id:'profit',title:'흑자 경영',metric:'profitableMonths',unit:'개월',icon:'chart',targets:[3,10,20,36],ids:['first-profit','profit-6','profit-12','profit-24']},
 {id:'research',title:'고객을 아는 대표',metric:'researchWeeks',unit:'주',icon:'chat',targets:[8,20,36,64]},
 {id:'learning',title:'배움 수집가',metric:'lessons',unit:'개',icon:'book',targets:[14,24,34,40],ids:['lessons-10','lessons-20','lessons-30','lessons-40']},
 {id:'years',title:'오래가는 회사',metric:'months',unit:'개월',icon:'runway',targets:[18,30,48,60],ids:['year-one','years-2','years-3','five-years']},
 {id:'product',title:'제품의 완성',metric:'product',unit:'점',icon:'product',targets:[65,80,95,100],ids:['product-50','product-70','product-90','product-100']},
 {id:'monthly',title:'한 달의 도약',metric:'monthlyRevenue',unit:'만 원',icon:'award',targets:[800,1800,4000,8000],ids:['month-500','month-1000','month-3000','month-5000']}
];
export const TIERS=['브론즈','실버','골드','플래티넘'];
const characterRewards={'research-3':'special-maker','revenue-10000':'special-campus','customers-200':'special-global','lessons-40':'special-researcher','profit-24':'special-artisan','comeback':'special-restart','growth-master':'special-serial','healthy-finale':'special-community'};
const baseQuests=ACHIEVEMENT_TRACKS.flatMap(track=>track.targets.map((target,i)=>({id:track.ids?.[i]||`${track.id}-${i+1}`,track:track.id,title:`${track.title} · ${TIERS[i]}`,description:`${track.title} ${target.toLocaleString('ko-KR')}${track.unit}`,metric:track.metric,target,unit:track.unit,icon:track.icon,tier:i})));
const finaleQuests=[
 {id:'hard-streak',track:'hard',title:'불황의 흑자 기록',description:'어려움 이상에서 한 도전 중 12개월 연속 흑자',metric:'hardStreak',target:12,unit:'개월',icon:'award'},
 {id:'hard-finale',track:'hard',title:'끝까지 건강한 대표',description:'어려움 이상에서 체력 65 이상으로 60개월 성장 엔딩',metric:'hardFinale',target:1,unit:'회',icon:'award'},
 {id:'hardcore-finale',track:'hard',title:'매우 어려움 정복',description:'매우 어려움에서 18개월 연속 흑자를 기록하고 60개월 성장 엔딩',metric:'hardcoreFinale',target:1,unit:'회',icon:'award'},
 {id:'comeback',track:'finale',title:'다시 시작할 용기',description:'12개월 이상 운영한 뒤 폐업 또는 자진 폐업',metric:'closure',target:1,unit:'회',icon:'award'},
 {id:'growth-master',track:'finale',title:'연쇄 창업의 자격',description:'누적 매출 10억 원 이상으로 성장 엔딩',metric:'growth',target:1,unit:'회',icon:'award'},
 {id:'healthy-finale',track:'finale',title:'오래 함께 가는 대표',description:'60개월 운영 완료 · 마지막 체력 80 이상',metric:'healthyYears',target:1,unit:'회',icon:'award'}
];
export const REWARD_QUESTS=[...baseQuests,...finaleQuests].map(q=>({...q,character:characterRewards[q.id]||null,tickets:characterRewards[q.id]?0:1}));
const count=n=>Number.isFinite(n)?Math.max(0,Math.floor(n)):0;
export function normalizeCareer(raw={}){
 const current=raw.version===3;
 const claimed=current?[...new Set((raw.claimed||[]).filter(id=>REWARD_QUESTS.some(q=>q.id===id)))]:[];
 const earned=claimed.map(id=>REWARD_QUESTS.find(q=>q.id===id)?.character).filter(Boolean);
 const progress=Object.fromEntries(Object.entries(raw.progress||{}).filter(([k])=>current||!['closure','growth','healthyYears'].includes(k)).map(([k,v])=>[k,count(v)]));
 return {version:3,progress,claimed,earned,tickets:current?count(raw.tickets):0,dailyCustomDay:current&&typeof raw.dailyCustomDay==='string'?raw.dailyCustomDay:'',resetNotice:current?!!raw.resetNotice:!!raw.earned?.length};
}
export function rewardStatus(meta){const m=normalizeCareer(meta);return REWARD_QUESTS.map(q=>({...q,value:m.progress[q.metric]||0,earned:m.claimed.includes(q.id)||(m.progress[q.metric]||0)>=q.target,claimed:m.claimed.includes(q.id)}));}
export function claimCareerRewards(meta,ids){
 const m=normalizeCareer(meta),selected=new Set(ids||REWARD_QUESTS.map(q=>q.id));
 const rewards=rewardStatus(m).filter(q=>selected.has(q.id)&&q.earned&&!q.claimed),tickets=rewards.reduce((s,q)=>s+q.tickets,0),characters=rewards.map(q=>q.character).filter(Boolean);
 return {meta:{...m,tickets:m.tickets+tickets,claimed:[...m.claimed,...rewards.map(q=>q.id)],earned:[...new Set([...m.earned,...characters])]},tickets,characters,amount:rewards.length};
}
export function purchaseCharacter(meta,character){
 const m=normalizeCareer(meta),quest=REWARD_QUESTS.find(q=>q.character===character?.id);
 if(!quest)return {meta:m,error:'해금할 캐릭터를 찾지 못했어요.'};
 if(m.earned.includes(character.id))return {meta:m,error:'이미 해금한 캐릭터예요.'};
 if((m.progress[quest.metric]||0)<quest.target)return {meta:m,error:'해금 배지의 조건을 먼저 달성해 주세요.'};
 return {...claimCareerRewards(m,[quest.id]),error:null};
}
export function customDay(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function customAccess(meta,now=new Date()){const m=normalizeCareer(meta),free=m.dailyCustomDay!==customDay(now);return {free,tickets:m.tickets,allowed:free||m.tickets>0,day:customDay(now)};}
export function consumeCustomPass(meta,now=new Date()){
 const m=normalizeCareer(meta),access=customAccess(m,now);
 if(!access.allowed)return {meta:m,error:'오늘 무료 이용을 모두 사용했어요. 업적에서 커스텀 모드 1회권을 받아 주세요.'};
 return {meta:access.free?{...m,dailyCustomDay:access.day}:{...m,tickets:m.tickets-1},used:access.free?'daily':'ticket',error:null};
}
