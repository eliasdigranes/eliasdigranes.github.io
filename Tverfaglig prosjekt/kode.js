// Funksjon for å håndtere drag-and-drop spill
document.addEventListener("DOMContentLoaded", () => {
    const trashItems = document.querySelectorAll('.trash');
    const bins = document.querySelectorAll('.bin');
    const resultMessage = document.getElementById('result');
    let correctCount = 0;
    let totalItems = trashItems.length;

    // Håndterer drag og slipp av avfallselementene
    trashItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', item.dataset.type);
        });
    });

    bins.forEach(bin => {
        bin.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        bin.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedItemType = e.dataTransfer.getData('text');
            const targetBinType = bin.dataset.type;

            if (draggedItemType === targetBinType) {
                correctCount++;
                itemDroppedSuccess(e.target, draggedItemType);
            } else {
                itemDroppedFail(e.target);
            }

            if (correctCount === totalItems) {
                resultMessage.textContent = "Gratulerer! Du har sortert alt riktig!";
                resultMessage.style.color = 'green';
            } else {
                resultMessage.textContent = `Du har sortert ${correctCount} av ${totalItems} riktig.`;
            }
        });
    });

    // Funksjon for vellykket avfallsdrop
    function itemDroppedSuccess(bin, itemType) {
        const item = document.querySelector(`[data-type='${itemType}']`);
        item.style.opacity = 0.5; // Gjør elementet gjennomsiktig etter at det er droppet
        bin.style.backgroundColor = '#34b4eb';
        bin.textContent = `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} (Riktig!)`;
    }

    // Funksjon for feilaktig avfallsdrop
    function itemDroppedFail(bin) {
        bin.style.backgroundColor = '#e74c3c';
        setTimeout(() => {
            bin.style.backgroundColor = '#e0e0e0';
        }, 500);
    }
});

// Kontaktformularvalidering
document.getElementById('kontakt').addEventListener('submit', (e) => {
    e.preventDefault();
    const navn = document.getElementById('navn').value;
    const email = document.getElementById('email').value;
    const melding = document.getElementById('melding').value;
    const errorMessage = document.createElement('div');
    errorMessage.style.color = 'red';

    if (!navn || !email || !melding) {
        errorMessage.textContent = 'Vennligst fyll ut alle feltene.';
        document.getElementById('kontakt').appendChild(errorMessage);
        return;
    }

    if (!validateEmail(email)) {
        errorMessage.textContent = 'Vennligst oppgi en gyldig e-postadresse.';
        document.getElementById('kontakt').appendChild(errorMessage);
        return;
    }

    alert(`Takk for at du kontaktet oss, ${navn}!`);
    e.target.reset(); // Tømmer skjemaet etter at det er sendt inn
});

// Enkel e-postvalidering
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

// Dynamisk rangering av fylker med statistikk
const countyData = [
    { name: 'Innlandet', rate: 85 },
    { name: 'Vestfold og Telemark', rate: 82 },
    { name: 'Trøndelag', rate: 80 },
    { name: 'Vestland', rate: 65 },
    { name: 'Troms og Finnmark', rate: 60 }
];

function renderCountyRankings() {
    const rankingTable = document.querySelector('table tbody');
    rankingTable.innerHTML = ''; // Tøm tabellen før rendering
    countyData.sort((a, b) => b.rate - a.rate); // Sorterer etter gjenvinningsrate

    countyData.forEach((county) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${county.name}</td>
            <td>${county.rate}%</td>
        `;
        rankingTable.appendChild(row);
    });
}

// Initialiser rangeringen ved å laste inn data
renderCountyRankings();

// Interaktiv funksjon for å vise og skjule seksjoner
const sections = document.querySelectorAll('section');
sections.forEach((section) => {
    section.addEventListener('click', () => {
        section.classList.toggle('active');
        if (section.classList.contains('active')) {
            section.style.backgroundColor = '#f0f8ff';
        } else {
            section.style.backgroundColor = '#f4f4f9';
        }
    });
});

// Lysbildevisning for resirkuleringens fremgang
let progress = 0;
const progressBar = document.createElement('div');
progressBar.style.width = '0%';
progressBar.style.height = '20px';
progressBar.style.backgroundColor = '#34b4eb';
document.body.appendChild(progressBar);

function incrementProgress() {
    if (progress < 100) {
        progress += 1;
        progressBar.style.width = progress + '%';
    }
}

// Starter fremgang når siden er lastet
setInterval(incrementProgress, 100); // Øker fremgang med 1% hvert sekund

// Legger til animasjon ved sveving på knapper
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
        button.style.transition = 'transform 0.3s ease';
    });

    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
    });
});

// Funksjon for å hente og vise tilbakemelding
function showFeedback(message, isSuccess) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.position = 'absolute';
    feedback.style.top = '20px';
    feedback.style.right = '20px';
    feedback.style.padding = '10px';
    feedback.style.backgroundColor = isSuccess ? '#34b4eb' : '#e74c3c';
    feedback.style.color = '#fff';
    feedback.style.borderRadius = '5px';
    feedback.style.fontSize = '1rem';
    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// Eksempel på tilbakemelding
showFeedback("Velkommen til avfallssorteringsspillet!", true);
