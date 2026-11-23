import test from 'node:test';
import assert from 'node:assert/strict';
import {MUSIC_GENRES,DEFAULT_MUSIC_SETTINGS,normalizeMusicSettings,musicSeason,musicScene,resolveMusicTrack,scoreStep} from '../dist/music-score.js';

test('music follows the same four seasonal boundaries as the scenery',()=>{
 assert.deepEqual(Array.from({length:12},(_,i)=>musicSeason(i+1)),['winter','winter','spring','spring','summer','summer','summer','summer','autumn','autumn','winter','winter']);
 assert.equal(musicSeason(15),'spring');assert.equal(musicSeason(60),'winter');
});
test('game events select distinct moods and stable event-specific themes',()=>{
 const cases=[
 [{pending:{id:'calendar_1_grant',who:'public_officer'}},'opportunity'],
 [{pending:{id:'meet_rival',cat:'people',who:'rival'}},'relationship'],
 [{pending:{id:'e_audit',cat:'management'}},'tension'],
 [{pending:{id:'rel_pet_good',who:'pet'}},'rest'],
 [{ending:'growth'},'celebration'],[{ending:'bankrupt'},'reflection']
 ];
 for(const [state,expected]of cases)assert.equal(musicScene(state).id,expected);
 assert.notEqual(resolveMusicTrack(cases[0][0]).key,resolveMusicTrack({pending:{id:'calendar_2_grant'}}).key);
 const state={month:3,pending:{id:'meet_rival',who:'rival'}};
 assert.deepEqual(resolveMusicTrack(state),resolveMusicTrack(structuredClone(state)));
 assert.equal(musicScene({lastScene:{eventId:'e_audit',unread:false}}).id,'routine');
});
test('season and event switches independently hold the selected background music',()=>{
 const fixed={...DEFAULT_MUSIC_SETTINGS,seasonal:false,eventAdaptive:false};
 assert.equal(resolveMusicTrack({month:1},fixed).key,resolveMusicTrack({month:7,pending:{id:'e_audit'}},fixed).key);
 const noEvents={...DEFAULT_MUSIC_SETTINGS,eventAdaptive:false};
 assert.equal(resolveMusicTrack({month:3},noEvents).key,resolveMusicTrack({month:3,pending:{id:'e_audit'}},noEvents).key);
 assert.notEqual(resolveMusicTrack({month:3},noEvents).key,resolveMusicTrack({month:6},noEvents).key);
});
test('genres change arrangement and full scores stay valid across every scene and season',()=>{
 const seasons=[1,3,6,9],states=[{}, {pending:{id:'e_audit',cat:'management'}},{pending:{id:'meet_rival',who:'rival'}},{pending:{id:'calendar_1_grant'}},{pending:{id:'meet_pet',who:'pet'}},{ending:'growth'},{ending:'close'}];
 for(const genre of MUSIC_GENRES)for(const month of seasons)for(const state of states){
  const track=resolveMusicTrack({...state,month},{...DEFAULT_MUSIC_SETTINGS,genre:genre.id});
  let notes=0;
  for(let step=0;step<256;step++)for(const event of scoreStep(track,step)){
   notes++;assert.ok(Number.isFinite(event.midi)&&event.midi>=0&&event.midi<110);assert.ok(event.duration>0&&event.duration<5);assert.ok(event.velocity>0&&event.velocity<1);assert.ok(event.offset>=0&&event.offset<.2);
   if(genre.id==='piano')assert.ok(['piano','bass'].includes(event.voice));
  }
  assert.ok(notes>150);assert.deepEqual(scoreStep(track,0),scoreStep(track,256));
 }
 const steps=genre=>Array.from({length:16},(_,i)=>scoreStep(resolveMusicTrack({month:3},{...DEFAULT_MUSIC_SETTINGS,genre}),i));
 assert.notDeepEqual(steps('electropop'),steps('lounge'));assert.notDeepEqual(steps('lounge'),steps('lofi'));assert.notDeepEqual(steps('lofi'),steps('piano'));
});
test('existing preferences migrate and malformed stored values do not break playback',()=>{
 assert.deepEqual(normalizeMusicSettings({enabled:false,volume:80}),{enabled:false,volume:80,genre:'electropop',seasonal:true,eventAdaptive:true});
 assert.equal(normalizeMusicSettings({genre:'invalid',volume:Infinity}).volume,25);
 assert.equal(normalizeMusicSettings({volume:-12}).volume,0);
 assert.equal(normalizeMusicSettings({volume:400}).volume,100);
});
test('browser player reuses the audio graph, preserves mute, and resumes after a hidden tab',async()=>{
 const oldWindow=globalThis.window,oldDocument=globalThis.document,oldStorage=globalThis.localStorage;
 const listeners={},contexts=[];
 class Param{value=0;setValueAtTime(v){this.value=v;}linearRampToValueAtTime(v){this.value=v;}exponentialRampToValueAtTime(v){this.value=v;}setTargetAtTime(v){this.value=v;}cancelScheduledValues(){}}
 class Node{constructor(){for(const key of ['gain','frequency','Q','pan','threshold','knee','ratio','attack','release','delayTime'])this[key]=new Param();}connect(){}disconnect(){}start(){}stop(){this.onended?.();}}
 class AudioContext{constructor(){this.currentTime=0;this.sampleRate=100;this.state='suspended';this.destination=new Node();this.nodes=[];contexts.push(this);}node(){const n=new Node();this.nodes.push(n);return n;}createGain(){return this.node();}createDynamicsCompressor(){return this.node();}createBiquadFilter(){return this.node();}createStereoPanner(){return this.node();}createOscillator(){return this.node();}createBufferSource(){return this.node();}createConvolver(){return this.node();}createDelay(){return this.node();}createBuffer(channels,length){const buffers=Array.from({length:channels},()=>new Float32Array(length));return {getChannelData:i=>buffers[i]};}async resume(){this.state='running';}async suspend(){this.state='suspended';}async close(){this.state='closed';}}
 globalThis.window={AudioContext};globalThis.document={hidden:false,addEventListener:(name,fn)=>listeners[name]=fn};globalThis.localStorage={getItem:()=>null,setItem:()=>{}};
 const music=await import('../dist/music.js?audio-test');
 try{
  music.updateMusic({enabled:false});assert.equal(await music.unlockMusic(),false);assert.equal(contexts.length,0);
  music.updateMusic({enabled:true});await music.unlockMusic();assert.equal(contexts.length,1);assert.equal(music.musicTrackInfo().playing,true);
  const count=contexts[0].nodes.length;music.setMusicContext(null);music.setMusicContext(null);assert.equal(contexts[0].nodes.length,count,'same state must not restart the score');
  music.updateMusic({enabled:false});assert.equal(music.musicTrackInfo().playing,false);assert.equal(contexts[0].nodes[0].gain.value,0);
  globalThis.document.hidden=true;await listeners.visibilitychange();assert.equal(contexts[0].state,'suspended');
  globalThis.document.hidden=false;listeners.visibilitychange();assert.equal(contexts[0].state,'suspended','muted tab must stay suspended');
  music.updateMusic({enabled:true,volume:40,genre:'lounge'});await music.unlockMusic();assert.equal(contexts.length,1);assert.equal(contexts[0].state,'running');assert.equal(music.musicSettings().genre,'lounge');
 }finally{music.stopMusic();globalThis.window=oldWindow;globalThis.document=oldDocument;globalThis.localStorage=oldStorage;}
});

test('routine, opportunities and setbacks use independent lead melodies and rhythms',()=>{
 const states=[{}, {pending:{id:'world_crash'}}, {pending:{id:'world_boom'}}];
 const openings=states.map(state=>{
  const track=resolveMusicTrack({...state,month:4});
  // Compare the lead pitch shape and its attack positions, independent of tempo or key.
  const lead=Array.from({length:32},(_,i)=>{
   const event=scoreStep(track,i)[0];
   return event&&event.midi>=track.root-2&&event.velocity>=.19?event.midi:null;
  });
  const first=lead.find(Number.isFinite);
  return {rhythm:lead.map(Number.isFinite),contour:lead.filter(Number.isFinite).map(n=>n-first)};
 });
 for(const [i,opening] of openings.entries())for(const other of openings.slice(i+1)){
  assert.notDeepEqual(opening.rhythm,other.rhythm);assert.notDeepEqual(opening.contour,other.contour);
 }
 for(const id of ['relationship_investor_risk','relationship_pet_risk','e_overwork','e_no_wire','world_pandemic'])assert.equal(musicScene({pending:{id}}).id,'tension');
 for(const id of ['relationship_investor_good','e_award','m_boom_hold'])assert.equal(musicScene({pending:{id}}).id,'opportunity');
 assert.equal(musicScene({lastScene:{unread:true,eventId:'calendar_1_selection',fx:{management:5,insight:3}},skills:{management:49,insight:45}}).id,'tension');
});
