var mysql = require('mysql');
const express = require('express');
const app = express();

// MySQL

// Connect to MySQL data base
function connect(){
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "PASSWORD",
    database: 'bigdatadb'
  });
  return con;
}

// Connect the to MySQL DB and make an async call to pull the values of the MySQL DB
function pullFromDB(){
 var con= connect();
  return new Promise(res => {
    con.query(`SELECT * FROM customers`, function (err, result) {
      if (err) {
        throw err;
      }
      res(result);
    })
  });
}

// The async call function
async function asyncCall(){
  const result = await pullFromDB();
  return result;
}

function updateDB(data){
 var con= connect();
  var phoneNumber = data.phoneNumber; // Primary key
  con.query(`UPDATE customers SET 
              previouscalls = previouscalls + 1,
              address = '${data.city}',
              topic = '${data.topic}' 
              WHERE phoneNumber= ${phoneNumber} `, function(err, result) {
    if(err){
        throw err;
    }
    console.log("Database is updated...");
  });
}
  
module.exports.updateDB=updateDB;
module.exports.asyncCall = asyncCall;