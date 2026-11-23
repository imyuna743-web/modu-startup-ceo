import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createState,adaptEvent,validateState,migrateState,costs,PORTRAITS} from '../dist/engine.js';
import {choiceAvailability} from '../dist/conditions.js';
import {PLAN_STEPS,setPlanAnswer,togglePlanAnswer,setPlanNote,planAnswerValues,movePlanStep,finishInitialPlan,planAnswerLabel,planOptions,planSelectionHint} from '../dist/startup-plan.js';
import {initialPlanView,planReview} from '../dist/story-views.js';
import {prepareDecision,resolveDecision,reconsiderDecision,adviceFor,sceneReadings,acknowledgeScene} from '../dist/story-engine.js';
import {advanceAutomated,simulateToEnding,pickAutoChoice} from '../dist/automation.js';
import {searchGlossary} from '../dist/glossary.js';
const read=name=>JSON.parse(readFileSync(new URL('../dist/'+name,import.meta.url)));
const data={...read('content.json'),story:read('story-content.json'),worldEvents:read('world-events.json')};
const fresh=(industry='saas',portrait='thirties-woman',r=.5)=>createState(industry,'테스트',{portrait:data.industries[industry].exclusiveCharacter||portrait,unlockedCharacters:[data.industries[industry].exclusiveCharacter],rng:()=>r,industryData:data.industries[industry]});
const pending=(state,id='e_grant')=>({...state,pending:adaptEvent(data.events.find(e=>e.id===id),state)});

test('plan keeps legacy free text readable, permits back navigation and neutral skip',()=>{
 let s=fresh(),initial=structuredClone(s);s.initialPlan.answers.customer={values:['other'],text:'<메모> 작은 가게'};
 assert.equal(planAnswerLabel(s,PLAN_STEPS[0],data),'<메모> 작은 가게');
 assert.equal(initial.initialPlan.answers.customer,undefined);
 s=movePlanStep(s,1);s=movePlanStep(s,-1);assert.equal(s.initialPlan.step,0);
 s=setPlanAnswer(s,'customer','','',data);s=finishInitialPlan(s);
 assert.ok(s.initialPlan.completed);for(const k of ['cash','baseFixed','equity','team','arpuMod','demandMod','investmentLimit'])assert.equal(s[k],initial[k]);
 assert.equal(finishInitialPlan(s),s);assert.ok(validateState(s));
});
test('explicit plan choices apply once and remain attached to their own game',()=>{
 let s=fresh();const fixed=s.baseFixed;
 for(const [key,value]of [['team','cofounder'],['price','high'],['runway','lean'],['limit','strict']])s=setPlanAnswer(s,key,value,'',data);
 s=finishInitialPlan(s);assert.equal(s.equity,70);assert.ok(s.seats.cofounder);assert.equal(s.arpuMod,.25);assert.equal(s.baseFixed,Math.round(fixed*.85));assert.equal(s.investmentLimit,'strict');
 const saved=JSON.parse(JSON.stringify(s));assert.deepEqual(migrateState(saved,data),s);assert.equal(finishInitialPlan(saved).equity,70);
 const hired=finishInitialPlan(setPlanAnswer(fresh(),'team','hire','',data));assert.equal(hired.team,1);assert.ok(hired.seats.staff);assert.ok(costs(hired)>fixed);
});
test('legacy games skip the new onboarding without changing their balance',()=>{
 const s=fresh();delete s.initialPlan;delete s.metPeople;delete s.adviceHistory;delete s.lastScene;
 const migrated=migrateState(s,data);assert.equal(migrated.initialPlan.completed,true);assert.equal(migrated.cash,s.cash);assert.deepEqual(migrated.skills,s.skills);
});
test('plan selections toggle independently and keep legacy notes without a new other field',()=>{
 let s=fresh();const options=Object.keys(planOptions(PLAN_STEPS[0],data,s.industry));
 s.initialPlan.answers.customer={values:['other'],text:''};
 for(const value of [options[0],options[1]])s=togglePlanAnswer(s,'customer',value,data);
 s=setPlanNote(s,'customer','<동네 가게> & 온라인',data);
 s=setPlanNote(s,'customer','<동네 가게> & 온라인 고객',data);
 assert.deepEqual(planAnswerValues(s.initialPlan.answers.customer),['other',options[0],options[1]]);
 assert.ok(validateState(s));s=migrateState(JSON.parse(JSON.stringify(s)),data);
 assert.equal((initialPlanView(s,data).match(/aria-pressed="true"/g)||[]).length,2);
 assert.ok(planReview(s,data).includes('&lt;동네 가게&gt; &amp; 온라인 고객'));
 s=togglePlanAnswer(s,'customer',options[0],data);assert.deepEqual(planAnswerValues(s.initialPlan.answers.customer),['other',options[1]]);
 s=togglePlanAnswer(s,'customer','other',data);assert.equal(s.initialPlan.answers.customer.text,'<동네 가게> & 온라인 고객');
 assert.ok(!planAnswerLabel(s,PLAN_STEPS[0],data).includes('동네 가게'));
 assert.equal(togglePlanAnswer(s,'customer','other',data),s);
 s=setPlanAnswer(s,'customer','','',data);assert.equal(s.initialPlan.answers.customer,undefined);
 assert.equal(togglePlanAnswer(s,'customer','invalid',data),s);
});
test('multiple economic choices combine predictably and apply exactly once',()=>{
 let s=fresh();const fixed=s.baseFixed,capacity=s.capacity;
 for(const [key,values]of Object.entries({price:['low','high'],runway:['lean','aggressive'],team:['solo','cofounder','hire'],limit:['flex','strict']})){
  for(const value of values)s=togglePlanAnswer(s,key,value,data);
 }
 assert.match(planSelectionHint(s,'price'),/1\.025/);assert.match(planSelectionHint(s,'runway'),/고정비 \+5%/);
 s=finishInitialPlan(s);assert.ok(Math.abs(s.arpuMod-.025)<1e-12);assert.ok(Math.abs(s.demandMod-.05)<1e-12);
 assert.equal(s.baseFixed,Math.round(fixed*1.05));assert.equal(s.capacity,capacity+1);assert.equal(s.equity,70);assert.equal(s.team,1);
 assert.ok(s.seats.cofounder&&s.seats.staff);assert.equal(s.investmentLimit,'strict');assert.equal(s.monthlyFixed,costs(s));
 assert.equal(finishInitialPlan(s),s);assert.equal(togglePlanAnswer(s,'price','low',data),s);assert.equal(setPlanNote(s,'price','수정',data),s);assert.ok(validateState(s));
});
test('old single-choice drafts remain readable and become multi-select without losing their choices',()=>{
 let s=fresh();s.initialPlan.answers={price:{value:'high',text:''},customer:{value:'other',text:'기존 고객'}};
 assert.ok(validateState(s));assert.equal(planAnswerLabel(s,PLAN_STEPS[2],data),'높은 가격에');
 s=togglePlanAnswer(s,'price','mid',data);assert.deepEqual(s.initialPlan.answers.price.values,['high','mid']);
 assert.equal(planAnswerLabel(s,PLAN_STEPS[0],data),'기존 고객');
 const malformed=structuredClone(s);malformed.initialPlan.answers.price.values=['high','high'];assert.equal(validateState(malformed),false);
 const legacy=fresh();legacy.initialPlan.answers={price:{value:'high',text:''}};assert.equal(finishInitialPlan(legacy).arpuMod,.25);
});
test('event preview is free and reversible; advice resolves the real allowed choice once',()=>{
 const initial=pending(finishInitialPlan(fresh()));const index=initial.pending.choices.findIndex(c=>choiceAvailability(initial,c).ok);
 const prepared=prepareDecision(initial,index,data.story);assert.equal(prepared.cash,initial.cash);assert.deepEqual(prepared.lessons,initial.lessons);assert.equal(prepared.pending.phase,'advice');
 assert.equal(reconsiderDecision(prepared).pending.phase,'choice');
 for(const advice of adviceFor(prepared,data.story))assert.ok(choiceAvailability(prepared,prepared.pending.choices[advice.index]).ok);
 const who=adviceFor(prepared,data.story)[0],selected=prepared.pending.choices[who.index];
 const result=resolveDecision(prepared,who.person.id,data);assert.equal(result.pending,null);assert.equal(result.cash,initial.cash+(selected.fx.cash||0));assert.equal(result.adviceHistory[0].choice,selected.label);assert.equal(result.adviceHistory[0].role,who.person.id);
 assert.ok(result.lessons.includes(initial.pending.card));assert.ok(result.lastScene.unread);assert.equal(resolveDecision(result,who.person.id,data),result);assert.equal(acknowledgeScene(result).lastScene.unread,false);assert.ok(validateState(result));
});
test('locked gauge choices cannot be previewed or followed through advice',()=>{
 let s=fresh();s.gauges.edu=1;s=pending(s);assert.equal(prepareDecision(s,0,data.story),s);
 const prepared=prepareDecision(s,pickAutoChoice(s),data.story);for(const advice of adviceFor(prepared,data.story))assert.notEqual(advice.index,0);
 const corrupt={...prepared,pending:{...prepared.pending,selectedChoice:0}};assert.equal(resolveDecision(corrupt,'self',data),corrupt);
});
test('in-progress plan and advice stages survive serialization without replaying rewards',()=>{
 let s=fresh();s.initialPlan.answers.customer={values:['other'],text:'지역의 1인 사업자'};s=movePlanStep(s,1);
 s=migrateState(JSON.parse(JSON.stringify(s)),data);assert.equal(s.initialPlan.step,1);assert.equal(s.initialPlan.answers.customer.text,'지역의 1인 사업자');
 s=pending(finishInitialPlan(s));s=prepareDecision(s,pickAutoChoice(s),data.story);s=migrateState(JSON.parse(JSON.stringify(s)),data);
 assert.ok(validateState(s));assert.equal(s.pending.phase,'advice');const r=resolveDecision(s,'self',data);const restored=migrateState(JSON.parse(JSON.stringify(r)),data);assert.deepEqual(restored,r);
 assert.equal(resolveDecision(restored,'self',data),restored);
});
test('all original event speaker tags and lesson reading references are retained',()=>{
 const s=fresh();for(const raw of data.events){const e=adaptEvent(raw,s);assert.equal(e.who,raw.who||'mentor');assert.deepEqual(e.choices.map(c=>c.tags),raw.choices.map(c=>c.tags||[]));if(raw.card)assert.ok(data.lessons.some(l=>l.id===e.card));
 const readings=sceneReadings(raw.id,data.story,raw.card,data);assert.ok(readings.length);assert.ok(readings.some(r=>r.gist));for(const r of readings){assert.ok(r.url.startsWith('https://'));assert.equal(r.title,data.story.letterRefs[r.id].title);assert.equal(r.gist,data.story.letterRefs[r.id].gist);}}
});
test('2x single steps and skip-to-ending run identical deterministic game decisions',()=>{
 const initial=fresh();const fast=simulateToEnding(initial,data);assert.equal(fast.error,undefined);let stepped=structuredClone(initial),count=0;
 while((!stepped.ending||stepped.lastScene?.unread)&&count++<1200){const result=advanceAutomated(stepped,data);assert.equal(result.error,undefined);stepped=result.state;}
 const {autoSummary,...ended}=fast.state;assert.deepEqual(ended,stepped);assert.ok(autoSummary.decisions>0);assert.equal(initial.month,1);assert.equal(initial.ending,null);
});
test('auto mode reaches a genuine ending across all industries, ages and poor starts',()=>{
 const failures=[];let runs=0;
 for(const industry of Object.keys(data.industries))for(const portrait of ['bob','thirties-woman','forties-woman','fifties-woman']){
  const initial=fresh(industry,portrait,.25),result=simulateToEnding(initial,data);runs++;
  if(result.error||!result.state.ending||!validateState(result.state))failures.push({industry,portrait,error:result.error,month:result.state.month,ending:result.state.ending});
  assert.equal(initial.month,1);assert.ok(result.steps<1200);assert.ok(result.state.month<=61);
 }
 const poor=fresh('saas','fifties-man',0);poor.cash=-100;poor.reserve=0;poor.investmentLimit='strict';poor.relations.family=-100;poor.guarantee=30000;
 const ending=simulateToEnding(poor,data);assert.ok(ending.state.ending);assert.equal(ending.error,undefined);
 assert.equal(runs,Object.keys(data.industries).length*4);assert.deepEqual(failures,[]);
});
test('wiki finds Korean names and English abbreviations without case sensitivity',()=>{
 assert.equal(searchGlossary('cac')[0].id,'cac');assert.equal(searchGlossary('CaC')[0].id,'cac');assert.equal(searchGlossary('런웨이')[0].id,'runway');assert.ok(searchGlossary('','고객').every(t=>t.category==='고객'));
});

test('every member of the chosen stance gains affinity exactly once',()=>{
 const base=pending(finishInitialPlan(fresh()));
 const people={...base.seats,family:true,mentor:true,friend:true};
 const selected=prepareDecision({...base,seats:people},pickAutoChoice(base),data.story);
 const opinions=adviceFor(selected,data.story);
 const cohort=opinions.filter(o=>o.stance===opinions.find(a=>opinions.filter(b=>b.stance===a.stance).length>=2)?.stance);
 assert.ok(cohort.length>=2);
 const result=resolveDecision(selected,cohort[0].stance,data);
 assert.deepEqual(result.adviceHistory[0].roles,cohort.map(a=>a.person.id));
 for(const {person} of cohort)assert.ok(result.relations[person.id]>=(selected.relations[person.id]??15)+2);
 assert.equal(resolveDecision(result,cohort[0].stance,data),result);
});
