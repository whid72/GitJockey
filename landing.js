//call the canvas
const canvas = document.getElementById("canvas1");

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//You need the array to set a home for the randomization
let particlesArray;

//get the user's mouse positioning

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 160) * (canvas.width / 160),
}

window.addEventListener("mousemove",
    function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
// create particle objs\
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    //method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = "#000000";
        ctx.fill();
    }
    //check particle position, check mouse position, move the particle, draw the particle
    update() {
        //check if particle is still within canvass
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        //check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y
        //circle formula for mouse. 
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 5) {
                this.x += 5;
            }
            if (mouse.x > this.x && this.x < canvas.width - this.size * 5) {
                this.x -= 5;
            }
            if (mouse.y < this.y && this.y < canvas.width - this.size * 5) {
                this.y += 5;
            }
            if (mouse.x > this.y && this.y < canvas.width - this.size * 5) {
                this.y -= 5;
            }
        }
        //move particle
        this.x += this.directionX;
        this.y += this.directionY;
        //draw particle
        this.draw();
    }
}

//creat particle array
function init() {
    particlesArray = [];
    let numPar = (canvas.height * canvas.width) / 9000;
    console.log(numPar);
    for (let i = 0; i < numPar * 1.5; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() + ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() + ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = "#000000";
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// check if particles are close enough to draw line between them
function connect(){
    let opacityValue = 1;
    for(let a = 0; a < particlesArray.length; a++){
        for(let b = a; b < particlesArray.length; b++){
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/7) * canvas.height/7){
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle="rgba(00,00,00, " + opacityValue + "1)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}
//animation loop
    function animate(){
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        //to update each individual particle
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }
    
    //resize event for the browser. Quality
    window.addEventListener("resize",
        function(){
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            mouse.radius = ((canvas.height/80) * (canvas.height/80));
            init();
        }
    );

//mouseout event

window.addEventListener("mouseout", 
    function(){
        mouse.x = undefined;
        mouse.y = undefined;
    });

init();
animate();