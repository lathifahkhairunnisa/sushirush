const sushi=[
{emoji:'🍣',name:'Nigiri Salmon',points:100},
{emoji:'🍙',name:'Onigiri',points:90},
{emoji:'🍤',name:'Ebi Tempura',points:120},
{emoji:'🥢',name:'Sushi Roll',points:110},
{emoji:'🍱',name:'Bento Sushi',points:130},
{emoji:'🦐',name:'Prawn Special',points:140}
];

let score=0,level=1,combo=0,time=60,playing=false,paused=false,target=null,found=JSON.parse(localStorage.getItem('eatstimeFound')||'[]'),best=Number(localStorage.getItem('eatstimeBest')||0),timerInt=null,soundOn=true,correctCount=0;
const $=s=>document.querySelector(s);

function renderCollection(){
  $('#sushiGrid').innerHTML=sushi.map(s=>`<div class="sushi-card ${found.includes(s.name)?'':'locked'}"><div class="emoji">${s.emoji}</div><b>${found.includes(s.name)?s.name:'???'}</b><small>${found.includes(s.name)?'Ditemukan':'Belum ditemukan'}</small></div>`).join('');
  $('#collectionCount').textContent=`${found.length} / ${sushi.length} ditemukan`;
}
function randomTarget(){target=sushi[Math.floor(Math.random()*sushi.length)];$('#targetEmoji').textContent=target.emoji;$('#orderName').textContent=target.name;$('#orderHint').textContent=`Tangkap ${target.name} sebelum waktunya habis.`;renderBoard()}
function renderBoard(){
  let options=[target];
  while(options.length<6){let s=sushi[Math.floor(Math.random()*sushi.length)];if(!options.includes(s))options.push(s)}
  options.sort(()=>Math.random()-.5);
  $('#conveyor').innerHTML=options.map(s=>`<button class="sushi-button" data-name="${s.name}"><span>${s.emoji}</span><small>${s.name}</small></button>`).join('');
}
function update(){
 $('#score').textContent=score;$('#level').textContent=level;$('#combo').textContent='x'+combo;$('#timer').textContent=Math.max(0,time);
 $('#timerFill').style.width=(time/60*100)+'%';
 $('#missionFill').style.width=Math.min(100,correctCount*10)+'%';
 $('#missionText').textContent=`${Math.min(correctCount,10)} / 10 sushi berhasil`;
 $('#missionTitle').textContent=correctCount>=10?'Misi selesai! 🎉':'Tangkap 10 sushi';
}
function startGame(){
 score=0;level=1;combo=0;time=60;correctCount=0;playing=true;paused=false;
 $('#startBtn').textContent='Ulangi Game ↻';$('#pauseBtn').disabled=false;$('#pauseBtn').textContent='⏸ Jeda';
 randomTarget();update();clearInterval(timerInt);
 timerInt=setInterval(()=>{if(!playing||paused)return;time--;if(time<=0)endGame();update()},1000);
 toast('Game dimulai! Cari sushi yang diminta 🍣');
}
function endGame(){
 playing=false;clearInterval(timerInt);$('#pauseBtn').disabled=true;
 if(score>best){best=score;localStorage.setItem('eatstimeBest',best);$('#bestScore').textContent=best}
 $('#finalScore').textContent=score;
 let title=score>=1500?'Sushi Sensei! 🏆':score>=700?'Cepat juga! 🔥':'Nice try, Sushi Rookie!';
 $('#resultTitle').textContent=title;
 $('#resultText').textContent=`Kamu berhasil menangkap ${correctCount} sushi dengan kombo terbaik yang kamu bangun hari ini.`;
 $('#resultIcon').textContent=score>=1500?'🏆':score>=700?'🍣':'🥢';
 $('#resultModal').classList.add('show');
}
function clickSushi(name){
 if(!playing||paused)return;
 if(name===target.name){
   combo++;correctCount++;
   let gain=target.points+combo*10;
   score+=gain;
   time=Math.min(60,time+2);
   if(combo%5===0){level++;time=Math.min(60,time+3);toast(`LEVEL ${level}! Kombo panas 🔥`)} else toast(`Benar! +${gain} poin`);
   if(!found.includes(name)){found.push(name);localStorage.setItem('eatstimeFound',JSON.stringify(found));renderCollection()}
   randomTarget();
 }else{
   combo=0;time=Math.max(0,time-4);toast('Ups! Itu bukan pesanan 😅');
   if(time<=0)endGame(); else renderBoard();
 }
 update();
}
$('#conveyor').addEventListener('click',e=>{let b=e.target.closest('[data-name]');if(b)clickSushi(b.dataset.name)});
$('#startBtn').onclick=startGame;
$('#playAgain').onclick=()=>{$('#resultModal').classList.remove('show');startGame()};
$('#pauseBtn').onclick=()=>{if(!playing)return;paused=!paused;$('#pauseBtn').textContent=paused?'▶ Lanjut':'⏸ Jeda';toast(paused?'Game dijeda':'Game dilanjutkan')};
$('#howBtn').onclick=()=>$('#howModal').classList.add('show');
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).classList.remove('show'));
document.querySelector('.modal-start').onclick=()=>{$('#howModal').classList.remove('show');startGame()};
$('#soundBtn').onclick=()=>{soundOn=!soundOn;$('#soundBtn').textContent=soundOn?'🔊':'🔇';toast(soundOn?'Suara aktif':'Suara nonaktif')};
function toast(m){let t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove('show'),1700)}
$('#bestScore').textContent=best;renderCollection();update();