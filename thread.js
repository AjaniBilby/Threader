var net = require('net');
var pipe = new net.Socket({ fd: 3 });
var typing = require('./typing.js');

pipe.on('data', function(chunk){
  chunk = chunk.toString();

  if (chunk.indexOf('Task') === 0){
    chunk = chunk.substr(4);
    var request = JSON.parse(chunk);


    request.inputs = typing.STF(request.inputs);
    var string = "";
    for (let i in request.inputs){
      if (i != '0'){
        string += ', ';
      }

      if (typeof(request.inputs[i]) == "string"){
        string += '"' + request.inputs[i] + '"';
      }else{
        string += request.inputs[i];
      }
    }

    eval('var task = '+request.task);
    var response = eval("task("+string+")");

    var output = {
      value: typing.FTS(response)
    };

    pipe.write('Response' + JSON.stringify(output));
  }else if (chunk.indexOf('Ping')){
    pipe.write(chunk+'-'+Date.now());
  }
});
