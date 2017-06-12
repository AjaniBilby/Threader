A quick and easy object manipulation library.


# Object manipulators / interpreters

## getDiffList(obj1, obj2, skipableRecursive)  
obj1, and obj2, must be objects  
skipableRecursive must be either a boolean or undefined

Parse an array of strings listing whether each part is new, old, updated, or equal.  
skipableRecursive will stop the function from looping down into another layer  
if there is an object with an object.  


## passNew(obj1, obj2, skipableRecursive)  
Similar to getDiffList, but it will pass a object of which is only the new items


## merge(obj1, obj2, recursive)  
Will run though the two objects and merge objects 1 & 2 with 2 overwriting  
object 1 where necessary.  
recursive is default true

## appendArray(firstArray, secondArray)
Will return an array with the content starting with input one and ending with input two.
**Example**: ```ob.appendArray([1,2], [3,4]) //Will return [1,2,3,4]```

## appendBuffer(firstBuffer, secondBuffer)
This will do a similar task to appendArray, but with buffers.

## firstUndefined(array)
This will return the first undefined value's index within an array

## indexesOf(stirng, search)
This will return an array of all indexes of the search term within the string

___

# Other functions

## isFunction(item)  
Will parse a boolean on whether item is a function or not


## isObject(item)  
Will parse a boolean on whether item is a object {} or not


## isArray(item)  
Will parse a boolean on whether item is a array [] or not
