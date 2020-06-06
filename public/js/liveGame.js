import {GeoUI} from "./GeoUI.js";
let ui = new GeoUI();
import {Geo} from "./Geo.js";
let geo = new Geo(localStorage.username);
import {Sweetalert} from "./Sweetalert.js";
let sweetAlert = new Sweetalert();
import {Calculate} from "./Calculate.js";
let calc = new Calculate();
import {String} from "./String.js";
let str = new String();

// Get socket
const socket = io();

// Get DOM elements
let hideDiv = document.getElementById('hide');
let body = document.querySelector('body');
let container = document.getElementById('container');
let newGameBtn = document.getElementById('new-game-btn');
let closeModal = document.getElementById('close-result');
let helloSpan = document.getElementById('hello');
let modalTrigger = document.getElementById('modal-div-live');
let modalResult = document.getElementById('modal-result');
// Get UI elements
let cardDeck = ui.cardDeck(container);
let card = ui.card(cardDeck);
let cardBody = ui.cardBody(card);
// Create new elements
let h3 = document.createElement('h3');

// Enter username
if (!localStorage.username) {
    body.style.backgroundColor = 'rgb(38, 51, 83)';
    sweetAlert.enterUsername();
} else {
    hideDiv.classList.add('d-block');
}

// Hello message in navbar
ui.hello(helloSpan);

// Send username to server
socket.emit('username', localStorage.username);

// Game rules alert
sweetAlert.gameRules();

socket.on('message', message => {
    if (message != 'start') {

        // Waiting for opponent
        h3.classList.add('text-center');
        h3.textContent = message;
        cardBody.append(h3);

    } else {
        // Disconnected user
        let disconnected = socket.on('disconnected', message => {
            disconnected = message;
        });

        // Get random letter
        let randomLetter = socket.on('letter', letter => {
            randomLetter = letter;
        });

        // Start game countdown
        let count = 3;
        let timerStart = setInterval(() => {
            h3.classList.add('text-center');
            h3.textContent = 'Igra počinje za: ' + count;
            cardBody.append(h3);
            count--;

            // Start game if count < 0
            if (count < 0) {
                clearInterval(timerStart);
                cardDeck.removeChild(card);

                // SHOW random letter and countdown in card deck
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
                        ui.enableSubmit(submitAnswersBtn)
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
                    submitAnswersBtn.disabled = true;

                    if(disconnected == 'disconnected') {

                        printCountdown.textContent = "Vaša rešenja su poslata! Drugi igrač je diskonektovan!";

                        computerGame(printCountdown, randomLetter);

                    } else {
                        // Notification - results are sent
                        printCountdown.textContent = 'Vaša rešenja su poslata! Sačekajte odgovore protivnika.';

                        multiplayerGame(socket, randomLetter);
                    }
                });
            }
        }, 1000);

        // If opponent is disconnected, continue game with computer
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

        // If both players are connected
        let multiplayerGame = (socket, randomLetter) => {
            // Player's answers and category
            let playerAnswers = [
                {
                    'username': localStorage.username
                },
                {
                    'term': str.stringCheck(document.getElementById('answer-drzava').value),
                    'category': 'Država',
                },
                {
                    'term': str.stringCheck(document.getElementById('answer-grad').value),
                    'category': 'Grad',
                },
                {
                    'term': str.stringCheck(document.getElementById('answer-reka').value),
                    'category': 'Reka',
                },
                {
                    'term': str.stringCheck(document.getElementById('answer-planina').value),
                    'category': 'Planina',
                },
                {
                    'term': str.stringCheck(document.getElementById('answer-zivotinja').value),
                    'category': 'Životinja',
                },
                {
                    'term': str.stringCheck(document.getElementById('answer-biljka').value),
                    'category': 'Biljka',
                },
                {
                    'term': str.stringCheck(document.getElementById('answer-predmet').value),
                    'category': 'Predmet',
                },
            ];

            // Send answers to server.js
            socket.emit('turn', playerAnswers);

            // Get answers from both players from server.js
            socket.on('message', answers => {
                let player1;
                let player2;
                // Check what are your's and opponents answers
                if(answers[0][0].username == localStorage.username) {
                    player1 = answers[0];
                    player2 = answers[1]
                } else {
                    player2 = answers[0];
                    player1 = answers[1];
                }

                // All info about user and computer score and answers
                let allInfo = [];

                // Loop through all answers and categories
                for (let i = 1; i < player1.length; i++) {
                    let playerTerm = str.stringCheck(player1[i].term);
                    let opponentTerm = str.stringCheck(player2[i].term);
                    let category = player1[i].category;

                    // Check if term exists in database
                    geo.checkIfExists(randomLetter, category, playerTerm, dataPlayer => {
                        geo.checkIfExists(randomLetter, category, opponentTerm, dataOpponent => {

                            // Add all info (about user's and computer's answers and scores)  to array
                            allInfo.push(calculateScore(category, playerTerm, opponentTerm, dataPlayer, dataOpponent));

                            // If loop has reached last element, then show modal with result
                            if (i == playerAnswers.length - 1) {
                                printResult(allInfo, player2[0].username);
                            }
                        })
                    })
                }
            })
        }

        // Calculate score based on answers (game.html)
        let calculateScore = (category, playerTerm, opponentTerm, dataPlayer, dataComputer) => {
            let data = {
                player: {
                    'answer': playerTerm ? playerTerm : '/',
                    'category': category,
                    'score': 0,
                },
                computer: {
                    'answer': opponentTerm ? opponentTerm : '/',
                    'category': category,
                    'score': 0,
                },
            };
            if (!dataComputer && !dataPlayer) {
                data.player.score = 0;
                data.computer.score = 0;
            } else if (!dataComputer) { // If only computer don't know the answer
                data.player.score = 15;
                data.computer.score = 0;
            } else if (!dataPlayer) { // If player don't know the answer
                data.player.score = 0;
                data.computer.score = 15;
            } else if (playerTerm == opponentTerm) { // If both computer and player have the same answer
                data.player.score = 5;
                data.computer.score = 5;
            } else if (playerTerm != opponentTerm) { // If both computer and player know the answer, but it is not the same word
                data.player.score = 10;
                data.computer.score = 10;
            }

            return data;
        };

        // Show modal with result
        let printResult = (allInfo, opponent) => {

            // Add answers and scores to modal table
            ui.modalResult(allInfo, opponent);

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
    }
});

