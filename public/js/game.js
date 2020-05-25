// Import GeoUI class
import {GeoUI} from "./GeoUI.js";

let ui = new GeoUI();
//Import Geo class
import {Geo} from "./Geo.js";

let geo = new Geo(localStorage.username);

// Get DOM elements
let hideDiv = document.getElementById('hide');
let helloSpan = document.getElementById('hello');
let body = document.getElementsByTagName('body');
let container = document.getElementById('container');
let resultPlayer = document.getElementById('result-player');
let resultComputer = document.getElementById('result-computer');
let playerUsernameTd = document.getElementById('player-username');
let modalResult = document.getElementById('modal-result');
let newGameBtn = document.getElementById('new-game-btn');
let closeModal = document.getElementById('close-result');

// Enter username
if (!localStorage.username) {
    body[0].style.backgroundColor = 'rgb(38, 51, 83)';
    ui.enterUsername();
} else {
    hideDiv.classList.add('d-block');
}

// Hello message in navbar
ui.hello(helloSpan);

// Clear localStorage
geo.clearLocalStorage();

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

        // Get values from game inputs (player's answers)
        let drzava = document.getElementById('answer-drzava').value;
        let grad = document.getElementById('answer-grad').value;
        let reka = document.getElementById('answer-reka').value;
        let planina = document.getElementById('answer-planina').value;
        let zivotinja = document.getElementById('answer-zivotinja').value;
        let biljka = document.getElementById('answer-biljka').value;
        let predmet = document.getElementById('answer-predmet').value;

        let terms = [drzava, grad, reka, planina, zivotinja, biljka, predmet]; // all answers in array
        let categories = ['Država', 'Grad', 'Reka', 'Planina', 'Životinja', 'Biljka', 'Predmet']; //all categories in array

        // Loop through all answers and categories
        for (let i = 0; i < terms.length; i++) {
            geo.specificLetterTerms(randomLetter, categories[i], geo.stringCheck(terms[i]), dataPlayer => { // players answers
                geo.randomTerm(randomLetter, categories[i], dataComputer => { // generate random computer answers
                    let term = geo.stringCheck(terms[i]);
                    // Check the answers and add them to localStorage with score
                    if (!dataComputer && !dataPlayer) { // If both computer and player don't know the answer
                        console.log('1');
                        localStorage.setItem(categories[i] + 'P', term);
                        localStorage.setItem(categories[i] + 'C', 'Ne znam!');
                        localStorage.setItem(categories[i] + '1', '0');
                        localStorage.setItem(categories[i] + '2', '0');
                    } else if (!dataComputer) { // If only computer don't know the answer
                        console.log('2');
                        localStorage.setItem(categories[i] + 'P', term);
                        localStorage.setItem(categories[i] + 'C', 'Ne znam!');
                        localStorage.setItem(categories[i] + '1', '15');
                        localStorage.setItem(categories[i] + '2', '0');
                    } else if (!dataPlayer) { // If player don't know the answer
                        console.log('3');
                        localStorage.setItem(categories[i] + 'P', term);
                        localStorage.setItem(categories[i] + 'C', dataComputer);
                        localStorage.setItem(categories[i] + '1', '0');
                        localStorage.setItem(categories[i] + '2', '15');
                    } else if (dataComputer == geo.stringCheck(terms[i])) { // If both computer and player have the same answer
                        console.log('4');
                        localStorage.setItem(categories[i] + 'P', term);
                        localStorage.setItem(categories[i] + 'C', dataComputer);
                        localStorage.setItem(categories[i] + '1', '5');
                        localStorage.setItem(categories[i] + '2', '5');
                    } else if (dataComputer != geo.stringCheck(terms[i])) { // If both computer and player know the answer, but it is not the same word
                        console.log('5');
                        localStorage.setItem(categories[i] + 'P', term);
                        localStorage.setItem(categories[i] + 'C', dataComputer);
                        localStorage.setItem(categories[i] + '1', '10');
                        localStorage.setItem(categories[i] + '2', '10');
                    } else {
                        console.log('6');
                        localStorage.setItem(categories[i] + 'P', term);
                        localStorage.setItem(categories[i] + 'C', 'Ne znam!');
                        localStorage.setItem(categories[i] + '1', '0');
                        localStorage.setItem(categories[i] + '2', '0');
                    }
                })
            })
        }

        // Wait until firebase finish
        let timeout = 1;
        let timer = setInterval(() => {
            if (timeout < 1) {
                clearInterval(timer);
                console.log('answers');
                // Players values
                let playerAnswers = [drzava, grad, reka, planina, zivotinja, biljka, predmet];
                let modalPlayerAnswers = document.getElementsByClassName('player-answer');

                // Computer values
                let computerAnswers = [localStorage.DržavaC, localStorage.GradC, localStorage.RekaC, localStorage.PlaninaC, localStorage.ŽivotinjaC, localStorage.BiljkaC, localStorage.PredmetC];
                let modalComputerAnswers = document.getElementsByClassName('computer-answer');

                // LocalStorage player's and computer's score values (from string to integer)
                let playerScores = [localStorage.Država1, localStorage.Grad1, localStorage.Reka1, localStorage.Planina1, localStorage.Životinja1, localStorage.Biljka1, localStorage.Predmet1];
                let computerScores = [localStorage.Država2, localStorage.Grad2, localStorage.Reka2, localStorage.Planina2, localStorage.Životinja2, localStorage.Biljka2, localStorage.Predmet2];
                let modalPlayerScores = document.getElementsByClassName('computer-score');
                let modalComputerScores = document.getElementsByClassName('computer-score');

                // Get scores from localStorage
                let d1 = parseInt(localStorage.Država1);
                let d2 = parseInt(localStorage.Država2);
                let g1 = parseInt(localStorage.Grad1);
                let g2 = parseInt(localStorage.Grad2);
                let r1 = parseInt(localStorage.Reka1);
                let r2 = parseInt(localStorage.Reka2);
                let p1 = parseInt(localStorage.Planina1);
                let p2 = parseInt(localStorage.Planina2);
                let z1 = parseInt(localStorage.Životinja1);
                let z2 = parseInt(localStorage.Životinja2);
                let b1 = parseInt(localStorage.Biljka1);
                let b2 = parseInt(localStorage.Biljka2);
                let pr1 = parseInt(localStorage.Predmet1);
                let pr2 = parseInt(localStorage.Predmet2);

                // Calculate score and add it to modal table
                let playerScore = d1 + g1 + r1 + p1 + z1 + b1 + pr1;
                let computerScore = d2 + g2 + r2 + p2 + z2 + b2 + pr2;
                let username = localStorage.username;
                playerUsernameTd.textContent = username;
                resultPlayer.textContent = username + ': ' + playerScore;
                resultComputer.textContent = 'Kompjuter: ' + computerScore;

                // Add answers and scores to modal table
                ui.modalResult(playerAnswers, computerAnswers, playerScores, computerScores, modalPlayerAnswers, modalComputerAnswers, modalPlayerScores, modalComputerScores);

                // Sweetalert winner or loser
                if (playerScore > computerScore) {
                    ui.winnerOrLoser('images/winner.gif', 'Čestitamo!', 'Kompjuter je poražen!');
                } else if (computerScore > playerScore) {
                    ui.winnerOrLoser('images/loser.gif', 'Žao nam je...', 'Kompjuter je pobedio.');
                } else {
                    ui.winnerOrLoser('images/tie.gif', 'Nerešeno!', 'Nema pobednika.');
                }

                // Show modal with results
                modalResult.classList.add('d-block');

                // Clear localStorage when clicked on newGameButton from table modal
                newGameBtn.addEventListener('click', () => {
                    geo.clearLocalStorage();
                    location.reload(); // reload page to start new game
                });

                // Close modal by clicking outside of modal
                window.addEventListener('click', e => {
                    if (e.target == modalResult) {
                        modalResult.classList.remove('d-block');
                        geo.clearLocalStorage();
                        window.location = 'index.html'; // return to index page
                    }
                });
                // Close modal by clicking on x button
                closeModal.addEventListener('click', () => {
                    modalResult.classList.remove('d-block');
                    geo.clearLocalStorage();
                    window.location = 'index.html'; // return to index page
                });
            }

            timeout -= 1; // timer
        }, 1000);
    });
});