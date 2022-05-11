// make requests needed for things like getting all domain extentions from iana


const axios = require('axios');
const logger = require('../modules/nodeLogger');
const globals = require('../globals');
module.exports = () => {
    axios.get('https://data.iana.org/TLD/tlds-alpha-by-domain.txt', { headers: { 'User-Agent': 'mcstatus/2.3 the minecraft status bot software' } }).then(res => {
        let arr = res.data.toLowerCase().split('\n').filter(el => !el.startsWith('#'));
        globals.setTLDList(arr);
        logger.info("fetched tld list")
    }).catch(err => {
        logger.warn("could not fetch tlds domain validation will be off");
        //console.log(err);
    })

}