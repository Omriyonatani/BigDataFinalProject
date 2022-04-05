const express = require('express')
const app = express();
const socketIO = require('socket.io');
const redisSub = require('../Redis/redissub')
const redisPub = require('../Redis/redispub')



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
      // console.log(data);
      //going over the data and calculating the average waiting time in the last 10 min'
      for (let index = 0; index < data.length; index++) {
        // console.log((parseInt(Date.now()) - parseInt(data[index].id)));
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
        districtId:"average waiting time",
        value: averageTime
      }

      var totalWaitingCalls = {
        districtId:"number of waiting calls",
        value: totalCalls
      }

      // console.log(data.length);
      // console.log(waitingCalls.value);
     
      //updating new data by using socket.io
      io.emit('waitingCalls', waitingCallsLast10min);
      io.emit('totalWaitingCalls', totalWaitingCalls);
      });
      // 5 min update 
    setTimeout(updateWaitingCalls,1000);
}



app.get('/', (req, res) => {
  updateWaitingCalls();
  var data = {
    cards: [
      {districtId:"average waiting time", title: "זמן המתנה ממוצע", value:"0", unit: "", fotterIcon: "timer", fotterText: "", icon: "access_alarm" },
      {districtId:"number of waiting calls", title: "מספר שיחות ממתינות", value: "", unit: "שיחות", fotterIcon: "", fotterText: "...", icon: "call" },
      {districtId:"time", title: "שעה ", value: "", unit: "", fotterIcon: "", fotterText: "שעה ותאריך", icon: "access_time_rounded" },
      // {districtId:"Erase", title: "Erase todays data", value: 0, unit: "Flush all", fotterIcon: "", fotterText: "מחק הכל ", icon: "add_shopping_cart" }
    ]
  }
  res.render("pages/dashboard", data)
})

// app.get('/setData/:districtId/:value', function (req, res) {
//   io.emit('newdata',{districtId:req.params.districtId,value:req.params.value})
//   res.send(req.params.value)
// })


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
  socket.on("delete", (Flush)=>{
    redisSub.flushAll();
  });
  
});
//-----------

