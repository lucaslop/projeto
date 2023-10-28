let isBlockMoving = true;

const unexpectedButton = document.getElementById('unexpectedButton');
const unexpectedLed = document.getElementById('unexpectedLed');
const horn = document.getElementById('horn');

unexpectedButton.addEventListener('click', () => {
    unexpectedLed.classList.toggle('led-off');
    unexpectedLed.classList.toggle('led-on');

    horn.classList.toggle('horn-off');
    horn.classList.toggle('horn-on');

    playHorn();
        
    isBlockMoving = !isBlockMoving;  // Alterna o estado de movimento do bloco
    if (isBlockMoving) {
        startAnimation();  // Se o bloco deve se mover, retoma a animação
    } else {
        stopAnimation();  // Se o bloco deve parar, para a animação
    }
});

function playHorn() {
    const hornSound = document.getElementById('hornSound');
    hornSound.play();
}
        
const arrowUp = document.getElementById('arrowUp');
const arrowDown = document.getElementById('arrowDown');
const arrowLeft = document.getElementById('arrowLeft');
const arrowRight = document.getElementById('arrowRight');

let arrowDirection = '';  // Adicione esta linha no início do seu script

        
function updateArrows() {
    if (blockPosition.row % 2 === 0) {
        if (arrowDirection !== 'right') {
            flashDownArrow();
            arrowDirection = 'right';
        }

        arrowRight.classList.add('arrow-on');
        arrowRight.classList.remove('arrow-off');
        arrowLeft.classList.add('arrow-off');
        arrowLeft.classList.remove('arrow-on');
    } else {
        if (arrowDirection !== 'left') {
            flashDownArrow();
            arrowDirection = 'left';
        }
    
        arrowLeft.classList.add('arrow-on');
        arrowLeft.classList.remove('arrow-off');
        arrowRight.classList.add('arrow-off');
        arrowRight.classList.remove('arrow-on');
    }
}

function flashDownArrow() {
    arrowDown.classList.add('arrow-on');
    arrowDown.classList.remove('arrow-off');

    setTimeout(() => {
        arrowDown.classList.add('arrow-off');
        arrowDown.classList.remove('arrow-on');
        updateArrows();
    }, 500); // Ajuste o tempo conforme desejado
}
const grid = document.getElementById('grid');
const powerButton = document.getElementById('powerButton');
const powerOffButton = document.getElementById('powerOffButton');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const battery = document.getElementById('battery');
const powerLed = document.getElementById('powerLed');
const startLed = document.getElementById('startLed');
const blockDir = { right: '-90deg', left: '90deg', up: '180deg', down: '0deg' }
let blockPosition = { row: 0, col: 0, dir: 'right' };
let movingRight = true;
let animationSpeed = 500; // Ajuste a velocidade desejada (em milissegundos)
let animationInterval;
let batteryLevel = 100;
let isPowerOn = false;
let isAnimationStarted = false;

// Adiciona três blocos pretos em posições aleatórias
const blackBlocks = [];

while (blackBlocks.length < 3) {
    const randomRow = Math.floor(Math.random() * 7);
    const randomCol = Math.floor(Math.random() * 8);
    if (blackBlocks.every(block => block.row !== randomRow || block.col !== randomCol)) {
        blackBlocks.push({ row: randomRow, col: randomCol });
    }
}

function createGrid() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-item');
            grid.appendChild(cell);
        }
    }

    placeBlock();
}

function placeBlock() {
    grid.innerHTML = ''; // Limpa a grade

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-item');
            grid.appendChild(cell);
        }
    }

    blackBlocks.forEach((block) => {
        const blackBlock = document.createElement('div');
        blackBlock.classList.add('block', 'black');
        grid.children[block.row * 9 + block.col].appendChild(blackBlock);
    });

    const block = document.createElement('div');
    block.classList.add('block');
    block.style.cssText = `transform: rotate(${blockDir[blockPosition.dir]})`

    if (blockPosition.row === 7 && blockPosition.col === 0) {
        block.classList.add('ok');
        block.style.cssText = `transform: rotate(90deg)`
    }

    grid.children[blockPosition.row * 9 + blockPosition.col].appendChild(block);
    updateArrows();
}
        
        
const simulateBatteryButton = document.getElementById('simulateBatteryButton');
const batteryText = document.querySelector('.battery-container div');

simulateBatteryButton.addEventListener('click', () => {
    // Define a bateria como vazia
    batteryLevel = 0;
    updateBatteryLevel();

    // Pare o cortador de grama se estiver em execução
    if (isAnimationStarted) {
        toggleStart();
    }

    // Mude a classe da bateria para "battery-red"
    battery.classList.add('battery-red');
});

function moveBlock() {
    if (blockPosition.row === 7 && blockPosition.col === 0) {
        return; // Bloquinho está na última posição, não faz nada
    }

    grid.children[blockPosition.row * 9 + blockPosition.col].removeChild(grid.children[blockPosition.row * 9 + blockPosition.col].firstChild);

    if (movingRight) {
        if (blockPosition.col < 8) {
            blockPosition.col++;
        } else {
            blockPosition.row++;
            movingRight = false;
        }
    } else {
        if (blockPosition.col > 0) {
            blockPosition.col--;
        } else {
            blockPosition.row++;
            movingRight = true;
        }
    }

    console.log(movingRight ? 'right' : 'left')
    blockPosition.dir = movingRight ? 'right' : 'left'
    lastRowPosition = blockPosition.row;
    updateArrows(); 

    placeBlock();
    decreaseBatteryLevel();
}

        
function stopAnimation() {
    clearInterval(animationInterval);
    isAnimationStarted = false;
}

function resetAnimation() {
    stopAnimation();
    grid.style.display = 'none'; // Oculta a grade
    blockPosition = { row: 0, col: 0 };
    movingRight = true;
    batteryLevel = 100;
    updateBatteryLevel();
}

function decreaseBatteryLevel() {
    if (batteryLevel > 0) {
        batteryLevel -= 1;
        updateBatteryLevel();
    } else {
        stopAnimation(); // Pare a animação quando a bateria estiver vazia
        battery.classList.add('battery-red'); // Mude a classe da bateria para vermelho
        startButton.disabled = true; // Desative o botão "Iniciar Movimento" quando a bateria estiver vazia
    }
}

function updateBatteryLevel() {
    battery.style.width = `${batteryLevel}%`;
}

function togglePower() {
    if (isPowerOn) {
        powerLed.classList.remove('led-on');
        powerLed.classList.add('led-off');
        isPowerOn = false;
        resetAnimation();
        grid.style.display = 'none'; // Oculta a grade ao desligar
    } else {
        powerLed.classList.remove('led-off');
        powerLed.classList.add('led-on');
        isPowerOn = true;
        grid.style.display = 'grid'; // Mostra a grade ao ligar
    }
}

function toggleStart() {
    if (isPowerOn) {
        if (batteryLevel > 0) { // Verifique se há carga na bateria
            if (isAnimationStarted) {
                startLed.classList.remove('led-on');
                startLed.classList.add('led-off');
                stopAnimation();
            } else {
                startLed.classList.remove('led-off');
                startLed.classList.add('led-on');
                startAnimation();
            }
        }
    }
}

function startAnimation() {
    if (blockPosition.row === 8) {
        blockPosition = { row: 0, col: 0 };
        createGrid();
    }
    if (!isAnimationStarted && isPowerOn && batteryLevel > 0) { // Verifica se o poder está ligado e há bateria
        isAnimationStarted = true;
        animationInterval = setInterval(moveBlock, animationSpeed);
    }
}

powerButton.addEventListener('click', togglePower);
powerOffButton.addEventListener('click', () => {
    togglePower();
    resetAnimation();
    location.reload(); // Isso recarregará a página, simulando um reset.
});
startButton.addEventListener('click', toggleStart);
stopButton.addEventListener('click', toggleStart);

resetButton.addEventListener('click', () => {
    location.reload()
});

createGrid();