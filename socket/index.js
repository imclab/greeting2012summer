
var socket = require('socket.io')
  , request = require('request');

module.exports = function(app) {
  var io = socket.listen(app)
    , clients = []
    , small = io.of('/screen/small')
    , large = io.of('/screen/large');

  io.configure(function() {
    // TODO:
  });
  
  app.on('twitterLogin', function(data) {
    request({ url: data.profile_image_url, encoding: 'binary' }, function(err, res, body) {
      io.sockets.emit('image', 'image/png', new Buffer(body, 'binary').toString('base64'));
      small.emit('image', 'image/png', new Buffer(body, 'binary').toString('base64'));
      large.emit('image', 'image/png', new Buffer(body, 'binary').toString('base64'));
    });
  });
  
  app.on('facebookLogin', function(data) {
    request({ url: 'http://graph.facebook.com/' + data.id + '/picture', encoding: 'binary' }, function(err, res, body) {
      io.sockets.emit('image', 'image/jpg', new Buffer(body, 'binary').toString('base64'));
      small.emit('image', 'image/jpg', new Buffer(body, 'binary').toString('base64'));
      large.emit('image', 'image/jpg', new Buffer(body, 'binary').toString('base64'));
    });
  });
  
  io.sockets.on('connection', function(client) {
    clients.push(client);
    
    client.broadcast.emit('createSpirit', client.id);
    
    client.on('disconnect', function() {
      client.broadcast.emit('removeSpirit', client.id);
    });
    
    client.on('moveSpirit', function(x, y) {
      client.broadcast.emit('moveSpirit', client.id, x, y);
    });
  });
    
  small.on('connection', function(client) {
    
  });

  large.on('connection', function(client) {
    
  });
  
  return io;
};