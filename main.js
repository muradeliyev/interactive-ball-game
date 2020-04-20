const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const constrain = (val, min, max) => Math.max(min, Math.min(val, max)); // constrain function
const dist = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2); // distance function
const map = (val, a, b, c, d) => {
    let x = ((d - c) * (val - a)) / (b - a);
    return c + x;
}

// this is the function that returns the distance bewteen 
// a point and a line
function distPointLine(px, py, lineA, lineB) {
    let x0 = px;
    let y0 = py;
    let x1 = lineA.x;
    let y1 = lineA.y;
    let x2 = lineB.x;
    let y2 = lineB.y;
    let den = dist(x1, y1, x2, y2);
    let up = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);

    return up / den;
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        if (v instanceof Vector) {
            this.x += v.x;
            this.y += v.y;
        }
    }
    get mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    setMag(m) {
        let d = this.mag;
        this.x = (this.x / d) * m;
        this.y = (this.y / d) * m;

        return this;
    }
}
Vector.prototype.print = () => {
    console.log(this.x, this.y);
}

class Ball {
    constructor() {
        this.pos = new Vector(30, 50);
        this.vel = new Vector(0, 0);
        this.a = 0.5;
        this.r = 10;
    }
    update() {
        this.pos.add(this.vel);

        if (this.pos.y + this.r > canvas.height || this.pos.y - this.r < 0) {
            this.vel.y *= -0.6;
        }
        if (this.pos.x + this.r > canvas.width || this.pos.x - this.r < 0) {
            this.vel.x *= -0.6;
        }
        this.pos.x = constrain(this.pos.x, this.r, canvas.width - this.r);
        this.pos.y = constrain(this.pos.y, this.r, canvas.height - this.r);

        if (this.pos.y == canvas.height - this.r || this.pos.y == this.r) {
            this.vel.x += this.vel.x > 0 ? -0.03 : 0.03; // friction
        }
        this.vel.y += this.a;
    }
    show() {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, false);
        ctx.moveTo(50, 50);
        ctx.lineTo(this.vel.x + 50, 50 + this.vel.y);
        ctx.strokeStyle = 'green';
        ctx.stroke();
        ctx.fill();
    }
}
const mouse = {
    x1: undefined,
    y1: undefined,
    x2: undefined,
    y2: undefined,
    x: undefined,
    y: undefined,
    isDown: false
}
var ball = new Ball();
window.addEventListener("mousemove", event => {
    if (event.target === canvas) {
        let offset = canvas.getBoundingClientRect();
        mouse.x = event.clientX - offset.x;
        mouse.y = event.clientY - offset.y;
    }
});
window.addEventListener("mousedown", event => {
    if (event.target === canvas) {
        let offset = canvas.getBoundingClientRect();
        mouse.x1 = event.clientX - offset.x;
        mouse.y1 = event.clientY - offset.y;
        mouse.isDown = true;
    }
});
window.addEventListener("mouseup", event => {
    if (event.target === canvas && mouse.x1 != mouse.x2 && mouse.y1 != mouse.y2) {
        let offset = canvas.getBoundingClientRect();
        mouse.x2 = event.clientX - offset.x;
        mouse.y2 = event.clientY - offset.y;
        mouse.isDown = false;

        let d = dist(mouse.x1, mouse.y1, mouse.x2, mouse.y2);
        let x = (mouse.x2 - mouse.x1) / d;
        let y = (mouse.y2 - mouse.y1) / d;

        let vel = new Vector(x, y);
        let newMag = constrain(map(d, 0, 100, 0, 20), 0, 20);
        vel.setMag(newMag);
        ball.vel = vel;
    } else {
        mouse.x1 = undefined;
        mouse.y1 = undefined;
    }
});
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.update();
    ball.show();

    if (mouse.isDown) {
        ctx.moveTo(mouse.x1, mouse.y1);
        ctx.lineTo(mouse.x, mouse.y);
    }
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2, false);
    ctx.strokeStyle = 'red';
    ctx.stroke();
}
animate();