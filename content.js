class DrawingCanvas {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'web-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.currentTool = null;
    this.isDrawing = false;
    this.drawingStack = [];
    this.startPos = { x: 0, y: 0 };
    this.currentColor = '#000000'; // Default color
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = 2;
    
    this.setupCanvas();
    this.setupEventListeners();
    
    // Restore last selected color
    chrome.storage.local.get(['selectedColor'], result => {
      if (result.selectedColor) {
        this.currentColor = result.selectedColor;
        this.ctx.strokeStyle = this.currentColor;
      }
    });
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    
    // Listen for undo shortcut
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'z') {
        this.undo();
      }
    });
  }

  startDrawing(e) {
    if (!this.currentTool) return;
    
    this.isDrawing = true;
    this.startPos = {
      x: e.clientX,
      y: e.clientY
    };
    
    if (this.currentTool === 'freehand') {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startPos.x, this.startPos.y);
    }
  }

  draw(e) {
    if (!this.isDrawing) return;

    const currentPos = {
      x: e.clientX,
      y: e.clientY
    };

    // Clear the canvas and redraw previous shapes
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawStack();

    // Draw current shape
    switch (this.currentTool) {
      case 'line':
        this.drawLine(this.startPos, currentPos);
        break;
      case 'circle':
        this.drawCircle(this.startPos, currentPos);
        break;
      case 'rectangle':
        this.drawRectangle(this.startPos, currentPos);
        break;
      case 'freehand':
        this.ctx.lineTo(currentPos.x, currentPos.y);
        this.ctx.stroke();
        break;
    }
  }

  stopDrawing() {
    if (!this.isDrawing) return;
    
    this.isDrawing = false;
    // Save the current canvas state
    this.drawingStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
  }

  drawLine(start, end) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
  }

  drawCircle(start, end) {
    const radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  drawRectangle(start, end) {
    this.ctx.strokeStyle = this.currentColor;
    const width = end.x - start.x;
    const height = end.y - start.y;
    this.ctx.strokeRect(start.x, start.y, width, height);
  }

  drawStack() {
    if (this.drawingStack.length > 0) {
      this.drawingStack.forEach(imageData => {
        this.ctx.putImageData(imageData, 0, 0);
      });
    }
  }

  undo() {
    if (this.drawingStack.length > 0) {
      this.drawingStack.pop();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawStack();
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawingStack = [];
  }

  setTool(tool) {
    this.currentTool = tool;
    this.canvas.className = 'web-canvas' + (tool ? ' drawing' : '');
  }

  setColor(color) {
    this.currentColor = color;
    this.ctx.strokeStyle = color;
  }
}

// Make sure we only initialize once
if (!window.drawerInitialized) {
  window.drawerInitialized = true;
  
  // Initialize the drawing canvas
  const drawer = new DrawingCanvas();

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'setTool') {
      drawer.setTool(request.tool);
      if (request.color) {
        drawer.setColor(request.color);
        // Also save the color to storage
        chrome.storage.local.set({ selectedColor: request.color });
      }
      sendResponse({status: 'success'});
    } else if (request.action === 'clear') {
      drawer.clear();
      sendResponse({status: 'success'});
    } else if (request.action === 'setColor') {
      drawer.setColor(request.color);
      // Also save the color to storage
      chrome.storage.local.set({ selectedColor: request.color });
      sendResponse({status: 'success'});
    }
    return true;
  });
}

// Add window resize handler
window.addEventListener('resize', () => {
  if (window.drawer) {
    window.drawer.setupCanvas();
  }
});
