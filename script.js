// Countdown Timer
const birthday = new Date("2025-05-24T00:00:00").getTime();
const updateTimer = () => {
  const now = new Date().getTime();
  const gap = birthday - now;

  const days = Math.floor(gap / (1000 * 60 * 60 * 24));
  const hours = Math.floor((gap / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((gap / (1000 * 60)) % 60);
  const seconds = Math.floor((gap / 1000) % 60);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
};
setInterval(updateTimer, 1000);

// Cake canvas and flickering flame animation
const cakeCanvas = document.getElementById("cakeCanvas");
const cakeCtx = cakeCanvas.getContext("2d");
let flamesOn = true;
let flickering = false;

function drawCake() {
  cakeCtx.clearRect(0, 0, cakeCanvas.width, cakeCanvas.height);

  cakeCtx.fillStyle = "#d2691e";
  cakeCtx.fillRect(75, 200, 150, 70);
  cakeCtx.fillStyle = "#ff69b4";
  cakeCtx.fillRect(75, 180, 150, 30);

  if (flamesOn) {
    for (let i = 0; i < 5; i++) {
      let x = 95 + i * 30;
      cakeCtx.fillStyle = "#fff";
      cakeCtx.fillRect(x, 160, 10, 20);

      // Flickering flame
      let flickerX = Math.random() * 4 - 2;
      let flickerY = Math.random() * 4 - 2;
      cakeCtx.beginPath();
      cakeCtx.arc(x + 5 + flickerX, 150 + flickerY, 6 + Math.random() * 2, 0, Math.PI * 2);
      cakeCtx.fillStyle = `rgba(255, ${Math.floor(150 + Math.random() * 100)}, 0, 0.9)`;
      cakeCtx.fill();
    }
  }
}
setInterval(drawCake, 100);

// Flicker and extinguish flames
function startFlickerBeforeBlowOut() {
  flickering = true;
  let flickerCount = 0;
  const flickerInterval = setInterval(() => {
    flamesOn = !flamesOn;
    flickerCount++;
    if (flickerCount > 6) {
      clearInterval(flickerInterval);
      flamesOn = false;
      document.getElementById("blow-msg").textContent = "Candles blown out! 🎉";
      document.querySelector(".message-section").style.display = "block";
      document.getElementById("candleModal").style.display = "none";
    }
  }, 200);
}

// Blow detection (once)
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  const context = new AudioContext();
  const mic = context.createMediaStreamSource(stream);
  const analyser = context.createAnalyser();
  mic.connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);

  function detectBlow() {
    analyser.getByteFrequencyData(data);
    const volume = data.reduce((a, b) => a + b) / data.length;

    if (volume > 50 && flamesOn && !flickering) {
      document.getElementById("blow-msg").textContent = "Blowing out candles... 🎂💨";
      startFlickerBeforeBlowOut();
    }

    requestAnimationFrame(detectBlow);
  }
  detectBlow();
}).catch(() => {
  // Fallback: tap to blow
  document.getElementById("candleModal").addEventListener("click", () => {
    if (flamesOn && !flickering) {
      document.getElementById("blow-msg").textContent = "Blowing out candles... 🎂💨";
      startFlickerBeforeBlowOut();
    }
  });
});

// Message interaction
function submitMessage() {
  const message = document.getElementById("specialMessage").value.trim();
  if (message) {
    document.getElementById("messageDisplay").innerHTML = `<p><strong>Your Message:</strong> ${message}</p>`;
    document.getElementById("specialMessage").value = "";
  }
}

// Confetti
const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

const pieces = new Array(100).fill().map(() => ({
  x: Math.random() * confettiCanvas.width,
  y: Math.random() * confettiCanvas.height,
  r: Math.random() * 10 + 5,
  d: Math.random() * 50,
  color: `hsl(${Math.random() * 360}, 70%, 60%)`,
  tilt: Math.random() * 10 - 10,
  tiltAngle: 0
}));

function drawConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  pieces.forEach((p) => {
    confettiCtx.beginPath();
    confettiCtx.lineWidth = p.r / 2;
    confettiCtx.strokeStyle = p.color;
    confettiCtx.moveTo(p.x + p.tilt, p.y);
    confettiCtx.lineTo(p.x + p.tilt + p.r, p.y + p.r);
    confettiCtx.stroke();
  });
  updateConfetti();
}

function updateConfetti() {
  pieces.forEach((p) => {
    p.tiltAngle += 0.1;
    p.y += Math.cos(p.d) + 1 + p.r / 2;
    p.x += Math.sin(p.d);
    p.tilt = Math.sin(p.tiltAngle) * 15;
    if (p.y > confettiCanvas.height) {
      p.y = 0;
      p.x = Math.random() * confettiCanvas.width;
    }
  });
}
setInterval(drawConfetti, 30);

// Music Player
const customTracks = [
  { title: "Anita", file: "playlist/anita.mp3" },
  { title: "Me You I", file: "playlist/me_you_i.mp3" },
  { title: "Adaugo", file: "playlist/adaugo.mp3" },
  { title: "Beautiful Rain", file: "playlist/beautiful_rain.mp3" },
  { title: "Stranger", file: "playlist/stranger.mp3" }
];

let customCurrent = 0;
const audioEl = document.getElementById("customAudio");
const titleEl = document.getElementById("custom-track-title");
const playPauseBtn = document.getElementById("playPauseBtn");
const nextBtn = document.getElementById("nextBtn");

let isPlaying = false;

function loadTrack(index) {
  audioEl.src = customTracks[index].file;
  titleEl.textContent = `Now Playing: ${customTracks[index].title}`;
}

function togglePlay() {
  if (isPlaying) {
    audioEl.pause();
    playPauseBtn.textContent = "▶️";
  } else {
    audioEl.play();
    playPauseBtn.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
}

function playNext() {
  customCurrent = (customCurrent + 1) % customTracks.length;
  loadTrack(customCurrent);
  if (isPlaying) audioEl.play();
}

playPauseBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", playNext);
audioEl.addEventListener("ended", playNext);
loadTrack(customCurrent);

// Countdown Timer
const countdownDate = new Date("2025-05-25T00:00:00").getTime();
const timerElements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownDate - now;
  if (distance < 0) return;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  timerElements.days.textContent = String(days).padStart(2, '0');
  timerElements.hours.textContent = String(hours).padStart(2, '0');
  timerElements.minutes.textContent = String(minutes).padStart(2, '0');
  timerElements.seconds.textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Modal Show on Load
window.onload = () => {
  const modal = document.getElementById("candleModal");
  modal.style.display = "flex";
};

// Candle Blow Detection
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const context = new AudioContext();
    const mic = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    mic.connect(analyser);
    analyser.fftSize = 256;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      if (volume > 50) { // Adjust sensitivity
        triggerCandleBlow();
      } else {
        requestAnimationFrame(detectBlow);
      }
    }

    detectBlow();
  });

function triggerCandleBlow() {
  document.getElementById("candleModal").style.display = "none";
  launchConfetti();
}

// Confetti
const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");
let confettiPieces = [];

function launchConfetti() {
  for (let i = 0; i < 100; i++) {
    confettiPieces.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      r: Math.random() * 6 + 4,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      velocity: Math.random() * 3 + 2
    });
  }
  animateConfetti();
}

function animateConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiPieces.forEach(p => {
    p.y += p.velocity;
    confettiCtx.beginPath();
    confettiCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fill();
  });

  confettiPieces = confettiPieces.filter(p => p.y < window.innerHeight);
  if (confettiPieces.length > 0) requestAnimationFrame(animateConfetti);
}

// Playlist Controls
const tracks = [
  { title: "Anita", src: "playlist/anita.mp3" },
  { title: "Birthday Pop", src: "playlist/birthday_pop.mp3" },
  { title: "Cheerful Beats", src: "playlist/cheerful.mp3" }
];
let currentTrack = 0;
const audio = document.getElementById("customAudio");
const title = document.getElementById("custom-track-title");

function loadTrack(index) {
  audio.src = tracks[index].src;
  title.textContent = `Now Playing: ${tracks[index].title}`;
  audio.play();
}

document.getElementById("playPauseBtn").addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack);
});

// Start initial track
loadTrack(currentTrack);

// Submit Message
function submitMessage() {
  const msg = document.getElementById("specialMessage").value;
  const display = document.getElementById("messageDisplay");
  if (msg.trim()) {
    display.innerHTML = `<p>🎉 ${msg}</p>`;
    document.getElementById("specialMessage").value = "";
  }
}
