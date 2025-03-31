let des = document.getElementById('des').getContext('2d');

let c1 = new Carro(500, 200, 50, 80, 'darkblue');
let carro = new Carro(750, 700, 90, 100, './assets/carro_01_1.png');
let phaseSystem = new PhaseSystem();
let enemyCars = [
    new Carro2(872, -100, 45, 100, './assets/carro_02.png'),
    new Carro2(870, -100, 45, 100, './assets/carro_03.png'),
    new Carro2(900, -100, 45, 100, './assets/carro_02.png'),
    new Carro2(874, -100, 45, 100, './assets/carro_03.png'),
    new Carro2(870, -500, 45, 100, './assets/carro_02.png')
];

let t1 = new Text()
let t2 = new Text()
let t3 = new Text()
let t4 = new Text()
let t5 = new Text() 

let motor = new Audio('./assets/motor.mp3');
let batida = new Audio('./assets/batida.mp3');
motor.volume = 0.50;
motor.loop = true;
batida.volume = 0.09;

document.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
        case 'w':
            carro.dir.y = -1;
            break;
        case 's':
            carro.dir.y = 1;
            break;
        case 'a':
            carro.dir.x = -1;
            break;
        case 'd':
            carro.dir.x = 1;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key.toLowerCase()) {
        case 'w':
            if (carro.dir.y < 0) carro.dir.y = 0;
            break;
        case 's':
            if (carro.dir.y > 0) carro.dir.y = 0;
            break;
        case 'a':
            if (carro.dir.x < 0) carro.dir.x = 0;
            break;
        case 'd':
            if (carro.dir.x > 0) carro.dir.x = 0;
            break;
    }
})

function updatePhase() {
    if (phaseSystem.update()) {
        const requiredCars = phaseSystem.getRequiredCars();
        while (enemyCars.length < requiredCars) {
            enemyCars.push(
                new Carro2(1600, -100 - (enemyCars.length * 100), 45, 100, 
                    enemyCars.length % 2 === 0 ? './assets/carro_02.png' : './assets/carro_03.png')
            );
        }
        const speedMultiplier = phaseSystem.getSpeedMultiplier();
        enemyCars.forEach(car => car.updateSpeed(speedMultiplier));
    }

    if (phaseSystem.checkVictory()) {
        motor.pause();
        window.location.href = ("vitoria.html");
    }
}

function startGame() {
    carro.vida = 8;
    carro.startTime = Date.now();
    phaseSystem.reset();
    resetEnemyCars();
    motor.play();
}

function resetEnemyCars() {
    enemyCars.forEach((car, index) => {
        car.y = -100 - (index * 100);
        car.x = Math.floor(Math.random() * (1500 - 300 + 1) + 0)
        console.log(`Carro ${index} gerado em X: ${car.x}, Y: ${car.y}`);
        car.updateSpeed(phaseSystem.getSpeedMultiplier());
    })
}


function game_over() {
    console.log("Verificando game_over... Vida atual:", carro.vida)
    if (carro.vida <= 0) {
        console.log("GAME OVER! Redirecionando...")
        jogar = false
        motor.pause()
        // window.location.replace("./under.html")
        window.location.href = "./under.html";

    }
}

function gameOver() {
    if (carro.vida <= 0) {
        console.log("GAME OVER! Espere !!Redirecionamento!!");
        
        jogar = false;  
        motor.pause();


        window.location.href = "./under.html";
    }
}

document.addEventListener('keydown', () => {
    gameOver();
});

function pontos() {
    enemyCars.forEach(car => {
        if (carro.point(car)) {
            carro.pts += 1
        }
    });
}

function colisao() {
    enemyCars.forEach(car => {
        if (carro.colid(car)) {
            carro.vida -= 1
            console.log("Vida após colisão:", carro.vida)
            car.recomeca()
            batida.play()
        }
    });
}


document.addEventListener('keydown', () => {
    if (carro.vida <= 0) {
        console.log("GAME OVER! Redirecionando...");
        window.location.href = "./under.html";
    }
});

function desenha() {
    des.clearRect(0, 0, 1600, 900);
    t1.des_text('Tempo Vivo: ', 1250, 27, 'rgba(241, 4, 4, 0.8)', '30px Arial');  // Amarelo brilhante
    t2.des_text(carro.tempoSurvived, 1445, 30, 'rgba(241, 4, 4, 0.8)', '30px Arial');  // Amarelo brilhante
    t3.des_text('Vida: ', 40, 30, 'rgba(46, 255, 4, 0.8)', '30px Arial');  // Laranja brilhante
    t4.des_text(carro.vida, 120, 30, 'rgba(46, 255, 4, 0.8)', '30px Arial');  // Laranja brilhante
    t5.des_text('Fase: ' + phaseSystem.currentPhase, 750, 30, 'rgba(173, 4, 240, 0.8)', '30px Arial');  // Verde brilhante
    enemyCars.forEach(car => car.des_car_img());
    carro.des_car_img();
}

function atualiza() {
    carro.atualizaTempo();
    updatePhase();
    enemyCars.forEach(car => car.mov_carro2());
    carro.mov_carro();
    pontos();
    colisao();
    game_over();
}

function main() {
    desenha();
    atualiza();
    requestAnimationFrame(main);
}

startGame();
main();