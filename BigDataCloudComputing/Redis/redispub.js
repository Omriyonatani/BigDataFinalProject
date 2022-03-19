const express = require('express')
const app = express()
const redis = require('../Redis/redisreadwrite')
const port = 3003



// const redis = new Redis(conn);

// const channel = 'messages'

// app.get('/', (req, res) => {
//   res.send('Web Server with redis publisher is up')
// })

const redisReadWrite = redis.redisReadWrite();

  
 

// app.get('/stop', (req, res) => {
//   redis.publish(channel, 'stopped');
//   res.send('Stoping message wes sent')
// })

// app.listen(port, () => {
//   console.log(`publisher is listening at http://localhost:${port}`)
// })