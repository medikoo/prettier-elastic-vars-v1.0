# prettier-elastic-vars-v1.0

__NOTICE: It's initial version of `prettier-elastic-vars` projest, configured internally as a _doc_ external decorator.  
Deprecated now in favor of [new version](https://github.com/medikoo/prettier-elastic-vars) which is direct fork of  a prettier.__

## [Prettier](https://github.com/prettier/prettier) with alternative formatting for `var`, `let` and `const` declarations

### Installation

	$ npm install prettier-elastic-vars

### Usage

```javascript
var prettier = require("prettier-elastic-vars");

// Same as with original prettier
prettier.format(src, options);
```

#### Integration with VS Code

Install [prettier-eslint](https://marketplace.visualstudio.com/items?itemName=RobinMalfait.prettier-eslint-vscode) extension

Set `prettier-eslint.prettierPath` with correct path to `prettier-elastic-vars`, e.g.:

```json
...
"prettier-eslint.prettierPath": "/Users/your-user-name/some-projects/prettier-elastic-vars",
...
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
