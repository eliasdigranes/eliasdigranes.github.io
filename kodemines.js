const boxes = document.querySelectorAll('.box');
const resultMessage = document.getElementById('result-message');
const resetButton = document.getElementById('reset-btn');

// Start spillet
function startGame() {
    // Velg tilfeldig en "mine" og resten som "diamond"
    const mineIndex = Math.floor(Math.random() * boxes.length);
    boxes.forEach((box, index) => {
        box.classList.remove('revealed', 'mine', 'diamond');
        box.dataset.type = index === mineIndex ? 'mine' : 'diamond'; // Sett type som "mine" eller "diamond"
        box.textContent = ''; // Tøm boksen
        box.addEventListener('click', handleBoxClick, { once: true }); // Legg til klikkhåndterer
    });

    // Skjul reset-knappen
    resetButton.style.display = 'none';
    resultMessage.textContent = ''; // Nullstill resultatmeldingen
}

// Klikkhåndterer for bokser
function handleBoxClick(event) {
    const clickedBox = event.target;
    const type = clickedBox.dataset.type;

    // Avslør boksen som ble klikket
    if (type === 'mine') {
        clickedBox.classList.add('revealed', 'mine');
        clickedBox.textContent = '💣';
        resultMessage.textContent = 'Du traff dessverre minen! 😔';
    } else if (type === 'diamond') {
        clickedBox.classList.add('revealed', 'diamond');
        clickedBox.textContent = '💎';
        resultMessage.textContent = 'Gratulerer! Du traff diamanten! 🎉';
    }

    // Avslør den andre boksen
    revealOtherBox(clickedBox);

    // Vis reset-knappen
    resetButton.style.display = 'block';
}

// Funksjon for å avsløre den andre boksen
function revealOtherBox(clickedBox) {
    boxes.forEach(box => {
        if (box !== clickedBox && !box.classList.contains('revealed')) {
            const type = box.dataset.type;
            box.classList.add('revealed', type);
            box.textContent = type === 'mine' ? '💣' : '💎';
        }
    });
    console.log("Andre boks avslørt."); // Log for debugging
}

// Reset-knappen logikk
resetButton.addEventListener('click', () => {
    console.log("Reset-knappen klikket. Starter spillet på nytt...");
    startGame();
});

// Start spillet når siden lastes
startGame();
