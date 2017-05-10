# prettier-elastic-vars
## [Prettier](https://github.com/prettier/prettier) with alternative formatting for `var`, `let` and `const` declarations

### Installation

	$ npm install prettier-elastic-vars

### Usage

```javascript
// A decorated version of prettier.format
var prettier = require("prettier-elastic-vars");

prettier.format(src, options);
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
