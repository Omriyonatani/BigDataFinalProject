var mysql = require('mysql');
const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server);


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "13121994"
});


// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE bigDataDB", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });



// we need to make "message" to be global- to use in line 36 (con.connect)

io.on("connection",(socket) => {
  socket.on("callDetails", (msg) => {
    var message = msg;
  })
})



con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE customers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), birthday VARCHAR(255), address VARCHAR(255), gender VARCHAR(255), subscriptions VARCHAR(255), period VARCHAR(255), time VARCHAR(255), age VARCHAR(255), previouscalls VARCHAR(255), topic VARCHAR(255), product VARCHAR(255))";
  sql = `INSERT INTO customers (id, name, birthday, address, gender, subscriptions, period, time, age, previouscalls, topic, product) VALUES (${message.get(id)},Anonimously, 1.1.90,${message.get(city)},${message.get(gender)},subsc, period, time, age, previouscalls, ,${message.get(topic)}, product)`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});