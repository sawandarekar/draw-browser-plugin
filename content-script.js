let isDrawing = false;
let x = 0;
let y = 0;
let canvas, ctx;

function createCanvas() {
  canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '1000';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
}

function startDrawing(e) {
  isDrawing = true;
  [x, y] = [e.clientX, e.clientY];
}

function draw(e) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(e.clientX, e.clientY);
  ctx.strokeStyle = selectedColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  [x, y] = [e.clientX, e.clientY];
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'draw-line') {
    // Implement line drawing logic
  } else if (message.action === 'draw-circle') {
    // Implement circle drawing logic
  } else if (message.action === 'draw-rect') {
    // Implement rectangle drawing logic
  } else if (message.action === 'draw-freehand') {
    if (!canvas) createCanvas();
    selectedColor = message.color;
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
  } else if (message.action === 'clear') {
    clearCanvas();
  }
});
