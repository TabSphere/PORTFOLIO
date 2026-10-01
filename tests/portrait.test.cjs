const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=readFileSync('assets/js/portrait.js','utf8');
function setup({reduced=false,fine=true}={}) {
 const listeners={},buttonEvents=[],docEvents={},queue=new Map();let id=0,value=50,time=0;
 const buttons=[100,0,50].map((v,i)=>({dataset:{reveal:String(v)},addEventListener:(n,f)=>(buttonEvents[i]??={})[n]=f}));
 const hero={style:{setProperty:(_,v)=>value=parseFloat(v)},querySelector:()=>({addEventListener(){}}),querySelectorAll:()=>buttons,getBoundingClientRect:()=>({left:0,width:1000}),addEventListener:(n,f)=>listeners[n]=f};
 const document={hidden:false,querySelector:()=>hero,addEventListener:(n,f)=>docEvents[n]=f};
 vm.runInNewContext(source,{document,matchMedia:q=>({matches:q.includes('reduced')?reduced:fine}),requestAnimationFrame:f=>{queue.set(++id,f);return id},cancelAnimationFrame:i=>queue.delete(i)});
 return {listeners,buttonEvents,get value(){return value},flush(){for(let i=0;queue.size&&i<200;i++){const entries=[...queue.values()];queue.clear();time+=16.67;entries.forEach(f=>f(time));}assert.equal(queue.size,0)},step(){const entries=[...queue.values()];queue.clear();time+=16.67;entries.forEach(f=>f(time));},document,docEvents};
}
const s=setup();s.listeners.pointermove({clientX:100,pointerType:'mouse'});s.step();assert(s.value>50&&s.value<100);s.flush();assert.equal(s.value,100);s.listeners.pointermove({clientX:900,pointerType:'mouse'});s.flush();assert.equal(s.value,0);s.listeners.pointerleave();s.flush();assert.equal(s.value,50);
const r=setup({reduced:true});r.buttonEvents[0].focus();assert.equal(r.value,100);r.buttonEvents[1].click();assert.equal(r.value,0);r.buttonEvents[2].click();assert.equal(r.value,50);
const t=setup({fine:false});t.listeners.pointermove({clientX:0,pointerType:'touch'});t.flush();assert.equal(t.value,50);t.buttonEvents[0].click();t.flush();assert.equal(t.value,100);t.buttonEvents[1].click();t.flush();assert.equal(t.value,0);
console.log('PASS: damped pointer reveal, both endpoints, exit reset, keyboard, touch and reduced motion.');
