const moment = require('moment');

module.exports.setDateTime = function () {
    return moment().format("YYYYMMDDHHmmss");
};

module.exports.setDateTime_Twoago = function () {
    let a = moment().subtract(1,'minutes');
    return a.format("YYYY-MM-DD HH:mm:ss");
};
module.exports.setDateTime_ago = function (mm) {
    let a = moment().subtract(mm,'minutes');
    return a.format("YYYYMMDDHHmmss");
};

module.exports.setDateTimeforHistory = function () {
    return moment().format("YYYY.MM.DD, HH:mm:ss");
};

module.exports.setDateTimeforInsert = function () {
    return moment().format("YYYY.MM.DD_HHmmss");
};