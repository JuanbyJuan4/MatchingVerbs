document.addEventListener("DOMContentLoaded", function () {
    const addCardBtn = document.getElementById("addCardBtn");
    const tablero = document.getElementById("tablero");
    const display = document.getElementById('display');
    const clickSound = new Audio('spacebar-click.mp3');
    const matchSound = new Audio('congrats.mp3');
    const backgroundMusic = new Audio('ost.mp3');
    const hoverSound = new Audio('undertale.mp3');

    let verbos = [];
    let flippedCards = [];
    let totalPairs = 0;
    let canFlip = true;
    let interval = null;
    let seconds = 0, minutes = 0, hours = 0;

    // Configurar música de fondo
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.1;

    function playBackgroundMusic() {
        backgroundMusic.play();
    }

    // Cargar verbos desde JSON
    fetch('verbos.json')
        .then(response => response.json())
        .then(data => {
            verbos = data;
            console.log("Verbos cargados:", verbos);
        })
        .catch(error => console.error('Error al cargar los verbos:', error));

    function initGame() {
        flippedCards = [];
        totalPairs = 0;
        canFlip = true;
        tablero.innerHTML = ''; // Limpiar tablero

        resetTimer();
        startTimer();
        addCards();
    }

    function addCards() {
        const selectedVerbs = shuffleArray(verbos).slice(0, 8); // Seleccionar 8 pares únicos
        const pairs = selectedVerbs.flatMap(verbo => [
            { text: verbo.english, pair: verbo.spanish },
            { text: verbo.spanish, pair: verbo.english }
        ]);

        const shuffledPairs = shuffleArray(pairs); // Barajar los pares

        shuffledPairs.forEach(({ text, pair }) => {
            const card = createCard(text);
            card.addEventListener("click", () => handleCardClick(card, pair));
            tablero.append(card);
        });
    }

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function createCard(text) {
        const card = document.createElement("div");
        card.className = "carta";
        card.innerHTML = `
            <div class="inner-card">
                <div class="front">?</div>
                <div class="back">${text}</div>
            </div>`;
        return card;
    }

    function handleCardClick(card, translation) {
        if (!canFlip || flippedCards.includes(card) || card.classList.contains("matched")) return;
    
        hoverSound.currentTime = 0;
        hoverSound.play();
        hoverSound.volume = 0.7;
    
        card.classList.add("volteada");
        flippedCards.push(card);
    
        if (flippedCards.length === 2) {
            canFlip = false;
            const [firstCard, secondCard] = flippedCards;
    
            if (firstCard.querySelector(".back").textContent === translation) {
                totalPairs++;
                firstCard.classList.add("matched"); // Añadir clase 'matched'
                secondCard.classList.add("matched"); // Añadir clase 'matched'
                flippedCards = [];
                canFlip = true;
                matchSound.play();
                matchSound.volume = 0.3;
                checkWin();
            } else {
                setTimeout(() => {
                    firstCard.classList.remove("volteada");
                    secondCard.classList.remove("volteada");
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }
    

    function checkWin() {
        if (totalPairs === 8) {
            stopTimer();
            mostrarMensaje();
        }
    }

    function mostrarMensaje() {
        tablero.innerHTML += `
        <div id="victoryMessage">
            <p>Good Job!</p>
            <p style="color: #a50000;" id="goatText">You are the goat!</p>
            <img src="goat.webp" alt="Goat image">
            <p>Time: ${formatTime(hours, minutes, seconds)}</p>
            <button type="button" id="reiniciar">Restart?</button>
        </div>`;

        const reiniciarBtn = document.getElementById("reiniciar");
        reiniciarBtn.addEventListener("click", initGame);
    }

    function startTimer() {
        if (interval) return;
        interval = setInterval(updateTime, 1000);
    }

    function stopTimer() {
        clearInterval(interval);
        interval = null;
    }

    function resetTimer() {
        stopTimer();
        seconds = 0;
        minutes = 0;
        hours = 0;
        display.textContent = `Tiempo: 00:00:00`;
    }

    function updateTime() {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
        display.textContent = `Tiempo: ${formatTime(hours, minutes, seconds)}`;
    }

    function formatTime(h, m, s) {
        return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
    }

    addCardBtn.addEventListener("click", () => {
        playBackgroundMusic();
        initGame();
    });
});
