const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server);
const mysql = require("./db_connection");
const port = 3001
const bodyParser = require('body-parser');
const kafka = require("../kafka/PublishToKafka/publish");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static("public"));


// Pull the values from the DB
const myDB = mysql.asyncCall();

myDB.then(function(result) {
    result=JSON.parse(JSON.stringify(result));
    app.get('/', function(req, res) {
        res.render('Sender', { data: result});
    });
});

// Socket IO connection
io.on("connection", (socket) => {
    console.log("new user connected");
    socket.on("callDetails", (msg) => {
        // mysql.updateDB(msg); 
        kafka.publish(msg);
    });
});

server.listen(process.env.PORT || port, () => console.log(`Call Center app listening at http://localhost:${port}`));
