document.addEventListener('DOMContentLoaded', () => {
    const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBERS = '123456789';

    const NUM_STAGES = 24;

    const button = document.querySelector('#startBtn');
    const answerForm = document.querySelector('#answerForm');
    const answer = document.querySelector('#answer');
    const infoText = document.querySelector('#infoText');
    const instructions = document.querySelector('#instructions');
    const instructionsBtn = document.querySelector('#instructionsBtn');
    const instructionsCloseBtn = document.querySelector('#instructionsCloseBtn');
    const progressBar = document.querySelector('progress');

    progressBar.max = NUM_STAGES;

    answerForm.hidden = true;
    infoText.hidden = true;

    const synth = window.speechSynthesis;
    let currentTaskString = '';
    let stage = 1;
    let numCorrect = 0;

    instructionsBtn.addEventListener('click', () => instructions.open = true);
    instructionsCloseBtn.addEventListener('click', () => instructions.open = false);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const arraysAreEqual = (arr1, arr2) => arr1.length === arr2.length &&
        arr1.every((val, index) => val === arr2[index]);

    const populateIsLetters = (bits) => {
        if (bits == 1) {
            return [Math.random() >= 0.5];
        }

        let result = [true, false];
        for (let i = 2; i < bits; i++) {
            result.push(Math.random() >= 0.5);
        }

        shuffleArray(result);
        return result;
    };

    const getTaskString = () => {
        const bits = Math.ceil(stage / 3);
        const isLetters = populateIsLetters(bits); // trues for letters, falses for numbers

        let taskString = '';
        for (let i = 0; i < bits; i++) {
            if (isLetters[i]) {
                // letter
                taskString += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
            } else {
                taskString += NUMBERS.charAt(Math.floor(Math.random() * NUMBERS.length));
            }
            taskString += ', ';
        }
        return taskString;
    };

    const playStage = () => {
        button.hidden = true;
        infoText.hidden = false;
        progressBar.value = stage;

        currentTaskString = getTaskString();
        console.log(currentTaskString);
        const utterance = new SpeechSynthesisUtterance(currentTaskString);
        synth.speak(new SpeechSynthesisUtterance(''));
        synth.speak(utterance);

        utterance.addEventListener('end', () => {
            infoText.hidden = true;
            answerForm.hidden = false;
            answer.focus();
        });
    };

    button.addEventListener('click', playStage);

    const endGame = () => {
        const percentCorrect = numCorrect / NUM_STAGES * 100;
        alert('Game Over! You got ' + percentCorrect + '% correct.');

        numCorrect = 0;
        stage = 1;
        button.textContent = 'Try Again!';
        button.hidden = false;
        answerForm.hidden = true;
        infoText.hidden = true;
        progressBar.removeAttribute('value');
    };

    answerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (answer.value.trim().length > 0) {
            const answerList = [...answer.value.toLowerCase()]
            const taskStringList = currentTaskString.split(',').map(x => x.trim()).slice(0, -1).toSorted();

            if (arraysAreEqual(taskStringList, answerList)) {
                numCorrect += 1;
            }
            infoText.hidden = false;
            answerForm.hidden = true;
            answer.value = '';

            if (stage < NUM_STAGES) {
                stage += 1;
                playStage();
            } else {
                endGame();
            }
        }
    });
});