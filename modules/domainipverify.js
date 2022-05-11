const globals = require('../globals');
/**
 * 
 * @param {String} str - The input you would like to verify if it is a domain or ip
 * @returns {Object} - Object containing type (the type ip domain or none) and clean (the cleaned input removes spaces etc)
 */
module.exports = (str) => {
    let ip = str.replaceAll(' ', '').toLowerCase().replaceAll('https://', '').replaceAll('http://').split('/')[0].split(':')[0];
    let iparr = ip.split('.');

    function checkDomain() {
        if (!/^[A-Za-z0-9-.]*$/.test(ip)) {
            return { type: "domain", valid: false, clean: null, error: "INVALIDCHARS" };
        }
        if (!globals.getTLDList().includes(iparr[iparr.length - 1])) {
            return { type: "domain", valid: false, clean: null, error: "INVALIDTLD" };
        }
        return { type: "domain", valid: true, clean: ip, error: "NONE" };
    }
    //is ip maybe
    if (iparr.length == 4) {
        //test last thing in array for only numbser
        //probbably ip
        if (/^\d+$/.test(iparr[iparr.length - 1])) {
            let haser = false;
            let er = "";

            for (let i = 0; i < iparr.length; i++) {
                //check to see if only numbers
                if (!/^\d+$/.test(iparr[i])) {
                    haser = true;
                    er = "NOTLONLYNUMBERS";
                }
                //check each field
                if (parseInt(iparr[i]) > 255) {
                    haser = true;
                    er = "field " + i + " is invalid";
                }
            };
            if (haser) {
                return { type: "ip", valid: false, clean: null, error: er };
            };
            //probbably domain
        } else {
            return checkDomain();
        }
        return { type: "ip", valid: true, clean: ip, error: "NONE" };

        //is domain
    } else
    if (iparr.length >= 2) {
        return checkDomain();
    } else {
        return { type: "none", valid: false, clean: null, error: "invalid domain or ip" };
    }
}