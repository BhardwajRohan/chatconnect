const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 8080;
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



const users = [];

io.on('connection', (socket) =>{
    socket.on('new-user-joined', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);

    })

   socket.on('send', (message ) => {
       socket.broadcast.emit('receive', {message : message, name : users[socket.id]});;
   })

   socket.on('disconnect', reason => {
        socket.broadcast.emit('left', {name : users[socket.id]})
        delete users[socket.id];
   })

})




server.listen(PORT, () => {
  console.log('Chat Server running on port : 8080');
});