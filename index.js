"use strict";

const copyDeep            = require("es5-ext/object/copy-deep")
    , ensureString        = require("es5-ext/object/validate-stringifiable-value")
    , normalizeOptions    = require("prettier/src/options").normalize
    , { printAstToDoc }   = require("prettier/src/printer")
    , { printDocToDebug } = require("prettier/src/doc-debug")
    , transform           = require("./lib/transform");

const { parse, printToDoc, printDocToString } = require("prettier").__debug;

const decoratedPrintDocToString = (doc, opts) => printDocToString(transform(copyDeep(doc)), opts);

const format = (text, opts) => decoratedPrintDocToString(printToDoc(text, opts), opts);

const formatWithShebang = function (text, opts) {
	if (!text.startsWith("#!")) return format(text, opts);

	const index = text.indexOf("\n");
	const shebang = text.slice(0, index + 1).trim();
	const programText = text.slice(index + 1);

	return `${ shebang }\n\n${ format(programText, opts) }`;
};

module.exports = {
	format (text, options = {}) {
		return formatWithShebang(ensureString(text), options);
	},
	check (text, opts) {
		try {
			const formatted = formatWithShebang(text, normalizeOptions(opts));

			return formatted === text;
		} catch (e) {
			return false;
		}
	},
	__debug: {
		parse,
		formatAST (ast, opts) {
			opts = normalizeOptions(opts);
			const doc = printAstToDoc(ast, opts);
			const str = decoratedPrintDocToString(doc, opts);

			return str;
		},
		// Doesn't handle shebang for now
		formatDoc (doc, opts) {
			opts = normalizeOptions(opts);
			const debug = printDocToDebug(doc);
			const str = format(debug, opts);

			return str;
		},
		printToDoc,
		printDocToString: decoratedPrintDocToString
	}
};
