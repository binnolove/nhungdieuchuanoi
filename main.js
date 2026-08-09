const app=document.querySelector("#app"), trans=document.querySelector("#transition");
const questions=[
"Nếu hôm nay phải chọn một từ cho mình, bạn sẽ chọn từ nào?",
"Điều gì đang chiếm nhiều chỗ nhất trong đầu bạn?",
"Khi có chuyện buồn, bạn thường làm gì?",
"Điều bạn mong người khác hiểu về mình nhất là gì?",
"Bạn có thường tự trách mình về những chuyện đã xảy ra không?",
"Điều gì khiến bạn khó nói ra cảm xúc nhất?",
"Gần đây có điều gì bạn đang cố tỏ ra ổn dù thực ra không?",
"Khi mọi thứ trở nên quá nhiều, bạn muốn điều gì nhất?",
"Có điều gì bạn đang tiếc nuối không?",
"Nếu không sợ bị phán xét, bạn sẽ nói gì?",
"Bạn cảm thấy mình được lắng nghe đủ chưa?",
"Điều bạn cần nhất lúc này là gì?",
"Nếu gặp người đang trải qua chuyện giống mình, bạn sẽ nói gì với họ?",
"Nếu có thể thay đổi một điều, bạn muốn thay đổi gì?",
"Nếu có một người thật sự lắng nghe bạn, bạn muốn họ biết điều gì?"
];
const answers=[
["Bình yên","Mệt","Hy vọng","Khác"],["Một người","Công việc/học tập","Một chuyện cũ","Chính mình"],
["Ở một mình","Tìm người nói chuyện","Nghe nhạc","Mình không biết"],["Rằng mình đang cố gắng","Rằng mình cần được hiểu","Rằng mình không ổn","Khó nói thành lời"],
["Có","Thỉnh thoảng","Hiếm khi","Không"],["Sợ bị hiểu sai","Không biết bắt đầu từ đâu","Sợ làm phiền","Khó gọi tên cảm xúc"],
["Có","Một chút","Không","Mình không chắc"],["Một khoảng nghỉ","Một người lắng nghe","Được yên tĩnh","Một điều gì đó thay đổi"],
["Có","Một người","Một cơ hội","Không biết"],["Một điều thật lòng","Một lời xin lỗi","Một lời cảm ơn","Mình chưa biết"],
["Có","Chưa đủ","Mình không chắc","Không"],["Được lắng nghe","Nghỉ ngơi","Một câu trả lời","Một khởi đầu mới"],
["Mình sẽ bảo họ cứ từ từ","Bạn không một mình","Hãy nói ra khi sẵn sàng","Mình chưa biết"],
["Một điều trong quá khứ","Một lựa chọn","Cách mình đối xử với bản thân","Không gì cả"],
["Điều mình đang mang theo","Điều mình cần","Rằng mình đã cố gắng","Mình chưa biết"]
];
let q=0, mail={recipient:"",text:""}, self={yesterday:"",tomorrow:""}, reply="";
function go(fn){trans.style.opacity=1;setTimeout(()=>{fn();trans.style.opacity=0},280)}
const bgAudio=new Audio("audio/web-bg.mp3"); bgAudio.loop=true; bgAudio.volume=.22;
const rainAudio=new Audio("audio/rain.mp3"); rainAudio.loop=true; rainAudio.volume=.55;
const nightAudio=new Audio("audio/night.mp3"); nightAudio.loop=true; nightAudio.volume=.45;
let audioMode="off";
function stopRoomAudio(){[rainAudio,nightAudio].forEach(a=>{a.pause();a.currentTime=0})}
function startBackground(){stopRoomAudio();if(audioMode==="on")bgAudio.play().catch(()=>{})}
function playRoomSound(kind){if(audioMode!=="on")return;bgAudio.pause();bgAudio.currentTime=0;stopRoomAudio();(kind==="rain"?rainAudio:nightAudio).play().catch(()=>{})}
function shell(content){stopRoomAudio();if(audioMode==="on")bgAudio.play().catch(()=>{});app.innerHTML=`<section class="scene"><div class="inner">${content}</div></section>`}
function home(){shell(`<div class="eyebrow">MỘT KHÔNG GIAN RIÊNG TƯ</div><h1 class="title">CÓ NHỮNG ĐIỀU<br><span>KHÔNG BIẾT NÓI VỚI AI.</span></h1><p class="sub">Chào mừng bạn đến một nơi không cần phải tỏ ra ổn.</p><div class="room">
<div class="object" data-room="letter"><div class="objicon">🎙</div><b>LÁ THƯ CHƯA GỬI</b><small>microphone</small></div>
<div class="object" data-room="tell"><div class="objicon">◉</div><b>NẾU BẠN MUỐN KỂ</b><small>radio</small></div>
<div class="object" data-room="self"><div class="objicon">◯</div><b>GỬI CHO CHÍNH MÌNH</b><small>gương</small></div>
<div class="object" data-room="quiet"><div class="objicon">☾</div><b>KHÔNG MUỐN NÓI</b><small>cửa sổ</small></div>
<div class="object" data-room="void"><div class="objicon">✉</div><b>GỬI VÀO HƯ KHÔNG</b><small>hòm thư</small></div></div></div>`);
document.querySelectorAll("[data-room]").forEach(x=>x.onclick=()=>go(()=>rooms[x.dataset.room]()));
}
function nav(){return `<button class="back" onclick="go(home)">← CĂN PHÒNG</button>`}
function letter(){shell(`<div class="panel">${nav()}<div class="eyebrow">PHÒNG 01</div><h2>LÁ THƯ CHƯA GỬI</h2><p>Có một điều bạn muốn nói với ai đó?</p><div class="choices">${["Một người bạn","Gia đình","Người mình nhớ","Chính mình"].map(x=>`<button class="choice" onclick="pickRecipient(this,'${x}')">${x}</button>`).join("")}</div><div id="letterbox"></div></div>`)}
function pickRecipient(el,x){
  document.querySelectorAll(".choice").forEach(b=>b.classList.remove("active"));
  el.classList.add("active");
  mail.recipient=x;
  document.querySelector("#letterbox").innerHTML=`<div class="paper"><b>Gửi cho ${escapeHtml(x)}</b><textarea id="mailtext" placeholder="Viết điều bạn chưa từng nói..."></textarea><button class="primary" onclick="foldLetter()">GẤP THƯ</button></div>`;
}
function foldLetter(){
  mail.text=document.querySelector("#mailtext")?.value.trim()||"";
  if(!mail.text){alert("Hãy viết điều bạn muốn nói trước khi gấp thư.");return}
  document.querySelector("#letterbox").innerHTML=`<div class="letter"><h3>Đã nói ra rồi.</h3><p>Không phải mọi điều đều cần một câu trả lời.</p><button class="primary" onclick="go(home)">VỀ CĂN PHÒNG</button></div>`;
}
function tell(){shell(`<div class="panel">${nav()}<div class="eyebrow">● REC</div><h2>NẾU BẠN MUỐN KỂ</h2><p>15 câu hỏi.<br>Không có đáp án đúng.<br>Bạn có quyền bỏ qua bất cứ câu nào.</p><button class="primary" onclick="q=0;question()">BẮT ĐẦU</button></div>`)}
function question(){const opts=answers[q];shell(`<div class="panel">${nav()}<div class="qnum">${String(q+1).padStart(2,"0")} / 15</div><div class="progress"><i style="width:${(q+1)/15*100}%"></i></div><div class="question">${questions[q]}</div><div class="answergrid">${opts.map(x=>`<button class="choice" onclick="nextQ('${x.replaceAll("'","&#39;")}')">${x}</button>`).join("")}<button class="choice" onclick="nextQ('skip')">Mình không muốn trả lời.</button></div></div>`)}
function nextQ(){if(q<14){q++;go(question)}else go(result)}
function result(){shell(`<div class="panel">${nav()}<div class="eyebrow">● REC STOP</div><h2>Mình đã nghe bạn.</h2><div class="result"><h3>ĐIỀU CÓ VẺ BẠN ĐANG MANG</h3><p>Một vài điều đang cần được bạn nhìn lại thật nhẹ nhàng.</p><h3>ĐIỀU BẠN CÓ THỂ ĐANG CẦN</h3><p>Một khoảng thở, một người lắng nghe, hoặc đơn giản là thêm thời gian.</p><h3>3 ĐIỀU NHỎ BẠN CÓ THỂ THỬ</h3><p>Viết xuống một điều • nghỉ một chút • nói với một người bạn tin.</p><h3>MỘT LÁ THƯ DÀNH CHO BẠN</h3><p>Bạn không cần phải có tất cả câu trả lời hôm nay.</p></div></div>`)}
function selfRoom(){shell(`<div class="panel">${nav()}<div class="eyebrow">PHÒNG 03</div><h2>TÔI CỦA NGÀY HÔM QUA</h2><p>Nếu có thể quay lại, bạn muốn nói gì với mình?</p><div class="paper"><textarea id="sy" placeholder="Viết ở đây...">${self.yesterday}</textarea><button class="primary" onclick="selfTomorrow()">TIẾP</button></div></div>`)}
function selfTomorrow(){self.yesterday=document.querySelector("#sy").value;shell(`<div class="panel">${nav()}<div class="eyebrow">PHÒNG 03</div><h2>TÔI CỦA NGÀY MAI</h2><p>Bạn hy vọng mình sẽ trở thành người như thế nào?</p><div class="paper"><textarea id="st" placeholder="Viết ở đây...">${self.tomorrow}</textarea><button class="primary" onclick="finishSelf()">XONG</button></div></div>`)}
function finishSelf(){self.tomorrow=document.querySelector("#st").value;shell(`<div class="panel">${nav()}<div class="eyebrow">MỘT LÁ THƯ</div><h2>MỘT LÁ THƯ TỪ BẠN</h2><div class="letter"><p>Gửi tôi của ngày hôm qua,</p><p>${escapeHtml(self.yesterday||"Mình mong bạn biết rằng mình đã cố gắng.")}</p><p>Và gửi tôi của ngày mai,</p><p>${escapeHtml(self.tomorrow||"Mong bạn vẫn dịu dàng với chính mình.")}</p><p>— từ bạn, gửi cho chính bạn.</p></div></div>`)}
function quiet(){
  shell(`<div class="panel">${nav()}<div class="eyebrow">PHÒNG 04</div><h2>KHÔNG SAO CẢ.</h2><p>Bạn không cần phải kể bất cứ điều gì ở đây.</p><div class="choices"><button class="choice" data-sound="rain" onclick="selectQuiet(this,'rain')">Mưa</button><button class="choice" data-sound="night" onclick="selectQuiet(this,'night')">Đêm</button><button class="choice" data-sound="silent" onclick="selectQuiet(this,'silent')">Im lặng</button></div><p style="margin-top:45px">Bạn có thể chỉ ở lại một chút.</p></div>`);
}
function selectQuiet(button,kind){
  document.querySelectorAll("[data-sound]").forEach(b=>b.classList.remove("active"));
  button.classList.add("active");
  if(kind==="silent"){stopRoomAudio();startBackground();return}
  playRoomSound(kind);
}
function voidRoom(){shell(`<div class="panel">${nav()}<div class="eyebrow">PHÒNG 05</div><h2>GỬI VÀO HƯ KHÔNG</h2><p>Một người bạn chưa từng gặp đang chờ.</p><button class="primary" onclick="writeVoid()">VIẾT THƯ</button></div>`)}
function writeVoid(){shell(`<div class="panel">${nav()}<div class="paper"><b>Gửi một điều tử tế.</b><textarea id="vt" placeholder="Viết điều bạn muốn gửi..."></textarea><button class="primary" onclick="sendVoid()">CHO VÀO HÒM THƯ</button></div></div>`)}
async function sendVoid(){
  const text=document.querySelector("#vt")?.value.trim();
  if(!text){alert("Hãy viết một điều tử tế trước khi gửi.");return}
  const res=await fetch("/api/letters",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text})});
  const data=await res.json();
  if(!data.ok){alert(data.error||"Không thể gửi thư lúc này.");return}
  shell(`<div class="panel"><div class="eyebrow">CẠCH.</div><h2>Thư đã đi rồi.</h2><p>Một người bạn chưa từng gặp có thể nhận được lá thư này.</p><button class="primary" onclick="receive()">NHẬN MỘT LÁ THƯ</button></div>`);
}
async function receive(){
  shell(`<div class="panel"><div class="eyebrow">BƯU ĐIỆN ĐÊM</div><h2>✉</h2><p>Đang tìm một lá thư dành cho người ghé qua...</p></div>`);
  try{
    const res=await fetch("/api/letters-next",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});
    const data=await res.json();
    if(!data.ok) throw new Error(data.error||"Không thể nhận thư.");
    if(!data.found){shell(`<div class="panel">${nav()}<div class="eyebrow">BƯU ĐIỆN ĐÊM</div><h2>Chưa có thư nào.</h2><p>Hãy quay lại sau một chút. Có thể một người bạn chưa từng gặp sẽ gửi điều gì đó.</p></div>`);return}
    window.currentLetter=data.letter;
    shell(`<div class="panel"><div class="eyebrow">BƯU ĐIỆN ĐÊM</div><h2>✉</h2><p>Một phong bì đang chờ bạn.</p><button class="primary" onclick="openLetter()">MỞ THƯ</button></div>`);
  }catch(e){shell(`<div class="panel">${nav()}<h2>Không thể nhận thư.</h2><p>${e.message}</p></div>`)}
}
function openLetter(){
  const text=window.currentLetter?.text||"Mình không biết bạn là ai. Nhưng mong hôm nay của bạn dịu dàng hơn một chút.";
  shell(`<div class="panel"><div class="letter"><p>Một người xa lạ đã viết cho bạn.</p><p>${escapeHtml(text).replaceAll("\n","<br>")}</p><p>— một người bạn chưa từng gặp</p></div><button class="primary" onclick="replyRoom()">HỒI ĐÁP</button></div>`);
}
function replyRoom(){shell(`<div class="panel">${nav()}<div class="eyebrow">MỘT VÒNG TRÒN TỬ TẾ</div><h2>Nếu được nói một câu với người đó...</h2><div class="paper"><textarea id="reply" placeholder="Viết một câu..."></textarea><button class="primary" onclick="finish()">GỬI TIẾP</button></div></div>`)}
async function finish(){
  reply=document.querySelector("#reply")?.value.trim();
  if(!reply){alert("Hãy viết một câu hồi đáp trước khi gửi.");return}
  const id=window.currentLetter?.id;
  if(id){
    const res=await fetch(`/api/reply?id=${encodeURIComponent(id)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:reply})});
    const data=await res.json();
    if(!data.ok){alert(data.error||"Không thể gửi hồi đáp.");return}
  }
  shell(`<div class="panel end"><div class="eyebrow">END</div><div class="wave">∿ ∿ ∿ ∿ ∿</div><h2>CẢM ƠN VÌ ĐÃ GHÉ QUA.</h2><p>Trước khi bạn rời đi,<br>bạn muốn mang theo điều gì?</p><div class="choices">${["Một câu nói","Một lá thư","Một lời nhắn","Không mang gì"].map(x=>`<button class="choice" onclick="endChoice('${x}')">${x}</button>`).join("")}</div></div>`);
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function endChoice(x){shell(`<div class="panel end"><div class="eyebrow">END</div><div class="wave">∿ ∿ ∿ ∿ ∿</div><h2>${x==="Không mang gì"?"Cũng được.":"Hãy mang theo "+x.toLowerCase()+"."}</h2><p>${x==="Không mang gì"?"Bạn không nợ nơi này điều gì cả.":"Cảm ơn vì đã dành một chút thời gian cho mình."}</p><button class="primary" onclick="go(home)">VỀ LẠI CĂN PHÒNG</button></div>`)}
const rooms={letter,tell,self:selfRoom,quiet,void:voidRoom};home();
document.querySelector(".brand").onclick=()=>go(home);
let audioOn=false;document.querySelector("#soundBtn").onclick=()=>{audioOn=!audioOn;audioMode=audioOn?"on":"off";document.querySelector("#soundBtn span").textContent=audioOn?"ON":"OFF";if(audioOn)startBackground();else{bgAudio.pause();stopRoomAudio()}};
