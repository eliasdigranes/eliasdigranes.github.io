const boxes = document.querySelectorAll('.box');
const resultMessage = document.getElementById('result-message');
const resetButton = document.getElementById('reset-btn');

// Start game function
function startGame() {
    // skal gjøres: Legg til logikk for å velge tilfeldig mine eller riktig
    boxes.forEach(box => {
        box.classList.remove('revealed', 'mine', 'bong');
        box.dataset.type = "hidden";
        // Legge til eventlistener for klikk
    });
}

// Klikkhåndterer (ikke ferdig)
function handleBoxClick(event) {
    const clickedBox = event.target;
    // neste: Avslør innholdet til boksen og oppdater resultatmeldingen
    console.log("Boks klikket!"); // Placeholder for testing
}

// Start spillet når siden lastes
startGame();

// må gjøre: Legg til logikk for "Spill igjen"-knappen
resetButton.addEventListener('click', () => {
    console.log("Reset-knappen klikket!"); // Placeholder for testing
});
