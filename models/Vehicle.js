// Car.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
const User = require('./User');



// Define collection and schema for Vehicles
let VehicleSchema = new Schema({
  make: {
    type: String
  },
  model: {
    type: String
  },
  model_year: {
        type: Date,
  },
  mileage: {
    type: String
  },
  chassis_no: {
    type: String
  },
  colour: {
    type: String
  },
  purchased_year: {
    type: String
  },
  purchased_type: {
    type: Date
  },
  document_expired_at: {
    type: Date
  },
  date: {
    type: Date
  },
  _user: {
    type: ObjectId,
    ref: 'User'
  }
}, { collection: 'vehicles' });

// For Adding a Vehicle
VehicleSchema.statics.addVehicle = function (vehicle, user) {
  var Vehicle = this;
  var vehicle = new Vehicle(vehicle);
  vehicle['_user']=user;
  return new Promise((resolve, reject)=>{
    vehicle.save().then((result)=>{
      if(result){
        resolve(result);
      } else {
        resolve(null);
      }
    }).catch((e)=>{
      reject(e);
    })
  })
};

module.exports = mongoose.model('Vehicle', VehicleSchema);