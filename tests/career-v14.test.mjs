import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createState,validateState,migrateState,forecast,runMonth} from '../dist/engine.js';
import {SPECIAL_CHARACTERS,mergeCharacterProgress,readCharacterProgress,writeCharacterProgress,characterStatus} from '../dist/founder-options.js';
import {REWARD_QUESTS,normalizeCareer,claimCareerRewards,purchaseCharacter,customAccess,consumeCustomPass,customDay} from '../dist/career-economy.js';
import {evaluateRun,recordRun,rankRuns} from '../dist/run-evaluation.js';
import {roadmapStatus,syncRoadmap,balanceRoadmap} from '../dist/plan-roadmap.js';
import {finishInitialPlan,randomizePlanAnswers} from '../dist/startup-plan.js';
import {revenueSeries,revenueChart} from '../dist/metrics-view.js';
import {historyJournal,historyRecord} from '../dist/history-view.js';
import {captureCheckpoint,restoreCheckpoint} from '../dist/rewind.js';
import {portraitSource,validPortrait} from '../dist/custom-portrait.js';
import {guideStepFor} from '../dist/guided-tour.js';
import {extendGameContent} from '../dist/extended-cast.js';
import {simulateToEnding} from '../dist/automation.js';
const read=n=>JSON.parse(readFileSync(new URL('../dist/'+n,import.meta.url)));
const data=extendGameContent({...read('content.json'),story:read('story-content.json'),worldEvents:read('world-events.json')});
const fresh=(options={})=>createState('saas','검증',{companyName:'테스트랩',industryData:data.industries.saas,rng:()=>.5,...options});
test('old unlocks reset, custom games cannot earn rewards, claimed rewards are never duplicated',()=>{
 const old=normalizeCareer({version:1,earned:SPECIAL_CHARACTERS.map(p=>p.id),progress:{researchWeeks:4,closure:1,growth:1,healthyYears:1}});assert.equal(old.earned.length,0);assert.equal(old.progress.closure,undefined);assert.equal(old.tickets,0);
 const s={...fresh(),history:[{month:12,actions:Array(36).fill('research'),revenue:10000,profit:1}],skills:{product:100},customers:200};
 const noRewards=mergeCharacterProgress({},[{...s,mode:'custom'}]);assert.deepEqual(noRewards.progress,{});
 const meta=mergeCharacterProgress(old,[s,s]);assert.equal(meta.progress.researchWeeks,36);assert.equal(meta.earned.length,0);
 const reward=claimCareerRewards(meta);assert.ok(reward.characters.includes('special-maker'));assert.ok(reward.tickets>0);assert.deepEqual(claimCareerRewards(reward.meta).meta,reward.meta);
 const store={value:null,getItem(){return this.value},setItem(k,v){this.value=v}};writeCharacterProgress(store,reward.meta);assert.deepEqual(readCharacterProgress(store).earned,reward.meta.earned);
 assert.ok(purchaseCharacter({},SPECIAL_CHARACTERS[0]).error);assert.ok(characterStatus({}).every(c=>!c.unlocked));
});
test('daily free custom mode rolls over at Korean midnight and tickets are consumed only after the free run',()=>{
 const before=new Date('2026-11-23T14:59:59Z'),after=new Date('2026-11-23T15:00:00Z');assert.notEqual(customDay(before),customDay(after));
 let meta=normalizeCareer({});const first=consumeCustomPass(meta,before);assert.equal(first.used,'daily');assert.equal(first.meta.tickets,0);assert.equal(customAccess(first.meta,before).allowed,false);assert.ok(consumeCustomPass(first.meta,before).error);
 meta={...first.meta,tickets:2};const second=consumeCustomPass(meta,before);assert.equal(second.used,'ticket');assert.equal(second.meta.tickets,1);assert.equal(meta.tickets,2);assert.equal(consumeCustomPass(second.meta,after).used,'daily');assert.equal(consumeCustomPass(second.meta,after).meta.tickets,1);
});
test('all eight exclusive industries require the right unlocked founder and have playable distinct events',()=>{
 const ids=new Set();for(const p of SPECIAL_CHARACTERS){const ind=data.industries[p.industry];assert.ok(ind);ids.add(p.industry);assert.equal(ind.exclusiveCharacter,p.id);assert.throws(()=>createState(p.industry,'잠김',{industryData:ind,portrait:p.id}));assert.throws(()=>createState('saas','틀림',{portrait:p.id,unlockedCharacters:[p.id],industryData:data.industries.saas}));
  const s=createState(p.industry,p.name,{industryData:ind,portrait:p.id,unlockedCharacters:[p.id],rng:()=>.5});assert.equal(s.industry,p.industry);assert.equal(s.portrait,p.id);assert.ok(validateState(s));assert.equal(data.events.filter(e=>e.ind===p.industry).length,3);
  const result=simulateToEnding(s,data);assert.ok(result.state.ending,p.id);assert.ok(validateState(result.state));}
 assert.equal(ids.size,8);
});
test('company names and custom photographs survive saves while ordinary modes cannot use custom photographs',()=>{
 const photo='data:image/webp;base64,AAAA';assert.ok(validPortrait(photo));assert.equal(validPortrait('https://example.com/picture.jpg'),false);assert.equal(validPortrait('data:image/svg+xml;base64,AAAA'),false);
 const s=fresh({mode:'custom',customPortrait:photo});assert.equal(s.companyName,'테스트랩');assert.equal(portraitSource(s,'fallback'),photo);assert.ok(validateState(s));assert.equal(fresh({customPortrait:photo}).customPortrait,undefined);
 const legacy={...fresh()};delete legacy.companyName;delete legacy.runId;const migrated=migrateState(legacy,data);assert.equal(migrated.companyName,'검증 컴퍼니');assert.equal(migrateState(legacy,data).runId,migrated.runId);
 const point=captureCheckpoint(s,'month','첫 달',1);assert.equal(s.rewindPoints[0].state.customPortrait,undefined);assert.equal(restoreCheckpoint(s,point).customPortrait,photo);
});
test('five-year plan balances early validation with multi-year maintenance and broken streaks restart',()=>{
 const s=finishInitialPlan(fresh(),data);assert.equal(s.initialPlan.roadmap.version,4);assert.equal(s.initialPlan.roadmap.milestones.length,12);for(const year of [1,2,3,4,5])assert.ok(s.initialPlan.roadmap.milestones.some(g=>Math.ceil(g.byMonth/12)===year));
 s.month=37;s.history=Array.from({length:36},(_,i)=>({month:i+1,revenue:1000,profit:i===28?-1:100,customers:100,health:80,skills:{product:80},actions:['research']}));
 let status=roadmapStatus(s);assert.equal(status.find(g=>g.id==='steady-profit').reachedMonth,35);assert.equal(status.find(g=>g.id==='healthy-work').reachedMonth,30);assert.equal(status.find(g=>g.id==='quality').reachedMonth,null);assert.equal(status.find(g=>g.id==='retain').reachedMonth,15);
 const legacy=structuredClone(s);legacy.initialPlan.roadmap.version=3;legacy.initialPlan.roadmap.milestones=legacy.initialPlan.roadmap.milestones.filter(g=>!g.fromMonth);const updated=syncRoadmap(legacy);assert.equal(updated.initialPlan.roadmap.milestones.length,12);assert.equal(syncRoadmap(updated).initialPlan.roadmap.milestones.length,12);
});
test('evaluations are bounded, original-plan based, split by difficulty, and record a completed run once',()=>{
 let s=finishInitialPlan(fresh(),data);s.ending='growth';s.month=61;s.health=80;s.history=Array.from({length:60},(_,i)=>({month:i+1,revenue:5000,profit:1000,customers:200,health:80,skills:{product:90},actions:['research']}));s.customers=200;s.skills.product=90;
 const e=evaluateRun(s);assert.ok(e.score>=0&&e.score<=1000);assert.equal(e.pieces.length,5);let rows=recordRun([],s,'SaaS','2026-11-23T00:00:00Z');assert.equal(rows.length,1);assert.equal(recordRun(rows,s,'SaaS'),rows);assert.equal(recordRun([],{...s,ending:null},'SaaS').length,0);
 const altered={...s,planRevisions:[{plan:s.initialPlan}],initialPlan:{...s.initialPlan,roadmap:{...s.initialPlan.roadmap,milestones:[]}}};assert.equal(evaluateRun(altered).score,e.score);
 rows=[...rows,{...rows[0],id:'b',group:'hard'},{...rows[0],id:'c'}];assert.equal(rankRuns(rows,'normal').length,2);assert.deepEqual(rankRuns(rows,'normal').map(r=>r.rank),[1,1]);
});
test('annual chart sums actual monthly revenue and avoids comparing partial years against complete years',()=>{
 const history=Array.from({length:26},(_,i)=>({month:i+1,revenue:(i+1)*10}));const years=revenueSeries(history,{unit:'year'}).points;assert.equal(years.length,3);assert.equal(years[0].revenue,780);assert.equal(years[1].revenue,2220);assert.equal(years[1].change,1440);assert.equal(years[2].count,2);assert.equal(years[2].change,null);
 const months=revenueSeries(history,{unit:'month',year:'1'}).points;assert.equal(months.length,12);assert.equal(months[0].month,1);assert.match(revenueChart(history,{unit:'year'}),/연별 매출/);
});
test('history lists only real choices chronologically and record navigation skips monthly summaries',()=>{
 const s=fresh();s.journal=[{type:'event',title:'나중 선택',month:3,choice:'선택 B',text:'결과 B'},{type:'month',title:'월간 기록',month:3},{type:'event',title:'먼저 선택',month:1,choice:'선택 A',text:'결과 A'}];const html=historyJournal(s,data);assert.doesNotMatch(html,/월간 기록/);assert.ok(html.indexOf('먼저 선택')<html.indexOf('나중 선택'));assert.equal(historyRecord(s,data,1),null);assert.match(historyRecord(s,data,0).body,/data-index="2"/);
});
test('tutorial chooses actual actionable controls and random-all plan can start immediately',()=>{
 const s=finishInitialPlan(randomizePlanAnswers(fresh(),data,{all:true,rng:()=>.5}),data);assert.ok(s.initialPlan.completed);assert.equal(guideStepFor(s,2).id,'research');s.plan=['research'];assert.equal(guideStepFor(s,2).id,'build');s.plan=['research','build','sales','rest'];assert.equal(guideStepFor(s,2).target,'.plan-summary');assert.equal(guideStepFor(s,3).action,'run');
});

test('late replans use achievable streak windows and forecast includes signature health',()=>{
 const s=finishInitialPlan(fresh(),data),late=balanceRoadmap({...s.initialPlan.roadmap,version:3,createdMonth:59});assert.equal(late.milestones.length,12);for(const g of late.milestones.filter(g=>g.fromMonth))assert.ok(g.target<=g.byMonth-g.fromMonth+1);
 for(const p of SPECIAL_CHARACTERS.filter(p=>p.signatureEffects.health)){let s=finishInitialPlan(createState(p.industry,p.name,{industryData:data.industries[p.industry],portrait:p.id,unlockedCharacters:[p.id],rng:()=>.5}),data);s.month=7;s.seenEvents.push('calendar_1_7');s.plan=[p.signatureAction,'build','research','rest'];const expected=forecast(s,data).health;const result=runMonth(s,data);assert.ok(result.report,p.id);assert.equal(result.state.history.at(-1).health,expected,p.id);}
});
