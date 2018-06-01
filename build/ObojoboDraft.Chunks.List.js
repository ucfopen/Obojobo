/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 290);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = Common;

/***/ }),

/***/ 108:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _adapter = __webpack_require__(137);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(138);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.List', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ }),

/***/ 137:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _listStyles = __webpack_require__(65);

var _listStyles2 = _interopRequireDefault(_listStyles);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextGroup = _Common2.default.textGroup.TextGroup;
var TextGroupAdapter = _Common2.default.chunk.textChunk.TextGroupAdapter;


var Adapter = {
	construct: function construct(model, attrs) {
		TextGroupAdapter.construct(model, attrs);

		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.listStyles;
		}) != null) {
			return model.modelState.listStyles = _listStyles2.default.fromDescriptor(attrs.content.listStyles);
		} else {
			return model.modelState.listStyles = new _listStyles2.default('unordered');
		}
	},
	clone: function clone(model, _clone) {
		TextGroupAdapter.clone(model, _clone);
		return _clone.modelState.listStyles = model.modelState.listStyles.clone();
	},
	toJSON: function toJSON(model, json) {
		TextGroupAdapter.toJSON(model, json);
		return json.content.listStyles = model.modelState.listStyles.toDescriptor();
	},
	toText: function toText(model) {
		//@TODO - List toText method'
		var text = '';
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = Array.from(model.modelState.textGroup.items)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var textItem = _step.value;

				text += '  * ' + textItem.text.value + '\n';
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return text;
	}
};

exports.default = Adapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),

/***/ 138:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(267);

var _listStyles = __webpack_require__(65);

var _listStyles2 = _interopRequireDefault(_listStyles);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextGroup = _Common2.default.textGroup.TextGroup; //@TODO - HAS TO REBUILD MOCKELEMENT STRUCTURE EVERYTIME, WOULD LIKE TO NOT HAVE TO DO THAT!

var TextGroupEl = _Common2.default.chunk.textChunk.TextGroupEl;
var Chunk = _Common2.default.models.Chunk;
var MockElement = _Common2.default.mockDOM.MockElement;
var MockTextNode = _Common2.default.mockDOM.MockTextNode;
var TextChunk = _Common2.default.chunk.TextChunk;

var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler;
var OboComponent = _Common2.default.components.OboComponent;


var selectionHandler = new SelectionHandler();

var createMockListElement = function createMockListElement(data, indentLevel) {
	var style = data.listStyles.get(indentLevel);

	var tag = style.type === 'unordered' ? 'ul' : 'ol';
	var el = new MockElement(tag);
	el.start = style.start;
	el._listStyleType = style.bulletStyle;

	return el;
};

var addItemToList = function addItemToList(ul, li, lis) {
	ul.addChild(li);
	li.listStyleType = ul._listStyleType;
	return lis.push(li);
};

var renderEl = function renderEl(props, node, index, indent) {
	var key = props.model.cid + '-' + indent + '-' + index;

	switch (node.nodeType) {
		case 'text':
			return React.createElement(TextGroupEl, {
				parentModel: props.model,
				textItem: { text: node.text, data: {} },
				key: key,
				groupIndex: node.index
			});
		case 'element':
			var ElType = node.type;
			return React.createElement(
				ElType,
				{ key: key, start: node.start, style: { listStyleType: node.listStyleType } },
				renderChildren(props, node.children, indent + 1)
			);
	}
};

var renderChildren = function renderChildren(props, children, indent) {
	var els = [];
	for (var index = 0; index < children.length; index++) {
		var child = children[index];
		els.push(renderEl(props, child, index, indent));
	}

	return els;
};

var __guard__ = function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
};

exports.default = function (props) {
	var curUl = void 0;

	var data = props.model.modelState;

	var texts = data.textGroup;

	var curIndentLevel = 0;
	var curIndex = 0;
	var rootUl = curUl = createMockListElement(data, curIndentLevel);
	var lis = [];

	var li = new MockElement('li');
	addItemToList(curUl, li, lis);

	for (var itemIndex = 0; itemIndex < texts.items.length; itemIndex++) {
		// if this item is lower than the current indent level...
		var item = texts.items[itemIndex];
		if (item.data.indent < curIndentLevel) {
			// traverse up the tree looking for our curUl:
			while (curIndentLevel > item.data.indent) {
				curUl = curUl.parent.parent;
				curIndentLevel--;
			}

			// else, if this item is higher than the current indent level...
		} else if (item.data.indent > curIndentLevel) {
			// traverse down the tree...
			while (curIndentLevel < item.data.indent) {
				curIndentLevel++;

				// Create the list for this level
				var newUl = createMockListElement(data, curIndentLevel);
				var newLi = new MockElement('li');
				addItemToList(newUl, newLi, lis);
				curUl.lastChild.addChild(newUl);
				curUl = newUl;
			}
		}

		// if the lastChild is not an LI or it is an LI that already has text inside
		// lastChild is always defined because of the cals to addItemToList
		if (!(curUl.lastChild.type === 'li') || curUl.lastChild.lastChild != null) {
			li = new MockElement('li');
			addItemToList(curUl, li, lis);
		}

		var text = new MockTextNode(item.text);
		text.index = curIndex;
		curIndex++;

		curUl.lastChild.addChild(text);
	}

	// Remove bullets from nested LIs
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(lis)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			li = _step.value;

			// li will always have .children because MockListElement creates it as an empty array
			if (__guard__(li.children[0], function (x) {
				return x.nodeType;
			}) !== 'text') {
				li.listStyleType = 'none';
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return React.createElement(
		OboComponent,
		{ model: props.model, moduleData: props.moduleData },
		React.createElement(
			TextChunk,
			{ className: 'obojobo-draft--chunks--list pad' },
			React.createElement(
				'div',
				{ 'data-indent': data.indent },
				renderEl(props, rootUl, 0, 0)
			)
		)
	);
};

/***/ }),

/***/ 267:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 290:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(108);


/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getDefaultBulletStyle = function getDefaultBulletStyle(indent, type) {
	var defaults = type === 'ordered' ? orderedDefaultBulletStyles : unorderedDefaultBulletStyles;
	return defaults[indent % defaults.length];
};

var getStyleWithDefaults = function getStyleWithDefaults(indent, defaultType, style) {
	if (style == null) {
		style = null;
	}
	var styleWithDefaults = new ListStyle();

	styleWithDefaults.type = (style != null ? style.type : undefined) ? style.type : defaultType;
	styleWithDefaults.start = (style != null ? style.start : undefined) ? style.start : 1;
	styleWithDefaults.bulletStyle = (style != null ? style.bulletStyle : undefined) ? style.bulletStyle : getDefaultBulletStyle(indent, styleWithDefaults.type);

	return styleWithDefaults;
};

var ListStyle = function () {
	function ListStyle(opts) {
		_classCallCheck(this, ListStyle);

		if (opts == null) {
			opts = {};
		}
		this.type = opts.type || null;
		this.start = opts.start || null;
		this.bulletStyle = opts.bulletStyle || null;
	}

	_createClass(ListStyle, [{
		key: 'toDescriptor',
		value: function toDescriptor() {
			return {
				type: this.type || null,
				start: this.start || null,
				bulletStyle: this.bulletStyle || null
			};
		}
	}, {
		key: 'clone',
		value: function clone() {
			return new ListStyle(this);
		}
	}]);

	return ListStyle;
}();

var ListStyles = function () {
	function ListStyles(type) {
		_classCallCheck(this, ListStyles);

		this.type = type;
		this.styles = {};
	}

	_createClass(ListStyles, [{
		key: 'init',
		value: function init() {
			this.type = ListStyles.TYPE_UNORDERED;
			return this.styles = {};
		}
	}, {
		key: 'set',
		value: function set(indent, opts) {
			return this.styles[indent] = new ListStyle(opts);
		}
	}, {
		key: 'get',
		value: function get(indent) {
			return getStyleWithDefaults(indent, this.type, this.styles[indent]);
		}
	}, {
		key: 'getSetStyles',
		value: function getSetStyles(indent) {
			var style = this.styles[indent];
			if (!style) {
				return new ListStyle();
			}

			return style;
		}
	}, {
		key: 'toDescriptor',
		value: function toDescriptor() {
			var desc = {
				type: this.type,
				indents: {}
			};

			for (var indent in this.styles) {
				var style = this.styles[indent];
				desc.indents[indent] = style.toDescriptor();
			}

			return desc;
		}
	}, {
		key: 'clone',
		value: function clone() {
			var clone = new ListStyles(this.type);

			for (var indent in this.styles) {
				var style = this.styles[indent];
				clone.styles[indent] = style.clone();
			}

			return clone;
		}
	}, {
		key: 'map',
		value: function map(fn) {
			var result = [];

			for (var indent in this.styles) {
				var style = this.styles[indent];
				result.push(fn(style, indent));
			}

			return result;
		}
	}]);

	return ListStyles;
}();

ListStyles.fromDescriptor = function (descriptor) {
	var styles = new ListStyles(descriptor.type);

	for (var indent in descriptor.indents) {
		var style = descriptor.indents[indent];
		styles.set(indent, style);
	}

	return styles;
};

ListStyles.TYPE_ORDERED = 'ordered';
ListStyles.TYPE_UNORDERED = 'unordered';

ListStyles.STYLE_FILLED_CIRCLE = 'disc';
ListStyles.STYLE_HOLLOW_CIRCLE = 'circle';
ListStyles.STYLE_SQUARE = 'square';

ListStyles.STYLE_NUMERIC = 'decimal';
ListStyles.STYLE_LEAD_ZERO_NUMERIC = 'decimal-leading-zero';
ListStyles.STYLE_LOWERCASE_LETTER = 'lower-alpha';
ListStyles.STYLE_UPPERCASE_LETTER = 'upper-alpha';
ListStyles.STYLE_LOWERCASE_ROMAN = 'lower-roman';
ListStyles.STYLE_UPPERCASE_ROMAN = 'upper-roman';

var unorderedDefaultBulletStyles = [ListStyles.STYLE_FILLED_CIRCLE, ListStyles.STYLE_HOLLOW_CIRCLE, ListStyles.STYLE_SQUARE];

var orderedDefaultBulletStyles = [ListStyles.STYLE_NUMERIC, ListStyles.STYLE_UPPERCASE_LETTER, ListStyles.STYLE_UPPERCASE_ROMAN, ListStyles.STYLE_LOWERCASE_LETTER, ListStyles.STYLE_LOWERCASE_ROMAN];

exports.default = ListStyles;

/***/ })

/******/ });