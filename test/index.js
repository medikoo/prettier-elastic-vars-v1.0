/* eslint no-shadow: "off" */

"use strict";

const test                       = require("tape")
    , normalizeOptions           = require("prettier/src/options").normalize
    , { format, check, __debug } = require("../");

test("var declarations", (t) => {
	t.test("Single", (t) => {
		const text = "var x = \"foo\";\n";

		t.equal(format(text), text);
		t.end();
	});

	t.test("Few short", (t) => {
		const text = "var x = \"foo\", y = \"bar\";\n";

		t.equal(format(text), text);
		t.end();
	});
	test("Many long", (t) => {
		const text = `var razrazrazraz = "foofoofoo"
  , dwadwadwadwa = "bardwadwa"
  , trzytrzytrzytrzy = "trzytrzytrzy";
`;

		t.equal(format(text), text);
		t.end();
	});
	t.end();
});


test("let declarations", (t) => {
	t.test("Few short", (t) => {
		const src = "let x = \"foo\", y = \"bar\";\n";

		t.equal(format(src), src);
		t.end();
	});

	t.test("Many long", (t) => {
		const src = `let razrazrazraz = "foofoofoo"
  , dwadwadwadwa = "bardwadwa"
  , trzytrzytrzytrzy = "trzytrzytrzy";
`;

		t.equal(format(src), src);
		t.end();
	});
	t.end();
});

test("const declarations", (t) => {
	t.test("Many const short", (t) => {
		const src = "const x = \"foo\", y = \"bar\";\n";

		t.equal(format(src), src);
		t.end();
	});

	t.test("Many const long", (t) => {
		const src = `const razrazrazraz = "foofoofoo"
    , dwadwadwadwa = "bardwadwa"
    , trzytrzytrzytrzy = "trzytrzytrzy";
`;

		t.equal(format(src), src);
		t.end();
	});
	t.end();
});

test("Requires", (t) => {

	t.test("var", (t) => {

		t.test("Single", (t) => {
			const src = "var miszka = require(\"foo\");\n";

			t.equal(format(src), src);
			t.end();
		});

		t.test("Few short", (t) => {
			const src = "var miszka = require(\"foo\"), foo = require(\"marko\");\n";

			t.equal(format(src), `var miszka = require("foo")
  , foo    = require("marko");
`);
			t.end();
		});

		t.test("Few short (multiline input)", (t) => {
			const src = `
var miszka = require("foo")
  , foo = require("marko");
`;

			t.equal(format(src), `var miszka = require("foo")
  , foo    = require("marko");
`);
			t.end();
		});

		t.test("Long", (t) => {
			const src = `
var miszka = require("foo")
  , foo = require("marko")
  , markoEloBamba = require("marko-elo-bamba");
`;

			t.equal(format(src), `var miszka        = require("foo")
  , foo           = require("marko")
  , markoEloBamba = require("marko-elo-bamba");
`);
			t.end();
		});
		t.end();
	});

	t.test("const", (t) => {

		t.test("Single", (t) => {
			const src = "const miszka = require(\"foo\");\n";

			t.equal(format(src), src);
			t.end();
		});

		t.test("Few short", (t) => {
			const src = "const miszka = require(\"foo\"), foo = require(\"marko\");\n";

			t.equal(format(src), `const miszka = require("foo")
    , foo    = require("marko");
`);
			t.end();
		});

		t.test("Long", (t) => {
			const src = `
const miszka = require("foo")
  , foo = require("marko")
  , markoEloBamba = require("marko-elo-bamba");
`;

			t.equal(format(src), `const miszka        = require("foo")
    , foo           = require("marko")
    , markoEloBamba = require("marko-elo-bamba");
`);
			t.end();
		});
		t.end();
	});

	t.test("Destructuring", (t) => {
		const src = `
var { miszka, elo } = require("foo")
  , foo = require("marko")
  , markoEloBamba = require("marko-elo-bamba");
`;

		t.equal(format(src), `var { miszka, elo } = require("foo")
  , foo             = require("marko")
  , markoEloBamba   = require("marko-elo-bamba");
`);
		t.end();
	});
});

test("mocks", (t) => {

	test("She bang", (t) => {
		const src = `#!/usr/bin/env node

var x = "foo";
`;

		t.equal(format(src), src);
		t.end();
	});

	test("Check", (t) => {
		t.equal(check("var x = \"foo\";\n"), true);
		t.equal(check("var x =  \"foo\";\n"), false);
		t.equal(check("fefe(f"), false);
		t.end();
	});

	test("formatAST", (t) => {
		const text = "var x = \"foo\";\n", opts = normalizeOptions({});

		const ast = __debug.parse(text, opts);

		delete ast.comments;
		ast.tokens = [];
		opts.originalText = text.trimRight();

		t.equal(__debug.formatAST(ast, opts), text);
		t.end();
	});

	test("formatDoc", (t) => {
		const src = `var razrazrazraz = "foofoofoo"
  , dwadwadwadwa = "bardwadwa"
  , trzytrzytrzytrzy = "trzytrzytrzy";
`;

		t.equal(typeof __debug.formatDoc(__debug.printToDoc(src)), "string");
		t.end();
	});

	t.end();
});
