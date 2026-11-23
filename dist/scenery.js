import {getLocation,locationBenefit} from './locations.js';

export const SEASONS={spring:'봄',summer:'여름',autumn:'가을',winter:'겨울'};
export function seasonForMonth(elapsed){
 const month=((Math.max(1,Math.min(60,Number(elapsed)||1))-1)%12)+1;
 return month>=3&&month<=4?'spring':month>=5&&month<=8?'summer':month>=9&&month<=10?'autumn':'winter';
}
// Every property has its own four seasonal backgrounds.
export const sceneAsset=(placeId,month)=>`assets/scene-${getLocation(placeId)?.id||'home'}-${seasonForMonth(month)}.png`;
export function eventLocation(state){
 const who=state.pending?.who;
 return ['family','partner','friend'].includes(who)?'home':who==='customer'?'cafe':who==='investor'?'office':state.businessPlace||'home';
}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function propertyScene(state,data,id,fixedCost,previewSeason){
 const place=getLocation(id);if(!place)return null;
 const actualSeason=seasonForMonth(state.month),season=Object.hasOwn(SEASONS,previewSeason)?previewSeason:actualSeason,previewMonth={spring:3,summer:5,autumn:9,winter:1}[season],seasonRanges={spring:'3–4월',summer:'5–8월',autumn:'9–10월',winter:'11–2월'},rented=id===(state.businessPlace||'home'),rentable=Number.isFinite(place.monthlyCost);
 const blocked=state.pending||state.lastScene?.unread||state.ending;
 const person=data.story.cast.find(p=>p.id==='mentor');
 return {title:place.name,body:`<div class="season-preview" role="group" aria-label="사계절 미리보기">${Object.entries(SEASONS).map(([key,label])=>`<button class="season-preview-button ${season===key?'selected':''}" data-action="preview-season" data-id="${id}" data-season="${key}" aria-pressed="${season===key}" aria-label="${label} 배경 미리보기"><img src="${sceneAsset(id,{spring:3,summer:5,autumn:9,winter:1}[key])}" alt=""><span>${label}<small>${seasonRanges[key]}</small></span></button>`).join('')}</div><p class="season-preview-note">현재 게임: ${(Math.min(state.month,60)-1)%12+1}월 · ${SEASONS[actualSeason]} · 배경만 미리봐요.</p><div class="property-scene" data-season="${season}"><img class="property-backdrop" src="${sceneAsset(id,previewMonth)}" alt="${SEASONS[season]}의 ${esc(place.name)} 배경"><span class="season-label">${SEASONS[season]} · ${seasonRanges[season]}${season===actualSeason?' · 현재 계절':' 미리보기'}</span><img class="property-guide" src="assets/${person.file}" alt="${esc(person.name)} · ${esc(person.role)}"><div class="property-speech"><span>${esc(person.name)} · ${esc(person.role)}</span><p>${esc(place.description)}</p></div></div><div class="space-benefit-panel"><strong>공간 추가 효과</strong><p>${locationBenefit(id)}</p><small>${rentable?'월말 정산 때 한 번 적용 · 능력치 최대 100':'상시 입주 효과 없음'}</small></div>${rentable?`<div class="property-costs"><div><span>월 임대료</span><strong>${place.monthlyCost.toLocaleString()}<small>만 원</small></strong></div><div><span>입주 후 월 고정비</span><strong>${fixedCost.toLocaleString()}<small>만 원</small></strong></div></div><p class="property-cost-note">고정비에 임대료 포함 · 월말 한 번 차감</p><div class="modal-actions"><button class="quiet" data-action="close">돌아가기</button><button class="primary" data-action="move-place" data-id="${id}" ${rented||blocked?'disabled':''}>${rented?'입주 중':blocked?'이야기를 마친 뒤 변경':'이곳으로 변경'}</button></div>`:'<div class="visit-description">이야기 속에서 방문하는 장소예요. 상시 입주할 수 없어요.</div><div class="modal-actions"><button class="quiet" data-action="close">돌아가기</button></div>'}`};
}
