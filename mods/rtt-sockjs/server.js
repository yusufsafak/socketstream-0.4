"use strict";

/*!
 * SockJS Realtime Transport - Server
 * Copyright(c) 2013 Owen Barnes <owen@socketstream.org>
 * MIT Licensed
 */

var http = require('http');
var sockjs = require('sockjs');

module.exports = function(options) {

  options.interface = options.interface || '0.0.0.0';

  var clients = {};

  return function(connection) {

    var ws = sockjs.createServer();

    ws.on('connection', function(socket) {

      clients[socket.id] = socket;

      connection.events.emit('client:connect', socket.id);

      socket.on('data', function(message) {

        var request = {
          message:    message,
          transport:  'sockjs',
          socketId:   socket.id,
          clientIp:   socket.remoteAddress,
          protocol:   socket.protocol
        };

        connection.process(request);

      });

      socket.on('close', function() {
        connection.events.emit('client:disconnect', socket.id);
        delete clients[socket.id];
      });

    });

    var server = http.createServer();
    ws.installHandlers(server, {prefix:'/rtt'});
    server.listen(options.port, options.interface);

    return {

      sendToSocketId: function(socketId, msg) {
        clients[socketId].write(msg);
      },

      broadcast: function(msg){
        for (var socketId in clients) {
          clients[socketId].write(msg);
        }
      }
    };

  };
};