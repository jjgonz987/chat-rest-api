

const express = require('express');
const bodyParser = require('body-parser');
//const routes = require('./routes/routes');

let app = express();

let socket_server = require("http").createServer();
let io = require("socket.io")(socket_server);

var socketClientsArray = [];





app.use(bodyParser.json());
//app.use("/",routes);
app.use('/api', require('./routes/users.js'));


io.on('connection', function(){ 
    console.log('a user connected');
    io.emit('test', { 'Hello': 'World' });
});
socket_server.listen(8080);
app.listen(3000 , () => console.log("server is on!"));






