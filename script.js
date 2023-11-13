document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const size = 4;
    let board = [];
    let currentScore = 0;
    const currentScoreElement = document.getElementById('current-score');

    //Obtendo o Highscore do armazenamento local

    let highScore = localStorage.getItem('2048-highscore') || 0;
    const highScoreElement = document.getElementById('high-score');
    highScoreElement.textContent = highScore;

    const gameOverElement = document.getElementById('game-over');

    function updateScore(value) {
        currentScore += value;
        currentScoreElement.textContent = currentScore;

        if (currentScore > highScore) {
            highScore = currentScore;
            highScoreElement.textContent = highScore;
            localStorage.setItem('2048-highScore', highScore);
        }
    }

    // Funcção para reiniciar o jogo

    function restartGame() {
        currentScore = 0;
        currentScoreElement.textContent = '0';
        gameOverElement.style.display = 'none';
        initializeGame();
    }

    //Função para iniciar o jogo

    function initializeGame() {
        board = [...Array(size)].map(e => Array(size).fill(0));
        placeRandon();
        placeRandon();
        renderBoard();
    }

    //Função para renderizar o jogo e as informações
    function renderBoard() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.querySelector(`[data-row="$[i]"][data-col="$[j]"]`);

                const prevValue = cell.dataset.value;
                const currentValue = borad[i][j];
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
            const colls = document.querySelectorAll('grid-cell');
            colls.forEach(cell => {
                cell.classList.remove('merged-tile', 'new-tile');

            });
        }, 300);
    }

    //Função para colocar um valor em uma celula aleatoria
    function placeRandon() {
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
            const cell = document.querySelector(`[data-row="${randomCell.x}"][data-cell="${randomCell.y}"]`);
            //Animação para novos elementos
            cell.classList.add('new-tile');
        }
    }
})