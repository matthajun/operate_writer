const winston = require('../config/winston')(module);
const setDateTime = require('../utils/setDateTime');
const sequelize = require('sequelize');
const db = require('../models');
const _ = require('loadsh');
const schedule = require('node-schedule');
const makereq = require('../utils/makerequest');

const {ClickHouse} = require('clickhouse');
const clickhouse = new ClickHouse({
    url: process.env.CH_ADDRESS,
    port: 8124,
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

module.exports.searchAndtransm = async function(req) {
    schedule.scheduleJob('45 * * * * *', async function() {
        let time = setDateTime.setDateTime_oneago();

        const query = `select * from dti.motie_ai_op_result where time_line > '${time}'`;

        let rtnResult = {};
        try {
            let tableInfo = {};
            let rslt = await clickhouse.query(query).toPromise();

            if (rslt instanceof Error) {
                throw new Error(rslt);
            } else {
                tableInfo = {tableName: 'motie_ai_op_result', tableData: rslt};
                console.log(tableInfo);
                if(tableInfo.tableData.length) {
                    //makereq.highrankPush(tableInfo);
                }
            }
        } catch (error) {
            winston.error(error.stack);
            rtnResult = error;
        } finally {
            return rtnResult;
        }
    })
};
