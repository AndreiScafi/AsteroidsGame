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

// Check External Libraly 
console.log(gsap)

// Creating a Canvas that fills the entire browser window:

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create a Score:

const socreEl = document.querySelector('#scoreEl')

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

// Creating Enemies
class Enemy {
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
// Creating Particles friction:
const friction = 0.99;

// Creating Particles
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        //context.save();
        //context.globalAlpha = this.alpha;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.restore;
    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}


// Placing the player in the center of the canvas:
const x = canvas.width / 2;
const y = canvas.height / 2;

// Setting the player parameters
const player = new Player(x, y, 15, 'white');

// Shooting projectiles
const projectiles = [];

// Spawning Enemies
const enemies = [];

// Spawning Particles
const particles = [];

function spawnEnemies() {
    setInterval( () => {

        //Enemies size
        const radius = Math.random() * (40 - 10) + 10;

        // Spawning Enemies random
        let xx;
        let yy;
        
        if (Math.random() < 0.5) {
            xx = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            yy = Math.random() * canvas.height;
        } else {
            yy = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
            xx = Math.random() * canvas.width; 
        }

        // Randomize enemy color.
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const angle = Math.atan2(y - yy, x - xx);
        const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    enemies.push(new Enemy(xx, yy, radius, color, velocity));

    }, 1000)
}

// Animation Frames
let animationId;
let score = 0;
function animate() {
    animationId = requestAnimationFrame(animate);

    //Painting the background
    context.fillStyle = 'rgba(0, 0, 0, 0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Drawing the player:
    player.draw();

    // Drawing particles:
    particles.forEach((particle, index) => {

        // removing particles of the screen:
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
        
    })

    // Drawing projectiles
    projectiles.forEach((projectile, index) => {
        projectile.update();

        //Removing projectiles after they get out of the canvas
        if (projectile.x + projectile.radius < 0 || 
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 || 
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            })
        }
    })
    enemies.forEach((enemy, index) => {
        enemy.update();

        //Colision Detection
        //Killing Player - End Game
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        if (dist - enemy.radius - player.radius < 1) {
            console.log('End Game')
            cancelAnimationFrame(animationId);
        }

        //Killing Enemies
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            // When projectiles touch enemy
            if (dist - enemy.radius - projectile.radius < 1) {

                //Spreading particles
                for (let i = 0; i < enemy.radius * 1.5; i++) {
                   particles.push(new Particle(
                    projectile.x, 
                    projectile.y, 
                    //Particle Size:
                    Math.random() * 2, 
                    //Particle Color:
                    enemy.color, 
                    //Particle Velocity:
                    {x: (Math.random() - 0.5) * (Math.random() * 5), y: (Math.random() - 0.5) * (Math.random() * 5)} 
                    ));   
                }
                //Shrinking enemies
                if (enemy.radius - 10 > 8) {

                    // Increase our score
                    score += 100;
                    socreEl.innerHTML = score;

                    //Using external libraly gsap:
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                  
                    //removing projectile:
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                } else {

                    // Increase our score bonus for each kill
                    score += 250;
                    socreEl.innerHTML = score;

                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }
   

            }
        })

    })
}

addEventListener('click', (Event) => {
    //console.log(projectiles);
    const angle = Math.atan2(Event.clientY - y, Event.clientX - x);
    const velocity = {
        x: Math.cos(angle) * 6,
        y: Math.sin(angle) * 6
    }
    projectiles.push(
        new Projectile(x, y, 5, 'white', velocity)
    )
})

animate();
spawnEnemies();

