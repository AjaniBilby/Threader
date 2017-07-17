var thread = require('threader');

var ping = thread.task(
  function(){
    return Date.now();
  }, function(middle){
    var end = Date.now();
    console.log(0, middle-start, end-start);
  }
);

var start = Date.now();
ping();
