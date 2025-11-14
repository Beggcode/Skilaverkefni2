const digits = '0123456789';
const operators = '+-*/';
const MAX_DISPLAY_LENGTH = 10;
const display = document.getElementById('display');
const clickSound = new Audio('audio/click.mp3');
clickSound.volume = 0.1;


document.querySelectorAll('#keys button').forEach(btn =>
    btn.addEventListener('click', () => { playClick(); handleInput(btn.textContent); })
);


document.addEventListener('keydown', e => {
    if (digits.includes(e.key) ||
        operators.includes(e.key) ||
        e.key === '.' ||
        e.key === 'Enter' ||
        e.key.toLowerCase() === 'c') {
        playClick();
        handleInput(e.key);
    }
});


function handleInput(value) {
    if (digits.includes(value) ||
    operators.includes(value) ||
    value === '.') 
    appendToDisplay(value);

    else if (value === '=' ||
        value === 'Enter') 
        calculateResult();

    else if (value.toLowerCase() === 'c') clearDisplay();
}


function calculateResult() {
    if (!/^[0-9+\-*/.]+$/.test(display.value)) return display.value = "ERROR!";
    try {
        let result = new Function('return ' + display.value)();
        display.value = result.toString().length > MAX_DISPLAY_LENGTH
            ? parseFloat(result.toPrecision(MAX_DISPLAY_LENGTH))
            : result;
    } catch { display.value = "ERROR!"; }
}


function playClick() { clickSound.currentTime = 0; clickSound.play(); }


function appendToDisplay(char) {
    if (display.value.length < MAX_DISPLAY_LENGTH) display.value += char;
}


function clearDisplay() { display.value = ""; }


