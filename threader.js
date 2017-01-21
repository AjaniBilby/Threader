var spawn = require('child_process').spawn;
var os = require('os');
function GetTypes(value){
  if (typeof(value) != "object"){
    return typeof(value);
  }

  var output = {};

  if ({}.toString.apply(value) === '[object Array]'){
    output = [];
  }

  for (let key in value){
    var type = typeof(value[key]);
    if (type == "object"){
      output[key] = GetTypes(value[key]);
    }else{
      output[key] = type;
    }
  }

  return output;
}


class Core{
  constructor(){
    var core = this;
    this.threads = [];
    this.awaiting = [];

    for (let i=0; i<os.cpus().length; i++){
      this.threads[i] = {
        process: spawn(process.execPath, [__dirname+'/thread.js', 'child'], {
          stdio: [null, null, null, 'pipe']
        }),
        callback: null
      };

      this.threads[i].process.stdout.pipe(process.stdout);
      this.threads[i].process.stderr.pipe(process.stderr);

      //Private com
      this.threads[i].process.stdio[3].on('data', function(chunk){
        chunk = chunk.toString();
        var index = chunk.indexOf('\n\r');
        var event = chunk.substr(0, index);
        chunk = chunk.substr(index+2);

        switch (event) {
          case 'Task Finish':
            this.threads[i].callback();
            this.threads[i].callback = null;
            core.onTaskEnd(i);
            break;
        }
      });
    }
  }
}
Core.prototype.task = function(task, callback){
  var core = this;

  if (typeof(callback) != "function"){
    callback = function(){};
  }

  return function(){
    core.dispatch(task, callback, arguments);
  };
};
Core.prototype.dispatch = function(task, callback, inputs){
  var thread = this.pickThread();
  if (thread === null){
    awaiting.push({task: task, callback: callback, inputs: inputs});
    return;
  }

  var data = {
    task: task.toString(),
    callback: callback,
    inputs: {
      values: JSON.stringify(inputs),
      types: JSON.stringify(GetTypes(inputs))
    }
  };

  this.threads[thread].process.stdio[3].write('New Task\r\n'+new Buffer(JSON.stringify(data)));
};
Core.prototype.pickThread = function(){
  for (let i=0; i<this.threads.length; i++){
    if (this.threads.callback !== null){
      return i;
    }
  }

  return null;
};
Core.prototype.onTaskEnd = function(thread){
  if (awaiting.length > 0){
    this.dispatch(awaiting[0].task, awaiting[0].callback, awaiting[0].inputs);
    this.awaiting.splice(0, 1);
  }
};


module.exports = new Core();
