// https://docs.redis.com/latest/rs/references/client_references/client_ioredis/
// https://thisdavej.com/guides/redis-node/
// https://helderesteves.com/the-crash-course-on-node-redis/
const express = require('express')
const app = express()
const port = 3000
const kafka = require("../kafka/ConsumeFromKafka/consume")
const redis = require('ioredis')

const conn = {
    port: 3002,
    host: "127.0.0.1",
    db: 0
};

const redisDb = new redis(conn);

// app.get('/', (req, res) => {
//   res.send('Web Server with redis db is up')
// })


const data = kafka.getDataFromeKafka();

data.then(function(result){
    result=JSON.parse(JSON.stringify(result));   
    
     var phoneNumber = result.phoneNumber;
    var city = result.city;
    var Period= result.Period;
    var gender= result.gender;
    var age= result.age;
    var prevCalls= result.prevCalls;
    var topic = result.topic
    var Product = result.Product;
    var totalTime = result.totalTime;
    redisDb.hmset(`user:${phoneNumber}` , "city"  ,city, "Period" ,Period, "gender" ,gender, "age" ,age, "prevCalls" ,prevCalls, "topic", topic, "Product",Product  );
    redisDb.hmget(phoneNumber);
}
)






/*
// app.get('/readx', (req, res) => {  
redisDb.get('x', (err, reply) => {
    if (err) throw err;
    console.log(reply);
    res.send(`value=${reply} `)
});
// })

// app.get('/writex', (req, res) => {  
redisDb.set('x',200 ,(err, reply) => {
    if (err) throw err;
    console.log(reply);
    res.send(`value=${reply} `)
});
// })

// app.get('/writelist', (req, res) => {  
redisDb.lpush('values',["one","two","tree"] ,(err, reply) => {
    if (err) throw err;
    console.log(reply);
    // res.send(`value=${reply} `)
});
// })
redisDb.hset()
// app.get('/readlist', (req, res) => {  
redisDb.lrange('values',0,-1 ,(err, reply) => {
    if (err) throw err;
    console.log(reply);
    // res.json(reply)
});
// })



*/
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})