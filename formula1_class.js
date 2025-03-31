class Obj {
    constructor(x, y, w, h, a) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.a = a;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    des_obj() {
        des.fillStyle = this.a;
        des.fillRect(this.x, this.y, this.w, this.h, this.a);
    }
}

class Carro extends Obj {
    dir = { x: 0, y: 0 };
    pts = 0;
    vida = 5;
    frame = 1;
    tempo = 0;
    tempoSurvived = 0;
    startTime = 0;
    friction = 0.97;
    speed = 8;

    constructor(x, y, w, h, a) {
        super(x, y, w, h, a);
        this.startTime = Date.now();
    }

    des_car_img() {
        let img = new Image();
        img.src = this.a;
        des.drawImage(img, this.x, this.y, this.w, this.h);
    }


    des_carro() {
        des.beginPath();
        des.lineWidth = '5';
        des.strokeStyle = 'blue';
        des.fillStyle = this.a;
        des.rect(this.x, this.y, this.w, this.h);
        des.closePath();
        des.stroke();
        des.fill();
    }

    mov_carro() {
        if (this.dir.x !== 0) {
            this.velocityX = this.dir.x * this.speed;
        } else {
            this.velocityX *= this.friction;
        }
    
        if (this.dir.y !== 0) {
            this.velocityY = this.dir.y * this.speed;
        } else {
            this.velocityY *= this.friction;
        }
    
        this.x += this.velocityX;
        this.y += this.velocityY;
    
        if (this.x <= 50) {  
            this.x = 50;
            this.velocityX = 0;
        } else if (this.x >= 1450) {
            this.x = 1450;
            this.velocityX = 0;
        }
    
        if (this.y <= 100) {
            this.y = 100;
            this.velocityY = 0;
        } else if (this.y >= 800) {
            this.y = 800;
            this.velocityY = 0;
        }
    }
    

    point(objeto) {
        let distance = Math.sqrt(
            Math.pow(this.x - objeto.x, 2) +
            Math.pow(this.y - objeto.y, 2)
        );
        return distance < 100;
    }

    colid(objeto) {
        if ((this.x < objeto.x + objeto.w) &&
            (this.x + this.w > objeto.x) &&
            (this.y < objeto.y + objeto.h) &&
            (this.y + this.h > objeto.y)) {
            return true;
        }
        return false;
    }

    atualizaTempo() {
        this.tempoSurvived = Math.floor((Date.now() - this.startTime) / 1000);
    }
}

class Carro2 extends Carro {
    constructor(x, y, w, h, a) {
        super(x, y, w, h, a);
        this.baseSpeed = Math.random() * 2 + 10;
        this.speed = this.baseSpeed;
    }

    mov_carro2() {
        this.y += this.speed;
        if (this.y >= 900) {
            this.recomeca();
        }
    }

    recomeca() {
        this.y = -100;
        this.x = Math.floor(Math.random() * (1500 - 100 + 1) + 100);
        // velocidade vai aumentar depedendo da fase
        this.speed = this.baseSpeed;
    }

    updateSpeed(phaseSpeedMultiplier) {
        this.speed = this.baseSpeed + (phaseSpeedMultiplier * 2);
    }
}

class PhaseSystem {
    constructor() {
        this.currentPhase = 1;
        this.maxPhases = 7; // 7 fases
        this.phaseStartTime = Date.now();
        this.phaseDuration = 20000; // 20 segundos
        this.carsPerPhase = 3;
        this.baseSpeed = 10;
        this.hasWon = false; // verifica se ganhou
    }

    update() {
        const currentTime = Date.now();
        if (currentTime - this.phaseStartTime >= this.phaseDuration && this.currentPhase < this.maxPhases) {
            this.currentPhase++;
            this.phaseStartTime = currentTime;
            
            // verifica condição de vitoria
            if (this.currentPhase === this.maxPhases) {
                this.hasWon = true;
            }
            return true;
        }
        return false;
    }

    getSpeedMultiplier() {
        return this.currentPhase - 1;
    }

    getRequiredCars() {
        return this.carsPerPhase * this.currentPhase;
    }

    reset() {
        this.currentPhase = 1;
        this.phaseStartTime = Date.now();
        this.hasWon = false;
    }

    checkVictory() {
        return this.hasWon;
    }
}

class Text {
    des_text(text, x, y, cor, font) {
        des.fillStyle = cor;
        des.lineWidth = '5';
        des.font = font;
        des.fillText(text, x, y);
    }
}

class Button {
    constructor(x, y, width, height, text) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.hovered = false;
    }

    checkHover(mouseX, mouseY) {
        this.hovered = mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height;
    }
}