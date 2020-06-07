export class Calculate {

    // Choose random letter (game.html)
    randomLetter() {
        let characters = ['A', 'B', 'V', 'G', 'D', 'Đ', 'E', 'Ž', 'Z', 'I', 'J', 'K', 'L', 'Lj', 'M', 'N', 'Nj', 'O', 'P', 'R', 'S', 'T', 'Ć', 'U', 'F', 'H', 'C', 'Č', 'Dž', 'Š'];
        let charactersLength = characters.length;
        let randomLetter = characters[Math.floor(Math.random() * charactersLength)];
        return randomLetter;
    }

    // Calculate score based on answers (game.html)
    calculateScore(category, term, dataPlayer, dataComputer) {
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

    // Calculate countdown (game.html)
    countdownGame(countdown, distance) {
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); // Time calculations for minutes and seconds
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if(distance < 10000) {
            countdown.style.color = 'darkred';
            if(distance < 5000) {
            let beepSound = new Audio('./sounds/beep.mp3');
            beepSound.play();
            }
        }
        return countdown.textContent = 'Preostalo vreme: ' + minutes + "min " + seconds + "s ";
    }
}