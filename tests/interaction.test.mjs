import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {LOCATIONS} from '../dist/locations.js';
import {createState,runMonth} from '../dist/engine.js';
import {finishInitialPlan} from '../dist/startup-plan.js';
import {emptySlotStore,addGameSlot,deleteGameSlot,restoreGameSlot,saveActiveSlot,activeGame,readSlotStore,writeSlotStore,SLOT_KEY} from '../dist/save-slots.js';
import {seasonForMonth,sceneAsset,propertyScene} from '../dist/scenery.js';
import {adviceFor,prepareDecision,opinionScore} from '../dist/story-engine.js';
import {eventScene} from '../dist/story-views.js';
const read=name=>JSON.parse(readFileSync(new URL('../dist/'+name,import.meta.url)));
const data={...read('content.json'),story:read('story-content.json'),worldEvents:read('world-events.json')};
const fresh=name=>createState('saas',name,{portrait:'bob',rng:()=>.5,industryData:data.industries.saas});
test('deleting a slot preserves other games, survives reload, and can be undone without reusing its ID',()=>{
 const memory=new Map(),storage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value)};
 let store=addGameSlot(emptySlotStore(),fresh('하나'));store=addGameSlot(store,fresh('둘'));
 const first=structuredClone(store.slots[0]);store=deleteGameSlot(store,'slot-2');
 assert.equal(store.activeId,'slot-1');assert.equal(store.slots.length,1);assert.equal(store.deletedSlots.length,1);assert.deepEqual(store.slots[0],first);
 writeSlotStore(storage,store);store=readSlotStore(storage,data);assert.equal(store.deletedSlots[0].state.name,'둘');
 store=saveActiveSlot(store,{...activeGame(store),cash:1234});assert.equal(store.deletedSlots[0].state.name,'둘');
 store=addGameSlot(store,fresh('셋'));assert.equal(store.activeId,'slot-3');
 store=restoreGameSlot(store,'slot-2');assert.equal(store.slots.length,3);assert.equal(store.deletedSlots.length,0);assert.equal(store.activeId,'slot-3');
 assert.equal(store.slots.find(s=>s.id==='slot-2').state.name,'둘');
 for(const slot of [...store.slots])store=deleteGameSlot(store,slot.id);
 writeSlotStore(storage,store);store=readSlotStore(storage,data);assert.equal(activeGame(store),null);assert.equal(store.slots.length,0);assert.equal(store.deletedSlots.length,3);
 store=restoreGameSlot(store,'slot-2');assert.equal(activeGame(store).name,'둘');assert.ok(memory.has(SLOT_KEY));
});
test('all 12 months use the requested season boundaries and repeat in later years',()=>{
 const expected=['winter','winter','spring','spring','summer','summer','summer','summer','autumn','autumn','winter','winter'];
 for(let month=1;month<=60;month++)assert.equal(seasonForMonth(month),expected[(month-1)%12]);
 assert.match(sceneAsset('cowork',3),/cowork-spring/);assert.match(sceneAsset('home',1),/home-winter/);assert.match(sceneAsset('market',9),/market-autumn/);assert.match(sceneAsset('factory',7),/factory-summer/);
 const state=fresh('봄');state.month=3;
 const view=propertyScene(state,data,'office',987);assert.ok(view.body.includes('987'));assert.ok(view.body.includes('250'));assert.ok(view.body.includes('3월 · 봄'));assert.ok(view.body.includes('npc-mentor.png'));
 const visit=propertyScene(state,data,'meeting',987);assert.ok(!visit.body.includes('data-action="move-place"'));
});
test('all 20 properties have four separate seasonal image files without reused bytes',()=>{
 const paths=new Set(),hashes=new Set();
 for(const place of LOCATIONS)for(const month of [3,5,9,1]){
  const path=sceneAsset(place.id,month);assert.ok(!paths.has(path),`Reused path: ${path}`);paths.add(path);
  const bytes=readFileSync(new URL('../dist/'+path,import.meta.url));
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',path);
  assert.ok(bytes.readUInt32BE(16)>=1024&&bytes.readUInt32BE(20)>=576,path);
  const hash=createHash('sha256').update(bytes).digest('hex');assert.ok(!hashes.has(hash),`Reused image: ${path}`);hashes.add(hash);
 }
 assert.equal(paths.size,80);assert.equal(hashes.size,80);
});
test('the first month now opens an eligible event and opinions precede any rewards',()=>{
 let state=finishInitialPlan(fresh('대화'));state.plan=['research','build','study','rest'];
 const next=runMonth(state,data);assert.equal(next.error,undefined);assert.ok(next.state.pending);
 state=next.state;const eligible=state.pending.choices.findIndex(c=>!c.req||!Object.keys(c.req).length);
 const choices=eventScene(state,data).body;assert.ok(choices.includes('choose-event'));assert.ok(!choices.includes('scene-done'));
 const prepared=prepareDecision(state,eligible,data.story);assert.equal(prepared.cash,state.cash);assert.deepEqual(prepared.lessons,state.lessons);
 const advice=adviceFor(prepared,data.story);assert.ok(advice.length>1);
 for(const a of advice){const score=opinionScore(data.story,a.person.id,prepared.pending.choices[eligible]);assert.equal(a.stance,score>0?'찬성':score<0?'반대':'조건부');}
 const view=eventScene(prepared,data,advice[0].person.id);assert.ok(view.body.includes('의견으로 최종 결정'));assert.ok(view.body.includes('관련 아침편지'));assert.ok(view.body.includes('그만의 아침편지'));assert.ok(!view.body.includes('scene-done'));
});
