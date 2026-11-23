import {brandMark,statIcon} from './stat-view.js';

export const GUIDE_SHOTS=[
 {id:'plan',title:'나의 첫 계획 고르기',text:'고객, 가격, 자금 등 8가지 항목을 정해요. 전체 선택이나 무작위 선택을 쓸 수 있고, 목표는 날짜가 있는 체크리스트로 남아요.'},
 {id:'schedule',title:'4주를 채우고 한 달 보내기',text:'할 일을 누를 때마다 일정에 1주가 들어가요. 4주를 채운 뒤 활동비와 예상 체력을 보고 이번 달 시작하기를 눌러요.'},
 {id:'decision',title:'예상 변화를 보고 직접 결정하기',text:'사건의 선택지를 고르면 주변 인물의 조언을 들을 수 있어요. 찬성·조건부·반대 중 한 의견을 고르면 같은 의견을 낸 사람들의 호감도가 함께 올라요.'},
 {id:'ending',title:'나의 창업 이야기 돌아보기',text:'결말에서는 회사의 성과와 개인 순수익을 따로 확인해요. 처음 목표의 달성 여부와 지난 선택도 함께 돌아볼 수 있어요.'}
];

export function introView(savedCount=0,canResume=false){
 return `<header class="topbar intro-topbar"><button type="button" class="brand brand-home" data-action="intro" aria-label="모두의 창업 첫 화면으로">${brandMark()}<div><strong>모두의 창업</strong><span>CEO로 살아남기</span></div></button></header>
 <main class="intro-shell">
  <section class="intro-opening" aria-labelledby="intro-title">
   <div class="intro-copy"><span class="intro-genre">선택으로 만드는 창업 시뮬레이션</span><h1 id="intro-title">오늘부터 당신이 대표입니다.</h1>
    <p class="intro-story">작은 작업실에서 시작하는 나의 회사.<br>첫 고객을 기다리는 설렘도, 통장 잔고를 보는 걱정도<br class="intro-desktop-break"> 이제 당신의 몫이에요.</p>
    <p class="intro-story">사람을 만나고, 제품을 만들고, 뜻밖의 사건을 마주하세요.<br class="intro-desktop-break"> 어떤 조언을 듣고 어떤 선택을 할지는 당신이 정합니다.</p>
    <div class="intro-goal">${statIcon('runway')}<span>목표는 <strong>5년</strong>. 회사와 나를 함께 지켜 보세요.</span></div>
    <div class="intro-actions"><button class="primary" data-action="new">창업 시작하기</button>${canResume?'<button class="quiet" data-action="resume-current">자동 저장 이어하기</button>':''}<button class="quiet" data-action="slots" aria-label="저장 슬롯">저장 슬롯${savedCount?`<span class="intro-save-count" title="저장된 게임 ${savedCount}개" aria-hidden="true">${savedCount}</span>`:''}</button></div>
   </div>
   <div class="intro-scene" aria-label="작은 작업실에서 멘토와 만나는 첫 장면"><img class="intro-scene-background" src="assets/scene-home-winter.png" alt="겨울 아침의 작은 작업실" fetchpriority="high"><div class="intro-scene-light"></div><img class="intro-mentor" src="assets/npc-mentor.png" alt="멘토 정우진" fetchpriority="high"><div class="intro-dialogue"><span>정우진 <small>멘토</small></span><p>“완벽한 계획이 아니어도 괜찮아요.<br>어떤 회사를 만들고 싶은지부터 적어 볼까요?”</p></div></div>
  </section>
  <section class="intro-guide" id="intro-guide" aria-labelledby="intro-guide-title"><div class="intro-guide-heading"><h2 id="intro-guide-title">이렇게 플레이해요</h2><p>한 달은 4주, 작은 선택이 쌓여 하나의 결말이 돼요.</p></div>
   <div class="intro-steps">${GUIDE_SHOTS.map((shot,index)=>`<article><button class="intro-shot" data-action="guide-photo" data-id="${shot.id}" aria-label="${shot.title} 플레이 화면 크게 보기"><img src="assets/guide-${shot.id}.jpg?v=14" alt="${shot.title} 실제 플레이 화면" loading="lazy"><span>크게 보기 ↗</span></button><div class="intro-step-copy"><h3><span>0${index+1}</span>${shot.title}</h3><p>${shot.text}</p></div></article>`).join('')}</div>
   <div class="intro-tips"><div>${statIcon('cash')}<p><strong>수입은 월말에</strong>제품력 30부터 고객과 매출이 생겨요. 활동비와 고정비도 함께 나가요.</p></div><div>${statIcon('health')}<p><strong>대표도 쉬어야 해요</strong>체력이 바닥나면 도전이 끝나요. 일정에 휴식을 넣어 주세요.</p></div></div>
   <div class="intro-auto-tip"><span>${statIcon('mbti')}빠르게 보고 싶다면</span><p><b>오토모드 · 2배속</b>은 일정과 이벤트 선택까지 자동으로 진행해요. <b>건너뛰고 결과보기</b>로 엔딩까지 한 번에 볼 수도 있어요.</p></div>
  </section>
 </main>`;
}
