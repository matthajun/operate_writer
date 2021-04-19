const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const makejson = require('./utils/makejson');
const winston = require('./config/winston')(module);
dotenv.config();
//const v1 = require('./routes/v1');
const api = require('./routes/api');
const { sequelize } = require('./models');

const app = express();
app.set('port', process.env.PORT || 8002);

const stix_state = require('./STIX_service/stixInsert_managstate');

const HighRank = require('./service/HighRank');

//app.set('view engine', 'html');

sequelize.sync({ force: false })
    .then(() => {
        winston.info('success db connect ');
    })
    .catch((err) => {
        winston.error(err.stack);
    });


app.use(morgan( process.env.NODE_ENV !== 'production'?'dev':'combined',{stream:winston.httpLogStream}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

// Other settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) { // 1
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type');
    next();
});

//app.use('/v1', v1);
app.use('/api', api);

app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});


app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    winston.error(err.stack);
    res.json(makejson.makeResData(err,req))
});

app.set('etag', false);

app.listen(app.get('port'), () => {
    winston.info(app.get('port')+ '번 포트에서 대기중');
});

HighRank.searchAndtransm();
stix_state.searchAndInsert();
