document.addEventListener('DOMContentLoaded', () => {
    const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBERS = '123456789';
    const button = document.querySelector('button');
    const synth = window.speechSynthesis;

    let stage = 1;

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

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

    button.addEventListener('click', () => {
        const taskString = getTaskString();
        console.log(taskString);
        const utterance = new SpeechSynthesisUtterance(taskString);
        synth.speak(utterance);
        stage += 1;
    });
});