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
/******/ 	return __webpack_require__(__webpack_require__.s = 181);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = ObojoboDraft;

/***/ }),

/***/ 127:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(160);

var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OboComponent = _ObojoboDraft2.default.components.OboComponent;
var TextGroupEl = _ObojoboDraft2.default.chunk.textChunk.TextGroupEl;
var TextChunk = _ObojoboDraft2.default.chunk.TextChunk;
var Dispatcher = _ObojoboDraft2.default.flux.Dispatcher;


var Text = React.createClass({
	displayName: 'Text',
	render: function render() {
		var _this = this;

		var texts = this.props.model.modelState.textGroup.items.map(function (textItem, index) {
			return React.createElement(TextGroupEl, { textItem: textItem, groupIndex: index, key: index, parentModel: _this.props.model });
		}.bind(this));

		return React.createElement(
			OboComponent,
			{ model: this.props.model, moduleData: this.props.moduleData },
			React.createElement(
				TextChunk,
				{ className: 'obojobo-draft--chunks--single-text pad' },
				texts
			)
		);
	}
});

exports.default = Text;

/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


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
		var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
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
		if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
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

/***/ 130:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _textGroup = __webpack_require__(132);

var _textGroup2 = _interopRequireDefault(_textGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextGroupAdapter = {
	construct: function construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, function (x) {
			return x.textGroup;
		}) != null) {
			return model.modelState.textGroup = _textGroup2.default.fromDescriptor(attrs.content.textGroup, Infinity, { indent: 0, align: 'left' });
		} else {
			return model.modelState.textGroup = _textGroup2.default.create(Infinity, { indent: 0, align: 'left' });
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

exports.default = TextGroupAdapter;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}

/***/ }),

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleableText = __webpack_require__(29);

var _styleableText2 = _interopRequireDefault(_styleableText);

var _textGroupUtil = __webpack_require__(27);

var _textGroupUtil2 = _interopRequireDefault(_textGroupUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextGroupItem = void 0;

exports.default = TextGroupItem = function () {
	function TextGroupItem(text, data, parent) {
		_classCallCheck(this, TextGroupItem);

		if (text == null) {
			text = new _styleableText2.default();
		}
		this.text = text;
		if (data == null) {
			data = {};
		}
		this.data = data;
		if (parent == null) {
			parent = null;
		}
		this.parent = parent;
	}

	_createClass(TextGroupItem, [{
		key: 'clone',
		value: function clone(cloneDataFn) {
			if (cloneDataFn == null) {
				cloneDataFn = _textGroupUtil2.default.defaultCloneFn;
			}
			return new TextGroupItem(this.text.clone(), cloneDataFn(this.data), null);
		}
	}]);

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

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleableText = __webpack_require__(29);

var _styleableText2 = _interopRequireDefault(_styleableText);

var _textGroupUtil = __webpack_require__(27);

var _textGroupUtil2 = _interopRequireDefault(_textGroupUtil);

var _textGroupItem = __webpack_require__(131);

var _textGroupItem2 = _interopRequireDefault(_textGroupItem);

var _objectAssign = __webpack_require__(13);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getItemsArray = function getItemsArray(itemOrItems) {
	if (itemOrItems instanceof _textGroupItem2.default) {
		return [itemOrItems];
	} else {
		return itemOrItems;
	}
};

var addChildToGroup = function addChildToGroup(itemOrItems, group, atIndex) {
	if (atIndex == null) {
		atIndex = null;
	}
	var items = getItemsArray(itemOrItems);

	if (atIndex === null) {
		group.items = group.items.concat(items);
	} else {
		group.items = group.items.slice(0, atIndex).concat(items).concat(group.items.slice(atIndex));
	}

	return Array.from(items).map(function (item) {
		return item.parent = group;
	});
};

var removeChildFromGroup = function removeChildFromGroup(itemOrItems, group) {
	var removedItems = [];
	var items = getItemsArray(itemOrItems);

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(items)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var item = _step.value;

			var removed = group.items.splice(item.index, 1)[0];
			removed.parent = null;
			removedItems.push(removed);
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

	return removedItems;
};

var setChildToGroup = function setChildToGroup(item, group, atIndex) {
	group.items[atIndex] = item;
	return item.parent = group;
};

var removeAllChildrenFromGroup = function removeAllChildrenFromGroup(group) {
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = Array.from(group.items)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var item = _step2.value;

			item.parent = null;
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	return group.items = [];
};

var createChild = function createChild(text, data, dataTemplate) {
	return new _textGroupItem2.default(text, _textGroupUtil2.default.createData(data, dataTemplate));
};

// dataTemplate defines the data object that will be included in each item in the
// textGroup. Attributes in the data added to the group will be ignored if those
// attributes aren't in the dataTemplate (see Util.createData)

var TextGroup = function () {
	function TextGroup(maxItems, dataTemplate, initialItems) {
		_classCallCheck(this, TextGroup);

		if (maxItems == null) {
			maxItems = Infinity;
		}
		this.maxItems = maxItems;
		if (dataTemplate == null) {
			dataTemplate = {};
		}
		if (initialItems == null) {
			initialItems = [];
		}
		this.items = [];
		this.dataTemplate = Object.freeze((0, _objectAssign2.default)({}, dataTemplate));

		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = Array.from(initialItems)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var item = _step3.value;

				this.add(item.text, item.data);
			}
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3.return) {
					_iterator3.return();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}
	}

	_createClass(TextGroup, [{
		key: 'clear',
		value: function clear() {
			return removeAllChildrenFromGroup(this);
		}
	}, {
		key: 'indexOf',
		value: function indexOf(item) {
			return this.items.indexOf(item);
		}
	}, {
		key: 'init',
		value: function init(numItems) {
			if (numItems == null) {
				numItems = 1;
			}
			this.clear();

			while (numItems-- && !this.isFull) {
				this.add();
			}

			return this;
		}
	}, {
		key: 'fill',
		value: function fill() {
			var _this = this;

			if (this.maxItems === Infinity) {
				return;
			}

			return function () {
				var result = [];
				while (!_this.isFull) {
					result.push(_this.add());
				}
				return result;
			}();
		}
	}, {
		key: 'add',
		value: function add(text, data) {
			if (this.isFull) {
				return this;
			}

			addChildToGroup(createChild(text, data, this.dataTemplate), this);

			return this;
		}
	}, {
		key: 'addAt',
		value: function addAt(index, text, data) {
			if (this.isFull) {
				return this;
			}

			addChildToGroup(createChild(text, data, this.dataTemplate), this, index);

			return this;
		}
	}, {
		key: 'addGroup',
		value: function addGroup(group, cloneDataFn) {
			if (cloneDataFn == null) {
				cloneDataFn = _textGroupUtil2.default.defaultCloneFn;
			}
			return this.addGroupAt(group, null, cloneDataFn);
		}
	}, {
		key: 'addGroupAt',
		value: function addGroupAt(group, index, cloneDataFn) {
			if (cloneDataFn == null) {
				cloneDataFn = _textGroupUtil2.default.defaultCloneFn;
			}
			var itemsToAdd = [];
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = Array.from(group.items)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var item = _step4.value;

					var clone = item.clone(cloneDataFn);
					itemsToAdd.push(createChild(clone.text, clone.data, this.dataTemplate));
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			addChildToGroup(itemsToAdd, this, index);

			return this;
		}
	}, {
		key: 'get',
		value: function get(index) {
			return this.items[index];
		}
	}, {
		key: 'set',
		value: function set(index, text, data) {
			return setChildToGroup(createChild(text, data, this.dataTemplate), this, index);
		}
	}, {
		key: 'remove',
		value: function remove(index) {
			return removeChildFromGroup(this.items[index], this)[0];
		}
	}, {
		key: 'clone',
		value: function clone(cloneDataFn) {
			if (cloneDataFn == null) {
				cloneDataFn = _textGroupUtil2.default.defaultCloneFn;
			}
			var clonedItems = [];

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = Array.from(this.items)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var item = _step5.value;

					clonedItems.push(item.clone(cloneDataFn));
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			return new TextGroup(this.maxItems, this.dataTemplate, clonedItems);
		}
	}, {
		key: 'toDescriptor',
		value: function toDescriptor() {
			var desc = [];

			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = Array.from(this.items)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var item = _step6.value;

					desc.push({ text: item.text.getExportedObject(), data: _textGroupUtil2.default.defaultCloneFn(item.data) });
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			return desc;
		}

		// textGroup.toSlice(0, 1) will reduce your text group to have one item

	}, {
		key: 'toSlice',
		value: function toSlice(from, to) {
			if (to == null) {
				to = Infinity;
			}
			removeChildFromGroup(this.items.slice(to), this);
			removeChildFromGroup(this.items.slice(0, from), this);

			return this;
		}

		// splits the group into two, one with all the items before the specified index
		// and the other with the items at index and above

	}, {
		key: 'splitBefore',
		value: function splitBefore(index) {
			var sibling = new TextGroup(this.maxItems, this.dataTemplate);

			while (this.length !== index) {
				var item = this.remove(index);
				sibling.add(item.text, item.data);
			}

			return sibling;
		}
	}, {
		key: 'splitText',
		value: function splitText(index, offset) {
			var item = this.items[index];

			var newItem = createChild(item.text.split(offset), _textGroupUtil2.default.defaultCloneFn(item.data), this.dataTemplate);

			addChildToGroup(newItem, this, index + 1);

			return newItem;
		}
	}, {
		key: 'merge',
		value: function merge(index, mergeDataFn) {
			if (mergeDataFn == null) {
				mergeDataFn = _textGroupUtil2.default.defaultMergeFn;
			}
			var digestedItem = this.items.splice(index + 1, 1)[0];
			var consumerItem = this.items[index];

			if (!digestedItem || !consumerItem) {
				return this;
			}

			consumerItem.data = _textGroupUtil2.default.createData(mergeDataFn(consumerItem.data, digestedItem.data), this.dataTemplate);

			consumerItem.text.merge(digestedItem.text);
			return this;
		}
	}, {
		key: 'deleteSpan',
		value: function deleteSpan(startIndex, startTextIndex, endIndex, endTextIndex, merge, mergeFn) {
			if (merge == null) {
				merge = true;
			}
			if (mergeFn == null) {
				mergeFn = _textGroupUtil2.default.defaultMergeFn;
			}
			var startItem = this.items[startIndex];
			var endItem = this.items[endIndex];

			if (!startItem) {
				startItem = this.first;
			}
			if (!endItem) {
				endItem = this.last;
			}

			var startText = startItem.text;
			var endText = endItem.text;

			if (startText === endText) {
				startText.deleteText(startTextIndex, endTextIndex);
				return;
			}

			startText.deleteText(startTextIndex, startText.length);
			endText.deleteText(0, endTextIndex);

			if (merge) {
				var newItems = [];
				for (var i = 0; i < this.items.length; i++) {
					var item = this.items[i];
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
		}

		// deletes text but doesn't remove empty texts and doesn't merge any text

	}, {
		key: 'clearSpan',
		value: function clearSpan(startIndex, startTextIndex, endIndex, endTextIndex) {
			var startItem = this.items[startIndex];
			var endItem = this.items[endIndex];
			var startText = startItem.text;
			var endText = endItem.text;

			if (startText === endText) {
				startText.deleteText(startTextIndex, endTextIndex);
				return;
			}

			startText.deleteText(startTextIndex, startText.length);
			endText.deleteText(0, endTextIndex);

			for (var i = 0; i < this.items.length; i++) {
				var item = this.items[i];
				if (i > startIndex && i < endIndex) {
					item.text.init();
				}
			}

			return this;
		}
	}, {
		key: 'styleText',
		value: function styleText(startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
			return this.applyStyleFunction('styleText', arguments);
		}
	}, {
		key: 'unstyleText',
		value: function unstyleText(startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
			return this.applyStyleFunction('unstyleText', arguments);
		}

		//@TODO - This won't work correctly

	}, {
		key: 'toggleStyleText',
		value: function toggleStyleText(startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
			return this.applyStyleFunction('toggleStyleText', arguments);
		}
	}, {
		key: 'applyStyleFunction',
		value: function applyStyleFunction(fn, args) {
			var _Array$from = Array.from(args),
			    _Array$from2 = _slicedToArray(_Array$from, 6),
			    startIndex = _Array$from2[0],
			    startTextIndex = _Array$from2[1],
			    endIndex = _Array$from2[2],
			    endTextIndex = _Array$from2[3],
			    styleType = _Array$from2[4],
			    styleData = _Array$from2[5];

			// console.log 'APPLY STYLE FUNCTION', startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData

			var startItem = this.items[startIndex];
			var endItem = this.items[endIndex];
			var startText = startItem.text;
			var endText = endItem.text;

			if (startText === endText) {
				startText[fn](styleType, startTextIndex, endTextIndex, styleData);
				return;
			}

			var foundStartText = false;
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = Array.from(this.items)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var item = _step7.value;

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
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7.return) {
						_iterator7.return();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}

			return this;
		}
	}, {
		key: 'getStyles',
		value: function getStyles(startIndex, startTextIndex, endIndex, endTextIndex) {
			var style = void 0;
			var startItem = this.items[startIndex];
			var endItem = this.items[endIndex];

			if (startItem == null || endItem == null) {
				return {};
			}

			var startText = startItem.text;
			var endText = endItem.text;

			if (startText == null || endText == null) {
				return {};
			}

			if (startText === endText) {
				return startText.getStyles(startTextIndex, endTextIndex);
			}

			var numTexts = 0;
			var allStyles = {};
			var foundStartText = false;
			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = Array.from(this.items)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var item = _step8.value;

					var styles = {};

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
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}

			var returnedStyles = {};
			for (style in allStyles) {
				if (allStyles[style] === numTexts) {
					returnedStyles[style] = style;
				}
			}

			return returnedStyles;
		}
	}, {
		key: '__debug_print',
		value: function __debug_print() {
			console.log('========================');
			return Array.from(this.items).map(function (item) {
				return item.text.__debug_print(), console.log(JSON.stringify(item.data)), console.log('---------------------');
			});
		}
	}]);

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
	if (restoreDataDescriptorFn == null) {
		restoreDataDescriptorFn = _textGroupUtil2.default.defaultCloneFn;
	}
	var items = [];
	var _iteratorNormalCompletion9 = true;
	var _didIteratorError9 = false;
	var _iteratorError9 = undefined;

	try {
		for (var _iterator9 = Array.from(descriptor)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
			var item = _step9.value;

			items.push(createChild(_styleableText2.default.createFromObject(item.text), restoreDataDescriptorFn(item.data), dataTemplate));
		}
	} catch (err) {
		_didIteratorError9 = true;
		_iteratorError9 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion9 && _iterator9.return) {
				_iterator9.return();
			}
		} finally {
			if (_didIteratorError9) {
				throw _iteratorError9;
			}
		}
	}

	return new TextGroup(maxItems, dataTemplate, items);
};

TextGroup.create = function (maxItems, dataTemplate, numItemsToCreate) {
	if (maxItems == null) {
		maxItems = Infinity;
	}
	if (dataTemplate == null) {
		dataTemplate = {};
	}
	if (numItemsToCreate == null) {
		numItemsToCreate = 1;
	}
	var group = new TextGroup(maxItems, dataTemplate);
	group.init(numItemsToCreate);

	return group;
};

//@TODO
window.TextGroup = TextGroup;

exports.default = TextGroup;

/***/ }),

/***/ 133:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleType = __webpack_require__(16);

var _styleType2 = _interopRequireDefault(_styleType);

var _styleRange = __webpack_require__(28);

var _styleRange2 = _interopRequireDefault(_styleRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var keySortFn = function keySortFn(a, b) {
	return Number(a) - Number(b);
};

var ChunkStyleList = function () {
	function ChunkStyleList() {
		_classCallCheck(this, ChunkStyleList);

		this.clear();
	}

	_createClass(ChunkStyleList, [{
		key: 'clear',
		value: function clear() {
			return this.styles = [];
		}

		// Object.observe @styles, ->
		// 	console.log 'chunkstylelist changed'

	}, {
		key: 'getExportedObject',
		value: function getExportedObject() {
			if (this.styles.length === 0) {
				return null;
			}

			var output = [];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Array.from(this.styles)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var style = _step.value;

					output.push(style.getExportedObject());
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

			return output;
		}
	}, {
		key: 'clone',
		value: function clone() {
			var cloneStyleList = new ChunkStyleList();

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = Array.from(this.styles)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var style = _step2.value;

					cloneStyleList.add(style.clone());
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return cloneStyleList;
		}
	}, {
		key: 'length',
		value: function length() {
			return this.styles.length;
		}
	}, {
		key: 'get',
		value: function get() {
			return this.styles[i];
		}
	}, {
		key: 'add',
		value: function add(styleRange) {
			return this.styles.push(styleRange);
		}

		// does not consider data

	}, {
		key: 'remove',
		value: function remove(styleRange) {
			var comparisons = this.getStyleComparisonsForRange(styleRange.start, styleRange.end, styleRange.type);

			// For any ranges that are enscapulated by this range we simply delete them
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = Array.from(comparisons.enscapsulatedBy)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var co = _step3.value;

					co.invalidate();
				}

				// For any left ranges we need to trim off the right side
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = Array.from(comparisons.left)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					co = _step4.value;

					co.end = styleRange.start;
				}

				// For any right ranges we need to trim off the left side
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = Array.from(comparisons.right)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					co = _step5.value;

					co.start = styleRange.end;
				}

				// For any contained ranges we have to split them into two new ranges
				// However we remove any new ranges if they have a length of 0
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = Array.from(comparisons.contains)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					co = _step6.value;

					var leftRange = co;
					var origEnd = leftRange.end;
					leftRange.end = styleRange.start;

					var rightRange = new _styleRange2.default(styleRange.end, origEnd, co.type, co.data);

					if (leftRange.length() === 0) {
						leftRange.invalidate();
					}

					if (rightRange.length() > 0) {
						this.add(rightRange);
					}
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			return this.normalize();
		}

		// type is optional

	}, {
		key: 'getStyleComparisonsForRange',
		value: function getStyleComparisonsForRange(from, to, type) {
			type = type || null;
			to = to || from;

			var comparisons = {
				after: [],
				before: [],
				enscapsulatedBy: [],
				contains: [],
				left: [],
				right: []
			};

			//@TODO - optimize
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = Array.from(this.styles)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var style = _step7.value;

					var curComparison = style.compareToRange(from, to);
					if (type === null || style.type === type) {
						comparisons[curComparison].push(style);
					}
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7.return) {
						_iterator7.return();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}

			return comparisons;
		}

		// Return true if the entire text range is styled by styleType

	}, {
		key: 'rangeHasStyle',
		value: function rangeHasStyle(from, to, styleType) {
			return this.getStyleComparisonsForRange(from, to, styleType).contains.length > 0;
		}

		// Returns a simple object with all the styles that are within the entire text range

	}, {
		key: 'getStylesInRange',
		value: function getStylesInRange(from, to) {
			var styles = {};

			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = Array.from(this.getStyleComparisonsForRange(from, to).contains)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var range = _step8.value;

					styles[range.type] = range.type;
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}

			return styles;
		}
	}, {
		key: 'getStyles',
		value: function getStyles() {
			var styles = {};

			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = Array.from(this.styles)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var range = _step9.value;

					styles[range.type] = range.type;
				}
			} catch (err) {
				_didIteratorError9 = true;
				_iteratorError9 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion9 && _iterator9.return) {
						_iterator9.return();
					}
				} finally {
					if (_didIteratorError9) {
						throw _iteratorError9;
					}
				}
			}

			return styles;
		}

		// Moves each item in the list by byAmount
		// shift: (byAmount) ->
		// 	for range in @styles
		// 		range.start += byAmount
		// 		range.end += byAmount

	}, {
		key: 'cleanupSuperscripts',
		value: function cleanupSuperscripts() {
			// console.log 'cleanupSubSup', @styles

			var level = void 0;
			var mark = [];
			var newStyles = [];

			var _iteratorNormalCompletion10 = true;
			var _didIteratorError10 = false;
			var _iteratorError10 = undefined;

			try {
				for (var _iterator10 = Array.from(this.styles)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
					var styleRange = _step10.value;

					if (styleRange.type !== _styleType2.default.SUPERSCRIPT) {
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

				// console.log 'mark', mark
			} catch (err) {
				_didIteratorError10 = true;
				_iteratorError10 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion10 && _iterator10.return) {
						_iterator10.return();
					}
				} finally {
					if (_didIteratorError10) {
						throw _iteratorError10;
					}
				}
			}

			var curRange = new _styleRange2.default(-1, -1, _styleType2.default.SUPERSCRIPT, 0);
			var curLevel = 0;
			for (var _i = 0; _i < mark.length; _i++) {
				level = mark[_i];
				if (mark[_i] == null) {
					continue;
				}

				curLevel += level;

				if (curRange.start === -1) {
					curRange.start = _i;
					curRange.data = curLevel;
				} else if (curRange.end === -1) {
					curRange.end = _i;

					if (curRange.data !== 0) {
						newStyles.push(curRange);
					}

					curRange = new _styleRange2.default(_i, -1, _styleType2.default.SUPERSCRIPT, curLevel);
				}
			}

			// console.log 'styles before', JSON.stringify(@styles, null, 2)
			return this.styles = newStyles;
		}
		// @styles.length = 0
		// for style in newStyles
		// 	@styles.push style
		// console.log 'styles after ', JSON.stringify(@styles, null, 2)

		// 1. Loop through every style range for every type
		// 2. In an array A add 1 to A[range.start] and add -1 to A[range.end]
		// 3. Clear out the style list.
		// 4. Loop through A
		// 5. When you find a 1, that starts a new range
		// 6. Continue to add up numbers that you discover
		// 7. When your total is a 0 that ends the range

	}, {
		key: 'normalize',
		value: function normalize() {
			// console.time 'normalize'
			//@TODO - possible to improve runtime if we sort the styles?

			var i = void 0,
			    styleType = void 0;
			this.cleanupSuperscripts();

			var newStyles = [];

			// We can't merge in link styles since they might have different URLs!
			// We have to treat them seperately
			// [b: [b], i: [i], a: [google, microsoft]]
			var datasToCheck = {};
			var dataValues = {};
			//@TODO - is it ok here to rely on this object's order?
			for (var styleName in _styleType2.default) {
				styleType = _styleType2.default[styleName];
				datasToCheck[styleType] = [];
				dataValues[styleType] = [];
			}

			for (i = this.styles.length - 1; i >= 0; i--) {
				var styleRange = this.styles[i];
				var curData = styleRange.data;
				var curEncodedData = JSON.stringify(curData);

				if (datasToCheck[styleRange.type].indexOf(curEncodedData) === -1) {
					datasToCheck[styleRange.type].push(curEncodedData);
					dataValues[styleRange.type].push(curData);
				}
			}

			//console.log datasToCheck
			//console.log dataValues

			for (styleType in dataValues) {
				//console.log 'loop', styleType, datas
				var datas = dataValues[styleType];
				var _iteratorNormalCompletion11 = true;
				var _didIteratorError11 = false;
				var _iteratorError11 = undefined;

				try {
					for (var _iterator11 = Array.from(datas)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
						var data = _step11.value;

						var tmp = {};
						var total = 0;
						var start = null;

						var _iteratorNormalCompletion12 = true;
						var _didIteratorError12 = false;
						var _iteratorError12 = undefined;

						try {
							for (var _iterator12 = Array.from(this.styles)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
								var range = _step12.value;

								// range.invalidate() if range.length() is 0 #<-----@TODO

								if (range.isMergeable(styleType, data)) {
									if (tmp[range.start] == null) {
										tmp[range.start] = 0;
									}
									if (tmp[range.end] == null) {
										tmp[range.end] = 0;
									}

									tmp[range.start]++;
									tmp[range.end]--;
								}
							}
						} catch (err) {
							_didIteratorError12 = true;
							_iteratorError12 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion12 && _iterator12.return) {
									_iterator12.return();
								}
							} finally {
								if (_didIteratorError12) {
									throw _iteratorError12;
								}
							}
						}

						var keys = Object.keys(tmp).sort(keySortFn);

						var _iteratorNormalCompletion13 = true;
						var _didIteratorError13 = false;
						var _iteratorError13 = undefined;

						try {
							for (var _iterator13 = Array.from(keys)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
								var key = _step13.value;

								var end = Number(key);
								var t = tmp[key];
								// if not isNaN t
								// console.log 'here'
								if (start == null) {
									start = end;
								}
								total += t;
								if (total === 0) {
									newStyles.push(new _styleRange2.default(start, end, styleType, data));
									start = null;
								}
							}
						} catch (err) {
							_didIteratorError13 = true;
							_iteratorError13 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion13 && _iterator13.return) {
									_iterator13.return();
								}
							} finally {
								if (_didIteratorError13) {
									throw _iteratorError13;
								}
							}
						}
					}
				} catch (err) {
					_didIteratorError11 = true;
					_iteratorError11 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion11 && _iterator11.return) {
							_iterator11.return();
						}
					} finally {
						if (_didIteratorError11) {
							throw _iteratorError11;
						}
					}
				}
			}

			for (i = newStyles.length - 1; i >= 0; i--) {
				var style = newStyles[i];
				if (style.isInvalid()) {
					newStyles.splice(i, 1);
				}
			}

			return this.styles = newStyles;
		}
	}]);

	return ChunkStyleList;
}();

// console.timeEnd 'normalize'

ChunkStyleList.createFromObject = function (o) {
	var styleList = new ChunkStyleList();

	if (o != null) {
		var _iteratorNormalCompletion14 = true;
		var _didIteratorError14 = false;
		var _iteratorError14 = undefined;

		try {
			for (var _iterator14 = Array.from(o)[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
				var rangeObj = _step14.value;

				styleList.add(_styleRange2.default.createFromObject(rangeObj));
			}
		} catch (err) {
			_didIteratorError14 = true;
			_iteratorError14 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion14 && _iterator14.return) {
					_iterator14.return();
				}
			} finally {
				if (_didIteratorError14) {
					throw _iteratorError14;
				}
			}
		}
	}

	return styleList;
};

exports.default = ChunkStyleList;

/***/ }),

/***/ 134:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var sanitize = function sanitize(node) {
	if (node.nodeType === Node.ELEMENT_NODE) {
		if (node.tagName.toLowerCase() === 'script') {
			node = node.parentElement.replaceChild(document.createElement('span'), node);
		}

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = Array.from(node.attributes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var attr = _step.value;

				switch (attr.name) {
					case 'href':case 'cite':case 'style':
						true; //do nothing
						break;
					default:
						node.setAttribute(attr.name, '');
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

		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = Array.from(node.childNodes)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var child = _step2.value;

				sanitize(child);
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}
	}

	return node;
};

var isElementInline = function isElementInline(el) {
	switch (el.tagName.toLowerCase()) {
		case 'b':case 'big':case 'i':case 'small':case 'tt':case 'abbr':case 'acronym':case 'cite':case 'code':case 'dfn':case 'em':case 'kbd':case 'strong':case 'samp':case 'time':case 'var':case 'a':case 'bdo':case 'br':case 'img':case 'map':case 'object':case 'q':case 'script':case 'span':case 'sub':case 'sup':case 'button':case 'input':case 'label':case 'select':case 'textarea':
			return true;
		default:
			return false;
	}
};

exports.sanitize = sanitize;
exports.isElementInline = isElementInline;

/***/ }),

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var StyleType = {
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

exports.default = StyleType;

/***/ }),

/***/ 160:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 181:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(44);


/***/ }),

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _objectAssign = __webpack_require__(13);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	createData: function createData(data, template) {
		var clone = (0, _objectAssign2.default)({}, data);

		for (var key in clone) {
			if (template[key] == null) {
				delete clone[key];
			}
		}

		for (key in template) {
			if (clone[key] == null) {
				if (_typeof(template[key]) === 'object') {
					clone[key] = (0, _objectAssign2.default)({}, template[key]);
				} else {
					clone[key] = template[key];
				}
			}
		}

		return clone;
	},
	defaultCloneFn: function defaultCloneFn(data) {
		return (0, _objectAssign2.default)({}, data);
	},
	defaultMergeFn: function defaultMergeFn(consumer, digested) {
		return consumer;
	}
};

/***/ }),

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleType = __webpack_require__(16);

var _styleType2 = _interopRequireDefault(_styleType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StyleRange = function () {
	function StyleRange(start, end, type, data) {
		_classCallCheck(this, StyleRange);

		if (start == null) {
			start = 0;
		}
		if (end == null) {
			end = 0;
		}
		if (type == null) {
			type = '';
		}
		this.type = type;
		if (data == null) {
			data = {};
		}
		this.data = data;
		this.start = parseInt(start, 10);
		this.end = parseInt(end, 10);
	}

	_createClass(StyleRange, [{
		key: 'clone',
		value: function clone() {
			//@TODO - assumes 'data' is not an object (otherwise we should clone it)
			return new StyleRange(this.start, this.end, this.type, this.data);
		}
	}, {
		key: 'getExportedObject',
		value: function getExportedObject() {
			return {
				type: this.type,
				start: this.start,
				end: this.end,
				data: this.data
			};
		}
	}, {
		key: 'toString',
		value: function toString() {
			return this.type + ":" + this.start + "," + this.end + "(" + this.data + ")";
		}
	}, {
		key: 'isInvalid',
		value: function isInvalid() {
			// @length() is 0 and @start > -1 and @end > -1
			return this.length() === 0 && this.start !== 0 && this.end !== 0;
		}

		// Instead of deleting a range it might be more useful
		// to invalidate it now and delete it later

	}, {
		key: 'invalidate',
		value: function invalidate() {
			return this.start = this.end = -1;
		}
		// @start = @end = 0

	}, {
		key: 'compareToRange',
		value: function compareToRange(from, to) {
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
		}
	}, {
		key: 'length',
		value: function length() {
			return this.end - this.start;
		}
	}, {
		key: 'isMergeable',
		value: function isMergeable(otherType, otherData) {
			if (this.type !== otherType) {
				return false;
			}

			//return false if @type is StyleType.SUPERSCRIPT or @type is StyleType.SUBSCRIPT

			if (this.data instanceof Object) {
				for (var k in this.data) {
					var v = this.data[k];
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
		}
	}]);

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

exports.default = StyleRange;

/***/ }),

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectAssign = __webpack_require__(13);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _chunkStyleList = __webpack_require__(133);

var _chunkStyleList2 = _interopRequireDefault(_chunkStyleList);

var _styleRange = __webpack_require__(28);

var _styleRange2 = _interopRequireDefault(_styleRange);

var _styleType = __webpack_require__(16);

var _styleType2 = _interopRequireDefault(_styleType);

var _htmlUtil = __webpack_require__(134);

var _htmlUtil2 = _interopRequireDefault(_htmlUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ceiling Infinity end values to the length
var trimStyleRange = function trimStyleRange(styleRange, maxLength) {
	styleRange.end = Math.min(styleRange.end, maxLength);
	return styleRange;
};

var StyleableText = function () {
	function StyleableText(text) {
		_classCallCheck(this, StyleableText);

		if (text == null) {
			text = '';
		}
		this.init();
		this.insertText(0, text);
	}

	_createClass(StyleableText, [{
		key: 'init',
		value: function init() {
			this.styleList = new _chunkStyleList2.default();
			return this.value = '';
		}
	}, {
		key: 'clone',
		value: function clone() {
			var clone = new StyleableText();
			clone.value = this.value;
			clone.styleList = this.styleList.clone();

			return clone;
		}
	}, {
		key: 'getExportedObject',
		value: function getExportedObject() {
			return {
				value: this.value,
				styleList: this.styleList.getExportedObject()
			};
		}
	}, {
		key: 'setText',
		value: function setText(text) {
			this.init();
			return this.insertText(0, text);
		}
	}, {
		key: 'replaceText',
		value: function replaceText(from, to, text) {
			if (text == null || text.length === 0) {
				return this.deleteText(from, to);
			}

			// Goal: The replaced text should adopt the styles of where the range starts.
			// The following combination of commands achieves what we want
			this.insertText(from + 1, text);
			this.normalizeStyles();
			this.deleteText(from, from + 1);
			this.normalizeStyles();
			this.deleteText(from + text.length, to + text.length - 1);
			return this.normalizeStyles();
		}
	}, {
		key: 'appendText',
		value: function appendText(text) {
			return this.insertText(this.length, text);
		}
	}, {
		key: 'insertText',
		value: function insertText(atIndex, text) {
			var insertLength = text.length;

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Array.from(this.styleList.styles)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var range = _step.value;

					switch (range.compareToRange(atIndex)) {
						case _styleRange2.default.CONTAINS:
							range.end += insertLength;
							break;

						case _styleRange2.default.AFTER:
							range.start += insertLength;
							range.end += insertLength;
							break;
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

			this.value = this.value.substring(0, atIndex) + text + this.value.substring(atIndex);

			return this.normalizeStyles();
		}
	}, {
		key: 'deleteText',
		value: function deleteText(from, to) {
			if (from == null) {
				from = -1;
			}
			if (to == null) {
				to = Infinity;
			}
			if (from > to) {
				return;
			}

			from = Math.max(0, from);
			to = Math.min(to, this.value.length);

			var deleteLength = to - from;

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = Array.from(this.styleList.styles)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var range = _step2.value;

					switch (range.compareToRange(from, to)) {
						case _styleRange2.default.CONTAINS:
							range.end -= deleteLength;
							break;

						case _styleRange2.default.INSIDE_LEFT:
							range.end = from;
							break;

						case _styleRange2.default.ENSCAPSULATED_BY:
							range.invalidate();
							break;

						case _styleRange2.default.INSIDE_RIGHT:
							range.start = from;
							range.end -= deleteLength;
							break;

						case _styleRange2.default.AFTER:
							range.start -= deleteLength;
							range.end -= deleteLength;
							break;
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			this.value = this.value.substring(0, from) + this.value.substring(to);

			return this.normalizeStyles();
		}
	}, {
		key: 'toggleStyleText',
		value: function toggleStyleText(styleType, from, to, styleData) {
			if (from == null) {
				from = 0;
			}
			if (to == null) {
				to = this.length;
			}
			var styleRange = trimStyleRange(new _styleRange2.default(from, to, styleType, styleData), this.value.length);
			if (this.styleList.rangeHasStyle(from, Math.min(to, this.value.length), styleType)) {
				this.styleList.remove(styleRange);
			} else {
				this.styleList.add(styleRange);
			}

			return this.normalizeStyles();
		}
	}, {
		key: 'styleText',
		value: function styleText(styleType, from, to, styleData) {
			if (from == null) {
				from = 0;
			}
			if (to == null) {
				to = this.length;
			}
			var range = new _styleRange2.default(from, to, styleType, styleData);

			var styleRange = trimStyleRange(range, this.value.length);
			this.styleList.add(styleRange);

			return this.normalizeStyles();
		}
	}, {
		key: 'unstyleText',
		value: function unstyleText(styleType, from, to) {
			if (from == null) {
				from = 0;
			}
			if (to == null) {
				to = this.length;
			}
			var styleRange = trimStyleRange(new _styleRange2.default(from, to, styleType), this.value.length);
			this.styleList.remove(styleRange);
			return this.normalizeStyles();
		}
	}, {
		key: 'getStyles',
		value: function getStyles(from, to) {
			return this.styleList.getStylesInRange(from, to);
		}
	}, {
		key: 'split',
		value: function split(atIndex) {
			if (isNaN(atIndex)) {
				return null;
			}

			var splitAtEnd = atIndex === this.value.length;

			var sibling = this.clone();

			this.deleteText(atIndex, this.value.length);

			sibling.deleteText(0, atIndex);

			// special case - if splitting at the end of a line
			// we want to shove the last character styles as
			// initial styles into the new sibling.
			if (splitAtEnd) {
				var lastCharStyles = this.styleList.getStylesInRange(this.value.length - 1, this.value.length);
				for (var style in lastCharStyles) {
					sibling.styleText(style, 0, 0);
				} //@TODO - what about data?
			}

			return sibling;
		}
	}, {
		key: 'normalizeStyles',
		value: function normalizeStyles() {
			return this.styleList.normalize();
		}
	}, {
		key: 'merge',
		value: function merge(otherText, atIndex) {
			if (atIndex == null) {
				atIndex = null;
			}
			if (atIndex == null) {
				atIndex = this.value.length;
			}

			var insertLength = otherText.value.length;

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = Array.from(this.styleList.styles)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var range = _step3.value;

					switch (range.compareToRange(atIndex)) {
						case _styleRange2.default.AFTER:
							range.start += insertLength;
							range.end += insertLength;
							break;
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			this.value = this.value.substring(0, atIndex) + otherText.value + this.value.substring(atIndex);

			this.styleList.normalize();

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = Array.from(otherText.styleList.styles)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					range = _step4.value;

					var curRange = range.clone();
					curRange.start += atIndex;
					curRange.end += atIndex;

					this.styleList.add(curRange);
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			return this.styleList.normalize();
		}
	}, {
		key: '__debug_print',
		value: function __debug_print() {
			var end = void 0,
			    i = void 0;
			var s1 = void 0,
			    s2 = void 0,
			    start = void 0;
			console.log('   |          |' + this.value + ' |');
			var fill = '';
			for (i = 0, end = this.value.length + 10, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
				var asc;
				fill += ' ';
			}

			var j = 0;
			return Array.from(this.styleList.styles).map(function (style) {
				return s1 = (style.type + '          ').substr(0, 10) + '|', s2 = '', function () {
					var result = [];
					for (i = 0, end1 = style.start, asc1 = 0 <= end1; asc1 ? i < end1 : i > end1; asc1 ? i++ : i--) {
						var asc1, end1;
						result.push(s2 += '·');
					}
					return result;
				}(), s2 += '<', function () {
					var result1 = [];
					for (start = style.start + 1, i = start, end2 = style.end, asc2 = start <= end2; asc2 ? i < end2 : i > end2; asc2 ? i++ : i--) {
						var asc2, end2;
						result1.push(s2 += '=');
					}
					return result1;
				}(), s2 += '>', function () {
					var result2 = [];
					for (start1 = style.end + 1, i = start1, end3 = fill.length, asc3 = start1 <= end3; asc3 ? i < end3 : i > end3; asc3 ? i++ : i--) {
						var asc3, end3, start1;
						result2.push(s2 += '·');
					}
					return result2;
				}(), console.log((j + '   ').substr(0, 3) + '|' + (s1 + s2 + fill).substr(0, fill.length + 1) + '|' + style.start + ',' + style.end + '|' + JSON.stringify(style.data)), // + '|' + style.__debug
				j++;
			});
		}
	}]);

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
	var st = new StyleableText();
	st.styleList = _chunkStyleList2.default.createFromObject(o.styleList);
	st.value = o.value;

	return st;
};

StyleableText.getStylesOfElement = function (el) {
	// console.warn 'MOVE THIS SOMEWHERE ELSE!!!!'

	if (el.nodeType !== Node.ELEMENT_NODE) {
		return [];
	}

	var styles = [];

	var computedStyle = window.getComputedStyle(el);

	// debugger;

	// console.log '___________', el, computedStyle, computedStyle.getPropertyValue('font-weight')

	switch (computedStyle.getPropertyValue('font-weight')) {
		case "bold":case "bolder":case "700":case "800":case "900":
			styles.push({ type: _styleType2.default.BOLD });break;
	}

	switch (computedStyle.getPropertyValue('text-decoration')) {
		case "line-through":
			styles.push({ type: _styleType2.default.STRIKETHROUGH });break;
	}

	switch (computedStyle.getPropertyValue('font-style')) {
		case "italic":
			styles.push({ type: _styleType2.default.ITALIC });break;
	}

	switch (computedStyle.getPropertyValue('font-family').toLowerCase()) {
		case "monospace":
			styles.push({ type: _styleType2.default.MONOSPACE });break;
	}

	// switch computedStyle.getPropertyValue('vertical-align') + "|" + computedStyle.getPropertyValue('font-size')
	// 	when "super|smaller" then styles.push { type:StyleType.SUPERSCRIPT }
	// 	when "sub|smaller"   then styles.push { type:StyleType.SUBSCRIPT }

	switch (el.tagName.toLowerCase()) {
		//when 'b'               then styles.push { type:StyleType.BOLD }
		case 'a':
			if (el.getAttribute('href') != null) {
				styles.push({ type: _styleType2.default.LINK, data: { href: el.getAttribute('href') } });
			}
			break;
		case 'q':
			styles.push({ type: _styleType2.default.QUOTE, data: el.getAttribute('cite') });break;
		//@TODO:
		// when 'abbr', 'acronym' then styles.push { type:StyleType.COMMENT, data:el.getAttribute('title') }
		case 'sup':
			styles.push({ type: _styleType2.default.SUPERSCRIPT, data: 1 });break;
		case 'sub':
			styles.push({ type: _styleType2.default.SUPERSCRIPT, data: -1 });break;
	}
	// @TODO:
	// when 'span'
	// 	if el.classList.contains('comment') and el.hasAttribute('data-additional')
	// 		styles.push { type:StyleType.COMMENT, data:el.getAttribute('data-additional') }

	return styles;
};

StyleableText.createFromElement = function (node) {
	var state = void 0;
	if (node == null) {
		return new StyleableText();
	}

	// console.warn '@TODO - MOVE THIS method somewhere else!'

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
			if (state.curText.length > 0 && !_htmlUtil2.default.isElementInline(node)) {
				state.texts.push(state.curText);
				state.curText.styleList.normalize();

				state.curText = new StyleableText();
			}

			var styles = StyleableText.getStylesOfElement(node);
			var ranges = [];
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = Array.from(styles)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var style = _step5.value;

					var styleRange = new _styleRange2.default(state.curText.value.length, Infinity, style.type, style.data);
					ranges.push(styleRange);
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = Array.from(node.childNodes)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var childNode = _step6.value;

					StyleableText.createFromElement(childNode, state);
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			return Array.from(ranges).map(function (range) {
				return range.end = state.curText.value.length, state.curText.styleList.add(range);
			});
	}
};

// @TODO
window.__st = StyleableText;

exports.default = StyleableText;

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ObojoboDraft = __webpack_require__(0);

var _ObojoboDraft2 = _interopRequireDefault(_ObojoboDraft);

var _textGroupAdapter = __webpack_require__(130);

var _textGroupAdapter2 = _interopRequireDefault(_textGroupAdapter);

var _viewerComponent = __webpack_require__(127);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _ObojoboDraft2.default.chunk.textChunk.TextGroupSelectionHandler;

_ObojoboDraft2.default.Store.registerModel('ObojoboDraft.Chunks.Text', {
	type: 'chunk',
	default: true,
	adapter: _textGroupAdapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler()
});

/***/ })

/******/ });