// console.log(global);

const cluster = require('cluster');
const http = require('http');
const numThreads = require('os').cpus().length;

if (cluster.isMaster){
  console.log(`Master ${process.pid} is running`);

  for (let i=0; i<numThreads; i++){
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal){
    console.log(`worker ${worker.process.id} died`);
  });
}else{
  process.views = 0;

  http.createServer(function(req, res){
    if (req.url !== "/"){
      res.writeHead(404);
      res.end();
    }

    global.views = (global.views || 0) + 1;
    process.views += 1;

    res.writeHead(200); //Status: OK
    res.end(`Hello World\nView Count: ${global.views}\nThread: ${process.pid}\nLocal: ${process.views}`);

    setTimeout(function () {
      process.exit();
    }, 1000);
  }).listen(8080);

  console.log(`Worker ${process.pid} started`);
}
