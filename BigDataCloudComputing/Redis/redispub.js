const express = require('express')
const app = express()
const RedisAdapter = require('../Redis/redisRWAdapter')
const redis = require('ioredis');

// From redis to Dashboard

const conn = {
    port: 3002,
    host: "127.0.0.1",
    db: 0
};
const redisDb = new redis(conn);
const channel = 'messages'


 function readCallback(){
    RedisAdapter.FromRedisToDashboard().then(res=>{
        // check if the data is changed
        let dataForPublish = JSON.stringify(res);
        redisDb.publish(channel, dataForPublish );
        console.log(dataForPublish);
        setTimeout(readCallback, 5000);
        
    });
}
   

readCallback();

/*
// We pulled the data from Redis, to publish it to the subscribers message channels
RedisAdapter.FromRedisToDashboard().then(result => {
    for (let index = 0; index < result.length; index++) {
            const element = result[index];
            // console.log(element);
            redisDb.hgetall(element).then(dataForPublish => {
                dataForPublish = JSON.stringify(dataForPublish);
                redisDb.publish(channel, dataForPublish);
                // console.log(dataForPublish);
            });
        }
    }
);
*/