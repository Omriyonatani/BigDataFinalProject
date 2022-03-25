const express = require('express')
const app = express()
const RedisAdapter = require('../Redis/redisRWAdapter')
const redis = require('ioredis');
const { redisSUB } = require('./redissub');
// From redis to Dashboard

const conn = {
    port: 3002,
    host: "127.0.0.1",
    db: 0
};
const redisDb = new redis(conn);
const channel = 'messages'

// We pulled the data from Redis, to publish it to the subscribers message channels
redisNowData = RedisAdapter.FromRedisToDashboard().then(result => {
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            console.log(element);
            finalResult = redisDb.hgetall(element).then(dataForPublish => {
                dataForPublish = JSON.stringify(dataForPublish);
                redisDb.publish(channel, dataForPublish);
                console.log(dataForPublish);
            });
        }
    }
);