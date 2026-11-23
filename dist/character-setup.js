import {customAccess} from './career-economy.js';
import {readPortraitFile} from './custom-portrait.js';
import {randomFounderName,randomCompanyName,companyNameFor} from './founder-names.js';
import {brandMark,statSymbol,gaugeBand} from './stat-view.js';
import {PORTRAITS,SKILLS,clamp} from './engine.js';
import {GAUGES,rollTraits,gaugeDescription} from './background.js';
import {DIFFICULTIES,SPECIAL_CHARACTERS,rollDifficultyStats,founderProfile,characterStatus} from './founder-options.js';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fields={health:'체력',...SKILLS};
const colors={health:'teal',product:'purple',sales:'orange',insight:'teal',management:'blue',network:'pink'};
let dispose=()=>{},refreshSetup=()=>{};
export function refreshCharacterSetup(){refreshSetup();}
export function mountCharacterSetup({root,data,saved,characterMeta={earned:[],progress:{}},getCharacterMeta,onUnlock,onRewards,onStart,onContinue,onSavedGames,onNewGame,onIntro}){
  dispose();
  const controller=new AbortController(),signal=controller.signal;
  dispose=()=>controller.abort();
  const priorPortrait=saved?.portrait==='tied'?'bob':saved?.portrait==='glasses'?'short':saved?.portrait;
  const characters=[...PORTRAITS,...SPECIAL_CHARACTERS];let unlocked=characterMeta.earned||[];
  const draft={founderType:'aspiring',name:saved?.name||'',companyName:saved?.companyName||'',industry:saved?.industry||'saas',portrait:characters.some(p=>p.id===priorPortrait&&(!p.requirement||unlocked.includes(p.id)))?priorPortrait:'bob',customPortrait:saved?.mode==='custom'?saved.customPortrait||'':'',mode:'basic',difficulty:'normal',rolled:rollDifficultyStats('normal'),custom:null,traits:rollTraits(),overrides:{}};
  const portrait=()=>characters.find(p=>p.id===draft.portrait);
  if(portrait()?.industry)draft.industry=portrait().industry;else if(data.industries[draft.industry]?.exclusiveCharacter)draft.industry='saas';
  const allowedIndustries=()=>Object.entries(data.industries).filter(([id,i])=>portrait().industry?id===portrait().industry:!i.exclusiveCharacter);
  const difficulty=()=>DIFFICULTIES[draft.difficulty];
  const randomStats=()=>draft.rolled;
  draft.custom=structuredClone(randomStats().gauges);
  const activeGauges=()=>draft.mode==='custom'?draft.custom:randomStats().gauges;
  const activeStats=()=>founderProfile({portrait:draft.portrait,gauges:activeGauges(),traits:draft.traits,founderType:draft.founderType,health:randomStats().health,industry:data.industries[draft.industry],overrides:draft.mode==='custom'?draft.overrides:{}});
  const valueOf=(stats,key)=>key==='health'?stats.health:stats.skills[key];
  const portraitLabel=p=>`${p.age} ${p.gender} · ${p.label}`;
  const bonusText=p=>Object.entries(p.bonuses||{}).map(([key,value])=>`${fields[key]} ${value>0?'+':''}${value}`).join(' · ');
  function specialInfo(){const p=portrait();return p.requirement?`<div class="special-selected"><span>특수 캐릭터 · ${escape(p.name)}</span><h3>${escape(p.label)}</h3><p>${escape(p.story)}</p><small>${escape(bonusText(p))}</small></div>`:'';}
  function specialGallery(){return `<section class="special-gallery"><div class="special-gallery-head"><div><h2>특수 캐릭터</h2><span>${unlocked.length} / 8 해금</span></div><button type="button" class="coin-balance quiet" data-setup="rewards">보상</button></div>${characterMeta.resetNotice?'<p class="unlock-reset-note">새 해금 기준 적용 · 이전 캐릭터도 새 배지로 다시 열어 주세요.</p>':''}<div class="special-grid">${characterStatus(characterMeta).map(p=>`<article class="special-character ${p.unlocked?'unlocked':'locked'} ${draft.portrait===p.id?'selected':''}"><div class="special-portrait"><img src="assets/${p.file}" alt="${escape(p.name)}" loading="lazy"></div><div class="special-copy"><span class="special-status">${p.age} · ${p.unlocked?'해금 완료':'잠김'}</span><h3>${escape(p.name)}</h3><b>${escape(p.label)}</b><span class="exclusive-industry">전용 · ${escape(p.industryLabel)}</span><details><summary>조건 · 특성</summary><p>${escape(p.story)}</p><small>${escape(p.signature)}</small><small>${escape(bonusText(p))}</small><div class="special-requirement">${escape(p.requirement)}<small>${p.value.toLocaleString()} / ${p.target.toLocaleString()}${p.unit}</small></div></details><button type="button" class="quiet" data-setup="${p.unlocked?'portrait':'unlock'}" data-portrait="${p.id}" ${!p.unlocked&&!p.qualified?'disabled':''} aria-pressed="${draft.portrait===p.id}">${draft.portrait===p.id?'선택 중':p.unlocked?'선택하기':'배지로 해금'}</button>${!p.unlocked?`<small class="unlock-condition">${p.qualified?'조건 달성':escape(p.requirement)}</small>`:''}</div></article>`).join('')}</div></section>`;}
  function statsHTML(){
    const g=activeGauges(),d=difficulty(),custom=draft.mode==='custom';
    return `<div class="setup-stat-heading"><h2>능력치</h2><button class="quiet reroll-button" type="button" data-setup="reroll">↻ 다시 뽑기</button></div><div class="starting-stats">${Object.entries(GAUGES).map(([key,label])=>{const val=g[key];return `<div class="starting-stat" data-band="${gaugeBand(val)}"><div class="starting-stat-line">${statSymbol(key,label)}${custom?`<input type="number" id="gauge-${key}" data-gauge="${key}" aria-label="${label} 시작 조건" min="1" max="100" step="1" value="${val}">`:`<strong id="gauge-${key}">${val}<small> / 100</small></strong>`}</div>${custom?`<input class="stat-slider" data-gauge="${key}" type="range" min="1" max="100" step="1" value="${val}" aria-label="${label} 조건 조절" style="--progress:${val}%">`:`<div class="bar" role="meter" aria-label="${label} 시작 조건" aria-valuemin="1" aria-valuemax="100" aria-valuenow="${val}"><i style="width:${val}%"></i></div>`}<p class="gauge-caption" data-caption="${key}">${gaugeDescription(key,val)}</p></div>`;}).join('')}</div><div id="condition-preview">${conditionPreview()}</div><div id="custom-stat-controls">${customStatsHTML()}</div>`;
  }
  function conditionPreview(){
    const d=difficulty();
    return `<fieldset class="difficulty-control"><legend>난이도 설정</legend><div class="difficulty-options">${Object.entries(DIFFICULTIES).map(([id,item])=>`<label class="${draft.difficulty===id?'selected':''}"><input type="radio" name="difficulty" value="${id}" ${draft.difficulty===id?'checked':''}><span>${item.label}</span></label>`).join('')}</div><p>${d.description}</p><small>나이와 무관하게 적용 · 변경하면 능력치를 다시 뽑아요.</small><div class="difficulty-range"><span>기본 체력 ${d.health.join('–')}</span><span>자본 ${d.ranges.capital.join('–')}</span></div>${draft.mode==='custom'?'<small>직접 수정한 값이 최종 시작값이에요.</small>':''}</fieldset>`;
  }
  function customStatsHTML(){if(draft.mode!=='custom')return '';const s=activeStats();return `<details class="advanced-stats"><summary>성장 능력치 직접 설정</summary><div class="advanced-grid">${Object.entries(fields).map(([key,label])=>`<label>${label}<input class="field" type="number" data-stat="${key}" aria-label="${label} 시작값" min="${key==='health'?1:0}" max="100" value="${valueOf(s,key)}"></label>`).join('')}</div></details>`;}
  function moneyHTML(){const s=activeStats(),m=s.finances;return `<span class="starting-money">시작 회사 현금 <strong>${m.cash.toLocaleString()}만 원</strong></span><p>총 자금 ${m.total.toLocaleString()}만 <span class="money-negative">− 준비비 ${m.setup.toLocaleString()}만</span> · 개인 비상금 ${m.reserve.toLocaleString()}만</p>${m.debt?`<p>시작 부채 ${m.debt.toLocaleString()}만 원 포함 · 월 이자 0.6%</p>`:''}`;}
  function refreshDerived(){const advancedOpen=root.querySelector('.advanced-stats')?.open;root.querySelector('#condition-preview').innerHTML=conditionPreview();root.querySelector('#custom-stat-controls').innerHTML=customStatsHTML();if(root.querySelector('.advanced-stats'))root.querySelector('.advanced-stats').open=!!advancedOpen;root.querySelector('#starting-money').innerHTML=moneyHTML();}
  function render(){
    characterMeta=getCharacterMeta?.()||characterMeta;unlocked=characterMeta.earned||[];const access=customAccess(characterMeta);
    const p=portrait();
    root.innerHTML=`<header class="topbar setup-topbar"><button type="button" class="brand brand-home" data-action="intro" aria-label="모두의 창업 첫 화면으로">${brandMark()}<div><strong>모두의 창업</strong><span>CEO로 살아남기</span></div></button><div class="setup-session-actions"><button class="quiet" type="button" data-setup="intro">처음 화면</button><button class="quiet" type="button" data-setup="slots">이어하기</button></div></header><main class="setup-shell"><div class="setup-heading"><h1>캐릭터 생성</h1></div><form id="character-form"><div class="setup-grid"><section class="identity-card card" aria-label="대표 프로필 미리보기"><div class="identity-top"><span>PROFILE</span><span id="founder-type-label">${draft.founderType==='experienced'?'기창업가':'예비 창업가'}</span></div><div class="identity-photo"><img id="identity-image" src="${draft.mode==='custom'&&draft.customPortrait?draft.customPortrait:'assets/'+p.file}" alt="${escape(p.age+' '+p.gender+' 대표 초상화')}" fetchpriority="high"></div>${draft.mode==='custom'?`<div class="custom-photo-controls"><label class="quiet">사진 첨부 · 교체<input id="setup-portrait-file" type="file" accept="image/png,image/jpeg,image/webp" class="sr-only"></label>${draft.customPortrait?'<button type="button" class="quiet" data-setup="clear-photo">기본 그림</button>':''}<small id="photo-status">PNG · JPG · WebP, 8MB 이하</small></div>`:''}<div class="identity-info"><h2 id="identity-name">${escape(draft.name||'나의 이름')}</h2><p id="identity-industry">${escape(data.industries[draft.industry].label)}</p></div><div class="portrait-picker" role="group" aria-label="캐릭터 초상화 선택">${PORTRAITS.map(p=>`<button type="button" data-setup="portrait" data-portrait="${p.id}" aria-label="${escape(portraitLabel(p))}" aria-pressed="${p.id===draft.portrait}" class="portrait-option ${p.id===draft.portrait?'selected':''}" title="${escape(portraitLabel(p))}"><img src="assets/${p.file}" alt=""><span>${p.age} · ${p.gender==='여성'?'여':'남'}</span>${p.id===draft.portrait?'<i aria-hidden="true">✓</i>':''}</button>`).join('')}</div>${specialGallery()}<div id="special-info">${specialInfo()}</div></section><div class="setup-details"><section class="card setup-profile"><h2>나의 프로필</h2><fieldset class="founder-type-options"><legend>창업 경험</legend><label class="${draft.founderType==='aspiring'?'selected':''}"><input type="radio" name="founder-type" value="aspiring" ${draft.founderType==='aspiring'?'checked':''}><span><strong>예비 창업가</strong><small>경험 없음</small></span></label><label class="${draft.founderType==='experienced'?'selected':''}"><input type="radio" name="founder-type" value="experienced" ${draft.founderType==='experienced'?'checked':''}><span><strong>기창업가</strong><small>경험 있음</small></span></label></fieldset><p class="experience-effect" id="experience-effect">${draft.founderType==='experienced'?'운영력 +4 · 시장 이해 +2':'창업 경험 없이 시작'}</p><label class="setup-label" for="character-name">이름 <span>최대 12자</span></label><div class="name-random-row"><input class="field" id="character-name" name="character-name" maxlength="12" value="${escape(draft.name)}" placeholder="대표님의 이름을 입력해 주세요" autocomplete="off" required><button class="quiet" type="button" data-setup="random-name" aria-label="대표 이름 무작위 생성">무작위</button></div><label class="setup-label" for="company-name">회사 이름 <span>최대 20자</span></label><div class="name-random-row"><input class="field" id="company-name" maxlength="20" value="${escape(draft.companyName)}" placeholder="회사의 이름을 정해 주세요" autocomplete="organization"><button class="quiet" type="button" data-setup="random-company" aria-label="회사 이름 무작위 생성">무작위</button></div><label class="setup-label" for="character-industry">업종</label><select class="field" id="character-industry" name="character-industry">${allowedIndustries().map(([id,i])=>`<option value="${id}" ${id===draft.industry?'selected':''}>${escape(i.label)}</option>`).join('')}</select><p class="industry-explainer" id="setup-industry-description">${escape(data.industries[draft.industry].description)}</p></section><section class="card setup-mode"><h2>모드</h2><div class="mode-options" role="radiogroup" aria-label="시작 모드"><label class="mode-option ${draft.mode==='basic'?'selected':''}"><input type="radio" name="game-mode" value="basic" ${draft.mode==='basic'?'checked':''}><span><strong>기본 모드</strong></span><span class="mode-symbol" aria-hidden="true">⚄</span></label><label class="mode-option ${draft.mode==='custom'?'selected':''}"><input type="radio" name="game-mode" value="custom" ${draft.mode==='custom'?'checked':''} ${!access.allowed?'disabled':''}><span><strong>커스텀 모드</strong><small>${access.free?'오늘 무료 1회':access.tickets?`이용권 ${access.tickets}장 · 시작할 때 1장 사용`:'이용권 필요 · 업적 보상에서 획득'}</small></span><span class="mode-symbol" aria-hidden="true">☷</span></label></div></section></div><section class="card setup-stats" id="setup-stats" aria-label="캐릭터 시작 능력치">${statsHTML()}</section></div><div class="setup-bottom"><div id="starting-money">${moneyHTML()}</div><button class="primary begin-game" type="submit" ${draft.name.trim()?'':'disabled'}>창업하기!</button></div></form></main>`;
  }
  root.addEventListener('click',e=>{
    const b=e.target.closest('[data-setup]');if(!b)return;
    if(b.dataset.setup==='intro'){dispose();onIntro();return;}
    if(b.dataset.setup==='slots'){onSavedGames();return;}
    if(b.dataset.setup==='new'){dispose();onNewGame();return;}
    if(b.dataset.setup==='continue'){dispose();onContinue();return;}
    if(b.dataset.setup==='clear-photo'){draft.customPortrait='';render();return;}
    if(b.dataset.setup==='random-name'){draft.name=randomFounderName();render();return;}
    if(b.dataset.setup==='random-company'){draft.companyName=randomCompanyName();render();return;}
    if(b.dataset.setup==='rewards'){onRewards?.();return;}
    if(b.dataset.setup==='unlock'){const result=onUnlock?.(b.dataset.portrait);if(result?.meta){characterMeta=result.meta;unlocked.splice(0,unlocked.length,...result.meta.earned);render();}return;}
    if(b.dataset.setup==='reroll'){
      draft.rolled=rollDifficultyStats(draft.difficulty);draft.custom={...draft.rolled.gauges};draft.overrides={};
      root.querySelector('#setup-stats').innerHTML=statsHTML();refreshDerived();root.querySelector('[data-setup="reroll"]').focus({preventScroll:true});
    }
    if(b.dataset.setup==='portrait'){
      const selected=characters.find(p=>p.id===b.dataset.portrait);if(!selected||selected.requirement&&!unlocked.includes(selected.id))return;
      draft.portrait=selected.id;if(selected.industry){draft.industry=selected.industry;draft.name=selected.name;}else if(data.industries[draft.industry]?.exclusiveCharacter)draft.industry='saas';render();root.querySelector('#identity-image').scrollIntoView({block:'center',behavior:'smooth'});
    }
  },{signal});
  root.addEventListener('input',e=>{
    const el=e.target;
    if(el.id==='company-name')draft.companyName=el.value;
    if(el.id==='character-name'){draft.name=el.value;root.querySelector('#identity-name').textContent=el.value.trim()||'나의 이름';root.querySelector('.begin-game').disabled=!el.value.trim();}
    if(el.dataset.gauge&&draft.mode==='custom'){
      if(el.value==='')return;const key=el.dataset.gauge,n=Number(el.value);if(!Number.isFinite(n))return;
      draft.custom[key]=Math.round(clamp(n,1,100));el.closest('.starting-stat').dataset.band=gaugeBand(draft.custom[key]);root.querySelectorAll(`[data-gauge="${key}"]`).forEach(peer=>{if(peer!==el)peer.value=draft.custom[key];if(peer.type==='range')peer.style.setProperty('--progress',draft.custom[key]+'%');});root.querySelector(`[data-caption="${key}"]`).textContent=gaugeDescription(key,draft.custom[key]);refreshDerived();
    }
    if(el.dataset.stat&&draft.mode==='custom'){
      if(el.value==='')return;const key=el.dataset.stat,n=Number(el.value);if(!Number.isFinite(n))return;
      draft.overrides[key]=Math.round(clamp(n,key==='health'?1:0,100));
      const s=activeStats();root.querySelectorAll('.live-stat-grid>div').forEach((row,i)=>{const k=Object.keys(fields)[i];row.querySelector('strong').textContent=valueOf(s,k);row.querySelector('small').textContent=Number.isFinite(draft.overrides[k])?'직접 설정':`특성 +${s.bonuses[k]}`;});
    }
  },{signal});
  root.addEventListener('change',async e=>{
    const el=e.target;
    if(el.id==='setup-portrait-file'){try{draft.customPortrait=await readPortraitFile(el.files?.[0]);render();}catch(error){root.querySelector('#photo-status').textContent=error.message;}return;}
    if(el.id==='character-industry'){draft.industry=el.value;root.querySelector('#identity-industry').textContent=data.industries[el.value].label;root.querySelector('#setup-industry-description').textContent=data.industries[el.value].description;refreshDerived();}
    if(el.name==='founder-type'){draft.founderType=el.value;root.querySelectorAll('.founder-type-options label').forEach(label=>label.classList.toggle('selected',label.querySelector('input').value===el.value));root.querySelector('#founder-type-label').textContent=el.value==='experienced'?'기창업가':'예비 창업가';root.querySelector('#experience-effect').textContent=el.value==='experienced'?'운영력 +4 · 시장 이해 +2':'창업 경험 없이 시작';refreshDerived();}
    if(el.name==='difficulty'){draft.difficulty=el.value;draft.rolled=rollDifficultyStats(draft.difficulty);draft.custom={...draft.rolled.gauges};draft.overrides={};root.querySelector('#setup-stats').innerHTML=statsHTML();refreshDerived();root.querySelector(`[name="difficulty"][value="${draft.difficulty}"]`).focus({preventScroll:true});}
    if(el.name==='game-mode'){if(el.value==='custom'&&!customAccess(getCharacterMeta?.()||characterMeta).allowed)return;draft.mode=el.value;render();root.querySelector(`[name="game-mode"][value="${draft.mode}"]`).focus({preventScroll:true});}
    if(el.dataset.stat&&draft.mode==='custom')el.value=valueOf(activeStats(),el.dataset.stat);
    if(el.dataset.gauge&&draft.mode==='custom')el.value=draft.custom[el.dataset.gauge];
  },{signal});
  root.addEventListener('submit',e=>{
    if(e.target.id!=='character-form')return;e.preventDefault();const name=draft.name.trim();if(!name)return;
    const started=onStart({name,customPortrait:draft.mode==='custom'?draft.customPortrait:undefined,companyName:draft.companyName.trim()||companyNameFor({name}),founderType:draft.founderType,industry:draft.industry,portrait:draft.portrait,mode:draft.mode,difficulty:draft.difficulty,unlockedCharacters:[...unlocked],startingStats:structuredClone(randomStats()),gauges:{...activeGauges()},traits:structuredClone(draft.traits),overrides:{...draft.overrides},industryData:data.industries[draft.industry]});if(started!==false)dispose();
  },{signal});
  refreshSetup=render;render();
}
