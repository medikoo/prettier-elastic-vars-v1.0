/* eslint no-magic-numbers: "off" */

"use strict";

const objCopy = require("es5-ext/object/copy")
    , count   = require("es5-ext/string/#/count");

const varImportRe = /^([^=]+)= require\(/
    , isVarImport = RegExp.prototype.test.bind(varImportRe)
    , declarationStrings = new Set(["const", "let", "var"]);

const resolveStr = (data) => {
	const stack = [data];
	let out = "";

	while (stack.length) {
		const item = stack.pop();

		if (typeof item === "string") {
			out += item;
			continue;
		}
		switch (item.type) {
		case "concat":
			for (let i = item.parts.length - 1; i >= 0; i--) stack.push(item.parts[i]);
	    break;
		case "group":
		case "align":
		case "indent":
			stack.push(item.contents);
			break;
		default:
		}
	}
	return out.trim();
};

const resolveLengthCorrection = (identifier) => {
	if ((identifier[0] !== "{") && (identifier[0] !== "[")) return 0;
	return 2 + count.call(identifier, ",");
};

const applyElasticBreaks = (data) => {
	const stack = [data], affectedParts = [];
	let longestIdentifierLength = 0;

	while (stack.length) {
		const item = stack.pop();

		if (typeof item === "string") continue;
		switch (item.type) {
		case "concat": {
			const { parts } = item;

			if ((parts.length > 3) && (parts[0].type === "concat") && (parts[1] === " ") &&
				(parts[2] === "=")) {
				const identifier = resolveStr(parts[0]).trim()
				    , identifierLength = identifier.length + resolveLengthCorrection(identifier);

				if (identifierLength > longestIdentifierLength) {
					longestIdentifierLength = identifierLength;
				}
				affectedParts.push({ item, identifierLength });
				break;
			}
			for (let i = parts.length - 1; i >= 0; i--) stack.push(parts[i]);
	    break;
		}
		case "group":
		case "align":
		case "indent":
			stack.push(item.contents);
			break;
		default:
		}
	}

	affectedParts.forEach((itemData) => {
		const parts = itemData.item.parts = Array.from(itemData.item.parts);

		parts[1] = " ".repeat(longestIdentifierLength - itemData.identifierLength + 1);
	});
};

const fixLineBreaks = (data, isRequireBlock, wsPrefix) => {
	const stack = [data];

	while (stack.length) {
		const item = stack.pop();

		if (typeof item === "string") continue;
		switch (item.type) {
		case "concat": {
			const { parts } = item
			    , isLineBreak = (parts[0] === ",") && parts[1] && (parts[1].type === "line")
			    , start = isLineBreak ? 2 : 0;

			if ((parts[0] === ",") && parts[1] && (parts[1].type === "line")) {
				const newParts = item.parts = Array.from(parts);

				newParts.shift();
				if (isRequireBlock) {
					// Same objects are reused across tree, therefore we need to copy
					const newLinePart = objCopy(newParts[0]);

					newLinePart.hard = true;
					newParts.splice(0, 1, newLinePart, `${ wsPrefix }, `);
				} else {
					newParts.unshift({ type: "if-break", breakContents: "", flatContents: "," });
					newParts.splice(2, 0,
						{ type: "if-break", breakContents: `${ wsPrefix }, `, flatContents: "" });
				}
			}
			for (let i = parts.length - 1; i >= start; i--) stack.push(parts[i]);
	    break;
		}
		case "group":
		case "align":
		case "indent":
			stack.push(item.contents);
			break;
		default:
		}
	}
};

const processGroupParts = (contents) => {
	let { parts } = contents;

	if (parts.length !== 6) return false;

	const declarationStringPart = parts.slice(0, 3)
	    , [,,, firstItem, indentedPart] = parts;

	if (declarationStringPart.some((data) => typeof data !== "string")) return false;
	const declarationString = declarationStringPart.join("").trim();

	if (!declarationStrings.has(declarationString)) return false;
	if (firstItem.type !== "concat") return false;
	if (indentedPart.type !== "indent") return false;
	if (!indentedPart.contents.parts.length) return false;

	parts = contents.parts = Array.from(parts);

	const isRequireBlock = (declarationString !== "let") && isVarImport(resolveStr(firstItem));

	if (isRequireBlock) applyElasticBreaks(contents);

	// Fix line break points
	fixLineBreaks(indentedPart.contents, isRequireBlock, " ".repeat(declarationString.length - 1));

	// Remove indent wrap
	parts.splice(4, 1, indentedPart.contents);
	return true;
};

module.exports = (doc) => {
	const stack = [doc];
	let item;

	while (stack.length) {
		item = stack.pop();
		switch (item.type) {
		case "concat":
			for (let i = item.parts.length - 1; i >= 0; i--) stack.push(item.parts[i]);
	    break;
		case "group":
			if ((item.contents.type === "concat") && processGroupParts(item.contents)) break;
			// Falls through
		case "align":
		case "indent":
			stack.push(item.contents);
			break;
		default:
		}
	}
	return doc;
};
