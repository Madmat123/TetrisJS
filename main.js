import './style.css'

const TETROMINOS = [
    // Tetromino I
    [
    //   [0, 0, 0, 0],
        [1, 1, 1, 1]//,
    //    [0, 0, 0, 0],
    //    [0, 0, 0, 0]
    ],
    // Tetromino J
    [
        [1, 0, 0],
        [1, 1, 1],
    //    [0, 0, 0]
    ],
    // Tetromino L
    [
        [0, 0, 1],
        [1, 1, 1],
    //    [0, 0, 0]
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
    //    [0, 0, 0]
    ],
    // Tetromino T
    [
        [0, 1, 0],
        [1, 1, 1],
    //    [0, 0, 0]
    ],
    // Tetromino Z
    [
        [1, 1, 0],
        [0, 1, 1],
    //    [0, 0, 0]
    ]
  ];
// Generate array of tetrominos with all rotations
const tetrominosWithAllRotations = generateAllRotations(TETROMINOS);

let canvas = document.getElementById("canvas");
let ctx =  canvas.getContext("2d");

let isGamePaused = false;

ctx.strokeStyle = '#000'; // Set the stroke color

canvas.width = 300;
canvas.height = 600;

/* const width = canvas.width;
const height = canvas.height;
const columns = 10;
const rows = 20; */
const squareSize = 30;
const boardWidth = 10; // Width of the Tetris board in blocks
const boardHeight = 20; // Height of the Tetris board in blocks

let canvasPreview = document.getElementById("preview");
let ctxPreview =  canvasPreview.getContext("2d");
canvasPreview.width = 120;
canvasPreview.height = 120;

let grid = Array.from({ length: boardHeight }, () => Array(boardWidth).fill(0));

let boundingBox = []
let score = 0;
let rotation = 0;
let tetrominoX = 4;
let tetrominoY = 0;
let speed = 700;
let isGameActive = false;

const scoreDisplay = document.getElementById("score");
console.log(`scoreDisplay: ${scoreDisplay}`);
scoreDisplay.innerHTML = "Score: " + score;

const pauseButton = document.getElementById("pause");

let currentTetromino = getRandomTetromino(tetrominosWithAllRotations);
let nextTetromino = getRandomTetromino(tetrominosWithAllRotations); 

function ActivateNewTetromino(){
    rotation = 0;
    tetrominoX = 4;
    tetrominoY = 0;
    speed = 700;
}
function getRandomTetromino(tetrominos) {
    const randomIndex = Math.floor(Math.random() * tetrominos.length);
    return tetrominos[randomIndex];
}
function drawPreview (tetromino){
    ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
    for (let row = 0; row < tetromino[0].length; row++) {
        for (let col = 0; col < tetromino[0][row].length; col++) {
            if (tetromino[0][row][col]) {
                const x = col* squareSize;
                const y = row * squareSize;
                ctxPreview.fillStyle = 'red'; // Set color for Tetris block
                ctxPreview.fillRect(x, y, squareSize, squareSize);
                ctxPreview.strokeStyle = 'black'; // Set border color
                ctxPreview.strokeRect(x, y, squareSize, squareSize);
            }
        }
    }
}
function drawTetromino(tetromino, rotation, xOffset, yOffset) {
    grid.forEach((vElement, yIndex)=>{
        vElement.forEach((xElement, xIndex)=>{
            if(xElement) {
                //console.log(`hIndex 4: ${hIndex} vIndex 4: ${vIndex}`)
                const xGrid = xIndex * squareSize;
                const yGrid = yIndex * squareSize;
                ctx.fillStyle = 'grey'; // Set color for Grid block
                ctx.fillRect(xGrid, yGrid, squareSize, squareSize);
                ctx.strokeStyle = 'black'; // Set border color
                ctx.strokeRect(xGrid, yGrid, squareSize, squareSize);
            }
        })
    });

    for (let row = 0; row < tetromino[rotation].length; row++) {
        for (let col = 0; col < tetromino[rotation][row].length; col++) {
            if (tetromino[rotation][row][col]) {
                const x = (col + xOffset) * squareSize;
                const y = (row + yOffset) * squareSize;
                ctx.fillStyle = 'red'; // Set color for Tetris block
                ctx.fillRect(x, y, squareSize, squareSize);
                ctx.strokeStyle = 'black'; // Set border color
                ctx.strokeRect(x, y, squareSize, squareSize);
            }
        }
    }
}
function validateTetrominoPosition(tetromino, rotation, xOffset, yOffset){
    let isPositionValid = true;
    tetromino[rotation].forEach((row, rowIndex)=>{
        row.forEach((cellValue, colIndex)=>{
            if(yOffset+rowIndex < boardHeight && xOffset+colIndex <boardWidth){
                if(cellValue && grid[yOffset+rowIndex][xOffset+colIndex]) {
                    isPositionValid = false;
                }
            } else isPositionValid = false;
        });
    });           
    return isPositionValid;
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function getBoundingBox(tetromino) {
    let firstRow = -1;
    let lastRow = -1;
    let firstColumn = -1;
    let lastColumn = -1;

    // Find first row
    for (let i = 0; i < tetromino.length; i++) {
        if (tetromino[i].some(block => block === 1)) {
            firstRow = i;
            break;
        }
    }

    // Find last row
    for (let i = tetromino.length - 1; i >= 0; i--) {
        if (tetromino[i].some(block => block === 1)) {
            lastRow = i;
            break;
        }
    }

    // Find first column
    for (let i = 0; i < tetromino[0].length; i++) {
        if (tetromino.some(row => row[i] === 1)) {
            firstColumn = i;
            break;
        }
    }

    // Find last column
    for (let i = tetromino[0].length - 1; i >= 0; i--) {
        if (tetromino.some(row => row[i] === 1)) {
            lastColumn = i;
            break;
        }
    }
    return {
        firstRow: firstRow,
        lastRow: lastRow,
        firstColumn: firstColumn,
        lastColumn: lastColumn
    };
}
function addTetrominoToGrid(){
    const newGrid = [];
    let scoreMultiplier = 0;
    currentTetromino[rotation].forEach((vElement, vIndex)=>{
        vElement.forEach((hElement, hIndex)=>{
            if(hElement) {
                grid[tetrominoY+vIndex-1][tetrominoX+hIndex] = 1;
            }
        })
    });
    grid.forEach(row => {
        if (row.every(cell => cell !== 0)) {
            const newRow = Array(row.length).fill(0); // Create a new row with 0 values
            newGrid.unshift(newRow); // Add the new row at index 0
            scoreMultiplier = (1 + scoreMultiplier) * 2;
        } else
        newGrid.push(row); // Push the original row
    });
    score = score + 10 * scoreMultiplier;
    grid = newGrid;
    console.log(grid);
}
function moveTetromino(direction) {          
    if (direction === 'left' && tetrominoX - boundingBox.firstColumn> 0 && validateTetrominoPosition(currentTetromino, rotation, tetrominoX-1, tetrominoY)) {
        clearCanvas();
        tetrominoX--;
    } else if (direction === 'right' && tetrominoX < boardWidth-boundingBox.lastColumn - 1 && validateTetrominoPosition(currentTetromino, rotation, tetrominoX+1, tetrominoY)) {
        clearCanvas();
        tetrominoX++;
    }
    drawTetromino(currentTetromino, rotation, tetrominoX, tetrominoY);  
}
function getNextRotation(r) {
        if(validateTetrominoPosition(currentTetromino, (r + 1) % currentTetromino.length, tetrominoX, tetrominoY)){
        rotation = (r + 1) % currentTetromino.length;
        clearCanvas();
        drawTetromino(currentTetromino, rotation, tetrominoX, tetrominoY); 
        boundingBox = getBoundingBox(currentTetromino[rotation]);
    }
}    
function rotateTetromino(tetromino) {
    const rotatedTetromino = tetromino[0].map((_, colIndex) =>
        tetromino.map(row => row[colIndex]).reverse()
    );
    return rotatedTetromino;
}
// Function to generate all rotations for a single tetromino
function generateRotations(tetromino, rotations = []) {
    rotations.push(tetromino);
    const rotated = rotateTetromino(tetromino);
    if (
        JSON.stringify(rotated) !== JSON.stringify(tetromino) &&
        !rotations.some(rotate => JSON.stringify(rotate) === JSON.stringify(rotated))
    ) {
        generateRotations(rotated, rotations);
    }
    return rotations;
}
// Function to generate all rotations for an array of tetrominos
function generateAllRotations(tetrominos) {
    const tetrominosWithRotations = tetrominos.map(tetromino =>
        generateRotations(tetromino)
    );
    return tetrominosWithRotations;
}
// Keyboard event listeners
document.addEventListener('keydown', (event) => {
    if (event.key === 'a' || event.key === 'A') {
        moveTetromino('left');
    } else if (event.key === 'd' || event.key === 'D') {
        moveTetromino('right');
    } else if (event.key === 's' || event.key === 'S') {
        speed =50;    
    } else if (event.key === 'w' || event.key === 'W') {
        getNextRotation(rotation);
    }
});
document.getElementById('start').addEventListener('click', startGame);
document.getElementById('pause').addEventListener('click', setPause);

// Animation loop with reduced speed
function animate() {
    isGameActive = true;
    if (!isGamePaused){
        clearCanvas();
        drawTetromino(currentTetromino, rotation, tetrominoX, tetrominoY);
        if(validateTetrominoPosition(currentTetromino, rotation, tetrominoX, tetrominoY) ){
            tetrominoY++; 
            setTimeout(() => {
                requestAnimationFrame(animate);
            }
            , speed); 
        }
        else {
            addTetrominoToGrid();
            currentTetromino = nextTetromino;
            nextTetromino = getRandomTetromino(tetrominosWithAllRotations);
            drawPreview(nextTetromino);
            ActivateNewTetromino();
            score+=10;
            scoreDisplay.innerHTML = "Score: " + score;
            requestAnimationFrame(animate);
        }
    }   
};
// Initial start of animation
function startGame(){
    isGamePaused = false;
    grid = Array.from({ length: boardHeight }, () => Array(boardWidth).fill(0));
    score = 0;
    currentTetromino = getRandomTetromino(tetrominosWithAllRotations);
    nextTetromino = getRandomTetromino(tetrominosWithAllRotations); 
    ActivateNewTetromino();
    drawPreview(nextTetromino);
    boundingBox = getBoundingBox(currentTetromino[rotation]);
    if (!isGameActive) requestAnimationFrame(animate);
}

function setPause(){
    isGamePaused = !isGamePaused;
    pauseButton.innerHTML = isGamePaused? "Unpause" : "Pause";
    if (!isGamePaused) requestAnimationFrame(animate);
}
