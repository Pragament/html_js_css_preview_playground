/**
 * playground-features.js
 * Comprehensive features:
 * 1. Sample codes catalog & one-click loader
 * 2. Mobile Phone Preview with realistic smartphone mockup, dynamic island & orientation toggle
 * 3. Fullscreen Preview overlay & native fullscreen
 * 4. Code in permalink & QR Code share
 * 5. Text-to-speech (TTS) code reader & explainer
 * 6. Popup Fill-in-the-Blanks with multiple blanks per question, JSON support & auto-popup on refresh
 */

(function () {
    // -------------------------------------------------------------
    // 1. SAMPLE CODES CATALOG (HTML, CSS, JS)
    // -------------------------------------------------------------
    const SAMPLE_CODES = [
        {
            id: 'calculator',
            title: 'Modern Glassmorphism Calculator',
            badge: 'Web App',
            category: 'Apps',
            description: 'A responsive grid calculator with smooth animations, keyboard support, and clean glassmorphism UI.',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Glass Calculator</title>
</head>
<body>
  <div class="calc-card">
    <div class="calc-screen">
      <div id="prev-op" class="calc-prev"></div>
      <div id="curr-op" class="calc-curr">0</div>
    </div>
    <div class="calc-grid">
      <button class="btn btn-action" onclick="calcClear()">AC</button>
      <button class="btn btn-action" onclick="calcDelete()">DEL</button>
      <button class="btn btn-action" onclick="calcAppend('%')">%</button>
      <button class="btn btn-op" onclick="calcAppend('/')">÷</button>
      
      <button class="btn" onclick="calcAppend('7')">7</button>
      <button class="btn" onclick="calcAppend('8')">8</button>
      <button class="btn" onclick="calcAppend('9')">9</button>
      <button class="btn btn-op" onclick="calcAppend('*')">×</button>
      
      <button class="btn" onclick="calcAppend('4')">4</button>
      <button class="btn" onclick="calcAppend('5')">5</button>
      <button class="btn" onclick="calcAppend('6')">6</button>
      <button class="btn btn-op" onclick="calcAppend('-')">−</button>
      
      <button class="btn" onclick="calcAppend('1')">1</button>
      <button class="btn" onclick="calcAppend('2')">2</button>
      <button class="btn" onclick="calcAppend('3')">3</button>
      <button class="btn btn-op" onclick="calcAppend('+')">+</button>
      
      <button class="btn btn-zero" onclick="calcAppend('0')">0</button>
      <button class="btn" onclick="calcAppend('.')">.</button>
      <button class="btn btn-equal" onclick="calcCompute()">=</button>
    </div>
  </div>
</body>
</html>`,
            css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 16px;
}
.calc-card {
  width: 100%;
  max-width: 320px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}
.calc-screen {
  background: rgba(0, 0, 0, 0.35);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 18px;
  text-align: right;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  word-break: break-all;
}
.calc-prev { color: #94a3b8; font-size: 14px; min-height: 18px; }
.calc-curr { color: #f8fafc; font-size: 32px; font-weight: 600; }
.calc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.btn {
  height: 54px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.07);
  color: #f1f5f9;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn:hover { background: rgba(255, 255, 255, 0.15); transform: translateY(-2px); }
.btn:active { transform: translateY(0); }
.btn-action { color: #38bdf8; background: rgba(56, 189, 248, 0.12); }
.btn-op { color: #f43f5e; background: rgba(244, 63, 94, 0.12); }
.btn-equal { background: #6366f1; color: white; border: none; }
.btn-equal:hover { background: #4f46e5; }
.btn-zero { grid-column: span 2; }`,
            js: `let curr = '0';
let prev = '';
let op = null;

const currEl = document.getElementById('curr-op');
const prevEl = document.getElementById('prev-op');

function updateDisplay() {
  currEl.innerText = curr;
  prevEl.innerText = op ? \`\${prev} \${op}\` : prev;
}

function calcAppend(val) {
  if (['+', '-', '*', '/', '%'].includes(val)) {
    if (curr === '') return;
    if (prev !== '') calcCompute();
    op = val;
    prev = curr;
    curr = '';
  } else {
    if (val === '.' && curr.includes('.')) return;
    if (curr === '0' && val !== '.') curr = val;
    else curr += val;
  }
  updateDisplay();
}

function calcClear() {
  curr = '0';
  prev = '';
  op = null;
  updateDisplay();
}

function calcDelete() {
  curr = curr.length > 1 ? curr.slice(0, -1) : '0';
  updateDisplay();
}

function calcCompute() {
  if (!op || prev === '') return;
  const p = parseFloat(prev);
  const c = parseFloat(curr);
  let res = 0;
  switch (op) {
    case '+': res = p + c; break;
    case '-': res = p - c; break;
    case '*': res = p * c; break;
    case '/': res = c !== 0 ? p / c : 'Error'; break;
    case '%': res = p % c; break;
  }
  curr = String(res);
  op = null;
  prev = '';
  updateDisplay();
}`
        },
        {
            id: 'clock',
            title: 'Neon Digital Clock & Stopwatch',
            badge: 'Interactive',
            category: 'Apps',
            description: 'Futuristic glowing digital clock with real-time seconds, date display, and a built-in stopwatch with lap times.',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Neon Digital Clock</title>
</head>
<body>
  <div class="clock-wrap">
    <div class="date-badge" id="date-text">TODAY</div>
    <div class="time-display">
      <span id="hours">00</span>:<span id="minutes">00</span>:<span id="seconds">00</span>
      <span class="ampm" id="ampm">AM</span>
    </div>
    
    <div class="stopwatch-section">
      <h3>⚡ Stopwatch</h3>
      <div class="sw-time" id="sw-display">00:00.00</div>
      <div class="sw-actions">
        <button class="sw-btn" id="sw-start" onclick="swToggle()">Start</button>
        <button class="sw-btn" onclick="swReset()">Reset</button>
      </div>
    </div>
  </div>
</body>
</html>`,
            css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #090e1a 0%, #020408 100%);
  font-family: 'Courier New', monospace;
  color: #ffffff;
  padding: 20px;
}
.clock-wrap {
  background: rgba(13, 20, 36, 0.85);
  border: 1px solid rgba(0, 240, 255, 0.25);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 0 40px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(0, 240, 255, 0.05);
  max-width: 420px;
  width: 100%;
}
.date-badge {
  font-size: 13px;
  color: #38bdf8;
  letter-spacing: 2px;
  margin-bottom: 12px;
  text-transform: uppercase;
}
.time-display {
  font-size: 42px;
  font-weight: 700;
  color: #00f0ff;
  text-shadow: 0 0 15px rgba(0, 240, 255, 0.6);
  margin-bottom: 24px;
}
.ampm { font-size: 16px; color: #a5f3fc; margin-left: 6px; }
.stopwatch-section {
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
  padding-top: 20px;
}
.stopwatch-section h3 {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 10px;
}
.sw-time {
  font-size: 26px;
  color: #a855f7;
  text-shadow: 0 0 12px rgba(168, 85, 247, 0.5);
  margin-bottom: 15px;
}
.sw-actions { display: flex; gap: 10px; justify-content: center; }
.sw-btn {
  background: rgba(0, 240, 255, 0.1);
  color: #00f0ff;
  border: 1px solid #00f0ff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-weight: bold;
  transition: all 0.2s;
}
.sw-btn:hover { background: #00f0ff; color: #000; box-shadow: 0 0 15px #00f0ff; }`,
            js: `function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;

  document.getElementById('hours').innerText = String(h).padStart(2, '0');
  document.getElementById('minutes').innerText = m;
  document.getElementById('seconds').innerText = s;
  document.getElementById('ampm').innerText = ampm;

  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  document.getElementById('date-text').innerText = now.toLocaleDateString(undefined, options);
}
setInterval(updateClock, 1000);
updateClock();

// Stopwatch
let swRunning = false;
let swStart = 0;
let swElapsed = 0;
let swInterval = null;

function swToggle() {
  const btn = document.getElementById('sw-start');
  if (!swRunning) {
    swRunning = true;
    swStart = Date.now() - swElapsed;
    swInterval = setInterval(() => {
      swElapsed = Date.now() - swStart;
      const ms = Math.floor((swElapsed % 1000) / 10);
      const sec = Math.floor((swElapsed / 1000) % 60);
      const min = Math.floor(swElapsed / 60000);
      document.getElementById('sw-display').innerText = 
        \`\${String(min).padStart(2, '0')}:\${String(sec).padStart(2, '0')}.\${String(ms).padStart(2, '0')}\`;
    }, 20);
    btn.innerText = 'Pause';
  } else {
    swRunning = false;
    clearInterval(swInterval);
    btn.innerText = 'Resume';
  }
}

function swReset() {
  swRunning = false;
  clearInterval(swInterval);
  swElapsed = 0;
  document.getElementById('sw-display').innerText = '00:00.00';
  document.getElementById('sw-start').innerText = 'Start';
}`
        },
        {
            id: 'particles',
            title: 'Interactive Canvas Particle Network',
            badge: 'Canvas 2D',
            category: 'Effects',
            description: 'Particle constellation simulation where particles float around and draw glowing laser links to nearby dots and mouse cursor.',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Canvas Particle Network</title>
</head>
<body>
  <div class="banner">✨ Move mouse or touch to interact with particles</div>
  <canvas id="particle-canvas"></canvas>
</body>
</html>`,
            css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  overflow: hidden;
  background: #090c15;
  height: 100vh;
  position: relative;
  font-family: sans-serif;
}
.banner {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: #94a3b8;
  font-size: 13px;
  background: rgba(15, 23, 42, 0.7);
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
}
canvas { display: block; }`,
            js: `const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

const mouse = { x: null, y: null, radius: 140 };
window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.radius = Math.random() * 2 + 1.5;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > w) this.vx = -this.vx;
    if (this.y < 0 || this.y > h) this.vy = -this.vy;

    // Mouse interaction
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        this.x -= (dx / dist) * 2;
        this.y -= (dy / dist) * 2;
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
  }
}

const particles = Array.from({ length: 65 }, () => new Particle());

function animate() {
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = \`rgba(56, 189, 248, \${1 - dist / 110})\`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}
animate();`
        },
        {
            id: 'todo',
            title: 'Smart Task & Todo Manager',
            badge: 'LocalStorage',
            category: 'Apps',
            description: 'Minimalist todo list with category badges, completion toggle, filter tabs, and real-time counter.',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Task Manager</title>
</head>
<body>
  <div class="todo-app">
    <h2>🎯 Today's Goals</h2>
    <div class="input-row">
      <input type="text" id="task-in" placeholder="Add a new task..." onkeydown="if(event.key==='Enter')addTask()">
      <button onclick="addTask()">Add</button>
    </div>
    <ul id="task-list" class="task-list"></ul>
    <div class="todo-footer">
      <span id="counter">0 tasks remaining</span>
      <button class="clear-btn" onclick="clearDone()">Clear Done</button>
    </div>
  </div>
</body>
</html>`,
            css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 16px;
}
.todo-app {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}
h2 { color: #f8fafc; font-size: 20px; margin-bottom: 16px; }
.input-row { display: flex; gap: 8px; margin-bottom: 16px; }
.input-row input {
  flex: 1;
  background: #0f172a;
  border: 1px solid #334155;
  color: #f8fafc;
  padding: 10px 14px;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
}
.input-row input:focus { border-color: #6366f1; }
.input-row button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.task-list { list-style: none; display: flex; flex-direction: column; gap: 8px; max-height: 260px; overflow-y: auto; }
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0f172a;
  padding: 10px 12px;
  border-radius: 8px;
  border-left: 3px solid #6366f1;
}
.task-item.done { text-decoration: line-through; opacity: 0.6; border-left-color: #10b981; }
.task-item span { color: #e2e8f0; font-size: 14px; cursor: pointer; flex: 1; }
.del-btn { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 16px; }
.todo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #334155;
  font-size: 12px;
  color: #94a3b8;
}
.clear-btn { background: none; border: none; color: #38bdf8; cursor: pointer; font-size: 12px; }`,
            js: `let tasks = [
  { text: 'Master HTML & CSS fundamentals', done: true },
  { text: 'Build a mobile preview feature', done: false },
  { text: 'Try Text to Speech reader', done: false }
];

function render() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  tasks.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (t.done ? ' done' : '');
    li.innerHTML = \`<span onclick="toggleTask(\${i})">\${t.text}</span>
                    <button class="del-btn" onclick="delTask(\${i})">✕</button>\`;
    list.appendChild(li);
  });
  const rem = tasks.filter(t => !t.done).length;
  document.getElementById('counter').innerText = \`\${rem} task\${rem === 1 ? '' : 's'} remaining\`;
}

function addTask() {
  const inEl = document.getElementById('task-in');
  const val = inEl.value.trim();
  if (val) {
    tasks.push({ text: val, done: false });
    inEl.value = '';
    render();
  }
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  render();
}

function delTask(i) {
  tasks.splice(i, 1);
  render();
}

function clearDone() {
  tasks = tasks.filter(t => !t.done);
  render();
}

render();`
        },
        {
            id: 'weather',
            title: 'Animated Weather Forecast Card',
            badge: 'CSS Animation',
            category: 'UI/Effects',
            description: 'Dynamic gradient weather card with animated floating cloud, sun rays, temperature toggle, and mini weekly forecast.',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Weather Card</title>
</head>
<body>
  <div class="weather-card">
    <div class="weather-header">
      <div>
        <h2 class="city">San Francisco</h2>
        <span class="condition">Sunny & Breezy</span>
      </div>
      <div class="sun-icon">☀️</div>
    </div>
    
    <div class="temp-row">
      <div class="temp-val" id="temp">72°</div>
      <div class="temp-unit">
        <button class="unit-btn active" onclick="setUnit('F')">°F</button>
        <button class="unit-btn" onclick="setUnit('C')">°C</button>
      </div>
    </div>

    <div class="mini-forecast">
      <div class="day-col"><span>Mon</span><span>☀️</span><strong>74°</strong></div>
      <div class="day-col"><span>Tue</span><span>⛅</span><strong>70°</strong></div>
      <div class="day-col"><span>Wed</span><span>🌧️</span><strong>65°</strong></div>
      <div class="day-col"><span>Thu</span><span>🌤️</span><strong>71°</strong></div>
    </div>
  </div>
</body>
</html>`,
            css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0b1120;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 16px;
}
.weather-card {
  width: 100%;
  max-width: 320px;
  background: linear-gradient(145deg, #1e3a8a, #0369a1);
  border-radius: 24px;
  padding: 24px;
  color: white;
  box-shadow: 0 20px 40px rgba(2, 132, 199, 0.3);
}
.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.city { font-size: 22px; font-weight: 700; }
.condition { font-size: 13px; color: #bae6fd; }
.sun-icon {
  font-size: 44px;
  animation: pulse 3s infinite alternate;
}
@keyframes pulse {
  0% { transform: scale(1) rotate(0deg); }
  100% { transform: scale(1.15) rotate(15deg); }
}
.temp-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 20px 0;
}
.temp-val { font-size: 56px; font-weight: 800; }
.temp-unit { display: flex; gap: 4px; }
.unit-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.unit-btn.active { background: white; color: #0369a1; }
.mini-forecast {
  display: flex;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.15);
  padding: 12px;
  border-radius: 14px;
}
.day-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}`,
            js: `let currentUnit = 'F';

function setUnit(u) {
  currentUnit = u;
  document.querySelectorAll('.unit-btn').forEach(btn => {
    btn.classList.toggle('active', btn.innerText.includes(u));
  });
  const tempEl = document.getElementById('temp');
  tempEl.innerText = u === 'F' ? '72°' : '22°';
}`
        }
    ];

    // -------------------------------------------------------------
    // 2. FILL IN THE BLANKS QUESTIONS JSON LIST
    //    (Multiple blanks per single question)
    // -------------------------------------------------------------
    const DEFAULT_QUIZ_QUESTIONS = [
        {
            id: 1,
            title: "HTML5 Document Structure",
            category: "HTML",
            badgeClass: "pf-badge-html",
            difficulty: "Beginner",
            template: "Every standard HTML5 web page must start with the <!DOCTYPE [blank1]> declaration. All visible components are placed inside the <[blank2]> tag, while page metadata and title belong in the <[blank3]> tag.",
            blanks: [
                {
                    id: "blank1",
                    placeholder: "doctype",
                    answer: "html",
                    options: ["html", "xml", "document", "web5"],
                    hint: "HTML5 doctype declaration is simply 'html'"
                },
                {
                    id: "blank2",
                    placeholder: "visible tag",
                    answer: "body",
                    options: ["body", "main", "content", "viewport"],
                    hint: "The element containing all visible DOM content"
                },
                {
                    id: "blank3",
                    placeholder: "meta tag",
                    answer: "head",
                    options: ["head", "meta", "header", "scripts"],
                    hint: "The container for document title, meta tags, and stylesheets"
                }
            ],
            explanation: "<!DOCTYPE html> sets HTML5 rendering mode. The <head> holds meta-information, while <body> holds all rendered visual elements.",
            codeSnippet: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Webpage</title>\n  </head>\n  <body>\n    <h1>Hello World!</h1>\n  </body>\n</html>`
        },
        {
            id: 2,
            title: "CSS Flexbox Alignment",
            category: "CSS",
            badgeClass: "pf-badge-css",
            difficulty: "Intermediate",
            template: "To create a flex container, set display to [blank1]. To center children horizontally along the primary axis, set [blank2] to center, and to align vertically along the cross axis, set [blank3] to center.",
            blanks: [
                {
                    id: "blank1",
                    placeholder: "display mode",
                    answer: "flex",
                    options: ["flex", "grid", "block", "inline"],
                    hint: "CSS display property value for Flexbox"
                },
                {
                    id: "blank2",
                    placeholder: "main axis",
                    answer: "justify-content",
                    options: ["justify-content", "align-items", "align-content", "flex-direction"],
                    hint: "Aligns flex items along the main axis"
                },
                {
                    id: "blank3",
                    placeholder: "cross axis",
                    answer: "align-items",
                    options: ["align-items", "justify-items", "align-content", "vertical-align"],
                    hint: "Aligns flex items along the cross axis"
                }
            ],
            explanation: "display: flex initializes Flexbox. justify-content handles main-axis alignment and align-items handles cross-axis alignment.",
            codeSnippet: `.flex-center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}`
        },
        {
            id: 3,
            title: "JavaScript DOM Selectors & Events",
            category: "JavaScript",
            badgeClass: "pf-badge-js",
            difficulty: "Intermediate",
            template: "To grab an element by any CSS selector, call document.[blank1]('selector'). To listen for a button click, use element.[blank2]('click', callback), and prevent form page reload with event.[blank3]().",
            blanks: [
                {
                    id: "blank1",
                    placeholder: "selector method",
                    answer: "querySelector",
                    options: ["querySelector", "getElementById", "select", "findElement"],
                    hint: "Universal modern CSS selector method"
                },
                {
                    id: "blank2",
                    placeholder: "event listener",
                    answer: "addEventListener",
                    options: ["addEventListener", "attachEvent", "listen", "setEvent"],
                    hint: "Standard W3C event listener method"
                },
                {
                    id: "blank3",
                    placeholder: "default stopper",
                    answer: "preventDefault",
                    options: ["preventDefault", "stopPropagation", "cancel", "stopDefault"],
                    hint: "Cancels standard browser actions like form submissions"
                }
            ],
            explanation: "document.querySelector provides versatile querying, addEventListener wires event handlers, and e.preventDefault() stops default actions.",
            codeSnippet: `const btn = document.querySelector('#submit-btn');\nbtn.addEventListener('click', (event) => {\n  event.preventDefault();\n  console.log('Action handled!');\n});`
        },
        {
            id: 4,
            title: "HTML Links & Image Attributes",
            category: "HTML",
            badgeClass: "pf-badge-html",
            difficulty: "Beginner",
            template: "A hyperlink is created with the <[blank1]> tag using the [blank2] attribute to designate the URL. To embed images, use the <[blank3]> tag with [blank4] for accessibility descriptions.",
            blanks: [
                {
                    id: "blank1",
                    placeholder: "link element",
                    answer: "a",
                    options: ["a", "link", "url", "href"],
                    hint: "The anchor tag"
                },
                {
                    id: "blank2",
                    placeholder: "url attribute",
                    answer: "href",
                    options: ["href", "src", "target", "path"],
                    hint: "Hypertext Reference attribute"
                },
                {
                    id: "blank3",
                    placeholder: "image element",
                    answer: "img",
                    options: ["img", "image", "pic", "figure"],
                    hint: "Self-closing tag for graphics"
                },
                {
                    id: "blank4",
                    placeholder: "alt attribute",
                    answer: "alt",
                    options: ["alt", "title", "caption", "desc"],
                    hint: "Alternative text for screen readers & SEO"
                }
            ],
            explanation: "<a href='...'> creates hyperlinks; <img src='...' alt='...'> displays images with accessibility text.",
            codeSnippet: `<a href="https://example.com" target="_blank">Visit Site</a>\n<img src="logo.png" alt="Company Logo">`
        },
        {
            id: 5,
            title: "ES6 Variables & Scoping",
            category: "JavaScript",
            badgeClass: "pf-badge-js",
            difficulty: "Beginner",
            template: "In modern JavaScript, declare reassignable block-scoped variables using [blank1], declare read-only constant references with [blank2], and avoid using [blank3] because of hoisting and function-scoping bugs.",
            blanks: [
                {
                    id: "blank1",
                    placeholder: "mutable keyword",
                    answer: "let",
                    options: ["let", "var", "const", "def"],
                    hint: "Block-scoped reassignable identifier"
                },
                {
                    id: "blank2",
                    placeholder: "constant keyword",
                    answer: "const",
                    options: ["const", "final", "static", "let"],
                    hint: "Block-scoped identifier that cannot be reassigned"
                },
                {
                    id: "blank3",
                    placeholder: "legacy keyword",
                    answer: "var",
                    options: ["var", "global", "dim", "val"],
                    hint: "Legacy ES5 variable keyword"
                }
            ],
            explanation: "let gives reassignable block-scope; const guarantees immutable binding; var is hoisted with function scope.",
            codeSnippet: `let counter = 0;\ncounter += 1; // allowed\nconst appName = 'CodePlayground';\n// appName = 'Other'; // TypeError!`
        },
        {
            id: 6,
            title: "CSS Box Model & Padding",
            category: "CSS",
            badgeClass: "pf-badge-css",
            difficulty: "Beginner",
            template: "The space between an element's content and its border is [blank1], while the space outside the border is [blank2]. Setting box-sizing to [blank3] incorporates padding and border into the element width.",
            blanks: [
                {
                    id: "blank1",
                    placeholder: "inner space",
                    answer: "padding",
                    options: ["padding", "margin", "gap", "inset"],
                    hint: "Inner spacing inside the border"
                },
                {
                    id: "blank2",
                    placeholder: "outer space",
                    answer: "margin",
                    options: ["margin", "padding", "outline", "offset"],
                    hint: "Outer spacing around an element"
                },
                {
                    id: "blank3",
                    placeholder: "box model value",
                    answer: "border-box",
                    options: ["border-box", "content-box", "inherit", "fit-content"],
                    hint: "Standard layout reset property value"
                }
            ],
            explanation: "Padding adds internal cushion; margin adds outer clearance. border-box ensures fixed predictable sizing.",
            codeSnippet: `* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}`
        }
    ];

    let currentQuizList = [...DEFAULT_QUIZ_QUESTIONS];
    let activeQuizIndex = 0;
    let quizAnswersState = {};

    // -------------------------------------------------------------
    // 3. TOAST HELPER
    // -------------------------------------------------------------
    function showPfToast(message) {
        let toast = document.getElementById('pf-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'pf-toast';
            toast.className = 'pf-toast';
            document.body.appendChild(toast);
        }
        toast.innerText = message;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // -------------------------------------------------------------
    // 4. EDITOR HELPERS (Works with CodeMirror instances)
    // -------------------------------------------------------------
    function getEditorInstances() {
        return {
            html: window.htmlEditor,
            css: window.cssEditor,
            js: window.jsEditor
        };
    }

    function triggerUpdatePreview() {
        if (typeof window.updatePreview === 'function') {
            window.updatePreview();
        }
    }

    // -------------------------------------------------------------
    // 5. SAMPLE CODES LOADER
    // -------------------------------------------------------------
    function loadSample(sampleId) {
        const sample = SAMPLE_CODES.find(s => s.id === sampleId);
        if (!sample) return;

        const editors = getEditorInstances();
        if (editors.html && sample.html !== undefined) editors.html.setValue(sample.html);
        if (editors.css && sample.css !== undefined) editors.css.setValue(sample.css);
        if (editors.js && sample.js !== undefined) editors.js.setValue(sample.js);

        triggerUpdatePreview();
        showPfToast(`🚀 Loaded sample: "${sample.title}"!`);

        // Close modal if open
        closeModal('pf-samples-modal');

        // Update dropdown if present
        const dropdown = document.getElementById('pf-sample-select');
        if (dropdown) dropdown.value = sampleId;
    }

    function openSamplesModal() {
        const container = document.getElementById('pf-samples-grid');
        if (container) {
            container.innerHTML = SAMPLE_CODES.map(sample => `
                <div class="pf-sample-card" onclick="window.PlaygroundFeatures.loadSample('${sample.id}')">
                    <div>
                        <div class="pf-sample-card-header">
                            <h4 class="pf-sample-card-title">${sample.title}</h4>
                            <span class="pf-sample-badge">${sample.badge}</span>
                        </div>
                        <p class="pf-sample-desc">${sample.description}</p>
                    </div>
                    <button class="pf-sample-load-btn" onclick="event.stopPropagation(); window.PlaygroundFeatures.loadSample('${sample.id}')">
                        ⚡ Load into Playground
                    </button>
                </div>
            `).join('');
        }
        openModal('pf-samples-modal');
    }

    // -------------------------------------------------------------
    // 6. PHONE PREVIEW CONTROLLER
    // -------------------------------------------------------------
    let isPhoneMode = false;
    let isLandscape = false;

    function togglePhonePreview(forceState) {
        const previewContainer = document.querySelector('.preview-container') || document.getElementById('preview-container');
        const phoneBtn = document.getElementById('pf-phone-btn');
        if (!previewContainer) return;

        isPhoneMode = typeof forceState === 'boolean' ? forceState : !isPhoneMode;

        if (isPhoneMode) {
            previewContainer.classList.add('phone-mode-active');
            if (phoneBtn) {
                phoneBtn.classList.add('active');
                phoneBtn.innerHTML = '🖥️ Desktop Preview';
            }
            updatePhoneClock();
            showPfToast('📱 Smartphone Preview Mode activated');
        } else {
            previewContainer.classList.remove('phone-mode-active');
            if (phoneBtn) {
                phoneBtn.classList.remove('active');
                phoneBtn.innerHTML = '📱 Phone Preview';
            }
            showPfToast('🖥️ Switched back to Desktop Preview');
        }
    }

    function setPhoneDevice(deviceKey) {
        const shell = document.getElementById('pf-phone-shell');
        if (!shell) return;
        shell.className = `pf-phone-shell device-${deviceKey}${isLandscape ? ' landscape' : ''}`;
    }

    function togglePhoneOrientation() {
        isLandscape = !isLandscape;
        const shell = document.getElementById('pf-phone-shell');
        if (shell) {
            shell.classList.toggle('landscape', isLandscape);
            showPfToast(isLandscape ? '🔄 Switched to Landscape' : '🔄 Switched to Portrait');
        }
    }

    function updatePhoneClock() {
        const el = document.getElementById('pf-phone-time');
        if (!el) return;
        const now = new Date();
        let h = now.getHours();
        let m = String(now.getMinutes()).padStart(2, '0');
        el.innerText = `${h}:${m}`;
    }
    setInterval(updatePhoneClock, 30000);

    // -------------------------------------------------------------
    // 7. FULLSCREEN PREVIEW CONTROLLER & DOCUMENT BUILDER
    // -------------------------------------------------------------
    function buildPreviewDoc(html, css, js) {
        html = html || '';
        css = css || '';
        js = js || '';

        // Check if there is actual visible content (ignoring comments)
        const strippedHtml = html.replace(/<!--[\s\S]*?-->/g, '').trim();
        const strippedJs = js.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
        const hasVisibleContent = strippedHtml.length > 0 || strippedJs.length > 0;

        if (!hasVisibleContent) {
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 40px 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #f8fafc;
            color: #334155;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            text-align: center;
        }
        .empty-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 36px 28px;
            max-width: 420px;
            width: 100%;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
        }
        .empty-icon { font-size: 48px; margin-bottom: 12px; }
        h2 { margin: 0 0 10px; font-size: 22px; color: #0f172a; font-weight: 700; }
        p { margin: 0 0 20px; font-size: 14px; color: #64748b; line-height: 1.6; }
        .edit-tip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #eff6ff;
            color: #1d4ed8;
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 600;
            border: 1px solid #bfdbfe;
        }
    </style>
</head>
<body>
    <div class="empty-card">
        <div class="empty-icon">💻</div>
        <h2>Ready for Your Code!</h2>
        <p>No visible HTML elements have been written yet.</p>
        <div class="edit-tip">👆 Tap <strong>"View / Edit Code"</strong> at the top to write HTML or choose a sample!</div>
    </div>
</body>
</html>`;
        }

        const hasDoctype = /<!doctype/i.test(html);
        const hasMetaViewport = /<meta[^>]*viewport/i.test(html);
        const viewportMeta = hasMetaViewport ? '' : '<meta name="viewport" content="width=device-width, initial-scale=1.0">';

        if (hasDoctype) {
            let res = html;
            if (!hasMetaViewport && res.includes('<head>')) {
                res = res.replace('<head>', `<head>${viewportMeta}`);
            }
            if (css.trim()) {
                if (res.includes('</head>')) {
                    res = res.replace('</head>', `<style>${css}</style></head>`);
                } else {
                    res = `<style>${css}</style>` + res;
                }
            }
            if (js.trim()) {
                const scriptTag = `<script>try { ${js} } catch(e){ console.error('Playground JS Error:', e); }<\/script>`;
                if (res.includes('</body>')) {
                    res = res.replace('</body>', `${scriptTag}</body>`);
                } else {
                    res = res + scriptTag;
                }
            }
            return res;
        }

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    ${viewportMeta}
    <style>
        body {
            margin: 0;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #ffffff;
            color: #0f172a;
        }
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        try {
            ${js}
        } catch(e) {
            console.error('Playground JS Error:', e);
        }
    <\/script>
</body>
</html>`;
    }

    function toggleFullscreenPreview() {
        const overlay = document.getElementById('pf-fullscreen-overlay');
        const fsIframe = document.getElementById('pf-fullscreen-iframe');

        if (!overlay || !fsIframe) return;

        // Ensure latest content is populated in fsIframe
        const editors = getEditorInstances();
        const html = editors.html ? editors.html.getValue() : '';
        const css = editors.css ? editors.css.getValue() : '';
        const js = editors.js ? editors.js.getValue() : '';

        fsIframe.srcdoc = buildPreviewDoc(html, css, js);
        overlay.classList.add('active');

        // Request browser native fullscreen if available
        if (overlay.requestFullscreen) {
            overlay.requestFullscreen().catch(() => {});
        }
    }

    function closeFullscreenPreview() {
        const overlay = document.getElementById('pf-fullscreen-overlay');
        if (overlay) overlay.classList.remove('active');
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
    }

    // -------------------------------------------------------------
    // 8. CODE IN PERMALINK & QR CODE SHARE
    // -------------------------------------------------------------
    let currentShareHostMode = 'cloud'; // Default to 'cloud' so links and QR work on ANY network (4G/5G/any Wi-Fi)!
    let currentShareViewMode = 'output'; // 'output' (Live Preview) or 'editor' (Code + Output)
    const DEFAULT_CLOUD_TUNNEL_URL = 'https://ease-massage-anti-greetings.trycloudflare.com';

    function getCloudUrl() {
        const stored = localStorage.getItem('pf_cloud_url');
        if (stored) return stored;
        return DEFAULT_CLOUD_TUNNEL_URL;
    }

    function updateCloudUrl() {
        const input = document.getElementById('pf-cloud-url-input');
        if (input && input.value) {
            let newUrl = input.value.trim().replace(/\/+$/, '');
            if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
                newUrl = 'https://' + newUrl;
            }
            localStorage.setItem('pf_cloud_url', newUrl);
            showPfToast(`✅ Public Cloud URL updated!`);
            updateShareModalUI();
            refreshShareQrAndLink();
        }
    }

    function getWifiIp() {
        const stored = localStorage.getItem('pf_local_wifi_ip');
        if (stored) return stored;
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && /^\d+\.\d+\.\d+\.\d+$/.test(window.location.hostname)) {
            return window.location.hostname;
        }
        return '192.168.1.6';
    }

    function updateWifiIp() {
        const input = document.getElementById('pf-wifi-ip-input');
        if (input && input.value) {
            const newIp = input.value.trim();
            localStorage.setItem('pf_local_wifi_ip', newIp);
            showPfToast(`✅ Laptop Wi-Fi IP updated to ${newIp}`);
            updateShareModalUI();
            refreshShareQrAndLink();
        }
    }

    function setShareHost(mode) {
        currentShareHostMode = mode;
        updateShareModalUI();
        refreshShareQrAndLink();
    }

    function setShareView(view) {
        currentShareViewMode = view;
        updateShareModalUI();
        refreshShareQrAndLink();
    }

    function updateShareModalUI() {
        const wifiIp = getWifiIp();
        const cloudUrl = getCloudUrl();

        // Host selector buttons
        document.querySelectorAll('.pf-host-btn').forEach(b => b.classList.remove('active'));
        const hostBtn = document.getElementById(`pf-host-${currentShareHostMode}`);
        if (hostBtn) hostBtn.classList.add('active');

        // Update wifi button label
        const wifiBtn = document.getElementById('pf-host-wifi');
        if (wifiBtn) {
            wifiBtn.innerHTML = `🏠 Same Wi-Fi (${wifiIp})`;
        }

        // Show/hide wifi IP edit row
        const wifiIpRow = document.getElementById('pf-wifi-ip-row');
        if (wifiIpRow) {
            wifiIpRow.style.display = currentShareHostMode === 'wifi' ? 'flex' : 'none';
        }
        const ipInput = document.getElementById('pf-wifi-ip-input');
        if (ipInput && document.activeElement !== ipInput) {
            ipInput.value = wifiIp;
        }

        // Show/hide cloud URL edit row
        const cloudUrlRow = document.getElementById('pf-cloud-url-row');
        if (cloudUrlRow) {
            cloudUrlRow.style.display = currentShareHostMode === 'cloud' ? 'flex' : 'none';
        }
        const cloudInput = document.getElementById('pf-cloud-url-input');
        if (cloudInput && document.activeElement !== cloudInput) {
            cloudInput.value = cloudUrl;
        }

        // View selector buttons
        document.querySelectorAll('.pf-view-btn').forEach(b => b.classList.remove('active'));
        const viewBtn = document.getElementById(`pf-view-${currentShareViewMode}`);
        if (viewBtn) viewBtn.classList.add('active');

        // Hint banner
        const hintEl = document.getElementById('pf-share-hint');
        if (hintEl) {
            if (currentShareHostMode === 'cloud') {
                hintEl.innerHTML = `
                    <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5; text-align: left;">
                        <div>🌍 <strong>Works on ALL Networks:</strong> Mobile Data (4G/5G), Any Wi-Fi, or Remote Users!</div>
                        <div style="margin-top: 6px; color: #34d399; font-size: 11px;">
                            🔒 <strong>100% HTTPS Secure:</strong> Zero warnings. Camera scans and opens from any network worldwide.
                        </div>
                    </div>`;
            } else if (currentShareHostMode === 'wifi') {
                hintEl.innerHTML = `
                    <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5; text-align: left;">
                        <div>📶 <strong>Same Wi-Fi Only:</strong> Phone & laptop must be connected to the same home Wi-Fi (<code>${wifiIp}</code>).</div>
                        <div style="margin-top: 6px; color: #fbbf24; font-size: 11px;">
                            🔒 <strong>Android Note:</strong> If Chrome shows <em>"This site doesn't support a secure connection"</em>, tap <strong>"Continue to site"</strong>.
                        </div>
                    </div>`;
            } else {
                hintEl.innerHTML = `
                    <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5; text-align: left;">
                        <div>💻 <strong>Localhost Only:</strong> Only accessible on this computer's browser.</div>
                    </div>`;
            }
        }
    }

    function refreshShareQrAndLink() {
        let permalink = window.location.href;
        try {
            permalink = generatePermalink();
        } catch (e) {
            console.warn('Error creating permalink:', e);
        }

        const input = document.getElementById('pf-permalink-input');
        if (input) input.value = permalink;

        const qrContainer = document.getElementById('pf-qr-container');
        if (qrContainer) {
            qrContainer.innerHTML = '';
            renderQRCodeSafe(qrContainer, permalink);
        }
    }

    function testPermalink() {
        const input = document.getElementById('pf-permalink-input');
        if (input && input.value) {
            window.open(input.value, '_blank');
        }
    }

    function generatePermalink() {
        const editors = getEditorInstances();
        const hVal = editors.html ? editors.html.getValue().trim() : '';
        const cVal = editors.css ? editors.css.getValue().trim() : '';
        const jVal = editors.js ? editors.js.getValue().trim() : '';
        const payload = {};
        if (hVal) payload.h = hVal;
        if (cVal) payload.c = cVal;
        if (jVal) payload.j = jVal;

        const jsonStr = JSON.stringify(payload);
        let encoded = '';

        // Priority 1: LZString compression (compact and QR-code friendly)
        if (typeof LZString !== 'undefined') {
            try {
                encoded = 'lz_' + LZString.compressToEncodedURIComponent(jsonStr);
            } catch (e) {
                console.warn('LZ compression error:', e);
            }
        }

        // Priority 2: Safe Base64 fallback
        if (!encoded) {
            try {
                encoded = 'b64_' + encodeURIComponent(btoa(encodeURIComponent(jsonStr)));
            } catch (e) {
                console.warn('Base64 encoding error:', e);
                encoded = 'uri_' + encodeURIComponent(jsonStr);
            }
        }

        // Determine base URL depending on host mode
        let base = window.location.href.split('#')[0];
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(window.location.hostname);

        if (isLocal) {
            if (currentShareHostMode === 'wifi') {
                const port = window.location.port ? `:${window.location.port}` : '';
                base = `${window.location.protocol}//${getWifiIp()}${port}${window.location.pathname}`;
            } else if (currentShareHostMode === 'cloud') {
                const cloudBase = getCloudUrl();
                base = `${cloudBase}/index.html`;
            } else if (currentShareHostMode === 'local') {
                const port = window.location.port ? `:${window.location.port}` : '';
                base = `${window.location.protocol}//localhost${port}${window.location.pathname}`;
            }
        }

        const viewParam = currentShareViewMode === 'output' ? '&view=output' : '';
        return `${base}#code=${encoded}${viewParam}`;
    }

    function openShareModal() {
        // ALWAYS open the modal first so the dialog appears without blocking
        openModal('pf-share-modal');
        updateShareModalUI();
        refreshShareQrAndLink();
    }

    function renderQRCodeSafe(container, permalink) {
        container.innerHTML = '';

        // Standard QR code limit check: if payload is <= 2200 chars, render full QR
        const isShortEnough = permalink.length <= 2200;

        if (isShortEnough) {
            // High-resolution dedicated QR image with quiet zone & Lowest ECC for ultra-large modules
            const qrImg = document.createElement('img');
            qrImg.alt = 'Scan with Phone Camera';
            qrImg.id = 'pf-qr-image';
            qrImg.style.cssText = 'width: 250px; height: 250px; display: block; border-radius: 6px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.08); image-rendering: pixelated;';
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=12&ecc=L&format=png&color=000000&data=${encodeURIComponent(permalink)}`;

            // Offline client-side QRCode fallback
            qrImg.onerror = () => {
                container.innerHTML = '';
                if (typeof QRCode !== 'undefined') {
                    try {
                        new QRCode(container, {
                            text: permalink,
                            width: 250,
                            height: 250,
                            colorDark: '#000000',
                            colorLight: '#ffffff',
                            correctLevel: QRCode.CorrectLevel.L
                        });
                        // qrcodejs creates both a canvas and a hidden img; hide any duplicate img
                        const imgs = container.querySelectorAll('img');
                        const canvases = container.querySelectorAll('canvas');
                        if (canvases.length > 0 && imgs.length > 0) {
                            imgs[0].style.display = 'none';
                        }
                    } catch (qrErr) {
                        console.warn('QRCode JS library error:', qrErr);
                    }
                }
            };

            container.appendChild(qrImg);
            return;
        }

        // If code is too large for single QR code matrix (> 2.2 KB):
        const basePageUrl = window.location.origin + window.location.pathname;
        const qrImg = document.createElement('img');
        qrImg.alt = 'Scan QR Code';
        qrImg.style.cssText = 'width: 240px; height: 240px; display: block; border-radius: 8px; margin: 0 auto; image-rendering: pixelated;';
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&ecc=L&format=png&data=${encodeURIComponent(basePageUrl)}`;
        container.appendChild(qrImg);

        const notice = document.createElement('div');
        notice.style.cssText = 'font-size: 11px; color: #fbbf24; margin-top: 8px; max-width: 260px; text-align: center;';
        notice.innerHTML = `⚠️ Project code is <strong>${Math.round(permalink.length / 1024 * 10) / 10} KB</strong>. Click <strong>"📋 Copy Link"</strong> below to share the full project!`;
        container.appendChild(notice);
    }

    function toggleZoomQr() {
        const box = document.getElementById('pf-qr-container');
        const btn = document.getElementById('pf-qr-zoom-btn');
        if (!box) return;
        const isZoomed = box.classList.toggle('zoomed');
        if (btn) {
            btn.innerHTML = isZoomed ? '🔍 Reset Size' : '🔍 Enlarge QR';
        }
    }

    function downloadQrImage() {
        const qrImg = document.querySelector('#pf-qr-container img');
        const canvas = document.querySelector('#pf-qr-container canvas');
        let dataUrl = '';
        if (canvas) {
            dataUrl = canvas.toDataURL('image/png');
        } else if (qrImg && qrImg.src) {
            dataUrl = qrImg.src;
        }
        if (!dataUrl) {
            showPfToast('⚠️ No QR image found to download');
            return;
        }
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'playground-code-qr.png';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showPfToast('💾 QR Image download initiated!');
    }

    function copyPermalink() {
        const input = document.getElementById('pf-permalink-input');
        if (input) {
            input.select();
            navigator.clipboard.writeText(input.value).then(() => {
                showPfToast('📋 Permalink copied to clipboard!');
                const btn = document.getElementById('pf-copy-btn');
                if (btn) {
                    const original = btn.innerHTML;
                    btn.innerHTML = '✓ Copied!';
                    setTimeout(() => { btn.innerHTML = original; }, 2000);
                }
            }).catch(() => {
                showPfToast('Could not auto-copy, please copy link manually');
            });
        }
    }

    function checkAndLoadPermalink() {
        const hash = window.location.hash;
        if (hash && hash.includes('code=')) {
            try {
                const match = hash.match(/code=([^&]+)/);
                if (match && match[1]) {
                    const raw = match[1];
                    let decodedStr = null;

                    // Case 1: LZString compressed
                    if (raw.startsWith('lz_') && typeof LZString !== 'undefined') {
                        decodedStr = LZString.decompressFromEncodedURIComponent(raw.slice(3));
                    } else if (raw.startsWith('b64_')) {
                        decodedStr = decodeURIComponent(atob(decodeURIComponent(raw.slice(4))));
                    } else if (raw.startsWith('uri_')) {
                        decodedStr = decodeURIComponent(raw.slice(4));
                    } else {
                        // Legacy format fallback
                        try {
                            decodedStr = decodeURIComponent(atob(decodeURIComponent(raw)));
                        } catch (_) {
                            if (typeof LZString !== 'undefined') {
                                decodedStr = LZString.decompressFromEncodedURIComponent(raw);
                            }
                        }
                    }

                    if (decodedStr) {
                        const data = JSON.parse(decodedStr);
                        const editors = getEditorInstances();
                        if (data.h !== undefined && editors.html) editors.html.setValue(data.h);
                        if (data.c !== undefined && editors.css) editors.css.setValue(data.c);
                        if (data.j !== undefined && editors.js) editors.js.setValue(data.j);
                        triggerUpdatePreview();
                        showPfToast('🔗 Code successfully restored from permalink!');

                        // Automatically launch Fullscreen Live Output if view=output or view=preview is specified
                        if (hash.includes('view=output') || hash.includes('view=preview')) {
                            setTimeout(() => {
                                toggleFullscreenPreview();
                            }, 350);
                        }
                        return true;
                    }
                }
            } catch (e) {
                console.warn('Permalink restore error:', e);
            }
        }
        return false;
    }

    // -------------------------------------------------------------
    // 9. TEXT-TO-SPEECH (TTS) CODE & QUIZ READER
    // -------------------------------------------------------------
    let ttsSpeaking = false;
    let ttsSpeed = 1.0;

    function populateVoices() {
        if (!('speechSynthesis' in window)) return;
        const voiceSelect = document.getElementById('pf-tts-voice-select');
        if (!voiceSelect) return;

        const voices = window.speechSynthesis.getVoices();
        voiceSelect.innerHTML = voices
            .filter(v => v.lang.startsWith('en'))
            .map((v, i) => `<option value="${v.name}">${v.name} (${v.lang})</option>`)
            .join('');
    }

    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = populateVoices;
    }

    function toggleTTSWidget() {
        const widget = document.getElementById('pf-tts-widget');
        if (widget) {
            widget.classList.toggle('open');
            populateVoices();
        }
    }

    function speakText(text) {
        if (!('speechSynthesis' in window)) {
            showPfToast('Text-to-speech is not supported in this browser.');
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = ttsSpeed;

        const voiceSelect = document.getElementById('pf-tts-voice-select');
        if (voiceSelect && voiceSelect.value) {
            const selectedVoice = window.speechSynthesis.getVoices().find(v => v.name === voiceSelect.value);
            if (selectedVoice) utterance.voice = selectedVoice;
        }

        const widget = document.getElementById('pf-tts-widget');
        const ttsBtn = document.getElementById('pf-tts-btn');

        utterance.onstart = () => {
            ttsSpeaking = true;
            if (widget) widget.classList.add('speaking');
            if (ttsBtn) ttsBtn.classList.add('speaking');
            const playBtn = document.getElementById('pf-tts-play-btn');
            if (playBtn) playBtn.innerText = '⏸️ Pause';
        };

        utterance.onend = utterance.onerror = () => {
            ttsSpeaking = false;
            if (widget) widget.classList.remove('speaking');
            if (ttsBtn) ttsBtn.classList.remove('speaking');
            const playBtn = document.getElementById('pf-tts-play-btn');
            if (playBtn) playBtn.innerText = '▶️ Speak';
        };

        window.speechSynthesis.speak(utterance);
    }

    function triggerTTSAction() {
        if (ttsSpeaking) {
            window.speechSynthesis.cancel();
            ttsSpeaking = false;
            const widget = document.getElementById('pf-tts-widget');
            if (widget) widget.classList.remove('speaking');
            const playBtn = document.getElementById('pf-tts-play-btn');
            if (playBtn) playBtn.innerText = '▶️ Speak';
            return;
        }

        const modeSelect = document.getElementById('pf-tts-mode-select');
        const mode = modeSelect ? modeSelect.value : 'explain';

        if (mode === 'quiz') {
            speakCurrentQuizQuestion();
        } else if (mode === 'code') {
            // Read active code cleanly
            const editors = getEditorInstances();
            const activeCode = (editors.html && editors.html.getValue()) || '';
            const clean = activeCode.replace(/</g, ' tag ').replace(/>/g, ' ').slice(0, 500);
            speakText(`Reading HTML code snippet. ${clean}`);
        } else {
            // Educational explanation
            const editors = getEditorInstances();
            const htmlLen = editors.html ? editors.html.getValue().length : 0;
            const cssLen = editors.css ? editors.css.getValue().length : 0;
            const jsLen = editors.js ? editors.js.getValue().length : 0;
            speakText(`Welcome to Code Playground. Your project currently has ${htmlLen} characters of HTML structure, ${cssLen} characters of CSS styles, and ${jsLen} characters of JavaScript logic. Click Play to test your live output in the preview window!`);
        }
    }

    function setTTSSpeed(rate) {
        ttsSpeed = rate;
        showPfToast(`Speech rate set to ${rate}x`);
    }

    // -------------------------------------------------------------
    // 10. POPUP FILL IN THE BLANKS (MULTIPLE BLANKS PER QUESTION)
    // -------------------------------------------------------------
    function renderQuiz(index) {
        if (index < 0 || index >= currentQuizList.length) return;
        activeQuizIndex = index;
        const q = currentQuizList[index];

        // Meta info
        const metaEl = document.getElementById('pf-quiz-meta');
        if (metaEl) {
            metaEl.innerHTML = `
                <span class="pf-quiz-badge ${q.badgeClass || 'pf-badge-html'}">${q.category}</span>
                <span class="pf-quiz-badge" style="background: rgba(255,255,255,0.08); color: #cbd5e1;">Difficulty: ${q.difficulty}</span>
                <span style="font-size: 12px; color: #94a3b8; margin-left: auto;">Question ${index + 1} of ${currentQuizList.length}</span>
            `;
        }

        const titleEl = document.getElementById('pf-quiz-title-text');
        if (titleEl) titleEl.innerText = q.title;

        // Render template with multiple blanks
        const sentenceEl = document.getElementById('pf-quiz-sentence');
        if (sentenceEl) {
            let parsedText = q.template;

            q.blanks.forEach((b, bIdx) => {
                // Shuffle options
                const shuffledOpts = [...b.options].sort(() => 0.5 - Math.random());
                const selectHtml = `
                    <span class="pf-quiz-blank" id="pf-blank-wrap-${b.id}">
                        <select id="pf-blank-sel-${b.id}" class="quiz-blank-select" onchange="window.PlaygroundFeatures.onBlankChange('${b.id}')">
                            <option value="">[ Blank ${bIdx + 1} ]</option>
                            ${shuffledOpts.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                        <span class="pf-quiz-blank-hint" id="pf-blank-hint-${b.id}">Answer: ${b.answer}</span>
                    </span>
                `;
                parsedText = parsedText.replace(`[${b.id}]`, selectHtml);
            });

            sentenceEl.innerHTML = parsedText;
        }

        // Render word bank chips
        const wordBankEl = document.getElementById('pf-quiz-word-bank');
        if (wordBankEl) {
            const allWords = q.blanks.map(b => b.answer).sort(() => 0.5 - Math.random());
            wordBankEl.innerHTML = allWords.map(w => `
                <button class="pf-word-chip" onclick="window.PlaygroundFeatures.fillNextEmptyBlank('${w}')">
                    + ${w}
                </button>
            `).join('');
        }

        // Hide feedback
        const feedbackEl = document.getElementById('pf-quiz-feedback');
        if (feedbackEl) feedbackEl.className = 'pf-quiz-feedback';

        // Update dots
        renderQuizDots();
    }

    function renderQuizDots() {
        const dotsWrap = document.getElementById('pf-quiz-dots');
        if (!dotsWrap) return;
        dotsWrap.innerHTML = currentQuizList.map((_, i) => `
            <div class="pf-quiz-dot ${i === activeQuizIndex ? 'active' : ''}" onclick="window.PlaygroundFeatures.renderQuiz(${i})"></div>
        `).join('');
    }

    function onBlankChange(blankId) {
        const wrap = document.getElementById(`pf-blank-wrap-${blankId}`);
        if (wrap) {
            wrap.classList.remove('is-correct', 'is-incorrect');
        }
    }

    function fillNextEmptyBlank(word) {
        const q = currentQuizList[activeQuizIndex];
        for (const b of q.blanks) {
            const sel = document.getElementById(`pf-blank-sel-${b.id}`);
            if (sel && !sel.value) {
                sel.value = word;
                onBlankChange(b.id);
                return;
            }
        }
    }

    function checkQuizAnswers() {
        const q = currentQuizList[activeQuizIndex];
        let correctCount = 0;

        q.blanks.forEach(b => {
            const sel = document.getElementById(`pf-blank-sel-${b.id}`);
            const wrap = document.getElementById(`pf-blank-wrap-${b.id}`);
            if (!sel || !wrap) return;

            const userVal = sel.value.trim().toLowerCase();
            const expectedVal = b.answer.trim().toLowerCase();

            if (userVal === expectedVal) {
                correctCount++;
                wrap.classList.add('is-correct');
                wrap.classList.remove('is-incorrect');
            } else {
                wrap.classList.add('is-incorrect');
                wrap.classList.remove('is-correct');
            }
        });

        const feedbackEl = document.getElementById('pf-quiz-feedback');
        if (feedbackEl) {
            const total = q.blanks.length;
            const isAllCorrect = correctCount === total;
            feedbackEl.className = `pf-quiz-feedback show ${isAllCorrect ? 'success' : 'partial'}`;
            feedbackEl.innerHTML = `
                <div style="font-weight: 700; margin-bottom: 6px;">
                    ${isAllCorrect ? '🎉 Outstanding! All blanks correct!' : `💡 Score: ${correctCount} of ${total} correct.`}
                </div>
                <div>${q.explanation}</div>
                <div class="pf-quiz-code-preview">
                    <pre><code>${q.codeSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                </div>
                <button class="pf-btn pf-btn-samples" style="margin-top: 10px;" onclick="window.PlaygroundFeatures.tryQuizCode()">
                    🚀 Try this in Playground Editor
                </button>
            `;
        }
    }

    function tryQuizCode() {
        const q = currentQuizList[activeQuizIndex];
        const editors = getEditorInstances();

        if (q.category === 'HTML' && editors.html) {
            editors.html.setValue(q.codeSnippet);
        } else if (q.category === 'CSS' && editors.css) {
            editors.css.setValue(q.codeSnippet);
        } else if (q.category === 'JavaScript' && editors.js) {
            editors.js.setValue(q.codeSnippet);
        }

        triggerUpdatePreview();
        closeModal('pf-quiz-modal');
        showPfToast(`Loaded ${q.title} example into editor!`);
    }

    function speakCurrentQuizQuestion() {
        const q = currentQuizList[activeQuizIndex];
        if (!q) return;
        // Clean speech text
        let spoken = q.template;
        q.blanks.forEach((b, i) => {
            spoken = spoken.replace(`[${b.id}]`, `blank ${i + 1}`);
        });
        speakText(`Question: ${q.title}. ${spoken}`);
    }

    function nextQuizQuestion() {
        if (activeQuizIndex < currentQuizList.length - 1) {
            renderQuiz(activeQuizIndex + 1);
        } else {
            renderQuiz(0);
        }
    }

    function prevQuizQuestion() {
        if (activeQuizIndex > 0) {
            renderQuiz(activeQuizIndex - 1);
        } else {
            renderQuiz(currentQuizList.length - 1);
        }
    }

    function toggleCustomJsonPanel() {
        const panel = document.getElementById('pf-custom-json-panel');
        const textarea = document.getElementById('pf-custom-json-textarea');
        if (!panel || !textarea) return;

        if (panel.classList.contains('open')) {
            panel.classList.remove('open');
        } else {
            textarea.value = JSON.stringify(currentQuizList, null, 2);
            panel.classList.add('open');
        }
    }

    function applyCustomJson() {
        const textarea = document.getElementById('pf-custom-json-textarea');
        if (!textarea) return;
        try {
            const parsed = JSON.parse(textarea.value);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].template && parsed[0].blanks) {
                currentQuizList = parsed;
                activeQuizIndex = 0;
                renderQuiz(0);
                toggleCustomJsonPanel();
                showPfToast(`✅ Loaded ${parsed.length} custom quiz questions!`);
            } else {
                alert('Invalid JSON: Must be an array of questions with "template" and "blanks".');
            }
        } catch (err) {
            alert('JSON syntax error: ' + err.message);
        }
    }

    // -------------------------------------------------------------
    // 11. MODAL OPEN/CLOSE HELPERS
    // -------------------------------------------------------------
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('open');
        }
    }

    // -------------------------------------------------------------
    // 12. INITIALIZATION ON PAGE LOAD / REFRESH
    // -------------------------------------------------------------
    function init() {
        const isSharedLink = window.location.hash && window.location.hash.includes('code=');

        // 1. Check for permalink code in URL hash
        checkAndLoadPermalink();

        // 2. Render initial quiz question
        renderQuiz(0);

        // 3. AUTO POPUP ON EVERY PAGE REFRESH (only when NOT opening a shared code link):
        if (!isSharedLink) {
            setTimeout(() => {
                openModal('pf-quiz-modal');
            }, 600);
        }

        // 4. Keyboard Esc closes modals & fullscreen
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal('pf-quiz-modal');
                closeModal('pf-share-modal');
                closeModal('pf-samples-modal');
                closeFullscreenPreview();
            }
        });
    }

    // Expose API to window for button onclick attributes
    window.PlaygroundFeatures = {
        loadSample,
        openSamplesModal,
        togglePhonePreview,
        setPhoneDevice,
        togglePhoneOrientation,
        toggleFullscreenPreview,
        closeFullscreenPreview,
        buildPreviewDoc,
        openShareModal,
        setShareHost,
        setShareView,
        updateWifiIp,
        updateCloudUrl,
        toggleZoomQr,
        downloadQrImage,
        testPermalink,
        copyPermalink,
        toggleTTSWidget,
        triggerTTSAction,
        setTTSSpeed,
        renderQuiz,
        checkQuizAnswers,
        tryQuizCode,
        speakCurrentQuizQuestion,
        nextQuizQuestion,
        prevQuizQuestion,
        onBlankChange,
        fillNextEmptyBlank,
        toggleCustomJsonPanel,
        applyCustomJson,
        openModal,
        closeModal
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
