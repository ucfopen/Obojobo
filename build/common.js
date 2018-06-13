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
/******/ 	return __webpack_require__(__webpack_require__.s = 91);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Dispatcher = Backbone.Events;

exports.default = Dispatcher;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = __webpack_require__(37);

var _uuid2 = _interopRequireDefault(_uuid);

var _dispatcher = __webpack_require__(0);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _store = __webpack_require__(27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DefaultAdapter = {
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

var OboModel = function (_Backbone$Model) {
	_inherits(OboModel, _Backbone$Model);

	_createClass(OboModel, [{
		key: 'defaults',
		value: function defaults() {
			return {
				id: null,
				content: {},
				metadata: {},
				index: 0,
				type: ''
			};
		}
	}]);

	function OboModel(attrs, adapter) {
		_classCallCheck(this, OboModel);

		if (adapter == null) {
			adapter = {};
		}

		var _this = _possibleConstructorReturn(this, (OboModel.__proto__ || Object.getPrototypeOf(OboModel)).call(this, attrs));

		_this.parent = null;
		_this.children = new OboModelCollection();
		_this.triggers = [];
		_this.title = null;

		_this.modelState = {
			dirty: false,
			needsUpdate: false,
			editing: false
		};

		if (attrs.id == null) {
			attrs.id = _this.createNewLocalId();
		}

		_this.adapter = Object.assign(Object.assign({}, DefaultAdapter), adapter);
		_this.adapter.construct(_this, attrs);

		if ((attrs.content != null ? attrs.content.triggers : undefined) != null) {
			_this.triggers = attrs.content.triggers;
		}

		if ((attrs.content != null ? attrs.content.title : undefined) != null) {
			_this.title = attrs.content.title;
		}

		_this.children.on('remove', _this.onChildRemove, _this);
		_this.children.on('add', _this.onChildAdd, _this);
		_this.children.on('reset', _this.onChildrenReset, _this);

		OboModel.models[_this.get('id')] = _this;
		return _this;
	}

	_createClass(OboModel, [{
		key: 'getRoot',
		value: function getRoot() {
			var root = this;
			while (root !== null) {
				if (root.parent) {
					root = root.parent;
				} else {
					return root;
				}
			}
		}
	}, {
		key: 'processTrigger',
		value: function processTrigger(type) {
			var _this2 = this;

			var index = void 0;
			var triggersToDelete = [];

			for (var trigIndex = 0; trigIndex < this.triggers.length; trigIndex++) {
				var trigger = this.triggers[trigIndex];
				if (trigger.type === type) {
					for (index = 0; index < trigger.actions.length; index++) {
						var action = trigger.actions[index];
						if (action.type === '_js') {
							eval(action.value);
						} else {
							_dispatcher2.default.trigger(action.type, action);
						}
					}

					if (trigger.run != null && trigger.run === 'once') {
						triggersToDelete.unshift(trigIndex);
					}
				}
			}

			return function () {
				var result = [];
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = Array.from(triggersToDelete)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						index = _step.value;

						result.push(_this2.triggers.splice(index, 1));
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

				return result;
			}();
		}
	}, {
		key: 'onChildRemove',
		value: function onChildRemove(model, collection, options) {
			model.parent = null;
			model.markDirty();

			return delete OboModel.models[model.get('id')];
		}

		// @TODO Should this dirty model or parent?

	}, {
		key: 'onChildAdd',
		value: function onChildAdd(model, collection, options) {
			model.parent = this;
			return model.markDirty();
		}
	}, {
		key: 'onChildrenReset',
		value: function onChildrenReset(collection, options) {
			options.previousModels.map(function (child) {
				return child.parent = null;
			});
		}
	}, {
		key: 'createNewLocalId',
		value: function createNewLocalId() {
			return (0, _uuid2.default)();
		}
	}, {
		key: 'assignNewId',
		value: function assignNewId() {
			delete OboModel.models[this.get('id')];

			this.set('id', this.createNewLocalId());

			return OboModel.models[this.get('id')] = this;
		}

		// should be overridden

	}, {
		key: 'clone',
		value: function clone(deep) {
			if (deep == null) {
				deep = false;
			}
			var clone = new OboModel(this.attributes, this.adapter.constructor);
			this.adapter.clone(this, clone);

			if (deep && this.hasChildren()) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = Array.from(this.children.models)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var child = _step2.value;

						clone.children.add(child.clone(true));
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

			return clone;
		}
	}, {
		key: 'toJSON',
		value: function toJSON() {
			var json = _get(OboModel.prototype.__proto__ || Object.getPrototypeOf(OboModel.prototype), 'toJSON', this).call(this);
			this.adapter.toJSON(this, json);

			json.children = null;

			if (this.hasChildren()) {
				json.children = [];
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = Array.from(this.children.models)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var child = _step3.value;

						json.children.push(child.toJSON());
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

			return json;
		}
	}, {
		key: 'toText',
		value: function toText() {
			var text = this.adapter.toText(this);

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = Array.from(this.children.models)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var child = _step4.value;

					text += '\n' + child.toText();
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

			return text;
		}
	}, {
		key: 'revert',
		value: function revert() {
			var index = this.get('index');
			var id = this.get('id');
			var newModel = new this.constructor({});

			for (var attrName in newModel.attributes) {
				var attr = newModel.attributes[attrName];
				this.set(attrName, attr);
			}

			this.set('index', index);
			this.set('id', id);
			this.modelState = newModel.modelState;
			this.children.forEach(function (child) {
				return child.remove();
			});

			return this;
		}
	}, {
		key: 'markDirty',
		value: function markDirty() {
			// if (markChildren == null) { markChildren = false; }
			this.modelState.dirty = true;
			this.modelState.needsUpdate = true;

			// if (markChildren) {
			// 	return Array.from(this.children.models).map((child) =>
			// 		child.markDirty());
			// }
		}
	}, {
		key: 'markForUpdate',
		value: function markForUpdate(markChildren) {
			if (markChildren == null) {
				markChildren = false;
			}
			this.modelState.needsUpdate = true;

			if (markChildren) {
				return Array.from(this.children.models).map(function (child) {
					return child.markForUpdate();
				});
			}
		}
	}, {
		key: 'markUpdated',
		value: function markUpdated(markChildren) {
			if (markChildren == null) {
				markChildren = false;
			}
			this.modelState.needsUpdate = false;

			if (markChildren) {
				return Array.from(this.children.models).map(function (child) {
					return child.modelState.needsUpdate = false;
				});
			}
		}
	}, {
		key: 'getDomEl',
		value: function getDomEl() {
			// @TODO - This work?
			return document.body.querySelector('.component[data-id=\'' + this.get('id') + '\']');
		}
		// document.body.querySelector ".component[data-component-index='#{@getIndex()}']"

	}, {
		key: 'getComponentClass',
		value: function getComponentClass() {
			return _store.Store.getItemForType(this.get('type')).componentClass;
		}
	}, {
		key: 'hasChildren',
		value: function hasChildren() {
			return this.children.models.length > 0;
		}
	}, {
		key: 'isOrphan',
		value: function isOrphan() {
			return this.parent == null;
		}
	}, {
		key: 'addChildBefore',
		value: function addChildBefore(sibling) {
			if (this.isOrphan()) {
				return;
			}

			var children = this.parent.children;

			if (children.contains(sibling)) {
				children.remove(sibling);
			}

			return children.add(sibling, { at: this.getIndex() });
		}
	}, {
		key: 'addChildAfter',
		value: function addChildAfter(sibling) {
			if (this.isOrphan()) {
				return;
			}

			var children = this.parent.children;

			if (children.contains(sibling)) {
				children.remove(sibling);
			}

			return children.add(sibling, { at: this.getIndex() + 1 });
		}
	}, {
		key: 'moveTo',
		value: function moveTo(index) {
			if (this.getIndex() === index) {
				return;
			}

			var refChunk = this.parent.children.at(index);

			if (index < this.getIndex()) {
				return refChunk.addChildBefore(this);
			} else {
				return refChunk.addChildAfter(this);
			}
		}
	}, {
		key: 'moveToTop',
		value: function moveToTop() {
			return this.moveTo(0);
		}
	}, {
		key: 'moveToBottom',
		value: function moveToBottom() {
			return this.moveTo(this.parent.children.length - 1);
		}
	}, {
		key: 'prevSibling',
		value: function prevSibling() {
			if (this.isOrphan() || this.isFirst()) {
				return null;
			}
			return this.parent.children.at(this.getIndex() - 1);
		}
	}, {
		key: 'getIndex',
		value: function getIndex() {
			if (!this.parent) {
				return 0;
			}
			return this.parent.children.models.indexOf(this);
		}
	}, {
		key: 'nextSibling',
		value: function nextSibling() {
			if (this.isOrphan() || this.isLast()) {
				return null;
			}
			return this.parent.children.at(this.parent.children.models.indexOf(this) + 1);
		}
	}, {
		key: 'isFirst',
		value: function isFirst() {
			if (this.isOrphan()) {
				return false;
			}
			return this.getIndex() === 0;
		}
	}, {
		key: 'isLast',
		value: function isLast() {
			if (this.isOrphan()) {
				return false;
			}
			return this.getIndex() === this.parent.children.length - 1;
		}
	}, {
		key: 'isBefore',
		value: function isBefore(otherChunk) {
			if (this.isOrphan()) {
				return false;
			}
			return this.getIndex() < otherChunk.getIndex();
		}
	}, {
		key: 'isAfter',
		value: function isAfter(otherChunk) {
			if (this.isOrphan()) {
				return false;
			}
			return this.getIndex() > otherChunk.getIndex();
		}
	}, {
		key: 'remove',
		value: function remove() {
			if (!this.isOrphan()) {
				return this.parent.children.remove(this);
			}
		}
	}, {
		key: 'replaceWith',
		value: function replaceWith(newChunk) {
			if (this.isOrphan() || newChunk === this) {
				return;
			}

			this.addChildBefore(newChunk);
			return this.remove();
		}

		// getChildrenOfType: (type) ->
		// 	matching = []

		// 	for child in @children
		// 		if child.get('type') is type
		// 			matching.push child

		// 	matching

		// searchChildren: (fn) ->
		// 	for child in @children
		// 		if fn(child)
		// 			child.searchChildren fn

	}, {
		key: 'contains',
		value: function contains(child) {
			while (child !== null) {
				if (child === this) {
					return true;
				}

				child = child.parent;
			}

			return false;
		}
	}, {
		key: 'getParentOfType',
		value: function getParentOfType(type) {
			var model = this.parent;
			while (model !== null) {
				if (model.get('type') === type) {
					return model;
				}
				model = model.parent;
			}

			return null;
		}
	}]);

	return OboModel;
}(Backbone.Model);

OboModel.models = {};

//@TODO @HACK:
OboModel.getRoot = function () {
	for (var id in OboModel.models) {
		return OboModel.models[id].getRoot();
	}

	return null;
};

var OboModelCollection = function (_Backbone$Collection) {
	_inherits(OboModelCollection, _Backbone$Collection);

	function OboModelCollection() {
		_classCallCheck(this, OboModelCollection);

		return _possibleConstructorReturn(this, (OboModelCollection.__proto__ || Object.getPrototypeOf(OboModelCollection)).apply(this, arguments));
	}

	return OboModelCollection;
}(Backbone.Collection);
// model: OboModel

// reset: (models) ->
// 	if(typeof models is 'object')

// OboModel.create('chunk') = default chunk
// OboModel.create('ObojoboDraft.Chunks.List') = new list
// OboModel.create({type:'ObojoboDraft.Chunks.Table', content:{}, children:[]}) = new Table with children


OboModel.create = function (typeOrNameOrJson, attrs) {
	// try json
	if (attrs == null) {
		attrs = {};
	}
	if ((typeof typeOrNameOrJson === 'undefined' ? 'undefined' : _typeof(typeOrNameOrJson)) === 'object') {
		var oboModel = OboModel.create(typeOrNameOrJson.type, typeOrNameOrJson);

		if (oboModel != null) {
			var children = typeOrNameOrJson.children;

			if (children != null) {
				// delete typeOrNameOrJson.children

				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = Array.from(children)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var child = _step5.value;

						var c = OboModel.create(child);
						// console.log 'c be', c, oboModel.children
						oboModel.children.add(c);
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
			}
		}

		return oboModel;
	}

	var item = _store.Store.getDefaultItemForModelType(typeOrNameOrJson);
	if (!item) {
		item = _store.Store.getItemForType(typeOrNameOrJson);
	}

	if (!item) {
		return null;
	}

	attrs.type = typeOrNameOrJson;

	// console.log 'creating', typeOrNameOrJson, attrs, item
	return new OboModel(attrs, item.adapter);
};

exports.default = OboModel;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Note that parent here includes the node itself

var getTextNodesInOrderRecur = function getTextNodesInOrderRecur(element, textNodes) {
	return Array.from(element.childNodes).map(function (node) {
		return node.nodeType === Node.TEXT_NODE ? textNodes.push(node) : getTextNodesInOrderRecur(node, textNodes);
	});
};

var DOMUtil = {
	findParentWithAttr: function findParentWithAttr(node, targetAttribute) {
		var targetValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
		var rootParent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : document.body;

		while (node != null && node !== rootParent) {
			if (node.getAttribute != null) {
				var attr = node.getAttribute(targetAttribute);
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
		// return null
		var componentSet = new Set();

		var cur = node;
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
		return new Set([].concat(_toConsumableArray(DOMUtil.findParentComponentElements(node))).map(function (el) {
			return el.getAttribute('data-id');
		}));
	},
	elementLikeComponent: function elementLikeComponent(node) {
		return node.hasAttribute('data-obo-component') && node.classList.contains('component') && node.getAttribute('data-id') != null && node.getAttribute('data-type') != null;
	},
	getFirstTextNodeOfElement: function getFirstTextNodeOfElement(node) {
		while (node != null && node.nodeType !== Node.TEXT_NODE) {
			node = node.childNodes[0];
		}

		return node;
	},
	getTextNodesInOrder: function getTextNodesInOrder(element) {
		var textNodes = [];
		getTextNodesInOrderRecur(element, textNodes);
		// console.log 'GET TEXT NODES IN ORDER'
		// console.log textNodes
		return textNodes;
	}
};

exports.default = DOMUtil;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Chrome sometimes has range startContainer / endContainer as an element node
// so we need to dig down in this case to find the first text node

var _domUtil = __webpack_require__(2);

var _domUtil2 = _interopRequireDefault(_domUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOMSelection = function () {
	function DOMSelection() {
		_classCallCheck(this, DOMSelection);

		this.domSelection = window.getSelection();
		this.domRange = null;

		if (this.domSelection.rangeCount > 0) {
			this.domRange = this.domSelection.getRangeAt(0);
		}
	}

	_createClass(DOMSelection, [{
		key: 'getType',
		value: function getType() {
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
		}
	}, {
		key: 'getClientRects',
		value: function getClientRects() {
			if (this.domRange == null) {
				return [];
			}
			return this.domRange.getClientRects();
		}
	}, {
		key: 'set',
		value: function set(startNode, startOffset, endNode, endOffset) {
			// console.log 'DS.set', startNode, startOffset, endNode, endOffset

			var r = document.createRange();

			r.setStart(startNode, startOffset);
			r.setEnd(endNode, endOffset);

			this.domSelection.removeAllRanges();
			this.domSelection.addRange(r);

			this.domRange = r;

			return this;
		}
	}, {
		key: 'setStart',
		value: function setStart(node, offset) {
			return this.domRange.setStart(node, offset);
		}
	}, {
		key: 'setEnd',
		value: function setEnd(node, offset) {
			return this.domRange.setEnd(node, offset);
		}
	}, {
		key: 'includes',
		value: function includes(node) {
			// console.log 'asking if', node, 'contains', @startText, 'and', @endText
			if (node == null) {
				return false;
			}
			return node.contains(this.startText) && node.contains(this.endText);
		}
	}]);

	return DOMSelection;
}();

DOMSelection.set = function (startNode, startOffset, endNode, endOffset) {
	return (
		// console.log 'DS.set', startNode, startOffset, endNode, endOffset
		new DOMSelection().set(startNode, startOffset, endNode, endOffset)
	);
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
			return _domUtil2.default.getFirstTextNodeOfElement(this.domRange.startContainer);
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
			return _domUtil2.default.getFirstTextNodeOfElement(this.domRange.endContainer);
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

//@TODO
window.__ds = function () {
	return DOMSelection.get();
};

exports.default = DOMSelection;

/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chunkStyleList = __webpack_require__(32);

var _chunkStyleList2 = _interopRequireDefault(_chunkStyleList);

var _styleRange = __webpack_require__(8);

var _styleRange2 = _interopRequireDefault(_styleRange);

var _styleType = __webpack_require__(4);

var _styleType2 = _interopRequireDefault(_styleType);

var _htmlUtil = __webpack_require__(35);

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
	}]);

	return StyleableText;
}();

Object.defineProperties(StyleableText.prototype, {
	length: {
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
		case 'bold':
		case 'bolder':
		case '700':
		case '800':
		case '900':
			styles.push({ type: _styleType2.default.BOLD });
			break;
	}

	switch (computedStyle.getPropertyValue('text-decoration')) {
		case 'line-through':
			styles.push({ type: _styleType2.default.STRIKETHROUGH });
			break;
	}

	switch (computedStyle.getPropertyValue('font-style')) {
		case 'italic':
			styles.push({ type: _styleType2.default.ITALIC });
			break;
	}

	switch (computedStyle.getPropertyValue('font-family').toLowerCase()) {
		case 'monospace':
			styles.push({ type: _styleType2.default.MONOSPACE });
			break;
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
			styles.push({ type: _styleType2.default.QUOTE, data: el.getAttribute('cite') });
			break;
		//@TODO:
		// when 'abbr', 'acronym' then styles.push { type:StyleType.COMMENT, data:el.getAttribute('title') }
		case 'sup':
			styles.push({ type: _styleType2.default.SUPERSCRIPT, data: 1 });
			break;
		case 'sub':
			styles.push({ type: _styleType2.default.SUPERSCRIPT, data: -1 });
			break;
	}
	// @TODO:
	// when 'span'
	// 	if el.classList.contains('comment') and el.hasAttribute('data-additional')
	// 		styles.push { type:StyleType.COMMENT, data:el.getAttribute('data-additional') }

	return styles;
};

// StyleableText.createFromElement = function(node) {
// 	let state
// 	console.log('ST.cFE', node.tagName, node.innerHTML, arguments[1])
// 	if (node == null) {
// 		return new StyleableText()
// 	}

// 	// console.warn '@TODO - MOVE THIS method somewhere else!'

// 	if (arguments[1] == null) {
// 		state = {
// 			curText: new StyleableText(),
// 			texts: []
// 		}
// 		StyleableText.createFromElement(node, state)

// 		state.texts.push(state.curText)
// 		state.curText.styleList.normalize()

// 		return state.texts
// 	}

// 	state = arguments[1]

// 	switch (node.nodeType) {
// 		case Node.TEXT_NODE:
// 			return (state.curText.value += node.nodeValue)
// 		case Node.ELEMENT_NODE:
// 			if (state.curText.length > 0 && !isElementInline(node)) {
// 				state.texts.push(state.curText)
// 				state.curText.styleList.normalize()

// 				state.curText = new StyleableText()
// 			}

// 			let styles = StyleableText.getStylesOfElement(node)
// 			let ranges = []
// 			for (let style of Array.from(styles)) {
// 				let styleRange = new StyleRange(
// 					state.curText.value.length,
// 					Infinity,
// 					style.type,
// 					style.data
// 				)
// 				ranges.push(styleRange)
// 			}

// 			for (let childNode of Array.from(node.childNodes)) {
// 				StyleableText.createFromElement(childNode, state)
// 			}

// 			return Array.from(ranges).map(
// 				range => ((range.end = state.curText.value.length), state.curText.styleList.add(range))
// 			)
// 	}
// }

// @TODO
window.__st = StyleableText;

exports.default = StyleableText;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	EMPTY_CHAR_CODE: 8203,
	EMPTY_CHAR: String.fromCharCode(8203)
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _oboModel = __webpack_require__(1);

var _oboModel2 = _interopRequireDefault(_oboModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseSelectionHandler = function () {
	function BaseSelectionHandler() {
		_classCallCheck(this, BaseSelectionHandler);
	}

	_createClass(BaseSelectionHandler, [{
		key: 'getCopyOfSelection',
		value: function getCopyOfSelection(selection, chunk, cloneId) {
			if (cloneId == null) {
				cloneId = false;
			}
			return chunk.clone(cloneId);
		}
	}, {
		key: 'selectStart',
		value: function selectStart(selection, chunk, asRange) {
			return false;
		}
	}, {
		key: 'selectEnd',
		value: function selectEnd(selection, chunk, asRange) {
			return false;
		}
	}, {
		key: 'selectAll',
		value: function selectAll(selection, chunk) {
			this.selectStart(selection, chunk, true);
			return this.selectEnd(selection, chunk, true);
		}
	}, {
		key: 'getVirtualSelectionStartData',
		value: function getVirtualSelectionStartData(selection, chunk) {
			return null;
		}
	}, {
		key: 'getDOMSelectionStart',
		value: function getDOMSelectionStart(selection, chunk) {
			return null;
		}
	}, {
		key: 'getVirtualSelectionEndData',
		value: function getVirtualSelectionEndData(selection, chunk) {
			return null;
		}
	}, {
		key: 'getDOMSelectionEnd',
		value: function getDOMSelectionEnd(selection, chunk) {
			return null;
		}
	}, {
		key: 'areCursorsEquivalent',
		value: function areCursorsEquivalent(selection, chunk, thisCursorData, otherCursorData) {
			return false;
		}
	}]);

	return BaseSelectionHandler;
}();

exports.default = BaseSelectionHandler;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleType = __webpack_require__(4);

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
			return this.type + ':' + this.start + ',' + this.end + '(' + this.data + ')';
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(77);

var _isornot = __webpack_require__(62);

var _isornot2 = _interopRequireDefault(_isornot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = function (_React$Component) {
	_inherits(Button, _React$Component);

	function Button() {
		_classCallCheck(this, Button);

		return _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).apply(this, arguments));
	}

	_createClass(Button, [{
		key: 'focus',
		value: function focus() {
			var el = ReactDOM.findDOMNode(this.refs.button);
			if (el) el.focus();
		}
	}, {
		key: 'render',
		value: function render() {
			var children = void 0;
			if (this.props.value) {
				children = this.props.value;
			} else {
				;children = this.props.children;
			}

			var className = 'obojobo-draft--components--button' + (this.props.altAction ? ' alt-action' : '') + (0, _isornot2.default)(this.props.isDangerous, 'dangerous') + (' align-' + this.props.align) + (this.props.className ? ' ' + this.props.className : '');

			return React.createElement(
				'div',
				{ className: className },
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
	}], [{
		key: 'defaultProps',
		get: function get() {
			return {
				value: null,
				disabled: false,
				align: 'center'
			};
		}
	}]);

	return Button;
}(React.Component);

exports.default = Button;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(78);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeleteButton = function (_React$Component) {
	_inherits(DeleteButton, _React$Component);

	function DeleteButton() {
		_classCallCheck(this, DeleteButton);

		return _possibleConstructorReturn(this, (DeleteButton.__proto__ || Object.getPrototypeOf(DeleteButton)).apply(this, arguments));
	}

	_createClass(DeleteButton, [{
		key: "focus",
		value: function focus() {
			return ReactDOM.findDOMNode(this.refs.button).focus();
		}
	}, {
		key: "render",
		value: function render() {
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
	}], [{
		key: "defaultProps",
		get: function get() {
			return { indent: 0 };
		}
	}]);

	return DeleteButton;
}(React.Component);

exports.default = DeleteButton;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dispatcher = __webpack_require__(0);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
	function Store(name) {
		_classCallCheck(this, Store);

		this.name = name;
	}

	_createClass(Store, [{
		key: 'init',
		value: function init() {
			this.state = {};
		}
	}, {
		key: 'triggerChange',
		value: function triggerChange() {
			_dispatcher2.default.trigger(this.name + ':change');
		}
	}, {
		key: 'onChange',
		value: function onChange(callback) {
			_dispatcher2.default.on(this.name + ':change', callback);
		}
	}, {
		key: 'offChange',
		value: function offChange(callback) {
			_dispatcher2.default.off(this.name + ':change', callback);
		}
	}, {
		key: 'setAndTrigger',
		value: function setAndTrigger(keyValues) {
			Object.assign(this.state, keyValues); // merge args onto defaults
			this.triggerChange();
		}
	}, {
		key: 'getState',
		value: function getState() {
			return Object.assign({}, this.state);
		}
	}, {
		key: 'setState',
		value: function setState(newState) {
			this.state = Object.assign({}, newState);
		}
	}, {
		key: 'updateStateByContext',
		value: function updateStateByContext(obj, context) {
			for (var key in obj) {
				if (!this.state[key]) this.state[key] = {};
				this.state[key][context] = obj[key];
			}
		}
	}]);

	return Store;
}();

exports.default = Store;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _domSelection = __webpack_require__(3);

var _domSelection2 = _interopRequireDefault(_domSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OboSelectionRect = function OboSelectionRect() {
	_classCallCheck(this, OboSelectionRect);

	this.type = OboSelectionRect.TYPE_NONE;
	this.top = 0;
	this.right = 0;
	this.bottom = 0;
	this.left = 0;
	this.width = 0;
	this.height = 0;
};

Object.defineProperties(OboSelectionRect.prototype, {
	valid: {
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
	var rect = new OboSelectionRect();
	var sel = new _domSelection2.default();

	var selType = sel.getType();

	if (selType === 'none') {
		return rect;
	}

	var clientRects = sel.getClientRects();

	rect.type = selType === 'caret' ? OboSelectionRect.TYPE_CARET : OboSelectionRect.TYPE_SELECTION;
	rect.top = Infinity;
	rect.right = -Infinity;
	rect.bottom = -Infinity;
	rect.left = Infinity;

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(clientRects)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var clientRect = _step.value;

			rect.top = Math.min(rect.top, clientRect.top);
			rect.right = Math.max(rect.right, clientRect.right);
			rect.bottom = Math.max(rect.bottom, clientRect.bottom);
			rect.left = Math.min(rect.left, clientRect.left);
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

	rect.width = rect.right - rect.left;
	rect.height = rect.bottom - rect.top;

	rect.selection = sel;
	rect.chunks = null;

	return rect;
};

OboSelectionRect.createFromChunks = function (chunks) {
	if (chunks == null) {
		chunks = [];
	}
	var rect = new OboSelectionRect();
	rect.type = OboSelectionRect.TYPE_CHUNKS;
	rect.top = Infinity;
	rect.right = -Infinity;
	rect.bottom = -Infinity;
	rect.left = Infinity;

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = Array.from(chunks)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var chunk = _step2.value;

			if (chunk == null) {
				continue;
			}

			var chunkRect = chunk.getDomEl().getBoundingClientRect();

			rect.top = Math.min(rect.top, chunkRect.top);
			rect.right = Math.max(rect.right, chunkRect.right);
			rect.bottom = Math.max(rect.bottom, chunkRect.bottom);
			rect.left = Math.min(rect.left, chunkRect.left);
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

	rect.width = rect.right - rect.left;
	rect.height = rect.bottom - rect.top;

	rect.chunks = chunks;
	rect.selection = null;

	return rect;
};

exports.default = OboSelectionRect;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VirtualCursor = function () {
	function VirtualCursor(chunk, data) {
		_classCallCheck(this, VirtualCursor);

		this.chunk = chunk;
		this.data = data;
	}

	_createClass(VirtualCursor, [{
		key: "isEquivalentTo",
		value: function isEquivalentTo(otherCursor) {
			return this.chunk.areCursorsEquivalent(this, otherCursor);
		}
	}, {
		key: "clone",
		value: function clone() {
			// @chunk.cloneVirtualCaret @
			return new VirtualCursor(this.chunk, Object.assign({}, this.data));
		}
	}]);

	return VirtualCursor;
}();

exports.default = VirtualCursor;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = {
	createData: function createData(data, template) {
		var clone = Object.assign({}, data);

		for (var key in clone) {
			if (template[key] == null) {
				delete clone[key];
			}
		}

		for (key in template) {
			if (clone[key] == null) {
				if (_typeof(template[key]) === 'object') {
					clone[key] = Object.assign({}, template[key]);
				} else {
					clone[key] = template[key];
				}
			}
		}

		return clone;
	},
	defaultCloneFn: function defaultCloneFn(data) {
		return Object.assign({}, data);
	},
	defaultMergeFn: function defaultMergeFn(consumer, digested) {
		return consumer;
	}
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _dispatcher = __webpack_require__(0);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _oboModel = __webpack_require__(1);

var _oboModel2 = _interopRequireDefault(_oboModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FocusUtil = {
	focusComponent: function focusComponent(id) {
		_dispatcher2.default.trigger('focus:component', {
			value: { id: id }
		});
	},
	unfocus: function unfocus() {
		_dispatcher2.default.trigger('focus:unfocus');
	},
	getFocussedComponent: function getFocussedComponent(state) {
		return _oboModel2.default.models[state.focussedId];
	}
};

exports.default = FocusUtil;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseSelectionHandler = __webpack_require__(7);

var _baseSelectionHandler2 = _interopRequireDefault(_baseSelectionHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FocusableSelectionHandler = function (_BaseSelectionHandler) {
	_inherits(FocusableSelectionHandler, _BaseSelectionHandler);

	function FocusableSelectionHandler() {
		_classCallCheck(this, FocusableSelectionHandler);

		return _possibleConstructorReturn(this, (FocusableSelectionHandler.__proto__ || Object.getPrototypeOf(FocusableSelectionHandler)).apply(this, arguments));
	}

	_createClass(FocusableSelectionHandler, [{
		key: 'getVirtualSelectionStartData',
		value: function getVirtualSelectionStartData(selection, chunk) {
			return {
				groupIndex: 'anchor:main',
				offset: 0
			};
		}
	}, {
		key: 'getVirtualSelectionEndData',
		value: function getVirtualSelectionEndData(selection, chunk) {
			return {
				groupIndex: 'anchor:main',
				offset: 0
			};
		}
	}, {
		key: 'getDOMSelectionStart',
		value: function getDOMSelectionStart(selection, chunk) {
			return {
				textNode: chunk.getDomEl().getElementsByClassName('anchor')[0].childNodes[0],
				offset: 0
			};
		}
	}, {
		key: 'getDOMSelectionEnd',
		value: function getDOMSelectionEnd(selection, chunk) {
			return {
				textNode: chunk.getDomEl().getElementsByClassName('anchor')[0].childNodes[0],
				offset: 0
			};
		}
	}, {
		key: 'selectStart',
		value: function selectStart(selection, chunk, asRange) {
			selection.virtual.setStart(chunk, { groupIndex: 'anchor:main', offset: 0 });
			if (!asRange) {
				return selection.virtual.collapse();
			}
		}
	}, {
		key: 'selectEnd',
		value: function selectEnd(selection, chunk, asRange) {
			selection.virtual.setEnd(chunk, { groupIndex: 'anchor:main', offset: 0 });
			if (!asRange) {
				return selection.virtual.collapseToEnd();
			}
		}
	}, {
		key: 'areCursorsEquivalent',
		value: function areCursorsEquivalent(selectionWhichIsNullTODO, chunk, thisCursorData, otherCursorData) {
			return thisCursorData.offset === otherCursorData.offset && thisCursorData.groupIndex === otherCursorData.groupIndex;
		}
	}]);

	return FocusableSelectionHandler;
}(_baseSelectionHandler2.default);

exports.default = FocusableSelectionHandler;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _textConstants = __webpack_require__(6);

exports.default = function (props) {
	return React.createElement(
		'span',
		_extends({}, props, {
			className: 'anchor',
			contentEditable: true,
			tabIndex: props.shouldPreventTab ? '-1' : '',
			suppressContentEditableWarning: true,
			'data-group-index': 'anchor:' + props.name
		}),
		_textConstants.EMPTY_CHAR
	);
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(82);

exports.default = function (props) {
	return React.createElement(
		"div",
		{ className: "obojobo-draft--components--modal--bubble" },
		React.createElement(
			"div",
			{ className: "container" },
			props.children
		)
	);
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(84);

var _button = __webpack_require__(9);

var _button2 = _interopRequireDefault(_button);

var _deleteButton = __webpack_require__(10);

var _deleteButton2 = _interopRequireDefault(_deleteButton);

var _modal = __webpack_require__(21);

var _modal2 = _interopRequireDefault(_modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dialog = function (_React$Component) {
	_inherits(Dialog, _React$Component);

	function Dialog() {
		_classCallCheck(this, Dialog);

		return _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).apply(this, arguments));
	}

	_createClass(Dialog, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			return function () {
				var result = [];
				for (var index = 0; index < _this2.props.buttons.length; index++) {
					var button = _this2.props.buttons[index];
					var item = void 0;
					if (button.default) {
						item = _this2.refs['button' + index].focus();
					}
					result.push(item);
				}
				return result;
			}();
		}
	}, {
		key: 'focusOnFirstElement',
		value: function focusOnFirstElement() {
			return this.refs.button0.focus();
		}
	}, {
		key: 'render',
		value: function render() {
			var styles = null;
			if (this.props.width) {
				styles = { width: this.props.width };
			}

			return React.createElement(
				'div',
				{ className: 'obojobo-draft--components--modal--dialog', style: styles },
				React.createElement(
					_modal2.default,
					{
						onClose: this.props.onClose,
						focusOnFirstElement: this.focusOnFirstElement.bind(this),
						className: this.props.modalClassName
					},
					this.props.title ? React.createElement(
						'h1',
						{ className: 'heading', style: { textAlign: this.props.centered ? 'center' : null } },
						this.props.title
					) : null,
					React.createElement(
						'div',
						{
							className: 'dialog-content',
							style: { textAlign: this.props.centered ? 'center' : null }
						},
						this.props.children
					),
					React.createElement(
						'div',
						{ className: 'controls' },
						this.props.buttons.map(function (buttonPropsOrText, index) {
							if (typeof buttonPropsOrText === 'string') {
								return React.createElement(
									'span',
									{ key: index, className: 'text' },
									buttonPropsOrText
								);
							}
							buttonPropsOrText.key = index;
							return React.createElement(_button2.default, _extends({ ref: 'button' + index }, buttonPropsOrText));
						})
					)
				)
			);
		}
	}], [{
		key: 'defaultProps',
		get: function get() {
			return { centered: true };
		}
	}]);

	return Dialog;
}(React.Component);

exports.default = Dialog;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(85);

var _simpleDialog = __webpack_require__(22);

var _simpleDialog2 = _interopRequireDefault(_simpleDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
	return React.createElement(
		'div',
		{ className: 'obojobo-draft--components--modal--error-dialog' },
		React.createElement(
			_simpleDialog2.default,
			{ ok: true, title: props.title },
			props.children
		)
	);
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(86);

var _deleteButton = __webpack_require__(10);

var _deleteButton2 = _interopRequireDefault(_deleteButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Modal = function (_React$Component) {
	_inherits(Modal, _React$Component);

	function Modal() {
		_classCallCheck(this, Modal);

		var _this = _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).call(this));

		_this.boundKeyUp = _this.onKeyUp.bind(_this);
		return _this;
	}

	_createClass(Modal, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			if (this.props.onClose) {
				return document.addEventListener('keyup', this.boundKeyUp);
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.props.onClose) {
				return document.removeEventListener('keyup', this.boundKeyUp);
			}
		}
	}, {
		key: 'onKeyUp',
		value: function onKeyUp(event) {
			if (event.keyCode === 27) {
				//ESC
				return this.props.onClose();
			}
		}
	}, {
		key: 'onTabTrapFocus',
		value: function onTabTrapFocus() {
			if (this.props.onClose) {
				return this.refs.closeButton.focus();
			} else if (this.props.focusOnFirstElement) {
				return this.props.focusOnFirstElement();
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{
					className: 'obojobo-draft--components--modal--modal' + (this.props.className ? ' ' + this.props.className : '')
				},
				React.createElement('input', {
					className: 'first-tab',
					ref: 'firstTab',
					type: 'text',
					onFocus: this.onTabTrapFocus.bind(this)
				}),
				this.props.onClose ? React.createElement(_deleteButton2.default, { ref: 'closeButton', onClick: this.props.onClose }) : null,
				React.createElement(
					'div',
					{ className: 'content' },
					this.props.children
				),
				React.createElement('input', {
					className: 'last-tab',
					ref: 'lastTab',
					type: 'text',
					onFocus: this.onTabTrapFocus.bind(this)
				})
			);
		}
	}]);

	return Modal;
}(React.Component);

exports.default = Modal;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(87);

var _modalUtil = __webpack_require__(36);

var _modalUtil2 = _interopRequireDefault(_modalUtil);

var _dialog = __webpack_require__(19);

var _dialog2 = _interopRequireDefault(_dialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SimpleDialog = function SimpleDialog(props) {
	var buttons = void 0;
	var cancelButton = null;
	var confirmButton = null;
	if (props.ok) {
		buttons = [{
			value: 'OK',
			onClick: props.onConfirm,
			default: true
		}];
	} else if (props.noOrYes) {
		buttons = [{
			value: 'No',
			onClick: props.onCancel
		}, 'or', {
			value: 'Yes',
			onClick: props.onConfirm,
			default: true
		}];
	} else if (props.yesOrNo) {
		buttons = [{
			value: 'Yes',
			onClick: props.onConfirm
		}, 'or', {
			value: 'No',
			onClick: props.onCancel,
			default: true
		}];
	} else {
		buttons = [{
			value: 'Cancel',
			altAction: true,
			onClick: props.onCancel
		}, {
			value: 'OK',
			onClick: props.onConfirm,
			default: true
		}];
	}

	return React.createElement(
		'div',
		{ className: 'obojobo-draft--components--modal--simple-dialog' },
		React.createElement(
			_dialog2.default,
			{ centered: true, buttons: buttons, title: props.title, width: props.width },
			props.children
		)
	);
};

SimpleDialog.defaultProps = {
	ok: false,
	noOrYes: false,
	yesOrNo: false,
	cancelOk: false,
	title: null,
	width: null,
	onCancel: function onCancel() {
		return _modalUtil2.default.hide();
	},
	onConfirm: function onConfirm() {
		return _modalUtil2.default.hide();
	}
};

exports.default = SimpleDialog;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MockElement = function () {
	function MockElement(type, attrs) {
		_classCallCheck(this, MockElement);

		this.type = type;
		if (attrs == null) {
			attrs = {};
		}
		this.attrs = attrs;
		this.nodeType = 'element';
		this.children = [];
		this.parent = null;
	}

	_createClass(MockElement, [{
		key: 'addChild',
		value: function addChild(child) {
			this.children.push(child);
			return child.parent = this;
		}
	}, {
		key: 'addChildAt',
		value: function addChildAt(child, atIndex) {
			this.children.splice(atIndex, 0, child);
			return child.parent = this;
		}
	}, {
		key: 'addBefore',
		value: function addBefore(childToAdd, targetChild) {
			var index = this.children.indexOf(targetChild);
			return this.addChildAt(childToAdd, index);
		}
	}, {
		key: 'addAfter',
		value: function addAfter(childToAdd, targetChild) {
			var index = this.children.indexOf(targetChild);
			return this.addChildAt(childToAdd, index + 1);
		}
	}, {
		key: 'replaceChild',
		value: function replaceChild(childToReplace, newChild) {
			var index = this.children.indexOf(childToReplace);
			this.children[index] = newChild;
			newChild.parent = this;
			return childToReplace.parent = null;
		}
	}]);

	return MockElement;
}();

Object.defineProperties(MockElement.prototype, {
	firstChild: {
		get: function get() {
			return this.children[0];
		}
	},
	lastChild: {
		get: function get() {
			return this.children[this.children.length - 1];
		}
	}
});

exports.default = MockElement;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MockTextNode = function MockTextNode(text) {
	_classCallCheck(this, MockTextNode);

	if (text == null) {
		text = '';
	}
	this.text = text;
	this.html = null;
	this.nodeType = 'text';
	this.parent = null;
};

exports.default = MockTextNode;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _domUtil = __webpack_require__(2);

var _domUtil2 = _interopRequireDefault(_domUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cursor = function () {
	function Cursor(chunk, node, offset) {
		_classCallCheck(this, Cursor);

		if (chunk == null) {
			chunk = null;
		}
		this.chunk = chunk;
		if (node == null) {
			node = null;
		}
		this.node = node;
		if (offset == null) {
			offset = null;
		}
		this.offset = offset;
		this.textNode = _domUtil2.default.getFirstTextNodeOfElement(this.node);
		this.isValid = this.chunk !== null && this.offset !== null;
		this.isText = this.isValid && this.textNode !== null;
	}

	_createClass(Cursor, [{
		key: 'clone',
		value: function clone() {
			return new Cursor(this.chunk, this.node, this.offset);
		}
	}]);

	return Cursor;
}();

exports.default = Cursor;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _virtualCursor = __webpack_require__(13);

var _virtualCursor2 = _interopRequireDefault(_virtualCursor);

var _domUtil = __webpack_require__(2);

var _domUtil2 = _interopRequireDefault(_domUtil);

var _domSelection = __webpack_require__(3);

var _domSelection2 = _interopRequireDefault(_domSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VirtualSelection = function () {
	function VirtualSelection(page) {
		_classCallCheck(this, VirtualSelection);

		this.page = page;
		this.clear();
	}

	_createClass(VirtualSelection, [{
		key: 'clear',
		value: function clear() {
			this.start = null;
			return this.end = null;
		}
	}, {
		key: 'clone',
		value: function clone() {
			var virtSel = new VirtualSelection(this.page);
			virtSel.start = this.start.clone();
			virtSel.end = this.end.clone();

			return virtSel;
		}
	}, {
		key: 'getPosition',
		value: function getPosition(chunk) {
			if ((this.start != null ? this.start.chunk : undefined) == null || (this.end != null ? this.end.chunk : undefined) == null) {
				return 'unknown';
			}

			var chunkIndex = chunk.get('index');
			var startIndex = this.start.chunk.get('index');
			var endIndex = this.end.chunk.get('index');

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
		}
	}, {
		key: 'collapse',
		value: function collapse() {
			return this.end = this.start.clone();
		}
	}, {
		key: 'collapseToEnd',
		value: function collapseToEnd() {
			return this.start = this.end.clone();
		}
	}, {
		key: 'setStart',
		value: function setStart(chunk, data) {
			return this.start = new _virtualCursor2.default(chunk, data);
		}
	}, {
		key: 'setEnd',
		value: function setEnd(chunk, data) {
			return this.end = new _virtualCursor2.default(chunk, data);
		}
	}, {
		key: 'setCaret',
		value: function setCaret(chunk, data) {
			this.setStart(chunk, data);
			return this.collapse();
		}
	}, {
		key: 'toObject',
		value: function toObject() {
			var end = void 0,
			    start = void 0;
			if ((this.start != null ? this.start.chunk : undefined) == null || (this.start != null ? this.start.data : undefined) == null) {
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

			if ((this.end != null ? this.end.chunk : undefined) == null || (this.end != null ? this.end.data : undefined) == null) {
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
		}
	}, {
		key: 'fromObject',
		value: function fromObject(o) {
			this.setStart(this.page.chunks.at(o.start.index), o.start.data);
			return this.setEnd(this.page.chunks.at(o.end.index), o.end.data);
		}
	}, {
		key: 'fromDOMSelection',
		value: function fromDOMSelection(domSelection) {
			// console.log 'VS.fDS', domSelection
			if (domSelection == null) {
				domSelection = null;
			}
			if (domSelection == null) {
				domSelection = _domSelection2.default.get();
			}

			// console.log('page be all', @page)

			var startChunkIndex = _domUtil2.default.findParentAttr(domSelection.startContainer, 'data-component-index');
			var endChunkIndex = _domUtil2.default.findParentAttr(domSelection.endContainer, 'data-component-index');

			if (!startChunkIndex || !endChunkIndex) {
				return;
			}

			// console.log 'VS page', @page

			var startChunk = this.page.chunks.at(startChunkIndex);
			var endChunk = this.page.chunks.at(endChunkIndex);

			if (!startChunk || !endChunk) {
				return;
			}

			// console.log 'start', startChunk, 'end', endChunk
			// console.log startChunk.page.module.pages.models.indexOf(startChunk.page)

			this.setStart(startChunk, startChunk.getVirtualSelectionStartData());
			return this.setEnd(endChunk, endChunk.getVirtualSelectionEndData());
		}
	}, {
		key: '__debug_print',
		value: function __debug_print() {
			return console.log(JSON.stringify(this.toObject(), null, 4));
		}
	}]);

	return VirtualSelection;
}();

Object.defineProperties(VirtualSelection.prototype, {
	type: {
		get: function get() {
			switch (false) {
				case !((this.start != null ? this.start.chunk : undefined) == null) && !((this.end != null ? this.end.chunk : undefined) == null):
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

	all: {
		get: function get() {
			switch (this.type) {
				case 'chunkSpan':
					var all = [];
					var cur = this.start.chunk;

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

	inbetween: {
		get: function get() {
			if (this.type !== 'chunkSpan') {
				return [];
			}

			var result = this.all;
			result.pop();
			result.shift();

			return result;
		}
	}
});

VirtualSelection.fromObject = function (page, o) {
	var vs = new VirtualSelection(page);
	vs.fromObject(page, o);

	return vs;
};

VirtualSelection.fromDOMSelection = function (page, domSelection) {
	var vs = new VirtualSelection(page);
	vs.fromDOMSelection(domSelection);

	return vs;
};

exports.default = VirtualSelection;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var items = void 0,
    itemsLoaded = void 0,
    getItemsCallbacks = void 0,
    defaults = void 0,
    insertItems = void 0,
    registeredToolbarItems = void 0,
    toolbarItems = void 0,
    textListeners = void 0,
    variableHandlers = void 0;

var _Store = function () {
	function _Store() {
		_classCallCheck(this, _Store);
	}

	_createClass(_Store, [{
		key: 'init',
		value: function init() {
			items = new Map();
			itemsLoaded = 0;
			getItemsCallbacks = [];
			defaults = new Map();
			insertItems = new Map();
			toolbarItems = [];
			textListeners = [];
			variableHandlers = new Map();
			registeredToolbarItems = {
				separator: { id: 'separator', type: 'separator' }
			};
		}
	}, {
		key: 'loadDependency',
		value: function loadDependency(url, onLoadCallback) {
			if (onLoadCallback == null) {
				onLoadCallback = function onLoadCallback() {};
			}
			var type = url.substr(url.lastIndexOf('.') + 1);

			switch (type) {
				case 'js':
					var el = document.createElement('script');
					el.setAttribute('src', url);
					el.onload = onLoadCallback;
					document.head.appendChild(el);
					break;

				case 'css':
					el = document.createElement('link');
					el.setAttribute('rel', 'stylesheet');
					el.setAttribute('href', url);
					document.head.appendChild(el);
					onLoadCallback();
					break;
			}

			return this;
		}
	}, {
		key: 'registerModel',
		value: function registerModel(className, opts) {
			if (opts == null) {
				opts = {};
			}
			items.set(className, opts);

			opts = Object.assign({
				type: null,
				default: false,
				insertItem: null,
				componentClass: null,
				selectionHandler: null,
				commandHandler: null,
				variables: {},
				init: function init() {}
			}, opts);

			if (opts.default) {
				defaults.set(opts.type, className);
			}
			// @TODO: Editor
			// if (opts.insertItem) {
			// 	insertItems.set(chunkClass.type, opts.insertItem)
			// }

			opts.init();

			for (var variable in opts.variables) {
				var cb = opts.variables[variable];
				variableHandlers.set(variable, cb);
			}

			return this;
		}
	}, {
		key: 'getDefaultItemForModelType',
		value: function getDefaultItemForModelType(modelType) {
			var type = defaults.get(modelType);
			if (!type) {
				return null;
			}

			return items.get(type);
		}
	}, {
		key: 'getItemForType',
		value: function getItemForType(type) {
			return items.get(type);
		}
	}, {
		key: 'registerToolbarItem',
		value: function registerToolbarItem(opts) {
			registeredToolbarItems[opts.id] = opts;
			return this;
		}
	}, {
		key: 'addToolbarItem',
		value: function addToolbarItem(id) {
			toolbarItems.push(Object.assign({}, registeredToolbarItems[id]));
			return this;
		}

		//@TODO: Editor?
		// registerTextListener(opts, position) {
		// 	if (position == null) {
		// 		position = -1
		// 	}
		// 	if (position > -1) {
		// 		textListeners.splice(position, 0, opts)
		// 	} else {
		// 		textListeners.push(opts)
		// 	}

		// 	return this
		// }

	}, {
		key: 'getItems',
		value: function getItems(callback) {
			// if (itemsLoaded === items.size) {
			// 	callback(items)
			// } else {
			// 	getItemsCallbacks.push(callback)
			// }

			// return null

			callback(items);
		}
	}, {
		key: 'getTextForVariable',
		value: function getTextForVariable(variable, model, viewerState) {
			var cb = variableHandlers.get(variable);
			if (!cb) {
				return null;
			}

			return cb.call(null, model, viewerState);
		}

		// get insertItems() {
		// 	return insertItems
		// }

	}, {
		key: 'registeredToolbarItems',
		get: function get() {
			return registeredToolbarItems;
		}
	}, {
		key: 'toolbarItems',
		get: function get() {
			return toolbarItems;
		}

		// get textListeners() {
		// 	return textListeners
		// }

	}]);

	return _Store;
}();

var Store = new _Store();

Store.init();
exports.Store = Store;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextGroupCursor = function TextGroupCursor(virtualCursor) {
	_classCallCheck(this, TextGroupCursor);

	this.virtualCursor = virtualCursor;
};

Object.defineProperties(TextGroupCursor.prototype, {
	isTextStart: {
		get: function get() {
			return this.offset === 0;
		}
	},

	isTextEnd: {
		get: function get() {
			return this.offset === this.text.length;
		}
	},

	isFirstText: {
		get: function get() {
			return this.groupIndex === 0;
		}
	},

	isLastText: {
		get: function get() {
			return this.groupIndex === this.textGroup.length - 1;
		}
	},

	isGroupStart: {
		get: function get() {
			return this.isTextStart && this.isFirstText;
		}
	},

	isGroupEnd: {
		get: function get() {
			return this.isTextEnd && this.isLastText;
		}
	},

	textGroup: {
		get: function get() {
			return this.virtualCursor.chunk.modelState.textGroup;
		}
	},

	groupIndex: {
		get: function get() {
			if (this.virtualCursor.data != null) {
				return this.virtualCursor.data.groupIndex;
			} else {
				return -1;
			}
		}
	},

	offset: {
		get: function get() {
			if (this.virtualCursor.data != null) {
				return this.virtualCursor.data.offset;
			} else {
				return 0;
			}
		}
	},

	textGroupItem: {
		get: function get() {
			return this.virtualCursor.chunk.modelState.textGroup.get(this.virtualCursor.data.groupIndex);
		}
	},

	text: {
		get: function get() {
			return this.textGroupItem.text;
		}
	}
});

exports.default = TextGroupCursor;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleableText = __webpack_require__(5);

var _styleableText2 = _interopRequireDefault(_styleableText);

var _textGroupUtil = __webpack_require__(14);

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
	index: {
		get: function get() {
			if (this.parent === null) {
				return -1;
			}
			return this.parent.indexOf(this);
		}
	}
});

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Describes a selection in the context of TextGroups for a single chunk

var _textGroupCursor = __webpack_require__(28);

var _textGroupCursor2 = _interopRequireDefault(_textGroupCursor);

var _virtualCursor = __webpack_require__(13);

var _virtualCursor2 = _interopRequireDefault(_virtualCursor);

var _domUtil = __webpack_require__(2);

var _domUtil2 = _interopRequireDefault(_domUtil);

var _textConstants = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getCursors = function getCursors(chunk, virtualSelection) {
	if (!virtualSelection) {
		return {
			start: null,
			end: null
		};
	}

	var chunkStart = TextGroupSelection.getGroupStartCursor(chunk);
	var chunkEnd = TextGroupSelection.getGroupEndCursor(chunk);
	var position = virtualSelection.getPosition(chunk);

	switch (position) {
		case 'start':
			return {
				start: new _textGroupCursor2.default(virtualSelection.start),
				end: chunkEnd
			};

		case 'end':
			return {
				start: chunkStart,
				end: new _textGroupCursor2.default(virtualSelection.end)
			};

		case 'contains':
			return {
				start: new _textGroupCursor2.default(virtualSelection.start),
				end: new _textGroupCursor2.default(virtualSelection.end)
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

var TextGroupSelection = function () {
	function TextGroupSelection(chunk, virtualSelection) {
		_classCallCheck(this, TextGroupSelection);

		this.chunk = chunk;
		this.virtualSelection = virtualSelection;
	}

	// getFrozenSelection: ->
	// 	new TextGroupSelection(chunk, virtualSelection.clone());

	_createClass(TextGroupSelection, [{
		key: 'includes',
		value: function includes(item) {
			if (this.type === 'none') {
				return false;
			}

			var groupIndex = item.index;
			return this.start.groupIndex === groupIndex || this.end.groupIndex === groupIndex;
		}
	}, {
		key: 'selectGroup',
		value: function selectGroup() {
			return TextGroupSelection.selectGroup(this.chunk, this.virtualSelection);
		}
	}, {
		key: 'selectText',
		value: function selectText(groupIndex) {
			return TextGroupSelection.selectText(this.chunk, groupIndex, this.virtualSelection);
		}
	}, {
		key: 'setCaretToGroupStart',
		value: function setCaretToGroupStart() {
			return TextGroupSelection.setCaretToGroupStart(this.chunk, this.virtualSelection);
		}
	}, {
		key: 'setCaretToTextStart',
		value: function setCaretToTextStart(groupIndex) {
			return TextGroupSelection.setCaretToTextStart(this.chunk, groupIndex, this.virtualSelection);
		}
	}, {
		key: 'setCaretToGroupEnd',
		value: function setCaretToGroupEnd() {
			return TextGroupSelection.setCaretToGroupEnd(this.chunk, this.virtualSelection);
		}
	}, {
		key: 'setCaretToTextEnd',
		value: function setCaretToTextEnd(groupIndex) {
			return TextGroupSelection.setCaretToTextEnd(this.chunk, groupIndex, this.virtualSelection);
		}
	}, {
		key: 'setCaret',
		value: function setCaret(groupIndex, offset) {
			return this.virtualSelection.setCaret(this.chunk, { groupIndex: groupIndex, offset: offset });
		}
	}, {
		key: 'setStart',
		value: function setStart(groupIndex, offset) {
			return this.virtualSelection.setStart(this.chunk, { groupIndex: groupIndex, offset: offset });
		}
	}, {
		key: 'setEnd',
		value: function setEnd(groupIndex, offset) {
			return this.virtualSelection.setEnd(this.chunk, { groupIndex: groupIndex, offset: offset });
		}
	}, {
		key: 'getAllSelectedTexts',
		value: function getAllSelectedTexts() {
			if ((this.start != null ? this.start.text : undefined) == null || (this.end != null ? this.end.text : undefined) == null) {
				return [];
			}

			var all = [];
			for (var i = this.start.groupIndex, end = this.end.groupIndex, asc = this.start.groupIndex <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
				all.push(this.chunk.modelState.textGroup.get(i));
			}

			return all;
		}
	}]);

	return TextGroupSelection;
}();

Object.defineProperties(TextGroupSelection.prototype, {
	type: {
		get: function get() {
			var cursors = getCursors(this.chunk, this.virtualSelection);
			var position = this.position;


			switch (false) {
				case cursors.start !== null && cursors.end !== null:
					return 'none';
				case position !== 'contains' || cursors.start.groupIndex !== cursors.end.groupIndex || cursors.start.offset !== cursors.end.offset:
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
	var virtCur = new _virtualCursor2.default(chunk, { groupIndex: groupIndex, offset: 0 });
	return new _textGroupCursor2.default(virtCur);
};

TextGroupSelection.getTextEndCursor = function (chunk, groupIndex) {
	var virtCur = new _virtualCursor2.default(chunk, {
		groupIndex: groupIndex,
		offset: chunk.modelState.textGroup.get(groupIndex).text.length
	});
	return new _textGroupCursor2.default(virtCur);
};

TextGroupSelection.selectGroup = function (chunk, virtualSelection) {
	var start = TextGroupSelection.getGroupStartCursor(chunk);
	var end = TextGroupSelection.getGroupEndCursor(chunk);

	virtualSelection.setStart(start.virtualCursor.chunk, start.virtualCursor.data);
	return virtualSelection.setEnd(end.virtualCursor.chunk, end.virtualCursor.data);
};

TextGroupSelection.selectText = function (chunk, groupIndex, virtualSelection) {
	var start = TextGroupSelection.getTextStartCursor(chunk, groupIndex);
	var end = TextGroupSelection.getTextEndCursor(chunk, groupIndex);

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
	// console.log 'getOboTextInfo', targetTextNode, offset

	var groupIndex = void 0,
	    groupIndexAttr = void 0;
	var totalCharactersFromStart = 0;
	// element ?= DOMUtil.getOboElementFromChild targetTextNode.parentElement, 'chunk'

	var oboTextNode = _domUtil2.default.findParentWithAttr(targetTextNode, 'data-group-index');

	if (oboTextNode) {
		groupIndexAttr = oboTextNode.getAttribute('data-group-index');
		groupIndex = parseInt(groupIndexAttr, 10);
		if (isNaN(groupIndex)) {
			groupIndex = groupIndexAttr;
		}
	}

	if (oboTextNode == null || oboTextNode.textContent === _textConstants.EMPTY_CHAR) {
		return {
			offset: 0,
			groupIndex: groupIndex
		};
	}

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(_domUtil2.default.getTextNodesInOrder(oboTextNode))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var textNode = _step.value;

			if (textNode === targetTextNode) {
				break;
			}
			totalCharactersFromStart += textNode.nodeValue.length;
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

	var anchor = false;
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

exports.default = TextGroupSelection;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleableText = __webpack_require__(5);

var _styleableText2 = _interopRequireDefault(_styleableText);

var _textGroupUtil = __webpack_require__(14);

var _textGroupUtil2 = _interopRequireDefault(_textGroupUtil);

var _textGroupItem = __webpack_require__(29);

var _textGroupItem2 = _interopRequireDefault(_textGroupItem);

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
		this.dataTemplate = Object.freeze(Object.assign({}, dataTemplate));

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
			if (!this.isFull) addChildToGroup(createChild(text, data, this.dataTemplate), this);
			return this;
		}
	}, {
		key: 'addAt',
		value: function addAt(index, text, data) {
			if (!this.isFull) addChildToGroup(createChild(text, data, this.dataTemplate), this, index);
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
			var clonedItems = [];

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = this.items[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
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

			if (digestedItem && consumerItem) {
				consumerItem.data = _textGroupUtil2.default.createData(mergeDataFn(consumerItem.data, digestedItem.data), this.dataTemplate);

				consumerItem.text.merge(digestedItem.text);
			}

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
	}]);

	return TextGroup;
}();

Object.defineProperties(TextGroup.prototype, {
	length: {
		get: function get() {
			return this.items.length;
		}
	},

	first: {
		get: function get() {
			return this.items[0];
		}
	},

	last: {
		get: function get() {
			return this.items[this.items.length - 1];
		}
	},

	isFull: {
		get: function get() {
			return this.items.length === this.maxItems;
		}
	},

	isEmpty: {
		get: function get() {
			return this.items.length === 0;
		}
	},

	isBlank: {
		get: function get() {
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
		for (var _iterator9 = descriptor[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
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
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleType = __webpack_require__(4);

var _styleType2 = _interopRequireDefault(_styleType);

var _styleRange = __webpack_require__(8);

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
		value: function get(i) {
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

				//@TODO - optimize
			};var _iteratorNormalCompletion7 = true;
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
			for (var i = 0; i < mark.length; i++) {
				level = mark[i];
				if (mark[i] == null) {
					continue;
				}

				curLevel += level;

				// Establish the first superscript range
				if (curRange.start === -1) {
					curRange.start = i;
					curRange.data = curLevel;
					// Close up the previous range and start a new one
				} else {
					curRange.end = i;

					if (curRange.data !== 0) {
						newStyles.push(curRange);
					}

					curRange = new _styleRange2.default(i, -1, _styleType2.default.SUPERSCRIPT, curLevel);
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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleableTextRenderer = __webpack_require__(34);

var _styleableTextRenderer2 = _interopRequireDefault(_styleableTextRenderer);

var _textConstants = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StyleableTextComponent = function (_React$Component) {
	_inherits(StyleableTextComponent, _React$Component);

	function StyleableTextComponent() {
		_classCallCheck(this, StyleableTextComponent);

		return _possibleConstructorReturn(this, (StyleableTextComponent.__proto__ || Object.getPrototypeOf(StyleableTextComponent)).apply(this, arguments));
	}

	_createClass(StyleableTextComponent, [{
		key: 'createChild',
		value: function createChild(el, key) {
			var _this2 = this;

			var createChild = this.createChild;
			var groupIndex = this.props.groupIndex;


			var attrs = { key: key.counter++ };

			switch (el.type) {
				case 'a':
					if (el.attrs != null && el.attrs.href != null) {
						attrs.href = el.attrs.href;
						attrs.target = '_blank';
					}
					break;

				case 'span':
					if (el.attrs != null && el.attrs['class'] != null) {
						attrs.className = el.attrs['class'];
					}
					break;
			}

			return React.createElement(el.type, attrs, el.children.map(function (child, index) {
				switch (child.nodeType) {
					case 'text':
						if (child.html != null) {
							// console.clear()
							// console.log('yes', child.html)
							return React.createElement('span', { key: key.counter++, dangerouslySetInnerHTML: { __html: child.html } });
						} else if (child.text.length === 0) {
							return React.createElement(
								'span',
								{ key: key.counter++ },
								_textConstants.EMPTY_CHAR
							);
						} else if (child.text.charAt(child.text.length - 1) === '\n') {
							// Hack to force the display of a blank line that has no content
							return React.createElement(
								'span',
								{ key: key.counter++ },
								child.text,
								_textConstants.EMPTY_CHAR
							);
						} else {
							return React.createElement(
								'span',
								{ key: key.counter++ },
								child.text
							);
						}
					// child.text || emptyChar
					default:
						return _this2.createChild(child, key);
				}
			}));
		}
	}, {
		key: 'render',
		value: function render() {
			var key = { counter: 0 };
			var mockElement = (0, _styleableTextRenderer2.default)(this.props.text);

			return React.createElement(
				'span',
				null,
				this.createChild(mockElement, key)
			);
		}
	}]);

	return StyleableTextComponent;
}(React.Component);

exports.default = StyleableTextComponent;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _katex = __webpack_require__(90);

var _katex2 = _interopRequireDefault(_katex);

var _styleableText = __webpack_require__(5);

var _styleableText2 = _interopRequireDefault(_styleableText);

var _styleRange = __webpack_require__(8);

var _styleRange2 = _interopRequireDefault(_styleRange);

var _styleType = __webpack_require__(4);

var _styleType2 = _interopRequireDefault(_styleType);

var _mockElement = __webpack_require__(23);

var _mockElement2 = _interopRequireDefault(_mockElement);

var _mockTextNode = __webpack_require__(24);

var _mockTextNode2 = _interopRequireDefault(_mockTextNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Turns a StyleableText item into a mock DOM tree, which can then be used to render out in React

var ORDER = [_styleType2.default.COMMENT, _styleType2.default.LATEX, _styleType2.default.LINK, _styleType2.default.QUOTE, _styleType2.default.BOLD, _styleType2.default.STRIKETHROUGH, _styleType2.default.MONOSPACE, _styleType2.default.SUPERSCRIPT, _styleType2.default.ITALIC];

var getTextNodeFragmentDescriptorsAtHelper = function getTextNodeFragmentDescriptorsAtHelper(stateObj, targetStartIndex, targetEndIndex) {
	if (stateObj.curNode.nodeType === 'element') {
		return Array.from(stateObj.curNode.children).map(function (child) {
			return stateObj.curNode = child, getTextNodeFragmentDescriptorsAtHelper(stateObj, targetStartIndex, targetEndIndex);
		});
	} else {
		var charsRead = stateObj.charsRead + stateObj.curNode.text.length;

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
				endIndex: Infinity
			});
		}

		if (charsRead >= targetStartIndex && stateObj.start === null) {
			stateObj.start = {
				node: stateObj.curNode,
				startIndex: targetStartIndex - stateObj.charsRead,
				endIndex: Infinity
			};
		}

		stateObj.last = {
			node: stateObj.curNode,
			startIndex: 0,
			endIndex: Infinity
		};

		return stateObj.charsRead = charsRead;
	}
};

var getTextNodeFragmentDescriptorsAt = function getTextNodeFragmentDescriptorsAt(rootNode, startIndex, endIndex) {
	var stateObj = {
		charsRead: 0,
		start: null,
		inbetween: [],
		end: null,
		curNode: rootNode
	};

	getTextNodeFragmentDescriptorsAtHelper(stateObj, startIndex, endIndex);
	if (stateObj.end === null) {
		stateObj.end = stateObj.last;
	}

	// If start and end are equal just modify start and delete end
	if (stateObj.start.node === stateObj.end.node) {
		stateObj.start.endIndex = stateObj.end.endIndex;
		stateObj.end = null;
	}

	var fragmentDescriptors = stateObj.inbetween;

	fragmentDescriptors.unshift(stateObj.start);

	if (stateObj.end !== null) {
		fragmentDescriptors.push(stateObj.end);
	}

	return fragmentDescriptors;
};

var wrapElement = function wrapElement(styleRange, nodeToWrap, text) {
	var newChild = void 0,
	    node = void 0,
	    root = void 0;
	switch (styleRange.type) {
		case 'sup':
			var level = styleRange.data;
			if (level > 0) {
				node = root = new _mockElement2.default('sup');
				while (level > 1) {
					newChild = new _mockElement2.default('sup');
					node.addChild(newChild);
					node = newChild;
					level--;
				}
			} else {
				level = Math.abs(level);
				node = root = new _mockElement2.default('sub');
				while (level > 1) {
					newChild = new _mockElement2.default('sub');
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
			newChild = new _mockElement2.default('span', Object.assign({ class: 'comment' }, styleRange.data));
			nodeToWrap.parent.replaceChild(nodeToWrap, newChild);
			newChild.addChild(nodeToWrap);
			nodeToWrap.text = text;
			return newChild;

		case '_latex':
			newChild = new _mockElement2.default('span', Object.assign({ class: 'latex' }, styleRange.data));
			nodeToWrap.parent.replaceChild(nodeToWrap, newChild);
			newChild.addChild(nodeToWrap);
			var html = _katex2.default.renderToString(text);
			nodeToWrap.html = html;
			nodeToWrap.text = text;
			return newChild;

		case _styleType2.default.MONOSPACE:
			styleRange.type = 'code';
		// Intentional fallthrough

		default:
			newChild = new _mockElement2.default(styleRange.type, Object.assign({}, styleRange.data));
			nodeToWrap.parent.replaceChild(nodeToWrap, newChild);
			newChild.addChild(nodeToWrap);
			nodeToWrap.text = text;
			return newChild;
	}
};

var wrap = function wrap(styleRange, nodeFragmentDescriptor) {
	var newChild = void 0;
	var nodeToWrap = nodeFragmentDescriptor.node;
	var _nodeToWrap = nodeToWrap,
	    text = _nodeToWrap.text;

	var fromPosition = nodeFragmentDescriptor.startIndex;
	var toPosition = nodeFragmentDescriptor.endIndex;

	var leftText = text.substring(0, fromPosition);
	var wrappedText = text.substring(fromPosition, toPosition);
	var rightText = text.substring(toPosition);

	if (wrappedText.length === 0) {
		return;
	}

	// add in left text
	if (leftText.length > 0) {
		newChild = new _mockTextNode2.default(leftText);
		nodeToWrap.parent.addBefore(newChild, nodeToWrap);
	}

	// add in wrapped text
	nodeToWrap = wrapElement(styleRange, nodeToWrap, wrappedText);

	// add in right text
	if (rightText.length > 0) {
		newChild = new _mockTextNode2.default(rightText);
		return nodeToWrap.parent.addAfter(newChild, nodeToWrap);
	}
};

var applyStyle = function applyStyle(el, styleRange) {
	var fragmentDescriptors = getTextNodeFragmentDescriptorsAt(el, styleRange.start, styleRange.end);
	return function () {
		var result = [];
		for (var i = fragmentDescriptors.length - 1; i >= 0; i--) {
			var fragmentDescriptor = fragmentDescriptors[i];
			result.push(wrap(styleRange, fragmentDescriptor));
		}
		return result;
	}();
};

var getMockElement = function getMockElement(styleableText) {
	var root = new _mockElement2.default('span');
	root.addChild(new _mockTextNode2.default(styleableText.value));

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(ORDER)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var styleType = _step.value;
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = Array.from(styleableText.styleList.styles)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var styleRange = _step2.value;

					if (styleRange.type === styleType) {
						applyStyle(root, styleRange);
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

	return root;
};

exports.default = getMockElement;

/***/ }),
/* 35 */
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
					case 'href':
					case 'cite':
					case 'style':
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

exports.sanitize = sanitize;
exports.isElementInline = isElementInline;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _dispatcher = __webpack_require__(0);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ModalUtil = {
	show: function show(component) {
		var hideViewer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		_dispatcher2.default.trigger('modal:show', {
			value: { component: component, hideViewer: hideViewer }
		});
	},
	hide: function hide() {
		_dispatcher2.default.trigger('modal:hide');
	},
	getCurrentModal: function getCurrentModal(state) {
		if (state.modals.length === 0) {
			return null;
		}
		return state.modals[0];
	}
};

exports.default = ModalUtil;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	//https://gist.github.com/jed/982883
	var getId = function getId(a) {
		if (a) {
			return (a ^ Math.random() * 16 >> a / 4).toString(16);
		} else {
			return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, getId);
		}
	};
	return getId();
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _index = __webpack_require__(61);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Common = _index2.default;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _anchor = __webpack_require__(17);

var _anchor2 = _interopRequireDefault(_anchor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FocusableChunk = function FocusableChunk(props) {
	return React.createElement(
		'div',
		{
			className: 'focusable-chunk anchor-container' + (props.className ? ' ' + props.className : ''),
			contentEditable: false
		},
		React.createElement(_anchor2.default, _extends({}, props, { name: 'main' })),
		props.children
	);
};

FocusableChunk.defaultProps = {
	indent: 0,
	spellcheck: true
};

exports.default = FocusableChunk;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseSelectionHandler = __webpack_require__(7);

var _baseSelectionHandler2 = _interopRequireDefault(_baseSelectionHandler);

var _focusableSelectionHandler = __webpack_require__(16);

var _focusableSelectionHandler2 = _interopRequireDefault(_focusableSelectionHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToggleSelectionHandler = function (_BaseSelectionHandler) {
	_inherits(ToggleSelectionHandler, _BaseSelectionHandler);

	function ToggleSelectionHandler(textSelectionHandler, focusSelectionHandler) {
		_classCallCheck(this, ToggleSelectionHandler);

		if (focusSelectionHandler == null) {
			focusSelectionHandler = new _focusableSelectionHandler2.default();
		}

		var _this = _possibleConstructorReturn(this, (ToggleSelectionHandler.__proto__ || Object.getPrototypeOf(ToggleSelectionHandler)).call(this));

		_this.textSelectionHandler = textSelectionHandler;
		_this.focusSelectionHandler = focusSelectionHandler;
		return _this;
	}

	_createClass(ToggleSelectionHandler, [{
		key: 'getCopyOfSelection',
		value: function getCopyOfSelection(selection, chunk, cloneId) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.getCopyOfSelection.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.getCopyOfSelection.apply(this, arguments);
			}
		}
	}, {
		key: 'selectAll',
		value: function selectAll(selection, chunk) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.selectAll.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.selectAll.apply(this, arguments);
			}
		}
	}, {
		key: 'selectStart',
		value: function selectStart(selection, chunk, asRange) {
			if (asRange == null) {
				asRange = false;
			}
			if (chunk.isEditing()) {
				return this.textSelectionHandler.selectStart.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.selectStart.apply(this, arguments);
			}
		}
	}, {
		key: 'selectEnd',
		value: function selectEnd(selection, chunk, asRange) {
			if (asRange == null) {
				asRange = false;
			}
			if (chunk.isEditing()) {
				return this.textSelectionHandler.selectEnd.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.selectEnd.apply(this, arguments);
			}
		}
	}, {
		key: 'getVirtualSelectionStartData',
		value: function getVirtualSelectionStartData(selection, chunk, text, html) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.getVirtualSelectionStartData.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.getVirtualSelectionStartData.apply(this, arguments);
			}
		}
	}, {
		key: 'getVirtualSelectionEndData',
		value: function getVirtualSelectionEndData(selection, chunk, text, html) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.getVirtualSelectionEndData.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.getVirtualSelectionEndData.apply(this, arguments);
			}
		}
	}, {
		key: 'getDOMSelectionStart',
		value: function getDOMSelectionStart(selection, chunk, text, html) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.getDOMSelectionStart.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.getDOMSelectionStart.apply(this, arguments);
			}
		}
	}, {
		key: 'getDOMSelectionEnd',
		value: function getDOMSelectionEnd(selection, chunk, text, html) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.getDOMSelectionEnd.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.getDOMSelectionEnd.apply(this, arguments);
			}
		}
	}, {
		key: 'areCursorsEquivalent',
		value: function areCursorsEquivalent(selection, chunk, text, html) {
			if (chunk.isEditing()) {
				return this.textSelectionHandler.areCursorsEquivalent.apply(this, arguments);
			} else {
				return this.focusSelectionHandler.areCursorsEquivalent.apply(this, arguments);
			}
		}
	}]);

	return ToggleSelectionHandler;
}(_baseSelectionHandler2.default);

exports.default = ToggleSelectionHandler;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NonEditableChunk = function (_React$Component) {
	_inherits(NonEditableChunk, _React$Component);

	function NonEditableChunk() {
		_classCallCheck(this, NonEditableChunk);

		return _possibleConstructorReturn(this, (NonEditableChunk.__proto__ || Object.getPrototypeOf(NonEditableChunk)).apply(this, arguments));
	}

	_createClass(NonEditableChunk, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{
					className: 'non-editable-chunk' + (this.props.className ? ' ' + this.props.className : ''),
					contentEditable: false,
					'data-indent': this.props.indent
				},
				this.props.children
			);
		}
	}], [{
		key: 'defaultProps',
		get: function get() {
			return { indent: 0 };
		}
	}]);

	return NonEditableChunk;
}(React.Component);

exports.default = NonEditableChunk;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextChunk = function (_React$Component) {
	_inherits(TextChunk, _React$Component);

	function TextChunk() {
		_classCallCheck(this, TextChunk);

		return _possibleConstructorReturn(this, (TextChunk.__proto__ || Object.getPrototypeOf(TextChunk)).apply(this, arguments));
	}

	_createClass(TextChunk, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ className: 'text-chunk' + (this.props.className ? ' ' + this.props.className : '') },
				this.props.children
			);
		}
	}], [{
		key: 'defaultProps',
		get: function get() {
			return { indent: 0 };
		}
	}]);

	return TextChunk;
}(React.Component);

exports.default = TextChunk;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (chunk, targetTextGroupItem) {
	var results = void 0;
	console.time('linkify');

	var styleApplied = false;
	var links = [];

	var selection = chunk.page.module.app.selection;

	var styleableText = targetTextGroupItem.text;

	while ((results = regex.exec(styleableText.value)) !== null) {
		links.unshift([results.index, regex.lastIndex, styleableText.value.substring(results.index, regex.lastIndex)]);
	}

	if (links.length === 0) {
		return false;
	}

	selection.saveVirtualSelection();

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(links)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var link = _step.value;

			selection.virtual.start.data.groupIndex = targetTextGroupItem.index;
			selection.virtual.end.data.groupIndex = selection.virtual.start.data.groupIndex;
			selection.virtual.start.data.offset = link[0];
			selection.virtual.end.data.offset = link[1];

			if (chunk.getSelectionStyles().a == null) {
				if (link[2].indexOf('http') !== 0) {
					link[2] = 'http://' + link[2];
				}
				chunk.styleSelection('a', { href: link[2] });

				styleApplied = true;
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

	selection.restoreVirtualSelection();

	console.timeEnd('linkify');

	return styleApplied;
};

//
// Regular Expression for URL validation
//
// Author: Diego Perini
// Updated: 2010/12/05
// License: MIT
//
// Copyright (c) 2010-2013 Diego Perini (http://www.iport.it)
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// the regular expression composed & commented
// could be easily tweaked for RFC compliance,
// it was expressly modified to fit & satisfy
// these test for an URL shortener:
//
//   http://mathiasbynens.be/demo/url-regex
//
// Notes on possible differences from a standard/generic validation:
//
// - utf-8 char class take in consideration the full Unicode range
// - TLDs have been made mandatory so single names like "localhost" fails
// - protocols have been restricted to ftp, http and https only as requested
//
// Changes:
//
// - IP address dotted notation validation, range: 1.0.0.0 - 223.255.255.255
//   first and last IP address of each class is considered invalid
//   (since they are broadcast/network addresses)
//
// - Added exclusion of private, reserved and/or local networks ranges
//
// - Made starting path slash optional (http://example.com?foo=bar)
//
// - Allow a dot (.) at the end of hostnames (http://example.com.)
//
// Compressed one-line versions:
//
// Javascript version
//
// /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
//
// PHP version
//
// _^(?:(?:https?|ftp)://)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}-\x{ffff}0-9]-*)*[a-z\x{00a1}-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}-\x{ffff}0-9]-*)*[a-z\x{00a1}-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}-\x{ffff}]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$_iuS
//
// re_weburl = new RegExp(
// 	# "^" +
// 	# protocol identifier
// 	"(?:(?:https?|ftp)://)" +
// 	# user:pass authentication
// 	"(?:\\S+(?::\\S*)?@)?" +
// 	"(?:" +
// 		# IP address exclusion
// 		# private & local networks
// 		"(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
// 		"(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
// 		"(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
// 		# IP address dotted notation octets
// 		# excludes loopback network 0.0.0.0
// 		# excludes reserved space >= 224.0.0.0
// 		# excludes network & broacast addresses
// 		# (first & last IP address of each class)
// 		"(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
// 		"(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
// 		"(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
// 	"|" +
// 		# host name
// 		"(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
// 		# domain name
// 		"(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
// 		# TLD identifier
// 		"(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
// 		# TLD may end with dot
// 		"\\.?" +
// 	")" +
// 	# port number
// 	"(?::\\d{2,5})?" +
// 	# resource path
// 	"(?:[/?#]\\S*)?" #+
// 	, "gi"
// 	# "$", "i"
// )

var regex = new RegExp(
// "^" +
// protocol identifier
'(?:(?:https?)://)?' +
// user:pass authentication
'(?:\\S+(?::\\S*)?@)?' + '(?:' +
// IP address exclusion
// private & local networks
'(?!(?:10|127)(?:\\.\\d{1,3}){3})' + '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' + '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
// IP address dotted notation octets
// excludes loopback network 0.0.0.0
// excludes reserved space >= 224.0.0.0
// excludes network & broacast addresses
// (first & last IP address of each class)
'(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' + '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' + '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' + '|' +
// host name
'(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
// domain name
'(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
// TLD identifier
'(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
// TLD may end with dot
'\\.?' + ')' +
// port number
'(?::\\d{2,5})?' +
// resource path
'(?:[/?#]\\S*)?', //+
'gi'
// "$", "i"
);

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _textGroup = __webpack_require__(31);

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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _textConstants = __webpack_require__(6);

var _domUtil = __webpack_require__(2);

var _domUtil2 = _interopRequireDefault(_domUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTextElement = function getTextElement(chunk, groupIndex) {
	return chunk.getDomEl().querySelector('*[data-group-index=\'' + groupIndex + '\']');
};

var getTextElementAtCursor = function getTextElementAtCursor(virtualCursor) {
	return getTextElement(virtualCursor.chunk, virtualCursor.data.groupIndex);
};

var getDomPosition = function getDomPosition(virtualCursor) {
	// console.log 'TGE.gDP', virtualCursor

	var textNode = void 0;
	var totalCharactersFromStart = 0;

	var element = getTextElementAtCursor(virtualCursor);

	// console.log 'element', element

	if (!element) {
		return null;
	}

	if (element != null) {
		// console.log 'tnodes', DOMUtil.getTextNodesInOrder(element), virtualCursor.data.offset
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = Array.from(_domUtil2.default.getTextNodesInOrder(element))[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				textNode = _step.value;

				if (totalCharactersFromStart + textNode.nodeValue.length >= virtualCursor.data.offset) {
					return { textNode: textNode, offset: virtualCursor.data.offset - totalCharactersFromStart };
				}
				totalCharactersFromStart += textNode.nodeValue.length;
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
	}

	// There are no text nodes or something went really wrong, so return 0! ¯\_(ツ)_/¯
	return { textNode: null, offset: 0 };
};

exports.default = { getDomPosition: getDomPosition, getTextElement: getTextElement, getTextElementAtCursor: getTextElementAtCursor };

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styleableTextComponent = __webpack_require__(33);

var _styleableTextComponent2 = _interopRequireDefault(_styleableTextComponent);

var _dispatcher = __webpack_require__(0);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var varRegex = /\{\{(.+?)\}\}/;

var TextGroupEl = function (_React$Component) {
	_inherits(TextGroupEl, _React$Component);

	function TextGroupEl() {
		_classCallCheck(this, TextGroupEl);

		return _possibleConstructorReturn(this, (TextGroupEl.__proto__ || Object.getPrototypeOf(TextGroupEl)).apply(this, arguments));
	}

	_createClass(TextGroupEl, [{
		key: 'render',
		value: function render() {
			// console.time('textRender');

			var text = this.props.textItem.text;


			if (this.props.parentModel && text.value.indexOf('{{')) {
				var match = null;
				text = text.clone();

				while ((match = varRegex.exec(text.value)) !== null) {
					var variable = match[1];
					var event = { text: ''
						// window.Common.Store.getTextForVariable(event, variable, @props.parentModel, this.props.moduleData)
					};_dispatcher2.default.trigger('getTextForVariable', event, variable, this.props.parentModel);
					if (event.text === null) {
						event.text = match[1];
					}
					event.text = '' + event.text;

					var startIndex = text.value.indexOf(match[0], varRegex.lastIndex);
					text.replaceText(startIndex, startIndex + match[0].length, event.text);
				}
			}

			return React.createElement(
				'span',
				{
					className: 'text align-' + this.props.textItem.data.align,
					'data-group-index': this.props.groupIndex,
					'data-indent': this.props.textItem.data.indent
				},
				React.createElement(_styleableTextComponent2.default, { text: text })
			);
		}
	}]);

	return TextGroupEl;
}(React.Component);

exports.default = TextGroupEl;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baseSelectionHandler = __webpack_require__(7);

var _baseSelectionHandler2 = _interopRequireDefault(_baseSelectionHandler);

var _textGroupSelection = __webpack_require__(30);

var _textGroupSelection2 = _interopRequireDefault(_textGroupSelection);

var _textGroupElUtil = __webpack_require__(45);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextGroupSelectionHandler = function (_BaseSelectionHandler) {
	_inherits(TextGroupSelectionHandler, _BaseSelectionHandler);

	function TextGroupSelectionHandler() {
		_classCallCheck(this, TextGroupSelectionHandler);

		return _possibleConstructorReturn(this, (TextGroupSelectionHandler.__proto__ || Object.getPrototypeOf(TextGroupSelectionHandler)).apply(this, arguments));
	}

	_createClass(TextGroupSelectionHandler, [{
		key: 'selectStart',
		value: function selectStart(selection, chunk, asRange) {
			if (asRange == null) {
				asRange = false;
			}
			selection.virtual.start = _textGroupSelection2.default.getGroupStartCursor(chunk).virtualCursor;
			if (!asRange) {
				return selection.virtual.collapse();
			}
		}
	}, {
		key: 'selectEnd',
		value: function selectEnd(selection, chunk, asRange) {
			if (asRange == null) {
				asRange = false;
			}
			selection.virtual.end = _textGroupSelection2.default.getGroupEndCursor(chunk).virtualCursor;
			if (!asRange) {
				return selection.virtual.collapseToEnd();
			}
		}
	}, {
		key: 'selectAll',
		value: function selectAll(selection, chunk) {
			return _textGroupSelection2.default.selectGroup(chunk, selection.virtual);
		}
	}, {
		key: 'getCopyOfSelection',
		value: function getCopyOfSelection(selection, chunk, cloneId) {
			if (cloneId == null) {
				cloneId = false;
			}
			var clone = chunk.clone(cloneId);

			var position = selection.virtual.getPosition(chunk);
			if (position === 'contains' || position === 'start' || position === 'end') {
				var sel = new _textGroupSelection2.default(chunk, selection.virtual);

				var chunkStart = _textGroupSelection2.default.getGroupStartCursor(chunk);
				var chunkEnd = _textGroupSelection2.default.getGroupEndCursor(chunk);

				clone.modelState.textGroup.deleteSpan(sel.end.groupIndex, sel.end.offset, chunkEnd.groupIndex, chunkEnd.offset, true, this.mergeTextGroups);
				clone.modelState.textGroup.deleteSpan(chunkStart.groupIndex, chunkStart.offset, sel.start.groupIndex, sel.start.offset, true, this.mergeTextGroups);
			}

			return clone;
		}
	}, {
		key: 'getVirtualSelectionStartData',
		value: function getVirtualSelectionStartData(selection, chunk) {
			// console.log('selection.dom', selection)
			if ((selection.dom != null ? selection.dom.startText : undefined) == null) {
				return null;
			}
			return _textGroupSelection2.default.getCursorDataFromDOM(selection.dom.startText, selection.dom.startOffset);
		}
	}, {
		key: 'getVirtualSelectionEndData',
		value: function getVirtualSelectionEndData(selection, chunk) {
			if ((selection.dom != null ? selection.dom.startText : undefined) == null) {
				return null;
			}
			return _textGroupSelection2.default.getCursorDataFromDOM(selection.dom.endText, selection.dom.endOffset);
		}
	}, {
		key: 'getDOMSelectionStart',
		value: function getDOMSelectionStart(selection, chunk) {
			return (0, _textGroupElUtil.getDomPosition)(selection.virtual.start);
		}
	}, {
		key: 'getDOMSelectionEnd',
		value: function getDOMSelectionEnd(selection, chunk) {
			return (0, _textGroupElUtil.getDomPosition)(selection.virtual.end);
		}
	}, {
		key: 'areCursorsEquivalent',
		value: function areCursorsEquivalent(selectionWhichIsNullTODO, chunk, thisCursor, otherCursor) {
			return thisCursor.chunk === otherCursor.chunk && thisCursor.data.offset === otherCursor.data.offset && thisCursor.data.groupIndex === otherCursor.data.groupIndex;
		}
	}, {
		key: 'highlightSelection',
		value: function highlightSelection(selection, chunk) {
			chunk.markDirty();

			var sel = new _textGroupSelection2.default(chunk, selection.virtual);

			return chunk.modelState.textGroup.styleText(sel.start.groupIndex, sel.start.offset, sel.end.groupIndex, sel.end.offset, '_comment', {});
		}
	}]);

	return TextGroupSelectionHandler;
}(_baseSelectionHandler2.default);

exports.default = TextGroupSelectionHandler;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.replaceTextsWithinSelection = exports.activateStyle = exports.deleteSelection = exports.send = undefined;

var _oboModel = __webpack_require__(1);

var _oboModel2 = _interopRequireDefault(_oboModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Utility methods for dealing with chunks

var send = function send(fn, chunkOrChunks, selection, data) {
	if (data == null) {
		data = [];
	}
	if (!(chunkOrChunks instanceof Array)) {
		return chunkOrChunks.callCommandFn(fn, data);
	}

	var chunks = chunkOrChunks;
	var results = [];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = Array.from(chunks)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var chunk = _step.value;

			results.push(chunk.callCommandFn(fn, data));
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

	return results;
};

var deleteSelection = function deleteSelection(selection) {
	// vs = selection.virtual
	// type = vs.type

	// console.clear()
	// console.log 'deleteSelection'
	// console.log type

	if (selection.virtual.type === 'caret') {
		return;
	}
	// console.log JSON.stringify(selection.getSelectionDescriptor(), null, 2);
	// console.log 'con', vs.inbetween

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = Array.from(selection.virtual.inbetween)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var node = _step2.value;

			node.remove();
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

var replaceTextsWithinSelection = function replaceTextsWithinSelection(selection, newChunk, expandSelection) {
	if (expandSelection == null) {
		expandSelection = true;
	}
	selection.virtual.start.chunk.addChildBefore(newChunk);

	if (expandSelection) {
		selection.virtual.start.data.offset = 0;
		var end = selection.virtual.end;

		end.data.offset = end.chunk.modelState.textGroup.get(end.data.groupIndex).text.length;
	}

	return newChunk.replaceSelection();
};

var activateStyle = function activateStyle(style, selection, styleBrush, data) {
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

exports.send = send;
exports.deleteSelection = deleteSelection;
exports.activateStyle = activateStyle;
exports.replaceTextsWithinSelection = replaceTextsWithinSelection;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (componentClass, position, referenceChunk, selection, callback) {
	var newChunk = _oboModel2.default.create(componentClass);
	var extraChunk = null;

	switch (position) {
		case 'before':
			referenceChunk.addChildBefore(newChunk);
			if (newChunk.isFirst()) {
				newChunk.addChildBefore(_oboModel2.default.create());
			}
			break;

		case 'after':
			referenceChunk.addChildAfter(newChunk);
			if (newChunk.isLast()) {
				newChunk.addChildAfter(_oboModel2.default.create());
			}
			break;
	}

	newChunk.selectStart();

	return callback();
};

var _oboModel = __webpack_require__(1);

var _oboModel2 = _interopRequireDefault(_oboModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (componentClass, position, referenceChunk, selection, callback) {
	var newChunk = _oboModel2.default.create(componentClass);

	switch (position) {
		case 'before':
			referenceChunk.addChildBefore(newChunk);
			break;
		case 'after':
			referenceChunk.addChildAfter(newChunk);
			break;
	}

	newChunk.selectStart();

	return callback();
};

var _oboModel = __webpack_require__(1);

var _oboModel2 = _interopRequireDefault(_oboModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(76);

var _button = __webpack_require__(9);

var _button2 = _interopRequireDefault(_button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onClickButton = function onClickButton(index, isSelected, originalOnClick) {
	var buttonBarOnClick = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

	if (typeof originalOnClick === 'function') {
		originalOnClick();
	}

	buttonBarOnClick(index, isSelected);
};

exports.default = function (props) {
	return React.createElement(
		'div',
		{ className: 'obojobo-draft--components--button-bar' },
		props.children.map(function (child, i) {
			var isSelected = i === props.selectedIndex;
			var childProps = Object.assign({}, child.props);

			if (props.altAction) {
				childProps.altAction = props.altAction;
			}

			if (props.isDangerous) {
				childProps.isDangerous = props.isDangerous;
			}

			if (props.disabled) {
				childProps.disabled = props.disabled;
			}

			childProps.onClick = onClickButton.bind(null, i, isSelected, childProps.onClick || function () {}, props.onClick);

			return React.createElement(
				'div',
				{ key: i, className: isSelected ? 'is-selected' : '' },
				React.createElement(
					_button2.default,
					childProps,
					child.props.children
				)
			);
		})
	);
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(79);

var EditButton = function EditButton(props) {
	return React.createElement(
		'div',
		{ className: 'obojobo-draft--components--edit-button' },
		React.createElement(
			'button',
			{
				onClick: props.onClick,
				tabIndex: props.shouldPreventTab ? '-1' : 1,
				disabled: props.shouldPreventTab
			},
			'Edit'
		)
	);
};

EditButton.defaultProps = { indent: 0 };

exports.default = EditButton;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

__webpack_require__(80);

var _focusUtil = __webpack_require__(15);

var _focusUtil2 = _interopRequireDefault(_focusUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
  return React.createElement('div', { className: 'viewer--components--focus-blocker' });
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(81);

exports.default = function (props) {
	return React.createElement(
		"div",
		{ className: "obojobo-draft--components--modal-container" },
		React.createElement(
			"div",
			{ className: "content" },
			props.children
		)
	);
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(83);

var _bubble = __webpack_require__(18);

var _bubble2 = _interopRequireDefault(_bubble);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleInputBubble = function (_React$Component) {
	_inherits(SingleInputBubble, _React$Component);

	function SingleInputBubble() {
		_classCallCheck(this, SingleInputBubble);

		return _possibleConstructorReturn(this, (SingleInputBubble.__proto__ || Object.getPrototypeOf(SingleInputBubble)).apply(this, arguments));
	}

	_createClass(SingleInputBubble, [{
		key: 'onChange',
		value: function onChange(event) {
			return this.props.onChange(event.target.value);
		}
	}, {
		key: 'onSubmit',
		value: function onSubmit(event) {
			event.preventDefault();
			return this.props.onClose();
		}
	}, {
		key: 'onKeyUp',
		value: function onKeyUp(event) {
			if (event.keyCode === 27) {
				//ESC
				return this.props.onCancel();
			}
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			return setTimeout(function () {
				return _this2.refs.input.select();
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				_bubble2.default,
				null,
				React.createElement(
					'label',
					{ className: 'single-input-bubble' },
					React.createElement(
						'form',
						{ className: 'interactable', onSubmit: this.onSubmit.bind(this) },
						React.createElement('input', {
							ref: 'input',
							type: 'text',
							value: this.props.value,
							onChange: this.onChange.bind(this),
							onKeyUp: this.onKeyUp.bind(this)
						}),
						React.createElement(
							'button',
							{ onClick: this.onSubmit.bind(this) },
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
	}]);

	return SingleInputBubble;
}(React.Component);

exports.default = SingleInputBubble;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (props) {
	return React.createElement(
		'div',
		null,
		React.createElement(
			'p',
			null,
			props.children
		),
		React.createElement(
			'button',
			{
				onClick: props.modal.onButtonClick.bind(undefined, props.cancelOnReject ? props.cancel : props.reject)
			},
			props.rejectButtonLabel || 'No'
		),
		React.createElement(
			'button',
			{ onClick: props.modal.onButtonClick.bind(undefined, props.confirm) },
			props.confirmButtonLabel || 'Yes'
		)
	);
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (props) {
	return React.createElement(
		'div',
		null,
		React.createElement(
			'p',
			null,
			props.children
		),
		React.createElement(
			'button',
			{ onClick: props.modal.onButtonClick.bind(null, props.confirm) },
			props.buttonLabel || 'OK'
		)
	);
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(88);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_LABEL = '?';

var MoreInfoButton = function (_React$Component) {
	_inherits(MoreInfoButton, _React$Component);

	_createClass(MoreInfoButton, null, [{
		key: 'defaultProps',
		get: function get() {
			return {
				label: DEFAULT_LABEL
			};
		}
	}]);

	function MoreInfoButton() {
		_classCallCheck(this, MoreInfoButton);

		var _this = _possibleConstructorReturn(this, (MoreInfoButton.__proto__ || Object.getPrototypeOf(MoreInfoButton)).call(this));

		_this.boundOnMouseOver = _this.onMouseOver.bind(_this);
		_this.boundOnMouseOut = _this.onMouseOut.bind(_this);
		_this.boundOnClick = _this.onClick.bind(_this);

		_this.state = {
			mode: 'hidden'
		};
		return _this;
	}

	_createClass(MoreInfoButton, [{
		key: 'onMouseOver',
		value: function onMouseOver() {
			if (this.state.mode === 'hidden') {
				this.setState({ mode: 'hover' });
			}
		}
	}, {
		key: 'onMouseOut',
		value: function onMouseOut() {
			if (this.state.mode === 'hover') {
				this.setState({ mode: 'hidden' });
			}
		}
	}, {
		key: 'onClick',
		value: function onClick() {
			if (this.state.mode === 'clicked') {
				this.setState({ mode: 'hidden' });
			} else {
				this.setState({ mode: 'clicked' });
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var isShowing = this.state.mode === 'hover' || this.state.mode === 'clicked';

			return React.createElement(
				'div',
				{
					className: 'obojobo-draft--components--more-info-button ' + (this.props.label === DEFAULT_LABEL ? 'is-default-label' : 'is-not-default-label') + ' is-mode-' + this.state.mode
				},
				React.createElement(
					'button',
					{
						onMouseOver: this.boundOnMouseOver,
						onMouseOut: this.boundOnMouseOut,
						onClick: this.boundOnClick
					},
					this.props.label
				),
				isShowing ? React.createElement(
					'div',
					{ className: 'info' },
					React.createElement(
						'div',
						{ className: 'container' },
						this.props.children
					)
				) : null
			);
		}
	}]);

	return MoreInfoButton;
}(React.Component);

exports.default = MoreInfoButton;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _focusUtil = __webpack_require__(15);

var _focusUtil2 = _interopRequireDefault(_focusUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OboComponent = function (_React$Component) {
	_inherits(OboComponent, _React$Component);

	function OboComponent() {
		_classCallCheck(this, OboComponent);

		return _possibleConstructorReturn(this, (OboComponent.__proto__ || Object.getPrototypeOf(OboComponent)).apply(this, arguments));
	}

	_createClass(OboComponent, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			return this.props.model.processTrigger('onMount');
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			return this.props.model.processTrigger('onUnmount');
		}
	}, {
		key: 'render',
		value: function render() {
			var Component = this.props.model.getComponentClass();
			var Tag = this.props.tag;

			var className = 'component';
			if (this.props.className != null) {
				className += ' ' + this.props.className;
			}

			var isFocussed = _focusUtil2.default.getFocussedComponent(this.props.moduleData.focusState) === this.props.model;

			var otherProps = {};
			for (var propKey in this.props) {
				switch (propKey) {
					case 'model':
					case 'moduleData':
					case 'tag':
					case 'className':
					case 'children':
						// do nothing
						break;

					default:
						otherProps[propKey] = this.props[propKey];
						break;
				}
			}

			return React.createElement(
				Tag,
				_extends({}, otherProps, {
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
	}], [{
		key: 'defaultProps',
		get: function get() {
			return { tag: 'div' };
		}
	}]);

	return OboComponent;
}(React.Component);

exports.default = OboComponent;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(89);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextMenu = function (_React$Component) {
	_inherits(TextMenu, _React$Component);

	function TextMenu() {
		_classCallCheck(this, TextMenu);

		return _possibleConstructorReturn(this, (TextMenu.__proto__ || Object.getPrototypeOf(TextMenu)).apply(this, arguments));
	}

	_createClass(TextMenu, [{
		key: 'renderImg',
		value: function renderImg(command) {
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
		}
	}, {
		key: 'onMouseDown',
		value: function onMouseDown(label, event) {
			event.preventDefault();
			event.stopPropagation();

			return this.props.commandHandler(label);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			if (!this.props.relativeToElement) {
				return null;
			}
			if (!this.props.enabled) {
				return null;
			}

			var ctrlRect = this.props.relativeToElement.getBoundingClientRect();
			var selRect = this.props.selectionRect;
			var renderImg = this.renderImg;


			if (!selRect || !this.props.commands || this.props.commands.length === 0) {
				return null;
			}

			return React.createElement('div', {
				className: 'editor--components--text-menu',
				style: {
					left: selRect.left + selRect.width / 2 - ctrlRect.left + 'px',
					top: selRect.top - ctrlRect.top + 'px'
					// height: HEIGHT + 'px'
				}
			}, this.props.commands.map(function (command, index) {
				return React.createElement('a', {
					onMouseDown: _this2.onMouseDown.bind(_this2, command.label),
					key: index
				}, renderImg(command));
			}));
		}
	}]);

	return TextMenu;
}(React.Component);

exports.default = TextMenu;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _store = __webpack_require__(27);

var _baseSelectionHandler = __webpack_require__(7);

var _baseSelectionHandler2 = _interopRequireDefault(_baseSelectionHandler);

var _focusableChunk = __webpack_require__(39);

var _focusableChunk2 = _interopRequireDefault(_focusableChunk);

var _focusableSelectionHandler = __webpack_require__(16);

var _focusableSelectionHandler2 = _interopRequireDefault(_focusableSelectionHandler);

var _toggleSelectionHandler = __webpack_require__(40);

var _toggleSelectionHandler2 = _interopRequireDefault(_toggleSelectionHandler);

var _nonEditableChunk = __webpack_require__(41);

var _nonEditableChunk2 = _interopRequireDefault(_nonEditableChunk);

var _textChunk = __webpack_require__(42);

var _textChunk2 = _interopRequireDefault(_textChunk);

var _textGroupSelectionHandler = __webpack_require__(47);

var _textGroupSelectionHandler2 = _interopRequireDefault(_textGroupSelectionHandler);

var _textGroupEl = __webpack_require__(46);

var _textGroupEl2 = _interopRequireDefault(_textGroupEl);

var _linkify = __webpack_require__(43);

var _linkify2 = _interopRequireDefault(_linkify);

var _textGroupAdapter = __webpack_require__(44);

var _textGroupAdapter2 = _interopRequireDefault(_textGroupAdapter);

var _chunkUtil = __webpack_require__(48);

var _chunkUtil2 = _interopRequireDefault(_chunkUtil);

var _insert = __webpack_require__(50);

var _insert2 = _interopRequireDefault(_insert);

var _insertWithText = __webpack_require__(49);

var _insertWithText2 = _interopRequireDefault(_insertWithText);

var _oboComponent = __webpack_require__(59);

var _oboComponent2 = _interopRequireDefault(_oboComponent);

var _anchor = __webpack_require__(17);

var _anchor2 = _interopRequireDefault(_anchor);

var _deleteButton = __webpack_require__(10);

var _deleteButton2 = _interopRequireDefault(_deleteButton);

var _editButton = __webpack_require__(52);

var _editButton2 = _interopRequireDefault(_editButton);

var _button = __webpack_require__(9);

var _button2 = _interopRequireDefault(_button);

var _buttonBar = __webpack_require__(51);

var _buttonBar2 = _interopRequireDefault(_buttonBar);

var _moreInfoButton = __webpack_require__(58);

var _moreInfoButton2 = _interopRequireDefault(_moreInfoButton);

var _bubble = __webpack_require__(18);

var _bubble2 = _interopRequireDefault(_bubble);

var _singleInputBubble = __webpack_require__(55);

var _singleInputBubble2 = _interopRequireDefault(_singleInputBubble);

var _question = __webpack_require__(56);

var _question2 = _interopRequireDefault(_question);

var _simpleMessage = __webpack_require__(57);

var _simpleMessage2 = _interopRequireDefault(_simpleMessage);

var _modal = __webpack_require__(21);

var _modal2 = _interopRequireDefault(_modal);

var _dialog = __webpack_require__(19);

var _dialog2 = _interopRequireDefault(_dialog);

var _simpleDialog = __webpack_require__(22);

var _simpleDialog2 = _interopRequireDefault(_simpleDialog);

var _errorDialog = __webpack_require__(20);

var _errorDialog2 = _interopRequireDefault(_errorDialog);

var _textMenu = __webpack_require__(60);

var _textMenu2 = _interopRequireDefault(_textMenu);

var _modalContainer = __webpack_require__(54);

var _modalContainer2 = _interopRequireDefault(_modalContainer);

var _focusBlocker = __webpack_require__(53);

var _focusBlocker2 = _interopRequireDefault(_focusBlocker);

var _store2 = __webpack_require__(11);

var _store3 = _interopRequireDefault(_store2);

var _dispatcher = __webpack_require__(0);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _mockElement = __webpack_require__(23);

var _mockElement2 = _interopRequireDefault(_mockElement);

var _mockTextNode = __webpack_require__(24);

var _mockTextNode2 = _interopRequireDefault(_mockTextNode);

var _oboModel = __webpack_require__(1);

var _oboModel2 = _interopRequireDefault(_oboModel);

var _legacy = __webpack_require__(63);

var _legacy2 = _interopRequireDefault(_legacy);

var _api = __webpack_require__(64);

var _api2 = _interopRequireDefault(_api);

var _chunkSelection = __webpack_require__(68);

var _chunkSelection2 = _interopRequireDefault(_chunkSelection);

var _cursor = __webpack_require__(25);

var _cursor2 = _interopRequireDefault(_cursor);

var _domSelection = __webpack_require__(3);

var _domSelection2 = _interopRequireDefault(_domSelection);

var _oboSelectionRect = __webpack_require__(12);

var _oboSelectionRect2 = _interopRequireDefault(_oboSelectionRect);

var _selection = __webpack_require__(69);

var _selection2 = _interopRequireDefault(_selection);

var _virtualCursor = __webpack_require__(13);

var _virtualCursor2 = _interopRequireDefault(_virtualCursor);

var _virtualCursorData = __webpack_require__(70);

var _virtualCursorData2 = _interopRequireDefault(_virtualCursorData);

var _virtualSelection = __webpack_require__(26);

var _virtualSelection2 = _interopRequireDefault(_virtualSelection);

var _modalStore = __webpack_require__(72);

var _modalStore2 = _interopRequireDefault(_modalStore);

var _focusStore = __webpack_require__(71);

var _focusStore2 = _interopRequireDefault(_focusStore);

var _domUtil = __webpack_require__(2);

var _domUtil2 = _interopRequireDefault(_domUtil);

var _head = __webpack_require__(65);

var _head2 = _interopRequireDefault(_head);

var _keyboard = __webpack_require__(66);

var _keyboard2 = _interopRequireDefault(_keyboard);

var _screen = __webpack_require__(67);

var _screen2 = _interopRequireDefault(_screen);

var _chunkStyleList = __webpack_require__(32);

var _chunkStyleList2 = _interopRequireDefault(_chunkStyleList);

var _styleableText = __webpack_require__(5);

var _styleableText2 = _interopRequireDefault(_styleableText);

var _styleableTextComponent = __webpack_require__(33);

var _styleableTextComponent2 = _interopRequireDefault(_styleableTextComponent);

var _styleableTextRenderer = __webpack_require__(34);

var _styleableTextRenderer2 = _interopRequireDefault(_styleableTextRenderer);

var _styleRange = __webpack_require__(8);

var _styleRange2 = _interopRequireDefault(_styleRange);

var _styleType = __webpack_require__(4);

var _styleType2 = _interopRequireDefault(_styleType);

var _textConstants = __webpack_require__(6);

var _textConstants2 = _interopRequireDefault(_textConstants);

var _textGroup = __webpack_require__(31);

var _textGroup2 = _interopRequireDefault(_textGroup);

var _textGroupCursor = __webpack_require__(28);

var _textGroupCursor2 = _interopRequireDefault(_textGroupCursor);

var _textGroupItem = __webpack_require__(29);

var _textGroupItem2 = _interopRequireDefault(_textGroupItem);

var _textGroupSelection = __webpack_require__(30);

var _textGroupSelection2 = _interopRequireDefault(_textGroupSelection);

var _textGroupUtil = __webpack_require__(14);

var _textGroupUtil2 = _interopRequireDefault(_textGroupUtil);

var _console = __webpack_require__(73);

var _console2 = _interopRequireDefault(_console);

var _htmlUtil = __webpack_require__(35);

var _htmlUtil2 = _interopRequireDefault(_htmlUtil);

var _modalUtil = __webpack_require__(36);

var _modalUtil2 = _interopRequireDefault(_modalUtil);

var _focusUtil = __webpack_require__(15);

var _focusUtil2 = _interopRequireDefault(_focusUtil);

var _errorUtil = __webpack_require__(74);

var _errorUtil2 = _interopRequireDefault(_errorUtil);

var _uuid = __webpack_require__(37);

var _uuid2 = _interopRequireDefault(_uuid);

var _rangeParsing = __webpack_require__(75);

var _rangeParsing2 = _interopRequireDefault(_rangeParsing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @TODO
exports.default = {
	Store: _store.Store,

	chunk: {
		BaseSelectionHandler: _baseSelectionHandler2.default,
		FocusableChunk: _focusableChunk2.default,
		focusableChunk: {
			FocusableSelectionHandler: _focusableSelectionHandler2.default,
			ToggleSelectionHandler: _toggleSelectionHandler2.default
		},
		NonEditableChunk: _nonEditableChunk2.default,
		TextChunk: _textChunk2.default,
		textChunk: {
			TextGroupSelectionHandler: _textGroupSelectionHandler2.default,
			TextGroupEl: _textGroupEl2.default,
			Linkify: _linkify2.default,
			TextGroupAdapter: _textGroupAdapter2.default
		},
		util: {
			ChunkUtil: _chunkUtil2.default,
			Insert: _insert2.default,
			InsertWithText: _insertWithText2.default
		}
	},

	components: {
		OboComponent: _oboComponent2.default,
		Anchor: _anchor2.default,
		DeleteButton: _deleteButton2.default,
		EditButton: _editButton2.default,
		Button: _button2.default,
		ButtonBar: _buttonBar2.default,
		MoreInfoButton: _moreInfoButton2.default,
		modal: {
			bubble: {
				Bubble: _bubble2.default,
				SingleInputBubble: _singleInputBubble2.default
			},
			Question: _question2.default,
			SimpleMessage: _simpleMessage2.default,
			Modal: _modal2.default,
			Dialog: _dialog2.default,
			SimpleDialog: _simpleDialog2.default,
			ErrorDialog: _errorDialog2.default
		},
		TextMenu: _textMenu2.default,
		ModalContainer: _modalContainer2.default,
		FocusBlocker: _focusBlocker2.default
	},

	flux: {
		Store: _store3.default,
		Dispatcher: _dispatcher2.default
	},

	mockDOM: {
		MockElement: _mockElement2.default,
		MockTextNode: _mockTextNode2.default
	},

	models: {
		OboModel: _oboModel2.default,
		Legacy: _legacy2.default
	},

	net: {
		API: _api2.default
	},

	selection: {
		ChunkSelection: _chunkSelection2.default,
		Cursor: _cursor2.default,
		DOMSelection: _domSelection2.default,
		OboSelectionRect: _oboSelectionRect2.default,
		Selection: _selection2.default,
		VirtualCursor: _virtualCursor2.default,
		VirtualCursorData: _virtualCursorData2.default,
		VirtualSelection: _virtualSelection2.default
	},

	stores: {
		ModalStore: _modalStore2.default,
		FocusStore: _focusStore2.default
	},

	page: {
		DOMUtil: _domUtil2.default,
		Head: _head2.default,
		Keyboard: _keyboard2.default,
		Screen: _screen2.default
	},

	text: {
		ChunkStyleList: _chunkStyleList2.default,
		StyleableText: _styleableText2.default,
		StyleableTextComponent: _styleableTextComponent2.default,
		StyleableTextRenderer: _styleableTextRenderer2.default,
		StyleRange: _styleRange2.default,
		StyleType: _styleType2.default,
		TextConstants: _textConstants2.default
	},

	textGroup: {
		TextGroup: _textGroup2.default,
		TextGroupCursor: _textGroupCursor2.default,
		TextGroupItem: _textGroupItem2.default,
		TextGroupSelection: _textGroupSelection2.default,
		TextGroupUtil: _textGroupUtil2.default
	},

	util: {
		Console: _console2.default,
		HtmlUtil: _htmlUtil2.default,
		ModalUtil: _modalUtil2.default,
		FocusUtil: _focusUtil2.default,
		ErrorUtil: _errorUtil2.default,
		UUID: _uuid2.default,
		RangeParsing: _rangeParsing2.default
	}
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// used to apply ' is-label' or ' is-not-label' styles
var isOrNot = function isOrNot(flag, label) {
  return ' is-' + (flag ? '' : 'not-') + label;
};
exports.default = isOrNot;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _oboModel = __webpack_require__(1);

var _oboModel2 = _interopRequireDefault(_oboModel);

var _styleableText = __webpack_require__(5);

var _styleableText2 = _interopRequireDefault(_styleableText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var patternAddUL = /<LI>([\s\S]*?)<\/LI>/gi;
var patternRemoveExtraUL = /<\/ul><ul>/gi;
var patternTF = /<\/?textformat\s?[\s\S]*?>/gi;

var Legacy = {
	createModuleFromObo2ModuleJSON: function createModuleFromObo2ModuleJSON(json) {
		var oboModule = _oboModel2.default.create('ObojoboDraft.Modules.Module');

		var objective = _oboModel2.default.create('ObojoboDraft.Sections.Content');
		// oboModule.children.add objective
		var objectivePage = _oboModel2.default.create('ObojoboDraft.Pages.Page');
		objective.children.add(objectivePage);
		objectivePage.children.add(Legacy.createChunksFromObo2HTML(json.objective));

		var content = _oboModel2.default.create('ObojoboDraft.Sections.Content');
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = Array.from(json.pages)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var page = _step.value;

				content.children.add(Legacy.createPageFromObo2ModuleJSON(page));
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

		oboModule.children.add(objective);
		oboModule.children.add(content);

		return oboModule;
	},
	createPageFromObo2ModuleJSON: function createPageFromObo2ModuleJSON(json) {
		var page = _oboModel2.default.create('ObojoboDraft.Pages.Page');

		var header = _oboModel2.default.create('ObojoboDraft.Chunks.Heading');
		header.modelState.textGroup.first.text.value = json.title;
		page.children.add(header);

		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = Array.from(json.items)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var item = _step2.value;

				switch (item.component) {
					case 'TextArea':
						page.children.add(Legacy.createChunksFromObo2HTML(item.data));
						break;

					case 'MediaView':
						page.children.add(Legacy.createMediaFromObo2JSON(item.media));
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

		return page;
	},
	createChunksFromObo2HTML: function createChunksFromObo2HTML(html) {
		var chunks = [];

		// get rid of all the textformat tags
		html = html.replace(patternTF, '');

		// add <ul></ul> arround list items
		html = html.replace(patternAddUL, '<ul><li>$1</li></ul>');

		//kill extra </ul><ul> that are back to back - this will make proper lists
		html = html.replace(patternRemoveExtraUL, '');

		var el = document.createElement('div');
		document.body.appendChild(el);
		el.innerHTML = html;

		var sts = null;
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = Array.from(el.children)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var child = _step3.value;

				var chunk;
				switch (child.tagName.toLowerCase()) {
					case 'ul':
						chunk = _oboModel2.default.create('ObojoboDraft.Chunks.List');
						break;

					default:
						chunk = _oboModel2.default.create('ObojoboDraft.Chunks.Text');
				}

				var tg = chunk.modelState.textGroup;
				tg.clear();
				sts = _styleableText2.default.createFromElement(child);
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = Array.from(sts)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var st = _step4.value;

						tg.add(st);
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

				chunks.push(chunk);
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

		document.body.removeChild(el);

		console.log('-----------------');
		console.log(html);
		console.log(el.innerHTML);
		console.log(chunks);
		console.log(sts);

		return chunks;
	},
	createMediaFromObo2JSON: function createMediaFromObo2JSON(json) {
		return _oboModel2.default.create('ObojoboDraft.Chunks.Figure');
	}
};

exports.default = Legacy;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var makeRequest = function makeRequest(method, url, data, callback) {
	if (callback == null) {
		callback = function callback() {};
	}

	if (data == null) {
		data = null;
	}

	if (data != null) {
		var a = [];
		for (var k in data) {
			var v = data[k];
			a.push(k + '=' + v);
		}
		data = a.join('&');
	}

	var request = new XMLHttpRequest();
	request.addEventListener('load', callback);
	request.open(method, url, true);
	return request.send(data);
};

var APIModule = function () {
	function APIModule() {
		_classCallCheck(this, APIModule);
	}

	_createClass(APIModule, [{
		key: 'get',
		value: function get(moduleId, callback) {
			return makeRequest('GET', '/api/draft/' + moduleId + '/chunks', null, function (event) {
				return callback({ id: moduleId, chunks: JSON.parse(event.target.responseText) });
			});
		}
	}]);

	return APIModule;
}();

var APIChunk = function () {
	function APIChunk() {
		_classCallCheck(this, APIChunk);
	}

	_createClass(APIChunk, [{
		key: 'move',
		value: function move(chunkMoved, chunkBefore, callback) {
			var beforeId = chunkBefore != null ? chunkBefore.get('id') : null;
			return makeRequest('POST', '/api/chunk/' + chunkMoved.get('id') + '/move_before', { before_chunk_id: beforeId }, callback);
		}
	}]);

	return APIChunk;
}();

var API = function API() {
	_classCallCheck(this, API);
};

Object.defineProperties(API.prototype, {
	module: {
		get: function get() {
			return new APIModule();
		}
	},

	chunk: {
		get: function get() {
			return new APIChunk();
		}
	}
});

exports.default = new API();

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var addEl = function addEl(url, el, onLoad, onError) {
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
		return true; // return true, meaning the file was loaded
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

	return false; // return false, meaning the file wasn't already loaded
};

var loaded = {};

exports.default = {
	add: function add(urlOrUrls, onLoad, onError) {
		var urls = void 0;
		var type = void 0;
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

		return Array.from(urls).map(function (url) {
			return type = url.substr(url.lastIndexOf('.') + 1), console.log(type), function () {
				switch (type) {
					case 'js':
						var script = document.createElement('script');
						script.setAttribute('src', url);
						return addEl(url, script, onLoad, onError);

					case 'css':
						var link = document.createElement('link');
						link.setAttribute('rel', 'stylesheet');
						link.setAttribute('href', url);
						return addEl(url, link, onLoad, onError);
				}
			}();
		});
	}
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
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
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _oboSelectionRect = __webpack_require__(12);

var _oboSelectionRect2 = _interopRequireDefault(_oboSelectionRect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PX_EDGE_PADDING = 50;

var Screen = function () {
	function Screen(el) {
		_classCallCheck(this, Screen);

		this.el = el;
		this.intervalId = null;
		this.distance = 0;
		this.distanceLeft = 0;
		this.travelBy = 0;
	}

	// getScrollPosition: ->
	// 	x: @el.scrollTop
	// 	y: @el.scrollLeft

	// saveScrollPosition: ->
	// 	pos = @getScrollPosition()

	// 	@savedScrollPos = @getScrollPosition()
	// 	console.log 'Screen.saveScrollPosition', @savedScrollPos

	// restoreScrollPosition: ->
	// 	return if not @savedScrollPos?
	// 	console.log 'Screen.restoreScrollPosition', @savedScrollPos
	// 	window.scrollTo @savedScrollPos.x, @savedScrollPos.y

	_createClass(Screen, [{
		key: 'scrollToTop',
		value: function scrollToTop() {
			return this.el.scrollTop = 0;
		}
	}, {
		key: 'scrollToBottom',
		value: function scrollToBottom() {
			return this.el.scrollTop = this.el.scrollHeight;
		}
	}, {
		key: 'getScrollDistanceNeededToPutClientRectIntoView',
		value: function getScrollDistanceNeededToPutClientRectIntoView(clientRect) {
			var rect = this.el.getBoundingClientRect();

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
		}
	}, {
		key: 'getScrollDistanceNeededToPutElementIntoView',
		value: function getScrollDistanceNeededToPutElementIntoView(el) {
			return this.getScrollDistanceNeededToPutClientRectIntoView(el.getBoundingClientRect());
		}
	}, {
		key: 'getScrollDistanceNeededToPutSelectionIntoView',
		value: function getScrollDistanceNeededToPutSelectionIntoView() {
			return this.getScrollDistanceNeededToPutClientRectIntoView(_oboSelectionRect2.default.createFromSelection());
		}
	}, {
		key: 'scrollSelectionIntoViewIfNeeded',
		value: function scrollSelectionIntoViewIfNeeded() {
			this.distance = this.getScrollDistanceNeededToPutSelectionIntoView();
			return this.el.scrollTop += this.distance;
		}
	}, {
		key: 'tweenByDistance',
		value: function tweenByDistance(distance) {
			var _this = this;

			this.distance = distance;
			this.distanceLeft = this.distance;

			if (this.distance !== 0) {
				this.travelBy = Math.max(1, parseInt(Math.abs(this.distance) / 10, 10));

				clearInterval(this.intervalId);
				return this.intervalId = setInterval(function () {
					var travel = void 0;
					if (_this.distance < 1) {
						travel = Math.min(_this.travelBy, _this.distanceLeft * -1);
						_this.el.scrollTop -= travel;
						_this.distanceLeft += travel;

						if (_this.distanceLeft >= 0) {
							return clearInterval(_this.intervalId);
						}
					} else {
						travel = Math.min(_this.travelBy, _this.distanceLeft);
						_this.el.scrollTop += travel;
						_this.distanceLeft -= travel;

						if (_this.distanceLeft <= 0) {
							return clearInterval(_this.intervalId);
						}
					}
				}, 10);
			}
		}
	}, {
		key: 'tweenElementIntoViewIfNeeded',
		value: function tweenElementIntoViewIfNeeded(el) {
			return this.tweenByDistance(this.getScrollDistanceNeededToPutElementIntoView(el));
		}

		//@TODO - delete this?

	}, {
		key: 'tweenSelectionIntoViewIfNeeded',
		value: function tweenSelectionIntoViewIfNeeded() {
			return this.tweenByDistance(this.getScrollDistanceNeededToPutSelectionIntoView());
		}
	}]);

	return Screen;
}();

Screen.isElementVisible = function (node) {
	var rect = node.getBoundingClientRect();
	return !(rect.top > window.innerHeight || rect.bottom < 0);
};

window.__screen = Screen; //@todo
exports.default = Screen;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cursor = __webpack_require__(25);

var _cursor2 = _interopRequireDefault(_cursor);

var _domSelection = __webpack_require__(3);

var _domSelection2 = _interopRequireDefault(_domSelection);

var _domUtil = __webpack_require__(2);

var _domUtil2 = _interopRequireDefault(_domUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var domType = null;

var ChunkSelection = function () {
	function ChunkSelection(module) {
		_classCallCheck(this, ChunkSelection);

		this.module = module;
		this.clear();
	}

	_createClass(ChunkSelection, [{
		key: 'clear',
		value: function clear() {
			this.start = this.end = domType = null;
			this.inbetween = [];
			return this.all = [];
		}
	}, {
		key: 'calculateAllNodes',
		value: function calculateAllNodes() {
			this.inbetween = [];
			this.all = [];

			if ((this.start != null ? this.start.chunk : undefined) != null) {
				this.all = [this.start.chunk];
			}

			var n = this.start.chunk;
			while (n != null && n !== this.end.chunk) {
				if (n !== this.start.chunk) {
					this.inbetween.push(n);
					this.all.push(n);
				}
				n = n.nextSibling();
			}

			if ((this.end != null ? this.end.chunk : undefined) != null && this.all[this.all.length - 1] !== this.end.chunk) {
				return this.all.push(this.end.chunk);
			}
		}
	}, {
		key: 'getChunkForDomNode',
		value: function getChunkForDomNode(domNode) {
			// console.log 'getChunkForDomNode', domNode
			var index = this.getIndex(domNode);
			return this.module.chunks.at(index);
		}
	}, {
		key: 'getPosition',
		value: function getPosition(chunk) {
			// console.log 'get position', @
			if ((this.start != null ? this.start.chunk : undefined) == null || (this.end != null ? this.end.chunk : undefined) == null) {
				return 'unknown';
			}

			var chunkIndex = chunk.get('index');
			var startIndex = this.start.chunk.get('index');
			var endIndex = this.end.chunk.get('index');

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
		}
	}, {
		key: 'getIndex',
		value: function getIndex(node) {
			return _domUtil2.default.findParentAttr(node, 'data-component-index');
		}
	}, {
		key: 'getFromDOMSelection',
		value: function getFromDOMSelection(s) {
			if (s == null) {
				s = new _domSelection2.default();
			}
			this.clear();

			// s = new DOMSelection()
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
		}
	}, {
		key: 'getCursor',
		value: function getCursor(node, offset) {
			var chunk = this.getChunkForDomNode(node);
			return new _cursor2.default(chunk, node, offset);
		}
	}, {
		key: 'setTextStart',
		value: function setTextStart(node, offset) {
			this.start = this.getCursor(node, offset);

			if (this.end === null) {
				this.end = this.start.clone();
			}

			return this.calculateAllNodes();
		}
	}, {
		key: 'setTextEnd',
		value: function setTextEnd(node, offset) {
			this.end = this.getCursor(node, offset);

			if (this.start === null) {
				this.start = this.end.clone();
			}

			return this.calculateAllNodes();
		}
	}, {
		key: 'setCaret',
		value: function setCaret(node, offset) {
			this.setTextStart(node, offset);
			return this.collapse();
		}
	}, {
		key: 'select',
		value: function select() {
			return _domSelection2.default.set(this.start.node, this.start.offset, this.end.node, this.end.offset);
		}
	}, {
		key: 'collapse',
		value: function collapse() {
			return this.end = this.start.clone();
		}
	}]);

	return ChunkSelection;
}();

Object.defineProperties(ChunkSelection.prototype, {
	type: {
		get: function get() {
			if ((this.start != null ? this.start.chunk : undefined) == null || (this.end != null ? this.end.chunk : undefined) == null || !this.start.isText || !this.end.isText) {
				return 'none';
			} else if ((this.start != null ? this.start.chunk.cid : undefined) === (this.end != null ? this.end.chunk.cid : undefined)) {
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

exports.default = ChunkSelection;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _oboSelectionRect = __webpack_require__(12);

var _oboSelectionRect2 = _interopRequireDefault(_oboSelectionRect);

var _domSelection = __webpack_require__(3);

var _domSelection2 = _interopRequireDefault(_domSelection);

var _virtualSelection = __webpack_require__(26);

var _virtualSelection2 = _interopRequireDefault(_virtualSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Selection = function () {
	function Selection(page) {
		_classCallCheck(this, Selection);

		this.setPage(page);
		this.saved = null;
		this.clear();
	}

	_createClass(Selection, [{
		key: 'saveVirtualSelection',
		value: function saveVirtualSelection() {
			return this.saved = this.virtual.clone();
		}
	}, {
		key: 'restoreVirtualSelection',
		value: function restoreVirtualSelection() {
			return this.virtual = this.saved;
		}
	}, {
		key: 'clear',
		value: function clear() {
			this.rect = null;
			this.chunkRect = null;
			return this.dom = null;
		}
	}, {
		key: 'setPage',
		value: function setPage(page) {
			this.page = page;
			return this.virtual = new _virtualSelection2.default(this.page);
		}
	}, {
		key: 'getSelectionDescriptor',
		value: function getSelectionDescriptor() {
			return this.virtual.toObject();
		}
	}, {
		key: 'fromObject',
		value: function fromObject(o) {
			this.virtual.fromObject(o);
			this.selectDOM();
			return this.update();
		}
	}, {
		key: 'selectDOM',
		value: function selectDOM() {
			console.log('SELECTION selectDOM');
			if ((this.virtual.start != null ? this.virtual.start.chunk : undefined) == null || (this.virtual.end != null ? this.virtual.end.chunk : undefined) == null) {
				return;
			}
			console.log('startChunk', this.startChunk.cid);
			// console.log @startChunk
			// console.log 'endChunk', @endChunk

			var s = this.startChunk.getDOMSelectionStart();
			var e = this.endChunk.getDOMSelectionEnd();

			// console.log 's', s, 'e', e
			return _domSelection2.default.set(s.textNode, s.offset, e.textNode, e.offset);
		}
	}, {
		key: 'update',
		value: function update() {
			// return if not document.getElementById('editor').contains(document.activeElement)
			// console.log 'UUUUUUUUUUPDATE!'

			console.time('selection.update');
			// @clear()

			console.time('new oboSelection');
			this.dom = new _domSelection2.default();
			// @chunk.getFromDOMSelection @dom

			this.virtual.fromDOMSelection(this.dom);
			console.timeEnd('new oboSelection');

			console.time('OboSelectionRect.createFromSelection');
			this.rect = _oboSelectionRect2.default.createFromSelection();
			this.chunkRect = _oboSelectionRect2.default.createFromChunks(this.virtual.all);
			console.timeEnd('OboSelectionRect.createFromSelection');

			return console.timeEnd('selection.update');
		}
	}]);

	return Selection;
}();

Object.defineProperties(Selection.prototype, {
	startChunk: {
		get: function get() {
			if ((this.virtual != null ? this.virtual.start : undefined) == null) {
				return null;
			}
			return this.virtual.start.chunk;
		}
	},

	endChunk: {
		get: function get() {
			if ((this.virtual != null ? this.virtual.end : undefined) == null) {
				return null;
			}
			return this.virtual.end.chunk;
		}
	}
});

exports.default = Selection;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VirtualCursorData = function () {
	function VirtualCursorData(content) {
		_classCallCheck(this, VirtualCursorData);

		this.content = content;
	}

	_createClass(VirtualCursorData, [{
		key: "clone",
		value: function clone() {
			return new VirtualCursorData(Object.assign({}, this.content));
		}
	}]);

	return VirtualCursorData;
}();

// toObject: () ->
// Object.assign({}, @content)

exports.default = VirtualCursorData;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _store = __webpack_require__(11);

var _store2 = _interopRequireDefault(_store);

var _dispatcher = __webpack_require__(0);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TRANSITION_TIME_MS = 800;
var timeoutId = null;

var FocusStore = function (_Store) {
	_inherits(FocusStore, _Store);

	function FocusStore() {
		_classCallCheck(this, FocusStore);

		var _this = _possibleConstructorReturn(this, (FocusStore.__proto__ || Object.getPrototypeOf(FocusStore)).call(this, 'focusStore'));

		_dispatcher2.default.on('focus:component', function (payload) {
			_this._focus(payload.value.id);
		});

		_dispatcher2.default.on('focus:unfocus', _this._unfocus.bind(_this));
		return _this;
	}

	_createClass(FocusStore, [{
		key: 'init',
		value: function init() {
			this.state = {
				focussedId: null,
				viewState: 'inactive'
			};
		}
	}, {
		key: '_focus',
		value: function _focus(id) {
			var _this2 = this;

			this.state.viewState = 'enter';
			this.state.focussedId = id;
			this.triggerChange();

			window.clearTimeout(timeoutId);
			timeoutId = window.setTimeout(function () {
				_this2.state.viewState = 'active';
				_this2.triggerChange();
			}, TRANSITION_TIME_MS);
		}
	}, {
		key: '_unfocus',
		value: function _unfocus() {
			var _this3 = this;

			this.state.viewState = 'leave';
			this.triggerChange();

			window.clearTimeout(timeoutId);
			timeoutId = window.setTimeout(function () {
				_this3.state.viewState = 'inactive';
				_this3.state.focussedId = null;
				_this3.triggerChange();
			}, TRANSITION_TIME_MS);
		}
	}, {
		key: 'getState',
		value: function getState() {
			return this.state;
		}
	}, {
		key: 'setState',
		value: function setState(newState) {
			return this.state = newState;
		}
	}]);

	return FocusStore;
}(_store2.default);

var focusStore = new FocusStore();
exports.default = focusStore;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _store = __webpack_require__(11);

var _store2 = _interopRequireDefault(_store);

var _dispatcher = __webpack_require__(0);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ModalStore = function (_Store) {
	_inherits(ModalStore, _Store);

	function ModalStore() {
		_classCallCheck(this, ModalStore);

		var _this = _possibleConstructorReturn(this, (ModalStore.__proto__ || Object.getPrototypeOf(ModalStore)).call(this, 'modalstore'));

		_dispatcher2.default.on('modal:show', function (payload) {
			_this._show(payload.value);
		});

		_dispatcher2.default.on('modal:hide', _this._hide.bind(_this));
		return _this;
	}

	_createClass(ModalStore, [{
		key: 'init',
		value: function init() {
			return this.state = {
				modals: []
			};
		}
	}, {
		key: '_show',
		value: function _show(modalItem) {
			this.state.modals.push(modalItem);
			this.triggerChange();
		}
	}, {
		key: '_hide',
		value: function _hide() {
			this.state.modals.shift();
			this.triggerChange();
		}
	}, {
		key: 'getState',
		value: function getState() {
			return this.state;
		}
	}, {
		key: 'setState',
		value: function setState(newState) {
			return this.state = newState;
		}
	}]);

	return ModalStore;
}(_store2.default);

var modalStore = new ModalStore();
exports.default = modalStore;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	__debug__hijackConsole: function __debug__hijackConsole() {
		// console.time = ->
		// console.timeEnd = ->
		// console.log = ->

		console._log = console.log;
		console._times = {};
		console._interval = null;
		console.time = function (s) {
			if (!console._times[s]) {
				console._times[s] = {
					time: 0,
					count: 0,
					start: 0,
					avg: 0
				};
			}

			return console._times[s].start = performance.now();
		};

		console.timeEnd = function (s) {
			if (console._times[s] != null) {
				var diff = performance.now() - console._times[s].start;
				console._times[s].count++;
				console._times[s].time += diff;
				console._times[s].avg = (console._times[s].time / console._times[s].count).toFixed(3);
			}
			// console._log('%c' + s + ': ' + diff.toFixed(3) + 'ms (Avg: ' + console._times[s].avg + 'ms)', 'color: gray;');

			clearTimeout(console._interval);
			return console._interval = setTimeout(console.showTimeAverages, 1000);
		};
		// console.showTimeAverages()

		console.showTimeAverages = function () {
			var byTime = [];
			for (var s in console._times) {
				byTime.push({ s: s, avg: console._times[s].avg });
			}

			byTime.sort(function (a, b) {
				if (a.avg < b.avg) {
					return 1;
				}
				if (a.avg > b.avg) {
					return -1;
				}
				return 0;
			});

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Array.from(byTime)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var o = _step.value;

					console._log('%c' + o.avg + ': ' + o.s, 'color: blue;');
					return;
				} //@Todo - hack to only show worst thing
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
		};

		// console._error = console.error
		// console.error = (msg) ->
		// 	if msg.substr(0, 7) is 'Warning'
		// 		if msg.indexOf('Warning: bind()') > -1 or msg.indexOf('contentEditable') > -1 then return false
		// 		console.warn msg #@TODO - SUPRESS WARNINGS
		// 		# false
		// 	else
		// 		console._error msg
	}
};

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _dispatcher = __webpack_require__(0);

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _errorDialog = __webpack_require__(20);

var _errorDialog2 = _interopRequireDefault(_errorDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ErrorUtil = {
	show: function show(title, errorMessage) {
		return _dispatcher2.default.trigger('modal:show', {
			value: {
				component: React.createElement(
					_errorDialog2.default,
					{ title: title },
					errorMessage
				)
			}
		});
	},
	errorResponse: function errorResponse(res) {
		var title = function () {
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

exports.default = ErrorUtil;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getParsedRange = function getParsedRange(range) {
	if (typeof range === 'undefined' || range === null) return null;

	if (range.indexOf(',') === -1) return getParsedRangeFromSingleValue(range);

	var ints = range.replace(/[\(\[\)\] ]+/g, '');
	var rangeValues = ints.split(',');

	return {
		min: rangeValues[0],
		isMinInclusive: range.charAt(0) === '[',
		max: rangeValues[1],
		isMaxInclusive: range.charAt(range.length - 1) === ']'
	};
};

var getParsedRangeFromSingleValue = function getParsedRangeFromSingleValue(value) {
	if (typeof value === 'undefined' || value === null) return null;

	return {
		min: value,
		isMinInclusive: true,
		max: value,
		isMaxInclusive: true
	};
};

// replaceDict is an object of possibile replacements for `value`.
// For example, if replaceDict = { '$highest_score':100 } and `value` is '$highest_score' then
// `value` will be replaced with 100.
// nonParsedValueOrValues is a value or an array of values that won't be parsed by parseFloat.
// If `value` is one of these values then `value` is not parsed and simply returned.
// For example, if nonParsedValueOrValues is `[null, undefined]` and `value` is null
// then null is returned.
var tryGetParsedFloat = function tryGetParsedFloat(value) {
	var replaceDict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var nonParsedValueOrValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	var replaceDictValue = void 0;
	var nonParsedValues = void 0;

	if (!(nonParsedValueOrValues instanceof Array)) {
		nonParsedValues = [nonParsedValueOrValues];
	} else {
		nonParsedValues = nonParsedValueOrValues;
	}

	for (var placeholder in replaceDict) {
		if (value === placeholder) {
			value = replaceDict[placeholder];
			break;
		}
	}

	// If the value is an allowed non-numeric value then we don't parse it
	// and simply return it as is
	if (nonParsedValues.indexOf(value) > -1) return value;

	var parsedValue = parseFloat(value);

	if (!Number.isFinite(parsedValue) && parsedValue !== Infinity && parsedValue !== -Infinity) {
		throw new Error('Unable to parse "' + value + '": Got "' + parsedValue + '" - Unsure how to proceed');
	}

	return parsedValue;
};

var isValueInRange = function isValueInRange(value, range, replaceDict) {
	// By definition a value is not inside a null range
	if (range === null) return false;

	var isMinRequirementMet = void 0,
	    isMaxRequirementMet = void 0;

	var min = tryGetParsedFloat(range.min, replaceDict);
	var max = tryGetParsedFloat(range.max, replaceDict);

	if (range.isMinInclusive) {
		isMinRequirementMet = value >= min;
	} else {
		isMinRequirementMet = value > min;
	}

	if (range.isMaxInclusive) {
		isMaxRequirementMet = value <= max;
	} else {
		isMaxRequirementMet = value < max;
	}

	return isMinRequirementMet && isMaxRequirementMet;
};

module.exports = {
	getParsedRange: getParsedRange,
	getParsedRangeFromSingleValue: getParsedRangeFromSingleValue,
	tryGetParsedFloat: tryGetParsedFloat,
	isValueInRange: isValueInRange
};

/***/ }),
/* 76 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 77 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 78 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 79 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 80 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 81 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 82 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 83 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 84 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 85 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 86 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 87 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 88 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 89 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 90 */
/***/ (function(module, exports) {

module.exports = katex;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(38);


/***/ })
/******/ ]);