// Minimal Tetris with zone bias for Playing Forever approximation
const COLS=10, ROWS=20;
const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const cell=30;
let board=Array.from({length:ROWS},()=>Array(COLS).fill(0));
let score=0, lines=0, mode='auto', paused=false;
const pieces={
I:[[1,1,1,1]],
O:[[1,1],[1,1]],
T:[[0,1,0],[1,1,1]],
S:[[0,1,1],[1,1,0]],
Z:[[1,1,0],[0,1,1]],
J:[[1,0,0],[1,1,1]],
L:[[0,0,1],[1,1,1]]
};
const colors={I:'#00f0f0',O:'#f0f000',T:'#a000f0',S:'#00f000',Z:'#f00000',J:'#0000f0',L:'#f0a000'};
let bag=[], current=null, next=null, hold=null, x=0,y=0,rot=0;
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function refillBag(){bag=shuffle(['I','O','T','S','Z','J','L']);}
function spawn(){if(bag.length===0)refillBag();current=bag.pop();x=3;y=0;rot=0;if(collide()){paused=true;alert('Top out');}}
function getShape(){return pieces[current];}
function collide(px=x,py=y,p=getShape()){for(let r=0;r<p.length;r++)for(let c=0;c<p[r].length;c++)if(p[r][c]&&(py+r>=ROWS||px+c<0||px+c>=COLS||board[py+r][px+c]))return true;return false;}
function merge(){const p=getShape();for(let r=0;r<p.length;r++)for(let c=0;c<p[r].length;c++)if(p[r][c])board[y+r][x+c]=current;}
function clearLines(){let cleared=0;for(let r=ROWS-1;r>=0;r--){if(board[r].every(c=>c)){board.splice(r,1);board.unshift(Array(COLS).fill(0));cleared++;r++;}}lines+=cleared;score+=cleared*100;}
function hardDrop(){while(!collide(x,y+1))y++;merge();clearLines();spawn();}
function zoneBonus(type,col){const left=['S','T','Z'], mid=['I'], right=['L','J','O'];if(left.includes(type)&&col<4)return 50;if(mid.includes(type)&&col>=4&&col<=5)return 50;if(right.includes(type)&&col>5)return 50;return 0;}
function aiMove(){let best=-Infinity,bx=0,br=0;const p=getShape();for(let r=0;r<4;r++){ // simple rot ignore for min
for(let cx=0;cx<COLS;cx++){let cy=0;while(!collide(cx,cy+1,p))cy++;let holes=0,height=0,bump=0; // simple score
for(let c=0;c<COLS;c++){let h=0;for(let rr=0;rr<ROWS;rr++)if(board[rr][c]||(cy+rr<ROWS&&cx===c&&p[rr]&&p[rr][0]))h=ROWS-rr;height+=h;}
const sc=-height + zoneBonus(current,cx)*10;if(sc>best){best=sc;bx=cx;br=r;}}}x=bx;hardDrop();}
function draw(){ctx.fillStyle='#061014';ctx.fillRect(0,0,300,600);for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(board[r][c]){ctx.fillStyle=colors[board[r][c]];ctx.fillRect(c*cell,r*cell,cell-1,cell-1);}if(current){const p=getShape();ctx.fillStyle=colors[current];for(let r=0;r<p.length;r++)for(let c=0;c<p[r].length;c++)if(p[r][c])ctx.fillRect((x+c)*cell,(y+r)*cell,cell-1,cell-1);}}
function loop(){if(!paused&&mode==='auto')aiMove();draw();document.getElementById('lines').textContent=lines;document.getElementById('status').textContent=mode;requestAnimationFrame(loop);}
spawn();loop();
document.getElementById('mode').onclick=()=>mode=mode==='auto'?'manual':'auto';
document.addEventListener('keydown',e=>{if(e.key==='g')mode=mode==='auto'?'manual':'auto';if(mode==='manual'){if(e.key==='ArrowLeft'&&!collide(x-1,y))x--;if(e.key==='ArrowRight'&&!collide(x+1,y))x++;if(e.key==='ArrowDown'&&!collide(x,y+1))y++;if(e.key===' ')hardDrop();}});
