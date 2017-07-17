var thread = require('threader');

var count = thread.task(
  function(){
    share.load(function(data){
      console.log('data', data);

      data.count = (data.count || 0) + 1;
      share.save(data);

      end();
    });
  },
  function(){},
  true
);

count();
