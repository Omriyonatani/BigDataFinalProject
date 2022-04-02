const express = require('express')
const app = express();
const socketIO = require('socket.io');
const redisSub = require('../Redis/redissub')
const port=3000;

app.use(express.static('public'))

app.set('view engine', 'ejs')

function updateWaitingCalls(){
    var dataFromRedis= redisSub.getData();
    dataFromRedis.then( res =>{
      var data = JSON.parse(res);
      
      var totalTime=0 ;
      var totalCalls = data[data.length-1].totalCalls;
      console.log(data);

      for (let index = 0; index < data.length; index++) {
        totalTime += parseFloat( data[index].totalTime);   
      }
      // console.log(totalTime);
      if (totalTime != 0 ) {
        var averageTime = (totalTime / data.length).toFixed(2);
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

      io.emit('waitingCalls', waitingCallsLast10min);
      io.emit('totalWaitingCalls', totalWaitingCalls)
      });
    setTimeout(updateWaitingCalls,1000);
}


app.get('/', (req, res) => {
  updateWaitingCalls();
  var data = {
    cards: [
      {districtId:"average waiting time", title: "זמן המתנה ממוצע", value:"0", unit: "", fotterIcon: "timer", fotterText: "", icon: "access_alarm" },
      {districtId:"number of waiting calls", title: "מספר שיחות ממתינות", value: "", unit: "שיחות", fotterIcon: "", fotterText: "...", icon: "call" },

      {districtId:"central", title: "מרכז", value: 3500, unit: "חבילות", fotterIcon: "", fotterText: "נפח ממוצע", icon: "info_outline" },
      {districtId:"Erase", title: "Erase todays data", value: 0, unit: "Flush all", fotterIcon: "", fotterText: "מחק הכל ", icon: "add_shopping_cart" }
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
  })
});
//-----------

