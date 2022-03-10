/* 
 * translates bot responses to servers local language 
 * join the support server if you would like to learn how to contribute to this https://www.mcstatusbot.site/support
 */

const cache = require('./cache');

module.exports = async(lan, text) => {
    if (!lan || lan == null || lan == false || lan == undefined) return text;
    const yehe = await cache.lookup('lan', lan);
    if (yehe == null) return text;
    return yehe[text];
}