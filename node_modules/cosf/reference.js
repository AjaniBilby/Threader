var reference = {};

class Reference{
  constructor(path){
    this.path = path;
  }
}

reference.class = Reference;
reference.break = function(obj){
  var seen = [];
  var paths = [];

  function Detect(obj, path="/"){
    paths.push(path);
    seen.push(obj);

    for (let key in obj){
      var index = seen.indexOf(obj[key]);
      if (index != -1){
        obj[key] = new Reference(path[index]);
      }else if(typeof obj[key] == "object"){
        Detect(obj[key], path+'/'+key);
      }
    }

    return false;
  }

  Detect(obj);

  return obj;
};
reference.join = function(obj){
  function Get(path){
    if (path === '/'){
      return obj;
    }

    var out = obj;
    path = path.split('/').slice(1);

    while (path.length>0){
      if (out[path[0]]){
        out = out[path[0]];
        path.splice(0, 1);
      }else{
        return null;
      }
    }

    return out;
  }

  function Loop(input){
    for (let key in input){
      if (typeof input[key] == "object"){
        if (input[key] instanceof Reference){
          input[key] = Get(input[key].path);
        }else{
          Loop(input[key]);
        }
      }
    }
  }

  Loop(obj);

  return obj;
};


module.exports = reference;
