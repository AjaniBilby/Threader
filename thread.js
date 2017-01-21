var net = require('net');
var pipe = new net.Socket({ fd: 3 });

console.log('Logging works');

pipe.write('I piped a thing');

//setInterval(function () {}, 1000);
