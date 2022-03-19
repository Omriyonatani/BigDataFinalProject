var mysql = require('mysql');
const express = require('express');
// const res = require('express/lib/response');
const app = express();
// var server = require('http').createServer(app);
// const io = require("socket.io")(server);


  // Connect to the data base and make an async call to the values of the db
  function pullFromDB(){
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "R0546379423m",
      database: 'bigdatadb'
    });
    return new Promise(
      res => {
    con.query(`SELECT * FROM customers`, function (err, result) {
      if (err) {
        throw err;
      }
      res(result);
    })});
  }

  // The async call function
  async function asyncCall(){
    console.log('async turned on');
    const result = await pullFromDB();
    // console.log(result);
    return result;
  }
  function updateDB(data){

    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "13121994",
      database: 'bigdatadb'
    });
    /** subscriptions, period, age, previouscalls, topic */
    var phoneNumber = data.phoneNumber;
    // need to fined a way to update the product in the database~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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

  

 

