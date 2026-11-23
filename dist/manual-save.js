import {saveActiveSlot,writeSlotStore} from './save-slots.js';
export const saveDate=state=>{const m=Math.max(1,Math.min(60,state.month));return `${Math.floor((m-1)/12)+1}년 차 ${(m-1)%12+1}월`;};
// The working state is never placed into the saved store until this explicit command.
export function commitManualSave(storage,store,state,workingSlotId,now){
 const next=saveActiveSlot({...store,activeId:workingSlotId},state,now);
 writeSlotStore(storage,next);return next;
}
