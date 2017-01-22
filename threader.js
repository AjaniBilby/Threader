var os = require('os');
var spawn = require('child_process').spawn;
var typing = require('./typing.js');



class Core{
  constructor(){
    var core = this;
    this.children = [];
    this.callbacks = [];
    this.awaiting = [];
    this.count = os.cpus().length;

    for (let i=0; i<this.count; i++){
      var child = spawn(process.execPath, [__dirname+'/thread.js', 'child'], {
        stdio: [null, null, null, 'pipe']
      });

      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
      child.stdio[3].on('data', function(data){
        data = data.toString();

        if (data.indexOf('Response') === 0){
          if (typeof(core.callbacks[i]) == "function"){
            core.callbacks[i](typing.STF(JSON.parse(data.substr(8))).value);
            core.callbacks[i] = null;
          }

          core.onTaskFinish();
        }else{
          console.log(data);
        }
      });

      this.children[i] = child;
      this.callbacks[i] = null;
    }
  }
}
Core.prototype.onTaskFinish = function(){
  if (this.awaiting.length > 0){
    this.dispatch(this.awaiting[0].task, this.awaiting[0].callback, this.awaiting[0].values);
    this.awaiting.splice(0, 1);
  }
};
Core.prototype.task = function(task, callback){
  var core = this;

  return function(){
    core.dispatch(task, callback, Array.from(arguments));
  };
};
Core.prototype.pick = function(){
  for (let i=0; i<this.callbacks.length; i++){
    if (typeof(this.callbacks[i]) != "function"){
      return i;
    }
  }

  return null;
};
Core.prototype.dispatch = function(task, callback, values){
  var thread = this.pick();

  if (thread === null){
    this.awaiting.push({
      task: task,
      callback: callback,
      values: values
    });
    return;
  }

  if (typeof(values) != "object"){
    values = [];
  }

  var send = {
    task: task.toString(),
    inputs: typing.FTS(values)
  };

  this.callbacks[thread] = callback;

  this.children[thread].stdio[3].write('Task'+JSON.stringify(send));
};


module.exports = new Core();
