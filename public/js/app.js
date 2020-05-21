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
let body = document.getElementsByTagName('body');

// Enter username
if(!localStorage.username) {
    body[0].style.backgroundColor = 'rgb(38, 51, 83)';
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
