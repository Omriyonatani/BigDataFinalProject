const express = require('express')
const app = express();
const socketIO = require('socket.io');
const redisSub = require('../Redis/redissub')
const redisPub = require('../Redis/redispub');
const Mongo= require('../MongoDB/MongoDB')
const BigML= require('../bigML/bml');
const port=3000;

app.use(express.static('public'))
app.set('view engine', 'ejs')
redisPub;


// Function that sending the data to dashboard
function updateNewData(){
  // taking the data from redis
  var dataFromRedis= redisSub.getData();
  dataFromRedis.then(res => {
    var data = JSON.parse(res);
    var data_length = 0;
    var totalTime=0 ;
    var totalCalls =[];
    var topicsCount= countCallsTopics(data)
    var waitingTime =0;

    // going over the data and calculating the average waiting time in the last 10 mins
    for (let index = 0; index < data.length; index++) {
      waitingTime += parseFloat(data[index].totalTime);
      if((parseInt(Date.now()) - parseInt(data[index].id)) < 600000 ) { // Calculate the calls average time at the last 10 mins 
        totalTime += parseFloat( data[index].totalTime); 
        data_length+=1;
      }else{
        totalTime += 0;
        data_length = 1;
      }
      // Searching for total waitning calls and update if there is some lower totalCalls value
      totalCalls.push(parseInt( data[index].totalCalls))
      
    
    }

    // Validation for 0, not to divide by 0..
    if (totalTime != 0 ) {
      var averageTime = (totalTime / data_length).toFixed(2);
    } else {
      var averageTime = 0;
    }
    
    var waitingCallsLast10min = {
      cardId:"average waiting time",
      value: averageTime
    }

    if (totalCalls == []) {
      totalCalls=0;
    }     

    var totalWaitingCalls = {
      cardId:"number of waiting calls",
      value: Math.min(...totalCalls).toString()
    }

    var CallsTopicsCount = {
      cardId:"calls topics count",
      value: topicsCount
    }

    waitingTime=waitingTime.toFixed(3);
    var waitingTimeSum = {
      cardId:"waiting time sum",
      value: waitingTime
    }

    // Updating new data by using socket.io
    io.emit('average waiting time', waitingCallsLast10min);
    io.emit('totalWaitingCalls', totalWaitingCalls);
    io.emit('calls topics',CallsTopicsCount);
    io.emit('waiting time',waitingTimeSum);
  });
  setTimeout(updateNewData,1000);
}

// Function that calculate the sum of the topics
function countCallsTopics(data){
  var join=0,disconnect=0,service=0,report=0;
  for (let index = 0; index < data.length; index++) {
    switch (data[index].topic) {
      case 'disconnect':
        disconnect+=1;
        break;
      case 'service':
        service+=1;
        break;
      case 'report':
        report+=1;
        break;
      case 'join':
        join+=1;
        break;
    }
  }
  return [join,disconnect,service,report]
}

// Begin
app.get('/', (req, res) => {
  updateNewData();
  var data = {
    cards: [
      {cardId:"average waiting time", title: "זמן המתנה ממוצע", value:"0", unit: "", fotterIcon: "timer", fotterText: "", icon: "access_alarm",color:"warning" },
      {cardId:"number of waiting calls", title: "מספר שיחות ממתינות", value: "", unit: "", fotterIcon: "", fotterText: "", icon: "call",color:"success" },
      {cardId:"time", title: "שעה ", value: "", unit: "", fotterIcon: "", fotterText: "שעה ותאריך", icon: "access_time_rounded",color:"info" },
    ]
  }
  res.render("pages/dashboard", data)
})

// Changing the page to "Table list"
app.get('/tables',(req, res) => {
  updateNewData();
  res.render("pages/tables")
})

// Changing the page to "Predictions"
app.get('/predictionBml',(req, res) => {
  updateNewData();
  res.render("pages/predictionBml")
})


// Creating server and open a web socket.
const server = express()
  .use(app)
  .listen(3000, () => console.log(`Listening Socket on http://localhost:3000`));
const io = socketIO(server);

// Connection, and make a changes in events.. 
io.on('connection', (socket) => {
  // socket.on('new model',(model)=>{
  //   console.log(model);
  //   BigML.generateNewModel();
  // })
  socket.on('Get Prediction',  (inputData)=>{
    Mongo.exportToCsv();

    // console.log(inputData)

     BigML.GetPred(inputData.city,inputData.gender,inputData.age,inputData.prevCalls,inputData.Product).then(res=>{
      // console.log(res)
      socket.emit('prediction Topic',res)
    });
  });

  socket.on("delete", (Flush)=>{
    redisSub.flushAll();
  });
});