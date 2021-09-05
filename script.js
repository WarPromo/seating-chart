
let mouseDownX = 0;
let mouseDownY = 0;

let mouesDownDX = 0;
let mouseDownDY = 0;

let mouseIsClicked = false;
let dragging = false;
let draggedObject = null;
let downloadMode = false;

let people = [];
let deletedSeat = [];
let peopleInput;



let buttonCopies = {
  "4Seat":{
    seats: [ [37, 37, 37, 37],[37, 37, -37, 37],[37, 37, 37, -37],[37, 37, -37, -37]  ],
    names: [],
    center:{
      x: 1137,
      y: 100,
      dx: 0,
      dy: 0
    },
    button:{
      sizeX: 15,
      sizeY: 15
    },
    deleteButton:{
      sizeX: 10,
      sizeY: 10,
      dx: 0,
      dy: -60
    }
  },
  "3Seat":{
    seats: [ [37, 37, 0, 37],[37, 37, 37, -37],[37, 37, -37, -37]  ],
    names: [],
    center:{
      x: 1137,
      y: 275,
      dx: 0,
      dy: 0
    },
    button:{
      sizeX: 15,
      sizeY: 15
    },
    deleteButton:{
      sizeX: 10,
      sizeY: 10,
      dx: 0,
      dy: -60
    }
  },
  "2Seat":{
    seats: [ [37, 37, 37, 0],[37, 37, -37, 0] ],
    names: [],
    center:{
      x: 1137,
      y: 420,
      dx: 0,
      dy: 0
    },
    button:{
      sizeX: 15,
      sizeY: 15
    },
    deleteButton:{
      sizeX: 10,
      sizeY: 10,
      dx: 0,
      dy: -25
    }
  },
  "1Seat":{
    seats: [ [37, 37, 0, 37] ],
    names: [],
    center:{
      x: 1137,
      y: 550,
      dx: 0,
      dy: -60
    },
    button:{
      sizeX: 15,
      sizeY: 15
    },
    deleteButton:{
      sizeX: 10,
      sizeY: 10,
      dx: 0,
      dy: -25
    }
  }

}


let objects = {}


function setup() {
  textAlign(CENTER, CENTER);
  createCanvas(1300, 800);
  peopleInput = createElement("textarea", "");
  peopleInput = peopleInput.position(1055, 700)
  peopleInput.style("resize", "none");
  peopleInput.style("font-family", "Helvetica")
  peopleInput.style("font-weight", "bold")
  peopleInput.style("spellcheck", "none")
  peopleInput.value("Bob, Joe");

  strokeWeight(3);

}

function downloadURI(uri, name) {
  console.log("CALLED " + downloadMode);
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}


function drawOnlySeats(){

  for(id in objects){

    let obj = objects[id]
    let x = obj.center.x+obj.center.dx;
    let y = obj.center.y+obj.center.dy;

    let seats = obj.seats;

    for(var i = 0; i < seats.length; i++){

      drawseat(seats[i], obj);

      let name = obj.names[i].value();
      let input = obj.names[i];

      fill("white");
      textStyle(BOLDITALIC);
      textSize(12);
      text(name, seats[i][2] + obj.center.x, input.position().y)

      
    }

  }

}


function draw() {
  background(100);

  if(downloadMode == true){
    
    downloadMode = false;
    peopleInput.hide();
    drawOnlySeats();
    console.log("called");
    downloadURI( canvas.toDataURL('image/png'), "seatingchart" )
    
    peopleInput.show();
  }

  fill("white");
  textStyle(BOLDITALIC);
  textSize(12);
  text("Put names here seperated by a comma\nClick button to randomize", 1155, 670);
  let randomize = drawButtonStyle(1020, 720, 16, 16, "red", "yellow");
  if(randomize) randomizeNames();

  let downloadCanvas = drawButtonStyle(1020, 600, 16, 16, "green", "blue"); 

  fill("white");

  text("Click Button to download Image", 1140, 600);

  if(downloadCanvas){

    downloadMode = true;
    mouseIsClicked = false;
    return;
  }

  seatCopier();

  

  let arr = peopleInput.value().split(",");

  let peopleobj = {...arr};

  for(id in objects){

    let obj = objects[id]
    let x = obj.center.x+obj.center.dx;
    let y = obj.center.y+obj.center.dy;

    let seats = obj.seats;



    for(var i = 0; i < seats.length; i++){

      drawseat(seats[i], obj);
      
    }



    if(obj.names.length == 0){
      for(var i = 0; i < seats.length; i++){

        let inp = createInput('');
        let width = 37;
        
        
        inp.size(width);

        inp.position(x+seats[i][2] - width/2 + 4, y+seats[i][3], RADIUS);
        inp.style("font-weight", "bold")
        
        obj.names.push(inp);
        


      }
    }
    else{
      let width = 37;
      for(var i = 0; i < obj.names.length; i++){
        obj.names[i].position(x+seats[i][2] - width/2 + 4, y+seats[i][3], RADIUS);
        
      }
    }

    let fillColor = "white";

    if(id == draggedObject) fillColor = "blue";
    let clicked = drawButton(x, y, obj.button.sizeX, obj.button.sizeY, fillColor)

    if(clicked && draggedObject == null){
      console.log("Clicked");
      draggedObject = id;
    }

    let del = drawButton(x+obj.deleteButton.dx, y+obj.deleteButton.dy, obj.deleteButton.sizeX, obj.deleteButton.sizeY, "red")

    fill("white");

    text("X", x+obj.deleteButton.dx, y+obj.deleteButton.dy)

    if(del){

      for(var i = 0; i < obj.names.length; i++){
        obj.names[i].remove()
      }

      delete objects[id];
    }

  }

  if(draggedObject != null){

    let dx = mouseX - pmouseX;
    let dy = mouseY - pmouseY;

    let obj = objects[draggedObject]

    obj.center.x += dx;
    obj.center.y += dy;

  }

  if(dragging == false){
    draggedObject = null;
  }
  

  mouseIsClicked = false;


}

function seatCopier(){
  for(id in buttonCopies){
    let obj = buttonCopies[id]
    let x = obj.center.x+obj.center.dx;
    let y = obj.center.y+obj.center.dy;



    let seats = obj.seats;



    for(var i = 0; i < seats.length; i++){

      drawseat(seats[i], obj);
      
    }


    let fillColor = "white";

    if(id == draggedObject) fillColor = "green";
    let clicked = drawButton(x, y, obj.button.sizeX, obj.button.sizeY, fillColor)

    if(clicked && draggedObject == null){
      let id = Date.now();

      let objCopy = JSON.parse(JSON.stringify(obj))
      objCopy.center.x -= 50
      objects[id] = objCopy;

      draggedObject = id;
    }

  }


}


function randomizeNames(){
  let names = peopleInput.value().split(",");
  let peopleobj = {...names};

  Loop: for(id in objects){
    let obj = objects[id];

    let names = obj.names;

    for(var a = 0; a < names.length; a++){
      
      let keys = Object.keys(peopleobj);

      if(keys.length == 0){
        names[a].value("");
        continue;
      }
      let random = keys[Math.floor(Math.random() * keys.length)];
      let name = peopleobj[random];

      names[a].value(name);

      delete peopleobj[random];


    }

  }
}

function drawButton(x, y, widthX, widthY, fillColor){
  let hover = false;
  fill(fillColor)

  if( Math.abs(mouseX - x) < widthX && Math.abs(mouseY - y) < widthY){
    hover = true;
  }
  

  rectMode(RADIUS)

  rect(x, y, widthX, widthY)

  if(hover && mouseIsClicked){
    return true;
  }
  return false;

}

function drawButtonStyle(x, y, widthX, widthY, fillColor, hoverColor){
  let hover = false;
  let color = fillColor;
  

  if( Math.abs(mouseX - x) < widthX && Math.abs(mouseY - y) < widthY){
    hover = true;
    color = hoverColor;
  }

  fill(color)
  

  rectMode(RADIUS)

  rect(x, y, widthX, widthY)

  if(hover && mouseIsClicked){
    return true;
  }
  return false;

}


function drawseat(seat, obj){
  fill(135, 95, 36)
  rectMode(RADIUS)

  let x = obj.center.x+obj.center.dx;
  let y = obj.center.y+obj.center.dy;
  rect(x + seat[2], y + seat[3], seat[0], seat[1], 5, 5)
}

function mousePressed(){
  mouseDownX = mouseX;
  mouseDownY = mouseY;
  mouseIsClicked = true;
  dragging = true;
}

function mouseReleased(){
  dragging = false;
}