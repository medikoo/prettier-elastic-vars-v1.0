# prettier-elastic-vars
## Prettier decorator that applies alternative formatting to var/let/const declarations

### Installation

	$ npm install prettier-elastic-vars

### Usage

```javascript
// A decorated version of prettier.format
var format = require("prettier-elastic-vars");

format(src, options);
```

### Examples

<table>
<thead><tr><th>prettier</th><th>prettier-elastic-vars</th></thead>
<tbody>
<tr>
<td>
<pre><code>var eloBar = require("elo-bar"),
  foo = require("foo"),
  otherThing = require("other-thing");
</pre></code>
</td>
<td>
<pre><code>var eloBar     = require("elo-bar")
  , foo        = require("foo")
  , otherThing = require("other-thing");
</pre></code>
</td>
</tr>
<tr>
<td>
<pre><code>const eloBar = require("elo-bar"),
  foo = require("foo"),
  otherThing = require("other-thing");
</pre></code>
</td>
<td>
<pre><code>const eloBar     = require("elo-bar")
    , foo        = require("foo")
    , otherThing = require("other-thing");
</pre></code>
</td>
</tr>
</tbody>
</table>

### Test

	$ npm test
