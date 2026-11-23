import {portraitSource} from './custom-portrait.js';
import {standingFile} from './engine.js';
import {level,costs,clamp,getPortrait} from './engine.js';
import {PLAN_STEPS,planAnswerLabel,planAnswerValues,planEffects} from './startup-plan.js';
import {sceneAsset,seasonForMonth,SEASONS} from './scenery.js';
import {getLocation} from './locations.js';
import {relationshipLabel} from './story-engine.js';

export const ENDINGS={
 growth:{keyword:'성장',title:'수익을 내는 회사로 성장했어요',body:'60개월의 선택 끝에 흑자와 운영 자금을 남겼어요. 이제 회사가 성장한 만큼 나의 삶도 함께 돌아볼 시간이에요.',tone:'green'},
 survive:{keyword:'생존',title:'5년의 시간을 지켜냈어요',body:'회사를 이어 온 것만으로도 긴 기록이 남았어요. 다음에는 무엇을 유지하고, 무엇을 바꿀지 살펴보세요.',tone:'blue'},
 burnout:{keyword:'번아웃',title:'회사는 잠시 멈춤, 회복이 먼저',body:'체력이 바닥나 이번 도전을 멈췄어요. 다음 계획에는 대표가 쉬는 시간도 함께 넣어 주세요.',tone:'amber'},
 bankrupt:{keyword:'폐업',title:'자금 부족으로 사업을 정리했어요',body:'이번 회사는 여기서 마무리해요. 남은 돈과 책임, 그리고 다음 도전으로 가져갈 배움을 정리해 보세요.',tone:'red'},
 close:{keyword:'자진 폐업',title:'스스로 마침표를 찍었어요',body:'계속하는 것만큼 멈추는 것도 결정이에요. 처음의 기대와 실제 경험을 나란히 놓고 다음 출발을 준비해 보세요.',tone:'amber'},
 ma:{keyword:'인수합병',title:'회사에 새로운 주인이 생겼어요',body:'함께 만든 회사가 새로운 조직으로 이어져요. 팀과 고객, 대표에게 어떤 변화가 남았는지 돌아보세요.',tone:'purple'},
 ma_talent:{keyword:'인재 인수',title:'우리 팀의 다음 장이 열렸어요',body:'팀의 역량을 인정받아 새 조직으로 합류했어요. 사람과 경험이 이번 도전의 중요한 결과로 남았어요.',tone:'purple'},
 ma_merge:{keyword:'합병',title:'두 회사가 함께 가기로 했어요',body:'혼자 만들던 미래를 다른 팀과 함께 이어가요. 지분과 역할이 달라진 지금, 처음 계획을 다시 읽어 보세요.',tone:'purple'},
 ipo:{keyword:'상장',title:'공개 시장의 문을 열었어요',body:'회사에 큰 이정표가 생겼어요. 다음 성장에 앞서 숫자와 사람, 대표의 삶에 남은 결과를 확인해 보세요.',tone:'green'}
};
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const amount=value=>Math.round(value).toLocaleString('ko-KR');
const sum=(rows,key)=>rows.reduce((total,row)=>total+(finite(row[key])?row[key]:0),0);
const hasOriginalPlan=s=>!s.legacyConditions&&!!s.initialPlan&&!s.initialPlan.unrecorded&&((s.journal||[]).some(row=>row.type==='plan')||Object.keys(s.initialPlan.answers||{}).length>0);
export const money=value=>finite(value)?`${amount(value)}만 원`:'기록 없음';
export const signedMoney=value=>finite(value)?`${value>0?'+':''}${money(value)}`:'계산할 기록 없음';

// This is a cash-settlement scenario, never an assertion of a real sale or payout.
// Family borrowing and guarantees are already contained in corporate debt.
export function endingFinances(s){
 const known=!s.legacyConditions&&['reserve','debt','familyDebt','guarantee','invested','initialInvestment','equity'].every(key=>finite(s[key]));
 if(!known)return {known:false,cash:s.cash,reason:'이 저장 파일에는 개인 자금·부채의 시작 기록이 없어 개인 손익을 계산하지 않았어요.'};
 const debt=Math.max(0,s.debt),cash=Math.max(0,s.cash),equity=clamp(s.equity)/100;
 const companyNet=s.cash-debt,distributable=Math.max(0,cash-debt),recovery=Math.round(distributable*equity);
 const coveredDebt=Math.min(debt,Math.max(0,s.familyDebt)+Math.max(0,s.guarantee));
 const personalBurden=Math.min(Math.max(0,debt-cash),coveredDebt);
 const personalPL=Math.round(recovery-s.invested-personalBurden),wealth=Math.round(s.reserve+recovery-personalBurden);
 const initialWealth=finite(s.initialFinances?.reserve)?s.initialFinances.reserve+s.initialInvestment:null;
 return {known:true,cash:s.cash,debt,companyNet,distributable,recovery,personalBurden,personalPL,wealth,initialWealth,
  reserve:s.reserve,invested:s.invested,initialInvestment:s.initialInvestment,additional:Math.max(0,s.invested-s.initialInvestment),
  familyDebt:s.familyDebt,guarantee:s.guarantee,equity:s.equity,coveredDebt};
}

export function endingReadings(s,story){
 const alias={growth:'gem',close:'retry',ma_talent:'ma',ma_merge:'ma'};
 const primary=story?.letterByEnding?.[alias[s.ending]||s.ending]||[];
 // Keep an actual morning letter alongside the original FAQ recommendation.
 const extra=['ma','ma_talent','ma_merge','ipo'].includes(s.ending)?['l23']:[];
 const reasons={
  growth:'회사를 키운 다음, 성과를 바라보는 기준을 돌아볼 때 읽어 보세요.',survive:'회사를 이어 온 선택과 다음 목표를 돌아볼 때 읽어 보세요.',
  burnout:'대표의 상태와 주변 사람에게 미치는 영향을 돌아볼 때 읽어 보세요.',
  bankrupt:'사업 정리의 부담을 살피고 다음 출발을 준비할 때 읽어 보세요.',close:'정리 이후의 책임과 재도전을 준비할 때 읽어 보세요.',
  ma:'인수 이후의 조건과 대표의 책임을 돌아볼 때 읽어 보세요.',ma_talent:'팀의 합류 조건과 대표의 역할을 돌아볼 때 읽어 보세요.',ma_merge:'합병 이후 역할과 책임을 점검할 때 읽어 보세요.',ipo:'상장 이후의 책임과 달라지는 의사결정을 돌아볼 때 읽어 보세요.'
 };
 return [...new Set([...primary,...extra])].map(id=>({id,...story?.letterRefs?.[id]}))
  .filter(ref=>ref.title&&/^https:\/\/(www\.)?(letter4ceo\.com|youtube\.com)\//.test(ref.url||''))
  .sort((a,b)=>Number(b.kind==='letter')-Number(a.kind==='letter')).slice(0,3)
  .map(ref=>({...ref,reason:reasons[s.ending]||'이번 도전을 돌아보며 읽어 보세요.'}));
}

function actionRecord(s){
 const rows=(s.history||[]).filter(row=>Array.isArray(row.actions));
 const counts={};rows.forEach(row=>row.actions.forEach(id=>counts[id]=(counts[id]||0)+1));
 return {months:rows.length,counts};
}
export function planComparisons(s,data){
 s={...s,initialPlan:s.planRevisions?.[0]?.plan||s.initialPlan};
 const actions=actionRecord(s),b=s.initialPlan?.baseline,fx=planEffects(s.initialPlan?.answers||{});
 const selectedLimit=fx.limit==='strict'?s.initialInvestment:fx.limit==='flex'?Math.floor(s.initialInvestment*1.5):null;
 const actual={
  customer:[`최종 고객 ${amount(s.customers)}명`,'고객군별 매출은 따로 집계하지 않아요.'],
  value:[`제품력 ${s.skills.product}/100 · 시장 이해 ${s.skills.insight}/100`,'선택한 가치의 실현 여부는 직접 확인해 주세요.'],
  price:[`가격 계수 ${fx.price===null?'기본':`×${Number(fx.price.toFixed(3))}`} → ×${Number(Math.max(.1,1+(s.arpuMod||0)).toFixed(3))}`,'기본 객단가에 적용되는 계수예요. 제품력 효과는 별도예요.'],
  acquire:[actions.months?`영업 ${actions.counts.sales||0}주 · 고객 만나기 ${actions.counts.research||0}주`:`최종 고객 ${amount(s.customers)}명`,actions.months?`행동 기록이 있는 ${actions.months}개월 기준 · 채널별 성과는 미집계`:'이전 저장 파일에는 주별 행동·채널별 실적이 없어요.'],
  runway:[`${finite(b?.fixed)?`월 고정비 ${money(b.fixed)} → `:'최종 월 고정비 '}${money(costs(s,data))}`,`누적 월간 손익 ${signedMoney(sum(s.history||[],'profit'))}`],
  team:[`직원 ${s.team||0}명 · 대표 지분 ${s.equity??100}%`,`${s.seats?.cofounder?'공동창업자 합류 기록 있음':'현재 공동창업자 없음'}${finite(b?.team)?` · 시작 직원 ${b.team}명`:''}`],
  risk:[`체력 ${s.health}/100 · 누적 위험 ${s.hiddenRisk??0}/100`,'걱정했던 위험과 실제 사건은 성장 기록에서 함께 확인할 수 있어요.'],
  limit:[s.legacyConditions?'개인 투입금 기록 없음':`개인 누적 투입 ${money(s.invested)}`,selectedLimit===null?'처음 계획에서 정한 투입 한계 없음':`처음 정한 한도 ${money(selectedLimit)}${s.invested>selectedLimit?' · 실제 투입이 한도를 넘었어요.':' · 실제 투입은 한도 이내예요.'}`]
 };
 return PLAN_STEPS.map(step=>({key:step.key,label:step.label,original:hasOriginalPlan(s)?planAnswerLabel(s,step,data):'원본 기록 없음',actual:actual[step.key][0],note:actual[step.key][1]}));
}

export function planGaps(s,data){
 s={...s,initialPlan:s.planRevisions?.[0]?.plan||s.initialPlan};
 if(!hasOriginalPlan(s))return [
  {title:'고객 가설의 원본을 확인해 주세요',evidence:'이전 저장 파일에는 초기 계획서 원본이 없어요. 계획의 미작성과 실패를 구분할 수 없어요.',next:'다음 계획에는 고객과 제공할 가치를 기록해 비교할 기준을 남겨 보세요.',kind:'원본 기록 없음'},
  {title:'자금의 시작점과 한도를 남겨 주세요',evidence:'처음 계획한 자금 사용 방식과 투입 한계를 확인할 수 없어요.',next:'다음 계획에는 개인 투입 상한과 현금이 부족할 때의 선택을 적어 보세요.',kind:'원본 기록 없음'},
  {title:'건강·관계의 대응 기준을 확인해 주세요',evidence:`마지막 체력은 ${s.health}/100이에요. 처음의 위험 대비와는 비교할 기록이 없어요.`,next:'다음 계획에는 쉬어야 할 시점과 도움을 청할 사람을 함께 적어 보세요.',kind:'원본 기록 없음'}
 ];
 const answers=s.initialPlan?.answers||{},values=key=>planAnswerValues(answers[key]);
 const written=key=>planAnswerLabel(s,PLAN_STEPS.find(step=>step.key===key),data)!=='미작성';
 const gaps=[];
 if(!written('customer')||!written('value'))gaps.push({title:!written('customer')&&!written('value')?'고객과 가치 가설이 비어 있어요':!written('customer')?'고객 가설이 비어 있어요':'제공할 가치 가설이 비어 있어요',evidence:`${[!written('customer')?'고객':'',!written('value')?'제공할 가치':''].filter(Boolean).join(' · ')} 항목을 건너뛰었어요. 최종 고객은 ${amount(s.customers)}명이에요.`,next:'다음 계획에는 가장 먼저 만날 고객과 해결할 문제를 한 줄씩 적어 보세요.',kind:'미작성'});
 else gaps.push({title:'고객 가설의 검증 기준을 점검하세요',evidence:`처음 고객: ${planAnswerLabel(s,PLAN_STEPS[0],data)}. 실제 기록은 전체 고객 ${amount(s.customers)}명까지 있어요. 고객군·가치별 달성 여부는 자동 판정하지 않아요.`,next:'실행 계획의 고객 목표와 실제 고객 반응을 함께 비교해 보세요.',kind:'검토 필요'});
 const fx=planEffects(answers),cap=fx.limit==='strict'?s.initialInvestment:fx.limit==='flex'?Math.floor(s.initialInvestment*1.5):null;
 if(!written('limit'))gaps.push({title:'개인 자금의 멈춤선을 정하지 않았어요',evidence:`투입 한계를 건너뛰었어요.${!s.legacyConditions?` 실제로는 ${money(s.invested)}을 투입했어요.`:''}`,next:'다음 계획에는 추가 투입의 상한과 사업을 멈출 조건을 정해 보세요.',kind:'미작성'});
 else if(cap!==null&&!s.legacyConditions&&s.invested>cap)gaps.push({title:'처음 정한 투입 한계와 실행이 달라요',evidence:`처음 한도 ${money(cap)}보다 ${money(s.invested-cap)}을 더 투입했어요.`,next:'한도를 바꾼 이유와 추가 자금의 회수 조건을 다음 계획에 남겨 보세요.',kind:'계획과 차이'});
 else gaps.push({title:'자금 계획에 재검토 시점을 더하세요',evidence:`적자를 기록한 달은 ${(s.history||[]).filter(row=>row.profit<0).length}개월, 최종 월 고정비는 ${money(costs(s,data))}이에요.`,next:'남은 현금이 몇 개월치 비용 아래로 내려가면 계획을 고칠지 정해 보세요. 실행 계획의 점검 기준과 함께 비교해 보세요.',kind:'검토 필요'});
 if(s.health<30&&!values('risk').includes('health')&&!values('risk').includes('other'))gaps.push({title:'건강 위험을 계획에 넣지 않았어요',evidence:`위험 대비에서 건강을 선택하지 않았고, 마지막 체력은 ${s.health}/100이에요.`,next:'주간 휴식과 일을 줄일 체력 기준을 계획에 함께 넣어 보세요.',kind:'대비 부족'});
 else if(!written('risk'))gaps.push({title:'위험이 생겼을 때의 대응이 비어 있어요',evidence:`위험 대비를 건너뛰었어요. 최종 누적 위험은 ${s.hiddenRisk??0}/100, 체력은 ${s.health}/100이에요.`,next:'현금·건강·관계 중 한 가지를 골라 위험 신호와 바로 할 행동을 적어 보세요.',kind:'미작성'});
 else gaps.push({title:'위험 대비를 실행 기준으로 구체화하세요',evidence:`처음 적은 위험: ${planAnswerLabel(s,PLAN_STEPS.find(step=>step.key==='risk'),data)}. 최종 체력 ${s.health}/100, 누적 위험 ${s.hiddenRisk??0}/100이에요.`,next:'걱정을 적는 데서 한 걸음 더 나아가, 누가 언제 무엇을 할지 점검해 보세요. 실행 계획에 있는 점검 기준과 함께 비교해 주세요.',kind:'검토 필요'});
 return gaps;
}

export function buildEndingReport(s,data){
 const ending=ENDINGS[s.ending]||{keyword:'도전 종료',title:'이번 도전을 돌아보세요',body:'처음 계획과 마지막 기록을 비교해 보세요.',tone:'blue'};
 const history=s.history||[],months=Math.max(0,Math.min(60,s.month-1));
 const baseline=s.legacyConditions?null:s.initialPlan?.baseline;
 const initialHealth=s.legacyConditions?null:baseline?.health??s.initialStats?.health;
 const relations=(data.story?.cast||[]).filter(p=>s.metPeople?.includes(p.id)||s.seats?.[p.id]||['family','friend'].includes(p.id))
  .filter(p=>finite(s.relations?.[p.id])).map(p=>({id:p.id,name:p.name,role:p.role,file:p.file,value:s.relations[p.id],label:relationshipLabel(s.relations[p.id]),delta:finite(baseline?.relations?.[p.id])?s.relations[p.id]-baseline.relations[p.id]:null}));
 const place=getLocation(s.businessPlace)||getLocation('home'),sceneMonth=Math.max(1,months),finances=endingFinances(s);
 return {ending,months,level:level(s),finances,comparisons:planComparisons(s,data),gaps:planGaps(s,data),readings:endingReadings(s,data.story),relations,
  health:{initial:initialHealth??null,final:s.health,min:Math.min(s.health,...history.map(row=>row.health).filter(finite)),label:s.health>=70?'여유 있음':s.health>=30?'회복 필요':'휴식 우선'},
  reputation:{value:s.skills.network,initial:s.legacyConditions?null:s.initialStats?.skills?.network??null,label:s.skills.network>=70?'넓어진 연결':s.skills.network>=35?'쌓여 가는 연결':'관계 쌓기가 필요'},
  metrics:{revenue:sum(history,'revenue'),profit:sum(history,'profit'),expense:sum(history,'expense'),lastRevenue:s.revenue,lastProfit:s.profit,customers:s.customers,team:s.team||0,equity:s.equity??100,lessons:s.lessons?.length||0,decisions:s.adviceHistory?.length||0},
  share:{ending:s.ending,name:s.name,industry:data.industries[s.industry]?.label||s.industry,keyword:ending.keyword,months,level:level(s),customers:s.customers,cash:s.cash,
   portrait:portraitSource(s,`assets/${getPortrait(s.portrait).file}`),standing:portraitSource(s,`assets/${standingFile(s.portrait)}`),background:`assets/ending-${Object.hasOwn(ENDINGS,s.ending)?s.ending:'survive'}.webp`,place:place.name,season:SEASONS[seasonForMonth(sceneMonth)]}};
}
