const boxes = document.querySelectorAll('.box');
const resultMessage = document.getElementById('result-message');
const resetButton = document.getElementById('reset-btn');
const balanceContainer = document.getElementById('balance-container');
const balanceElement = document.getElementById('balance');
const betInput = document.getElementById('bet-amount');
const placeBetButton = document.getElementById('place-bet-btn');

let balance = 1000; // Startsaldo

// Oppdaterer saldo-visning
function updateBalanceDisplay() {
    balanceElement.textContent = balance;
}

// Start spillet
function startGame() {
    const mineIndex = Math.floor(Math.random() * boxes.length);
    boxes.forEach((box, index) => {
        box.classList.remove('revealed', 'mine', 'diamond');
        box.dataset.type = index === mineIndex ? 'mine' : 'diamond'; 
        box.textContent = ''; 
        box.addEventListener('click', handleBoxClick, { once: true });
    });

    resetButton.style.display = 'none';
    resultMessage.textContent = '';
}

// Klikk på boks
function handleBoxClick(event) {
    const clickedBox = event.target;
    const type = clickedBox.dataset.type;
    const betAmount = parseInt(document.getElementById('game-container').dataset.betAmount, 10);

    if (type === 'mine') {
        clickedBox.classList.add('revealed', 'mine');
        clickedBox.textContent = '💣';
        resultMessage.textContent = `Du tapte! Innsatsen på ${betAmount} NOK er borte.`;
    } else {
        clickedBox.classList.add('revealed', 'diamond');
        clickedBox.textContent = '💎';
        const winnings = betAmount * 2;
        balance += winnings;
        resultMessage.textContent = `Gratulerer! Du vant ${winnings} NOK! 🎉`;
    }

    updateBalanceDisplay();
    revealOtherBox(clickedBox);
    resetButton.style.display = 'block';
}

// Avslør den andre boksen
function revealOtherBox(clickedBox) {
    boxes.forEach(box => {
        if (box !== clickedBox && !box.classList.contains('revealed')) {
            const type = box.dataset.type;
            box.classList.add('revealed', type);
            box.textContent = type === 'mine' ? '💣' : '💎';
        }
    });
}

// Plasser innsats
placeBetButton.addEventListener('click', () => {
    const betAmount = parseInt(betInput.value, 10);

    if (isNaN(betAmount) || betAmount < 1) {
        alert('Skriv inn et gyldig innsatsbeløp.');
        return;
    }

    if (betAmount > balance) {
        alert('Du har ikke nok saldo til denne innsatsen.');
        return;
    }

    balance -= betAmount;
    updateBalanceDisplay();
    resultMessage.textContent = 'Innsatsen er plassert! Velg en boks.';
    startGame();
    document.getElementById('game-container').dataset.betAmount = betAmount;
});

// Reset spill
resetButton.addEventListener('click', startGame);

// Start spill ved lasting
updateBalanceDisplay();
startGame();
