import {statIcon} from './stat-view.js';
import {endingMood,drawMoodAtmosphere} from './ending-mood.js';

export const SHARE_URL='https://business-second-run-live-editor.ighdd678.chatgpt.site/';
const W=1200,H=1500;
let cachedKey='',cachedPromise;
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('카드 그림을 불러오지 못했어요.'));img.src=src;});}
function rounded(ctx,x,y,w,h,r,fill){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}}
function cover(ctx,img,x,y,w,h){const scale=Math.max(w/img.width,h/img.height),sw=w/scale,sh=h/scale;ctx.drawImage(img,(img.width-sw)/2,(img.height-sh)/2,sw,sh,x,y,w,h);}
function fitText(ctx,text,x,y,width,size,color='#1e2c49',weight=500){
 ctx.fillStyle=color;ctx.font=`${weight} ${size}px system-ui, sans-serif`;
 while(ctx.measureText(text).width>width&&size>20){size--;ctx.font=`${weight} ${size}px system-ui, sans-serif`;}
 ctx.fillText(text,x,y);
}
function drawIcon(ctx,key,x,y,color='#2860ed'){
 const path=statIcon(key).match(/<path d="([^"]+)"/)[1];
 ctx.save();ctx.translate(x,y);ctx.scale(1.5,1.5);ctx.lineWidth=1.6;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=color;ctx.stroke(new Path2D(path));ctx.restore();
}
export function shareFileName(card){return `모두의창업-${card.name.replace(/[^\p{L}\p{N}_-]/gu,'').slice(0,12)||'대표'}-${card.keyword}.png`;}
export async function renderResultCard(card){
 const mood=endingMood(card.ending);
 const [background,portrait,logo]=await Promise.all([loadImage(card.background),loadImage(card.standing||card.portrait),loadImage('assets/mv-logo-blue.png')]);
 await document.fonts.ready;
 const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('이 브라우저에서 이미지를 만들 수 없어요.');
 ctx.fillStyle=mood.base;ctx.fillRect(0,0,W,H);ctx.save();ctx.filter=mood.filter;cover(ctx,background,0,0,W,820);ctx.restore();
 drawMoodAtmosphere(ctx,mood,W,820);
 const veil=ctx.createLinearGradient(0,0,W,650);veil.addColorStop(0,`rgba(${mood.veil},.98)`);veil.addColorStop(.57,`rgba(${mood.veil},.82)`);veil.addColorStop(1,`rgba(${mood.veil},.08)`);ctx.fillStyle=veil;ctx.fillRect(0,0,W,820);
 ctx.drawImage(logo,72,62,64,64);fitText(ctx,'모두의 창업',155,107,850,38,'#2860ed',600);
 fitText(ctx,'나의 창업 엔딩',80,227,760,30,'#567092');
 fitText(ctx,card.keyword,72,360,1020,112,mood.ink,650);
 fitText(ctx,`${card.months}개월의 기록`,80,432,700,36,'#435776');
 rounded(ctx,80,575,540,130,22,'rgba(255,255,255,.92)');
 fitText(ctx,`${card.name} 대표`,106,627,480,40,'#1e2c49',600);fitText(ctx,card.industry,108,673,480,28,'#526780');
 ctx.save();ctx.filter=mood.portraitFilter;const scale=Math.min(390/portrait.width,640/portrait.height);const pw=portrait.width*scale,ph=portrait.height*scale;ctx.drawImage(portrait,935-pw/2,790-ph,pw,ph);ctx.restore();
 fitText(ctx,`${card.place} · ${card.season}`,80,778,1020,28,'#1e2c49');
 const stats=[['runway','보낸 시간',`${card.months}개월`],['career','대표 레벨',`Lv. ${card.level}`],['team','고객',`${Math.round(card.customers).toLocaleString('ko-KR')}명`],['cash','회사 현금',`${Math.round(card.cash).toLocaleString('ko-KR')}만 원`]];
 stats.forEach(([icon,label,value],i)=>{const x=72+(i%2)*546,y=870+Math.floor(i/2)*204;rounded(ctx,x,y,510,176,22,'#fff');drawIcon(ctx,icon,x+28,y+29,mood.accent);fitText(ctx,label,x+80,y+58,400,27,'#58708e');fitText(ctx,value,x+30,y+126,450,43);});
 fitText(ctx,'모두의 창업: CEO로 살아남기',72,1380,1056,32,'#2860ed',600);
 fitText(ctx,mood.caption,72,1431,1056,26,mood.accent);
 const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('이미지 저장에 실패했어요.')),'image/png'));
 return {blob,file:new File([blob],shareFileName(card),{type:'image/png'}),url:URL.createObjectURL(blob)};
}
export function prepareResultCard(card){
 const key=JSON.stringify(card);
 if(key!==cachedKey){const previous=cachedPromise;cachedKey=key;cachedPromise=renderResultCard(card).catch(error=>{if(cachedKey===key){cachedKey='';cachedPromise=null;}throw error;});previous?.then(value=>URL.revokeObjectURL(value.url)).catch(()=>{});}
 return cachedPromise;
}
export function downloadResultCard(ready){
 const a=document.createElement('a');a.href=ready.url;a.download=ready.file.name;document.body.append(a);a.click();a.remove();
}
export function canShareCard(ready,nav=navigator){try{return !!(nav.share&&nav.canShare?.({files:[ready.file]}));}catch{return false;}}
export async function shareResultCard(ready,card,nav=navigator){
 if(!canShareCard(ready,nav)){downloadResultCard(ready);return 'download';}
 try{await nav.share({files:[ready.file],title:`모두의 창업 · ${card.keyword}`,text:`${card.name} 대표의 ${card.months}개월, 엔딩은 ${card.keyword}!`,url:SHARE_URL});return 'shared';}
 catch(error){if(error.name==='AbortError')return 'cancelled';throw error;}
}
