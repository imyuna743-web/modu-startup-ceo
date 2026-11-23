import {SLOT_KEY,emptySlotStore,addGameSlot,saveActiveSlot,activateSlot,activeGame,readSlotStore,writeSlotStore} from '../dist/save-slots.js';
import {gaugeBand} from '../dist/stat-view.js';
import {LOCATIONS,locationRent} from '../dist/locations.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createState as newState,SAVE_KEY,PORTRAITS,AGE_DIFFICULTIES,getPortrait,validateState,migrateState,planAction,removePlan,runMonth,chooseEvent,buyItem,forecast,SKILLS,adaptEvent,requestFinancing,nextEvent,costs,changeBusinessPlace,updateMotto} from '../dist/engine.js';
import {GAUGES,GAUGE_RANGES,rollTraits,rollGauges,traitDetails,traitBonuses,conditionDifficulty,startingFinances,buildStartingProfile} from '../dist/background.js';
import {checkRequirements,choiceAvailability,eventAvailability,runway,hasPermanentGaugeLock,choicesWithPermanentLast} from '../dist/conditions.js';
const data=JSON.parse(readFileSync(new URL('../dist/content.json',import.meta.url)));
data.worldEvents=JSON.parse(readFileSync(new URL('../dist/world-events.json',import.meta.url)));
const createState=(industry='saas',options={})=>newState(industry,'새봄',{rng:()=>.5,portrait:'thirties-woman',industryData:data.industries[industry],...options,...(data.industries[industry].exclusiveCharacter?{portrait:data.industries[industry].exclusiveCharacter,unlockedCharacters:[data.industries[industry].exclusiveCharacter]}:{})});
const planned=(s,ids=['research','build','study','rest'])=>ids.reduce(planAction,s);
const event=(s,id)=>({...s,pending:adaptEvent(data.events.find(e=>e.id===id),s)});
const setGauge=(s,key,value)=>({...s,gauges:{...s.gauges,[key]:value}});
test('four-week planning is bounded, immutable and cannot mutate pending months',()=>{const s=createState(),p=planned(s);assert.equal(s.plan.length,0);assert.equal(p.plan.length,4);assert.equal(planAction(p,'sales'),p);assert.equal(planAction(s,'fake'),s);assert.equal(removePlan(p,1).plan.length,3);assert.equal(p.plan.length,4);const pending=event(s,'e_grant');assert.equal(planAction(pending,'build'),pending);});
test('incomplete or unaffordable plans cannot advance or charge money',()=>{const s=createState();assert.ok(runMonth(s,data).error);const poor=planned({...s,cash:5});const result=runMonth(poor,data);assert.ok(result.error);assert.equal(result.state,poor);assert.equal(result.state.month,1);assert.equal(result.state.cash,5);});
test('month accounting reconciles and health forecast includes background and equipment',()=>{const s=planned({...createState(),items:['chair','plant','laptop']});const f=forecast(s,data),{state,report}=runMonth(s,data);assert.equal(state.cash,s.cash+report.revenue-report.expense);assert.equal(state.profit,report.revenue-report.expense);assert.equal(state.health,f.health);assert.equal(state.month,2);assert.equal(state.history.length,1);assert.ok(state.skills.product>s.skills.product);assert.equal(s.history.length,0);});
test('pending events retain requirements through save, and can be settled only once',()=>{let s=event(createState(),'e_grant');s=JSON.parse(JSON.stringify(s));assert.ok(validateState(s));assert.ok(runMonth(s,data).error);assert.deepEqual(s.pending.choices[0].req,{g:{edu:[41,100]}});const n=chooseEvent(s,0);assert.equal(n.pending,null);assert.equal(chooseEvent(n,0),n);assert.ok(n.journal.some(j=>j.type==='event'));assert.equal(n.cash,s.cash+600);});
test('equipment charges once and changes growth',()=>{const s=createState(),n=buyItem(s,'laptop');assert.equal(n.cash,s.cash-400);assert.equal(buyItem(n,'laptop'),n);assert.equal(buyItem({...s,cash:2},'laptop').cash,2);assert.ok(runMonth(planned(n),data).state.skills.product>runMonth(planned(s),data).state.skills.product);});
test('all nine background traits are generated separately and bonus per stat stays small',()=>{const a=rollTraits(()=>0),b=rollTraits(()=>.9999999);assert.equal(Object.keys(a).length,9);assert.equal(traitDetails(a).length,9);assert.equal(a.intelligence,70);assert.equal(b.intelligence,130);assert.equal(a.grit,1);assert.equal(b.grit,100);assert.notDeepEqual(a,b);assert.match(a.mbti,/^[EI][SN][TF][JP]$/);for(const t of [a,b,rollTraits(()=>.5)])for(const bonus of Object.values(traitBonuses(t)))assert.ok(bonus>=0&&bonus<=4);});
test('eight base portraits have the same starting conditions at the same explicit difficulty',()=>{
 assert.equal(PORTRAITS.length,8);let baseline;
 for(const age of ['20s','30s','40s','50s']){
  const pair=PORTRAITS.filter(p=>p.ageGroup===age);assert.deepEqual(pair.map(p=>p.gender),['여성','남성']);
  for(const p of pair){const state=createState('saas',{portrait:p.id,difficulty:'normal'});assert.equal(state.difficulty,'normal');
   const values={gauges:state.gauges,skills:state.skills,health:state.health,cash:state.cash};if(baseline)assert.deepEqual(values,baseline);else baseline=values;
   assert.ok(readFileSync(new URL('../dist/assets/'+p.file,import.meta.url)).length>0);
  }
 }
 assert.equal(getPortrait('tied').file,'portrait-tied.webp');
});
test('five gauges use the original weighted difficulty, including exact boundaries',()=>{for(const [value,stars]of [[20,5],[21,4],[40,4],[41,3],[60,3],[61,2],[80,2],[81,1],[100,1]]){const g=Object.fromEntries(Object.keys(GAUGES).map(k=>[k,value]));assert.equal(conditionDifficulty(g).stars,stars);}const base={edu:50,looks:50,capital:50,skill:50,career:50};assert.equal(conditionDifficulty({...base,capital:60}).score,54);assert.equal(conditionDifficulty({...base,looks:60}).score,50.7);});
test('capital uses original curved cash formula, setup, reserve and debt thresholds',()=>{const base={edu:50,looks:50,capital:50,skill:50,career:34};const m=startingFinances(base,data.industries.saas);assert.deepEqual(m,{total:5077,setup:300,cash:4777,reserve:3049,familyDebt:0,guarantee:0,debt:0,investment:5077,lite:false});for(const [cap,hasFamily,hasGuarantee]of [[69,false,false],[70,true,false],[84,true,false],[85,true,true]]){const f=startingFinances({...base,capital:cap},data.industries.cafe);assert.equal(f.familyDebt>0,hasFamily);assert.equal(f.guarantee>0,hasGuarantee);assert.equal(f.cash,f.total-f.setup);assert.equal(f.investment+f.debt,f.total);}assert.ok(startingFinances({...base,capital:15},data.industries.cafe).lite);});
test('preview exactly matches committed game, and custom conditions remain independent',()=>{const gauges={edu:41,looks:55,capital:30,skill:67,career:34},traits=rollTraits(()=>.5),startingStats={health:80};const preview=buildStartingProfile({gauges,traits,health:80,industry:data.industries.saas});const s=createState('saas',{gauges,traits,startingStats});assert.deepEqual(s.skills,preview.skills);assert.equal(s.health,preview.health);assert.equal(s.cash,preview.finances.cash);assert.deepEqual(s.gauges,gauges);const custom=createState('saas',{mode:'custom',gauges,traits,overrides:{health:1,product:100,sales:0,insight:100,management:100,network:100}});assert.equal(custom.health,1);assert.deepEqual(custom.skills,{product:100,sales:0,insight:100,management:100,network:100});assert.deepEqual(custom.gauges,gauges);assert.ok(validateState(custom));});
test('education 41–60 unlocks both routes; 40 and 61 do not',()=>{for(const [edu,expected]of [[1,[false,true,true]],[40,[false,true,true]],[41,[true,true,true]],[60,[true,true,true]],[61,[true,false,true]],[100,[true,false,true]]]){const s=event(setGauge(createState(),'edu',edu),'e_grant');assert.deepEqual(s.pending.choices.map(c=>choiceAvailability(s,c).ok),expected,`edu ${edu}`);for(let i=0;i<3;i++)if(!expected[i]){assert.equal(chooseEvent(s,i),s);assert.equal(s.cash,createState().cash);}}});
test('skill, looks, career and cash boundary locks are enforced by the engine',()=>{for(const [id,index,key,threshold]of [['e_big_client',2,'skill',67],['e_influencer',0,'looks',55],['e_angel',1,'career',34]]){const low=event(setGauge(createState(),key,threshold-1),id),high=event(setGauge(createState(),key,threshold),id);assert.equal(choiceAvailability(low,low.pending.choices[index]).ok,false);assert.equal(chooseEvent(low,index),low);assert.equal(choiceAvailability(high,high.pending.choices[index]).ok,true);assert.equal(chooseEvent(high,index).pending,null);}const low=event({...createState(),cash:2999},'e_expand'),high=event({...createState(),cash:3000},'e_expand');assert.equal(chooseEvent(low,0),low);assert.equal(chooseEvent(high,0).cash,0);assert.equal(high.pending.choices.length,3);assert.equal(event(createState(),'e_big_client').pending.choices.length,4);assert.equal(event(createState(),'e_rescue').pending.choices.length,5);});
test('high technical skill requires product time in monthly planning',()=>{const s=setGauge(createState(),'skill',67),three=['rest','study','sales'].reduce(planAction,s);assert.equal(planAction(three,'rest'),three);const direct={...s,plan:['rest','rest','rest','rest']};assert.match(runMonth(direct,data).error,/제품/);assert.equal(runMonth(planAction(three,'build'),data).error,undefined);assert.equal(runMonth({...setGauge(s,'skill',66),plan:['rest','rest','rest','rest']},data).error,undefined);});
test('hire, flags, investor seat and equity change future choice availability',()=>{let s=event(createState(),'e_first_hire');const before=costs(s);s=chooseEvent(s,0);assert.equal(s.team,1);assert.ok(s.seats.staff);assert.ok(s.flags.includes('hired_first'));assert.ok(costs(s)>before);assert.equal(eventAvailability(s,data.events.find(e=>e.id==='e_first_hire'),data).ok,false);s=event(s,'e_overwork');assert.ok(choiceAvailability(s,s.pending.choices[2]).ok);let investor=event(setGauge(createState(),'career',34),'e_angel');investor=chooseEvent(investor,1);assert.equal(investor.equity,90);assert.ok(investor.seats.investor);assert.ok(investor.flags.includes('funded'));assert.equal(eventAvailability(investor,data.events.find(e=>e.id==='e_angel'),data).ok,false);});
test('full AND requirement evaluation includes flags, seats, cash, runway and unknown-key defense',()=>{const s={...createState(),cash:800,monthlyFixed:200,team:1,equity:70,hiddenRisk:41,revenue:300,customers:30,health:55,month:11,flags:['seeded'],seats:{mentor:true}};const req={g:{edu:[41,100]},flag:'seeded',noFlag:'series_a',seat:'mentor',noSeat:'investor',minTeam:1,minCash:800,minRev:300,maxRev:300,minCustomers:30,customerSample:true,maxHealth:60,minHidden:40,maxEquity:72,minRunway:4,maxRunway:4,minTurn:10};assert.ok(checkRequirements(s,req).ok);assert.equal(checkRequirements({...s,cash:799},req).ok,false);assert.equal(checkRequirements(s,{unrecognized:1}).ok,false);assert.equal(runway({...s,history:[{}],monthlyExpense:200,revenue:300}),Infinity);assert.equal(runway({...s,cash:-1}),0);});
test('mega choices preserve all eight original gates including capital AND runway',()=>{assert.equal(data.worldEvents.length,8);for(const w of data.worldEvents){const e=adaptEvent({id:'world_'+w.id,title:w.headline,choices:w.branches},createState());assert.equal(e.choices.length,w.branches.length);assert.deepEqual(e.choices.map(c=>c.req),w.branches.map(c=>c.req||{}));}const w=data.worldEvents.find(w=>w.id==='pandemic'),c=w.branches.find(c=>c.id==='seize');let s=setGauge({...createState(),cash:800,monthlyFixed:200},'capital',40);assert.ok(checkRequirements(s,c.req).ok);assert.equal(checkRequirements({...s,cash:799},c.req).ok,false);assert.equal(checkRequirements(setGauge(s,'capital',39),c.req).ok,false);});
test('event pool respects industry, stage, history, team and investment prerequisites',()=>{const s={...createState('cafe'),month:7,revenue:1,seenEvents:['e_grant','e_influencer','e_first_hire','e_angel']};const choice=nextEvent(structuredClone(s),data);assert.ok(choice);const raw=data.events.find(e=>e.id===choice.id);assert.ok(eventAvailability(s,raw,data).ok);assert.notEqual(choice.id,'e_big_client');assert.equal(eventAvailability(s,data.events.find(e=>e.id==='e_seed'),data).ok,false);assert.equal(eventAvailability({...s,revenue:500},data.events.find(e=>e.id==='e_seed'),data).ok,true);assert.equal(eventAvailability(s,data.events.find(e=>e.id==='e_conflict'),data).ok,false);});
test('rescue choices enforce investment cap, family relationship and guarantee boundaries',()=>{let s=event({...createState(),cash:0,investmentLimit:'strict'},'e_rescue');assert.equal(chooseEvent(s,0),s);s={...s,investmentLimit:'flex',invested:s.initialInvestment*1.5};assert.equal(chooseEvent(s,0),s);s={...s,investmentLimit:'open',reserve:1000};const injected=chooseEvent(s,0);assert.ok(injected.cash>0);assert.equal(injected.reserve+injected.cash,s.reserve);assert.equal(injected.invested-s.invested,injected.cash);s={...s,relations:{family:-40},guarantee:30000};assert.equal(chooseEvent(s,1),s);assert.equal(chooseEvent(s,2),s);assert.equal(chooseEvent(s,3),s);assert.equal(chooseEvent(s,4).ending,'close');const family=chooseEvent({...s,relations:{family:-39}},1);assert.ok(family.cash>0);assert.equal(family.debt-s.debt,family.cash);assert.equal(family.relations.family,-59);});
test('low-capital hardcore starts can obtain aid instead of getting permanently stuck',()=>{const s=createState('saas',{portrait:'fifties-woman',difficulty:'hardcore',rng:()=>0});assert.equal(s.difficulty,'hardcore');assert.ok(s.cash<costs(s));const aid=requestFinancing(s,data);assert.equal(aid.pending.id,'e_rescue');const funded=chooseEvent(aid,1);assert.ok(funded.cash>costs(funded));assert.ok(funded.debt>s.debt);assert.ok(validateState(funded));const r=runMonth(planned(funded,['rest','build','research','rest']),data);assert.equal(r.error,undefined);assert.equal(r.state.ending,null);});
test('deferred consequences are applied once and queue chain events',()=>{let s={...createState(),month:7,revenue:2000,cash:10000};s=chooseEvent(event(s,'e_expand'),1);assert.equal(s.delayed.length,1);const scheduled=s.delayed[0].month;s.month=scheduled;s.plan=['rest','build','sales','rest'];const r=runMonth(s,data);assert.equal(r.state.delayed.length,0);assert.ok(r.state.costMod>=300);assert.ok(r.state.journal.some(j=>j.title==='이전 선택의 후속 결과'));assert.equal(r.state.cash,s.cash+r.report.profit-3000);});
test('legacy save migration preserves cash, health, skills, time and old portraits',()=>{const old=createState();delete old.rulesVersion;for(const k of ['gauges','traits','conditionDifficulty','bonuses','initialFinances','reserve','debt','familyDebt','guarantee','invested','initialInvestment','investmentLimit','team','equity','hiddenRisk','morale','baseFixed','wage','monthlyFixed','arpuMod','demandMod','churnMod','capacity','flags','delayed','seenEvents','queuedEvents','seats','relations'])delete old[k];old.portrait='tied';old.month=17;old.cash=1234;const migrated=migrateState(old,data);assert.ok(validateState(migrated));for(const k of ['cash','health','skills','month','portrait'])assert.deepEqual(migrated[k],old[k]);assert.ok(migrated.legacyConditions);assert.deepEqual(migrateState(migrated,data),migrated);assert.deepEqual(JSON.parse(JSON.stringify(migrated)).traits,migrated.traits);});
test('invalid new save metadata is rejected',()=>{const s=createState();assert.equal(validateState({...s,gauges:{...s.gauges,capital:NaN}}),false);assert.equal(validateState({...s,team:Infinity}),false);assert.equal(validateState({...s,traits:null}),false);});
test('all industries complete 60 months with valid states, real gates and bounded growth',()=>{for(const industry of Object.keys(data.industries)){let s=createState(industry,{portrait:'bob'});for(let turn=0;turn<180&&!s.ending;turn++){const actions=s.health<45?['rest','build','sales','rest']:['research','build','sales','rest'];let p=planned(s,actions);if(forecast(p,data).cashAfterCosts<0){p=requestFinancing(p,data);const idx=p.pending.choices.findIndex(c=>!c.end&&choiceAvailability(p,c).ok&&c.special!=='layoff');assert.ok(idx>=0);p=chooseEvent(p,idx);}const r=runMonth(p,data);assert.equal(r.error,undefined,`${industry} month ${s.month}`);s=r.state;if(s.pending){const allowed=s.pending.choices.map((c,i)=>({c,i})).filter(({c})=>!c.end&&choiceAvailability(s,c).ok);const pick=allowed.find(({c})=>(c.fx.health||0)>=0&&(c.fx.cash||0)>=0)||allowed.at(-1);assert.ok(pick,industry);s=chooseEvent(s,pick.i);}assert.ok(validateState(s),`${industry} month ${s.month}`);for(const value of Object.values(s.skills))assert.ok(value>=0&&value<=100);}assert.equal(s.month,61,`${industry}: ${s.ending} at ${s.month}`);assert.equal(s.history.length,60);assert.ok(s.seenEvents.length>0);}});

test('health forecast clamps trait and equipment effects in the actual order',()=>{const s=planned({...createState(),health:1,items:['plant'],traits:{...createState().traits,grit:1,mbti:'ESTJ'}},['build','build','sales','sales']);const r=runMonth(s,data);assert.equal(r.state.health,forecast(s,data).health);assert.equal(r.state.health,5);assert.equal(r.report.traitEffects.health,0);});

test('gauge colors include every exact user-requested boundary',()=>{
 for(const [value,band] of [[0,'red'],[19,'red'],[20,'orange'],[39,'orange'],[40,'yellow'],[59,'yellow'],[60,'green'],[89,'green'],[90,'blue'],[100,'blue']])assert.equal(gaugeBand(value),band);
});
test('only fixed gauge failures are permanent and both bounds are inclusive',()=>{
 const s=setGauge(createState(),'edu',40);
 assert.equal(hasPermanentGaugeLock(s,{g:{edu:[41,100]}}),true);
 assert.equal(hasPermanentGaugeLock(s,{g:{edu:[1,40]},minCash:999999,minTeam:99,seat:'investor'}),false);
 assert.equal(hasPermanentGaugeLock(s,{g:{edu:[1,39]}}),true);
 assert.equal(hasPermanentGaugeLock(s,{g:{edu:[40,60]}},{minTeam:99}),false);
 assert.equal(hasPermanentGaugeLock(s,{g:{edu:[41,100]}},{minTeam:99}),true);
 assert.equal(hasPermanentGaugeLock(s,{minRunway:999,maxHealth:1,noFlag:'hired_first'}),false);
});
test('permanent choices sort last without changing selection identity or engine gating',()=>{
 const s=event(setGauge(createState(),'edu',40),'e_grant'),choices=s.pending.choices;
 const ordered=choicesWithPermanentLast(s,choices);
 assert.deepEqual(ordered.map(x=>x.index),[1,2,0]);
 assert.equal(ordered.at(-1).permanent,true);
 assert.equal(ordered[0].choice,choices[1]);
 assert.equal(chooseEvent(s,ordered.at(-1).index),s);
 assert.equal(chooseEvent(s,ordered[0].index).pending,null);
 assert.deepEqual(choices.map(c=>c.id),['a','b','c']);
 const mixed=[{req:{minCash:999999}},{req:{g:{edu:[41,100]}}},{req:{minTeam:99}},{req:{g:{edu:[1,39]}}}];
 assert.deepEqual(choicesWithPermanentLast(s,mixed).map(x=>x.index),[0,2,1,3]);
});
test('original locations charge rent once in month-end fixed costs without purchase fees or boosts',()=>{
 const s=createState(),before=costs(s);
 assert.equal(LOCATIONS.length,20);assert.equal(LOCATIONS.filter(x=>x.monthlyCost!==null).length,14);
 assert.equal(locationRent('cowork'),80);assert.equal(locationRent('office'),250);
 const moved=changeBusinessPlace(s,'cowork');
 assert.equal(moved.cash,s.cash);assert.deepEqual(moved.skills,s.skills);assert.equal(costs(moved),before+80);
 assert.equal(changeBusinessPlace(moved,'cowork'),moved);
 const result=runMonth(planned(moved),data),base=runMonth(planned(s),data);
 assert.equal(result.report.expense-base.report.expense,80);
 assert.equal(base.state.cash-result.state.cash,80);
 const office=changeBusinessPlace(moved,'office');assert.equal(costs(office),before+250);
 assert.equal(costs(changeBusinessPlace(office,'home')),before);
 assert.equal(changeBusinessPlace(s,'center'),s);assert.equal(changeBusinessPlace(s,'invalid'),s);
 assert.equal(changeBusinessPlace(event(s,'e_grant'),'office').businessPlace,'home');
 assert.equal(changeBusinessPlace({...s,ending:'close'},'office').businessPlace,'home');
 assert.ok(validateState(JSON.parse(JSON.stringify(moved))));
});
test('motto and property persist, and earlier saves gain defaults without losing progress',()=>{
 const s=createState(),old=structuredClone(s);delete old.motto;delete old.businessPlace;
 assert.ok(validateState(old));const migrated=migrateState(old,data);
 assert.equal(migrated.motto,'');assert.equal(migrated.businessPlace,'home');
 for(const k of ['cash','month','skills','items','health'])assert.deepEqual(migrated[k],old[k]);
 const edited=updateMotto(changeBusinessPlace(migrated,'cowork'),'  꾸준히, 내 방식대로.  '),saved=JSON.parse(JSON.stringify(edited));
 assert.equal(saved.motto,'꾸준히, 내 방식대로.');assert.equal(saved.businessPlace,'cowork');assert.ok(validateState(saved));
 assert.equal(updateMotto(saved,'').motto,'');assert.equal(updateMotto(saved,'가'.repeat(90)).motto.length,80);
 assert.equal(validateState({...saved,businessPlace:'center'}),false);assert.equal(validateState({...saved,motto:42}),false);
});

test('founder experience changes initial operational skills, while custom final values win',()=>{
 const first=createState('saas',{founderType:'aspiring'}),again=createState('saas',{founderType:'experienced'});
 assert.equal(first.founderType,'aspiring');assert.equal(again.founderType,'experienced');
 assert.equal(again.skills.management-first.skills.management,4);assert.equal(again.skills.insight-first.skills.insight,2);
 assert.deepEqual(first.gauges,again.gauges);assert.equal(first.cash,again.cash);
 const manual=createState('saas',{founderType:'experienced',mode:'custom',overrides:{management:31,insight:20}});
 assert.equal(manual.skills.management,31);assert.equal(manual.skills.insight,20);assert.ok(validateState(manual));
 const preview=buildStartingProfile({gauges:again.gauges,traits:again.traits,health:78,industry:data.industries.saas,founderType:'experienced'});
 assert.deepEqual(preview.skills,again.skills);
});

test('separate slots preserve older games and autosave only the active game',()=>{
 const first=createState(),second=updateMotto(createState('cafe'),'두 번째 회사');
 let store=addGameSlot(emptySlotStore(),first,'2026-11-22T00:00:00Z');
 store=addGameSlot(store,second,'2026-11-22T01:00:00Z');
 assert.equal(store.slots.length,2);assert.deepEqual(store.slots[0].state,first);
 const advanced={...second,month:4,cash:1234};store=saveActiveSlot(store,advanced);
 assert.deepEqual(store.slots[0].state,first);assert.equal(store.slots[1].state.cash,1234);
 store=activateSlot(store,'slot-1');assert.deepEqual(activeGame(store),first);
 const restored=activeGame(store);restored.cash=1;assert.equal(store.slots[0].state.cash,first.cash);
 store=saveActiveSlot(store,{...first,cash:2222});assert.equal(store.slots[1].state.month,4);
 assert.equal(activateSlot(store,'missing'),store);
 for(let i=0;i<8;i++)store=addGameSlot(store,second);
 assert.equal(store.slots.length,10);assert.equal(new Set(store.slots.map(slot=>slot.id)).size,10);
});
test('single-game saves migrate once, keep their backup, and survive slot switching on reload',()=>{
 const memory=new Map(),storage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value)};
 const legacy=createState();legacy.month=7;delete legacy.motto;delete legacy.businessPlace;delete legacy.founderType;
 memory.set(SAVE_KEY,JSON.stringify(legacy));
 let store=readSlotStore(storage,data);assert.equal(store.slots.length,1);assert.equal(activeGame(store).month,7);
 writeSlotStore(storage,store);assert.equal(memory.get(SAVE_KEY),JSON.stringify(legacy));
 store=addGameSlot(store,createState('cafe'));store=activateSlot(store,'slot-1');writeSlotStore(storage,store);
 const reloaded=readSlotStore(storage,data);assert.equal(reloaded.slots.length,2);assert.equal(activeGame(reloaded).month,7);
 assert.equal(reloaded.nextNumber,3);assert.ok(memory.has(SLOT_KEY));
});
