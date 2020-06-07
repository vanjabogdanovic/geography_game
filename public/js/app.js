import {GeoUI} from "./GeoUI.js";
let ui = new GeoUI();
import {Sweetalert} from "./Sweetalert.js";
let sweetAlert = new Sweetalert();
import {String} from "./String.js";
let str = new String();

// Get DOM elements
let helloSpan = document.getElementById('hello');
let formAdd = document.getElementById('formAdd');
let formNewUsername = document.getElementById('formNewUsername');
let divUpdatedUsername = document.getElementById('divUpdatedUsername');
let divNewTerm = document.getElementById('divNewTerm');
let hideDiv = document.getElementById('hide');
let body = document.querySelector('body');
let divComputer = document.getElementById('div-computer');
let divPlayer = document.getElementById('div-player');
let btnModal = document.getElementById('btn-modal');

// Enter username
if(!localStorage.username) {
    body.style.backgroundColor = 'rgb(38, 51, 83)';
    sweetAlert.enterUsername();
} else {
    hideDiv.classList.add('d-block');
}

// Hello message in navbar
ui.hello(helloSpan);

// Game rules alert
sweetAlert.gameRules();

// Input label float
ui.floatLabel();

//Import Geo class
import {Geo} from "./Geo.js";
let geo = new Geo(localStorage.username);

// Add new term
formAdd.addEventListener('submit', e => {
    e.preventDefault();

    let category = document.getElementById('categories').value;
    let term = document.getElementById('newTerm').value;
    // Check if username exists
    if(!localStorage.username) {
        ui.warningText(divNewTerm, 'red', 'Unesite username!');
    } else {
        // Check if input is empty
        if(str.empty(term)) {
            // Check if category is selected
            if(category != "") {
                let letter = str.stringCheck(str.firstLetter(term));
                geo.checkIfExists(letter, category, str.stringCheck(term), data => {
                    // Check if term already exists
                    if(!data) {
                        geo.newTerm(category, str.stringCheck(term));
                        formAdd.reset();
                        ui.warningText(divNewTerm, 'rgb(23, 44, 87)', 'Uspešno dodat pojam: ' + term);
                    } else {
                        formAdd.reset();
                        ui.warningText(divNewTerm, 'red', 'Pojam "' + term + '" već postoji!');
                    }
                });
            } else {
                ui.warningText(divNewTerm, 'red', 'Izaberite kategoriju!');
            }
        } else {
            ui.warningText(divNewTerm, 'red', 'Polje "Napiši nov pojam" ne sme biti prazno!');
        }
    }
});

// Change username
formNewUsername.addEventListener('submit', e => {
    e.preventDefault();
    let newUsername =  document.getElementById('newUsername').value;
    // Check if username input is empty
    if(str.empty(newUsername)) {
        geo.updateUsername(newUsername);
        formNewUsername.reset();
        ui.warningText(divUpdatedUsername, 'rgb(23, 44, 87)', 'Username uspešno promenjen: ' + newUsername);
        ui.hello(helloSpan);
    } else {
        ui.warningText(divUpdatedUsername, 'red', 'Polje "Promeni username" ne sme biti prazno!');
    }
});

// Play against computer
divComputer.addEventListener('click', e => {
    divComputer.classList.toggle('selected-div');
    if(divPlayer.classList.contains('selected-div')) {
        divPlayer.classList.toggle('selected-div');
    }
});
// Play against another player
divPlayer.addEventListener('click', e => {
    divPlayer.classList.toggle('selected-div');
    if(divComputer.classList.contains('selected-div')) {
        divComputer.classList.toggle('selected-div');
    }
});

// Redirect to game page
btnModal.addEventListener('click', () => {
    if(divComputer.classList.contains('selected-div')) {
        window.location = "game.html";
    }
    if(divPlayer.classList.contains('selected-div')) {
        window.location = "live-game.html";
    }
});

// ENTER
// let wordArray = [];
// let words = '';
// wordArray = words.split(' ');
//
// wordArray.forEach(word => {
//     console.log(word);
//     geo.checkIfExists(str.firstLetter(word), 'Reka', word, data => {
//         if (data) {
//             console.log(true);
//             geo.newTerm('Reka', word);
//         }
//     })
// });

// DELETE
// db.collection("pojmovi")
//     .where("korisnik", "==", 'bosko')
//     .where('pojam', '==', '')
//     .get()
//     .then( snapshot => {
//         snapshot.docs.forEach( doc => {
//             console.log(doc.data());
//             db.collection('pojmovi').doc(doc.id).delete();
//         })
//     });