/* 

Code provide by Chris Courses youtube channel - https://www.youtube.com/watch?v=eI9idPTT0c4&list=PLpPnRKq7eNW16Wq1GQjQjpTo_E0taH0La

Basic Game CheckLIst
- Create a player
- Shoot projectiles
- Create enemies
- Detect collision on enemy / projectile hit
- Detect collision on enemy / player hit
- Remove off screen projectiles
- Colorize game
- Shrink enemies on hit
- Create particle explosion on hit
- Add score
- Add Restart button
- Add start game button

*/

// Creating a Canvas that fills the entire browser window:

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create a player:
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }
}

// Creating projectiles
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y; 
    }
}

// Placing the player in the center of the canvas:
const x = canvas.width / 2;
const y = canvas.height / 2;

// Setting the player parameters
const player = new Player(x, y, 30, 'blue');

// Shooting projectiles

const projectiles = []

function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Drawing the player:
    player.draw();
    // Drawing projectiles
    projectiles.forEach((projectile) => {
        projectile.update();
    })
}

addEventListener('click', (Event) => {
    const angle = Math.atan2(Event.clientY - y, Event.clientX - x);
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    projectiles.push(
        new Projectile(x, y, 5, 'red', velocity)
    )
})

animate();

