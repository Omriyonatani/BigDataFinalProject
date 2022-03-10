var mysql = require('mysql');
const express = require('express');
// const res = require('express/lib/response');
const app = express();
// var server = require('http').createServer(app);
// const io = require("socket.io")(server);
// var answer = RowDataPacket();


  
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "R0546379423m",
    database: 'bigdatadb'
});
 con.query(`SELECT * FROM customers`, function (err, result) {
    if (err) {
      throw err;
    }
    // myData=result;
    // console.log(result);

  });
  // console.log(myData);

//   con.query(`UPDATE customers SET previouscalls = previouscalls + 1 WHERE ${phoneNumber}`, function(err, result) {
//     if(err){
//         throw err;
//     }         
// });


 


// myData = getData();
// console.log(myData);
// module.exports.getData = getData;



// we need to make "message" to be global- to use in line 36 (con.connect)
// we need to normalized the table (NF3)
// io.on("connection",(socket) => {
//   socket.emit('result',{ result });
//   console.log(result);
// })