// server.js

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    // config = require('./DB');
    // locally connects to config.DB
    // As in mongoose.connect(config.DB, ...)
    User = require('./models/User')
const api = require('./routes/api');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());

mongoose.Promise = global.Promise;
console.log('Connecting to Mongo mlab... ');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
);

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
  })); 

app.use('/api', api);

app.listen(port, function(){
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
