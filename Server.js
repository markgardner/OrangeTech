var express = require('express')
  , sioLib = require('socket.io')
  , present = null;

var io = sioLib.listen(express
  .createServer()
  .configure(function () {
    this.use(express.static(__dirname + '/public'));
  }).listen(3000, function () {
    var addr = this.address();
    console.log('   app listening on http://' + addr.address + ':' + addr.port);
  }));
io.set('log level', 0);

io.sockets.on('connection', function (socket) {
  if(present != null) {
    io.sockets.emit('present-connect', present);
  }

  socket.on('relay-present-connect', function(data) {
    io.sockets.emit('present-connect', present = data);
  });
  
  socket.on('relay-draw', function (isOn) {
    if(isOn) {
      io.sockets.emit('drawstart', true);
    } else {
      io.sockets.emit('drawend', true);
    }
  });
  socket.on('relay-drag', function (data) {
    io.sockets.emit('drag', data);
  });
  socket.on('relay-dragstart', function (data) {
    io.sockets.emit('dragstart', data);
  });
  socket.on('relay-dragend', function (data) {
    io.sockets.emit('dragend', data);
  });
  socket.on('relay-transformstart', function (data) {
    io.sockets.emit('transformstart', data);
  });
  socket.on('relay-transform', function (data) {
    io.sockets.emit('transform', data);
  });
  socket.on('relay-transformend', function (data) {
    io.sockets.emit('transformend', data);
  });
  socket.on('relay-hold', function (data) {
    io.sockets.emit('hold', data);
  });
  socket.on('relay-tap', function (data) {
    io.sockets.emit('tap', data);
  });
});
