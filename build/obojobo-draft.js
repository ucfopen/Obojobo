/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ((function(modules) {
	// Check all modules for deduplicated modules
	for(var i in modules) {
		if(Object.prototype.hasOwnProperty.call(modules, i)) {
			switch(typeof modules[i]) {
			case "function": break;
			case "object":
				// Module can be created from a template
				modules[i] = (function(_m) {
					var args = _m.slice(1), fn = modules[_m[0]];
					return function (a,b,c) {
						fn.apply(this, [a,b,c].concat(args));
					};
				}(modules[i]));
				break;
			default:
				// Module is a copy of another module
				modules[i] = modules[modules[i]];
				break;
			}
		}
	}
	return modules;
}([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(212);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	/**
	 * This file contains a list of utility functions which are useful in other
	 * files.
	 */

	/**
	 * Provide an `indexOf` function which works in IE8, but defers to native if
	 * possible.
	 */
	var nativeIndexOf = Array.prototype.indexOf;
	var indexOf = function(list, elem) {
	    if (list == null) {
	        return -1;
	    }
	    if (nativeIndexOf && list.indexOf === nativeIndexOf) {
	        return list.indexOf(elem);
	    }
	    var i = 0, l = list.length;
	    for (; i < l; i++) {
	        if (list[i] === elem) {
	            return i;
	        }
	    }
	    return -1;
	};

	/**
	 * Return whether an element is contained in a list
	 */
	var contains = function(list, elem) {
	    return indexOf(list, elem) !== -1;
	};

	/**
	 * Provide a default value if a setting is undefined
	 */
	var deflt = function(setting, defaultIfUndefined) {
	    return setting === undefined ? defaultIfUndefined : setting;
	};

	// hyphenate and escape adapted from Facebook's React under Apache 2 license

	var uppercase = /([A-Z])/g;
	var hyphenate = function(str) {
	    return str.replace(uppercase, "-$1").toLowerCase();
	};

	var ESCAPE_LOOKUP = {
	  "&": "&amp;",
	  ">": "&gt;",
	  "<": "&lt;",
	  "\"": "&quot;",
	  "'": "&#x27;"
	};

	var ESCAPE_REGEX = /[&><"']/g;

	function escaper(match) {
	  return ESCAPE_LOOKUP[match];
	}

	/**
	 * Escapes text to prevent scripting attacks.
	 *
	 * @param {*} text Text value to escape.
	 * @return {string} An escaped string.
	 */
	function escape(text) {
	  return ("" + text).replace(ESCAPE_REGEX, escaper);
	}

	/**
	 * A function to set the text content of a DOM element in all supported
	 * browsers. Note that we don't define this if there is no document.
	 */
	var setTextContent;
	if (typeof document !== "undefined") {
	    var testNode = document.createElement("span");
	    if ("textContent" in testNode) {
	        setTextContent = function(node, text) {
	            node.textContent = text;
	        };
	    } else {
	        setTextContent = function(node, text) {
	            node.innerText = text;
	        };
	    }
	}

	/**
	 * A function to clear a node.
	 */
	function clearNode(node) {
	    setTextContent(node, "");
	}

	module.exports = {
	    contains: contains,
	    deflt: deflt,
	    escape: escape,
	    hyphenate: hyphenate,
	    indexOf: indexOf,
	    setTextContent: setTextContent,
	    clearNode: clearNode
	};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	/**
	 * This is the ParseError class, which is the main error thrown by KaTeX
	 * functions when something has gone wrong. This is used to distinguish internal
	 * errors from errors in the expression that the user provided.
	 */
	function ParseError(message, lexer, position) {
	    var error = "KaTeX parse error: " + message;

	    if (lexer !== undefined && position !== undefined) {
	        // If we have the input and a position, make the error a bit fancier

	        // Prepend some information
	        error += " at position " + position + ": ";

	        // Get the input
	        var input = lexer._input;
	        // Insert a combining underscore at the correct position
	        input = input.slice(0, position) + "\u0332" +
	            input.slice(position);

	        // Extract some context from the input and add it to the error
	        var begin = Math.max(0, position - 15);
	        var end = position + 15;
	        error += input.slice(begin, end);
	    }

	    // Some hackery to make ParseError a prototype of Error
	    // See http://stackoverflow.com/a/8460753
	    var self = new Error(error);
	    self.name = "ParseError";
	    self.__proto__ = ParseError.prototype;

	    self.position = position;
	    return self;
	}

	// More hackery
	ParseError.prototype.__proto__ = Error.prototype;

	module.exports = ParseError;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/* jshint unused:false */

	var Style = __webpack_require__(6);

	/**
	 * This file contains metrics regarding fonts and individual symbols. The sigma
	 * and xi variables, as well as the metricMap map contain data extracted from
	 * TeX, TeX font metrics, and the TTF files. These data are then exposed via the
	 * `metrics` variable and the getCharacterMetrics function.
	 */

	// These font metrics are extracted from TeX by using
	// \font\a=cmmi10
	// \showthe\fontdimenX\a
	// where X is the corresponding variable number. These correspond to the font
	// parameters of the symbol fonts. In TeX, there are actually three sets of
	// dimensions, one for each of textstyle, scriptstyle, and scriptscriptstyle,
	// but we only use the textstyle ones, and scale certain dimensions accordingly.
	// See the TeXbook, page 441.
	var sigma1 = 0.025;
	var sigma2 = 0;
	var sigma3 = 0;
	var sigma4 = 0;
	var sigma5 = 0.431;
	var sigma6 = 1;
	var sigma7 = 0;
	var sigma8 = 0.677;
	var sigma9 = 0.394;
	var sigma10 = 0.444;
	var sigma11 = 0.686;
	var sigma12 = 0.345;
	var sigma13 = 0.413;
	var sigma14 = 0.363;
	var sigma15 = 0.289;
	var sigma16 = 0.150;
	var sigma17 = 0.247;
	var sigma18 = 0.386;
	var sigma19 = 0.050;
	var sigma20 = 2.390;
	var sigma21 = 1.01;
	var sigma21Script = 0.81;
	var sigma21ScriptScript = 0.71;
	var sigma22 = 0.250;

	// These font metrics are extracted from TeX by using
	// \font\a=cmex10
	// \showthe\fontdimenX\a
	// where X is the corresponding variable number. These correspond to the font
	// parameters of the extension fonts (family 3). See the TeXbook, page 441.
	var xi1 = 0;
	var xi2 = 0;
	var xi3 = 0;
	var xi4 = 0;
	var xi5 = 0.431;
	var xi6 = 1;
	var xi7 = 0;
	var xi8 = 0.04;
	var xi9 = 0.111;
	var xi10 = 0.166;
	var xi11 = 0.2;
	var xi12 = 0.6;
	var xi13 = 0.1;

	// This value determines how large a pt is, for metrics which are defined in
	// terms of pts.
	// This value is also used in katex.less; if you change it make sure the values
	// match.
	var ptPerEm = 10.0;

	// The space between adjacent `|` columns in an array definition. From
	// `\showthe\doublerulesep` in LaTeX.
	var doubleRuleSep = 2.0 / ptPerEm;

	/**
	 * This is just a mapping from common names to real metrics
	 */
	var metrics = {
	    xHeight: sigma5,
	    quad: sigma6,
	    num1: sigma8,
	    num2: sigma9,
	    num3: sigma10,
	    denom1: sigma11,
	    denom2: sigma12,
	    sup1: sigma13,
	    sup2: sigma14,
	    sup3: sigma15,
	    sub1: sigma16,
	    sub2: sigma17,
	    supDrop: sigma18,
	    subDrop: sigma19,
	    axisHeight: sigma22,
	    defaultRuleThickness: xi8,
	    bigOpSpacing1: xi9,
	    bigOpSpacing2: xi10,
	    bigOpSpacing3: xi11,
	    bigOpSpacing4: xi12,
	    bigOpSpacing5: xi13,
	    ptPerEm: ptPerEm,
	    emPerEx: sigma5 / sigma6,
	    doubleRuleSep: doubleRuleSep,

	    // TODO(alpert): Missing parallel structure here. We should probably add
	    // style-specific metrics for all of these.
	    delim1: sigma20,
	    getDelim2: function(style) {
	        if (style.size === Style.TEXT.size) {
	            return sigma21;
	        } else if (style.size === Style.SCRIPT.size) {
	            return sigma21Script;
	        } else if (style.size === Style.SCRIPTSCRIPT.size) {
	            return sigma21ScriptScript;
	        }
	        throw new Error("Unexpected style size: " + style.size);
	    }
	};

	// This map contains a mapping from font name and character code to character
	// metrics, including height, depth, italic correction, and skew (kern from the
	// character to the corresponding \skewchar)
	// This map is generated via `make metrics`. It should not be changed manually.
	var metricMap = __webpack_require__(69);

	/**
	 * This function is a convience function for looking up information in the
	 * metricMap table. It takes a character as a string, and a style
	 */
	var getCharacterMetrics = function(character, style) {
	    return metricMap[style][character.charCodeAt(0)];
	};

	module.exports = {
	    metrics: metrics,
	    getCharacterMetrics: getCharacterMetrics
	};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";

	var Dispatcher, ex, ex2;

	Dispatcher = {};

	_.extend(Dispatcher, Backbone.Events);

	ex = Dispatcher.on;

	ex2 = Dispatcher.trigger;

	Dispatcher.on = function () {
	  return ex.apply(this, arguments);
	};

	Dispatcher.trigger = function () {
	  return ex2.apply(this, arguments);
	};

	window.__dispatcher = Dispatcher;

	module.exports = Dispatcher;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	var StyleType;

	StyleType = {
	  BOLD: 'b',
	  ITALIC: 'i',
	  STRIKETHROUGH: 'del',
	  LINK: 'a',
	  QUOTE: 'q',
	  MONOSPACE: 'monospace',
	  SUPERSCRIPT: 'sup',
	  COMMENT: '_comment',
	  LATEX: '_latex'
	};

	module.exports = StyleType;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/**
	 * This file contains information and classes for the various kinds of styles
	 * used in TeX. It provides a generic `Style` class, which holds information
	 * about a specific style. It then provides instances of all the different kinds
	 * of styles possible, and provides functions to move between them and get
	 * information about them.
	 */

	/**
	 * The main style class. Contains a unique id for the style, a size (which is
	 * the same for cramped and uncramped version of a style), a cramped flag, and a
	 * size multiplier, which gives the size difference between a style and
	 * textstyle.
	 */
	function Style(id, size, multiplier, cramped) {
	    this.id = id;
	    this.size = size;
	    this.cramped = cramped;
	    this.sizeMultiplier = multiplier;
	}

	/**
	 * Get the style of a superscript given a base in the current style.
	 */
	Style.prototype.sup = function() {
	    return styles[sup[this.id]];
	};

	/**
	 * Get the style of a subscript given a base in the current style.
	 */
	Style.prototype.sub = function() {
	    return styles[sub[this.id]];
	};

	/**
	 * Get the style of a fraction numerator given the fraction in the current
	 * style.
	 */
	Style.prototype.fracNum = function() {
	    return styles[fracNum[this.id]];
	};

	/**
	 * Get the style of a fraction denominator given the fraction in the current
	 * style.
	 */
	Style.prototype.fracDen = function() {
	    return styles[fracDen[this.id]];
	};

	/**
	 * Get the cramped version of a style (in particular, cramping a cramped style
	 * doesn't change the style).
	 */
	Style.prototype.cramp = function() {
	    return styles[cramp[this.id]];
	};

	/**
	 * HTML class name, like "displaystyle cramped"
	 */
	Style.prototype.cls = function() {
	    return sizeNames[this.size] + (this.cramped ? " cramped" : " uncramped");
	};

	/**
	 * HTML Reset class name, like "reset-textstyle"
	 */
	Style.prototype.reset = function() {
	    return resetNames[this.size];
	};

	// IDs of the different styles
	var D = 0;
	var Dc = 1;
	var T = 2;
	var Tc = 3;
	var S = 4;
	var Sc = 5;
	var SS = 6;
	var SSc = 7;

	// String names for the different sizes
	var sizeNames = [
	    "displaystyle textstyle",
	    "textstyle",
	    "scriptstyle",
	    "scriptscriptstyle"
	];

	// Reset names for the different sizes
	var resetNames = [
	    "reset-textstyle",
	    "reset-textstyle",
	    "reset-scriptstyle",
	    "reset-scriptscriptstyle"
	];

	// Instances of the different styles
	var styles = [
	    new Style(D, 0, 1.0, false),
	    new Style(Dc, 0, 1.0, true),
	    new Style(T, 1, 1.0, false),
	    new Style(Tc, 1, 1.0, true),
	    new Style(S, 2, 0.7, false),
	    new Style(Sc, 2, 0.7, true),
	    new Style(SS, 3, 0.5, false),
	    new Style(SSc, 3, 0.5, true)
	];

	// Lookup tables for switching from one style to another
	var sup = [S, Sc, S, Sc, SS, SSc, SS, SSc];
	var sub = [Sc, Sc, Sc, Sc, SSc, SSc, SSc, SSc];
	var fracNum = [T, Tc, S, Sc, SS, SSc, SS, SSc];
	var fracDen = [Tc, Tc, Sc, Sc, SSc, SSc, SSc, SSc];
	var cramp = [Dc, Dc, Tc, Tc, Sc, Sc, SSc, SSc];

	// We only export some of the styles. Also, we don't export the `Style` class so
	// no more styles can be generated.
	module.exports = {
	    DISPLAY: styles[D],
	    TEXT: styles[T],
	    SCRIPT: styles[S],
	    SCRIPTSCRIPT: styles[SS]
	};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This module contains general functions that can be used for building
	 * different kinds of domTree nodes in a consistent manner.
	 */

	var domTree = __webpack_require__(26);
	var fontMetrics = __webpack_require__(3);
	var symbols = __webpack_require__(8);
	var utils = __webpack_require__(1);

	var greekCapitals = [
	    "\\Gamma",
	    "\\Delta",
	    "\\Theta",
	    "\\Lambda",
	    "\\Xi",
	    "\\Pi",
	    "\\Sigma",
	    "\\Upsilon",
	    "\\Phi",
	    "\\Psi",
	    "\\Omega"
	];

	var dotlessLetters = [
	    "\u0131",   // dotless i, \imath
	    "\u0237"    // dotless j, \jmath
	];

	/**
	 * Makes a symbolNode after translation via the list of symbols in symbols.js.
	 * Correctly pulls out metrics for the character, and optionally takes a list of
	 * classes to be attached to the node.
	 */
	var makeSymbol = function(value, style, mode, color, classes) {
	    // Replace the value with its replaced value from symbol.js
	    if (symbols[mode][value] && symbols[mode][value].replace) {
	        value = symbols[mode][value].replace;
	    }

	    var metrics = fontMetrics.getCharacterMetrics(value, style);

	    var symbolNode;
	    if (metrics) {
	        symbolNode = new domTree.symbolNode(
	            value, metrics.height, metrics.depth, metrics.italic, metrics.skew,
	            classes);
	    } else {
	        // TODO(emily): Figure out a good way to only print this in development
	        typeof console !== "undefined" && console.warn(
	            "No character metrics for '" + value + "' in style '" +
	                style + "'");
	        symbolNode = new domTree.symbolNode(value, 0, 0, 0, 0, classes);
	    }

	    if (color) {
	        symbolNode.style.color = color;
	    }

	    return symbolNode;
	};

	/**
	 * Makes a symbol in Main-Regular or AMS-Regular.
	 * Used for rel, bin, open, close, inner, and punct.
	 */
	var mathsym = function(value, mode, color, classes) {
	    // Decide what font to render the symbol in by its entry in the symbols
	    // table.
	    // Have a special case for when the value = \ because the \ is used as a
	    // textord in unsupported command errors but cannot be parsed as a regular
	    // text ordinal and is therefore not present as a symbol in the symbols
	    // table for text
	    if (value === "\\" || symbols[mode][value].font === "main") {
	        return makeSymbol(value, "Main-Regular", mode, color, classes);
	    } else {
	        return makeSymbol(
	            value, "AMS-Regular", mode, color, classes.concat(["amsrm"]));
	    }
	};

	/**
	 * Makes a symbol in the default font for mathords and textords.
	 */
	var mathDefault = function(value, mode, color, classes, type) {
	    if (type === "mathord") {
	        return mathit(value, mode, color, classes);
	    } else if (type === "textord") {
	        return makeSymbol(
	            value, "Main-Regular", mode, color, classes.concat(["mathrm"]));
	    } else {
	        throw new Error("unexpected type: " + type + " in mathDefault");
	    }
	};

	/**
	 * Makes a symbol in the italic math font.
	 */
	var mathit = function(value, mode, color, classes) {
	    if (/[0-9]/.test(value.charAt(0)) ||
	            // glyphs for \imath and \jmath do not exist in Math-Italic so we
	            // need to use Main-Italic instead
	            utils.contains(dotlessLetters, value) ||
	            utils.contains(greekCapitals, value)) {
	        return makeSymbol(
	            value, "Main-Italic", mode, color, classes.concat(["mainit"]));
	    } else {
	        return makeSymbol(
	            value, "Math-Italic", mode, color, classes.concat(["mathit"]));
	    }
	};

	/**
	 * Makes either a mathord or textord in the correct font and color.
	 */
	var makeOrd = function(group, options, type) {
	    var mode = group.mode;
	    var value = group.value;
	    if (symbols[mode][value] && symbols[mode][value].replace) {
	        value = symbols[mode][value].replace;
	    }

	    var classes = ["mord"];
	    var color = options.getColor();

	    var font = options.font;
	    if (font) {
	        if (font === "mathit" || utils.contains(dotlessLetters, value)) {
	            return mathit(value, mode, color, classes);
	        } else {
	            var fontName = fontMap[font].fontName;
	            if (fontMetrics.getCharacterMetrics(value, fontName)) {
	                return makeSymbol(value, fontName, mode, color, classes.concat([font]));
	            } else {
	                return mathDefault(value, mode, color, classes, type);
	            }
	        }
	    } else {
	        return mathDefault(value, mode, color, classes, type);
	    }
	};

	/**
	 * Calculate the height, depth, and maxFontSize of an element based on its
	 * children.
	 */
	var sizeElementFromChildren = function(elem) {
	    var height = 0;
	    var depth = 0;
	    var maxFontSize = 0;

	    if (elem.children) {
	        for (var i = 0; i < elem.children.length; i++) {
	            if (elem.children[i].height > height) {
	                height = elem.children[i].height;
	            }
	            if (elem.children[i].depth > depth) {
	                depth = elem.children[i].depth;
	            }
	            if (elem.children[i].maxFontSize > maxFontSize) {
	                maxFontSize = elem.children[i].maxFontSize;
	            }
	        }
	    }

	    elem.height = height;
	    elem.depth = depth;
	    elem.maxFontSize = maxFontSize;
	};

	/**
	 * Makes a span with the given list of classes, list of children, and color.
	 */
	var makeSpan = function(classes, children, color) {
	    var span = new domTree.span(classes, children);

	    sizeElementFromChildren(span);

	    if (color) {
	        span.style.color = color;
	    }

	    return span;
	};

	/**
	 * Makes a document fragment with the given list of children.
	 */
	var makeFragment = function(children) {
	    var fragment = new domTree.documentFragment(children);

	    sizeElementFromChildren(fragment);

	    return fragment;
	};

	/**
	 * Makes an element placed in each of the vlist elements to ensure that each
	 * element has the same max font size. To do this, we create a zero-width space
	 * with the correct font size.
	 */
	var makeFontSizer = function(options, fontSize) {
	    var fontSizeInner = makeSpan([], [new domTree.symbolNode("\u200b")]);
	    fontSizeInner.style.fontSize = (fontSize / options.style.sizeMultiplier) + "em";

	    var fontSizer = makeSpan(
	        ["fontsize-ensurer", "reset-" + options.size, "size5"],
	        [fontSizeInner]);

	    return fontSizer;
	};

	/**
	 * Makes a vertical list by stacking elements and kerns on top of each other.
	 * Allows for many different ways of specifying the positioning method.
	 *
	 * Arguments:
	 *  - children: A list of child or kern nodes to be stacked on top of each other
	 *              (i.e. the first element will be at the bottom, and the last at
	 *              the top). Element nodes are specified as
	 *                {type: "elem", elem: node}
	 *              while kern nodes are specified as
	 *                {type: "kern", size: size}
	 *  - positionType: The method by which the vlist should be positioned. Valid
	 *                  values are:
	 *                   - "individualShift": The children list only contains elem
	 *                                        nodes, and each node contains an extra
	 *                                        "shift" value of how much it should be
	 *                                        shifted (note that shifting is always
	 *                                        moving downwards). positionData is
	 *                                        ignored.
	 *                   - "top": The positionData specifies the topmost point of
	 *                            the vlist (note this is expected to be a height,
	 *                            so positive values move up)
	 *                   - "bottom": The positionData specifies the bottommost point
	 *                               of the vlist (note this is expected to be a
	 *                               depth, so positive values move down
	 *                   - "shift": The vlist will be positioned such that its
	 *                              baseline is positionData away from the baseline
	 *                              of the first child. Positive values move
	 *                              downwards.
	 *                   - "firstBaseline": The vlist will be positioned such that
	 *                                      its baseline is aligned with the
	 *                                      baseline of the first child.
	 *                                      positionData is ignored. (this is
	 *                                      equivalent to "shift" with
	 *                                      positionData=0)
	 *  - positionData: Data used in different ways depending on positionType
	 *  - options: An Options object
	 *
	 */
	var makeVList = function(children, positionType, positionData, options) {
	    var depth;
	    var currPos;
	    var i;
	    if (positionType === "individualShift") {
	        var oldChildren = children;
	        children = [oldChildren[0]];

	        // Add in kerns to the list of children to get each element to be
	        // shifted to the correct specified shift
	        depth = -oldChildren[0].shift - oldChildren[0].elem.depth;
	        currPos = depth;
	        for (i = 1; i < oldChildren.length; i++) {
	            var diff = -oldChildren[i].shift - currPos -
	                oldChildren[i].elem.depth;
	            var size = diff -
	                (oldChildren[i - 1].elem.height +
	                 oldChildren[i - 1].elem.depth);

	            currPos = currPos + diff;

	            children.push({type: "kern", size: size});
	            children.push(oldChildren[i]);
	        }
	    } else if (positionType === "top") {
	        // We always start at the bottom, so calculate the bottom by adding up
	        // all the sizes
	        var bottom = positionData;
	        for (i = 0; i < children.length; i++) {
	            if (children[i].type === "kern") {
	                bottom -= children[i].size;
	            } else {
	                bottom -= children[i].elem.height + children[i].elem.depth;
	            }
	        }
	        depth = bottom;
	    } else if (positionType === "bottom") {
	        depth = -positionData;
	    } else if (positionType === "shift") {
	        depth = -children[0].elem.depth - positionData;
	    } else if (positionType === "firstBaseline") {
	        depth = -children[0].elem.depth;
	    } else {
	        depth = 0;
	    }

	    // Make the fontSizer
	    var maxFontSize = 0;
	    for (i = 0; i < children.length; i++) {
	        if (children[i].type === "elem") {
	            maxFontSize = Math.max(maxFontSize, children[i].elem.maxFontSize);
	        }
	    }
	    var fontSizer = makeFontSizer(options, maxFontSize);

	    // Create a new list of actual children at the correct offsets
	    var realChildren = [];
	    currPos = depth;
	    for (i = 0; i < children.length; i++) {
	        if (children[i].type === "kern") {
	            currPos += children[i].size;
	        } else {
	            var child = children[i].elem;

	            var shift = -child.depth - currPos;
	            currPos += child.height + child.depth;

	            var childWrap = makeSpan([], [fontSizer, child]);
	            childWrap.height -= shift;
	            childWrap.depth += shift;
	            childWrap.style.top = shift + "em";

	            realChildren.push(childWrap);
	        }
	    }

	    // Add in an element at the end with no offset to fix the calculation of
	    // baselines in some browsers (namely IE, sometimes safari)
	    var baselineFix = makeSpan(
	        ["baseline-fix"], [fontSizer, new domTree.symbolNode("\u200b")]);
	    realChildren.push(baselineFix);

	    var vlist = makeSpan(["vlist"], realChildren);
	    // Fix the final height and depth, in case there were kerns at the ends
	    // since the makeSpan calculation won't take that in to account.
	    vlist.height = Math.max(currPos, vlist.height);
	    vlist.depth = Math.max(-depth, vlist.depth);
	    return vlist;
	};

	// A table of size -> font size for the different sizing functions
	var sizingMultiplier = {
	    size1: 0.5,
	    size2: 0.7,
	    size3: 0.8,
	    size4: 0.9,
	    size5: 1.0,
	    size6: 1.2,
	    size7: 1.44,
	    size8: 1.73,
	    size9: 2.07,
	    size10: 2.49
	};

	// A map of spacing functions to their attributes, like size and corresponding
	// CSS class
	var spacingFunctions = {
	    "\\qquad": {
	        size: "2em",
	        className: "qquad"
	    },
	    "\\quad": {
	        size: "1em",
	        className: "quad"
	    },
	    "\\enspace": {
	        size: "0.5em",
	        className: "enspace"
	    },
	    "\\;": {
	        size: "0.277778em",
	        className: "thickspace"
	    },
	    "\\:": {
	        size: "0.22222em",
	        className: "mediumspace"
	    },
	    "\\,": {
	        size: "0.16667em",
	        className: "thinspace"
	    },
	    "\\!": {
	        size: "-0.16667em",
	        className: "negativethinspace"
	    }
	};

	/**
	 * Maps TeX font commands to objects containing:
	 * - variant: string used for "mathvariant" attribute in buildMathML.js
	 * - fontName: the "style" parameter to fontMetrics.getCharacterMetrics
	 */
	// A map between tex font commands an MathML mathvariant attribute values
	var fontMap = {
	    // styles
	    "mathbf": {
	        variant: "bold",
	        fontName: "Main-Bold"
	    },
	    "mathrm": {
	        variant: "normal",
	        fontName: "Main-Regular"
	    },

	    // "mathit" is missing because it requires the use of two fonts: Main-Italic
	    // and Math-Italic.  This is handled by a special case in makeOrd which ends
	    // up calling mathit.

	    // families
	    "mathbb": {
	        variant: "double-struck",
	        fontName: "AMS-Regular"
	    },
	    "mathcal": {
	        variant: "script",
	        fontName: "Caligraphic-Regular"
	    },
	    "mathfrak": {
	        variant: "fraktur",
	        fontName: "Fraktur-Regular"
	    },
	    "mathscr": {
	        variant: "script",
	        fontName: "Script-Regular"
	    },
	    "mathsf": {
	        variant: "sans-serif",
	        fontName: "SansSerif-Regular"
	    },
	    "mathtt": {
	        variant: "monospace",
	        fontName: "Typewriter-Regular"
	    }
	};

	module.exports = {
	    fontMap: fontMap,
	    makeSymbol: makeSymbol,
	    mathsym: mathsym,
	    makeSpan: makeSpan,
	    makeFragment: makeFragment,
	    makeVList: makeVList,
	    makeOrd: makeOrd,
	    sizingMultiplier: sizingMultiplier,
	    spacingFunctions: spacingFunctions
	};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/**
	 * This file holds a list of all no-argument functions and single-character
	 * symbols (like 'a' or ';').
	 *
	 * For each of the symbols, there are three properties they can have:
	 * - font (required): the font to be used for this symbol. Either "main" (the
	     normal font), or "ams" (the ams fonts).
	 * - group (required): the ParseNode group type the symbol should have (i.e.
	     "textord", "mathord", etc).
	     See https://github.com/Khan/KaTeX/wiki/Examining-TeX#group-types
	 * - replace (optional): the character that this symbol or function should be
	 *   replaced with (i.e. "\phi" has a replace value of "\u03d5", the phi
	 *   character in the main font).
	 *
	 * The outermost map in the table indicates what mode the symbols should be
	 * accepted in (e.g. "math" or "text").
	 */

	var symbols = {
	    "math": {
	        // Relation Symbols
	        "\\equiv": {
	            font: "main",
	            group: "rel",
	            replace: "\u2261"
	        },
	        "\\prec": {
	            font: "main",
	            group: "rel",
	            replace: "\u227a"
	        },
	        "\\succ": {
	            font: "main",
	            group: "rel",
	            replace: "\u227b"
	        },
	        "\\sim": {
	            font: "main",
	            group: "rel",
	            replace: "\u223c"
	        },
	        "\\perp": {
	            font: "main",
	            group: "rel",
	            replace: "\u22a5"
	        },
	        "\\preceq": {
	            font: "main",
	            group: "rel",
	            replace: "\u2aaf"
	        },
	        "\\succeq": {
	            font: "main",
	            group: "rel",
	            replace: "\u2ab0"
	        },
	        "\\simeq": {
	            font: "main",
	            group: "rel",
	            replace: "\u2243"
	        },
	        "\\mid": {
	            font: "main",
	            group: "rel",
	            replace: "\u2223"
	        },
	        "\\ll": {
	            font: "main",
	            group: "rel",
	            replace: "\u226a"
	        },
	        "\\gg": {
	            font: "main",
	            group: "rel",
	            replace: "\u226b"
	        },
	        "\\asymp": {
	            font: "main",
	            group: "rel",
	            replace: "\u224d"
	        },
	        "\\parallel": {
	            font: "main",
	            group: "rel",
	            replace: "\u2225"
	        },
	        "\\bowtie": {
	            font: "main",
	            group: "rel",
	            replace: "\u22c8"
	        },
	        "\\smile": {
	            font: "main",
	            group: "rel",
	            replace: "\u2323"
	        },
	        "\\sqsubseteq": {
	            font: "main",
	            group: "rel",
	            replace: "\u2291"
	        },
	        "\\sqsupseteq": {
	            font: "main",
	            group: "rel",
	            replace: "\u2292"
	        },
	        "\\doteq": {
	            font: "main",
	            group: "rel",
	            replace: "\u2250"
	        },
	        "\\frown": {
	            font: "main",
	            group: "rel",
	            replace: "\u2322"
	        },
	        "\\ni": {
	            font: "main",
	            group: "rel",
	            replace: "\u220b"
	        },
	        "\\propto": {
	            font: "main",
	            group: "rel",
	            replace: "\u221d"
	        },
	        "\\vdash": {
	            font: "main",
	            group: "rel",
	            replace: "\u22a2"
	        },
	        "\\dashv": {
	            font: "main",
	            group: "rel",
	            replace: "\u22a3"
	        },
	        "\\owns": {
	            font: "main",
	            group: "rel",
	            replace: "\u220b"
	        },

	        // Punctuation
	        "\\ldotp": {
	            font: "main",
	            group: "punct",
	            replace: "\u002e"
	        },
	        "\\cdotp": {
	            font: "main",
	            group: "punct",
	            replace: "\u22c5"
	        },

	        // Misc Symbols
	        "\\#": {
	          font: "main",
	          group: "textord",
	          replace: "\u0023"
	        },
	        "\\&": {
	          font: "main",
	          group: "textord",
	          replace: "\u0026"
	        },
	        "\\aleph": {
	            font: "main",
	            group: "textord",
	            replace: "\u2135"
	        },
	        "\\forall": {
	            font: "main",
	            group: "textord",
	            replace: "\u2200"
	        },
	        "\\hbar": {
	            font: "main",
	            group: "textord",
	            replace: "\u210f"
	        },
	        "\\exists": {
	            font: "main",
	            group: "textord",
	            replace: "\u2203"
	        },
	        "\\nabla": {
	            font: "main",
	            group: "textord",
	            replace: "\u2207"
	        },
	        "\\flat": {
	            font: "main",
	            group: "textord",
	            replace: "\u266d"
	        },
	        "\\ell": {
	            font: "main",
	            group: "textord",
	            replace: "\u2113"
	        },
	        "\\natural": {
	            font: "main",
	            group: "textord",
	            replace: "\u266e"
	        },
	        "\\clubsuit": {
	            font: "main",
	            group: "textord",
	            replace: "\u2663"
	        },
	        "\\wp": {
	            font: "main",
	            group: "textord",
	            replace: "\u2118"
	        },
	        "\\sharp": {
	            font: "main",
	            group: "textord",
	            replace: "\u266f"
	        },
	        "\\diamondsuit": {
	            font: "main",
	            group: "textord",
	            replace: "\u2662"
	        },
	        "\\Re": {
	            font: "main",
	            group: "textord",
	            replace: "\u211c"
	        },
	        "\\heartsuit": {
	            font: "main",
	            group: "textord",
	            replace: "\u2661"
	        },
	        "\\Im": {
	            font: "main",
	            group: "textord",
	            replace: "\u2111"
	        },
	        "\\spadesuit": {
	            font: "main",
	            group: "textord",
	            replace: "\u2660"
	        },

	        // Math and Text
	        "\\dag": {
	            font: "main",
	            group: "textord",
	            replace: "\u2020"
	        },
	        "\\ddag": {
	            font: "main",
	            group: "textord",
	            replace: "\u2021"
	        },

	        // Large Delimiters
	        "\\rmoustache": {
	            font: "main",
	            group: "close",
	            replace: "\u23b1"
	        },
	        "\\lmoustache": {
	            font: "main",
	            group: "open",
	            replace: "\u23b0"
	        },
	        "\\rgroup": {
	            font: "main",
	            group: "close",
	            replace: "\u27ef"
	        },
	        "\\lgroup": {
	            font: "main",
	            group: "open",
	            replace: "\u27ee"
	        },

	        // Binary Operators
	        "\\mp": {
	            font: "main",
	            group: "bin",
	            replace: "\u2213"
	        },
	        "\\ominus": {
	            font: "main",
	            group: "bin",
	            replace: "\u2296"
	        },
	        "\\uplus": {
	            font: "main",
	            group: "bin",
	            replace: "\u228e"
	        },
	        "\\sqcap": {
	            font: "main",
	            group: "bin",
	            replace: "\u2293"
	        },
	        "\\ast": {
	            font: "main",
	            group: "bin",
	            replace: "\u2217"
	        },
	        "\\sqcup": {
	            font: "main",
	            group: "bin",
	            replace: "\u2294"
	        },
	        "\\bigcirc": {
	            font: "main",
	            group: "bin",
	            replace: "\u25ef"
	        },
	        "\\bullet": {
	            font: "main",
	            group: "bin",
	            replace: "\u2219"
	        },
	        "\\ddagger": {
	            font: "main",
	            group: "bin",
	            replace: "\u2021"
	        },
	        "\\wr": {
	            font: "main",
	            group: "bin",
	            replace: "\u2240"
	        },
	        "\\amalg": {
	            font: "main",
	            group: "bin",
	            replace: "\u2a3f"
	        },

	        // Arrow Symbols
	        "\\longleftarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u27f5"
	        },
	        "\\Leftarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u21d0"
	        },
	        "\\Longleftarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u27f8"
	        },
	        "\\longrightarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u27f6"
	        },
	        "\\Rightarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u21d2"
	        },
	        "\\Longrightarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u27f9"
	        },
	        "\\leftrightarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u2194"
	        },
	        "\\longleftrightarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u27f7"
	        },
	        "\\Leftrightarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u21d4"
	        },
	        "\\Longleftrightarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u27fa"
	        },
	        "\\mapsto": {
	            font: "main",
	            group: "rel",
	            replace: "\u21a6"
	        },
	        "\\longmapsto": {
	            font: "main",
	            group: "rel",
	            replace: "\u27fc"
	        },
	        "\\nearrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u2197"
	        },
	        "\\hookleftarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u21a9"
	        },
	        "\\hookrightarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u21aa"
	        },
	        "\\searrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u2198"
	        },
	        "\\leftharpoonup": {
	            font: "main",
	            group: "rel",
	            replace: "\u21bc"
	        },
	        "\\rightharpoonup": {
	            font: "main",
	            group: "rel",
	            replace: "\u21c0"
	        },
	        "\\swarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u2199"
	        },
	        "\\leftharpoondown": {
	            font: "main",
	            group: "rel",
	            replace: "\u21bd"
	        },
	        "\\rightharpoondown": {
	            font: "main",
	            group: "rel",
	            replace: "\u21c1"
	        },
	        "\\nwarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u2196"
	        },
	        "\\rightleftharpoons": {
	            font: "main",
	            group: "rel",
	            replace: "\u21cc"
	        },

	        // AMS Negated Binary Relations
	        "\\nless": {
	            font: "ams",
	            group: "rel",
	            replace: "\u226e"
	        },
	        "\\nleqslant": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue010"
	        },
	        "\\nleqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue011"
	        },
	        "\\lneq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2a87"
	        },
	        "\\lneqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2268"
	        },
	        "\\lvertneqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue00c"
	        },
	        "\\lnsim": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22e6"
	        },
	        "\\lnapprox": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2a89"
	        },
	        "\\nprec": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2280"
	        },
	        "\\npreceq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22e0"
	        },
	        "\\precnsim": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22e8"
	        },
	        "\\precnapprox": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2ab9"
	        },
	        "\\nsim": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2241"
	        },
	        "\\nshortmid": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue006"
	        },
	        "\\nmid": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2224"
	        },
	        "\\nvdash": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22ac"
	        },
	        "\\nvDash": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22ad"
	        },
	        "\\ntriangleleft": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22ea"
	        },
	        "\\ntrianglelefteq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22ec"
	        },
	        "\\subsetneq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u228a"
	        },
	        "\\varsubsetneq": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue01a"
	        },
	        "\\subsetneqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2acb"
	        },
	        "\\varsubsetneqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue017"
	        },
	        "\\ngtr": {
	            font: "ams",
	            group: "rel",
	            replace: "\u226f"
	        },
	        "\\ngeqslant": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue00f"
	        },
	        "\\ngeqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue00e"
	        },
	        "\\gneq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2a88"
	        },
	        "\\gneqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2269"
	        },
	        "\\gvertneqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue00d"
	        },
	        "\\gnsim": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22e7"
	        },
	        "\\gnapprox": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2a8a"
	        },
	        "\\nsucc": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2281"
	        },
	        "\\nsucceq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22e1"
	        },
	        "\\succnsim": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22e9"
	        },
	        "\\succnapprox": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2aba"
	        },
	        "\\ncong": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2246"
	        },
	        "\\nshortparallel": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue007"
	        },
	        "\\nparallel": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2226"
	        },
	        "\\nVDash": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22af"
	        },
	        "\\ntriangleright": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22eb"
	        },
	        "\\ntrianglerighteq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22ed"
	        },
	        "\\nsupseteqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue018"
	        },
	        "\\supsetneq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u228b"
	        },
	        "\\varsupsetneq": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue01b"
	        },
	        "\\supsetneqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2acc"
	        },
	        "\\varsupsetneqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue019"
	        },
	        "\\nVdash": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22ae"
	        },
	        "\\precneqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2ab5"
	        },
	        "\\succneqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2ab6"
	        },
	        "\\nsubseteqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\ue016"
	        },
	        "\\unlhd": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22b4"
	        },
	        "\\unrhd": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22b5"
	        },

	        // AMS Negated Arrows
	         "\\nleftarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u219a"
	        },
	        "\\nrightarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u219b"
	        },
	        "\\nLeftarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21cd"
	        },
	        "\\nRightarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21cf"
	        },
	        "\\nleftrightarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21ae"
	        },
	        "\\nLeftrightarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21ce"
	        },

	        // AMS Misc
	        "\\vartriangle": {
	            font: "ams",
	            group: "rel",
	            replace: "\u25b3"
	        },
	        "\\hslash": {
	            font: "ams",
	            group: "textord",
	            replace: "\u210f"
	        },
	        "\\triangledown": {
	            font: "ams",
	            group: "textord",
	            replace: "\u25bd"
	        },
	        "\\lozenge": {
	            font: "ams",
	            group: "textord",
	            replace: "\u25ca"
	        },
	        "\\circledS": {
	            font: "ams",
	            group: "textord",
	            replace: "\u24c8"
	        },
	        "\\circledR": {
	            font: "ams",
	            group: "textord",
	            replace: "\u00ae"
	        },
	        "\\measuredangle": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2221"
	        },
	        "\\nexists": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2204"
	        },
	        "\\mho": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2127"
	        },
	        "\\Finv": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2132"
	        },
	        "\\Game": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2141"
	        },
	        "\\Bbbk": {
	            font: "ams",
	            group: "textord",
	            replace: "\u006b"
	        },
	        "\\backprime": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2035"
	        },
	        "\\blacktriangle": {
	            font: "ams",
	            group: "textord",
	            replace: "\u25b2"
	        },
	        "\\blacktriangledown": {
	            font: "ams",
	            group: "textord",
	            replace: "\u25bc"
	        },
	        "\\blacksquare": {
	            font: "ams",
	            group: "textord",
	            replace: "\u25a0"
	        },
	        "\\blacklozenge": {
	            font: "ams",
	            group: "textord",
	            replace: "\u29eb"
	        },
	        "\\bigstar": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2605"
	        },
	        "\\sphericalangle": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2222"
	        },
	        "\\complement": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2201"
	        },
	        "\\eth": {
	            font: "ams",
	            group: "textord",
	            replace: "\u00f0"
	        },
	        "\\diagup": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2571"
	        },
	        "\\diagdown": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2572"
	        },
	        "\\square": {
	            font: "ams",
	            group: "textord",
	            replace: "\u25a1"
	        },
	        "\\Box": {
	            font: "ams",
	            group: "textord",
	            replace: "\u25a1"
	        },
	        "\\Diamond": {
	            font: "ams",
	            group: "textord",
	            replace: "\u25ca"
	        },
	        "\\yen": {
	            font: "ams",
	            group: "textord",
	            replace: "\u00a5"
	        },
	        "\\checkmark": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2713"
	        },

	        // AMS Hebrew
	        "\\beth": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2136"
	        },
	        "\\daleth": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2138"
	        },
	        "\\gimel": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2137"
	        },

	        // AMS Greek
	        "\\digamma": {
	            font: "ams",
	            group: "textord",
	            replace: "\u03dd"
	        },
	        "\\varkappa": {
	            font: "ams",
	            group: "textord",
	            replace: "\u03f0"
	        },

	        // AMS Delimiters
	        "\\ulcorner": {
	            font: "ams",
	            group: "open",
	            replace: "\u250c"
	        },
	        "\\urcorner": {
	            font: "ams",
	            group: "close",
	            replace: "\u2510"
	        },
	        "\\llcorner": {
	            font: "ams",
	            group: "open",
	            replace: "\u2514"
	        },
	        "\\lrcorner": {
	            font: "ams",
	            group: "close",
	            replace: "\u2518"
	        },

	        // AMS Binary Relations
	        "\\leqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2266"
	        },
	        "\\leqslant": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2a7d"
	        },
	        "\\eqslantless": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2a95"
	        },
	        "\\lesssim": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2272"
	        },
	        "\\lessapprox": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2a85"
	        },
	        "\\approxeq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u224a"
	        },
	        "\\lessdot": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22d6"
	        },
	        "\\lll": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22d8"
	        },
	        "\\lessgtr": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2276"
	        },
	        "\\lesseqgtr": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22da"
	        },
	        "\\lesseqqgtr": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2a8b"
	        },
	        "\\doteqdot": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2251"
	        },
	        "\\risingdotseq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2253"
	        },
	        "\\fallingdotseq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2252"
	        },
	        "\\backsim": {
	            font: "ams",
	            group: "rel",
	            replace: "\u223d"
	        },
	        "\\backsimeq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22cd"
	        },
	        "\\subseteqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2ac5"
	        },
	        "\\Subset": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22d0"
	        },
	        "\\sqsubset": {
	            font: "ams",
	            group: "rel",
	            replace: "\u228f"
	        },
	        "\\preccurlyeq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u227c"
	        },
	        "\\curlyeqprec": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22de"
	        },
	        "\\precsim": {
	            font: "ams",
	            group: "rel",
	            replace: "\u227e"
	        },
	        "\\precapprox": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2ab7"
	        },
	        "\\vartriangleleft": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22b2"
	        },
	        "\\trianglelefteq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22b4"
	        },
	        "\\vDash": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22a8"
	        },
	        "\\Vvdash": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22aa"
	        },
	        "\\smallsmile": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2323"
	        },
	        "\\smallfrown": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2322"
	        },
	        "\\bumpeq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u224f"
	        },
	        "\\Bumpeq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u224e"
	        },
	        "\\geqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2267"
	        },
	        "\\geqslant": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2a7e"
	        },
	        "\\eqslantgtr": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2a96"
	        },
	        "\\gtrsim": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2273"
	        },
	        "\\gtrapprox": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2a86"
	        },
	        "\\gtrdot": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22d7"
	        },
	        "\\ggg": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22d9"
	        },
	        "\\gtrless": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2277"
	        },
	        "\\gtreqless": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22db"
	        },
	        "\\gtreqqless": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2a8c"
	        },
	        "\\eqcirc": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2256"
	        },
	        "\\circeq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2257"
	        },
	        "\\triangleq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u225c"
	        },
	        "\\thicksim": {
	            font: "ams",
	            group: "rel",
	            replace: "\u223c"
	        },
	        "\\thickapprox": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2248"
	        },
	        "\\supseteqq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2ac6"
	        },
	        "\\Supset": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22d1"
	        },
	        "\\sqsupset": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2290"
	        },
	        "\\succcurlyeq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u227d"
	        },
	        "\\curlyeqsucc": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22df"
	        },
	        "\\succsim": {
	            font: "ams",
	            group: "rel",
	            replace: "\u227f"
	        },
	        "\\succapprox": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2ab8"
	        },
	        "\\vartriangleright": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22b3"
	        },
	        "\\trianglerighteq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22b5"
	        },
	        "\\Vdash": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22a9"
	        },
	        "\\shortmid": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2223"
	        },
	        "\\shortparallel": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2225"
	        },
	        "\\between": {
	            font: "ams",
	            group: "rel",
	            replace: "\u226c"
	        },
	        "\\pitchfork": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22d4"
	        },
	        "\\varpropto": {
	            font: "ams",
	            group: "rel",
	            replace: "\u221d"
	        },
	        "\\blacktriangleleft": {
	            font: "ams",
	            group: "rel",
	            replace: "\u25c0"
	        },
	        "\\therefore": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2234"
	        },
	        "\\backepsilon": {
	            font: "ams",
	            group: "rel",
	            replace: "\u220d"
	        },
	        "\\blacktriangleright": {
	            font: "ams",
	            group: "rel",
	            replace: "\u25b6"
	        },
	        "\\because": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2235"
	        },
	        "\\llless": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22d8"
	        },
	        "\\gggtr": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22d9"
	        },
	        "\\lhd": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22b2"
	        },
	        "\\rhd": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22b3"
	        },
	        "\\eqsim": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2242"
	        },
	        "\\Join": {
	            font: "main",
	            group: "rel",
	            replace: "\u22c8"
	        },
	        "\\Doteq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2251"
	        },

	        // AMS Binary Operators
	        "\\dotplus": {
	            font: "ams",
	            group: "bin",
	            replace: "\u2214"
	        },
	        "\\smallsetminus": {
	            font: "ams",
	            group: "bin",
	            replace: "\u2216"
	        },
	        "\\Cap": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22d2"
	        },
	        "\\Cup": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22d3"
	        },
	        "\\doublebarwedge": {
	            font: "ams",
	            group: "bin",
	            replace: "\u2a5e"
	        },
	        "\\boxminus": {
	            font: "ams",
	            group: "bin",
	            replace: "\u229f"
	        },
	        "\\boxplus": {
	            font: "ams",
	            group: "bin",
	            replace: "\u229e"
	        },
	        "\\divideontimes": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22c7"
	        },
	        "\\ltimes": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22c9"
	        },
	        "\\rtimes": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22ca"
	        },
	        "\\leftthreetimes": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22cb"
	        },
	        "\\rightthreetimes": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22cc"
	        },
	        "\\curlywedge": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22cf"
	        },
	        "\\curlyvee": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22ce"
	        },
	        "\\circleddash": {
	            font: "ams",
	            group: "bin",
	            replace: "\u229d"
	        },
	        "\\circledast": {
	            font: "ams",
	            group: "bin",
	            replace: "\u229b"
	        },
	        "\\centerdot": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22c5"
	        },
	        "\\intercal": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22ba"
	        },
	        "\\doublecap": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22d2"
	        },
	        "\\doublecup": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22d3"
	        },
	        "\\boxtimes": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22a0"
	        },

	        // AMS Arrows
	        "\\dashrightarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21e2"
	        },
	        "\\dashleftarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21e0"
	        },
	        "\\leftleftarrows": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21c7"
	        },
	        "\\leftrightarrows": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21c6"
	        },
	        "\\Lleftarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21da"
	        },
	        "\\twoheadleftarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u219e"
	        },
	        "\\leftarrowtail": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21a2"
	        },
	        "\\looparrowleft": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21ab"
	        },
	        "\\leftrightharpoons": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21cb"
	        },
	        "\\curvearrowleft": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21b6"
	        },
	        "\\circlearrowleft": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21ba"
	        },
	        "\\Lsh": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21b0"
	        },
	        "\\upuparrows": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21c8"
	        },
	        "\\upharpoonleft": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21bf"
	        },
	        "\\downharpoonleft": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21c3"
	        },
	        "\\multimap": {
	            font: "ams",
	            group: "rel",
	            replace: "\u22b8"
	        },
	        "\\leftrightsquigarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21ad"
	        },
	        "\\rightrightarrows": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21c9"
	        },
	        "\\rightleftarrows": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21c4"
	        },
	        "\\twoheadrightarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21a0"
	        },
	        "\\rightarrowtail": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21a3"
	        },
	        "\\looparrowright": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21ac"
	        },
	        "\\curvearrowright": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21b7"
	        },
	        "\\circlearrowright": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21bb"
	        },
	        "\\Rsh": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21b1"
	        },
	        "\\downdownarrows": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21ca"
	        },
	        "\\upharpoonright": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21be"
	        },
	        "\\downharpoonright": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21c2"
	        },
	        "\\rightsquigarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21dd"
	        },
	        "\\leadsto": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21dd"
	        },
	        "\\Rrightarrow": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21db"
	        },
	        "\\restriction": {
	            font: "ams",
	            group: "rel",
	            replace: "\u21be"
	        },

	        "`": {
	            font: "main",
	            group: "textord",
	            replace: "\u2018"
	        },
	        "\\$": {
	            font: "main",
	            group: "textord",
	            replace: "$"
	        },
	        "\\%": {
	            font: "main",
	            group: "textord",
	            replace: "%"
	        },
	        "\\_": {
	            font: "main",
	            group: "textord",
	            replace: "_"
	        },
	        "\\angle": {
	            font: "main",
	            group: "textord",
	            replace: "\u2220"
	        },
	        "\\infty": {
	            font: "main",
	            group: "textord",
	            replace: "\u221e"
	        },
	        "\\prime": {
	            font: "main",
	            group: "textord",
	            replace: "\u2032"
	        },
	        "\\triangle": {
	            font: "main",
	            group: "textord",
	            replace: "\u25b3"
	        },
	        "\\Gamma": {
	            font: "main",
	            group: "textord",
	            replace: "\u0393"
	        },
	        "\\Delta": {
	            font: "main",
	            group: "textord",
	            replace: "\u0394"
	        },
	        "\\Theta": {
	            font: "main",
	            group: "textord",
	            replace: "\u0398"
	        },
	        "\\Lambda": {
	            font: "main",
	            group: "textord",
	            replace: "\u039b"
	        },
	        "\\Xi": {
	            font: "main",
	            group: "textord",
	            replace: "\u039e"
	        },
	        "\\Pi": {
	            font: "main",
	            group: "textord",
	            replace: "\u03a0"
	        },
	        "\\Sigma": {
	            font: "main",
	            group: "textord",
	            replace: "\u03a3"
	        },
	        "\\Upsilon": {
	            font: "main",
	            group: "textord",
	            replace: "\u03a5"
	        },
	        "\\Phi": {
	            font: "main",
	            group: "textord",
	            replace: "\u03a6"
	        },
	        "\\Psi": {
	            font: "main",
	            group: "textord",
	            replace: "\u03a8"
	        },
	        "\\Omega": {
	            font: "main",
	            group: "textord",
	            replace: "\u03a9"
	        },
	        "\\neg": {
	            font: "main",
	            group: "textord",
	            replace: "\u00ac"
	        },
	        "\\lnot": {
	            font: "main",
	            group: "textord",
	            replace: "\u00ac"
	        },
	        "\\top": {
	            font: "main",
	            group: "textord",
	            replace: "\u22a4"
	        },
	        "\\bot": {
	            font: "main",
	            group: "textord",
	            replace: "\u22a5"
	        },
	        "\\emptyset": {
	            font: "main",
	            group: "textord",
	            replace: "\u2205"
	        },
	        "\\varnothing": {
	            font: "ams",
	            group: "textord",
	            replace: "\u2205"
	        },
	        "\\alpha": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03b1"
	        },
	        "\\beta": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03b2"
	        },
	        "\\gamma": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03b3"
	        },
	        "\\delta": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03b4"
	        },
	        "\\epsilon": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03f5"
	        },
	        "\\zeta": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03b6"
	        },
	        "\\eta": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03b7"
	        },
	        "\\theta": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03b8"
	        },
	        "\\iota": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03b9"
	        },
	        "\\kappa": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03ba"
	        },
	        "\\lambda": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03bb"
	        },
	        "\\mu": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03bc"
	        },
	        "\\nu": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03bd"
	        },
	        "\\xi": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03be"
	        },
	        "\\omicron": {
	            font: "main",
	            group: "mathord",
	            replace: "o"
	        },
	        "\\pi": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03c0"
	        },
	        "\\rho": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03c1"
	        },
	        "\\sigma": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03c3"
	        },
	        "\\tau": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03c4"
	        },
	        "\\upsilon": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03c5"
	        },
	        "\\phi": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03d5"
	        },
	        "\\chi": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03c7"
	        },
	        "\\psi": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03c8"
	        },
	        "\\omega": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03c9"
	        },
	        "\\varepsilon": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03b5"
	        },
	        "\\vartheta": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03d1"
	        },
	        "\\varpi": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03d6"
	        },
	        "\\varrho": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03f1"
	        },
	        "\\varsigma": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03c2"
	        },
	        "\\varphi": {
	            font: "main",
	            group: "mathord",
	            replace: "\u03c6"
	        },
	        "*": {
	            font: "main",
	            group: "bin",
	            replace: "\u2217"
	        },
	        "+": {
	            font: "main",
	            group: "bin"
	        },
	        "-": {
	            font: "main",
	            group: "bin",
	            replace: "\u2212"
	        },
	        "\\cdot": {
	            font: "main",
	            group: "bin",
	            replace: "\u22c5"
	        },
	        "\\circ": {
	            font: "main",
	            group: "bin",
	            replace: "\u2218"
	        },
	        "\\div": {
	            font: "main",
	            group: "bin",
	            replace: "\u00f7"
	        },
	        "\\pm": {
	            font: "main",
	            group: "bin",
	            replace: "\u00b1"
	        },
	        "\\times": {
	            font: "main",
	            group: "bin",
	            replace: "\u00d7"
	        },
	        "\\cap": {
	            font: "main",
	            group: "bin",
	            replace: "\u2229"
	        },
	        "\\cup": {
	            font: "main",
	            group: "bin",
	            replace: "\u222a"
	        },
	        "\\setminus": {
	            font: "main",
	            group: "bin",
	            replace: "\u2216"
	        },
	        "\\land": {
	            font: "main",
	            group: "bin",
	            replace: "\u2227"
	        },
	        "\\lor": {
	            font: "main",
	            group: "bin",
	            replace: "\u2228"
	        },
	        "\\wedge": {
	            font: "main",
	            group: "bin",
	            replace: "\u2227"
	        },
	        "\\vee": {
	            font: "main",
	            group: "bin",
	            replace: "\u2228"
	        },
	        "\\surd": {
	            font: "main",
	            group: "textord",
	            replace: "\u221a"
	        },
	        "(": {
	            font: "main",
	            group: "open"
	        },
	        "[": {
	            font: "main",
	            group: "open"
	        },
	        "\\langle": {
	            font: "main",
	            group: "open",
	            replace: "\u27e8"
	        },
	        "\\lvert": {
	            font: "main",
	            group: "open",
	            replace: "\u2223"
	        },
	        "\\lVert": {
	            font: "main",
	            group: "open",
	            replace: "\u2225"
	        },
	        ")": {
	            font: "main",
	            group: "close"
	        },
	        "]": {
	            font: "main",
	            group: "close"
	        },
	        "?": {
	            font: "main",
	            group: "close"
	        },
	        "!": {
	            font: "main",
	            group: "close"
	        },
	        "\\rangle": {
	            font: "main",
	            group: "close",
	            replace: "\u27e9"
	        },
	        "\\rvert": {
	            font: "main",
	            group: "close",
	            replace: "\u2223"
	        },
	        "\\rVert": {
	            font: "main",
	            group: "close",
	            replace: "\u2225"
	        },
	        "=": {
	            font: "main",
	            group: "rel"
	        },
	        "<": {
	            font: "main",
	            group: "rel"
	        },
	        ">": {
	            font: "main",
	            group: "rel"
	        },
	        ":": {
	            font: "main",
	            group: "rel"
	        },
	        "\\approx": {
	            font: "main",
	            group: "rel",
	            replace: "\u2248"
	        },
	        "\\cong": {
	            font: "main",
	            group: "rel",
	            replace: "\u2245"
	        },
	        "\\ge": {
	            font: "main",
	            group: "rel",
	            replace: "\u2265"
	        },
	        "\\geq": {
	            font: "main",
	            group: "rel",
	            replace: "\u2265"
	        },
	        "\\gets": {
	            font: "main",
	            group: "rel",
	            replace: "\u2190"
	        },
	        "\\in": {
	            font: "main",
	            group: "rel",
	            replace: "\u2208"
	        },
	        "\\notin": {
	            font: "main",
	            group: "rel",
	            replace: "\u2209"
	        },
	        "\\subset": {
	            font: "main",
	            group: "rel",
	            replace: "\u2282"
	        },
	        "\\supset": {
	            font: "main",
	            group: "rel",
	            replace: "\u2283"
	        },
	        "\\subseteq": {
	            font: "main",
	            group: "rel",
	            replace: "\u2286"
	        },
	        "\\supseteq": {
	            font: "main",
	            group: "rel",
	            replace: "\u2287"
	        },
	        "\\nsubseteq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2288"
	        },
	        "\\nsupseteq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2289"
	        },
	        "\\models": {
	            font: "main",
	            group: "rel",
	            replace: "\u22a8"
	        },
	        "\\leftarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u2190"
	        },
	        "\\le": {
	            font: "main",
	            group: "rel",
	            replace: "\u2264"
	        },
	        "\\leq": {
	            font: "main",
	            group: "rel",
	            replace: "\u2264"
	        },
	        "\\ne": {
	            font: "main",
	            group: "rel",
	            replace: "\u2260"
	        },
	        "\\neq": {
	            font: "main",
	            group: "rel",
	            replace: "\u2260"
	        },
	        "\\rightarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u2192"
	        },
	        "\\to": {
	            font: "main",
	            group: "rel",
	            replace: "\u2192"
	        },
	        "\\ngeq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2271"
	        },
	        "\\nleq": {
	            font: "ams",
	            group: "rel",
	            replace: "\u2270"
	        },
	        "\\!": {
	            font: "main",
	            group: "spacing"
	        },
	        "\\ ": {
	            font: "main",
	            group: "spacing",
	            replace: "\u00a0"
	        },
	        "~": {
	            font: "main",
	            group: "spacing",
	            replace: "\u00a0"
	        },
	        "\\,": {
	            font: "main",
	            group: "spacing"
	        },
	        "\\:": {
	            font: "main",
	            group: "spacing"
	        },
	        "\\;": {
	            font: "main",
	            group: "spacing"
	        },
	        "\\enspace": {
	            font: "main",
	            group: "spacing"
	        },
	        "\\qquad": {
	            font: "main",
	            group: "spacing"
	        },
	        "\\quad": {
	            font: "main",
	            group: "spacing"
	        },
	        "\\space": {
	            font: "main",
	            group: "spacing",
	            replace: "\u00a0"
	        },
	        ",": {
	            font: "main",
	            group: "punct"
	        },
	        ";": {
	            font: "main",
	            group: "punct"
	        },
	        "\\colon": {
	            font: "main",
	            group: "punct",
	            replace: ":"
	        },
	        "\\barwedge": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22bc"
	        },
	        "\\veebar": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22bb"
	        },
	        "\\odot": {
	            font: "main",
	            group: "bin",
	            replace: "\u2299"
	        },
	        "\\oplus": {
	            font: "main",
	            group: "bin",
	            replace: "\u2295"
	        },
	        "\\otimes": {
	            font: "main",
	            group: "bin",
	            replace: "\u2297"
	        },
	        "\\partial":{
	            font: "main",
	            group: "textord",
	            replace: "\u2202"
	        },
	        "\\oslash": {
	            font: "main",
	            group: "bin",
	            replace: "\u2298"
	        },
	        "\\circledcirc": {
	            font: "ams",
	            group: "bin",
	            replace: "\u229a"
	        },
	        "\\boxdot": {
	            font: "ams",
	            group: "bin",
	            replace: "\u22a1"
	        },
	        "\\bigtriangleup": {
	            font: "main",
	            group: "bin",
	            replace: "\u25b3"
	        },
	        "\\bigtriangledown": {
	            font: "main",
	            group: "bin",
	            replace: "\u25bd"
	        },
	        "\\dagger": {
	            font: "main",
	            group: "bin",
	            replace: "\u2020"
	        },
	        "\\diamond": {
	            font: "main",
	            group: "bin",
	            replace: "\u22c4"
	        },
	        "\\star": {
	            font: "main",
	            group: "bin",
	            replace: "\u22c6"
	        },
	        "\\triangleleft": {
	            font: "main",
	            group: "bin",
	            replace: "\u25c3"
	        },
	        "\\triangleright": {
	            font: "main",
	            group: "bin",
	            replace: "\u25b9"
	        },
	        "\\{": {
	            font: "main",
	            group: "open",
	            replace: "{"
	        },
	        "\\}": {
	            font: "main",
	            group: "close",
	            replace: "}"
	        },
	        "\\lbrace": {
	            font: "main",
	            group: "open",
	            replace: "{"
	        },
	        "\\rbrace": {
	            font: "main",
	            group: "close",
	            replace: "}"
	        },
	        "\\lbrack": {
	            font: "main",
	            group: "open",
	            replace: "["
	        },
	        "\\rbrack": {
	            font: "main",
	            group: "close",
	            replace: "]"
	        },
	        "\\lfloor": {
	            font: "main",
	            group: "open",
	            replace: "\u230a"
	        },
	        "\\rfloor": {
	            font: "main",
	            group: "close",
	            replace: "\u230b"
	        },
	        "\\lceil": {
	            font: "main",
	            group: "open",
	            replace: "\u2308"
	        },
	        "\\rceil": {
	            font: "main",
	            group: "close",
	            replace: "\u2309"
	        },
	        "\\backslash": {
	            font: "main",
	            group: "textord",
	            replace: "\\"
	        },
	        "|": {
	            font: "main",
	            group: "textord",
	            replace: "\u2223"
	        },
	        "\\vert": {
	            font: "main",
	            group: "textord",
	            replace: "\u2223"
	        },
	        "\\|": {
	            font: "main",
	            group: "textord",
	            replace: "\u2225"
	        },
	        "\\Vert": {
	            font: "main",
	            group: "textord",
	            replace: "\u2225"
	        },
	        "\\uparrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u2191"
	        },
	        "\\Uparrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u21d1"
	        },
	        "\\downarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u2193"
	        },
	        "\\Downarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u21d3"
	        },
	        "\\updownarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u2195"
	        },
	        "\\Updownarrow": {
	            font: "main",
	            group: "rel",
	            replace: "\u21d5"
	        },
	        "\\coprod": {
	            font: "math",
	            group: "op",
	            replace: "\u2210"
	        },
	        "\\bigvee": {
	            font: "math",
	            group: "op",
	            replace: "\u22c1"
	        },
	        "\\bigwedge": {
	            font: "math",
	            group: "op",
	            replace: "\u22c0"
	        },
	        "\\biguplus": {
	            font: "math",
	            group: "op",
	            replace: "\u2a04"
	        },
	        "\\bigcap": {
	            font: "math",
	            group: "op",
	            replace: "\u22c2"
	        },
	        "\\bigcup": {
	            font: "math",
	            group: "op",
	            replace: "\u22c3"
	        },
	        "\\int": {
	            font: "math",
	            group: "op",
	            replace: "\u222b"
	        },
	        "\\intop": {
	            font: "math",
	            group: "op",
	            replace: "\u222b"
	        },
	        "\\iint": {
	            font: "math",
	            group: "op",
	            replace: "\u222c"
	        },
	        "\\iiint": {
	            font: "math",
	            group: "op",
	            replace: "\u222d"
	        },
	        "\\prod": {
	            font: "math",
	            group: "op",
	            replace: "\u220f"
	        },
	        "\\sum": {
	            font: "math",
	            group: "op",
	            replace: "\u2211"
	        },
	        "\\bigotimes": {
	            font: "math",
	            group: "op",
	            replace: "\u2a02"
	        },
	        "\\bigoplus": {
	            font: "math",
	            group: "op",
	            replace: "\u2a01"
	        },
	        "\\bigodot": {
	            font: "math",
	            group: "op",
	            replace: "\u2a00"
	        },
	        "\\oint": {
	            font: "math",
	            group: "op",
	            replace: "\u222e"
	        },
	        "\\bigsqcup": {
	            font: "math",
	            group: "op",
	            replace: "\u2a06"
	        },
	        "\\smallint": {
	            font: "math",
	            group: "op",
	            replace: "\u222b"
	        },
	        "\\ldots": {
	            font: "main",
	            group: "inner",
	            replace: "\u2026"
	        },
	        "\\cdots": {
	            font: "main",
	            group: "inner",
	            replace: "\u22ef"
	        },
	        "\\ddots": {
	            font: "main",
	            group: "inner",
	            replace: "\u22f1"
	        },
	        "\\vdots": {
	            font: "main",
	            group: "textord",
	            replace: "\u22ee"
	        },
	        "\\acute": {
	            font: "main",
	            group: "accent",
	            replace: "\u00b4"
	        },
	        "\\grave": {
	            font: "main",
	            group: "accent",
	            replace: "\u0060"
	        },
	        "\\ddot": {
	            font: "main",
	            group: "accent",
	            replace: "\u00a8"
	        },
	        "\\tilde": {
	            font: "main",
	            group: "accent",
	            replace: "\u007e"
	        },
	        "\\bar": {
	            font: "main",
	            group: "accent",
	            replace: "\u00af"
	        },
	        "\\breve": {
	            font: "main",
	            group: "accent",
	            replace: "\u02d8"
	        },
	        "\\check": {
	            font: "main",
	            group: "accent",
	            replace: "\u02c7"
	        },
	        "\\hat": {
	            font: "main",
	            group: "accent",
	            replace: "\u005e"
	        },
	        "\\vec": {
	            font: "main",
	            group: "accent",
	            replace: "\u20d7"
	        },
	        "\\dot": {
	            font: "main",
	            group: "accent",
	            replace: "\u02d9"
	        },

	        "\\imath": {
	            font: "main",
	            group: "mathord",
	            replace: "\u0131"
	        },
	        "\\jmath": {
	            font: "main",
	            group: "mathord",
	            replace: "\u0237"
	        }
	    },
	    "text": {
	        "\\ ": {
	            font: "main",
	            group: "spacing",
	            replace: "\u00a0"
	        },
	        " ": {
	            font: "main",
	            group: "spacing",
	            replace: "\u00a0"
	        },
	        "~": {
	            font: "main",
	            group: "spacing",
	            replace: "\u00a0"
	        }
	    }
	};

	// There are lots of symbols which are the same, so we add them in afterwards.

	// All of these are textords in math mode
	var mathTextSymbols = "0123456789/@.\"";
	for (var i = 0; i < mathTextSymbols.length; i++) {
	    var ch = mathTextSymbols.charAt(i);
	    symbols.math[ch] = {
	        font: "main",
	        group: "textord"
	    };
	}

	// All of these are textords in text mode
	var textSymbols = "0123456789`!@*()-=+[]'\";:?/.,";
	for (var i = 0; i < textSymbols.length; i++) {
	    var ch = textSymbols.charAt(i);
	    symbols.text[ch] = {
	        font: "main",
	        group: "textord"
	    };
	}

	// All of these are textords in text mode, and mathords in math mode
	var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (var i = 0; i < letters.length; i++) {
	    var ch = letters.charAt(i);
	    symbols.math[ch] = {
	        font: "main",
	        group: "mathord"
	    };
	    symbols.text[ch] = {
	        font: "main",
	        group: "textord"
	    };
	}

	module.exports = symbols;


/***/ }),
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ChunkStyleList, HtmlUtil, ObjectAssign, StyleRange, StyleType, StyleableText, trimStyleRange;

	ObjectAssign = __webpack_require__(13);

	ChunkStyleList = __webpack_require__(30);

	StyleRange = __webpack_require__(17);

	StyleType = __webpack_require__(5);

	HtmlUtil = __webpack_require__(33);

	trimStyleRange = function trimStyleRange(styleRange, maxLength) {
	  styleRange.end = Math.min(styleRange.end, maxLength);
	  return styleRange;
	};

	StyleableText = function () {
	  function StyleableText(text) {
	    if (text == null) {
	      text = '';
	    }
	    this.init();
	    this.insertText(0, text);
	  }

	  StyleableText.prototype.init = function () {
	    this.styleList = new ChunkStyleList();
	    return this.value = '';
	  };

	  StyleableText.prototype.clone = function () {
	    var clone;
	    clone = new StyleableText();
	    clone.value = this.value;
	    clone.styleList = this.styleList.clone();
	    return clone;
	  };

	  StyleableText.prototype.getExportedObject = function () {
	    return {
	      value: this.value,
	      styleList: this.styleList.getExportedObject()
	    };
	  };

	  StyleableText.prototype.setText = function (text) {
	    this.init();
	    return this.insertText(0, text);
	  };

	  StyleableText.prototype.replaceText = function (from, to, text) {
	    if (text == null || text.length === 0) {
	      return this.deleteText(from, to);
	    }
	    this.insertText(from + 1, text);
	    this.normalizeStyles();
	    this.deleteText(from, from + 1);
	    this.normalizeStyles();
	    this.deleteText(from + text.length, to + text.length - 1);
	    return this.normalizeStyles();
	  };

	  StyleableText.prototype.appendText = function (text) {
	    return this.insertText(this.length, text);
	  };

	  StyleableText.prototype.insertText = function (atIndex, text) {
	    var insertLength, k, len, range, ref;
	    insertLength = text.length;
	    ref = this.styleList.styles;
	    for (k = 0, len = ref.length; k < len; k++) {
	      range = ref[k];
	      switch (range.compareToRange(atIndex)) {
	        case StyleRange.CONTAINS:
	          range.end += insertLength;
	          break;
	        case StyleRange.AFTER:
	          range.start += insertLength;
	          range.end += insertLength;
	      }
	    }
	    this.value = this.value.substring(0, atIndex) + text + this.value.substring(atIndex);
	    return this.normalizeStyles();
	  };

	  StyleableText.prototype.deleteText = function (from, to) {
	    var deleteLength, k, len, range, ref;
	    if (from == null) {
	      from = -1;
	    }
	    if (to == null) {
	      to = 2e308;
	    }
	    if (from > to) {
	      return;
	    }
	    from = Math.max(0, from);
	    to = Math.min(to, this.value.length);
	    deleteLength = to - from;
	    ref = this.styleList.styles;
	    for (k = 0, len = ref.length; k < len; k++) {
	      range = ref[k];
	      switch (range.compareToRange(from, to)) {
	        case StyleRange.CONTAINS:
	          range.end -= deleteLength;
	          break;
	        case StyleRange.INSIDE_LEFT:
	          range.end = from;
	          break;
	        case StyleRange.ENSCAPSULATED_BY:
	          range.invalidate();
	          break;
	        case StyleRange.INSIDE_RIGHT:
	          range.start = from;
	          range.end -= deleteLength;
	          break;
	        case StyleRange.AFTER:
	          range.start -= deleteLength;
	          range.end -= deleteLength;
	      }
	    }
	    this.value = this.value.substring(0, from) + this.value.substring(to);
	    return this.normalizeStyles();
	  };

	  StyleableText.prototype.toggleStyleText = function (styleType, from, to, styleData) {
	    var styleRange;
	    if (from == null) {
	      from = 0;
	    }
	    if (to == null) {
	      to = this.length;
	    }
	    styleRange = trimStyleRange(new StyleRange(from, to, styleType, styleData), this.value.length);
	    if (this.styleList.rangeHasStyle(from, Math.min(to, this.value.length), styleType)) {
	      this.styleList.remove(styleRange);
	    } else {
	      this.styleList.add(styleRange);
	    }
	    return this.normalizeStyles();
	  };

	  StyleableText.prototype.styleText = function (styleType, from, to, styleData) {
	    var range, styleRange;
	    if (from == null) {
	      from = 0;
	    }
	    if (to == null) {
	      to = this.length;
	    }
	    range = new StyleRange(from, to, styleType, styleData);
	    styleRange = trimStyleRange(range, this.value.length);
	    this.styleList.add(styleRange);
	    return this.normalizeStyles();
	  };

	  StyleableText.prototype.unstyleText = function (styleType, from, to) {
	    var styleRange;
	    if (from == null) {
	      from = 0;
	    }
	    if (to == null) {
	      to = this.length;
	    }
	    styleRange = trimStyleRange(new StyleRange(from, to, styleType), this.value.length);
	    this.styleList.remove(styleRange);
	    return this.normalizeStyles();
	  };

	  StyleableText.prototype.getStyles = function (from, to) {
	    return this.styleList.getStylesInRange(from, to);
	  };

	  StyleableText.prototype.split = function (atIndex) {
	    var lastCharStyles, sibling, splitAtEnd, style;
	    if (isNaN(atIndex)) {
	      return null;
	    }
	    splitAtEnd = atIndex === this.value.length;
	    sibling = this.clone();
	    this.deleteText(atIndex, this.value.length);
	    sibling.deleteText(0, atIndex);
	    if (splitAtEnd) {
	      lastCharStyles = this.styleList.getStylesInRange(this.value.length - 1, this.value.length);
	      for (style in lastCharStyles) {
	        sibling.styleText(style, 0, 0);
	      }
	    }
	    return sibling;
	  };

	  StyleableText.prototype.normalizeStyles = function () {
	    return this.styleList.normalize();
	  };

	  StyleableText.prototype.merge = function (otherText, atIndex) {
	    var curRange, insertLength, k, l, len, len1, range, ref, ref1;
	    if (atIndex == null) {
	      atIndex = null;
	    }
	    if (atIndex == null) {
	      atIndex = this.value.length;
	    }
	    insertLength = otherText.value.length;
	    ref = this.styleList.styles;
	    for (k = 0, len = ref.length; k < len; k++) {
	      range = ref[k];
	      switch (range.compareToRange(atIndex)) {
	        case StyleRange.AFTER:
	          range.start += insertLength;
	          range.end += insertLength;
	      }
	    }
	    this.value = this.value.substring(0, atIndex) + otherText.value + this.value.substring(atIndex);
	    this.styleList.normalize();
	    ref1 = otherText.styleList.styles;
	    for (l = 0, len1 = ref1.length; l < len1; l++) {
	      range = ref1[l];
	      curRange = range.clone();
	      curRange.start += atIndex;
	      curRange.end += atIndex;
	      this.styleList.add(curRange);
	    }
	    return this.styleList.normalize();
	  };

	  StyleableText.prototype.__debug_print = function () {
	    var fill, i, j, k, l, len, m, n, p, ref, ref1, ref2, ref3, ref4, ref5, ref6, results, s1, s2, style;
	    console.log('   |          |' + this.value + ' |');
	    fill = '';
	    for (i = k = 0, ref = this.value.length + 10; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
	      fill += ' ';
	    }
	    j = 0;
	    ref1 = this.styleList.styles;
	    results = [];
	    for (l = 0, len = ref1.length; l < len; l++) {
	      style = ref1[l];
	      s1 = (style.type + '          ').substr(0, 10) + '|';
	      s2 = '';
	      for (i = m = 0, ref2 = style.start; 0 <= ref2 ? m < ref2 : m > ref2; i = 0 <= ref2 ? ++m : --m) {
	        s2 += '·';
	      }
	      s2 += '<';
	      for (i = n = ref3 = style.start + 1, ref4 = style.end; ref3 <= ref4 ? n < ref4 : n > ref4; i = ref3 <= ref4 ? ++n : --n) {
	        s2 += '=';
	      }
	      s2 += '>';
	      for (i = p = ref5 = style.end + 1, ref6 = fill.length; ref5 <= ref6 ? p < ref6 : p > ref6; i = ref5 <= ref6 ? ++p : --p) {
	        s2 += '·';
	      }
	      console.log((j + '   ').substr(0, 3) + '|' + (s1 + s2 + fill).substr(0, fill.length + 1) + '|' + style.start + ',' + style.end + '|' + JSON.stringify(style.data));
	      results.push(j++);
	    }
	    return results;
	  };

	  return StyleableText;
	}();

	Object.defineProperties(StyleableText.prototype, {
	  "length": {
	    get: function get() {
	      return this.value.length;
	    }
	  }
	});

	StyleableText.createFromObject = function (o) {
	  var st;
	  st = new StyleableText();
	  st.styleList = ChunkStyleList.createFromObject(o.styleList);
	  st.value = o.value;
	  return st;
	};

	StyleableText.getStylesOfElement = function (el) {
	  var computedStyle, styles;
	  if (el.nodeType !== Node.ELEMENT_NODE) {
	    return [];
	  }
	  styles = [];
	  computedStyle = window.getComputedStyle(el);
	  switch (computedStyle.getPropertyValue('font-weight')) {
	    case "bold":
	    case "bolder":
	    case "700":
	    case "800":
	    case "900":
	      styles.push({
	        type: StyleType.BOLD
	      });
	  }
	  switch (computedStyle.getPropertyValue('text-decoration')) {
	    case "line-through":
	      styles.push({
	        type: StyleType.STRIKETHROUGH
	      });
	  }
	  switch (computedStyle.getPropertyValue('font-style')) {
	    case "italic":
	      styles.push({
	        type: StyleType.ITALIC
	      });
	  }
	  switch (computedStyle.getPropertyValue('font-family').toLowerCase()) {
	    case "monospace":
	      styles.push({
	        type: StyleType.MONOSPACE
	      });
	  }
	  switch (el.tagName.toLowerCase()) {
	    case 'a':
	      if (el.getAttribute('href') != null) {
	        styles.push({
	          type: StyleType.LINK,
	          data: {
	            href: el.getAttribute('href')
	          }
	        });
	      }
	      break;
	    case 'q':
	      styles.push({
	        type: StyleType.QUOTE,
	        data: el.getAttribute('cite')
	      });
	      break;
	    case 'sup':
	      styles.push({
	        type: StyleType.SUPERSCRIPT,
	        data: 1
	      });
	      break;
	    case 'sub':
	      styles.push({
	        type: StyleType.SUPERSCRIPT,
	        data: -1
	      });
	  }
	  return styles;
	};

	StyleableText.createFromElement = function (node) {
	  var childNode, k, l, len, len1, len2, m, range, ranges, ref, results, state, style, styleRange, styles;
	  if (node == null) {
	    return new StyleableText();
	  }
	  if (arguments[1] == null) {
	    state = {
	      curText: new StyleableText(),
	      texts: []
	    };
	    StyleableText.createFromElement(node, state);
	    state.texts.push(state.curText);
	    state.curText.styleList.normalize();
	    return state.texts;
	  }
	  state = arguments[1];
	  switch (node.nodeType) {
	    case Node.TEXT_NODE:
	      return state.curText.value += node.nodeValue;
	    case Node.ELEMENT_NODE:
	      if (state.curText.length > 0 && !HtmlUtil.isElementInline(node)) {
	        state.texts.push(state.curText);
	        state.curText.styleList.normalize();
	        state.curText = new StyleableText();
	      }
	      styles = StyleableText.getStylesOfElement(node);
	      ranges = [];
	      for (k = 0, len = styles.length; k < len; k++) {
	        style = styles[k];
	        styleRange = new StyleRange(state.curText.value.length, 2e308, style.type, style.data);
	        ranges.push(styleRange);
	      }
	      ref = node.childNodes;
	      for (l = 0, len1 = ref.length; l < len1; l++) {
	        childNode = ref[l];
	        StyleableText.createFromElement(childNode, state);
	      }
	      results = [];
	      for (m = 0, len2 = ranges.length; m < len2; m++) {
	        range = ranges[m];
	        range.end = state.curText.value.length;
	        results.push(state.curText.styleList.add(range));
	      }
	      return results;
	  }
	};

	window.__st = StyleableText;

	module.exports = StyleableText;

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ }),
/* 14 */,
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var DefaultAdapter,
	    Dispatcher,
	    OBO,
	    OboModel,
	    OboModelCollection,
	    createUUID,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	OBO = window.OBO;

	createUUID = __webpack_require__(96);

	Dispatcher = __webpack_require__(4);

	DefaultAdapter = {
	  construct: function construct(attrs) {
	    return null;
	  },
	  clone: function clone(_clone) {
	    return _clone;
	  },
	  toJSON: function toJSON(model, json) {
	    return json;
	  },
	  toText: function toText(model) {
	    return '';
	  }
	};

	OboModel = function (superClass) {
	  extend(OboModel, superClass);

	  OboModel.prototype.defaults = function () {
	    return {
	      id: null,
	      content: {},
	      metadata: {},
	      index: 0,
	      type: ''
	    };
	  };

	  function OboModel(attrs, adapter) {
	    var ref, ref1;
	    if (adapter == null) {
	      adapter = {};
	    }
	    this.parent = null;
	    this.children = new OboModelCollection();
	    this.triggers = [];
	    this.title = null;
	    this.modelState = {
	      dirty: false,
	      needsUpdate: false,
	      editing: false
	    };
	    if (attrs.id == null) {
	      attrs.id = this.createNewLocalId();
	    }
	    OboModel.__super__.constructor.call(this, attrs);
	    this.adapter = Object.assign(Object.assign({}, DefaultAdapter), adapter);
	    this.adapter.construct(this, attrs);
	    if (((ref = attrs.content) != null ? ref.triggers : void 0) != null) {
	      this.triggers = attrs.content.triggers;
	    }
	    if (((ref1 = attrs.content) != null ? ref1.title : void 0) != null) {
	      this.title = attrs.content.title;
	    }
	    this.children.on('remove', this.onChildRemove, this);
	    this.children.on('add', this.onChildAdd, this);
	    this.children.on('reset', this.onChildrenReset, this);
	    OboModel.models[this.get('id')] = this;
	  }

	  OboModel.prototype.getRoot = function () {
	    var root;
	    root = this;
	    while (root !== null) {
	      if (root.parent) {
	        root = root.parent;
	      } else {
	        return root;
	      }
	    }
	    return null;
	  };

	  OboModel.prototype.getDraftId = function () {
	    var root;
	    root = this.getRoot();
	    if (root == null) {
	      return null;
	    }
	    return root.get('_id');
	  };

	  OboModel.prototype.processTrigger = function (type) {
	    var action, i, index, j, k, len, len1, len2, ref, ref1, results, trigIndex, trigger, triggersToDelete;
	    triggersToDelete = [];
	    ref = this.triggers;
	    for (trigIndex = i = 0, len = ref.length; i < len; trigIndex = ++i) {
	      trigger = ref[trigIndex];
	      if (trigger.type === type) {
	        ref1 = trigger.actions;
	        for (index = j = 0, len1 = ref1.length; j < len1; index = ++j) {
	          action = ref1[index];
	          if (action.type === '_js') {
	            eval(action.value);
	          } else {
	            Dispatcher.trigger(action.type, action);
	          }
	        }
	        if (trigger.run != null && trigger.run === 'once') {
	          triggersToDelete.unshift(trigIndex);
	        }
	      }
	    }
	    results = [];
	    for (k = 0, len2 = triggersToDelete.length; k < len2; k++) {
	      index = triggersToDelete[k];
	      results.push(this.triggers.splice(index, 1));
	    }
	    return results;
	  };

	  OboModel.prototype.onChildRemove = function (model, collection, options) {
	    model.parent = null;
	    model.markDirty();
	    return delete OboModel.models[model.get('id')];
	  };

	  OboModel.prototype.onChildAdd = function (model, collection, options) {
	    model.parent = this;
	    return model.markDirty();
	  };

	  OboModel.prototype.onChildrenReset = function (collection, options) {
	    var child, i, len, ref, results;
	    ref = this.children.models;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      child = ref[i];
	      results.push(child.parent = this);
	    }
	    return results;
	  };

	  OboModel.prototype.createNewLocalId = function () {
	    return createUUID();
	  };

	  OboModel.prototype.assignNewId = function () {
	    delete OboModel.models[this.get('id')];
	    this.set('id', this.createNewLocalId());
	    return OboModel.models[this.get('id')] = this;
	  };

	  OboModel.prototype.clone = function (deep) {
	    var child, clone, i, len, ref;
	    if (deep == null) {
	      deep = false;
	    }
	    clone = new OboModel(this.attributes, this.adapter.constructor);
	    this.adapter.clone(this, clone);
	    if (deep && this.hasChildren()) {
	      ref = this.children;
	      for (i = 0, len = ref.length; i < len; i++) {
	        child = ref[i];
	        clone.children.add(child.clone(true));
	      }
	    }
	    return clone;
	  };

	  OboModel.prototype.toJSON = function () {
	    var child, i, json, len, ref;
	    json = OboModel.__super__.toJSON.call(this);
	    this.adapter.toJSON(this, json);
	    json.children = null;
	    if (this.hasChildren()) {
	      json.children = [];
	      ref = this.children.models;
	      for (i = 0, len = ref.length; i < len; i++) {
	        child = ref[i];
	        json.children.push(child.toJSON());
	      }
	    }
	    return json;
	  };

	  OboModel.prototype.toText = function () {
	    var child, i, len, ref, text;
	    text = this.adapter.toText(this);
	    ref = this.children.models;
	    for (i = 0, len = ref.length; i < len; i++) {
	      child = ref[i];
	      text += "\n" + child.toText();
	    }
	    return text;
	  };

	  OboModel.prototype.revert = function () {
	    var attr, attrName, id, index, newModel, ref;
	    newModel = new this.constructor();
	    index = this.get('index');
	    id = this.get('id');
	    this.clear();
	    ref = newModel.attributes;
	    for (attrName in ref) {
	      attr = ref[attrName];
	      this.set(attrName, attr);
	    }
	    this.set('index', index);
	    this.set('id', id);
	    this.modelState = newModel.modelState;
	    return this;
	  };

	  OboModel.prototype.markDirty = function (markChildren) {
	    var child, i, len, ref, results;
	    if (markChildren == null) {
	      markChildren = false;
	    }
	    this.modelState.dirty = this.modelState.needsUpdate = true;
	    if (markChildren) {
	      ref = this.children.models;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        child = ref[i];
	        results.push(child.markDirty());
	      }
	      return results;
	    }
	  };

	  OboModel.prototype.markForUpdate = function (markChildren) {
	    var child, i, len, ref, results;
	    if (markChildren == null) {
	      markChildren = false;
	    }
	    this.modelState.needsUpdate = true;
	    if (markChildren) {
	      ref = this.children.models;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        child = ref[i];
	        results.push(child.markForUpdate());
	      }
	      return results;
	    }
	  };

	  OboModel.prototype.markUpdated = function (markChildren) {
	    var child, i, len, ref, results;
	    if (markChildren == null) {
	      markChildren = false;
	    }
	    this.modelState.needsUpdate = false;
	    if (markChildren) {
	      ref = this.children.models;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        child = ref[i];
	        results.push(child.modelState.needsUpdate = false);
	      }
	      return results;
	    }
	  };

	  OboModel.prototype.getDomEl = function () {
	    return document.body.querySelector(".component[data-id='" + this.get('id') + "']");
	  };

	  OboModel.prototype.getComponentClass = function () {
	    return OBO.getItemForType(this.get('type')).componentClass;
	  };

	  OboModel.prototype.hasChildren = function () {
	    return this.children.models.length > 0;
	  };

	  OboModel.prototype.isOrphan = function () {
	    return this.parent == null;
	  };

	  OboModel.prototype.addChildBefore = function (sibling) {
	    var collection;
	    if (this.isOrphan()) {
	      return;
	    }
	    collection = this.parent.collection;
	    if (collection.contains(sibling)) {
	      collection.remove(sibling);
	    }
	    return collection.add(sibling, {
	      at: this.getIndex()
	    });
	  };

	  OboModel.prototype.addChildAfter = function (sibling) {
	    var collection;
	    if (this.isOrphan()) {
	      return;
	    }
	    collection = this.parent.collection;
	    if (collection.contains(sibling)) {
	      collection.remove(sibling);
	    }
	    return collection.add(sibling, {
	      at: this.getIndex() + 1
	    });
	  };

	  OboModel.prototype.moveTo = function (index) {
	    var refChunk;
	    if (this.getIndex() === index) {
	      return;
	    }
	    refChunk = this.parent.at(index);
	    if (index < this.getIndex()) {
	      return refChunk.addChildBefore(this);
	    } else {
	      return refChunk.addChildAfter(this);
	    }
	  };

	  OboModel.prototype.moveToTop = function () {
	    return this.moveTo(0);
	  };

	  OboModel.prototype.moveToBottom = function () {
	    return this.moveTo(this.parent.length - 1);
	  };

	  OboModel.prototype.prevSibling = function () {
	    if (this.isOrphan() || this.isFirst()) {
	      return null;
	    }
	    return this.parent.children.at(this.getIndex() - 1);
	  };

	  OboModel.prototype.getIndex = function () {
	    if (!this.parent) {
	      return 0;
	    }
	    return this.parent.children.models.indexOf(this);
	  };

	  OboModel.prototype.nextSibling = function () {
	    if (this.isOrphan() || this.isLast()) {
	      return null;
	    }
	    return this.parent.children.at(this.parent.children.models.indexOf(this) + 1);
	  };

	  OboModel.prototype.isFirst = function () {
	    if (this.isOrphan()) {
	      return false;
	    }
	    return this.getIndex() === 0;
	  };

	  OboModel.prototype.isLast = function () {
	    if (this.isOrphan()) {
	      return false;
	    }
	    return this.getIndex() === this.parent.length - 1;
	  };

	  OboModel.prototype.isBefore = function (otherChunk) {
	    if (this.isOrphan()) {
	      return false;
	    }
	    return this.getIndex() < otherChunk.getIndex();
	  };

	  OboModel.prototype.isAfter = function (otherChunk) {
	    if (this.isOrphan()) {
	      return false;
	    }
	    return this.getIndex() > otherChunk.getIndex();
	  };

	  OboModel.prototype.remove = function () {
	    if (!this.isOrphan()) {
	      return this.parent.remove(this);
	    }
	  };

	  OboModel.prototype.replaceWith = function (newChunk) {
	    if (this.isOrphan() || newChunk === this) {
	      return;
	    }
	    this.addChildBefore(newChunk);
	    return this.remove();
	  };

	  OboModel.prototype.contains = function (child) {
	    while (child !== null) {
	      if (child === this) {
	        return true;
	      }
	      child = child.parent;
	    }
	    return false;
	  };

	  OboModel.prototype.getChildContainingModel = function (model) {
	    var child, i, len, ref;
	    ref = this.children.models;
	    for (i = 0, len = ref.length; i < len; i++) {
	      child = ref[i];
	      if (child.contains(model)) {
	        return child;
	      }
	    }
	    return null;
	  };

	  OboModel.prototype.getParentOfType = function (type) {
	    var model;
	    model = this.parent;
	    while (model !== null) {
	      if (model.get('type') === type) {
	        return model;
	      }
	      model = model.parent;
	    }
	    return null;
	  };

	  OboModel.prototype.__debug_print = function (indent) {
	    var child, i, len, ref, results;
	    if (indent == null) {
	      indent = '';
	    }
	    console.log(indent + this.get('type'));
	    ref = this.children.models;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      child = ref[i];
	      results.push(child.__debug_print(indent + '  '));
	    }
	    return results;
	  };

	  return OboModel;
	}(Backbone.Model);

	OboModel.models = {};

	OboModel.getRoot = function () {
	  var id;
	  for (id in OboModel.models) {
	    return OboModel.models[id].getRoot();
	  }
	  return null;
	};

	OboModelCollection = function (superClass) {
	  extend(OboModelCollection, superClass);

	  function OboModelCollection() {
	    return OboModelCollection.__super__.constructor.apply(this, arguments);
	  }

	  return OboModelCollection;
	}(Backbone.Collection);

	OboModel.create = function (typeOrNameOrJson, attrs) {
	  var c, child, children, i, item, len, oboModel;
	  if (attrs == null) {
	    attrs = {};
	  }
	  if ((typeof typeOrNameOrJson === 'undefined' ? 'undefined' : _typeof(typeOrNameOrJson)) === 'object') {
	    oboModel = OboModel.create(typeOrNameOrJson.type, typeOrNameOrJson);
	    if (oboModel != null) {
	      children = typeOrNameOrJson.children;
	      if (children != null) {
	        for (i = 0, len = children.length; i < len; i++) {
	          child = children[i];
	          c = OboModel.create(child);
	          oboModel.children.add(c);
	        }
	      }
	    }
	    return oboModel;
	  }
	  item = OBO.getDefaultItemForModelType(typeOrNameOrJson);
	  if (!item) {
	    item = OBO.getItemForType(typeOrNameOrJson);
	  }
	  if (!item) {
	    return null;
	  }
	  attrs.type = typeOrNameOrJson;
	  return new OboModel(attrs, item.adapter);
	};

	module.exports = OboModel;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	'use strict';

	var DOMUtil;

	DOMUtil = {
	  findParentWithAttr: function findParentWithAttr(node, targetAttribute, targetValue, rootParent) {
	    var attr;
	    if (targetValue == null) {
	      targetValue = null;
	    }
	    if (rootParent == null) {
	      rootParent = document.body;
	    }
	    while (node != null && node !== rootParent) {
	      if (node.getAttribute != null) {
	        attr = node.getAttribute(targetAttribute);
	        if (attr != null && (targetValue === null || attr === targetValue)) {
	          return node;
	        }
	      }
	      node = node.parentNode;
	    }
	    return null;
	  },
	  findParentAttr: function findParentAttr(node, targetAttribute) {
	    node = DOMUtil.findParentWithAttr(node, targetAttribute);
	    if (node == null) {
	      return null;
	    }
	    return node.getAttribute(targetAttribute);
	  },
	  findParentComponentElements: function findParentComponentElements(node) {
	    var componentSet, cur;
	    componentSet = new Set();
	    cur = node;
	    while (cur !== null) {
	      cur = DOMUtil.findParentWithAttr(cur, 'data-obo-component');
	      if (cur == null) {
	        break;
	      }
	      if (DOMUtil.elementLikeComponent(cur)) {
	        componentSet.add(cur);
	      }
	      cur = cur.parentElement;
	    }
	    return componentSet;
	  },
	  findParentComponentIds: function findParentComponentIds(node) {
	    var ids;
	    ids = new Set();
	    DOMUtil.findParentComponentElements(node).forEach(function (el) {
	      return ids.add(el.getAttribute('data-id'));
	    });
	    return ids;
	  },
	  elementLikeComponent: function elementLikeComponent(node) {
	    return node.getAttribute('data-obo-component') && node.classList.contains('component') && node.getAttribute('data-id') != null && node.getAttribute('data-type') != null;
	  },
	  getFirstTextNodeOfElement: function getFirstTextNodeOfElement(node) {
	    while (node != null && node.nodeType !== Node.TEXT_NODE) {
	      node = node.childNodes[0];
	    }
	    return node;
	  },
	  getTextNodesInOrder: function getTextNodesInOrder(element) {
	    var textNodes;
	    textNodes = [];
	    DOMUtil.getTextNodesInOrderRecur(element, textNodes);
	    return textNodes;
	  },
	  getTextNodesInOrderRecur: function getTextNodesInOrderRecur(element, textNodes) {
	    var i, len, node, ref, results;
	    ref = element.childNodes;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      node = ref[i];
	      if (node.nodeType === Node.TEXT_NODE) {
	        results.push(textNodes.push(node));
	      } else {
	        results.push(DOMUtil.getTextNodesInOrderRecur(node, textNodes));
	      }
	    }
	    return results;
	  }
	};

	module.exports = DOMUtil;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var StyleRange, StyleType;

	StyleType = __webpack_require__(5);

	StyleRange = function () {
	  function StyleRange(start, end, type, data) {
	    if (start == null) {
	      start = 0;
	    }
	    if (end == null) {
	      end = 0;
	    }
	    this.type = type != null ? type : '';
	    this.data = data != null ? data : {};
	    this.start = parseInt(start, 10);
	    this.end = parseInt(end, 10);
	  }

	  StyleRange.prototype.clone = function () {
	    return new StyleRange(this.start, this.end, this.type, this.data);
	  };

	  StyleRange.prototype.getExportedObject = function () {
	    return {
	      type: this.type,
	      start: this.start,
	      end: this.end,
	      data: this.data
	    };
	  };

	  StyleRange.prototype.toString = function () {
	    return this.type + ":" + this.start + "," + this.end + "(" + this.data + ")";
	  };

	  StyleRange.prototype.isInvalid = function () {
	    return this.length() === 0 && this.start !== 0 && this.end !== 0;
	  };

	  StyleRange.prototype.invalidate = function () {
	    return this.start = this.end = -1;
	  };

	  StyleRange.prototype.compareToRange = function (from, to) {
	    if (to == null) {
	      to = from;
	    }
	    if (from === 0 && this.start === 0 && to <= this.end) {
	      return StyleRange.CONTAINS;
	    }
	    if (to <= this.start) {
	      return StyleRange.AFTER;
	    }
	    if (from > this.end) {
	      return StyleRange.BEFORE;
	    }
	    if (from >= this.start && to <= this.end) {
	      return StyleRange.CONTAINS;
	    }
	    if (from <= this.start && to >= this.end) {
	      return StyleRange.ENSCAPSULATED_BY;
	    }
	    if (from >= this.start) {
	      return StyleRange.INSIDE_LEFT;
	    }
	    return StyleRange.INSIDE_RIGHT;
	  };

	  StyleRange.prototype.length = function () {
	    return this.end - this.start;
	  };

	  StyleRange.prototype.isMergeable = function (otherType, otherData) {
	    var k, ref, v;
	    if (this.type !== otherType) {
	      return false;
	    }
	    if (this.data instanceof Object) {
	      ref = this.data;
	      for (k in ref) {
	        v = ref[k];
	        if (otherData[k] == null || otherData[k] !== v) {
	          return false;
	        }
	      }
	    } else {
	      if (this.data !== otherData) {
	        return false;
	      }
	    }
	    return true;
	  };

	  return StyleRange;
	}();

	StyleRange.BEFORE = 'before';

	StyleRange.AFTER = 'after';

	StyleRange.INSIDE_LEFT = 'left';

	StyleRange.INSIDE_RIGHT = 'right';

	StyleRange.CONTAINS = 'contains';

	StyleRange.ENSCAPSULATED_BY = 'enscapsulatedBy';

	StyleRange.createFromObject = function (o) {
	  return new StyleRange(o.start, o.end, o.type, o.data);
	};

	module.exports = StyleRange;

/***/ }),
/* 18 */,
/* 19 */,
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var ObjectAssign;

	ObjectAssign = __webpack_require__(13);

	module.exports = {
	  createData: function createData(data, template) {
	    var clone, key;
	    clone = ObjectAssign({}, data);
	    for (key in clone) {
	      if (template[key] == null) {
	        delete clone[key];
	      }
	    }
	    for (key in template) {
	      if (clone[key] == null) {
	        if (_typeof(template[key]) === 'object') {
	          clone[key] = ObjectAssign({}, template[key]);
	        } else {
	          clone[key] = template[key];
	        }
	      }
	    }
	    return clone;
	  },
	  defaultCloneFn: function defaultCloneFn(data) {
	    return ObjectAssign({}, data);
	  },
	  defaultMergeFn: function defaultMergeFn(consumer, digested) {
	    return consumer;
	  }
	};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var DOMSelection, DOMUtil;

	DOMUtil = __webpack_require__(16);

	DOMSelection = function () {
	  function DOMSelection() {
	    this.domSelection = window.getSelection();
	    this.domRange = null;
	    if (this.domSelection.rangeCount > 0) {
	      this.domRange = this.domSelection.getRangeAt(0);
	    }
	  }

	  DOMSelection.prototype.getType = function () {
	    if (this.domSelection.type != null) {
	      return this.domSelection.type.toLowerCase();
	    }
	    if (this.domSelection.isCollapsed != null) {
	      if (this.domSelection.isCollapsed) {
	        return 'caret';
	      } else {
	        return 'range';
	      }
	    }
	    if (this.domSelection.focusNode === this.domSelection.anchorNode && this.domSelection.focusOffset === this.domSelection.anchorOffset) {
	      return 'caret';
	    }
	    return 'range';
	  };

	  DOMSelection.prototype.getClientRects = function () {
	    if (this.domRange == null) {
	      return [];
	    }
	    return this.domRange.getClientRects();
	  };

	  DOMSelection.prototype.set = function (startNode, startOffset, endNode, endOffset) {
	    var r;
	    r = document.createRange();
	    r.setStart(startNode, startOffset);
	    r.setEnd(endNode, endOffset);
	    this.domSelection.removeAllRanges();
	    this.domSelection.addRange(r);
	    this.domRange = r;
	    return this;
	  };

	  DOMSelection.prototype.setStart = function (node, offset) {
	    return this.domRange.setStart(node, offset);
	  };

	  DOMSelection.prototype.setEnd = function (node, offset) {
	    return this.domRange.setEnd(node, offset);
	  };

	  DOMSelection.prototype.includes = function (node) {
	    if (node == null) {
	      return false;
	    }
	    return node.contains(this.startText) && node.contains(this.endText);
	  };

	  return DOMSelection;
	}();

	DOMSelection.set = function (startNode, startOffset, endNode, endOffset) {
	  return new DOMSelection().set(startNode, startOffset, endNode, endOffset);
	};

	DOMSelection.includes = function (node) {
	  return new DOMSelection().includes(node);
	};

	DOMSelection.get = function () {
	  return new DOMSelection();
	};

	Object.defineProperties(DOMSelection.prototype, {
	  startContainer: {
	    get: function get() {
	      if (this.domRange == null) {
	        return null;
	      }
	      if (this.domRange.startContainer.nodeType === Node.TEXT_NODE) {
	        return this.domRange.startContainer.parentElement;
	      } else {
	        return this.domRange.startContainer;
	      }
	    }
	  },
	  startText: {
	    get: function get() {
	      if (this.domRange == null) {
	        return null;
	      }
	      return DOMUtil.getFirstTextNodeOfElement(this.domRange.startContainer);
	    }
	  },
	  startOffset: {
	    get: function get() {
	      if (this.domRange == null) {
	        return null;
	      }
	      return this.domRange.startOffset;
	    }
	  },
	  endContainer: {
	    get: function get() {
	      if (this.domRange == null) {
	        return null;
	      }
	      if (this.domRange.endContainer.nodeType === Node.TEXT_NODE) {
	        return this.domRange.endContainer.parentElement;
	      } else {
	        return this.domRange.endContainer;
	      }
	    }
	  },
	  endText: {
	    get: function get() {
	      if (this.domRange == null) {
	        return null;
	      }
	      return DOMUtil.getFirstTextNodeOfElement(this.domRange.endContainer);
	    }
	  },
	  endOffset: {
	    get: function get() {
	      if (this.domRange == null) {
	        return null;
	      }
	      return this.domRange.endOffset;
	    }
	  }
	});

	window.__ds = function () {
	  return DOMSelection.get();
	};

	module.exports = DOMSelection;

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	"use strict";

	module.exports = {
	  EMPTY_CHAR_CODE: 8203,
	  EMPTY_CHAR: String.fromCharCode(8203)
	};

/***/ }),
/* 23 */,
/* 24 */,
/* 25 */
/***/ (function(module, exports) {

	/**
	 * This is a module for storing settings passed into KaTeX. It correctly handles
	 * default settings.
	 */

	/**
	 * Helper function for getting a default value if the value is undefined
	 */
	function get(option, defaultValue) {
	    return option === undefined ? defaultValue : option;
	}

	/**
	 * The main Settings object
	 *
	 * The current options stored are:
	 *  - displayMode: Whether the expression should be typeset by default in
	 *                 textstyle or displaystyle (default false)
	 */
	function Settings(options) {
	    // allow null options
	    options = options || {};
	    this.displayMode = get(options.displayMode, false);
	    this.throwOnError = get(options.throwOnError, true);
	    this.errorColor = get(options.errorColor, "#cc0000");
	}

	module.exports = Settings;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * These objects store the data about the DOM nodes we create, as well as some
	 * extra data. They can then be transformed into real DOM nodes with the
	 * `toNode` function or HTML markup using `toMarkup`. They are useful for both
	 * storing extra properties on the nodes, as well as providing a way to easily
	 * work with the DOM.
	 *
	 * Similar functions for working with MathML nodes exist in mathMLTree.js.
	 */

	var utils = __webpack_require__(1);

	/**
	 * Create an HTML className based on a list of classes. In addition to joining
	 * with spaces, we also remove null or empty classes.
	 */
	var createClass = function(classes) {
	    classes = classes.slice();
	    for (var i = classes.length - 1; i >= 0; i--) {
	        if (!classes[i]) {
	            classes.splice(i, 1);
	        }
	    }

	    return classes.join(" ");
	};

	/**
	 * This node represents a span node, with a className, a list of children, and
	 * an inline style. It also contains information about its height, depth, and
	 * maxFontSize.
	 */
	function span(classes, children, height, depth, maxFontSize, style) {
	    this.classes = classes || [];
	    this.children = children || [];
	    this.height = height || 0;
	    this.depth = depth || 0;
	    this.maxFontSize = maxFontSize || 0;
	    this.style = style || {};
	    this.attributes = {};
	}

	/**
	 * Sets an arbitrary attribute on the span. Warning: use this wisely. Not all
	 * browsers support attributes the same, and having too many custom attributes
	 * is probably bad.
	 */
	span.prototype.setAttribute = function(attribute, value) {
	    this.attributes[attribute] = value;
	};

	/**
	 * Convert the span into an HTML node
	 */
	span.prototype.toNode = function() {
	    var span = document.createElement("span");

	    // Apply the class
	    span.className = createClass(this.classes);

	    // Apply inline styles
	    for (var style in this.style) {
	        if (Object.prototype.hasOwnProperty.call(this.style, style)) {
	            span.style[style] = this.style[style];
	        }
	    }

	    // Apply attributes
	    for (var attr in this.attributes) {
	        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
	            span.setAttribute(attr, this.attributes[attr]);
	        }
	    }

	    // Append the children, also as HTML nodes
	    for (var i = 0; i < this.children.length; i++) {
	        span.appendChild(this.children[i].toNode());
	    }

	    return span;
	};

	/**
	 * Convert the span into an HTML markup string
	 */
	span.prototype.toMarkup = function() {
	    var markup = "<span";

	    // Add the class
	    if (this.classes.length) {
	        markup += " class=\"";
	        markup += utils.escape(createClass(this.classes));
	        markup += "\"";
	    }

	    var styles = "";

	    // Add the styles, after hyphenation
	    for (var style in this.style) {
	        if (this.style.hasOwnProperty(style)) {
	            styles += utils.hyphenate(style) + ":" + this.style[style] + ";";
	        }
	    }

	    if (styles) {
	        markup += " style=\"" + utils.escape(styles) + "\"";
	    }

	    // Add the attributes
	    for (var attr in this.attributes) {
	        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
	            markup += " " + attr + "=\"";
	            markup += utils.escape(this.attributes[attr]);
	            markup += "\"";
	        }
	    }

	    markup += ">";

	    // Add the markup of the children, also as markup
	    for (var i = 0; i < this.children.length; i++) {
	        markup += this.children[i].toMarkup();
	    }

	    markup += "</span>";

	    return markup;
	};

	/**
	 * This node represents a document fragment, which contains elements, but when
	 * placed into the DOM doesn't have any representation itself. Thus, it only
	 * contains children and doesn't have any HTML properties. It also keeps track
	 * of a height, depth, and maxFontSize.
	 */
	function documentFragment(children, height, depth, maxFontSize) {
	    this.children = children || [];
	    this.height = height || 0;
	    this.depth = depth || 0;
	    this.maxFontSize = maxFontSize || 0;
	}

	/**
	 * Convert the fragment into a node
	 */
	documentFragment.prototype.toNode = function() {
	    // Create a fragment
	    var frag = document.createDocumentFragment();

	    // Append the children
	    for (var i = 0; i < this.children.length; i++) {
	        frag.appendChild(this.children[i].toNode());
	    }

	    return frag;
	};

	/**
	 * Convert the fragment into HTML markup
	 */
	documentFragment.prototype.toMarkup = function() {
	    var markup = "";

	    // Simply concatenate the markup for the children together
	    for (var i = 0; i < this.children.length; i++) {
	        markup += this.children[i].toMarkup();
	    }

	    return markup;
	};

	/**
	 * A symbol node contains information about a single symbol. It either renders
	 * to a single text node, or a span with a single text node in it, depending on
	 * whether it has CSS classes, styles, or needs italic correction.
	 */
	function symbolNode(value, height, depth, italic, skew, classes, style) {
	    this.value = value || "";
	    this.height = height || 0;
	    this.depth = depth || 0;
	    this.italic = italic || 0;
	    this.skew = skew || 0;
	    this.classes = classes || [];
	    this.style = style || {};
	    this.maxFontSize = 0;
	}

	/**
	 * Creates a text node or span from a symbol node. Note that a span is only
	 * created if it is needed.
	 */
	symbolNode.prototype.toNode = function() {
	    var node = document.createTextNode(this.value);
	    var span = null;

	    if (this.italic > 0) {
	        span = document.createElement("span");
	        span.style.marginRight = this.italic + "em";
	    }

	    if (this.classes.length > 0) {
	        span = span || document.createElement("span");
	        span.className = createClass(this.classes);
	    }

	    for (var style in this.style) {
	        if (this.style.hasOwnProperty(style)) {
	            span = span || document.createElement("span");
	            span.style[style] = this.style[style];
	        }
	    }

	    if (span) {
	        span.appendChild(node);
	        return span;
	    } else {
	        return node;
	    }
	};

	/**
	 * Creates markup for a symbol node.
	 */
	symbolNode.prototype.toMarkup = function() {
	    // TODO(alpert): More duplication than I'd like from
	    // span.prototype.toMarkup and symbolNode.prototype.toNode...
	    var needsSpan = false;

	    var markup = "<span";

	    if (this.classes.length) {
	        needsSpan = true;
	        markup += " class=\"";
	        markup += utils.escape(createClass(this.classes));
	        markup += "\"";
	    }

	    var styles = "";

	    if (this.italic > 0) {
	        styles += "margin-right:" + this.italic + "em;";
	    }
	    for (var style in this.style) {
	        if (this.style.hasOwnProperty(style)) {
	            styles += utils.hyphenate(style) + ":" + this.style[style] + ";";
	        }
	    }

	    if (styles) {
	        needsSpan = true;
	        markup += " style=\"" + utils.escape(styles) + "\"";
	    }

	    var escaped = utils.escape(this.value);
	    if (needsSpan) {
	        markup += ">";
	        markup += escaped;
	        markup += "</span>";
	        return markup;
	    } else {
	        return escaped;
	    }
	};

	module.exports = {
	    span: span,
	    documentFragment: documentFragment,
	    symbolNode: symbolNode
	};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

	/**
	 * The resulting parse tree nodes of the parse tree.
	 */
	function ParseNode(type, value, mode) {
	    this.type = type;
	    this.value = value;
	    this.mode = mode;
	}

	/**
	 * A result and final position returned by the `.parse...` functions.
	 * 
	 */
	function ParseResult(result, newPosition, peek) {
	    this.result = result;
	    this.position = newPosition;
	}

	module.exports = {
	    ParseNode: ParseNode,
	    ParseResult: ParseResult
	};



/***/ }),
/* 28 */,
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var BaseSelectionHandler, Chunk;

	Chunk = __webpack_require__(15);

	BaseSelectionHandler = function () {
	  function BaseSelectionHandler() {}

	  BaseSelectionHandler.prototype.getCopyOfSelection = function (selection, chunk, cloneId) {
	    if (cloneId == null) {
	      cloneId = false;
	    }
	    return chunk.clone(cloneId);
	  };

	  BaseSelectionHandler.prototype.selectStart = function (selection, chunk, asRange) {
	    return false;
	  };

	  BaseSelectionHandler.prototype.selectEnd = function (selection, chunk, asRange) {
	    return false;
	  };

	  BaseSelectionHandler.prototype.selectAll = function (selection, chunk) {
	    this.selectStart(selection, chunk, true);
	    return this.selectEnd(selection, chunk, true);
	  };

	  BaseSelectionHandler.prototype.getVirtualSelectionStartData = function (selection, chunk) {
	    return null;
	  };

	  BaseSelectionHandler.prototype.getDOMSelectionStart = function (selection, chunk) {
	    return null;
	  };

	  BaseSelectionHandler.prototype.getVirtualSelectionEndData = function (selection, chunk) {
	    return null;
	  };

	  BaseSelectionHandler.prototype.getDOMSelectionEnd = function (selection, chunk) {
	    return null;
	  };

	  BaseSelectionHandler.prototype.areCursorsEquivalent = function (selection, chunk, thisCursorData, otherCursorData) {
	    return false;
	  };

	  return BaseSelectionHandler;
	}();

	module.exports = BaseSelectionHandler;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ChunkStyleList, StyleRange, StyleType, keySortFn;

	StyleType = __webpack_require__(5);

	StyleRange = __webpack_require__(17);

	keySortFn = function keySortFn(a, b) {
	  return Number(a) - Number(b);
	};

	ChunkStyleList = function () {
	  function ChunkStyleList() {
	    this.clear();
	  }

	  ChunkStyleList.prototype.clear = function () {
	    return this.styles = [];
	  };

	  ChunkStyleList.prototype.getExportedObject = function () {
	    var j, len, output, ref, style;
	    if (this.styles.length === 0) {
	      return null;
	    }
	    output = [];
	    ref = this.styles;
	    for (j = 0, len = ref.length; j < len; j++) {
	      style = ref[j];
	      output.push(style.getExportedObject());
	    }
	    return output;
	  };

	  ChunkStyleList.prototype.clone = function () {
	    var cloneStyleList, j, len, ref, style;
	    cloneStyleList = new ChunkStyleList();
	    ref = this.styles;
	    for (j = 0, len = ref.length; j < len; j++) {
	      style = ref[j];
	      cloneStyleList.add(style.clone());
	    }
	    return cloneStyleList;
	  };

	  ChunkStyleList.prototype.length = function () {
	    return this.styles.length;
	  };

	  ChunkStyleList.prototype.get = function () {
	    return this.styles[i];
	  };

	  ChunkStyleList.prototype.add = function (styleRange) {
	    return this.styles.push(styleRange);
	  };

	  ChunkStyleList.prototype.remove = function (styleRange) {
	    var co, comparisons, j, k, l, leftRange, len, len1, len2, len3, m, origEnd, ref, ref1, ref2, ref3, rightRange;
	    comparisons = this.getStyleComparisonsForRange(styleRange.start, styleRange.end, styleRange.type);
	    ref = comparisons.enscapsulatedBy;
	    for (j = 0, len = ref.length; j < len; j++) {
	      co = ref[j];
	      co.invalidate();
	    }
	    ref1 = comparisons.left;
	    for (k = 0, len1 = ref1.length; k < len1; k++) {
	      co = ref1[k];
	      co.end = styleRange.start;
	    }
	    ref2 = comparisons.right;
	    for (l = 0, len2 = ref2.length; l < len2; l++) {
	      co = ref2[l];
	      co.start = styleRange.end;
	    }
	    ref3 = comparisons.contains;
	    for (m = 0, len3 = ref3.length; m < len3; m++) {
	      co = ref3[m];
	      leftRange = co;
	      origEnd = leftRange.end;
	      leftRange.end = styleRange.start;
	      rightRange = new StyleRange(styleRange.end, origEnd, co.type, co.data);
	      if (leftRange.length() === 0) {
	        leftRange.invalidate();
	      }
	      if (rightRange.length() > 0) {
	        this.add(rightRange);
	      }
	    }
	    return this.normalize();
	  };

	  ChunkStyleList.prototype.getStyleComparisonsForRange = function (from, to, type) {
	    var comparisons, curComparison, j, len, ref, style;
	    type = type || null;
	    to = to || from;
	    comparisons = {
	      after: [],
	      before: [],
	      enscapsulatedBy: [],
	      contains: [],
	      left: [],
	      right: []
	    };
	    ref = this.styles;
	    for (j = 0, len = ref.length; j < len; j++) {
	      style = ref[j];
	      curComparison = style.compareToRange(from, to);
	      if (type === null || style.type === type) {
	        comparisons[curComparison].push(style);
	      }
	    }
	    return comparisons;
	  };

	  ChunkStyleList.prototype.rangeHasStyle = function (from, to, styleType) {
	    return this.getStyleComparisonsForRange(from, to, styleType).contains.length > 0;
	  };

	  ChunkStyleList.prototype.getStylesInRange = function (from, to) {
	    var j, len, range, ref, styles;
	    styles = {};
	    ref = this.getStyleComparisonsForRange(from, to).contains;
	    for (j = 0, len = ref.length; j < len; j++) {
	      range = ref[j];
	      styles[range.type] = range.type;
	    }
	    return styles;
	  };

	  ChunkStyleList.prototype.getStyles = function () {
	    var j, len, range, ref, styles;
	    styles = {};
	    ref = this.styles;
	    for (j = 0, len = ref.length; j < len; j++) {
	      range = ref[j];
	      styles[range.type] = range.type;
	    }
	    return styles;
	  };

	  ChunkStyleList.prototype.cleanupSuperscripts = function () {
	    var curLevel, curRange, i, j, k, len, len1, level, mark, newStyles, ref, styleRange;
	    mark = [];
	    newStyles = [];
	    ref = this.styles;
	    for (j = 0, len = ref.length; j < len; j++) {
	      styleRange = ref[j];
	      if (styleRange.type !== StyleType.SUPERSCRIPT) {
	        newStyles.push(styleRange);
	        continue;
	      }
	      if (mark[styleRange.start] == null) {
	        mark[styleRange.start] = 0;
	      }
	      if (mark[styleRange.end] == null) {
	        mark[styleRange.end] = 0;
	      }
	      level = parseInt(styleRange.data, 10);
	      mark[styleRange.start] += level;
	      mark[styleRange.end] -= level;
	    }
	    curRange = new StyleRange(-1, -1, StyleType.SUPERSCRIPT, 0);
	    curLevel = 0;
	    for (i = k = 0, len1 = mark.length; k < len1; i = ++k) {
	      level = mark[i];
	      if (mark[i] == null) {
	        continue;
	      }
	      curLevel += level;
	      if (curRange.start === -1) {
	        curRange.start = i;
	        curRange.data = curLevel;
	      } else if (curRange.end === -1) {
	        curRange.end = i;
	        if (curRange.data !== 0) {
	          newStyles.push(curRange);
	        }
	        curRange = new StyleRange(i, -1, StyleType.SUPERSCRIPT, curLevel);
	      }
	    }
	    return this.styles = newStyles;
	  };

	  ChunkStyleList.prototype.normalize = function () {
	    var curData, curEncodedData, data, dataValues, datas, datasToCheck, end, i, j, k, key, keys, l, len, len1, len2, m, n, name, name1, newStyles, range, ref, ref1, ref2, start, style, styleName, styleRange, styleType, t, tmp, total;
	    this.cleanupSuperscripts();
	    newStyles = [];
	    datasToCheck = {};
	    dataValues = {};
	    for (styleName in StyleType) {
	      styleType = StyleType[styleName];
	      datasToCheck[styleType] = [];
	      dataValues[styleType] = [];
	    }
	    for (i = j = ref = this.styles.length - 1; j >= 0; i = j += -1) {
	      styleRange = this.styles[i];
	      curData = styleRange.data;
	      curEncodedData = JSON.stringify(curData);
	      if (datasToCheck[styleRange.type].indexOf(curEncodedData) === -1) {
	        datasToCheck[styleRange.type].push(curEncodedData);
	        dataValues[styleRange.type].push(curData);
	      }
	    }
	    for (styleType in dataValues) {
	      datas = dataValues[styleType];
	      for (k = 0, len = datas.length; k < len; k++) {
	        data = datas[k];
	        tmp = {};
	        total = 0;
	        start = null;
	        ref1 = this.styles;
	        for (l = 0, len1 = ref1.length; l < len1; l++) {
	          range = ref1[l];
	          if (range.isMergeable(styleType, data)) {
	            if (tmp[name = range.start] == null) {
	              tmp[name] = 0;
	            }
	            if (tmp[name1 = range.end] == null) {
	              tmp[name1] = 0;
	            }
	            tmp[range.start]++;
	            tmp[range.end]--;
	          }
	        }
	        keys = Object.keys(tmp).sort(keySortFn);
	        for (m = 0, len2 = keys.length; m < len2; m++) {
	          key = keys[m];
	          end = Number(key);
	          t = tmp[key];
	          if (start == null) {
	            start = end;
	          }
	          total += t;
	          if (total === 0) {
	            newStyles.push(new StyleRange(start, end, styleType, data));
	            start = null;
	          }
	        }
	      }
	    }
	    for (i = n = ref2 = newStyles.length - 1; n >= 0; i = n += -1) {
	      style = newStyles[i];
	      if (style.isInvalid()) {
	        newStyles.splice(i, 1);
	      }
	    }
	    return this.styles = newStyles;
	  };

	  return ChunkStyleList;
	}();

	ChunkStyleList.createFromObject = function (o) {
	  var j, len, rangeObj, styleList;
	  styleList = new ChunkStyleList();
	  if (o != null) {
	    for (j = 0, len = o.length; j < len; j++) {
	      rangeObj = o[j];
	      styleList.add(StyleRange.createFromObject(rangeObj));
	    }
	  }
	  return styleList;
	};

	module.exports = ChunkStyleList;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ObjectAssign, StyleableText, TextGroup, TextGroupItem, Util, addChildToGroup, createChild, getItemsArray, removeAllChildrenFromGroup, removeChildFromGroup, setChildToGroup;

	StyleableText = __webpack_require__(10);

	Util = __webpack_require__(20);

	TextGroupItem = __webpack_require__(32);

	ObjectAssign = __webpack_require__(13);

	getItemsArray = function getItemsArray(itemOrItems) {
	  if (itemOrItems instanceof TextGroupItem) {
	    return [itemOrItems];
	  } else {
	    return itemOrItems;
	  }
	};

	addChildToGroup = function addChildToGroup(itemOrItems, group, atIndex) {
	  var item, items, j, len, results;
	  if (atIndex == null) {
	    atIndex = null;
	  }
	  items = getItemsArray(itemOrItems);
	  if (atIndex === null) {
	    group.items = group.items.concat(items);
	  } else {
	    group.items = group.items.slice(0, atIndex).concat(items).concat(group.items.slice(atIndex));
	  }
	  results = [];
	  for (j = 0, len = items.length; j < len; j++) {
	    item = items[j];
	    results.push(item.parent = group);
	  }
	  return results;
	};

	removeChildFromGroup = function removeChildFromGroup(itemOrItems, group) {
	  var item, items, j, len, removed, removedItems;
	  removedItems = [];
	  items = getItemsArray(itemOrItems);
	  for (j = 0, len = items.length; j < len; j++) {
	    item = items[j];
	    removed = group.items.splice(item.index, 1)[0];
	    removed.parent = null;
	    removedItems.push(removed);
	  }
	  return removedItems;
	};

	setChildToGroup = function setChildToGroup(item, group, atIndex) {
	  group.items[atIndex] = item;
	  return item.parent = group;
	};

	removeAllChildrenFromGroup = function removeAllChildrenFromGroup(group) {
	  var item, j, len, ref;
	  ref = group.items;
	  for (j = 0, len = ref.length; j < len; j++) {
	    item = ref[j];
	    item.parent = null;
	  }
	  return group.items = [];
	};

	createChild = function createChild(text, data, dataTemplate) {
	  return new TextGroupItem(text, Util.createData(data, dataTemplate));
	};

	TextGroup = function () {
	  function TextGroup(maxItems1, dataTemplate, initialItems) {
	    var item, j, len;
	    this.maxItems = maxItems1 != null ? maxItems1 : 2e308;
	    if (dataTemplate == null) {
	      dataTemplate = {};
	    }
	    if (initialItems == null) {
	      initialItems = [];
	    }
	    this.items = [];
	    this.dataTemplate = Object.freeze(ObjectAssign({}, dataTemplate));
	    for (j = 0, len = initialItems.length; j < len; j++) {
	      item = initialItems[j];
	      this.add(item.text, item.data);
	    }
	  }

	  TextGroup.prototype.clear = function () {
	    return removeAllChildrenFromGroup(this);
	  };

	  TextGroup.prototype.indexOf = function (item) {
	    return this.items.indexOf(item);
	  };

	  TextGroup.prototype.init = function (numItems) {
	    if (numItems == null) {
	      numItems = 1;
	    }
	    this.clear();
	    while (numItems-- && !this.isFull) {
	      this.add();
	    }
	    return this;
	  };

	  TextGroup.prototype.fill = function () {
	    var results;
	    if (this.maxItems === 2e308) {
	      return;
	    }
	    results = [];
	    while (!this.isFull) {
	      results.push(this.add());
	    }
	    return results;
	  };

	  TextGroup.prototype.add = function (text, data) {
	    if (this.isFull) {
	      return this;
	    }
	    addChildToGroup(createChild(text, data, this.dataTemplate), this);
	    return this;
	  };

	  TextGroup.prototype.addAt = function (index, text, data) {
	    if (this.isFull) {
	      return this;
	    }
	    addChildToGroup(createChild(text, data, this.dataTemplate), this, index);
	    return this;
	  };

	  TextGroup.prototype.addGroup = function (group, cloneDataFn) {
	    if (cloneDataFn == null) {
	      cloneDataFn = Util.defaultCloneFn;
	    }
	    return this.addGroupAt(group, null, cloneDataFn);
	  };

	  TextGroup.prototype.addGroupAt = function (group, index, cloneDataFn) {
	    var clone, item, itemsToAdd, j, len, ref;
	    if (cloneDataFn == null) {
	      cloneDataFn = Util.defaultCloneFn;
	    }
	    itemsToAdd = [];
	    ref = group.items;
	    for (j = 0, len = ref.length; j < len; j++) {
	      item = ref[j];
	      clone = item.clone(cloneDataFn);
	      itemsToAdd.push(createChild(clone.text, clone.data, this.dataTemplate));
	    }
	    addChildToGroup(itemsToAdd, this, index);
	    return this;
	  };

	  TextGroup.prototype.get = function (index) {
	    return this.items[index];
	  };

	  TextGroup.prototype.set = function (index, text, data) {
	    return setChildToGroup(createChild(text, data, this.dataTemplate), this, index);
	  };

	  TextGroup.prototype.remove = function (index) {
	    return removeChildFromGroup(this.items[index], this)[0];
	  };

	  TextGroup.prototype.clone = function (cloneDataFn) {
	    var clonedItems, item, j, len, ref;
	    if (cloneDataFn == null) {
	      cloneDataFn = Util.defaultCloneFn;
	    }
	    clonedItems = [];
	    ref = this.items;
	    for (j = 0, len = ref.length; j < len; j++) {
	      item = ref[j];
	      clonedItems.push(item.clone(cloneDataFn));
	    }
	    return new TextGroup(this.maxItems, this.dataTemplate, clonedItems);
	  };

	  TextGroup.prototype.toDescriptor = function () {
	    var desc, item, j, len, ref;
	    desc = [];
	    ref = this.items;
	    for (j = 0, len = ref.length; j < len; j++) {
	      item = ref[j];
	      desc.push({
	        text: item.text.getExportedObject(),
	        data: Util.defaultCloneFn(item.data)
	      });
	    }
	    return desc;
	  };

	  TextGroup.prototype.toSlice = function (from, to) {
	    if (to == null) {
	      to = 2e308;
	    }
	    removeChildFromGroup(this.items.slice(to), this);
	    removeChildFromGroup(this.items.slice(0, from), this);
	    return this;
	  };

	  TextGroup.prototype.splitBefore = function (index) {
	    var item, sibling;
	    sibling = new TextGroup(this.maxItems, this.dataTemplate);
	    while (this.length !== index) {
	      item = this.remove(index);
	      sibling.add(item.text, item.data);
	    }
	    return sibling;
	  };

	  TextGroup.prototype.splitText = function (index, offset) {
	    var item, newItem;
	    item = this.items[index];
	    newItem = createChild(item.text.split(offset), Util.defaultCloneFn(item.data), this.dataTemplate);
	    addChildToGroup(newItem, this, index + 1);
	    return newItem;
	  };

	  TextGroup.prototype.merge = function (index, mergeDataFn) {
	    var consumerItem, digestedItem;
	    if (mergeDataFn == null) {
	      mergeDataFn = Util.defaultMergeFn;
	    }
	    digestedItem = this.items.splice(index + 1, 1)[0];
	    consumerItem = this.items[index];
	    if (!digestedItem || !consumerItem) {
	      return this;
	    }
	    consumerItem.data = Util.createData(mergeDataFn(consumerItem.data, digestedItem.data), this.dataTemplate);
	    consumerItem.text.merge(digestedItem.text);
	    return this;
	  };

	  TextGroup.prototype.deleteSpan = function (startIndex, startTextIndex, endIndex, endTextIndex, merge, mergeFn) {
	    var endItem, endText, i, item, j, len, newItems, ref, startItem, startText;
	    if (merge == null) {
	      merge = true;
	    }
	    if (mergeFn == null) {
	      mergeFn = Util.defaultMergeFn;
	    }
	    startItem = this.items[startIndex];
	    endItem = this.items[endIndex];
	    if (!startItem) {
	      startItem = this.first;
	    }
	    if (!endItem) {
	      endItem = this.last;
	    }
	    startText = startItem.text;
	    endText = endItem.text;
	    if (startText === endText) {
	      startText.deleteText(startTextIndex, endTextIndex);
	      return;
	    }
	    startText.deleteText(startTextIndex, startText.length);
	    endText.deleteText(0, endTextIndex);
	    if (merge) {
	      newItems = [];
	      ref = this.items;
	      for (i = j = 0, len = ref.length; j < len; i = ++j) {
	        item = ref[i];
	        if (i < startIndex || i > endIndex) {
	          newItems.push(item);
	        } else if (i === startIndex) {
	          newItems.push(startItem);
	        } else if (i === endIndex) {
	          newItems.push(endItem);
	        }
	      }
	      removeAllChildrenFromGroup(this);
	      addChildToGroup(newItems, this);
	      return this.merge(startIndex, mergeFn);
	    }
	  };

	  TextGroup.prototype.clearSpan = function (startIndex, startTextIndex, endIndex, endTextIndex) {
	    var endItem, endText, i, item, j, len, ref, startItem, startText;
	    startItem = this.items[startIndex];
	    endItem = this.items[endIndex];
	    startText = startItem.text;
	    endText = endItem.text;
	    if (startText === endText) {
	      startText.deleteText(startTextIndex, endTextIndex);
	      return;
	    }
	    startText.deleteText(startTextIndex, startText.length);
	    endText.deleteText(0, endTextIndex);
	    ref = this.items;
	    for (i = j = 0, len = ref.length; j < len; i = ++j) {
	      item = ref[i];
	      if (i > startIndex && i < endIndex) {
	        item.text.init();
	      }
	    }
	    return this;
	  };

	  TextGroup.prototype.styleText = function (startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
	    return this.applyStyleFunction('styleText', arguments);
	  };

	  TextGroup.prototype.unstyleText = function (startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
	    return this.applyStyleFunction('unstyleText', arguments);
	  };

	  TextGroup.prototype.toggleStyleText = function (startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
	    return this.applyStyleFunction('toggleStyleText', arguments);
	  };

	  TextGroup.prototype.applyStyleFunction = function (fn, args) {
	    var endIndex, endItem, endText, endTextIndex, foundStartText, item, j, len, ref, startIndex, startItem, startText, startTextIndex, styleData, styleType;
	    startIndex = args[0], startTextIndex = args[1], endIndex = args[2], endTextIndex = args[3], styleType = args[4], styleData = args[5];
	    startItem = this.items[startIndex];
	    endItem = this.items[endIndex];
	    startText = startItem.text;
	    endText = endItem.text;
	    if (startText === endText) {
	      startText[fn](styleType, startTextIndex, endTextIndex, styleData);
	      return;
	    }
	    foundStartText = false;
	    ref = this.items;
	    for (j = 0, len = ref.length; j < len; j++) {
	      item = ref[j];
	      if (item.text === startText) {
	        item.text[fn](styleType, startTextIndex, startText.length, styleData);
	        foundStartText = true;
	      } else if (item.text === endText) {
	        item.text[fn](styleType, 0, endTextIndex, styleData);
	        break;
	      } else if (foundStartText) {
	        item.text[fn](styleType, 0, item.text.length, styleData);
	      }
	    }
	    return this;
	  };

	  TextGroup.prototype.getStyles = function (startIndex, startTextIndex, endIndex, endTextIndex) {
	    var allStyles, endItem, endText, foundStartText, item, j, len, numTexts, ref, returnedStyles, startItem, startText, style, styles;
	    startItem = this.items[startIndex];
	    endItem = this.items[endIndex];
	    if (startItem == null || endItem == null) {
	      return {};
	    }
	    startText = startItem.text;
	    endText = endItem.text;
	    if (startText == null || endText == null) {
	      return {};
	    }
	    if (startText === endText) {
	      return startText.getStyles(startTextIndex, endTextIndex);
	    }
	    numTexts = 0;
	    allStyles = {};
	    foundStartText = false;
	    ref = this.items;
	    for (j = 0, len = ref.length; j < len; j++) {
	      item = ref[j];
	      styles = {};
	      if (item.text === startText) {
	        numTexts++;
	        styles = item.text.getStyles(startTextIndex, startText.length);
	        foundStartText = true;
	      } else if (item.text === endText) {
	        numTexts++;
	        styles = item.text.getStyles(0, endTextIndex);
	      } else if (foundStartText) {
	        numTexts++;
	        styles = item.text.getStyles(0, item.text.length);
	      }
	      for (style in styles) {
	        if (allStyles[style] != null) {
	          allStyles[style]++;
	        } else {
	          allStyles[style] = 1;
	        }
	      }
	      if (item.text === endText) {
	        break;
	      }
	    }
	    returnedStyles = {};
	    for (style in allStyles) {
	      if (allStyles[style] === numTexts) {
	        returnedStyles[style] = style;
	      }
	    }
	    return returnedStyles;
	  };

	  TextGroup.prototype.__debug_print = function () {
	    var item, j, len, ref, results;
	    console.log('========================');
	    ref = this.items;
	    results = [];
	    for (j = 0, len = ref.length; j < len; j++) {
	      item = ref[j];
	      item.text.__debug_print();
	      console.log(JSON.stringify(item.data));
	      results.push(console.log('---------------------'));
	    }
	    return results;
	  };

	  return TextGroup;
	}();

	Object.defineProperties(TextGroup.prototype, {
	  "length": {
	    "get": function get() {
	      return this.items.length;
	    }
	  },
	  "first": {
	    "get": function get() {
	      return this.items[0];
	    }
	  },
	  "last": {
	    "get": function get() {
	      return this.items[this.items.length - 1];
	    }
	  },
	  "isFull": {
	    "get": function get() {
	      return this.items.length === this.maxItems;
	    }
	  },
	  "isEmpty": {
	    "get": function get() {
	      return this.items.length === 0;
	    }
	  },
	  "isBlank": {
	    "get": function get() {
	      return this.isEmpty || this.items.length === 1 && this.first.text.length === 0;
	    }
	  }
	});

	TextGroup.fromDescriptor = function (descriptor, maxItems, dataTemplate, restoreDataDescriptorFn) {
	  var item, items, j, len;
	  if (restoreDataDescriptorFn == null) {
	    restoreDataDescriptorFn = Util.defaultCloneFn;
	  }
	  items = [];
	  for (j = 0, len = descriptor.length; j < len; j++) {
	    item = descriptor[j];
	    items.push(createChild(StyleableText.createFromObject(item.text), restoreDataDescriptorFn(item.data), dataTemplate));
	  }
	  return new TextGroup(maxItems, dataTemplate, items);
	};

	TextGroup.create = function (maxItems, dataTemplate, numItemsToCreate) {
	  var group;
	  if (maxItems == null) {
	    maxItems = 2e308;
	  }
	  if (dataTemplate == null) {
	    dataTemplate = {};
	  }
	  if (numItemsToCreate == null) {
	    numItemsToCreate = 1;
	  }
	  group = new TextGroup(maxItems, dataTemplate);
	  group.init(numItemsToCreate);
	  return group;
	};

	window.TextGroup = TextGroup;

	module.exports = TextGroup;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var StyleableText, TextGroupItem, Util;

	StyleableText = __webpack_require__(10);

	Util = __webpack_require__(20);

	module.exports = TextGroupItem = function () {
	  function TextGroupItem(text, data, parent) {
	    this.text = text != null ? text : new StyleableText();
	    this.data = data != null ? data : {};
	    this.parent = parent != null ? parent : null;
	  }

	  TextGroupItem.prototype.clone = function (cloneDataFn) {
	    if (cloneDataFn == null) {
	      cloneDataFn = Util.defaultCloneFn;
	    }
	    return new TextGroupItem(this.text.clone(), cloneDataFn(this.data), null);
	  };

	  return TextGroupItem;
	}();

	Object.defineProperties(TextGroupItem.prototype, {
	  "index": {
	    "get": function get() {
	      if (this.parent === null) {
	        return -1;
	      }
	      return this.parent.indexOf(this);
	    }
	  }
	});

/***/ }),
/* 33 */
/***/ (function(module, exports) {

	'use strict';

	var isElementInline, _sanitize;

	_sanitize = function sanitize(node) {
	  var attr, child, i, j, len, len1, ref, ref1;
	  if (node.nodeType === Node.ELEMENT_NODE) {
	    if (node.tagName.toLowerCase() === 'script') {
	      node = node.parentElement.replaceChild(document.createElement('span'), node);
	    }
	    ref = node.attributes;
	    for (i = 0, len = ref.length; i < len; i++) {
	      attr = ref[i];
	      switch (attr.name) {
	        case 'href':
	        case 'cite':
	        case 'style':
	          true;
	          break;
	        default:
	          node.setAttribute(attr.name, '');
	      }
	    }
	    ref1 = node.childNodes;
	    for (j = 0, len1 = ref1.length; j < len1; j++) {
	      child = ref1[j];
	      _sanitize(child);
	    }
	  }
	  return node;
	};

	isElementInline = function isElementInline(el) {
	  switch (el.tagName.toLowerCase()) {
	    case 'b':
	    case 'big':
	    case 'i':
	    case 'small':
	    case 'tt':
	    case 'abbr':
	    case 'acronym':
	    case 'cite':
	    case 'code':
	    case 'dfn':
	    case 'em':
	    case 'kbd':
	    case 'strong':
	    case 'samp':
	    case 'time':
	    case 'var':
	    case 'a':
	    case 'bdo':
	    case 'br':
	    case 'img':
	    case 'map':
	    case 'object':
	    case 'q':
	    case 'script':
	    case 'span':
	    case 'sub':
	    case 'sup':
	    case 'button':
	    case 'input':
	    case 'label':
	    case 'select':
	    case 'textarea':
	      return true;
	    default:
	      return false;
	  }
	};

	module.exports = {
	  sanitize: _sanitize,
	  isElementInline: isElementInline
	};

/***/ }),
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(270);

	module.exports = React.createClass({
	  displayName: "exports",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      indent: 0
	    };
	  },
	  focus: function focus() {
	    return ReactDOM.findDOMNode(this.refs.button).focus();
	  },
	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "obojobo-draft--components--delete-button" },
	      React.createElement(
	        "button",
	        {
	          ref: "button",
	          onClick: this.props.onClick,
	          tabIndex: this.props.shouldPreventTab ? '-1' : this.props.tabIndex,
	          disabled: this.props.shouldPreventTab
	        },
	        "Delete"
	      )
	    );
	  }
	});

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var Dispatcher, Store;

	Dispatcher = __webpack_require__(4);

	Store = function () {
	  function Store(name) {
	    this.name = name;
	  }

	  Store.prototype.init = function () {
	    return this.state = {};
	  };

	  Store.prototype.triggerChange = function () {
	    return Dispatcher.trigger(this.name + ":change");
	  };

	  Store.prototype.onChange = function (callback) {
	    return Dispatcher.on(this.name + ":change", callback);
	  };

	  Store.prototype.offChange = function (callback) {
	    return Dispatcher.off(this.name + ":change", callback);
	  };

	  Store.prototype.setAndTrigger = function (keyValues) {
	    Object.assign(this.state, keyValues);
	    return this.triggerChange();
	  };

	  Store.prototype.getState = function () {
	    return Object.assign({}, this.state);
	  };

	  Store.prototype.setState = function (newState) {
	    return this.state = Object.assign({}, newState);
	  };

	  return Store;
	}();

	module.exports = Store;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var DOMSelection, OboSelectionRect;

	DOMSelection = __webpack_require__(21);

	OboSelectionRect = function () {
	  function OboSelectionRect() {
	    this.type = OboSelectionRect.TYPE_NONE;
	    this.top = 0;
	    this.right = 0;
	    this.bottom = 0;
	    this.left = 0;
	    this.width = 0;
	    this.height = 0;
	  }

	  return OboSelectionRect;
	}();

	Object.defineProperties(OboSelectionRect.prototype, {
	  "valid": {
	    get: function get() {
	      return this.type !== OboSelectionRect.TYPE_NONE;
	    }
	  }
	});

	OboSelectionRect.TYPE_NONE = 'none';

	OboSelectionRect.TYPE_CARET = 'caret';

	OboSelectionRect.TYPE_SELECTION = 'selection';

	OboSelectionRect.TYPE_CHUNKS = 'chunks';

	OboSelectionRect.createFromSelection = function () {
	  var clientRect, clientRects, i, len, rect, sel, selType;
	  rect = new OboSelectionRect();
	  sel = new DOMSelection();
	  selType = sel.getType();
	  if (selType === "none") {
	    return rect;
	  }
	  clientRects = sel.getClientRects();
	  rect.type = selType === 'caret' ? OboSelectionRect.TYPE_CARET : OboSelectionRect.TYPE_SELECTION;
	  rect.top = 2e308;
	  rect.right = -2e308;
	  rect.bottom = -2e308;
	  rect.left = 2e308;
	  for (i = 0, len = clientRects.length; i < len; i++) {
	    clientRect = clientRects[i];
	    rect.top = Math.min(rect.top, clientRect.top);
	    rect.right = Math.max(rect.right, clientRect.right);
	    rect.bottom = Math.max(rect.bottom, clientRect.bottom);
	    rect.left = Math.min(rect.left, clientRect.left);
	  }
	  rect.width = rect.right - rect.left;
	  rect.height = rect.bottom - rect.top;
	  rect.selection = sel;
	  rect.chunks = null;
	  return rect;
	};

	OboSelectionRect.createFromChunks = function (chunks) {
	  var chunk, chunkRect, i, len, rect;
	  if (chunks == null) {
	    chunks = [];
	  }
	  rect = new OboSelectionRect();
	  rect.type = OboSelectionRect.TYPE_CHUNKS;
	  rect.top = 2e308;
	  rect.right = -2e308;
	  rect.bottom = -2e308;
	  rect.left = 2e308;
	  for (i = 0, len = chunks.length; i < len; i++) {
	    chunk = chunks[i];
	    if (chunk == null) {
	      continue;
	    }
	    chunkRect = chunk.getDomEl().getBoundingClientRect();
	    rect.top = Math.min(rect.top, chunkRect.top);
	    rect.right = Math.max(rect.right, chunkRect.right);
	    rect.bottom = Math.max(rect.bottom, chunkRect.bottom);
	    rect.left = Math.min(rect.left, chunkRect.left);
	  }
	  rect.width = rect.right - rect.left;
	  rect.height = rect.bottom - rect.top;
	  rect.chunks = chunks;
	  rect.selection = null;
	  return rect;
	};

	module.exports = OboSelectionRect;

/***/ }),
/* 49 */
/***/ (function(module, exports) {

	"use strict";

	var VirtualCursor;

	VirtualCursor = function () {
	  function VirtualCursor(chunk, data) {
	    this.chunk = chunk;
	    this.data = data;
	  }

	  VirtualCursor.prototype.isEquivalentTo = function (otherCursor) {
	    return this.chunk.areCursorsEquivalent(this, otherCursor);
	  };

	  VirtualCursor.prototype.clone = function () {
	    return new VirtualCursor(this.chunk, Object.assign({}, this.data));
	  };

	  return VirtualCursor;
	}();

	module.exports = VirtualCursor;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Dispatcher, FocusUtil, OboModel;

	Dispatcher = __webpack_require__(4);

	OboModel = __webpack_require__(15);

	FocusUtil = {
	  focusComponent: function focusComponent(id) {
	    return Dispatcher.trigger('focus:component', {
	      value: {
	        id: id
	      }
	    });
	  },
	  unfocus: function unfocus() {
	    return Dispatcher.trigger('focus:unfocus');
	  },
	  getFocussedComponent: function getFocussedComponent(state) {
	    return OboModel.models[state.focussedId];
	  }
	};

	module.exports = FocusUtil;

/***/ }),
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This is the main entry point for KaTeX. Here, we expose functions for
	 * rendering expressions either to DOM nodes or to markup strings.
	 *
	 * We also expose the ParseError class to check if errors thrown from KaTeX are
	 * errors in the expression, or errors in javascript handling.
	 */

	var ParseError = __webpack_require__(2);
	var Settings = __webpack_require__(25);

	var buildTree = __webpack_require__(66);
	var parseTree = __webpack_require__(72);
	var utils = __webpack_require__(1);

	/**
	 * Parse and build an expression, and place that expression in the DOM node
	 * given.
	 */
	var render = function(expression, baseNode, options) {
	    utils.clearNode(baseNode);

	    var settings = new Settings(options);

	    var tree = parseTree(expression, settings);
	    var node = buildTree(tree, expression, settings).toNode();

	    baseNode.appendChild(node);
	};

	// KaTeX's styles don't work properly in quirks mode. Print out an error, and
	// disable rendering.
	if (typeof document !== "undefined") {
	    if (document.compatMode !== "CSS1Compat") {
	        typeof console !== "undefined" && console.warn(
	            "Warning: KaTeX doesn't work in quirks mode. Make sure your " +
	                "website has a suitable doctype.");

	        render = function() {
	            throw new ParseError("KaTeX doesn't work in quirks mode.");
	        };
	    }
	}

	/**
	 * Parse and build an expression, and return the markup for that.
	 */
	var renderToString = function(expression, options) {
	    var settings = new Settings(options);

	    var tree = parseTree(expression, settings);
	    return buildTree(tree, expression, settings).toMarkup();
	};

	/**
	 * Parse an expression and return the parse tree.
	 */
	var generateParseTree = function(expression, options) {
	    var settings = new Settings(options);
	    return parseTree(expression, settings);
	};

	module.exports = {
	    render: render,
	    renderToString: renderToString,
	    /**
	     * NOTE: This method is not currently recommended for public use.
	     * The internal tree representation is unstable and is very likely
	     * to change. Use at your own risk.
	     */
	    __parse: generateParseTree,
	    ParseError: ParseError
	};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * The Lexer class handles tokenizing the input in various ways. Since our
	 * parser expects us to be able to backtrack, the lexer allows lexing from any
	 * given starting point.
	 *
	 * Its main exposed function is the `lex` function, which takes a position to
	 * lex from and a type of token to lex. It defers to the appropriate `_innerLex`
	 * function.
	 *
	 * The various `_innerLex` functions perform the actual lexing of different
	 * kinds.
	 */

	var matchAt = __webpack_require__(73);

	var ParseError = __webpack_require__(2);

	// The main lexer class
	function Lexer(input) {
	    this._input = input;
	}

	// The resulting token returned from `lex`.
	function Token(text, data, position) {
	    this.text = text;
	    this.data = data;
	    this.position = position;
	}

	// "normal" types of tokens. These are tokens which can be matched by a simple
	// regex
	var mathNormals = [
	    /[/|@.""`0-9a-zA-Z]/, // ords
	    /[*+-]/, // bins
	    /[=<>:]/, // rels
	    /[,;]/, // punctuation
	    /['\^_{}]/, // misc
	    /[(\[]/, // opens
	    /[)\]?!]/, // closes
	    /~/, // spacing
	    /&/, // horizontal alignment
	    /\\\\/ // line break
	];

	// These are "normal" tokens like above, but should instead be parsed in text
	// mode.
	var textNormals = [
	    /[a-zA-Z0-9`!@*()-=+\[\]'";:?\/.,]/, // ords
	    /[{}]/, // grouping
	    /~/, // spacing
	    /&/, // horizontal alignment
	    /\\\\/ // line break
	];

	// Regexes for matching whitespace
	var whitespaceRegex = /\s*/;
	var whitespaceConcatRegex = / +|\\  +/;

	// This regex matches any other TeX function, which is a backslash followed by a
	// word or a single symbol
	var anyFunc = /\\(?:[a-zA-Z]+|.)/;

	/**
	 * This function lexes a single normal token. It takes a position, a list of
	 * "normal" tokens to try, and whether it should completely ignore whitespace or
	 * not.
	 */
	Lexer.prototype._innerLex = function(pos, normals, ignoreWhitespace) {
	    var input = this._input;
	    var whitespace;

	    if (ignoreWhitespace) {
	        // Get rid of whitespace.
	        whitespace = matchAt(whitespaceRegex, input, pos)[0];
	        pos += whitespace.length;
	    } else {
	        // Do the funky concatenation of whitespace that happens in text mode.
	        whitespace = matchAt(whitespaceConcatRegex, input, pos);
	        if (whitespace !== null) {
	            return new Token(" ", null, pos + whitespace[0].length);
	        }
	    }

	    // If there's no more input to parse, return an EOF token
	    if (pos === input.length) {
	        return new Token("EOF", null, pos);
	    }

	    var match;
	    if ((match = matchAt(anyFunc, input, pos))) {
	        // If we match a function token, return it
	        return new Token(match[0], null, pos + match[0].length);
	    } else {
	        // Otherwise, we look through the normal token regexes and see if it's
	        // one of them.
	        for (var i = 0; i < normals.length; i++) {
	            var normal = normals[i];

	            if ((match = matchAt(normal, input, pos))) {
	                // If it is, return it
	                return new Token(
	                    match[0], null, pos + match[0].length);
	            }
	        }
	    }

	    throw new ParseError(
	            "Unexpected character: '" + input[pos] + "'",
	            this, pos);
	};

	// A regex to match a CSS color (like #ffffff or BlueViolet)
	var cssColor = /#[a-z0-9]+|[a-z]+/i;

	/**
	 * This function lexes a CSS color.
	 */
	Lexer.prototype._innerLexColor = function(pos) {
	    var input = this._input;

	    // Ignore whitespace
	    var whitespace = matchAt(whitespaceRegex, input, pos)[0];
	    pos += whitespace.length;

	    var match;
	    if ((match = matchAt(cssColor, input, pos))) {
	        // If we look like a color, return a color
	        return new Token(match[0], null, pos + match[0].length);
	    } else {
	        throw new ParseError("Invalid color", this, pos);
	    }
	};

	// A regex to match a dimension. Dimensions look like
	// "1.2em" or ".4pt" or "1 ex"
	var sizeRegex = /(-?)\s*(\d+(?:\.\d*)?|\.\d+)\s*([a-z]{2})/;

	/**
	 * This function lexes a dimension.
	 */
	Lexer.prototype._innerLexSize = function(pos) {
	    var input = this._input;

	    // Ignore whitespace
	    var whitespace = matchAt(whitespaceRegex, input, pos)[0];
	    pos += whitespace.length;

	    var match;
	    if ((match = matchAt(sizeRegex, input, pos))) {
	        var unit = match[3];
	        // We only currently handle "em" and "ex" units
	        if (unit !== "em" && unit !== "ex") {
	            throw new ParseError("Invalid unit: '" + unit + "'", this, pos);
	        }
	        return new Token(match[0], {
	                number: +(match[1] + match[2]),
	                unit: unit
	            }, pos + match[0].length);
	    }

	    throw new ParseError("Invalid size", this, pos);
	};

	/**
	 * This function lexes a string of whitespace.
	 */
	Lexer.prototype._innerLexWhitespace = function(pos) {
	    var input = this._input;

	    var whitespace = matchAt(whitespaceRegex, input, pos)[0];
	    pos += whitespace.length;

	    return new Token(whitespace[0], null, pos);
	};

	/**
	 * This function lexes a single token starting at `pos` and of the given mode.
	 * Based on the mode, we defer to one of the `_innerLex` functions.
	 */
	Lexer.prototype.lex = function(pos, mode) {
	    if (mode === "math") {
	        return this._innerLex(pos, mathNormals, true);
	    } else if (mode === "text") {
	        return this._innerLex(pos, textNormals, false);
	    } else if (mode === "color") {
	        return this._innerLexColor(pos);
	    } else if (mode === "size") {
	        return this._innerLexSize(pos);
	    } else if (mode === "whitespace") {
	        return this._innerLexWhitespace(pos);
	    }
	};

	module.exports = Lexer;


/***/ }),
/* 62 */
/***/ (function(module, exports) {

	/**
	 * This file contains information about the options that the Parser carries
	 * around with it while parsing. Data is held in an `Options` object, and when
	 * recursing, a new `Options` object can be created with the `.with*` and
	 * `.reset` functions.
	 */

	/**
	 * This is the main options class. It contains the style, size, color, and font
	 * of the current parse level. It also contains the style and size of the parent
	 * parse level, so size changes can be handled efficiently.
	 *
	 * Each of the `.with*` and `.reset` functions passes its current style and size
	 * as the parentStyle and parentSize of the new options class, so parent
	 * handling is taken care of automatically.
	 */
	function Options(data) {
	    this.style = data.style;
	    this.color = data.color;
	    this.size = data.size;
	    this.phantom = data.phantom;
	    this.font = data.font;

	    if (data.parentStyle === undefined) {
	        this.parentStyle = data.style;
	    } else {
	        this.parentStyle = data.parentStyle;
	    }

	    if (data.parentSize === undefined) {
	        this.parentSize = data.size;
	    } else {
	        this.parentSize = data.parentSize;
	    }
	}

	/**
	 * Returns a new options object with the same properties as "this".  Properties
	 * from "extension" will be copied to the new options object.
	 */
	Options.prototype.extend = function(extension) {
	    var data = {
	        style: this.style,
	        size: this.size,
	        color: this.color,
	        parentStyle: this.style,
	        parentSize: this.size,
	        phantom: this.phantom,
	        font: this.font
	    };

	    for (var key in extension) {
	        if (extension.hasOwnProperty(key)) {
	            data[key] = extension[key];
	        }
	    }

	    return new Options(data);
	};

	/**
	 * Create a new options object with the given style.
	 */
	Options.prototype.withStyle = function(style) {
	    return this.extend({
	        style: style
	    });
	};

	/**
	 * Create a new options object with the given size.
	 */
	Options.prototype.withSize = function(size) {
	    return this.extend({
	        size: size
	    });
	};

	/**
	 * Create a new options object with the given color.
	 */
	Options.prototype.withColor = function(color) {
	    return this.extend({
	        color: color
	    });
	};

	/**
	 * Create a new options object with "phantom" set to true.
	 */
	Options.prototype.withPhantom = function() {
	    return this.extend({
	        phantom: true
	    });
	};

	/**
	 * Create a new options objects with the give font.
	 */
	Options.prototype.withFont = function(font) {
	    return this.extend({
	        font: font
	    });
	};

	/**
	 * Create a new options object with the same style, size, and color. This is
	 * used so that parent style and size changes are handled correctly.
	 */
	Options.prototype.reset = function() {
	    return this.extend({});
	};

	/**
	 * A map of color names to CSS colors.
	 * TODO(emily): Remove this when we have real macros
	 */
	var colorMap = {
	    "katex-blue": "#6495ed",
	    "katex-orange": "#ffa500",
	    "katex-pink": "#ff00af",
	    "katex-red": "#df0030",
	    "katex-green": "#28ae7b",
	    "katex-gray": "gray",
	    "katex-purple": "#9d38bd",
	    "katex-blueA": "#c7e9f1",
	    "katex-blueB": "#9cdceb",
	    "katex-blueC": "#58c4dd",
	    "katex-blueD": "#29abca",
	    "katex-blueE": "#1c758a",
	    "katex-tealA": "#acead7",
	    "katex-tealB": "#76ddc0",
	    "katex-tealC": "#5cd0b3",
	    "katex-tealD": "#55c1a7",
	    "katex-tealE": "#49a88f",
	    "katex-greenA": "#c9e2ae",
	    "katex-greenB": "#a6cf8c",
	    "katex-greenC": "#83c167",
	    "katex-greenD": "#77b05d",
	    "katex-greenE": "#699c52",
	    "katex-goldA": "#f7c797",
	    "katex-goldB": "#f9b775",
	    "katex-goldC": "#f0ac5f",
	    "katex-goldD": "#e1a158",
	    "katex-goldE": "#c78d46",
	    "katex-redA": "#f7a1a3",
	    "katex-redB": "#ff8080",
	    "katex-redC": "#fc6255",
	    "katex-redD": "#e65a4c",
	    "katex-redE": "#cf5044",
	    "katex-maroonA": "#ecabc1",
	    "katex-maroonB": "#ec92ab",
	    "katex-maroonC": "#c55f73",
	    "katex-maroonD": "#a24d61",
	    "katex-maroonE": "#94424f",
	    "katex-purpleA": "#caa3e8",
	    "katex-purpleB": "#b189c6",
	    "katex-purpleC": "#9a72ac",
	    "katex-purpleD": "#715582",
	    "katex-purpleE": "#644172",
	    "katex-mintA": "#f5f9e8",
	    "katex-mintB": "#edf2df",
	    "katex-mintC": "#e0e5cc",
	    "katex-grayA": "#fdfdfd",
	    "katex-grayB": "#f7f7f7",
	    "katex-grayC": "#eeeeee",
	    "katex-grayD": "#dddddd",
	    "katex-grayE": "#cccccc",
	    "katex-grayF": "#aaaaaa",
	    "katex-grayG": "#999999",
	    "katex-grayH": "#555555",
	    "katex-grayI": "#333333",
	    "katex-kaBlue": "#314453",
	    "katex-kaGreen": "#639b24"
	};

	/**
	 * Gets the CSS color of the current options object, accounting for the
	 * `colorMap`.
	 */
	Options.prototype.getColor = function() {
	    if (this.phantom) {
	        return "transparent";
	    } else {
	        return colorMap[this.color] || this.color;
	    }
	};

	module.exports = Options;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	var functions = __webpack_require__(70);
	var environments = __webpack_require__(68);
	var Lexer = __webpack_require__(61);
	var symbols = __webpack_require__(8);
	var utils = __webpack_require__(1);

	var parseData = __webpack_require__(27);
	var ParseError = __webpack_require__(2);

	/**
	 * This file contains the parser used to parse out a TeX expression from the
	 * input. Since TeX isn't context-free, standard parsers don't work particularly
	 * well.
	 *
	 * The strategy of this parser is as such:
	 *
	 * The main functions (the `.parse...` ones) take a position in the current
	 * parse string to parse tokens from. The lexer (found in Lexer.js, stored at
	 * this.lexer) also supports pulling out tokens at arbitrary places. When
	 * individual tokens are needed at a position, the lexer is called to pull out a
	 * token, which is then used.
	 *
	 * The main functions also take a mode that the parser is currently in
	 * (currently "math" or "text"), which denotes whether the current environment
	 * is a math-y one or a text-y one (e.g. inside \text). Currently, this serves
	 * to limit the functions which can be used in text mode.
	 *
	 * The main functions then return an object which contains the useful data that
	 * was parsed at its given point, and a new position at the end of the parsed
	 * data. The main functions can call each other and continue the parsing by
	 * using the returned position as a new starting point.
	 *
	 * There are also extra `.handle...` functions, which pull out some reused
	 * functionality into self-contained functions.
	 *
	 * The earlier functions return `ParseResult`s, which contain a ParseNode and a
	 * new position.
	 *
	 * The later functions (which are called deeper in the parse) sometimes return
	 * ParseFuncOrArgument, which contain a ParseResult as well as some data about
	 * whether the parsed object is a function which is missing some arguments, or a
	 * standalone object which can be used as an argument to another function.
	 */

	/**
	 * Main Parser class
	 */
	function Parser(input, settings) {
	    // Make a new lexer
	    this.lexer = new Lexer(input);
	    // Store the settings for use in parsing
	    this.settings = settings;
	}

	var ParseNode = parseData.ParseNode;
	var ParseResult = parseData.ParseResult;

	/**
	 * An initial function (without its arguments), or an argument to a function.
	 * The `result` argument should be a ParseResult.
	 */
	function ParseFuncOrArgument(result, isFunction) {
	    this.result = result;
	    // Is this a function (i.e. is it something defined in functions.js)?
	    this.isFunction = isFunction;
	}

	/**
	 * Checks a result to make sure it has the right type, and throws an
	 * appropriate error otherwise.
	 */
	Parser.prototype.expect = function(result, text) {
	    if (result.text !== text) {
	        throw new ParseError(
	            "Expected '" + text + "', got '" + result.text + "'",
	            this.lexer, result.position
	        );
	    }
	};

	/**
	 * Main parsing function, which parses an entire input.
	 *
	 * @return {?Array.<ParseNode>}
	 */
	Parser.prototype.parse = function(input) {
	    // Try to parse the input
	    var parse = this.parseInput(0, "math");
	    return parse.result;
	};

	/**
	 * Parses an entire input tree.
	 */
	Parser.prototype.parseInput = function(pos, mode) {
	    // Parse an expression
	    var expression = this.parseExpression(pos, mode, false);
	    // If we succeeded, make sure there's an EOF at the end
	    this.expect(expression.peek, "EOF");
	    return expression;
	};

	var endOfExpression = ["}", "\\end", "\\right", "&", "\\\\", "\\cr"];

	/**
	 * Parses an "expression", which is a list of atoms.
	 *
	 * @param {boolean} breakOnInfix Should the parsing stop when we hit infix
	 *                  nodes? This happens when functions have higher precendence
	 *                  than infix nodes in implicit parses.
	 *
	 * @param {?string} breakOnToken The token that the expression should end with,
	 *                  or `null` if something else should end the expression.
	 *
	 * @return {ParseResult}
	 */
	Parser.prototype.parseExpression = function(pos, mode, breakOnInfix, breakOnToken) {
	    var body = [];
	    var lex = null;
	    // Keep adding atoms to the body until we can't parse any more atoms (either
	    // we reached the end, a }, or a \right)
	    while (true) {
	        lex = this.lexer.lex(pos, mode);
	        if (endOfExpression.indexOf(lex.text) !== -1) {
	            break;
	        }
	        if (breakOnToken && lex.text === breakOnToken) {
	            break;
	        }
	        var atom = this.parseAtom(pos, mode);
	        if (!atom) {
	            if (!this.settings.throwOnError && lex.text[0] === "\\") {
	                var errorNode = this.handleUnsupportedCmd(lex.text, mode);
	                body.push(errorNode);

	                pos = lex.position;
	                continue;
	            }

	            break;
	        }
	        if (breakOnInfix && atom.result.type === "infix") {
	            break;
	        }
	        body.push(atom.result);
	        pos = atom.position;
	    }
	    var res = new ParseResult(this.handleInfixNodes(body, mode), pos);
	    res.peek = lex;
	    return res;
	};

	/**
	 * Rewrites infix operators such as \over with corresponding commands such
	 * as \frac.
	 *
	 * There can only be one infix operator per group.  If there's more than one
	 * then the expression is ambiguous.  This can be resolved by adding {}.
	 *
	 * @returns {Array}
	 */
	Parser.prototype.handleInfixNodes = function (body, mode) {
	    var overIndex = -1;
	    var func;
	    var funcName;

	    for (var i = 0; i < body.length; i++) {
	        var node = body[i];
	        if (node.type === "infix") {
	            if (overIndex !== -1) {
	                throw new ParseError("only one infix operator per group",
	                    this.lexer, -1);
	            }
	            overIndex = i;
	            funcName = node.value.replaceWith;
	            func = functions.funcs[funcName];
	        }
	    }

	    if (overIndex !== -1) {
	        var numerNode, denomNode;

	        var numerBody = body.slice(0, overIndex);
	        var denomBody = body.slice(overIndex + 1);

	        if (numerBody.length === 1 && numerBody[0].type === "ordgroup") {
	            numerNode = numerBody[0];
	        } else {
	            numerNode = new ParseNode("ordgroup", numerBody, mode);
	        }

	        if (denomBody.length === 1 && denomBody[0].type === "ordgroup") {
	            denomNode = denomBody[0];
	        } else {
	            denomNode = new ParseNode("ordgroup", denomBody, mode);
	        }

	        var value = func.handler(funcName, numerNode, denomNode);
	        return [new ParseNode(value.type, value, mode)];
	    } else {
	        return body;
	    }
	};

	// The greediness of a superscript or subscript
	var SUPSUB_GREEDINESS = 1;

	/**
	 * Handle a subscript or superscript with nice errors.
	 */
	Parser.prototype.handleSupSubscript = function(pos, mode, symbol, name) {
	    var group = this.parseGroup(pos, mode);

	    if (!group) {
	        var lex = this.lexer.lex(pos, mode);

	        if (!this.settings.throwOnError && lex.text[0] === "\\") {
	            return new ParseResult(
	                this.handleUnsupportedCmd(lex.text, mode),
	                lex.position);
	        } else {
	            throw new ParseError(
	                "Expected group after '" + symbol + "'", this.lexer, pos);
	        }
	    } else if (group.isFunction) {
	        // ^ and _ have a greediness, so handle interactions with functions'
	        // greediness
	        var funcGreediness = functions.funcs[group.result.result].greediness;
	        if (funcGreediness > SUPSUB_GREEDINESS) {
	            return this.parseFunction(pos, mode);
	        } else {
	            throw new ParseError(
	                "Got function '" + group.result.result + "' with no arguments " +
	                    "as " + name,
	                this.lexer, pos);
	        }
	    } else {
	        return group.result;
	    }
	};

	/**
	 * Converts the textual input of an unsupported command into a text node
	 * contained within a color node whose color is determined by errorColor
	 */
	 Parser.prototype.handleUnsupportedCmd = function(text, mode) {
	     var textordArray = [];

	     for (var i = 0; i < text.length; i++) {
	        textordArray.push(new ParseNode("textord", text[i], "text"));
	     }

	     var textNode = new ParseNode(
	         "text",
	         {
	             body: textordArray,
	             type: "text"
	         },
	         mode);

	     var colorNode = new ParseNode(
	        "color",
	        {
	            color: this.settings.errorColor,
	            value: [textNode],
	            type: "color"
	        },
	        mode);

	     return colorNode;
	 };

	/**
	 * Parses a group with optional super/subscripts.
	 *
	 * @return {?ParseResult}
	 */
	Parser.prototype.parseAtom = function(pos, mode) {
	    // The body of an atom is an implicit group, so that things like
	    // \left(x\right)^2 work correctly.
	    var base = this.parseImplicitGroup(pos, mode);

	    // In text mode, we don't have superscripts or subscripts
	    if (mode === "text") {
	        return base;
	    }

	    // Handle an empty base
	    var currPos;
	    if (!base) {
	        currPos = pos;
	        base = undefined;
	    } else {
	        currPos = base.position;
	    }

	    var superscript;
	    var subscript;
	    var result;
	    while (true) {
	        // Lex the first token
	        var lex = this.lexer.lex(currPos, mode);

	        if (lex.text === "\\limits" || lex.text === "\\nolimits") {
	            // We got a limit control
	            if (!base || base.result.type !== "op") {
	                throw new ParseError("Limit controls must follow a math operator",
	                    this.lexer, currPos);
	            }
	            else {
	                var limits = lex.text === "\\limits";
	                base.result.value.limits = limits;
	                base.result.value.alwaysHandleSupSub = true;
	                currPos = lex.position;
	            }
	        } else if (lex.text === "^") {
	            // We got a superscript start
	            if (superscript) {
	                throw new ParseError(
	                    "Double superscript", this.lexer, currPos);
	            }
	            result = this.handleSupSubscript(
	                lex.position, mode, lex.text, "superscript");
	            currPos = result.position;
	            superscript = result.result;
	        } else if (lex.text === "_") {
	            // We got a subscript start
	            if (subscript) {
	                throw new ParseError(
	                    "Double subscript", this.lexer, currPos);
	            }
	            result = this.handleSupSubscript(
	                lex.position, mode, lex.text, "subscript");
	            currPos = result.position;
	            subscript = result.result;
	        } else if (lex.text === "'") {
	            // We got a prime
	            var prime = new ParseNode("textord", "\\prime", mode);

	            // Many primes can be grouped together, so we handle this here
	            var primes = [prime];
	            currPos = lex.position;
	            // Keep lexing tokens until we get something that's not a prime
	            while ((lex = this.lexer.lex(currPos, mode)).text === "'") {
	                // For each one, add another prime to the list
	                primes.push(prime);
	                currPos = lex.position;
	            }
	            // Put them into an ordgroup as the superscript
	            superscript = new ParseNode("ordgroup", primes, mode);
	        } else {
	            // If it wasn't ^, _, or ', stop parsing super/subscripts
	            break;
	        }
	    }

	    if (superscript || subscript) {
	        // If we got either a superscript or subscript, create a supsub
	        return new ParseResult(
	            new ParseNode("supsub", {
	                base: base && base.result,
	                sup: superscript,
	                sub: subscript
	            }, mode),
	            currPos);
	    } else {
	        // Otherwise return the original body
	        return base;
	    }
	};

	// A list of the size-changing functions, for use in parseImplicitGroup
	var sizeFuncs = [
	    "\\tiny", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize",
	    "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"
	];

	// A list of the style-changing functions, for use in parseImplicitGroup
	var styleFuncs = [
	    "\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"
	];

	/**
	 * Parses an implicit group, which is a group that starts at the end of a
	 * specified, and ends right before a higher explicit group ends, or at EOL. It
	 * is used for functions that appear to affect the current style, like \Large or
	 * \textrm, where instead of keeping a style we just pretend that there is an
	 * implicit grouping after it until the end of the group. E.g.
	 *   small text {\Large large text} small text again
	 * It is also used for \left and \right to get the correct grouping.
	 *
	 * @return {?ParseResult}
	 */
	Parser.prototype.parseImplicitGroup = function(pos, mode) {
	    var start = this.parseSymbol(pos, mode);

	    if (!start || !start.result) {
	        // If we didn't get anything we handle, fall back to parseFunction
	        return this.parseFunction(pos, mode);
	    }

	    var func = start.result.result;
	    var body;

	    if (func === "\\left") {
	        // If we see a left:
	        // Parse the entire left function (including the delimiter)
	        var left = this.parseFunction(pos, mode);
	        // Parse out the implicit body
	        body = this.parseExpression(left.position, mode, false);
	        // Check the next token
	        this.expect(body.peek, "\\right");
	        var right = this.parseFunction(body.position, mode);
	        return new ParseResult(
	            new ParseNode("leftright", {
	                body: body.result,
	                left: left.result.value.value,
	                right: right.result.value.value
	            }, mode),
	            right.position);
	    } else if (func === "\\begin") {
	        // begin...end is similar to left...right
	        var begin = this.parseFunction(pos, mode);
	        var envName = begin.result.value.name;
	        if (!environments.hasOwnProperty(envName)) {
	            throw new ParseError(
	                "No such environment: " + envName,
	                this.lexer, begin.result.value.namepos);
	        }
	        // Build the environment object. Arguments and other information will
	        // be made available to the begin and end methods using properties.
	        var env = environments[envName];
	        var args = [null, mode, envName];
	        var newPos = this.parseArguments(
	            begin.position, mode, "\\begin{" + envName + "}", env, args);
	        args[0] = newPos;
	        var result = env.handler.apply(this, args);
	        var endLex = this.lexer.lex(result.position, mode);
	        this.expect(endLex, "\\end");
	        var end = this.parseFunction(result.position, mode);
	        if (end.result.value.name !== envName) {
	            throw new ParseError(
	                "Mismatch: \\begin{" + envName + "} matched " +
	                "by \\end{" + end.result.value.name + "}",
	                this.lexer, end.namepos);
	        }
	        result.position = end.position;
	        return result;
	    } else if (utils.contains(sizeFuncs, func)) {
	        // If we see a sizing function, parse out the implict body
	        body = this.parseExpression(start.result.position, mode, false);
	        return new ParseResult(
	            new ParseNode("sizing", {
	                // Figure out what size to use based on the list of functions above
	                size: "size" + (utils.indexOf(sizeFuncs, func) + 1),
	                value: body.result
	            }, mode),
	            body.position);
	    } else if (utils.contains(styleFuncs, func)) {
	        // If we see a styling function, parse out the implict body
	        body = this.parseExpression(start.result.position, mode, true);
	        return new ParseResult(
	            new ParseNode("styling", {
	                // Figure out what style to use by pulling out the style from
	                // the function name
	                style: func.slice(1, func.length - 5),
	                value: body.result
	            }, mode),
	            body.position);
	    } else {
	        // Defer to parseFunction if it's not a function we handle
	        return this.parseFunction(pos, mode);
	    }
	};

	/**
	 * Parses an entire function, including its base and all of its arguments
	 *
	 * @return {?ParseResult}
	 */
	Parser.prototype.parseFunction = function(pos, mode) {
	    var baseGroup = this.parseGroup(pos, mode);

	    if (baseGroup) {
	        if (baseGroup.isFunction) {
	            var func = baseGroup.result.result;
	            var funcData = functions.funcs[func];
	            if (mode === "text" && !funcData.allowedInText) {
	                throw new ParseError(
	                    "Can't use function '" + func + "' in text mode",
	                    this.lexer, baseGroup.position);
	            }

	            var args = [func];
	            var newPos = this.parseArguments(
	                baseGroup.result.position, mode, func, funcData, args);
	            var result = functions.funcs[func].handler.apply(this, args);
	            return new ParseResult(
	                new ParseNode(result.type, result, mode),
	                newPos);
	        } else {
	            return baseGroup.result;
	        }
	    } else {
	        return null;
	    }
	};


	/**
	 * Parses the arguments of a function or environment
	 *
	 * @param {string} func  "\name" or "\begin{name}"
	 * @param {{numArgs:number,numOptionalArgs:number|undefined}} funcData
	 * @param {Array} args  list of arguments to which new ones will be pushed
	 * @return the position after all arguments have been parsed
	 */
	Parser.prototype.parseArguments = function(pos, mode, func, funcData, args) {
	    var totalArgs = funcData.numArgs + funcData.numOptionalArgs;
	    if (totalArgs === 0) {
	        return pos;
	    }

	    var newPos = pos;
	    var baseGreediness = funcData.greediness;
	    var positions = [newPos];

	    for (var i = 0; i < totalArgs; i++) {
	        var argType = funcData.argTypes && funcData.argTypes[i];
	        var arg;
	        if (i < funcData.numOptionalArgs) {
	            if (argType) {
	                arg = this.parseSpecialGroup(newPos, argType, mode, true);
	            } else {
	                arg = this.parseOptionalGroup(newPos, mode);
	            }
	            if (!arg) {
	                args.push(null);
	                positions.push(newPos);
	                continue;
	            }
	        } else {
	            if (argType) {
	                arg = this.parseSpecialGroup(newPos, argType, mode);
	            } else {
	                arg = this.parseGroup(newPos, mode);
	            }
	            if (!arg) {
	                var lex = this.lexer.lex(newPos, mode);

	                if (!this.settings.throwOnError && lex.text[0] === "\\") {
	                    arg = new ParseFuncOrArgument(
	                        new ParseResult(
	                            this.handleUnsupportedCmd(lex.text, mode),
	                            lex.position),
	                        false);
	                } else {
	                    throw new ParseError(
	                        "Expected group after '" + func + "'", this.lexer, pos);
	                }
	            }
	        }
	        var argNode;
	        if (arg.isFunction) {
	            var argGreediness =
	                functions.funcs[arg.result.result].greediness;
	            if (argGreediness > baseGreediness) {
	                argNode = this.parseFunction(newPos, mode);
	            } else {
	                throw new ParseError(
	                    "Got function '" + arg.result.result + "' as " +
	                    "argument to '" + func + "'",
	                    this.lexer, arg.result.position - 1);
	            }
	        } else {
	            argNode = arg.result;
	        }
	        args.push(argNode.result);
	        positions.push(argNode.position);
	        newPos = argNode.position;
	    }

	    args.push(positions);

	    return newPos;
	};


	/**
	 * Parses a group when the mode is changing. Takes a position, a new mode, and
	 * an outer mode that is used to parse the outside.
	 *
	 * @return {?ParseFuncOrArgument}
	 */
	Parser.prototype.parseSpecialGroup = function(pos, mode, outerMode, optional) {
	    // Handle `original` argTypes
	    if (mode === "original") {
	        mode = outerMode;
	    }

	    if (mode === "color" || mode === "size") {
	        // color and size modes are special because they should have braces and
	        // should only lex a single symbol inside
	        var openBrace = this.lexer.lex(pos, outerMode);
	        if (optional && openBrace.text !== "[") {
	            // optional arguments should return null if they don't exist
	            return null;
	        }
	        this.expect(openBrace, optional ? "[" : "{");
	        var inner = this.lexer.lex(openBrace.position, mode);
	        var data;
	        if (mode === "color") {
	            data = inner.text;
	        } else {
	            data = inner.data;
	        }
	        var closeBrace = this.lexer.lex(inner.position, outerMode);
	        this.expect(closeBrace, optional ? "]" : "}");
	        return new ParseFuncOrArgument(
	            new ParseResult(
	                new ParseNode(mode, data, outerMode),
	                closeBrace.position),
	            false);
	    } else if (mode === "text") {
	        // text mode is special because it should ignore the whitespace before
	        // it
	        var whitespace = this.lexer.lex(pos, "whitespace");
	        pos = whitespace.position;
	    }

	    if (optional) {
	        return this.parseOptionalGroup(pos, mode);
	    } else {
	        return this.parseGroup(pos, mode);
	    }
	};

	/**
	 * Parses a group, which is either a single nucleus (like "x") or an expression
	 * in braces (like "{x+y}")
	 *
	 * @return {?ParseFuncOrArgument}
	 */
	Parser.prototype.parseGroup = function(pos, mode) {
	    var start = this.lexer.lex(pos, mode);
	    // Try to parse an open brace
	    if (start.text === "{") {
	        // If we get a brace, parse an expression
	        var expression = this.parseExpression(start.position, mode, false);
	        // Make sure we get a close brace
	        var closeBrace = this.lexer.lex(expression.position, mode);
	        this.expect(closeBrace, "}");
	        return new ParseFuncOrArgument(
	            new ParseResult(
	                new ParseNode("ordgroup", expression.result, mode),
	                closeBrace.position),
	            false);
	    } else {
	        // Otherwise, just return a nucleus
	        return this.parseSymbol(pos, mode);
	    }
	};

	/**
	 * Parses a group, which is an expression in brackets (like "[x+y]")
	 *
	 * @return {?ParseFuncOrArgument}
	 */
	Parser.prototype.parseOptionalGroup = function(pos, mode) {
	    var start = this.lexer.lex(pos, mode);
	    // Try to parse an open bracket
	    if (start.text === "[") {
	        // If we get a brace, parse an expression
	        var expression = this.parseExpression(start.position, mode, false, "]");
	        // Make sure we get a close bracket
	        var closeBracket = this.lexer.lex(expression.position, mode);
	        this.expect(closeBracket, "]");
	        return new ParseFuncOrArgument(
	            new ParseResult(
	                new ParseNode("ordgroup", expression.result, mode),
	                closeBracket.position),
	            false);
	    } else {
	        // Otherwise, return null,
	        return null;
	    }
	};

	/**
	 * Parse a single symbol out of the string. Here, we handle both the functions
	 * we have defined, as well as the single character symbols
	 *
	 * @return {?ParseFuncOrArgument}
	 */
	Parser.prototype.parseSymbol = function(pos, mode) {
	    var nucleus = this.lexer.lex(pos, mode);

	    if (functions.funcs[nucleus.text]) {
	        // If there exists a function with this name, we return the function and
	        // say that it is a function.
	        return new ParseFuncOrArgument(
	            new ParseResult(nucleus.text, nucleus.position),
	            true);
	    } else if (symbols[mode][nucleus.text]) {
	        // Otherwise if this is a no-argument function, find the type it
	        // corresponds to in the symbols map
	        return new ParseFuncOrArgument(
	            new ParseResult(
	                new ParseNode(symbols[mode][nucleus.text].group,
	                              nucleus.text, mode),
	                nucleus.position),
	            false);
	    } else {
	        return null;
	    }
	};

	Parser.prototype.ParseNode = ParseNode;

	module.exports = Parser;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This file does the main work of building a domTree structure from a parse
	 * tree. The entry point is the `buildHTML` function, which takes a parse tree.
	 * Then, the buildExpression, buildGroup, and various groupTypes functions are
	 * called, to produce a final HTML tree.
	 */

	var ParseError = __webpack_require__(2);
	var Style = __webpack_require__(6);

	var buildCommon = __webpack_require__(7);
	var delimiter = __webpack_require__(67);
	var domTree = __webpack_require__(26);
	var fontMetrics = __webpack_require__(3);
	var utils = __webpack_require__(1);

	var makeSpan = buildCommon.makeSpan;

	/**
	 * Take a list of nodes, build them in order, and return a list of the built
	 * nodes. This function handles the `prev` node correctly, and passes the
	 * previous element from the list as the prev of the next element.
	 */
	var buildExpression = function(expression, options, prev) {
	    var groups = [];
	    for (var i = 0; i < expression.length; i++) {
	        var group = expression[i];
	        groups.push(buildGroup(group, options, prev));
	        prev = group;
	    }
	    return groups;
	};

	// List of types used by getTypeOfGroup,
	// see https://github.com/Khan/KaTeX/wiki/Examining-TeX#group-types
	var groupToType = {
	    mathord: "mord",
	    textord: "mord",
	    bin: "mbin",
	    rel: "mrel",
	    text: "mord",
	    open: "mopen",
	    close: "mclose",
	    inner: "minner",
	    genfrac: "mord",
	    array: "mord",
	    spacing: "mord",
	    punct: "mpunct",
	    ordgroup: "mord",
	    op: "mop",
	    katex: "mord",
	    overline: "mord",
	    rule: "mord",
	    leftright: "minner",
	    sqrt: "mord",
	    accent: "mord"
	};

	/**
	 * Gets the final math type of an expression, given its group type. This type is
	 * used to determine spacing between elements, and affects bin elements by
	 * causing them to change depending on what types are around them. This type
	 * must be attached to the outermost node of an element as a CSS class so that
	 * spacing with its surrounding elements works correctly.
	 *
	 * Some elements can be mapped one-to-one from group type to math type, and
	 * those are listed in the `groupToType` table.
	 *
	 * Others (usually elements that wrap around other elements) often have
	 * recursive definitions, and thus call `getTypeOfGroup` on their inner
	 * elements.
	 */
	var getTypeOfGroup = function(group) {
	    if (group == null) {
	        // Like when typesetting $^3$
	        return groupToType.mathord;
	    } else if (group.type === "supsub") {
	        return getTypeOfGroup(group.value.base);
	    } else if (group.type === "llap" || group.type === "rlap") {
	        return getTypeOfGroup(group.value);
	    } else if (group.type === "color") {
	        return getTypeOfGroup(group.value.value);
	    } else if (group.type === "sizing") {
	        return getTypeOfGroup(group.value.value);
	    } else if (group.type === "styling") {
	        return getTypeOfGroup(group.value.value);
	    } else if (group.type === "delimsizing") {
	        return groupToType[group.value.delimType];
	    } else {
	        return groupToType[group.type];
	    }
	};

	/**
	 * Sometimes, groups perform special rules when they have superscripts or
	 * subscripts attached to them. This function lets the `supsub` group know that
	 * its inner element should handle the superscripts and subscripts instead of
	 * handling them itself.
	 */
	var shouldHandleSupSub = function(group, options) {
	    if (!group) {
	        return false;
	    } else if (group.type === "op") {
	        // Operators handle supsubs differently when they have limits
	        // (e.g. `\displaystyle\sum_2^3`)
	        return group.value.limits &&
	            (options.style.size === Style.DISPLAY.size || group.value.alwaysHandleSupSub);
	    } else if (group.type === "accent") {
	        return isCharacterBox(group.value.base);
	    } else {
	        return null;
	    }
	};

	/**
	 * Sometimes we want to pull out the innermost element of a group. In most
	 * cases, this will just be the group itself, but when ordgroups and colors have
	 * a single element, we want to pull that out.
	 */
	var getBaseElem = function(group) {
	    if (!group) {
	        return false;
	    } else if (group.type === "ordgroup") {
	        if (group.value.length === 1) {
	            return getBaseElem(group.value[0]);
	        } else {
	            return group;
	        }
	    } else if (group.type === "color") {
	        if (group.value.value.length === 1) {
	            return getBaseElem(group.value.value[0]);
	        } else {
	            return group;
	        }
	    } else {
	        return group;
	    }
	};

	/**
	 * TeXbook algorithms often reference "character boxes", which are simply groups
	 * with a single character in them. To decide if something is a character box,
	 * we find its innermost group, and see if it is a single character.
	 */
	var isCharacterBox = function(group) {
	    var baseElem = getBaseElem(group);

	    // These are all they types of groups which hold single characters
	    return baseElem.type === "mathord" ||
	        baseElem.type === "textord" ||
	        baseElem.type === "bin" ||
	        baseElem.type === "rel" ||
	        baseElem.type === "inner" ||
	        baseElem.type === "open" ||
	        baseElem.type === "close" ||
	        baseElem.type === "punct";
	};

	var makeNullDelimiter = function(options) {
	    return makeSpan([
	        "sizing", "reset-" + options.size, "size5",
	        options.style.reset(), Style.TEXT.cls(),
	        "nulldelimiter"
	    ]);
	};

	/**
	 * This is a map of group types to the function used to handle that type.
	 * Simpler types come at the beginning, while complicated types come afterwards.
	 */
	var groupTypes = {
	    mathord: function(group, options, prev) {
	        return buildCommon.makeOrd(group, options, "mathord");
	    },

	    textord: function(group, options, prev) {
	        return buildCommon.makeOrd(group, options, "textord");
	    },

	    bin: function(group, options, prev) {
	        var className = "mbin";
	        // Pull out the most recent element. Do some special handling to find
	        // things at the end of a \color group. Note that we don't use the same
	        // logic for ordgroups (which count as ords).
	        var prevAtom = prev;
	        while (prevAtom && prevAtom.type === "color") {
	            var atoms = prevAtom.value.value;
	            prevAtom = atoms[atoms.length - 1];
	        }
	        // See TeXbook pg. 442-446, Rules 5 and 6, and the text before Rule 19.
	        // Here, we determine whether the bin should turn into an ord. We
	        // currently only apply Rule 5.
	        if (!prev || utils.contains(["mbin", "mopen", "mrel", "mop", "mpunct"],
	                getTypeOfGroup(prevAtom))) {
	            group.type = "textord";
	            className = "mord";
	        }

	        return buildCommon.mathsym(
	            group.value, group.mode, options.getColor(), [className]);
	    },

	    rel: function(group, options, prev) {
	        return buildCommon.mathsym(
	            group.value, group.mode, options.getColor(), ["mrel"]);
	    },

	    open: function(group, options, prev) {
	        return buildCommon.mathsym(
	            group.value, group.mode, options.getColor(), ["mopen"]);
	    },

	    close: function(group, options, prev) {
	        return buildCommon.mathsym(
	            group.value, group.mode, options.getColor(), ["mclose"]);
	    },

	    inner: function(group, options, prev) {
	        return buildCommon.mathsym(
	            group.value, group.mode, options.getColor(), ["minner"]);
	    },

	    punct: function(group, options, prev) {
	        return buildCommon.mathsym(
	            group.value, group.mode, options.getColor(), ["mpunct"]);
	    },

	    ordgroup: function(group, options, prev) {
	        return makeSpan(
	            ["mord", options.style.cls()],
	            buildExpression(group.value, options.reset())
	        );
	    },

	    text: function(group, options, prev) {
	        return makeSpan(["text", "mord", options.style.cls()],
	            buildExpression(group.value.body, options.reset()));
	    },

	    color: function(group, options, prev) {
	        var elements = buildExpression(
	            group.value.value,
	            options.withColor(group.value.color),
	            prev
	        );

	        // \color isn't supposed to affect the type of the elements it contains.
	        // To accomplish this, we wrap the results in a fragment, so the inner
	        // elements will be able to directly interact with their neighbors. For
	        // example, `\color{red}{2 +} 3` has the same spacing as `2 + 3`
	        return new buildCommon.makeFragment(elements);
	    },

	    supsub: function(group, options, prev) {
	        // Superscript and subscripts are handled in the TeXbook on page
	        // 445-446, rules 18(a-f).

	        // Here is where we defer to the inner group if it should handle
	        // superscripts and subscripts itself.
	        if (shouldHandleSupSub(group.value.base, options)) {
	            return groupTypes[group.value.base.type](group, options, prev);
	        }

	        var base = buildGroup(group.value.base, options.reset());
	        var supmid, submid, sup, sub;

	        if (group.value.sup) {
	            sup = buildGroup(group.value.sup,
	                    options.withStyle(options.style.sup()));
	            supmid = makeSpan(
	                    [options.style.reset(), options.style.sup().cls()], [sup]);
	        }

	        if (group.value.sub) {
	            sub = buildGroup(group.value.sub,
	                    options.withStyle(options.style.sub()));
	            submid = makeSpan(
	                    [options.style.reset(), options.style.sub().cls()], [sub]);
	        }

	        // Rule 18a
	        var supShift, subShift;
	        if (isCharacterBox(group.value.base)) {
	            supShift = 0;
	            subShift = 0;
	        } else {
	            supShift = base.height - fontMetrics.metrics.supDrop;
	            subShift = base.depth + fontMetrics.metrics.subDrop;
	        }

	        // Rule 18c
	        var minSupShift;
	        if (options.style === Style.DISPLAY) {
	            minSupShift = fontMetrics.metrics.sup1;
	        } else if (options.style.cramped) {
	            minSupShift = fontMetrics.metrics.sup3;
	        } else {
	            minSupShift = fontMetrics.metrics.sup2;
	        }

	        // scriptspace is a font-size-independent size, so scale it
	        // appropriately
	        var multiplier = Style.TEXT.sizeMultiplier *
	                options.style.sizeMultiplier;
	        var scriptspace =
	            (0.5 / fontMetrics.metrics.ptPerEm) / multiplier + "em";

	        var supsub;
	        if (!group.value.sup) {
	            // Rule 18b
	            subShift = Math.max(
	                subShift, fontMetrics.metrics.sub1,
	                sub.height - 0.8 * fontMetrics.metrics.xHeight);

	            supsub = buildCommon.makeVList([
	                {type: "elem", elem: submid}
	            ], "shift", subShift, options);

	            supsub.children[0].style.marginRight = scriptspace;

	            // Subscripts shouldn't be shifted by the base's italic correction.
	            // Account for that by shifting the subscript back the appropriate
	            // amount. Note we only do this when the base is a single symbol.
	            if (base instanceof domTree.symbolNode) {
	                supsub.children[0].style.marginLeft = -base.italic + "em";
	            }
	        } else if (!group.value.sub) {
	            // Rule 18c, d
	            supShift = Math.max(supShift, minSupShift,
	                sup.depth + 0.25 * fontMetrics.metrics.xHeight);

	            supsub = buildCommon.makeVList([
	                {type: "elem", elem: supmid}
	            ], "shift", -supShift, options);

	            supsub.children[0].style.marginRight = scriptspace;
	        } else {
	            supShift = Math.max(
	                supShift, minSupShift,
	                sup.depth + 0.25 * fontMetrics.metrics.xHeight);
	            subShift = Math.max(subShift, fontMetrics.metrics.sub2);

	            var ruleWidth = fontMetrics.metrics.defaultRuleThickness;

	            // Rule 18e
	            if ((supShift - sup.depth) - (sub.height - subShift) <
	                    4 * ruleWidth) {
	                subShift = 4 * ruleWidth - (supShift - sup.depth) + sub.height;
	                var psi = 0.8 * fontMetrics.metrics.xHeight -
	                    (supShift - sup.depth);
	                if (psi > 0) {
	                    supShift += psi;
	                    subShift -= psi;
	                }
	            }

	            supsub = buildCommon.makeVList([
	                {type: "elem", elem: submid, shift: subShift},
	                {type: "elem", elem: supmid, shift: -supShift}
	            ], "individualShift", null, options);

	            // See comment above about subscripts not being shifted
	            if (base instanceof domTree.symbolNode) {
	                supsub.children[0].style.marginLeft = -base.italic + "em";
	            }

	            supsub.children[0].style.marginRight = scriptspace;
	            supsub.children[1].style.marginRight = scriptspace;
	        }

	        return makeSpan([getTypeOfGroup(group.value.base)],
	            [base, supsub]);
	    },

	    genfrac: function(group, options, prev) {
	        // Fractions are handled in the TeXbook on pages 444-445, rules 15(a-e).
	        // Figure out what style this fraction should be in based on the
	        // function used
	        var fstyle = options.style;
	        if (group.value.size === "display") {
	            fstyle = Style.DISPLAY;
	        } else if (group.value.size === "text") {
	            fstyle = Style.TEXT;
	        }

	        var nstyle = fstyle.fracNum();
	        var dstyle = fstyle.fracDen();

	        var numer = buildGroup(group.value.numer, options.withStyle(nstyle));
	        var numerreset = makeSpan([fstyle.reset(), nstyle.cls()], [numer]);

	        var denom = buildGroup(group.value.denom, options.withStyle(dstyle));
	        var denomreset = makeSpan([fstyle.reset(), dstyle.cls()], [denom]);

	        var ruleWidth;
	        if (group.value.hasBarLine) {
	            ruleWidth = fontMetrics.metrics.defaultRuleThickness /
	                options.style.sizeMultiplier;
	        } else {
	            ruleWidth = 0;
	        }

	        // Rule 15b
	        var numShift;
	        var clearance;
	        var denomShift;
	        if (fstyle.size === Style.DISPLAY.size) {
	            numShift = fontMetrics.metrics.num1;
	            if (ruleWidth > 0) {
	                clearance = 3 * ruleWidth;
	            } else {
	                clearance = 7 * fontMetrics.metrics.defaultRuleThickness;
	            }
	            denomShift = fontMetrics.metrics.denom1;
	        } else {
	            if (ruleWidth > 0) {
	                numShift = fontMetrics.metrics.num2;
	                clearance = ruleWidth;
	            } else {
	                numShift = fontMetrics.metrics.num3;
	                clearance = 3 * fontMetrics.metrics.defaultRuleThickness;
	            }
	            denomShift = fontMetrics.metrics.denom2;
	        }

	        var frac;
	        if (ruleWidth === 0) {
	            // Rule 15c
	            var candiateClearance =
	                (numShift - numer.depth) - (denom.height - denomShift);
	            if (candiateClearance < clearance) {
	                numShift += 0.5 * (clearance - candiateClearance);
	                denomShift += 0.5 * (clearance - candiateClearance);
	            }

	            frac = buildCommon.makeVList([
	                {type: "elem", elem: denomreset, shift: denomShift},
	                {type: "elem", elem: numerreset, shift: -numShift}
	            ], "individualShift", null, options);
	        } else {
	            // Rule 15d
	            var axisHeight = fontMetrics.metrics.axisHeight;

	            if ((numShift - numer.depth) - (axisHeight + 0.5 * ruleWidth) <
	                    clearance) {
	                numShift +=
	                    clearance - ((numShift - numer.depth) -
	                                 (axisHeight + 0.5 * ruleWidth));
	            }

	            if ((axisHeight - 0.5 * ruleWidth) - (denom.height - denomShift) <
	                    clearance) {
	                denomShift +=
	                    clearance - ((axisHeight - 0.5 * ruleWidth) -
	                                 (denom.height - denomShift));
	            }

	            var mid = makeSpan(
	                [options.style.reset(), Style.TEXT.cls(), "frac-line"]);
	            // Manually set the height of the line because its height is
	            // created in CSS
	            mid.height = ruleWidth;

	            var midShift = -(axisHeight - 0.5 * ruleWidth);

	            frac = buildCommon.makeVList([
	                {type: "elem", elem: denomreset, shift: denomShift},
	                {type: "elem", elem: mid,        shift: midShift},
	                {type: "elem", elem: numerreset, shift: -numShift}
	            ], "individualShift", null, options);
	        }

	        // Since we manually change the style sometimes (with \dfrac or \tfrac),
	        // account for the possible size change here.
	        frac.height *= fstyle.sizeMultiplier / options.style.sizeMultiplier;
	        frac.depth *= fstyle.sizeMultiplier / options.style.sizeMultiplier;

	        // Rule 15e
	        var delimSize;
	        if (fstyle.size === Style.DISPLAY.size) {
	            delimSize = fontMetrics.metrics.delim1;
	        } else {
	            delimSize = fontMetrics.metrics.getDelim2(fstyle);
	        }

	        var leftDelim, rightDelim;
	        if (group.value.leftDelim == null) {
	            leftDelim = makeNullDelimiter(options);
	        } else {
	            leftDelim = delimiter.customSizedDelim(
	                group.value.leftDelim, delimSize, true,
	                options.withStyle(fstyle), group.mode);
	        }
	        if (group.value.rightDelim == null) {
	            rightDelim = makeNullDelimiter(options);
	        } else {
	            rightDelim = delimiter.customSizedDelim(
	                group.value.rightDelim, delimSize, true,
	                options.withStyle(fstyle), group.mode);
	        }

	        return makeSpan(
	            ["mord", options.style.reset(), fstyle.cls()],
	            [leftDelim, makeSpan(["mfrac"], [frac]), rightDelim],
	            options.getColor());
	    },

	    array: function(group, options, prev) {
	        var r, c;
	        var nr = group.value.body.length;
	        var nc = 0;
	        var body = new Array(nr);

	        // Horizontal spacing
	        var pt = 1 / fontMetrics.metrics.ptPerEm;
	        var arraycolsep = 5 * pt; // \arraycolsep in article.cls

	        // Vertical spacing
	        var baselineskip = 12 * pt; // see size10.clo
	        // Default \arraystretch from lttab.dtx
	        // TODO(gagern): may get redefined once we have user-defined macros
	        var arraystretch = utils.deflt(group.value.arraystretch, 1);
	        var arrayskip = arraystretch * baselineskip;
	        var arstrutHeight = 0.7 * arrayskip; // \strutbox in ltfsstrc.dtx and
	        var arstrutDepth = 0.3 * arrayskip;  // \@arstrutbox in lttab.dtx

	        var totalHeight = 0;
	        for (r = 0; r < group.value.body.length; ++r) {
	            var inrow = group.value.body[r];
	            var height = arstrutHeight; // \@array adds an \@arstrut
	            var depth = arstrutDepth;   // to each tow (via the template)

	            if (nc < inrow.length) {
	                nc = inrow.length;
	            }

	            var outrow = new Array(inrow.length);
	            for (c = 0; c < inrow.length; ++c) {
	                var elt = buildGroup(inrow[c], options);
	                if (depth < elt.depth) {
	                    depth = elt.depth;
	                }
	                if (height < elt.height) {
	                    height = elt.height;
	                }
	                outrow[c] = elt;
	            }

	            var gap = 0;
	            if (group.value.rowGaps[r]) {
	                gap = group.value.rowGaps[r].value;
	                switch (gap.unit) {
	                case "em":
	                    gap = gap.number;
	                    break;
	                case "ex":
	                    gap = gap.number * fontMetrics.metrics.emPerEx;
	                    break;
	                default:
	                    console.error("Can't handle unit " + gap.unit);
	                    gap = 0;
	                }
	                if (gap > 0) { // \@argarraycr
	                    gap += arstrutDepth;
	                    if (depth < gap) {
	                        depth = gap; // \@xargarraycr
	                    }
	                    gap = 0;
	                }
	            }

	            outrow.height = height;
	            outrow.depth = depth;
	            totalHeight += height;
	            outrow.pos = totalHeight;
	            totalHeight += depth + gap; // \@yargarraycr
	            body[r] = outrow;
	        }

	        var offset = totalHeight / 2 + fontMetrics.metrics.axisHeight;
	        var colDescriptions = group.value.cols || [];
	        var cols = [];
	        var colSep;
	        var colDescrNum;
	        for (c = 0, colDescrNum = 0;
	             // Continue while either there are more columns or more column
	             // descriptions, so trailing separators don't get lost.
	             c < nc || colDescrNum < colDescriptions.length;
	             ++c, ++colDescrNum) {

	            var colDescr = colDescriptions[colDescrNum] || {};

	            var firstSeparator = true;
	            while (colDescr.type === "separator") {
	                // If there is more than one separator in a row, add a space
	                // between them.
	                if (!firstSeparator) {
	                    colSep = makeSpan(["arraycolsep"], []);
	                    colSep.style.width =
	                        fontMetrics.metrics.doubleRuleSep + "em";
	                    cols.push(colSep);
	                }

	                if (colDescr.separator === "|") {
	                    var separator = makeSpan(
	                        ["vertical-separator"],
	                        []);
	                    separator.style.height = totalHeight + "em";
	                    separator.style.verticalAlign =
	                        -(totalHeight - offset) + "em";

	                    cols.push(separator);
	                } else {
	                    throw new ParseError(
	                        "Invalid separator type: " + colDescr.separator);
	                }

	                colDescrNum++;
	                colDescr = colDescriptions[colDescrNum] || {};
	                firstSeparator = false;
	            }

	            if (c >= nc) {
	                continue;
	            }

	            var sepwidth;
	            if (c > 0 || group.value.hskipBeforeAndAfter) {
	                sepwidth = utils.deflt(colDescr.pregap, arraycolsep);
	                if (sepwidth !== 0) {
	                    colSep = makeSpan(["arraycolsep"], []);
	                    colSep.style.width = sepwidth + "em";
	                    cols.push(colSep);
	                }
	            }

	            var col = [];
	            for (r = 0; r < nr; ++r) {
	                var row = body[r];
	                var elem = row[c];
	                if (!elem) {
	                    continue;
	                }
	                var shift = row.pos - offset;
	                elem.depth = row.depth;
	                elem.height = row.height;
	                col.push({type: "elem", elem: elem, shift: shift});
	            }

	            col = buildCommon.makeVList(col, "individualShift", null, options);
	            col = makeSpan(
	                ["col-align-" + (colDescr.align || "c")],
	                [col]);
	            cols.push(col);

	            if (c < nc - 1 || group.value.hskipBeforeAndAfter) {
	                sepwidth = utils.deflt(colDescr.postgap, arraycolsep);
	                if (sepwidth !== 0) {
	                    colSep = makeSpan(["arraycolsep"], []);
	                    colSep.style.width = sepwidth + "em";
	                    cols.push(colSep);
	                }
	            }
	        }
	        body = makeSpan(["mtable"], cols);
	        return makeSpan(["mord"], [body], options.getColor());
	    },

	    spacing: function(group, options, prev) {
	        if (group.value === "\\ " || group.value === "\\space" ||
	            group.value === " " || group.value === "~") {
	            // Spaces are generated by adding an actual space. Each of these
	            // things has an entry in the symbols table, so these will be turned
	            // into appropriate outputs.
	            return makeSpan(
	                ["mord", "mspace"],
	                [buildCommon.mathsym(group.value, group.mode)]
	            );
	        } else {
	            // Other kinds of spaces are of arbitrary width. We use CSS to
	            // generate these.
	            return makeSpan(
	                ["mord", "mspace",
	                 buildCommon.spacingFunctions[group.value].className]);
	        }
	    },

	    llap: function(group, options, prev) {
	        var inner = makeSpan(
	            ["inner"], [buildGroup(group.value.body, options.reset())]);
	        var fix = makeSpan(["fix"], []);
	        return makeSpan(
	            ["llap", options.style.cls()], [inner, fix]);
	    },

	    rlap: function(group, options, prev) {
	        var inner = makeSpan(
	            ["inner"], [buildGroup(group.value.body, options.reset())]);
	        var fix = makeSpan(["fix"], []);
	        return makeSpan(
	            ["rlap", options.style.cls()], [inner, fix]);
	    },

	    op: function(group, options, prev) {
	        // Operators are handled in the TeXbook pg. 443-444, rule 13(a).
	        var supGroup;
	        var subGroup;
	        var hasLimits = false;
	        if (group.type === "supsub" ) {
	            // If we have limits, supsub will pass us its group to handle. Pull
	            // out the superscript and subscript and set the group to the op in
	            // its base.
	            supGroup = group.value.sup;
	            subGroup = group.value.sub;
	            group = group.value.base;
	            hasLimits = true;
	        }

	        // Most operators have a large successor symbol, but these don't.
	        var noSuccessor = [
	            "\\smallint"
	        ];

	        var large = false;
	        if (options.style.size === Style.DISPLAY.size &&
	            group.value.symbol &&
	            !utils.contains(noSuccessor, group.value.body)) {

	            // Most symbol operators get larger in displaystyle (rule 13)
	            large = true;
	        }

	        var base;
	        var baseShift = 0;
	        var slant = 0;
	        if (group.value.symbol) {
	            // If this is a symbol, create the symbol.
	            var style = large ? "Size2-Regular" : "Size1-Regular";
	            base = buildCommon.makeSymbol(
	                group.value.body, style, "math", options.getColor(),
	                ["op-symbol", large ? "large-op" : "small-op", "mop"]);

	            // Shift the symbol so its center lies on the axis (rule 13). It
	            // appears that our fonts have the centers of the symbols already
	            // almost on the axis, so these numbers are very small. Note we
	            // don't actually apply this here, but instead it is used either in
	            // the vlist creation or separately when there are no limits.
	            baseShift = (base.height - base.depth) / 2 -
	                fontMetrics.metrics.axisHeight *
	                options.style.sizeMultiplier;

	            // The slant of the symbol is just its italic correction.
	            slant = base.italic;
	        } else {
	            // Otherwise, this is a text operator. Build the text from the
	            // operator's name.
	            // TODO(emily): Add a space in the middle of some of these
	            // operators, like \limsup
	            var output = [];
	            for (var i = 1; i < group.value.body.length; i++) {
	                output.push(buildCommon.mathsym(group.value.body[i], group.mode));
	            }
	            base = makeSpan(["mop"], output, options.getColor());
	        }

	        if (hasLimits) {
	            // IE 8 clips \int if it is in a display: inline-block. We wrap it
	            // in a new span so it is an inline, and works.
	            base = makeSpan([], [base]);

	            var supmid, supKern, submid, subKern;
	            // We manually have to handle the superscripts and subscripts. This,
	            // aside from the kern calculations, is copied from supsub.
	            if (supGroup) {
	                var sup = buildGroup(
	                    supGroup, options.withStyle(options.style.sup()));
	                supmid = makeSpan(
	                    [options.style.reset(), options.style.sup().cls()], [sup]);

	                supKern = Math.max(
	                    fontMetrics.metrics.bigOpSpacing1,
	                    fontMetrics.metrics.bigOpSpacing3 - sup.depth);
	            }

	            if (subGroup) {
	                var sub = buildGroup(
	                    subGroup, options.withStyle(options.style.sub()));
	                submid = makeSpan(
	                    [options.style.reset(), options.style.sub().cls()],
	                    [sub]);

	                subKern = Math.max(
	                    fontMetrics.metrics.bigOpSpacing2,
	                    fontMetrics.metrics.bigOpSpacing4 - sub.height);
	            }

	            // Build the final group as a vlist of the possible subscript, base,
	            // and possible superscript.
	            var finalGroup, top, bottom;
	            if (!supGroup) {
	                top = base.height - baseShift;

	                finalGroup = buildCommon.makeVList([
	                    {type: "kern", size: fontMetrics.metrics.bigOpSpacing5},
	                    {type: "elem", elem: submid},
	                    {type: "kern", size: subKern},
	                    {type: "elem", elem: base}
	                ], "top", top, options);

	                // Here, we shift the limits by the slant of the symbol. Note
	                // that we are supposed to shift the limits by 1/2 of the slant,
	                // but since we are centering the limits adding a full slant of
	                // margin will shift by 1/2 that.
	                finalGroup.children[0].style.marginLeft = -slant + "em";
	            } else if (!subGroup) {
	                bottom = base.depth + baseShift;

	                finalGroup = buildCommon.makeVList([
	                    {type: "elem", elem: base},
	                    {type: "kern", size: supKern},
	                    {type: "elem", elem: supmid},
	                    {type: "kern", size: fontMetrics.metrics.bigOpSpacing5}
	                ], "bottom", bottom, options);

	                // See comment above about slants
	                finalGroup.children[1].style.marginLeft = slant + "em";
	            } else if (!supGroup && !subGroup) {
	                // This case probably shouldn't occur (this would mean the
	                // supsub was sending us a group with no superscript or
	                // subscript) but be safe.
	                return base;
	            } else {
	                bottom = fontMetrics.metrics.bigOpSpacing5 +
	                    submid.height + submid.depth +
	                    subKern +
	                    base.depth + baseShift;

	                finalGroup = buildCommon.makeVList([
	                    {type: "kern", size: fontMetrics.metrics.bigOpSpacing5},
	                    {type: "elem", elem: submid},
	                    {type: "kern", size: subKern},
	                    {type: "elem", elem: base},
	                    {type: "kern", size: supKern},
	                    {type: "elem", elem: supmid},
	                    {type: "kern", size: fontMetrics.metrics.bigOpSpacing5}
	                ], "bottom", bottom, options);

	                // See comment above about slants
	                finalGroup.children[0].style.marginLeft = -slant + "em";
	                finalGroup.children[2].style.marginLeft = slant + "em";
	            }

	            return makeSpan(["mop", "op-limits"], [finalGroup]);
	        } else {
	            if (group.value.symbol) {
	                base.style.top = baseShift + "em";
	            }

	            return base;
	        }
	    },

	    katex: function(group, options, prev) {
	        // The KaTeX logo. The offsets for the K and a were chosen to look
	        // good, but the offsets for the T, E, and X were taken from the
	        // definition of \TeX in TeX (see TeXbook pg. 356)
	        var k = makeSpan(
	            ["k"], [buildCommon.mathsym("K", group.mode)]);
	        var a = makeSpan(
	            ["a"], [buildCommon.mathsym("A", group.mode)]);

	        a.height = (a.height + 0.2) * 0.75;
	        a.depth = (a.height - 0.2) * 0.75;

	        var t = makeSpan(
	            ["t"], [buildCommon.mathsym("T", group.mode)]);
	        var e = makeSpan(
	            ["e"], [buildCommon.mathsym("E", group.mode)]);

	        e.height = (e.height - 0.2155);
	        e.depth = (e.depth + 0.2155);

	        var x = makeSpan(
	            ["x"], [buildCommon.mathsym("X", group.mode)]);

	        return makeSpan(
	            ["katex-logo", "mord"], [k, a, t, e, x], options.getColor());
	    },

	    overline: function(group, options, prev) {
	        // Overlines are handled in the TeXbook pg 443, Rule 9.

	        // Build the inner group in the cramped style.
	        var innerGroup = buildGroup(group.value.body,
	                options.withStyle(options.style.cramp()));

	        var ruleWidth = fontMetrics.metrics.defaultRuleThickness /
	            options.style.sizeMultiplier;

	        // Create the line above the body
	        var line = makeSpan(
	            [options.style.reset(), Style.TEXT.cls(), "overline-line"]);
	        line.height = ruleWidth;
	        line.maxFontSize = 1.0;

	        // Generate the vlist, with the appropriate kerns
	        var vlist = buildCommon.makeVList([
	            {type: "elem", elem: innerGroup},
	            {type: "kern", size: 3 * ruleWidth},
	            {type: "elem", elem: line},
	            {type: "kern", size: ruleWidth}
	        ], "firstBaseline", null, options);

	        return makeSpan(["overline", "mord"], [vlist], options.getColor());
	    },

	    sqrt: function(group, options, prev) {
	        // Square roots are handled in the TeXbook pg. 443, Rule 11.

	        // First, we do the same steps as in overline to build the inner group
	        // and line
	        var inner = buildGroup(group.value.body,
	                options.withStyle(options.style.cramp()));

	        var ruleWidth = fontMetrics.metrics.defaultRuleThickness /
	            options.style.sizeMultiplier;

	        var line = makeSpan(
	            [options.style.reset(), Style.TEXT.cls(), "sqrt-line"], [],
	            options.getColor());
	        line.height = ruleWidth;
	        line.maxFontSize = 1.0;

	        var phi = ruleWidth;
	        if (options.style.id < Style.TEXT.id) {
	            phi = fontMetrics.metrics.xHeight;
	        }

	        // Calculate the clearance between the body and line
	        var lineClearance = ruleWidth + phi / 4;

	        var innerHeight =
	            (inner.height + inner.depth) * options.style.sizeMultiplier;
	        var minDelimiterHeight = innerHeight + lineClearance + ruleWidth;

	        // Create a \surd delimiter of the required minimum size
	        var delim = makeSpan(["sqrt-sign"], [
	            delimiter.customSizedDelim("\\surd", minDelimiterHeight,
	                                       false, options, group.mode)],
	                             options.getColor());

	        var delimDepth = (delim.height + delim.depth) - ruleWidth;

	        // Adjust the clearance based on the delimiter size
	        if (delimDepth > inner.height + inner.depth + lineClearance) {
	            lineClearance =
	                (lineClearance + delimDepth - inner.height - inner.depth) / 2;
	        }

	        // Shift the delimiter so that its top lines up with the top of the line
	        var delimShift = -(inner.height + lineClearance + ruleWidth) + delim.height;
	        delim.style.top = delimShift + "em";
	        delim.height -= delimShift;
	        delim.depth += delimShift;

	        // We add a special case here, because even when `inner` is empty, we
	        // still get a line. So, we use a simple heuristic to decide if we
	        // should omit the body entirely. (note this doesn't work for something
	        // like `\sqrt{\rlap{x}}`, but if someone is doing that they deserve for
	        // it not to work.
	        var body;
	        if (inner.height === 0 && inner.depth === 0) {
	            body = makeSpan();
	        } else {
	            body = buildCommon.makeVList([
	                {type: "elem", elem: inner},
	                {type: "kern", size: lineClearance},
	                {type: "elem", elem: line},
	                {type: "kern", size: ruleWidth}
	            ], "firstBaseline", null, options);
	        }

	        if (!group.value.index) {
	            return makeSpan(["sqrt", "mord"], [delim, body]);
	        } else {
	            // Handle the optional root index

	            // The index is always in scriptscript style
	            var root = buildGroup(
	                group.value.index,
	                options.withStyle(Style.SCRIPTSCRIPT));
	            var rootWrap = makeSpan(
	                [options.style.reset(), Style.SCRIPTSCRIPT.cls()],
	                [root]);

	            // Figure out the height and depth of the inner part
	            var innerRootHeight = Math.max(delim.height, body.height);
	            var innerRootDepth = Math.max(delim.depth, body.depth);

	            // The amount the index is shifted by. This is taken from the TeX
	            // source, in the definition of `\r@@t`.
	            var toShift = 0.6 * (innerRootHeight - innerRootDepth);

	            // Build a VList with the superscript shifted up correctly
	            var rootVList = buildCommon.makeVList(
	                [{type: "elem", elem: rootWrap}],
	                "shift", -toShift, options);
	            // Add a class surrounding it so we can add on the appropriate
	            // kerning
	            var rootVListWrap = makeSpan(["root"], [rootVList]);

	            return makeSpan(["sqrt", "mord"], [rootVListWrap, delim, body]);
	        }
	    },

	    sizing: function(group, options, prev) {
	        // Handle sizing operators like \Huge. Real TeX doesn't actually allow
	        // these functions inside of math expressions, so we do some special
	        // handling.
	        var inner = buildExpression(group.value.value,
	                options.withSize(group.value.size), prev);

	        var span = makeSpan(["mord"],
	            [makeSpan(["sizing", "reset-" + options.size, group.value.size,
	                       options.style.cls()],
	                      inner)]);

	        // Calculate the correct maxFontSize manually
	        var fontSize = buildCommon.sizingMultiplier[group.value.size];
	        span.maxFontSize = fontSize * options.style.sizeMultiplier;

	        return span;
	    },

	    styling: function(group, options, prev) {
	        // Style changes are handled in the TeXbook on pg. 442, Rule 3.

	        // Figure out what style we're changing to.
	        var style = {
	            "display": Style.DISPLAY,
	            "text": Style.TEXT,
	            "script": Style.SCRIPT,
	            "scriptscript": Style.SCRIPTSCRIPT
	        };

	        var newStyle = style[group.value.style];

	        // Build the inner expression in the new style.
	        var inner = buildExpression(
	            group.value.value, options.withStyle(newStyle), prev);

	        return makeSpan([options.style.reset(), newStyle.cls()], inner);
	    },

	    font: function(group, options, prev) {
	        var font = group.value.font;
	        return buildGroup(group.value.body, options.withFont(font), prev);
	    },

	    delimsizing: function(group, options, prev) {
	        var delim = group.value.value;

	        if (delim === ".") {
	            // Empty delimiters still count as elements, even though they don't
	            // show anything.
	            return makeSpan([groupToType[group.value.delimType]]);
	        }

	        // Use delimiter.sizedDelim to generate the delimiter.
	        return makeSpan(
	            [groupToType[group.value.delimType]],
	            [delimiter.sizedDelim(
	                delim, group.value.size, options, group.mode)]);
	    },

	    leftright: function(group, options, prev) {
	        // Build the inner expression
	        var inner = buildExpression(group.value.body, options.reset());

	        var innerHeight = 0;
	        var innerDepth = 0;

	        // Calculate its height and depth
	        for (var i = 0; i < inner.length; i++) {
	            innerHeight = Math.max(inner[i].height, innerHeight);
	            innerDepth = Math.max(inner[i].depth, innerDepth);
	        }

	        // The size of delimiters is the same, regardless of what style we are
	        // in. Thus, to correctly calculate the size of delimiter we need around
	        // a group, we scale down the inner size based on the size.
	        innerHeight *= options.style.sizeMultiplier;
	        innerDepth *= options.style.sizeMultiplier;

	        var leftDelim;
	        if (group.value.left === ".") {
	            // Empty delimiters in \left and \right make null delimiter spaces.
	            leftDelim = makeNullDelimiter(options);
	        } else {
	            // Otherwise, use leftRightDelim to generate the correct sized
	            // delimiter.
	            leftDelim = delimiter.leftRightDelim(
	                group.value.left, innerHeight, innerDepth, options,
	                group.mode);
	        }
	        // Add it to the beginning of the expression
	        inner.unshift(leftDelim);

	        var rightDelim;
	        // Same for the right delimiter
	        if (group.value.right === ".") {
	            rightDelim = makeNullDelimiter(options);
	        } else {
	            rightDelim = delimiter.leftRightDelim(
	                group.value.right, innerHeight, innerDepth, options,
	                group.mode);
	        }
	        // Add it to the end of the expression.
	        inner.push(rightDelim);

	        return makeSpan(
	            ["minner", options.style.cls()], inner, options.getColor());
	    },

	    rule: function(group, options, prev) {
	        // Make an empty span for the rule
	        var rule = makeSpan(["mord", "rule"], [], options.getColor());

	        // Calculate the shift, width, and height of the rule, and account for units
	        var shift = 0;
	        if (group.value.shift) {
	            shift = group.value.shift.number;
	            if (group.value.shift.unit === "ex") {
	                shift *= fontMetrics.metrics.xHeight;
	            }
	        }

	        var width = group.value.width.number;
	        if (group.value.width.unit === "ex") {
	            width *= fontMetrics.metrics.xHeight;
	        }

	        var height = group.value.height.number;
	        if (group.value.height.unit === "ex") {
	            height *= fontMetrics.metrics.xHeight;
	        }

	        // The sizes of rules are absolute, so make it larger if we are in a
	        // smaller style.
	        shift /= options.style.sizeMultiplier;
	        width /= options.style.sizeMultiplier;
	        height /= options.style.sizeMultiplier;

	        // Style the rule to the right size
	        rule.style.borderRightWidth = width + "em";
	        rule.style.borderTopWidth = height + "em";
	        rule.style.bottom = shift + "em";

	        // Record the height and width
	        rule.width = width;
	        rule.height = height + shift;
	        rule.depth = -shift;

	        return rule;
	    },

	    accent: function(group, options, prev) {
	        // Accents are handled in the TeXbook pg. 443, rule 12.
	        var base = group.value.base;

	        var supsubGroup;
	        if (group.type === "supsub") {
	            // If our base is a character box, and we have superscripts and
	            // subscripts, the supsub will defer to us. In particular, we want
	            // to attach the superscripts and subscripts to the inner body (so
	            // that the position of the superscripts and subscripts won't be
	            // affected by the height of the accent). We accomplish this by
	            // sticking the base of the accent into the base of the supsub, and
	            // rendering that, while keeping track of where the accent is.

	            // The supsub group is the group that was passed in
	            var supsub = group;
	            // The real accent group is the base of the supsub group
	            group = supsub.value.base;
	            // The character box is the base of the accent group
	            base = group.value.base;
	            // Stick the character box into the base of the supsub group
	            supsub.value.base = base;

	            // Rerender the supsub group with its new base, and store that
	            // result.
	            supsubGroup = buildGroup(
	                supsub, options.reset(), prev);
	        }

	        // Build the base group
	        var body = buildGroup(
	            base, options.withStyle(options.style.cramp()));

	        // Calculate the skew of the accent. This is based on the line "If the
	        // nucleus is not a single character, let s = 0; otherwise set s to the
	        // kern amount for the nucleus followed by the \skewchar of its font."
	        // Note that our skew metrics are just the kern between each character
	        // and the skewchar.
	        var skew;
	        if (isCharacterBox(base)) {
	            // If the base is a character box, then we want the skew of the
	            // innermost character. To do that, we find the innermost character:
	            var baseChar = getBaseElem(base);
	            // Then, we render its group to get the symbol inside it
	            var baseGroup = buildGroup(
	                baseChar, options.withStyle(options.style.cramp()));
	            // Finally, we pull the skew off of the symbol.
	            skew = baseGroup.skew;
	            // Note that we now throw away baseGroup, because the layers we
	            // removed with getBaseElem might contain things like \color which
	            // we can't get rid of.
	            // TODO(emily): Find a better way to get the skew
	        } else {
	            skew = 0;
	        }

	        // calculate the amount of space between the body and the accent
	        var clearance = Math.min(body.height, fontMetrics.metrics.xHeight);

	        // Build the accent
	        var accent = buildCommon.makeSymbol(
	            group.value.accent, "Main-Regular", "math", options.getColor());
	        // Remove the italic correction of the accent, because it only serves to
	        // shift the accent over to a place we don't want.
	        accent.italic = 0;

	        // The \vec character that the fonts use is a combining character, and
	        // thus shows up much too far to the left. To account for this, we add a
	        // specific class which shifts the accent over to where we want it.
	        // TODO(emily): Fix this in a better way, like by changing the font
	        var vecClass = group.value.accent === "\\vec" ? "accent-vec" : null;

	        var accentBody = makeSpan(["accent-body", vecClass], [
	            makeSpan([], [accent])]);

	        accentBody = buildCommon.makeVList([
	            {type: "elem", elem: body},
	            {type: "kern", size: -clearance},
	            {type: "elem", elem: accentBody}
	        ], "firstBaseline", null, options);

	        // Shift the accent over by the skew. Note we shift by twice the skew
	        // because we are centering the accent, so by adding 2*skew to the left,
	        // we shift it to the right by 1*skew.
	        accentBody.children[1].style.marginLeft = 2 * skew + "em";

	        var accentWrap = makeSpan(["mord", "accent"], [accentBody]);

	        if (supsubGroup) {
	            // Here, we replace the "base" child of the supsub with our newly
	            // generated accent.
	            supsubGroup.children[0] = accentWrap;

	            // Since we don't rerun the height calculation after replacing the
	            // accent, we manually recalculate height.
	            supsubGroup.height = Math.max(accentWrap.height, supsubGroup.height);

	            // Accents should always be ords, even when their innards are not.
	            supsubGroup.classes[0] = "mord";

	            return supsubGroup;
	        } else {
	            return accentWrap;
	        }
	    },

	    phantom: function(group, options, prev) {
	        var elements = buildExpression(
	            group.value.value,
	            options.withPhantom(),
	            prev
	        );

	        // \phantom isn't supposed to affect the elements it contains.
	        // See "color" for more details.
	        return new buildCommon.makeFragment(elements);
	    }
	};

	/**
	 * buildGroup is the function that takes a group and calls the correct groupType
	 * function for it. It also handles the interaction of size and style changes
	 * between parents and children.
	 */
	var buildGroup = function(group, options, prev) {
	    if (!group) {
	        return makeSpan();
	    }

	    if (groupTypes[group.type]) {
	        // Call the groupTypes function
	        var groupNode = groupTypes[group.type](group, options, prev);
	        var multiplier;

	        // If the style changed between the parent and the current group,
	        // account for the size difference
	        if (options.style !== options.parentStyle) {
	            multiplier = options.style.sizeMultiplier /
	                    options.parentStyle.sizeMultiplier;

	            groupNode.height *= multiplier;
	            groupNode.depth *= multiplier;
	        }

	        // If the size changed between the parent and the current group, account
	        // for that size difference.
	        if (options.size !== options.parentSize) {
	            multiplier = buildCommon.sizingMultiplier[options.size] /
	                    buildCommon.sizingMultiplier[options.parentSize];

	            groupNode.height *= multiplier;
	            groupNode.depth *= multiplier;
	        }

	        return groupNode;
	    } else {
	        throw new ParseError(
	            "Got group of unknown type: '" + group.type + "'");
	    }
	};

	/**
	 * Take an entire parse tree, and build it into an appropriate set of HTML
	 * nodes.
	 */
	var buildHTML = function(tree, options) {
	    // buildExpression is destructive, so we need to make a clone
	    // of the incoming tree so that it isn't accidentally changed
	    tree = JSON.parse(JSON.stringify(tree));

	    // Build the expression contained in the tree
	    var expression = buildExpression(tree, options);
	    var body = makeSpan(["base", options.style.cls()], expression);

	    // Add struts, which ensure that the top of the HTML element falls at the
	    // height of the expression, and the bottom of the HTML element falls at the
	    // depth of the expression.
	    var topStrut = makeSpan(["strut"]);
	    var bottomStrut = makeSpan(["strut", "bottom"]);

	    topStrut.style.height = body.height + "em";
	    bottomStrut.style.height = (body.height + body.depth) + "em";
	    // We'd like to use `vertical-align: top` but in IE 9 this lowers the
	    // baseline of the box to the bottom of this strut (instead staying in the
	    // normal place) so we use an absolute value for vertical-align instead
	    bottomStrut.style.verticalAlign = -body.depth + "em";

	    // Wrap the struts and body together
	    var htmlNode = makeSpan(["katex-html"], [topStrut, bottomStrut, body]);

	    htmlNode.setAttribute("aria-hidden", "true");

	    return htmlNode;
	};

	module.exports = buildHTML;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This file converts a parse tree into a cooresponding MathML tree. The main
	 * entry point is the `buildMathML` function, which takes a parse tree from the
	 * parser.
	 */

	var buildCommon = __webpack_require__(7);
	var fontMetrics = __webpack_require__(3);
	var mathMLTree = __webpack_require__(71);
	var ParseError = __webpack_require__(2);
	var symbols = __webpack_require__(8);
	var utils = __webpack_require__(1);

	var makeSpan = buildCommon.makeSpan;
	var fontMap = buildCommon.fontMap;

	/**
	 * Takes a symbol and converts it into a MathML text node after performing
	 * optional replacement from symbols.js.
	 */
	var makeText = function(text, mode) {
	    if (symbols[mode][text] && symbols[mode][text].replace) {
	        text = symbols[mode][text].replace;
	    }

	    return new mathMLTree.TextNode(text);
	};

	/**
	 * Returns the math variant as a string or null if none is required.
	 */
	var getVariant = function(group, options) {
	    var font = options.font;
	    if (!font) {
	        return null;
	    }

	    var mode = group.mode;
	    if (font === "mathit") {
	        return "italic";
	    }

	    var value = group.value;
	    if (utils.contains(["\\imath", "\\jmath"], value)) {
	        return null;
	    }

	    if (symbols[mode][value] && symbols[mode][value].replace) {
	        value = symbols[mode][value].replace;
	    }

	    var fontName = fontMap[font].fontName;
	    if (fontMetrics.getCharacterMetrics(value, fontName)) {
	        return fontMap[options.font].variant;
	    }

	    return null;
	};

	/**
	 * Functions for handling the different types of groups found in the parse
	 * tree. Each function should take a parse group and return a MathML node.
	 */
	var groupTypes = {
	    mathord: function(group, options) {
	        var node = new mathMLTree.MathNode(
	            "mi",
	            [makeText(group.value, group.mode)]);

	        var variant = getVariant(group, options);
	        if (variant) {
	            node.setAttribute("mathvariant", variant);
	        }
	        return node;
	    },

	    textord: function(group, options) {
	        var text = makeText(group.value, group.mode);

	        var variant = getVariant(group, options) || "normal";

	        var node;
	        if (/[0-9]/.test(group.value)) {
	            // TODO(kevinb) merge adjacent <mn> nodes
	            // do it as a post processing step
	            node = new mathMLTree.MathNode("mn", [text]);
	            if (options.font) {
	                node.setAttribute("mathvariant", variant);
	            }
	        } else {
	            node = new mathMLTree.MathNode("mi", [text]);
	            node.setAttribute("mathvariant", variant);
	        }

	        return node;
	    },

	    bin: function(group) {
	        var node = new mathMLTree.MathNode(
	            "mo", [makeText(group.value, group.mode)]);

	        return node;
	    },

	    rel: function(group) {
	        var node = new mathMLTree.MathNode(
	            "mo", [makeText(group.value, group.mode)]);

	        return node;
	    },

	    open: function(group) {
	        var node = new mathMLTree.MathNode(
	            "mo", [makeText(group.value, group.mode)]);

	        return node;
	    },

	    close: function(group) {
	        var node = new mathMLTree.MathNode(
	            "mo", [makeText(group.value, group.mode)]);

	        return node;
	    },

	    inner: function(group) {
	        var node = new mathMLTree.MathNode(
	            "mo", [makeText(group.value, group.mode)]);

	        return node;
	    },

	    punct: function(group) {
	        var node = new mathMLTree.MathNode(
	            "mo", [makeText(group.value, group.mode)]);

	        node.setAttribute("separator", "true");

	        return node;
	    },

	    ordgroup: function(group, options) {
	        var inner = buildExpression(group.value, options);

	        var node = new mathMLTree.MathNode("mrow", inner);

	        return node;
	    },

	    text: function(group, options) {
	        var inner = buildExpression(group.value.body, options);

	        var node = new mathMLTree.MathNode("mtext", inner);

	        return node;
	    },

	    color: function(group, options) {
	        var inner = buildExpression(group.value.value, options);

	        var node = new mathMLTree.MathNode("mstyle", inner);

	        node.setAttribute("mathcolor", group.value.color);

	        return node;
	    },

	    supsub: function(group, options) {
	        var children = [buildGroup(group.value.base, options)];

	        if (group.value.sub) {
	            children.push(buildGroup(group.value.sub, options));
	        }

	        if (group.value.sup) {
	            children.push(buildGroup(group.value.sup, options));
	        }

	        var nodeType;
	        if (!group.value.sub) {
	            nodeType = "msup";
	        } else if (!group.value.sup) {
	            nodeType = "msub";
	        } else {
	            nodeType = "msubsup";
	        }

	        var node = new mathMLTree.MathNode(nodeType, children);

	        return node;
	    },

	    genfrac: function(group, options) {
	        var node = new mathMLTree.MathNode(
	            "mfrac",
	            [buildGroup(group.value.numer, options),
	             buildGroup(group.value.denom, options)]);

	        if (!group.value.hasBarLine) {
	            node.setAttribute("linethickness", "0px");
	        }

	        if (group.value.leftDelim != null || group.value.rightDelim != null) {
	            var withDelims = [];

	            if (group.value.leftDelim != null) {
	                var leftOp = new mathMLTree.MathNode(
	                    "mo", [new mathMLTree.TextNode(group.value.leftDelim)]);

	                leftOp.setAttribute("fence", "true");

	                withDelims.push(leftOp);
	            }

	            withDelims.push(node);

	            if (group.value.rightDelim != null) {
	                var rightOp = new mathMLTree.MathNode(
	                    "mo", [new mathMLTree.TextNode(group.value.rightDelim)]);

	                rightOp.setAttribute("fence", "true");

	                withDelims.push(rightOp);
	            }

	            var outerNode = new mathMLTree.MathNode("mrow", withDelims);

	            return outerNode;
	        }

	        return node;
	    },

	    array: function(group, options) {
	        return new mathMLTree.MathNode(
	            "mtable", group.value.body.map(function(row) {
	                return new mathMLTree.MathNode(
	                    "mtr", row.map(function(cell) {
	                        return new mathMLTree.MathNode(
	                            "mtd", [buildGroup(cell, options)]);
	                    }));
	            }));
	    },

	    sqrt: function(group, options) {
	        var node;
	        if (group.value.index) {
	            node = new mathMLTree.MathNode(
	                "mroot", [
	                    buildGroup(group.value.body, options),
	                    buildGroup(group.value.index, options)
	                ]);
	        } else {
	            node = new mathMLTree.MathNode(
	                "msqrt", [buildGroup(group.value.body, options)]);
	        }

	        return node;
	    },

	    leftright: function(group, options) {
	        var inner = buildExpression(group.value.body, options);

	        if (group.value.left !== ".") {
	            var leftNode = new mathMLTree.MathNode(
	                "mo", [makeText(group.value.left, group.mode)]);

	            leftNode.setAttribute("fence", "true");

	            inner.unshift(leftNode);
	        }

	        if (group.value.right !== ".") {
	            var rightNode = new mathMLTree.MathNode(
	                "mo", [makeText(group.value.right, group.mode)]);

	            rightNode.setAttribute("fence", "true");

	            inner.push(rightNode);
	        }

	        var outerNode = new mathMLTree.MathNode("mrow", inner);

	        return outerNode;
	    },

	    accent: function(group, options) {
	        var accentNode = new mathMLTree.MathNode(
	            "mo", [makeText(group.value.accent, group.mode)]);

	        var node = new mathMLTree.MathNode(
	            "mover",
	            [buildGroup(group.value.base, options),
	             accentNode]);

	        node.setAttribute("accent", "true");

	        return node;
	    },

	    spacing: function(group) {
	        var node;

	        if (group.value === "\\ " || group.value === "\\space" ||
	            group.value === " " || group.value === "~") {
	            node = new mathMLTree.MathNode(
	                "mtext", [new mathMLTree.TextNode("\u00a0")]);
	        } else {
	            node = new mathMLTree.MathNode("mspace");

	            node.setAttribute(
	                "width", buildCommon.spacingFunctions[group.value].size);
	        }

	        return node;
	    },

	    op: function(group) {
	        var node;

	        // TODO(emily): handle big operators using the `largeop` attribute

	        if (group.value.symbol) {
	            // This is a symbol. Just add the symbol.
	            node = new mathMLTree.MathNode(
	                "mo", [makeText(group.value.body, group.mode)]);
	        } else {
	            // This is a text operator. Add all of the characters from the
	            // operator's name.
	            // TODO(emily): Add a space in the middle of some of these
	            // operators, like \limsup.
	            node = new mathMLTree.MathNode(
	                "mi", [new mathMLTree.TextNode(group.value.body.slice(1))]);
	        }

	        return node;
	    },

	    katex: function(group) {
	        var node = new mathMLTree.MathNode(
	            "mtext", [new mathMLTree.TextNode("KaTeX")]);

	        return node;
	    },

	    font: function(group, options) {
	        var font = group.value.font;
	        return buildGroup(group.value.body, options.withFont(font));
	    },

	    delimsizing: function(group) {
	        var children = [];

	        if (group.value.value !== ".") {
	            children.push(makeText(group.value.value, group.mode));
	        }

	        var node = new mathMLTree.MathNode("mo", children);

	        if (group.value.delimType === "open" ||
	            group.value.delimType === "close") {
	            // Only some of the delimsizing functions act as fences, and they
	            // return "open" or "close" delimTypes.
	            node.setAttribute("fence", "true");
	        } else {
	            // Explicitly disable fencing if it's not a fence, to override the
	            // defaults.
	            node.setAttribute("fence", "false");
	        }

	        return node;
	    },

	    styling: function(group, options) {
	        var inner = buildExpression(group.value.value, options);

	        var node = new mathMLTree.MathNode("mstyle", inner);

	        var styleAttributes = {
	            "display": ["0", "true"],
	            "text": ["0", "false"],
	            "script": ["1", "false"],
	            "scriptscript": ["2", "false"]
	        };

	        var attr = styleAttributes[group.value.style];

	        node.setAttribute("scriptlevel", attr[0]);
	        node.setAttribute("displaystyle", attr[1]);

	        return node;
	    },

	    sizing: function(group, options) {
	        var inner = buildExpression(group.value.value, options);

	        var node = new mathMLTree.MathNode("mstyle", inner);

	        // TODO(emily): This doesn't produce the correct size for nested size
	        // changes, because we don't keep state of what style we're currently
	        // in, so we can't reset the size to normal before changing it.  Now
	        // that we're passing an options parameter we should be able to fix
	        // this.
	        node.setAttribute(
	            "mathsize", buildCommon.sizingMultiplier[group.value.size] + "em");

	        return node;
	    },

	    overline: function(group, options) {
	        var operator = new mathMLTree.MathNode(
	            "mo", [new mathMLTree.TextNode("\u203e")]);
	        operator.setAttribute("stretchy", "true");

	        var node = new mathMLTree.MathNode(
	            "mover",
	            [buildGroup(group.value.body, options),
	             operator]);
	        node.setAttribute("accent", "true");

	        return node;
	    },

	    rule: function(group) {
	        // TODO(emily): Figure out if there's an actual way to draw black boxes
	        // in MathML.
	        var node = new mathMLTree.MathNode("mrow");

	        return node;
	    },

	    llap: function(group, options) {
	        var node = new mathMLTree.MathNode(
	            "mpadded", [buildGroup(group.value.body, options)]);

	        node.setAttribute("lspace", "-1width");
	        node.setAttribute("width", "0px");

	        return node;
	    },

	    rlap: function(group, options) {
	        var node = new mathMLTree.MathNode(
	            "mpadded", [buildGroup(group.value.body, options)]);

	        node.setAttribute("width", "0px");

	        return node;
	    },

	    phantom: function(group, options, prev) {
	        var inner = buildExpression(group.value.value, options);
	        return new mathMLTree.MathNode("mphantom", inner);
	    }
	};

	/**
	 * Takes a list of nodes, builds them, and returns a list of the generated
	 * MathML nodes. A little simpler than the HTML version because we don't do any
	 * previous-node handling.
	 */
	var buildExpression = function(expression, options) {
	    var groups = [];
	    for (var i = 0; i < expression.length; i++) {
	        var group = expression[i];
	        groups.push(buildGroup(group, options));
	    }
	    return groups;
	};

	/**
	 * Takes a group from the parser and calls the appropriate groupTypes function
	 * on it to produce a MathML node.
	 */
	var buildGroup = function(group, options) {
	    if (!group) {
	        return new mathMLTree.MathNode("mrow");
	    }

	    if (groupTypes[group.type]) {
	        // Call the groupTypes function
	        return groupTypes[group.type](group, options);
	    } else {
	        throw new ParseError(
	            "Got group of unknown type: '" + group.type + "'");
	    }
	};

	/**
	 * Takes a full parse tree and settings and builds a MathML representation of
	 * it. In particular, we put the elements from building the parse tree into a
	 * <semantics> tag so we can also include that TeX source as an annotation.
	 *
	 * Note that we actually return a domTree element with a `<math>` inside it so
	 * we can do appropriate styling.
	 */
	var buildMathML = function(tree, texExpression, options) {
	    var expression = buildExpression(tree, options);

	    // Wrap up the expression in an mrow so it is presented in the semantics
	    // tag correctly.
	    var wrapper = new mathMLTree.MathNode("mrow", expression);

	    // Build a TeX annotation of the source
	    var annotation = new mathMLTree.MathNode(
	        "annotation", [new mathMLTree.TextNode(texExpression)]);

	    annotation.setAttribute("encoding", "application/x-tex");

	    var semantics = new mathMLTree.MathNode(
	        "semantics", [wrapper, annotation]);

	    var math = new mathMLTree.MathNode("math", [semantics]);

	    // You can't style <math> nodes, so we wrap the node in a span.
	    return makeSpan(["katex-mathml"], [math]);
	};

	module.exports = buildMathML;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	var buildHTML = __webpack_require__(64);
	var buildMathML = __webpack_require__(65);
	var buildCommon = __webpack_require__(7);
	var Options = __webpack_require__(62);
	var Settings = __webpack_require__(25);
	var Style = __webpack_require__(6);

	var makeSpan = buildCommon.makeSpan;

	var buildTree = function(tree, expression, settings) {
	    settings = settings || new Settings({});

	    var startStyle = Style.TEXT;
	    if (settings.displayMode) {
	        startStyle = Style.DISPLAY;
	    }

	    // Setup the default options
	    var options = new Options({
	        style: startStyle,
	        size: "size5"
	    });

	    // `buildHTML` sometimes messes with the parse tree (like turning bins ->
	    // ords), so we build the MathML version first.
	    var mathMLNode = buildMathML(tree, expression, options);
	    var htmlNode = buildHTML(tree, options);

	    var katexNode = makeSpan(["katex"], [
	        mathMLNode, htmlNode
	    ]);

	    if (settings.displayMode) {
	        return makeSpan(["katex-display"], [katexNode]);
	    } else {
	        return katexNode;
	    }
	};

	module.exports = buildTree;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This file deals with creating delimiters of various sizes. The TeXbook
	 * discusses these routines on page 441-442, in the "Another subroutine sets box
	 * x to a specified variable delimiter" paragraph.
	 *
	 * There are three main routines here. `makeSmallDelim` makes a delimiter in the
	 * normal font, but in either text, script, or scriptscript style.
	 * `makeLargeDelim` makes a delimiter in textstyle, but in one of the Size1,
	 * Size2, Size3, or Size4 fonts. `makeStackedDelim` makes a delimiter out of
	 * smaller pieces that are stacked on top of one another.
	 *
	 * The functions take a parameter `center`, which determines if the delimiter
	 * should be centered around the axis.
	 *
	 * Then, there are three exposed functions. `sizedDelim` makes a delimiter in
	 * one of the given sizes. This is used for things like `\bigl`.
	 * `customSizedDelim` makes a delimiter with a given total height+depth. It is
	 * called in places like `\sqrt`. `leftRightDelim` makes an appropriate
	 * delimiter which surrounds an expression of a given height an depth. It is
	 * used in `\left` and `\right`.
	 */

	var ParseError = __webpack_require__(2);
	var Style = __webpack_require__(6);

	var buildCommon = __webpack_require__(7);
	var fontMetrics = __webpack_require__(3);
	var symbols = __webpack_require__(8);
	var utils = __webpack_require__(1);

	var makeSpan = buildCommon.makeSpan;

	/**
	 * Get the metrics for a given symbol and font, after transformation (i.e.
	 * after following replacement from symbols.js)
	 */
	var getMetrics = function(symbol, font) {
	    if (symbols.math[symbol] && symbols.math[symbol].replace) {
	        return fontMetrics.getCharacterMetrics(
	            symbols.math[symbol].replace, font);
	    } else {
	        return fontMetrics.getCharacterMetrics(
	            symbol, font);
	    }
	};

	/**
	 * Builds a symbol in the given font size (note size is an integer)
	 */
	var mathrmSize = function(value, size, mode) {
	    return buildCommon.makeSymbol(value, "Size" + size + "-Regular", mode);
	};

	/**
	 * Puts a delimiter span in a given style, and adds appropriate height, depth,
	 * and maxFontSizes.
	 */
	var styleWrap = function(delim, toStyle, options) {
	    var span = makeSpan(
	        ["style-wrap", options.style.reset(), toStyle.cls()], [delim]);

	    var multiplier = toStyle.sizeMultiplier / options.style.sizeMultiplier;

	    span.height *= multiplier;
	    span.depth *= multiplier;
	    span.maxFontSize = toStyle.sizeMultiplier;

	    return span;
	};

	/**
	 * Makes a small delimiter. This is a delimiter that comes in the Main-Regular
	 * font, but is restyled to either be in textstyle, scriptstyle, or
	 * scriptscriptstyle.
	 */
	var makeSmallDelim = function(delim, style, center, options, mode) {
	    var text = buildCommon.makeSymbol(delim, "Main-Regular", mode);

	    var span = styleWrap(text, style, options);

	    if (center) {
	        var shift =
	            (1 - options.style.sizeMultiplier / style.sizeMultiplier) *
	            fontMetrics.metrics.axisHeight;

	        span.style.top = shift + "em";
	        span.height -= shift;
	        span.depth += shift;
	    }

	    return span;
	};

	/**
	 * Makes a large delimiter. This is a delimiter that comes in the Size1, Size2,
	 * Size3, or Size4 fonts. It is always rendered in textstyle.
	 */
	var makeLargeDelim = function(delim, size, center, options, mode) {
	    var inner = mathrmSize(delim, size, mode);

	    var span = styleWrap(
	        makeSpan(["delimsizing", "size" + size],
	                 [inner], options.getColor()),
	        Style.TEXT, options);

	    if (center) {
	        var shift = (1 - options.style.sizeMultiplier) *
	            fontMetrics.metrics.axisHeight;

	        span.style.top = shift + "em";
	        span.height -= shift;
	        span.depth += shift;
	    }

	    return span;
	};

	/**
	 * Make an inner span with the given offset and in the given font. This is used
	 * in `makeStackedDelim` to make the stacking pieces for the delimiter.
	 */
	var makeInner = function(symbol, font, mode) {
	    var sizeClass;
	    // Apply the correct CSS class to choose the right font.
	    if (font === "Size1-Regular") {
	        sizeClass = "delim-size1";
	    } else if (font === "Size4-Regular") {
	        sizeClass = "delim-size4";
	    }

	    var inner = makeSpan(
	        ["delimsizinginner", sizeClass],
	        [makeSpan([], [buildCommon.makeSymbol(symbol, font, mode)])]);

	    // Since this will be passed into `makeVList` in the end, wrap the element
	    // in the appropriate tag that VList uses.
	    return {type: "elem", elem: inner};
	};

	/**
	 * Make a stacked delimiter out of a given delimiter, with the total height at
	 * least `heightTotal`. This routine is mentioned on page 442 of the TeXbook.
	 */
	var makeStackedDelim = function(delim, heightTotal, center, options, mode) {
	    // There are four parts, the top, an optional middle, a repeated part, and a
	    // bottom.
	    var top, middle, repeat, bottom;
	    top = repeat = bottom = delim;
	    middle = null;
	    // Also keep track of what font the delimiters are in
	    var font = "Size1-Regular";

	    // We set the parts and font based on the symbol. Note that we use
	    // '\u23d0' instead of '|' and '\u2016' instead of '\\|' for the
	    // repeats of the arrows
	    if (delim === "\\uparrow") {
	        repeat = bottom = "\u23d0";
	    } else if (delim === "\\Uparrow") {
	        repeat = bottom = "\u2016";
	    } else if (delim === "\\downarrow") {
	        top = repeat = "\u23d0";
	    } else if (delim === "\\Downarrow") {
	        top = repeat = "\u2016";
	    } else if (delim === "\\updownarrow") {
	        top = "\\uparrow";
	        repeat = "\u23d0";
	        bottom = "\\downarrow";
	    } else if (delim === "\\Updownarrow") {
	        top = "\\Uparrow";
	        repeat = "\u2016";
	        bottom = "\\Downarrow";
	    } else if (delim === "[" || delim === "\\lbrack") {
	        top = "\u23a1";
	        repeat = "\u23a2";
	        bottom = "\u23a3";
	        font = "Size4-Regular";
	    } else if (delim === "]" || delim === "\\rbrack") {
	        top = "\u23a4";
	        repeat = "\u23a5";
	        bottom = "\u23a6";
	        font = "Size4-Regular";
	    } else if (delim === "\\lfloor") {
	        repeat = top = "\u23a2";
	        bottom = "\u23a3";
	        font = "Size4-Regular";
	    } else if (delim === "\\lceil") {
	        top = "\u23a1";
	        repeat = bottom = "\u23a2";
	        font = "Size4-Regular";
	    } else if (delim === "\\rfloor") {
	        repeat = top = "\u23a5";
	        bottom = "\u23a6";
	        font = "Size4-Regular";
	    } else if (delim === "\\rceil") {
	        top = "\u23a4";
	        repeat = bottom = "\u23a5";
	        font = "Size4-Regular";
	    } else if (delim === "(") {
	        top = "\u239b";
	        repeat = "\u239c";
	        bottom = "\u239d";
	        font = "Size4-Regular";
	    } else if (delim === ")") {
	        top = "\u239e";
	        repeat = "\u239f";
	        bottom = "\u23a0";
	        font = "Size4-Regular";
	    } else if (delim === "\\{" || delim === "\\lbrace") {
	        top = "\u23a7";
	        middle = "\u23a8";
	        bottom = "\u23a9";
	        repeat = "\u23aa";
	        font = "Size4-Regular";
	    } else if (delim === "\\}" || delim === "\\rbrace") {
	        top = "\u23ab";
	        middle = "\u23ac";
	        bottom = "\u23ad";
	        repeat = "\u23aa";
	        font = "Size4-Regular";
	    } else if (delim === "\\lgroup") {
	        top = "\u23a7";
	        bottom = "\u23a9";
	        repeat = "\u23aa";
	        font = "Size4-Regular";
	    } else if (delim === "\\rgroup") {
	        top = "\u23ab";
	        bottom = "\u23ad";
	        repeat = "\u23aa";
	        font = "Size4-Regular";
	    } else if (delim === "\\lmoustache") {
	        top = "\u23a7";
	        bottom = "\u23ad";
	        repeat = "\u23aa";
	        font = "Size4-Regular";
	    } else if (delim === "\\rmoustache") {
	        top = "\u23ab";
	        bottom = "\u23a9";
	        repeat = "\u23aa";
	        font = "Size4-Regular";
	    } else if (delim === "\\surd") {
	        top = "\ue001";
	        bottom = "\u23b7";
	        repeat = "\ue000";
	        font = "Size4-Regular";
	    }

	    // Get the metrics of the four sections
	    var topMetrics = getMetrics(top, font);
	    var topHeightTotal = topMetrics.height + topMetrics.depth;
	    var repeatMetrics = getMetrics(repeat, font);
	    var repeatHeightTotal = repeatMetrics.height + repeatMetrics.depth;
	    var bottomMetrics = getMetrics(bottom, font);
	    var bottomHeightTotal = bottomMetrics.height + bottomMetrics.depth;
	    var middleHeightTotal = 0;
	    var middleFactor = 1;
	    if (middle !== null) {
	        var middleMetrics = getMetrics(middle, font);
	        middleHeightTotal = middleMetrics.height + middleMetrics.depth;
	        middleFactor = 2; // repeat symmetrically above and below middle
	    }

	    // Calcuate the minimal height that the delimiter can have.
	    // It is at least the size of the top, bottom, and optional middle combined.
	    var minHeight = topHeightTotal + bottomHeightTotal + middleHeightTotal;

	    // Compute the number of copies of the repeat symbol we will need
	    var repeatCount = Math.ceil(
	        (heightTotal - minHeight) / (middleFactor * repeatHeightTotal));

	    // Compute the total height of the delimiter including all the symbols
	    var realHeightTotal =
	        minHeight + repeatCount * middleFactor * repeatHeightTotal;

	    // The center of the delimiter is placed at the center of the axis. Note
	    // that in this context, "center" means that the delimiter should be
	    // centered around the axis in the current style, while normally it is
	    // centered around the axis in textstyle.
	    var axisHeight = fontMetrics.metrics.axisHeight;
	    if (center) {
	        axisHeight *= options.style.sizeMultiplier;
	    }
	    // Calculate the depth
	    var depth = realHeightTotal / 2 - axisHeight;

	    // Now, we start building the pieces that will go into the vlist

	    // Keep a list of the inner pieces
	    var inners = [];

	    // Add the bottom symbol
	    inners.push(makeInner(bottom, font, mode));

	    var i;
	    if (middle === null) {
	        // Add that many symbols
	        for (i = 0; i < repeatCount; i++) {
	            inners.push(makeInner(repeat, font, mode));
	        }
	    } else {
	        // When there is a middle bit, we need the middle part and two repeated
	        // sections
	        for (i = 0; i < repeatCount; i++) {
	            inners.push(makeInner(repeat, font, mode));
	        }
	        inners.push(makeInner(middle, font, mode));
	        for (i = 0; i < repeatCount; i++) {
	            inners.push(makeInner(repeat, font, mode));
	        }
	    }

	    // Add the top symbol
	    inners.push(makeInner(top, font, mode));

	    // Finally, build the vlist
	    var inner = buildCommon.makeVList(inners, "bottom", depth, options);

	    return styleWrap(
	        makeSpan(["delimsizing", "mult"], [inner], options.getColor()),
	        Style.TEXT, options);
	};

	// There are three kinds of delimiters, delimiters that stack when they become
	// too large
	var stackLargeDelimiters = [
	    "(", ")", "[", "\\lbrack", "]", "\\rbrack",
	    "\\{", "\\lbrace", "\\}", "\\rbrace",
	    "\\lfloor", "\\rfloor", "\\lceil", "\\rceil",
	    "\\surd"
	];

	// delimiters that always stack
	var stackAlwaysDelimiters = [
	    "\\uparrow", "\\downarrow", "\\updownarrow",
	    "\\Uparrow", "\\Downarrow", "\\Updownarrow",
	    "|", "\\|", "\\vert", "\\Vert",
	    "\\lvert", "\\rvert", "\\lVert", "\\rVert",
	    "\\lgroup", "\\rgroup", "\\lmoustache", "\\rmoustache"
	];

	// and delimiters that never stack
	var stackNeverDelimiters = [
	    "<", ">", "\\langle", "\\rangle", "/", "\\backslash"
	];

	// Metrics of the different sizes. Found by looking at TeX's output of
	// $\bigl| // \Bigl| \biggl| \Biggl| \showlists$
	// Used to create stacked delimiters of appropriate sizes in makeSizedDelim.
	var sizeToMaxHeight = [0, 1.2, 1.8, 2.4, 3.0];

	/**
	 * Used to create a delimiter of a specific size, where `size` is 1, 2, 3, or 4.
	 */
	var makeSizedDelim = function(delim, size, options, mode) {
	    // < and > turn into \langle and \rangle in delimiters
	    if (delim === "<") {
	        delim = "\\langle";
	    } else if (delim === ">") {
	        delim = "\\rangle";
	    }

	    // Sized delimiters are never centered.
	    if (utils.contains(stackLargeDelimiters, delim) ||
	        utils.contains(stackNeverDelimiters, delim)) {
	        return makeLargeDelim(delim, size, false, options, mode);
	    } else if (utils.contains(stackAlwaysDelimiters, delim)) {
	        return makeStackedDelim(
	            delim, sizeToMaxHeight[size], false, options, mode);
	    } else {
	        throw new ParseError("Illegal delimiter: '" + delim + "'");
	    }
	};

	/**
	 * There are three different sequences of delimiter sizes that the delimiters
	 * follow depending on the kind of delimiter. This is used when creating custom
	 * sized delimiters to decide whether to create a small, large, or stacked
	 * delimiter.
	 *
	 * In real TeX, these sequences aren't explicitly defined, but are instead
	 * defined inside the font metrics. Since there are only three sequences that
	 * are possible for the delimiters that TeX defines, it is easier to just encode
	 * them explicitly here.
	 */

	// Delimiters that never stack try small delimiters and large delimiters only
	var stackNeverDelimiterSequence = [
	    {type: "small", style: Style.SCRIPTSCRIPT},
	    {type: "small", style: Style.SCRIPT},
	    {type: "small", style: Style.TEXT},
	    {type: "large", size: 1},
	    {type: "large", size: 2},
	    {type: "large", size: 3},
	    {type: "large", size: 4}
	];

	// Delimiters that always stack try the small delimiters first, then stack
	var stackAlwaysDelimiterSequence = [
	    {type: "small", style: Style.SCRIPTSCRIPT},
	    {type: "small", style: Style.SCRIPT},
	    {type: "small", style: Style.TEXT},
	    {type: "stack"}
	];

	// Delimiters that stack when large try the small and then large delimiters, and
	// stack afterwards
	var stackLargeDelimiterSequence = [
	    {type: "small", style: Style.SCRIPTSCRIPT},
	    {type: "small", style: Style.SCRIPT},
	    {type: "small", style: Style.TEXT},
	    {type: "large", size: 1},
	    {type: "large", size: 2},
	    {type: "large", size: 3},
	    {type: "large", size: 4},
	    {type: "stack"}
	];

	/**
	 * Get the font used in a delimiter based on what kind of delimiter it is.
	 */
	var delimTypeToFont = function(type) {
	    if (type.type === "small") {
	        return "Main-Regular";
	    } else if (type.type === "large") {
	        return "Size" + type.size + "-Regular";
	    } else if (type.type === "stack") {
	        return "Size4-Regular";
	    }
	};

	/**
	 * Traverse a sequence of types of delimiters to decide what kind of delimiter
	 * should be used to create a delimiter of the given height+depth.
	 */
	var traverseSequence = function(delim, height, sequence, options) {
	    // Here, we choose the index we should start at in the sequences. In smaller
	    // sizes (which correspond to larger numbers in style.size) we start earlier
	    // in the sequence. Thus, scriptscript starts at index 3-3=0, script starts
	    // at index 3-2=1, text starts at 3-1=2, and display starts at min(2,3-0)=2
	    var start = Math.min(2, 3 - options.style.size);
	    for (var i = start; i < sequence.length; i++) {
	        if (sequence[i].type === "stack") {
	            // This is always the last delimiter, so we just break the loop now.
	            break;
	        }

	        var metrics = getMetrics(delim, delimTypeToFont(sequence[i]));
	        var heightDepth = metrics.height + metrics.depth;

	        // Small delimiters are scaled down versions of the same font, so we
	        // account for the style change size.

	        if (sequence[i].type === "small") {
	            heightDepth *= sequence[i].style.sizeMultiplier;
	        }

	        // Check if the delimiter at this size works for the given height.
	        if (heightDepth > height) {
	            return sequence[i];
	        }
	    }

	    // If we reached the end of the sequence, return the last sequence element.
	    return sequence[sequence.length - 1];
	};

	/**
	 * Make a delimiter of a given height+depth, with optional centering. Here, we
	 * traverse the sequences, and create a delimiter that the sequence tells us to.
	 */
	var makeCustomSizedDelim = function(delim, height, center, options, mode) {
	    if (delim === "<") {
	        delim = "\\langle";
	    } else if (delim === ">") {
	        delim = "\\rangle";
	    }

	    // Decide what sequence to use
	    var sequence;
	    if (utils.contains(stackNeverDelimiters, delim)) {
	        sequence = stackNeverDelimiterSequence;
	    } else if (utils.contains(stackLargeDelimiters, delim)) {
	        sequence = stackLargeDelimiterSequence;
	    } else {
	        sequence = stackAlwaysDelimiterSequence;
	    }

	    // Look through the sequence
	    var delimType = traverseSequence(delim, height, sequence, options);

	    // Depending on the sequence element we decided on, call the appropriate
	    // function.
	    if (delimType.type === "small") {
	        return makeSmallDelim(delim, delimType.style, center, options, mode);
	    } else if (delimType.type === "large") {
	        return makeLargeDelim(delim, delimType.size, center, options, mode);
	    } else if (delimType.type === "stack") {
	        return makeStackedDelim(delim, height, center, options, mode);
	    }
	};

	/**
	 * Make a delimiter for use with `\left` and `\right`, given a height and depth
	 * of an expression that the delimiters surround.
	 */
	var makeLeftRightDelim = function(delim, height, depth, options, mode) {
	    // We always center \left/\right delimiters, so the axis is always shifted
	    var axisHeight =
	        fontMetrics.metrics.axisHeight * options.style.sizeMultiplier;

	    // Taken from TeX source, tex.web, function make_left_right
	    var delimiterFactor = 901;
	    var delimiterExtend = 5.0 / fontMetrics.metrics.ptPerEm;

	    var maxDistFromAxis = Math.max(
	        height - axisHeight, depth + axisHeight);

	    var totalHeight = Math.max(
	        // In real TeX, calculations are done using integral values which are
	        // 65536 per pt, or 655360 per em. So, the division here truncates in
	        // TeX but doesn't here, producing different results. If we wanted to
	        // exactly match TeX's calculation, we could do
	        //   Math.floor(655360 * maxDistFromAxis / 500) *
	        //    delimiterFactor / 655360
	        // (To see the difference, compare
	        //    x^{x^{\left(\rule{0.1em}{0.68em}\right)}}
	        // in TeX and KaTeX)
	        maxDistFromAxis / 500 * delimiterFactor,
	        2 * maxDistFromAxis - delimiterExtend);

	    // Finally, we defer to `makeCustomSizedDelim` with our calculated total
	    // height
	    return makeCustomSizedDelim(delim, totalHeight, true, options, mode);
	};

	module.exports = {
	    sizedDelim: makeSizedDelim,
	    customSizedDelim: makeCustomSizedDelim,
	    leftRightDelim: makeLeftRightDelim
	};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	var fontMetrics = __webpack_require__(3);
	var parseData = __webpack_require__(27);
	var ParseError = __webpack_require__(2);

	var ParseNode = parseData.ParseNode;
	var ParseResult = parseData.ParseResult;

	/**
	 * Parse the body of the environment, with rows delimited by \\ and
	 * columns delimited by &, and create a nested list in row-major order
	 * with one group per cell.
	 */
	function parseArray(parser, pos, mode, result) {
	    var row = [], body = [row], rowGaps = [];
	    while (true) {
	        var cell = parser.parseExpression(pos, mode, false, null);
	        row.push(new ParseNode("ordgroup", cell.result, mode));
	        pos = cell.position;
	        var next = cell.peek.text;
	        if (next === "&") {
	            pos = cell.peek.position;
	        } else if (next === "\\end") {
	            break;
	        } else if (next === "\\\\" || next === "\\cr") {
	            var cr = parser.parseFunction(pos, mode);
	            rowGaps.push(cr.result.value.size);
	            pos = cr.position;
	            row = [];
	            body.push(row);
	        } else {
	            throw new ParseError("Expected & or \\\\ or \\end",
	                                 parser.lexer, cell.peek.position);
	        }
	    }
	    result.body = body;
	    result.rowGaps = rowGaps;
	    return new ParseResult(new ParseNode(result.type, result, mode), pos);
	}

	/*
	 * An environment definition is very similar to a function definition.
	 * Each element of the following array may contain
	 *  - names: The names associated with a function. This can be used to
	 *           share one implementation between several similar environments.
	 *  - numArgs: The number of arguments after the \begin{name} function.
	 *  - argTypes: (optional) Just like for a function
	 *  - allowedInText: (optional) Whether or not the environment is allowed inside
	 *                   text mode (default false) (not enforced yet)
	 *  - numOptionalArgs: (optional) Just like for a function
	 *  - handler: The function that is called to handle this environment.
	 *             It will receive the following arguments:
	 *             - pos: the current position of the parser.
	 *             - mode: the current parsing mode.
	 *             - envName: the name of the environment, one of the listed names.
	 *             - [args]: the arguments passed to \begin.
	 *             - positions: the positions associated with these arguments.
	 */

	var environmentDefinitions = [

	    // Arrays are part of LaTeX, defined in lttab.dtx so its documentation
	    // is part of the source2e.pdf file of LaTeX2e source documentation.
	    {
	        names: ["array"],
	        numArgs: 1,
	        handler: function(pos, mode, envName, colalign, positions) {
	            var parser = this;
	            colalign = colalign.value.map ? colalign.value : [colalign];
	            var cols = colalign.map(function(node) {
	                var ca = node.value;
	                if ("lcr".indexOf(ca) !== -1) {
	                    return {
	                        type: "align",
	                        align: ca
	                    };
	                } else if (ca === "|") {
	                    return {
	                        type: "separator",
	                        separator: "|"
	                    };
	                }
	                throw new ParseError(
	                    "Unknown column alignment: " + node.value,
	                    parser.lexer, positions[1]);
	            });
	            var res = {
	                type: "array",
	                cols: cols,
	                hskipBeforeAndAfter: true // \@preamble in lttab.dtx
	            };
	            res = parseArray(parser, pos, mode, res);
	            return res;
	        }
	    },

	    // The matrix environments of amsmath builds on the array environment
	    // of LaTeX, which is discussed above.
	    {
	        names: [
	            "matrix",
	            "pmatrix",
	            "bmatrix",
	            "Bmatrix",
	            "vmatrix",
	            "Vmatrix"
	        ],
	        handler: function(pos, mode, envName) {
	            var delimiters = {
	                "matrix": null,
	                "pmatrix": ["(", ")"],
	                "bmatrix": ["[", "]"],
	                "Bmatrix": ["\\{", "\\}"],
	                "vmatrix": ["|", "|"],
	                "Vmatrix": ["\\Vert", "\\Vert"]
	            }[envName];
	            var res = {
	                type: "array",
	                hskipBeforeAndAfter: false // \hskip -\arraycolsep in amsmath
	            };
	            res = parseArray(this, pos, mode, res);
	            if (delimiters) {
	                res.result = new ParseNode("leftright", {
	                    body: [res.result],
	                    left: delimiters[0],
	                    right: delimiters[1]
	                }, mode);
	            }
	            return res;
	        }
	    },

	    // A cases environment (in amsmath.sty) is almost equivalent to
	    // \def\arraystretch{1.2}%
	    // \left\{\begin{array}{@{}l@{\quad}l@{}} … \end{array}\right.
	    {
	        names: ["cases"],
	        handler: function(pos, mode, envName) {
	            var res = {
	                type: "array",
	                arraystretch: 1.2,
	                cols: [{
	                    type: "align",
	                    align: "l",
	                    pregap: 0,
	                    postgap: fontMetrics.metrics.quad
	                }, {
	                    type: "align",
	                    align: "l",
	                    pregap: 0,
	                    postgap: 0
	                }]
	            };
	            res = parseArray(this, pos, mode, res);
	            res.result = new ParseNode("leftright", {
	                body: [res.result],
	                left: "\\{",
	                right: "."
	            }, mode);
	            return res;
	        }
	    }
	];

	module.exports = (function() {
	    // nested function so we don't leak i and j into the module scope
	    var exports = {};
	    for (var i = 0; i < environmentDefinitions.length; ++i) {
	        var def = environmentDefinitions[i];
	        def.greediness = 1;
	        def.allowedInText = !!def.allowedInText;
	        def.numArgs = def.numArgs || 0;
	        def.numOptionalArgs = def.numOptionalArgs || 0;
	        for (var j = 0; j < def.names.length; ++j) {
	            exports[def.names[j]] = def;
	        }
	    }
	    return exports;
	})();


/***/ }),
/* 69 */
/***/ (function(module, exports) {

	module.exports = {
	"AMS-Regular": {
	  "65": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "66": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "67": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "68": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "69": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "70": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "71": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "72": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "73": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "74": {"depth": 0.16667, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "75": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "76": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "77": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "78": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "79": {"depth": 0.16667, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "80": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "81": {"depth": 0.16667, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "82": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "83": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "84": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "85": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "86": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "87": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "88": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "89": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "90": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "107": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "165": {"depth": 0.0, "height": 0.675, "italic": 0.025, "skew": 0.0},
	  "174": {"depth": 0.15559, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "240": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "295": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "710": {"depth": 0.0, "height": 0.825, "italic": 0.0, "skew": 0.0},
	  "732": {"depth": 0.0, "height": 0.9, "italic": 0.0, "skew": 0.0},
	  "770": {"depth": 0.0, "height": 0.825, "italic": 0.0, "skew": 0.0},
	  "771": {"depth": 0.0, "height": 0.9, "italic": 0.0, "skew": 0.0},
	  "989": {"depth": 0.08167, "height": 0.58167, "italic": 0.0, "skew": 0.0},
	  "1008": {"depth": 0.0, "height": 0.43056, "italic": 0.04028, "skew": 0.0},
	  "8245": {"depth": 0.0, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8463": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "8487": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "8498": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "8502": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "8503": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "8504": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "8513": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "8592": {"depth": -0.03598, "height": 0.46402, "italic": 0.0, "skew": 0.0},
	  "8594": {"depth": -0.03598, "height": 0.46402, "italic": 0.0, "skew": 0.0},
	  "8602": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8603": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8606": {"depth": 0.01354, "height": 0.52239, "italic": 0.0, "skew": 0.0},
	  "8608": {"depth": 0.01354, "height": 0.52239, "italic": 0.0, "skew": 0.0},
	  "8610": {"depth": 0.01354, "height": 0.52239, "italic": 0.0, "skew": 0.0},
	  "8611": {"depth": 0.01354, "height": 0.52239, "italic": 0.0, "skew": 0.0},
	  "8619": {"depth": 0.0, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8620": {"depth": 0.0, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8621": {"depth": -0.13313, "height": 0.37788, "italic": 0.0, "skew": 0.0},
	  "8622": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8624": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8625": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8630": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "8631": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "8634": {"depth": 0.08198, "height": 0.58198, "italic": 0.0, "skew": 0.0},
	  "8635": {"depth": 0.08198, "height": 0.58198, "italic": 0.0, "skew": 0.0},
	  "8638": {"depth": 0.19444, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8639": {"depth": 0.19444, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8642": {"depth": 0.19444, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8643": {"depth": 0.19444, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8644": {"depth": 0.1808, "height": 0.675, "italic": 0.0, "skew": 0.0},
	  "8646": {"depth": 0.1808, "height": 0.675, "italic": 0.0, "skew": 0.0},
	  "8647": {"depth": 0.1808, "height": 0.675, "italic": 0.0, "skew": 0.0},
	  "8648": {"depth": 0.19444, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8649": {"depth": 0.1808, "height": 0.675, "italic": 0.0, "skew": 0.0},
	  "8650": {"depth": 0.19444, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8651": {"depth": 0.01354, "height": 0.52239, "italic": 0.0, "skew": 0.0},
	  "8652": {"depth": 0.01354, "height": 0.52239, "italic": 0.0, "skew": 0.0},
	  "8653": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8654": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8655": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8666": {"depth": 0.13667, "height": 0.63667, "italic": 0.0, "skew": 0.0},
	  "8667": {"depth": 0.13667, "height": 0.63667, "italic": 0.0, "skew": 0.0},
	  "8669": {"depth": -0.13313, "height": 0.37788, "italic": 0.0, "skew": 0.0},
	  "8672": {"depth": -0.064, "height": 0.437, "italic": 0, "skew": 0},
	  "8674": {"depth": -0.064, "height": 0.437, "italic": 0, "skew": 0},
	  "8705": {"depth": 0.0, "height": 0.825, "italic": 0.0, "skew": 0.0},
	  "8708": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "8709": {"depth": 0.08167, "height": 0.58167, "italic": 0.0, "skew": 0.0},
	  "8717": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "8722": {"depth": -0.03598, "height": 0.46402, "italic": 0.0, "skew": 0.0},
	  "8724": {"depth": 0.08198, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8726": {"depth": 0.08167, "height": 0.58167, "italic": 0.0, "skew": 0.0},
	  "8733": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8736": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8737": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8738": {"depth": 0.03517, "height": 0.52239, "italic": 0.0, "skew": 0.0},
	  "8739": {"depth": 0.08167, "height": 0.58167, "italic": 0.0, "skew": 0.0},
	  "8740": {"depth": 0.25142, "height": 0.74111, "italic": 0.0, "skew": 0.0},
	  "8741": {"depth": 0.08167, "height": 0.58167, "italic": 0.0, "skew": 0.0},
	  "8742": {"depth": 0.25142, "height": 0.74111, "italic": 0.0, "skew": 0.0},
	  "8756": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8757": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8764": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8765": {"depth": -0.13313, "height": 0.37788, "italic": 0.0, "skew": 0.0},
	  "8769": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8770": {"depth": -0.03625, "height": 0.46375, "italic": 0.0, "skew": 0.0},
	  "8774": {"depth": 0.30274, "height": 0.79383, "italic": 0.0, "skew": 0.0},
	  "8776": {"depth": -0.01688, "height": 0.48312, "italic": 0.0, "skew": 0.0},
	  "8778": {"depth": 0.08167, "height": 0.58167, "italic": 0.0, "skew": 0.0},
	  "8782": {"depth": 0.06062, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8783": {"depth": 0.06062, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8785": {"depth": 0.08198, "height": 0.58198, "italic": 0.0, "skew": 0.0},
	  "8786": {"depth": 0.08198, "height": 0.58198, "italic": 0.0, "skew": 0.0},
	  "8787": {"depth": 0.08198, "height": 0.58198, "italic": 0.0, "skew": 0.0},
	  "8790": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8791": {"depth": 0.22958, "height": 0.72958, "italic": 0.0, "skew": 0.0},
	  "8796": {"depth": 0.08198, "height": 0.91667, "italic": 0.0, "skew": 0.0},
	  "8806": {"depth": 0.25583, "height": 0.75583, "italic": 0.0, "skew": 0.0},
	  "8807": {"depth": 0.25583, "height": 0.75583, "italic": 0.0, "skew": 0.0},
	  "8808": {"depth": 0.25142, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "8809": {"depth": 0.25142, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "8812": {"depth": 0.25583, "height": 0.75583, "italic": 0.0, "skew": 0.0},
	  "8814": {"depth": 0.20576, "height": 0.70576, "italic": 0.0, "skew": 0.0},
	  "8815": {"depth": 0.20576, "height": 0.70576, "italic": 0.0, "skew": 0.0},
	  "8816": {"depth": 0.30274, "height": 0.79383, "italic": 0.0, "skew": 0.0},
	  "8817": {"depth": 0.30274, "height": 0.79383, "italic": 0.0, "skew": 0.0},
	  "8818": {"depth": 0.22958, "height": 0.72958, "italic": 0.0, "skew": 0.0},
	  "8819": {"depth": 0.22958, "height": 0.72958, "italic": 0.0, "skew": 0.0},
	  "8822": {"depth": 0.1808, "height": 0.675, "italic": 0.0, "skew": 0.0},
	  "8823": {"depth": 0.1808, "height": 0.675, "italic": 0.0, "skew": 0.0},
	  "8828": {"depth": 0.13667, "height": 0.63667, "italic": 0.0, "skew": 0.0},
	  "8829": {"depth": 0.13667, "height": 0.63667, "italic": 0.0, "skew": 0.0},
	  "8830": {"depth": 0.22958, "height": 0.72958, "italic": 0.0, "skew": 0.0},
	  "8831": {"depth": 0.22958, "height": 0.72958, "italic": 0.0, "skew": 0.0},
	  "8832": {"depth": 0.20576, "height": 0.70576, "italic": 0.0, "skew": 0.0},
	  "8833": {"depth": 0.20576, "height": 0.70576, "italic": 0.0, "skew": 0.0},
	  "8840": {"depth": 0.30274, "height": 0.79383, "italic": 0.0, "skew": 0.0},
	  "8841": {"depth": 0.30274, "height": 0.79383, "italic": 0.0, "skew": 0.0},
	  "8842": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0},
	  "8843": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0},
	  "8847": {"depth": 0.03517, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8848": {"depth": 0.03517, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8858": {"depth": 0.08198, "height": 0.58198, "italic": 0.0, "skew": 0.0},
	  "8859": {"depth": 0.08198, "height": 0.58198, "italic": 0.0, "skew": 0.0},
	  "8861": {"depth": 0.08198, "height": 0.58198, "italic": 0.0, "skew": 0.0},
	  "8862": {"depth": 0.0, "height": 0.675, "italic": 0.0, "skew": 0.0},
	  "8863": {"depth": 0.0, "height": 0.675, "italic": 0.0, "skew": 0.0},
	  "8864": {"depth": 0.0, "height": 0.675, "italic": 0.0, "skew": 0.0},
	  "8865": {"depth": 0.0, "height": 0.675, "italic": 0.0, "skew": 0.0},
	  "8872": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8873": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8874": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8876": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "8877": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "8878": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "8879": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "8882": {"depth": 0.03517, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8883": {"depth": 0.03517, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8884": {"depth": 0.13667, "height": 0.63667, "italic": 0.0, "skew": 0.0},
	  "8885": {"depth": 0.13667, "height": 0.63667, "italic": 0.0, "skew": 0.0},
	  "8888": {"depth": 0.0, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8890": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "8891": {"depth": 0.19444, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8892": {"depth": 0.19444, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8901": {"depth": 0.0, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8903": {"depth": 0.08167, "height": 0.58167, "italic": 0.0, "skew": 0.0},
	  "8905": {"depth": 0.08167, "height": 0.58167, "italic": 0.0, "skew": 0.0},
	  "8906": {"depth": 0.08167, "height": 0.58167, "italic": 0.0, "skew": 0.0},
	  "8907": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8908": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8909": {"depth": -0.03598, "height": 0.46402, "italic": 0.0, "skew": 0.0},
	  "8910": {"depth": 0.0, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8911": {"depth": 0.0, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8912": {"depth": 0.03517, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8913": {"depth": 0.03517, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8914": {"depth": 0.0, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8915": {"depth": 0.0, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8916": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8918": {"depth": 0.0391, "height": 0.5391, "italic": 0.0, "skew": 0.0},
	  "8919": {"depth": 0.0391, "height": 0.5391, "italic": 0.0, "skew": 0.0},
	  "8920": {"depth": 0.03517, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8921": {"depth": 0.03517, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "8922": {"depth": 0.38569, "height": 0.88569, "italic": 0.0, "skew": 0.0},
	  "8923": {"depth": 0.38569, "height": 0.88569, "italic": 0.0, "skew": 0.0},
	  "8926": {"depth": 0.13667, "height": 0.63667, "italic": 0.0, "skew": 0.0},
	  "8927": {"depth": 0.13667, "height": 0.63667, "italic": 0.0, "skew": 0.0},
	  "8928": {"depth": 0.30274, "height": 0.79383, "italic": 0.0, "skew": 0.0},
	  "8929": {"depth": 0.30274, "height": 0.79383, "italic": 0.0, "skew": 0.0},
	  "8934": {"depth": 0.23222, "height": 0.74111, "italic": 0.0, "skew": 0.0},
	  "8935": {"depth": 0.23222, "height": 0.74111, "italic": 0.0, "skew": 0.0},
	  "8936": {"depth": 0.23222, "height": 0.74111, "italic": 0.0, "skew": 0.0},
	  "8937": {"depth": 0.23222, "height": 0.74111, "italic": 0.0, "skew": 0.0},
	  "8938": {"depth": 0.20576, "height": 0.70576, "italic": 0.0, "skew": 0.0},
	  "8939": {"depth": 0.20576, "height": 0.70576, "italic": 0.0, "skew": 0.0},
	  "8940": {"depth": 0.30274, "height": 0.79383, "italic": 0.0, "skew": 0.0},
	  "8941": {"depth": 0.30274, "height": 0.79383, "italic": 0.0, "skew": 0.0},
	  "8994": {"depth": 0.19444, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8995": {"depth": 0.19444, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "9416": {"depth": 0.15559, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "9484": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "9488": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "9492": {"depth": 0.0, "height": 0.37788, "italic": 0.0, "skew": 0.0},
	  "9496": {"depth": 0.0, "height": 0.37788, "italic": 0.0, "skew": 0.0},
	  "9585": {"depth": 0.19444, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "9586": {"depth": 0.19444, "height": 0.74111, "italic": 0.0, "skew": 0.0},
	  "9632": {"depth": 0.0, "height": 0.675, "italic": 0.0, "skew": 0.0},
	  "9633": {"depth": 0.0, "height": 0.675, "italic": 0.0, "skew": 0.0},
	  "9650": {"depth": 0.0, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "9651": {"depth": 0.0, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "9654": {"depth": 0.03517, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "9660": {"depth": 0.0, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "9661": {"depth": 0.0, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "9664": {"depth": 0.03517, "height": 0.54986, "italic": 0.0, "skew": 0.0},
	  "9674": {"depth": 0.11111, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "9733": {"depth": 0.19444, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "10003": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "10016": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "10731": {"depth": 0.11111, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "10846": {"depth": 0.19444, "height": 0.75583, "italic": 0.0, "skew": 0.0},
	  "10877": {"depth": 0.13667, "height": 0.63667, "italic": 0.0, "skew": 0.0},
	  "10878": {"depth": 0.13667, "height": 0.63667, "italic": 0.0, "skew": 0.0},
	  "10885": {"depth": 0.25583, "height": 0.75583, "italic": 0.0, "skew": 0.0},
	  "10886": {"depth": 0.25583, "height": 0.75583, "italic": 0.0, "skew": 0.0},
	  "10887": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0},
	  "10888": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0},
	  "10889": {"depth": 0.26167, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "10890": {"depth": 0.26167, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "10891": {"depth": 0.48256, "height": 0.98256, "italic": 0.0, "skew": 0.0},
	  "10892": {"depth": 0.48256, "height": 0.98256, "italic": 0.0, "skew": 0.0},
	  "10901": {"depth": 0.13667, "height": 0.63667, "italic": 0.0, "skew": 0.0},
	  "10902": {"depth": 0.13667, "height": 0.63667, "italic": 0.0, "skew": 0.0},
	  "10933": {"depth": 0.25142, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "10934": {"depth": 0.25142, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "10935": {"depth": 0.26167, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "10936": {"depth": 0.26167, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "10937": {"depth": 0.26167, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "10938": {"depth": 0.26167, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "10949": {"depth": 0.25583, "height": 0.75583, "italic": 0.0, "skew": 0.0},
	  "10950": {"depth": 0.25583, "height": 0.75583, "italic": 0.0, "skew": 0.0},
	  "10955": {"depth": 0.28481, "height": 0.79383, "italic": 0.0, "skew": 0.0},
	  "10956": {"depth": 0.28481, "height": 0.79383, "italic": 0.0, "skew": 0.0},
	  "57350": {"depth": 0.08167, "height": 0.58167, "italic": 0.0, "skew": 0.0},
	  "57351": {"depth": 0.08167, "height": 0.58167, "italic": 0.0, "skew": 0.0},
	  "57352": {"depth": 0.08167, "height": 0.58167, "italic": 0.0, "skew": 0.0},
	  "57353": {"depth": 0.0, "height": 0.43056, "italic": 0.04028, "skew": 0.0},
	  "57356": {"depth": 0.25142, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "57357": {"depth": 0.25142, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "57358": {"depth": 0.41951, "height": 0.91951, "italic": 0.0, "skew": 0.0},
	  "57359": {"depth": 0.30274, "height": 0.79383, "italic": 0.0, "skew": 0.0},
	  "57360": {"depth": 0.30274, "height": 0.79383, "italic": 0.0, "skew": 0.0},
	  "57361": {"depth": 0.41951, "height": 0.91951, "italic": 0.0, "skew": 0.0},
	  "57366": {"depth": 0.25142, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "57367": {"depth": 0.25142, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "57368": {"depth": 0.25142, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "57369": {"depth": 0.25142, "height": 0.75726, "italic": 0.0, "skew": 0.0},
	  "57370": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0},
	  "57371": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0}
	},
	"Caligraphic-Regular": {
	  "48": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "49": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "50": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "51": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "52": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "53": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "54": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "55": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "56": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "57": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "65": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.19445},
	  "66": {"depth": 0.0, "height": 0.68333, "italic": 0.03041, "skew": 0.13889},
	  "67": {"depth": 0.0, "height": 0.68333, "italic": 0.05834, "skew": 0.13889},
	  "68": {"depth": 0.0, "height": 0.68333, "italic": 0.02778, "skew": 0.08334},
	  "69": {"depth": 0.0, "height": 0.68333, "italic": 0.08944, "skew": 0.11111},
	  "70": {"depth": 0.0, "height": 0.68333, "italic": 0.09931, "skew": 0.11111},
	  "71": {"depth": 0.09722, "height": 0.68333, "italic": 0.0593, "skew": 0.11111},
	  "72": {"depth": 0.0, "height": 0.68333, "italic": 0.00965, "skew": 0.11111},
	  "73": {"depth": 0.0, "height": 0.68333, "italic": 0.07382, "skew": 0.0},
	  "74": {"depth": 0.09722, "height": 0.68333, "italic": 0.18472, "skew": 0.16667},
	  "75": {"depth": 0.0, "height": 0.68333, "italic": 0.01445, "skew": 0.05556},
	  "76": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.13889},
	  "77": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.13889},
	  "78": {"depth": 0.0, "height": 0.68333, "italic": 0.14736, "skew": 0.08334},
	  "79": {"depth": 0.0, "height": 0.68333, "italic": 0.02778, "skew": 0.11111},
	  "80": {"depth": 0.0, "height": 0.68333, "italic": 0.08222, "skew": 0.08334},
	  "81": {"depth": 0.09722, "height": 0.68333, "italic": 0.0, "skew": 0.11111},
	  "82": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.08334},
	  "83": {"depth": 0.0, "height": 0.68333, "italic": 0.075, "skew": 0.13889},
	  "84": {"depth": 0.0, "height": 0.68333, "italic": 0.25417, "skew": 0.0},
	  "85": {"depth": 0.0, "height": 0.68333, "italic": 0.09931, "skew": 0.08334},
	  "86": {"depth": 0.0, "height": 0.68333, "italic": 0.08222, "skew": 0.0},
	  "87": {"depth": 0.0, "height": 0.68333, "italic": 0.08222, "skew": 0.08334},
	  "88": {"depth": 0.0, "height": 0.68333, "italic": 0.14643, "skew": 0.13889},
	  "89": {"depth": 0.09722, "height": 0.68333, "italic": 0.08222, "skew": 0.08334},
	  "90": {"depth": 0.0, "height": 0.68333, "italic": 0.07944, "skew": 0.13889}
	},
	"Fraktur-Regular": {
	  "33": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "34": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "38": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "39": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "40": {"depth": 0.24982, "height": 0.74947, "italic": 0.0, "skew": 0.0},
	  "41": {"depth": 0.24982, "height": 0.74947, "italic": 0.0, "skew": 0.0},
	  "42": {"depth": 0.0, "height": 0.62119, "italic": 0.0, "skew": 0.0},
	  "43": {"depth": 0.08319, "height": 0.58283, "italic": 0.0, "skew": 0.0},
	  "44": {"depth": 0.0, "height": 0.10803, "italic": 0.0, "skew": 0.0},
	  "45": {"depth": 0.08319, "height": 0.58283, "italic": 0.0, "skew": 0.0},
	  "46": {"depth": 0.0, "height": 0.10803, "italic": 0.0, "skew": 0.0},
	  "47": {"depth": 0.24982, "height": 0.74947, "italic": 0.0, "skew": 0.0},
	  "48": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "49": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "50": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "51": {"depth": 0.18906, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "52": {"depth": 0.18906, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "53": {"depth": 0.18906, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "54": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "55": {"depth": 0.18906, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "56": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "57": {"depth": 0.18906, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "58": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "59": {"depth": 0.12604, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "61": {"depth": -0.13099, "height": 0.36866, "italic": 0.0, "skew": 0.0},
	  "63": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "65": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "66": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "67": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "68": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "69": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "70": {"depth": 0.12604, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "71": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "72": {"depth": 0.06302, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "73": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "74": {"depth": 0.12604, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "75": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "76": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "77": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "78": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "79": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "80": {"depth": 0.18906, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "81": {"depth": 0.03781, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "82": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "83": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "84": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "85": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "86": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "87": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "88": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "89": {"depth": 0.18906, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "90": {"depth": 0.12604, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "91": {"depth": 0.24982, "height": 0.74947, "italic": 0.0, "skew": 0.0},
	  "93": {"depth": 0.24982, "height": 0.74947, "italic": 0.0, "skew": 0.0},
	  "94": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "97": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "98": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "99": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "100": {"depth": 0.0, "height": 0.62119, "italic": 0.0, "skew": 0.0},
	  "101": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "102": {"depth": 0.18906, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "103": {"depth": 0.18906, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "104": {"depth": 0.18906, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "105": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "106": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "107": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "108": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "109": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "110": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "111": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "112": {"depth": 0.18906, "height": 0.52396, "italic": 0.0, "skew": 0.0},
	  "113": {"depth": 0.18906, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "114": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "115": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "116": {"depth": 0.0, "height": 0.62119, "italic": 0.0, "skew": 0.0},
	  "117": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "118": {"depth": 0.0, "height": 0.52396, "italic": 0.0, "skew": 0.0},
	  "119": {"depth": 0.0, "height": 0.52396, "italic": 0.0, "skew": 0.0},
	  "120": {"depth": 0.18906, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "121": {"depth": 0.18906, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "122": {"depth": 0.18906, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "8216": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "8217": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "58112": {"depth": 0.0, "height": 0.62119, "italic": 0.0, "skew": 0.0},
	  "58113": {"depth": 0.0, "height": 0.62119, "italic": 0.0, "skew": 0.0},
	  "58114": {"depth": 0.18906, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "58115": {"depth": 0.18906, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "58116": {"depth": 0.18906, "height": 0.47534, "italic": 0.0, "skew": 0.0},
	  "58117": {"depth": 0.0, "height": 0.69141, "italic": 0.0, "skew": 0.0},
	  "58118": {"depth": 0.0, "height": 0.62119, "italic": 0.0, "skew": 0.0},
	  "58119": {"depth": 0.0, "height": 0.47534, "italic": 0.0, "skew": 0.0}
	},
	"Main-Bold": {
	  "33": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "34": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "35": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "36": {"depth": 0.05556, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "37": {"depth": 0.05556, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "38": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "39": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "40": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "41": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "42": {"depth": 0.0, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "43": {"depth": 0.13333, "height": 0.63333, "italic": 0.0, "skew": 0.0},
	  "44": {"depth": 0.19444, "height": 0.15556, "italic": 0.0, "skew": 0.0},
	  "45": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "46": {"depth": 0.0, "height": 0.15556, "italic": 0.0, "skew": 0.0},
	  "47": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "48": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "49": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "50": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "51": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "52": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "53": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "54": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "55": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "56": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "57": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "58": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "59": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "60": {"depth": 0.08556, "height": 0.58556, "italic": 0.0, "skew": 0.0},
	  "61": {"depth": -0.10889, "height": 0.39111, "italic": 0.0, "skew": 0.0},
	  "62": {"depth": 0.08556, "height": 0.58556, "italic": 0.0, "skew": 0.0},
	  "63": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "64": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "65": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "66": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "67": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "68": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "69": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "70": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "71": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "72": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "73": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "74": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "75": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "76": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "77": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "78": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "79": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "80": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "81": {"depth": 0.19444, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "82": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "83": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "84": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "85": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "86": {"depth": 0.0, "height": 0.68611, "italic": 0.01597, "skew": 0.0},
	  "87": {"depth": 0.0, "height": 0.68611, "italic": 0.01597, "skew": 0.0},
	  "88": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "89": {"depth": 0.0, "height": 0.68611, "italic": 0.02875, "skew": 0.0},
	  "90": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "91": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "92": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "93": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "94": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "95": {"depth": 0.31, "height": 0.13444, "italic": 0.03194, "skew": 0.0},
	  "96": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "97": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "98": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "99": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "100": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "101": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "102": {"depth": 0.0, "height": 0.69444, "italic": 0.10903, "skew": 0.0},
	  "103": {"depth": 0.19444, "height": 0.44444, "italic": 0.01597, "skew": 0.0},
	  "104": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "105": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "106": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "107": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "108": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "109": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "110": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "111": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "112": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "113": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "114": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "115": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "116": {"depth": 0.0, "height": 0.63492, "italic": 0.0, "skew": 0.0},
	  "117": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "118": {"depth": 0.0, "height": 0.44444, "italic": 0.01597, "skew": 0.0},
	  "119": {"depth": 0.0, "height": 0.44444, "italic": 0.01597, "skew": 0.0},
	  "120": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "121": {"depth": 0.19444, "height": 0.44444, "italic": 0.01597, "skew": 0.0},
	  "122": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "123": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "124": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "125": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "126": {"depth": 0.35, "height": 0.34444, "italic": 0.0, "skew": 0.0},
	  "168": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "172": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "175": {"depth": 0.0, "height": 0.59611, "italic": 0.0, "skew": 0.0},
	  "176": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "177": {"depth": 0.13333, "height": 0.63333, "italic": 0.0, "skew": 0.0},
	  "180": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "215": {"depth": 0.13333, "height": 0.63333, "italic": 0.0, "skew": 0.0},
	  "247": {"depth": 0.13333, "height": 0.63333, "italic": 0.0, "skew": 0.0},
	  "305": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "567": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "710": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "711": {"depth": 0.0, "height": 0.63194, "italic": 0.0, "skew": 0.0},
	  "713": {"depth": 0.0, "height": 0.59611, "italic": 0.0, "skew": 0.0},
	  "714": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "715": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "728": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "729": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "730": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "732": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "768": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "769": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "770": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "771": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "772": {"depth": 0.0, "height": 0.59611, "italic": 0.0, "skew": 0.0},
	  "774": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "775": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "776": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "778": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "779": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "780": {"depth": 0.0, "height": 0.63194, "italic": 0.0, "skew": 0.0},
	  "824": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "915": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "916": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "920": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "923": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "926": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "928": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "931": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "933": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "934": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "936": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "937": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "8211": {"depth": 0.0, "height": 0.44444, "italic": 0.03194, "skew": 0.0},
	  "8212": {"depth": 0.0, "height": 0.44444, "italic": 0.03194, "skew": 0.0},
	  "8216": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8217": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8220": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8221": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8224": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8225": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8242": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8407": {"depth": 0.0, "height": 0.72444, "italic": 0.15486, "skew": 0.0},
	  "8463": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8465": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8467": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8472": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "8476": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8501": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8592": {"depth": -0.10889, "height": 0.39111, "italic": 0.0, "skew": 0.0},
	  "8593": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8594": {"depth": -0.10889, "height": 0.39111, "italic": 0.0, "skew": 0.0},
	  "8595": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8596": {"depth": -0.10889, "height": 0.39111, "italic": 0.0, "skew": 0.0},
	  "8597": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8598": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8599": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8600": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8601": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8636": {"depth": -0.10889, "height": 0.39111, "italic": 0.0, "skew": 0.0},
	  "8637": {"depth": -0.10889, "height": 0.39111, "italic": 0.0, "skew": 0.0},
	  "8640": {"depth": -0.10889, "height": 0.39111, "italic": 0.0, "skew": 0.0},
	  "8641": {"depth": -0.10889, "height": 0.39111, "italic": 0.0, "skew": 0.0},
	  "8656": {"depth": -0.10889, "height": 0.39111, "italic": 0.0, "skew": 0.0},
	  "8657": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8658": {"depth": -0.10889, "height": 0.39111, "italic": 0.0, "skew": 0.0},
	  "8659": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8660": {"depth": -0.10889, "height": 0.39111, "italic": 0.0, "skew": 0.0},
	  "8661": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8704": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8706": {"depth": 0.0, "height": 0.69444, "italic": 0.06389, "skew": 0.0},
	  "8707": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8709": {"depth": 0.05556, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8711": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "8712": {"depth": 0.08556, "height": 0.58556, "italic": 0.0, "skew": 0.0},
	  "8715": {"depth": 0.08556, "height": 0.58556, "italic": 0.0, "skew": 0.0},
	  "8722": {"depth": 0.13333, "height": 0.63333, "italic": 0.0, "skew": 0.0},
	  "8723": {"depth": 0.13333, "height": 0.63333, "italic": 0.0, "skew": 0.0},
	  "8725": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8726": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8727": {"depth": -0.02778, "height": 0.47222, "italic": 0.0, "skew": 0.0},
	  "8728": {"depth": -0.02639, "height": 0.47361, "italic": 0.0, "skew": 0.0},
	  "8729": {"depth": -0.02639, "height": 0.47361, "italic": 0.0, "skew": 0.0},
	  "8730": {"depth": 0.18, "height": 0.82, "italic": 0.0, "skew": 0.0},
	  "8733": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "8734": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "8736": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8739": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8741": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8743": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8744": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8745": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8746": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8747": {"depth": 0.19444, "height": 0.69444, "italic": 0.12778, "skew": 0.0},
	  "8764": {"depth": -0.10889, "height": 0.39111, "italic": 0.0, "skew": 0.0},
	  "8768": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8771": {"depth": 0.00222, "height": 0.50222, "italic": 0.0, "skew": 0.0},
	  "8776": {"depth": 0.02444, "height": 0.52444, "italic": 0.0, "skew": 0.0},
	  "8781": {"depth": 0.00222, "height": 0.50222, "italic": 0.0, "skew": 0.0},
	  "8801": {"depth": 0.00222, "height": 0.50222, "italic": 0.0, "skew": 0.0},
	  "8804": {"depth": 0.19667, "height": 0.69667, "italic": 0.0, "skew": 0.0},
	  "8805": {"depth": 0.19667, "height": 0.69667, "italic": 0.0, "skew": 0.0},
	  "8810": {"depth": 0.08556, "height": 0.58556, "italic": 0.0, "skew": 0.0},
	  "8811": {"depth": 0.08556, "height": 0.58556, "italic": 0.0, "skew": 0.0},
	  "8826": {"depth": 0.08556, "height": 0.58556, "italic": 0.0, "skew": 0.0},
	  "8827": {"depth": 0.08556, "height": 0.58556, "italic": 0.0, "skew": 0.0},
	  "8834": {"depth": 0.08556, "height": 0.58556, "italic": 0.0, "skew": 0.0},
	  "8835": {"depth": 0.08556, "height": 0.58556, "italic": 0.0, "skew": 0.0},
	  "8838": {"depth": 0.19667, "height": 0.69667, "italic": 0.0, "skew": 0.0},
	  "8839": {"depth": 0.19667, "height": 0.69667, "italic": 0.0, "skew": 0.0},
	  "8846": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8849": {"depth": 0.19667, "height": 0.69667, "italic": 0.0, "skew": 0.0},
	  "8850": {"depth": 0.19667, "height": 0.69667, "italic": 0.0, "skew": 0.0},
	  "8851": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8852": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8853": {"depth": 0.13333, "height": 0.63333, "italic": 0.0, "skew": 0.0},
	  "8854": {"depth": 0.13333, "height": 0.63333, "italic": 0.0, "skew": 0.0},
	  "8855": {"depth": 0.13333, "height": 0.63333, "italic": 0.0, "skew": 0.0},
	  "8856": {"depth": 0.13333, "height": 0.63333, "italic": 0.0, "skew": 0.0},
	  "8857": {"depth": 0.13333, "height": 0.63333, "italic": 0.0, "skew": 0.0},
	  "8866": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8867": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8868": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8869": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8900": {"depth": -0.02639, "height": 0.47361, "italic": 0.0, "skew": 0.0},
	  "8901": {"depth": -0.02639, "height": 0.47361, "italic": 0.0, "skew": 0.0},
	  "8902": {"depth": -0.02778, "height": 0.47222, "italic": 0.0, "skew": 0.0},
	  "8968": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8969": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8970": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8971": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8994": {"depth": -0.13889, "height": 0.36111, "italic": 0.0, "skew": 0.0},
	  "8995": {"depth": -0.13889, "height": 0.36111, "italic": 0.0, "skew": 0.0},
	  "9651": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9657": {"depth": -0.02778, "height": 0.47222, "italic": 0.0, "skew": 0.0},
	  "9661": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9667": {"depth": -0.02778, "height": 0.47222, "italic": 0.0, "skew": 0.0},
	  "9711": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9824": {"depth": 0.12963, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9825": {"depth": 0.12963, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9826": {"depth": 0.12963, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9827": {"depth": 0.12963, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9837": {"depth": 0.0, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "9838": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9839": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "10216": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "10217": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "10815": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "10927": {"depth": 0.19667, "height": 0.69667, "italic": 0.0, "skew": 0.0},
	  "10928": {"depth": 0.19667, "height": 0.69667, "italic": 0.0, "skew": 0.0}
	},
	"Main-Italic": {
	  "33": {"depth": 0.0, "height": 0.69444, "italic": 0.12417, "skew": 0.0},
	  "34": {"depth": 0.0, "height": 0.69444, "italic": 0.06961, "skew": 0.0},
	  "35": {"depth": 0.19444, "height": 0.69444, "italic": 0.06616, "skew": 0.0},
	  "37": {"depth": 0.05556, "height": 0.75, "italic": 0.13639, "skew": 0.0},
	  "38": {"depth": 0.0, "height": 0.69444, "italic": 0.09694, "skew": 0.0},
	  "39": {"depth": 0.0, "height": 0.69444, "italic": 0.12417, "skew": 0.0},
	  "40": {"depth": 0.25, "height": 0.75, "italic": 0.16194, "skew": 0.0},
	  "41": {"depth": 0.25, "height": 0.75, "italic": 0.03694, "skew": 0.0},
	  "42": {"depth": 0.0, "height": 0.75, "italic": 0.14917, "skew": 0.0},
	  "43": {"depth": 0.05667, "height": 0.56167, "italic": 0.03694, "skew": 0.0},
	  "44": {"depth": 0.19444, "height": 0.10556, "italic": 0.0, "skew": 0.0},
	  "45": {"depth": 0.0, "height": 0.43056, "italic": 0.02826, "skew": 0.0},
	  "46": {"depth": 0.0, "height": 0.10556, "italic": 0.0, "skew": 0.0},
	  "47": {"depth": 0.25, "height": 0.75, "italic": 0.16194, "skew": 0.0},
	  "48": {"depth": 0.0, "height": 0.64444, "italic": 0.13556, "skew": 0.0},
	  "49": {"depth": 0.0, "height": 0.64444, "italic": 0.13556, "skew": 0.0},
	  "50": {"depth": 0.0, "height": 0.64444, "italic": 0.13556, "skew": 0.0},
	  "51": {"depth": 0.0, "height": 0.64444, "italic": 0.13556, "skew": 0.0},
	  "52": {"depth": 0.19444, "height": 0.64444, "italic": 0.13556, "skew": 0.0},
	  "53": {"depth": 0.0, "height": 0.64444, "italic": 0.13556, "skew": 0.0},
	  "54": {"depth": 0.0, "height": 0.64444, "italic": 0.13556, "skew": 0.0},
	  "55": {"depth": 0.19444, "height": 0.64444, "italic": 0.13556, "skew": 0.0},
	  "56": {"depth": 0.0, "height": 0.64444, "italic": 0.13556, "skew": 0.0},
	  "57": {"depth": 0.0, "height": 0.64444, "italic": 0.13556, "skew": 0.0},
	  "58": {"depth": 0.0, "height": 0.43056, "italic": 0.0582, "skew": 0.0},
	  "59": {"depth": 0.19444, "height": 0.43056, "italic": 0.0582, "skew": 0.0},
	  "61": {"depth": -0.13313, "height": 0.36687, "italic": 0.06616, "skew": 0.0},
	  "63": {"depth": 0.0, "height": 0.69444, "italic": 0.1225, "skew": 0.0},
	  "64": {"depth": 0.0, "height": 0.69444, "italic": 0.09597, "skew": 0.0},
	  "65": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "66": {"depth": 0.0, "height": 0.68333, "italic": 0.10257, "skew": 0.0},
	  "67": {"depth": 0.0, "height": 0.68333, "italic": 0.14528, "skew": 0.0},
	  "68": {"depth": 0.0, "height": 0.68333, "italic": 0.09403, "skew": 0.0},
	  "69": {"depth": 0.0, "height": 0.68333, "italic": 0.12028, "skew": 0.0},
	  "70": {"depth": 0.0, "height": 0.68333, "italic": 0.13305, "skew": 0.0},
	  "71": {"depth": 0.0, "height": 0.68333, "italic": 0.08722, "skew": 0.0},
	  "72": {"depth": 0.0, "height": 0.68333, "italic": 0.16389, "skew": 0.0},
	  "73": {"depth": 0.0, "height": 0.68333, "italic": 0.15806, "skew": 0.0},
	  "74": {"depth": 0.0, "height": 0.68333, "italic": 0.14028, "skew": 0.0},
	  "75": {"depth": 0.0, "height": 0.68333, "italic": 0.14528, "skew": 0.0},
	  "76": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "77": {"depth": 0.0, "height": 0.68333, "italic": 0.16389, "skew": 0.0},
	  "78": {"depth": 0.0, "height": 0.68333, "italic": 0.16389, "skew": 0.0},
	  "79": {"depth": 0.0, "height": 0.68333, "italic": 0.09403, "skew": 0.0},
	  "80": {"depth": 0.0, "height": 0.68333, "italic": 0.10257, "skew": 0.0},
	  "81": {"depth": 0.19444, "height": 0.68333, "italic": 0.09403, "skew": 0.0},
	  "82": {"depth": 0.0, "height": 0.68333, "italic": 0.03868, "skew": 0.0},
	  "83": {"depth": 0.0, "height": 0.68333, "italic": 0.11972, "skew": 0.0},
	  "84": {"depth": 0.0, "height": 0.68333, "italic": 0.13305, "skew": 0.0},
	  "85": {"depth": 0.0, "height": 0.68333, "italic": 0.16389, "skew": 0.0},
	  "86": {"depth": 0.0, "height": 0.68333, "italic": 0.18361, "skew": 0.0},
	  "87": {"depth": 0.0, "height": 0.68333, "italic": 0.18361, "skew": 0.0},
	  "88": {"depth": 0.0, "height": 0.68333, "italic": 0.15806, "skew": 0.0},
	  "89": {"depth": 0.0, "height": 0.68333, "italic": 0.19383, "skew": 0.0},
	  "90": {"depth": 0.0, "height": 0.68333, "italic": 0.14528, "skew": 0.0},
	  "91": {"depth": 0.25, "height": 0.75, "italic": 0.1875, "skew": 0.0},
	  "93": {"depth": 0.25, "height": 0.75, "italic": 0.10528, "skew": 0.0},
	  "94": {"depth": 0.0, "height": 0.69444, "italic": 0.06646, "skew": 0.0},
	  "95": {"depth": 0.31, "height": 0.12056, "italic": 0.09208, "skew": 0.0},
	  "97": {"depth": 0.0, "height": 0.43056, "italic": 0.07671, "skew": 0.0},
	  "98": {"depth": 0.0, "height": 0.69444, "italic": 0.06312, "skew": 0.0},
	  "99": {"depth": 0.0, "height": 0.43056, "italic": 0.05653, "skew": 0.0},
	  "100": {"depth": 0.0, "height": 0.69444, "italic": 0.10333, "skew": 0.0},
	  "101": {"depth": 0.0, "height": 0.43056, "italic": 0.07514, "skew": 0.0},
	  "102": {"depth": 0.19444, "height": 0.69444, "italic": 0.21194, "skew": 0.0},
	  "103": {"depth": 0.19444, "height": 0.43056, "italic": 0.08847, "skew": 0.0},
	  "104": {"depth": 0.0, "height": 0.69444, "italic": 0.07671, "skew": 0.0},
	  "105": {"depth": 0.0, "height": 0.65536, "italic": 0.1019, "skew": 0.0},
	  "106": {"depth": 0.19444, "height": 0.65536, "italic": 0.14467, "skew": 0.0},
	  "107": {"depth": 0.0, "height": 0.69444, "italic": 0.10764, "skew": 0.0},
	  "108": {"depth": 0.0, "height": 0.69444, "italic": 0.10333, "skew": 0.0},
	  "109": {"depth": 0.0, "height": 0.43056, "italic": 0.07671, "skew": 0.0},
	  "110": {"depth": 0.0, "height": 0.43056, "italic": 0.07671, "skew": 0.0},
	  "111": {"depth": 0.0, "height": 0.43056, "italic": 0.06312, "skew": 0.0},
	  "112": {"depth": 0.19444, "height": 0.43056, "italic": 0.06312, "skew": 0.0},
	  "113": {"depth": 0.19444, "height": 0.43056, "italic": 0.08847, "skew": 0.0},
	  "114": {"depth": 0.0, "height": 0.43056, "italic": 0.10764, "skew": 0.0},
	  "115": {"depth": 0.0, "height": 0.43056, "italic": 0.08208, "skew": 0.0},
	  "116": {"depth": 0.0, "height": 0.61508, "italic": 0.09486, "skew": 0.0},
	  "117": {"depth": 0.0, "height": 0.43056, "italic": 0.07671, "skew": 0.0},
	  "118": {"depth": 0.0, "height": 0.43056, "italic": 0.10764, "skew": 0.0},
	  "119": {"depth": 0.0, "height": 0.43056, "italic": 0.10764, "skew": 0.0},
	  "120": {"depth": 0.0, "height": 0.43056, "italic": 0.12042, "skew": 0.0},
	  "121": {"depth": 0.19444, "height": 0.43056, "italic": 0.08847, "skew": 0.0},
	  "122": {"depth": 0.0, "height": 0.43056, "italic": 0.12292, "skew": 0.0},
	  "126": {"depth": 0.35, "height": 0.31786, "italic": 0.11585, "skew": 0.0},
	  "163": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "305": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.02778},
	  "567": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.08334},
	  "768": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "769": {"depth": 0.0, "height": 0.69444, "italic": 0.09694, "skew": 0.0},
	  "770": {"depth": 0.0, "height": 0.69444, "italic": 0.06646, "skew": 0.0},
	  "771": {"depth": 0.0, "height": 0.66786, "italic": 0.11585, "skew": 0.0},
	  "772": {"depth": 0.0, "height": 0.56167, "italic": 0.10333, "skew": 0.0},
	  "774": {"depth": 0.0, "height": 0.69444, "italic": 0.10806, "skew": 0.0},
	  "775": {"depth": 0.0, "height": 0.66786, "italic": 0.11752, "skew": 0.0},
	  "776": {"depth": 0.0, "height": 0.66786, "italic": 0.10474, "skew": 0.0},
	  "778": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "779": {"depth": 0.0, "height": 0.69444, "italic": 0.1225, "skew": 0.0},
	  "780": {"depth": 0.0, "height": 0.62847, "italic": 0.08295, "skew": 0.0},
	  "915": {"depth": 0.0, "height": 0.68333, "italic": 0.13305, "skew": 0.0},
	  "916": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "920": {"depth": 0.0, "height": 0.68333, "italic": 0.09403, "skew": 0.0},
	  "923": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "926": {"depth": 0.0, "height": 0.68333, "italic": 0.15294, "skew": 0.0},
	  "928": {"depth": 0.0, "height": 0.68333, "italic": 0.16389, "skew": 0.0},
	  "931": {"depth": 0.0, "height": 0.68333, "italic": 0.12028, "skew": 0.0},
	  "933": {"depth": 0.0, "height": 0.68333, "italic": 0.11111, "skew": 0.0},
	  "934": {"depth": 0.0, "height": 0.68333, "italic": 0.05986, "skew": 0.0},
	  "936": {"depth": 0.0, "height": 0.68333, "italic": 0.11111, "skew": 0.0},
	  "937": {"depth": 0.0, "height": 0.68333, "italic": 0.10257, "skew": 0.0},
	  "8211": {"depth": 0.0, "height": 0.43056, "italic": 0.09208, "skew": 0.0},
	  "8212": {"depth": 0.0, "height": 0.43056, "italic": 0.09208, "skew": 0.0},
	  "8216": {"depth": 0.0, "height": 0.69444, "italic": 0.12417, "skew": 0.0},
	  "8217": {"depth": 0.0, "height": 0.69444, "italic": 0.12417, "skew": 0.0},
	  "8220": {"depth": 0.0, "height": 0.69444, "italic": 0.1685, "skew": 0.0},
	  "8221": {"depth": 0.0, "height": 0.69444, "italic": 0.06961, "skew": 0.0},
	  "8463": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0}
	},
	"Main-Regular": {
	  "32": {"depth": 0.0, "height": 0.0, "italic": 0, "skew": 0},
	  "33": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "34": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "35": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "36": {"depth": 0.05556, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "37": {"depth": 0.05556, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "38": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "39": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "40": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "41": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "42": {"depth": 0.0, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "43": {"depth": 0.08333, "height": 0.58333, "italic": 0.0, "skew": 0.0},
	  "44": {"depth": 0.19444, "height": 0.10556, "italic": 0.0, "skew": 0.0},
	  "45": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "46": {"depth": 0.0, "height": 0.10556, "italic": 0.0, "skew": 0.0},
	  "47": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "48": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "49": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "50": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "51": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "52": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "53": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "54": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "55": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "56": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "57": {"depth": 0.0, "height": 0.64444, "italic": 0.0, "skew": 0.0},
	  "58": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "59": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "60": {"depth": 0.0391, "height": 0.5391, "italic": 0.0, "skew": 0.0},
	  "61": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "62": {"depth": 0.0391, "height": 0.5391, "italic": 0.0, "skew": 0.0},
	  "63": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "64": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "65": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "66": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "67": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "68": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "69": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "70": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "71": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "72": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "73": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "74": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "75": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "76": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "77": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "78": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "79": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "80": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "81": {"depth": 0.19444, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "82": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "83": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "84": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "85": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "86": {"depth": 0.0, "height": 0.68333, "italic": 0.01389, "skew": 0.0},
	  "87": {"depth": 0.0, "height": 0.68333, "italic": 0.01389, "skew": 0.0},
	  "88": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "89": {"depth": 0.0, "height": 0.68333, "italic": 0.025, "skew": 0.0},
	  "90": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "91": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "92": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "93": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "94": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "95": {"depth": 0.31, "height": 0.12056, "italic": 0.02778, "skew": 0.0},
	  "96": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "97": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "98": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "99": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "100": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "101": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "102": {"depth": 0.0, "height": 0.69444, "italic": 0.07778, "skew": 0.0},
	  "103": {"depth": 0.19444, "height": 0.43056, "italic": 0.01389, "skew": 0.0},
	  "104": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "105": {"depth": 0.0, "height": 0.66786, "italic": 0.0, "skew": 0.0},
	  "106": {"depth": 0.19444, "height": 0.66786, "italic": 0.0, "skew": 0.0},
	  "107": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "108": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "109": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "110": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "111": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "112": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "113": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "114": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "115": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "116": {"depth": 0.0, "height": 0.61508, "italic": 0.0, "skew": 0.0},
	  "117": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "118": {"depth": 0.0, "height": 0.43056, "italic": 0.01389, "skew": 0.0},
	  "119": {"depth": 0.0, "height": 0.43056, "italic": 0.01389, "skew": 0.0},
	  "120": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "121": {"depth": 0.19444, "height": 0.43056, "italic": 0.01389, "skew": 0.0},
	  "122": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "123": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "124": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "125": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "126": {"depth": 0.35, "height": 0.31786, "italic": 0.0, "skew": 0.0},
	  "160": {"depth": 0.0, "height": 0.0, "italic": 0, "skew": 0},
	  "168": {"depth": 0.0, "height": 0.66786, "italic": 0.0, "skew": 0.0},
	  "172": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "175": {"depth": 0.0, "height": 0.56778, "italic": 0.0, "skew": 0.0},
	  "176": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "177": {"depth": 0.08333, "height": 0.58333, "italic": 0.0, "skew": 0.0},
	  "180": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "215": {"depth": 0.08333, "height": 0.58333, "italic": 0.0, "skew": 0.0},
	  "247": {"depth": 0.08333, "height": 0.58333, "italic": 0.0, "skew": 0.0},
	  "305": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "567": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "710": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "711": {"depth": 0.0, "height": 0.62847, "italic": 0.0, "skew": 0.0},
	  "713": {"depth": 0.0, "height": 0.56778, "italic": 0.0, "skew": 0.0},
	  "714": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "715": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "728": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "729": {"depth": 0.0, "height": 0.66786, "italic": 0.0, "skew": 0.0},
	  "730": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "732": {"depth": 0.0, "height": 0.66786, "italic": 0.0, "skew": 0.0},
	  "768": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "769": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "770": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "771": {"depth": 0.0, "height": 0.66786, "italic": 0.0, "skew": 0.0},
	  "772": {"depth": 0.0, "height": 0.56778, "italic": 0.0, "skew": 0.0},
	  "774": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "775": {"depth": 0.0, "height": 0.66786, "italic": 0.0, "skew": 0.0},
	  "776": {"depth": 0.0, "height": 0.66786, "italic": 0.0, "skew": 0.0},
	  "778": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "779": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "780": {"depth": 0.0, "height": 0.62847, "italic": 0.0, "skew": 0.0},
	  "824": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "915": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "916": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "920": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "923": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "926": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "928": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "931": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "933": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "934": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "936": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "937": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "8211": {"depth": 0.0, "height": 0.43056, "italic": 0.02778, "skew": 0.0},
	  "8212": {"depth": 0.0, "height": 0.43056, "italic": 0.02778, "skew": 0.0},
	  "8216": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8217": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8220": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8221": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8224": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8225": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8230": {"depth": 0.0, "height": 0.12, "italic": 0, "skew": 0},
	  "8242": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8407": {"depth": 0.0, "height": 0.71444, "italic": 0.15382, "skew": 0.0},
	  "8463": {"depth": 0.0, "height": 0.68889, "italic": 0.0, "skew": 0.0},
	  "8465": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8467": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.11111},
	  "8472": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.11111},
	  "8476": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8501": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8592": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8593": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8594": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8595": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8596": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8597": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8598": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8599": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8600": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8601": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8614": {"depth": 0.011, "height": 0.511, "italic": 0, "skew": 0},
	  "8617": {"depth": 0.011, "height": 0.511, "italic": 0, "skew": 0},
	  "8618": {"depth": 0.011, "height": 0.511, "italic": 0, "skew": 0},
	  "8636": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8637": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8640": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8641": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8652": {"depth": 0.011, "height": 0.671, "italic": 0, "skew": 0},
	  "8656": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8657": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8658": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8659": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8660": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8661": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8704": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8706": {"depth": 0.0, "height": 0.69444, "italic": 0.05556, "skew": 0.08334},
	  "8707": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8709": {"depth": 0.05556, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8711": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "8712": {"depth": 0.0391, "height": 0.5391, "italic": 0.0, "skew": 0.0},
	  "8715": {"depth": 0.0391, "height": 0.5391, "italic": 0.0, "skew": 0.0},
	  "8722": {"depth": 0.08333, "height": 0.58333, "italic": 0.0, "skew": 0.0},
	  "8723": {"depth": 0.08333, "height": 0.58333, "italic": 0.0, "skew": 0.0},
	  "8725": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8726": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8727": {"depth": -0.03472, "height": 0.46528, "italic": 0.0, "skew": 0.0},
	  "8728": {"depth": -0.05555, "height": 0.44445, "italic": 0.0, "skew": 0.0},
	  "8729": {"depth": -0.05555, "height": 0.44445, "italic": 0.0, "skew": 0.0},
	  "8730": {"depth": 0.2, "height": 0.8, "italic": 0.0, "skew": 0.0},
	  "8733": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "8734": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "8736": {"depth": 0.0, "height": 0.69224, "italic": 0.0, "skew": 0.0},
	  "8739": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8741": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8743": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8744": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8745": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8746": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8747": {"depth": 0.19444, "height": 0.69444, "italic": 0.11111, "skew": 0.0},
	  "8764": {"depth": -0.13313, "height": 0.36687, "italic": 0.0, "skew": 0.0},
	  "8768": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8771": {"depth": -0.03625, "height": 0.46375, "italic": 0.0, "skew": 0.0},
	  "8773": {"depth": -0.022, "height": 0.589, "italic": 0, "skew": 0},
	  "8776": {"depth": -0.01688, "height": 0.48312, "italic": 0.0, "skew": 0.0},
	  "8781": {"depth": -0.03625, "height": 0.46375, "italic": 0.0, "skew": 0.0},
	  "8784": {"depth": -0.133, "height": 0.67, "italic": 0, "skew": 0},
	  "8800": {"depth": 0.215, "height": 0.716, "italic": 0, "skew": 0},
	  "8801": {"depth": -0.03625, "height": 0.46375, "italic": 0.0, "skew": 0.0},
	  "8804": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0},
	  "8805": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0},
	  "8810": {"depth": 0.0391, "height": 0.5391, "italic": 0.0, "skew": 0.0},
	  "8811": {"depth": 0.0391, "height": 0.5391, "italic": 0.0, "skew": 0.0},
	  "8826": {"depth": 0.0391, "height": 0.5391, "italic": 0.0, "skew": 0.0},
	  "8827": {"depth": 0.0391, "height": 0.5391, "italic": 0.0, "skew": 0.0},
	  "8834": {"depth": 0.0391, "height": 0.5391, "italic": 0.0, "skew": 0.0},
	  "8835": {"depth": 0.0391, "height": 0.5391, "italic": 0.0, "skew": 0.0},
	  "8838": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0},
	  "8839": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0},
	  "8846": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8849": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0},
	  "8850": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0},
	  "8851": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8852": {"depth": 0.0, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "8853": {"depth": 0.08333, "height": 0.58333, "italic": 0.0, "skew": 0.0},
	  "8854": {"depth": 0.08333, "height": 0.58333, "italic": 0.0, "skew": 0.0},
	  "8855": {"depth": 0.08333, "height": 0.58333, "italic": 0.0, "skew": 0.0},
	  "8856": {"depth": 0.08333, "height": 0.58333, "italic": 0.0, "skew": 0.0},
	  "8857": {"depth": 0.08333, "height": 0.58333, "italic": 0.0, "skew": 0.0},
	  "8866": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8867": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8868": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8869": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8872": {"depth": 0.249, "height": 0.75, "italic": 0, "skew": 0},
	  "8900": {"depth": -0.05555, "height": 0.44445, "italic": 0.0, "skew": 0.0},
	  "8901": {"depth": -0.05555, "height": 0.44445, "italic": 0.0, "skew": 0.0},
	  "8902": {"depth": -0.03472, "height": 0.46528, "italic": 0.0, "skew": 0.0},
	  "8904": {"depth": 0.005, "height": 0.505, "italic": 0, "skew": 0},
	  "8942": {"depth": 0.03, "height": 0.9, "italic": 0, "skew": 0},
	  "8943": {"depth": -0.19, "height": 0.31, "italic": 0, "skew": 0},
	  "8945": {"depth": -0.1, "height": 0.82, "italic": 0, "skew": 0},
	  "8968": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8969": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8970": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8971": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8994": {"depth": -0.14236, "height": 0.35764, "italic": 0.0, "skew": 0.0},
	  "8995": {"depth": -0.14236, "height": 0.35764, "italic": 0.0, "skew": 0.0},
	  "9136": {"depth": 0.244, "height": 0.744, "italic": 0, "skew": 0},
	  "9137": {"depth": 0.244, "height": 0.744, "italic": 0, "skew": 0},
	  "9651": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9657": {"depth": -0.03472, "height": 0.46528, "italic": 0.0, "skew": 0.0},
	  "9661": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9667": {"depth": -0.03472, "height": 0.46528, "italic": 0.0, "skew": 0.0},
	  "9711": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9824": {"depth": 0.12963, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9825": {"depth": 0.12963, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9826": {"depth": 0.12963, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9827": {"depth": 0.12963, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9837": {"depth": 0.0, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "9838": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "9839": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "10216": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "10217": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "10222": {"depth": 0.244, "height": 0.744, "italic": 0, "skew": 0},
	  "10223": {"depth": 0.244, "height": 0.744, "italic": 0, "skew": 0},
	  "10229": {"depth": 0.011, "height": 0.511, "italic": 0, "skew": 0},
	  "10230": {"depth": 0.011, "height": 0.511, "italic": 0, "skew": 0},
	  "10231": {"depth": 0.011, "height": 0.511, "italic": 0, "skew": 0},
	  "10232": {"depth": 0.024, "height": 0.525, "italic": 0, "skew": 0},
	  "10233": {"depth": 0.024, "height": 0.525, "italic": 0, "skew": 0},
	  "10234": {"depth": 0.024, "height": 0.525, "italic": 0, "skew": 0},
	  "10236": {"depth": 0.011, "height": 0.511, "italic": 0, "skew": 0},
	  "10815": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.0},
	  "10927": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0},
	  "10928": {"depth": 0.13597, "height": 0.63597, "italic": 0.0, "skew": 0.0}
	},
	"Math-BoldItalic": {
	  "47": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "65": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "66": {"depth": 0.0, "height": 0.68611, "italic": 0.04835, "skew": 0.0},
	  "67": {"depth": 0.0, "height": 0.68611, "italic": 0.06979, "skew": 0.0},
	  "68": {"depth": 0.0, "height": 0.68611, "italic": 0.03194, "skew": 0.0},
	  "69": {"depth": 0.0, "height": 0.68611, "italic": 0.05451, "skew": 0.0},
	  "70": {"depth": 0.0, "height": 0.68611, "italic": 0.15972, "skew": 0.0},
	  "71": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "72": {"depth": 0.0, "height": 0.68611, "italic": 0.08229, "skew": 0.0},
	  "73": {"depth": 0.0, "height": 0.68611, "italic": 0.07778, "skew": 0.0},
	  "74": {"depth": 0.0, "height": 0.68611, "italic": 0.10069, "skew": 0.0},
	  "75": {"depth": 0.0, "height": 0.68611, "italic": 0.06979, "skew": 0.0},
	  "76": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "77": {"depth": 0.0, "height": 0.68611, "italic": 0.11424, "skew": 0.0},
	  "78": {"depth": 0.0, "height": 0.68611, "italic": 0.11424, "skew": 0.0},
	  "79": {"depth": 0.0, "height": 0.68611, "italic": 0.03194, "skew": 0.0},
	  "80": {"depth": 0.0, "height": 0.68611, "italic": 0.15972, "skew": 0.0},
	  "81": {"depth": 0.19444, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "82": {"depth": 0.0, "height": 0.68611, "italic": 0.00421, "skew": 0.0},
	  "83": {"depth": 0.0, "height": 0.68611, "italic": 0.05382, "skew": 0.0},
	  "84": {"depth": 0.0, "height": 0.68611, "italic": 0.15972, "skew": 0.0},
	  "85": {"depth": 0.0, "height": 0.68611, "italic": 0.11424, "skew": 0.0},
	  "86": {"depth": 0.0, "height": 0.68611, "italic": 0.25555, "skew": 0.0},
	  "87": {"depth": 0.0, "height": 0.68611, "italic": 0.15972, "skew": 0.0},
	  "88": {"depth": 0.0, "height": 0.68611, "italic": 0.07778, "skew": 0.0},
	  "89": {"depth": 0.0, "height": 0.68611, "italic": 0.25555, "skew": 0.0},
	  "90": {"depth": 0.0, "height": 0.68611, "italic": 0.06979, "skew": 0.0},
	  "97": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "98": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "99": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "100": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "101": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "102": {"depth": 0.19444, "height": 0.69444, "italic": 0.11042, "skew": 0.0},
	  "103": {"depth": 0.19444, "height": 0.44444, "italic": 0.03704, "skew": 0.0},
	  "104": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "105": {"depth": 0.0, "height": 0.69326, "italic": 0.0, "skew": 0.0},
	  "106": {"depth": 0.19444, "height": 0.69326, "italic": 0.0622, "skew": 0.0},
	  "107": {"depth": 0.0, "height": 0.69444, "italic": 0.01852, "skew": 0.0},
	  "108": {"depth": 0.0, "height": 0.69444, "italic": 0.0088, "skew": 0.0},
	  "109": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "110": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "111": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "112": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "113": {"depth": 0.19444, "height": 0.44444, "italic": 0.03704, "skew": 0.0},
	  "114": {"depth": 0.0, "height": 0.44444, "italic": 0.03194, "skew": 0.0},
	  "115": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "116": {"depth": 0.0, "height": 0.63492, "italic": 0.0, "skew": 0.0},
	  "117": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "118": {"depth": 0.0, "height": 0.44444, "italic": 0.03704, "skew": 0.0},
	  "119": {"depth": 0.0, "height": 0.44444, "italic": 0.02778, "skew": 0.0},
	  "120": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "121": {"depth": 0.19444, "height": 0.44444, "italic": 0.03704, "skew": 0.0},
	  "122": {"depth": 0.0, "height": 0.44444, "italic": 0.04213, "skew": 0.0},
	  "915": {"depth": 0.0, "height": 0.68611, "italic": 0.15972, "skew": 0.0},
	  "916": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "920": {"depth": 0.0, "height": 0.68611, "italic": 0.03194, "skew": 0.0},
	  "923": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "926": {"depth": 0.0, "height": 0.68611, "italic": 0.07458, "skew": 0.0},
	  "928": {"depth": 0.0, "height": 0.68611, "italic": 0.08229, "skew": 0.0},
	  "931": {"depth": 0.0, "height": 0.68611, "italic": 0.05451, "skew": 0.0},
	  "933": {"depth": 0.0, "height": 0.68611, "italic": 0.15972, "skew": 0.0},
	  "934": {"depth": 0.0, "height": 0.68611, "italic": 0.0, "skew": 0.0},
	  "936": {"depth": 0.0, "height": 0.68611, "italic": 0.11653, "skew": 0.0},
	  "937": {"depth": 0.0, "height": 0.68611, "italic": 0.04835, "skew": 0.0},
	  "945": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "946": {"depth": 0.19444, "height": 0.69444, "italic": 0.03403, "skew": 0.0},
	  "947": {"depth": 0.19444, "height": 0.44444, "italic": 0.06389, "skew": 0.0},
	  "948": {"depth": 0.0, "height": 0.69444, "italic": 0.03819, "skew": 0.0},
	  "949": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "950": {"depth": 0.19444, "height": 0.69444, "italic": 0.06215, "skew": 0.0},
	  "951": {"depth": 0.19444, "height": 0.44444, "italic": 0.03704, "skew": 0.0},
	  "952": {"depth": 0.0, "height": 0.69444, "italic": 0.03194, "skew": 0.0},
	  "953": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "954": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "955": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "956": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "957": {"depth": 0.0, "height": 0.44444, "italic": 0.06898, "skew": 0.0},
	  "958": {"depth": 0.19444, "height": 0.69444, "italic": 0.03021, "skew": 0.0},
	  "959": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "960": {"depth": 0.0, "height": 0.44444, "italic": 0.03704, "skew": 0.0},
	  "961": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "962": {"depth": 0.09722, "height": 0.44444, "italic": 0.07917, "skew": 0.0},
	  "963": {"depth": 0.0, "height": 0.44444, "italic": 0.03704, "skew": 0.0},
	  "964": {"depth": 0.0, "height": 0.44444, "italic": 0.13472, "skew": 0.0},
	  "965": {"depth": 0.0, "height": 0.44444, "italic": 0.03704, "skew": 0.0},
	  "966": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "967": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "968": {"depth": 0.19444, "height": 0.69444, "italic": 0.03704, "skew": 0.0},
	  "969": {"depth": 0.0, "height": 0.44444, "italic": 0.03704, "skew": 0.0},
	  "977": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "981": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "982": {"depth": 0.0, "height": 0.44444, "italic": 0.03194, "skew": 0.0},
	  "1009": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "1013": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0}
	},
	"Math-Italic": {
	  "47": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "65": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.13889},
	  "66": {"depth": 0.0, "height": 0.68333, "italic": 0.05017, "skew": 0.08334},
	  "67": {"depth": 0.0, "height": 0.68333, "italic": 0.07153, "skew": 0.08334},
	  "68": {"depth": 0.0, "height": 0.68333, "italic": 0.02778, "skew": 0.05556},
	  "69": {"depth": 0.0, "height": 0.68333, "italic": 0.05764, "skew": 0.08334},
	  "70": {"depth": 0.0, "height": 0.68333, "italic": 0.13889, "skew": 0.08334},
	  "71": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.08334},
	  "72": {"depth": 0.0, "height": 0.68333, "italic": 0.08125, "skew": 0.05556},
	  "73": {"depth": 0.0, "height": 0.68333, "italic": 0.07847, "skew": 0.11111},
	  "74": {"depth": 0.0, "height": 0.68333, "italic": 0.09618, "skew": 0.16667},
	  "75": {"depth": 0.0, "height": 0.68333, "italic": 0.07153, "skew": 0.05556},
	  "76": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.02778},
	  "77": {"depth": 0.0, "height": 0.68333, "italic": 0.10903, "skew": 0.08334},
	  "78": {"depth": 0.0, "height": 0.68333, "italic": 0.10903, "skew": 0.08334},
	  "79": {"depth": 0.0, "height": 0.68333, "italic": 0.02778, "skew": 0.08334},
	  "80": {"depth": 0.0, "height": 0.68333, "italic": 0.13889, "skew": 0.08334},
	  "81": {"depth": 0.19444, "height": 0.68333, "italic": 0.0, "skew": 0.08334},
	  "82": {"depth": 0.0, "height": 0.68333, "italic": 0.00773, "skew": 0.08334},
	  "83": {"depth": 0.0, "height": 0.68333, "italic": 0.05764, "skew": 0.08334},
	  "84": {"depth": 0.0, "height": 0.68333, "italic": 0.13889, "skew": 0.08334},
	  "85": {"depth": 0.0, "height": 0.68333, "italic": 0.10903, "skew": 0.02778},
	  "86": {"depth": 0.0, "height": 0.68333, "italic": 0.22222, "skew": 0.0},
	  "87": {"depth": 0.0, "height": 0.68333, "italic": 0.13889, "skew": 0.0},
	  "88": {"depth": 0.0, "height": 0.68333, "italic": 0.07847, "skew": 0.08334},
	  "89": {"depth": 0.0, "height": 0.68333, "italic": 0.22222, "skew": 0.0},
	  "90": {"depth": 0.0, "height": 0.68333, "italic": 0.07153, "skew": 0.08334},
	  "97": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "98": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "99": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "100": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.16667},
	  "101": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "102": {"depth": 0.19444, "height": 0.69444, "italic": 0.10764, "skew": 0.16667},
	  "103": {"depth": 0.19444, "height": 0.43056, "italic": 0.03588, "skew": 0.02778},
	  "104": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "105": {"depth": 0.0, "height": 0.65952, "italic": 0.0, "skew": 0.0},
	  "106": {"depth": 0.19444, "height": 0.65952, "italic": 0.05724, "skew": 0.0},
	  "107": {"depth": 0.0, "height": 0.69444, "italic": 0.03148, "skew": 0.0},
	  "108": {"depth": 0.0, "height": 0.69444, "italic": 0.01968, "skew": 0.08334},
	  "109": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "110": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "111": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "112": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.08334},
	  "113": {"depth": 0.19444, "height": 0.43056, "italic": 0.03588, "skew": 0.08334},
	  "114": {"depth": 0.0, "height": 0.43056, "italic": 0.02778, "skew": 0.05556},
	  "115": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "116": {"depth": 0.0, "height": 0.61508, "italic": 0.0, "skew": 0.08334},
	  "117": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.02778},
	  "118": {"depth": 0.0, "height": 0.43056, "italic": 0.03588, "skew": 0.02778},
	  "119": {"depth": 0.0, "height": 0.43056, "italic": 0.02691, "skew": 0.08334},
	  "120": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.02778},
	  "121": {"depth": 0.19444, "height": 0.43056, "italic": 0.03588, "skew": 0.05556},
	  "122": {"depth": 0.0, "height": 0.43056, "italic": 0.04398, "skew": 0.05556},
	  "915": {"depth": 0.0, "height": 0.68333, "italic": 0.13889, "skew": 0.08334},
	  "916": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.16667},
	  "920": {"depth": 0.0, "height": 0.68333, "italic": 0.02778, "skew": 0.08334},
	  "923": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.16667},
	  "926": {"depth": 0.0, "height": 0.68333, "italic": 0.07569, "skew": 0.08334},
	  "928": {"depth": 0.0, "height": 0.68333, "italic": 0.08125, "skew": 0.05556},
	  "931": {"depth": 0.0, "height": 0.68333, "italic": 0.05764, "skew": 0.08334},
	  "933": {"depth": 0.0, "height": 0.68333, "italic": 0.13889, "skew": 0.05556},
	  "934": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.08334},
	  "936": {"depth": 0.0, "height": 0.68333, "italic": 0.11, "skew": 0.05556},
	  "937": {"depth": 0.0, "height": 0.68333, "italic": 0.05017, "skew": 0.08334},
	  "945": {"depth": 0.0, "height": 0.43056, "italic": 0.0037, "skew": 0.02778},
	  "946": {"depth": 0.19444, "height": 0.69444, "italic": 0.05278, "skew": 0.08334},
	  "947": {"depth": 0.19444, "height": 0.43056, "italic": 0.05556, "skew": 0.0},
	  "948": {"depth": 0.0, "height": 0.69444, "italic": 0.03785, "skew": 0.05556},
	  "949": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.08334},
	  "950": {"depth": 0.19444, "height": 0.69444, "italic": 0.07378, "skew": 0.08334},
	  "951": {"depth": 0.19444, "height": 0.43056, "italic": 0.03588, "skew": 0.05556},
	  "952": {"depth": 0.0, "height": 0.69444, "italic": 0.02778, "skew": 0.08334},
	  "953": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "954": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "955": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "956": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.02778},
	  "957": {"depth": 0.0, "height": 0.43056, "italic": 0.06366, "skew": 0.02778},
	  "958": {"depth": 0.19444, "height": 0.69444, "italic": 0.04601, "skew": 0.11111},
	  "959": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "960": {"depth": 0.0, "height": 0.43056, "italic": 0.03588, "skew": 0.0},
	  "961": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.08334},
	  "962": {"depth": 0.09722, "height": 0.43056, "italic": 0.07986, "skew": 0.08334},
	  "963": {"depth": 0.0, "height": 0.43056, "italic": 0.03588, "skew": 0.0},
	  "964": {"depth": 0.0, "height": 0.43056, "italic": 0.1132, "skew": 0.02778},
	  "965": {"depth": 0.0, "height": 0.43056, "italic": 0.03588, "skew": 0.02778},
	  "966": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.08334},
	  "967": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "968": {"depth": 0.19444, "height": 0.69444, "italic": 0.03588, "skew": 0.11111},
	  "969": {"depth": 0.0, "height": 0.43056, "italic": 0.03588, "skew": 0.0},
	  "977": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.08334},
	  "981": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.08334},
	  "982": {"depth": 0.0, "height": 0.43056, "italic": 0.02778, "skew": 0.0},
	  "1009": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.08334},
	  "1013": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556}
	},
	"Math-Regular": {
	  "65": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.13889},
	  "66": {"depth": 0.0, "height": 0.68333, "italic": 0.05017, "skew": 0.08334},
	  "67": {"depth": 0.0, "height": 0.68333, "italic": 0.07153, "skew": 0.08334},
	  "68": {"depth": 0.0, "height": 0.68333, "italic": 0.02778, "skew": 0.05556},
	  "69": {"depth": 0.0, "height": 0.68333, "italic": 0.05764, "skew": 0.08334},
	  "70": {"depth": 0.0, "height": 0.68333, "italic": 0.13889, "skew": 0.08334},
	  "71": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.08334},
	  "72": {"depth": 0.0, "height": 0.68333, "italic": 0.08125, "skew": 0.05556},
	  "73": {"depth": 0.0, "height": 0.68333, "italic": 0.07847, "skew": 0.11111},
	  "74": {"depth": 0.0, "height": 0.68333, "italic": 0.09618, "skew": 0.16667},
	  "75": {"depth": 0.0, "height": 0.68333, "italic": 0.07153, "skew": 0.05556},
	  "76": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.02778},
	  "77": {"depth": 0.0, "height": 0.68333, "italic": 0.10903, "skew": 0.08334},
	  "78": {"depth": 0.0, "height": 0.68333, "italic": 0.10903, "skew": 0.08334},
	  "79": {"depth": 0.0, "height": 0.68333, "italic": 0.02778, "skew": 0.08334},
	  "80": {"depth": 0.0, "height": 0.68333, "italic": 0.13889, "skew": 0.08334},
	  "81": {"depth": 0.19444, "height": 0.68333, "italic": 0.0, "skew": 0.08334},
	  "82": {"depth": 0.0, "height": 0.68333, "italic": 0.00773, "skew": 0.08334},
	  "83": {"depth": 0.0, "height": 0.68333, "italic": 0.05764, "skew": 0.08334},
	  "84": {"depth": 0.0, "height": 0.68333, "italic": 0.13889, "skew": 0.08334},
	  "85": {"depth": 0.0, "height": 0.68333, "italic": 0.10903, "skew": 0.02778},
	  "86": {"depth": 0.0, "height": 0.68333, "italic": 0.22222, "skew": 0.0},
	  "87": {"depth": 0.0, "height": 0.68333, "italic": 0.13889, "skew": 0.0},
	  "88": {"depth": 0.0, "height": 0.68333, "italic": 0.07847, "skew": 0.08334},
	  "89": {"depth": 0.0, "height": 0.68333, "italic": 0.22222, "skew": 0.0},
	  "90": {"depth": 0.0, "height": 0.68333, "italic": 0.07153, "skew": 0.08334},
	  "97": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "98": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "99": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "100": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.16667},
	  "101": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "102": {"depth": 0.19444, "height": 0.69444, "italic": 0.10764, "skew": 0.16667},
	  "103": {"depth": 0.19444, "height": 0.43056, "italic": 0.03588, "skew": 0.02778},
	  "104": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "105": {"depth": 0.0, "height": 0.65952, "italic": 0.0, "skew": 0.0},
	  "106": {"depth": 0.19444, "height": 0.65952, "italic": 0.05724, "skew": 0.0},
	  "107": {"depth": 0.0, "height": 0.69444, "italic": 0.03148, "skew": 0.0},
	  "108": {"depth": 0.0, "height": 0.69444, "italic": 0.01968, "skew": 0.08334},
	  "109": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "110": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "111": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "112": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.08334},
	  "113": {"depth": 0.19444, "height": 0.43056, "italic": 0.03588, "skew": 0.08334},
	  "114": {"depth": 0.0, "height": 0.43056, "italic": 0.02778, "skew": 0.05556},
	  "115": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "116": {"depth": 0.0, "height": 0.61508, "italic": 0.0, "skew": 0.08334},
	  "117": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.02778},
	  "118": {"depth": 0.0, "height": 0.43056, "italic": 0.03588, "skew": 0.02778},
	  "119": {"depth": 0.0, "height": 0.43056, "italic": 0.02691, "skew": 0.08334},
	  "120": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.02778},
	  "121": {"depth": 0.19444, "height": 0.43056, "italic": 0.03588, "skew": 0.05556},
	  "122": {"depth": 0.0, "height": 0.43056, "italic": 0.04398, "skew": 0.05556},
	  "915": {"depth": 0.0, "height": 0.68333, "italic": 0.13889, "skew": 0.08334},
	  "916": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.16667},
	  "920": {"depth": 0.0, "height": 0.68333, "italic": 0.02778, "skew": 0.08334},
	  "923": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.16667},
	  "926": {"depth": 0.0, "height": 0.68333, "italic": 0.07569, "skew": 0.08334},
	  "928": {"depth": 0.0, "height": 0.68333, "italic": 0.08125, "skew": 0.05556},
	  "931": {"depth": 0.0, "height": 0.68333, "italic": 0.05764, "skew": 0.08334},
	  "933": {"depth": 0.0, "height": 0.68333, "italic": 0.13889, "skew": 0.05556},
	  "934": {"depth": 0.0, "height": 0.68333, "italic": 0.0, "skew": 0.08334},
	  "936": {"depth": 0.0, "height": 0.68333, "italic": 0.11, "skew": 0.05556},
	  "937": {"depth": 0.0, "height": 0.68333, "italic": 0.05017, "skew": 0.08334},
	  "945": {"depth": 0.0, "height": 0.43056, "italic": 0.0037, "skew": 0.02778},
	  "946": {"depth": 0.19444, "height": 0.69444, "italic": 0.05278, "skew": 0.08334},
	  "947": {"depth": 0.19444, "height": 0.43056, "italic": 0.05556, "skew": 0.0},
	  "948": {"depth": 0.0, "height": 0.69444, "italic": 0.03785, "skew": 0.05556},
	  "949": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.08334},
	  "950": {"depth": 0.19444, "height": 0.69444, "italic": 0.07378, "skew": 0.08334},
	  "951": {"depth": 0.19444, "height": 0.43056, "italic": 0.03588, "skew": 0.05556},
	  "952": {"depth": 0.0, "height": 0.69444, "italic": 0.02778, "skew": 0.08334},
	  "953": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "954": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "955": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "956": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.02778},
	  "957": {"depth": 0.0, "height": 0.43056, "italic": 0.06366, "skew": 0.02778},
	  "958": {"depth": 0.19444, "height": 0.69444, "italic": 0.04601, "skew": 0.11111},
	  "959": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "960": {"depth": 0.0, "height": 0.43056, "italic": 0.03588, "skew": 0.0},
	  "961": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.08334},
	  "962": {"depth": 0.09722, "height": 0.43056, "italic": 0.07986, "skew": 0.08334},
	  "963": {"depth": 0.0, "height": 0.43056, "italic": 0.03588, "skew": 0.0},
	  "964": {"depth": 0.0, "height": 0.43056, "italic": 0.1132, "skew": 0.02778},
	  "965": {"depth": 0.0, "height": 0.43056, "italic": 0.03588, "skew": 0.02778},
	  "966": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.08334},
	  "967": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.05556},
	  "968": {"depth": 0.19444, "height": 0.69444, "italic": 0.03588, "skew": 0.11111},
	  "969": {"depth": 0.0, "height": 0.43056, "italic": 0.03588, "skew": 0.0},
	  "977": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.08334},
	  "981": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.08334},
	  "982": {"depth": 0.0, "height": 0.43056, "italic": 0.02778, "skew": 0.0},
	  "1009": {"depth": 0.19444, "height": 0.43056, "italic": 0.0, "skew": 0.08334},
	  "1013": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.05556}
	},
	"SansSerif-Regular": {
	  "33": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "34": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "35": {"depth": 0.19444, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "36": {"depth": 0.05556, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "37": {"depth": 0.05556, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "38": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "39": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "40": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "41": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "42": {"depth": 0.0, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "43": {"depth": 0.08333, "height": 0.58333, "italic": 0.0, "skew": 0.0},
	  "44": {"depth": 0.125, "height": 0.08333, "italic": 0.0, "skew": 0.0},
	  "45": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "46": {"depth": 0.0, "height": 0.08333, "italic": 0.0, "skew": 0.0},
	  "47": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "48": {"depth": 0.0, "height": 0.65556, "italic": 0.0, "skew": 0.0},
	  "49": {"depth": 0.0, "height": 0.65556, "italic": 0.0, "skew": 0.0},
	  "50": {"depth": 0.0, "height": 0.65556, "italic": 0.0, "skew": 0.0},
	  "51": {"depth": 0.0, "height": 0.65556, "italic": 0.0, "skew": 0.0},
	  "52": {"depth": 0.0, "height": 0.65556, "italic": 0.0, "skew": 0.0},
	  "53": {"depth": 0.0, "height": 0.65556, "italic": 0.0, "skew": 0.0},
	  "54": {"depth": 0.0, "height": 0.65556, "italic": 0.0, "skew": 0.0},
	  "55": {"depth": 0.0, "height": 0.65556, "italic": 0.0, "skew": 0.0},
	  "56": {"depth": 0.0, "height": 0.65556, "italic": 0.0, "skew": 0.0},
	  "57": {"depth": 0.0, "height": 0.65556, "italic": 0.0, "skew": 0.0},
	  "58": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "59": {"depth": 0.125, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "61": {"depth": -0.13, "height": 0.37, "italic": 0.0, "skew": 0.0},
	  "63": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "64": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "65": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "66": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "67": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "68": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "69": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "70": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "71": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "72": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "73": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "74": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "75": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "76": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "77": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "78": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "79": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "80": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "81": {"depth": 0.125, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "82": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "83": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "84": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "85": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "86": {"depth": 0.0, "height": 0.69444, "italic": 0.01389, "skew": 0.0},
	  "87": {"depth": 0.0, "height": 0.69444, "italic": 0.01389, "skew": 0.0},
	  "88": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "89": {"depth": 0.0, "height": 0.69444, "italic": 0.025, "skew": 0.0},
	  "90": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "91": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "93": {"depth": 0.25, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "94": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "95": {"depth": 0.35, "height": 0.09444, "italic": 0.02778, "skew": 0.0},
	  "97": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "98": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "99": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "100": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "101": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "102": {"depth": 0.0, "height": 0.69444, "italic": 0.06944, "skew": 0.0},
	  "103": {"depth": 0.19444, "height": 0.44444, "italic": 0.01389, "skew": 0.0},
	  "104": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "105": {"depth": 0.0, "height": 0.67937, "italic": 0.0, "skew": 0.0},
	  "106": {"depth": 0.19444, "height": 0.67937, "italic": 0.0, "skew": 0.0},
	  "107": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "108": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "109": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "110": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "111": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "112": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "113": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "114": {"depth": 0.0, "height": 0.44444, "italic": 0.01389, "skew": 0.0},
	  "115": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "116": {"depth": 0.0, "height": 0.57143, "italic": 0.0, "skew": 0.0},
	  "117": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "118": {"depth": 0.0, "height": 0.44444, "italic": 0.01389, "skew": 0.0},
	  "119": {"depth": 0.0, "height": 0.44444, "italic": 0.01389, "skew": 0.0},
	  "120": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "121": {"depth": 0.19444, "height": 0.44444, "italic": 0.01389, "skew": 0.0},
	  "122": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "126": {"depth": 0.35, "height": 0.32659, "italic": 0.0, "skew": 0.0},
	  "305": {"depth": 0.0, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "567": {"depth": 0.19444, "height": 0.44444, "italic": 0.0, "skew": 0.0},
	  "768": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "769": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "770": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "771": {"depth": 0.0, "height": 0.67659, "italic": 0.0, "skew": 0.0},
	  "772": {"depth": 0.0, "height": 0.60889, "italic": 0.0, "skew": 0.0},
	  "774": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "775": {"depth": 0.0, "height": 0.67937, "italic": 0.0, "skew": 0.0},
	  "776": {"depth": 0.0, "height": 0.67937, "italic": 0.0, "skew": 0.0},
	  "778": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "779": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "780": {"depth": 0.0, "height": 0.63194, "italic": 0.0, "skew": 0.0},
	  "915": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "916": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "920": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "923": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "926": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "928": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "931": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "933": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "934": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "936": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "937": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8211": {"depth": 0.0, "height": 0.44444, "italic": 0.02778, "skew": 0.0},
	  "8212": {"depth": 0.0, "height": 0.44444, "italic": 0.02778, "skew": 0.0},
	  "8216": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8217": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8220": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "8221": {"depth": 0.0, "height": 0.69444, "italic": 0.0, "skew": 0.0}
	},
	"Script-Regular": {
	  "65": {"depth": 0.0, "height": 0.7, "italic": 0.22925, "skew": 0.0},
	  "66": {"depth": 0.0, "height": 0.7, "italic": 0.04087, "skew": 0.0},
	  "67": {"depth": 0.0, "height": 0.7, "italic": 0.1689, "skew": 0.0},
	  "68": {"depth": 0.0, "height": 0.7, "italic": 0.09371, "skew": 0.0},
	  "69": {"depth": 0.0, "height": 0.7, "italic": 0.18583, "skew": 0.0},
	  "70": {"depth": 0.0, "height": 0.7, "italic": 0.13634, "skew": 0.0},
	  "71": {"depth": 0.0, "height": 0.7, "italic": 0.17322, "skew": 0.0},
	  "72": {"depth": 0.0, "height": 0.7, "italic": 0.29694, "skew": 0.0},
	  "73": {"depth": 0.0, "height": 0.7, "italic": 0.19189, "skew": 0.0},
	  "74": {"depth": 0.27778, "height": 0.7, "italic": 0.19189, "skew": 0.0},
	  "75": {"depth": 0.0, "height": 0.7, "italic": 0.31259, "skew": 0.0},
	  "76": {"depth": 0.0, "height": 0.7, "italic": 0.19189, "skew": 0.0},
	  "77": {"depth": 0.0, "height": 0.7, "italic": 0.15981, "skew": 0.0},
	  "78": {"depth": 0.0, "height": 0.7, "italic": 0.3525, "skew": 0.0},
	  "79": {"depth": 0.0, "height": 0.7, "italic": 0.08078, "skew": 0.0},
	  "80": {"depth": 0.0, "height": 0.7, "italic": 0.08078, "skew": 0.0},
	  "81": {"depth": 0.0, "height": 0.7, "italic": 0.03305, "skew": 0.0},
	  "82": {"depth": 0.0, "height": 0.7, "italic": 0.06259, "skew": 0.0},
	  "83": {"depth": 0.0, "height": 0.7, "italic": 0.19189, "skew": 0.0},
	  "84": {"depth": 0.0, "height": 0.7, "italic": 0.29087, "skew": 0.0},
	  "85": {"depth": 0.0, "height": 0.7, "italic": 0.25815, "skew": 0.0},
	  "86": {"depth": 0.0, "height": 0.7, "italic": 0.27523, "skew": 0.0},
	  "87": {"depth": 0.0, "height": 0.7, "italic": 0.27523, "skew": 0.0},
	  "88": {"depth": 0.0, "height": 0.7, "italic": 0.26006, "skew": 0.0},
	  "89": {"depth": 0.0, "height": 0.7, "italic": 0.2939, "skew": 0.0},
	  "90": {"depth": 0.0, "height": 0.7, "italic": 0.24037, "skew": 0.0}
	},
	"Size1-Regular": {
	  "40": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "41": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "47": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "91": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "92": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "93": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "123": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "125": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "710": {"depth": 0.0, "height": 0.72222, "italic": 0.0, "skew": 0.0},
	  "732": {"depth": 0.0, "height": 0.72222, "italic": 0.0, "skew": 0.0},
	  "770": {"depth": 0.0, "height": 0.72222, "italic": 0.0, "skew": 0.0},
	  "771": {"depth": 0.0, "height": 0.72222, "italic": 0.0, "skew": 0.0},
	  "8214": {"depth": -0.00099, "height": 0.601, "italic": 0.0, "skew": 0.0},
	  "8593": {"depth": 1e-05, "height": 0.6, "italic": 0.0, "skew": 0.0},
	  "8595": {"depth": 1e-05, "height": 0.6, "italic": 0.0, "skew": 0.0},
	  "8657": {"depth": 1e-05, "height": 0.6, "italic": 0.0, "skew": 0.0},
	  "8659": {"depth": 1e-05, "height": 0.6, "italic": 0.0, "skew": 0.0},
	  "8719": {"depth": 0.25001, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8720": {"depth": 0.25001, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8721": {"depth": 0.25001, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8730": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "8739": {"depth": -0.00599, "height": 0.606, "italic": 0.0, "skew": 0.0},
	  "8741": {"depth": -0.00599, "height": 0.606, "italic": 0.0, "skew": 0.0},
	  "8747": {"depth": 0.30612, "height": 0.805, "italic": 0.19445, "skew": 0.0},
	  "8748": {"depth": 0.306, "height": 0.805, "italic": 0.19445, "skew": 0.0},
	  "8749": {"depth": 0.306, "height": 0.805, "italic": 0.19445, "skew": 0.0},
	  "8750": {"depth": 0.30612, "height": 0.805, "italic": 0.19445, "skew": 0.0},
	  "8896": {"depth": 0.25001, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8897": {"depth": 0.25001, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8898": {"depth": 0.25001, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8899": {"depth": 0.25001, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8968": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "8969": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "8970": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "8971": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "9168": {"depth": -0.00099, "height": 0.601, "italic": 0.0, "skew": 0.0},
	  "10216": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "10217": {"depth": 0.35001, "height": 0.85, "italic": 0.0, "skew": 0.0},
	  "10752": {"depth": 0.25001, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "10753": {"depth": 0.25001, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "10754": {"depth": 0.25001, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "10756": {"depth": 0.25001, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "10758": {"depth": 0.25001, "height": 0.75, "italic": 0.0, "skew": 0.0}
	},
	"Size2-Regular": {
	  "40": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "41": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "47": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "91": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "92": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "93": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "123": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "125": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "710": {"depth": 0.0, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "732": {"depth": 0.0, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "770": {"depth": 0.0, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "771": {"depth": 0.0, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8719": {"depth": 0.55001, "height": 1.05, "italic": 0.0, "skew": 0.0},
	  "8720": {"depth": 0.55001, "height": 1.05, "italic": 0.0, "skew": 0.0},
	  "8721": {"depth": 0.55001, "height": 1.05, "italic": 0.0, "skew": 0.0},
	  "8730": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "8747": {"depth": 0.86225, "height": 1.36, "italic": 0.44445, "skew": 0.0},
	  "8748": {"depth": 0.862, "height": 1.36, "italic": 0.44445, "skew": 0.0},
	  "8749": {"depth": 0.862, "height": 1.36, "italic": 0.44445, "skew": 0.0},
	  "8750": {"depth": 0.86225, "height": 1.36, "italic": 0.44445, "skew": 0.0},
	  "8896": {"depth": 0.55001, "height": 1.05, "italic": 0.0, "skew": 0.0},
	  "8897": {"depth": 0.55001, "height": 1.05, "italic": 0.0, "skew": 0.0},
	  "8898": {"depth": 0.55001, "height": 1.05, "italic": 0.0, "skew": 0.0},
	  "8899": {"depth": 0.55001, "height": 1.05, "italic": 0.0, "skew": 0.0},
	  "8968": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "8969": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "8970": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "8971": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "10216": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "10217": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "10752": {"depth": 0.55001, "height": 1.05, "italic": 0.0, "skew": 0.0},
	  "10753": {"depth": 0.55001, "height": 1.05, "italic": 0.0, "skew": 0.0},
	  "10754": {"depth": 0.55001, "height": 1.05, "italic": 0.0, "skew": 0.0},
	  "10756": {"depth": 0.55001, "height": 1.05, "italic": 0.0, "skew": 0.0},
	  "10758": {"depth": 0.55001, "height": 1.05, "italic": 0.0, "skew": 0.0}
	},
	"Size3-Regular": {
	  "40": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "41": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "47": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "91": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "92": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "93": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "123": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "125": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "710": {"depth": 0.0, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "732": {"depth": 0.0, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "770": {"depth": 0.0, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "771": {"depth": 0.0, "height": 0.75, "italic": 0.0, "skew": 0.0},
	  "8730": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "8968": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "8969": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "8970": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "8971": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "10216": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0},
	  "10217": {"depth": 0.95003, "height": 1.45, "italic": 0.0, "skew": 0.0}
	},
	"Size4-Regular": {
	  "40": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "41": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "47": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "91": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "92": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "93": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "123": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "125": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "710": {"depth": 0.0, "height": 0.825, "italic": 0.0, "skew": 0.0},
	  "732": {"depth": 0.0, "height": 0.825, "italic": 0.0, "skew": 0.0},
	  "770": {"depth": 0.0, "height": 0.825, "italic": 0.0, "skew": 0.0},
	  "771": {"depth": 0.0, "height": 0.825, "italic": 0.0, "skew": 0.0},
	  "8730": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "8968": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "8969": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "8970": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "8971": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "9115": {"depth": 0.64502, "height": 1.155, "italic": 0.0, "skew": 0.0},
	  "9116": {"depth": 1e-05, "height": 0.6, "italic": 0.0, "skew": 0.0},
	  "9117": {"depth": 0.64502, "height": 1.155, "italic": 0.0, "skew": 0.0},
	  "9118": {"depth": 0.64502, "height": 1.155, "italic": 0.0, "skew": 0.0},
	  "9119": {"depth": 1e-05, "height": 0.6, "italic": 0.0, "skew": 0.0},
	  "9120": {"depth": 0.64502, "height": 1.155, "italic": 0.0, "skew": 0.0},
	  "9121": {"depth": 0.64502, "height": 1.155, "italic": 0.0, "skew": 0.0},
	  "9122": {"depth": -0.00099, "height": 0.601, "italic": 0.0, "skew": 0.0},
	  "9123": {"depth": 0.64502, "height": 1.155, "italic": 0.0, "skew": 0.0},
	  "9124": {"depth": 0.64502, "height": 1.155, "italic": 0.0, "skew": 0.0},
	  "9125": {"depth": -0.00099, "height": 0.601, "italic": 0.0, "skew": 0.0},
	  "9126": {"depth": 0.64502, "height": 1.155, "italic": 0.0, "skew": 0.0},
	  "9127": {"depth": 1e-05, "height": 0.9, "italic": 0.0, "skew": 0.0},
	  "9128": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "9129": {"depth": 0.90001, "height": 0.0, "italic": 0.0, "skew": 0.0},
	  "9130": {"depth": 0.0, "height": 0.3, "italic": 0.0, "skew": 0.0},
	  "9131": {"depth": 1e-05, "height": 0.9, "italic": 0.0, "skew": 0.0},
	  "9132": {"depth": 0.65002, "height": 1.15, "italic": 0.0, "skew": 0.0},
	  "9133": {"depth": 0.90001, "height": 0.0, "italic": 0.0, "skew": 0.0},
	  "9143": {"depth": 0.88502, "height": 0.915, "italic": 0.0, "skew": 0.0},
	  "10216": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "10217": {"depth": 1.25003, "height": 1.75, "italic": 0.0, "skew": 0.0},
	  "57344": {"depth": -0.00499, "height": 0.605, "italic": 0.0, "skew": 0.0},
	  "57345": {"depth": -0.00499, "height": 0.605, "italic": 0.0, "skew": 0.0},
	  "57680": {"depth": 0.0, "height": 0.12, "italic": 0.0, "skew": 0.0},
	  "57681": {"depth": 0.0, "height": 0.12, "italic": 0.0, "skew": 0.0},
	  "57682": {"depth": 0.0, "height": 0.12, "italic": 0.0, "skew": 0.0},
	  "57683": {"depth": 0.0, "height": 0.12, "italic": 0.0, "skew": 0.0}
	},
	"Typewriter-Regular": {
	  "33": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "34": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "35": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "36": {"depth": 0.08333, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "37": {"depth": 0.08333, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "38": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "39": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "40": {"depth": 0.08333, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "41": {"depth": 0.08333, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "42": {"depth": 0.0, "height": 0.52083, "italic": 0.0, "skew": 0.0},
	  "43": {"depth": -0.08056, "height": 0.53055, "italic": 0.0, "skew": 0.0},
	  "44": {"depth": 0.13889, "height": 0.125, "italic": 0.0, "skew": 0.0},
	  "45": {"depth": -0.08056, "height": 0.53055, "italic": 0.0, "skew": 0.0},
	  "46": {"depth": 0.0, "height": 0.125, "italic": 0.0, "skew": 0.0},
	  "47": {"depth": 0.08333, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "48": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "49": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "50": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "51": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "52": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "53": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "54": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "55": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "56": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "57": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "58": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "59": {"depth": 0.13889, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "60": {"depth": -0.05556, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "61": {"depth": -0.19549, "height": 0.41562, "italic": 0.0, "skew": 0.0},
	  "62": {"depth": -0.05556, "height": 0.55556, "italic": 0.0, "skew": 0.0},
	  "63": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "64": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "65": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "66": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "67": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "68": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "69": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "70": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "71": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "72": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "73": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "74": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "75": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "76": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "77": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "78": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "79": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "80": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "81": {"depth": 0.13889, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "82": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "83": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "84": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "85": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "86": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "87": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "88": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "89": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "90": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "91": {"depth": 0.08333, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "92": {"depth": 0.08333, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "93": {"depth": 0.08333, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "94": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "95": {"depth": 0.09514, "height": 0.0, "italic": 0.0, "skew": 0.0},
	  "96": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "97": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "98": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "99": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "100": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "101": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "102": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "103": {"depth": 0.22222, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "104": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "105": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "106": {"depth": 0.22222, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "107": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "108": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "109": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "110": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "111": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "112": {"depth": 0.22222, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "113": {"depth": 0.22222, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "114": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "115": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "116": {"depth": 0.0, "height": 0.55358, "italic": 0.0, "skew": 0.0},
	  "117": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "118": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "119": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "120": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "121": {"depth": 0.22222, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "122": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "123": {"depth": 0.08333, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "124": {"depth": 0.08333, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "125": {"depth": 0.08333, "height": 0.69444, "italic": 0.0, "skew": 0.0},
	  "126": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "127": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "305": {"depth": 0.0, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "567": {"depth": 0.22222, "height": 0.43056, "italic": 0.0, "skew": 0.0},
	  "768": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "769": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "770": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "771": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "772": {"depth": 0.0, "height": 0.56555, "italic": 0.0, "skew": 0.0},
	  "774": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "776": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "778": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "780": {"depth": 0.0, "height": 0.56597, "italic": 0.0, "skew": 0.0},
	  "915": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "916": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "920": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "923": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "926": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "928": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "931": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "933": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "934": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "936": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "937": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "2018": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "2019": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0},
	  "8242": {"depth": 0.0, "height": 0.61111, "italic": 0.0, "skew": 0.0}
	}};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(1);
	var ParseError = __webpack_require__(2);

	// This file contains a list of functions that we parse. The functions map
	// contains the following data:

	/*
	 * Keys are the name of the functions to parse
	 * The data contains the following keys:
	 *  - numArgs: The number of arguments the function takes.
	 *  - argTypes: (optional) An array corresponding to each argument of the
	 *              function, giving the type of argument that should be parsed. Its
	 *              length should be equal to `numArgs + numOptionalArgs`. Valid
	 *              types:
	 *               - "size": A size-like thing, such as "1em" or "5ex"
	 *               - "color": An html color, like "#abc" or "blue"
	 *               - "original": The same type as the environment that the
	 *                             function being parsed is in (e.g. used for the
	 *                             bodies of functions like \color where the first
	 *                             argument is special and the second argument is
	 *                             parsed normally)
	 *              Other possible types (probably shouldn't be used)
	 *               - "text": Text-like (e.g. \text)
	 *               - "math": Normal math
	 *              If undefined, this will be treated as an appropriate length
	 *              array of "original" strings
	 *  - greediness: (optional) The greediness of the function to use ungrouped
	 *                arguments.
	 *
	 *                E.g. if you have an expression
	 *                  \sqrt \frac 1 2
	 *                since \frac has greediness=2 vs \sqrt's greediness=1, \frac
	 *                will use the two arguments '1' and '2' as its two arguments,
	 *                then that whole function will be used as the argument to
	 *                \sqrt. On the other hand, the expressions
	 *                  \frac \frac 1 2 3
	 *                and
	 *                  \frac \sqrt 1 2
	 *                will fail because \frac and \frac have equal greediness
	 *                and \sqrt has a lower greediness than \frac respectively. To
	 *                make these parse, we would have to change them to:
	 *                  \frac {\frac 1 2} 3
	 *                and
	 *                  \frac {\sqrt 1} 2
	 *
	 *                The default value is `1`
	 *  - allowedInText: (optional) Whether or not the function is allowed inside
	 *                   text mode (default false)
	 *  - numOptionalArgs: (optional) The number of optional arguments the function
	 *                     should parse. If the optional arguments aren't found,
	 *                     `null` will be passed to the handler in their place.
	 *                     (default 0)
	 *  - handler: The function that is called to handle this function and its
	 *             arguments. The arguments are:
	 *              - func: the text of the function
	 *              - [args]: the next arguments are the arguments to the function,
	 *                        of which there are numArgs of them
	 *              - positions: the positions in the overall string of the function
	 *                           and the arguments. Should only be used to produce
	 *                           error messages
	 *             The function should return an object with the following keys:
	 *              - type: The type of element that this is. This is then used in
	 *                      buildHTML/buildMathML to determine which function
	 *                      should be called to build this node into a DOM node
	 *             Any other data can be added to the object, which will be passed
	 *             in to the function in buildHTML/buildMathML as `group.value`.
	 */

	var functions = {
	    // A normal square root
	    "\\sqrt": {
	        numArgs: 1,
	        numOptionalArgs: 1,
	        handler: function(func, index, body, positions) {
	            return {
	                type: "sqrt",
	                body: body,
	                index: index
	            };
	        }
	    },

	    // Some non-mathy text
	    "\\text": {
	        numArgs: 1,
	        argTypes: ["text"],
	        greediness: 2,
	        handler: function(func, body) {
	            // Since the corresponding buildHTML/buildMathML function expects a
	            // list of elements, we normalize for different kinds of arguments
	            // TODO(emily): maybe this should be done somewhere else
	            var inner;
	            if (body.type === "ordgroup") {
	                inner = body.value;
	            } else {
	                inner = [body];
	            }

	            return {
	                type: "text",
	                body: inner
	            };
	        }
	    },

	    // A two-argument custom color
	    "\\color": {
	        numArgs: 2,
	        allowedInText: true,
	        greediness: 3,
	        argTypes: ["color", "original"],
	        handler: function(func, color, body) {
	            // Normalize the different kinds of bodies (see \text above)
	            var inner;
	            if (body.type === "ordgroup") {
	                inner = body.value;
	            } else {
	                inner = [body];
	            }

	            return {
	                type: "color",
	                color: color.value,
	                value: inner
	            };
	        }
	    },

	    // An overline
	    "\\overline": {
	        numArgs: 1,
	        handler: function(func, body) {
	            return {
	                type: "overline",
	                body: body
	            };
	        }
	    },

	    // A box of the width and height
	    "\\rule": {
	        numArgs: 2,
	        numOptionalArgs: 1,
	        argTypes: ["size", "size", "size"],
	        handler: function(func, shift, width, height) {
	            return {
	                type: "rule",
	                shift: shift && shift.value,
	                width: width.value,
	                height: height.value
	            };
	        }
	    },

	    // A KaTeX logo
	    "\\KaTeX": {
	        numArgs: 0,
	        handler: function(func) {
	            return {
	                type: "katex"
	            };
	        }
	    },

	    "\\phantom": {
	        numArgs: 1,
	        handler: function(func, body) {
	            var inner;
	            if (body.type === "ordgroup") {
	                inner = body.value;
	            } else {
	                inner = [body];
	            }

	            return {
	                type: "phantom",
	                value: inner
	            };
	        }
	    }
	};

	// Extra data needed for the delimiter handler down below
	var delimiterSizes = {
	    "\\bigl" : {type: "open",    size: 1},
	    "\\Bigl" : {type: "open",    size: 2},
	    "\\biggl": {type: "open",    size: 3},
	    "\\Biggl": {type: "open",    size: 4},
	    "\\bigr" : {type: "close",   size: 1},
	    "\\Bigr" : {type: "close",   size: 2},
	    "\\biggr": {type: "close",   size: 3},
	    "\\Biggr": {type: "close",   size: 4},
	    "\\bigm" : {type: "rel",     size: 1},
	    "\\Bigm" : {type: "rel",     size: 2},
	    "\\biggm": {type: "rel",     size: 3},
	    "\\Biggm": {type: "rel",     size: 4},
	    "\\big"  : {type: "textord", size: 1},
	    "\\Big"  : {type: "textord", size: 2},
	    "\\bigg" : {type: "textord", size: 3},
	    "\\Bigg" : {type: "textord", size: 4}
	};

	var delimiters = [
	    "(", ")", "[", "\\lbrack", "]", "\\rbrack",
	    "\\{", "\\lbrace", "\\}", "\\rbrace",
	    "\\lfloor", "\\rfloor", "\\lceil", "\\rceil",
	    "<", ">", "\\langle", "\\rangle",
	    "\\lvert", "\\rvert", "\\lVert", "\\rVert",
	    "\\lgroup", "\\rgroup", "\\lmoustache", "\\rmoustache",
	    "/", "\\backslash",
	    "|", "\\vert", "\\|", "\\Vert",
	    "\\uparrow", "\\Uparrow",
	    "\\downarrow", "\\Downarrow",
	    "\\updownarrow", "\\Updownarrow",
	    "."
	];

	var fontAliases = {
	    "\\Bbb": "\\mathbb",
	    "\\bold": "\\mathbf",
	    "\\frak": "\\mathfrak"
	};

	/*
	 * This is a list of functions which each have the same function but have
	 * different names so that we don't have to duplicate the data a bunch of times.
	 * Each element in the list is an object with the following keys:
	 *  - funcs: A list of function names to be associated with the data
	 *  - data: An objecty with the same data as in each value of the `function`
	 *          table above
	 */
	var duplicatedFunctions = [
	    // Single-argument color functions
	    {
	        funcs: [
	            "\\blue", "\\orange", "\\pink", "\\red",
	            "\\green", "\\gray", "\\purple",
	            "\\blueA", "\\blueB", "\\blueC", "\\blueD", "\\blueE",
	            "\\tealA", "\\tealB", "\\tealC", "\\tealD", "\\tealE",
	            "\\greenA", "\\greenB", "\\greenC", "\\greenD", "\\greenE",
	            "\\goldA", "\\goldB", "\\goldC", "\\goldD", "\\goldE",
	            "\\redA", "\\redB", "\\redC", "\\redD", "\\redE",
	            "\\maroonA", "\\maroonB", "\\maroonC", "\\maroonD", "\\maroonE",
	            "\\purpleA", "\\purpleB", "\\purpleC", "\\purpleD", "\\purpleE",
	            "\\mintA", "\\mintB", "\\mintC",
	            "\\grayA", "\\grayB", "\\grayC", "\\grayD", "\\grayE",
	            "\\grayF", "\\grayG", "\\grayH", "\\grayI",
	            "\\kaBlue", "\\kaGreen"
	        ],
	        data: {
	            numArgs: 1,
	            allowedInText: true,
	            greediness: 3,
	            handler: function(func, body) {
	                var atoms;
	                if (body.type === "ordgroup") {
	                    atoms = body.value;
	                } else {
	                    atoms = [body];
	                }

	                return {
	                    type: "color",
	                    color: "katex-" + func.slice(1),
	                    value: atoms
	                };
	            }
	        }
	    },

	    // There are 2 flags for operators; whether they produce limits in
	    // displaystyle, and whether they are symbols and should grow in
	    // displaystyle. These four groups cover the four possible choices.

	    // No limits, not symbols
	    {
	        funcs: [
	            "\\arcsin", "\\arccos", "\\arctan", "\\arg", "\\cos", "\\cosh",
	            "\\cot", "\\coth", "\\csc", "\\deg", "\\dim", "\\exp", "\\hom",
	            "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh",
	            "\\tan","\\tanh"
	        ],
	        data: {
	            numArgs: 0,
	            handler: function(func) {
	                return {
	                    type: "op",
	                    limits: false,
	                    symbol: false,
	                    body: func
	                };
	            }
	        }
	    },

	    // Limits, not symbols
	    {
	        funcs: [
	            "\\det", "\\gcd", "\\inf", "\\lim", "\\liminf", "\\limsup", "\\max",
	            "\\min", "\\Pr", "\\sup"
	        ],
	        data: {
	            numArgs: 0,
	            handler: function(func) {
	                return {
	                    type: "op",
	                    limits: true,
	                    symbol: false,
	                    body: func
	                };
	            }
	        }
	    },

	    // No limits, symbols
	    {
	        funcs: [
	            "\\int", "\\iint", "\\iiint", "\\oint"
	        ],
	        data: {
	            numArgs: 0,
	            handler: function(func) {
	                return {
	                    type: "op",
	                    limits: false,
	                    symbol: true,
	                    body: func
	                };
	            }
	        }
	    },

	    // Limits, symbols
	    {
	        funcs: [
	            "\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap",
	            "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes",
	            "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint"
	        ],
	        data: {
	            numArgs: 0,
	            handler: function(func) {
	                return {
	                    type: "op",
	                    limits: true,
	                    symbol: true,
	                    body: func
	                };
	            }
	        }
	    },

	    // Fractions
	    {
	        funcs: [
	            "\\dfrac", "\\frac", "\\tfrac",
	            "\\dbinom", "\\binom", "\\tbinom"
	        ],
	        data: {
	            numArgs: 2,
	            greediness: 2,
	            handler: function(func, numer, denom) {
	                var hasBarLine;
	                var leftDelim = null;
	                var rightDelim = null;
	                var size = "auto";

	                switch (func) {
	                    case "\\dfrac":
	                    case "\\frac":
	                    case "\\tfrac":
	                        hasBarLine = true;
	                        break;
	                    case "\\dbinom":
	                    case "\\binom":
	                    case "\\tbinom":
	                        hasBarLine = false;
	                        leftDelim = "(";
	                        rightDelim = ")";
	                        break;
	                    default:
	                        throw new Error("Unrecognized genfrac command");
	                }

	                switch (func) {
	                    case "\\dfrac":
	                    case "\\dbinom":
	                        size = "display";
	                        break;
	                    case "\\tfrac":
	                    case "\\tbinom":
	                        size = "text";
	                        break;
	                }

	                return {
	                    type: "genfrac",
	                    numer: numer,
	                    denom: denom,
	                    hasBarLine: hasBarLine,
	                    leftDelim: leftDelim,
	                    rightDelim: rightDelim,
	                    size: size
	                };
	            }
	        }
	    },

	    // Left and right overlap functions
	    {
	        funcs: ["\\llap", "\\rlap"],
	        data: {
	            numArgs: 1,
	            allowedInText: true,
	            handler: function(func, body) {
	                return {
	                    type: func.slice(1),
	                    body: body
	                };
	            }
	        }
	    },

	    // Delimiter functions
	    {
	        funcs: [
	            "\\bigl", "\\Bigl", "\\biggl", "\\Biggl",
	            "\\bigr", "\\Bigr", "\\biggr", "\\Biggr",
	            "\\bigm", "\\Bigm", "\\biggm", "\\Biggm",
	            "\\big",  "\\Big",  "\\bigg",  "\\Bigg",
	            "\\left", "\\right"
	        ],
	        data: {
	            numArgs: 1,
	            handler: function(func, delim, positions) {
	                if (!utils.contains(delimiters, delim.value)) {
	                    throw new ParseError(
	                        "Invalid delimiter: '" + delim.value + "' after '" +
	                            func + "'",
	                        this.lexer, positions[1]);
	                }

	                // \left and \right are caught somewhere in Parser.js, which is
	                // why this data doesn't match what is in buildHTML.
	                if (func === "\\left" || func === "\\right") {
	                    return {
	                        type: "leftright",
	                        value: delim.value
	                    };
	                } else {
	                    return {
	                        type: "delimsizing",
	                        size: delimiterSizes[func].size,
	                        delimType: delimiterSizes[func].type,
	                        value: delim.value
	                    };
	                }
	            }
	        }
	    },

	    // Sizing functions (handled in Parser.js explicitly, hence no handler)
	    {
	        funcs: [
	            "\\tiny", "\\scriptsize", "\\footnotesize", "\\small",
	            "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"
	        ],
	        data: {
	            numArgs: 0
	        }
	    },

	    // Style changing functions (handled in Parser.js explicitly, hence no
	    // handler)
	    {
	        funcs: [
	            "\\displaystyle", "\\textstyle", "\\scriptstyle",
	            "\\scriptscriptstyle"
	        ],
	        data: {
	            numArgs: 0
	        }
	    },

	    {
	        funcs: [
	            // styles
	            "\\mathrm", "\\mathit", "\\mathbf",

	            // families
	            "\\mathbb", "\\mathcal", "\\mathfrak", "\\mathscr", "\\mathsf",
	            "\\mathtt",

	            // aliases
	            "\\Bbb", "\\bold", "\\frak"
	        ],
	        data: {
	            numArgs: 1,
	            handler: function (func, body) {
	                if (func in fontAliases) {
	                    func = fontAliases[func];
	                }
	                return {
	                    type: "font",
	                    font: func.slice(1),
	                    body: body
	                };
	            }
	        }
	    },

	    // Accents
	    {
	        funcs: [
	            "\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve",
	            "\\check", "\\hat", "\\vec", "\\dot"
	            // We don't support expanding accents yet
	            // "\\widetilde", "\\widehat"
	        ],
	        data: {
	            numArgs: 1,
	            handler: function(func, base) {
	                return {
	                    type: "accent",
	                    accent: func,
	                    base: base
	                };
	            }
	        }
	    },

	    // Infix generalized fractions
	    {
	        funcs: ["\\over", "\\choose"],
	        data: {
	            numArgs: 0,
	            handler: function (func) {
	                var replaceWith;
	                switch (func) {
	                    case "\\over":
	                        replaceWith = "\\frac";
	                        break;
	                    case "\\choose":
	                        replaceWith = "\\binom";
	                        break;
	                    default:
	                        throw new Error("Unrecognized infix genfrac command");
	                }
	                return {
	                    type: "infix",
	                    replaceWith: replaceWith
	                };
	            }
	        }
	    },

	    // Row breaks for aligned data
	    {
	        funcs: ["\\\\", "\\cr"],
	        data: {
	            numArgs: 0,
	            numOptionalArgs: 1,
	            argTypes: ["size"],
	            handler: function(func, size) {
	                return {
	                    type: "cr",
	                    size: size
	                };
	            }
	        }
	    },

	    // Environment delimiters
	    {
	        funcs: ["\\begin", "\\end"],
	        data: {
	            numArgs: 1,
	            argTypes: ["text"],
	            handler: function(func, nameGroup, positions) {
	                if (nameGroup.type !== "ordgroup") {
	                    throw new ParseError(
	                        "Invalid environment name",
	                        this.lexer, positions[1]);
	                }
	                var name = "";
	                for (var i = 0; i < nameGroup.value.length; ++i) {
	                    name += nameGroup.value[i].value;
	                }
	                return {
	                    type: "environment",
	                    name: name,
	                    namepos: positions[1]
	                };
	            }
	        }
	    }
	];

	var addFuncsWithData = function(funcs, data) {
	    for (var i = 0; i < funcs.length; i++) {
	        functions[funcs[i]] = data;
	    }
	};

	// Add all of the functions in duplicatedFunctions to the functions map
	for (var i = 0; i < duplicatedFunctions.length; i++) {
	    addFuncsWithData(duplicatedFunctions[i].funcs, duplicatedFunctions[i].data);
	}

	// Set default values of functions
	for (var f in functions) {
	    if (functions.hasOwnProperty(f)) {
	        var func = functions[f];

	        functions[f] = {
	            numArgs: func.numArgs,
	            argTypes: func.argTypes,
	            greediness: (func.greediness === undefined) ? 1 : func.greediness,
	            allowedInText: func.allowedInText ? func.allowedInText : false,
	            numOptionalArgs: (func.numOptionalArgs === undefined) ? 0 :
	                func.numOptionalArgs,
	            handler: func.handler
	        };
	    }
	}

	module.exports = {
	    funcs: functions
	};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * These objects store data about MathML nodes. This is the MathML equivalent
	 * of the types in domTree.js. Since MathML handles its own rendering, and
	 * since we're mainly using MathML to improve accessibility, we don't manage
	 * any of the styling state that the plain DOM nodes do.
	 *
	 * The `toNode` and `toMarkup` functions work simlarly to how they do in
	 * domTree.js, creating namespaced DOM nodes and HTML text markup respectively.
	 */

	var utils = __webpack_require__(1);

	/**
	 * This node represents a general purpose MathML node of any type. The
	 * constructor requires the type of node to create (for example, `"mo"` or
	 * `"mspace"`, corresponding to `<mo>` and `<mspace>` tags).
	 */
	function MathNode(type, children) {
	    this.type = type;
	    this.attributes = {};
	    this.children = children || [];
	}

	/**
	 * Sets an attribute on a MathML node. MathML depends on attributes to convey a
	 * semantic content, so this is used heavily.
	 */
	MathNode.prototype.setAttribute = function(name, value) {
	    this.attributes[name] = value;
	};

	/**
	 * Converts the math node into a MathML-namespaced DOM element.
	 */
	MathNode.prototype.toNode = function() {
	    var node = document.createElementNS(
	        "http://www.w3.org/1998/Math/MathML", this.type);

	    for (var attr in this.attributes) {
	        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
	            node.setAttribute(attr, this.attributes[attr]);
	        }
	    }

	    for (var i = 0; i < this.children.length; i++) {
	        node.appendChild(this.children[i].toNode());
	    }

	    return node;
	};

	/**
	 * Converts the math node into an HTML markup string.
	 */
	MathNode.prototype.toMarkup = function() {
	    var markup = "<" + this.type;

	    // Add the attributes
	    for (var attr in this.attributes) {
	        if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
	            markup += " " + attr + "=\"";
	            markup += utils.escape(this.attributes[attr]);
	            markup += "\"";
	        }
	    }

	    markup += ">";

	    for (var i = 0; i < this.children.length; i++) {
	        markup += this.children[i].toMarkup();
	    }

	    markup += "</" + this.type + ">";

	    return markup;
	};

	/**
	 * This node represents a piece of text.
	 */
	function TextNode(text) {
	    this.text = text;
	}

	/**
	 * Converts the text node into a DOM text node.
	 */
	TextNode.prototype.toNode = function() {
	    return document.createTextNode(this.text);
	};

	/**
	 * Converts the text node into HTML markup (which is just the text itself).
	 */
	TextNode.prototype.toMarkup = function() {
	    return utils.escape(this.text);
	};

	module.exports = {
	    MathNode: MathNode,
	    TextNode: TextNode
	};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Provides a single function for parsing an expression using a Parser
	 * TODO(emily): Remove this
	 */

	var Parser = __webpack_require__(63);

	/**
	 * Parses an expression using a Parser, then returns the parsed result.
	 */
	var parseTree = function(toParse, settings) {
	    var parser = new Parser(toParse, settings);

	    return parser.parse();
	};

	module.exports = parseTree;


/***/ }),
/* 73 */
/***/ (function(module, exports) {

	/** @flow */

	"use strict";

	function getRelocatable(re) {
	  // In the future, this could use a WeakMap instead of an expando.
	  if (!re.__matchAtRelocatable) {
	    // Disjunctions are the lowest-precedence operator, so we can make any
	    // pattern match the empty string by appending `|()` to it:
	    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-patterns
	    var source = re.source + "|()";

	    // We always make the new regex global.
	    var flags = "g" + (re.ignoreCase ? "i" : "") + (re.multiline ? "m" : "") + (re.unicode ? "u" : "")
	    // sticky (/.../y) doesn't make sense in conjunction with our relocation
	    // logic, so we ignore it here.
	    ;

	    re.__matchAtRelocatable = new RegExp(source, flags);
	  }
	  return re.__matchAtRelocatable;
	}

	function matchAt(re, str, pos) {
	  if (re.global || re.sticky) {
	    throw new Error("matchAt(...): Only non-global regexes are supported");
	  }
	  var reloc = getRelocatable(re);
	  reloc.lastIndex = pos;
	  var match = reloc.exec(str);
	  // Last capturing group is our sentinel that indicates whether the regex
	  // matched at the given location.
	  if (match[match.length - 1] == null) {
	    // Original regex matched.
	    match.length = match.length - 1;
	    return match;
	  } else {
	    return null;
	  }
	}

	module.exports = matchAt;

/***/ }),
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var BaseSelectionHandler,
	    FocusableSelectionHandler,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	BaseSelectionHandler = __webpack_require__(29);

	FocusableSelectionHandler = function (superClass) {
	  extend(FocusableSelectionHandler, superClass);

	  function FocusableSelectionHandler() {
	    return FocusableSelectionHandler.__super__.constructor.apply(this, arguments);
	  }

	  FocusableSelectionHandler.prototype.getVirtualSelectionStartData = function (selection, chunk) {
	    return {
	      groupIndex: 'anchor:main',
	      offset: 0
	    };
	  };

	  FocusableSelectionHandler.prototype.getVirtualSelectionEndData = function (selection, chunk) {
	    return {
	      groupIndex: 'anchor:main',
	      offset: 0
	    };
	  };

	  FocusableSelectionHandler.prototype.getDOMSelectionStart = function (selection, chunk) {
	    return {
	      textNode: chunk.getDomEl().getElementsByClassName('anchor')[0].childNodes[0],
	      offset: 0
	    };
	  };

	  FocusableSelectionHandler.prototype.getDOMSelectionEnd = function (selection, chunk) {
	    return {
	      textNode: chunk.getDomEl().getElementsByClassName('anchor')[0].childNodes[0],
	      offset: 0
	    };
	  };

	  FocusableSelectionHandler.prototype.selectStart = function (selection, chunk, asRange) {
	    selection.virtual.setStart(chunk, {
	      groupIndex: 'anchor:main',
	      offset: 0
	    });
	    if (!asRange) {
	      return selection.virtual.collapse();
	    }
	  };

	  FocusableSelectionHandler.prototype.selectEnd = function (selection, chunk, asRange) {
	    selection.virtual.setEnd(chunk, {
	      groupIndex: 'anchor:main',
	      offset: 0
	    });
	    if (!asRange) {
	      return selection.virtual.collapseToEnd();
	    }
	  };

	  FocusableSelectionHandler.prototype.areCursorsEquivalent = function (selectionWhichIsNullTODO, chunk, thisCursorData, otherCursorData) {
	    return thisCursorData.offset === otherCursorData.offset && thisCursorData.groupIndex === otherCursorData.groupIndex;
	  };

	  return FocusableSelectionHandler;
	}(BaseSelectionHandler);

	module.exports = FocusableSelectionHandler;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var DOMUtil, Dispatcher, StyleableTextComponent, TextGroupEl, emptyChar, varRegex;

	emptyChar = __webpack_require__(22).EMPTY_CHAR;

	DOMUtil = __webpack_require__(16);

	StyleableTextComponent = __webpack_require__(90);

	Dispatcher = __webpack_require__(4);

	varRegex = /\{\{(.+?)\}\}/;

	TextGroupEl = React.createClass({
	  displayName: 'TextGroupEl',

	  statics: {
	    getTextElement: function getTextElement(chunk, groupIndex) {
	      return chunk.getDomEl().querySelector("*[data-group-index='" + groupIndex + "']");
	    },
	    getTextElementAtCursor: function getTextElementAtCursor(virtualCursor) {
	      return TextGroupEl.getTextElement(virtualCursor.chunk, virtualCursor.data.groupIndex);
	    },
	    getDomPosition: function getDomPosition(virtualCursor) {
	      var element, i, len, ref, textNode, totalCharactersFromStart;
	      totalCharactersFromStart = 0;
	      element = TextGroupEl.getTextElementAtCursor(virtualCursor);
	      if (!element) {
	        return null;
	      }
	      if (element != null) {
	        ref = DOMUtil.getTextNodesInOrder(element);
	        for (i = 0, len = ref.length; i < len; i++) {
	          textNode = ref[i];
	          if (totalCharactersFromStart + textNode.nodeValue.length >= virtualCursor.data.offset) {
	            return {
	              textNode: textNode,
	              offset: virtualCursor.data.offset - totalCharactersFromStart
	            };
	          }
	          totalCharactersFromStart += textNode.nodeValue.length;
	        }
	      }
	      return {
	        textNode: null,
	        offset: 0
	      };
	    }
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    return console.timeEnd('textRender');
	  },
	  render: function render() {
	    var event, match, startIndex, text, variable;
	    console.time('textRender');
	    text = this.props.textItem.text;
	    if (this.props.parentModel && text.value.indexOf('{{')) {
	      match = null;
	      text = text.clone();
	      while ((match = varRegex.exec(text.value)) !== null) {
	        variable = match[1];
	        event = {
	          text: ''
	        };
	        Dispatcher.trigger('getTextForVariable', event, variable, this.props.parentModel);
	        if (event.text === null) {
	          event.text = match[1];
	        }
	        event.text = '' + event.text;
	        startIndex = text.value.indexOf(match[0], varRegex.lastIndex);
	        text.replaceText(startIndex, startIndex + match[0].length, event.text);
	      }
	    }
	    return React.createElement(
	      'span',
	      { className: 'text' + ' align-' + this.props.textItem.data.align, 'data-group-index': this.props.groupIndex, 'data-indent': this.props.textItem.data.indent },
	      React.createElement(StyleableTextComponent, { text: text })
	    );
	  }
	});

	window.__gdp = TextGroupEl.getDomPosition;

	module.exports = TextGroupEl;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var EMPTY_CHAR;

	EMPTY_CHAR = __webpack_require__(22).EMPTY_CHAR;

	module.exports = React.createClass({
			displayName: 'exports',

			render: function render() {
					return React.createElement(
							'span',
							_extends({}, this.props, {
									className: 'anchor',
									ref: 'anchorElement',
									contentEditable: 'true',
									tabIndex: this.props.shouldPreventTab ? '-1' : '',
									suppressContentEditableWarning: true,
									'data-group-index': 'anchor:' + this.props.name
							}),
							EMPTY_CHAR
					);
			}
	});

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(269);

	module.exports = React.createClass({
	  displayName: 'exports',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      value: null,
	      disabled: false,
	      align: 'center'
	    };
	  },
	  focus: function focus() {
	    return ReactDOM.findDOMNode(this.refs.button).focus();
	  },
	  render: function render() {
	    var children;
	    if (this.props.value) {
	      children = this.props.value;
	    } else {
	      children = this.props.children;
	    }
	    return React.createElement(
	      'div',
	      { className: "obojobo-draft--components--button" + (this.props.dangerous ? ' dangerous' : '') + (this.props.altAction ? ' alt-action' : '') + (' align-' + this.props.align) },
	      React.createElement(
	        'button',
	        {
	          ref: 'button',
	          onClick: this.props.onClick,
	          tabIndex: this.props.shouldPreventTab ? '-1' : this.props.tabIndex,
	          disabled: this.props.disabled || this.props.shouldPreventTab
	        },
	        children
	      )
	    );
	  }
	});

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(273);

	module.exports = React.createClass({
	  displayName: "exports",

	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "obojobo-draft--components--modal--bubble" },
	      React.createElement(
	        "div",
	        { className: "container" },
	        this.props.children
	      )
	    );
	  }
	});

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var Button, DeleteButton, Modal;

	__webpack_require__(275);

	Button = __webpack_require__(80);

	DeleteButton = __webpack_require__(46);

	Modal = __webpack_require__(84);

	module.exports = React.createClass({
	  displayName: 'exports',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      centered: true
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    var button, i, index, len, ref, results;
	    ref = this.props.buttons;
	    results = [];
	    for (index = i = 0, len = ref.length; i < len; index = ++i) {
	      button = ref[index];
	      if (button["default"]) {
	        results.push(this.refs['button' + index].focus());
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
	  },
	  focusOnFirstElement: function focusOnFirstElement() {
	    return this.refs.button0.focus();
	  },
	  render: function render() {
	    var styles;
	    styles = null;
	    if (this.props.width) {
	      styles = {
	        width: this.props.width
	      };
	    }
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--components--modal--dialog', style: styles },
	      React.createElement(
	        Modal,
	        { onClose: this.props.onClose, focusOnFirstElement: this.focusOnFirstElement },
	        this.props.title ? React.createElement(
	          'h1',
	          { className: 'heading', style: { textAlign: this.props.centered ? 'center' : null } },
	          this.props.title
	        ) : null,
	        React.createElement(
	          'div',
	          { className: 'dialog-content', style: { textAlign: this.props.centered ? 'center' : null } },
	          this.props.children
	        ),
	        React.createElement(
	          'div',
	          { className: 'controls' },
	          this.props.buttons.map(function (buttonPropsOrText, index) {
	            if (typeof buttonPropsOrText === "string") {
	              return React.createElement(
	                'span',
	                { key: index, className: 'text' },
	                buttonPropsOrText
	              );
	            }
	            buttonPropsOrText.key = index;
	            return React.createElement(Button, _extends({ ref: 'button' + index }, buttonPropsOrText));
	          }.bind(this))
	        )
	      )
	    );
	  }
	});

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var SimpleDialog;

	__webpack_require__(276);

	SimpleDialog = __webpack_require__(85);

	module.exports = React.createClass({
		displayName: 'exports',

		render: function render() {
			return React.createElement(
				'div',
				{ className: 'obojobo-draft--components--modal--error-dialog' },
				React.createElement(
					SimpleDialog,
					{ ok: true, title: this.props.title },
					this.props.children
				)
			);
		}
	});

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var DeleteButton;

	__webpack_require__(277);

	DeleteButton = __webpack_require__(46);

	module.exports = React.createClass({
	  displayName: 'exports',

	  componentDidMount: function componentDidMount() {
	    if (this.props.onClose) {
	      return document.addEventListener('keyup', this.onKeyUp);
	    }
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    if (this.props.onClose) {
	      return document.removeEventListener('keyup', this.onKeyUp);
	    }
	  },
	  onKeyUp: function onKeyUp(event) {
	    if (event.keyCode === 27) {
	      return this.props.onClose();
	    }
	  },
	  onTabTrapFocus: function onTabTrapFocus() {
	    if (this.props.onClose) {
	      return this.refs.closeButton.focus();
	    } else if (this.props.focusOnFirstElement) {
	      return this.props.focusOnFirstElement();
	    }
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--components--modal--modal' },
	      React.createElement('input', { className: 'first-tab', ref: 'firstTab', type: 'text', onFocus: this.onTabTrapFocus }),
	      this.props.onClose ? React.createElement(DeleteButton, { ref: 'closeButton', onClick: this.props.onClose }) : null,
	      React.createElement(
	        'div',
	        { className: 'content' },
	        this.props.children
	      ),
	      React.createElement('input', { className: 'last-tab', ref: 'lastTab', type: 'text', onFocus: this.onTabTrapFocus })
	    );
	  }
	});

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Dialog, ModalUtil;

	__webpack_require__(278);

	ModalUtil = __webpack_require__(95);

	Dialog = __webpack_require__(82);

	module.exports = React.createClass({
	  displayName: 'exports',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      ok: false,
	      noOrYes: false,
	      yesOrNo: false,
	      cancelOk: false,
	      title: null,
	      width: null,
	      onCancel: function onCancel() {
	        return ModalUtil.hide();
	      },
	      onConfirm: function onConfirm() {
	        return ModalUtil.hide();
	      }
	    };
	  },
	  render: function render() {
	    var buttons, cancelButton, confirmButton;
	    cancelButton = null;
	    confirmButton = null;
	    if (this.props.ok) {
	      buttons = [{
	        value: 'OK',
	        onClick: this.props.onConfirm,
	        "default": true
	      }];
	    } else if (this.props.noOrYes) {
	      buttons = [{
	        value: 'No',
	        onClick: this.props.onCancel
	      }, 'or', {
	        value: 'Yes',
	        onClick: this.props.onConfirm,
	        "default": true
	      }];
	    } else if (this.props.yesOrNo) {
	      buttons = [{
	        value: 'Yes',
	        onClick: this.props.onConfirm
	      }, 'or', {
	        value: 'No',
	        onClick: this.props.onCancel,
	        "default": true
	      }];
	    } else if (this.props.cancelOk) {
	      buttons = [{
	        value: 'Cancel',
	        altAction: true,
	        onClick: this.props.onCancel
	      }, {
	        value: 'OK',
	        onClick: this.props.onConfirm,
	        "default": true
	      }];
	    }
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--components--modal--simple-dialog' },
	      React.createElement(
	        Dialog,
	        { centered: true, buttons: buttons, title: this.props.title, width: this.props.width },
	        this.props.children
	      )
	    );
	  }
	});

/***/ }),
/* 86 */
/***/ (function(module, exports) {

	"use strict";

	var MockElement;

	MockElement = function () {
	  function MockElement(type, attrs) {
	    this.type = type;
	    this.attrs = attrs != null ? attrs : {};
	    this.nodeType = 'element';
	    this.children = [];
	    this.parent = null;
	  }

	  MockElement.prototype.addChild = function (child) {
	    this.children.push(child);
	    return child.parent = this;
	  };

	  MockElement.prototype.addChildAt = function (child, atIndex) {
	    this.children.splice(atIndex, 0, child);
	    return child.parent = this;
	  };

	  MockElement.prototype.getChildIndex = function (child) {
	    return this.children.indexOf(child);
	  };

	  MockElement.prototype.addBefore = function (childToAdd, targetChild) {
	    var index;
	    index = this.getChildIndex(targetChild);
	    return this.addChildAt(childToAdd, index);
	  };

	  MockElement.prototype.addAfter = function (childToAdd, targetChild) {
	    var index;
	    index = this.getChildIndex(targetChild);
	    return this.addChildAt(childToAdd, index + 1);
	  };

	  MockElement.prototype.replaceChild = function (childToReplace, newChild) {
	    var index;
	    index = this.getChildIndex(childToReplace);
	    this.children[index] = newChild;
	    newChild.parent = this;
	    return childToReplace.parent = null;
	  };

	  return MockElement;
	}();

	Object.defineProperties(MockElement.prototype, {
	  "firstChild": {
	    get: function get() {
	      return this.children[0];
	    }
	  },
	  "lastChild": {
	    get: function get() {
	      return this.children[this.children.length - 1];
	    }
	  }
	});

	module.exports = MockElement;

/***/ }),
/* 87 */
/***/ (function(module, exports) {

	'use strict';

	var MockTextNode;

	MockTextNode = function () {
	  function MockTextNode(text) {
	    this.text = text != null ? text : '';
	    this.nodeType = 'text';
	    this.parent = null;
	  }

	  return MockTextNode;
	}();

	module.exports = MockTextNode;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Cursor, DOMUtil;

	DOMUtil = __webpack_require__(16);

	Cursor = function () {
	  function Cursor(chunk, node, offset) {
	    this.chunk = chunk != null ? chunk : null;
	    this.node = node != null ? node : null;
	    this.offset = offset != null ? offset : null;
	    this.textNode = DOMUtil.getFirstTextNodeOfElement(this.node);
	    this.isValid = this.chunk !== null && this.offset !== null;
	    this.isText = this.isValid && this.textNode !== null;
	  }

	  Cursor.prototype.clone = function () {
	    return new Cursor(this.chunk, this.node, this.offset);
	  };

	  return Cursor;
	}();

	module.exports = Cursor;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var DOMSelection, DOMUtil, VirtualCursor, VirtualSelection;

	VirtualCursor = __webpack_require__(49);

	DOMUtil = __webpack_require__(16);

	DOMSelection = __webpack_require__(21);

	VirtualSelection = function () {
	  function VirtualSelection(page1) {
	    this.page = page1;
	    this.clear();
	  }

	  VirtualSelection.prototype.clear = function () {
	    this.start = null;
	    return this.end = null;
	  };

	  VirtualSelection.prototype.clone = function () {
	    var virtSel;
	    virtSel = new VirtualSelection(this.page);
	    virtSel.start = this.start.clone();
	    virtSel.end = this.end.clone();
	    return virtSel;
	  };

	  VirtualSelection.prototype.getPosition = function (chunk) {
	    var chunkIndex, endIndex, ref, ref1, startIndex;
	    if (((ref = this.start) != null ? ref.chunk : void 0) == null || ((ref1 = this.end) != null ? ref1.chunk : void 0) == null) {
	      return 'unknown';
	    }
	    chunkIndex = chunk.get('index');
	    startIndex = this.start.chunk.get('index');
	    endIndex = this.end.chunk.get('index');
	    if (chunkIndex < startIndex) {
	      return 'before';
	    }
	    if (chunkIndex === startIndex && chunkIndex === endIndex) {
	      return 'contains';
	    }
	    if (chunkIndex === startIndex) {
	      return 'start';
	    }
	    if (chunkIndex < endIndex) {
	      return 'inside';
	    }
	    if (chunkIndex === endIndex) {
	      return 'end';
	    }
	    return 'after';
	  };

	  VirtualSelection.prototype.collapse = function () {
	    return this.end = this.start.clone();
	  };

	  VirtualSelection.prototype.collapseToEnd = function () {
	    return this.start = this.end.clone();
	  };

	  VirtualSelection.prototype.setStart = function (chunk, data) {
	    return this.start = new VirtualCursor(chunk, data);
	  };

	  VirtualSelection.prototype.setEnd = function (chunk, data) {
	    return this.end = new VirtualCursor(chunk, data);
	  };

	  VirtualSelection.prototype.setCaret = function (chunk, data) {
	    this.setStart(chunk, data);
	    return this.collapse();
	  };

	  VirtualSelection.prototype.toObject = function () {
	    var end, ref, ref1, ref2, ref3, start;
	    if (((ref = this.start) != null ? ref.chunk : void 0) == null || ((ref1 = this.start) != null ? ref1.data : void 0) == null) {
	      start = {
	        index: -1,
	        data: {}
	      };
	    } else {
	      start = {
	        index: this.start.chunk.get('index'),
	        data: Object.assign({}, this.start.data)
	      };
	    }
	    if (((ref2 = this.end) != null ? ref2.chunk : void 0) == null || ((ref3 = this.end) != null ? ref3.data : void 0) == null) {
	      end = {
	        index: -1,
	        data: {}
	      };
	    } else {
	      end = {
	        index: this.end.chunk.get('index'),
	        data: Object.assign({}, this.end.data)
	      };
	    }
	    return {
	      start: start,
	      end: end
	    };
	  };

	  VirtualSelection.prototype.fromObject = function (o) {
	    this.setStart(this.page.chunks.at(o.start.index), o.start.data);
	    return this.setEnd(this.page.chunks.at(o.end.index), o.end.data);
	  };

	  VirtualSelection.prototype.fromDOMSelection = function (domSelection) {
	    var endChunk, endChunkIndex, startChunk, startChunkIndex;
	    if (domSelection == null) {
	      domSelection = null;
	    }
	    if (domSelection == null) {
	      domSelection = DOMSelection.get();
	    }
	    startChunkIndex = DOMUtil.findParentAttr(domSelection.startContainer, 'data-component-index');
	    endChunkIndex = DOMUtil.findParentAttr(domSelection.endContainer, 'data-component-index');
	    if (!startChunkIndex || !endChunkIndex) {
	      return;
	    }
	    startChunk = this.page.chunks.at(startChunkIndex);
	    endChunk = this.page.chunks.at(endChunkIndex);
	    if (!startChunk || !endChunk) {
	      return;
	    }
	    this.setStart(startChunk, startChunk.getVirtualSelectionStartData());
	    return this.setEnd(endChunk, endChunk.getVirtualSelectionEndData());
	  };

	  VirtualSelection.prototype.__debug_print = function () {
	    return console.log(JSON.stringify(this.toObject(), null, 4));
	  };

	  return VirtualSelection;
	}();

	Object.defineProperties(VirtualSelection.prototype, {
	  "type": {
	    get: function get() {
	      var ref, ref1;
	      switch (false) {
	        case !(((ref = this.start) != null ? ref.chunk : void 0) == null || ((ref1 = this.end) != null ? ref1.chunk : void 0) == null):
	          return 'none';
	        case this.start.chunk.cid === this.end.chunk.cid:
	          return 'chunkSpan';
	        case !this.start.isEquivalentTo(this.end):
	          return 'caret';
	        default:
	          return 'textSpan';
	      }
	    }
	  },
	  "all": {
	    get: function get() {
	      var all, cur;
	      switch (this.type) {
	        case 'chunkSpan':
	          all = [];
	          cur = this.start.chunk;
	          while (cur != null && cur !== this.end.chunk.nextSibling()) {
	            all.push(cur);
	            cur = cur.nextSibling();
	          }
	          return all;
	        case 'textSpan':
	        case 'caret':
	          return all = [this.start.chunk];
	        default:
	          return [];
	      }
	    }
	  },
	  "inbetween": {
	    get: function get() {
	      var result;
	      if (this.type !== 'chunkSpan') {
	        return [];
	      }
	      result = this.all;
	      result.pop();
	      result.shift();
	      return result;
	    }
	  }
	});

	VirtualSelection.fromObject = function (page, o) {
	  var vs;
	  vs = new VirtualSelection(page);
	  vs.fromObject(page, o);
	  return vs;
	};

	VirtualSelection.fromDOMSelection = function (page, domSelection) {
	  var vs;
	  vs = new VirtualSelection(page);
	  vs.fromDOMSelection(domSelection);
	  return vs;
	};

	module.exports = VirtualSelection;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var StyleableTextComponent, StyleableTextRenderer, emptyChar;

	StyleableTextRenderer = __webpack_require__(91);

	emptyChar = __webpack_require__(22).EMPTY_CHAR;

	StyleableTextComponent = React.createClass({
	  displayName: 'StyleableTextComponent',

	  createChild: function createChild(el, key) {
	    var attrs, createChild, groupIndex, ref, ref1;
	    createChild = this.createChild;
	    groupIndex = this.props.groupIndex;
	    attrs = {
	      key: key.counter++
	    };
	    switch (el.type) {
	      case 'a':
	        if (((ref = el.attrs) != null ? ref.href : void 0) != null) {
	          attrs.href = el.attrs.href;
	          attrs.target = "_blank";
	        }
	        break;
	      case 'span':
	        if (((ref1 = el.attrs) != null ? ref1['class'] : void 0) != null) {
	          attrs.className = el.attrs['class'];
	        }
	    }
	    return React.createElement(el.type, attrs, el.children.map(function (child, index) {
	      switch (child.nodeType) {
	        case 'text':
	          if (child.html != null) {
	            return React.createElement('span', { key: key.counter++, dangerouslySetInnerHTML: { __html: child.html } });
	          } else if (child.text.length === 0) {
	            return React.createElement(
	              'span',
	              { key: key.counter++ },
	              emptyChar
	            );
	          } else if (child.text.charAt(child.text.length - 1) === "\n") {
	            return React.createElement(
	              'span',
	              { key: key.counter++ },
	              child.text,
	              emptyChar
	            );
	          } else {
	            return React.createElement(
	              'span',
	              { key: key.counter++ },
	              child.text
	            );
	          }
	          break;
	        default:
	          return createChild(child, key);
	      }
	    }));
	  },
	  render: function render() {
	    var key, mockElement;
	    key = {
	      counter: 0
	    };
	    mockElement = StyleableTextRenderer(this.props.text);
	    return React.createElement(
	      'span',
	      null,
	      this.createChild(mockElement, key)
	    );
	  }
	});

	module.exports = StyleableTextComponent;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var MockElement, MockTextNode, ORDER, ObjectAssign, StyleRange, StyleType, StyleableText, _debugPrintNode, _getHTML, applyStyle, getMockElement, getTextNodeFragmentDescriptorsAt, _getTextNodeFragmentDescriptorsAtHelper, katex, wrap, wrapElement;

	ObjectAssign = __webpack_require__(13);

	katex = __webpack_require__(60);

	StyleableText = __webpack_require__(10);

	StyleRange = __webpack_require__(17);

	StyleType = __webpack_require__(5);

	MockElement = __webpack_require__(86);

	MockTextNode = __webpack_require__(87);

	ORDER = [StyleType.COMMENT, StyleType.LATEX, StyleType.LINK, StyleType.QUOTE, StyleType.BOLD, StyleType.STRIKETHROUGH, StyleType.MONOSPACE, StyleType.SUPERSCRIPT, StyleType.ITALIC];

	_getTextNodeFragmentDescriptorsAtHelper = function getTextNodeFragmentDescriptorsAtHelper(stateObj, targetStartIndex, targetEndIndex) {
	  var charsRead, child, j, len, ref, results;
	  if (stateObj.curNode.nodeType === 'element') {
	    ref = stateObj.curNode.children;
	    results = [];
	    for (j = 0, len = ref.length; j < len; j++) {
	      child = ref[j];
	      stateObj.curNode = child;
	      results.push(_getTextNodeFragmentDescriptorsAtHelper(stateObj, targetStartIndex, targetEndIndex));
	    }
	    return results;
	  } else {
	    charsRead = stateObj.charsRead + stateObj.curNode.text.length;
	    if (charsRead >= targetEndIndex && stateObj.end === null) {
	      stateObj.end = {
	        node: stateObj.curNode,
	        startIndex: 0,
	        endIndex: targetEndIndex - stateObj.charsRead
	      };
	    } else if (stateObj.start !== null && stateObj.end === null) {
	      stateObj.inbetween.push({
	        node: stateObj.curNode,
	        startIndex: 0,
	        endIndex: 2e308
	      });
	    }
	    if (charsRead >= targetStartIndex && stateObj.start === null) {
	      stateObj.start = {
	        node: stateObj.curNode,
	        startIndex: targetStartIndex - stateObj.charsRead,
	        endIndex: 2e308
	      };
	    }
	    stateObj.last = {
	      node: stateObj.curNode,
	      startIndex: 0,
	      endIndex: 2e308
	    };
	    return stateObj.charsRead = charsRead;
	  }
	};

	getTextNodeFragmentDescriptorsAt = function getTextNodeFragmentDescriptorsAt(rootNode, startIndex, endIndex) {
	  var fragmentDescriptors, stateObj;
	  stateObj = {
	    charsRead: 0,
	    start: null,
	    inbetween: [],
	    end: null,
	    curNode: rootNode
	  };
	  _getTextNodeFragmentDescriptorsAtHelper(stateObj, startIndex, endIndex);
	  if (stateObj.end === null) {
	    stateObj.end = stateObj.last;
	  }
	  if (stateObj.start.node === stateObj.end.node) {
	    stateObj.start.endIndex = stateObj.end.endIndex;
	    stateObj.end = null;
	  }
	  fragmentDescriptors = stateObj.inbetween;
	  if (stateObj.start !== null) {
	    fragmentDescriptors.unshift(stateObj.start);
	  }
	  if (stateObj.end !== null) {
	    fragmentDescriptors.push(stateObj.end);
	  }
	  return fragmentDescriptors;
	};

	wrapElement = function wrapElement(styleRange, nodeToWrap, text) {
	  var html, level, newChild, node, root;
	  switch (styleRange.type) {
	    case 'sup':
	      level = styleRange.data;
	      if (level > 0) {
	        node = root = new MockElement('sup');
	        while (level > 1) {
	          newChild = new MockElement('sup');
	          node.addChild(newChild);
	          node = newChild;
	          level--;
	        }
	      } else {
	        level = Math.abs(level);
	        node = root = new MockElement('sub');
	        while (level > 1) {
	          newChild = new MockElement('sub');
	          node.addChild(newChild);
	          node = newChild;
	          level--;
	        }
	      }
	      nodeToWrap.parent.replaceChild(nodeToWrap, root);
	      node.addChild(nodeToWrap);
	      nodeToWrap.text = text;
	      return root;
	    case '_comment':
	      newChild = new MockElement('span', ObjectAssign({
	        'class': 'comment'
	      }, styleRange.data));
	      nodeToWrap.parent.replaceChild(nodeToWrap, newChild);
	      newChild.addChild(nodeToWrap);
	      nodeToWrap.text = text;
	      return newChild;
	    case '_latex':
	      newChild = new MockElement('span', ObjectAssign({
	        'class': 'latex'
	      }, styleRange.data));
	      nodeToWrap.parent.replaceChild(nodeToWrap, newChild);
	      newChild.addChild(nodeToWrap);
	      html = katex.renderToString(text);
	      nodeToWrap.html = html;
	      nodeToWrap.text = text;
	      return newChild;
	    default:
	      newChild = new MockElement(styleRange.type, ObjectAssign({}, styleRange.data));
	      nodeToWrap.parent.replaceChild(nodeToWrap, newChild);
	      newChild.addChild(nodeToWrap);
	      nodeToWrap.text = text;
	      return newChild;
	  }
	};

	wrap = function wrap(styleRange, nodeFragmentDescriptor) {
	  var fromPosition, leftText, newChild, nodeToWrap, rightText, text, toPosition, wrappedText;
	  nodeToWrap = nodeFragmentDescriptor.node;
	  text = nodeToWrap.text;
	  fromPosition = nodeFragmentDescriptor.startIndex;
	  toPosition = nodeFragmentDescriptor.endIndex;
	  leftText = text.substring(0, fromPosition);
	  wrappedText = text.substring(fromPosition, toPosition);
	  rightText = text.substring(toPosition);
	  if (wrappedText.length === 0) {
	    return;
	  }
	  if (leftText.length > 0) {
	    newChild = new MockTextNode(leftText);
	    nodeToWrap.parent.addBefore(newChild, nodeToWrap);
	  }
	  nodeToWrap = wrapElement(styleRange, nodeToWrap, wrappedText);
	  if (rightText.length > 0) {
	    newChild = new MockTextNode(rightText);
	    return nodeToWrap.parent.addAfter(newChild, nodeToWrap);
	  }
	};

	applyStyle = function applyStyle(el, styleRange) {
	  var fragmentDescriptor, fragmentDescriptors, i, j, ref, results;
	  fragmentDescriptors = getTextNodeFragmentDescriptorsAt(el, styleRange.start, styleRange.end);
	  results = [];
	  for (i = j = ref = fragmentDescriptors.length - 1; j >= 0; i = j += -1) {
	    fragmentDescriptor = fragmentDescriptors[i];
	    results.push(wrap(styleRange, fragmentDescriptor));
	  }
	  return results;
	};

	getMockElement = function getMockElement(styleableText) {
	  var j, k, len, len1, ref, root, styleRange, styleType;
	  root = new MockElement('span');
	  root.addChild(new MockTextNode(styleableText.value));
	  for (j = 0, len = ORDER.length; j < len; j++) {
	    styleType = ORDER[j];
	    ref = styleableText.styleList.styles;
	    for (k = 0, len1 = ref.length; k < len1; k++) {
	      styleRange = ref[k];
	      if (styleRange.type === styleType) {
	        applyStyle(root, styleRange);
	      }
	    }
	  }
	  return root;
	};

	_debugPrintNode = function __debugPrintNode(node, indent) {
	  var child, j, len, ref, results;
	  if (indent == null) {
	    indent = '';
	  }
	  if (node.nodeType === 'element') {
	    console.log(indent + node.type);
	    ref = node.children;
	    results = [];
	    for (j = 0, len = ref.length; j < len; j++) {
	      child = ref[j];
	      results.push(_debugPrintNode(child, indent + '  '));
	    }
	    return results;
	  } else {
	    return console.log(indent + '[' + node.text + ']');
	  }
	};

	_getHTML = function __getHTML(node) {
	  if (node.nodeType === 'text') {
	    return node.text;
	  }
	  return "<" + node.type + ">" + node.children.map(function (child) {
	    return _getHTML(child);
	  }).join('') + "</" + node.type + ">";
	};

	window.__getMockElement = getMockElement;

	window.__debugPrintNode = _debugPrintNode;

	window.__getHTML = _getHTML;

	module.exports = getMockElement;

/***/ }),
/* 92 */
/***/ (function(module, exports) {

	"use strict";

	var TextGroupCursor;

	TextGroupCursor = function () {
	  function TextGroupCursor(virtualCursor) {
	    this.virtualCursor = virtualCursor;
	  }

	  return TextGroupCursor;
	}();

	Object.defineProperties(TextGroupCursor.prototype, {
	  isTextStart: {
	    "get": function get() {
	      return this.offset === 0;
	    }
	  },
	  isTextEnd: {
	    "get": function get() {
	      return this.offset === this.text.length;
	    }
	  },
	  isFirstText: {
	    "get": function get() {
	      return this.groupIndex === 0;
	    }
	  },
	  isLastText: {
	    "get": function get() {
	      return this.groupIndex === this.textGroup.length - 1;
	    }
	  },
	  isGroupStart: {
	    "get": function get() {
	      return this.isTextStart && this.isFirstText;
	    }
	  },
	  isGroupEnd: {
	    "get": function get() {
	      return this.isTextEnd && this.isLastText;
	    }
	  },
	  textGroup: {
	    "get": function get() {
	      return this.virtualCursor.chunk.modelState.textGroup;
	    }
	  },
	  groupIndex: {
	    "get": function get() {
	      if (this.virtualCursor.data != null) {
	        return this.virtualCursor.data.groupIndex;
	      } else {
	        return -1;
	      }
	    }
	  },
	  offset: {
	    "get": function get() {
	      if (this.virtualCursor.data != null) {
	        return this.virtualCursor.data.offset;
	      } else {
	        return 0;
	      }
	    }
	  },
	  textGroupItem: {
	    "get": function get() {
	      return this.virtualCursor.chunk.modelState.textGroup.get(this.virtualCursor.data.groupIndex);
	    }
	  },
	  text: {
	    "get": function get() {
	      return this.textGroupItem.text;
	    }
	  }
	});

	module.exports = TextGroupCursor;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var DOMUtil, TextGroupCursor, TextGroupSelection, VirtualCursor, emptyChar, getCursors;

	TextGroupCursor = __webpack_require__(92);

	VirtualCursor = __webpack_require__(49);

	DOMUtil = __webpack_require__(16);

	emptyChar = __webpack_require__(22).EMPTY_CHAR;

	getCursors = function getCursors(chunk, virtualSelection) {
	  var chunkEnd, chunkStart, position;
	  if (!virtualSelection) {
	    return {
	      start: null,
	      end: null
	    };
	  }
	  chunkStart = TextGroupSelection.getGroupStartCursor(chunk);
	  chunkEnd = TextGroupSelection.getGroupEndCursor(chunk);
	  position = virtualSelection.getPosition(chunk);
	  switch (position) {
	    case 'start':
	      return {
	        start: new TextGroupCursor(virtualSelection.start),
	        end: chunkEnd
	      };
	    case 'end':
	      return {
	        start: chunkStart,
	        end: new TextGroupCursor(virtualSelection.end)
	      };
	    case 'contains':
	      return {
	        start: new TextGroupCursor(virtualSelection.start),
	        end: new TextGroupCursor(virtualSelection.end)
	      };
	    case 'inside':
	      return {
	        start: chunkStart,
	        end: chunkEnd
	      };
	    default:
	      return {
	        start: null,
	        end: null
	      };
	  }
	};

	TextGroupSelection = function () {
	  function TextGroupSelection(chunk1, virtualSelection1) {
	    this.chunk = chunk1;
	    this.virtualSelection = virtualSelection1;
	  }

	  TextGroupSelection.prototype.includes = function (item) {
	    var groupIndex;
	    if (this.type === 'none') {
	      return false;
	    }
	    groupIndex = item.index;
	    return this.start.groupIndex === groupIndex || this.end.groupIndex === groupIndex;
	  };

	  TextGroupSelection.prototype.selectGroup = function () {
	    return TextGroupSelection.selectGroup(this.chunk, this.virtualSelection);
	  };

	  TextGroupSelection.prototype.selectText = function (groupIndex) {
	    return TextGroupSelection.selectText(this.chunk, groupIndex, this.virtualSelection);
	  };

	  TextGroupSelection.prototype.setCaretToGroupStart = function () {
	    return TextGroupSelection.setCaretToGroupStart(this.chunk, this.virtualSelection);
	  };

	  TextGroupSelection.prototype.setCaretToTextStart = function (groupIndex) {
	    return TextGroupSelection.setCaretToTextStart(this.chunk, groupIndex, this.virtualSelection);
	  };

	  TextGroupSelection.prototype.setCaretToGroupEnd = function () {
	    return TextGroupSelection.setCaretToGroupEnd(this.chunk, this.virtualSelection);
	  };

	  TextGroupSelection.prototype.setCaretToTextEnd = function (groupIndex) {
	    return TextGroupSelection.setCaretToTextEnd(this.chunk, groupIndex, this.virtualSelection);
	  };

	  TextGroupSelection.prototype.setCaret = function (groupIndex, offset) {
	    return this.virtualSelection.setCaret(this.chunk, {
	      groupIndex: groupIndex,
	      offset: offset
	    });
	  };

	  TextGroupSelection.prototype.setStart = function (groupIndex, offset) {
	    return this.virtualSelection.setStart(this.chunk, {
	      groupIndex: groupIndex,
	      offset: offset
	    });
	  };

	  TextGroupSelection.prototype.setEnd = function (groupIndex, offset) {
	    return this.virtualSelection.setEnd(this.chunk, {
	      groupIndex: groupIndex,
	      offset: offset
	    });
	  };

	  TextGroupSelection.prototype.getAllSelectedTexts = function () {
	    var all, i, j, ref, ref1, ref2, ref3;
	    if (((ref = this.start) != null ? ref.text : void 0) == null || ((ref1 = this.end) != null ? ref1.text : void 0) == null) {
	      return [];
	    }
	    all = [];
	    for (i = j = ref2 = this.start.groupIndex, ref3 = this.end.groupIndex; ref2 <= ref3 ? j <= ref3 : j >= ref3; i = ref2 <= ref3 ? ++j : --j) {
	      all.push(this.chunk.modelState.textGroup.get(i));
	    }
	    return all;
	  };

	  return TextGroupSelection;
	}();

	Object.defineProperties(TextGroupSelection.prototype, {
	  type: {
	    get: function get() {
	      var cursors, position;
	      cursors = getCursors(this.chunk, this.virtualSelection);
	      position = this.position;
	      switch (false) {
	        case !(cursors.start === null || cursors.end === null):
	          return 'none';
	        case !(position === 'contains' && cursors.start.groupIndex === cursors.end.groupIndex && cursors.start.offset === cursors.end.offset):
	          return 'caret';
	        case cursors.start.groupIndex !== cursors.end.groupIndex:
	          return 'TextSpan';
	        default:
	          return 'multipleTextSpan';
	      }
	    }
	  },
	  start: {
	    get: function get() {
	      return getCursors(this.chunk, this.virtualSelection).start;
	    }
	  },
	  end: {
	    get: function get() {
	      return getCursors(this.chunk, this.virtualSelection).end;
	    }
	  },
	  position: {
	    get: function get() {
	      return this.virtualSelection.getPosition(this.chunk);
	    }
	  }
	});

	TextGroupSelection.getGroupStartCursor = function (chunk) {
	  return TextGroupSelection.getTextStartCursor(chunk, 0);
	};

	TextGroupSelection.getGroupEndCursor = function (chunk) {
	  return TextGroupSelection.getTextEndCursor(chunk, chunk.modelState.textGroup.length - 1);
	};

	TextGroupSelection.getTextStartCursor = function (chunk, groupIndex) {
	  var virtCur;
	  virtCur = new VirtualCursor(chunk, {
	    groupIndex: groupIndex,
	    offset: 0
	  });
	  return new TextGroupCursor(virtCur);
	};

	TextGroupSelection.getTextEndCursor = function (chunk, groupIndex) {
	  var virtCur;
	  virtCur = new VirtualCursor(chunk, {
	    groupIndex: groupIndex,
	    offset: chunk.modelState.textGroup.get(groupIndex).text.length
	  });
	  return new TextGroupCursor(virtCur);
	};

	TextGroupSelection.selectGroup = function (chunk, virtualSelection) {
	  var end, start;
	  start = TextGroupSelection.getGroupStartCursor(chunk);
	  end = TextGroupSelection.getGroupEndCursor(chunk);
	  virtualSelection.setStart(start.virtualCursor.chunk, start.virtualCursor.data);
	  return virtualSelection.setEnd(end.virtualCursor.chunk, end.virtualCursor.data);
	};

	TextGroupSelection.selectText = function (chunk, groupIndex, virtualSelection) {
	  var end, start;
	  start = TextGroupSelection.getTextStartCursor(chunk, groupIndex);
	  end = TextGroupSelection.getTextEndCursor(chunk, groupIndex);
	  virtualSelection.setStart(start.virtualCursor.chunk, start.virtualCursor.data);
	  return virtualSelection.setEnd(end.virtualCursor.chunk, end.virtualCursor.data);
	};

	TextGroupSelection.setCaretToGroupStart = function (chunk, virtualSelection) {
	  TextGroupSelection.selectGroup(chunk, virtualSelection);
	  return virtualSelection.collapse();
	};

	TextGroupSelection.setCaretToTextStart = function (chunk, groupIndex, virtualSelection) {
	  TextGroupSelection.selectText(chunk, groupIndex, virtualSelection);
	  return virtualSelection.collapse();
	};

	TextGroupSelection.setCaretToGroupEnd = function (chunk, virtualSelection) {
	  TextGroupSelection.selectGroup(chunk, virtualSelection);
	  return virtualSelection.collapseToEnd();
	};

	TextGroupSelection.setCaretToTextEnd = function (chunk, groupIndex, virtualSelection) {
	  TextGroupSelection.selectText(chunk, groupIndex, virtualSelection);
	  return virtualSelection.collapseToEnd();
	};

	TextGroupSelection.getCursorDataFromDOM = function (targetTextNode, offset) {
	  var anchor, groupIndex, groupIndexAttr, j, len, oboTextNode, ref, textNode, totalCharactersFromStart;
	  totalCharactersFromStart = 0;
	  oboTextNode = DOMUtil.findParentWithAttr(targetTextNode, 'data-group-index');
	  if (oboTextNode) {
	    groupIndexAttr = oboTextNode.getAttribute('data-group-index');
	    groupIndex = parseInt(groupIndexAttr, 10);
	    if (isNaN(groupIndex)) {
	      groupIndex = groupIndexAttr;
	    }
	  }
	  if (oboTextNode == null || oboTextNode.textContent === emptyChar) {
	    return {
	      offset: 0,
	      groupIndex: groupIndex
	    };
	  }
	  ref = DOMUtil.getTextNodesInOrder(oboTextNode);
	  for (j = 0, len = ref.length; j < len; j++) {
	    textNode = ref[j];
	    if (textNode === targetTextNode) {
	      break;
	    }
	    totalCharactersFromStart += textNode.nodeValue.length;
	  }
	  anchor = false;
	  if (groupIndexAttr.indexOf('anchor:') === 0) {
	    anchor = groupIndexAttr.substr(groupIndexAttr.indexOf(':') + 1);
	  }
	  offset += totalCharactersFromStart;
	  if (anchor) {
	    offset = 0;
	  }
	  return {
	    offset: offset,
	    groupIndex: groupIndex
	  };
	};

	module.exports = TextGroupSelection;

/***/ }),
/* 94 */
/***/ (function(module, exports) {

	"use strict";

	module.exports = function (asset) {
	  return "url('" + asset.replace(/'/g, "\\'") + "')";
	};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Dispatcher, ModalUtil;

	Dispatcher = __webpack_require__(4);

	ModalUtil = {
	  show: function show(component) {
	    return Dispatcher.trigger('modal:show', {
	      value: {
	        component: component
	      }
	    });
	  },
	  hide: function hide() {
	    return Dispatcher.trigger('modal:hide');
	  },
	  getCurrentModal: function getCurrentModal(state) {
	    if (state.modals.length === 0) {
	      return null;
	    }
	    return state.modals[0];
	  }
	};

	module.exports = ModalUtil;

/***/ }),
/* 96 */
/***/ (function(module, exports) {

	"use strict";

	module.exports = function () {
	  var _getId;
	  _getId = function getId(a) {
	    if (a) {
	      return (a ^ Math.random() * 16 >> a / 4).toString(16);
	    } else {
	      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, _getId);
	    }
	  };
	  return _getId();
	};

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  Common: {
	    chunk: {
	      BaseSelectionHandler: __webpack_require__(29),
	      FocusableChunk: __webpack_require__(161),
	      focusableChunk: {
	        FocusableSelectionHandler: __webpack_require__(77),
	        ToggleSelectionHandler: __webpack_require__(162)
	      },
	      NonEditableChunk: __webpack_require__(163),
	      TextChunk: __webpack_require__(164),
	      textChunk: {
	        TextGroupSelectionHandler: __webpack_require__(167),
	        TextGroupEl: __webpack_require__(78),
	        Linkify: __webpack_require__(165),
	        TextGroupAdapter: __webpack_require__(166)
	      },
	      util: {
	        ChunkUtil: __webpack_require__(168),
	        Insert: __webpack_require__(169),
	        InsertWithText: __webpack_require__(170)
	      }
	    },
	    components: {
	      OboComponent: __webpack_require__(177),
	      Anchor: __webpack_require__(79),
	      DeleteButton: __webpack_require__(46),
	      EditButton: __webpack_require__(171),
	      Button: __webpack_require__(80),
	      modal: {
	        bubble: {
	          Bubble: __webpack_require__(81),
	          SingleInputBubble: __webpack_require__(173)
	        },
	        Question: __webpack_require__(174),
	        SimpleMessage: __webpack_require__(175),
	        Modal: __webpack_require__(84),
	        Dialog: __webpack_require__(82),
	        SimpleDialog: __webpack_require__(85),
	        ErrorDialog: __webpack_require__(83)
	      },
	      TextMenu: __webpack_require__(178),
	      ModalContainer: __webpack_require__(176),
	      FocusBlocker: __webpack_require__(172)
	    },
	    flux: {
	      Store: __webpack_require__(47),
	      Dispatcher: __webpack_require__(4)
	    },
	    mockDOM: {
	      MockElement: __webpack_require__(86),
	      MockTextNode: __webpack_require__(87)
	    },
	    models: {
	      OboModel: __webpack_require__(15),
	      Legacy: __webpack_require__(179)
	    },
	    net: {
	      API: __webpack_require__(180)
	    },
	    selection: {
	      ChunkSelection: __webpack_require__(184),
	      Cursor: __webpack_require__(88),
	      DOMSelection: __webpack_require__(21),
	      OboSelectionRect: __webpack_require__(48),
	      Selection: __webpack_require__(185),
	      VirtualCursor: __webpack_require__(49),
	      VirtualCursorData: __webpack_require__(186),
	      VirtualSelection: __webpack_require__(89)
	    },
	    stores: {
	      ModalStore: __webpack_require__(188),
	      FocusStore: __webpack_require__(187)
	    },
	    page: {
	      DOMUtil: __webpack_require__(16),
	      Head: __webpack_require__(181),
	      Keyboard: __webpack_require__(182),
	      Screen: __webpack_require__(183)
	    },
	    text: {
	      ChunkStyleList: __webpack_require__(30),
	      StyleableText: __webpack_require__(10),
	      StyleableTextComponent: __webpack_require__(90),
	      StyleableTextRenderer: __webpack_require__(91),
	      StyleRange: __webpack_require__(17),
	      StyleType: __webpack_require__(5),
	      TextConstants: __webpack_require__(22)
	    },
	    textGroup: {
	      TextGroup: __webpack_require__(31),
	      TextGroupCursor: __webpack_require__(92),
	      TextGroupItem: __webpack_require__(32),
	      TextGroupSelection: __webpack_require__(93),
	      TextGroupUtil: __webpack_require__(20)
	    },
	    util: {
	      Console: __webpack_require__(189),
	      getBackgroundImage: __webpack_require__(94),
	      HtmlUtil: __webpack_require__(33),
	      ModalUtil: __webpack_require__(95),
	      FocusUtil: __webpack_require__(50),
	      ErrorUtil: __webpack_require__(190),
	      UUID: __webpack_require__(96),
	      OboGlobals: __webpack_require__(191)
	    }
	  }
	};

/***/ }),
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var Anchor;

	Anchor = __webpack_require__(79);

	module.exports = React.createClass({
	  displayName: 'exports',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      indent: 0,
	      spellcheck: true
	    };
	  },
	  getAnchorNode: function getAnchorNode() {
	    var ref, ref1, ref2;
	    if (((ref = this.refs) != null ? (ref1 = ref.anchor) != null ? (ref2 = ref1.refs) != null ? ref2.anchorElement : void 0 : void 0 : void 0) == null) {
	      return null;
	    }
	    return this.refs.anchor.refs.anchorElement;
	  },
	  render: function render() {
	    var className;
	    className = this.props.className;
	    return React.createElement(
	      'div',
	      { className: 'focusable-chunk anchor-container' + (className ? ' ' + className : ''), contentEditable: 'false' },
	      React.createElement(Anchor, _extends({}, this.props, { name: 'main', ref: 'anchor' })),
	      this.props.children
	    );
	  }
	});

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var BaseSelectionHandler,
	    FocusableSelectionHandler,
	    ToggleSelectionHandler,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	BaseSelectionHandler = __webpack_require__(29);

	FocusableSelectionHandler = __webpack_require__(77);

	ToggleSelectionHandler = function (superClass) {
	  extend(ToggleSelectionHandler, superClass);

	  function ToggleSelectionHandler(textSelectionHandler, focusSelectionHandler) {
	    this.textSelectionHandler = textSelectionHandler;
	    this.focusSelectionHandler = focusSelectionHandler != null ? focusSelectionHandler : new FocusableSelectionHandler();
	  }

	  ToggleSelectionHandler.prototype.getCopyOfSelection = function (selection, chunk, cloneId) {
	    if (chunk.isEditing()) {
	      return this.textSelectionHandler.getCopyOfSelection.apply(this, arguments);
	    } else {
	      return this.focusSelectionHandler.getCopyOfSelection.apply(this, arguments);
	    }
	  };

	  ToggleSelectionHandler.prototype.selectAll = function (selection, chunk) {
	    if (chunk.isEditing()) {
	      return this.textSelectionHandler.selectAll.apply(this, arguments);
	    } else {
	      return this.focusSelectionHandler.selectAll.apply(this, arguments);
	    }
	  };

	  ToggleSelectionHandler.prototype.selectStart = function (selection, chunk, asRange) {
	    if (asRange == null) {
	      asRange = false;
	    }
	    if (chunk.isEditing()) {
	      return this.textSelectionHandler.selectStart.apply(this, arguments);
	    } else {
	      return this.focusSelectionHandler.selectStart.apply(this, arguments);
	    }
	  };

	  ToggleSelectionHandler.prototype.selectEnd = function (selection, chunk, asRange) {
	    if (asRange == null) {
	      asRange = false;
	    }
	    if (chunk.isEditing()) {
	      return this.textSelectionHandler.selectEnd.apply(this, arguments);
	    } else {
	      return this.focusSelectionHandler.selectEnd.apply(this, arguments);
	    }
	  };

	  ToggleSelectionHandler.prototype.getVirtualSelectionStartData = function (selection, chunk, text, html) {
	    if (chunk.isEditing()) {
	      return this.textSelectionHandler.getVirtualSelectionStartData.apply(this, arguments);
	    } else {
	      return this.focusSelectionHandler.getVirtualSelectionStartData.apply(this, arguments);
	    }
	  };

	  ToggleSelectionHandler.prototype.getVirtualSelectionEndData = function (selection, chunk, text, html) {
	    if (chunk.isEditing()) {
	      return this.textSelectionHandler.getVirtualSelectionEndData.apply(this, arguments);
	    } else {
	      return this.focusSelectionHandler.getVirtualSelectionEndData.apply(this, arguments);
	    }
	  };

	  ToggleSelectionHandler.prototype.getDOMSelectionStart = function (selection, chunk, text, html) {
	    if (chunk.isEditing()) {
	      return this.textSelectionHandler.getDOMSelectionStart.apply(this, arguments);
	    } else {
	      return this.focusSelectionHandler.getDOMSelectionStart.apply(this, arguments);
	    }
	  };

	  ToggleSelectionHandler.prototype.getDOMSelectionEnd = function (selection, chunk, text, html) {
	    if (chunk.isEditing()) {
	      return this.textSelectionHandler.getDOMSelectionEnd.apply(this, arguments);
	    } else {
	      return this.focusSelectionHandler.getDOMSelectionEnd.apply(this, arguments);
	    }
	  };

	  ToggleSelectionHandler.prototype.areCursorsEquivalent = function (selection, chunk, text, html) {
	    if (chunk.isEditing()) {
	      return this.textSelectionHandler.areCursorsEquivalent.apply(this, arguments);
	    } else {
	      return this.focusSelectionHandler.areCursorsEquivalent.apply(this, arguments);
	    }
	  };

	  return ToggleSelectionHandler;
	}(BaseSelectionHandler);

	module.exports = ToggleSelectionHandler;

/***/ }),
/* 163 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = React.createClass({
	  displayName: 'exports',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      indent: 0
	    };
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'non-editable-chunk' + (this.props.className ? ' ' + this.props.className : ''), contentEditable: 'false', 'data-indent': this.props.indent },
	      this.props.children
	    );
	  }
	});

/***/ }),
/* 164 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = React.createClass({
	  displayName: 'exports',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      indent: 0
	    };
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'text-chunk' + (this.props.className ? ' ' + this.props.className : '') },
	      this.props.children
	    );
	  }
	});

/***/ }),
/* 165 */
/***/ (function(module, exports) {

	"use strict";

	var regex;

	regex = new RegExp("(?:(?:https?)://)?" + "(?:\\S+(?::\\S*)?@)?" + "(?:" + "(?!(?:10|127)(?:\\.\\d{1,3}){3})" + "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" + "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" + "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" + "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" + "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" + "|" + "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" + "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" + "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" + "\\.?" + ")" + "(?::\\d{2,5})?" + "(?:[/?#]\\S*)?", "gi");

	module.exports = function (chunk, targetTextGroupItem) {
	  var i, len, link, links, results, selection, styleApplied, styleableText;
	  console.time('linkify');
	  styleApplied = false;
	  links = [];
	  selection = chunk.page.module.app.selection;
	  styleableText = targetTextGroupItem.text;
	  while ((results = regex.exec(styleableText.value)) !== null) {
	    links.unshift([results.index, regex.lastIndex, styleableText.value.substring(results.index, regex.lastIndex)]);
	  }
	  if (links.length === 0) {
	    return false;
	  }
	  selection.saveVirtualSelection();
	  for (i = 0, len = links.length; i < len; i++) {
	    link = links[i];
	    selection.virtual.start.data.groupIndex = targetTextGroupItem.index;
	    selection.virtual.end.data.groupIndex = selection.virtual.start.data.groupIndex;
	    selection.virtual.start.data.offset = link[0];
	    selection.virtual.end.data.offset = link[1];
	    if (chunk.getSelectionStyles().a == null) {
	      if (link[2].indexOf('http') !== 0) {
	        link[2] = 'http://' + link[2];
	      }
	      chunk.styleSelection('a', {
	        href: link[2]
	      });
	      styleApplied = true;
	    }
	  }
	  selection.restoreVirtualSelection();
	  console.timeEnd('linkify');
	  return styleApplied;
	};

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var TextGroup, TextGroupAdapter;

	TextGroup = __webpack_require__(31);

	TextGroupAdapter = {
	  construct: function construct(model, attrs) {
	    var ref;
	    if ((attrs != null ? (ref = attrs.content) != null ? ref.textGroup : void 0 : void 0) != null) {
	      return model.modelState.textGroup = TextGroup.fromDescriptor(attrs.content.textGroup, 2e308, {
	        indent: 0,
	        align: 'left'
	      });
	    } else {
	      return model.modelState.textGroup = TextGroup.create(2e308, {
	        indent: 0,
	        align: 'left'
	      });
	    }
	  },
	  clone: function clone(model, _clone) {
	    return _clone.modelState.textGroup = model.modelState.textGroup.clone();
	  },
	  toJSON: function toJSON(model, json) {
	    return json.content.textGroup = model.modelState.textGroup.toDescriptor();
	  },
	  toText: function toText(model) {
	    return model.modelState.textGroup.first.text.value;
	  }
	};

	module.exports = TextGroupAdapter;

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var BaseSelectionHandler,
	    TextGroupEl,
	    TextGroupSelection,
	    TextGroupSelectionHandler,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	BaseSelectionHandler = __webpack_require__(29);

	TextGroupSelection = __webpack_require__(93);

	TextGroupEl = __webpack_require__(78);

	TextGroupSelectionHandler = function (superClass) {
	  extend(TextGroupSelectionHandler, superClass);

	  function TextGroupSelectionHandler() {
	    return TextGroupSelectionHandler.__super__.constructor.apply(this, arguments);
	  }

	  TextGroupSelectionHandler.prototype.selectStart = function (selection, chunk, asRange) {
	    if (asRange == null) {
	      asRange = false;
	    }
	    selection.virtual.start = TextGroupSelection.getGroupStartCursor(chunk).virtualCursor;
	    if (!asRange) {
	      return selection.virtual.collapse();
	    }
	  };

	  TextGroupSelectionHandler.prototype.selectEnd = function (selection, chunk, asRange) {
	    if (asRange == null) {
	      asRange = false;
	    }
	    selection.virtual.end = TextGroupSelection.getGroupEndCursor(chunk).virtualCursor;
	    if (!asRange) {
	      return selection.virtual.collapseToEnd();
	    }
	  };

	  TextGroupSelectionHandler.prototype.selectAll = function (selection, chunk) {
	    return TextGroupSelection.selectGroup(chunk, selection.virtual);
	  };

	  TextGroupSelectionHandler.prototype.getCopyOfSelection = function (selection, chunk, cloneId) {
	    var chunkEnd, chunkStart, clone, position, sel;
	    if (cloneId == null) {
	      cloneId = false;
	    }
	    clone = chunk.clone(cloneId);
	    position = selection.virtual.getPosition(chunk);
	    if (position === 'contains' || position === 'start' || position === 'end') {
	      sel = new TextGroupSelection(chunk, selection.virtual);
	      chunkStart = TextGroupSelection.getGroupStartCursor(chunk);
	      chunkEnd = TextGroupSelection.getGroupEndCursor(chunk);
	      clone.modelState.textGroup.deleteSpan(sel.end.groupIndex, sel.end.offset, chunkEnd.groupIndex, chunkEnd.offset, true, this.mergeTextGroups);
	      clone.modelState.textGroup.deleteSpan(chunkStart.groupIndex, chunkStart.offset, sel.start.groupIndex, sel.start.offset, true, this.mergeTextGroups);
	    }
	    return clone;
	  };

	  TextGroupSelectionHandler.prototype.getVirtualSelectionStartData = function (selection, chunk) {
	    var ref;
	    if (((ref = selection.dom) != null ? ref.startText : void 0) == null) {
	      return null;
	    }
	    return TextGroupSelection.getCursorDataFromDOM(selection.dom.startText, selection.dom.startOffset);
	  };

	  TextGroupSelectionHandler.prototype.getVirtualSelectionEndData = function (selection, chunk) {
	    var ref;
	    if (((ref = selection.dom) != null ? ref.startText : void 0) == null) {
	      return null;
	    }
	    return TextGroupSelection.getCursorDataFromDOM(selection.dom.endText, selection.dom.endOffset);
	  };

	  TextGroupSelectionHandler.prototype.getDOMSelectionStart = function (selection, chunk) {
	    return TextGroupEl.getDomPosition(selection.virtual.start);
	  };

	  TextGroupSelectionHandler.prototype.getDOMSelectionEnd = function (selection, chunk) {
	    return TextGroupEl.getDomPosition(selection.virtual.end);
	  };

	  TextGroupSelectionHandler.prototype.areCursorsEquivalent = function (selectionWhichIsNullTODO, chunk, thisCursor, otherCursor) {
	    return thisCursor.chunk === otherCursor.chunk && thisCursor.data.offset === otherCursor.data.offset && thisCursor.data.groupIndex === otherCursor.data.groupIndex;
	  };

	  TextGroupSelectionHandler.prototype.highlightSelection = function (selection, chunk) {
	    var sel;
	    chunk.markDirty();
	    sel = new TextGroupSelection(chunk, selection.virtual);
	    return chunk.modelState.textGroup.styleText(sel.start.groupIndex, sel.start.offset, sel.end.groupIndex, sel.end.offset, '_comment', {});
	  };

	  return TextGroupSelectionHandler;
	}(BaseSelectionHandler);

	module.exports = TextGroupSelectionHandler;

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk, activateStyle, deleteSelection, replaceTextsWithinSelection, send;

	Chunk = __webpack_require__(15);

	send = function send(fn, chunkOrChunks, selection, data) {
	  var chunk, chunks, i, len, results;
	  if (data == null) {
	    data = [];
	  }
	  if (!(chunkOrChunks instanceof Array)) {
	    return chunkOrChunks.callCommandFn(fn, data);
	  }
	  chunks = chunkOrChunks;
	  results = [];
	  for (i = 0, len = chunks.length; i < len; i++) {
	    chunk = chunks[i];
	    results.push(chunk.callCommandFn(fn, data));
	  }
	  return results;
	};

	deleteSelection = function deleteSelection(selection) {
	  var i, len, node, ref;
	  if (selection.virtual.type === 'caret') {
	    return;
	  }
	  ref = selection.virtual.inbetween;
	  for (i = 0, len = ref.length; i < len; i++) {
	    node = ref[i];
	    node.remove();
	  }
	  selection.saveVirtualSelection();
	  selection.startChunk.deleteSelection();
	  selection.restoreVirtualSelection();
	  if (selection.virtual.type === 'chunkSpan') {
	    selection.endChunk.deleteSelection();
	    if (selection.endChunk.canMergeWith(selection.startChunk)) {
	      selection.startChunk.merge(selection.endChunk);
	    }
	  }
	  return selection.virtual.collapse();
	};

	replaceTextsWithinSelection = function replaceTextsWithinSelection(selection, newChunk, expandSelection) {
	  var end;
	  if (expandSelection == null) {
	    expandSelection = true;
	  }
	  selection.virtual.start.chunk.addChildBefore(newChunk);
	  if (expandSelection) {
	    selection.virtual.start.data.offset = 0;
	    end = selection.virtual.end;
	    end.data.offset = end.chunk.modelState.textGroup.get(end.data.groupIndex).text.length;
	  }
	  return newChunk.replaceSelection();
	};

	activateStyle = function activateStyle(style, selection, styleBrush, data) {
	  if (data == null) {
	    data = null;
	  }
	  if (selection.virtual.type === 'caret') {
	    return styleBrush.add(style, selection.styles[style] != null);
	  } else {
	    if (selection.styles[style] != null) {
	      return send('unstyleSelection', selection.virtual.all, selection, [style, data]);
	    } else {
	      return send('styleSelection', selection.virtual.all, selection, [style, data]);
	    }
	  }
	};

	module.exports = {
	  send: send,
	  deleteSelection: deleteSelection,
	  activateStyle: activateStyle,
	  replaceTextsWithinSelection: replaceTextsWithinSelection
	};

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk;

	Chunk = __webpack_require__(15);

	module.exports = function (componentClass, position, referenceChunk, selection, callback) {
	  var newChunk;
	  newChunk = Chunk.create(componentClass);
	  switch (position) {
	    case 'before':
	      referenceChunk.addChildBefore(newChunk);
	      break;
	    case 'after':
	      referenceChunk.addChildAfter(newChunk);
	  }
	  newChunk.selectStart();
	  return callback();
	};

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk;

	Chunk = __webpack_require__(15);

	module.exports = function (componentClass, position, referenceChunk, selection, callback) {
	  var extraChunk, newChunk;
	  newChunk = Chunk.create(componentClass);
	  extraChunk = null;
	  switch (position) {
	    case 'before':
	      referenceChunk.addChildBefore(newChunk);
	      if (newChunk.isFirst()) {
	        newChunk.addChildBefore(Chunk.create());
	      }
	      break;
	    case 'after':
	      referenceChunk.addChildAfter(newChunk);
	      if (newChunk.isLast()) {
	        newChunk.addChildAfter(Chunk.create());
	      }
	  }
	  newChunk.selectStart();
	  return callback();
	};

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var editButton, getBackgroundImage;

	__webpack_require__(271);

	getBackgroundImage = __webpack_require__(94);

	editButton = __webpack_require__(295);

	module.exports = React.createClass({
	  displayName: 'exports',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      indent: 0
	    };
	  },
	  render: function render() {
	    var editButtonStyles;
	    editButtonStyles = {
	      backgroundImage: Common.util.getBackgroundImage(editButton)
	    };
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--components--edit-button' },
	      React.createElement(
	        'button',
	        {
	          onClick: this.props.onClick,
	          style: editButtonStyles,
	          tabIndex: this.props.shouldPreventTab ? '-1' : 1,
	          disabled: this.props.shouldPreventTab
	        },
	        'Edit'
	      )
	    );
	  }
	});

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var FocusBlocker, FocusUtil;

	__webpack_require__(272);

	FocusUtil = __webpack_require__(50);

	FocusBlocker = React.createClass({
	  displayName: 'FocusBlocker',

	  render: function render() {
	    return React.createElement('div', { className: 'viewer--components--focus-blocker' });
	  }
	});

	module.exports = FocusBlocker;

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Bubble;

	__webpack_require__(274);

	Bubble = __webpack_require__(81);

	module.exports = React.createClass({
	  displayName: 'exports',

	  onChange: function onChange(event) {
	    console.log('BubbleChange', event.target.value);
	    return this.props.onChange(event.target.value);
	  },
	  onSubmit: function onSubmit(event) {
	    event.preventDefault();
	    return this.props.onClose();
	  },
	  onKeyUp: function onKeyUp(event) {
	    console.log(event.keyCode);
	    if (event.keyCode === 27) {
	      return this.props.onCancel();
	    }
	  },
	  componentDidMount: function componentDidMount() {
	    return setTimeout(function () {
	      return this.refs.input.select();
	    }.bind(this));
	  },
	  render: function render() {
	    console.log('BubbleRender', this.props.value);
	    return React.createElement(
	      Bubble,
	      null,
	      React.createElement(
	        'label',
	        { className: 'single-input-bubble' },
	        React.createElement(
	          'form',
	          { className: 'interactable', onSubmit: this.onSubmit },
	          React.createElement('input', { ref: 'input', type: 'text', value: this.props.value, onChange: this.onChange, onKeyUp: this.onKeyUp }),
	          React.createElement(
	            'button',
	            { onClick: this.onSubmit },
	            'Ok'
	          )
	        ),
	        React.createElement(
	          'span',
	          { className: 'label' },
	          this.props.label
	        )
	      )
	    );
	  }
	});

/***/ }),
/* 174 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = React.createClass({
		displayName: 'exports',

		render: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'p',
					null,
					this.props.children
				),
				React.createElement(
					'button',
					{ onClick: this.props.modal.onButtonClick.bind(this, this.props.cancelOnReject ? this.props.cancel : this.props.reject) },
					this.props.rejectButtonLabel || 'No'
				),
				React.createElement(
					'button',
					{ onClick: this.props.modal.onButtonClick.bind(this, this.props.confirm) },
					this.props.confirmButtonLabel || 'Yes'
				)
			);
		}
	});

/***/ }),
/* 175 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = React.createClass({
		displayName: 'exports',

		render: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'p',
					null,
					this.props.children
				),
				React.createElement(
					'button',
					{ onClick: this.props.modal.onButtonClick.bind(this, this.props.confirm) },
					this.props.buttonLabel || 'OK'
				)
			);
		}
	});

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(279);

	module.exports = React.createClass({
		displayName: "exports",

		render: function render() {
			return React.createElement(
				"div",
				{ className: "obojobo-draft--components--modal-container" },
				React.createElement(
					"div",
					{ className: "content" },
					this.props.children
				)
			);
		}
	});

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var FocusUtil, OboComponent;

	FocusUtil = __webpack_require__(50);

	OboComponent = React.createClass({
	  displayName: 'OboComponent',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      tag: 'div'
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    return this.props.model.processTrigger('onMount');
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    return this.props.model.processTrigger('onUnmount');
	  },
	  render: function render() {
	    var Component, Tag, className, isFocussed;
	    Component = this.props.model.getComponentClass();
	    Tag = this.props.tag;
	    className = 'component';
	    if (this.props.className != null) {
	      className += ' ' + this.props.className;
	    }
	    isFocussed = FocusUtil.getFocussedComponent(this.props.moduleData.focusState) === this.props.model;
	    return React.createElement(
	      Tag,
	      _extends({}, this.props, {
	        className: className,
	        id: 'obo-' + this.props.model.get('id'),
	        'data-obo-component': true,
	        'data-id': this.props.model.get('id'),
	        'data-type': this.props.model.get('type'),
	        'data-focussed': isFocussed
	      }),
	      this.props.children
	    );
	  }
	});

	module.exports = OboComponent;

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var TextMenu;

	__webpack_require__(280);

	TextMenu = React.createClass({
	  displayName: 'TextMenu',

	  renderImg: function renderImg(command) {
	    if (command.image == null) {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'span',
	          null,
	          command.label
	        ),
	        React.createElement('img', { className: 'click-blocker' })
	      );
	    }
	    return React.createElement('img', {
	      src: command.image,
	      alt: command.label,
	      title: command.label
	    });
	  },
	  onMouseDown: function onMouseDown(label, event) {
	    console.log(arguments);
	    event.preventDefault();
	    event.stopPropagation();
	    return this.props.commandHandler(label);
	  },
	  render: function render() {
	    var ctrlRect, renderImg, selRect;
	    if (!this.props.relativeToElement) {
	      return null;
	    }
	    if (!this.props.enabled) {
	      return null;
	    }
	    ctrlRect = this.props.relativeToElement.getBoundingClientRect();
	    selRect = this.props.selectionRect;
	    renderImg = this.renderImg;
	    if (!selRect || !this.props.commands || this.props.commands.length === 0) {
	      return null;
	    }
	    return React.createElement('div', {
	      className: 'editor--components--text-menu',
	      style: {
	        left: selRect.left + selRect.width / 2 - ctrlRect.left + 'px',
	        top: selRect.top - ctrlRect.top + 'px'
	      }
	    }, this.props.commands.map(function (command, index) {
	      return React.createElement('a', {
	        onMouseDown: this.onMouseDown.bind(null, command.label),
	        key: index
	      }, renderImg(command));
	    }.bind(this)));
	  }
	});

	module.exports = TextMenu;

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Legacy, OboModel, StyleableText, patternAddUL, patternRemoveExtraUL, patternTF;

	patternAddUL = /<LI>([\s\S]*?)<\/LI>/gi;

	patternRemoveExtraUL = /<\/ul><ul>/gi;

	patternTF = /<\/?textformat\s?[\s\S]*?>/gi;

	OboModel = __webpack_require__(15);

	StyleableText = __webpack_require__(10);

	Legacy = {
	  createModuleFromObo2ModuleJSON: function createModuleFromObo2ModuleJSON(json) {
	    var content, i, len, objective, objectivePage, oboModule, page, ref;
	    oboModule = OboModel.create('ObojoboDraft.Modules.Module');
	    objective = OboModel.create('ObojoboDraft.Sections.Content');
	    objectivePage = OboModel.create('ObojoboDraft.Pages.Page');
	    objective.children.add(objectivePage);
	    objectivePage.children.add(Legacy.createChunksFromObo2HTML(json.objective));
	    content = OboModel.create('ObojoboDraft.Sections.Content');
	    ref = json.pages;
	    for (i = 0, len = ref.length; i < len; i++) {
	      page = ref[i];
	      content.children.add(Legacy.createPageFromObo2ModuleJSON(page));
	    }
	    oboModule.children.add(objective);
	    oboModule.children.add(content);
	    return oboModule;
	  },
	  createPageFromObo2ModuleJSON: function createPageFromObo2ModuleJSON(json) {
	    var header, i, item, len, page, ref;
	    page = OboModel.create('ObojoboDraft.Pages.Page');
	    header = OboModel.create('ObojoboDraft.Chunks.Heading');
	    header.modelState.textGroup.first.text.value = json.title;
	    page.children.add(header);
	    ref = json.items;
	    for (i = 0, len = ref.length; i < len; i++) {
	      item = ref[i];
	      switch (item.component) {
	        case 'TextArea':
	          page.children.add(Legacy.createChunksFromObo2HTML(item.data));
	          break;
	        case 'MediaView':
	          page.children.add(Legacy.createMediaFromObo2JSON(item.media));
	      }
	    }
	    return page;
	  },
	  createChunksFromObo2HTML: function createChunksFromObo2HTML(html) {
	    var child, chunk, chunks, el, i, j, len, len1, ref, st, sts, tg;
	    chunks = [];
	    html = html.replace(patternTF, "");
	    html = html.replace(patternAddUL, "<ul><li>$1</li></ul>");
	    html = html.replace(patternRemoveExtraUL, "");
	    el = document.createElement('div');
	    document.body.appendChild(el);
	    el.innerHTML = html;
	    sts = null;
	    ref = el.children;
	    for (i = 0, len = ref.length; i < len; i++) {
	      child = ref[i];
	      switch (child.tagName.toLowerCase()) {
	        case 'ul':
	          chunk = OboModel.create('ObojoboDraft.Chunks.List');
	          break;
	        default:
	          chunk = OboModel.create('ObojoboDraft.Chunks.Text');
	      }
	      tg = chunk.modelState.textGroup;
	      tg.clear();
	      sts = StyleableText.createFromElement(child);
	      for (j = 0, len1 = sts.length; j < len1; j++) {
	        st = sts[j];
	        tg.add(st);
	      }
	      chunks.push(chunk);
	    }
	    document.body.removeChild(el);
	    console.log('-----------------');
	    console.log(html);
	    console.log(el.innerHTML);
	    console.log(chunks);
	    console.log(sts);
	    return chunks;
	  },
	  createMediaFromObo2JSON: function createMediaFromObo2JSON(json) {
	    return OboModel.create('ObojoboDraft.Chunks.Figure');
	  }
	};

	module.exports = Legacy;

/***/ }),
/* 180 */
/***/ (function(module, exports) {

	"use strict";

	var API, APIChunk, APIModule, makeRequest;

	makeRequest = function makeRequest(method, url, data, callback) {
	  var a, k, request, v;
	  if (data == null) {
	    data = null;
	  }
	  if (callback == null) {
	    callback = function callback() {};
	  }
	  request = new XMLHttpRequest();
	  request.addEventListener('load', callback);
	  request.open(method, url, true);
	  if (data != null) {
	    a = [];
	    for (k in data) {
	      v = data[k];
	      a.push(k + "=" + v);
	    }
	    data = a.join("&");
	    return request.send(data);
	  } else {
	    return request.send();
	  }
	};

	APIModule = function () {
	  function APIModule() {}

	  APIModule.prototype.get = function (moduleId, callback) {
	    return makeRequest('GET', "/api/draft/" + moduleId + "/chunks", null, function (event) {
	      return callback({
	        id: moduleId,
	        chunks: JSON.parse(event.target.responseText)
	      });
	    }.bind(this));
	  };

	  return APIModule;
	}();

	APIChunk = function () {
	  function APIChunk() {}

	  APIChunk.prototype.move = function (chunkMoved, chunkBefore, callback) {
	    var beforeId;
	    console.log(arguments);
	    beforeId = chunkBefore != null ? chunkBefore.get('id') : null;
	    return makeRequest('POST', "/api/chunk/" + chunkMoved.get('id') + "/move_before", {
	      before_chunk_id: beforeId
	    }, callback);
	  };

	  return APIChunk;
	}();

	API = function () {
	  function API() {}

	  return API;
	}();

	Object.defineProperties(API.prototype, {
	  "module": {
	    get: function get() {
	      return new APIModule();
	    }
	  },
	  "chunk": {
	    get: function get() {
	      return new APIChunk();
	    }
	  }
	});

	module.exports = new API();

/***/ }),
/* 181 */
/***/ (function(module, exports) {

	'use strict';

	var addEl, loaded;

	addEl = function addEl(url, el, onLoad, onError) {
	  if (onLoad == null) {
	    onLoad = null;
	  }
	  if (onError == null) {
	    onError = null;
	  }
	  if (loaded[url]) {
	    if (onLoad != null) {
	      onLoad(url);
	    }
	    return true;
	  }
	  if (onError != null) {
	    el.onerror = onError;
	  }
	  if (onLoad != null) {
	    el.onload = function () {
	      loaded[url] = url;
	      return onLoad(url);
	    };
	  }
	  document.head.appendChild(el);
	  return false;
	};

	loaded = {};

	module.exports = {
	  add: function add(urlOrUrls, onLoad, onError) {
	    var i, len, link, results, script, type, url, urls;
	    if (onLoad == null) {
	      onLoad = null;
	    }
	    if (onError == null) {
	      onError = null;
	    }
	    console.log('add', arguments);
	    if (typeof urlOrUrls === 'string') {
	      urls = [urlOrUrls];
	    } else {
	      urls = urlOrUrls;
	    }
	    results = [];
	    for (i = 0, len = urls.length; i < len; i++) {
	      url = urls[i];
	      type = url.substr(url.lastIndexOf('.') + 1);
	      console.log(type);
	      switch (type) {
	        case 'js':
	          script = document.createElement('script');
	          script.setAttribute('src', url);
	          results.push(addEl(url, script, onLoad, onError));
	          break;
	        case 'css':
	          link = document.createElement('link');
	          link.setAttribute('rel', 'stylesheet');
	          link.setAttribute('href', url);
	          results.push(addEl(url, link, onLoad, onError));
	          break;
	        default:
	          results.push(void 0);
	      }
	    }
	    return results;
	  }
	};

/***/ }),
/* 182 */
/***/ (function(module, exports) {

	"use strict";

	module.exports = {
	  BACKSPACE: 8,
	  TAB: 9,
	  ENTER: 13,
	  SHIFT: 16,
	  CTRL: 17,
	  ALT: 18,
	  SPACE: 32,
	  LEFT_ARROW: 37,
	  UP_ARROW: 38,
	  RIGHT_ARROW: 39,
	  DOWN_ARROW: 40,
	  DELETE: 46,
	  META: 91
	};

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var OboSelectionRect, PX_EDGE_PADDING, Screen;

	OboSelectionRect = __webpack_require__(48);

	PX_EDGE_PADDING = 50;

	Screen = function () {
	  function Screen(el) {
	    this.el = el;
	    this.intervalId = null;
	    this.distance = 0;
	    this.distanceLeft = 0;
	    this.travelBy = 0;
	  }

	  Screen.prototype.scrollToTop = function () {
	    return this.el.scrollTop = 0;
	  };

	  Screen.prototype.scrollToBottom = function () {
	    return this.el.scrollTop = this.el.scrollHeight;
	  };

	  Screen.prototype.getScrollDistanceNeededToPutClientRectIntoView = function (clientRect) {
	    var rect;
	    rect = this.el.getBoundingClientRect();
	    if (!clientRect.valid) {
	      return 0;
	    }
	    if (clientRect.top < 0) {
	      return clientRect.top - PX_EDGE_PADDING;
	    }
	    if (clientRect.bottom > rect.height) {
	      return clientRect.bottom - rect.height + PX_EDGE_PADDING;
	    }
	    return 0;
	  };

	  Screen.prototype.getScrollDistanceNeededToPutElementIntoView = function (el) {
	    return this.getScrollDistanceNeededToPutClientRectIntoView(el.getBoundingClientRect());
	  };

	  Screen.prototype.getScrollDistanceNeededToPutSelectionIntoView = function () {
	    return this.getScrollDistanceNeededToPutClientRectIntoView(OboSelectionRect.createFromSelection());
	  };

	  Screen.prototype.scrollSelectionIntoViewIfNeeded = function () {
	    this.distance = this.getScrollDistanceNeededToPutSelectionIntoView();
	    return this.el.scrollTop += this.distance;
	  };

	  Screen.prototype.tweenByDistance = function (distance) {
	    this.distance = distance;
	    this.distanceLeft = this.distance;
	    if (this.distance !== 0) {
	      this.travelBy = Math.max(1, parseInt(Math.abs(this.distance) / 10, 10));
	      clearInterval(this.intervalId);
	      return this.intervalId = setInterval(function () {
	        var travel;
	        if (this.distance < 1) {
	          travel = Math.min(this.travelBy, this.distanceLeft * -1);
	          this.el.scrollTop -= travel;
	          this.distanceLeft += travel;
	          if (this.distanceLeft >= 0) {
	            return clearInterval(this.intervalId);
	          }
	        } else {
	          travel = Math.min(this.travelBy, this.distanceLeft);
	          this.el.scrollTop += travel;
	          this.distanceLeft -= travel;
	          if (this.distanceLeft <= 0) {
	            return clearInterval(this.intervalId);
	          }
	        }
	      }.bind(this), 10);
	    }
	  };

	  Screen.prototype.tweenElementIntoViewIfNeeded = function (el) {
	    return this.tweenByDistance(this.getScrollDistanceNeededToPutElementIntoView(el));
	  };

	  Screen.prototype.tweenSelectionIntoViewIfNeeded = function () {
	    return this.tweenByDistance(this.getScrollDistanceNeededToPutSelectionIntoView());
	  };

	  return Screen;
	}();

	Screen.isElementVisible = function (node) {
	  var rect;
	  rect = node.getBoundingClientRect();
	  return !(rect.top > window.innerHeight || rect.bottom < 0);
	};

	window.__screen = Screen;

	module.exports = Screen;

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ChunkSelection, Cursor, DOMSelection, DOMUtil, domType;

	Cursor = __webpack_require__(88);

	DOMSelection = __webpack_require__(21);

	DOMUtil = __webpack_require__(16);

	domType = null;

	ChunkSelection = function () {
	  function ChunkSelection(module1) {
	    this.module = module1;
	    this.clear();
	  }

	  ChunkSelection.prototype.clear = function () {
	    this.start = this.end = domType = null;
	    this.inbetween = [];
	    return this.all = [];
	  };

	  ChunkSelection.prototype.calculateAllNodes = function () {
	    var n, ref, ref1;
	    this.inbetween = [];
	    this.all = [];
	    if (((ref = this.start) != null ? ref.chunk : void 0) != null) {
	      this.all = [this.start.chunk];
	    }
	    n = this.start.chunk;
	    while (n != null && n !== this.end.chunk) {
	      if (n !== this.start.chunk) {
	        this.inbetween.push(n);
	        this.all.push(n);
	      }
	      n = n.nextSibling();
	    }
	    if (((ref1 = this.end) != null ? ref1.chunk : void 0) != null && this.all[this.all.length - 1] !== this.end.chunk) {
	      return this.all.push(this.end.chunk);
	    }
	  };

	  ChunkSelection.prototype.getChunkForDomNode = function (domNode) {
	    var index;
	    index = this.getIndex(domNode);
	    return this.module.chunks.at(index);
	  };

	  ChunkSelection.prototype.getPosition = function (chunk) {
	    var chunkIndex, endIndex, ref, ref1, startIndex;
	    if (((ref = this.start) != null ? ref.chunk : void 0) == null || ((ref1 = this.end) != null ? ref1.chunk : void 0) == null) {
	      return 'unknown';
	    }
	    chunkIndex = chunk.get('index');
	    startIndex = this.start.chunk.get('index');
	    endIndex = this.end.chunk.get('index');
	    if (chunkIndex < startIndex) {
	      return 'before';
	    }
	    if (chunkIndex === startIndex && chunkIndex === endIndex) {
	      return 'contains';
	    }
	    if (chunkIndex === startIndex) {
	      return 'start';
	    }
	    if (chunkIndex < endIndex) {
	      return 'inside';
	    }
	    if (chunkIndex === endIndex) {
	      return 'end';
	    }
	    return 'after';
	  };

	  ChunkSelection.prototype.getIndex = function (node) {
	    return DOMUtil.findParentAttr(node, 'data-component-index');
	  };

	  ChunkSelection.prototype.getFromDOMSelection = function (s) {
	    if (s == null) {
	      s = new DOMSelection();
	    }
	    this.clear();
	    domType = s.getType();
	    if (domType === 'none') {
	      this.start = null;
	      this.end = null;
	    } else {
	      this.start = this.getCursor(s.startContainer, s.startOffset);
	      this.end = this.getCursor(s.endContainer, s.endOffset);
	      this.calculateAllNodes();
	    }
	    return this;
	  };

	  ChunkSelection.prototype.getCursor = function (node, offset) {
	    var chunk;
	    chunk = this.getChunkForDomNode(node);
	    return new Cursor(chunk, node, offset);
	  };

	  ChunkSelection.prototype.setTextStart = function (node, offset) {
	    this.start = this.getCursor(node, offset);
	    if (this.end === null) {
	      this.end = this.start.clone();
	    }
	    return this.calculateAllNodes();
	  };

	  ChunkSelection.prototype.setTextEnd = function (node, offset) {
	    this.end = this.getCursor(node, offset);
	    if (this.start === null) {
	      this.start = this.end.clone();
	    }
	    return this.calculateAllNodes();
	  };

	  ChunkSelection.prototype.setCaret = function (node, offset) {
	    this.setTextStart(node, offset);
	    return this.collapse();
	  };

	  ChunkSelection.prototype.select = function () {
	    return DOMSelection.set(this.start.node, this.start.offset, this.end.node, this.end.offset);
	  };

	  ChunkSelection.prototype.collapse = function () {
	    return this.end = this.start.clone();
	  };

	  return ChunkSelection;
	}();

	Object.defineProperties(ChunkSelection.prototype, {
	  "type": {
	    get: function get() {
	      var ref, ref1, ref2, ref3;
	      if (((ref = this.start) != null ? ref.chunk : void 0) == null || ((ref1 = this.end) != null ? ref1.chunk : void 0) == null || !this.start.isText || !this.end.isText) {
	        return 'none';
	      } else if (((ref2 = this.start) != null ? ref2.chunk.cid : void 0) === ((ref3 = this.end) != null ? ref3.chunk.cid : void 0)) {
	        if (domType === 'caret') {
	          return 'caret';
	        } else {
	          return 'textSpan';
	        }
	      } else {
	        return 'chunkSpan';
	      }
	    }
	  }
	});

	ChunkSelection.createDescriptor = function (startIndex, startData, endIndex, endData) {
	  return {
	    start: {
	      index: startIndex,
	      data: startData
	    },
	    end: {
	      index: endIndex,
	      data: endData
	    }
	  };
	};

	ChunkSelection.getFromDOMSelection = function (module, domSelection) {
	  return new ChunkSelection(module).getFromDOMSelection(domSelection);
	};

	module.exports = ChunkSelection;

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var DOMSelection, OboSelectionRect, Selection, VirtualSelection;

	OboSelectionRect = __webpack_require__(48);

	DOMSelection = __webpack_require__(21);

	VirtualSelection = __webpack_require__(89);

	Selection = function () {
	  function Selection(page) {
	    this.setPage(page);
	    this.saved = null;
	    this.clear();
	  }

	  Selection.prototype.saveVirtualSelection = function () {
	    return this.saved = this.virtual.clone();
	  };

	  Selection.prototype.restoreVirtualSelection = function () {
	    return this.virtual = this.saved;
	  };

	  Selection.prototype.clear = function () {
	    this.rect = null;
	    this.chunkRect = null;
	    return this.dom = null;
	  };

	  Selection.prototype.setPage = function (page) {
	    this.page = page;
	    return this.virtual = new VirtualSelection(this.page);
	  };

	  Selection.prototype.getSelectionDescriptor = function () {
	    return this.virtual.toObject();
	  };

	  Selection.prototype.fromObject = function (o) {
	    this.virtual.fromObject(o);
	    this.selectDOM();
	    return this.update();
	  };

	  Selection.prototype.selectDOM = function () {
	    var e, ref, ref1, s;
	    console.log('SELECTION selectDOM');
	    if (((ref = this.virtual.start) != null ? ref.chunk : void 0) == null || ((ref1 = this.virtual.end) != null ? ref1.chunk : void 0) == null) {
	      return;
	    }
	    console.log('startChunk', this.startChunk.cid);
	    s = this.startChunk.getDOMSelectionStart();
	    e = this.endChunk.getDOMSelectionEnd();
	    return DOMSelection.set(s.textNode, s.offset, e.textNode, e.offset);
	  };

	  Selection.prototype.update = function () {
	    console.time('selection.update');
	    console.time('new oboSelection');
	    this.dom = new DOMSelection();
	    this.virtual.fromDOMSelection(this.dom);
	    console.timeEnd('new oboSelection');
	    console.time('OboSelectionRect.createFromSelection');
	    this.rect = OboSelectionRect.createFromSelection();
	    this.chunkRect = OboSelectionRect.createFromChunks(this.virtual.all);
	    console.timeEnd('OboSelectionRect.createFromSelection');
	    return console.timeEnd('selection.update');
	  };

	  return Selection;
	}();

	Object.defineProperties(Selection.prototype, {
	  startChunk: {
	    get: function get() {
	      var ref;
	      if (((ref = this.virtual) != null ? ref.start : void 0) == null) {
	        return null;
	      }
	      return this.virtual.start.chunk;
	    }
	  },
	  endChunk: {
	    get: function get() {
	      var ref;
	      if (((ref = this.virtual) != null ? ref.end : void 0) == null) {
	        return null;
	      }
	      return this.virtual.end.chunk;
	    }
	  }
	});

	module.exports = Selection;

/***/ }),
/* 186 */
/***/ (function(module, exports) {

	"use strict";

	var VirtualCursorData;

	VirtualCursorData = function () {
	  function VirtualCursorData(content) {
	    this.content = content;
	  }

	  VirtualCursorData.prototype.clone = function () {
	    return new VirtualCursorData(Object.assign({}, this.content));
	  };

	  return VirtualCursorData;
	}();

	module.exports = VirtualCursorData;

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Dispatcher,
	    FocusStore,
	    Store,
	    TRANSITION_TIME_MS,
	    focusStore,
	    timeoutId,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	Store = __webpack_require__(47);

	Dispatcher = __webpack_require__(4);

	TRANSITION_TIME_MS = 800;

	timeoutId = null;

	FocusStore = function (superClass) {
	  extend(FocusStore, superClass);

	  function FocusStore() {
	    FocusStore.__super__.constructor.call(this, 'focusStore');
	    Dispatcher.on('focus:component', function (_this) {
	      return function (payload) {
	        _this.state.viewState = 'enter';
	        _this.state.focussedId = payload.value.id;
	        _this.triggerChange();
	        window.clearTimeout(timeoutId);
	        return timeoutId = window.setTimeout(function () {
	          this.state.viewState = 'active';
	          return this.triggerChange();
	        }.bind(_this), TRANSITION_TIME_MS);
	      };
	    }(this));
	    Dispatcher.on('focus:unfocus', function (_this) {
	      return function (payload) {
	        _this.state.viewState = 'leave';
	        _this.triggerChange();
	        window.clearTimeout(timeoutId);
	        return timeoutId = window.setTimeout(function () {
	          this.state.viewState = 'inactive';
	          this.state.focussedId = null;
	          return this.triggerChange();
	        }.bind(_this), TRANSITION_TIME_MS);
	      };
	    }(this));
	  }

	  FocusStore.prototype.init = function () {
	    return this.state = {
	      focussedId: null,
	      viewState: 'inactive'
	    };
	  };

	  FocusStore.prototype.getState = function () {
	    return this.state;
	  };

	  FocusStore.prototype.setState = function (newState) {
	    return this.state = newState;
	  };

	  return FocusStore;
	}(Store);

	focusStore = new FocusStore();

	module.exports = focusStore;

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Dispatcher,
	    ModalStore,
	    Store,
	    modalStore,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	Store = __webpack_require__(47);

	Dispatcher = __webpack_require__(4);

	ModalStore = function (superClass) {
	  extend(ModalStore, superClass);

	  function ModalStore() {
	    ModalStore.__super__.constructor.call(this, 'modalstore');
	    Dispatcher.on('modal:show', function (_this) {
	      return function (payload) {
	        _this.state.modals.push(payload.value.component);
	        return _this.triggerChange();
	      };
	    }(this));
	    Dispatcher.on('modal:hide', function (_this) {
	      return function () {
	        _this.state.modals.shift();
	        return _this.triggerChange();
	      };
	    }(this));
	  }

	  ModalStore.prototype.init = function () {
	    return this.state = {
	      modals: []
	    };
	  };

	  ModalStore.prototype.getState = function () {
	    return this.state;
	  };

	  ModalStore.prototype.setState = function (newState) {
	    return this.state = newState;
	  };

	  return ModalStore;
	}(Store);

	modalStore = new ModalStore();

	module.exports = modalStore;

/***/ }),
/* 189 */
/***/ (function(module, exports) {

	"use strict";

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Dispatcher, ErrorDialog, ErrorUtil;

	Dispatcher = __webpack_require__(4);

	ErrorDialog = __webpack_require__(83);

	ErrorUtil = {
	  show: function show(title, errorMessage) {
	    return Dispatcher.trigger('modal:show', {
	      value: {
	        component: React.createElement(
	          ErrorDialog,
	          { title: title },
	          errorMessage
	        )
	      }
	    });
	  },
	  errorResponse: function errorResponse(res) {
	    var title;
	    title = function () {
	      switch (res.value.type) {
	        case 'input':
	          return 'Bad Input';
	        case 'unexpected':
	          return 'Unexpected Error';
	        case 'reject':
	          return 'Rejected';
	      }
	    }();
	    return ErrorUtil.show(title, res.value.message);
	  }
	};

	module.exports = ErrorUtil;

/***/ }),
/* 191 */
/***/ (function(module, exports) {

	'use strict';

	var GLOBAL_KEY, OboGlobals, globals, key, ref, value;

	GLOBAL_KEY = '__oboGlobals';

	if (!window[GLOBAL_KEY]) {
	  throw 'Unable to read Obo Globals - Must call after DOM load';
	}

	globals = new Map();

	ref = window[GLOBAL_KEY];
	for (key in ref) {
	  value = ref[key];
	  console.log('KEY IS', key, value);
	  globals.set(key, value);
	}

	delete window[GLOBAL_KEY];

	OboGlobals = {
	  get: function get(key) {
	    return globals.get(key);
	  }
	};

	module.exports = OboGlobals;

/***/ }),
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var OD;

	__webpack_require__(252);

	OD = __webpack_require__(97);

	window.ObojoboDraft = __webpack_require__(97);

/***/ }),
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */
252,
/* 270 */
252,
/* 271 */
252,
/* 272 */
252,
/* 273 */
252,
/* 274 */
252,
/* 275 */
252,
/* 276 */
252,
/* 277 */
252,
/* 278 */
252,
/* 279 */
252,
/* 280 */
252,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */
/***/ (function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_10' data-name='Layer 10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20.48 20.48'%3E %3Cdefs%3E %3Cstyle%3E .cls-1 %7B fill: %236714bd; %7D %3C/style%3E %3C/defs%3E %3Ctitle%3Etoolbar-icons%3C/title%3E %3Cg%3E %3Crect class='cls-1' x='15.15' y='4.57' width='5.75' height='18.82' rx='1.13' ry='1.13' transform='translate(9.4 -14.41) rotate(45)'/%3E %3Cpath class='cls-1' d='M11.06,25l-5.3,1.23L7,20.94a1.12,1.12,0,0,1,1.59,0l2.47,2.47A1.13,1.13,0,0,1,11.06,25Z' transform='translate(-5.76 -5.76)'/%3E %3C/g%3E %3C/svg%3E"

/***/ })
/******/ ])));