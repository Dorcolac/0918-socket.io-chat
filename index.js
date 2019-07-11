var express = require('express');
var socket = require('socket.io');
var app = express();
var server = app.listen(3000, function() {
    console.log('Server is running on port 3000');
})
var io = socket(server);


app.use(express.static("public"));

io.on('connection', function (socket) {
    socket.on('userJoined', function(data) {
        io.sockets.emit('newUser', data)
    })
    socket.on('globalMessage', function(data) {
        io.sockets.emit('userText', data)
    })
    socket.on('disconnect', function() {
        console.log(socket, 'user has disconnected');
    })
    socket.on('typing', function(data) {
        socket.broadcast.emit('writing', data)
    })
})