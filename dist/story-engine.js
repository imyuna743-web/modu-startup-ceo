import {encounterTitle} from './extended-cast.js';
import {chooseEvent,clamp} from './engine.js';
import {choiceAvailability} from './conditions.js';

const fallbackRole={management:'mentor',money:'investor',people:'staff',sales:'customer',mindset:'friend'};
export function availablePeople(state,story){
 const active={...state.seats,customer:state.customers>0||state.seats?.customer,staff:state.team>0};
 return story.cast.filter(p=>p.id!=='ai_agent'&&active[p.id]);
}
export function scenePerson(state,story){
 const id=state.pending?.who||fallbackRole[state.pending?.cat]||'mentor';
 return story.cast.find(p=>p.id===id)||story.cast.find(p=>p.id==='mentor');
}
export function syncPeople(state,story){
 const {ai_agent:oldSeat,...seats}=state.seats||{},{ai_agent:oldRelation,...relations}=state.relations||{};
 state={...state,seats,relations,...(state.pending?.id?.startsWith('meet_')?{pending:{...state.pending,title:encounterTitle(state.pending.id.slice(5))}}:{})};
 const known=new Set((state.metPeople||[]).filter(id=>id!=='ai_agent'));
 availablePeople(state,story).forEach(p=>known.add(p.id));
 if(state.pending){const who=scenePerson(state,story);known.add(who.id);}
 return {...state,metPeople:[...known]};
}
export function opinionScore(story,role,choice){return (choice.tags||[]).reduce((n,t)=>n+(story.seats[role]?.prefs?.[t]||0),0);}
export function adviceFor(state,story){
 const e=state.pending;if(!e)return [];
 const preferred=Number.isInteger(e.selectedChoice)?e.selectedChoice:0,selected=e.choices[preferred];
 const possible=e.choices.map((c,i)=>({c,i})).filter(({c})=>choiceAvailability(state,c).ok);
 if(!possible.length)return [];
 const speakers=availablePeople(state,story);
 const who=scenePerson(state,story);if(!speakers.some(p=>p.id===who.id))speakers.unshift(who);
 return speakers.map(person=>{
   const ranked=possible.map(o=>({...o,score:opinionScore(story,person.id,o.c)})).sort((a,b)=>b.score-a.score||Number(b.i===preferred)-Number(a.i===preferred)||a.i-b.i);
   const recommended=ranked[0],score=opinionScore(story,person.id,selected||{});
   const tags=recommended.c.tags||[];
   const tag=[...tags].sort((a,b)=>(story.seats[person.id]?.prefs[b]||0)-(story.seats[person.id]?.prefs[a]||0)).find(t=>story.adviceLines[person.id]?.[t])||'trust';
   const lines=story.adviceLines[person.id]?.[tag]||['지금 감당할 수 있는 선택인지 한 번 더 살펴봐요.'];
   const line=lines[(Math.max(1,state.month)+person.id.length)%lines.length];
   return {person,index:recommended.i,line,stance:score>0?'찬성':score<0?'반대':'조건부',same:recommended.i===preferred};
 });
}
// A stance has one visible outcome even when its members prefer different alternatives.
export function groupAdvice(state,story){
 const opinions=adviceFor(state,story),initial=state.pending?.selectedChoice;
 return ['찬성','조건부','반대'].map(stance=>{
  const members=opinions.filter(a=>a.stance===stance),votes=new Map();
  for(const {index} of members)votes.set(index,(votes.get(index)||0)+1);
  const ranked=[...votes].sort(([a,av],[b,bv])=>bv-av||Number(b===initial)-Number(a===initial)||a-b);
  return {stance,members,index:stance==='찬성'?initial:ranked[0]?.[0]};
 });
}
export function prepareDecision(state,index,story){
 const e=state.pending,c=e?.choices[index];if(!c||!choiceAvailability(state,c).ok)return state;
 const {rewindPoints,...current}=state;const s={...structuredClone(current),...(rewindPoints?{rewindPoints}: {})};s.pending.selectedChoice=index;s.pending.phase='advice';
 return syncPeople(s,story);
}
export function reconsiderDecision(state){if(!state.pending)return state;return {...state,pending:{...state.pending,phase:'choice'}};}
export function resolveDecision(state,adviserId,data){
 const e=state.pending;if(!e||e.phase!=='advice')return state;
 const groups=groupAdvice(state,data.story);
 const group=groups.find(g=>g.stance===adviserId);
 const legacy=group?null:groups.flatMap(g=>g.members).find(a=>a.person.id===adviserId);
 if(adviserId!=='self'&&!legacy&&!group?.members.length)return state;
 const members=group?.members||(legacy?[legacy]:[]);
 const index=group?.index??legacy?.index??e.selectedChoice,c=e.choices[index];
 if(!c||!choiceAvailability(state,c).ok)return state;
 const wasKnown=state.lessons.includes(e.card),next=chooseEvent(state,index);if(next===state)return state;
 const s=syncPeople(next,data.story),person=legacy?.person;
 s.adviceHistory??=[];
 s.adviceHistory.unshift({eventId:e.id,title:e.title,month:e.calendar?.elapsed??Math.max(1,s.month-1),role:adviserId,roles:members.map(a=>a.person.id),choice:c.label,initialChoice:e.choices[e.selectedChoice]?.label||c.label});
 s.journal[0].adviser=group?group.stance+' · '+members.map(a=>a.person.name).join(', '):person?person.name+' · '+person.role:'내 판단';
 const relationships=members.map(({person:p})=>{
  const before=state.relations?.[p.id]??15;
  const after=clamp(Math.max(before,s.relations[p.id]??15)+2,-100,100);
  s.relations[p.id]=after;return {name:p.name,before,after};
 });
 s.lastScene={stance:group?.stance||null,relationships,relationship:relationships[0]||null,eventId:e.id,title:e.title,text:s.journal[0].text,choice:c.label,card:e.card||null,who:e.who||scenePerson(state,data.story).id,adviser:adviserId,fx:c.fx,newLesson:!!e.card&&!wasKnown,unread:true};
 return s;
}
export function acknowledgeScene(state){return state.lastScene?.unread?{...state,lastScene:{...state.lastScene,unread:false}}:state;}
export function sceneReadings(eventId,story,card,data){
 const raw=data?.events?.find(e=>e.id===eventId);
 let ids=story.letterByEvent[eventId]||story.letterByMega[eventId?.replace('world_','')]||[];
 if(!ids.length&&raw?.plan?.length)ids=raw.plan.flatMap(k=>story.letterByPlan[k]||[]);
 const fallback={경영:'l23',인사:'q75',영업:'q54',마인드셋:'q82',자금:'l179'};
 const lesson=data?.lessons?.find(l=>l.id===card);
 if(!ids.length)ids=[fallback[lesson?.area]||'l23'];
 const result=[...new Set(ids)].filter(id=>story.letterRefs[id]).map(id=>({id,...story.letterRefs[id]}));
 // Original game summaries are used only where present; never invent an article excerpt.
 if(!result.some(x=>x.gist)){const id=fallback[lesson?.area]||'l23';if(!result.some(x=>x.id===id))result.push({id,...story.letterRefs[id]});}
 const summary=result.find(x=>x.gist),selected=result.slice(0,3);
 if(summary&&!selected.some(x=>x.gist))selected[selected.length-1]=summary;
 return selected;
}
export function relationshipLabel(value){return value>=50?'든든한 사이':value>=15?'알아가는 사이':value>=0?'조심스러운 사이':'갈등 중';}
export function relationshipMeter(value){return clamp((Number(value)||0)+100,0,200)/2;}
