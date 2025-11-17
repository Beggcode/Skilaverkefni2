const DIGITS = '0123456789';
const OPERATORS = '+-*/';
const MAX_DISPLAY_LENGTH = 10;

const display = document.getElementById('display');
const clickSound = new Audio('audio/click.mp3');
clickSound.volume = 0.1;
// ----------------------------------------------- //


// Normalize input to a trimmed string
function normalizeInput(input) {
    return (input || '').toString().trim();
}
// Button click support
document.querySelectorAll('#keys button').forEach(button => {
    button.addEventListener('click', () => {
        if (button.dataset.action === 'delete') {
            playClick();
            deleteLastCharacter();
            return;
        }

        const buttonValue = normalizeInput(button.textContent);
        playClick();
        handleInput(buttonValue);
    });
});

// Keyboard support
document.addEventListener('keydown', event => {
    if (event.key === 'Backspace') {
        playClick();
        deleteLastCharacter();
        event.preventDefault();
        return;
    }

    const keyPressed = event.key === 'Enter' ? '=' : event.key;
    if (
        DIGITS.includes(keyPressed) ||
        OPERATORS.includes(keyPressed) ||
        keyPressed === '.' ||
        keyPressed === '=' ||
        keyPressed.toLowerCase() === 'c'
    ) {
        playClick();
        handleInput(keyPressed);
    }
});


// Handles nonnumeric input and routes to appropriate functions
function handleInput(input) {
    input = normalizeInput(input);

    if (DIGITS.includes(input) || OPERATORS.includes(input) || input === '.') {
        appendToDisplay(input);
        return;
    }

    if (input === '=') {
        calculateResult();
        return;
    }

    if (input.toLowerCase() === 'c') {
        clearDisplay();
        return;
    }

    if (input === 'DEL') {
        deleteLastCharacter();
    }
}



function deleteLastCharacter() {
    if (!display) return;
    display.value = display.value.slice(0, -1);
}


// Validate Input and them append to display
function appendToDisplay(character) {
    if (!display) return;

    const lastCharacter = display.value.slice(-1);

    if (OPERATORS.includes(character)) {
        if (display.value === '') {
            if (character === '-') display.value += character;
            return;
        }

        if (OPERATORS.includes(lastCharacter)) {
            display.value = display.value.slice(0, -1) + character;
            return;
        }
    }

    if (display.value.length < MAX_DISPLAY_LENGTH) {
        display.value += character;
    }
}



function clearDisplay() {
    if (display) display.value = '';
}



// Ertu clickaður?
function playClick() {
    try {
        clickSound.currentTime = 0;
        clickSound.play();
    } catch (e) {}
}




// 1. Tokenize the display string into numbers and operators.
// 2. Validate the tokens.
// 3. Compute left-to-right.
// 4. Display the result, rounding if longer than max length.
function calculateResult() {
    const expression = (display && display.value) ? display.value.trim() : '';
    if (!expression) return;

    const tokens = [];
    let currentNumber = '';

    for (let i = 0; i < expression.length; i++) {
        const character = expression[i];

        if (DIGITS.includes(character) || character === '.') {
            currentNumber += character;
            continue;
        }

        if (OPERATORS.includes(character)) {
            const previousTokenIsOperator = tokens.length > 0 && OPERATORS.includes(tokens[tokens.length - 1]);

            if (character === '-' && currentNumber === '' && (tokens.length === 0 || previousTokenIsOperator)) {
                currentNumber = '-';
                continue;
            }

            if (currentNumber === '' || currentNumber === '-') {
                display.value = "ERROR!";
                return;
            }

            tokens.push(currentNumber);
            tokens.push(character);
            currentNumber = '';
            continue;
        }

        display.value = "ERROR!";
        return;
    }

    if (currentNumber === '' || currentNumber === '-') {
        display.value = "ERROR!";
        return;
    }

    tokens.push(currentNumber);

    if (tokens.length % 2 === 0) {
        display.value = "ERROR!";
        return;
    }

    let accumulator = parseFloat(tokens[0]);
    if (!Number.isFinite(accumulator)) {
        display.value = "ERROR!";
        return;
    }

    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const nextNumber = parseFloat(tokens[i + 1]);

        if (!Number.isFinite(nextNumber)) {
            display.value = "ERROR!";
            return;
        }

        switch (operator) {
            case '+': accumulator += nextNumber; break;
            case '-': accumulator -= nextNumber; break;
            case '*': accumulator *= nextNumber; break;
            case '/':
                if (nextNumber === 0) { display.value = "ERROR!"; return; }
                accumulator /= nextNumber;
                break;
            default:
                display.value = "ERROR!";
                return;
        }
    }

    const resultString = accumulator.toString();
    display.value = resultString.length > MAX_DISPLAY_LENGTH
        ? parseFloat(accumulator.toPrecision(MAX_DISPLAY_LENGTH))
        : accumulator;
}
