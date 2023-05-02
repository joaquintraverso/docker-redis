let express = require('express');
let cors = require('cors');
let redisClient = require('./redis/connect');
let characterRoute = require('./characters/character.route');
let episodeRoute = require('./episodes/episodes.route');

//express
let app = express()

app.use(cors())
app.use(express.json());


//redis
redisClient.connect()

redisClient.on('connect', function(){
    console.log("Connected to redis")
})

redisClient.on("ready", () => {
    console.log("Connected!")
});
  
redisClient.on("error", (err) => {
    console.log("Error in the Connection")
});


//routes
app.use(characterRoute)
app.use(episodeRoute)

app.listen(4000, function(){
    console.log('Listening on port 4000!')
})

// (async () => {
//     redisClient.set('master', 'yoda')
//     redisClient.lPush('lista_key', ['yoda', 'darth vader', 'mando', 'obi-wan kenobi'])
    
//     const value = await redisClient.get("master")
//     console.log(value)

//     const result = await redisClient.lRange('lista_key', 0, -1)
//     console.log(result)
// })()

