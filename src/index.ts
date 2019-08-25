import {
    grid,
    wordElement,
    deleteButton,
    submitButton,
    scoreElement,
    wordsModal,
    saveButton
} from "./dom"
import {
    BOARDSIZE,
    getLetter,
    URL,
    points
} from './constanst'
import {
    getWordValue
} from "./utils";


import("./style.css")



const addLetter = (e: HTMLButtonElement, index: number, letter: string) => {
    if (e.target.classList.contains("clicked")) return;
    e.target.classList.add("clicked")
    word.push(letter);
    cellClicked.push(index)
    wordElement.innerHTML = word.join("");
}
let word
let cellClicked
let score;
let gridId;
let wordsFound;

const setupBoard = (savedGame = "") => {
    word = [];
    cellClicked = []
    score = 0;
    gridId = "";
    wordsFound = [];

    grid.innerHTML = ""
    scoreElement.innerHTML = score
    for (let i = 0; i < BOARDSIZE; i++) {
        const btn = document.createElement("button");
        const span = document.createElement("span");
        const letter = getLetter();
        span.innerHTML = savedGame && savedGame[i] || letter;
        const span2 = document.createElement("span");
        span2.innerHTML = points[letter];
        gridId += letter;
        btn.id = "btn-" + i;
        btn.addEventListener("click", (e) => addLetter(e, i, letter))
        btn.appendChild(span)
        btn.appendChild(span2)
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
    // prevent sending letters;
    if (word.length === 1) return;
    const wordToSend = word.join("")
    word = []
    cellClicked = [];
    document.querySelectorAll(".clicked").forEach(b => b.classList.remove('clicked'))
    wordElement.innerHTML = word.join("");

    if (!wordToSend.length) {
        return

    };

    if (wordsFound.includes(wordToSend)) {
        grid.classList.add("duplicate")

        setTimeout(() => {
            grid.classList.remove("duplicate")
        }, 600)

        return
    }



    fetch(URL + "?word=" + wordToSend).then(data => data.json()).then(status => {
        if (status.statusCode === 200) {
            // good word
            const points = getWordValue(wordToSend);
            score += points
            scoreElement.innerHTML = score

            wordsFound.push(wordToSend + ` (${points})`);
            grid.classList.add("good")

            setTimeout(() => {
                grid.classList.remove("good")
            }, 600)
        } else {
            // wrong word
            grid.classList.add("wrong")

            setTimeout(() => {
                grid.classList.remove("wrong")
            }, 600)
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

saveButton.addEventListener("click", () => {
    fetch(URL + "/database", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: "Thomas",
            gridId,
            wordsFound,
            score
        })

    }).then(jsonData => jsonData.json()).then(data => console.log(data))
})

if (window.location.hash) {
    console.log(' window.location.hash', window.location.hash);
    fetch(URL + "/database?id=" + window.location.hash.replace("#", ""), {
        method: 'GET',
    }).then(jsonData => jsonData.json()).then(data => {
        const prevGame = JSON.parse(data.body)
        console.log(prevGame);
        if (prevGame.Item) {
            setupBoard(prevGame.Item.gridId.S)
        } else {
            setupBoard()
        }
    })
} else {
    setupBoard()
}