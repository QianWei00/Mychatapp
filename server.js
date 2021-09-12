const express = require('express')
var bodyParser = require('body-parser')
const app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const socketio = require('socket.io')
var mongoose = require('mongoose')

const port = process.env.PORT || 3010

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var dbUrl = 'mongodb+srv://admin:18013@chatapp.p6l1l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

//var messages = [
//    {name: "John", message: "Hello from Sydney"}, 
//    {name: "Jane", message: "How are you"},
//   {name: "Rose", message: "Nice to see you"}
//]

app.get("/messages", (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
    
})

app.post("/messages", (req, res) => {
    var message = new Message(req.body)
    message.save((err)=> {
        if(err)
           sendStatus(500)
           console.log(req.body)
           //message.push(req.body)
           io.emit("message", req.body)
           res.sendStatus(200);


    })
    
})
io.on("connection",(socket)=> {
    console.log("user connected")
})

mongoose.connect(dbUrl, (err)=> {
    console.log('mongodb connection successful')
})

var server = app.listen(port, () => {
    console.log('Server is listening on port', port)
})
