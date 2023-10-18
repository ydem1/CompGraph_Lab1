const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

const widthFigur = 80;
const heightFigur = 100;

let x = canvas.width / 2 - widthFigur / 2;
let y = canvas.height / 2 - heightFigur / 2;

const centerX = x + widthFigur;
const centerY = y + heightFigur;

let rotation = 0;
let rotatePointX = 0;
let rotatePointY = 0;

let shiftX = 0;
let shiftY = 0;

let scaleX = 1;
let scaleY = 1;

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

function drawCircle(x, y, radiusX, radiusY, startAngle, endAngle) {
  context.ellipse(x, y, radiusX, radiusY, 0, startAngle, endAngle);
}

function rotatePoint(x, y, angle) {
  const xOffset = x - rotatePointX;
  const yOffset = y - rotatePointY;

  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const newX = cosA * xOffset - sinA * yOffset + rotatePointX;
  const newY = sinA * xOffset + cosA * yOffset + rotatePointY;

  return { x: newX, y: newY };
}

function shiftPoint(dx, dy, originX, originY) {
  const newX = dx + originX;
  const newY = dy + originY;

  return { x: newX, y: newY };
}

function scalePoint(x, y) {
  const dx = x - centerX;
  const dy = y - centerY;

  const scaledDx = dx * scaleX;
  const scaledDy = dy * scaleY;

  const scaledX = centerX + scaledDx;
  const scaledY = centerY + scaledDy;

  return { x: scaledX, y: scaledY };
}

function symmetryPointX(originX) {
  const newX = 2 * centerX - originX;

  return newX;
}

function symmetryPointY(originY) {
  const newY = 2 * centerY - originY;

  return newY;
}

function drawFigure() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  drawGrid();
  drawCoordinates();

  context.strokeStyle = 'black';
  context.lineWidth = 2;

  const newPoints = points.map(point => {
    const { x: rotateX, y: rotateY } = rotatePoint(point.x, point.y, rotation);
    const { x: scaledX, y: scaledY } = scalePoint(rotateX, rotateY);
    let { x: newX, y: newY } = shiftPoint(scaledX, scaledY, shiftX, shiftY);

    if (isSymmetry) {
      newX = symmetryPointX(newX);
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

  const { x: rotateX, y: rotateY } = rotatePoint(x, y + 40, rotation);
  const { x: scaledX, y: scaledY } = scalePoint(rotateX, rotateY);
  let { x: circleX, y: circleY } = shiftPoint(scaledX, scaledY, shiftX, shiftY);

  if (isSymmetry) {
    circleX = symmetryPointX(circleX);
  }

  const symmetry = isSymmetry === true ? -1 : 1; 

  context.beginPath();
  drawCircle(circleX, circleY, radiusBigCircle * scaleX, radiusBigCircle * scaleY, symmetry * (startBigCircle + rotation), symmetry * (endBigCircle + rotation));
  context.stroke();

  context.beginPath();
  drawCircle(circleX, circleY, radiusSmallCircle * scaleX, radiusSmallCircle * scaleY, startSmallCircle, endSmallCircle);
  context.stroke();
}

document.getElementById('symmetryBtn').addEventListener('click', () => {
  isSymmetry = !isSymmetry;

  drawFigure();
});


const euclideanTransformationsForm = document.getElementById("euclidean-transformations__form");

euclideanTransformationsForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Зупинити стандартну дію форми (у цьому випадку, перезавантаження сторінки)

  const moveXValue = parseInt(document.getElementById("moveX").value) || 0;
  const moveYValue = parseInt(document.getElementById("moveY").value) || 0;

  const rotateXValue = parseInt(document.getElementById("RotateX").value) || 0;
  const rotateYValue = parseInt(document.getElementById("RotateY").value) || 0;

  const rotateAngle = parseInt(document.getElementById("Angle").value) || 0;

  shiftX += moveXValue;
  shiftY += moveYValue;

  rotatePointX = rotateXValue;
  rotatePointY = rotateYValue;

  rotation += rotateAngle * Math.PI / 180;

  drawFigure();
});

const athenianTransformationsForm = document.getElementById("athenian-transformations__form");

athenianTransformationsForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Зупинити стандартну дію форми (у цьому випадку, перезавантаження сторінки)

  const scaleXValue = parseInt(document.getElementById("scaleX").value) || 0;
  const scaleYValue = parseInt(document.getElementById("scaleY").value) || 0;

  scaleX += scaleXValue / 10;
  scaleY += scaleYValue / 10;
  
  const minScale = 0.1;
  const maxScale = 10;
  
  scaleX = Math.min(maxScale, Math.max(minScale, scaleX));
  scaleY = Math.min(maxScale, Math.max(minScale, scaleY));


  drawFigure();
});

drawFigure();