const winston = require('../config/winston')(module);
const setDateTime = require('../utils/setDateTime');
const sequelize = require('sequelize');
const db = require('../models');

const {ClickHouse} = require('clickhouse');
const clickhouse = new ClickHouse({
    url: process.env.BUMUN_CH_ADDRESS,
    port: 8125,
    debug: false,
    basicAuth: null,
    isUseGzip: false,
    format: "json",
    config: {
        session_timeout                         : 10,
        output_format_json_quote_64bit_integers : 0,
        enable_http_compression                 : 0,
        database                                : 'dti',
    },
});

const tableName = process.env.CH_I001;

module.exports.parseAndInsert = async function(req) {
    winston.info('**************** I001_bumun go! ');
    for(let tag_list of req.body.body.tag_list) {
        let value = {};
        value = {...req.body.header, ...tag_list, date_time: setDateTime.setDateTime()};

        const contents = `${value.message_id}`+'\',\''+`${value.operate_info_id}`+'\',\''+`${value.send_time}`+'\',\''+`${value.unit_id}`
            +'\',\''+`${value.tag_name}`+'\',\''+`${value.tag_desc}`+'\',\''+`${value.date_time}`;

        const query = `insert into dti.${tableName} VALUES (\'${contents}\')`;

        const result = await clickhouse.query(query).exec(function (err, rows) {

        });
    }
};