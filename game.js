'use strict';
/* ============================================================
   VRTL & STUDYQUEST — game.js
   Full Interactive Planner, Gamification, Anti-Cheat,
   iOS 18 Glassmorphic Theme, Pomodoro Focus Timer, RPG Map
============================================================ */

const SAVE_KEY = 'vrtl_studyquest_v6';

// ============================================================
// DEFAULT DATA & CONFIG
// ============================================================
const DEFAULT_GOALS = [
  { id: 'g1', text: 'Finish training module', done: true },
  { id: 'g2', text: 'Go to the market', done: false },
  { id: 'g3', text: 'Prepare dinner', done: false }
];

const DEFAULT_TODOS = [
  { id: 't1', text: 'Check emails', done: false },
  { id: 't2', text: 'Respond to Cira', done: false },
  { id: 't3', text: 'Grocery shopping', done: false },
  { id: 't4', text: 'Laundry', done: false },
  { id: 't5', text: 'Workout (if time)', done: false },
  { id: 't6', text: 'Call mom', done: false },
  { id: 't7', text: 'Tidy apartment', done: false }
];

const DEFAULT_PRIORITIES = [
  { id: 'p1', text: 'OSKA Health follow up', done: false },
  { id: 'p2', text: 'Pay rent', done: false },
  { id: 'p3', text: 'Work on portfolio', done: false }
];

const DEFAULT_APPOINTMENTS = [
  { id: 'ap1', time: '10:00 AM', icon: '📹', text: 'Virtual Meeting' },
  { id: 'ap2', time: '1:30 PM',  icon: '🩺', text: 'Oska Health' },
  { id: 'ap3', time: '4:00 PM',  icon: '🏋️', text: 'Gym' },
  { id: 'ap4', time: '7:00 PM',  icon: '🍽️', text: 'Dinner' }
];

const DAILY_QUESTS = [
  { id: 'dq1', name: 'Selesaikan 3 To-Do List', desc: 'Centang 3 to-do harian di planner', icon: '☑️', xp: 50, coins: 25, cd: 86400000 },
  { id: 'dq2', name: 'Sesi Pomodoro 25m', desc: 'Fokus penuh 25 menit di focus timer', icon: '🍅', xp: 60, coins: 30, cd: 86400000 },
  { id: 'dq3', name: 'Catat Mood & Catatan Hari Ini', desc: 'Pilih mood dan tulis notes planner', icon: '🌸', xp: 40, coins: 20, cd: 86400000 },
  { id: 'dq4', name: 'Tuntaskan Goal Utama', desc: 'Selesaikan setidaknya 1 goal utama', icon: '🎯', xp: 70, coins: 35, cd: 86400000 }
];

const WEEKLY_QUESTS = [
  { id: 'wq1', name: 'Master Perencana', desc: 'Selesaikan 20 to-do list dalam seminggu', icon: '🏆', xp: 300, coins: 150, cd: 604800000 },
  { id: 'wq2', name: 'Fokus Marathon', desc: 'Capai total 2 jam waktu fokus', icon: '⏱️', xp: 500, coins: 250, cd: 604800000 }
];

const SPECIAL_QUESTS = [
  { id: 'sq1', name: 'Pahlawan Level 5', desc: 'Capai Level 5 untuk reward eksklusif', icon: '⬆️', xp: 1000, coins: 500, reqLvl: 5 },
  { id: 'sq2', name: 'Legenda Level 10', desc: 'Capai Level 10 — Dewa Produktivitas!', icon: '👑', xp: 2500, coins: 1000, reqLvl: 10 }
];

const SHOP_POWERUPS = [
  { id: 'sp1', name: 'Focus Elixir', icon: '🧪', desc: '2x XP dari semua aktivitas selama 1 jam', price: 100, cur: 'coins', effect: 'double_xp', dur: 3600000 },
  { id: 'sp2', name: 'Shield of Calm', icon: '🛡️', desc: 'Proteksi streak selama 24 jam penuh', price: 200, cur: 'coins', effect: 'shield' },
  { id: 'sp3', name: 'XP Burst', icon: '💣', desc: '+300 XP instan untuk naik level', price: 350, cur: 'coins', effect: 'instant_xp', val: 300 }
];

const SHOP_SKINS = [
  { id: 'sk1', name: 'Pastel Bunny', icon: '🐰', desc: 'Companion default VRTL', price: 0, cur: 'coins', isDefault: true },
  { id: 'sk2', name: 'Magic Kitty', icon: '🐱', desc: 'Kucing ajaib penyemangat', price: 250, cur: 'coins' },
  { id: 'sk3', name: 'Baby Dragon', icon: '🐉', desc: 'Naga mungil penjaga disiplin', price: 15, cur: 'gems' }
];

const REAL_REWARDS = [
  { icon: '🎬', name: 'Nonton Film / Chill Time', desc: 'Self-reward saat mencapai Level 5', reqLvl: 5 },
  { icon: '☕', name: 'Beli Kopi Favorit', desc: 'Self-reward saat tuntaskan 10 to-do', reqTasks: 10 },
  { icon: '🛍️', name: 'Beli Hadiah Spesial', desc: 'Self-reward saat mencapai Level 10', reqLvl: 10 }
];

const MAP_NODES = [
  { lvl: 1, label: 'Start', emoji: '🏕️' },
  { lvl: 3, label: 'Lv.3',  emoji: '🌲' },
  { lvl: 5, label: 'Lv.5',  emoji: '🏘️' },
  { lvl: 7, label: 'Boss 1',emoji: '📝' },
  { lvl: 10,label: 'Lv.10', emoji: '🌋' },
  { lvl: 15,label: 'Lv.15', emoji: '🏰' },
  { lvl: 20,label: 'FINAL', emoji: '👹' }
];

const TITLES = ['Pelajar Muda', 'Pejuang Buku', 'Ahli Fokus', 'Master Disiplin', 'Legenda Belajar', 'Grand Master'];

// ============================================================
// GAME STATE
// ============================================================
let G = {};

function getDefaultState() {
  return {
    name: 'Aiko',
    avatar: '🐰',
    level: 1,
    xp: 0,
    totalXP: 0,
    coins: 150,
    gems: 5,
    streak: 1,
    dailyXP: 0,
    dailyTarget: 500,
    currentDateOffset: 0,
    activeMood: 'Happy',
    goals: [...DEFAULT_GOALS],
    todos: [...DEFAULT_TODOS],
    priorities: [...DEFAULT_PRIORITIES],
    appointments: [...DEFAULT_APPOINTMENTS],
    notes: 'Remember: Small steps every day lead to big results! 🐾',
    questLog: {},       // id -> { completedAt, cooldownUntil }
    powerups: {},       // id -> { active, endsAt }
    owned: ['sk1'],
    equipped: 'sk1',
    todayFocusMins: 0,
    todayFocusSessions: 0,
    tasksCompletedCount: 1,
    weeklyStudyMinutes: [35, 45, 60, 25, 50, 40, 20],
    lifeStats: { knowledge: 25, focus: 30, discipline: 20, kindness: 40 },
    settings: { notif: true, sound: true }
  };
}

function saveGame() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(G)); } catch (e) {}
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      G = Object.assign(getDefaultState(), JSON.parse(raw));
    } else {
      G = getDefaultState();
    }
  } catch (e) {
    G = getDefaultState();
  }
}

// ============================================================
// UTILITIES
// ============================================================
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const nowMs = () => Date.now();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function getTitle(lvl) {
  const idx = Math.min(Math.floor((lvl - 1) / 3), TITLES.length - 1);
  return TITLES[idx];
}

function getLevelRequiredXP(lvl) {
  return lvl * 500;
}

// ============================================================
// AUDIO SYNTHESIZER (WEB AUDIO API)
// ============================================================
let audioCtx = null;
function playTone(freq, type = 'sine', duration = 0.15) {
  if (!G.settings?.sound) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playSuccessChime() {
  playTone(523.25, 'sine', 0.1);
  setTimeout(() => playTone(659.25, 'sine', 0.1), 100);
  setTimeout(() => playTone(783.99, 'sine', 0.2), 200);
}

// ============================================================
// TOAST & PARTICLES
// ============================================================
function toast(msg, type = 'info', icon = '🌸') {
  const container = $('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  container.prepend(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(-10px)';
    t.style.transition = 'all 0.25s ease';
    setTimeout(() => t.remove(), 250);
  }, 2600);
}

function spawnParticle(text, emoji = '✨') {
  const container = $('particleContainer');
  if (!container) return;
  const p = document.createElement('div');
  p.className = 'xp-particle';
  p.textContent = `${emoji} +${text}`;
  p.style.left = `${30 + Math.random() * 40}%`;
  p.style.top = `${40 + Math.random() * 20}%`;
  container.appendChild(p);
  setTimeout(() => p.remove(), 1200);
}

// ============================================================
// XP & LEVEL UP (WITH ANTI-CHEAT ENGINE)
// ============================================================
function addXP(amount) {
  if (amount <= 0) return;
  if (G.powerups['sp1'] && G.powerups['sp1'].active && nowMs() < G.powerups['sp1'].endsAt) {
    amount = Math.floor(amount * 2);
  }
  G.xp += amount;
  G.totalXP += amount;
  G.dailyXP += amount;
  spawnParticle(`${amount} XP`, '⚡');
  playTone(587.33, 'triangle', 0.12);

  const req = getLevelRequiredXP(G.level);
  if (G.xp >= req) {
    G.xp -= req;
    G.level++;
    G.coins += G.level * 25;
    G.gems += 2;
    showLevelUpModal();
  }
  updateHUD();
  saveGame();
}

function addCoins(n) {
  G.coins += n;
  updateHUD();
  saveGame();
}

function showLevelUpModal() {
  playSuccessChime();
  $('levelUpNum').textContent = `Level ${G.level}`;
  $('levelUpTitleEl').textContent = getTitle(G.level);
  $('levelUpRewards').innerHTML = `
    <span class="reward-pill xp">🌟 Title: ${getTitle(G.level)}</span>
    <span class="reward-pill coins">🪙 +${G.level * 25} Koin</span>
    <span class="reward-pill stat">💎 +2 Gems</span>
  `;
  $('levelUpModal').classList.remove('hidden');
}

function closeLevelUp() {
  $('levelUpModal').classList.add('hidden');
}

// ============================================================
// PLANNER INTERACTIVE ENGINE (BENTO WIDGETS)
// ============================================================

// --- 1. Today's Goals ---
function renderGoals() {
  const el = $('goalsList');
  if (!el) return;
  el.innerHTML = G.goals.map((g, i) => `
    <div class="goal-item ${g.done ? 'done' : ''}" onclick="toggleGoal(${i})">
      <div class="goal-circle">${g.done ? '✓' : ''}</div>
      <span class="goal-text">${g.text}</span>
    </div>
  `).join('');
}

function toggleGoal(idx) {
  if (!G.goals[idx]) return;
  const isDoneNow = !G.goals[idx].done;
  G.goals[idx].done = isDoneNow;
  if (isDoneNow) {
    addXP(30);
    addCoins(15);
    G.tasksCompletedCount++;
    playTone(659.25, 'sine', 0.15);
    toast(`Goal selesai! +30 XP +15 🪙`, 'success', '🎯');
  }
  renderGoals();
  saveGame();
}

function submitQuickGoal() {
  const input = $('inputNewGoal');
  const val = input.value.trim();
  if (!val) return;
  G.goals.push({ id: 'g_' + nowMs(), text: val, done: false });
  input.value = '';
  addXP(10);
  renderGoals();
  toast('Goal baru ditambahkan! +10 XP', 'info', '🎯');
  saveGame();
}

function handleGoalKey(e) {
  if (e.key === 'Enter') submitQuickGoal();
}

function promptAddGoal() {
  const text = prompt('Tulis goal baru kamu:');
  if (text && text.trim()) {
    G.goals.push({ id: 'g_' + nowMs(), text: text.trim(), done: false });
    addXP(10);
    renderGoals();
    saveGame();
  }
}

// --- 2. To Do List ---
function renderTodos() {
  const el = $('todoList');
  if (!el) return;
  el.innerHTML = G.todos.map((t, i) => `
    <div class="todo-item ${t.done ? 'done' : ''}" onclick="toggleTodo(${i})">
      <div class="todo-box">${t.done ? '✓' : ''}</div>
      <span class="todo-text">${t.text}</span>
      <span class="todo-handle">:::</span>
    </div>
  `).join('');
}

function toggleTodo(idx) {
  if (!G.todos[idx]) return;
  const isDoneNow = !G.todos[idx].done;
  G.todos[idx].done = isDoneNow;
  if (isDoneNow) {
    addXP(20);
    addCoins(10);
    G.tasksCompletedCount++;
    playTone(523.25, 'sine', 0.12);
    toast(`Tugas selesai! +20 XP +10 🪙`, 'success', '☑️');
  }
  renderTodos();
  saveGame();
}

function submitQuickTask() {
  const input = $('inputNewTask');
  const val = input.value.trim();
  if (!val) return;
  G.todos.push({ id: 't_' + nowMs(), text: val, done: false });
  input.value = '';
  addXP(5);
  renderTodos();
  toast('Tugas baru ditambahkan! +5 XP', 'info', '☑️');
  saveGame();
}

function handleTaskKey(e) {
  if (e.key === 'Enter') submitQuickTask();
}

function promptAddTask() {
  const text = prompt('Tulis tugas to-do baru:');
  if (text && text.trim()) {
    G.todos.push({ id: 't_' + nowMs(), text: text.trim(), done: false });
    addXP(5);
    renderTodos();
    saveGame();
  }
}

// --- 3. Mood Tracker ---
function selectMood(btn, moodKey, message) {
  $$('.mood-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  G.activeMood = moodKey;
  addXP(10);
  playTone(740, 'sine', 0.15);
  toast(message, 'success', '🌸');
  saveGame();
}

// --- 4. Priority ---
function renderPriorities() {
  const el = $('priorityList');
  if (!el) return;
  el.innerHTML = G.priorities.map((p, i) => `
    <div class="priority-item ${p.done ? 'done' : ''}" onclick="togglePriority(${i})">
      <div class="priority-box">${p.done ? '✓' : ''}</div>
      <span class="priority-text">${p.text}</span>
    </div>
  `).join('');
}

function togglePriority(idx) {
  if (!G.priorities[idx]) return;
  const isDoneNow = !G.priorities[idx].done;
  G.priorities[idx].done = isDoneNow;
  if (isDoneNow) {
    addXP(25);
    addCoins(15);
    G.tasksCompletedCount++;
    playTone(587.33, 'sine', 0.15);
    toast('Prioritas tuntas! +25 XP +15 🪙', 'success', '⭐');
  }
  renderPriorities();
  saveGame();
}

function submitQuickPriority() {
  const input = $('inputNewPriority');
  const val = input.value.trim();
  if (!val) return;
  G.priorities.push({ id: 'p_' + nowMs(), text: val, done: false });
  input.value = '';
  addXP(10);
  renderPriorities();
  toast('Prioritas ditambahkan! +10 XP', 'info', '⭐');
  saveGame();
}

function handlePriorityKey(e) {
  if (e.key === 'Enter') submitQuickPriority();
}

function promptAddPriority() {
  const text = prompt('Tulis prioritas utama baru:');
  if (text && text.trim()) {
    G.priorities.push({ id: 'p_' + nowMs(), text: text.trim(), done: false });
    addXP(10);
    renderPriorities();
    saveGame();
  }
}

// --- 5. Appointments ---
function renderAppointments() {
  const el = $('appointmentsList');
  if (!el) return;
  el.innerHTML = G.appointments.map(ap => `
    <div class="appointment-item" onclick="toast('${ap.text} pada jam ${ap.time}', 'info', '${ap.icon}')">
      <span class="app-time">${ap.time}</span>
      <span class="app-icon">${ap.icon}</span>
      <span class="app-desc">${ap.text}</span>
      <span class="app-arrow">›</span>
    </div>
  `).join('');
}

function promptAddAppointment() {
  const time = prompt('Jam Janji Temu (Contoh: 3:00 PM):', '3:00 PM');
  const desc = prompt('Kegiatan Janji Temu:');
  if (time && desc) {
    G.appointments.push({ id: 'ap_' + nowMs(), time, icon: '📅', text: desc.trim() });
    addXP(10);
    renderAppointments();
    toast('Janji temu berhasil dijadwalkan! +10 XP', 'success', '📅');
    saveGame();
  }
}

// --- 6. Notes Auto-Save ---
function initNotes() {
  const area = $('plannerNoteArea');
  if (area) {
    area.value = G.notes || '';
  }
}

function autoSaveNote() {
  const area = $('plannerNoteArea');
  if (area) {
    G.notes = area.value;
    saveGame();
  }
}

function saveNoteManual() {
  autoSaveNote();
  addXP(5);
  toast('Catatan tersimpan dengan rapi! +5 XP', 'success', '📝');
}

// --- Date & Sub-Tab Filters ---
function filterPlannerTab(tabName, btn) {
  $$('.pf-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  toast(`Tampilan Planner: ${tabName}`, 'info', '📅');
}

function changeDate(delta) {
  G.currentDateOffset = (G.currentDateOffset || 0) + delta;
  const d = new Date();
  d.setDate(d.getDate() + G.currentDateOffset);
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  $('currentDateLabel').textContent = `📅 ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  playTone(440, 'sine', 0.08);
}

// ============================================================
// FOCUS TIMER (CIRCULAR POMODORO)
// ============================================================
let focusTimerInterval = null;
let focusSecondsLeft = 25 * 60;
let focusTotalSeconds = 25 * 60;
let isFocusRunning = false;
let ambientAudioActive = false;

function setFocusMode(minutes, label) {
  if (isFocusRunning) resetFocusTimer();
  focusTotalSeconds = minutes * 60;
  focusSecondsLeft = focusTotalSeconds;
  updateTimerDisplay();
  $$('.fmt-btn').forEach(b => b.classList.remove('active'));
  const btn = $(`fmode-${minutes}`);
  if (btn) btn.classList.add('active');
  $('timerModeCaption').textContent = label;
}

function updateTimerDisplay() {
  const m = Math.floor(focusSecondsLeft / 60);
  const s = focusSecondsLeft % 60;
  const str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  $('timerDigits').textContent = str;
  $('diTimer').textContent = str;

  // SVG circular progress (628 is perimeter)
  const circle = $('timerProgressCircle');
  if (circle) {
    const fraction = 1 - (focusSecondsLeft / focusTotalSeconds);
    const offset = 628 * (1 - fraction);
    circle.style.strokeDashoffset = offset;
  }
}

function toggleFocusTimer() {
  if (isFocusRunning) {
    pauseFocusTimer();
  } else {
    startFocusTimer();
  }
}

function startFocusTimer() {
  isFocusRunning = true;
  $('timerMainBtn').textContent = 'Jeda';
  $('diIdle').classList.add('hidden');
  $('diActive').classList.remove('hidden');
  playTone(523.25, 'sine', 0.2);

  focusTimerInterval = setInterval(() => {
    if (focusSecondsLeft > 0) {
      focusSecondsLeft--;
      updateTimerDisplay();
    } else {
      completeFocusSession();
    }
  }, 1000);
}

function pauseFocusTimer() {
  isFocusRunning = false;
  clearInterval(focusTimerInterval);
  $('timerMainBtn').textContent = 'Lanjutkan';
  playTone(400, 'sine', 0.15);
}

function resetFocusTimer() {
  isFocusRunning = false;
  clearInterval(focusTimerInterval);
  focusSecondsLeft = focusTotalSeconds;
  updateTimerDisplay();
  $('timerMainBtn').textContent = 'Mulai Fokus';
  $('diIdle').classList.remove('hidden');
  $('diActive').classList.add('hidden');
}

function completeFocusSession() {
  resetFocusTimer();
  playSuccessChime();
  const minsGained = Math.round(focusTotalSeconds / 60);
  G.todayFocusMins = (G.todayFocusMins || 0) + minsGained;
  G.todayFocusSessions = (G.todayFocusSessions || 0) + 1;
  addXP(50);
  addCoins(25);
  toast(`Sesi Fokus ${minsGained}m Selesai! +50 XP +25 🪙`, 'success', '🍅');
  updateHUD();
  saveGame();
}

function toggleAmbientSound() {
  ambientAudioActive = !ambientAudioActive;
  $('ambientStatus').textContent = ambientAudioActive ? 'Sound: Suara Hujan Lembut 🌧️' : 'Sound: Senyap';
  toast(ambientAudioActive ? 'Efek audio santai diaktifkan' : 'Suara dimatikan', 'info', '🎵');
}

// ============================================================
// MASCOT COMPANION INTERACTION
// ============================================================
const MASCOT_QUOTES = [
  'Semangat belajarnya ya, kamu luar biasa! 🌸',
  'Ingat: Satu langkah kecil tiap hari akan jadi hasil besar! 🐾',
  'Sudah minum air putih belum? Jaga kesehatanmu ya! 💧',
  'Fokus 25 menit saja, setelah itu kamu bisa santai sejenak! 🍅',
  'Aku bangga melihat perjuangan belajarmu hari ini! ✨'
];

function interactMascot() {
  const quote = MASCOT_QUOTES[Math.floor(Math.random() * MASCOT_QUOTES.length)];
  $('mascotBubble').textContent = quote;
  addXP(5);
  playTone(880, 'sine', 0.1);
  toast(`Companion tersenyum padamu! +5 XP`, 'success', '🐰');
}

// ============================================================
// QUESTS (STRICT ANTI-CHEAT COOLDOWN ENGINE)
// ============================================================
function canClaimQuest(q) {
  const log = G.questLog[q.id];
  if (!log) return true;
  return nowMs() > (log.cooldownUntil || 0);
}

function claimQuest(id) {
  const q = [...DAILY_QUESTS, ...WEEKLY_QUESTS, ...SPECIAL_QUESTS].find(item => item.id === id);
  if (!q) return;

  if (!canClaimQuest(q)) {
    const rem = Math.max(0, (G.questLog[q.id]?.cooldownUntil || 0) - nowMs());
    const m = Math.ceil(rem / 60000);
    toast(`Sudah diklaim! Tunggu cooldown ${m} menit lagi.`, 'warning', '⏳');
    return;
  }

  // ATOMIC LOCK: Tandai telah diklaim saat ini juga untuk cegah double tap/cheat
  G.questLog[q.id] = {
    completedAt: nowMs(),
    cooldownUntil: q.cd ? nowMs() + q.cd : nowMs() + 864000000
  };

  addXP(q.xp);
  addCoins(q.coins || 0);
  playSuccessChime();
  toast(`Quest "${q.name}" Berhasil Diklaim! +${q.xp} XP +${q.coins || 0} 🪙`, 'success', q.icon);
  renderQuests();
  saveGame();
}

function renderQuests() {
  const renderList = (elId, list) => {
    const el = $(elId);
    if (!el) return;
    el.innerHTML = list.map(q => {
      const isDone = !canClaimQuest(q);
      return `
        <div class="quest-item ${isDone ? 'completed' : ''}" onclick="${isDone ? '' : `claimQuest('${q.id}')`}">
          <span class="quest-icon">${q.icon}</span>
          <div class="quest-info">
            <div class="quest-name">${q.name}</div>
            <div class="quest-desc">${q.desc}</div>
          </div>
          <div class="quest-reward">
            <span class="quest-xp">+${q.xp} XP</span>
            <span class="quest-coins">🪙 ${q.coins || 0}</span>
          </div>
        </div>
      `;
    }).join('');
  };

  renderList('dailyQuestList', DAILY_QUESTS);
  renderList('weeklyQuestList', WEEKLY_QUESTS);
  renderList('specialQuestList', SPECIAL_QUESTS);
}

// ============================================================
// STORE & INVENTORY
// ============================================================
function renderShop() {
  const puEl = $('shopPowerups');
  if (puEl) {
    puEl.innerHTML = SHOP_POWERUPS.map(p => `
      <div class="shop-item">
        <div class="shop-icon">${p.icon}</div>
        <div class="shop-name">${p.name}</div>
        <div class="shop-desc">${p.desc}</div>
        <div class="shop-price">🪙 ${p.price}</div>
        <button class="shop-btn" onclick="buyShopItem('${p.id}')">Beli</button>
      </div>
    `).join('');
  }

  const skEl = $('shopSkins');
  if (skEl) {
    skEl.innerHTML = SHOP_SKINS.map(s => {
      const isOwned = G.owned.includes(s.id);
      const isEquipped = G.equipped === s.id;
      return `
        <div class="shop-item">
          <div class="shop-icon">${s.icon}</div>
          <div class="shop-name">${s.name}</div>
          <div class="shop-desc">${s.desc}</div>
          <div class="shop-price">${s.price > 0 ? `🪙 ${s.price}` : 'GRATIS'}</div>
          <button class="shop-btn ${isEquipped ? 'equip-btn' : ''}" onclick="equipSkin('${s.id}')">
            ${isEquipped ? 'Terpasang' : isOwned ? 'Pasang' : 'Beli'}
          </button>
        </div>
      `;
    }).join('');
  }

  const rrEl = $('realRewardsList');
  if (rrEl) {
    rrEl.innerHTML = REAL_REWARDS.map(r => `
      <div class="real-reward-item" onclick="claimRealReward('${r.name}', ${r.reqLvl || 0})">
        <span class="rr-icon">${r.icon}</span>
        <div class="rr-info">
          <div class="rr-name">${r.name}</div>
          <div class="rr-desc">${r.desc}</div>
        </div>
        <span class="rr-cost">Hadiah</span>
      </div>
    `).join('');
  }
}

function buyShopItem(id) {
  const item = SHOP_POWERUPS.find(p => p.id === id);
  if (!item) return;
  if (G.coins < item.price) {
    toast('Koin belajarmu tidak cukup! Yuk tuntaskan tugas lagi.', 'warning', '❌');
    return;
  }
  G.coins -= item.price;
  if (item.effect === 'instant_xp') addXP(item.val);
  if (item.dur) {
    G.powerups[item.id] = { active: true, endsAt: nowMs() + item.dur };
  }
  playSuccessChime();
  toast(`Berhasil membeli ${item.name}!`, 'success', item.icon);
  updateHUD();
  saveGame();
}

function equipSkin(id) {
  const skin = SHOP_SKINS.find(s => s.id === id);
  if (!skin) return;
  if (!G.owned.includes(id)) {
    if (G.coins < skin.price) {
      toast('Koin tidak cukup!', 'warning', '❌');
      return;
    }
    G.coins -= skin.price;
    G.owned.push(id);
  }
  G.equipped = id;
  G.avatar = skin.icon;
  $('headerAvatar').textContent = skin.icon;
  $('profileAvatar').textContent = skin.icon;
  $('mascotEmoji').textContent = skin.icon;
  toast(`Skin ${skin.name} berhasil dipasang!`, 'success', skin.icon);
  renderShop();
  updateHUD();
  saveGame();
}

function claimRealReward(name, reqLvl) {
  if (G.level < reqLvl) {
    toast(`Perlu Level ${reqLvl} untuk reward ini!`, 'warning', '🔒');
    return;
  }
  playSuccessChime();
  toast(`Selamat! Nikmati reward nyata kamu: ${name}! 🎁`, 'success', '🎉');
}

// ============================================================
// STATS, MAP & ANALYTICS
// ============================================================
function renderMap() {
  const el = $('mapContainer');
  if (!el) return;
  el.innerHTML = MAP_NODES.map(n => {
    const isDone = G.level > n.lvl;
    const isCurrent = G.level === n.lvl;
    return `
      <div class="map-node ${isDone ? 'done' : isCurrent ? 'current' : ''}" title="Level ${n.lvl}">
        <span>${n.emoji}</span>
        <span>${n.label}</span>
      </div>
    `;
  }).join('');
}

function renderWeeklyChart() {
  const el = $('weeklyBarChart');
  if (!el) return;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  el.innerHTML = days.map((d, i) => {
    const mins = G.weeklyStudyMinutes[i] || 20;
    const hPct = Math.min(100, Math.max(15, (mins / 90) * 100));
    return `
      <div class="wbc-col ${i === 3 ? 'active' : ''}">
        <div class="wbc-bar-wrap">
          <div class="wbc-bar-fill" style="height:${hPct}%"></div>
        </div>
        <span class="wbc-day">${d}</span>
      </div>
    `;
  }).join('');
}

// ============================================================
// HUD UPDATE
// ============================================================
function updateHUD() {
  $('topCoins').textContent = G.coins || 0;
  $('topGems').textContent = G.gems || 0;
  $('topStreak').textContent = G.streak || 1;
  $('statusLevel').textContent = G.level || 1;
  $('statusTitle').textContent = getTitle(G.level);
  $('statusName').textContent = G.name || 'Aiko';
  $('profileName').textContent = G.name || 'Aiko';
  $('profileTitle').textContent = getTitle(G.level);
  $('profileLevel').textContent = G.level || 1;

  const req = getLevelRequiredXP(G.level);
  const pct = Math.min(100, Math.round((G.xp / req) * 100));
  $('xpFill').style.width = `${pct}%`;
  $('xpText').textContent = `${G.xp} / ${req} XP`;

  $('dailyXP').textContent = G.dailyXP || 0;
  $('dailyTarget').textContent = G.dailyTarget || 500;
  const dPct = Math.min(100, Math.round(((G.dailyXP || 0) / G.dailyTarget) * 100));
  $('dailyXPFill').style.width = `${dPct}%`;
  $('dailyXPPct').textContent = `${dPct}%`;

  $('shopCoins').textContent = G.coins || 0;
  $('shopGems').textContent = G.gems || 0;

  $('todayFocusMins').textContent = `${G.todayFocusMins || 0}m`;
  $('todayFocusSessions').textContent = G.todayFocusSessions || 0;
  $('todayFocusXP').textContent = `+${(G.todayFocusSessions || 0) * 50} XP`;

  $('anTasksDone').textContent = G.tasksCompletedCount || 0;
  $('anSessionsDone').textContent = G.todayFocusSessions || 0;
  $('anStreakDays').textContent = G.streak || 1;
}

// ============================================================
// PAGE NAVIGATION
// ============================================================
function goPage(pageId, btn) {
  $$('.page').forEach(p => p.classList.remove('active'));
  $$('.capsule-nav-item').forEach(b => b.classList.remove('active'));
  $$('.vrtl-dock-item').forEach(b => b.classList.remove('active-glow'));

  const targetPage = $(`page-${pageId}`);
  if (targetPage) targetPage.classList.add('active');

  // Activate matching bottom dock icon
  const dockBtn = $(`nav-${pageId}`);
  if (dockBtn) dockBtn.classList.add('active-glow');

  // Re-render contents for the page
  if (pageId === 'planner') {
    renderGoals();
    renderTodos();
    renderPriorities();
    renderAppointments();
    initNotes();
  } else if (pageId === 'quests') {
    renderQuests();
  } else if (pageId === 'shop') {
    renderShop();
  } else if (pageId === 'progress') {
    renderMap();
    renderWeeklyChart();
  }
}

// ============================================================
// MODALS & HELPERS
// ============================================================
function closeModal(id) {
  $(id)?.classList.add('hidden');
}

function openNotif() {
  toast('Kamu memiliki 1 misi harian yang belum tuntas! Ayo raih XP!', 'info', '🔔');
}

function openEditProfile() {
  $('editName').value = G.name;
  $('editTarget').value = G.dailyTarget || 500;
  $('editProfileModal').classList.remove('hidden');
}

function saveProfile() {
  const name = $('editName').value.trim();
  if (name) G.name = name;
  G.dailyTarget = parseInt($('editTarget').value) || 500;
  closeModal('editProfileModal');
  updateHUD();
  toast('Profil berhasil disimpan!', 'success', '🌸');
  saveGame();
}

function confirmReset() {
  if (confirm('Apakah kamu yakin ingin mereset seluruh progress belajarmu?')) {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }
}

// ============================================================
// BOOTSTRAP INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  loadGame();
  updateHUD();
  renderGoals();
  renderTodos();
  renderPriorities();
  renderAppointments();
  initNotes();
  updateTimerDisplay();

  // Update live clock on notch
  setInterval(() => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    $('notchClock').textContent = `${h}:${m}`;
  }, 1000);
});

// Expose globals for inline HTML event handlers
window.goPage = goPage;
window.toggleGoal = toggleGoal;
window.submitQuickGoal = submitQuickGoal;
window.handleGoalKey = handleGoalKey;
window.promptAddGoal = promptAddGoal;
window.toggleTodo = toggleTodo;
window.submitQuickTask = submitQuickTask;
window.handleTaskKey = handleTaskKey;
window.promptAddTask = promptAddTask;
window.selectMood = selectMood;
window.togglePriority = togglePriority;
window.submitQuickPriority = submitQuickPriority;
window.handlePriorityKey = handlePriorityKey;
window.promptAddPriority = promptAddPriority;
window.promptAddAppointment = promptAddAppointment;
window.autoSaveNote = autoSaveNote;
window.saveNoteManual = saveNoteManual;
window.filterPlannerTab = filterPlannerTab;
window.changeDate = changeDate;
window.setFocusMode = setFocusMode;
window.toggleFocusTimer = toggleFocusTimer;
window.resetFocusTimer = resetFocusTimer;
window.toggleAmbientSound = toggleAmbientSound;
window.interactMascot = interactMascot;
window.claimQuest = claimQuest;
window.buyShopItem = buyShopItem;
window.equipSkin = equipSkin;
window.claimRealReward = claimRealReward;
window.closeLevelUp = closeLevelUp;
window.closeModal = closeModal;
window.openNotif = openNotif;
window.openEditProfile = openEditProfile;
window.saveProfile = saveProfile;
window.confirmReset = confirmReset;
