// Usage (from project root): node tools/validate-roadmap.js
const fs=require('fs');global.window={};
eval(fs.readFileSync('www/roadmap-y2.js','utf8'));
let bad=0,months=0;
const mm=(t,g,w,d)=>{months++;
  if(d.length!==30){console.log('BAD days',t,d.length);bad++}
  if(w.length!==5){console.log('BAD weeks',t,w.length);bad++}
  d.forEach((x,i)=>{if(x.length!==3||x.some(s=>!s.trim())){console.log('BAD day',t,i+1);bad++}});
  return {t};};
const yrs=window.ARIA_Y2_BUILD(mm);
console.log('years:',yrs.map(y=>y.year+'('+y.months.length+')').join(' '),'months:',months);
console.log(bad?'FAILED '+bad:'OK');process.exit(bad?1:0);
