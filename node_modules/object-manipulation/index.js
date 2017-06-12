class ObjectManager{}

ObjectManager.getDiffList = function(obj1, obj2){
  if (this.isFunction(obj1) || this.isFunction(obj2)){
    throw 'Invalid argument. Function given, object expected.';
  }
  if (this.isValue(obj1) || this.isValue(obj2)){
    return this.compareValues(obj1, obj2);
  }

  var diff = {};

  var keyList = Object.keys(obj1);
  for (let key in obj2){
    if (keyList.indexOf(key) == -1){
      keyList.push(key);
    }
  }

  for (let key of keyList){
    if (this.isValue(obj1[key])){
      if (this.isValue(obj2[key])){
        diff[key] = this.compareValues(obj1[key], obj2[key]);
      }else{
        diff[key] = 'new';
      }
    }else{
      if (this.isValue(obj2[key])){
        diff[key] = 'new';
      }else{
        diff[key] = this.getDiffList(obj1[key], obj2[key]);
      }
    }
  }

  return diff;
};
ObjectManager.passNew = function(obj1, obj2){
  var diff = this.getDiffList(obj1, obj2);

  var output = {};

  for (let key in diff){
    switch (diff[key]) {
      case "updated":
        output[key] = obj2[key];
        break;
      case "equal":
        break;
      case "deleted":
        output[key] = undefined;
        break;
      case "new":
        output[key] = obj2[key];
        break;
      default:
        //Is array or object?
        if (!this.isValue(diff[key])){
          output[key] = this.passNew(obj1[key], obj2[key]);
        }
    }
  }

  return output;
};
ObjectManager.compareValues = function(original, current){
  //Equal?
  if (original === current){
    return 'equal';
  }
  //Has the item added?
  if (original === undefined && current !== undefined){
    return 'new';
  }
  //Has the item been removed?
  if (original !== undefined && current === undefined){
    return 'deleted';
  }
  //Changed?
  if (current != original){
    return 'updated';
  }
  //else
  return 'equal';
};
ObjectManager.isFunction = function(obj){
  return {}.toString.apply(obj) === '[object Function]';
};
ObjectManager.isObject = function(obj){
  return {}.toString.apply(obj) === '[object Object]';
};
ObjectManager.isArray = function(obj){
  return {}.toString.apply(obj) === '[object Array]';
};
ObjectManager.isValue  = function(obj){
  return !this.isObject(obj) && !this.isArray(obj);
};

ObjectManager.merge = function (obj1, obj2, recursive = true){
  if ( this.isValue(obj1) || this.isValue(obj2) ){
    return obj2;
  }

  for (var attrname in obj2){
    if (!this.isValue(obj2[attrname])){
      if (!this.isValue(obj1[attrname])){
        obj1[attrname] = this.merge(obj1[attrname], obj2[attrname]);
        continue;
      }
    }
    obj1[attrname] = obj2[attrname];
  }

  return obj1;
};

ObjectManager.appendArray = function(firstArray, secondArray){
  var a = new Array(a);

  for (let item of secondArray){
    a.push(item);
  }

  return a;
};

ObjectManager.appendBuffer = function(firstBuffer, secondBuffer){
  var a = JSON.parse(JSON.stringify(firstBuffer)).data;
  var b = JSON.parse(JSON.stringify(secondBuffer)).data;
  for (let item of b){
    a.push(item);
  }

  return new Buffer(a);
};

ObjectManager.indexOf = function(key, string){

  for (let i=0; i<string.length-(key.length-1); i++){
    var indexFail = false;

    for (let j=0; j<key.length; j++){

      if (indexFail){
        continue;
      }

      if (key[j] != string[i+j]){
        indexFail = true;
      }
    }

    if (!indexFail){
      return i;
    }
  }

  return -1;
};

ObjectManager.firstUndefined = function(array = [], overflow = 1000){
  if (this.isArray(array)){
    let index = 0;
    while(index < overflow){
      if (typeof(array[index]) == "undefined"){
        return index;
      }else{
        index += 1;
      }
    }

    console.error('***ERROR: Killing Process due to not finding empty index after 1000\nRecommend expanding overflow object-manipulation.firstUndefined(array, overflow)');

    return -1;
  }else{
    console.error("***ERROR: Array Invalid Input");
    return -1;
  }
};

ObjectManager.indexesOf = function(string, search){
  var lastIndex = 0;
  var indexes = [];
  var searching = true;

  var loopNum = 0;

  while (loopNum<string.length) {
    var index = string.substr(lastIndex, string.length).indexOf(search);
    if (index == -1){
      loopNum = string.length;
    }else{
      lastIndex += index+1;
      indexes.push(lastIndex-1);
    }
    loopNum += 1;
  }

  return indexes;
}

module.exports = ObjectManager;
