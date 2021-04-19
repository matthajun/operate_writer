const winston = require('../config/winston')(module);
const setDateTime = require('../utils/setDateTime');
const sequelize = require('sequelize');
const db = require('../models');

const {ClickHouse} = require('clickhouse');
const clickhouse = new ClickHouse({
    url: process.env.BUMUN_CH_ADDRESS,
    port: 8123,
    debug: false,
    basicAuth: null,
    isUseGzip: false,
    format: "json",
    config: {
        session_timeout                         : 30,
        output_format_json_quote_64bit_integers : 0,
        enable_http_compression                 : 0,
        database                                : 'dti',
    },
});

const tableName = process.env.CH_I001;

module.exports.parseAndInsert = async function(req) {
    let Array = [];
    let queries = [];
    for(let tag_list of req.body.body.tag_list) {
        let req_body = {};
        req_body = {...req.body.header, ...tag_list, date_time: setDateTime.setDateTime()};
        Array.push(req_body);
    }

    for(let value of Array){
        const contents = `${value.message_id}`+'\',\''+`${value.operate_info_id}`+'\',\''+`${value.send_time}`+'\',\''+`${value.unit_id}`
            +'\',\''+`${value.tag_name}`+'\',\''+`${value.tag_desc}`+'\',\''+`${value.date_time}`;

        const query = `insert into dti.${tableName} VALUES (\'${contents}\')`;
        queries.push(query);
    }

    let rtnResult = {};
    try {

        const trans = await db.sequelize.transaction(async (t) => {
            for (const query of queries) {
                let rslt = await clickhouse.query(query).toPromise();

                if (rslt instanceof Error) {
                    throw new Error(rslt);
                }
            }
        })

    } catch (error) {
        winston.error(error.stack);
        rtnResult = error;
    } finally {
        return rtnResult;
    }
};