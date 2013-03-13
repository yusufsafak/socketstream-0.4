// SocketStream 0.4 Entry file

var SocketStream = require('socketstream-client');

var app = new SocketStream();

// As Browserify2 can only read real files, we now auto-generated by this 'system' module
// on each page load (temporarily of course - this will all be cached in the future)
//
// Not yet sure if this is a good solution. I certainly think this module shouldn't live
// in your app directory! On the plus side, it makes it very easy for you, the developer,
// to see *exactly* what's being sent to the client
require('./system')(app);

app.connect();

// Aliases to aid development
window.app = app;
window.ss = app.services.api;

app.status.on('open', function(){
  console.log('Connected to the server!');

  // Load your first app module
  require('./chat');
});
