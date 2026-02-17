// خوش آمدگویی
window.onload = () => {
  const username = localStorage.getItem('username');
  const welcome = document.getElementById('welcome');
  if(welcome && username){
      welcome.innerText = `خوش آمدی ${username} 🎀`;
  }
  initBackground();
};

// بک‌گراند رنگی ساده و متحرک
function initBackground(){
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
  });

  let hue = 0;
  function animate() {
      hue += 0.3;
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `hsl(${hue}, 50%, 20%)`);
      gradient.addColorStop(1, `hsl(${(hue+60)%360}, 60%, 25%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      requestAnimationFrame(animate);
  }
  animate();
}

// اعتبارسنجی فارسی
function validatePersian(input){
  const persianRegex = /^[\u0600-\u06FF\s]*$/;
  if(!persianRegex.test(input.value)){
      input.classList.add('invalid');
  } else {
      input.classList.remove('invalid');
  }
}

// ورود
function login(){
  const username = document.getElementById('username').value;
  const error = document.getElementById('login-error');
  if(username.trim() === '' || document.getElementById('username').classList.contains('invalid')){
      error.innerText = "نام کاربری فقط فارسی و نباید خالی باشد";
      return;
  }
  localStorage.setItem('username', username);
  window.location.href = 'main.html';
}

// اعتبارسنجی عدد
function validateNumber(input){
  const numberRegex = /^-?\d*\.?\d*$/;
  if(!numberRegex.test(input.value)){
      input.classList.add('invalid');
  } else {
      input.classList.remove('invalid');
  }
}

// حل معادله
function solve(){
  const aEl = document.getElementById("a");
  const bEl = document.getElementById("b");
  const cEl = document.getElementById("c");
  const output = document.getElementById("output");
  const downloadBtn = document.getElementById("downloadBtn");

  if(aEl.classList.contains('invalid') || bEl.classList.contains('invalid') || cEl.classList.contains('invalid')){
      output.innerHTML = " فقط عدد وارد کنید❌";
      return;
  }

  const a = parseFloat(aEl.value);
  const b = parseFloat(bEl.value);
  const c = parseFloat(cEl.value);

  if(isNaN(a) || isNaN(b) || isNaN(c)){
      output.innerHTML = "لطفاً همه ضرایب را وارد کنید⚠️";
      return;
  }
  if(a === 0){
      output.innerHTML = " این معادله درجه دوم نیست❌";
      return;
  }

  const delta = b*b - 4*a*c;
  let text = `Δ = ${delta}<br>فرمول حل: x = (-b ± √Δ)/2a<br>`;
  if(delta >=0){
      const x1 = (-b + Math.sqrt(delta))/(2*a);
      const x2 = (-b - Math.sqrt(delta))/(2*a);
      text += `x₁ = ${x1.toFixed(3)}<br>x₂ = ${x2.toFixed(3)}`;
  } else {
      text += "ریشه حقیقی ندارد";
  }

  const vx = -b/(2*a);
  const vy = a*vx*vx + b*vx + c;
  text += `<br>رأس: (${vx.toFixed(2)}, ${vy.toFixed(2)})`;

  output.innerHTML = text;
  drawGraph(a,b,c);
  downloadBtn.disabled = false;
}

// رسم نمودار با محور عددی و نمایش hover
function drawGraph(a,b,c){
  const canvas = document.getElementById('graph');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const scale = 20;        // مقیاس هر واحد
  const originX = 190;     // مرکز x
  const originY = 125;     // مرکز y

  // --- رسم محورها ---
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(0, originY);
  ctx.lineTo(380, originY);   // محور x
  ctx.moveTo(originX, 0);
  ctx.lineTo(originX, 250);   // محور y
  ctx.stroke();

  // --- اعداد روی محور ---
  ctx.fillStyle = "black";
  ctx.font = "10px Vazirmatn";
  for(let i=-8;i<=8;i++){
      ctx.fillText(i, originX + i*scale -3 , originY+12);  // x
      ctx.fillText(i, originX+4 , originY - i*scale +3);   // y
  }

  // --- رسم منحنی سهمی ---
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  for(let px=0; px<=380; px++){
      const x = (px - originX)/scale;
      const y = a*x*x + b*x + c;
      const py = originY - y*scale;
      if(px===0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // --- رسم نقاط ریشه‌ها و رأس ---
  const delta = b*b - 4*a*c;
  ctx.font = "10px Vazirmatn";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  if(delta >=0){
      const x1 = (-b + Math.sqrt(delta))/(2*a);
      const x2 = (-b - Math.sqrt(delta))/(2*a);
      const y1 = a*x1*x1 + b*x1 + c;
      const y2 = a*x2*x2 + b*x2 + c;

      // x1 قرمز
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(originX + x1*scale, originY - y1*scale, 5, 0, 2*Math.PI);
      ctx.fill();
      ctx.fillText(`x₁`, originX + x1*scale, originY - y1*scale - 7);

      // x2 سبز
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(originX + x2*scale, originY - y2*scale, 5, 0, 2*Math.PI);
      ctx.fill();
      ctx.fillText(`x₂`, originX + x2*scale, originY - y2*scale - 7);
  }

  // رأس آبی
  const vx = -b/(2*a);
  const vy = a*vx*vx + b*vx + c;
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(originX + vx*scale, originY - vy*scale, 5, 0, 2*Math.PI);
  ctx.fill();
  ctx.fillText(`رأس`, originX + vx*scale, originY - vy*scale - 7);


  // رسم سهمی
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  for(let px=0;px<380;px++){
      const x = (px - originX)/scale;
      const y = a*x*x + b*x + c;
      const py = originY - y*scale;
      if(px===0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // نمایش عدد محور روی hover
  canvas.onmousemove = function(e){
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - originX)/scale;
      const y = (originY - (e.clientY - rect.top))/scale;
      canvas.title = `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;
  }
  
}

// دانلود نمودار
function downloadGraph(){
  const canvas = document.getElementById('graph');
  const link = document.createElement('a');
  link.download = 'graph.png';
  link.href = canvas.toDataURL();
  link.click();
}