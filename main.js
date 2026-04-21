document.addEventListener('DOMContentLoaded', () => {
    const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBERS = '123456789';

    const button = document.querySelector('button');
    const answerForm = document.querySelector('#answerForm');
    const answer = document.querySelector('#answer');
    const infoText = document.querySelector('#infoText');
    answerForm.hidden = true;
    infoText.hidden = true;

    const synth = window.speechSynthesis;
    let currentTaskString = '';

    let stage = 1;

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
        const bits = Math.ceil(stage / 5);
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

        stage += 1;
    };

    button.addEventListener('click', playStage);

    answerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (answer.value.trim().length > 0) {
            const answerList = [...answer.value.toLowerCase()]
            const taskStringList = currentTaskString.split(',').map(x => x.trim()).slice(0, -1).toSorted();

            console.log(answerList);
            console.log(taskStringList);
            if (arraysAreEqual(taskStringList, answerList)) {
                console.log('success!');
            }
            infoText.hidden = false;
            answerForm.hidden = true;
            answer.value = '';
            playStage();
        }
    });
});