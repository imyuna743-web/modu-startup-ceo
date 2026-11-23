import {SAVE_KEY,validateState,migrateState} from './engine.js';
export const SLOT_KEY='founder-life-slots-v1';
const clone=value=>structuredClone(value);
export const emptySlotStore=()=>({version:1,activeId:null,nextNumber:1,slots:[],deletedSlots:[]});
export function addGameSlot(store,state,now=new Date().toISOString()){
 const number=store.nextNumber,id='slot-'+number;
 return {...store,nextNumber:number+1,activeId:id,slots:[...store.slots,{id,number,updatedAt:now,state:clone(state)}]};
}
export function saveActiveSlot(store,state,now=new Date().toISOString()){
 if(!store.slots.some(slot=>slot.id===store.activeId))return addGameSlot(store,state,now);
 return {...store,slots:store.slots.map(slot=>slot.id===store.activeId?{...slot,updatedAt:now,state:clone(state)}:slot)};
}
export function activateSlot(store,id){return store.slots.some(slot=>slot.id===id)?{...store,activeId:id}:store;}
export function deleteGameSlot(store,id){
 const slot=store.slots.find(slot=>slot.id===id);if(!slot)return store;
 const slots=store.slots.filter(slot=>slot.id!==id);
 return {...store,slots,activeId:store.activeId===id?(slots.at(-1)?.id??null):store.activeId,deletedSlots:[...(store.deletedSlots||[]),slot]};
}
export function restoreGameSlot(store,id){
 const slot=store.deletedSlots?.find(slot=>slot.id===id);if(!slot||store.slots.some(s=>s.id===id))return store;
 return {...store,slots:[...store.slots,slot].sort((a,b)=>a.number-b.number),activeId:store.activeId??id,deletedSlots:store.deletedSlots.filter(s=>s.id!==id)};
}
export function activeGame(store){const slot=store.slots.find(slot=>slot.id===store.activeId);return slot?clone(slot.state):null;}
export function readSlotStore(storage,data){
 let raw;try{raw=JSON.parse(storage.getItem(SLOT_KEY));}catch{}
 if(raw?.version===1&&Array.isArray(raw.slots)){
  const seen=new Set();
  const validSlot=slot=>{
   if(!slot||typeof slot.id!=='string'||seen.has(slot.id)||!Number.isInteger(slot.number)||slot.number<1||!validateState(slot.state)||!data.industries[slot.state.industry])return false;
   seen.add(slot.id);return true;
  };
  const slots=raw.slots.filter(validSlot).map(slot=>({...slot,state:migrateState(slot.state,data)}));
  const deletedSlots=(Array.isArray(raw.deletedSlots)?raw.deletedSlots:[]).filter(validSlot).map(slot=>({...slot,state:migrateState(slot.state,data)}));
  const nextNumber=Math.max(Number.isInteger(raw.nextNumber)?raw.nextNumber:1,Math.max(0,...[...slots,...deletedSlots].map(slot=>slot.number))+1);
  return {version:1,slots,deletedSlots,nextNumber,activeId:slots.some(slot=>slot.id===raw.activeId)?raw.activeId:slots.at(-1)?.id??null};
 }
 // Import the original single save once. Leave the original key intact as a backup.
 let legacy;try{legacy=JSON.parse(storage.getItem(SAVE_KEY));}catch{}
 const empty=emptySlotStore();
 return validateState(legacy)&&data.industries[legacy.industry]?addGameSlot(empty,migrateState(legacy,data)):empty;
}
export function writeSlotStore(storage,store){storage.setItem(SLOT_KEY,JSON.stringify(store));}
