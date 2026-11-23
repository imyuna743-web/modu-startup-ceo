const previous=new Map();
export const countNumber=(key,value,precision=0)=>`<span data-count-key="${key}" data-count-to="${Number(value)}" data-count-precision="${precision}">${Number(value).toLocaleString('ko-KR',{minimumFractionDigits:precision,maximumFractionDigits:precision})}</span>`;
export function animateCounts(root,scope){
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 root.querySelectorAll('[data-count-to]').forEach(node=>{
  const key=`${scope}:${node.dataset.countKey}`,to=Number(node.dataset.countTo),from=previous.get(key)??0,precision=Number(node.dataset.countPrecision)||0,format=value=>value.toLocaleString('ko-KR',{minimumFractionDigits:precision,maximumFractionDigits:precision});previous.set(key,to);
  if(!Number.isFinite(to)||reduced||from===to)return;
  node.textContent=format(from);
  const start=performance.now(),duration=550;
  function draw(now){if(!node.isConnected)return;const progress=Math.min(1,(now-start)/duration),value=from+(to-from)*(1-(1-progress)**3);node.textContent=format(value);if(progress<1)requestAnimationFrame(draw);else node.textContent=format(to);}
  requestAnimationFrame(draw);
 });
 root.querySelectorAll('.bar>i').forEach(bar=>{if(!reduced)bar.animate([{transform:'scaleX(.08)'},{transform:'scaleX(1)'}],{duration:550,easing:'ease-out'});});
}
