const express = require('express')
const app = express();
const socketIO = require('socket.io');
const redisSub = require('../Redis/redissub')
const redisPub = require('../Redis/redispub');
const Mongo= require('../MongoDB/MongoDB')
const BigML= require('../bigML/bml');



redisPub;
const port=3000;

app.use(express.static('public'))

app.set('view engine', 'ejs')



function updateWaitingCalls(){
    var dataFromRedis= redisSub.getData();
    dataFromRedis.then( res =>{
      var data = JSON.parse(res);
      var data_length = 0;
      var totalTime=0 ;
      var totalCalls = Infinity;
      var topicsCount= countCallsTopics(data)
      var waitingTime =0;
      // console.log(data);
      //going over the data and calculating the average waiting time in the last 10 min'
      for (let index = 0; index < data.length; index++) {
        waitingTime += parseFloat( data[index].totalTime);
        if ((parseInt(Date.now()) - parseInt(data[index].id)) < 600000 ) {
          totalTime += parseFloat( data[index].totalTime); 
          data_length+=1;
        }else{
          totalTime += 0;
          data_length = 1;
        }

        //searching for the total waitning calls and update if there is some lower totalCalls value
        for (let i = 0; i < data.length; i++) {
          if(totalCalls > data[i].totalCalls){
            totalCalls=data[i].totalCalls;
          }
        }

        
      }
      if (totalTime != 0 ) {
        var averageTime = (totalTime / data_length).toFixed(2);
      } else {
        var averageTime = 0;
      }
      
      var waitingCallsLast10min = {
        cardId:"average waiting time",
        value: averageTime
      }
      if (totalCalls == Infinity) {
           totalCalls=0;
      }     

      var totalWaitingCalls = {
        cardId:"number of waiting calls",
        value: totalCalls
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

      //updating new data by using socket.io
      io.emit('average waiting time', waitingCallsLast10min);
      io.emit('totalWaitingCalls', totalWaitingCalls);
      io.emit('calls topics',CallsTopicsCount);
      io.emit('waiting time',waitingTimeSum);
      });
      // 5 min update 
    setTimeout(updateWaitingCalls,1000);
}

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


app.get('/', (req, res) => {
  updateWaitingCalls();
  var data = {
    cards: [
      {cardId:"average waiting time", title: "זמן המתנה ממוצע", value:"0", unit: "", fotterIcon: "timer", fotterText: "", icon: "access_alarm",color:"warning" },
      {cardId:"number of waiting calls", title: "מספר שיחות ממתינות", value: "", unit: "", fotterIcon: "", fotterText: "...", icon: "call",color:"success" },
      {cardId:"time", title: "שעה ", value: "", unit: "", fotterIcon: "", fotterText: "שעה ותאריך", icon: "access_time_rounded",color:"info" },
    ]
  }
  res.render("pages/dashboard", data)
})
app.get('/tables',(req, res) => {
  updateWaitingCalls();
  res.render("pages/tables")
 

})

app.get('/predictionBml',(req, res) => {
  updateWaitingCalls();
  res.render("pages/predictionBml")
 

})

const server = express()
  .use(app)
  .listen(3000, () => console.log(`Listening Socket on http://localhost:3000`));
const io = socketIO(server);


//------------
io.on('connection', (socket) => {  
  // socket.on('newdata', (msg) => {
  //   console.log(msg);
  //   io.emit('newdata', msg);
  // });
  // socket.on('new model',(model)=>{
  //   console.log(model);
  //   BigML.generateNewModel();
  // })
  socket.on('Get Prediction', async (inputData)=>{
    Mongo.exportToCsv();
   await BigML.predictTopic(inputData).then(res=>{
      io.emit('prediction Topic',res)
    });

  });
  socket.on("delete", (Flush)=>{
  
    redisSub.flushAll();
  });
  
});



//-----------

