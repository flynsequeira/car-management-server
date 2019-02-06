// server.js

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    config = require('./DB');
    User = require('./models/User')
const api = require('./routes/api');
const app = express();

app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
);

const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
  })); 

app.use('/api', api);

app.listen(port, function(){
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
