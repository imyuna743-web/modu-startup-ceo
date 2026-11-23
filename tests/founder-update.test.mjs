import {claimCareerRewards} from '../dist/career-economy.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {DIFFICULTIES,SPECIAL_CHARACTERS,rollDifficultyStats,founderProfile,mergeCharacterProgress,readCharacterProgress,writeCharacterProgress,characterStatus} from '../dist/founder-options.js';
import {createState,getPortrait,validateState,nextEvent,adaptEvent,chooseEvent,costs,migrateState} from '../dist/engine.js';
import {finishInitialPlan} from '../dist/startup-plan.js';
import {rollTraits} from '../dist/background.js';
import {createRoadmap,roadmapStatus,roadmapView,goalDate} from '../dist/plan-roadmap.js';
import {propertyScene,SEASONS} from '../dist/scenery.js';
import {endingFinances} from '../dist/ending-report.js';
import {endingView,moneyTone} from '../dist/ending-view.js';
import {profileView} from '../dist/profile-view.js';
import {extendGameContent} from '../dist/extended-cast.js';
import {simulateToEnding} from '../dist/automation.js';
import {eventAvailability,choiceAvailability} from '../dist/conditions.js';
const read=name=>JSON.parse(readFileSync(new URL('../dist/'+name,import.meta.url)));
const data=extendGameContent({...read('content.json'),story:read('story-content.json'),worldEvents:read('world-events.json')});
const fresh=(id='saas',options={})=>createState(id,'검증',{industryData:data.industries[id],rng:()=>.5,portrait:data.industries[id].exclusiveCharacter,unlockedCharacters:data.industries[id].exclusiveCharacter?[data.industries[id].exclusiveCharacter]:[],...options});
const additions=Object.keys(data.industries).filter(id=>data.industries[id].roadmap&&!data.industries[id].exclusiveCharacter);

test('difficulty controls all five randomized gauges, health and capital independently from age',()=>{
 let previous;
 for(const id of Object.keys(DIFFICULTIES)){
  for(const rng of [()=>0,()=>.5,()=>.999999999]){
   const rolled=rollDifficultyStats(id,rng);
   for(const [key,value]of Object.entries(rolled.gauges)){const [lo,hi]=DIFFICULTIES[id].ranges[key];assert.ok(value>=lo&&value<=hi);}
   const a=fresh('saas',{portrait:'bob',difficulty:id,rng}),b=fresh('saas',{portrait:'fifties-man',difficulty:id,rng});
   assert.deepEqual(a.gauges,b.gauges);assert.deepEqual(a.skills,b.skills);assert.equal(a.cash,b.cash);assert.equal(a.health,b.health);assert.ok(validateState(a));
  }
  assert.notDeepEqual(rollDifficultyStats(id,()=>0),rollDifficultyStats(id,()=>.99));
  const now=fresh('saas',{difficulty:id});if(previous){assert.ok(now.cash<previous.cash);assert.ok(now.health<previous.health);}previous=now;
 }
});

test('eight special founders use different artwork and locked characters cannot start early',()=>{
 assert.equal(SPECIAL_CHARACTERS.length,8);const hashes=new Set();
 for(const age of ['20s','30s','40s','50s'])assert.equal(SPECIAL_CHARACTERS.filter(p=>p.ageGroup===age).length,2);
 for(const p of SPECIAL_CHARACTERS){assert.equal(getPortrait(p.id).file,p.file);hashes.add(createHash('sha256').update(readFileSync(new URL('../dist/assets/'+p.file,import.meta.url))).digest('hex'));assert.equal(fresh('saas',{portrait:p.id}).portrait,'bob');}
 assert.equal(hashes.size,8);assert.ok(characterStatus({}).every(p=>!p.unlocked));
});

test('unlock progress is earned from play, uses per-run totals, and persists across new and deleted games',()=>{
 const initial=mergeCharacterProgress({},[fresh()]);assert.deepEqual(initial.earned,[]);
 const partial={...fresh(),history:[{month:1,revenue:600,actions:['research','research']}]};
 const merged=mergeCharacterProgress(initial,[partial,partial]);assert.equal(merged.progress.totalRevenue,600);assert.equal(merged.progress.researchWeeks,2);
 const successful={...fresh(),month:61,ending:'growth',health:80,customers:420,lessons:Array.from({length:40},(_,i)=>'lesson'+i),history:Array.from({length:60},(_,i)=>({month:i+1,revenue:2000,profit:40,health:80,actions:['research']}))};
 const qualified=mergeCharacterProgress(merged,[successful,{...successful,ending:'close'}]);assert.equal(qualified.earned.length,0);const unlocked=claimCareerRewards(qualified).meta;assert.equal(unlocked.earned.length,8);
 const storage={value:null,getItem(){return this.value},setItem(key,value){this.value=value}};
 writeCharacterProgress(storage,unlocked);assert.deepEqual(readCharacterProgress(storage,[fresh()]).earned,unlocked.earned);
 assert.equal(mergeCharacterProgress(unlocked,[]).earned.length,8);
 storage.value='broken';assert.deepEqual(readCharacterProgress(storage).earned,[]);
});

test('special bonuses match setup preview exactly, apply only once, and custom overrides are final',()=>{
 for(const p of SPECIAL_CHARACTERS){
  const rolled=rollDifficultyStats('normal',()=>.5),traits=rollTraits(()=>.5),options={portrait:p.id,unlockedCharacters:[p.id],difficulty:'normal',startingStats:rolled,gauges:rolled.gauges,traits};
  const preview=founderProfile({portrait:p.id,gauges:rolled.gauges,traits,health:rolled.health,industry:data.industries[p.industry]}),state=fresh(p.industry,options);
  assert.deepEqual(state.skills,preview.skills);assert.equal(state.health,preview.health);assert.equal(state.cash,preview.finances.cash);assert.ok(validateState(state));
  assert.deepEqual(migrateState(JSON.parse(JSON.stringify(state)),data).skills,state.skills);
  const custom=fresh(p.industry,{...options,mode:'custom',overrides:{health:100,product:0,sales:100}});assert.equal(custom.health,100);assert.equal(custom.skills.product,0);assert.equal(custom.skills.sales,100);
 }
});

test('six new industries have detailed plans, distinct measurable targets and three exclusive events each',()=>{
 assert.equal(additions.length,6);assert.equal(Object.keys(data.industries).length,22);
 for(const id of additions){
  const industry=data.industries[id];assert.ok(Object.keys(industry.segments).length>=9);assert.ok(Object.keys(industry.values).length>=6);assert.ok(Object.keys(industry.channels).length>=6);
  const s=finishInitialPlan(fresh(id),data),goals=s.initialPlan.roadmap.milestones;
  assert.equal(goals.find(g=>g.id==='launch').target,industry.roadmap.product);assert.equal(goals.find(g=>g.id==='customers').target,industry.roadmap.customers);
  const events=data.events.filter(e=>e.ind===id&&e.industryMonth);assert.equal(events.length,3);
  for(const raw of events){const eligible={...s,month:raw.industryMonth+1,cash:100000,seenEvents:[]};assert.ok(eventAvailability(eligible,raw,data).ok);assert.equal(eventAvailability({...eligible,industry:'saas'},raw,data).ok,false);assert.equal(eventAvailability({...eligible,month:raw.industryMonth},raw,data).ok,false);
   assert.ok(data.lessons.some(l=>l.id===raw.card));const pending=adaptEvent(raw,eligible);
   for(let i=0;i<3;i++){const start={...eligible,pending};assert.ok(choiceAvailability(start,pending.choices[i]).ok);const end=chooseEvent(start,i);assert.ok(validateState(end));assert.ok(end.seenEvents.includes(raw.id));}
  }
  const first={...s,month:4,cash:10000,seenEvents:[]};assert.equal(nextEvent(first,data).id,events[0].id);
 }
});

test('new industries and every difficulty complete automatic event selection without deadlocks',()=>{
 for(const id of additions)for(const difficulty of Object.keys(DIFFICULTIES)){
  const initial=fresh(id,{difficulty}),result=simulateToEnding(initial,data);
  assert.equal(result.error,undefined,`${id}/${difficulty}: ${result.error}`);assert.ok(result.state.ending,`${id}/${difficulty}`);assert.ok(validateState(result.state));assert.ok(result.steps<1200);
  if(result.state.month>4)assert.ok(result.state.seenEvents.includes(`e_${id}_1`));
  assert.equal(initial.month,1);
 }
});

test('goals show calendar deadlines and actual fulfillment dates including missed deadlines',()=>{
 const state=finishInitialPlan(fresh('bakery'),data);state.month=10;state.skills.product=20;state.initialStats.skills.product=20;
 state.history=[{month:8,actions:['research','research'],revenue:0,customers:0,skills:{product:20}}];
 const goals=roadmapStatus(state),research=goals.find(g=>g.id==='validate');assert.equal(research.status,'late');assert.equal(research.reachedMonth,8);
 const html=roadmapView(state);assert.match(html,/1년째 6월까지/);assert.match(html,/충족 · 1년째 8월 달성 · 기한 이후/);assert.match(html,/미충족 · 기한 경과/);assert.equal(goalDate(15),'2년째 3월');
 const profile=profileView(state,data,String);assert.match(profile,/나의 목표와 달성 날짜/);assert.doesNotMatch(profile,/조건에 따라 달라지는 선택|opportunity-grid/);
});

test('all seasonal previews use their own image and never mutate the actual month or rental conditions',()=>{
 const state={...fresh(),month:15},original=structuredClone(state),fixed=costs({...state,businessPlace:'cowork'},data);
 const images=new Set();for(const season of Object.keys(SEASONS)){
  const scene=propertyScene(state,data,'cowork',fixed,season);assert.ok(scene);assert.match(scene.body,new RegExp('data-season="'+season+'"'));assert.match(scene.body,/현재 게임: 3월 · 봄/);
  images.add(scene.body.match(/class="property-backdrop" src="([^"]+)"/)[1]);assert.match(scene.body,new RegExp(fixed.toLocaleString()));
 }
 assert.equal(images.size,4);assert.deepEqual(state,original);
});

test('personal profit reconciles with settlement and financial colors treat zero neutrally',()=>{
 const state={...finishInitialPlan(fresh(),data),ending:'close',cash:1000,debt:400,familyDebt:200,guarantee:0,equity:50,invested:500,history:[{month:1,revenue:100,profit:-50}],revenue:100,profit:-50};
 assert.equal(endingFinances(state).personalPL,-200);assert.equal(moneyTone(1),'money-positive');assert.equal(moneyTone(-1),'money-negative');assert.equal(moneyTone(0),'money-neutral');
 const html=endingView(state,data);assert.match(html,/money-positive">\+100만 원/);assert.match(html,/money-negative">-50만 원/);assert.match(html,/money-negative">-200만 원/);
 assert.equal(endingFinances({...state,legacyConditions:true}).known,false);
});
