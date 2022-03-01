var mysql = require('mysql');
const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server);


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "13121994",
  database: 'bigdatadb'
});


// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE bigDataDB", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var sql = 'SELECT * FROM customers WHERE phoneNumber = 0502211864';
//   con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("HTML page loaded");
//   });
// });



var obj = {};
router.get('/data', function(req, res){

    connection.query('SELECT * FROM customers', function(err, result) {
        if(err){
            throw err;
        } else {
            obj = {print: result};
            res.render('print', obj);                
        }
    });
});


// we need to make "message" to be global- to use in line 36 (con.connect)
// we need to normalized the table (NF3)
io.on("connection",(socket) => {
  socket.emit('result',{ result });
  console.log(result);
})




// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var sql = "CREATE TABLE customers (phoneNumber INT PRIMARY KEY, id INT, customerName VARCHAR(255), birthday VARCHAR(255), address VARCHAR(255), gender VARCHAR(255), subscriptions VARCHAR(255), period VARCHAR(255), age VARCHAR(255), previouscalls VARCHAR(255), topic VARCHAR(255))";
//   // sql = `INSERT INTO customers (id, customerName, birthday, address, gender, subscriptions, period, age, previouscalls, topic, product) VALUES (${message.get(id)},Anonimously, 1.1.90,${message.get(city)},${message.get(gender)},subsc, period, callTime, age, previouscalls, ,${message.get(topic)})`;
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   });
// });