import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createState,runMonth,adaptEvent,chooseEvent,requestScheduledEvent,validateState,migrateState} from '../dist/engine.js';
import {finishInitialPlan,setPlanAnswer,togglePlanAnswer,startPlanRevision,cancelPlanRevision,PLAN_STEPS,planOptions} from '../dist/startup-plan.js';
import {roadmapStatus,syncRoadmap} from '../dist/plan-roadmap.js';
import {recentChanges,revenueSeries,revenueChart,changeBadge} from '../dist/metrics-view.js';
import {syncAchievements,questStatus} from '../dist/achievements.js';
import {restoreCheckpoint} from '../dist/rewind.js';
import {prepareDecision,resolveDecision,acknowledgeScene} from '../dist/story-engine.js';
import {EXTRA_CAST,extendGameContent,requestEncounter} from '../dist/extended-cast.js';
import {nextRelationshipEvent} from '../dist/relationship-events.js';
import {calendarEntries,calendarEvent} from '../dist/calendar.js';
import {simulateToEnding} from '../dist/automation.js';
import {historyJournal,historyRecord} from '../dist/history-view.js';
import {GLOSSARY,searchGlossary} from '../dist/glossary.js';
import {ENDING_MOODS} from '../dist/ending-mood.js';
import {AD_RECIPIENT,inquiryPayload,inquiryMailto,adInquiryForm} from '../dist/ad-inquiry.js';
import {animateCounts} from '../dist/count-motion.js';
const read=name=>JSON.parse(readFileSync(new URL('../dist/'+name,import.meta.url)));
const data=extendGameContent({...read('content.json'),story:read('story-content.json'),worldEvents:read('world-events.json')});
const fresh=()=>createState('saas','테스트',{portrait:'twenties-woman',rng:()=>.6,industryData:data.industries.saas});
const ready=()=>finishInitialPlan(fresh(),data);
const plan=s=>({...s,plan:['research','build','sales','rest']});

test('metric changes use actual capped growth and include subsequent event effects',()=>{
 const original=plan(ready());original.skills.product=99;
 const result=runMonth(original,data).state;
 assert.equal(recentChanges(result).skills.product,1);
 result.cash-=75;result.customers+=2;
 assert.equal(recentChanges(result).cash,result.cash-original.cash);
 assert.equal(recentChanges(result).customers,result.customers-original.customers);
 assert.equal(original.skills.product,99);assert.equal(original.history.length,0);
 const old={...result,legacyConditions:true,history:[{month:8,revenue:20}]};
 assert.equal(recentChanges(old).skills.product,null);assert.equal(recentChanges(old).cash,null);
 assert.match(changeBadge(2),/change-up[^]*\+2/);assert.match(changeBadge(-2),/change-down[^]*−2/);
});
test('revenue dots cover empty, single, zero and twelve-month windows without inventing values',()=>{
 assert.doesNotMatch(revenueChart([]),/첫 달/);assert.doesNotMatch(revenueChart([{month:1,revenue:0}]),/<polyline/);
 const history=Array.from({length:14},(_,i)=>({month:i+1,revenue:i*237}));const chart=revenueSeries(history);
 assert.equal(chart.points.length,12);assert.equal(chart.points[0].month,3);assert.equal(chart.points[0].change,237);
 assert.ok(chart.ceiling>=history.at(-1).revenue);assert.ok(chart.points.every(p=>Number.isFinite(p.x)&&p.y>=chart.top&&p.y<=chart.bottom));
 assert.equal(revenueSeries([{month:4,revenue:100}]).points[0].change,null);
});
test('badges are driven by earned revenue, persist after declines and stay within a save',()=>{
 const s=ready();s.cash=1000000;assert.equal(questStatus(s).find(q=>q.id==='revenue-1000').earned,false);
 s.history=[{month:1,revenue:3100,profit:100,customers:26,skills:{product:55}}];s.month=2;
 const awarded=syncAchievements(s);assert.ok(awarded.achievements['revenue-1000']);
 awarded.customers=0;awarded.skills.product=10;assert.ok(syncAchievements(awarded).achievements['customers-10']);
 assert.equal(ready().achievements,undefined);
});
test('new plans offer granular multiple choices and produce dated measurable milestones',()=>{
 for(const industry of Object.keys(data.industries)){
  assert.ok(Object.keys(planOptions(PLAN_STEPS[0],data,industry)).length>=8);
  assert.ok(!Object.hasOwn(planOptions(PLAN_STEPS[0],data,industry),'other'));
 }
 let s=fresh();assert.equal(togglePlanAnswer(s,'customer','other',data),s);
 s=togglePlanAnswer(s,'customer','a',data);s=togglePlanAnswer(s,'customer','b',data);
 s=setPlanAnswer(s,'runway','lean','',data);s=finishInitialPlan(s,data);
 assert.equal(s.initialPlan.answers.customer.values.length,2);
 assert.equal(s.initialPlan.roadmap.milestones.length,12);
 assert.equal(s.initialPlan.roadmap.milestones[1].byMonth,7);
 assert.ok(s.initialPlan.roadmap.milestones.every(g=>g.byMonth>=1&&g.byMonth<=60&&g.target>0));
 const current=structuredClone(s);current.skills.product=0;current.month=5;
 current.history=[{month:3,skills:{product:32},actions:['research','research'],revenue:100,profit:1,customers:5}];
 const progress=syncRoadmap(current);assert.equal(roadmapStatus(progress).find(g=>g.id==='launch').reachedMonth,0); // already product-ready at creation
 assert.equal(roadmapStatus(progress).find(g=>g.id==='validate').status,'done');
});
test('plan revision preserves the first plan and finances while rebuilding future targets',()=>{
 let s=fresh();for(const [k,v]of [['team','cofounder'],['runway','lean'],['price','high']])s=setPlanAnswer(s,k,v,'',data);
 s=finishInitialPlan(s,data);s.month=17;s.customers=30;s.revenue=1000;s.history=[{month:16,revenue:1000,profit:100,actions:['research']}];
 const original=structuredClone(s.initialPlan),financial=Object.fromEntries(['cash','baseFixed','arpuMod','demandMod','equity','team','capacity'].map(k=>[k,s[k]]));
 let editing=startPlanRevision(s);assert.deepEqual(cancelPlanRevision(editing).initialPlan,original);
 editing=setPlanAnswer(editing,'team','hire','',data);editing=setPlanAnswer(editing,'runway','aggressive','',data);
 const revised=finishInitialPlan(editing,data);
 assert.deepEqual(revised.planRevisions[0].plan,original);assert.equal(revised.planBeforeEdit,undefined);
 for(const [k,v]of Object.entries(financial))assert.equal(revised[k],v,k);
 assert.ok(revised.initialPlan.roadmap.milestones.every(g=>g.byMonth>=17&&g.byMonth<=60));
 assert.equal(revised.initialPlan.roadmap.createdMonth,17);assert.ok(validateState(revised));
 assert.equal(startPlanRevision({...s,pending:{title:'진행 중'}}).planBeforeEdit,undefined);
});
test('month and event replay restore actual pre-choice state without future rewards or source mutations',()=>{
 const initial=plan(ready()),serialized=JSON.stringify(initial);let s=runMonth(initial,data).state;
 assert.equal(JSON.stringify(initial),serialized);
 const monthPoint=s.rewindPoints.find(p=>p.type==='month'),back=restoreCheckpoint(s,monthPoint.id);
 assert.equal(back.month,1);assert.deepEqual(back.plan,initial.plan);assert.equal(back.cash,initial.cash);assert.equal(back.history.length,0);
 s.pending=adaptEvent(data.events.find(e=>e.id==='e_grant'),s);s.gauges.edu=50;
 const prepared=prepareDecision(s,0,data.story),chosen=resolveDecision(prepared,'self',data);
 const eventPoint=chosen.rewindPoints.at(-1),restored=restoreCheckpoint(chosen,eventPoint.id);
 assert.equal(restored.pending.id,'e_grant');assert.equal(restored.pending.phase,'choice');assert.equal(restored.pending.selectedChoice,undefined);
 assert.equal(restored.cash,s.cash);assert.deepEqual(restored.lessons,s.lessons);assert.equal(restored.adviceHistory.length,s.adviceHistory.length);
 assert.ok(!eventPoint.state.rewindPoints);assert.ok(!eventPoint.state.history);assert.ok(validateState(migrateState(JSON.parse(JSON.stringify(restored)),data)));
 const different=resolveDecision(prepareDecision(restored,2,data.story),'self',data);assert.notEqual(different.cash,chosen.cash);
 assert.equal(restoreCheckpoint(chosen,'missing'),null);
});
test('calendar asks before costs, records each annual decision once and honors grant application',()=>{
 let s=plan(ready());s.month=2;const before=JSON.stringify(s),r=runMonth(s,data);
 assert.equal(r.calendar,true);assert.equal(r.state.cash,s.cash);assert.equal(r.state.month,2);assert.equal(JSON.stringify(s),before);
 const answered=chooseEvent(r.state,0);assert.equal(requestScheduledEvent(answered),answered);assert.equal(runMonth(answered,data).state.month,3);
 s={...ready(),month:3};s=requestScheduledEvent(s);s=chooseEvent(s,0);assert.ok(s.flags.includes('grant_applied_1'));
 s.month=5;s.skills.management=50;s.skills.insight=50;const selection=requestScheduledEvent(s);assert.match(selection.pending.text,/선정/);
 const cash=selection.cash;assert.equal(chooseEvent(selection,0).cash,cash+600);
 assert.equal(calendarEvent({...ready(),month:5}),null);
 assert.equal(calendarEntries({...ready(),month:54},5).find(e=>e.current).id,'calendar_5_exhibition');
});
test('expanded cast has unique portraits, explicit encounters and valid good/risk consequences',()=>{
 assert.equal(data.story.cast.length,20);assert.equal(EXTRA_CAST.length,12);assert.equal(new Set(EXTRA_CAST.map(p=>p.file)).size,12);
 for(const person of EXTRA_CAST)assert.ok(existsSync(new URL('../dist/assets/'+person.file,import.meta.url)),person.id);
 assert.ok(requestEncounter({...ready(),month:2},'public_officer',data));
 const lessonIds=new Set(data.lessons.map(l=>l.id));let count=0;
 for(const person of data.story.cast)for(const score of [40,0]){
  const s={...ready(),month:5,team:person.id==='staff'?1:0,customers:person.id==='customer'?1:0,seats:{[person.id]:true},relations:{[person.id]:score}};
  const event=nextRelationshipEvent(s);assert.ok(event,person.id);assert.equal(event.who,person.id);assert.ok(lessonIds.has(event.card),event.card);
  const changed=chooseEvent({...s,pending:adaptEvent(event,s)},1);assert.ok(changed.relations[person.id]>score);assert.ok(validateState(changed));
  assert.equal(nextRelationshipEvent({...changed,month:6}),null);count++;
 }
 assert.equal(count,40);assert.equal(nextRelationshipEvent({...ready(),month:8,seats:{},relations:{mentor:-30}}),null);
});
test('expanded auto play handles calendar, introductions and advice through a real ending',()=>{
 const initial=ready(),result=simulateToEnding(initial,data);assert.equal(result.error,undefined);assert.ok(result.state.ending);assert.ok(validateState(result.state));
 assert.ok(result.state.seenEvents.some(id=>id.startsWith('calendar_')));assert.ok(result.state.seenEvents.some(id=>id.startsWith('meet_')));
 assert.ok(result.state.rewindPoints.length>60);assert.equal(initial.history.length,0);
 const html=historyJournal(result.state,data,'1');assert.match(html,/1년 차/);assert.doesNotMatch(html,/id="history-year-5"/);
 const index=result.state.journal.findIndex(r=>r.checkpointId&&r.choice);assert.match(historyRecord(result.state,data,index).body,/이 시점에서 다시 플레이/);
 const legacy={...initial,journal:[{month:1,title:'이전 기록',text:'본문',type:'month'}]};assert.equal(historyRecord(legacy,data,0),null);
});
test('wiki terms and related entries are complete and searchable',()=>{
 assert.ok(GLOSSARY.length>=60);const ids=new Set(GLOSSARY.map(t=>t.id));assert.equal(ids.size,GLOSSARY.length);
 for(const term of GLOSSARY){for(const key of ['definition','detail','example','game'])assert.ok(term[key],`${term.id}.${key}`);for(const id of term.related||[])assert.ok(ids.has(id),`${term.id} -> ${id}`);}
 assert.ok(searchGlossary('ｍｖｐ').some(t=>t.id==='mvp'));assert.ok(searchGlossary('SaaS').some(t=>t.id==='saas'));
 assert.ok(searchGlossary('', '자금').every(t=>t.category==='자금'));
});
test('ending ambience differs for closure, bankruptcy and growth',()=>{
 assert.equal(Object.keys(ENDING_MOODS).length,9);assert.notEqual(ENDING_MOODS.growth.filter,ENDING_MOODS.close.filter);
 assert.equal(ENDING_MOODS.bankrupt.effect,'rain');assert.equal(ENDING_MOODS.ipo.effect,'confetti');
});
test('ad inquiry composes an encoded mail draft with the specified address and no direct send endpoint',()=>{
 const values={organization:'테스트 & 회사',email:'hello@example.com',message:'행사 소개\n문의 내용',collaboration:'상담 후 결정'};
 const payload=inquiryPayload(values),url=new URL(inquiryMailto(payload));
 assert.equal(url.protocol,'mailto:');assert.equal(url.pathname,AD_RECIPIENT);assert.equal(url.searchParams.get('body'),payload.body);
 assert.equal(url.searchParams.get('subject'),'[모두의 창업 광고 문의] 테스트 & 회사');assert.match(payload.body,/희망 홍보 기간  미정/);
 const form=adInquiryForm();assert.match(form,/name="email" type="email"[^>]*required/);assert.match(form,/실제 플레이 화면/);assert.doesNotMatch(form,/<form[^>]+action=/);
});
test('number growth animates from the prior value, lands exactly and respects reduced motion',()=>{
 const oldWindow=globalThis.window,oldRaf=globalThis.requestAnimationFrame;let reduced=false,queue=[];
 globalThis.window={matchMedia:()=>({matches:reduced})};globalThis.requestAnimationFrame=fn=>queue.push(fn);
 try{
  const node={dataset:{countKey:'cash',countTo:'100',countPrecision:'0'},textContent:'100',isConnected:true};
  const root={querySelectorAll:selector=>selector==='[data-count-to]'?[node]:[]};
  animateCounts(root,'motion-test');assert.equal(node.textContent,'0');queue.shift()(performance.now()+700);assert.equal(node.textContent,'100');
  node.dataset.countTo='160';animateCounts(root,'motion-test');assert.equal(node.textContent,'100');queue.shift()(performance.now()+275);assert.ok(Number(node.textContent)>100&&Number(node.textContent)<160);
  queue.shift()(performance.now()+700);assert.equal(node.textContent,'160');
  reduced=true;node.dataset.countTo='180';node.textContent='180';animateCounts(root,'motion-test');assert.equal(queue.length,0);assert.equal(node.textContent,'180');
 }finally{if(oldWindow===undefined)delete globalThis.window;else globalThis.window=oldWindow;if(oldRaf===undefined)delete globalThis.requestAnimationFrame;else globalThis.requestAnimationFrame=oldRaf;}
});
