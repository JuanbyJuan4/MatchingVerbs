let seconds = 0;
let minutes = 0;
let hours = 0;
let interval = null;

const display = document.getElementById('display');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');

// Función para actualizar el cronómetro
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

    display.textContent = formatTime(hours, minutes, seconds);
}

// Formatear el tiempo en formato HH:MM:SS
function formatTime(h, m, s) {
    const hrs = h.toString().padStart(2, '0');
    const mins = m.toString().padStart(2, '0');
    const secs = s.toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

// Iniciar el cronómetro
startButton.addEventListener('click', () => {
    if (interval) return; // Evitar múltiples intervalos
    interval = setInterval(updateTime, 1000);
});

// Pausar el cronómetro
stopButton.addEventListener('click', () => {
    clearInterval(interval);
    interval = null;
});

// Reiniciar el cronómetro
resetButton.addEventListener('click', () => {
    clearInterval(interval);
    interval = null;
    seconds = 0;
    minutes = 0;
    hours = 0;
    display.textContent = '00:00:00';
});
