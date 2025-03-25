const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const window_height = window.innerHeight * 0.7; // Ajuste para mantenerlo dentro de la pantalla
const window_width = window.innerWidth * 0.7;
canvas.height = window_height;
canvas.width = window_width;

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
        this.size = Math.random() * 70 + 30; // Tamaño entre 30 y 100 px
        this.posX = Math.random() * window_width;
        this.posY = Math.random() * window_height;
        this.speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5

        // Generar dirección aleatoria de movimiento
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

        // Mueve la imagen en la dirección asignada
        this.posX += this.velX;
        this.posY += this.velY;

        // Si la imagen sale de la pantalla, eliminarla
        if (this.posX + this.size < 0 || this.posX > window_width || this.posY + this.size < 0 || this.posY > window_height) {
            return false;
        }

        this.draw(context);
        return true;
    }

    isClicked(x, y) {
        return (
            x >= this.posX && x <= this.posX + this.size &&
            y >= this.posY && y <= this.posY + this.size
        );
    }

    isHovered(x, y) {
        return (
            x >= this.posX && x <= this.posX + this.size &&
            y >= this.posY && y <= this.posY + this.size
        );
    }
}

let floatingImages = [];

function generateImage() {
    for (let i = 0; i < 5; i++) { // Generar 5 murciélagos en cada intervalo
        floatingImages.push(new FloatingImage());
    }
}

// Dibujar el contador dentro del canvas
function drawCounter() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Fondo semitransparente
    ctx.fillRect(10, 10, 180, 40);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Murcielagos atrapados: ${clickedImagesCount}`, 20, 35);
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    floatingImages = floatingImages.filter(image => image.update(ctx));
    drawCounter(); // Mostrar el contador
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

// Evento para cambiar el cursor cuando el mouse está sobre la imagen
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
