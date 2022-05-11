//global vars i use


//list of all .somthings on domains updated every restart
let TLDList = [];

module.exports = {
    getTLDList() {
        return TLDList;
    },
    setTLDList(arr) {
        TLDList = arr;
    }
}