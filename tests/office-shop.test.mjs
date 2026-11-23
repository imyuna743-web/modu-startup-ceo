import test from 'node:test';
import assert from 'node:assert/strict';
import {buyFurnishing,setOfficeChoice} from '../dist/office.js';

test('a single purchase unlocks placement and survives serialization',()=>{
 const initial={cash:10,journal:[]};
 assert.equal(setOfficeChoice(initial,'rug','sage'),initial);
 const paid=buyFurnishing(initial,'sage');
 assert.equal(paid.cash,0);
 assert.equal(buyFurnishing(paid,'sage'),paid);
 assert.equal(buyFurnishing(paid,'books'),paid);
 const restored=JSON.parse(JSON.stringify(paid));
 assert.equal(setOfficeChoice(restored,'rug','sage').office.rug,'sage');
 assert.equal(initial.cash,10);
});

test('previously placed furnishings remain owned after removal',()=>{
 const old={cash:100,office:{rug:'oat',decor:'books'},journal:[]};
 const removed=setOfficeChoice(old,'decor','none');
 assert.equal(buyFurnishing(removed,'books'),removed);
 assert.equal(setOfficeChoice(removed,'decor','books').office.decor,'books');
});
