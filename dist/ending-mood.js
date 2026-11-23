export const ENDING_MOODS={
 growth:{accent:'#267657',ink:'#224b3b',base:'#f0f8ed',veil:'240,248,237',filter:'saturate(1.25) brightness(1.12)',portraitFilter:'saturate(1.08) brightness(1.05)',effect:'sunlight',caption:'작은 시작이 단단한 성장으로',light:'#fff2b8'},
 survive:{accent:'#467590',ink:'#2d5366',base:'#f0f6f8',veil:'240,246,248',filter:'saturate(.85) brightness(1.06)',portraitFilter:'saturate(.9)',effect:'dawn',caption:'오늘도 문을 연 우리 회사',light:'#e9d8bd'},
 bankrupt:{accent:'#647084',ink:'#3b4658',base:'#e9edf3',veil:'233,237,243',filter:'saturate(.22) brightness(.68) contrast(.95)',portraitFilter:'saturate(.35) brightness(.84)',effect:'rain',caption:'불을 끄고, 다음을 생각하는 밤',light:'#8ea4bd'},
 close:{accent:'#986a4d',ink:'#664933',base:'#f7f0e8',veil:'247,240,232',filter:'sepia(.4) saturate(.65) brightness(.91)',portraitFilter:'sepia(.15) saturate(.72)',effect:'sunset',caption:'마침표를 찍고, 새로운 시작으로',light:'#efb57c'},
 burnout:{accent:'#7b7493',ink:'#514a64',base:'#f1edf5',veil:'241,237,245',filter:'saturate(.25) brightness(.82)',portraitFilter:'saturate(.35) brightness(.9)',effect:'quiet',caption:'잠시 멈춰도 괜찮은 시간',light:'#a5a1bc'},
 ma:{accent:'#735b9d',ink:'#493d68',base:'#f5f0fb',veil:'245,240,251',filter:'saturate(1.1) brightness(1.08)',portraitFilter:'brightness(1.04)',effect:'ribbons',caption:'새로운 이름으로 이어지는 이야기',light:'#d4bbef'},
 ma_talent:{accent:'#a26a3c',ink:'#67482e',base:'#fbf4e9',veil:'251,244,233',filter:'saturate(1.1) brightness(1.1)',portraitFilter:'brightness(1.04)',effect:'sunlight',caption:'우리 팀이 함께 여는 다음 장',light:'#f1d79c'},
 ma_merge:{accent:'#368187',ink:'#2b585d',base:'#edf8f7',veil:'237,248,247',filter:'saturate(1.12) brightness(1.06)',portraitFilter:'brightness(1.03)',effect:'ribbons',caption:'두 갈래의 길이 하나의 미래로',light:'#b1e5de'},
 ipo:{accent:'#926d20',ink:'#59481f',base:'#fcf7e9',veil:'252,247,233',filter:'saturate(1.3) brightness(1.14)',portraitFilter:'saturate(1.15) brightness(1.06)',effect:'confetti',caption:'더 큰 무대를 향한 새로운 출발',light:'#f5d77e'}
};
export const endingMood=ending=>ENDING_MOODS[ending]||ENDING_MOODS.survive;
export const moodStyle=mood=>`--mood-accent:${mood.accent};--mood-ink:${mood.ink};--mood-base:${mood.base};--mood-veil:${mood.veil};--mood-filter:${mood.filter};--mood-portrait:${mood.portraitFilter};--mood-light:${mood.light}`;

// The same palette and atmosphere are used in the web card and PNG export.
export function drawMoodAtmosphere(ctx,mood,width,height){
 ctx.save();
 if(['sunlight','dawn','sunset'].includes(mood.effect)){
  const glow=ctx.createRadialGradient(width*.83,height*.13,4,width*.83,height*.13,width*.55);glow.addColorStop(0,mood.light+'cc');glow.addColorStop(1,mood.light+'00');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
 }else if(mood.effect==='rain'){
  ctx.strokeStyle='rgba(225,237,250,.3)';ctx.lineWidth=2;
  for(let i=0;i<48;i++){const x=width*.5+(i*83%(width*.6)),y=i*127%height;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-13,y+38);ctx.stroke();}
 }else if(mood.effect==='confetti'||mood.effect==='ribbons'){
  const colors=[mood.light,mood.accent,'#ffffff'];
  for(let i=0;i<26;i++){ctx.save();ctx.translate(width*.5+(i*97%(width*.47)),30+i*149%(height*.8));ctx.rotate(i*.9);ctx.globalAlpha=.75;ctx.fillStyle=colors[i%3];ctx.fillRect(0,0,mood.effect==='ribbons'?6:9,18);ctx.restore();}
 }else if(mood.effect==='quiet'){
  const shadow=ctx.createLinearGradient(0,0,0,height);shadow.addColorStop(0,'#615a7a35');shadow.addColorStop(1,'#615a7a00');ctx.fillStyle=shadow;ctx.fillRect(0,0,width,height);
 }
 ctx.restore();
}
