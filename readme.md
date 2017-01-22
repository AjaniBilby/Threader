# Threader
Bringing simple multithreading to NodeJS

## Setup
It will automatically detect the number of cores on startup and setup based on that.
```
var thread = require('threader');
```
## Use
```
//Create a task
var task = thread.task(
  function(a, b){
    console.log('I am running in a seperate process');
    return a+b;
  },
  function(result){
    console.log('I am running in the main process after the other process has returned ('+result+')');
  }
);

//Run the task
task(3, 5);
```

___


## Stats
I am using crypto's pbkdf2 because it is an easy to access big calculation, I know that there is an async version.

### Multithreading
```
var thread = require('threader');

var task = thread.task(
  function(word, i){
    var crypto = require("crypto");
    var salt = crypto.randomBytes(128).toString('base64');
    crypto.pbkdf2Sync(word, salt, 10000, 512, 'sha512');
    return i;
  },
  function(i){
    endA = Date.now();
    if (i > possition){
      possition = i;
    }
  }
);

var startA = Date.now();
var endA = Date.now();
var possition = 0;
for (let i=0; i<1000; i++){
  task('cat', i);
}

setInterval(function () {
  console.log(endA - startA, possition);
}, 1000);
```
20562ms to complete

### Single Thread
```
var thread = require('threader');

var startA = Date.now();
for (let i=0; i<1000; i++){
    var crypto = require("crypto");
    var salt = crypto.randomBytes(128).toString('base64');
    crypto.pbkdf2Sync('cat', salt, 10000, 512, 'sha512');
}
var endA = Date.now();
console.log('time', endA-startA);
```

72828mc to complete
