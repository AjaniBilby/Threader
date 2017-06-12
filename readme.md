# Threader
Bringing simple multithreading to NodeJS

## Table of contents
- General
  - [Setup](#setup)
  - [Use](#use)
- [Stats](#stats)
  - [Multi-threading](#multithreading)
  - [Single-thread](#single thread)
- [Bindings](#bindings)

## Setup
It will automatically detect the number of cores on startup and setup based on that.  
``` var thread = require('threader'); ```

## Use
```
//Create a task
var task = thread.task(
  function(a, b){
    console.log('I am running in a separate process');
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


# Stats
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
    position = i;
    if (1000 <= position){
      endA = Date.now();
      console.log(endA - startA, position);
    }
  }
);

var startA = Date.now();
var endA = Date.now();
var position = 0;
for (let i=0; i<1000; i++){
  task('cat', i);
}
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

72828ms to complete


___

## Bindings

### task(task[function], callback[function], isAsync[boolean])
If async is true, then the callback will not be triggered until ```end(result[variable])``` is called.
This function returns a dispatch function

### dispatch()
This will parse your arguments to the predefined task.

### memoryShare()
Coming Soon
