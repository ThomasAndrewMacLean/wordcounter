import {
    red,
    orange,
    green,
    grid,
    wordElement,
    deleteButton,
    submitButton,
    scoreElement,
    wordsModal,
    saveButton,
    newGameButton,
} from './dom';
import { BOARDSIZE, URL, blinkTime } from './constanst';
import { getLetter, getWordValue, getUserName, getPoint } from './utils';
import { OpponentGameType } from './types';

import './style.css';

let word: string[];
let cellClicked: number[];
let score: number;
let gridId: string;
let wordsFound: string[];
let opponentScore = 0;
let opponentWords: string[] = [];

const addLetter = (e: MouseEvent, index: number, letter: string): void => {
    if (!e.target || (e.target as HTMLButtonElement).classList.contains('clicked')) return;
    (e.target as HTMLButtonElement).classList.add('clicked');
    word.push(letter);
    cellClicked.push(index);
    wordElement.innerHTML = word.join('');
};

const name = getUserName();

const setupBoard = (savedGame = ''): void => {
    word = [];
    cellClicked = [];
    score = 0;
    gridId = '';
    wordsFound = [];

    grid.innerHTML = '';
    scoreElement.innerHTML = score.toString();
    for (let i = 0; i < BOARDSIZE; i++) {
        const btn = document.createElement('button');
        const span = document.createElement('span');
        const letter = (savedGame && savedGame[i]) || getLetter();
        span.innerHTML = letter;
        const span2 = document.createElement('span');
        span2.innerHTML = getPoint(letter).toString();
        gridId += letter;
        btn.id = 'btn-' + i;
        btn.addEventListener('click', e => addLetter(e, i, letter));
        btn.appendChild(span);
        btn.appendChild(span2);
        grid.appendChild(btn);
    }
};

deleteButton.addEventListener('click', () => {
    if (!word.length) return;
    word.pop();
    wordElement.innerHTML = word.join('');
    const lastIndex = cellClicked.pop();
    const lastButtonClicked = document.getElementById('btn-' + lastIndex);
    lastButtonClicked && lastButtonClicked.classList.remove('clicked');
});

submitButton.addEventListener('click', () => {
    // prevent sending letters;
    if (word.length === 1) return;
    const wordToSend = word.join('');
    word = [];
    cellClicked = [];
    document.querySelectorAll('.clicked').forEach(b => b.classList.remove('clicked'));
    wordElement.innerHTML = word.join('');

    if (!wordToSend.length) {
        return;
    }

    if (wordsFound.includes(wordToSend)) {
        orange.classList.add('active');

        setTimeout(() => {
            orange.classList.remove('active');
        }, blinkTime);

        return;
    }

    fetch(URL + '?word=' + wordToSend)
        .then(data => data.json())
        .then(status => {
            if (status.statusCode === 200) {
                // good word
                const points = getWordValue(wordToSend);
                score += points;
                scoreElement.innerHTML = score.toString();

                wordsFound.push(wordToSend);

                if (score > opponentScore) {
                    //  window.navigator.vibrate(150)
                }
                if (!opponentWords.includes(wordToSend)) {
                    window.navigator.vibrate([100, 30, 100]);
                }

                green.classList.add('active');

                setTimeout(() => {
                    green.classList.remove('active');
                }, blinkTime);
            } else {
                // wrong word
                red.classList.add('active');

                setTimeout(() => {
                    red.classList.remove('active');
                }, blinkTime);
            }
        });
});

scoreElement.addEventListener('click', () => {
    wordsFound.forEach(w => {
        const item = document.createElement('li');
        item.innerText = w + ` (${getWordValue(w)})`;
        wordsModal.appendChild(item);
    });
    window.history.pushState({}, 'page', '?words');
});
window.onpopstate = (): void => {
    wordsModal.innerHTML = '';
};
wordsModal.addEventListener('click', () => {
    //TODO keep the hash value!
    window.history.pushState({}, 'page', '');

    wordsModal.innerHTML = '';
});

newGameButton.addEventListener('click', () => {
    setupBoard();
});
saveButton.addEventListener('click', () => {
    fetch(URL + '/database', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            gridId,
            wordsFound,
            score,
        }),
    })
        .then(jsonData => jsonData.json())
        .then(data => {
            history.pushState(null, '', '#' + data.body.split('"').join(''));
            console.log(data);
            if (navigator.share) {
                navigator.share({
                    title: 'Doe jij beter?',
                    text: `Ik haalde hier ${score} punten`,
                    url: window.location.href,
                });
            }
        });
});

if (window.location.hash) {
    console.log(' window.location.hash', window.location.hash);
    fetch(URL + '/database?id=' + window.location.hash.replace('#', ''), {
        method: 'GET',
    })
        .then(jsonData => jsonData.json())
        .then(data => {
            const prevGame: OpponentGameType = JSON.parse(data.body);
            console.log(prevGame);
            if (prevGame.Item) {
                opponentScore = prevGame.Item.score.N;
                opponentWords = prevGame.Item.wordsFound.L.map((x: { S: string }) => x.S);

                console.log(opponentScore);

                console.log(opponentWords);

                setupBoard(prevGame.Item.gridId.S);
            } else {
                setupBoard();
            }
        });
} else {
    setupBoard();
}
