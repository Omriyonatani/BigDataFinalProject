// https://docs.redis.com/latest/rs/references/client_references/client_ioredis/
// https://thisdavej.com/guides/redis-node/
// https://helderesteves.com/the-crash-course-on-node-redis/
const kafka = require("../kafka/ConsumeFromKafka/consume")
const redis = require('ioredis')

kafka.consume();
// Adapter between Kafka and Redis 

const conn = {
    port: 3002,
    host: "127.0.0.1",
    db: 0
};

// Connect to redis
const redisDb = new redis(conn);


// Function that read data from redis  and publish it to channel "messages"
async function FromRedisToDashboard(){
    // pull keys from redis with "Scan" command.
   let redisNowData = await redisDb.scan(0);
   let data=[];
   let values = redisNowData[1];
  
//    console.log("start");
   for (let index = 0; index < values.length; index++){
   
        // console.log("data length =" +data.length );
        // console.log( `index = ${index}`);
        // console.log("values length =" + values.length);
        if(values.length >= data.length){
                let element = values[index];
                // console.log(element);
                await redisDb.hgetall(element).then(dataForPublish => { 
                     data.push(dataForPublish);
                    
            });
         }
         
    }
    // console.log("end")
    // console.log(`data ----\n ${JSON.stringify(data)}`);
    // return the values
    return data;
}





// Function that write data from kafka to redis
async function FromKafkaToRedis(result){
    // parse the result from "ToString" to JSON. 
    // console.log(`inserting ${result} to redis\n`);
    result = JSON.parse(result);
    var key = `0${result["phoneNumber"]}`;    
    // console.log(key);
    await redisDb.hmset(key,result);
}

module.exports.FromKafkaToRedis= FromKafkaToRedis;
module.exports.FromRedisToDashboard= FromRedisToDashboard;
module.exports.flushAll = ()=>{
    redisDb.flushdb("async");
    
}
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