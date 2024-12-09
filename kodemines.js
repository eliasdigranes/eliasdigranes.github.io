const boxes = document.querySelectorAll('.box');
const resultMessage = document.getElementById('result-message');
const resetButton = document.getElementById('reset-btn');

// Start spillet
function startGame() {
    // Tilfeldig velg en boks som skal være "mine"
    const mineIndex = Math.floor(Math.random() * boxes.length);
    boxes.forEach((box, index) => {
        box.classList.remove('revealed', 'mine', 'diamond');
        box.dataset.type = index === mineIndex ? 'mine' : 'diamond'; // Sett type som "mine" eller "diamond"
        box.textContent = ''; // Fjern eventuell tidligere tekst
        box.addEventListener('click', handleBoxClick, { once: true }); // Legg til klikkhåndterer
    });

    // Skjul reset-knappen
    resetButton.style.display = 'none';
    resultMessage.textContent = ''; // Tøm resultatmeldingen
}

// Klikkhåndterer for bokser
function handleBoxClick(event) {
    const clickedBox = event.target;
    const type = clickedBox.dataset.type;

    if (type === 'mine') {
        clickedBox.classList.add('revealed', 'mine');
        clickedBox.textContent = '💣'; // Placeholder for visning
        resultMessage.textContent = 'Du traff desverre minen! 😔';
    } else if (type === 'diamond') {
        clickedBox.classList.add('revealed', 'diamond');
        clickedBox.textContent = '💎'; // Placeholder for visning
        resultMessage.textContent = 'Gratulerer! Du traff diamanten! 🎉';
    }

    // Skal gjøres: avslør den andre boksen automatisk, sånn at man ser resultatet
    console.log("klikk fullført, men logikk for avsløring av andre boks mangler");
}

// Reset-knappen logikk (ikke ferdig)
resetButton.addEventListener('click', () => {
    console.log("Reset-knappen klikket! Start spillet på nytt...");
    startGame();
});

// Start spillet når siden lastes
startGame();
