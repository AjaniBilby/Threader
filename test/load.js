var os = require('os');

setInterval(function () {

  var cpus = os.cpus();
  var percent = 0;

  for (let thread of cpus){
    var tally = 0;

    for (let key in thread.times){
      tally += thread.times[key];
    }

    percent += 1 - (thread.times.idle / (tally));
  }

  percent /= cpus.length;

  console.log((percent * 100).toFixed(3) + '%');

}, 1000);
