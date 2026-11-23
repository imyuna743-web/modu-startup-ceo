import {MUSIC_GENRES,normalizeMusicSettings,resolveMusicTrack,scoreStep} from './music-score.js';
export {MUSIC_GENRES} from './music-score.js';
const KEY='founder-music-v1';
const host=typeof window==='undefined'?null:window,doc=typeof document==='undefined'?null:document;
let saved={};try{saved=JSON.parse(globalThis.localStorage?.getItem(KEY)||'{}')||{};}catch{}
let preferences=normalizeMusicSettings({volume:saved.volume,enabled:saved.enabled}),gameState=null,currentTrack=resolveMusicTrack(null,preferences);
let context,master,compressor,reverb,echo,noise,timer=null,active=null,hasGesture=false;
const voices=new Set(),panners=new WeakMap();
export function musicSettings(){return {...preferences};}
export function musicTrackInfo(){return {...currentTrack,playing:!!context&&context.state==='running'&&preferences.enabled&&!doc?.hidden};}
function connectVoice(node,bus,pan=0){
 if(context.createStereoPanner){const p=context.createStereoPanner();p.pan.value=pan;node.connect(p);p.connect(bus.gain);panners.set(node,p);}else node.connect(bus.gain);
}
function releaseGain(node){node.disconnect();panners.get(node)?.disconnect();panners.delete(node);}
function trackVoice(node,finish,bus,cleanup=()=>{}){voices.add(node);node.onended=()=>{voices.delete(node);node.disconnect();cleanup();};node.start(finish.start);node.stop(finish.end);bus.end=Math.max(bus.end,finish.end);}
function envelope(time,length,volume,attack=.012){const gain=context.createGain();gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(Math.max(.0001,volume),time+attack);gain.gain.exponentialRampToValueAtTime(.0001,time+Math.max(attack+.01,length));return gain;}
function percussion(event,time,bus){
 const length=event.duration*(60/bus.track.bpm),gain=envelope(time,length,event.velocity*.24,.004);
 if(event.voice==='kick'){
  const o=context.createOscillator();o.frequency.setValueAtTime(130,time);o.frequency.exponentialRampToValueAtTime(42,time+.12);o.connect(gain);connectVoice(gain,bus);trackVoice(o,{start:time,end:time+length+.03},bus,()=>releaseGain(gain));return;
 }
 if(event.voice==='rim'){
  const o=context.createOscillator();o.type='triangle';o.frequency.value=820;o.connect(gain);connectVoice(gain,bus,.15);trackVoice(o,{start:time,end:time+length+.02},bus,()=>releaseGain(gain));return;
 }
 const source=context.createBufferSource(),filter=context.createBiquadFilter();source.buffer=noise;
 filter.type=event.voice==='snare'?'bandpass':'highpass';filter.frequency.value=event.voice==='snare'?1900:event.voice==='shaker'?4800:7200;filter.Q.value=.7;source.connect(filter);filter.connect(gain);connectVoice(gain,bus,event.voice==='snare'?-.12:.25);trackVoice(source,{start:time,end:time+length+.02},bus,()=>{filter.disconnect();releaseGain(gain);});
}
function playNote(event,time,bus){
 if(['kick','snare','rim','hat','shaker'].includes(event.voice)){percussion(event,time,bus);return;}
 const beat=60/bus.track.bpm,length=Math.max(.08,event.duration*beat),frequency=440*2**((event.midi-69)/12),volume=event.velocity*.45;
 const specs={bass:[[1,.9,'sine'],[2,.13,'triangle']],piano:[[1,.7,'sine'],[2,.22,'sine'],[3,.08,'sine']],keys:[[1,.7,'sine'],[2,.2,'sine'],[3,.07,'sine']],guitar:[[1,.65,'triangle'],[2,.15,'sine'],[3,.06,'sine']],bell:[[1,.6,'sine'],[2,.12,'sine'],[3.01,.045,'sine']],pluck:[[1,.5,'triangle'],[2,.08,'sine']]};
 const gain=envelope(time,length,volume,event.voice==='bass'?.025:.008);connectVoice(gain,bus,event.pan);
 const partials=specs[event.voice]||specs.keys;let remaining=partials.length;
 for(const [multiple,strength,type]of partials){const o=context.createOscillator(),partial=context.createGain();o.type=type;o.frequency.value=frequency*multiple;partial.gain.value=strength;o.connect(partial);partial.connect(gain);trackVoice(o,{start:time,end:time+length+.04},bus,()=>{partial.disconnect();if(--remaining===0)releaseGain(gain);});}
}
function schedule(){
 if(!active||!context||context.state!=='running'||!preferences.enabled||doc?.hidden)return;
 if(active.next<context.currentTime-.3)active.next=context.currentTime+.03;
 while(active.next<context.currentTime+.2){
  const beat=60/active.track.bpm,swing=active.track.genre==='lofi'?.11:active.track.genre==='lounge'?.035:0;
  for(const event of scoreStep(active.track,active.step))playNote(event,active.next+event.offset*beat+(active.step%2?swing*beat:0),active);
  active.step++;active.next+=beat/2;
 }
}
function switchTrack(){
 if(!context)return;
 const now=context.currentTime;
 if(active){const old=active;old.gain.gain.cancelScheduledValues(now);old.gain.gain.setTargetAtTime(0,now,.22);setTimeout(()=>old.gain.disconnect(),1800);}
 const gain=context.createGain();gain.gain.value=0;gain.connect(master);if(reverb)gain.connect(reverb);if(echo)gain.connect(echo);gain.gain.setTargetAtTime(1,now,.3);
 active={track:currentTrack,gain,step:0,next:now+.045,end:now};schedule();
}
function setupContext(AudioContext){
 context=new AudioContext();master=context.createGain();master.gain.value=preferences.volume/100*.72;
 compressor=context.createDynamicsCompressor();compressor.threshold.value=-18;compressor.knee.value=18;compressor.ratio.value=3;compressor.attack.value=.008;compressor.release.value=.18;master.connect(compressor);compressor.connect(context.destination);
 noise=context.createBuffer(1,context.sampleRate,context.sampleRate);const n=noise.getChannelData(0);let seed=36791;for(let i=0;i<n.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;n[i]=seed/4294967296*2-1;}
 const impulse=context.createBuffer(2,Math.floor(context.sampleRate*1.15),context.sampleRate);for(let c=0;c<2;c++){const channel=impulse.getChannelData(c);for(let i=0;i<channel.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;channel[i]=(seed/4294967296*2-1)*Math.pow(1-i/channel.length,3)*.3;}}
 reverb=context.createConvolver();reverb.buffer=impulse;const wet=context.createGain();wet.gain.value=.11;reverb.connect(wet);wet.connect(master);
 echo=context.createDelay(.8);echo.delayTime.value=.22;const echoLevel=context.createGain();echoLevel.gain.value=.07;echo.connect(echoLevel);echoLevel.connect(master);
 timer=setInterval(schedule,60);switchTrack();
}
export async function unlockMusic(){
 hasGesture=true;if(!preferences.enabled||doc?.hidden)return false;
 try{
  if(!context){const AudioContext=host?.AudioContext||host?.webkitAudioContext;if(!AudioContext)return false;setupContext(AudioContext);}
  if(context.state==='suspended')await context.resume();
  if(!active)switchTrack();if(active.next<context.currentTime)active.next=context.currentTime+.035;schedule();return context.state==='running';
 }catch{return false;}
}
export function setMusicContext(state){
 gameState=state;const next=resolveMusicTrack(state,preferences);
 if(next.key!==currentTrack.key){currentTrack=next;switchTrack();}
 return musicTrackInfo();
}
export function updateMusic(changes){
 preferences=normalizeMusicSettings({...preferences,...changes});try{globalThis.localStorage?.setItem(KEY,JSON.stringify(preferences));}catch{}
 setMusicContext(gameState);
 if(master){master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(preferences.enabled?preferences.volume/100*.72:0,context.currentTime,.08);}
 if(preferences.enabled&&hasGesture)unlockMusic();return musicSettings();
}
export function stopMusic(){
 if(timer!==null){clearInterval(timer);timer=null;}
 for(const voice of voices){try{voice.stop();}catch{}}voices.clear();active=null;
 if(context){context.close().catch(()=>{});context=null;}master=null;reverb=null;echo=null;compressor=null;
}
if(doc){
 doc.addEventListener('visibilitychange',()=>{if(!context)return;if(doc.hidden)context.suspend().catch(()=>{});else if(preferences.enabled&&hasGesture)unlockMusic();});
 // Retain listeners so a browser's rejected first resume can be retried on the next gesture.
 doc.addEventListener('pointerdown',()=>{if(!hasGesture||context?.state==='suspended')unlockMusic();});
 doc.addEventListener('keydown',()=>{if(!hasGesture||context?.state==='suspended')unlockMusic();});
}
// Synthesized original instruments; no audio downloads, external players, or tracking.
