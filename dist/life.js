import {officeView,setOfficeChoice,officePetFile,buyFurnishing,furnishingShop} from './office.js';
import {readBrowserSave,writeBrowserSave} from './browser-save.js';
import {readPortraitFile,portraitSource} from './custom-portrait.js';
import {createGuidedTour} from './guided-tour.js';
import {companyNameFor} from './founder-names.js';
import {claimCareerRewards,purchaseCharacter,consumeCustomPass} from './career-economy.js';
import {recordRun,readRankings,rankingsView,RANKING_KEY,evaluateRun} from './run-evaluation.js';
import {readingView} from './reading-view.js';
import {standingFile} from './engine.js';
import {TUTORIAL_STEPS,tutorialView} from './game-guide.js';
import {newMatch,selectMatch,matchView} from './wiki-match.js';
import {commitManualSave,saveDate} from './manual-save.js';
import {locationBenefit} from './locations.js';
import {readCharacterProgress,writeCharacterProgress,mergeCharacterProgress,difficultyLabel,SPECIAL_CHARACTERS} from './founder-options.js';
import {musicSettings,updateMusic,setMusicContext} from './music.js';
import {AD_RECIPIENT,adInquiryForm,inquiryPayload,inquiryMailto} from './ad-inquiry.js';
import {countNumber,animateCounts} from './count-motion.js';
import {annualCalendar,assistantBriefing,calendarChoices} from './calendar.js';
import {extendGameContent,requestEncounter} from './extended-cast.js';
import {roadmapSummary,roadmapView,syncRoadmap} from './plan-roadmap.js';
import {historyJournal,historyRecord} from './history-view.js';
import {restoreCheckpoint} from './rewind.js';
import {introView,GUIDE_SHOTS} from './intro-view.js';
import {recentChanges,changeBadge,revenueChart,revenueSeries,revenueReadout} from './metrics-view.js';
import {syncAchievements,questShowcase,questCollection,characterShop} from './achievements.js';
import {endingView as renderEndingView,moneyTone} from './ending-view.js';
import {buildEndingReport,endingFinances,signedMoney} from './ending-report.js';
import {prepareResultCard,downloadResultCard,shareResultCard,canShareCard} from './ending-share.js';
import {propertyScene,sceneAsset,seasonForMonth,SEASONS} from './scenery.js';
import {PLAN_STEPS,toggleAllPlanAnswers,randomizePlanAnswers,togglePlanAnswer,movePlanStep,finishInitialPlan,startPlanRevision,cancelPlanRevision} from './startup-plan.js';
import {syncPeople,prepareDecision,resolveDecision,reconsiderDecision,acknowledgeScene,sceneReadings} from './story-engine.js';
import {AUTO_STEP_MS,advanceAutomated,simulateToEnding} from './automation.js';
import {initialPlanView,planReview,eventScene,resultScene,peopleView,personDetail,wikiView,wikiCards,termDetail,readingCards} from './story-views.js';
import {emptySlotStore,addGameSlot,saveActiveSlot,activateSlot,deleteGameSlot,restoreGameSlot,activeGame,readSlotStore,writeSlotStore} from './save-slots.js';
import {LOCATIONS,getLocation,locationRent} from './locations.js';
import {profileView} from './profile-view.js';
import {choiceAvailability,choicesWithPermanentLast} from './conditions.js';
import {statIcon,statSymbol,brandMark,permanentLockMessage} from './stat-view.js';
import {mountCharacterSetup,refreshCharacterSetup} from './character-setup.js';
import {SAVE_KEY,SKILLS,ACTIONS,ITEMS,clamp,level,stage,createState,validateState,forecast,planAction,removePlan,runMonth,chooseEvent,buyItem,abandon,effectsText,getPortrait,AGE_DIFFICULTIES,migrateState,requestFinancing,requiresProduct,costs,adaptEvent,requestScheduledEvent,changeBusinessPlace,updateMotto} from './engine.js';
const app=document.querySelector('#app'),modal=document.querySelector('#modal');
const paths={home:'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',chart:'M4 3v17h17M8 16v-5m5 5V7m5 9V4',book:'M12 6C9 3 5 3 3 4v15c3-1 6-1 9 2 3-3 6-3 9-2V4c-2-1-6-1-9 2Zm0 0v15',shop:'M3 9h18l-2-6H5Zm1 0v12h16V9M9 21v-7h6v7M3 9c0 4 5 4 5 0 0 4 8 4 8 0 0 4 5 4 5 0',save:'M4 3h13l4 4v14H3V3h1Zm3 0v7h10V3M7 21v-7h10v7',help:'M9 8a3 3 0 0 1 6 0c0 2-3 2-3 4m0 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',calendar:'M4 5h16v16H4Zm3-3v6m10-6v6M4 10h16m-11 4h1m4 0h1m-6 3h1',chat:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 1 1 17-5ZM8 10h8m-8 4h5',box:'m12 2 9 5v10l-9 5-9-5V7Zm-9 5 9 5 9-5m-9 5v10M7 4.8l10 5.5',megaphone:'m3 10 15-6v16L3 14Zm4 5 2 6h4l-2-5m11-8v8',people:'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 10v-3a7 7 0 0 1 14 0v3m0-17a4 4 0 0 1 0 8m3 3a6 6 0 0 1 3 6',coffee:'M3 6h13v8a6.5 6.5 0 0 1-13 0Zm13 1h2a3 3 0 0 1 0 6h-2M2 22h17M6 2v1m4-1v1',heart:'M12 21 3 12C-3 4 7-1 12 6c5-7 15-2 9 6Z',wallet:'M3 7V5a2 2 0 0 1 2-2h13v4M3 7h18v14H3Zm13 5h5v5h-5Zm2 2.5h.01',spark:'m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5ZM20 2v4m-2-2h4',target:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Zm-4 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-4 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0',laptop:'M5 3h14v13H5ZM2 16h20v4H2Z',chair:'M6 3h12v10H6Zm0 10-2 5h16l-2-5M7 18v4m10-4v4M3 10v7m18-7v7',leaf:'M21 3C4 0 0 12 8 18S24 15 21 3ZM3 22 16 9',lock:'M5 10h14v11H5Zm3 0V6a4 4 0 0 1 8 0v4m-4 4v3',check:'m5 12 4 4L19 6',play:'m8 4 13 8-13 8Z',award:'m8 14-2 8 6-3 6 3-2-8M19 8A7 7 0 1 1 5 8a7 7 0 0 1 14 0',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM9 3l6 0 1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1Z'};
paths.fast='M3 5l9 7-9 7Zm9 0 9 7-9 7Zm10 0v14';paths.exit='M10 3H3v18h7m4-15 7 6-7 6m7-6H9';
const icon=n=>n==='person'?statIcon(n):`<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="${paths[n]||paths.spark}"/></svg>`;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=n=>Math.round(n).toLocaleString('ko-KR'),signed=n=>`${n>0?'+':''}${num(n)}`;
let workingSlotId=null,dirty=false,dockOpen=false,tutorialStep=0,matchGame=null,pendingNavigation=null,readerReturn=null;
let characterMeta={earned:[],progress:{}},data,state=null,slotStore=emptySlotStore(),view='intro',lessonSearch='',lessonArea='all',toastTimer,wikiSearch='',wikiCategory='all',historyYear='all',revenueUnit='month',revenueYear='recent',autoRunning=false,autoTimer,autoSteps=0;
const tour=createGuidedTour({getState:()=>state,onFinish:()=>{if(state){state.tutorialSeen=true;save();}}});
const monthLabel=n=>`${Math.floor((Math.min(n,60)-1)/12)+1}년 차 · ${(Math.min(n,60)-1)%12+1}월`;
function toast(t){const e=document.querySelector('#toast');e.textContent=t;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),2400);}
let hasBrowserSave=false,browserPending=false,browserWrite=0;
function rememberWorkingCopy(){
 const version=++browserWrite;browserPending=true;
 writeBrowserSave(state,workingSlotId,dirty).then(()=>{
  if(version===browserWrite){browserPending=false;hasBrowserSave=true;}
 }).catch(()=>{if(version===browserWrite)toast('브라우저 자동 저장에 실패했어요. 슬롯에 저장해 주세요.');});
}
function save(silent=true){
 if(!state)return false;
 state=syncRoadmap(syncAchievements(state));if(data?.story)state=syncPeople(state,data.story);
 characterMeta=mergeCharacterProgress(characterMeta,[state]);dirty=true;
 if(silent){rememberWorkingCopy();return true;}
 try{const next=commitManualSave(localStorage,readSlotStore(localStorage,data),state,workingSlotId);slotStore=next;workingSlotId=next.activeId;dirty=false;rememberWorkingCopy();try{writeCharacterProgress(localStorage,characterMeta);}catch{}toast(saveDate(state)+' 저장 완료');return true;}
 catch{toast('저장하지 못했어요. 브라우저 저장 공간을 확인해 주세요.');return false;}
}
function guardUnsaved(next){if(!dirty){next();return;}pendingNavigation=next;modalOpen('슬롯에 보관할까요?',`<p>다른 게임을 시작하거나 불러오면 브라우저 자동 저장이 교체돼요. 지금 진행을 슬롯에 보관할까요?</p><div class="modal-actions"><button class="quiet" data-action="close">돌아가기</button><button class="quiet" data-action="leave-unsaved">슬롯 저장 없이 이동</button><button class="primary" data-action="save-and-leave">슬롯 저장 후 이동</button></div>`);}
function sessionIcon(load=false){return `<svg class="icon session-icon" aria-hidden="true" viewBox="0 0 28 28"><path d="M4 3h13l4 4v7M4 3v18h9M8 3v7h8V3M8 21v-7h5"/><path d="${load?'M25 22H15m4-4-4 4 4 4':'M15 22h10m-4-4 4 4-4 4'}"/></svg>`;}
function floatingDock(){return `<aside class="game-dock ${dockOpen?'open':''}" aria-label="빠른 메뉴"><div id="dock-actions" class="dock-actions" ${dockOpen?'':'hidden'}><button data-action="save">${sessionIcon()}저장하기</button><button data-action="slots">${sessionIcon(true)}이어하기</button><button data-action="help">${icon('help')}도움말</button><button data-action="settings">${icon('settings')}음악 설정</button></div><button class="dock-toggle" data-action="dock-toggle" aria-expanded="${dockOpen}" aria-controls="dock-actions" aria-label="빠른 설정 메뉴">${icon('settings')}</button></aside>`;}
function help(){stopAuto();modal.close();if(!state?.initialPlan?.completed){modalOpen('모아의 안내','<p>초기 계획서를 완성하면 실제 작업실에서 함께 일정을 채워볼 수 있어요.</p>');return;}view='home';render();tour.start();}
function refreshCareer(){const persisted=readCharacterProgress(localStorage,[...slotStore.slots,...slotStore.deletedSlots].map(slot=>slot.state));characterMeta=mergeCharacterProgress({...persisted,progress:{...persisted.progress,...Object.fromEntries(Object.entries(characterMeta.progress||{}).map(([key,value])=>[key,Math.max(value,persisted.progress[key]||0)]))}},state?[state]:[]);}
function unlockCharacter(id){refreshCareer();const result=purchaseCharacter(characterMeta,SPECIAL_CHARACTERS.find(p=>p.id===id));if(result.error){toast(result.error);return result;}try{writeCharacterProgress(localStorage,result.meta);characterMeta=result.meta;toast('캐릭터와 전용 업종을 해금했어요.');return result;}catch{toast('해금을 저장하지 못했어요. 이용권은 변경되지 않았어요.');return {error:'저장 실패'};}}
function useCustomStart(){refreshCareer();const access=consumeCustomPass(characterMeta);if(access.error){toast(access.error);return false;}try{writeCharacterProgress(localStorage,access.meta);characterMeta=access.meta;return true;}catch{toast('이용권 사용을 저장하지 못했어요.');return false;}}
function showQuests(){refreshCareer();modalOpen('성장 업적 수첩',questCollection(state,characterMeta));}
function showCoinStore(){refreshCareer();modalOpen('캐릭터와 커스텀 이용권',characterShop(characterMeta));}

function recommend(){if(!state||state.pending||state.ending||state.lastScene?.unread)return;state.plan=state.health<35?['rest','research','rest','build']:state.skills.product<30?['research','build','study','rest']:['research','build','sales','rest'];save();render();}
function showSavedGames(){
 const slots=[...slotStore.slots].sort((a,b)=>a.number-b.number);
 modalOpen('저장된 게임',`<div class="save-slot-list">${slots.map(slot=>{const s=slot.state,updated=Number.isFinite(Date.parse(slot.updatedAt))?new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(slot.updatedAt)):'';return `<article class="save-slot"><span class="portrait-clip ${s.portrait.startsWith('special-')&&!s.customPortrait?'sprite-thumb':''}"><img src="${portraitSource(s,'assets/'+getPortrait(s.portrait).file)}" alt=""></span><div><span>슬롯 ${slot.number}${slot.id===slotStore.activeId?' · 최근 플레이':''}</span><h3>${esc(s.companyName||s.name+' 컴퍼니')}</h3><small>${esc(s.name)} 대표</small><p>${esc(data.industries[s.industry].label)} · ${saveDate(s)} 저장</p>${updated?`<small>${updated} 저장</small>`:''}</div><div class="slot-actions"><button class="primary" data-action="load-slot" data-id="${esc(slot.id)}">이어하기</button><button class="danger-text" data-action="delete-slot" data-id="${esc(slot.id)}">삭제하기</button></div></article>`;}).join('')||'<p class="empty-slots">아직 저장된 게임이 없어요.</p>'}<button class="new-slot-button" data-action="new">+ 새 슬롯에서 창업하기</button>${slotStore.deletedSlots?.length?`<details class="deleted-slots"><summary>삭제한 슬롯 복구</summary>${slotStore.deletedSlots.map(slot=>`<div><span>슬롯 ${slot.number} · ${esc(slot.state.name)}</span><button class="quiet" data-action="restore-slot" data-id="${esc(slot.id)}">복구</button></div>`).join('')}</details>`:''}</div>`);
}
const automaticDialogs=new Set(['story','result','report']);
const autoCompatibleActions=new Set(['auto-start','auto-pause','auto-finish','close','event','after-report','scene-done','save']);
function autoDialogControls(kind){
 if(!automaticDialogs.has(kind)||state?.ending&&!state?.lastScene?.unread)return '';
 return `<span class="modal-auto-controls">${autoRunning?'<span class="auto-speed">AUTO 2×</span><button class="quiet" data-action="auto-pause">일시정지</button>':'<button class="quiet" data-action="auto-start">오토모드 · 2배속</button>'}</span>`;
}
function autoDialogNotice(kind){
 if(!autoRunning||!automaticDialogs.has(kind))return '';
 const text=kind==='story'?(state.pending?.phase==='advice'?'조언을 자동으로 선택하고 확정해요.':'사건 선택지와 조언을 자동으로 골라요.'):'결과를 확인하고 다음 달로 자동 진행해요. 저장은 직접 눌러 주세요.';
 return `<div class="auto-dialog-notice" role="status"><span>${text}</span><i aria-hidden="true"></i></div>`;
}
function modalOpen(title,body,tag='',kind=''){
 modal.className=kind==='story'?'story-dialog':kind==='result'?'result-dialog':kind==='property'?'property-dialog':kind==='reader'?'reader-dialog':kind==='guide-photo'?'guide-photo-dialog':'';modal.dataset.flow=kind;
 modal.innerHTML=`<div class="modal-body">${tag?`<div class="modal-tag">${esc(tag)}</div>`:''}<div class="modal-head"><h2 id="dialog-title">${esc(title)}</h2><div class="modal-head-actions">${autoDialogControls(kind)}<button class="close-modal" data-action="close" aria-label="창 닫기">${statIcon('close')}</button></div></div>${autoDialogNotice(kind)}${body}</div>`;
 modal.setAttribute('aria-labelledby','dialog-title');if(!modal.open)modal.showModal();modal.scrollTop=0;
}
function nav(){return `<header class="topbar"><button type="button" class="brand brand-home" data-action="intro" aria-label="모두의 창업 첫 화면으로">${brandMark()}<div><strong>모두의 창업</strong><span>CEO로 살아남기</span></div></button><nav class="topnav" aria-label="게임 메뉴">${[['home','home','내 작업실'],['office','chair','내 사무실 꾸미기'],['conditions','person','나의 상태'],['growth','chart','성장 기록'],['lessons','book','창업 노트'],['furnishings','shop','꾸미기 상점'],['shop','home','부동산'],['people','people','인물수첩'],['wiki','help','창업 위키']].map(([id,ic,t])=>`<button data-view="${id}" class="${view===id?'active':''}" ${view===id?'aria-current="page"':''}>${icon(ic)}${t}</button>`).join('')}</nav><div class="topactions"><button class="quiet game-session-button" data-action="slots" aria-label="저장 파일 불러오기">${sessionIcon(true)}<span>이어하기</span></button><button class="quiet" data-action="save" aria-label="${saveDate(state)} 저장">${sessionIcon()}<span>${saveDate(state)} 저장</span></button></div></header>`;}
function pageHead(){
 if(view==='lessons')return '<h1 class="sr-only">창업 노트</h1>';
 const month=Math.min(state.month,60),year=Math.floor((month-1)/12)+1,current=(month-1)%12+1;
 const title={furnishings:'꾸미기 상점',office:'내 사무실 꾸미기',conditions:'나의 상태',growth:'나의 성장 기록',shop:'부동산',people:'인물수첩',wiki:'창업 위키'}[view];
 const heading=view==='home'?`<button class="month-calendar calendar-open" data-action="calendar-year" data-year="${year}" aria-label="${year}년 차 ${current}월"><span>${year}년 차</span><h1 class="month-heading">${current}<small>월</small></h1><small class="calendar-open-label">일정 보기</small></button>`:`<h1>${title}</h1>`;
 return `<div class="pagehead ${view==='home'?'calendar-pagehead':''}">${heading}${view==='home'?questShowcase(state,characterMeta):''}</div>`;
}
function resumeGame(){view=state.initialPlan&&!state.initialPlan.completed?'plan':'home';render();window.scrollTo(0,0);if(view==='home'){if(state.pending)showEvent();else if(state.lastScene?.unread)showResult();}}
function render(){
 if(state&&data?.story){
  const petFile=officePetFile(state),cast=data.story.cast;
  if(cast.some(person=>person.id==='pet'&&person.file!==petFile))data.story={...data.story,cast:cast.map(person=>person.id==='pet'?{...person,file:petFile}:person)};
 }
 setMusicContext(state);
 if(view==='intro'){app.innerHTML=introView(slotStore.slots.length,(dirty||hasBrowserSave)&&!!state);return;}
 if(view==='setup'){mountCharacterSetup({root:app,data,saved:state,characterMeta,getCharacterMeta:()=>characterMeta,onUnlock:unlockCharacter,onRewards:showQuests,onStart:options=>{const candidate=createState(options.industry,options.name,options);if(options.mode==='custom'&&!useCustomStart()){refreshCharacterSetup();return false;}state=candidate;workingSlotId=null;save();view='plan';render();window.scrollTo(0,0);return true;},onContinue:showSavedGames,onSavedGames:showSavedGames,onNewGame:newGame,onIntro:showIntro});return;}
 if(state.initialPlan&&!state.initialPlan.completed){view='plan';app.innerHTML=initialPlanView(state,data)+floatingDock();return;}
 state=syncRoadmap(syncAchievements(syncPeople(state,data.story)));characterMeta=mergeCharacterProgress(characterMeta,[state]);
 if(state.ending){try{const previous=readRankings(localStorage),next=recordRun(previous,state,data.industries[state.industry].label);if(next!==previous)localStorage.setItem(RANKING_KEY,JSON.stringify(next));}catch{}}
 app.innerHTML=`${nav()}<main class="shell">${pageHead()}${view==='home'?assistantBriefing(state):''}${state.pending||state.lastScene?.unread?`<div class="event-banner"><div><strong>${esc(state.pending?.title||'선택의 결과')}</strong><p>${state.pending?'선택을 기다리는 사건':esc(state.lastScene.title)}</p></div><button class="primary" data-action="event">이어서 보기</button></div>`:''}${state.ending&&view==='home'?endingView():({home:dashboard,furnishings:()=>furnishingShop(state),office:()=>officeView(state,esc),conditions:()=>profileView(state,data,esc,effectsText),growth:growthView,lessons:lessonsView,shop:shopView,people:()=>peopleView(state,data),wiki:()=>wikiView(wikiSearch,wikiCategory)}[view])()}</main>${floatingDock()}`;animateCounts(app,slotStore.activeId);tour.refresh();
}
function dashboard(){const changes=recentChanges(state),f=forecast(state,data),blocked=!!state.pending||!!state.ending||!!state.lastScene?.unread||autoRunning;const skillStyles={product:['purple','box'],sales:['orange','megaphone'],insight:['teal','chat'],management:['blue','book'],network:['pink','people']};const conditions=[[state.skills.product>=30,'제품력 30 달성'],[state.customers>=10,'첫 고객 10명 만나기'],[state.history.some(h=>h.profit>0),'첫 월간 흑자 만들기']];return `<div class="game-grid"><aside class="sidebar"><section class="card profile" aria-label="대표 프로필"><div class="profile-top"><span class="portrait-clip ${state.portrait.startsWith('special-')&&!state.customPortrait?'sprite-thumb':''}"><img class="avatar portrait-avatar" src="${portraitSource(state,'assets/'+getPortrait(state.portrait).file)}" alt="${esc(state.name)} 대표 초상화"></span><div><span class="level">Lv. ${level(state)}</span><div class="profile-name">${esc(state.name)} <small>대표</small></div></div></div><b style="font-size:14px">${stage(state)}</b><p class="industry">${esc(data.industries[state.industry].label)}</p><div class="profile-line"><span>다음 레벨까지</span><b>${state.xp%100} / 100</b></div><div class="bar" role="progressbar" aria-label="레벨 경험치" aria-valuenow="${state.xp%100}" aria-valuemin="0" aria-valuemax="100"><i style="width:${state.xp%100}%"></i></div></section><section class="card stats"><div class="section-title"><h2>오늘의 나</h2>${icon('spark')}</div><p class="change-basis" title="${esc(changes.basis)}">최근 한 달 변화</p><div class="health-title"><span>체력</span><span class="stat-value"><b class="${state.health<25?'low':''}">${countNumber('health',state.health)} <small>/ 100</small></b>${changeBadge(changes.health,'',changes.basis)}</span></div><div class="bar health-bar"><i style="width:${state.health}%"></i></div><p class="health-copy">${state.health<25?'지쳤어요. 성장 효과가 줄어들어요.':state.health<50?'잠깐 쉬어 가도 괜찮아요.':'좋아요, 뭐든 해볼 수 있을 것 같아요.'}</p><div class="skills">${Object.entries(SKILLS).map(([id,name])=>`<div class="${skillStyles[id][0]}"><div class="skill-top"><span class="skill-label">${icon(skillStyles[id][1])}${name}</span><span class="stat-value"><b>${countNumber('skill-'+id,state.skills[id])}</b>${changeBadge(changes.skills[id],'',changes.basis)}</span></div><div class="bar" role="progressbar" aria-label="${name}" aria-valuenow="${state.skills[id]}" aria-valuemin="0" aria-valuemax="100"><i style="width:${state.skills[id]}%"></i></div></div>`).join('')}</div></section></aside><div class="center"><section class="founder-card card" aria-label="나의 대표 카드"><div class="founder-card-head"><span>PROFILE</span><span class="founder-mode">${getPortrait(state.portrait).age} · ${state.mode==='custom'?'커스텀 · ':''}${difficultyLabel(state)}</span></div><div class="founder-card-body"><div class="founder-photo standing-photo founder-scene" style="--founder-scene:url('${sceneAsset(state.businessPlace||'home',state.month)}')"><span class="founder-place">${esc(getLocation(state.businessPlace||'home').name)} · ${SEASONS[seasonForMonth(state.month)]}</span><img src="${portraitSource(state,'assets/'+standingFile(state.portrait))}" class="${state.customPortrait?'uploaded-portrait':''}" alt="${esc(state.name)}의 선택한 캐릭터"></div><div class="founder-message"><strong class="founder-company">${esc(companyNameFor(state))}</strong><span>${stage(state)}</span><h2>${esc(state.name)} <small>대표</small></h2><p class="founder-industry">${esc(data.industries[state.industry].label)}</p>${state.mode==='custom'?'<button class="quiet custom-photo-open" data-action="custom-photo">사진 첨부 · 교체</button>':''}<div class="motto-heading"><span>한마디</span><button data-action="edit-motto" aria-label="한마디 수정">수정</button></div><blockquote>${esc(state.motto||'나의 한마디를 적어 보세요.')}</blockquote></div></div></section><section class="numbers card" aria-label="사업 현황"><div class="metric"><label>${icon('wallet')}보유 현금</label><div class="metric-value"><strong>${countNumber('cash',state.cash)}<small>만 원</small></strong>${changeBadge(changes.cash,'만 원',changes.basis)}</div><em>이번 달의 든든한 자금</em></div><div class="metric"><label>${icon('chart')}지난달 매출</label><div class="metric-value"><strong>${countNumber('revenue',state.revenue)}<small>만 원</small></strong>${changeBadge(changes.revenue,'만 원',changes.basis)}</div><em>${state.month===1?'첫 매출을 기다리는 중':`월 손익 ${signed(state.profit)}만 원`}</em></div><div class="metric"><label>${icon('people')}고객</label><div class="metric-value"><strong>${countNumber('customers',state.customers)}<small>명</small></strong>${changeBadge(changes.customers,'명',changes.basis)}</div><em>${state.customers?'우리 제품을 쓰는 사람들':'곧 첫 고객을 만날 거예요'}</em></div></section>${roadmapSummary(state)}<section id="action-list" aria-labelledby="action-title"><div class="action-heading"><div><h2 id="action-title">할 일 고르기</h2></div></div>${calendarChoices(state,effectsText)}<div class="action-grid">${ACTIONS.map(a=>`<button class="action ${a.color}" data-action="plan" data-id="${a.id}" ${blocked||state.plan.length===4||requiresProduct(state)&&state.plan.length===3&&!state.plan.includes('build')&&a.id!=='build'?'disabled':''} aria-label="${a.name} 일정 추가"><span class="iconbox">${icon(a.icon)}</span><span class="add-icon" aria-hidden="true">+</span><strong>${a.name}</strong><span class="effects">${a.id==='rest'?'체력 +30':Object.entries(a.fx).map(([k,v])=>`${SKILLS[k]} +${v}`).join(' · ')}</span><span class="cost">활동비 −${a.cost}만 원${a.health<0?` · 체력 ${a.health}`:''}</span></button>`).join('')}</div></section></div><aside class="rightbar"><section class="card planner" aria-labelledby="planner-title"><div class="section-title"><h2 id="planner-title">이번 달의 일정</h2><span class="counter">${state.plan.length} / 4</span></div>${requiresProduct(state)?'<p class="lead">보유 기술 67 이상 · 제품 만들기 1주 필수</p>':''}<div class="weeks">${Array.from({length:4},(_,i)=>{const a=ACTIONS.find(x=>x.id===state.plan[i]);return a?`<div class="week filled ${a.color}"><span class="weeknum">${i+1}주</span><span class="mini-icon">${icon(a.icon)}</span><div><strong>${a.name}</strong><small>${a.place}</small></div><button class="remove" data-action="remove" data-index="${i}" aria-label="${i+1}주 ${a.name} 일정 삭제" ${blocked?'disabled':''}>×</button></div>`:`<button class="week empty" data-action="focus-actions" ${blocked?'disabled':''}><span class="weeknum">${i+1}주</span><span>+ 일정 선택하기</span></button>`;}).join('')}</div><div class="plan-summary"><p><span>예상 활동비</span><b>${num(f.cost)}만 원</b></p><p><span>월 고정비</span><b>${num(f.fixed)}만 원</b></p><p><span>예상 남은 체력</span><b>${f.health} / 100</b></p></div>${f.cashAfterCosts<0?'<div class="warning">활동비와 고정비가 부족해요. <button data-action="financing">자금 대책 확인하기</button></div>':f.health<25?'<div class="warning">일정을 마치면 많이 지칠 것 같아요. 휴식을 넣어 보세요.</div>':''}<button class="primary" data-action="run" ${blocked||state.plan.length!==4||f.cashAfterCosts<0||requiresProduct(state)&&!state.plan.includes('build')?'disabled':''}>${icon('play')}이번 달 시작하기</button><div class="planner-controls"><button class="auto-plan" data-action="recommend" ${blocked?'disabled':''}>${icon('spark')}<b>추천 일정으로 채우기</b></button><div class="planner-icons"><button class="icon-control ${autoRunning?'active':''}" data-action="${autoRunning?'auto-pause':'auto-start'}" aria-label="${autoRunning?'자동 진행 일시정지':'자동 진행 2배속'}" title="${autoRunning?'일시정지':'자동 진행 · 2배속'}">${autoRunning?'Ⅱ':'AUTO'}</button><button class="icon-control" data-action="auto-finish" aria-label="건너뛰고 결과보기" title="건너뛰고 결과보기">${icon('fast')}</button><button class="icon-control exit-control" data-action="retire" aria-label="나가기 · 자진 폐업" title="나가기 · 자진 폐업">${icon('exit')}</button></div></div></section><section class="card ad-contact-card"><span class="ad-label">광고</span><h3>창업지원사업 모집 소식을 기다립니다</h3><button class="quiet" data-action="ad-inquiry">광고 문의</button></section><button class="shop-shortcut" data-view="shop">${icon('shop')}<span><strong>부동산</strong><small>${esc(getLocation(state.businessPlace??'home').name)} · 월 ${num(locationRent(state.businessPlace))}만 원</small><small class="space-benefit">${locationBenefit(state.businessPlace||'home')}</small></span></button></aside></div>`;}
function shopView(){
 return `<div class="property-grid">${LOCATIONS.map(place=>{
  const rented=place.id===(state.businessPlace??'home');
  return `<article class="card property-card ${rented?'current':''}"><button class="property-thumbnail" data-action="inspect-place" data-id="${place.id}" aria-label="${esc(place.name)} 살펴보기"><img src="${sceneAsset(place.id,state.month)}" alt="${SEASONS[seasonForMonth(state.month)]}의 ${esc(place.name)}" loading="lazy" decoding="async"><span>${SEASONS[seasonForMonth(state.month)]}</span></button><div class="property-top"><span class="property-icon">${icon(place.icon)}</span>${rented?'<span>현재 입주</span>':''}</div><h2>${place.name}</h2><p>${place.description}</p><p class="space-benefit">${locationBenefit(place.id)}</p><button class="quiet" data-action="inspect-place" data-id="${place.id}">살펴보기</button></article>`;
 }).join('')}</div>`;
}
function lessonCards(){const list=data.lessons.filter(l=>(lessonArea==='all'||l.area===lessonArea)&&(l.title+' '+(state.lessons.includes(l.id)?l.body:'')).includes(lessonSearch)).sort((a,b)=>Number(state.lessons.includes(b.id))-Number(state.lessons.includes(a.id)));return list.length?list.map(l=>{const learned=state.lessons.includes(l.id);return `<article class="card lesson ${learned?'unlocked':'locked'}" data-area="${esc(l.area)}"><span class="category">${learned?'✓ '+esc(l.area):statIcon('lock')+' 미해금'}</span><h3>${esc(l.title)}</h3><p>${learned?esc(l.body):'창업 공부와 일상의 선택으로 알아가요.'}</p>${learned?`<button class="quiet lesson-open" data-action="lesson-card" data-id="${l.id}">카드 열기</button>`:''}</article>`;}).join(''):'<div class="empty-state"><strong>찾는 메모가 없어요.</strong><p>다른 단어로 검색해 보세요.</p></div>';}
function lessonsView(){return `<div class="collection-tools"><input class="field" id="lesson-search" aria-label="창업 노트 검색" placeholder="찾고 싶은 배움을 검색해 보세요" value="${esc(lessonSearch)}"><select class="field" id="lesson-area" aria-label="배움 분야"><option value="all">모든 분야</option>${[...new Set(data.lessons.map(x=>x.area))].map(a=>`<option value="${esc(a)}" ${a===lessonArea?'selected':''}>${esc(a)}</option>`).join('')}</select><span class="save-note" style="align-self:center">${state.lessons.filter(id=>data.lessons.some(l=>l.id===id)).length} / ${data.lessons.length}개의 배움</span></div><div class="collection" id="lesson-cards">${lessonCards()}</div>`;}
function growthView(){const netProfit=state.history.reduce((sum,row)=>sum+(Number.isFinite(row.profit)?row.profit:0),0);return `<div class="summary-grid"><div class="card">${statSymbol('runway','함께한 시간')}<b>${state.month-1}개월</b></div><div class="card">${statSymbol('cash','순수익')}<b class="${moneyTone(netProfit)}">${signedMoney(netProfit)}</b><small class="profit-basis" title="월별 매출에서 원가·활동비·고정비를 뺀 손익의 합계. 투자금·대출금·사건 현금 효과는 제외해요.">월말 손익 누적</small></div><div class="card">${statSymbol('cash','누적 매출')}<b>${num(state.history.reduce((n,h)=>n+h.revenue,0))}<small>만</small></b></div><div class="card">${statSymbol('management','모아 둔 배움')}<b>${state.lessons.length}개</b></div></div>${revenueChart(state.history,{unit:revenueUnit,year:revenueYear})}${historyJournal(state,data,historyYear)}`;}
function showReport(r){modalOpen(`${monthLabel(r.month)}, 수고했어요.`,`<p>${r.newCustomers?`${r.newCustomers}명의 새 고객이 우리 제품을 찾아왔어요.`:'오늘의 작은 노력이 다음 달의 나를 만들어요.'}</p><div class="report-grid"><div><span>이번 달 매출</span><strong>${num(r.revenue)}만 원</strong></div><div><span>활동·운영 비용</span><strong>${num(r.expense)}만 원</strong></div><div><span>이번 달 손익</span><strong>${signed(r.profit)}만 원</strong></div><div><span>체력 변화</span><strong>${signed(r.health)}</strong></div></div>${r.rows.map((x,i)=>`<div class="report-row"><span>${i+1}주 · ${x.name}</span><small>${Object.entries(x.gains).map(([k,v])=>`${SKILLS[k]} +${v}`).join(' · ')||'잘 쉬었어요'}</small></div>`).join('')}${effectsText(r.spaceEffects)?`<div class="report-row"><span>공간 추가 효과</span><small>${esc(effectsText(r.spaceEffects))}</small></div>`:''}${effectsText(r.signatureEffects)?`<div class="report-row"><span>캐릭터 고유 효과</span><small>${esc(effectsText(r.signatureEffects))}</small></div>`:''}${effectsText(r.traitEffects)?`<div class="report-row"><span>배경 특성 효과</span><small>${esc(effectsText(r.traitEffects))}</small></div>`:''}<div class="modal-actions"><button class="primary" data-action="after-report">${state.ending?'이번 도전 돌아보기':'다음 달로 넘어가기'}</button></div>`,'월말 정산','report');}
function showEvent(){if(!state.pending){if(state.lastScene?.unread)showResult();return;}const scene=eventScene(state,data);modalOpen(scene.title,scene.body,'','story');}
function showResult(){if(!state.lastScene)return;const scene=resultScene(state,data);modalOpen(scene.title,scene.body,'','result');}
function endingView(){return renderEndingView(state,data);}
let readyEndingCard=null,endingCardModel=null,shareRequest=0;
async function openEndingCard(){
 const request=++shareRequest,card=buildEndingReport(state,data).share;
 modalOpen('결과 카드', '<div class="ending-share-status" role="status">캐릭터와 배경으로 카드를 만들고 있어요.</div>','','share');
 try{
  const ready=await prepareResultCard(card);
  if(request!==shareRequest||!modal.open||modal.dataset.flow!=='share')return;
  readyEndingCard=ready;endingCardModel=card;
  modalOpen('결과 카드',`<img class="result-card-image" src="${ready.url}" alt="${esc(card.name)} 대표의 ${esc(card.keyword)} 결과 카드"><p class="card-share-note">캐릭터·엔딩 장면·최종 지표를 담았어요.<br>${canShareCard(ready)?'공유할 앱을 직접 고를 수 있어요.':'이 브라우저에서는 이미지를 저장한 뒤 원하는 앱으로 보낼 수 있어요.'}</p><div class="modal-actions"><button class="quiet" data-action="ending-download">이미지 저장</button><button class="primary" data-action="ending-share">${canShareCard(ready)?'결과 공유':'저장해서 공유'}</button></div>`,'','share');
  modal.classList.add('result-card-dialog');
 }catch(error){
  if(request!==shareRequest||!modal.open||modal.dataset.flow!=='share')return;
  modalOpen('카드를 만들지 못했어요',`<p class="card-share-note">그림을 불러오지 못했어요. 연결을 확인하고 다시 시도해 주세요.</p><div class="modal-actions"><button class="quiet" data-action="close">닫기</button><button class="primary" data-action="ending-card">다시 시도</button></div>`,'','share');
 }
}

function selectRevenuePoint(month){
 const point=revenueSeries(state?.history||[],{unit:revenueUnit,year:revenueYear}).points.find(p=>p.month===Number(month));
 const readout=document.querySelector('#revenue-readout');if(!point||!readout)return;
 readout.innerHTML=revenueReadout(point);
 document.querySelectorAll('[data-chart-month]').forEach(node=>{const selected=Number(node.dataset.chartMonth)===point.month;node.classList.toggle('selected',selected);node.setAttribute('aria-pressed',String(selected));});
 const guide=document.querySelector('#revenue-guide');guide?.setAttribute('x1',point.x);guide?.setAttribute('x2',point.x);
}
function showIntro(){stopAuto();if(modal.open)modal.close();view='intro';render();window.scrollTo(0,0);}
function newGame(){guardUnsaved(()=>{stopAuto();if(modal.open)modal.close();view='setup';render();window.scrollTo(0,0);});}
function settings(){
 const music=musicSettings();
 modalOpen('음악 설정',`<div class="volume-panel"><label class="music-toggle"><span>배경 음악</span><input id="music-enabled" type="checkbox" ${music.enabled?'checked':''}></label><label class="volume-label" for="music-volume">음량 <output id="music-volume-value">${music.volume}%</output></label><input id="music-volume" type="range" min="0" max="100" value="${music.volume}"></div><button class="primary volume-done" data-action="close">완료</button>`,'','settings');
}

function credits(){modalOpen('자료와 제작 정보',`<div class="license"><p>창업 사례·업종 자료·학습 문구는 <a href="https://www.letter4ceo.com/games/business-second-run.html" target="_blank" rel="noopener">사업 2회차 : 또 창업을 한다면</a>을 바탕으로 재구성했습니다.</p><p>원본 콘텐츠: ‘사업 2회차 : 또 창업을 한다면’ 기여자 · <a href="https://creativecommons.org/licenses/by/4.0/deed.ko" target="_blank" rel="noopener">CC BY 4.0</a>.<br>참고 자료: <a href="https://www.letter4ceo.com/" target="_blank" rel="noopener">명승은의 그만의 아침편지</a>. 연결된 원문의 권리는 글쓴이에게 있습니다.</p><p>이 버전은 화면과 4주 일정·성장 능력치를 육성 게임에 맞게 변경했습니다. 원본의 출발 조건 난이도 가중치, 자본 공식, 사건 잠금 기준을 반영했습니다. 원본 미니게임은 기본(B) 결과로 처리하며, 세계 사건의 분기와 후속 사건을 일정에 맞게 재구성했습니다. 배경 특성의 일부 소폭 보너스는 이 버전에 추가한 규칙입니다. 일러스트는 이 버전을 위해 생성했습니다. 인물 20명은 원본의 관계 역할과 조언 성향을 바탕으로 재구성하거나 이 버전에 새로 추가했습니다. 원본에 연결된 아침편지 제목·주소·요약을 사용합니다. 계획서의 고객·가치·채널·위험은 실행 계획과 함께 기록되며, 가격·자금 속도·팀·개인 한계 선택은 이 버전의 계산에 반영합니다.</p><p>사건과 숫자는 게임을 위한 가정이며 실제 사업 결과를 예측하지 않습니다.</p><p><a href="game.html" target="_blank" rel="noopener">원본 게임과 전체 라이선스 보기</a> · <a href="editor.html" target="_blank" rel="noopener">이전 원본 편집기</a></p></div>`);}
async function handle(e){const v=e.target.closest('[data-view]');if(v){tour.stop(false);stopAuto();view=v.dataset.view;render();window.scrollTo({top:0,behavior:'smooth'});return;}const b=e.target.closest('[data-action]');if(!b||b.disabled)return;const action=b.dataset.action,id=b.dataset.id,index=Number(b.dataset.index);if(tour.active&&!['plan','run','event'].includes(action))tour.stop(false);if(autoRunning&&!autoCompatibleActions.has(action)){stopAuto();render();}if(action==='ending-card'){await openEndingCard();return;}if(action==='ending-download'){if(readyEndingCard){downloadResultCard(readyEndingCard);toast('결과 카드 이미지 저장을 시작했어요.');}return;}if(action==='ending-share'){if(!readyEndingCard)return;b.disabled=true;try{const result=await shareResultCard(readyEndingCard,endingCardModel);if(result==='download')toast('카드 이미지를 저장해 원하는 앱으로 공유해 주세요.');}catch{toast('공유창을 열지 못했어요. 이미지 저장을 이용해 주세요.');}finally{b.disabled=false;}return;}if(await handleStoryAction(action,b))return;if(action==='close'){modal.close();return;}if(action==='save'){save(false);return;}if(action==='slots'){showSavedGames();return;}if(action==='delete-slot'||action==='restore-slot'){
 const next=action==='delete-slot'?deleteGameSlot(slotStore,id):restoreGameSlot(slotStore,id);
 if(next===slotStore)return;
 try{writeSlotStore(localStorage,next);}catch{toast('저장 공간을 갱신하지 못했어요.');return;}
 slotStore=next;if(action==='delete-slot'&&workingSlotId===id){workingSlotId=null;dirty=!!state;if(state)rememberWorkingCopy();}showSavedGames();return;
 }if(action==='load-slot'){guardUnsaved(()=>{const next=activateSlot(slotStore,id);if(next===slotStore)return;slotStore=next;workingSlotId=id;state=activeGame(slotStore);dirty=false;rememberWorkingCopy();modal.close();resumeGame();});return;}if(action==='help'){tutorialStep=0;help();return;}if(action==='edit-motto'){modalOpen('한마디',`<label for="profile-motto">나를 소개하는 한마디</label><textarea class="field" id="profile-motto" rows="3" maxlength="80" placeholder="나의 한마디를 적어 보세요.">${esc(state.motto||'')}</textarea><div class="motto-limit">최대 80자</div><div class="modal-actions"><button class="primary" data-action="save-motto">저장하기</button></div>`);return;}if(action==='save-motto'){state=updateMotto(state,document.querySelector('#profile-motto').value);save();modal.close();render();toast('한마디를 저장했어요.');return;}if(action==='ad-inquiry'){modalOpen('광고 문의',adInquiryForm());return;}if(action==='inspect-place'||action==='preview-season'){const detail=propertyScene(state,data,id,costs({...state,businessPlace:id},data),action==='preview-season'?b.dataset.season:undefined);if(detail){modalOpen(detail.title,detail.body,'','property');if(action==='preview-season')modal.querySelector(`[data-season="${b.dataset.season}"].season-preview-button`)?.focus({preventScroll:true});}return;}if(action==='move-place'){const next=changeBusinessPlace(state,id);if(next!==state){state=next;save();modal.close();render();toast(getLocation(id).name+'로 사업장을 변경했어요.');}return;}if(action==='credits'){credits();return;}if(action==='settings'){settings();return;}if(action==='new'){newGame();return;}if(action==='rename'){state.name=document.querySelector('#profile-name').value.trim().slice(0,12)||'새봄';state=updateMotto(state,document.querySelector('#profile-motto').value);save();modal.close();render();toast('프로필을 저장했어요.');return;}if(action==='retire'){modalOpen('정말로 그만두시겠습니까?',`<p>지금 그만두면 자진 폐업에 돌입하게 됩니다. 저장한 기록이 없다면 다시 플레이할 수 없습니다.</p><div class="modal-actions"><button class="quiet" data-action="close">계속해 볼래요</button><button class="primary" data-action="confirm-retire">폐업하기</button></div>`);return;}if(action==='confirm-retire'){state=abandon(state);save();modal.close();view='home';render();return;}if(action==='event'){showEvent();return;}if(action==='financing'){const next=requestFinancing(state,data);if(next!==state){state=next;save();render();showEvent();}return;}if(action==='after-report'){if(state.pending)showEvent();else modal.close();return;}if(action==='buy'){const next=buyItem(state,id);if(next!==state){state=next;save();render();toast(`${ITEMS.find(i=>i.id===id).name}, 작업실에 놓았어요.`);}return;}if(action==='focus-actions'){document.querySelector('#action-list').scrollIntoView({behavior:'smooth',block:'center'});document.querySelector('.action:not(:disabled)')?.focus({preventScroll:true});return;}if(action==='plan'){const next=planAction(state,id);if(next!==state){state=next;save();render();const focusTarget=state.plan.length===4?'[data-action=run]':`[data-action=plan][data-id=${id}]`;document.querySelector(focusTarget)?.focus({preventScroll:true});toast(`${state.plan.length}주 · ${ACTIONS.find(a=>a.id===id).name}`);}return;}if(action==='remove'){state=removePlan(state,index);save();render();return;}if(action==='recommend'){recommend();toast('성장과 휴식을 함께 담았어요.');return;}if(action==='run'){const result=runMonth(state,data);if(result.error){toast(result.error);return;}state=result.state;save();render();if(result.calendar)showEvent();else showReport(result.report);}}
function stopAuto(){clearTimeout(autoTimer);autoRunning=false;}
function scheduleAuto(){clearTimeout(autoTimer);if(autoRunning&&!document.hidden)autoTimer=setTimeout(autoTick,AUTO_STEP_MS);}
function autoTick(){
 if(!autoRunning)return;
 try{
  if(++autoSteps>1200){stopAuto();render();refreshAutoDialog();toast('자동 진행을 멈췄어요. 현재 진행을 남기려면 저장해 주세요.');return;}
  // Game state drives the clock; a dismissed dialog must never block the next choice.
  const result=advanceAutomated(state,data);
  if(result.error){stopAuto();render();refreshAutoDialog();toast(result.error);return;}
  state=result.state;save();render();
  if(result.kind==='month'){if(state.pending)showEvent();else showReport(result.report);}
  else if(['event','advice'].includes(result.kind)){showEvent();}
  else if(result.kind==='result')showResult();
  else if(result.kind==='acknowledge'&&modal.open)modal.close();
  if(state.ending&&!state.lastScene?.unread&&result.kind!=='month'){stopAuto();if(modal.open)modal.close();render();return;}
  scheduleAuto();
 }catch(error){stopAuto();render();refreshAutoDialog();toast('자동 진행을 잠시 멈췄어요. 진행을 남기려면 저장해 주세요.');console.error(error);}
}
function refreshAutoDialog(){
 if(!modal.open)return;
 if(modal.dataset.flow==='story')showEvent();
 else if(modal.dataset.flow==='result')showResult();
 else {const controls=modal.querySelector('.modal-auto-controls');if(controls)controls.outerHTML=autoDialogControls(modal.dataset.flow);modal.querySelector('.auto-dialog-notice')?.remove();}
}
function startAuto(){
 if(autoRunning||(state.ending&&!state.lastScene?.unread))return;
 autoRunning=true;autoSteps=0;view='home';render();
 if(state.lastScene?.unread)showResult();else if(state.pending)showEvent();else if(modal.open)modal.close();
 scheduleAuto();
}
async function skipToEnding(){
 if(state.ending)return;stopAuto();
 modalOpen('결과를 계산하고 있어요','<div class="simulation-progress"><span></span><p>일정과 선택을 순서대로 진행 중</p></div>');
 await new Promise(resolve=>setTimeout(resolve,40));
 try{const result=simulateToEnding(state,data);state=result.state;save();modal.close();view='home';render();window.scrollTo(0,0);if(result.error)toast(result.error);}
 catch(error){modal.close();render();toast('자동 진행을 멈췄어요. 저장된 지점에서 이어할 수 있어요.');console.error(error);}
}
async function handleStoryAction(action,b){
 const id=b.dataset.id;
 if(action==='office-buy'&&view==='furnishings'){
  const next=buyFurnishing(state,id);
  if(next!==state){state=next;save();render();toast('구매했어요. 내 사무실 꾸미기에서 배치할 수 있어요.');}
  return true;
 }
 if(action==='office-pick'&&view==='office'){
  const next=setOfficeChoice(state,b.dataset.group,b.dataset.id);
  if(next!==state){state=next;save();render();app.querySelector(`[data-action="office-pick"][data-group="${b.dataset.group}"][data-id="${b.dataset.id}"]`)?.focus({preventScroll:true});}
  return true;
 }

 if(action==='custom-photo'&&state.mode==='custom'){modalOpen('내 캐릭터 사진',`<label class="quiet">사진 첨부 · 교체<input class="sr-only" id="custom-portrait-file" type="file" accept="image/png,image/jpeg,image/webp"></label><p id="custom-photo-status" class="career-note">PNG · JPG · WebP, 8MB 이하</p><button class="quiet" data-action="clear-custom-photo">기본 캐릭터 그림으로</button>`);return true;}
 if(action==='clear-custom-photo'&&state.mode==='custom'){delete state.customPortrait;save();modal.close();render();return true;}
 if(action==='guide-photo'){const shot=GUIDE_SHOTS.find(x=>x.id===id);if(shot)modalOpen(shot.title,`<img class="guide-photo-full" src="assets/guide-${shot.id}.jpg?v=14" alt="${shot.title} 실제 플레이 화면"><p class="guide-photo-description">${shot.text}</p>`,'','guide-photo');return true;}
 if(action==='reading'){const reader=readingView(id,data);if(reader){readerReturn=modal.open?{html:modal.innerHTML,className:modal.className,flow:modal.dataset.flow,scroll:modal.scrollTop}:null;modalOpen(reader.title,reader.body,'','reader');}return true;}
 if(action==='reading-back'||action==='close'&&modal.dataset.flow==='reader'){if(readerReturn){modal.innerHTML=readerReturn.html;modal.className=readerReturn.className;modal.dataset.flow=readerReturn.flow;modal.scrollTop=readerReturn.scroll;readerReturn=null;}else modal.close();return true;}
 if(action==='resume-current'){if(state)resumeGame();return true;}
 if(action==='dock-toggle'){dockOpen=!dockOpen;const dock=document.querySelector('.game-dock');dock?.classList.toggle('open',dockOpen);dock?.querySelector('.dock-toggle').setAttribute('aria-expanded',String(dockOpen));const actions=dock?.querySelector('.dock-actions');if(actions)actions.hidden=!dockOpen;return true;}
 if(action==='leave-unsaved'||action==='save-and-leave'){if(action==='save-and-leave'&&!save(false))return true;const go=pendingNavigation;pendingNavigation=null;dirty=false;go?.();return true;}
 if(action==='tutorial-start'){tutorialStep=0;help();return true;}
 if(action==='tutorial-next'||action==='tutorial-prev'){tutorialStep=Math.max(0,Math.min(TUTORIAL_STEPS.length-1,tutorialStep+(action==='tutorial-next'?1:-1)));help();return true;}
 if(action==='tutorial-practice'){recommend();help();return true;}
 if(action==='tutorial-save'){state.tutorialSeen=true;save(false);return true;}
 if(action==='tutorial-done'){if(state&&!state.tutorialSeen){state.tutorialSeen=true;save();}modal.close();return true;}
 if(action==='tutorial-locate'){modal.close();if(state?.initialPlan?.completed){view='home';render();const target=document.querySelector(TUTORIAL_STEPS[tutorialStep].target)||document.querySelector('.assistant-briefing');target?.scrollIntoView({behavior:'smooth',block:'center'});target?.classList.add('tutorial-highlight');setTimeout(()=>target?.classList.remove('tutorial-highlight'),5000);toast('도움말에서 언제든 다시 볼 수 있어요.');}return true;}
 if(action==='wiki-match'){matchGame=newMatch(wikiCategory);modalOpen('용어 짝맞추기',matchView(matchGame),'','match');return true;}
 if(action==='wiki-match-pick'){if(matchGame){matchGame=selectMatch(matchGame,b.dataset.side,id);modalOpen('용어 짝맞추기',matchView(matchGame),'','match');}return true;}
 if(action==='intro'){showIntro();return true;}
 if(action==='calendar-year'){const year=Math.max(1,Math.min(5,Number(b.dataset.year)||1));modalOpen('회사 달력',annualCalendar(state,year));return true;}
 if(action==='calendar-choice'){const next=requestScheduledEvent(state);if(next!==state){state=prepareDecision(next,Number(b.dataset.index),data.story);save();render();showEvent();}return true;}
 if(action==='calendar-join'){const next=requestScheduledEvent(state);if(next!==state){state=next;save();render();showEvent();}return true;}
 if(action==='history-year'){historyYear=id;render();document.querySelector('#history-records')?.scrollIntoView({block:'start'});return true;}
 if(action==='history-latest'){historyYear='all';render();document.querySelector('#history-records')?.scrollIntoView({block:'start'});return true;}
 if(action==='history-record'){const record=historyRecord(state,data,Number(b.dataset.index));if(record)modalOpen(record.title,record.body);return true;}
 if(action==='history-replay'){
  const restored=restoreCheckpoint(state,id);if(!restored||!validateState(restored)){toast('이 시점의 저장 기록을 불러오지 못했어요.');return true;}
  guardUnsaved(()=>{if(restored.mode==='custom'&&!useCustomStart())return;stopAuto();state=restored;workingSlotId=null;dirty=true;rememberWorkingCopy();historyYear='all';modal.close();resumeGame();toast('이 시점에서 새로 시작해요. 저장 버튼으로 새 슬롯에 남겨 주세요.');});return true;
 }
 if(['ad-copy-address','ad-copy-message','ad-mail'].includes(action)){
  const form=document.querySelector('#ad-inquiry-form'),status=document.querySelector('#ad-form-status');
  let text=AD_RECIPIENT;
  if(action!=='ad-copy-address'){
   if(!form.reportValidity())return true;const values=Object.fromEntries(new FormData(form));
   if(!values.organization.trim()||!values.message.trim()){status.textContent='기관·회사명과 문의 내용을 입력해 주세요.';return true;}
   const payload=inquiryPayload(values);text=payload.body;
   if(action==='ad-mail'){status.textContent='메일 앱에서 받는 주소와 내용을 확인하고 전송해 주세요.';const link=document.createElement('a');link.href=inquiryMailto(payload);link.click();return true;}
  }
  try{await navigator.clipboard.writeText(text);status.textContent=action==='ad-copy-address'?'받는 주소를 복사했어요.':'문의 내용을 복사했어요.';}catch{const field=document.querySelector('#ad-copy-fallback');field.hidden=false;field.value=text;field.focus();field.select();status.textContent='아래 내용을 선택해 복사해 주세요.';}
  return true;
 }
 if(action==='auto-start'){startAuto();return true;}
 if(action==='auto-pause'){stopAuto();render();refreshAutoDialog();toast('일시정지했어요. 직접 선택해도 돼요.');return true;}
 if(action==='auto-finish'){await skipToEnding();return true;}
 if(action==='plan-option'){const key=PLAN_STEPS[state.initialPlan.step].key;state=togglePlanAnswer(state,key,id,data);save();render();return true;}
 if(action==='plan-select-all'){state=toggleAllPlanAnswers(state,data);save();render();return true;}
 if(action==='plan-random-all'){state=finishInitialPlan(randomizePlanAnswers(state,data,{all:true}),data);save();view='home';modal.close();render();window.scrollTo(0,0);toast('무작위 계획으로 창업을 시작했어요.');return true;}
 if(action==='plan-back'){state=movePlanStep(state,-1);save();render();return true;}
 if(['plan-next','plan-random'].includes(action)){
  if(action==='plan-random')state=randomizePlanAnswers(state,data);
  const finished=state.initialPlan.step===PLAN_STEPS.length-1;
  state=finished?finishInitialPlan(state,data):movePlanStep(state,1);save();view=finished?'home':'plan';render();window.scrollTo(0,0);if(finished&&!state.tutorialSeen){tutorialStep=0;help();}else if(finished)modalOpen('실행 계획이 완성됐어요',roadmapView(state)+'<div class="modal-actions"><button class="primary" data-action="tutorial-start">모아와 플레이 배우기</button></div>');return true;
 }
 if(action==='plan-edit'){const next=startPlanRevision(state);if(next!==state){state=next;save();modal.close();view='plan';render();window.scrollTo(0,0);}return true;}
 if(action==='plan-edit-cancel'){state=cancelPlanRevision(state);save();view='home';render();return true;}
 if(action==='initial-plan'){modalOpen('초기 계획서',planReview(state,data));return true;}
 if(action==='event'){showEvent();return true;}
 if(action==='choose-event'){const next=prepareDecision(state,Number(b.dataset.index),data.story);if(next!==state){state=next;save();render();showEvent();}return true;}
 if(action==='advice-back'){state=reconsiderDecision(state);save();showEvent();return true;}
 if(action==='advice-follow'||action==='advice-self'){const next=resolveDecision(state,action==='advice-self'?'self':id,data);if(next!==state){state=next;save();render();showResult();}return true;}
 if(action==='scene-done'){state=acknowledgeScene(state);save();modal.close();render();return true;}
 if(action==='meet-person'){const raw=requestEncounter(state,id,data);if(raw){state={...state,pending:adaptEvent(raw,state)};save();render();showEvent();}return true;}
 if(action==='person'){const detail=personDetail(state,data,id);if(detail)modalOpen(detail.title,detail.body);return true;}
 if(action==='chart-unit'){revenueUnit=id==='year'?'year':'month';render();document.querySelector('.revenue-card')?.scrollIntoView({block:'start'});return true;}
 if(action==='chart-point'){selectRevenuePoint(b.dataset.chartMonth);return true;}
 if(action==='quests'){showQuests();return true;}
 if(action==='coin-store'){showCoinStore();return true;}
 if(action==='unlock-character'){unlockCharacter(id);showCoinStore();if(view!=='setup')render();return true;}
 if(action==='claim-rewards'){refreshCareer();const result=claimCareerRewards(characterMeta);try{writeCharacterProgress(localStorage,result.meta);characterMeta=result.meta;toast(`보상 수령 · 캐릭터 ${result.characters.length}명 · 이용권 ${result.tickets}장`);}catch{toast('보상을 저장하지 못했어요. 다시 시도해 주세요.');}if(view!=='setup')render();else refreshCharacterSetup();showQuests();return true;}
 if(action==='rankings'){modalOpen('내 경영 평가 순위',rankingsView(readRankings(localStorage),id||evaluateRun(state).group,state.runId));return true;}
 if(action==='wiki-reset'){wikiCategory='all';wikiSearch='';render();document.querySelector('#wiki-search')?.focus({preventScroll:true});return true;}
 if(action==='wiki-category'){wikiCategory=id;render();document.querySelector('#wiki-search')?.focus({preventScroll:true});return true;}
 if(action==='wiki-term'){const detail=termDetail(id);if(detail)modalOpen(detail.title,detail.body);return true;}
 if(action==='lesson-card'){
  const lesson=data.lessons.find(l=>l.id===id);if(!lesson||!state.lessons.includes(id))return true;
  const event=data.events.find(e=>e.card===id);
  modalOpen(lesson.title,`<span class="tag">${esc(lesson.area)} · 배움 카드</span><p class="wiki-definition">${esc(lesson.body)}</p>${readingCards(sceneReadings(event?.id,data.story,id,data))}`);return true;
 }
 return false;
}
// Keep auto mode selected while a tab is hidden, and resume its clock on return.
document.addEventListener('visibilitychange',()=>{if(autoRunning){if(document.hidden)clearTimeout(autoTimer);else scheduleAuto();}});
modal.addEventListener('cancel',e=>{if(modal.dataset.flow==='reader'){e.preventDefault();handleStoryAction('reading-back',{dataset:{}});}});
let backdropDown=false;
modal.addEventListener('pointerdown',e=>{backdropDown=e.target===modal;});
modal.addEventListener('pointerup',e=>{if(backdropDown&&e.target===modal){stopAuto();readerReturn=null;pendingNavigation=null;modal.close();}backdropDown=false;});
document.addEventListener('click',handle);
document.addEventListener('pointerover',e=>{const point=e.target.closest('[data-chart-month]');if(point&&!point.contains(e.relatedTarget))selectRevenuePoint(point.dataset.chartMonth);});
document.addEventListener('focusin',e=>{const point=e.target.closest('[data-chart-month]');if(point)selectRevenuePoint(point.dataset.chartMonth);});
document.addEventListener('keydown',e=>{const point=e.target.closest('[data-chart-month]');if(!point)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();selectRevenuePoint(point.dataset.chartMonth);}if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const points=[...document.querySelectorAll('[data-chart-month]')],index=points.indexOf(point),next=e.key==='Home'?0:e.key==='End'?points.length-1:Math.max(0,Math.min(points.length-1,index+(e.key==='ArrowRight'?1:-1)));points[next]?.focus();}});

document.addEventListener('input',e=>{if(e.target.id==='music-volume'){const music=updateMusic({volume:e.target.value});document.querySelector('#music-volume-value').textContent=music.volume+'%';}if(e.target.id==='wiki-search'){wikiSearch=e.target.value;document.querySelector('#wiki-cards').innerHTML=wikiCards(wikiSearch,wikiCategory);}if(e.target.id==='lesson-search'){lessonSearch=e.target.value;document.querySelector('#lesson-cards').innerHTML=lessonCards();}});
document.addEventListener('change',async e=>{if(e.target.id==='custom-portrait-file'&&state.mode==='custom'){try{state.customPortrait=await readPortraitFile(e.target.files?.[0]);save();modal.close();render();toast('사진을 바꿨어요. 저장 버튼으로 남겨 주세요.');}catch(error){document.querySelector('#custom-photo-status').textContent=error.message;}return;}if(e.target.id==='chart-year'){revenueYear=e.target.value;render();document.querySelector('.revenue-card')?.scrollIntoView({block:'start'});return;}if(e.target.id==='music-enabled')updateMusic({enabled:e.target.checked});if(e.target.id==='investment-limit'&&['strict','flex','open'].includes(e.target.value)){state.investmentLimit=e.target.value;save();render();toast('개인 자금 투입 기준을 바꿨어요.');}if(e.target.id==='lesson-area'){lessonArea=e.target.value;document.querySelector('#lesson-cards').innerHTML=lessonCards();}if(e.target.id==='new-industry')document.querySelector('#industry-desc').textContent=data.industries[e.target.value].description;});
try{const res=await fetch('./content.json?v=14');if(!res.ok)throw new Error('자료를 불러오지 못했어요.');data=await res.json();const worldResponse=await fetch('./world-events.json?v=14');if(!worldResponse.ok)throw new Error('세계 사건을 불러오지 못했어요.');data.worldEvents=await worldResponse.json();const storyResponse=await fetch('./story-content.json?v=14');if(!storyResponse.ok)throw new Error('이야기 자료를 불러오지 못했어요.');data.story=await storyResponse.json();data=extendGameContent(data);slotStore=readSlotStore(localStorage,data);state=activeGame(slotStore);characterMeta=readCharacterProgress(localStorage,[...slotStore.slots,...slotStore.deletedSlots].map(slot=>slot.state));workingSlotId=slotStore.activeId;
 const draft=await readBrowserSave(data).catch(()=>null);
 if(draft){state=draft.state;workingSlotId=slotStore.slots.find(slot=>slot.id===draft.slotId&&slot.state.runId===state.runId)?.id||null;dirty=!!draft.dirty;hasBrowserSave=true;}
 render();}catch(error){app.innerHTML=`<div class="loading"><strong>작업실을 불러오지 못했어요.</strong><p>잠시 후 페이지를 새로고침해 주세요.</p></div>`;console.error(error);}

document.addEventListener('submit',event=>{if(event.target.id==='ad-inquiry-form')event.preventDefault();});

window.addEventListener('beforeunload',event=>{if(browserPending){event.preventDefault();event.returnValue='';}});
