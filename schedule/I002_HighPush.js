const winston = require('../config/winston')(module);
const setDateTime = require('../utils/setDateTime');
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

Array.prototype.division = function (n) {
    let arr = this;
    let len = arr.length;
    let cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
    let tmp = [];

    for (let i = 0; i < cnt; i++) {
        tmp.push(arr.splice(0, n));
    }

    return tmp;
};

module.exports.searchAndtransm = async function() {
    schedule.scheduleJob('10 * * * * *', async function() {
        let time = setDateTime.setDateTime_Twoago();

        //const query = `select splitByChar('_', hash)[2] as hash from dti.motie_ai_op_result where ai_label = 'True' and version = '2021-06-17 15:00:00' `;
        const query = `select splitByChar('_', hash)[2] as hash from dti.motie_ai_op_result where version > '${time}' and ai_label = 'True' `;

        let rtnResult = {};
        let I002_array = [];
        try {
            let tableInfo = {};
            const hashes = await clickhouse.query(query).toPromise();

            if (hashes instanceof Error) {
                throw new Error(hashes);
            }
            else if (hashes.length) {
                winston.info('**************************** I002 Search Start! ************************************');

               for(hash of hashes) {
                    const date_time = setDateTime.setDateTime_ago(2);
                    const op_query = `select * from (select * ,  toString(sipHash64(c.*)) hash from dti.motie_manag_I002 c where date_time > '${date_time}') where hash in ('${hash.hash}') `;
                    //console.log(op_query);
                    const r = await clickhouse.query(op_query).exec(async function (err, rows) {
                        if (err) {
                           winston.info('**************************** I002 Search 중 에러 발생! ************************************');
                        } else {
                            //console.log(rows);
                            if(rows.length)
                                I002_array.push(rows[0]);
                       }
                   });
               }

                setTimeout(function() {
                    winston.info(JSON.stringify(I002_array));
                    if(I002_array.length > 50){
                        winston.info('******************************** Value 갯수가 50개가 넘었습니다. ********************************');
                        let motherTable = I002_array.division(50);

                        for(let daughtTable of motherTable){
                            tableInfo = {tableName: 'motie_manag_I002', tableData: _.cloneDeep(daughtTable)};
                            makereq.highrankPush(tableInfo);
                        }
                    }
                    else if(I002_array.length) {
                        tableInfo = {tableName: 'motie_manag_I002', tableData: _.cloneDeep(I002_array)};
                        makereq.highrankPush(tableInfo);
                    }
                }, 50000)

            }
            else {
                winston.info('**************************** 1분간 탐지된 운영 이벤트가 없습니다. ***********************************');
            }

        } catch (error) {
            winston.error(error.stack);
            rtnResult = error;
        } finally {
            return rtnResult;
        }
    })
};