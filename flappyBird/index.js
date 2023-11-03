const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

//State = data
const bird = {
    x:30,
    y: canvas.height / 2 - 20,
    width: 50,
    height: 40,
    vy: 0,
    ay: 800,
}

const columns = [];
const GAP = 150;
const COLUMN_VELOCITY = -200;
const COLUMN_DISTANCE = 200;
let isEnd = false;


//object Images
const images = {
    bg : new Image(),
    bird : new Image(),
    column : new Image(),
};

images.bg.src = "bg.png";
images.bird.src = "bird.png";
images.column.src = "column.png";


function random(a,b){
    return Math.floor(Math.random() * (b-a+1)) + a;
}


function addColumn(){
    const h = random(30, canvas.height - 30 - GAP);
    columns.push({
        x: canvas.width,
        y: 0,
        width: 50,
        height: h,
    },
    {
        x:canvas.width,
        y: h + GAP,
        width: 50,
        height: canvas.height - h - GAP,
    })
}

function isColliding(a,b){
    return !(
        a.x > b.x + b.width ||
        a.y > b.y + b.height || 
        b. x > a.x + a.width ||
        b.y > a.y + a.height
    );
}

//game loop
let prevTime = performance.now();
function gameLoop(now = performance.now()){
    const dt = (now - prevTime) / 1000; 
    prevTime = now;
    //console.log(dt);
    update(dt);
    draw();

    if (!isEnd){
        requestAnimationFrame(gameLoop);
    }
}

function update(dt){
    //updating application state
    //bird
    bird.vy += bird.ay * dt; //dv = a * dt (velocity)
    bird.y += bird.vy * dt; //ds = v * dt (position)

    //ceiling check
    if(bird.y < 0){
        isEnd = true;
    }
    //columns
    columns.forEach(column =>{
        column.x += COLUMN_VELOCITY  * dt;
        if(isColliding(column,bird)){
            isEnd = true;
        }
    });

    //add new columns
    const lastColumn = columns[columns.length-1];
    if(lastColumn && canvas.width - lastColumn.x > COLUMN_DISTANCE){
        addColumn();
    }

    //delete columns
    const firstColumn = columns[0];
    if(firstColumn.x + firstColumn.width < 0){
        columns.shift();
        columns.shift();
    }


}

function draw(){
    //sky:
    ctx.fillStyle = "lightblue";

    ctx.drawImage(images.bg,0,0,canvas.width,canvas.height);

    ctx.fillStyle = "yellow";

    ctx.drawImage(images.bird, bird.x, bird.y,bird.width,bird.height);

    columns.forEach(column =>{
        ctx.fillStyle = "orange";
        ctx.drawImage(images.column, column.x, column.y, column.width, column.height);
    });

    if (isEnd) {
        ctx.fillText("Game over", 20, 20);
      }

}

// Event listeners
document.addEventListener("keydown", onPress);
function onPress(e) {
  bird.vy = -300;
}
canvas.addEventListener("click", function (e) {
  console.log(e.clientX);
})


// Start
addColumn();
gameLoop();