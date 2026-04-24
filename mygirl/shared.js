// ===== PARTICLE CANVAS =====
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Star particles
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random(),
      speed: Math.random() * 0.4 + 0.1,
      drift: (Math.random() - 0.5) * 0.3,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.a += p.speed * 0.02;
      if (p.a > 1) p.a = 0;
      p.x += p.drift;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,200,230,${Math.abs(Math.sin(p.a))})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== FLOATING HEARTS =====
const heartEmojis = ['💕','💖','💗','💓','💞','🌹','✨','💫','🌸'];
setInterval(() => {
  const h = document.createElement('div');
  h.className = 'fheart';
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = (Math.random() * 18 + 10) + 'px';
  const dur = Math.random() * 7 + 7;
  h.style.animationDuration = dur + 's';
  h.style.animationDelay = '0s';
  document.body.appendChild(h);
  setTimeout(() => h.remove(), dur * 1000);
}, 1200);

// ===== SCROLL REVEAL =====
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// ===== MUSIC (Web Audio API melody) =====
let audioCtx = null, musicPlaying = false, musicInterval = null;

function toggleMusic() {
  const btn = document.getElementById('musicOrb');
  if (!musicPlaying) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    playMelody();
    musicInterval = setInterval(playMelody, 7000);
    btn.textContent = '🎶';
    btn.classList.add('playing');
    musicPlaying = true;
  } else {
    if (musicInterval) clearInterval(musicInterval);
    if (audioCtx) { audioCtx.close(); audioCtx = null; }
    btn.textContent = '♪';
    btn.classList.remove('playing');
    musicPlaying = false;
  }
}

function playMelody() {
  if (!audioCtx) return;
  // Pentatonic love melody
  const notes = [
    261.63, 293.66, 329.63, 392.00, 440.00,
    392.00, 349.23, 329.63, 293.66, 261.63,
    220.00, 261.63, 293.66, 329.63, 392.00
  ];
  const durs = [0.35, 0.35, 0.35, 0.7, 0.35, 0.35, 0.7, 0.35, 0.35, 0.35, 0.7, 0.35, 0.35, 0.7, 0.8];
  let t = audioCtx.currentTime + 0.1;
  notes.forEach((freq, i) => {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const reverb = audioCtx.createGain();
    osc.connect(gain); gain.connect(reverb); reverb.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
    gain.gain.linearRampToValueAtTime(0, t + durs[i] - 0.04);
    reverb.gain.setValueAtTime(0.8, t);
    osc.start(t); osc.stop(t + durs[i]);
    t += durs[i];
  });
}



// ===== STAGGER REVEAL CARDS =====
document.querySelectorAll('.r-card, .flip-card, .wish-pill, .tip-card, .tl-card').forEach((el, i) => {
  if (el.classList.contains('reveal')) {
    el.style.transitionDelay = (i % 6 * 0.1) + 's';
  }
});

// ===== WELCOME TOAST =====
window.addEventListener('load', () => {
  const msgs = {
    'index.html':  '💌 Click the envelope to start your surprise!',
    'page2.html':  '📸 Hover the polaroid stack for a surprise!',
    'page3.html':  '🎴 Scratch the card to reveal a secret message!',
    'page4.html':  '🃏 Hover the cards to flip them!',
    'page5.html':  '🎆 You made it to the final page! Click the heart 💖',
  };
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const msg  = msgs[page] || msgs['index.html'];
  setTimeout(() => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position:fixed;bottom:90px;left:50%;transform:translateX(-50%);
      background:linear-gradient(135deg,rgba(255,77,126,.95),rgba(123,45,139,.95));
      color:white;padding:14px 28px;border-radius:50px;
      font-family:Inter,sans-serif;font-size:.95rem;font-weight:600;
      box-shadow:0 8px 30px rgba(255,77,126,.5);z-index:9000;
      opacity:0;transition:opacity .4s;white-space:nowrap;
      max-width:90vw;text-align:center;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.style.opacity = '1', 100);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 4500);
  }, 1000);
});
