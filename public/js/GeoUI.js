import {Sweetalert} from "./Sweetalert.js";
let sweetAlert = new Sweetalert();
import {Geo} from "./Geo.js";
let geo = new Geo();
import {Calculate} from "./Calculate.js";
let calc = new Calculate();

export class GeoUI {

    // Hello div in navbar
    hello(div) {
        div.textContent = `Zdravo, ${localStorage.username}!`;
    }

    // Floating input label
    floatLabel() {
        $('input').focus(function(){
            $(this).parents('.form-group').addClass('focused');
        });
        $('input').blur(function(){
            let inputValue = $(this).val();
            if ( inputValue == "" ) {
                $(this).removeClass('filled');
                $(this).parents('.form-group').removeClass('focused');
            } else {
                $(this).addClass('filled');
            }
        })
    }

    // Card deck template
    cardDeck(div) {
        let divCardDeck = document.createElement('div');
        divCardDeck.classList.add('card-deck');
        div.append(divCardDeck);
        return divCardDeck
    }

    // Card template
    card(divCardDeck) {
        let divCard = document.createElement('div');
        divCard.classList.add('bg-white');
        divCard.classList.add('card');
        divCardDeck.append(divCard);
        return divCard
    }

    // Card body template
    cardBody(divCard) {
        let divCardBody = document.createElement('div');
        divCardBody.classList.add('card-body');
        divCard.append(divCardBody);
        return divCardBody
    }

    // Warning text
    warningText(div, color, text) {
        div.style.color = color;
        div.textContent = text;
    }

    // Hall of Fame template (hall-of-fame.html)
    leaderboard(d1, array) {
        for(let i = 0; i < 5; i++) {
            let col1 = document.createElement('div');
            let img = document.createElement('img');
            let h = document.createElement('p');

            if(i == 0) {
                h.style.color = '#FFDB23';
                img.src = 'images/' + i + '.png';
            } else if(i == 1) {
                h.style.color = 'darkred';
                img.src = 'images/' + i + '.png';
            } else if(i == 2) {
                h.style.color = 'silver';
                img.src = 'images/' + i + '.png';
            } else {
                img.src = 'images/medal.png';
            }
            col1.classList.add('col-2', 'text-break', 'text-center');
            if(array[i][0]) {
                h.textContent = array[i][0] + ": " + array[i][1];
            } else {
                h.textContent = array[i].username + ": " + array[i].broj_poena;
            }
            img.style.width = '50%';
            d1.append(col1);
            col1.append(img, h);
        }
    }

    // Play button image (game.html)
    playButtonImage(div) {
        let playImg = document.createElement('img');
        playImg.src = 'images/play-button.png';
        playImg.id = 'play-game-img';
        div.append(playImg); //div { position: relative }
        return playImg;
    }

    // Card for random letter (game.js)
    letterCard(cardDeck) {
        let card1 = this.card(cardDeck);
        let cardBody1 = this.cardBody(card1);
        let letter = document.createElement('h3');
        cardDeck.classList.add('mb-2');
        cardBody1.classList.add('text-center');
        cardBody1.append(letter);
        return letter;
    }

    // Card for countdown (game.js)
    countdownCard(cardDeck) {
        let card2 = this.card(cardDeck);
        let cardBody2 = this.cardBody(card2);
        cardBody2.classList.add('text-center');
        let countdown = document.createElement('h3');
        cardBody2.append(countdown);
        return countdown;
    }

    // Countdown (game.js)
    countdown(countdown, submitAnswersBtn) {
        let countDownDate = new Date().getTime() + 92000; // Set the date we're counting down to
        let timerCountdown = setInterval(function () {
            let now = new Date().getTime();  // Get today's date and time
            let distance = countDownDate - now; // Find the distance between now and the count down date
            calc.countdownGame(countdown, distance);
            if (distance < 0) { // If the count down is over, write some text
                submitAnswersBtn.click();
            }
        }, 1000);
        return timerCountdown;
    }

    // Card for game inputs (game.html)
    gameCard(container) {
        let cardDeckGame = this.cardDeck(container);
        let cardGame = this.card(cardDeckGame);
        let cardBodyGame = this.cardBody(cardGame);
        let submitAnswersForm = this.gameInputs(cardBodyGame);
        return submitAnswersForm;
    }

    // Game inputs (game.html)
    gameInputs(card) {
        // form
        let form = document.createElement('form');
        form.classList.add('mb-0');
        form.id = 'form-submit-answers';
        form.autocomplete = 'off';
        card.append(form);
        // DRZAVA
        let fieldsetDrzava = document.createElement('fieldset');
        fieldsetDrzava.classList.add('form-group');
        form.append(fieldsetDrzava);
        let labelDrzava = document.createElement('label');
        labelDrzava.htmlFor = 'answer-drzava';
        labelDrzava.classList.add('form-label', 'ml-2', 'pl-1', 'pr-1');
        labelDrzava.textContent = 'Država';
        fieldsetDrzava.append(labelDrzava);
        let inputDrzava = document.createElement('input');
        inputDrzava.classList.add('form-control', 'game-input');
        inputDrzava.id = 'answer-drzava';
        inputDrzava.type = 'text';
        fieldsetDrzava.append(inputDrzava);
        // GRAD
        let fieldsetGrad = document.createElement('fieldset');
        fieldsetGrad.classList.add('form-group');
        form.append(fieldsetGrad);
        let labelGrad = document.createElement('label');
        labelGrad.htmlFor = 'answer-grad';
        labelGrad.classList.add('form-label', 'ml-2', 'pl-1', 'pr-1');
        labelGrad.textContent = 'Grad';
        fieldsetGrad.append(labelGrad);
        let inputGrad = document.createElement('input');
        inputGrad.classList.add('form-control', 'game-input');
        inputGrad.id = 'answer-grad';
        inputGrad.type = 'text';
        fieldsetGrad.append(inputGrad);
        // REKA
        let fieldsetReka = document.createElement('fieldset');
        fieldsetReka.classList.add('form-group');
        form.append(fieldsetReka);
        let labelReka = document.createElement('label');
        labelReka.htmlFor = 'answer-reka';
        labelReka.classList.add('form-label', 'ml-2', 'pl-1', 'pr-1');
        labelReka.textContent = 'Reka';
        fieldsetReka.append(labelReka);
        let inputReka = document.createElement('input');
        inputReka.classList.add('form-control', 'game-input');
        inputReka.id = 'answer-reka';
        inputReka.type = 'text';
        fieldsetReka.append(inputReka);
        // PLANINA
        let fieldsetPlanina = document.createElement('fieldset');
        fieldsetPlanina.classList.add('form-group');
        form.append(fieldsetPlanina);
        let labelPlanina = document.createElement('label');
        labelPlanina.htmlFor = 'answer-planina';
        labelPlanina.classList.add('form-label', 'ml-2', 'pl-1', 'pr-1');
        labelPlanina.textContent = 'Planina';
        fieldsetPlanina.append(labelPlanina);
        let inputPlanina = document.createElement('input');
        inputPlanina.classList.add('form-control', 'game-input');
        inputPlanina.id = 'answer-planina';
        inputPlanina.type = 'text';
        fieldsetPlanina.append(inputPlanina);
        // ZIVOTINJA
        let fieldsetZivotinja = document.createElement('fieldset');
        fieldsetZivotinja.classList.add('form-group');
        form.append(fieldsetZivotinja);
        let labelZivotinja = document.createElement('label');
        labelZivotinja.htmlFor = 'answer-zivotinja';
        labelZivotinja.classList.add('form-label', 'ml-2', 'pl-1', 'pr-1');
        labelZivotinja.textContent = 'Životinja';
        fieldsetZivotinja.append(labelZivotinja);
        let inputZivotinja = document.createElement('input');
        inputZivotinja.classList.add('form-control', 'game-input');
        inputZivotinja.id = 'answer-zivotinja';
        inputZivotinja.type = 'text';
        fieldsetZivotinja.append(inputZivotinja);
        // BILJKA
        let fieldsetBiljka = document.createElement('fieldset');
        fieldsetBiljka.classList.add('form-group');
        form.append(fieldsetBiljka);
        let labelBiljka = document.createElement('label');
        labelBiljka.htmlFor = 'answer-biljka';
        labelBiljka.classList.add('form-label', 'ml-2', 'pl-1', 'pr-1');
        labelBiljka.textContent = 'Biljka';
        fieldsetBiljka.append(labelBiljka);
        let inputBiljka = document.createElement('input');
        inputBiljka.classList.add('form-control', 'game-input');
        inputBiljka.id = 'answer-biljka';
        inputBiljka.type = 'text';
        fieldsetBiljka.append(inputBiljka);
        // PREDMET
        let fieldsetPredmet = document.createElement('fieldset');
        fieldsetPredmet.classList.add('form-group');
        form.append(fieldsetPredmet);
        let labelPredmet = document.createElement('label');
        labelPredmet.htmlFor = 'answer-predmet';
        labelPredmet.classList.add('form-label', 'ml-2', 'pl-1', 'pr-1');
        labelPredmet.textContent = 'Predmet';
        fieldsetPredmet.append(labelPredmet);
        let inputPredmet = document.createElement('input');
        inputPredmet.classList.add('form-control', 'game-input');
        inputPredmet.id = 'answer-predmet';
        inputPredmet.type = 'text';
        fieldsetPredmet.append(inputPredmet);

        let submitBtn = document.createElement('button');
        submitBtn.textContent = 'Pošalji';
        submitBtn.type = 'submit';
        submitBtn.classList.add('btn');
        submitBtn.id = 'submit-answers';
        form.append(submitBtn);

        // Input label float
        this.floatLabel();

        return form;
    }

    // Show results after game (game.html)
    modalResult(allInfo, opponent = 'Kompjuter') {
        let modalResult = document.getElementById('modal-result');
        let modalPlayerAnswers = document.getElementsByClassName('player-answer');
        let modalComputerAnswers = document.getElementsByClassName('computer-answer');
        let scores = document.getElementsByClassName('score');
        let result = document.getElementById('result');
        let playerUsernameTd = document.getElementById('player-username');
        let opponentUsernameTd = document.getElementById('opponent-username');

        let playerScore = 0;
        let computerScore = 0;
        let i = 0;

        allInfo.forEach(info => {
            let infoPlayer = info.player;
            let infoComputer = info.computer;

            modalPlayerAnswers[i].innerText = infoPlayer.answer;
            modalComputerAnswers[i].innerText = infoComputer.answer;
            scores[i].innerText = infoPlayer.score + " : " + infoComputer.score;

            // Calculate score and add it to modal table
            playerScore += infoPlayer.score;
            computerScore += infoComputer.score;

            i++;
        });

        // Sweetalert winner or loser
        if (playerScore > computerScore) {
            sweetAlert.winnerOrLoser('images/winner.gif', 'Čestitamo!', 'Pobedili ste!');
            let winnerSound = new Audio('./sounds/winner.mp3');
            winnerSound.play();
        } else if (computerScore > playerScore) {
            sweetAlert.winnerOrLoser('images/loser.gif', 'Žao nam je...', 'Niste pobedili.');
            let loserSound = new Audio('./sounds/loser.mp3');
            loserSound.play();
        } else {
            sweetAlert.winnerOrLoser('images/tie.gif', 'Nerešeno!', 'Nema pobednika.');
            let loserSound = new Audio('./sounds/loser.mp3');
            loserSound.play();
        }

        // Show score in modal
        let username = localStorage.username;
        playerUsernameTd.textContent = username;
        opponentUsernameTd.textContent = opponent;
        result.textContent = playerScore + ' : ' + computerScore;

        // Show modal with results
        modalResult.classList.add('d-block');

        // Add score to database
        geo.addGame(playerScore);
    }

    // Disable game inputs and submit button
    disableSubmit(submitAnswersBtn) {
        let inputs = document.querySelectorAll('input');
        inputs.forEach( input => {
            input.disabled = true;
            input.style.backgroundColor = 'white';
        });
        submitAnswersBtn.disabled = true;
    }

    // Enable game inputs and submit button
    enableSubmit(submitAnswersBtn) {
        let inputs = document.querySelectorAll('input');
        inputs.forEach( input => {
            input.disabled = false;
        });
        submitAnswersBtn.disabled = false;
    }
}