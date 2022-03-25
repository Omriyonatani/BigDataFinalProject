// https://docs.redis.com/latest/rs/references/client_references/client_ioredis/
// https://thisdavej.com/guides/redis-node/
// https://helderesteves.com/the-crash-course-on-node-redis/
const kafka = require("../kafka/ConsumeFromKafka/consume")
const redis = require('ioredis')

// Adapter between Kafka and Redis 

const conn = {
    port: 3002,
    host: "127.0.0.1",
    db: 0
};

// Connect to redis
const redisDb = new redis(conn);

// Function that read data from redis to dashboard
async function FromRedisToDashboard(){
    // pull keys from redis with "Scan" command.
    redisNowData = await redisDb.scan(0);
    // return the values (that are the Database's keys)
    return redisNowData[1];
}

// Function that write data from kafka to redis
function FromKafkaToRedis(result){
    // parse the result from "ToString" to JSON. 
    result = JSON.parse(result);
    var key = `0${result["phoneNumber"]}`;    
    // console.log(key);
    redisDb.hmset(key,result);
}

module.exports.FromKafkaToRedis= FromKafkaToRedis;
module.exports.FromRedisToDashboard= FromRedisToDashboard;


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


// app.get('/', (req, res) => {
//   res.send('Web Server with redis db is up')
// })


*/