// User.js

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


// Define collection and schema for Users

var User = {
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: {type:[{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    expiration: {
      type: Date,
      required: true
    }
  }], default: []}
}
var UserSchema = new Schema(User);

// Automate the task of removing password and tokens when getting all values of users, even when editing user object.

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  var selected_fields = Object.getOwnPropertyNames(User).filter((value, index, array)=>{
    return ['password','tokens'].indexOf(value)<0;
  })
  selected_fields.push('_id')

  return _.pick(userObject, selected_fields);
};



UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
    try {
      // NOTICE
      decoded = jwt.verify(token, 'abc123');
    } catch (e) {
      return Promise.reject();
    }
    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token
    });
};

UserSchema.statics.findByFbToken = function (token) {
  var User = this;
  return User.findOne({
    'tokens.token': token
  });
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  // NOTICE
  var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
  user.tokens.push({ access, token });
  return user.save().then((user) => {
    return token;
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
      bcrypt.hash(user.password, 10, (err, hash) => {
        if(err)
          console.log(err);
        user.password = hash;
        next();
      });
  } else {
    next();
  }
});

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({ email }).then((user) => {
    if (!user) {
      console.log('no user')
      return Promise.reject();
    }
    // console.log('found user');7
    // console.log(user);
    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else if (err) {
          reject();
        }
      });
    });
  });
};

module.exports = mongoose.model('User', UserSchema);