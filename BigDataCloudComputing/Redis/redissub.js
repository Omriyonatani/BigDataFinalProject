const Redis = require('ioredis');

function redisSUB(){
    const conn = {
        port: 3002,
        host: "127.0.0.1",
        db: 0
    };
    
    
    const redis = new Redis(conn);
    
    const channel = 'messages';
    
    redis.on('message', (channel, message) => {
        console.log(`Received the following message from ${channel}: ${message}`);
    });
    
    redis.subscribe(channel, (error, count) => {
        if (error) {
            throw new Error(error);
        }
    });
}
module.exports.redisSUB= redisSUB;
// const conn = {
//     port: 3002,
//     host: "127.0.0.1",
//     db: 0
// };


// const redis = new Redis(conn);

// const channel = 'messages';

// redis.on('message', (channel, message) => {
//     console.log(`Received the following message from ${channel}: ${message}`);
// });

// redis.subscribe(channel, (error, count) => {
//     if (error) {
//         throw new Error(error);
//     }
//     console.log(`Subscribed to ${count} channel. Listening for updates on the ${channel} channel.`);
// });