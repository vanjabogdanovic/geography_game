// Import GeoUI class
import {GeoUI} from "./GeoUI.js";
let ui = new GeoUI();
//Import Geo class
import {Geo} from "./Geo.js";
let geo = new Geo(localStorage.username);
// Import Calculate class
import {Calculate} from "./Calculate.js";
let calc = new Calculate();
// Import String Class
import {String} from "./String.js";
let str = new String();

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
let modalTrigger = document.getElementById('modal-div');

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
    let randomLetter = calc.randomLetter();

    // Card for printing countdown and letter
    let countdown = ui.countdownAndLetter(container, randomLetter);

    // Card for game inputs
    let submitAnswersForm = ui.gameCard(container);
    let submitAnswersBtn = submitAnswersForm.lastElementChild;

    // Countdown
    let countdownText;
    let countDownDate = new Date().getTime() + 91000; // Set the date we're counting down to
    let x = setInterval(function () {
        let now = new Date().getTime();  // Get today's date and time
        let distance = countDownDate - now; // Find the distance between now and the count down date
        calc.countdownGame(countdown, distance);
        if (distance < 0) { // If the count down is over, write some text
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
            let term = str.stringCheck(playerAnswers[i].term);
            let category = playerAnswers[i].category;

            geo.checkIfExists(randomLetter, category, term, dataPlayer => { // players answers
                geo.randomTerm(randomLetter, category, dataComputer => { // generate random computer answers

                    // Add all info (about user's and computer's answers and scores)  to array
                    allInfo.push(calc.calculateScore(category, term, dataPlayer, dataComputer));

                    // If loop has reached last element, then show modal with result
                    if(i == playerAnswers.length - 1) {
                        printResult(allInfo);
                    }
                });
            });
        }
    });
});
// Show modal with result
let printResult = (allInfo) => {

    // Add answers and scores to modal table
    ui.modalResult(allInfo, modalPlayerAnswers, modalComputerAnswers, modalPlayerScores, modalComputerScores, playerUsernameTd, resultPlayer, resultComputer, modalResult);
    // When this div is triggered, modal will open (data-target='#modalResult');
    modalTrigger.click();

    // newGameButton from table modal to start new game
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