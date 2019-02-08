const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
var { authenticate } = require('../../middleware/authenticate');

const User = require('../../models/User');

router.use(bodyParser.urlencoded({
    extended: true
}));

// Registers user, bcrypts password, generates & saves token and returns the token.
router.post('/register', (req, res) => {
    console.log('came into register');
    console.log(req.body);
    var body = _.pick(req.body, ['firstName', 'lastName', 'email', 'password']);
    var user = new User(body);
    user.save().then((usr) => {
        console.log(usr);
        return user.generateAuthToken();
    }).then((token) => {
        console.log({user,token})
        
        res.send({user,token});
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    })
});

// checks password with bcrypt.compare, if true, you get token that is sent to frontend.
router.post('/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.send({user,token});
        });
    }).catch((e) => {
        console.log(e);
        res.status(400).send();
    });
});


// Get current user from the token, by running it through the authenticate middleware.
router.get('/self', authenticate, (req, res) => {
    res.send({user:req.user});
});
// Get current user from the token, by running it through the authenticate middleware.
router.get('/check', (req, res) => {
    res.send({message:'success'});
});

module.exports = router;
