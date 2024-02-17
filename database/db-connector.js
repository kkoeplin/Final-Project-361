// Citation for the following functions:
// Adapted from Oregon State University CS340: Node.JS starter guide
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get an instance of mysql we can use in the app
const mysql = require('mysql')

var pool = mysql.createPool({
  connectionLimit : 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs361_koeplink',
  password: 'blznk3Nr2lPm',
  database: 'cs361_koeplink',
});

// Export it for use in our applicaiton
module.exports.pool = pool;
