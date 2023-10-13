const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

let x = 100;
let y = 100;

let rotation = 0;
let shiftX = 0;
let shiftY = 0;
let scale = 1; 
let isSymmetry = false;

const points = [];

points.push({ x: x, y: y });
points.push({ x: x + 120, y: y });
points.push({ x: x + 120, y: y + 20 });
points.push({ x: x + 100, y: y + 20 });
points.push({ x: x + 100, y: y + 180 });
points.push({ x: x + 120, y: y + 180 });
points.push({ x: x + 120, y: y + 200 });
points.push({ x: x + 40, y: y + 200 });
points.push({ x: x + 40, y: y + 140 });
points.push({ x: x + 80, y: y + 140 });
points.push({ x: x + 80, y: y + 80 });
points.push({ x: x, y: y + 80 });
points.push({ x: x + 80, y: y + 80 });
points.push({ x: x + 80, y: y });

const centerX = x + 60; // Горизонтальна координата центра фігури
const centerY = y + 100; // Вертикальна координата центра фігури

function drawGrid() {
  const gridSize = 20;
  context.strokeStyle = 'lightgray';
  context.lineWidth = 2;

  
  for (let x = 0; x <= canvas.width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
  }
  
  for (let y = 0; y <= canvas.height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
  }
}

function drawCoordinates() {
  // Вертикальна вісь (Y)
  context.strokeStyle = 'green';
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, canvas.height);
  context.lineWidth = 2;
  context.stroke();

  // Горизонтальна вісь (X)
  context.strokeStyle = 'red';
  context.beginPath();
  context.moveTo(0, canvas.width);
  context.lineTo(canvas.width, canvas.width);
  context.lineWidth = 2;
  context.stroke();
}

function drawLine(x1, y1, x2, y2) {
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
}

function drawCircle(x, y, radius, startAngle, endAngle) {
  context.arc(x, y, radius, startAngle, endAngle);
}

function rotatePoint(x, y, originX, originY, angle) {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const newX = cosA * (x - originX) - sinA * (y - originY) + originX;
  const newY = sinA * (x - originX) + cosA * (y - originY) + originY;
  return { x: newX, y: newY };
}

function shiftPoint(dx, dy, originX, originY) {
  const newX = dx + originX;
  const newY = dy + originY;

  return { x: newX, y: newY };
}

function scalePoint(x, y, centerX, centerY, scale) {
  const dx = x - centerX;
  const dy = y - centerY;

  const scaledDx = dx * scale;
  const scaledDy = dy * scale;

  const scaledX = centerX + scaledDx;
  const scaledY = centerY + scaledDy;

  return { x: scaledX, y: scaledY };
}

function symmetryPoint(originX) {
  const newX = 2 * centerX - originX;

  return newX;
}

function drawFigure() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  drawGrid();
  drawCoordinates();

  context.strokeStyle = 'black';
  context.lineWidth = 2;

  const newPoints = points.map(point => {
    const { x: rotateX, y: rotateY } = rotatePoint(point.x, point.y, centerX, centerY, rotation);
    const { x: scaledX, y: scaledY } = scalePoint(rotateX, rotateY, centerX, centerY, scale);
    let { x: newX, y: newY } = shiftPoint(scaledX, scaledY, shiftX, shiftY);

    if (isSymmetry) {
      newX = symmetryPoint(newX);
    }

    return { x: newX, y: newY };
  });

  context.beginPath();

  for (let i = 0; i < newPoints.length; i++) {
    const { x: x1, y: y1 } = newPoints[i];
    const { x: x2, y: y2 } = newPoints[(i + 1) % newPoints.length];
    drawLine(x1, y1, x2, y2);
  }

  context.stroke();

  const startBigCircle = Math.PI / 2;
  const endBigCircle = -Math.PI / 2;
  const radiusBigCircle = 40;

  const startSmallCircle = 0;
  const endSmallCircle = 2 * Math.PI;
  const radiusSmallCircle = 20;

  const { x: rotateX, y: rotateY } = rotatePoint(x, y + 40, centerX, centerY, rotation);
  const { x: scaledX, y: scaledY } = scalePoint(rotateX, rotateY, centerX, centerY, scale);
  let { x: circleX, y: circleY } = shiftPoint(scaledX, scaledY, shiftX, shiftY);

  if (isSymmetry) {
    circleX = symmetryPoint(circleX);
  }

  const symmetry = isSymmetry === true ? -1 : 1; 

  context.beginPath();
  drawCircle(circleX, circleY, radiusBigCircle * scale, symmetry * (startBigCircle + rotation), symmetry * (endBigCircle + rotation));
  context.stroke();

  context.beginPath();
  drawCircle(circleX, circleY, radiusSmallCircle * scale, startSmallCircle, endSmallCircle);
  context.stroke();
}

document.getElementById('translateBtn').addEventListener('click', () => {
  shiftX += 20;
  shiftY += 20;

  drawFigure();
});

document.getElementById('rotateBtn').addEventListener('click', () => {
  rotation += Math.PI / 6;

  drawFigure();
});

document.getElementById('scaleBtn').addEventListener('click', () => {
  scale *= 1.2;

  drawFigure();
});

document.getElementById('symmetryBtn').addEventListener('click', () => {
  isSymmetry = !isSymmetry;

  drawFigure();
});


drawFigure();
