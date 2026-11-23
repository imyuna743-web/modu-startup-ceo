// Place names and monthly rent follow the reference game's yi/us tables.
// Rent and the listed space benefits apply once per completed month.
export const LOCATIONS=[
 {id:'home',name:'홈오피스',monthlyCost:0,icon:'home',category:'업무 공간',description:'집에서 시작하는 작은 작업실'},
 {id:'cowork',name:'공유오피스',monthlyCost:80,icon:'people',category:'업무 공간',description:'함께 쓰는 업무 공간'},
 {id:'office',name:'사무실',monthlyCost:250,icon:'shop',category:'업무 공간',description:'우리 팀만의 독립 공간'},
 {id:'suite',name:'별도 사무실',monthlyCost:600,icon:'shop',category:'업무 공간',description:'규모를 넓힌 독립 사업장'},
 {id:'cafe',name:'동네 카페',monthlyCost:350,icon:'coffee',category:'매장·제작 공간',description:'손님을 맞이하는 카페 공간'},
 {id:'kitchen',name:'카페 주방',monthlyCost:450,icon:'coffee',category:'매장·제작 공간',description:'음료와 메뉴를 준비하는 주방'},
 {id:'coslab',name:'화장품 샘플실',monthlyCost:450,icon:'spark',category:'매장·제작 공간',description:'화장품 샘플을 준비하는 공간'},
 {id:'factory',name:'위탁생산 공장',monthlyCost:1200,icon:'box',category:'매장·제작 공간',description:'제품 생산을 위한 작업 공간'},
 {id:'studio',name:'콘텐츠 촬영실',monthlyCost:400,icon:'play',category:'콘텐츠·기술 공간',description:'사진과 영상을 촬영하는 공간'},
 {id:'edit',name:'영상 편집실',monthlyCost:180,icon:'laptop',category:'콘텐츠·기술 공간',description:'영상 작업에 집중하는 편집실'},
 {id:'logistics',name:'물류 창고',monthlyCost:500,icon:'box',category:'매장·제작 공간',description:'상품을 보관하고 출고하는 공간'},
 {id:'market',name:'팝업 매장',monthlyCost:300,icon:'shop',category:'매장·제작 공간',description:'고객에게 제품을 선보이는 매장'},
 {id:'server',name:'서버실',monthlyCost:700,icon:'laptop',category:'콘텐츠·기술 공간',description:'서비스 설비를 운영하는 공간'},
 {id:'live',name:'라이브 방송 스튜디오',monthlyCost:650,icon:'play',category:'콘텐츠·기술 공간',description:'생방송 콘텐츠를 만드는 공간'},
 {id:'meeting',name:'회의실',monthlyCost:null,icon:'people',category:'방문 공간',description:'회의할 때만 빌리는 공간으로 상시 입주할 수 없어요.'},
 {id:'center',name:'창업지원센터',monthlyCost:null,icon:'award',category:'방문 공간',description:'지원·상담을 받는 공공 공간이에요.'},
 {id:'ceo',name:'사장실',monthlyCost:null,icon:'chair',category:'방문 공간',description:'성장 단계에 등장하는 공간으로 별도 임대할 수 없어요.'},
 {id:'pitch',name:'투자 발표장',monthlyCost:null,icon:'megaphone',category:'방문 공간',description:'발표 행사가 열리는 장소예요.'},
 {id:'bank',name:'은행 상담실',monthlyCost:null,icon:'wallet',category:'방문 공간',description:'자금 상담을 받는 장소예요.'},
 {id:'news',name:'위기 대응실',monthlyCost:null,icon:'chat',category:'방문 공간',description:'위기 대응 사건에 등장하는 장소예요.'}
];
export const getLocation=id=>LOCATIONS.find(place=>place.id===id);
export const locationRent=id=>getLocation(id)?.monthlyCost??0;
export const canRentLocation=id=>Number.isFinite(getLocation(id)?.monthlyCost);

export const LOCATION_BONUSES={home:{},cowork:{network:2},office:{management:2},suite:{management:3,network:1},cafe:{sales:2},kitchen:{product:2},coslab:{product:3},factory:{product:4,management:1},studio:{product:2,sales:1},edit:{product:2},logistics:{management:3},market:{sales:3},server:{product:3,management:1},live:{sales:3,network:1}};
export const locationBonus=id=>({...LOCATION_BONUSES[id]});
const skillNames={product:'제품력',sales:'영업력',management:'운영력',network:'네트워크'};
export function locationBenefit(id){const effects=Object.entries(locationBonus(id));return effects.length?'매월 '+effects.map(([k,v])=>`${skillNames[k]} +${v}`).join(' · '):canRentLocation(id)?'추가 효과 없음':'방문 사건에서 선택 결과 적용';}
