const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Definir tamaño del canvas para que se ajuste sin desbordarse
canvas.width = window.innerWidth * 0.6;
canvas.height = window.innerHeight * 0.6;

let clickedImagesCount = 0;

// Cargar audio
let audio = new Audio("assets/stranger-things.mp3");
audio.loop = true;
audio.play();

let explosionSound = new Audio("pop.mp3");
document.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
    }
});

// Cargar imágenes
const imageSrc = "assets/bat.png";
const cursorImage = "assets/punteria.png";
const image = new Image();
image.src = imageSrc;

class FloatingImage {
    constructor() {
        this.size = Math.random() * 70 + 30;
        this.posX = Math.random() * canvas.width;
        this.posY = Math.random() * canvas.height;
        this.speed = Math.random() * 4 + 1;

        // Dirección aleatoria
        let angle = Math.random() * Math.PI * 2;
        this.velX = Math.cos(angle) * this.speed;
        this.velY = Math.sin(angle) * this.speed;
        this.clicked = false;
    }

    draw(context) {
        if (!this.clicked) {
            context.drawImage(image, this.posX, this.posY, this.size, this.size);
        }
    }

    update(context) {
        if (this.clicked) return false;

        // Mover murciélago
        this.posX += this.velX;
        this.posY += this.velY;

        // Si sale de la pantalla, eliminarlo
        if (this.posX + this.size < 0 || this.posX > canvas.width ||
            this.posY + this.size < 0 || this.posY > canvas.height) {
            return false;
        }

        this.draw(context);
        return true;
    }

    isClicked(x, y) {
        return (x >= this.posX && x <= this.posX + this.size &&
                y >= this.posY && y <= this.posY + this.size);
    }

    isHovered(x, y) {
        return (x >= this.posX && x <= this.posX + this.size &&
                y >= this.posY && y <= this.posY + this.size);
    }
}

let floatingImages = [];

// Generar murciélagos
function generateImage() {
    for (let i = 0; i < 5; i++) {
        floatingImages.push(new FloatingImage());
    }
}

// Dibujar contador dentro del canvas
function drawCounter() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(10, 10, 180, 40);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Murciélagos atrapados: ${clickedImagesCount}`, 20, 35);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    floatingImages = floatingImages.filter(image => image.update(ctx));
    drawCounter();
    requestAnimationFrame(animate);
}

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    floatingImages.forEach(img => {
        if (img.isClicked(mouseX, mouseY) && !img.clicked) {
            img.clicked = true;
            explosionSound.currentTime = 0;
            explosionSound.play();
            clickedImagesCount++;
        }
    });
});

// Cambiar cursor al pasar sobre un murciélago
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    let hovering = false;
    floatingImages.forEach(img => {
        if (img.isHovered(mouseX, mouseY) && !img.clicked) {
            hovering = true;
        }
    });

    if (hovering) {
        canvas.style.cursor = `url(${cursorImage}), auto`;
    } else {
        canvas.style.cursor = "default";
    }
});

setInterval(generateImage, 1000);
animate();
