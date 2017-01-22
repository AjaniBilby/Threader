var spawn = require('child_process').spawn;

if (process.argv[2] == "child"){

  var net = require('net');
  var pipe = new net.Socket({fd: 3});

  pipe.on('data', function(data){
    console.log(data.toString());
  });

  var i=0;
  pipe.write('SENT FROM THREAD '+i);

  //Keep alive
  setInterval(function () {
    i++;
    pipe.write('SENT FROM THREAD '+i);
  }, 1000);
}else{
  var child = spawn(process.execPath, [__filename, 'child'], {
    stdio: [null, null, null, 'pipe']
  });
  child.stdio[3].on('data', function(data){
    console.log(data.toString());
  });

  setTimeout(function () {
    child.stdio[3].write('Sent from main');
  }, 10);
}

//Keep alive
setInterval(function () {}, 1000);
