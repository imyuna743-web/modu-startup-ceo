import {ADVERSE_EVENTS,adverseChance} from './event-risk.js';
import {validPortrait} from './custom-portrait.js';
import {companyNameFor} from './founder-names.js';
import {legacyRunId} from './run-evaluation.js';
import {locationBonus} from './locations.js';
import {calendarEvent} from './calendar.js';
import {DIFFICULTIES,SPECIAL_CHARACTERS,rollDifficultyStats,founderProfile,signatureEffects} from './founder-options.js';
import {nextEncounter} from './extended-cast.js';
import {captureCheckpoint} from './rewind.js';
import {syncRoadmap} from './plan-roadmap.js';
import {nextRelationshipEvent} from './relationship-events.js';
import {getLocation,locationRent,canRentLocation} from './locations.js';
import {normalizeGauges,rollTraits,rollGauges,buildStartingProfile,monthlyTraitEffects} from './background.js';
import {choiceAvailability,eventAvailability} from './conditions.js';
export const SAVE_KEY='founder-life-v2';
export const SKILLS={product:'제품력',sales:'영업력',insight:'시장 이해',management:'운영력',network:'네트워크'};
export const ACTIONS=[
{id:'research',name:'고객 만나기',desc:'답은 고객의 일상에 있어요.',place:'동네 카페',icon:'chat',color:'teal',cost:30,health:-8,fx:{insight:8,product:3},xp:15,lesson:'c_customer'},
{id:'build',name:'제품 만들기',desc:'아이디어를 쓸 수 있는 모습으로.',place:'내 작업실',icon:'box',color:'purple',cost:80,health:-12,fx:{product:10,management:2},xp:20,lesson:'c_focus'},
{id:'study',name:'창업 공부',desc:'작은 배움이 다음 선택을 바꿔요.',place:'도서관',icon:'book',color:'blue',cost:20,health:-5,fx:{management:8,insight:3},xp:16,lesson:'c_books'},
{id:'sales',name:'영업 나가기',desc:'우리 제품이 필요한 사람을 찾아요.',place:'고객사',icon:'megaphone',color:'orange',cost:50,health:-10,fx:{sales:9,network:2},xp:18,lesson:'c_channel'},
{id:'network',name:'동료 만나기',desc:'혼자 풀리지 않던 이야기를 나눠요.',place:'공유오피스',icon:'people',color:'pink',cost:40,health:-6,fx:{network:10,sales:2},xp:16,lesson:'c_delegate'},
{id:'rest',name:'충분히 쉬기',desc:'오래 가려면 쉬는 날도 필요해요.',place:'집 · 산책길',icon:'coffee',color:'green',cost:10,health:30,fx:{},xp:5,lesson:'c_health'}];
export const ITEMS=[{id:'notebook',name:'생각 정리 노트',desc:'고객 만나기 · 창업 공부 효과 +20%',price:120,icon:'book',color:'blue'},{id:'laptop',name:'든든한 노트북',desc:'제품 만들기 효과 +25%',price:400,icon:'laptop',color:'purple'},{id:'chair',name:'편안한 작업 의자',desc:'모든 활동의 체력 소모 2 감소',price:250,icon:'chair',color:'orange'},{id:'plant',name:'책상 위 작은 숲',desc:'매달 정산 후 체력 5 회복',price:80,icon:'leaf',color:'green'}];
const priorityEvents=['e_grant','e_influencer','e_first_hire','e_angel','e_big_client','e_overwork','e_focus','e_seed','e_expand','e_books','e_audit'];
export const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
export const level=s=>Math.floor(s.xp/100)+1;
export const stage=s=>s.month<=3?(s.founderType==='experienced'?'기창업가':'예비 창업가'):s.customers<30?'첫 고객을 만난 대표':s.customers<100?'성장하는 대표':'우리 동네의 든든한 대표';
export const PORTRAITS=[
{id:'bob',label:'단정한 단발',age:'20대',ageGroup:'20s',gender:'여성',file:'portrait-bob.webp'},
{id:'short',label:'가벼운 숏컷',age:'20대',ageGroup:'20s',gender:'남성',file:'portrait-short.webp'},
{id:'thirties-woman',label:'자연스러운 중단발',age:'30대',ageGroup:'30s',gender:'여성',file:'portrait-thirties-woman.webp'},
{id:'thirties-man',label:'차분한 가르마',age:'30대',ageGroup:'30s',gender:'남성',file:'portrait-thirties-man.webp'},
{id:'forties-woman',label:'짧은 웨이브',age:'40대',ageGroup:'40s',gender:'여성',file:'portrait-forties-woman.webp'},
{id:'forties-man',label:'은빛이 섞인 숏컷',age:'40대',ageGroup:'40s',gender:'남성',file:'portrait-forties-man.webp'},
{id:'fifties-woman',label:'은빛 중단발',age:'50대',ageGroup:'50s',gender:'여성',file:'portrait-fifties-woman.webp'},
{id:'fifties-man',label:'단정한 회색 머리',age:'50대',ageGroup:'50s',gender:'남성',file:'portrait-fifties-man.webp'}];
export const AGE_DIFFICULTIES={
 '20s':{id:'easy',age:'20대',label:'쉬움',health:[85,100],skills:[50,70],description:'넉넉한 체력과 능력치로 여유롭게 시작해요.'},
 '30s':{id:'normal',age:'30대',label:'보통',health:[70,84],skills:[35,49],description:'균형 잡힌 시작값으로 회사를 키워요.'},
 '40s':{id:'hard',age:'40대',label:'어려움',health:[55,69],skills:[20,34],description:'빠듯한 시작값을 계획과 성장으로 채워요.'},
 '50s':{id:'hardcore',age:'50대',label:'매우 어려움',health:[40,54],skills:[5,19],description:'낮은 시작값에서 한 주의 선택도 신중하게.'}
};
// Retired portraits remain available to existing saved games only.
const legacyPortraits=[{id:'tied',age:'20대',file:'portrait-tied.webp'},{id:'glasses',age:'20대',file:'portrait-glasses.webp'}];
export const getPortrait=id=>PORTRAITS.find(p=>p.id===id)||SPECIAL_CHARACTERS.find(p=>p.id===id)||legacyPortraits.find(p=>p.id===id)||PORTRAITS[0];
export const standingFile=id=>SPECIAL_CHARACTERS.find(p=>p.id===id)?.file||`standing-${id==='tied'?'bob':id==='glasses'?'short':getPortrait(id).id}.webp`;
export function rollStartingStats(rng=Math.random,ageGroup='30s'){
 const difficulty=AGE_DIFFICULTIES[ageGroup]||AGE_DIFFICULTIES['30s'];
 const draw=([min,max])=>min+Math.floor(clamp(Number(rng())||0,0,.999999999)*(max-min+1));
 return {health:draw(difficulty.health),skills:Object.fromEntries(Object.keys(SKILLS).map(k=>[k,draw(difficulty.skills)]))};
}
export function createState(industry='saas',name='새봄',options={}){
const mode=options.mode==='custom'?'custom':'basic';
const founderType=options.founderType==='experienced'?'experienced':'aspiring';
const selected=PORTRAITS.find(p=>p.id===options.portrait)||SPECIAL_CHARACTERS.find(p=>p.id===options.portrait&&options.unlockedCharacters?.includes(p.id))||PORTRAITS[0];
if(options.industryData?.exclusiveCharacter&&options.industryData.exclusiveCharacter!==selected.id)throw new Error('이 업종은 전용 캐릭터를 해금한 뒤 선택할 수 있어요.');
if(selected.industry&&selected.industry!==industry)throw new Error('특수 캐릭터는 전용 업종으로 시작해요.');
const ageGroup=selected.ageGroup,difficulty=Object.hasOwn(DIFFICULTIES,options.difficulty)?options.difficulty:'normal';
const rolled=options.startingStats||rollDifficultyStats(difficulty,options.rng);
const traits=options.traits||rollTraits(options.rng);
const profile=founderProfile({portrait:selected.id,gauges:options.gauges||rolled.gauges||rollDifficultyStats(difficulty,options.rng).gauges,traits,founderType,health:rolled.health,industry:options.industryData,overrides:mode==='custom'?options.overrides||{health:options.health,...options.skills}:{}});
const supplied=profile;
const bounded=(value,min,max,fallback)=>clamp(Number.isFinite(Number(value))?Math.round(Number(value)):fallback,min,max);
const health=bounded(supplied.health,1,100,85);
const skills=Object.fromEntries(Object.keys(SKILLS).map(k=>[k,bounded(supplied.skills?.[k],0,100,40)]));
const portrait=selected.id;
const money=profile.finances;
const seats={family:true,friend:true};if(traits.marital==='기혼')seats.partner=true;if(profile.gauges.career>=34)seats.mentor=true;
const s={version:2,rulesVersion:3,runId:globalThis.crypto?.randomUUID?.()||`run-${Date.now()}-${Math.random().toString(36).slice(2)}`,companyName:companyNameFor({name,companyName:options.companyName}),...(mode==='custom'&&validPortrait(options.customPortrait)?{customPortrait:options.customPortrait}:{}),initialPlan:{step:0,answers:{},completed:false,applied:false},metPeople:[],adviceHistory:[],lastScene:null,businessPlace:'home',motto:'',founderType,experienceBonuses:profile.experienceBonuses,name:String(name).trim().slice(0,12)||'새봄',industry,mode,portrait,ageGroup,difficulty,initialStats:{health,skills:{...skills}},gauges:profile.gauges,traits:structuredClone(traits),bonuses:profile.bonuses,conditionDifficulty:profile.conditionDifficulty,initialFinances:money,month:1,cash:money.cash,reserve:money.reserve,debt:money.debt,familyDebt:money.familyDebt,guarantee:money.guarantee,initialInvestment:money.investment,invested:money.investment,investmentLimit:'flex',lite:money.lite,health,skills,customers:0,revenue:0,profit:0,xp:0,plan:[],items:[],lessons:[],journal:[],history:[],pending:null,ending:null,costMod:0,seed:18731,team:0,equity:100,hiddenRisk:5,morale:70,flags:[],seats,relations:{family:15+(traits.mbti?.includes('J')?2:0),friend:15+(traits.mbti?.includes('P')?2:0),partner:15,mentor:15+Math.round(profile.gauges.career/10)},seenEvents:[],delayed:[],queuedEvents:[],arpuMod:0,demandMod:0,churnMod:0,capacity:0};
s.baseFixed=Math.round((money.lite?options.industryData?.lite?.fixed:options.industryData?.fixed??90)*.45+75);s.wage=options.industryData?.wage??450;s.monthlyFixed=costs(s);return s;}
export function validateState(s){
 const valid=!!(s&&s.version===2&&typeof s.name==='string'&&s.name.length<=12&&typeof s.industry==='string'&&s.skills&&Object.keys(SKILLS).every(k=>Number.isFinite(s.skills[k])&&s.skills[k]>=0&&s.skills[k]<=100)&&['cash','health','xp','customers','revenue','profit','costMod','seed'].every(k=>Number.isFinite(s[k]))&&s.health>=0&&s.health<=100&&Number.isInteger(s.month)&&s.month>=1&&s.month<=61&&Array.isArray(s.plan)&&s.plan.length<=4&&s.plan.every(id=>ACTIONS.some(a=>a.id===id))&&Array.isArray(s.journal)&&Array.isArray(s.history)&&Array.isArray(s.lessons)&&Array.isArray(s.items)&&s.items.every(id=>ITEMS.some(i=>i.id===id))&&(!s.pending||(typeof s.pending.title==='string'&&Array.isArray(s.pending.choices)))&&(!s.ending||['close','growth','survive','burnout','bankrupt','ma','ma_talent','ma_merge','ipo'].includes(s.ending)));
 if(!valid)return false;
 if(s.initialPlan!==undefined&&(!s.initialPlan||!Number.isInteger(s.initialPlan.step)||s.initialPlan.step<0||s.initialPlan.step>7||typeof s.initialPlan.completed!=='boolean'||typeof s.initialPlan.applied!=='boolean'||!s.initialPlan.answers||typeof s.initialPlan.answers!=='object'||Array.isArray(s.initialPlan.answers)||Object.values(s.initialPlan.answers).some(a=>!a||typeof a.text!=='string'||a.text.length>160||(a.values!==undefined?(!Array.isArray(a.values)||a.values.length<1||a.values.length>32||new Set(a.values).size!==a.values.length||a.values.some(v=>typeof v!=='string'||!v||v.length>60)):typeof a.value!=='string'))))return false;
 if(s.metPeople!==undefined&&(!Array.isArray(s.metPeople)||s.metPeople.some(x=>typeof x!=='string')))return false;
 if(s.adviceHistory!==undefined&&!Array.isArray(s.adviceHistory))return false;
 if(s.pending?.phase!==undefined&&!['choice','advice'].includes(s.pending.phase))return false;
 if(s.pending?.selectedChoice!==undefined&&(!Number.isInteger(s.pending.selectedChoice)||!s.pending.choices[s.pending.selectedChoice]))return false;
 if(s.lastScene&&(!s.lastScene.eventId||typeof s.lastScene.text!=='string'||typeof s.lastScene.unread!=='boolean'))return false;
 if(s.founderType!==undefined&&!['aspiring','experienced'].includes(s.founderType))return false;
 if(s.customPortrait!==undefined&&s.customPortrait!==''&&(s.mode!=='custom'||!validPortrait(s.customPortrait)))return false;
 if(s.companyName!==undefined&&(typeof s.companyName!=='string'||s.companyName.length>20))return false;
 if(s.motto!==undefined&&(typeof s.motto!=='string'||s.motto.length>80))return false;
 if(s.businessPlace!==undefined&&!canRentLocation(s.businessPlace))return false;
 if(s.rulesVersion===3)return !!(s.gauges&&['edu','looks','capital','skill','career'].every(k=>Number.isFinite(s.gauges[k])&&s.gauges[k]>=1&&s.gauges[k]<=100)&&s.traits&&Number.isFinite(s.traits.grit)&&Number.isFinite(s.traits.intelligence)&&['origin','marital','family','housing','hobby','tone','mbti'].every(k=>typeof s.traits[k]==='string')&&['reserve','debt','familyDebt','guarantee','invested','initialInvestment','team','equity','hiddenRisk','morale','baseFixed','wage','monthlyFixed','arpuMod','demandMod','churnMod','capacity'].every(k=>Number.isFinite(s[k]))&&Array.isArray(s.flags)&&Array.isArray(s.delayed)&&Array.isArray(s.seenEvents)&&Array.isArray(s.queuedEvents)&&s.seats&&s.relations);
 return true;
}
const copy=s=>{if(!s?.rewindPoints)return structuredClone(s);const {rewindPoints,...current}=s;return {...structuredClone(current),rewindPoints};};
export const requiresProduct=s=>(s.gauges?.skill??0)>=67;
export function costs(s,data){const ind=data?.industries[s.industry];return Math.max(60,Math.round((s.baseFixed??((ind?.fixed??90)*.45+75))+s.costMod+(s.team??0)*(s.wage??ind?.wage??450)*.15+(s.debt??0)*.006+locationRent(s.businessPlace)));}
export function migrateState(saved,data){
 if(saved.rulesVersion===3){const s={...saved,runId:saved.runId||legacyRunId(saved),companyName:companyNameFor(saved),businessPlace:saved.businessPlace??'home',motto:saved.motto??'',founderType:saved.founderType??'aspiring',experienceBonuses:saved.experienceBonuses??{},initialPlan:saved.initialPlan??{step:0,answers:{},completed:true,applied:true,unrecorded:true},metPeople:saved.metPeople??[],adviceHistory:saved.adviceHistory??[],lastScene:saved.lastScene??null};if(s.pending){const raw=data.events.find(e=>e.id===s.pending.id);if(raw)s.pending={...s.pending,who:s.pending.who||raw.who,cat:s.pending.cat||raw.cat,plan:s.pending.plan||raw.plan||[],choices:s.pending.choices.map((c,i)=>({...c,tags:c.tags||raw.choices[i]?.tags||[]}))};}return s;}
 const n=copy(saved),g=normalizeGauges({edu:n.skills.insight,looks:n.skills.sales,capital:50,skill:n.skills.product,career:n.skills.management});
 let seed=n.seed||18731;const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const fresh=createState(n.industry,n.name,{portrait:n.portrait,rng,gauges:g,industryData:data.industries[n.industry]});
 for(const [key,value]of Object.entries(fresh))if(n[key]===undefined)n[key]=value;
 n.rulesVersion=3;n.legacyConditions=true;n.initialPlan={step:0,answers:{},completed:true,applied:true,unrecorded:true};
 // Existing cash, health, skills, months and portrait are never recalculated.
 if(n.pending){const raw=data.events.find(e=>e.id===n.pending.id);if(raw)n.pending=adaptEvent(raw,n);}
 n.monthlyFixed=costs(n,data);return n;
}
export function forecast(s,data){let health=s.health;const cost=s.plan.reduce((n,id)=>n+ACTIONS.find(a=>a.id===id).cost,0);for(const id of s.plan){const a=ACTIONS.find(a=>a.id===id);health=clamp(health+a.health+(a.health<0&&s.items.includes('chair')?2:0));}const bonus=monthlyTraitEffects(s);health=clamp(health+bonus.health);health=clamp(health+(signatureEffects(s).health||0));return {cost,fixed:costs(s,data),health:clamp(health+(s.items.includes('plant')?5:0)),cashAfterCosts:s.cash-cost-costs(s,data)};}
export function planAction(s,id){if(s.pending||s.ending||s.plan.length===4||!ACTIONS.some(a=>a.id===id))return s;if(requiresProduct(s)&&s.plan.length===3&&!s.plan.includes('build')&&id!=='build')return s;const n=copy(s);n.plan.push(id);return n;}
export function removePlan(s,i){if(s.pending||s.ending)return s;const n=copy(s);n.plan.splice(i,1);return n;}
function learn(s,id){if(id&&!s.lessons.includes(id))s.lessons.push(id);}
function random(s){s.seed=(s.seed*1664525+1013904223)>>>0;return s.seed/4294967296;}
function roundMoney(s){s.cash=Math.round(s.cash);s.monthlyFixed=costs(s);}
export function runMonth(state,data){
 if(state.pending||state.ending||state.plan.length!==4)return {state,error:'일정 4칸을 먼저 채워 주세요.'};
 if(requiresProduct(state)&&!state.plan.includes('build'))return {state,error:'보유 기술 67 이상은 매달 제품 만들기 1주가 필요해요.'};
 const scheduled=requestScheduledEvent(state);if(scheduled!==state)return {state:scheduled,calendar:true};
 const f=forecast(state,data);if(f.cashAfterCosts<0)return {state,error:'활동비와 고정비가 부족해요. 자금 대책을 확인하거나 일정을 조정해 주세요.'};
 const s=copy(state),before=state,rows=[];const checkpointId=captureCheckpoint(s,'month',`${s.month}개월 차 일정`,s.month);s.cash-=f.cost;
 for(const id of s.plan){const a=ACTIONS.find(x=>x.id===id);let factor=s.health<25?.6:1;if(s.items.includes('notebook')&&['research','study'].includes(id))factor*=1.2;if(s.items.includes('laptop')&&id==='build')factor*=1.25;const gains={};for(const [k,v]of Object.entries(a.fx)){const newv=clamp(s.skills[k]+Math.round(v*factor));gains[k]=newv-s.skills[k];s.skills[k]=newv;}s.health=clamp(s.health+a.health+(a.health<0&&s.items.includes('chair')?2:0));s.xp+=a.xp;learn(s,a.lesson);if(id==='study')learn(s,data.lessons.find(l=>!s.lessons.includes(l.id))?.id);rows.push({name:a.name,health:a.health+(a.health<0&&s.items.includes('chair')?2:0),gains});}
 const bonus=monthlyTraitEffects(s);for(const [key,value]of Object.entries(bonus)){if(key==='health'){const before=s.health;s.health=clamp(s.health+value);bonus[key]=s.health-before;}else{const before=s.skills[key];s.skills[key]=clamp(s.skills[key]+value);bonus[key]=s.skills[key]-before;}}
 const spaceEffects=locationBonus(s.businessPlace);for(const [key,value]of Object.entries(spaceEffects)){const old=s.skills[key];s.skills[key]=clamp(old+value);spaceEffects[key]=s.skills[key]-old;}
 const signature=signatureEffects(s);applyEffects(s,signature);
 const ind=data.industries[s.industry];let newCustomers=0;
 if(s.skills.product>=30){const salesWeeks=s.plan.filter(x=>x==='sales').length;newCustomers=Math.max(1,Math.round((s.skills.sales*.11+s.skills.insight*.06+s.skills.network*.04+salesWeeks*4)*(0.9+random(s)*.2)*Math.max(.1,1+(s.demandMod??0))));s.customers=Math.max(0,Math.round(s.customers*(1-clamp((ind.churn||.07)+(s.churnMod??0),0,.9))))+newCustomers;}
 s.revenue=Math.round(s.customers*ind.arpu*(.7+s.skills.product/100)*Math.max(.1,1+(s.arpuMod??0)));
 const running=Math.round(s.revenue*clamp((ind.cogs||.25)+(s.worldCost??0),0,.95))+f.fixed;s.profit=s.revenue-running-f.cost;s.cash+=s.revenue-running;if(s.items.includes('plant'))s.health=clamp(s.health+5);s.cash=Math.round(s.cash);s.monthlyExpense=running+f.cost;
 s.history.push({month:s.month,revenue:s.revenue,profit:s.profit,cash:s.cash,health:s.health,skills:{...s.skills},before:{cash:before.cash,revenue:before.revenue,customers:before.customers,health:before.health,skills:{...before.skills}},expense:s.monthlyExpense,actions:[...s.plan],spaceEffects:{...spaceEffects},customers:s.customers,team:s.team,equity:s.equity,businessPlace:s.businessPlace});
 const report={month:s.month,rows,traitEffects:bonus,signatureEffects:signature,spaceEffects,newCustomers,revenue:s.revenue,expense:running+f.cost,profit:s.profit,health:s.health-before.health,skills:Object.fromEntries(Object.keys(SKILLS).map(k=>[k,s.skills[k]-before.skills[k]]))};
 s.plan=[];s.month++;
 const due=(s.delayed||[]).filter(d=>d.month<=s.month-1);s.delayed=(s.delayed||[]).filter(d=>d.month>s.month-1);
 for(const d of due){applyEffects(s,adaptEffects(d.fx,s));applyContext(s,d.fx);s.journal.unshift({month:s.month-1,title:'이전 선택의 후속 결과',text:d.text,type:'event'});}
 roundMoney(s);
 if(s.health<=0)s.ending='burnout';else if(s.month>60)s.ending=s.profit>0&&s.cash>3000?'growth':'survive';else if(s.cash<0)s.pending=adaptEvent(data.events.find(e=>e.id==='e_rescue'),s);else s.pending=nextEvent(s,data);
 return {state:syncRoadmap(s),report};
}
export function nextEvent(s,data){
 const queued=s.queuedEvents?.shift();if(queued){const raw=data.events.find(e=>e.id===queued);if(raw&&eventAvailability(s,raw,data).ok)return adaptEvent(raw,s);}
 if((s.month-1)%10===0&&data.worldEvents?.length){const pool=data.worldEvents.filter(w=>!s.seenEvents.includes('world_'+w.id));const world=(pool.length?pool:data.worldEvents)[Math.floor(random(s)*(pool.length||data.worldEvents.length))];return adaptEvent({id:'world_'+world.id,title:world.headline,text:`${world.label} 상황에서 회사의 다음 방향을 정해 주세요.`,choices:world.branches.map(b=>({...b,label:b.label+' · '+b.text.replace(/\n/g,' '),next:b.follow}))},s);}
 const industryEvent=data.events.find(e=>e.industryMonth&&e.ind===s.industry&&!s.seenEvents.includes(e.id)&&eventAvailability(s,e,data).ok);
 if(industryEvent)return adaptEvent(industryEvent,s);
 const relationshipEvent=nextRelationshipEvent(s);if(relationshipEvent)return adaptEvent(relationshipEvent,s);
 const encounter=nextEncounter(s,data);if(encounter)return adaptEvent(encounter,s);
 const available=data.events.filter(e=>!e.forced&&!e.chain&&!e.megaId&&!e.id.startsWith('m_')&&eventAvailability(s,e,data).ok&&!s.seenEvents?.includes(e.id));
 const adverse=available.filter(event=>ADVERSE_EVENTS.has(event.id));
 const ordinary=available.filter(event=>!ADVERSE_EVENTS.has(event.id));
 const wantAdverse=random(s)<(adverseChance[s.difficulty]??adverseChance.normal);
 const preferred=wantAdverse?adverse:ordinary,pool=preferred.length?preferred:available;
 const picked=priorityEvents.map(id=>pool.find(e=>e.id===id)).find(Boolean)||pool[Math.floor(random(s)*pool.length)];
 if(!picked)return null;return adaptEvent(picked,s);
}
function mergeFx(base={},extra={}){const merged={...base};for(const [k,v]of Object.entries(extra)){merged[k]=typeof v==='number'?(Number(merged[k])||0)+v:v;}return merged;}
export function adaptEffects(raw={},s){
 const fx={};for(const [k,v]of Object.entries(raw)){if(!Number.isFinite(v))continue;
  const key={brand:'sales',reputation:'network',fixedCost:'costMod',worldDemand:'demandMod'}[k]||k;
  if(k==='burn')fx.cash=(fx.cash||0)+Math.round(v*Math.max(200,s.monthlyFixed??costs(s)));
  else if(k==='fixedCostPct')fx.costMod=(fx.costMod||0)+Math.round(costs(s)*v/100);
  else if(k==='fund')fx.cash=(fx.cash||0)+v;
  else fx[key]=(fx[key]||0)+v;
 }return fx;
}
export function adaptEvent(raw,s){
 return {id:raw.id,title:raw.title,text:raw.text,who:raw.who||'mentor',cat:raw.cat||'management',plan:raw.plan||[],req:copy(raw.req||{}),phase:'choice',calendar:raw.calendar,relationship:raw.relationship,card:raw.card||(raw.id.startsWith('world_')?'c_shock':null),choices:raw.choices.map(c=>{
  // Mini-games use their published B outcome in this weekly-planning adaptation.
  const rawFx=mergeFx(c.fx,c.mg?.fx?.B);
  return {id:c.id,label:c.label,tags:copy(c.tags||[]),out:c.out||'이번 선택을 다음 달의 경험으로 남깁니다.',req:copy(c.req||{}),hint:c.hint,fx:adaptEffects(rawFx,s),context:rawFx,special:c.special,end:c.end,next:c.next,later:copy(c.later?(Array.isArray(c.later)?c.later:[c.later]):[]),resultNote:c.mg?'기본 결과 기준':''};
 })};
}
function applyContext(s,fx={}){
 s.flags??=[];s.seats??={};s.relations??={};
 if(fx.flag&&!s.flags.includes(fx.flag))s.flags.push(fx.flag);if(fx.unflag)s.flags=s.flags.filter(x=>x!==fx.unflag);
 if(fx.seat)s.seats[fx.seat]=true;if(fx.unseat)delete s.seats[fx.unseat];
 for(const [key,v]of Object.entries(fx.rel||{}))s.relations[key]=clamp((s.relations[key]??15)+v,-100,100);
}
function applyEffects(s,fx={}){
 for(const [key,value]of Object.entries(fx)){
  if(key in s.skills)s.skills[key]=clamp(s.skills[key]+value);
  else if(key==='health')s.health=clamp(s.health+value);
  else if(key==='custPct')s.customers=Math.max(0,Math.round(s.customers*(1+value/100)));
  else if(['cash','customers','costMod','team','equity','hiddenRisk','morale','debt','guarantee','arpuMod','demandMod','churnMod','capacity','worldCost'].includes(key))s[key]=(s[key]??0)+value;
 }
 s.customers=Math.max(0,Math.round(s.customers));s.team=Math.max(0,Math.round(s.team??0));s.equity=clamp(s.equity??100);s.hiddenRisk=clamp(s.hiddenRisk??5);s.morale=clamp(s.morale??70);if(s.team)s.seats.staff=true;else delete s.seats.staff;
}
function applySpecial(s,id){
 const needed=Math.max(300,Math.round(-s.cash+Math.max(200,costs(s))*2));
 if(id==='inject'){const allowance=s.investmentLimit==='flex'?Math.max(0,Math.floor(s.initialInvestment*1.5)-s.invested):Infinity;const n=Math.round(Math.min(s.reserve,needed,allowance));s.reserve-=n;s.cash+=n;s.invested+=n;return `개인 비상금 ${n.toLocaleString()}만 원을 회사에 투입했어요.`;}
 if(id==='family_loan'){s.cash+=needed;s.debt+=needed;s.familyDebt+=needed;s.relations.family=(s.relations.family??0)-20;return `가족에게 ${needed.toLocaleString()}만 원을 빌렸어요. 가족 관계 −20.`;}
 if(id==='guarantee_loan'){const n=Math.round(needed*1.5);s.cash+=n;s.debt+=n;s.guarantee+=n;return `보증대출 ${n.toLocaleString()}만 원을 받았어요. 부채에는 매달 0.6%의 이자가 붙어요.`;}
 if(id==='layoff'){const n=Math.ceil(s.team/2);s.team-=n;s.morale=clamp(s.morale-15);s.skills.product=clamp(s.skills.product-4);if(!s.team)delete s.seats.staff;return `직원 ${n}명을 줄였어요. 다음 달 인건비가 줄어들어요.`;}
 return '';
}
export function chooseEvent(state,i){
 if(!state.pending||!state.pending.choices[i])return state;
 const choice=state.pending.choices[i];if(!choiceAvailability(state,choice).ok)return state;
 const s=copy(state),e=s.pending,c=e.choices[i];const checkpointId=captureCheckpoint(s,'event',e.title,e.calendar?.elapsed??Math.max(1,s.month-1));applyEffects(s,c.fx);applyContext(s,c.context);const specialText=applySpecial(s,c.special);
 for(const d of c.later||[])s.delayed.push({...copy(d),month:(e.calendar?.elapsed??s.month-1)+d.after});
 if(c.next)s.queuedEvents.push(c.next);
 if(!s.seenEvents.includes(e.id))s.seenEvents.push(e.id);
 s.lastDecisionMonth=e.calendar?.elapsed??Math.max(1,s.month-1);s.xp+=15;learn(s,e.card);s.journal.unshift({month:e.calendar?.elapsed??Math.max(1,s.month-1),checkpointId,eventId:e.id,who:e.who,card:e.card,businessPlace:s.businessPlace,title:e.title,text:c.out+(specialText?' '+specialText:''),choice:c.label,type:'event'});s.pending=null;roundMoney(s);
 if(c.end)s.ending=c.end;else if(s.health<=0)s.ending='burnout';
 return syncRoadmap(s);
}
export function requestFinancing(state,data){if(state.pending||state.ending||forecast(state,data).cashAfterCosts>=0&&state.cash>=costs(state,data)+40)return state;const s=copy(state);s.pending=adaptEvent(data.events.find(e=>e.id==='e_rescue'),s);return s;}
export function buyItem(state,id){const item=ITEMS.find(x=>x.id===id);if(!item||state.pending||state.ending||state.items.includes(id)||state.cash<item.price)return state;const s=copy(state);s.cash-=item.price;s.items.push(id);s.journal.unshift({month:s.month,title:item.name+' 구입',text:item.desc,type:'item'});return s;}
export function abandon(state){const s=copy(state);s.ending='close';s.pending=null;return s;}
export function effectsText(fx={}){const labels={...SKILLS,cash:'현금',health:'체력',customers:'고객',costMod:'월 고정비',team:'직원',equity:'대표 지분',hiddenRisk:'누적 위험',morale:'팀 사기',debt:'부채',guarantee:'개인 보증',custPct:'고객',arpuMod:'객단가',demandMod:'신규 고객 유입',churnMod:'고객 이탈률',capacity:'거점',worldCost:'원가율'};return Object.entries(fx).filter(([,v])=>Number.isFinite(v)&&v!==0).map(([k,v])=>{const percent=['arpuMod','demandMod','churnMod','worldCost'].includes(k);const n=Math.round(v*(percent?100:1)*10)/10;return `${labels[k]||k} ${n>0?'+':''}${n}${['cash','costMod','debt','guarantee'].includes(k)?'만 원':['customers','team'].includes(k)?'명':['custPct','equity'].includes(k)||percent?'%':''}`;}).join(' · ');}

export function changeBusinessPlace(s,id){
 if(s.pending||s.ending||!canRentLocation(id)||id===(s.businessPlace??'home'))return s;
 const n=copy(s),place=getLocation(id);n.businessPlace=id;n.monthlyFixed=costs(n);
 n.journal.unshift({month:s.month,title:'사업장 변경',text:`${place.name}로 옮겼어요. 월 임대료 ${place.monthlyCost.toLocaleString()}만 원은 월말 고정비에 반영돼요.`,type:'location'});
 return n;
}
export function updateMotto(s,value){return {...s,motto:String(value??'').trim().slice(0,80)};}

export function requestScheduledEvent(state){if(state.pending||state.lastScene?.unread||state.ending)return state;const raw=calendarEvent(state);return raw?{...state,pending:adaptEvent(raw,state)}:state;}
