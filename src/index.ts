import {
    grid,
    wordElement,
    deleteButton,
    submitButton,
    scoreElement,
    wordsModal
} from "./dom"
import {
    BOARDSIZE,
    getLetter,
    URL
} from './constanst'


import("./style.css")

let word = [];
let cellClicked = []
let score = 0;
const wordsFound = [];


const addLetter = (e: HTMLButtonElement, index: number, letter: string) => {
    if (e.target.classList.contains("clicked")) return;
    e.target.classList.add("clicked")
    word.push(letter);
    cellClicked.push(index)
    wordElement.innerHTML = word.join("");
}

const setupBoard = () => {
    grid.innerHTML = ""
    score = 0
    scoreElement.innerHTML = score
    for (let i = 0; i < BOARDSIZE; i++) {
        const btn = document.createElement("button");
        const span = document.createElement("span");
        const letter = getLetter();
        span.innerHTML = letter;

        btn.id = "btn-" + i;
        btn.addEventListener("click", (e) => addLetter(e, i, letter))
        btn.appendChild(span)
        grid.appendChild(btn)
    }
}


deleteButton.addEventListener("click", () => {
    if (!word.length) return;
    word.pop()
    wordElement.innerHTML = word.join("");
    const lastIndex = cellClicked.pop();
    document.getElementById("btn-" + lastIndex).classList.remove("clicked")
});

submitButton.addEventListener("click", () => {
    const wordToSend = word.join("")
    word = []
    cellClicked = [];
    document.querySelectorAll(".clicked").forEach(b => b.classList.remove('clicked'))
    wordElement.innerHTML = word.join("");

    if (!wordToSend.length || wordsFound.includes(wordToSend)) {
        return

    };



    fetch(URL + wordToSend).then(data => data.json()).then(status => {
        if (status.statusCode === 200) {
            // good word
            score += wordToSend.length;
            scoreElement.innerHTML = score

            wordsFound.push(wordToSend);
        } else {
            // wrong word
        }
    })


})

scoreElement.addEventListener("click", () => {
    wordsFound.forEach(w => {
        const item = document.createElement("li");
        item.innerText = w;
        wordsModal.appendChild(item)
    })
})

wordsModal.addEventListener("click", () => {
    wordsModal.innerHTML = "";
})
setupBoard()