// Import GeoUI class
import {GeoUI} from "./GeoUI.js";
let ui = new GeoUI();

// Get DOM elements
let helloSpan = document.getElementById('hello');
let formAdd = document.getElementById('formAdd');
let formNewUsername = document.getElementById('formNewUsername');
let divUpdatedUsername = document.getElementById('divUpdatedUsername');
let divNewTerm = document.getElementById('divNewTerm');
let hideDiv = document.getElementById('hide');
let body = document.querySelector('body');
let modal = document.getElementById('modal');
let playBtn = document.getElementById('play-btn');
let closeModal = document.getElementById('close-modal');
let divComputer = document.getElementById('div-computer');
let divPlayer = document.getElementById('div-player');
let btnModal = document.getElementById('btn-modal');

// Enter username
if(!localStorage.username) {
    body.style.backgroundColor = 'rgb(38, 51, 83)';
    localStorage.clear();
    ui.enterUsername();
} else {
    hideDiv.classList.add('d-block');
}

// Hello message in navbar
ui.hello(helloSpan);

//Import Geo class
import {Geo} from "./Geo.js";
let geo = new Geo(localStorage.username);

// Add new term
formAdd.addEventListener('submit', e => {
    e.preventDefault();
    let kategorija = document.getElementById('categories').value;
    let pojam = document.getElementById('newTerm').value;
    if(!localStorage.username) {
        divNewTerm.style.color = 'red';
        divNewTerm.textContent = 'Unesite username!';
    } else {
        let pattern = /^(?!\s*$).+/;
        if(pattern.test(pojam) &&
            pojam != "" &&
            pojam != null) {
            geo.checkIfExists(kategorija, pojam, data => {
                if(data) {
                    geo.newTerm(kategorija, pojam);
                    formAdd.reset();
                    divNewTerm.style.color = 'rgb(23, 44, 87)';
                    divNewTerm.textContent = 'Uspešno dodat pojam: ' + pojam;
                } else {
                    formAdd.reset();
                    divNewTerm.style.color = 'red';
                    divNewTerm.textContent = 'Pojam ' + pojam + ' već postoji!';
                }
            });
        } else {
            divNewTerm.style.color = 'red';
            divNewTerm.textContent = 'Polje "pojam" ne sme biti prazno!';
        }
    }
});

// Change username
formNewUsername.addEventListener('submit', e => {
    e.preventDefault();
    let newUsername =  document.getElementById('newUsername').value;
    //username input validation
    let pattern = /^(?!\s*$).+/;
    if(pattern.test(newUsername) &&
        newUsername != "" &&
        newUsername != null) {
        geo.updateUsername(newUsername);
        formNewUsername.reset();
        divUpdatedUsername.style.color = 'rgb(23, 44, 87)';
        divUpdatedUsername.textContent = 'Username uspešno promenjen: ' + newUsername;
        ui.hello(helloSpan);
    } else {
        divUpdatedUsername.style.color = 'red';
        divUpdatedUsername.textContent = 'Polje "username" ne sme biti prazno!';
    }
});

// Show/hide modal for game start
playBtn.addEventListener('click', () => {
    modal.classList.add('d-block');
});

// Close modal by clicking outside of modal
window.addEventListener('click', e => {
    if (e.target == modal) {
        modal.classList.remove('d-block');
    }
});
// Close modal by clicking on x button
closeModal.addEventListener('click', () => {
    modal.classList.remove('d-block');
});

// Play against computer
divComputer.addEventListener('click', e => {
    divComputer.classList.toggle('selected-div');
    if(divPlayer.classList.contains('selected-div')) {
        divPlayer.classList.toggle('selected-div');
    }
});
divPlayer.addEventListener('click', e => {
    divPlayer.classList.toggle('selected-div');
    if(divComputer.classList.contains('selected-div')) {
        divComputer.classList.toggle('selected-div');
    }
});

// Redirect to game page
btnModal.addEventListener('click', () => {
    console.log(divComputer.classList.contains('selected-div'))
    if(divComputer.classList.contains('selected-div')) {
        window.location = "game.html";
    }
});

// enter
// let wordArray = [];
// let words = '';
// wordArray = words.split(' ');
//
// wordArray.forEach(word => {
//     console.log(word);
//     geo.checkIfExists('Država', word, data => {
//         if (data) {
//             console.log(true);
//             geo.newTerm('Država', word);
//         }
//     })
// });

//delete
// db.collection("pojmovi")
//     .where("korisnik", "==", 'vanja')
//     .where('pojam', '==', '')
//     .get()
//     .then( snapshot => {
//         snapshot.docs.forEach( doc => {
//             console.log(doc.data());
//             db.collection('pojmovi').doc(doc.id).delete();
//         })
//     });
