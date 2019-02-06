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

function extendObj (oldObj, addObj){
    for (var key in addObj) {
        if (addObj.hasOwnProperty(key)) {
            oldObj[key]=addObj[key];
        }
    }
    return oldObj;
}

// Get all Vehicles under the a particular advisers particular user
router.get('/:vehicle', authenticate, (req, res) => {
    Vehicle.findById(req.param.vehicle).then((vehicle)=>{
        res.send(vehicle);
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    })
});

// Get all vehicles under a user
router.get('', authenticate, (req, res) => {
    Vehicle.find({}).then((output) => {
        res.send(output);
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    })
});

// Get all Vehicles under the a particular advisers particular user
router.post('/:vehicle', authenticate, (req, res) => {
    Vehicle.updateOne({_id:req.param.vehicle},{$set:cleanObject(req.body)}).then((result)=>{
        res.send(result);
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    })
});

// Add or edit a vehicle
router.post('/save', authenticate, (req, res) => {
    var body = _.pick(req.body, ['make', 'model', 'model_year', 'mileage', 'chassis_no', 'colour', 'purchased_year', 'purchased_type', 'document_expired_at']);
    Vehicle.addVehicle(body, req.user._id).then((res)=>{
        res.send(output);
    }).catch((e)=>{
        res.status(400).send(e);
    })
});

module.exports = router;
