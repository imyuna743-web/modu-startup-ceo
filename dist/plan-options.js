export const PLAN_STEPS=[
 {key:'customer',label:'고객',ask:'누구에게 팔까요?',options:'segments'},
 {key:'value',label:'제공할 가치',ask:'어떤 문제를 해결할까요?',options:'values'},
 {key:'price',label:'가격',ask:'어떤 가격대로 팔까요?',options:{low:'저렴하게',mid:'시세대로',high:'높은 가격에'}},
 {key:'acquire',label:'고객 확보',ask:'어디서 고객을 만날까요?',options:'channels'},
 {key:'runway',label:'자금',ask:'어떤 속도로 키울까요?',options:{lean:'아껴 쓰며 검증',normal:'균형 있게 성장',aggressive:'빠르게 투자·확장'}},
 {key:'team',label:'팀',ask:'누구와 시작할까요?',options:{solo:'혼자',cofounder:'공동창업자와',hire:'직원 1명과'}},
 {key:'risk',label:'위험 대비',ask:'무엇을 먼저 대비할까요?',options:{cash:'현금 부족',concentration:'고객 한 곳에 매출 집중',people:'핵심 인력 이탈',quality:'품질 문제·고객 불만',delivery:'납기·공급 차질',competitor:'가격 경쟁',health:'대표의 건강',outside:'시장·수요 변화'}},
 {key:'limit',label:'투입 한계',ask:'내 돈을 어디까지 넣을까요?',options:{strict:'처음 넣은 돈까지만',flex:'처음 금액의 50%까지 추가'}}
];

// Stable original a–d identifiers keep previously saved answers readable.
const MORE={
 cafe:{segments:['출근길 포장 커피를 사는 직장인','점심 뒤 짧게 쉬려는 회사원','노트북으로 일하는 프리랜서','유모차와 함께 방문하는 보호자','주말 디저트를 찾는 연인','단체 음료가 필요한 근처 사무실'],values:['예약 후 기다림 없이 픽업','오래 머물기 편한 좌석·전원','알레르기·식이 취향에 맞는 메뉴'],channels:['출근 시간 픽업 예약','주변 사무실 단체 주문 제안','지역 행사 시음·체험']},
 saas:{segments:['예약·고객 관리를 맡는 1인 사업자','주문·재고를 정리하는 소규모 쇼핑몰','일정을 공유하는 프로젝트 팀','직원 근태를 관리하는 담당자','매출 보고를 취합하는 지점 관리자','반복 업무를 줄이려는 운영팀'],values:['반복 입력·보고 시간 줄이기','기존 도구와 데이터 연동','팀 권한·협업 기록 관리'],channels:['14일 체험과 도입 상담','실무 템플릿·활용 사례 배포','업종 커뮤니티 데모']},
 cosmetics:{segments:['향에 민감해 무향 제품을 찾는 고객','기초 제품을 처음 고르는 입문자','리필·포장 절약을 선호하는 고객','소용량으로 먼저 시험하는 고객','빠른 화장을 원하는 직장인','여행용 세트를 찾는 고객'],values:['휴대하기 쉬운 소용량 구성','성분·사용 방법을 쉬운 말로 안내','피부 표현별 색상 비교'],channels:['소용량 체험단 모집','공식몰 샘플 동봉·재구매 안내','팝업 체험과 현장 피드백']},
 influencer:{segments:['신제품 사용 영상을 원하는 뷰티 브랜드','방문 후기를 원하는 음식점·카페','사용법 설명이 필요한 생활·IT 브랜드','지역 여행을 소개하려는 숙박·체험 업체','강의 체험을 알리려는 교육 회사','앱 가입·체험을 늘리려는 서비스 팀'],values:['짧은 영상과 긴 영상 함께 제공','시청자 질문에 답하는 실사용 콘텐츠','조회·클릭 결과를 정리한 리포트'],channels:['업종별 브랜드에 협업 제안','크리에이터 매칭 플랫폼 등록','샘플 콘텐츠 공개·문의 연결']},
 ecommerce:{segments:['수납·정리용품을 찾는 자취생','집들이 선물을 고르는 고객','검증된 육아용품을 찾는 보호자','취미 입문 세트를 찾는 고객','사무용품을 함께 주문하는 소규모 팀','정기적으로 소모품을 사는 고객'],values:['용도별 묶음으로 선택 시간 절약','사이즈·호환 정보 자세히 제공','재구매 주기에 맞춘 안내'],channels:['검색 키워드별 상세 페이지','첫 구매 쿠폰·장바구니 안내','분야별 커뮤니티 사용 후기']},
 education:{segments:['포트폴리오가 필요한 신입 지원자','새 도구를 배우는 실무자','팀장 역할을 처음 맡은 직장인','전직·재취업을 준비하는 성인','직원 온보딩을 담당하는 작은 회사','자격시험을 준비하는 학습자'],values:['진단 후 수준별 학습 순서 제공','과제별 피드백과 질문 시간','실무에 바로 쓰는 양식·예제'],channels:['입문 강의 무료 공개','졸업 과제·수강생 사례 소개','팀 단위 체험 수업 제안']},
 local_service:{segments:['입주 청소를 찾는 이사 고객','간단한 수리가 필요한 1인 가구','정기 청소를 맡기려는 맞벌이 가정','매장 설비를 관리하려는 자영업자','부모님 집 관리가 필요한 가족','여러 세대를 관리하는 임대인'],values:['작업 전 견적·범위 확인','작업 사진·완료 내역 공유','정기 방문 일정 관리'],channels:['아파트 입주 커뮤니티 안내','중개사·관리사무소 소개','첫 작업 후 정기 관리 제안']},
 meal_kit:{segments:['평일 저녁 20분 요리를 원하는 직장인','주말 가족 식사를 준비하는 보호자','1인분 식재료를 원하는 자취생','요리를 처음 시작한 신혼부부','채소 중심 메뉴를 찾는 고객','일주일 장보기 시간을 줄이려는 가정'],values:['조리 순서·시간을 쉬운 그림으로 안내','인원수에 맞는 용량 선택','배송일·메뉴를 미리 바꾸는 선택권'],channels:['3일 체험 세트 운영','주간 메뉴 영상·조리 후기','회사·아파트 공동 주문 제안']}
};
const extra=(list,prefix)=>Object.fromEntries((list||[]).map((label,i)=>[`${prefix}${i+1}`,label]));
export function planOptions(step,data,industry){
 if(typeof step.options!=='string')return step.options;
 return {...data?.industries?.[industry]?.[step.options],...extra(MORE[industry]?.[step.options],'detail_')};
}
export function planOptionGroups(step,data,industry){
 const options=planOptions(step,data,industry),entries=Object.entries(options);
 if(typeof step.options!=='string'){
  if(step.key==='risk')return [{label:'사업 운영',entries:entries.filter(([id])=>!['health','outside'].includes(id))},{label:'대표·시장 환경',entries:entries.filter(([id])=>['health','outside'].includes(id))}];
  return [{label:'',entries}];
 }
 return [{label:{customer:'주요 고객군',value:'핵심 가치',acquire:'판매·홍보 경로'}[step.key],entries:entries.filter(([id])=>!id.startsWith('detail_'))},{label:{customer:'상황별 세부 고객',value:'구체적인 경험',acquire:'첫 고객을 만나는 방법'}[step.key],entries:entries.filter(([id])=>id.startsWith('detail_'))}].filter(group=>group.entries.length);
}
export function planAnswerValues(answer){return Array.isArray(answer?.values)?answer.values:answer?.value?[answer.value]:[];}
