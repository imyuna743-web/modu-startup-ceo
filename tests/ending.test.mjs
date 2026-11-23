import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createState,runMonth,abandon,migrateState} from '../dist/engine.js';
import {togglePlanAnswer,setPlanNote,finishInitialPlan} from '../dist/startup-plan.js';
import {ENDINGS,endingFinances,buildEndingReport,planGaps,endingReadings} from '../dist/ending-report.js';
import {endingView} from '../dist/ending-view.js';
import {canShareCard,shareResultCard,shareFileName,SHARE_URL} from '../dist/ending-share.js';
const read=name=>JSON.parse(readFileSync(new URL('../dist/'+name,import.meta.url)));
const data={...read('content.json'),story:read('story-content.json'),worldEvents:read('world-events.json')};
const fresh=()=>finishInitialPlan(createState('saas','하린',{portrait:'thirties-woman',rng:()=>.5,industryData:data.industries.saas}));

test('all nine endings have explicit keywords, correct units and original reference links',()=>{
 for(const ending of Object.keys(ENDINGS)){
  const s={...fresh(),ending,month:61},r=buildEndingReport(s,data),html=endingView(s,data);
  assert.ok(r.ending.keyword.length);assert.equal(r.months,60);assert.match(html,/Lv\. 1/);
  assert.ok(html.includes('새로 시작하기'));assert.ok(!html.includes('새로운 이야기 시작하기'));
  assert.equal(r.gaps.length,3);assert.equal(r.comparisons.length,8);
  assert.ok(r.readings.some(ref=>ref.kind==='letter'));
  for(const ref of r.readings){assert.equal(ref.url,data.story.letterRefs[ref.id].url);assert.equal(ref.title,data.story.letterRefs[ref.id].title);}
  for(const file of [r.share.background,r.share.portrait])assert.ok(existsSync(new URL('../dist/'+file,import.meta.url)));
 }
});
test('personal settlement separates company cash from personal proceeds and caps contingent liability',()=>{
 let s={...fresh(),cash:1000,debt:300,familyDebt:100,guarantee:200,equity:70,reserve:200,invested:400,initialInvestment:300,initialFinances:{reserve:300}};
 let f=endingFinances(s);
 assert.equal(f.recovery,490);assert.equal(f.personalBurden,0);assert.equal(f.personalPL,90);assert.equal(f.wealth,690);assert.equal(f.initialWealth,600);
 assert.equal(f.additional,100);assert.equal(f.companyNet,700);
 s={...s,cash:100,debt:500,familyDebt:150,guarantee:100};f=endingFinances(s);
 assert.equal(f.recovery,0);assert.equal(f.personalBurden,250);assert.equal(f.personalPL,-650);assert.equal(f.wealth,-50);
 f=endingFinances({...s,cash:-200,familyDebt:500,guarantee:500});assert.equal(f.coveredDebt,500);assert.equal(f.personalBurden,500);
});
test('legacy savings do not fabricate financial baselines or claim the player skipped a missing plan',()=>{
 const s=fresh();delete s.initialPlan;s.ending='close';
 let migrated=migrateState(s,data),r=buildEndingReport(migrated,data);
 assert.ok(r.comparisons.every(row=>row.original==='원본 기록 없음'));
 assert.ok(r.gaps.every(gap=>gap.kind==='원본 기록 없음'));
 r=buildEndingReport({...migrated,legacyConditions:true},data);
 assert.equal(r.finances.known,false);assert.equal(r.health.initial,null);assert.equal(r.reputation.initial,null);
 assert.ok(endingView({...migrated,legacyConditions:true},data).includes('개인 손익을 계산하지 않았어요'));
});
test('original multi-select plan and other notes stay immutable during report generation',()=>{
 let s=createState('saas','<하린>',{rng:()=>.5,industryData:data.industries.saas});
 s=togglePlanAnswer(s,'price','low',data);s=togglePlanAnswer(s,'price','high',data);s.initialPlan.answers.customer={values:['other'],text:'<카페> & 가게'};s=finishInitialPlan(s);s=abandon(s);
 const before=JSON.stringify(s),r=buildEndingReport(s,data),html=endingView(s,data);
 assert.equal(JSON.stringify(s),before);assert.equal(r.comparisons[2].original,'저렴하게 · 높은 가격에');
 assert.equal(r.comparisons[0].original,'<카페> & 가게');assert.ok(html.includes('&lt;카페&gt; &amp; 가게'));assert.ok(!html.includes('<하린>'));
 assert.equal(r.months,0);assert.equal(r.share.season,'겨울');
});
test('recorded weekly activities and initial relationship values support real comparisons',()=>{
 const initial=fresh(),planned={...initial,plan:['research','build','sales','rest']};
 const result=runMonth(planned,data);assert.ok(!result.error);
 const s=abandon(result.state),r=buildEndingReport(s,data);
 assert.deepEqual(s.history[0].actions,['research','build','sales','rest']);assert.equal(planned.plan.length,4);
 assert.match(r.comparisons.find(row=>row.key==='acquire').actual,/영업 1주 · 고객 만나기 1주/);
 assert.match(r.comparisons.find(row=>row.key==='acquire').note,/1개월 기준/);
 assert.ok(r.relations.some(row=>row.delta===0));assert.equal(r.health.initial,initial.health);
 assert.equal(r.metrics.profit,s.history[0].profit);
});
test('three plan gaps distinguish missing answers, a changed spending limit and health exposure',()=>{
 let s=createState('saas','하린',{rng:()=>.5,industryData:data.industries.saas});
 s=togglePlanAnswer(s,'limit','strict',data);s=finishInitialPlan(s);s.invested+=100;s.health=0;s.ending='burnout';
 const gaps=planGaps(s,data);assert.equal(gaps.length,3);assert.match(gaps[1].title,/투입 한계/);assert.equal(gaps[1].kind,'계획과 차이');assert.match(gaps[2].title,/건강 위험/);
 const refs=endingReadings(s,data.story);assert.ok(refs.some(ref=>ref.id==='l12'));
});
test('ending art follows the outcome while preserving the actual place and final season',()=>{
 for(const [month,season]of [[4,'봄'],[6,'여름'],[10,'가을'],[12,'겨울'],[61,'겨울']]){
  const r=buildEndingReport({...fresh(),ending:'growth',month,businessPlace:'studio'},data);
  assert.equal(r.share.background,'assets/ending-growth.webp');
  assert.equal(r.share.place,'콘텐츠 촬영실');
  assert.equal(r.share.season,season);
 }
});
test('native result sharing sends the prepared image and cancellation is not an error',async()=>{
 const card=buildEndingReport({...fresh(),ending:'growth'},data).share,ready={file:{name:'card.png'}},calls=[];
 const nav={canShare:({files})=>files[0]===ready.file,share:async payload=>calls.push(payload)};
 assert.equal(canShareCard(ready,nav),true);assert.equal(await shareResultCard(ready,card,nav),'shared');
 assert.equal(calls[0].files[0],ready.file);assert.equal(calls[0].url,SHARE_URL);
 assert.equal(await shareResultCard(ready,card,{...nav,share:async()=>{throw Object.assign(new Error(),{name:'AbortError'});}}),'cancelled');
 assert.equal(canShareCard(ready,{}),false);assert.equal(canShareCard(ready,{...nav,canShare(){throw new Error();}}),false);
 assert.ok(!shareFileName({...card,name:'a/../b'}).includes('/'));
});
