## Compressed Object Storage Format

### An alternative to JSON of which can store allot more data for less.

---

A compressed variation of JSON of which allows to storage of more that just UTF8 data.  

With this library you can store any data of which you could with JSON, but also you can embed; other buffers, function, circular references, object references

---

# Interface

### encoded(object)
Converts an object / array to our custom encoding format, and returns a buffer.

### decode(buffer)
Returns an object identical to the object encoded

---

# Settings

### banFunctions
If true then all functions will be removed in the encoding / decoding process.
