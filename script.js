const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
let particlesArr = null;
let adjustX = 25;
let adjustY = 10

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
    x: null,
    y: null,
    radius: 200
}

ctx.fillStyle = "white"
ctx.font = "30px Verdana"
ctx.fillText("Particle", 0, 40)
let textCords = ctx.getImageData(0, 0, 200, 100)

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.density = Math.random() * 30 + 5;
        this.baseX = x;
        this.baseY = y;
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
        ctx.fill()
        ctx.closePath()
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;

        let dist = Math.sqrt(dx * dx + dy * dy)

        let forcedX = dx / dist
        let forcedY = dy / dist

        let force = (mouse.radius - dist) / mouse.radius
        let directX = force * forcedX * this.density;
        let directY = force * forcedY * this.density

        if (dist < mouse.radius && mouse.x != null) {
            this.x -= directX
            this.y -= directY
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10
            }

            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10
            }
        }
    }
}

function init() {
    particlesArr = [];

    // Particles
    for (let row = 0, rowLen = textCords.height; row < rowLen; row++) {
        for (let col = 0, colLen = textCords.width; col < colLen; col++) {
            if (textCords.data[(row * 4 * textCords.width) + (col * 4) + 3] > 128) {
                let posX = col + adjustX;
                let posY = row + adjustY;
                particlesArr.push(new Particle(posX *10, posY *10))
            }
        }
    }

}

console.log(particlesArr)

init()

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < particlesArr.length; i++) {
        particlesArr[i].draw()
        particlesArr[i].update()
    }

    requestAnimationFrame(animate)
}

animate()

canvas.onmousemove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

canvas.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
})

window.onresize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}