module.exports = {
  FTS: function(value){

    for (let key in value){
      var type = typeof(value[key]);

      if (type == "function"){
        value[key] = value[key].toString();
      }else if (type == "object"){
        value[key] = module.exports.FTS(value[key]);
      }
    }

    return value;
  },
  STF: function(value){
    for (let key in value){
      if (typeof(value[key]) == "string" && value[key].indexOf("function (") === 0){
        eval("value[key] = "+value[key]);
      }
    }

    return value;
  }
};
