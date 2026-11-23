const surnames=['김','이','박','정','최','한','강','윤','오','서'];
const names=['서연','지우','하늘','도윤','유진','지호','서준','다온','시우','나은','수빈','예린'];
const first=['새봄','온빛','다정','한결','모두','작은','파란','내일','노을','여울','오롯','라온'];
const last=['랩','컴퍼니','스튜디오','웍스','메이커스','그라운드','프로젝트','팩토리'];
const pick=(xs,rng)=>xs[Math.min(xs.length-1,Math.floor(Math.max(0,Number(rng())||0)*xs.length))];
export const randomFounderName=(rng=Math.random)=>pick(surnames,rng)+pick(names,rng);
export const randomCompanyName=(rng=Math.random)=>pick(first,rng)+pick(last,rng);
export const companyNameFor=s=>String(s?.companyName||`${s?.name||'새봄'} 컴퍼니`).slice(0,20);
