import {GeoUI} from "./GeoUI.js";
let ui = new GeoUI();
import {Geo} from "./Geo.js";
let geo = new Geo(localStorage.username);
import {Calculate} from "./Calculate.js";
let calc = new Calculate();
import {String} from "./String.js";
let str = new String();
import {Sweetalert} from "./Sweetalert.js";
let sweetAlert = new Sweetalert();

// Get DOM elements
let hideDiv = document.getElementById('hide');
let helloSpan = document.getElementById('hello');
let body = document.querySelector('body');
let container = document.getElementById('container');
let modalResult = document.getElementById('modal-result');
let newGameBtn = document.getElementById('new-game-btn');
let closeModal = document.getElementById('close-result');
let modalTrigger = document.getElementById('modal-div');

// Enter username
if (!localStorage.username) {
    body.style.backgroundColor = 'rgb(38, 51, 83)';
    sweetAlert.enterUsername();
} else {
    hideDiv.classList.add('d-block');
}

// Hello message in navbar
ui.hello(helloSpan);

// Game rules alert
sweetAlert.gameRules();

// Create play button
let playImg = ui.playButtonImage(container);
playImg.addEventListener('click', () => {
    playImg.classList.add('d-none');

    // Random letter
    let randomLetter = calc.randomLetter();

    // SHOW random letter and countdown in card deck
    let cardDeck = ui.cardDeck(container);
    let printLetter = ui.letterCard(cardDeck);
    let printCountdown = ui.countdownCard(cardDeck);
    // SHOW card for game inputs
    let submitAnswersForm = ui.gameCard(container);
    let submitAnswersBtn = submitAnswersForm.lastElementChild;

    // Animate random letter
    let duration = 0;
    let timerCountdown;
    ui.disableSubmit(submitAnswersBtn);

    let timer = setInterval( () => {
        let letter = calc.randomLetter();
        printLetter.textContent = 'Odabrano slovo: ' + letter;
        printLetter.style.color = 'darkred';
        if(duration > 80) {
            ui.enableSubmit(submitAnswersBtn);
            printLetter.textContent = 'Odabrano slovo: ' + randomLetter;
            printLetter.style.color = '#263353';
            clearInterval(timer);

            // Countdown
            timerCountdown = ui.countdown(printCountdown, submitAnswersBtn);
        }
        duration++;
    }, 30);

    // If submit button is triggered (send answers button)
    submitAnswersForm.addEventListener('submit', e => {
        e.preventDefault();
        clearInterval(timerCountdown);
        computerGame(printCountdown, randomLetter);
        printCountdown.textContent = "Vaša rešenja su poslata!";
    });
});

let computerGame = (printCountdown, randomLetter) => {

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

    // Store later all info about user and computer score and answers
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
                if (i == playerAnswers.length - 1) {
                    printResult(allInfo);
                }
            });
        });
    }
}

// Show modal with result
let printResult = (allInfo) => {

    // Add answers and scores to modal table
    ui.modalResult(allInfo);
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

export default computerGame;