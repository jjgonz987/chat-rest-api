var mysql = require('mysql');
let my_config = require('./config');

const pool  = mysql.createPool(my_config.myFunc1());

module.exports = pool;