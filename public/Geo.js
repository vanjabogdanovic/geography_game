export class Geo {

    constructor(korisnik) {
        this.korisnik = korisnik;
        this.geo = db.collection('zgeografija');
    }

    //change username
    updateUsername(newUsername) {
        this.korisnik = newUsername;
        localStorage.setItem('username', newUsername);
    }

    // Get first letter
    firstLetter(string) {
        let str = string.slice(0, 1);
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
            .replace(/(\B)[^ ]*/g,match =>(match.toLowerCase()))
            .replace(/^[^ ]/g,match=>(match.toUpperCase()));
        return newStr;
        }
    // Add new term to firebase
    async newTerm(kategorija, p) {
        let pojam = this.stringCheck(p);
        let vreme = new Date();
        //creating new document that will be added to firebase
        let newDoc = {
            početnoSlovo: this.firstLetter(pojam),
            korisnik: this.korisnik,
            kategorija: kategorija,
            pojam: pojam,
            created_at: firebase.firestore.Timestamp.fromDate(vreme)
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
            .where('kategorija', '==', kategorija)
            .where('pojam', '==', pojam)
            .get()
            .then( snapshot => {
                snapshot.docs.forEach( doc => {
                    if(doc.data()) {
                        x = false;
                    }
                });
                callback(x);
            })
            .catch( error => {
               console.log(error);
            });
    }
}