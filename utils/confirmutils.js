const CRC32 = require('crc-32');
const fs = require('fs');

module.exports.makeConfirmCode  = function (strData){
    let a = CRC32.str('"body":' + JSON.stringify(strData));
    let b = a>>>0;

    return b.toString(16);
};

module.exports.makeConfirmCodeForbumun  = function (strData){
    if(strData) {
        let a = CRC32.str(JSON.stringify(strData));
        let b = a >>> 0;

        return b.toString(16);
    }
    else {
        return ''
    }
};