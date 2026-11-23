const fs=require('fs'),vm=require('vm');const source=fs.readFileSync('dist/game.html','utf8');
function literal(name){const m=new RegExp('\\b'+name+'=').exec(source);if(!m)throw name;let start=m.index+m[0].length,i=start,level=0,quote=null,esc=false;
for(;i<source.length;i++){const c=source[i];if(quote){if(esc)esc=false;else if(c==='\\')esc=true;else if(c===quote)quote=null;continue}if('"\'`'.includes(c)){quote=c;continue}if(c==='['||c==='{')level++;if(c===']'||c==='}')if(--level===0){i++;break}}
return vm.runInNewContext('('+source.slice(start,i)+')',Object.create(null),{timeout:1000,contextCodeGeneration:{strings:false,wasm:false}})}
function jsonTemplate(name){let start=source.indexOf(name+'=JSON.parse(`');if(start<0)throw name;start+=name.length+13;let end=start;while(end<source.length){if(source[end]==='`'&&source[end-1]!=='\\')break;end++}return vm.runInNewContext('JSON.parse(`'+source.slice(start,end)+'`)',Object.create(null),{timeout:1000,contextCodeGeneration:{strings:false,wasm:false}})}
const data={industries:literal('L9'),lessons:literal('M9'),endings:literal('q9'),events:jsonTemplate('E9')};
fs.writeFileSync('dist/content.json',JSON.stringify(data,null,2));console.log(Object.keys(data.industries));console.log('Lessons',data.lessons.length,'Events',data.events.length);
