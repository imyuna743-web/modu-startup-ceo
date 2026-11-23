import {validateState,migrateState} from './engine.js';

// The browser keeps one working copy. Manual slots have their own store and lifecycle.
let connection;
function openDrafts(){
 if(!connection)connection=new Promise((resolve,reject)=>{
  const request=indexedDB.open('founder-life-working-copy',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('drafts');
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error);
 }).catch(error=>{connection=null;throw error;});
 return connection;
}
export async function readBrowserSave(data){
 const db=await openDrafts();
 const draft=await new Promise((resolve,reject)=>{
  const request=db.transaction('drafts').objectStore('drafts').get('current');
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error);
 });
 if(!validateState(draft?.state)||!data.industries[draft.state.industry])return null;
 return {...draft,state:migrateState(draft.state,data)};
}
export async function writeBrowserSave(state,slotId,dirty){
 const snapshot=structuredClone({state,slotId,dirty});
 const db=await openDrafts();
 await new Promise((resolve,reject)=>{
  const transaction=db.transaction('drafts','readwrite');
  transaction.oncomplete=resolve;
  transaction.onabort=()=>reject(transaction.error);
  transaction.objectStore('drafts').put(snapshot,'current');
 });
}
