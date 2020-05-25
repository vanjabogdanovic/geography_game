export class GeoUI {

    // Username popup
    enterUsername() {
        Swal.fire({
            title: 'Unesite svoj username',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            imageUrl: 'images/hi.gif',
            showCancelButton: false,
            confirmButtonText: 'Potvrdi',
            confirmButtonColor: '#3b9c8c',
            showLoaderOnConfirm: true,
            backdrop: `rgb(38, 51, 83)`
        }).then((result) => {
            if (result.value) {
                localStorage.setItem('username', result.value);
                location.reload();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ups...',
                    text: 'Morate uneti username!',
                    confirmButtonColor: '#3b9c8c',
                    backdrop: 'rgb(38, 51, 83)'
                }).then(() => {
                    this.enterUsername();
                })
            }
        });
    }

    // Sweetalert for showing winner or loser
    winnerOrLoser(url, mainText, text) {
        Swal.fire({
            title: mainText,
            text: text,
            imageWidth: '370px',
            imageHeight: '370px',
            imageUrl: url,
            imageAlt: 'Winner',
        })
    }

    // Hello div in navbar
    hello(div) {
        div.textContent = `Zdravo, ${localStorage.username}!`;
    }

    // Hall of Fame template
    leaderboard(tr1, tr2, array) {
        for(let i = 0; i < 5; i++) {
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let img = document.createElement('img');
            let h = document.createElement('h4');

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
            h.textContent = array[i][0] + ": " + array[i][1];
            img.style.width = '50%';
            tr1.append(td1);
            tr2.append(td2);
            td1.append(img);
            td2.append(h);
        }
    }

    // Play button image
    playButtonImage(div) {
        let playImg = document.createElement('img');
        playImg.src = 'images/play-button.png';
        playImg.id = 'play-game-img';
        div.append(playImg); //div { position: relative }
        return playImg;
    }

    // Card deck
    cardDeck(div) {
        let divCardDeck = document.createElement('div');
        divCardDeck.classList.add('card-deck');
        div.append(divCardDeck);
        return divCardDeck
    }

    // Cards
    card(divCardDeck) {
        let divCard = document.createElement('div');
        divCard.classList.add('bg-white');
        divCard.classList.add('card');
        divCardDeck.append(divCard);
        return divCard
    }

    // Card body
    cardBody(divCard) {
        let divCardBody = document.createElement('div');
        divCardBody.classList.add('card-body');
        divCard.append(divCardBody);
        return divCardBody
    }

    // Create game inputs
    gameInputs(card) {
        // form
        let form = document.createElement('form');
        form.id = 'form-submit-answers';
        card.append(form);
        // DRZAVA
        let inputDrzava = document.createElement('input');
        inputDrzava.placeholder = 'Država';
        inputDrzava.classList.add('form-control', 'mb-2');
        inputDrzava.id = 'answer-drzava';
        inputDrzava.type = 'text';
        form.append(inputDrzava);
        // GRAD
        let inputGrad = document.createElement('input');
        inputGrad.placeholder = 'Grad';
        inputGrad.classList.add('form-control', 'mb-2');
        inputGrad.id = 'answer-grad';
        inputGrad.type = 'text';
        form.append(inputGrad);
        // REKA
        let inputReka = document.createElement('input');
        inputReka.placeholder = 'Reka';
        inputReka.classList.add('form-control', 'mb-2');
        inputReka.id = 'answer-reka';
        inputReka.type = 'text';
        form.append(inputReka);
        // PLANINA
        let inputPlanina = document.createElement('input');
        inputPlanina.placeholder = 'Planina';
        inputPlanina.classList.add('form-control', 'mb-2');
        inputPlanina.id = 'answer-planina';
        inputPlanina.type = 'text';
        form.append(inputPlanina);
        // ZIVOTINJA
        let inputZivotinja = document.createElement('input');
        inputZivotinja.placeholder = 'Životinja';
        inputZivotinja.classList.add('form-control', 'mb-2');
        inputZivotinja.id = 'answer-zivotinja';
        inputZivotinja.type = 'text';
        form.append(inputZivotinja);
        // BILJKA
        let inputBiljka = document.createElement('input');
        inputBiljka.placeholder = 'Biljka';
        inputBiljka.classList.add('form-control', 'mb-2');
        inputBiljka.id = 'answer-biljka';
        inputBiljka.type = 'text';
        form.append(inputBiljka);
        // PREDMET
        let inputPredmet = document.createElement('input');
        inputPredmet.placeholder = 'Predmet';
        inputPredmet.classList.add('form-control', 'mb-2');
        inputPredmet.id = 'answer-predmet';
        inputPredmet.type = 'text';
        form.append(inputPredmet);

        let submitBtn = document.createElement('button');
        submitBtn.textContent = 'Pošalji';
        submitBtn.type = 'submit';
        submitBtn.classList.add('btn');
        submitBtn.id = 'submit-answers';
        form.append(submitBtn);

        return form;
    }

    modalResult(allInfo, modalPlayerAnswers, modalComputerAnswers, modalPlayerScore, modalComputerScore, playerUsernameTd, resultPlayer, resultComputer, modalResult) {
        let playerScore = 0;
        let computerScore = 0;
        let i = 0;

        allInfo.forEach(info => {
            let infoPlayer = info.player;
            let infoComputer = info.computer;

            modalPlayerAnswers[i].innerText = infoPlayer.answer;
            modalComputerAnswers[i].innerText = infoComputer.answer;
            modalPlayerScore[i].innerText = infoPlayer.score;
            modalComputerScore[i].innerText = infoComputer.score;

            // Calculate score and add it to modal table
            playerScore += infoPlayer.score;
            computerScore += infoComputer.score;

            i++;
        });

        // Sweetalert winner or loser
        if (playerScore > computerScore) {
            this.winnerOrLoser('images/winner.gif', 'Čestitamo!', 'Kompjuter je poražen!');
        } else if (computerScore > playerScore) {
            this.winnerOrLoser('images/loser.gif', 'Žao nam je...', 'Kompjuter je pobedio.');
        } else {
            this.winnerOrLoser('images/tie.gif', 'Nerešeno!', 'Nema pobednika.');
        }

        // Show score in modal
        let username = localStorage.username;
        playerUsernameTd.textContent = username;
        resultPlayer.textContent = username + ': ' + playerScore;
        resultComputer.textContent = 'Kompjuter: ' + computerScore;

        // Show modal with results
        modalResult.classList.add('d-block');
    }
}