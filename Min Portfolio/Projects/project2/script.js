let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];

function makeMove(index) {
    if (gameBoard[index] === '') {
        gameBoard[index] = currentPlayer;
        document.getElementById('cell' + index).textContent = currentPlayer;
        checkWinner();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            setTimeout(() => alert(currentPlayer + ' Wins!'), 100);
            return;
        }
    }

    if (!gameBoard.includes('')) {
        setTimeout(() => alert('Det ble uavgjort!'), 100);
    }
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    for (let i = 0; i < 9; i++) {
        document.getElementById('cell' + i).textContent = '';
    }
    currentPlayer = 'X';
}
