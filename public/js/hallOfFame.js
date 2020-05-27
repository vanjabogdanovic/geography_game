// Import GeoUI class
import {GeoUI} from "./GeoUI.js";
let ui = new GeoUI();
//Import Geo class
import {Geo} from "./Geo.js";
let geo = new Geo(localStorage.username);

// Get DOM elements
let hideDiv = document.getElementById('hide');
let body = document.querySelector('body');
let helloSpan = document.getElementById('hello');
let d1 = document.getElementById('d1');

// Enter username
if(!localStorage.username) {
    body.style.backgroundColor = 'rgb(38, 51, 83)';
    ui.enterUsername();
} else {
    hideDiv.classList.add('d-block');
}

// Hello message in navbar
ui.hello(helloSpan);

// Show most active user
geo.mostActiveUser( users => {
    ui.leaderboard(d1, users);
});
