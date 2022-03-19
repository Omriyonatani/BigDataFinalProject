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

// Connect to redis
const redisDb = new redis(conn);

// app.get('/', (req, res) => {
//   res.send('Web Server with redis db is up')
// })


const data = kafka.getDataFromeKafka();

data.then(function(result){
    result=JSON.parse(JSON.stringify(result));   
    const customer = {
            city : `${result[2].city}`,
            Period : `${result[3].Period}`,
            gender : `${result[4].gender}`,
            age: `${result[5].age}`,
            prevCalls : `${result[6].prevCalls}`,
            topic : `${result[7].topic}`,
            Product : `${result[8].Product}`,
            totalTime : `${result[9].totalTime}`
    };
    var key = `0${result.phoneNumber}`;
    console.log(result);
    console.log("~~~~~~~ between result and customer ~~~~~~~~~~");
    console.log(customer);
    redisDb.hmset(key,customer);
});

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