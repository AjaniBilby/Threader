var thread = require('threader');

var task = thread.task(
  function(word, i){
    var crypto = require("crypto");
    var salt = crypto.randomBytes(128).toString('base64');
    crypto.pbkdf2Sync(word, salt, 10000, 512, 'sha512');
    return i;
  },
  function(i){
    if (i >= loops){
      endA = Date.now();
      console.log('Async', endA - startA);
      Sync();
    }
  }
);

var startA = Date.now();
var endA = Date.now();
var loops = 1000;
for (let i=0; i<=loops; i++){
  task('cat', i);
}

function Sync(){
  var startA = Date.now();
  for (let i=0; i<1000; i++){
      var crypto = require("crypto");
      var salt = crypto.randomBytes(128).toString('base64');
      crypto.pbkdf2Sync('cat', salt, 10000, 512, 'sha512');
  }
  var endA = Date.now();
  console.log('Sync', endA-startA);
}
