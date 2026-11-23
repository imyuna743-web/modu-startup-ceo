import {TERM_GUIDES,EXTRA_TERMS} from './glossary-details.js';
export {WIKI_SOURCES,WIKI_PATHS} from './glossary-details.js';
const BASE_TERMS=[
 ['runway','런웨이','자금','runway','지금 가진 현금으로 사업을 유지할 수 있는 기간.','회사 현금 ÷ 매달 순현금 지출. 매달 돈이 남으면 기간을 제한하지 않아요.'],
 ['burn','번레이트','자금','burn rate 현금 소진','한 달 동안 줄어드는 회사 현금의 속도.','월 지출이 200만 원, 수입이 150만 원이면 순소진액은 50만 원이에요.'],
 ['revenue','매출','자금','revenue','상품이나 서비스를 팔아 벌어들인 금액.','활동비와 원가를 빼기 전의 금액이에요.'],
 ['profit','손익','자금','profit loss 영업이익','수입에서 비용을 뺀 결과. 양수면 이익, 음수면 손실.','월말 손익에는 활동비·월 고정비·매출 원가가 반영돼요.'],
 ['cash-flow','현금 흐름','자금','cash flow 캐시플로','실제로 통장에 돈이 들어오고 나가는 움직임.','장부에 매출을 잡았어도 고객이 아직 결제하지 않았다면 현금은 부족할 수 있어요.'],
 ['fixed','고정비','자금','fixed cost 임대료 인건비','매출이 없어도 꾸준히 나가는 비용.','게임에서는 기본 운영비·사업장 임대료·직원 비용·부채 이자 등이 포함돼요.'],
 ['cogs','매출 원가','자금','COGS 원가율','상품이나 서비스를 제공하는 데 직접 드는 비용.','매출이 100만 원이고 원가율이 25%면 원가는 25만 원이에요.'],
 ['bep','손익분기점','자금','BEP break even','수입과 비용이 같아 이익도 손실도 없는 지점.','고객이 늘어도 제공 비용과 고정비를 모두 감당해야 흑자가 나요.'],
 ['guarantee','개인 보증','자금','연대보증','회사 빚을 갚지 못할 때 개인도 책임지기로 하는 약속.','게임에서는 보증대출을 받으면 총부채와 개인 보증 금액이 함께 늘어요.'],
 ['arpu','객단가·ARPU','고객','average revenue per user','고객 한 명이 일정 기간에 내는 평균 매출.','이 게임의 기본 매출은 고객 수·업종별 객단가·제품력의 영향을 받아요.'],
 ['cac','고객 획득 비용','고객','CAC customer acquisition cost','고객 한 명을 새로 확보하는 데 쓴 평균 비용.','고객 확보에 100만 원을 써서 신규 고객 10명을 얻었다면 CAC는 10만 원이에요.'],
 ['ltv','고객 생애 가치','고객','LTV lifetime value','한 고객이 거래를 유지하는 동안 만들어 내는 경제적 가치의 추정치.','처음 결제 금액만 보지 않고 재구매 기간과 비용도 함께 살펴봐요.'],
 ['churn','이탈률','고객','churn rate','기존 고객 중 일정 기간에 떠난 고객의 비율.','100명 중 다음 달 5명이 떠나면 고객 이탈률은 5%예요.'],
 ['retention','리텐션','고객','retention 재구매 유지율','고객이 계속 제품을 쓰거나 다시 구매하는 정도.','신규 고객이 많아도 기존 고객이 계속 떠나면 성장이 느려져요.'],
 ['mrr','월 반복 매출','고객','MRR monthly recurring revenue','구독 등에서 매달 반복적으로 발생하는 매출.','일회성 용역 매출과 구독 갱신 매출은 구분해서 봐요.'],
 ['saas','SaaS','제품','software as a service 서비스형 소프트웨어','소프트웨어를 인터넷 서비스로 제공하고 구독료 등을 받는 방식.','소규모 팀용 SaaS 업종은 업무 도구를 만들고 매달 이용료를 받아요.'],
 ['mvp','최소 기능 제품','제품','MVP minimum viable product','핵심 가설을 고객에게 검증할 수 있는 최소한의 제품.','모든 기능을 만들기 전에 고객이 실제로 필요로 하는지 확인해요.'],
 ['pmf','제품·시장 적합성','제품','PMF product market fit','제품이 특정 시장의 필요를 충족하는 상태.','반복 구매·사용·추천처럼 고객 행동으로 확인해야 해요.'],
 ['pivot','피벗','제품','pivot 사업 전환','검증 결과를 바탕으로 고객·제품·수익 모델 등 사업의 중요한 방향을 바꾸는 것.','단순히 이름을 바꾸기보다 어떤 가정이 틀렸는지부터 짚어요.'],
 ['equity','지분','조직','equity','회사의 소유권을 나눈 몫.','게임에서 공동창업을 선택하면 대표 지분은 70%로 시작해요.'],
 ['dilution','지분 희석','조직','dilution','새 주식 등이 발행되어 기존 주주의 지분율이 낮아지는 것.','투자를 받으면 회사 자금은 늘어도 대표 지분율은 줄 수 있어요.'],
 ['cap-table','지분 구조표','조직','cap table capitalization table','누가 회사의 지분을 얼마나 가지고 있는지 정리한 표.','대표·공동창업자·투자자 등의 소유 비율을 함께 살펴봐요.'],
 ['stock-option','스톡옵션','조직','stock option 주식매수선택권','정해진 조건과 가격으로 회사 주식을 살 수 있는 권리.','받는 즉시 현금이나 확정된 수익이 되는 것은 아니에요.'],
 ['seed','시드 투자','투자','seed investment','사업의 초기 검증과 출발을 돕는 단계의 투자.','투자금은 매출과 구분되며, 지분과 계약 조건이 함께 바뀔 수 있어요.'],
 ['series-a','시리즈 A','투자','series A','초기 검증을 바탕으로 사업을 확장하는 데 쓰이는 후속 투자 단계.','게임에서는 성장 단계와 실적 등의 조건을 만족해야 관련 선택지가 열려요.'],
 ['ma','인수·합병','투자','M&A merger acquisition','다른 회사를 사들이거나 두 회사가 합쳐지는 거래.','게임에는 인수·팀 인수·합병으로 도전을 마치는 결말이 있어요.'],
 ['ipo','기업 공개','투자','IPO initial public offering 상장','회사가 처음으로 주식을 일반 투자자에게 공개적으로 파는 절차.','상장과 관련된 게임 사건은 성장 단계와 실적 조건이 필요해요.']
].map(([id,term,category,aliases,definition,example])=>({id,term,category,aliases,definition,example}));
export const GLOSSARY=[...BASE_TERMS.map(term=>({...term,...TERM_GUIDES[term.id]})),...EXTRA_TERMS];
const normalize=value=>String(value??'').normalize('NFKC').toLocaleLowerCase().replace(/[\s·.\-–]/g,'');
export function searchGlossary(query='',category='all'){
 const q=normalize(query);
 return GLOSSARY.filter(x=>(category==='all'||category===x.category)&&normalize([x.term,x.aliases,x.english,x.definition,x.detail,x.example,x.game].join(' ')).includes(q)).sort((a,b)=>{
  const rank=t=>normalize(t.term)===q?0:normalize(t.aliases).split(',').includes(q)?1:normalize(t.term).includes(q)||normalize(t.english).includes(q)?2:3;
  return q?rank(a)-rank(b):0;
 });
}
