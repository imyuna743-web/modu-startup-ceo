// Founder conditions are independent of the portrait's gender.
export const GAUGES={edu:'학력',looks:'외모',capital:'자본',skill:'보유 기술',career:'경력'};
export const WEIGHTS={edu:.08,looks:.07,capital:.4,skill:.25,career:.2};
export const GAUGE_RANGES={
 '20s':{edu:[55,85],looks:[55,80],capital:[64,80],skill:[67,85],career:[45,70]},
 '30s':{edu:[40,70],looks:[40,70],capital:[45,60],skill:[42,66],career:[34,60]},
 '40s':{edu:[25,60],looks:[30,60],capital:[30,44],skill:[25,50],career:[20,45]},
 '50s':{edu:[10,45],looks:[20,50],capital:[15,29],skill:[10,33],career:[10,33]}
};
const bound=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
const draw=(rng,min,max)=>min+Math.floor(bound(Number(rng())||0,0,.999999999)*(max-min+1));
const origins=['대도시','중소도시','소도시','해외 생활 경험','여러 지역에서 성장'];
const families=['혼자 생활','부모와 가까이 지냄','형제자매와 가까이 지냄','부모 부양','자녀 양육'];
const homes=['자가','전세','월세','가족과 거주'];
const hobbies=['독서','산책','운동','게임','요리','사진'];
const tones=['차분한 말투','명쾌한 말투','다정한 말투','유쾌한 말투'];
export function rollTraits(rng=Math.random){
 const pick=a=>a[draw(rng,0,a.length-1)];
 return {intelligence:draw(rng,70,130),grit:draw(rng,1,100),origin:pick(origins),marital:draw(rng,1,10)<=4?'기혼':'미혼',family:pick(families),housing:pick(homes),hobby:pick(hobbies),tone:pick(tones),mbti:['EI','SN','TF','JP'].map(a=>a[draw(rng,0,1)]).join('')};
}
export function rollGauges(ageGroup='30s',rng=Math.random){return Object.fromEntries(Object.entries(GAUGE_RANGES[ageGroup]||GAUGE_RANGES['30s']).map(([k,[min,max]])=>[k,draw(rng,min,max)]));}
export function normalizeGauges(g={}){return Object.fromEntries(Object.keys(GAUGES).map(k=>[k,bound(Number.isFinite(Number(g[k]))?Math.round(Number(g[k])):50,1,100)]));}
export function conditionDifficulty(g){const score=Math.round(Object.entries(WEIGHTS).reduce((n,[k,w])=>n+g[k]*w,0)*100)/100;return {score:Math.round(score*10)/10,stars:bound(6-Math.ceil(score/20),1,5)};}
export function gaugeDescription(k,n){
 if(k==='edu')return n<=20?'고졸 이하':n<=40?'전문대':n<=65?'대졸':n<=85?'석사':'박사';
 if(k==='career')return `${n<=33?'실무자':n<=66?'관리자':'임원급'} · ${Math.round(n*.3)}년`;
 if(k==='looks')return '첫 만남의 호감 · 초상화와 별도';
 if(k==='skill')return n>=67?'직접 구현 가능 · 매달 제품 일정 1주 필수':'업종 실무 숙련도';
 return '시작 자금과 개인 비상금에 반영';
}
export function traitDetails(t){
 if(!t)return [];
 const mbti=t.mbti||'ISTJ';
 const hobbyFx={독서:{insight:1},산책:{health:2},운동:{health:2},게임:{product:1},요리:{management:1},사진:{sales:1}};
 const toneFx={'차분한 말투':{management:1},'명쾌한 말투':{sales:1},'다정한 말투':{network:1},'유쾌한 말투':{network:1}};
 return [
 {key:'intelligence',label:'지능',value:t.intelligence,fx:{insight:t.intelligence>=110?2:1}},
 {key:'grit',label:'끈기',value:t.grit,fx:{health:t.grit>=67?2:1}},
 {key:'origin',label:'출신',value:t.origin,fx:{insight:1}},
 {key:'marital',label:'결혼 여부',value:t.marital,fx:t.marital==='기혼'?{network:1}:{management:1}},
 {key:'family',label:'가족',value:t.family,fx:{network:1}},
 {key:'housing',label:'주거 여부',value:t.housing,fx:{health:1}},
 {key:'hobby',label:'취미',value:t.hobby,fx:hobbyFx[t.hobby]||{insight:1}},
 {key:'tone',label:'말투',value:t.tone,fx:toneFx[t.tone]||{network:1}},
 {key:'mbti',label:'MBTI',value:mbti,fx:mbti.includes('S')?{product:2}:{sales:2}}
 ];
}
export function traitBonuses(t){const result={health:0,product:0,sales:0,insight:0,management:0,network:0};for(const row of traitDetails(t))for(const [k,v]of Object.entries(row.fx))result[k]+=v;for(const k of Object.keys(result))result[k]=Math.min(4,result[k]);return result;}
export function monthlyTraitEffects(s,plan=s.plan){
 const fx={health:0,sales:0,management:0,network:0},t=s.traits;if(!t)return fx;
 fx.health+=Math.round((t.grit-50)/50);
 if(t.mbti?.startsWith('I')&&plan.includes('rest'))fx.health++;
 if(t.mbti?.startsWith('E')&&plan.includes('sales'))fx.sales++;
 if(t.mbti?.includes('T')&&plan.includes('study'))fx.management++;
 if(t.mbti?.includes('F')&&plan.includes('network'))fx.network++;
 return fx;
}
export function startingFinances(g,industry){
 const total=Math.round(50000*(g.capital/100)**3.3);
 const lite=!!industry?.lite&&total<industry.liteBelow;
 const setup=Math.min((lite?industry.lite.setup:industry?.setup)||300,Math.round(total*.6));
 const familyDebt=g.capital>=70?Math.round(total*.15):0,guarantee=g.capital>=85?Math.round(total*.2):0;
 return {total,setup,cash:total-setup,reserve:Math.round(total*.5+g.career*15),familyDebt,guarantee,debt:familyDebt+guarantee,investment:total-familyDebt-guarantee,lite};
}
export function buildStartingProfile({gauges,traits,health=80,industry,overrides={},founderType='aspiring'}){
 const g=normalizeGauges(gauges),bonuses=traitBonuses(traits);
 const experienceBonuses=founderType==='experienced'?{management:4,insight:2}:{};
 const base={product:Math.round((industry?.initialProduct??10)+g.skill*(industry?.productPerSkill??.4)),sales:Math.round(10+g.looks*.45+g.career*.2),insight:Math.round(10+g.edu*.35+g.career*.25),management:Math.round(8+g.career*.55+g.edu*.2),network:Math.round(5+g.looks*.25+g.career*.45)};
 const skills=Object.fromEntries(Object.entries(base).map(([k,v])=>[k,bound(Number.isFinite(overrides[k])?overrides[k]:v+bonuses[k]+(experienceBonuses[k]||0))]));
 return {gauges:g,traits:structuredClone(traits),bonuses,experienceBonuses,health:bound(Number.isFinite(overrides.health)?overrides.health:health+bonuses.health,1,100),skills,finances:startingFinances(g,industry),conditionDifficulty:conditionDifficulty(g)};
}
