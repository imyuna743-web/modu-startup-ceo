import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createState,adaptEvent,runMonth,requestScheduledEvent} from '../dist/engine.js';
import {PLAN_STEPS,planOptions,randomizePlanAnswers,toggleAllPlanAnswers,finishInitialPlan} from '../dist/startup-plan.js';
import {syncRoadmap,roadmapStatus,goalDate} from '../dist/plan-roadmap.js';
import {extendGameContent,requestEncounter,EXTRA_CAST} from '../dist/extended-cast.js';
import {availablePeople,syncPeople,adviceFor,prepareDecision,resolveDecision,acknowledgeScene} from '../dist/story-engine.js';
import {calendarEvent,calendarChoices,assistantBriefing} from '../dist/calendar.js';
import {eventScene} from '../dist/story-views.js';
import {readingModel,readingView} from '../dist/reading-view.js';
const read=name=>JSON.parse(readFileSync(new URL('../dist/'+name,import.meta.url)));
const data=extendGameContent({...read('content.json'),story:read('story-content.json'),worldEvents:read('world-events.json')});
const fresh=industry=>createState(industry||'cafe','새봄',{industryData:data.industries[industry||'cafe'],rng:()=>.5,portrait:data.industries[industry||'cafe'].exclusiveCharacter,unlockedCharacters:[data.industries[industry||'cafe'].exclusiveCharacter]});

test('select all toggles the current step only for every industry and cannot modify a finished plan',()=>{
 for(const industry of Object.keys(data.industries))for(let i=0;i<PLAN_STEPS.length;i++){
  const initial=fresh(industry);initial.initialPlan.step=i;
  const picked=toggleAllPlanAnswers(initial,data),key=PLAN_STEPS[i].key;
  assert.deepEqual(picked.initialPlan.answers[key].values,Object.keys(planOptions(PLAN_STEPS[i],data,industry)));
  assert.deepEqual(initial.initialPlan.answers,{});
  assert.deepEqual(toggleAllPlanAnswers(picked,data).initialPlan.answers,{});
  const complete=finishInitialPlan(picked,data);assert.equal(toggleAllPlanAnswers(complete,data),complete);
 }
});
test('randomizing really chooses legal answers and permits review before applying financial changes',()=>{
 for(const industry of Object.keys(data.industries)){
  const s=fresh(industry),a=randomizePlanAnswers(s,data,{all:true,rng:()=>0}),b=randomizePlanAnswers(s,data,{all:true,rng:()=>.999999});
  assert.equal(Object.keys(a.initialPlan.answers).length,8);assert.equal(a.initialPlan.applied,false);assert.equal(a.cash,s.cash);assert.equal(a.team,s.team);
  for(const step of PLAN_STEPS){const ids=Object.keys(planOptions(step,data,industry));assert.deepEqual(a.initialPlan.answers[step.key].values,[ids[0]]);assert.deepEqual(b.initialPlan.answers[step.key].values,[ids.at(-1)]);}
  const one=randomizePlanAnswers(s,data,{rng:()=>.5,portrait:data.industries[industry||'cafe'].exclusiveCharacter,unlockedCharacters:[data.industries[industry||'cafe'].exclusiveCharacter]});assert.deepEqual(Object.keys(one.initialPlan.answers),['customer']);
 }
});
test('old roadmap deadlines migrate without losing achieved dates or revised target values',()=>{
 const s=finishInitialPlan(fresh(),data);s.initialPlan.roadmap.version=2;s.initialPlan.roadmap.milestones[0].byMonth=1;s.initialPlan.roadmapProgress={validate:{month:2}};
 const migrated=syncRoadmap(s);assert.equal(migrated.initialPlan.roadmap.version,4);assert.ok(migrated.initialPlan.roadmap.milestones.every(g=>g.byMonth>=6));
 assert.equal(roadmapStatus(migrated)[0].reachedMonth,2);assert.equal(roadmapStatus(migrated)[0].status,'done');assert.equal(goalDate(18),'2년째 6월');
 const revised=structuredClone(s);revised.initialPlan.roadmap.createdMonth=15;revised.initialPlan.roadmap.milestones[0].target=17;
 const later=syncRoadmap(revised);assert.equal(later.initialPlan.roadmap.milestones[0].byMonth,20);assert.equal(later.initialPlan.roadmap.milestones[0].target,17);
});
test('Moa cannot be met, advised by or recorded as a relationship even in legacy saves',()=>{
 let s=finishInitialPlan(fresh(),data);s.seats.ai_agent=true;s.relations.ai_agent=70;s.metPeople=['ai_agent'];
 s.pending=adaptEvent(calendarEvent({...s,month:2}),s);s=syncPeople(s,data.story);s=prepareDecision(s,0,data.story);
 assert.ok(!EXTRA_CAST.some(p=>p.id==='ai_agent'));assert.ok(!availablePeople(s,data.story).some(p=>p.id==='ai_agent'));assert.ok(!adviceFor(s,data.story).some(a=>a.person.id==='ai_agent'));
 assert.ok(!s.metPeople.includes('ai_agent'));assert.ok(!Object.hasOwn(s.relations,'ai_agent'));assert.equal(requestEncounter(s,'ai_agent',data),null);
});
test('calendar choices settle only once and preserve the planned month until run',()=>{
 let s=finishInitialPlan(fresh(),data);s.month=3;s.plan=['research','build','sales','rest'];const initialCash=s.cash;
 assert.match(calendarChoices(s),/지원사업 신청/);assert.doesNotMatch(assistantBriefing(s),/참가 여부 결정|calendar-join/);
 s=requestScheduledEvent(s);s=prepareDecision(s,0,data.story);s=resolveDecision(s,'self',data);s=acknowledgeScene(s);
 assert.equal(s.month,3);assert.equal(s.cash,initialCash-20);assert.ok(s.flags.includes('grant_applied_1'));assert.equal(calendarEvent(s),null);assert.equal(requestScheduledEvent(s),s);
 const settled=runMonth(s,data);assert.equal(settled.state.month,4);assert.ok(settled.report);
});
test('calendar dialogue is spoken, choices expose effects, and encounter titles name events',()=>{
 const s=finishInitialPlan(fresh(),data);s.month=2;s.pending=adaptEvent(calendarEvent(s),s);
 assert.match(s.pending.text,/대표님/);assert.doesNotMatch(s.pending.text,/밀리고 있다|조정해야 한다/);
 const html=eventScene(s,data).body;assert.match(html,/예상 변화/);assert.doesNotMatch(html,/<details class="scene-effects"|처음의 메모/);
 const e=requestEncounter({...s,pending:null},'public_officer',data);assert.equal(e.title,'지원사업 상담 제안');
});
test('every linked resource has an in-site reading view with original links and without invented original text',()=>{
 for(const id of Object.keys(data.story.letterRefs)){
  const model=readingModel(id,data),view=readingView(id,data);assert.equal(model.title,data.story.letterRefs[id].title);assert.ok(model.question);assert.match(view.body,/게임으로 돌아가기/);assert.doesNotMatch(view.body,/<iframe/);assert.match(view.body,/원문 읽기/);assert.ok(view.body.includes(model.url));assert.doesNotMatch(view.body,/내 회사에 적용해 보기/);assert.match(view.body,/원문 전문이 아닌/);
 }
 assert.equal(readingView('unknown',data),null);
});
