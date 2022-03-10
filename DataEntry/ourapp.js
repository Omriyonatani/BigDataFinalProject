const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server);
const port = 3000

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//----------------------------------------

// var res= mysql.getData();
// var resultArray = Object.values(JSON.parse(JSON.stringify(res)))

// console.log(res);

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => res.render('sender'));



//------------ Socket.io ----------------
io.on("connection", (socket) => {
    console.log("new user connected");
    socket.on("totalWaitingCalls", (msg) => { console.log(msg.totalWaiting) });
    socket.on("callDetails", (msg) => { console.log(msg)/*kafka.publish(msg)*/ });
});



server.listen(port, () => console.log(`Ariel app listening at http://localhost:${port}`));


