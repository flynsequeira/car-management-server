const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bodyParser = require('body-parser');
var { authenticate } = require('../../middleware/authenticate');

const User = require('../../models/User');
const Vehicle = require('../../models/Vehicle');

router.use(bodyParser.urlencoded({
    extended: true
}));

function cleanObject(obj) {
    for (var propName in obj) { 
        if (obj[propName] === null || obj[propName] === undefined || obj[propName] === 'null' || obj[propName] === 'undefined') {
            delete obj[propName];
        }
    }
    return obj;
}

// Changing the oldObject if it has the same key as newObject
function extendObj (oldObj, addObj){
    for (var key in addObj) {
        if (addObj.hasOwnProperty(key)) {
            oldObj[key]=addObj[key];
        }
    }
    return oldObj;
}


// Without Changing the oldObject if it has the same key as newObject
function extendObjWithoutAppend (oldObj, addObj){
    for (var key in addObj) {
        if (addObj.hasOwnProperty(key)) {
            if(!oldObj.hasOwnProperty(key)){
                oldObj[key]=addObj[key];
            }
        }
    }
    return oldObj;
}

// Edit/add a vehicle
router.post('/save', authenticate, (req, res) => {
    console.log('saving')
    var promise;
    if(!req.body._id){
        var body = req.body
        body['_user'] = req.user._id
        var vehicle = new Vehicle(body)
        promise = vehicle.save();
    } else {
        promise = Vehicle.updateOne({_id:req.body._id}, {$set:cleanObject(req.body)})
    }
    promise.then((result)=>{
        console.log(result);
        res.send(result);
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    })
});

// Get all vehicles under a user
router.get('', authenticate, (req, res) => {
    Vehicle.find({_user : req.user._id}).then((output) => {
        res.send(output);
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    })
});

// Get all vehicles under a user
router.get('/:id', authenticate, (req, res) => {
    console.log(req.params.id);
    Vehicle.findById(req.params.id).then((output) => {
        res.send(output);
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    })
});

// Get all Vehicles under the a particular advisers particular user
router.post('/:vehicle', authenticate, (req, res) => {
    Vehicle.updateOne({_id:req.params.vehicle},{$set:cleanObject(req.body)}).then((result)=>{
        res.send(result);
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    })
});


module.exports = router;
