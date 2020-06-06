import {String} from "./String.js";
let str = new String();

export class Geo {

    constructor(korisnik) {
        this.korisnik = korisnik;
        this.geo = db.collection('pojmovi');
        this.game = db.collection('rezultati');
        this.users = [];
        this.score = [];
    }

    //change username
    updateUsername(newUsername) {
        this.korisnik = newUsername;
        localStorage.setItem('username', newUsername);
    }

    // Add new term to firebase
    async newTerm(category, t) {
        let term = str.stringCheck(t);
        let time = new Date();
        //creating new document that will be added to firebase
        let newDoc = {
            pocetnoSlovo: str.firstLetter(term),
            korisnik: this.korisnik,
            kategorija: category,
            pojam: term,
            vreme: firebase.firestore.Timestamp.fromDate(time)
        };
        //adding new document to this.chats(it contains whole collection from firebase)
        let response = await this.geo.add(newDoc);
        return response;
    }

    // Users with best score
    bestScore(callback) {
        this.game
            .orderBy('broj_poena', 'desc')
            .limit(5)
            .get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {
                    this.score.push(doc.data());
                });
                callback(this.score);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // User who contributed the most
    mostActiveUser(callback) {
        this.geo
            .get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {
                    this.users.push(doc.data().korisnik);
                });
                callback(this.limitTopFive(this.sortUsers(this.count(this.users))));
            })
            .catch(error => {
                console.log(error);
            });
    }

    // count number of terms per user
    count(users) {
        let counted = {};
        users.sort();
        let current = null;
        let cnt = 0;
        for (let i = 0; i < users.length; i++) {
            if (users[i] != current) {
                if (cnt > 0) {
                    counted[current] = cnt;
                }
                current = users[i];
                cnt = 1;
            } else {
                cnt++;
            }
        }
        if (cnt > 0) {
            counted[current] = cnt;
        }
        return counted;
    }

    // sort users
    sortUsers(users) {
        let sorted = [];
        for( let user in users) {
            sorted.push([user, users[user]]);
        }
        sorted.sort(function(a, b) {
            return b[1] - a[1];
        });
        return sorted;
    }

    // limit up to five users
    limitTopFive(users) {
        let array = [];
        for(let i = 0; i < 5; i++) {
            array.push(users[i]);
        }
        return array;
    }

    // Terms that start with certain letter
    checkIfExists(letter, category, term, callback) {
        let flag = false;
        this.geo
            .where('pocetnoSlovo', '==', letter)
            .where('kategorija', '==', category)
            .where('pojam', '==', term)
            .get()
            .then(snapshot => {
                if (snapshot.docs.length) {
                    flag = true;
                }
                callback(flag);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Random term - when user plays game against computer
    randomTerm(letter, category, callback) {
        let term = false;
        this.geo
            .where('pocetnoSlovo', '==', letter)
            .where('kategorija', '==', category)
            .get()
            .then(snapshot => {
                let chance = Math.random();
                if (chance > 0.2) {
                    const randomIndex = Math.floor(Math.random() * snapshot.docs.length);
                    let data = snapshot.docs[randomIndex];
                    term = data && data !== undefined ? data.data().pojam : '';
                }
                callback(term);
            })
            .catch(error => {
                console.log(error);
            });
    }

    generateBotAnswer(category, firstLetter) {
        let promis = new Promise((resolve, reject) => {
            let answer
            let key = db.collection('pojmovi').doc().id;
            db.collection('pojmovi')
                .where('kategorija', '==', category)
                .where('pocetnoSlovo', '==', firstLetter)
                .where(firebase.firestore.FieldPath.documentId(), '>=', key)
                .limit(1)
                .get()
                .then(snapshot => {
                    const randomIndex = Math.floor(Math.random() * snapshot.docs.length);
                    if (snapshot.docs[randomIndex] === undefined) {
                        answer = '';
                    } else {
                        answer = finalAnswer(Math.random(), snapshot.docs[randomIndex].data().pojam);
                    }
                    resolve(answer);
                })
        });
        return promis;
    }

    // Check if user's score exists
    userScoreExists(callback) {
        this.game
            .where("username", "==", localStorage.username)
            .get()
            .then( snapshot => {
                let doc;
                if(snapshot.docs.length) {
                    doc = snapshot.docs[0];
                } else {
                    doc = false;
                }
                callback(doc);
            });
    }
    // Add users score and number of played games to database
    addGame(score) {
        this.userScoreExists( doc => {
            let data = doc ? doc.data() : false;
            let docId = doc ? doc.id : null;
            let time = new Date();
            let newDoc = {
                username: localStorage.username,
                broj_igara: data ? data.broj_igara + 1 : 1,
                broj_poena: data ? data.broj_poena + score : score,
                datum: firebase.firestore.Timestamp.fromDate(time)
            };
            //adding new document to this.chats(it contains whole collection from firebase)
            if(doc) {
                return this.game.doc(docId).update(newDoc);
            } else {
                return this.game.doc().set(newDoc);
            }
        });
    }
}