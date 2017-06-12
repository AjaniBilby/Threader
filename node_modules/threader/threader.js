var spawn = require('child_process').spawn;
var obj = require('object-manipulation');
var cosf = require('cosf');
var threader = {};

var share = {};

threader.task = function(task, callback, async){
  var long = arguments[2];

  return function(){
    threader.dispatch(task, callback, Array.from(arguments), long);
  };
};
threader.dispatch = function(task, callback, values, long){
  var child = spawn(process.execPath, [__dirname+'/task.js', task.toString(), cosf.encode(values)], {
    stdio: ['pipe', 'inherit', 'inherit', 'pipe', 'pipe']
  });

  //Listen for end
  child.stdio[3].on('data', function(data){
    data = cosf.decode(data.toString());

    callback(data.r);
  });

  //Access to share
  child.stdio[4].on('data', function(data){
    data = data.toString();
    console.log('received share', data);

    if (data !== 'get'){
      data = cosf.decode(data);
      share = obj.merg(share, obj, true);
    }
    child.stdio[4].write(cosf.encode(share));
  });
  child.stdio[4].write('ready');

  if (long === true){
    child.stdio[3].write('async');
  }else{
    child.stdio[3].write('sync');
  }
};
threader.share = share;

module.exports = threader;
