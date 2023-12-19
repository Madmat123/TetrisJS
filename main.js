import './style.css'

let canvas = document.getElementById("canvas");
let ctx =  canvas.getContext("2d");
console.log(ctx);

canvas.width = 300;
canvas.height = 600;

const width = canvas.width;
const height = canvas.height;

const columns = 10;
const rows = 20;
const squareSize = 30;
const boardWidth = 10; // Width of the Tetris board in blocks
const boardHeight = 20; // Height of the Tetris board in blocks
const grid = [];

ctx.strokeStyle = '#000'; // Set the stroke color

// Generate top-left corner coordinates of squares
for (let i = 0; i < columns; i++) {
  grid.push([]);
    for (let j = 0; j < rows; j++) {
        const x = (i * width) / columns;
        const y = (j * height) / rows;
        grid[i].push({ x: x, y: y }); // Push coordinates of top-left corner of squares

        // Draw squares
        ctx.strokeRect(x, y, squareSize, squareSize);
    }
}

console.log(grid); // Outputs the grid array containing top-left corner coordinates of squares

const tetrominos = [
  // Tetromino I
  [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
  ],
  // Tetromino J
  [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
  ],
  // Tetromino L
  [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
  ],
  // Tetromino O
  [
      [1, 1],
      [1, 1]
  ],
  // Tetromino S
  [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
  ],
  // Tetromino T
  [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
  ],
  // Tetromino Z
  [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
  ]
];
console.log(tetrominos);

function getRandomTetromino() {
  const randomIndex = Math.floor(Math.random() * tetrominos.length);
  return tetrominos[randomIndex];
}

function drawTetromino(tetromino, xOffset, yOffset) {
  for (let row = 0; row < tetromino.length; row++) {
      for (let col = 0; col < tetromino[row].length; col++) {
          if (tetromino[row][col]) {
              const x = (col + xOffset) * squareSize;
              const y = (row + yOffset) * squareSize;
              ctx.fillStyle = 'blue'; // Set color for Tetris block
              ctx.fillRect(x, y, squareSize, squareSize);
              ctx.strokeStyle = 'black'; // Set border color
              ctx.strokeRect(x, y, squareSize, squareSize);
          }
      }
  }
}

// Function to animate tetromino falling with speed control
function animateTetromino(tetromino, startX, startY, speed) {
  let currentY = startY;

  function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawTetromino(tetromino, startX, currentY);
      currentY++;

      if (currentY <= boardHeight - tetromino.length) {
          setTimeout(() => {
              requestAnimationFrame(animate);
          }, speed);
      }
  }

  animate();
}

// Get a random tetromino and start the falling animation from the top-left corner with a speed of 500ms (adjust as needed)
const randomTetromino = getRandomTetromino();
animateTetromino(randomTetromino, 4, 0, 500); // Passing speed as 500 milliseconds