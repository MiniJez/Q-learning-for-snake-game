var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;
  
var snake = {
  x: 160,
  y: 160,
  
  // snake velocity. moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,
  
  // keep track of all grids the snake body occupies
  cells: [],
  
  // length of the snake. grows when eating an apple
  maxCells: 4
};

var apple = {
  x: 320,
  y: 320
};

let reward;
let initGame = true;

// get random whole numbers in a specific range
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function game(action) {

  context.clearRect(0,0,canvas.width,canvas.height);

  initGame = false;
  reward = -0.1;

  if (action === 'left' && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (action === 'up' && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (action === 'right' && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (action === 'down' && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }


  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  
  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // draw apple
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // draw snake one cell at a time
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    
    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  

    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;

      // canvas is 400x400 which is 25x25 grids 
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;

      reward = 10;
    }

    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {
      
      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.cells.unshift({x: snake.x, y: snake.y});
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;

        reward = -10;
        initGame = true;
      }
    }
  });

  return reward;
}

function getSnakeDirection() {
  if(snake.dx === 0 && snake.dy < 0) {
    return 'up';
  } else if(snake.dx > 0 && snake.dy === 0) {
    return 'right';
  } else if(snake.dx === 0 && snake.dy > 0) {
    return 'down';
  } else if(snake.dx < 0 && snake.dy === 0) {
    return 'left';
  }
}

function whatIsForward() {
  let direction = getSnakeDirection();
  
  if(direction === 'up') {
    return getUp();
  } else if(direction === 'right') {
    return getRight();
  } else if(direction === 'down') {
    return getDown();
  } else if(direction === 'left') {
    return getLeft();
  }
}

function whatIsRight() {
  let direction = getSnakeDirection();

  if(direction === 'up') {
    return getRight();
  } else if(direction === 'right') {
    return getDown();
  } else if(direction === 'down') {
    return getLeft();
  } else if(direction === 'left') {
    return getUp();
  }
}

function whatIsLeft() {
  let direction = getSnakeDirection();
  
  if(direction === 'up') {
    return getLeft();
  } else if(direction === 'right') {
    return getUp();
  } else if(direction === 'down') {
    return getRight();
  } else if(direction === 'left') {
    return getDown();
  }
}

function getLeft() {
  let foodDistance;
  let bodyDistance;

  if(snake.y === apple.y && apple.x < snake.x) {
    foodDistance = Math.abs(apple.x - snake.x); 
  }
  
  snake.cells.forEach(cell => {
    if(cell.y === snake.y && cell.x < snake.x) {
      bodyDistance = Math.abs(apple.x - cell.x);
    }
  });

  if(bodyDistance && !foodDistance) {
    return -1;
  } else if(foodDistance && !bodyDistance) {
    return 1;
  } else if(bodyDistance && foodDistance) {
    if(bodyDistance < foodDistance) {
      return -1;
    } else if(bodyDistance > foodDistance) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

function getDown() {
  let foodDistance;
  let bodyDistance;

  if(snake.x === apple.x && apple.y > snake.y) {
    foodDistance = Math.abs(apple.y - snake.y);
  }
  
  snake.cells.forEach(cell => {
    if(cell.x === snake.x && cell.y > snake.y) {
      bodyDistance = Math.abs(apple.y - cell.y);
    }
  });

  if(bodyDistance && !foodDistance) {
    return -1;
  } else if(foodDistance && !bodyDistance) {
    return 1;
  } else if(bodyDistance && foodDistance) {
    if(bodyDistance < foodDistance) {
      return -1;
    } else if(bodyDistance > foodDistance) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

function getRight() {
  let foodDistance;
  let bodyDistance;

  if(snake.y === apple.y && apple.x > snake.x) {
    foodDistance = Math.abs(apple.x - snake.x); 
  }
  
  snake.cells.forEach(cell => {
    if(cell.y === snake.y && cell.x > snake.x) {
      bodyDistance = Math.abs(apple.x - cell.x);
    }
  });

  if(bodyDistance && !foodDistance) {
    return -1;
  } else if(foodDistance && !bodyDistance) {
    return 1;
  } else if(bodyDistance && foodDistance) {
    if(bodyDistance < foodDistance) {
      return -1;
    } else if(bodyDistance > foodDistance) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

function getUp() {
  let foodDistance;
  let bodyDistance;

  if(snake.x === apple.x && apple.y < snake.y) {
    foodDistance = Math.abs(apple.y - snake.y); 
  }
  
  snake.cells.forEach(cell => {
    if(cell.x === snake.x && cell.y < snake.y) {
      bodyDistance = Math.abs(apple.y - cell.y);
    }
  });

  if(bodyDistance && !foodDistance) {
    return -1;
  } else if(foodDistance && !bodyDistance) {
    return 1;
  } else if(bodyDistance && foodDistance) {
    if(bodyDistance < foodDistance) {
      return -1;
    } else if(bodyDistance > foodDistance) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

function initializeGame() {
  return initGame;
}