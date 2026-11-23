import {ADVERSE_EVENTS} from './event-risk.js';
// Original score written for this game. No sampled or transcribed reference melodies.
export const MUSIC_GENRES = [
 {id:'electropop',label:'일렉트로 팝',description:'가벼운 드럼, 반짝이는 신스와 장난스러운 멜로디'},
 {id:'lounge',label:'보사 · 라운지',description:'엇박 기타와 부드러운 건반으로 흐르는 오후'},
 {id:'lofi',label:'로파이',description:'느긋한 비트와 둥근 일렉트릭 피아노'},
 {id:'piano',label:'피아노',description:'박자를 비워 두고 차분히 이어지는 건반'}
];
export const DEFAULT_MUSIC_SETTINGS = Object.freeze({enabled:true,volume:25,genre:'electropop',seasonal:true,eventAdaptive:true});
const SEASONS={spring:'봄',summer:'여름',autumn:'가을',winter:'겨울',neutral:'기본'};
const SCENES={routine:'회사 운영',opportunity:'새로운 기회',relationship:'사람과의 만남',tension:'중요한 결정',rest:'휴식',celebration:'성장의 순간',reflection:'도전의 마무리'};
const SEASON_TITLES={spring:'새로 핀 계획',summer:'한낮의 리듬',autumn:'느긋한 오후',winter:'창가의 불빛',neutral:'작은 작업실'};
const SCENE_TITLES={opportunity:'다음 문을 열면',relationship:'함께 걷는 길',tension:'선택 앞의 쉼표',rest:'잠깐의 산책',celebration:'해낸 우리',reflection:'남겨진 페이지'};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const hash=text=>[...String(text)].reduce((n,c)=>(Math.imul(n,31)+c.codePointAt(0))>>>0,0);
export function normalizeMusicSettings(value={}){
 const v=Number(value.volume);
 return {enabled:typeof value.enabled==='boolean'?value.enabled:true,volume:Number.isFinite(v)?clamp(v,0,100):25,genre:MUSIC_GENRES.some(g=>g.id===value.genre)?value.genre:'electropop',seasonal:typeof value.seasonal==='boolean'?value.seasonal:true,eventAdaptive:typeof value.eventAdaptive==='boolean'?value.eventAdaptive:true};
}
export function musicSeason(month=1){const m=(clamp(Math.floor(Number(month)||1),1,60)-1)%12+1;return m>=3&&m<=4?'spring':m>=5&&m<=8?'summer':m>=9&&m<=10?'autumn':'winter';}
const OPPORTUNITIES=new Set([
 'e_cos_retail','e_cos_reorder','e_inf_pilot','e_inf_exclusive','e_demo_pitch','e_big_client','e_grant','e_influencer','e_friend_join','e_angel','e_seed','e_expand','e_customer_seat','e_series_a','e_ma','e_ma2','e_acquihire','e_merger','e_ipo','e_award'
]);
export function musicScene(state={}){
 if(!state)return {id:'routine',event:''};
 if(state.ending)return {id:['growth','ipo','ma','ma_merge','ma_talent'].includes(state.ending)?'celebration':'reflection',event:`ending-${state.ending}`};
 const event=state.pending||(state.lastScene?.unread?state.lastScene:null);
 if(!event)return {id:'routine',event:''};
 const id=event.id||event.eventId||'',who=event.who||'';
 const scene=mood=>({id:mood,event:id});
 if(event.relationship?.tone==='risk'||ADVERSE_EVENTS.has(id)||/(?:_risk|_bad|_shock|_crisis)$/.test(id)||/^(?:m|world)_(?:pandemic|oilwar|fx|crash|alien)(?:_|$)/.test(id))return scene('tension');
 if(id.endsWith('_selection')&&state.skills){
  const gains=state.pending?{}:event.fx||{};
  if(state.skills.management+state.skills.insight-(gains.management||0)-(gains.insight||0)<90)return scene('tension');
 }
 if(event.calendar?.kind==='risk'||/^calendar_\d+_(?:newyear|chuseok|settlement)$/.test(id))return scene('tension');
 if(who==='pet'||/holiday|pet/.test(id))return scene('rest');
 if(OPPORTUNITIES.has(id)||/(?:_good|_grant|_selection|_demo|_exhibition|_overseas)$/.test(id)||/^(?:m|world)_(?:boom|ai)(?:_|$)/.test(id))return scene('opportunity');
 if(id.startsWith('meet_')||id.startsWith('rel_')||event.cat==='people'||['family','friend','partner','mentor','cofounder','staff','rival'].includes(who))return scene('relationship');
 return scene('routine');
}
export function resolveMusicTrack(state={},settings=DEFAULT_MUSIC_SETTINGS){
 const prefs=normalizeMusicSettings(settings),season=prefs.seasonal?musicSeason(state?.month):'neutral',scene=prefs.eventAdaptive?musicScene(state):{id:'routine',event:''};
 const genre=MUSIC_GENRES.find(g=>g.id===prefs.genre),eventSeed=hash(scene.event),minor=['tension','reflection'].includes(scene.id);
 const bpm=clamp(({electropop:110,lounge:98,lofi:78,piano:74}[prefs.genre])+({spring:0,summer:8,autumn:-4,winter:-8,neutral:0}[season])+({routine:0,opportunity:5,relationship:-2,tension:-6,rest:-12,celebration:10,reflection:-8}[scene.id]),55,132);
 return {key:`${prefs.genre}:${season}:${scene.id}:${scene.event}`,genre:prefs.genre,genreLabel:genre.label,season,seasonLabel:SEASONS[season],scene:scene.id,sceneLabel:SCENES[scene.id],event:scene.event,seed:eventSeed,variant:eventSeed%4,root:({spring:60,summer:62,autumn:58,winter:60,neutral:60}[season]),minor,bpm,title:scene.id==='routine'?SEASON_TITLES[season]:`${SCENE_TITLES[scene.id]} · ${SEASONS[season]}`,bars:32};
}
// Four independent eight-bar themes; numbers are scale degrees, null is a rest.
const THEMES={
 spring:[[7,null,9,8,4,6,7,null],[5,7,9,null,8,7,4,null],[6,null,8,9,11,null,9,8],[7,4,6,null,5,null,4,null],[9,null,11,12,11,9,8,null],[7,9,8,6,4,null,2,null],[3,6,5,null,8,7,6,null],[5,null,4,2,0,null,null,null]],
 summer:[[4,7,null,9,7,null,6,4],[5,null,9,7,6,5,null,3],[8,11,null,9,8,6,4,null],[7,null,6,4,2,4,5,null],[9,12,11,null,9,8,7,null],[5,9,null,8,6,null,4,5],[6,null,8,11,9,8,6,null],[5,4,null,2,0,null,null,null]],
 autumn:[[7,null,null,6,4,null,2,null],[5,null,4,null,2,3,5,null],[6,null,8,null,7,6,4,null],[5,7,6,null,4,null,null,null],[9,null,8,7,6,null,4,null],[5,null,7,9,8,null,5,null],[6,8,7,null,5,null,2,null],[3,null,2,null,0,null,null,null]],
 winter:[[4,null,null,7,6,null,4,null],[2,null,5,null,4,null,null,null],[6,null,8,null,9,null,6,null],[7,null,5,4,2,null,null,null],[8,null,9,11,9,null,7,null],[5,null,4,null,2,4,5,null],[6,null,8,null,7,5,4,null],[2,null,null,1,0,null,null,null]],
 neutral:[[4,null,7,6,4,null,2,null],[5,null,7,9,7,5,4,null],[6,8,null,9,8,6,4,null],[7,null,6,4,2,null,null,null],[9,null,8,7,6,4,2,null],[5,7,null,9,8,null,5,null],[6,null,8,7,5,4,2,null],[3,null,2,1,0,null,null,null]]
};
// Eight eighth-note slots per bar. Each scene has its own opening, answer and cadence.
// Held notes take the space to the next attack, giving the slow pieces room to breathe.
const SCENE_THEMES={
 opportunity:[
  [0,null,2,4,null,7,null,9],[8,null,7,null,4,null,null,null],
  [1,null,3,5,null,8,null,10],[9,null,null,7,5,null,4,null],
  [4,5,7,null,9,null,11,null],[12,null,11,9,null,8,7,null],
  [5,null,3,1,null,4,null,6],[7,null,null,null,0,null,null,null]
 ],
 tension:[
  [2,null,null,2,3,2,null,null],[1,null,0,null,null,null,-1,null],
  [2,null,null,2,3,2,null,1],[0,null,null,null,-2,null,null,null],
  [5,null,5,null,6,5,3,null],[2,null,null,1,2,null,null,null],
  [1,null,-1,null,0,null,1,null],[0,null,null,null,null,null,-1,null]
 ],
 relationship:[
  [null,4,5,null,7,null,6,null],[4,null,2,null,null,3,4,null],
  [null,3,4,null,6,null,5,null],[3,null,1,null,null,null,2,null],
  [null,4,7,null,8,null,9,null],[7,null,4,null,null,5,6,null],
  [5,null,2,null,3,null,1,null],[0,null,null,null,null,null,null,null]
 ],
 rest:[
  [7,null,null,null,null,6,4,null],[2,null,null,null,null,null,null,null],
  [5,null,null,null,null,4,2,null],[0,null,null,null,null,null,null,null],
  [4,null,null,null,6,null,7,null],[8,null,null,null,null,null,6,null],
  [4,null,null,null,2,null,1,null],[0,null,null,null,null,null,null,null]
 ],
 celebration:[
  [0,2,4,null,7,null,7,null],[9,null,7,9,11,null,null,null],
  [3,5,7,null,10,null,10,null],[12,null,10,8,7,null,null,null],
  [7,null,9,11,12,null,11,null],[9,7,5,null,8,null,7,null],
  [6,null,8,null,11,9,8,6],[7,null,null,null,0,null,null,null]
 ],
 reflection:[
  [6,null,null,null,4,null,null,null],[5,null,null,3,null,2,null,null],
  [3,null,null,null,1,null,null,null],[2,null,null,0,null,-1,null,null],
  [4,null,null,null,2,null,3,null],[1,null,null,null,-1,null,null,null],
  [0,null,null,null,-2,null,-1,null],[0,null,null,null,null,null,null,null]
 ]
};
const PROGRESSIONS={routine:[0,5,1,4,3,0,1,4],opportunity:[3,4,2,5,1,4,0,0],relationship:[0,2,3,4,5,1,4,0],tension:[5,3,1,4,5,1,4,4],rest:[0,3,0,4,5,3,1,0],celebration:[0,4,5,3,1,4,0,0],reflection:[5,1,3,4,5,3,1,5]};
const MAJOR=[0,2,4,5,7,9,11],MINOR=[0,2,3,5,7,8,10];
export function degreeNote(degree,root=60,minor=false){const scale=minor?MINOR:MAJOR,index=((degree%7)+7)%7;return root+Math.floor(degree/7)*12+scale[index];}
export function scoreStep(track,absoluteStep){
 const step=((Math.floor(absoluteStep)%256)+256)%256,bar=Math.floor(step/8),pulse=step%8,section=Math.floor(bar/8),theme=SCENE_THEMES[track.scene]||THEMES[track.season]||THEMES.neutral;
 const progression=PROGRESSIONS[track.scene]||PROGRESSIONS.routine,chordDegree=progression[bar%8];
 const note=degree=>degreeNote(degree,track.root,track.minor),events=[];
 const add=(voice,midi,duration,velocity,offset=0,pan=0)=>events.push({voice,midi,duration,velocity,offset,pan});
 const volume=['rest','reflection'].includes(track.scene)?.78:1;
 const thin=section===2&&bar%8<2,bright=section===1||section===3;
 const motif=theme[bar%8];
 let degree=motif[pulse];
 if(degree!==null&&degree!==undefined){
  if(section===1&&pulse===6)degree+=2;
  if(section===2)degree-=2;
  if(section===3&&bar%8===7)degree=pulse<4?[4,2,1,0][pulse]:null;
  if(degree!==null&&(!thin||pulse%2===0)){
   const voice=track.genre==='electropop'?({tension:'keys',reflection:'piano',opportunity:'pluck',relationship:'guitar',rest:'piano'}[track.scene]||'bell'):{lounge:'guitar',lofi:'keys',piano:'piano'}[track.genre];
   const nextAttack=motif.slice(pulse+1).findIndex(n=>n!==null);
   const duration=SCENE_THEMES[track.scene]?Math.max(.28,(nextAttack<0?8-pulse:nextAttack+1)*.46):pulse===6?1.2:.7;
   add(voice,note(degree),duration,volume*(track.genre==='piano'?.28:.2),0,Math.sin(bar)*.18);
   if(bright&&pulse===0&&track.genre==='electropop')add('pluck',note(degree-7),.9,.06,0,-.2);
  }
 }
 const chord=[0,2,4,6].map(n=>note(chordDegree+n));
 if(track.genre==='piano'){
  if([0,2,4,6].includes(pulse))add('piano',chord[(pulse/2+bar)%4]-12,2.4,.13,0,-.25);
  if(pulse===0)add('bass',note(chordDegree-14),3.4,.2,0,-.1);
 }else if(track.scene==='tension'){
  if([0,3,6].includes(pulse))add('bass',note(chordDegree-14+(pulse===6?-1:0)),.52,.24);
  if([1,5].includes(pulse))add('keys',note(chordDegree+2)-12,1.4,.12,0,-.2);
  if(!thin){if([0,6].includes(pulse))add('kick',0,.32,.3);if(pulse===3)add('rim',0,.12,.3);}
 }else if(track.scene==='opportunity'||track.scene==='celebration'){
  if([1,4,7].includes(pulse))chord.slice(0,3).forEach((m,i)=>add('guitar',m-12,.7,.11,i*.02,-.2+i*.2));
  if([0,3,4,6].includes(pulse))add('bass',note(chordDegree-14+(pulse>=4?4:0)),.66,.24);
  if(!thin){if([0,4].includes(pulse))add('kick',0,.32,.32);if([2,6].includes(pulse))add('rim',0,.15,.3);if(pulse%2)add('shaker',0,.12,.15);}
 }else if(track.genre==='lounge'){
  if([0,3,6].includes(pulse))chord.forEach((m,i)=>add('guitar',m-12,1.1,.09, i*.025,-.2+i*.12));
  if([0,4,7].includes(pulse))add('bass',note(chordDegree-14+(pulse===4?4:pulse===7?6:0)),.9,.24);
  if(!thin){if([0,4].includes(pulse))add('kick',0,.3,.34);if([2,5].includes(pulse))add('rim',0,.12,.28);add('shaker',0,.13,pulse%2?.1:.16);}
 }else if(track.genre==='lofi'){
  if([0,3,6].includes(pulse))chord.forEach((m,i)=>add('keys',m-12,2,.085,i*.015,-.25+i*.16));
  if([0,3,4,7].includes(pulse))add('bass',note(chordDegree-14+(pulse===7?4:0)),1,.25);
  if(!thin){if([0,3,4].includes(pulse))add('kick',0,.4,.36);if([2,6].includes(pulse))add('snare',0,.22,.22);add('hat',0,.11,pulse%2?.08:.12);}
 }else{
  if([0,3,6].includes(pulse))chord.forEach((m,i)=>add('keys',m-12,1.35,.08,i*.012,-.25+i*.16));
  if(!thin||pulse===0)add('bass',note(chordDegree-14+(pulse===6?4:0)),.48,pulse%2?.12:.23);
  if(pulse%2===1&&bright)add('pluck',chord[(pulse+bar)%4],.35,.065,0,.3);
  if(!thin){if(pulse%2===0)add('kick',0,.35,.34);if([2,6].includes(pulse))add('snare',0,.18,.2);add('hat',0,.12,pulse%2?.16:.07);}
 }
 return events;
}
