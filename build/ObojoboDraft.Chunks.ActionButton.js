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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(100);


/***/ },

/***/ 5:
/***/ function(module, exports) {

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

/***/ },

/***/ 10:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ChunkStyleList, HtmlUtil, ObjectAssign, StyleRange, StyleType, StyleableText, trimStyleRange;

	ObjectAssign = __webpack_require__(11);

	ChunkStyleList = __webpack_require__(25);

	StyleRange = __webpack_require__(15);

	StyleType = __webpack_require__(5);

	HtmlUtil = __webpack_require__(28);

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

/***/ },

/***/ 11:
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
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
			var test1 = new String('abc');  // eslint-disable-line
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
		} catch (e) {
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

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },

/***/ 15:
/***/ function(module, exports, __webpack_require__) {

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

/***/ },

/***/ 17:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var ObjectAssign;

	ObjectAssign = __webpack_require__(11);

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

/***/ },

/***/ 25:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ChunkStyleList, StyleRange, StyleType, keySortFn;

	StyleType = __webpack_require__(5);

	StyleRange = __webpack_require__(15);

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

/***/ },

/***/ 26:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObjectAssign, StyleableText, TextGroup, TextGroupItem, Util, addChildToGroup, createChild, getItemsArray, removeAllChildrenFromGroup, removeChildFromGroup, setChildToGroup;

	StyleableText = __webpack_require__(10);

	Util = __webpack_require__(17);

	TextGroupItem = __webpack_require__(27);

	ObjectAssign = __webpack_require__(11);

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

/***/ },

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var StyleableText, TextGroupItem, Util;

	StyleableText = __webpack_require__(10);

	Util = __webpack_require__(17);

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

/***/ },

/***/ 28:
/***/ function(module, exports) {

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

/***/ },

/***/ 98:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var TextGroup, TextGroupAdapter;

	TextGroup = __webpack_require__(26);

	TextGroupAdapter = {
	  construct: function construct(model, attrs) {
	    var ref, ref1;
	    if ((attrs != null ? (ref = attrs.content) != null ? ref.textGroup : void 0 : void 0) != null) {
	      model.modelState.textGroup = TextGroup.fromDescriptor(attrs.content.textGroup, 2e308, {
	        indent: 0
	      });
	    } else {
	      model.modelState.textGroup = TextGroup.create(2e308, {
	        indent: 0
	      });
	    }
	    if (attrs != null ? (ref1 = attrs.content) != null ? ref1.label : void 0 : void 0) {
	      return model.modelState.label = attrs.content.label;
	    } else {
	      return model.modelState.label = '';
	    }
	  },
	  clone: function clone(model, _clone) {
	    _clone.modelState.textGroup = model.modelState.textGroup.clone();
	    return _clone.modelState.label = model.modelState.label;
	  },
	  toJSON: function toJSON(model, json) {
	    json.content.textGroup = model.modelState.textGroup.toDescriptor();
	    return json.content.label = model.modelState.label;
	  },
	  toText: function toText(model) {
	    return model.modelState.textGroup.first.text.value;
	  }
	};

	module.exports = TextGroupAdapter;

/***/ },

/***/ 99:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ActionButton, Button, Common, OboComponent, TextChunk, TextGroupEl;

	__webpack_require__(199);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	Button = Common.components.Button;

	TextGroupEl = Common.chunk.textChunk.TextGroupEl;

	TextChunk = Common.chunk.TextChunk;

	ActionButton = React.createClass({
	  displayName: 'ActionButton',

	  onClick: function onClick() {
	    return this.props.model.processTrigger('onClick');
	  },
	  render: function render() {
	    var textItem;
	    textItem = this.props.model.modelState.textGroup.first;
	    return React.createElement(
	      OboComponent,
	      { model: this.props.model, moduleData: this.props.moduleData },
	      React.createElement(
	        TextChunk,
	        { className: 'obojobo-draft--chunks--action-button pad' },
	        React.createElement(
	          Button,
	          { onClick: this.onClick, value: this.props.model.modelState.label },
	          React.createElement(TextGroupEl, { text: textItem.text, groupIndex: '0', indent: textItem.data.indent, parentModel: this.props.model })
	        )
	      )
	    );
	  }
	});

	module.exports = ActionButton;

/***/ },

/***/ 100:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.ActionButton', {
	  type: 'chunk',
	  adapter: __webpack_require__(98),
	  componentClass: __webpack_require__(99),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 199:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });