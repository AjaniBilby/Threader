var net = require('net');
var pipe = new net.Socket({ fd: 3 });

console.log('Logging works');

pipe.on('data', function(chunk){
  console.log('RECEIVED CONENT THOUGH fd:3 in thread');
});

setTimeout(function () {
  pipe.write('I piped a thing');
}, 10);

//setInterval(function () {}, 1000);
