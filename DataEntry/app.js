const express = require('express');
const app = express();
var server = require('http').createServer(app);
var mysql = require('mysql');
const io = require("socket.io")(server);
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




//---------------------------------------- get the information from the "sender" 
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.get('/', (req, res) => res.render('sender'))



//------------ Socket.io ----------------
io.on("connection", (socket) => {
    console.log("new user connected");
    socket.on("totalWaitingCalls", (msg) => { console.log(msg.totalWaiting) /* send to Dashboard real-time */ });
    socket.on("callDetails", (msg) => { console.log(msg)
                                        kafka.publish(msg);
                                        db_connection.publish(msg);
                                    });
});



server.listen(port, () => console.log(`App listening at http://localhost:${port}`));