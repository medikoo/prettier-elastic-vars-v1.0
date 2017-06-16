// Just sanity tests, real tests are done in .../index.js

"use strict";

const test      = require("tape")
    , transform = require("../../lib/transform");

test("Main", t => {
	const doc = { type: "concat", parts: [] };

	t.equal(transform(doc), doc);
	t.end();
});
