export class String {

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

    // Check if string is empty/null
    empty(string) {
        let pattern = /^(?!\s*$).+/;
        if(pattern.test(string) && string != "" && string != null) {
            return true;
        } else {
            return false;
        }
    }
}