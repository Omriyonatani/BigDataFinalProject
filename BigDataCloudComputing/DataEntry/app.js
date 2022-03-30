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

//----------------------------------------


app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => res.render('sender'))

// Pull the values from the DB
const myDB = mysql.asyncCall();
myDB.then(function(result) {
    result=JSON.parse(JSON.stringify(result));
    // need to check if we can do it with socket ( io.emit() )
    app.get('/Views/Sender', function(req, res) {
        res.render('Sender', { data: result});
    });
});




//------------ Socket.io ----------------
io.on("connection", (socket) => {
    console.log("new user connected");
    socket.on("totalWaitingCalls", (msg) => { console.log(msg.totalWaiting) });
    socket.on("callDetails", (msg) => {
        // mysql.updateDB(msg); 
        console.log(msg);  
        kafka.publish(msg);});

    });




server.listen(port, () => console.log(`Ariel app listening at http://localhost:${port}/Views/Sender`));


