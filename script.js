const a=document.getElementById('a'),b=document.getElementById('b'),
  err=document.getElementById('error'),res=document.getElementById('result');

function message(s){
  if(s>=90)return "Soulmates! Book the venue.";
  if(s>=70)return "A great match. Sparks are flying.";
  if(s>=50)return "Promising. Worth a coffee date.";
  if(s>=30)return "Some work needed, but never say never.";
  return "Opposites attract... maybe.";
}
function colorFor(s){return s>=70?'#e0245e':s>=40?'#f08a4b':'#8d7fc2'}

function fail(text,...fields){
  [a,b].forEach(f=>f.classList.remove('bad'));
  fields.forEach(f=>f.classList.add('bad'));
  err.textContent=text;res.innerHTML='';document.body.className='';
}

function burst(n){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  for(let i=0;i<n;i++){
    const h=document.createElement('span');
    h.className='float';h.textContent='\u2764';
    h.style.left=Math.random()*100+'vw';
    h.style.fontSize=(14+Math.random()*22)+'px';
    h.style.color='#e0245e';
    h.style.animationDelay=(Math.random()*.6)+'s';
    document.body.appendChild(h);
    setTimeout(()=>h.remove(),3000);
  }
}

function generate(){
  const n1=a.value.trim(),n2=b.value.trim();
  err.textContent='';
  if(!n1||!n2){fail('Enter both names.',...(!n1?[a]:[]),...(!n2?[b]:[]));return}
  if(n1.toLowerCase()===n2.toLowerCase()){fail('Enter two different names.',a,b);return}
  [a,b].forEach(f=>f.classList.remove('bad'));
  const s=Math.floor(Math.random()*101);
  const c=colorFor(s);
  res.innerHTML=`<div class="heart pop ${s>=70?'beat':''}">
    <svg viewBox="0 0 24 22" aria-hidden="true"><path fill="${c}" d="M12 21.5 2.6 12C-.4 9 .2 4 4 2.4c2.8-1.1 5.6 0 8 2.9 2.400-2.900 5.200-4 8-2.900 3.800 1.600 4.400 6.600 1.400 9.600z"/></svg>
    <div class="pct">${s}%</div></div>
    <p id="msg"><strong>${esc(n1)}</strong> + <strong>${esc(n2)}</strong><br>${message(s)}</p>`;
  document.body.className=s>=70?'high':s>=40?'mid':'low';
  if(s>=70)burst(s>=90?26:14);
}
function esc(t){const d=document.createElement('div');d.textContent=t;return d.innerHTML}

document.getElementById('go').addEventListener('click',generate);
[a,b].forEach(f=>f.addEventListener('keydown',e=>{if(e.key==='Enter')generate()}));

const hero=document.getElementById('hero'),pic=document.getElementById('userPic'),
  slotText=document.getElementById('slotText'),start=document.getElementById('start'),game=document.getElementById('game'),
  pickErr=document.getElementById('pickErr'),KEY='matchmaker-photo';
function begin(focus){start.hidden=true;game.hidden=false;if(focus)a.focus()}
function showPhoto(url){
  pic.style.backgroundImage='url('+url+')';
  hero.classList.add('has-photo');
  slotText.textContent='Change photo';
}
function handleFile(input){
  const f=input.files[0];
  pickErr.textContent='';
  if(!f)return;
  if(!f.type.startsWith('image/')){pickErr.textContent='Choose an image file.';input.value='';return}
  const fr=new FileReader();
  fr.onerror=()=>{pickErr.textContent='Could not read that photo. Try another one.'};
  fr.onload=()=>{
    const img=new Image();
    img.onerror=()=>{pickErr.textContent='Could not open that photo. Try a JPG or PNG.'};
    img.onload=()=>{
      const s=Math.min(1,900/Math.max(img.width,img.height));
      const c=document.createElement('canvas');
      c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      const url=c.toDataURL('image/jpeg',0.85);
      showPhoto(url);
      try{localStorage.setItem(KEY,url)}catch(e){}
      begin(game.hidden);
      input.value='';
    };
    img.src=fr.result;
  };
  fr.readAsDataURL(f);
}
['photo','photo2'].forEach(id=>{const el=document.getElementById(id);el.addEventListener('change',()=>handleFile(el))});
document.getElementById('skip').addEventListener('click',()=>begin(true));
try{const saved=localStorage.getItem(KEY);if(saved){showPhoto(saved);begin(false)}}catch(e){}
