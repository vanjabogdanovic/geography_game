class LiveGameServer {

    constructor(player1, player2, io) {
        this._players = [player1, player2];
        this._turns = [null, null];
        this._sendToPlayers('start');
        this._players.forEach((player, index) => {
            player.on('turn', turn => {
                this._onTurn(index, turn);
            })
        });
        this._players.forEach(socket => {
            socket.on('disconnect', () => {
                this._players.forEach(sock => {
                    if (socket !== sock) {
                        sock.emit('disconnected', 'disconnected');
                    }
                });
            });
        })
    }

    _sendToPlayer(playerIndex, message) {
        this._players[playerIndex].emit('message', message);
    }

    _sendToPlayers(message) {
        this._players.forEach(s => s.emit('message', message));
    }

    _onTurn(playerIndex, turn) {
        this._turns[playerIndex] = turn;
        this._checkGameOver();
    }

    _checkGameOver() {
        const turns = this._turns;
        this._players.forEach(sock => sock.emit('gameover', ''));
        if( turns[0] && turns[1]) {
            this._sendToPlayers(turns);
            this._players.forEach(sock => sock.emit('gameover', 'gameover'));
            this._turns = [null, null];
        }
    }

    getRandomLetter(io) {
        let characters = ['A', 'B', 'V', 'G', 'D', 'Đ', 'E', 'Ž', 'Z', 'I', 'J', 'K', 'L', 'Lj', 'M', 'N', 'Nj', 'O', 'P', 'R', 'S', 'T', 'Ć', 'U', 'F', 'H', 'C', 'Č', 'Dž', 'Š'];
        let charactersLength = characters.length;
        let randomLetter = characters[Math.floor(Math.random() * charactersLength)];
        console.log(randomLetter);
        return io.emit('letter', randomLetter);
    }
}

module.exports = LiveGameServer;