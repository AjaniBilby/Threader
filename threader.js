var spawn = require('child_process').spawn;
var cosf = require('cosf');
var threader = {};

threader.task = function(task, callback, async){
  var long = arguments[2];

  return function(){
    threader.dispatch(task, callback, Array.from(arguments), long);
  };
};

threader.dispatch = function(task, callback, values, long){
  var child = spawn(process.execPath, [__dirname+'/task.js', task.toString(), cosf.encode(values)], {
    stdio: ['pipe', 'inherit', 'inherit', 'pipe']
  });

  child.stdio[3].on('data', function(data){
    data = cosf.decode(data.toString());

    callback(data.r);
  });

  if (long === true){
    child.stdio[3].write('async');
  }else{
    child.stdio[3].write('sync');
  }
};

module.exports = threader;
