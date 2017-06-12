var reference = require('./reference.js');
var radix = new (require('custom-radix'))('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()_-+={[]}|\\:;"\'<,>.?/');
var cosf = {
  banFunctions: false
};

var char = {
  absolute: String.fromCharCode(0),
  number: String.fromCharCode(1),
  string: String.fromCharCode(2),
  function: String.fromCharCode(3),
  object: String.fromCharCode(4),
  tag: String.fromCharCode(5),
  array: String.fromCharCode(6),
  buffer: String.fromCharCode(7),
  reference: String.fromCharCode(8),
  headerEnd: String.fromCharCode(9),
};

cosf.encode = function(data){
  var header = new Buffer('');
  var values = new Buffer('');
  var isArray = Array.isArray(data);

  data = reference.break(data);

  if (isArray){
    header += char.array;
  }

  for (let key in data){
    if (cosf.banFunctions && typeof data[key] == "function"){
      continue;
    }

    if (!isArray){
      header += char.tag + radix.convert(key.length);
      values += key;
    }

    switch(data[key]){
      case NaN:
        header += char.absolute;
        values += "n";
        break;
      case undefined:
        header += char.absolute;
        values += "u";
        break;
      case true:
        header += char.absolute;
        values += "t";
        break;
      case false:
        header += char.absolute;
        values += "f";
        break;
      case Infinity:
        header += char.absolute;
        values += "i";
        break;
      default:
        switch (typeof data[key]){
          case "number":
            header += char.number;
            header += radix.convert(data[key].toString().length);

            values += data[key];
            break;
          case "function":
            if (cosf.banFunctions){
              break;
            }

            var f = data[key].toString().slice(9);
            header += char.function + radix.convert(f.length);
            values += f;
            break;
          case "object":
            if (data[key] instanceof Buffer){
              header += char.buffer + radix.convert(data[key].length);
              values += data[key];
            }else if (data[key] instanceof reference.class){
              header += char.reference + radix.convert(data[key].path.length);
              values += data[key].path;
            }else{
              var o = cosf.encode(data[key]);
              header += char.object + radix.convert(o.length);
              values += o;
            }
            break;
          default:
            header += char.string + radix.convert(data[key].length);
            values += data[key];
        }
    }
  }

  return header + char.headerEnd + values;
};
cosf.decode = function(buffer, isLooping){
  var obj = {};

  var isArray;
  var s = buffer.indexOf(char.headerEnd) + 1;
  var values = buffer.slice(s);
  var header = buffer.slice(0, s);

  var partNum = '';
  var partTage = '';
  var prevKey = null;

  if (header[0] == char.array){
    isArray = true;
    header = header.slice(1);
    obj = [];
    prevKey = -1;
  }


  while (header.length>0){
    isNum = header[0].match(/[A-z0-9]/g) || header[0] == "-" || header[0] == "_"; //Radix 64 chars

    if (isNum){
      partNum += header[0];
    }else{
      switch (partTage){
        case char.tag:
          var tag = values.slice(0, radix.convert(partNum));
          obj[tag] = undefined;
          values = values.slice(radix.convert(partNum));

          if (!isArray){
            prevKey = tag;
          }

          break;
        case char.absolute:
          obj[prevKey] = values.slice(0, 1);
          values = values.slice(1);

          switch (obj[prevKey]) {
            case 't':
              obj[prevKey] = true;
              break;
            case 'f':
              obj[prevKey] = false;
              break;
            case 'u':
              obj[prevKey] = undefined;
              break;
            case 'n':
              obj[prevKey] = NaN;
              break;
            case 'i':
              obj[prevKey] = Infinity;
          }

          break;
        case char.number:
          var val = '';
          partNum = radix.convert(partNum);
          val = values.slice(0, partNum);
          values = values.slice(partNum);
          val = Number(val);

          obj[prevKey] = val;

          break;
        case char.string:
          partNum = radix.convert(partNum);
          obj[prevKey] = values.slice(0, partNum);
          values = values.slice(partNum);

          break;
        case char.function:
          partNum = radix.convert(partNum);
          if (!cosf.banFunctions){
            eval('obj[prevKey] = function'+values.slice(0, partNum));
          }
          values = values.slice(partNum);

          break;
        case char.object:
          partNum = radix.convert(partNum);
          obj[prevKey] = cosf.decode(values.slice(0, partNum), true);
          values = values.slice(partNum);

          break;
        case char.buffer:
          partNum = radix.convert(partNum);
          obj[prevKey] = new Buffer(values.slice(0, partNum));
          values = values.slice(partNum);

          break;
        case char.reference:
          partNum = radix.convert(partNum);
          obj[prevKey] = new reference.class(values.slice(0, partNum));
          values = values.slice(partNum);

          break;
      }

      if (isArray){
        prevKey = (prevKey || 0) + 1;
      }else if (partTage != char.tag){
        prevKey = null;
      }

      partTage = header[0];
      partNum = '';
    }

    header = header.slice(1);
  }

  if (isLooping){
    return obj;
  }else{
    return reference.join(obj);
  }
};

module.exports = cosf;
