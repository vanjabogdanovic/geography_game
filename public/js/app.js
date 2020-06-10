import {GeoUI} from "./GeoUI.js";
let ui = new GeoUI();
import {Sweetalert} from "./Sweetalert.js";
let sweetAlert = new Sweetalert();
import {String} from "./String.js";
let str = new String();

// Get socket
const socket = io();

// Get DOM elements
let helloSpan = document.getElementById('hello');
let formAdd = document.getElementById('formAdd');
let formNewUsername = document.getElementById('formNewUsername');
let divNewTerm = document.getElementById('divNewTerm');
let hideDiv = document.getElementById('hide');
let body = document.querySelector('body');
let divComputer = document.getElementById('div-computer');
let divPlayer = document.getElementById('div-player');
let btnModal = document.getElementById('btn-modal');
let chatForm = document.getElementById('formChat');
let chatInput = document.getElementById('chat-input');

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
                        sweetAlert.alertSuccess('Uspešno dodat pojam: ' + term);
                    } else {
                        formAdd.reset();
                        sweetAlert.alertWarning('Pojam "' + term + '" već postoji!');
                    }
                });
            } else {
                sweetAlert.alertWarning('Izaberite kategoriju!');
            }
        } else {
            sweetAlert.alertWarning('Polje "Napiši nov pojam" ne sme biti prazno!');
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
        sweetAlert.alertSuccess('Username uspešno promenjen: ' + newUsername);
        ui.hello(helloSpan);
    } else {
        sweetAlert.alertWarning('Polje "Promeni username" ne sme biti prazno!');
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

// Chat
chatForm.addEventListener('submit', e => {
    e.preventDefault();
    socket.emit('msg', {username: localStorage.username, message: chatInput.value});
    chatForm.reset();
});
socket.on('chat', chat => {
    // if message is not empty, show message
    if(str.empty(chat.message)) {
        ui.chatLi(chat);
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
