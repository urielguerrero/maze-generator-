var cols, rows;
// w = how wide or big is each cell block
var w = 20;
var move = 5;
var grid = [];
var current;
var stack = [];
let value = 0;
// variables for new square block
var posX = 0;
var posY = 0;

function setup() {
  createCanvas(300, 300);
  cols = floor(width / w);
  rows = floor(height / w);
  // frameRate(5);
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  current = grid[0];
}

function draw() {
  background(51);
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  current.visited = true;
  current.highlight();
  // STEP 1
  var next = current.checkNeighbors();
  if (next) {
    next.visited = true;
    // STEP 2
    stack.push(current);
    // STEP 3
    removeWalls(current, next);
    // STEP 4
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
  // creates a player block
  fill(value);

  rect(posX, posY, 20, 20);
  //

  //create window(canvas) boundaries for rect 
  //https://www.youtube.com/watch?v=JV5XBmaQdIA 
  if (posX < 0) {
    posX += move;
  }

  if (posX > 285) {
    posX -= move;
  }

  if (posY < 0) {
    posY += move;
  }

  if (posY > 285) {
    posY -= move;
  }

  //https://stackoverflow.com/questions/43154831/detecting-collision-with-color-on-a-canvas-in-html5javascript/43214029 

}
// // each cell needs to know what column and row it's in, each cell as a column and row number to be easily identified 

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

// //each cell as a column and row number to be easily identified
function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

//i is for column number 
//j is for row number
// each cell knows where it is, what's it's  colum, what it's row and it knows whether to draw its walls (top, right, bottom left)
function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;

  //https://www.youtube.com/watch?v=D8UgRyRnvXU
  this.checkNeighbors = function () {
    var neighbors = [];
    // the four options a box is open 
    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }


  }
  // function that creates the rectangle thing that fills the maze 

  this.highlight = function () {
    var x = this.i * w;
    var y = this.j * w;
    // changes the color of the square block from the actual maze so that its noticeable(optional)
    // noStroke();
    // fill(0, 0, 255, 200);
    // rect(x, y, w, w);

  }

  this.show = function () {
    var x = this.i * w;
    var y = this.j * w;
    stroke(255);
    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y);
    }
    this.rectColor(x, y, w);
    // if (this.visited) {
    //   noStroke();
    //   // fill(255, 0, 255, 100);
    //   // color of filled maze (optional)
    //   fill(204, 102, 0, 200);
    //   rect(x, y, w, w);
    // }
  }

  // changes the color of the maze to indicate that the cell its currently at has just been visited 
  this.rectColor = function (x, y, w) {
    if (this.visited) {
      noStroke();
      // fill(255, 0, 255, 100);
      fill(204, 102, 0, 200);
      rect(x, y, w, w);
    }
  }
}
//
function pixelToCoord(posX, posY) {
  let x = Math.floor(posX / 20);
  let y = Math.floor(posY / 20);
  return [x, y];
}
// this function we are combining functions PixelToCoord, KeyPressed, and index
function cellAt(posX, posY) {
  let c = pixelToCoord(posX, posY);
  let x = c[0];
  let y = c[1];
  let i = index(x, y);
  return grid[i];
}


//https://p5js.org/reference/#/p5/keyPressed 
// use as reference to move square block 
//https://replit.com/@JasonHallsten/snek?v=1
//https://codepen.io/Sorb/pen/wvwJZLj 

// when canvas is pressed with mouse the square block is moved
function keyPressed() {
  let cell = cellAt(posX, posY);
  console.log(cell.walls);
  // console.log("In " + cellAt(posX, posY));
  // right arrow
  if (keyCode === 39) {
    if (cell.walls[1] == false) {
      posX += w;
    }

  }
  // left arrow 
  if (keyCode === 37) {
     if (cell.walls[3] == false) {
      posX -= w;
     }
  }

  // down arrow 
  if (keyCode === 40) {
     if (cell.walls[2] == false) {
      posY += w;
    }
  }
  // up arrow 
  if (keyCode === 38) {
    if (cell.walls[0] == false) {
      posY -= w;
    }
  }
}

