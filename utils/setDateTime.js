const moment = require('moment');

module.exports.setDateTime = function () {
    return moment().format("YYYYMMDDHHmmss");
};

module.exports.setDateTime_oneago = function () {
    let a = moment().subtract(1,'minutes');
    return a.format("YYYY-MM-DD HH:mm:ss");
};