import {standingFile} from './engine.js';
import {getLocation} from './locations.js';
import {SEASONS,sceneAsset,seasonForMonth} from './scenery.js';

const groups={
 rug:{title:'러그',options:{none:'없음',oat:'오트밀',sage:'세이지',denim:'데님'}},
 decor:{title:'가구',options:{none:'없음',plant:'몬스테라',books:'책 트롤리'}},
 side:{title:'가구 위치',options:{left:'왼쪽',right:'오른쪽'}},
 pet:{title:'반려동물',options:{dog:'강아지',cat:'고양이'}}
};
const furnishings=[
 {id:'oat',group:'rug',name:'오트밀 러그',price:8},
 {id:'sage',group:'rug',name:'세이지 러그',price:10},
 {id:'denim',group:'rug',name:'데님 러그',price:12},
 {id:'plant',group:'decor',name:'몬스테라',price:18},
 {id:'books',group:'decor',name:'책 트롤리',price:35}
];
// Previously placed items belong to their owner even in saves predating the store.
function inventory(state){
 return furnishings.filter(item=>state.office?.owned?.includes(item.id)||state.office?.[item.group]===item.id).map(item=>item.id);
}
function purchaseBlock(state,item){
 if(inventory(state).includes(item.id))return '보유 중';
 if(state.ending)return '운영 종료';
 if(state.pending||state.lastScene?.unread)return '사건 진행 중';
 return state.cash<item.price?'현금 부족':'';
}
export function buyFurnishing(state,id){
 const item=furnishings.find(f=>f.id===id);
 if(!item||purchaseBlock(state,item))return state;
 return {...state,cash:state.cash-item.price,office:{...state.office,owned:[...inventory(state),id]},
 journal:[{month:state.month,title:item.name+' 구입',text:'사무실 꾸미기 · '+item.price+'만 원',type:'item'},...state.journal]};
}
export function furnishingShop(state){
 const rack=group=>furnishings.filter(item=>item.group===group).map(item=>{
  const blocked=purchaseBlock(state,item),owned=blocked==='보유 중';
  const art=group==='rug'?`<i class="shop-rug rug-${item.id}"></i>`:`<img src="assets/office/${item.id}.webp" alt="">`;
  return `<article class="furnishing-card"><div class="furnishing-art">${art}</div><h3>${item.name}</h3><p>${item.price}만 원</p>${owned?`<button class="quiet" data-view="office">보유 중 · 꾸미기</button>`:`<button class="primary" data-action="office-buy" data-id="${item.id}" aria-label="${item.name} ${item.price}만 원 ${blocked||'구매'}" ${blocked?'disabled':''}>${blocked||'구매하기'}</button>`}</article>`;
 }).join('');
 return `<div class="furnishing-shop"><header><strong>보유 현금 ${Math.round(state.cash).toLocaleString('ko-KR')}만 원</strong><button class="quiet" data-view="office">내 사무실 꾸미기</button></header>${['rug','decor'].map(key=>`<section><h2>${groups[key].title}</h2><div class="furnishing-rack">${rack(key)}</div></section>`).join('')}</div>`;
}
function choice(state,key){
 const value=state.office?.[key],options=groups[key].options;
 return Object.hasOwn(options,value)?value:Object.keys(options)[0];
}
export function setOfficeChoice(state,key,value){
 if(!Object.hasOwn(groups,key)||!Object.hasOwn(groups[key].options,value)||choice(state,key)===value)return state;
 if(['rug','decor'].includes(key)&&value!=='none'&&!inventory(state).includes(value))return state;
 return {...state,office:{...state.office,owned:inventory(state),[key]:value}};
}
export function officePetFile(state){
 return choice(state,'pet')==='cat'?'office/cat.webp':'npc-pet-v2.webp';
}
function picker(state,key,disabled=false){
 const {title,options}=groups[key],selected=choice(state,key);
 return `<fieldset class="office-picker" ${disabled?'disabled':''}><legend>${title}</legend><div>${Object.entries(options).map(([id,label])=>{
  const pressed=id===selected,locked=['rug','decor'].includes(key)&&id!=='none'&&!inventory(state).includes(id);
  const thumb=['pet','decor'].includes(key)&&id!=='none'?`<img alt="" src="assets/office/${id}.webp">`:key==='rug'&&id!=='none'?`<i aria-hidden="true" class="rug-swatch rug-${id}"></i>`:'';
  return `<button type="button" data-action="office-pick" data-group="${key}" data-id="${id}" aria-pressed="${pressed}" ${locked?'disabled':''}>${thumb}${label}${locked?' · 미보유':''}</button>`;
 }).join('')}</div></fieldset>`;
}
export function officeView(state,esc){
 const rug=choice(state,'rug'),decor=choice(state,'decor'),side=choice(state,'side'),pet=choice(state,'pet');
 const founder=standingFile(state.portrait).replace(/^standing-/,'').replace(/-v2\.webp$/,'.webp');
 const place=getLocation(state.businessPlace)||getLocation('home');
 return `<div class="office-layout"><figure class="office-figure"><div class="office-stage">
 <img class="office-backdrop" src="${sceneAsset(place.id,state.month)}" alt="${place.name} 실내">
 ${rug==='none'?'':`<span aria-hidden="true" class="office-rug rug-${rug}"></span>`}
 ${decor==='none'?'':`<img class="office-decor office-${side}" src="assets/office/${decor}.webp" alt="${groups.decor.options[decor]}">`}
 <span class="office-walker"><img class="office-sprite" src="assets/office/${founder}" alt="${esc(state.name)} 대표"></span>
 ${state.seats?.pet?`<span class="office-walker office-companion"><img class="office-sprite" src="assets/office/${pet}.webp" alt="${groups.pet.options[pet]} 두부"></span>`:''}
 </div><figcaption><strong>${esc(state.companyName||state.name+' 컴퍼니')}</strong><span>${place.name} · ${SEASONS[seasonForMonth(state.month)]}</span></figcaption></figure>
 <section class="office-controls" aria-label="사무실 꾸미기 옵션"><button class="quiet" data-view="furnishings">꾸미기 상점</button>${picker(state,'rug')}${picker(state,'decor')}${picker(state,'side',decor==='none')}${picker(state,'pet')}<p>${state.seats?.pet?'두부가 사무실에서 함께 지내고 있어요.':'두부를 만나면 선택한 모습으로 사무실에 함께해요.'}</p>
 ${!state.seats?.pet?'<button type="button" class="quiet office-meet" data-view="people">인물수첩에서 두부 보기</button>':''}</section></div>`;
}
