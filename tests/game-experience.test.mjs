import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {commitManualSave,saveDate} from '../dist/manual-save.js';
import {emptySlotStore,SLOT_KEY,readSlotStore,activeGame} from '../dist/save-slots.js';
import {createState,runMonth,changeBusinessPlace,standingFile,PORTRAITS} from '../dist/engine.js';
import {locationBonus,locationBenefit,LOCATIONS} from '../dist/locations.js';
import {newMatch,selectMatch} from '../dist/wiki-match.js';
import {GLOSSARY} from '../dist/glossary.js';
import {TUTORIAL_STEPS} from '../dist/game-guide.js';
import {SPECIAL_CHARACTERS} from '../dist/founder-options.js';
import {buildEndingReport} from '../dist/ending-report.js';
const data=JSON.parse(fs.readFileSync(new URL('../dist/content.json',import.meta.url)));
data.story=JSON.parse(fs.readFileSync(new URL('../dist/story-content.json',import.meta.url)));
data.worldEvents=JSON.parse(fs.readFileSync(new URL('../dist/world-events.json',import.meta.url)));
const memory=()=>{const values={};return {getItem:k=>values[k]??null,setItem:(k,v)=>values[k]=v};};
const fresh=()=>createState('cafe','검증',{industryData:data.industries.cafe,rng:()=>.5});
test('only explicit manual save changes persisted snapshots and new runs get their own slots',()=>{
 const storage=memory();let store=emptySlotStore(),s=fresh();assert.equal(storage.getItem(SLOT_KEY),null);
 store=commitManualSave(storage,store,s,null,'2026-11-22T00:00:00Z');const id=store.activeId;
 s.month=14;s.cash-=100;assert.equal(activeGame(readSlotStore(storage,data)).month,1);assert.equal(store.slots[0].state.month,1);
 store=commitManualSave(storage,store,s,id);assert.equal(activeGame(readSlotStore(storage,data)).month,14);assert.equal(store.slots.length,1);assert.equal(saveDate(s),'2년 차 2월');
 store=commitManualSave(storage,store,fresh(),null);assert.equal(store.slots.length,2);assert.equal(store.slots[0].state.month,14);assert.equal(store.slots[1].state.month,1);
});
test('failed manual save does not mutate stored game or allocate a slot',()=>{
 const store=emptySlotStore();assert.throws(()=>commitManualSave({setItem(){throw Error('quota');}},store,fresh(),null));assert.deepEqual(store,emptySlotStore());
});
test('matching exercise rejects wrong pairs, accepts either order, prevents duplicate score and completes',()=>{
 let g=newMatch('자금',()=>.3);assert.equal(new Set(g.terms.map(t=>t.id)).size,5);assert.deepEqual(new Set(g.definitions.map(t=>t.id)),new Set(g.terms.map(t=>t.id)));
 for(const t of g.terms)assert.equal(t.definition,GLOSSARY.find(x=>x.id===t.id).definition);
 g=selectMatch(g,'term',g.terms[0].id);g=selectMatch(g,'definition',g.terms[1].id);assert.equal(g.wrong,true);assert.equal(g.matched.length,0);
 for(const t of g.terms){g=selectMatch(g,'definition',t.id);g=selectMatch(g,'term',t.id);}assert.equal(g.matched.length,5);assert.equal(g.attempts,6);
 assert.equal(selectMatch(g,'term',g.terms[0].id),g);assert.equal(selectMatch(g,'term','bogus'),g);
});
test('space bonuses apply at month end once, are capped and match the visible labels',()=>{
 let base=fresh();base.cash=100000;base.pending=null;base.initialPlan.completed=true;base.plan=['rest','build','study','rest'];base.skills={product:40,sales:40,management:40,network:40,insight:40};
 const moved=changeBusinessPlace(base,'office');assert.deepEqual(moved.skills,base.skills);
 const home=runMonth(base,data),office=runMonth(moved,data);assert.ok(home.report);assert.ok(office.report);assert.equal(office.state.skills.management-home.state.skills.management,2);assert.deepEqual(office.report.spaceEffects,{management:2});assert.equal(office.state.history[0].spaceEffects.management,2);assert.equal(home.report.expense+250,office.report.expense);
 moved.skills.management=100;assert.equal(runMonth(moved,data).report.spaceEffects.management,0);
 assert.deepEqual(locationBonus('home'),{});assert.equal(locationBenefit('home'),'추가 효과 없음');assert.match(locationBenefit('cowork'),/네트워크 \+2/);
 for(const p of LOCATIONS.filter(x=>x.monthlyCost===null))assert.deepEqual(locationBonus(p.id),{});
});
test('tutorial explains actions, resources, event choices, manual saving and gives practice',()=>{
 const copy=JSON.stringify(TUTORIAL_STEPS);for(const text of ['4주','체력','월말','조언','저장','자동 저장 이어하기'])assert.ok(copy.includes(text));assert.ok(TUTORIAL_STEPS.some(x=>x.practice));assert.ok(TUTORIAL_STEPS.some(x=>x.save));
});
test('every playable character has a separate standing sprite',()=>{
 const ids=[...PORTRAITS,...SPECIAL_CHARACTERS];const hashes=new Set();for(const p of ids){const file=standingFile(p.id);assert.ok(fs.existsSync(new URL('../dist/assets/'+file,import.meta.url)),file);hashes.add(fs.readFileSync(new URL('../dist/assets/'+file,import.meta.url)).toString('base64'));}assert.equal(hashes.size,16);
});
test('every ending selects a different illustration and the selected player standing',()=>{
 const s=fresh(),images=[];for(const ending of ['growth','survive','burnout','bankrupt','close','ma','ma_talent','ma_merge','ipo']){const r=buildEndingReport({...s,ending},data);assert.equal(r.share.background,'assets/ending-'+ending+'.webp');assert.match(r.share.standing,/standing-bob/);images.push(r.share.background);assert.ok(fs.existsSync(new URL('../dist/'+r.share.background,import.meta.url)));}assert.equal(new Set(images).size,9);
});
