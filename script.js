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

// Cake canvas and flame animation
const cakeCanvas = document.getElementById('cakeCanvas');
const cakeCtx = cakeCanvas.getContext('2d');
let flamesOn = true;

function drawCake() {
  cakeCtx.clearRect(0, 0, cakeCanvas.width, cakeCanvas.height);

  // Draw cake base
  cakeCtx.fillStyle = '#d2691e';
  cakeCtx.fillRect(75, 200, 150, 70);
  cakeCtx.fillStyle = '#ff69b4';
  cakeCtx.fillRect(75, 180, 150, 30);

  if (flamesOn) {
    for (let i = 0; i < 5; i++) {
      let x = 95 + i * 30;
      // Candle
      cakeCtx.fillStyle = '#fff';
      cakeCtx.fillRect(x, 160, 10, 20);
      // Flame
      cakeCtx.beginPath();
      cakeCtx.arc(x + 5, 155, 5, 0, Math.PI * 2);
      cakeCtx.fillStyle = 'orange';
      cakeCtx.fill();
    }
  }
}
setInterval(drawCake, 100);

// Blow detection
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const context = new AudioContext();
  const mic = context.createMediaStreamSource(stream);
  const analyser = context.createAnalyser();
  mic.connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);

  function detectBlow() {
    analyser.getByteFrequencyData(data);
    const volume = data.reduce((a, b) => a + b) / data.length;
    if (volume > 50 && flamesOn) {
      flamesOn = false;
      document.getElementById('blow-msg').textContent = "Candles blown out! 🎉";
      document.querySelector('.message-section').style.display = 'block';
    }
    requestAnimationFrame(detectBlow);
  }
  detectBlow();
});

// Message interaction
function submitMessage() {
  const message = document.getElementById("specialMessage").value.trim();
  if (message) {
    document.getElementById("messageDisplay").innerHTML = `<p><strong>Your Message:</strong> ${message}</p>`;
    document.getElementById("specialMessage").value = "";
  }
}

// Confetti Effect (Basic)
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

function draw() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  pieces.forEach(p => {
    confettiCtx.beginPath();
    confettiCtx.lineWidth = p.r / 2;
    confettiCtx.strokeStyle = p.color;
    confettiCtx.moveTo(p.x + p.tilt, p.y);
    confettiCtx.lineTo(p.x + p.tilt + p.r, p.y + p.r);
    confettiCtx.stroke();
  });
  update();
}

function update() {
  pieces.forEach(p => {
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

setInterval(draw, 30);
