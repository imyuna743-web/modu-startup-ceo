const taskIds=['research','build','sales','rest'];
export function guideStepFor(state,stage=0){
 if(!state||state.ending)return {target:'.ending-hero',title:'이번 도전의 결과예요',text:'계획 복기와 경영 평가에서 다음 도전의 목표를 찾아보세요.',last:true};
 if(state.pending||state.lastScene?.unread)return {target:'[data-action="event"]',title:'결정할 이야기가 있어요',text:'강조된 버튼을 눌러 이야기를 열고, 선택지와 조언을 확인해 보세요.',action:'event',last:true};
 if(stage===0)return {target:'.month-calendar',title:'지금은 이 달을 보내고 있어요',text:'달력을 누르면 한 해의 주요 일정을 볼 수 있어요. 매달 4주를 직접 채워 회사를 운영해요.'};
 if(stage===1)return {target:'.numbers',title:'회사의 현재 상태예요',text:'현금·매출·고객을 함께 살펴보세요. 이제 실제 일정을 하나씩 채워볼까요?'};
 if(state.plan.length<4){const id=taskIds.find(id=>!state.plan.includes(id))||'rest',names={research:'고객 만나기',build:'제품 만들기',sales:'영업 나가기',rest:'충분히 쉬기'},copy={research:'고객의 불편을 듣고 시장 이해를 높여요.',build:'고객에게 줄 제품을 만들고 제품력을 높여요.',sales:'제품이 필요한 고객을 찾아 영업력을 높여요.',rest:'체력을 회복해 다음 달에도 일할 힘을 남겨요.'};return {target:`[data-action="plan"][data-id="${id}"]`,title:`${state.plan.length+1}주를 채워볼까요?`,text:`${copy[id]} 화살표가 가리키는 ‘${names[id]}’를 눌러 주세요.`,action:'plan',id};}
 if(stage<3)return {target:'.plan-summary',title:'시작하기 전에 확인해요',text:'4주 일정의 활동비, 월 고정비, 남은 체력이에요. 마음이 바뀌면 각 일정의 ×로 지울 수 있어요.'};
 return {target:'[data-action="run"]',title:'첫 달을 직접 시작해요',text:'강조된 버튼을 누르면 일정이 실행되고 월말 정산이 나와요. 진행 기록은 저장 버튼으로 남겨 주세요.',action:'run',last:true};
}
export function createGuidedTour({getState,onFinish}){
 let active=false,stage=0,layer=null,target=null,raf=0,previous=null;
 const remove=()=>{layer?.remove();layer=null;target?.classList.remove('guided-target');target=null;};
 function stop(done=false){active=false;remove();cancelAnimationFrame(raf);if(done)onFinish?.();previous?.isConnected&&previous.focus?.({preventScroll:true});}
 function position(){
  if(!active||!layer||!target?.isConnected)return;
  const r=target.getBoundingClientRect(),pad=7,w=innerWidth,h=innerHeight,left=Math.max(6,r.left-pad),top=Math.max(6,r.top-pad),right=Math.min(w-6,r.right+pad),bottom=Math.min(h-6,r.bottom+pad);
  const boxes=[[0,0,w,top],[0,top,left,bottom-top],[right,top,w-right,bottom-top],[0,bottom,w,h-bottom]];
  layer.querySelectorAll('.guide-shade').forEach((el,i)=>{const [x,y,ww,hh]=boxes[i];Object.assign(el.style,{left:x+'px',top:y+'px',width:Math.max(0,ww)+'px',height:Math.max(0,hh)+'px'});});
  Object.assign(layer.querySelector('.guide-ring').style,{left:left+'px',top:top+'px',width:(right-left)+'px',height:(bottom-top)+'px'});
  const tip=layer.querySelector('.guide-bubble'),tw=Math.min(340,w-24),th=tip.offsetHeight||210;
  const below=h-bottom>=th+24,above=top>=th+24;
  let y=below?bottom+16:above?top-th-16:Math.max(12,h-th-12),x=Math.max(12,Math.min(w-tw-12,(left+right-tw)/2));
  if(!below&&!above&&right+tw+24<w){x=right+16;y=Math.max(12,Math.min(h-th-12,top));}
  Object.assign(tip.style,{width:tw+'px',left:x+'px',top:y+'px'});tip.dataset.arrow=below?'up':above?'down':'side';
  tip.style.setProperty('--arrow-x',Math.max(28,Math.min(tw-28,(left+right)/2-x))+'px');
 }
 function refresh(scroll=false){
  if(!active)return;remove();const step=guideStepFor(getState(),stage);target=document.querySelector(step.target);
  if(!target){stop(false);return;}target.classList.add('guided-target');
  layer=document.createElement('div');layer.className='guided-tour';layer.innerHTML=`${'<div class="guide-shade"></div>'.repeat(4)}<div class="guide-ring"></div><section class="guide-bubble" role="dialog" aria-modal="false" aria-label="모아의 플레이 안내"><div class="guide-speaker"><img src="assets/npc-ai_agent.png" alt=""><span>안내 비서 모아</span><button data-tour="close" aria-label="튜토리얼 나중에 하기">×</button></div><h2>${step.title}</h2><p>${step.text}</p><div class="guide-footer"><span>${stage<2?`${stage+1} / 5`:'직접 플레이'}</span>${step.action?'<span class="guide-click-hint">강조된 버튼을 눌러 주세요</span>':`<button class="primary" data-tour="next">${step.last?'마치기':'다음'}</button>`}</div></section>`;
  document.body.append(layer);
  layer.addEventListener('click',e=>{const b=e.target.closest('[data-tour]');if(!b)return;if(b.dataset.tour==='close')stop(false);else if(step.last)stop(true);else{stage=stage<2?stage+1:3;refresh(true);}});
  if(scroll)target.scrollIntoView({block:'center',behavior:'instant'});
  position();cancelAnimationFrame(raf);raf=requestAnimationFrame(position);
  const focus=step.action?target:layer.querySelector('[data-tour="next"]');focus?.focus?.({preventScroll:true});
 }
 document.addEventListener('click',e=>{if(!active)return;const step=guideStepFor(getState(),stage),b=e.target.closest('[data-action]');if(!b||b.dataset.action!==step.action||step.id&&b.dataset.id!==step.id||b.disabled)return;
  const before=getState();setTimeout(()=>{if(!active)return;const after=getState();if(step.action==='plan'&&after.plan.length===before.plan.length)return;if(step.action==='run'&&after.month===before.month&&!after.pending)return;if(step.last)stop(true);else{stage=2;refresh(true);}});
 },true);
 document.addEventListener('keydown',e=>{if(!active)return;if(e.key==='Escape'){e.preventDefault();stop(false);}if(e.key==='Tab'){const options=[target,...(layer?.querySelectorAll('button')||[])].filter(el=>el?.matches('button:not(:disabled),a,input,select'));if(!options.length)return;const i=options.indexOf(document.activeElement),next=(i+(e.shiftKey?-1:1)+options.length)%options.length;e.preventDefault();options[next].focus({preventScroll:true});}});
 window.addEventListener('resize',position);window.addEventListener('scroll',position,true);
 return {start(){previous=document.activeElement;active=true;stage=0;refresh(true);},stop,refresh:()=>{if(active)queueMicrotask(()=>refresh(false));},get active(){return active;}};
}
