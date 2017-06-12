var net = require('net');
var pipe = new net.Socket({ fd: 3, writeable: true, readable: true });
var cosf = require('cosf');

var share = (function(){
  var lastKnown = {};
  var sharePipe = new net.Socket({fd: 4, writeable: true, readable: true});

  return {
    load: function(callback){
      sharePipe.on('data', function(data){
        data = cosf.decode(data.toString());
        lastKnown = data;
        callback(data);
      });
      sharePipe.write('get');
    },
    save: function(data){
      var send = cosf.encode(data);
      sharePipe.write(send.toString());
      console.log('sent', send);
      lastKnown = data;
    }
  };
})();


eval('var task = '+process.argv[2]);
var inputs = cosf.decode(process.argv[3]);


function end(result){
  var send = cosf.encode({r: result});
  pipe.write(send);

  process.exit();
}



pipe.on('data', function(data){
  if (data.toString().toLowerCase() === "async"){
    task.apply({}, inputs);
  }else{
    end(task.apply({}, inputs));
  }
});
