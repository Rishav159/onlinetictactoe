var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.use(require('express').static(__dirname));
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('nextmove', function(msg){
    socket.broadcast.emit('nextmove', msg);
  });
  socket.on('newgame' , function(playername){
    socket.broadcast.emit('newgame',playername);
  });
  socket.on('getnewgame' , function(){
    socket.broadcast.emit('getnewgame');
  });
  socket.on('gamereset' , function(){
    socket.broadcast.emit('gamereset');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
