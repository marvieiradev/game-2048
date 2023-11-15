document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const size = 4;
    let board = [];
    let currentScore = 0;
    const currentScoreElement = document.getElementById('current-score');
    console.log(currentScore)
    //Obtendo o Highscore do armazenamento local

    let highScore = localStorage.getItem('2048-highscore') || 0;
    const highScoreElement = document.getElementById('high-score');
    highScoreElement.textContent = highScore;

    const gameOverElement = document.getElementById('game-over');
    //Função para atualizar a pontuação
    function updateScore(value) {
        currentScore += value;
        currentScoreElement.textContent = currentScore;
        if (currentScore > highScore) {
            highScore = currentScore;
            highScoreElement.textContent = highScore;
            localStorage.setItem('2048-highScore', highScore);
        }
    }

    // Função para reiniciar o jogo

    function restartGame() {
        currentScore = 0;
        currentScoreElement.textContent = '0';
        gameOverElement.style.display = 'none';
        initializeGame();
    }

    //Função para iniciar o jogo

    function initializeGame() {
        board = [...Array(size)].map(e => Array(size).fill(0));
        placeRandom();
        placeRandom();
        renderBoard();
    }

    //Função para renderizar o jogo e as informações
    function renderBoard() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);

                const prevValue = cell.dataset.value;
                const currentValue = board[i][j];
                if (currentValue !== 0) {
                    cell.dataset.value = currentValue
                    cell.textContent = currentValue;
                    //Animação
                    if (currentValue !== parseInt(prevValue) && !cell.classList.contains('new-tile')) {
                        cell.classList.add('merged-tile');
                    }
                } else {
                    cell.textContent = '';
                    delete cell.dataset.value;
                    cell.classList.remove('merged-tile', 'new-tile');
                }
            }
        }

        //Limpar classes da animação
        setTimeout(() => {
            const cells = document.querySelectorAll('.grid-cell');
            cells.forEach(cell => {
                cell.classList.remove('merged-tile', 'new-tile');

            });
        }, 300);
    }

    //Função para colocar um valor em uma celula aleatoria
    function placeRandom() {
        const avaliable = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) {
                    avaliable.push({ x: i, y: j });
                }
            }
        }

        if (avaliable.length > 0) {
            const randomCell = avaliable[Math.floor(Math.random() * avaliable.length)];
            board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
            const cell = document.querySelector(`[data-row="${randomCell.x}"][data-col="${randomCell.y}"]`);
            //Animação para novos elementos
            cell.classList.add('new-tile');
        }
    }

    //Função para mover os quadrados baseado nas teclas do teclado
    function move(direction) {
        let hasChanged = false;
        if (direction === 'ArrowUp' || direction === 'ArrowDown') {
            for (let j = 0; j < size; j++) {
                const column = [...Array(size)].map((_, i) => board[i][j]);
                const newColumn = transform(column, direction === 'ArrowUp');
                for (let i = 0; i < size; i++) {
                    if (board[i][j] !== newColumn[i]) {
                        hasChanged = true;
                        board[i][j] = newColumn[i];

                    }
                }
            }
        } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
            for (let i = 0; i < size; i++) {
                const row = board[i];
                const newRow = transform(row, direction === 'ArrowLeft');
                if (row.join(',') !== newRow.join(',')) {
                    hasChanged = true;
                    board[i] = newRow;
                }
            }
        }

        if (hasChanged) {
            placeRandom();
            renderBoard();
            checkGameOver();
        }
    }

    //Função para transformar a linha (linha ou coluna) baseado na direção do movimento

    function transform(line, moveTowardsStart) {
        let newLine = line.filter(cell => cell !== 0);
        if (!moveTowardsStart) {
            newLine.reverse();

        }

        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                //Atualiza a pontuação quando os quadrados são unidos
                updateScore(newLine[i]);
                newLine.splice(i + 1, 1);
            }
        }
        while (newLine.length < size) {
            newLine.push(0);
        }

        if (!moveTowardsStart) {
            newLine.reverse();
        }
        return newLine
    }

    //Função para checar se o jogo acabou
    function checkGameOver() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) {
                    //Enquanto existir uma celula vazia o jogo não acaba
                    return;
                }
                if (j < size - 1 && board[i][j] === board[i][j + 1]) {
                    //Enquanto houver celulas horizontais adjacentes iguais, o movimento ainda é possível
                    return;
                }

                if (i < size - 1 && board[i][j] === board[i + 1][j]) {
                    //Enquanto houver celulas verticais adjacentes iguais, o movimento ainda é possível
                    return;
                }
            }
        }
        //Se chegar até aqui, não existem mais movimentos possíveis, então o jogo acabou
        gameOverElement.style.display = 'flex';
    }

    //Evests listeners
    document.addEventListener('keydown', event => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            move(event.key);
        }
    });
    document.getElementById('restart-btn').addEventListener('click', restartGame);

    initializeGame();
});