export class Geo {

    constructor(korisnik) {
        this.korisnik = korisnik;
        this.geo = db.collection('pojmovi');
        this.users = [];
    }

    //change username
    updateUsername(newUsername) {
        this.korisnik = newUsername;
        localStorage.setItem('username', newUsername);
    }

    // Get first letter
    firstLetter(string) {
        let str;
        if(string.slice(0, 2) == 'Nj' ||
            string.slice(0, 2) == 'Dž' ||
            string.slice(0, 2) == 'Lj') {
            str = string.slice(0, 2);
        } else {
            str = string.slice(0, 1);
        }
        return str;
    }

    // Check input value
    stringCheck(str) {
        let newStr = str
        //delete spaces and tabs
            .replace(/\s+/g, '')
            //delete all special characters and numbers
            .replace(/[^a-zđščžć]+/gi, '')
            //only first letter uppercase
            .replace(/(\B)[^ ]*/g, match => (match.toLowerCase()))
            .replace(/^[^ ]/g, match => (match.toUpperCase()));
        return newStr;
    }

    // Add new term to firebase
    async newTerm(kategorija, p) {
        let pojam = this.stringCheck(p);
        let vreme = new Date();
        //creating new document that will be added to firebase
        let newDoc = {
            pocetnoSlovo: this.firstLetter(pojam),
            korisnik: this.korisnik,
            kategorija: kategorija,
            pojam: pojam,
            vreme: firebase.firestore.Timestamp.fromDate(vreme)
        };
        //adding new document to this.chats(it contains whole collection from firebase)
        let response = await this.geo.add(newDoc);
        return response;
    }

    // Check if term already exists
    checkIfExists(kategorija, p, callback) {
        let x = true;
        let pojam = this.stringCheck(p);
        this.geo
            .where('kategorija', '==', kategorija) //dodaj jos jedan where
            .where('pojam', '==', pojam)
            .get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {  //izbaci forEach
                    if (doc.data()) {
                        x = false;
                    }
                });
                callback(x);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // User who contributed the most
    orderByUser(callback) {
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
    specificLetterTerms(letter, category, term, callback) {
        let flag = false;
        this.geo
            .where('pocetnoSlovo', '==', letter)
            .where('kategorija', '==', category)
            .where('pojam', '==', term)
            .get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {
                    if (doc.data()) {
                        flag = true;
                    }
                });
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
            .where('pocetnoSlovo', '==', 'A')
            .where('kategorija', '==', category)
            .get()
            .then(snapshot => {
                let chance = Math.random();
                if (chance > 0.2) {
                    const randomIndex = Math.floor(Math.random() * snapshot.docs.length);
                    let data = snapshot.docs[randomIndex];
                    term = data && data !== undefined ? data.data().pojam : '/';
                }
                callback(term);
            })
            .catch(error => {
                console.log(error);
            });
    }
}