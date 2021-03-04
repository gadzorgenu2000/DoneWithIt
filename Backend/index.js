
require ('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const listingRoute = require('./routes/listing')
const userRoute = require('./routes/auth')

const app = express()

const db = process.env.Mongodb
console.log('db',db)

const hostname = "192.168.8.126";
const port = 9000

mongoose.connect(db, 
    {
    useNewUrlParser: true, 
    useUnifiedTopology:true, 
    useCreateIndex: true
    },
    ()=>{
    app.listen(port,hostname, () => {
        //also trying to log info
        console.info(`Server running at http://${hostname}:${port}/`);
    })
})
//middleware
app.use(express.json())

//routes
app.use(listingRoute)
app.use(userRoute)

// "start": "json-server -p 9000 -w db.json",