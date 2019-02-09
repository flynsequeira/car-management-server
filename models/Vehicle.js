// Car.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// Define collection and schema for Vehicles
let VehicleSchema = new Schema({
  make: {
    type: String
  },
  model: {
    type: String
  },
  model_year: {
        type: Number,
  },
  mileage: {
    type: Number
  },
  chassis_no: {
    type: String
  },
  colour: {
    type: String
  },
  purchased_year: {
    type: Number
  },
  purchased_type: {
    type: String
  },
  document_expired_at: {
    type: Date
  },
  last_update: {
    type: Date, default: Date.now
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