const express = require('express');
const router = express.Router();
const users = require('./api/users');
const vehicles = require('./api/vehicles');

router.use('/users', users);
router.use('/vehicles', vehicles);

module.exports = router;