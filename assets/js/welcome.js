/* An optional entrance: page remains usable without JavaScript or storage. */
(()=>{
  const welcome=document.querySelector('#welcome');
  if(!welcome||typeof welcome.showModal!=='function')return;
  const key='fot-welcome-v1';
  if(location.hash||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  try{if(sessionStorage.getItem(key))return;}catch{}
  let closing=false,timer;
  const finish=()=>{
    welcome.close();document.body.classList.remove('welcome-open');
  };
  const leave=()=>{
    if(closing)return;closing=true;clearTimeout(timer);
    try{sessionStorage.setItem(key,'seen');}catch{}
    welcome.classList.add('leaving');setTimeout(finish,460);
  };
  welcome.querySelector('button').addEventListener('click',leave);
  welcome.addEventListener('cancel',event=>{event.preventDefault();leave();});
  welcome.addEventListener('close',()=>document.body.classList.remove('welcome-open'));
  try{
    welcome.showModal();document.body.classList.add('welcome-open');
    timer=setTimeout(leave,2000);
  }catch{document.body.classList.remove('welcome-open');}
})();
