# callbag-pull

Callbag operator that pulls a source for a given number of times.

`npm install callbag-pull`

**Example**

The following code creates a pullable source of 10 items, pulls the first two of them and logs them to the console.

```javascript
const range   = require('callbag-range');
const pull    = require('callbag-pull');
const observe = require('callbag-observe');
const pipe    = require('callbag-pipe');

pipe(
  range(1, 10),
  pull(2),
  observe(x => console.log(x))      // logs 1, 2
);
```
