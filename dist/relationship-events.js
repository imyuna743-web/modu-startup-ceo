import {EXTRA_RELATIONSHIPS} from './extended-cast.js';
const CONTENT={
 ...EXTRA_RELATIONSHIPS,
 mentor:{good:['선배가 열어 준 소개 자리','꾸준히 이야기를 나눈 멘토가 첫 거래처를 소개하겠다고 한다.','소개 자리에 함께 간다',{customers:3,insight:4,health:-4},'준비한 제품과 질문을 들고 소개 자리에 갔다.'],bad:['차가워진 피드백','멘토는 최근 대화가 일방적인 부탁으로만 느껴졌다고 말한다.','그동안의 조언을 돌아보고 대화한다',{management:3,health:-4},'바로 답을 구하기보다 피드백을 어떻게 반영했는지 함께 짚었다.'],card:'c_alone'},
 investor:{good:['먼저 온 투자자 미팅','꾸준한 공유를 신뢰한 투자자가 다른 투자자와의 만남을 제안한다.','지표와 조건을 정리해 만난다',{network:6,management:3,health:-5},'투자를 약속받은 것은 아니지만 다음 논의를 위한 연결이 생겼다.'],bad:['투자자의 불안한 질문','투자자는 연락이 뜸해져 회사 상황을 믿기 어렵다고 말한다.','현재 숫자와 위험을 투명하게 공유한다',{management:3,health:-5},'좋은 소식만 골라 보내던 보고를 바꾸고 어려운 숫자도 공개했다.'],card:'c_board'},
 cofounder:{good:['같이 풀어낸 병목','신뢰가 쌓인 공동창업자가 대표의 업무 일부를 맡겠다고 한다.','역할과 결정 범위를 정해 나눈다',{management:5,product:3,health:5},'서로 맡을 일과 도움을 청할 기준을 정했다.'],bad:['공동창업자의 빈자리','공동창업자가 결정에서 소외되고 있다고 말한다. 역할을 다시 이야기할 때다.','역할과 의사결정 규칙을 다시 합의한다',{management:3,health:-4},'좋을 때 미뤄 둔 역할 이야기를 다시 꺼냈다.'],card:'c_equity'},
 staff:{good:['팀이 먼저 낸 개선안','팀원이 반복되는 문제를 줄일 개선안을 가져왔다.','업무 시간을 배정해 함께 적용한다',{product:5,management:3,morale:5,health:-3},'현장의 제안을 실제 운영 방식으로 바꾸었다.'],bad:['쌓여 있던 팀의 불만','팀원은 반복되는 야근과 모호한 지시로 지쳤다고 말한다.','일의 우선순위와 업무량을 조정한다',{morale:8,health:-4},'당장 하지 않을 일을 정하고 약속할 수 있는 일정으로 바꿨다.'],card:'c_delegate'},
 friend:{good:['친구가 건넨 연결','친구가 회사 이야기를 기억하고 협업할 만한 사람을 소개한다.','소개를 받고 함께 이야기한다',{network:5,health:6},'회사 밖에서 시작된 대화가 새로운 연결로 이어졌다.'],bad:['계속 미뤄진 약속','친구는 필요할 때만 연락하는 것 같아 서운하다고 말한다.','시간을 정해 만나 이야기를 듣는다',{health:7},'도움을 부탁하지 않는 시간을 함께 보냈다.'],card:'c_alone'},
 family:{good:['가족과 함께 쉬는 날','가족은 요즘의 노력을 알아주며 잠깐 쉬어 갈 시간을 제안한다.','하루는 일을 내려놓고 함께 쉰다',{health:12,cash:-10},'회사의 숫자 밖에서도 응원해 주는 사람이 있음을 느꼈다.'],bad:['가족의 걱정이 커진 날','가족은 생활비와 사업의 경계가 흐려지는 것 같다고 말한다.','개인 자금 한계와 현재 상황을 공유한다',{management:2,health:-3},'얼마까지 감당할 수 있는지 숫자와 일정으로 이야기했다.'],card:'c_family'},
 partner:{good:['함께 지킨 저녁','연인·배우자가 업무를 내려놓을 저녁 시간을 함께 지키자고 한다.','오늘은 약속한 시간에 일을 마친다',{health:12,morale:4},'사업을 이어갈 힘을 회사 밖에서 다시 채웠다.'],bad:['회사보다 멀어진 사이','연인·배우자는 함께하기로 한 시간을 계속 놓쳤다고 말한다.','일정을 비우고 서로의 상황을 듣는다',{health:5},'해결책부터 말하기보다 지금의 부담을 나누었다.'],card:'c_family'},
 customer:{good:['고객이 먼저 전한 추천','제품을 믿는 고객이 주변에 직접 추천하고 싶다고 한다.','사용 사례를 함께 정리한다',{customers:4,sales:5,health:-3},'고객의 실제 사용 경험을 다음 고객에게 전했다.'],bad:['고객의 마지막 문의','중요한 고객이 해결되지 않은 문제 때문에 떠날지 고민하고 있다.','불편을 듣고 개선 일정을 약속한다',{product:3,cash:-30,health:-4},'가능한 해결 범위를 정하고 약속한 내용을 다시 확인했다.'],card:'c_review'}
};
export function relationshipSignal(value){
 return value>=40?{tone:'good',label:'호의적',hint:'도움·협업 사건이 열릴 수 있어요.'}:value<=0?{tone:'risk',label:'관계 주의',hint:'갈등·회복 사건이 열릴 수 있어요.'}:{tone:'neutral',label:'알아가는 중',hint:'40 이상이면 도움, 0 이하이면 갈등 사건이 열려요.'};
}
export function nextRelationshipEvent(state){
 const month=Math.max(0,state.month-1);if(month<2||month-(state.lastRelationshipMonth??-10)<3)return null;
 const active={...state.seats,staff:state.team>0,customer:state.customers>0||state.seats?.customer};
 const choices=Object.keys(CONTENT).filter(id=>active[id]).map(id=>({id,value:state.relations?.[id]??15})).filter(p=>p.value>=40||p.value<=0).sort((a,b)=>Math.max(0,40-b.value,b.value-40)-Math.max(0,40-a.value,a.value-40));
 const person=choices.find(p=>!(state.seenEvents||[]).includes(`relationship_${p.id}_${p.value>=40?'good':'risk'}`));if(!person)return null;
 const good=person.value>=40,tier=good?'good':'risk',item=CONTENT[person.id],entry=good?item.good:item.bad;
 const [title,text,label,fx,out]=entry,rel=delta=>({[person.id]:delta});
 state.lastRelationshipMonth=month;
 return {id:`relationship_${person.id}_${tier}`,title,text,who:person.id,cat:good?'mindset':'people',relationship:{role:person.id,value:person.value,tone:tier},plan:['team','risk'],card:item.card,
 choices:[
  {label,tags:['trust','people','longterm'],fx:{...fx,rel:rel(good?4:15)},out},
  {label:good?'작게 시작할 수 있는 범위로 제안한다':'지금 할 수 있는 약속 하나부터 정한다',tags:['caution','trust'],fx:{health:-2,network:2,rel:rel(good?2:8)},out:good?'감당할 수 있는 범위에서 제안을 함께 이어가기로 했다.':'작은 약속부터 지키며 관계를 회복하기로 했다.'},
  {label:good?'고맙지만 이번에는 정중히 사양한다':'대화를 미루고 지금 일에 집중한다',tags:['focus','speed'],fx:good?{rel:rel(-2)}:{hiddenRisk:4,network:-3,rel:rel(-10)},out:good?'제안에 감사를 전하고 현재 해야 할 일에 집중했다.':'당장의 일정은 지켰지만 상대의 마음은 더 멀어졌다.'}
 ]};
}
