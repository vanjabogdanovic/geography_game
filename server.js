const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, '/public')));

// Import class LiveGame
const LiveGame = require('./LiveGameServer');

let waitingPlayer = null;
let username1;

// Run when user connects
io.on('connection', socket => {

    socket.on('msg', msg => {
        io.emit('chat', msg);
    });

    if(waitingPlayer) {
        socket.on('username', username2 => {
            console.log(username1, username2);
            if(username1 == username2 || username1 == undefined) {
                username1 = username2;
                // Don't start game if usernames are the same
                waitingPlayer = socket;
                waitingPlayer.emit('message', 'Sačеkajte svog protivnika...');
                console.log(username1, username2);

            } else {
                // Start game if usernames are not the same
                let liveGame = new LiveGame(waitingPlayer, socket, io);
                waitingPlayer = null;
                username1 = undefined;
                liveGame.getRandomLetter(io);
            }
        })
    } else {
        // Wait for an opponent
        waitingPlayer = socket;
        waitingPlayer.on('username', username => {
            username1 = username; // store waitingPlayer username
        });
        waitingPlayer.emit('message', 'Sačеkajte svog protivnika...')
    }
});

const PORT = process.env.PORT || 8080;
server.on('error', err => console.log('Server error' + err));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
