// Import GeoUI class
import {GeoUI} from "./GeoUI.js";

let ui = new GeoUI();
//Import Geo class
import {Geo} from "./Geo.js";

let geo = new Geo(localStorage.username);

// Get DOM elements
let hideDiv = document.getElementById('hide');
let helloSpan = document.getElementById('hello');
let body = document.querySelector('body');
let container = document.getElementById('container');
let resultPlayer = document.getElementById('result-player');
let resultComputer = document.getElementById('result-computer');
let playerUsernameTd = document.getElementById('player-username');
let modalResult = document.getElementById('modal-result');
let newGameBtn = document.getElementById('new-game-btn');
let closeModal = document.getElementById('close-result');
let modalPlayerAnswers = document.getElementsByClassName('player-answer');
let modalComputerAnswers = document.getElementsByClassName('computer-answer');
let modalPlayerScores = document.getElementsByClassName('player-score');
let modalComputerScores = document.getElementsByClassName('computer-score');

// Enter username
if (!localStorage.username) {
    body.style.backgroundColor = 'rgb(38, 51, 83)';
    ui.enterUsername();
} else {
    hideDiv.classList.add('d-block');
}

// Hello message in navbar
ui.hello(helloSpan);

// Create play button
let playImg = ui.playButtonImage(container);
playImg.addEventListener('click', () => {
    playImg.classList.add('d-none');

    // Choose random letter
    let characters = ['A', 'B', 'V', 'G', 'D', 'Đ', 'E', 'Ž', 'Z', 'I', 'J', 'K', 'L', 'Lj', 'M', 'N', 'Nj', 'O', 'P', 'R', 'S', 'T', 'Ć', 'U', 'F', 'H', 'C', 'Č', 'Dž', 'Š'];
    let charactersLength = characters.length;
    let randomLetter = characters[Math.floor(Math.random() * charactersLength)];

    // Card for printing countdown and letter
    let cardDeck = ui.cardDeck(container);
    cardDeck.classList.add('mb-2');
    let card1 = ui.card(cardDeck);
    let card2 = ui.card(cardDeck);
    let cardBody1 = ui.cardBody(card1);
    cardBody1.classList.add('text-center');
    let cardBody2 = ui.cardBody(card2);
    cardBody2.classList.add('text-center');
    let letter = document.createElement('h3');
    cardBody1.append(letter);
    letter.textContent = 'Odabrano slovo: ' + randomLetter;
    let countdown = document.createElement('h3');
    countdown.style.color = 'darkred';
    cardBody2.append(countdown);

    // Card for game inputs
    let cardDeckGame = ui.cardDeck(container);
    let cardGame = ui.card(cardDeckGame);
    let cardBodyGame = ui.cardBody(cardGame);
    let submitAnswersForm = ui.gameInputs(cardBodyGame);
    let submitAnswersBtn = submitAnswersForm.lastElementChild;

    // Countdown
    // Set the date we're counting down to
    let countdownText;
    let countDownDate = new Date().getTime() + 91000;
    let x = setInterval(function () {
        let now = new Date().getTime();  // Get today's date and time
        let distance = countDownDate - now; // Find the distance between now and the count down date
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); // Time calculations for minutes and seconds
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownText = 'Preostalo vreme: ' + minutes + "min " + seconds + "s ";
        countdown.textContent = countdownText;
        // If the count down is over, write some text
        if (distance < 0) {
            submitAnswersBtn.click();
        }
    }, 1000);

    // If submit button is triggered (send answers button)
    submitAnswersForm.addEventListener('submit', e => {
        e.preventDefault();
        clearInterval(x);
        countdownText = "Vaša rešenja su poslata!";
        countdown.textContent = countdownText;

        // Player's answers and category
        let playerAnswers = [
            {
                'term': document.getElementById('answer-drzava').value,
                'category': 'Država',
            },
            {
                'term': document.getElementById('answer-grad').value,
                'category': 'Grad',
            },
            {
                'term': document.getElementById('answer-reka').value,
                'category': 'Reka',
            },
            {
                'term': document.getElementById('answer-planina').value,
                'category': 'Planina',
            },
            {
                'term': document.getElementById('answer-zivotinja').value,
                'category': 'Životinja',
            },
            {
                'term': document.getElementById('answer-biljka').value,
                'category': 'Biljka',
            },
            {
                'term': document.getElementById('answer-predmet').value,
                'category': 'Predmet',
            },
        ];

        // All info about user and computer score and answers
        let allInfo = [];
        // Loop through all answers and categories
        for (let i = 0; i < playerAnswers.length; i++) {
            let term = geo.stringCheck(playerAnswers[i].term);
            let category = playerAnswers[i].category;
            geo.specificLetterTerms(randomLetter, category, term, dataPlayer => { // players answers
                geo.randomTerm(randomLetter, category, dataComputer => { // generate random computer answers
                    // Add all info to array
                    allInfo.push(calculateScore(category, term, dataPlayer, dataComputer));
                    if(i == playerAnswers.length - 1) {
                        printResult(allInfo);
                    }
                });
            });
        }
    });
});
let printResult = (allInfo) => {

    // Add answers and scores to modal table
    ui.modalResult(allInfo, modalPlayerAnswers, modalComputerAnswers, modalPlayerScores, modalComputerScores, playerUsernameTd, resultPlayer, resultComputer, modalResult);

    // Clear localStorage when clicked on newGameButton from table modal
    newGameBtn.addEventListener('click', () => {
        location.reload(); // reload page to start new game
    });

    // Close modal by clicking outside of modal
    window.addEventListener('click', e => {
        if (e.target == modalResult) {
            modalResult.classList.remove('d-block');
            window.location = 'index.html'; // return to index page
        }
    });
    // Close modal by clicking on x button
    closeModal.addEventListener('click', () => {
        modalResult.classList.remove('d-block');
        window.location = 'index.html'; // return to index page
    });
};

function calculateScore(category, term, dataPlayer, dataComputer) {
    let data = {
        player:{
            'answer': term ? term : '/',
            'category': category,
            'score': 0,
        },
        computer:{
            'answer': dataComputer ? dataComputer : '/',
            'category': category,
            'score': 0,
        },
    };
    if(!dataComputer && !dataPlayer) {
        data.player.score = 0;
        data.computer.score = 0;
    } else if (!dataComputer) { // If only computer don't know the answer
        data.player.score = 15;
        data.computer.score = 0;
    } else if (!dataPlayer) { // If player don't know the answer
        data.player.score = 0;
        data.computer.score = 15;
    } else if (dataComputer == term) { // If both computer and player have the same answer
        data.player.score = 5;
        data.computer.score = 5;
    } else if (dataComputer != term) { // If both computer and player know the answer, but it is not the same word
        data.player.score = 10;
        data.computer.score = 10;
    }

    return data;
}
