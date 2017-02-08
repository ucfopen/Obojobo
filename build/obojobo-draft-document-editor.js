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
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(133);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk,
	    OboModel,
	    createUUID,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	OboModel = __webpack_require__(28);

	createUUID = __webpack_require__(39);

	Chunk = function (superClass) {
	  extend(Chunk, superClass);

	  Chunk.prototype.urlRoot = "/api/chunk";

	  Chunk.prototype.sync = function (method, model, options) {
	    model.dirty = false;
	    model.needsUpdate = false;
	    if (method === 'update' || method === 'create') {
	      options.data = JSON.stringify({
	        chunk: model.toJSON()
	      });
	      options.contentType = 'application/json';
	    }
	    return Backbone.sync(method, model, options);
	  };

	  function Chunk(attrs) {
	    if (attrs.id == null) {
	      this["new"] = true;
	      attrs.id = this.createNewLocalId();
	    }
	    Chunk.__super__.constructor.call(this, attrs);
	    this.dirty = false;
	    this.needsUpdate = false;
	    this.editing = false;
	    if (attrs.content) {
	      this.componentContent = this.getComponent().createNodeDataFromDescriptor(attrs);
	    } else {
	      this.componentContent = {};
	    }
	    this.on("change", this.onChange, this);
	    this.page = null;
	  }

	  Chunk.prototype.url = function () {
	    if (this["new"] != null) {
	      return this.urlRoot;
	    }
	    return this.urlRoot + '/' + encodeURIComponent(this.get('id'));
	  };

	  Chunk.prototype.save = function (attrs, options) {
	    console.log('SAVE TIME');
	    if (this["new"] != null) {
	      this.assignNewId();
	      options.type = 'post';
	      options.success = function () {
	        if (this["new"]) {
	          delete this["new"];
	        }
	        return true;
	      }.bind(this);
	      console.log(options);
	    }
	    return Chunk.__super__.save.call(this, attrs, options);
	  };

	  Chunk.prototype.assignNewId = function () {
	    return this.set('id', this.createNewLocalId());
	  };

	  Chunk.prototype.createNewLocalId = function () {
	    return createUUID();
	  };

	  Chunk.prototype.onChange = function (model, options) {
	    if (model.get('index') !== model.previous('index')) {
	      this.dirty = true;
	      return this.needsUpdate = true;
	    }
	  };

	  Chunk.prototype.defaults = function () {
	    return {
	      type: 'none',
	      content: null,
	      contentType: 'json',
	      derivedFrom: null,
	      index: null,
	      draftId: null
	    };
	  };

	  Chunk.prototype.getComponent = function () {
	    return OBO.componentClassMap.getClassForType(this.get('type'));
	  };

	  Chunk.prototype.callCommandFn = function (fn, content) {
	    var commandHandler, componentClass, ref, selection;
	    componentClass = this.getComponent();
	    selection = null;
	    if (((ref = this.page) != null ? ref.module : void 0) != null) {
	      selection = this.page.module.app.state.selection;
	    }
	    if (componentClass.getCommandHandler == null) {
	      return null;
	    }
	    commandHandler = componentClass.getCommandHandler(this, selection);
	    if (!(commandHandler != null ? commandHandler[fn] : void 0)) {
	      return null;
	    }
	    return commandHandler[fn].apply(commandHandler, [selection, this].concat(content));
	  };

	  Chunk.prototype.callSelectionFn = function (fn, content) {
	    var componentClass, ref, selection, selectionHandler;
	    componentClass = this.getComponent();
	    selection = null;
	    if (((ref = this.page) != null ? ref.module : void 0) != null) {
	      selection = this.page.module.app.state.selection;
	    }
	    selectionHandler = componentClass.getSelectionHandler(this, selection);
	    if (!(selectionHandler != null ? selectionHandler[fn] : void 0)) {
	      return null;
	    }
	    return selectionHandler[fn].apply(selectionHandler, [selection, this].concat(content));
	  };

	  Chunk.prototype.getDomEl = function () {
	    return document.body.querySelector(".component[data-id='" + this.get('id') + "']");
	  };

	  Chunk.prototype.clone = function (cloneId) {
	    var clone;
	    if (cloneId == null) {
	      cloneId = false;
	    }
	    clone = new this.constructor({
	      type: this.get('type')
	    });
	    clone.componentContent = this.getComponent().cloneNodeData(this.componentContent);
	    if (cloneId) {
	      clone.set('id', this.get('id'));
	    }
	    return clone;
	  };

	  Chunk.prototype.markDirty = function () {
	    this.dirty = true;
	    return this.needsUpdate = true;
	  };

	  Chunk.prototype.markForUpdate = function () {
	    return this.needsUpdate = true;
	  };

	  Chunk.prototype.markUpdated = function () {
	    return this.needsUpdate = false;
	  };

	  Chunk.prototype.isEditing = function () {
	    return this.page.module.app.state.editingChunk === this;
	  };

	  Chunk.prototype.toJSON = function () {
	    var contentJSON, json;
	    contentJSON = this.getComponent().getDataDescriptor(this);
	    json = {
	      type: this.get('type'),
	      content: contentJSON,
	      contentType: this.get('contentType'),
	      derivedFrom: this.get('derivedFrom'),
	      index: this.get('index'),
	      id: this.get('id'),
	      draftId: this.get('draftId')
	    };
	    return json;
	  };

	  Chunk.prototype.revert = function () {
	    var attr, attrName, id, index, newChunk, ref;
	    newChunk = Chunk.create();
	    index = this.get('index');
	    id = this.get('id');
	    this.clear();
	    ref = newChunk.attributes;
	    for (attrName in ref) {
	      attr = ref[attrName];
	      this.set(attrName, attr);
	    }
	    this.set('index', index);
	    this.set('id', id);
	    this.componentContent = newChunk.componentContent;
	    return this;
	  };

	  Chunk.prototype.getCaretEdge = function () {
	    return this.callCommandFn('getCaretEdge');
	  };

	  Chunk.prototype.isEmpty = function () {
	    return this.callCommandFn('isEmpty');
	  };

	  Chunk.prototype.canRemoveSibling = function (sibling) {
	    return this.callCommandFn('canRemoveSibling', [sibling]);
	  };

	  Chunk.prototype.insertText = function (textToInsert, stylesToApply, stylesToRemove) {
	    return this.callCommandFn('insertText', [textToInsert, stylesToApply, stylesToRemove]);
	  };

	  Chunk.prototype.deleteText = function (deleteForwards) {
	    return this.callCommandFn('deleteText', [deleteForwards]);
	  };

	  Chunk.prototype.onEnter = function (shiftKey) {
	    return this.callCommandFn('onEnter', [shiftKey]);
	  };

	  Chunk.prototype.splitText = function () {
	    return this.callCommandFn('splitText');
	  };

	  Chunk.prototype.deleteSelection = function () {
	    return this.callCommandFn('deleteSelection');
	  };

	  Chunk.prototype.styleSelection = function (styleType, styleData) {
	    return this.callCommandFn('styleSelection', [styleType, styleData]);
	  };

	  Chunk.prototype.unstyleSelection = function (styleType, styleData) {
	    return this.callCommandFn('unstyleSelection', [styleType, styleData]);
	  };

	  Chunk.prototype.getSelectionStyles = function () {
	    return this.callCommandFn('getSelectionStyles');
	  };

	  Chunk.prototype.canMergeWith = function (otherChunk) {
	    return this.callCommandFn('canMergeWith', [otherChunk]);
	  };

	  Chunk.prototype.merge = function (digestedChunk, mergeText) {
	    return this.callCommandFn('merge', [digestedChunk, mergeText]);
	  };

	  Chunk.prototype.indent = function (decreaseIndent) {
	    return this.callCommandFn('indent', [decreaseIndent]);
	  };

	  Chunk.prototype.onTab = function (untab) {
	    return this.callCommandFn('onTab', [untab]);
	  };

	  Chunk.prototype.acceptAbsorb = function (consumerChunk) {
	    return this.callCommandFn('acceptAbsorb', [consumerChunk]);
	  };

	  Chunk.prototype.absorb = function (digestedChunk) {
	    return this.callCommandFn('absorb', [digestedChunk]);
	  };

	  Chunk.prototype.replaceSelection = function () {
	    return this.callCommandFn('replaceSelection');
	  };

	  Chunk.prototype.split = function () {
	    return this.callCommandFn('split');
	  };

	  Chunk.prototype.getDOMStateBeforeInput = function () {
	    return this.callCommandFn('getDOMStateBeforeInput');
	  };

	  Chunk.prototype.getDOMModificationAfterInput = function (domStateBefore) {
	    return this.callCommandFn('getDOMModificationAfterInput', [domStateBefore]);
	  };

	  Chunk.prototype.applyDOMModification = function (domModifications) {
	    return this.callCommandFn('applyDOMModification', [domModifications]);
	  };

	  Chunk.prototype.onSelectAll = function () {
	    return this.callCommandFn('onSelectAll');
	  };

	  Chunk.prototype.getTextMenuCommands = function () {
	    return this.callCommandFn('getTextMenuCommands');
	  };

	  Chunk.prototype.paste = function (text, html, chunks) {
	    return this.callCommandFn('paste', [text, html, chunks]);
	  };

	  Chunk.prototype.getCopyOfSelection = function (cloneId) {
	    return this.callSelectionFn('getCopyOfSelection', [cloneId]);
	  };

	  Chunk.prototype.selectStart = function (asRange) {
	    return this.callSelectionFn('selectStart', [asRange]);
	  };

	  Chunk.prototype.selectEnd = function (asRange) {
	    return this.callSelectionFn('selectEnd', [asRange]);
	  };

	  Chunk.prototype.selectAll = function () {
	    return this.callSelectionFn('selectAll');
	  };

	  Chunk.prototype.getVirtualSelectionStartData = function () {
	    return this.callSelectionFn('getVirtualSelectionStartData');
	  };

	  Chunk.prototype.getVirtualSelectionEndData = function () {
	    return this.callSelectionFn('getVirtualSelectionEndData');
	  };

	  Chunk.prototype.getDOMSelectionStart = function () {
	    return this.callSelectionFn('getDOMSelectionStart');
	  };

	  Chunk.prototype.getDOMSelectionEnd = function () {
	    return this.callSelectionFn('getDOMSelectionEnd');
	  };

	  Chunk.prototype.areCursorsEquivalent = function (thisCursorData, otherCursorData) {
	    return this.callSelectionFn('areCursorsEquivalent', [thisCursorData, otherCursorData]);
	  };

	  Chunk.prototype.highlightSelection = function (comment) {
	    return this.callSelectionFn('highlightSelection', [comment]);
	  };

	  return Chunk;
	}(OboModel);

	Chunk.create = function (typeOrClass, content) {
	  var chunk, componentClass, e, type;
	  if (typeOrClass == null) {
	    typeOrClass = null;
	  }
	  if (content == null) {
	    content = null;
	  }
	  try {
	    if (typeOrClass == null) {
	      componentClass = OBO.componentClassMap.defaultClass;
	      type = OBO.componentClassMap.getTypeOfClass(componentClass);
	    } else if (typeof typeOrClass === 'string') {
	      componentClass = OBO.componentClassMap.getClassForType(typeOrClass);
	      type = typeOrClass;
	    } else {
	      componentClass = typeOrClass;
	      type = OBO.componentClassMap.getTypeOfClass(typeOrClass);
	    }
	    if (content == null) {
	      content = componentClass.createNewNodeData();
	    }
	    chunk = new Chunk({
	      type: type
	    });
	    chunk.componentContent = content;
	  } catch (error) {
	    e = error;
	    throw e;
	    componentClass = OBO.componentClassMap.errorClass;
	    chunk = new Chunk(componentClass);
	  }
	  return chunk;
	};

	module.exports = Chunk;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DOMSelection, DOMUtil;

	DOMUtil = __webpack_require__(4);

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ChunkStyleList, HtmlUtil, ObjectAssign, StyleRange, StyleType, StyleableText, trimStyleRange;

	ObjectAssign = __webpack_require__(12);

	ChunkStyleList = __webpack_require__(33);

	StyleRange = __webpack_require__(10);

	StyleType = __webpack_require__(7);

	HtmlUtil = __webpack_require__(38);

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
/* 7 */
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
	  COMMENT: '_comment'
	};

	module.exports = StyleType;

/***/ },
/* 8 */,
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BaseSelectionHandler, Chunk;

	Chunk = __webpack_require__(3);

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

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var StyleRange, StyleType;

	StyleType = __webpack_require__(7);

	StyleRange = function () {
	  function StyleRange(start, end, type, data) {
	    this.start = start != null ? start : 0;
	    this.end = end != null ? end : 0;
	    this.type = type != null ? type : '';
	    this.data = data != null ? data : {};
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
/* 11 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  EMPTY_CHAR_CODE: 8203,
	  EMPTY_CHAR: String.fromCharCode(8203)
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

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


/***/ },
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk,
	    ChunkCollection,
	    OboModel,
	    Page,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	OboModel = __webpack_require__(28);

	ChunkCollection = __webpack_require__(26);

	Chunk = __webpack_require__(3);

	Page = function (superClass) {
	  extend(Page, superClass);

	  function Page(attrs) {
	    Page.__super__.constructor.call(this, attrs);
	    this.chunks = new ChunkCollection();
	    this.deletedChunks = [];
	    this.chunks.on('remove', this.onChunkRemove, this);
	    this.chunks.on('add', this.onChunkAdd, this);
	    this.chunks.on('reset', this.onChunksReset, this);
	  }

	  Page.prototype.initIfNeeded = function () {
	    if (this.chunks.models.length === 0) {
	      return this.chunks.add(Chunk.create());
	    }
	  };

	  Page.prototype.onChunkRemove = function (model, collection, options) {
	    model.page = null;
	    model.markDirty();
	    this.deletedChunks.push(model);
	    return this.recalcuateIndices();
	  };

	  Page.prototype.onChunkAdd = function (model, collection, options) {
	    model.page = this;
	    model.set('draftId', this.draftId);
	    return this.recalcuateIndices();
	  };

	  Page.prototype.onChunksReset = function (collection, options) {
	    var chunk, j, len, ref;
	    ref = collection.models;
	    for (j = 0, len = ref.length; j < len; j++) {
	      chunk = ref[j];
	      chunk.page = this;
	      chunk.set('draftId', this.draftId);
	    }
	    return this.recalcuateIndices();
	  };

	  Page.prototype.recalcuateIndices = function () {
	    var chunk, i, j, len, ref, results;
	    ref = this.chunks.models;
	    results = [];
	    for (i = j = 0, len = ref.length; j < len; i = ++j) {
	      chunk = ref[i];
	      results.push(chunk.set('index', i));
	    }
	    return results;
	  };

	  Page.prototype.moveChunk = function (chunk, newIndex) {
	    this.chunks.models.splice(chunk.get('index'), 1)[0];
	    this.chunks.models.splice(newIndex, 0, chunk);
	    this.recalcuateIndices();
	    console.log('@TODO - Need to move chunk on server!');
	    return;
	    return API.chunk.move(chunk, chunk.prevSibling(), function (event) {
	      var j, len, ref;
	      console.log(event);
	      ref = this.chunks.models;
	      for (j = 0, len = ref.length; j < len; j++) {
	        chunk = ref[j];
	        console.log(chunk.get('id'));
	      }
	      return console.log(JSON.parse(event.target.responseText));
	    }.bind(this));
	  };

	  Page.prototype.toJSON = function () {
	    return {
	      chunks: this.chunks.toJSON()
	    };
	  };

	  Page.prototype.markDirty = function () {
	    var chunk, j, len, ref, results;
	    ref = this.chunks.models;
	    results = [];
	    for (j = 0, len = ref.length; j < len; j++) {
	      chunk = ref[j];
	      results.push(chunk.markDirty());
	    }
	    return results;
	  };

	  Page.prototype.markForUpdate = function () {
	    var chunk, j, len, ref, results;
	    ref = this.chunks.models;
	    results = [];
	    for (j = 0, len = ref.length; j < len; j++) {
	      chunk = ref[j];
	      results.push(chunk.markForUpdate());
	    }
	    return results;
	  };

	  return Page;
	}(OboModel);

	Page.createFromDescriptor = function (descriptor) {
	  var chunkDescriptor, chunks, e, j, len, p, ref;
	  console.log('PAGE CREATE FROM descriptor', descriptor);
	  p = new Page(descriptor);
	  chunks = [];
	  ref = descriptor.chunks;
	  for (j = 0, len = ref.length; j < len; j++) {
	    chunkDescriptor = ref[j];
	    try {
	      chunkDescriptor.draftId = descriptor.id;
	      chunks.push(new Chunk(chunkDescriptor));
	    } catch (error) {
	      e = error;
	      console.error('ERROR', e);
	      chunks.push(Chunk.create(OBO.componentClassMap.errorClass));
	    }
	  }
	  if (chunks.length === 0) {
	    chunks.push(Chunk.create());
	  }
	  p.chunks.reset(chunks);
	  return p;
	};

	module.exports = Page;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DOMSelection, OboSelectionRect;

	DOMSelection = __webpack_require__(5);

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

/***/ },
/* 18 */
/***/ function(module, exports) {

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

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var ObjectAssign;

	ObjectAssign = __webpack_require__(12);

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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

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

	BaseSelectionHandler = __webpack_require__(9);

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

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DOMUtil, StyleableText, StyleableTextRenderer, TextGroupEl, emptyChar;

	StyleableText = __webpack_require__(6);

	StyleableTextRenderer = __webpack_require__(60);

	emptyChar = __webpack_require__(11).EMPTY_CHAR;

	DOMUtil = __webpack_require__(4);

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
	          if (child.text.length === 0) {
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
	    console.time('textRender');
	    key = {
	      counter: 0
	    };
	    mockElement = StyleableTextRenderer(this.props.text);
	    return React.createElement(
	      'span',
	      { className: 'text', 'data-group-index': this.props.groupIndex, 'data-indent': this.props.indent },
	      this.createChild(mockElement, key)
	    );
	  }
	});

	window.__gdp = TextGroupEl.getDomPosition;

	module.exports = TextGroupEl;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var EMPTY_CHAR;

	EMPTY_CHAR = __webpack_require__(11).EMPTY_CHAR;

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

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(97);

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

/***/ },
/* 24 */
/***/ function(module, exports) {

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

/***/ },
/* 25 */
/***/ function(module, exports) {

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

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk,
	    ChunkCollection,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	Chunk = __webpack_require__(3);

	ChunkCollection = function (superClass) {
	  extend(ChunkCollection, superClass);

	  function ChunkCollection() {
	    return ChunkCollection.__super__.constructor.apply(this, arguments);
	  }

	  ChunkCollection.prototype.model = Chunk;

	  return ChunkCollection;
	}(Backbone.Collection);

	module.exports = ChunkCollection;

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';

	var Metadata,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	Metadata = function (superClass) {
	  extend(Metadata, superClass);

	  function Metadata() {
	    return Metadata.__super__.constructor.apply(this, arguments);
	  }

	  Metadata.prototype.idAttribute = "shortId";

	  Metadata.prototype.defaults = {
	    title: 'untitled',
	    synopsis: '',
	    published: false,
	    rating: 0,
	    ratingCount: 0,
	    derivedFrom: null,
	    createdAt: '',
	    updatedAt: ''
	  };

	  Metadata.prototype.toJSON = function () {
	    return {
	      title: this.title,
	      sysnopsis: this.sysnopsis,
	      published: this.published,
	      rating: this.rating,
	      ratingCount: this.ratingCount,
	      derivedFrom: this.derivedFrom,
	      createdAt: this.createdAt,
	      updatedAt: this.updatedAt
	    };
	  };

	  return Metadata;
	}(Backbone.Model);

	module.exports = Metadata;

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';

	var OboModel,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	OboModel = function (superClass) {
	  extend(OboModel, superClass);

	  function OboModel() {
	    return OboModel.__super__.constructor.apply(this, arguments);
	  }

	  OboModel.prototype.isOrphan = function () {
	    return this.collection == null;
	  };

	  OboModel.prototype.addChildBefore = function (sibling) {
	    var collection;
	    if (this.isOrphan()) {
	      return;
	    }
	    collection = this.collection;
	    if (collection.contains(sibling)) {
	      collection.remove(sibling);
	    }
	    return collection.add(sibling, {
	      at: this.get('index')
	    });
	  };

	  OboModel.prototype.addChildAfter = function (sibling) {
	    var collection;
	    if (this.isOrphan()) {
	      return;
	    }
	    collection = this.collection;
	    if (collection.contains(sibling)) {
	      collection.remove(sibling);
	    }
	    return collection.add(sibling, {
	      at: this.get('index') + 1
	    });
	  };

	  OboModel.prototype.moveTo = function (index) {
	    var refChunk;
	    if (this.get('index') === index) {
	      return;
	    }
	    refChunk = this.collection.at(index);
	    if (index < this.get('index')) {
	      return refChunk.addChildBefore(this);
	    } else {
	      return refChunk.addChildAfter(this);
	    }
	  };

	  OboModel.prototype.moveToTop = function () {
	    return this.moveTo(0);
	  };

	  OboModel.prototype.moveToBottom = function () {
	    return this.moveTo(this.collection.length - 1);
	  };

	  OboModel.prototype.prevSibling = function () {
	    if (this.isOrphan() || this.isFirst()) {
	      return null;
	    }
	    return this.collection.at(this.get('index') - 1);
	  };

	  OboModel.prototype.nextSibling = function () {
	    if (this.isOrphan() || this.isLast()) {
	      return null;
	    }
	    return this.collection.at(this.get('index') + 1);
	  };

	  OboModel.prototype.isFirst = function () {
	    if (this.isOrphan()) {
	      return false;
	    }
	    return this.get('index') === 0;
	  };

	  OboModel.prototype.isLast = function () {
	    if (this.isOrphan()) {
	      return false;
	    }
	    return this.get('index') === this.collection.length - 1;
	  };

	  OboModel.prototype.isBefore = function (otherChunk) {
	    if (this.isOrphan()) {
	      return false;
	    }
	    return this.get('index') < otherChunk.get('index');
	  };

	  OboModel.prototype.isAfter = function (otherChunk) {
	    if (this.isOrphan()) {
	      return false;
	    }
	    return this.get('index') > otherChunk.get('index');
	  };

	  OboModel.prototype.remove = function () {
	    if (!this.isOrphan()) {
	      return this.collection.remove(this);
	    }
	  };

	  OboModel.prototype.replaceWith = function (newChunk) {
	    if (this.isOrphan() || newChunk === this) {
	      return;
	    }
	    this.addChildBefore(newChunk);
	    return this.remove();
	  };

	  return OboModel;
	}(Backbone.Model);

	module.exports = OboModel;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Page,
	    PageCollection,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	Page = __webpack_require__(16);

	PageCollection = function (superClass) {
	  extend(PageCollection, superClass);

	  function PageCollection() {
	    return PageCollection.__super__.constructor.apply(this, arguments);
	  }

	  PageCollection.prototype.model = Page;

	  return PageCollection;
	}(Backbone.Collection);

	module.exports = PageCollection;

/***/ },
/* 30 */
/***/ function(module, exports) {

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

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Cursor, DOMUtil;

	DOMUtil = __webpack_require__(4);

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

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DOMSelection, DOMUtil, VirtualCursor, VirtualSelection;

	VirtualCursor = __webpack_require__(18);

	DOMUtil = __webpack_require__(4);

	DOMSelection = __webpack_require__(5);

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

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ChunkStyleList, StyleRange, StyleType, keySortFn;

	StyleType = __webpack_require__(7);

	StyleRange = __webpack_require__(10);

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
/* 34 */
/***/ function(module, exports) {

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
	      return this.virtualCursor.chunk.componentContent.textGroup;
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
	      return this.virtualCursor.chunk.componentContent.textGroup.get(this.virtualCursor.data.groupIndex);
	    }
	  },
	  text: {
	    "get": function get() {
	      return this.textGroupItem.text;
	    }
	  }
	});

	module.exports = TextGroupCursor;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var StyleableText, TextGroupItem, Util;

	StyleableText = __webpack_require__(6);

	Util = __webpack_require__(19);

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
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DOMUtil, TextGroupCursor, TextGroupSelection, VirtualCursor, emptyChar, getCursors;

	TextGroupCursor = __webpack_require__(34);

	VirtualCursor = __webpack_require__(18);

	DOMUtil = __webpack_require__(4);

	emptyChar = __webpack_require__(11).EMPTY_CHAR;

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
	      all.push(this.chunk.componentContent.textGroup.get(i));
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
	          return 'singleTextSpan';
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
	  return TextGroupSelection.getTextEndCursor(chunk, chunk.componentContent.textGroup.length - 1);
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
	    offset: chunk.componentContent.textGroup.get(groupIndex).text.length
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

/***/ },
/* 37 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (asset) {
	  return "url('" + asset.replace(/'/g, "\\'") + "')";
	};

/***/ },
/* 38 */
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
/* 39 */
/***/ function(module, exports) {

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

/***/ },
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BaseCommandHandler, Chunk;

	Chunk = __webpack_require__(3);

	BaseCommandHandler = function () {
	  function BaseCommandHandler() {}

	  BaseCommandHandler.prototype.getCaretEdge = function (selection, chunk) {
	    return 'startAndEnd';
	  };

	  BaseCommandHandler.prototype.isEmpty = function (selection, chunk) {
	    return false;
	  };

	  BaseCommandHandler.prototype.canRemoveSibling = function (selection, chunk) {
	    return false;
	  };

	  BaseCommandHandler.prototype.insertText = function (selection, chunk, textToInsert, stylesToApply, stylesToRemove) {
	    if (stylesToApply == null) {
	      stylesToApply = null;
	    }
	    if (stylesToRemove == null) {
	      stylesToRemove = null;
	    }
	    return false;
	  };

	  BaseCommandHandler.prototype.deleteText = function (selection, chunk, deleteForwards) {
	    return false;
	  };

	  BaseCommandHandler.prototype.onEnter = function (selection, chunk, shiftKey) {
	    return false;
	  };

	  BaseCommandHandler.prototype.splitText = function (selection, chunk) {
	    return false;
	  };

	  BaseCommandHandler.prototype.deleteSelection = function (selection, chunk) {
	    return false;
	  };

	  BaseCommandHandler.prototype.styleSelection = function (selection, chunk, styleType, styleData) {
	    return false;
	  };

	  BaseCommandHandler.prototype.unstyleSelection = function (selection, chunk, styleType, styleData) {
	    return false;
	  };

	  BaseCommandHandler.prototype.getSelectionStyles = function (selection, chunk) {
	    return [];
	  };

	  BaseCommandHandler.prototype.canMergeWith = function (selection, digestedChunk, consumerChunk) {
	    return false;
	  };

	  BaseCommandHandler.prototype.merge = function (selection, consumerChunk, digestedChunk, mergeText) {
	    if (mergeText == null) {
	      mergeText = true;
	    }
	    digestedChunk.remove();
	    return consumerChunk.selectEnd();
	  };

	  BaseCommandHandler.prototype.indent = function (selection, chunk, decreaseIndent) {
	    return false;
	  };

	  BaseCommandHandler.prototype.onTab = function (selection, chunk, untab) {
	    return false;
	  };

	  BaseCommandHandler.prototype.acceptAbsorb = function (selection, chunkToBeDigested, consumerChunk) {
	    return false;
	  };

	  BaseCommandHandler.prototype.absorb = function (selection, consumerChunk, digestedChunk) {
	    return false;
	  };

	  BaseCommandHandler.prototype.replaceSelection = function (selection, newChunk) {
	    var chunk, data, nextSibling, placeholderChunk, startChunk, stopChunk, target, tmpChunk;
	    newChunk.moveToBottom();
	    data = newChunk.componentContent;
	    if (selection.virtual.type !== 'chunkSpan') {
	      selection.startChunk.split();
	      target = selection.startChunk;
	      target.addChildBefore(newChunk);
	      newChunk.absorb(target);
	    } else {
	      startChunk = selection.startChunk;
	      selection.saveVirtualSelection();
	      startChunk.split();
	      selection.restoreVirtualSelection();
	      placeholderChunk = Chunk.create();
	      startChunk.addChildBefore(placeholderChunk);
	      selection.endChunk.split();
	      selection.restoreVirtualSelection();
	      tmpChunk = Chunk.create();
	      tmpChunk.componentContent.textGroup.clear();
	      startChunk.addChildBefore(tmpChunk);
	      stopChunk = selection.endChunk.nextSibling();
	      chunk = startChunk;
	      while (chunk !== stopChunk && chunk != null) {
	        chunk.selectEnd();
	        nextSibling = chunk.nextSibling();
	        if (tmpChunk.canMergeWith(chunk)) {
	          tmpChunk.merge(chunk, false);
	        }
	        chunk.remove();
	        chunk = nextSibling;
	      }
	      newChunk.absorb(tmpChunk);
	      placeholderChunk.replaceWith(newChunk);
	    }
	    return newChunk.selectAll();
	  };

	  BaseCommandHandler.prototype.split = function (selection, chunk) {
	    return false;
	  };

	  BaseCommandHandler.prototype.getDOMStateBeforeInput = function (selection, chunk) {
	    return null;
	  };

	  BaseCommandHandler.prototype.getDOMModificationAfterInput = function (selection, chunk, domStateBefore) {
	    return null;
	  };

	  BaseCommandHandler.prototype.applyDOMModification = function (selection, chunk, domModifications) {
	    return null;
	  };

	  BaseCommandHandler.prototype.onSelectAll = function (selection, chunk) {
	    return false;
	  };

	  BaseCommandHandler.prototype.getTextMenuCommands = function (selection, chunk) {
	    return [];
	  };

	  BaseCommandHandler.prototype.paste = function (selection, chunk, text, html, chunks) {
	    return false;
	  };

	  return BaseCommandHandler;
	}();

	module.exports = BaseCommandHandler;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  chunk: {
	    BaseSelectionHandler: __webpack_require__(9),
	    FocusableChunk: __webpack_require__(55),
	    focusableChunk: {
	      FocusableSelectionHandler: __webpack_require__(20),
	      ToggleSelectionHandler: __webpack_require__(56)
	    },
	    NonEditableChunk: __webpack_require__(57),
	    TextChunk: __webpack_require__(58),
	    textChunk: {
	      TextGroupSelectionHandler: __webpack_require__(61),
	      TextGroupEl: __webpack_require__(21),
	      Linkify: __webpack_require__(59)
	    },
	    util: {
	      ChunkUtil: __webpack_require__(62),
	      Insert: __webpack_require__(63),
	      InsertWithText: __webpack_require__(64)
	    }
	  },
	  components: {
	    Anchor: __webpack_require__(22),
	    DeleteButton: __webpack_require__(66),
	    EditButton: __webpack_require__(67),
	    Button: __webpack_require__(65),
	    modal: {
	      bubble: {
	        Bubble: __webpack_require__(23),
	        SingleInputBubble: __webpack_require__(68)
	      },
	      Question: __webpack_require__(69),
	      SimpleMessage: __webpack_require__(70)
	    },
	    TextMenu: __webpack_require__(71)
	  },
	  mockDOM: {
	    MockElement: __webpack_require__(24),
	    MockTextNode: __webpack_require__(25)
	  },
	  models: {
	    Chunk: __webpack_require__(3),
	    ChunkCollection: __webpack_require__(26),
	    Page: __webpack_require__(16),
	    PageCollection: __webpack_require__(29),
	    Metadata: __webpack_require__(27),
	    Module: __webpack_require__(72)
	  },
	  net: {
	    API: __webpack_require__(30)
	  },
	  selection: {
	    ChunkSelection: __webpack_require__(76),
	    Cursor: __webpack_require__(31),
	    DOMSelection: __webpack_require__(5),
	    OboSelectionRect: __webpack_require__(17),
	    Selection: __webpack_require__(77),
	    VirtualCursor: __webpack_require__(18),
	    VirtualCursorData: __webpack_require__(78),
	    VirtualSelection: __webpack_require__(32)
	  },
	  page: {
	    DOMUtil: __webpack_require__(4),
	    Head: __webpack_require__(73),
	    Keyboard: __webpack_require__(74),
	    Screen: __webpack_require__(75)
	  },
	  text: {
	    ChunkStyleList: __webpack_require__(33),
	    StyleableText: __webpack_require__(6),
	    StyleRange: __webpack_require__(10),
	    StyleType: __webpack_require__(7),
	    TextConstants: __webpack_require__(11)
	  },
	  textGroup: {
	    TextGroup: __webpack_require__(79),
	    TextGroupCursor: __webpack_require__(34),
	    TextGroupItem: __webpack_require__(35),
	    TextGroupSelection: __webpack_require__(36),
	    TextGroupUtil: __webpack_require__(19)
	  },
	  util: {
	    Console: __webpack_require__(80),
	    getBackgroundImage: __webpack_require__(37),
	    HtmlUtil: __webpack_require__(38),
	    UUID: __webpack_require__(39)
	  }
	};

/***/ },
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var Anchor;

	Anchor = __webpack_require__(22);

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

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

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

	BaseSelectionHandler = __webpack_require__(9);

	FocusableSelectionHandler = __webpack_require__(20);

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

/***/ },
/* 57 */
/***/ function(module, exports) {

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

/***/ },
/* 58 */
/***/ function(module, exports) {

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

/***/ },
/* 59 */
/***/ function(module, exports) {

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

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var MockElement, MockTextNode, ORDER, ObjectAssign, StyleRange, StyleType, StyleableText, _debugPrintNode, _getHTML, applyStyle, getMockElement, getTextNodeFragmentDescriptorsAt, _getTextNodeFragmentDescriptorsAtHelper, wrap, wrapElement;

	ObjectAssign = __webpack_require__(12);

	StyleableText = __webpack_require__(6);

	StyleRange = __webpack_require__(10);

	StyleType = __webpack_require__(7);

	MockElement = __webpack_require__(24);

	MockTextNode = __webpack_require__(25);

	ORDER = [StyleType.COMMENT, StyleType.LINK, StyleType.QUOTE, StyleType.BOLD, StyleType.STRIKETHROUGH, StyleType.MONOSPACE, StyleType.SUPERSCRIPT, StyleType.ITALIC];

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
	  var level, newChild, node, root;
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

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

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

	BaseSelectionHandler = __webpack_require__(9);

	TextGroupSelection = __webpack_require__(36);

	TextGroupEl = __webpack_require__(21);

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
	      clone.componentContent.textGroup.deleteSpan(sel.end.groupIndex, sel.end.offset, chunkEnd.groupIndex, chunkEnd.offset, true, this.mergeTextGroups);
	      clone.componentContent.textGroup.deleteSpan(chunkStart.groupIndex, chunkStart.offset, sel.start.groupIndex, sel.start.offset, true, this.mergeTextGroups);
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
	    return chunk.componentContent.textGroup.styleText(sel.start.groupIndex, sel.start.offset, sel.end.groupIndex, sel.end.offset, '_comment', {});
	  };

	  return TextGroupSelectionHandler;
	}(BaseSelectionHandler);

	module.exports = TextGroupSelectionHandler;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk, activateStyle, deleteSelection, replaceTextsWithinSelection, send;

	Chunk = __webpack_require__(3);

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
	    end.data.offset = end.chunk.componentContent.textGroup.get(end.data.groupIndex).text.length;
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

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk;

	Chunk = __webpack_require__(3);

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

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk;

	Chunk = __webpack_require__(3);

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

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(94);

	module.exports = React.createClass({
	  displayName: 'exports',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      value: 'Button'
	    };
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--components--button' },
	      React.createElement(
	        'button',
	        {
	          onClick: this.props.onClick,
	          tabIndex: this.props.shouldPreventTab ? '-1' : 1,
	          disabled: this.props.shouldPreventTab
	        },
	        this.props.value
	      )
	    );
	  }
	});

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(95);

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
	      { className: 'obojobo-draft--components--delete-button' },
	      React.createElement(
	        'button',
	        {
	          onClick: this.props.onClick,
	          tabIndex: this.props.shouldPreventTab ? '-1' : 1,
	          disabled: this.props.shouldPreventTab
	        },
	        'Delete'
	      )
	    );
	  }
	});

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var editButton, getBackgroundImage;

	__webpack_require__(96);

	getBackgroundImage = __webpack_require__(37);

	editButton = __webpack_require__(112);

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
	      backgroundImage: ObojoboDraft.util.getBackgroundImage(editButton)
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

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Bubble;

	__webpack_require__(98);

	Bubble = __webpack_require__(23);

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

/***/ },
/* 69 */
/***/ function(module, exports) {

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

/***/ },
/* 70 */
/***/ function(module, exports) {

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

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var TextMenu;

	__webpack_require__(99);

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

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var API,
	    Metadata,
	    Module,
	    Page,
	    PageCollection,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	Metadata = __webpack_require__(27);

	PageCollection = __webpack_require__(29);

	Page = __webpack_require__(16);

	API = __webpack_require__(30);

	Module = function (superClass) {
	  extend(Module, superClass);

	  Module.prototype.urlRoot = "/api/module";

	  function Module(app1, id) {
	    this.app = app1;
	    if (id == null) {
	      id = null;
	    }
	    this.id = id;
	    this.metadata = new Metadata();
	    this.pages = new PageCollection();
	    this.pages.on('remove', this.onPageRemove, this);
	    this.pages.on('add', this.onPageAdd, this);
	    this.pages.on('reset', this.onPagesReset, this);
	  }

	  Module.prototype.initIfNeeded = function () {
	    var i, len, page, ref, results;
	    if (this.pages.models.length === 0) {
	      this.pages.add(new Page());
	    }
	    ref = this.pages.models;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      page = ref[i];
	      results.push(page.initIfNeeded());
	    }
	    return results;
	  };

	  Module.prototype.onPageRemove = function (model, collection, options) {
	    model.module = null;
	    return model.markDirty();
	  };

	  Module.prototype.onPageAdd = function (model, collection, options) {
	    console.log('on page add', arguments);
	    model.module = this;
	    return model.set('draftId', this.id);
	  };

	  Module.prototype.onPagesReset = function (collection, options) {
	    var i, len, page, ref, results;
	    ref = collection.models;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      page = ref[i];
	      page.module = this;
	      results.push(page.set('draftId', this.id));
	    }
	    return results;
	  };

	  Module.prototype.toJSON = function () {
	    return {
	      metadata: this.metadata.toJSON(),
	      pages: this.pages.toJSON()
	    };
	  };

	  Module.prototype.save = function () {
	    var beforeId, chunk, i, len, ref;
	    this.saveCount = 0;
	    ref = this.chunks.models;
	    for (i = 0, len = ref.length; i < len; i++) {
	      chunk = ref[i];
	      if (chunk.dirty) {
	        this.saveCount++;
	        if (chunk.isFirst()) {
	          beforeId = null;
	        } else {
	          beforeId = chunk.prevSibling().id;
	        }
	        chunk.save({
	          before_chunk_id: beforeId
	        }, {
	          success: this.onSaved.bind(this)
	        });
	      }
	    }
	    while (this.deletedChunks.length > 0) {
	      console.log(this.deletedChunks.length);
	      this.deletedChunks.pop().destroy();
	    }
	    return this.deletedChunks = [];
	  };

	  Module.prototype.onSaved = function () {
	    this.saveCount--;
	    if (this.saveCount === 0) {
	      return this.update();
	    }
	  };

	  Module.prototype.fromDescriptor = function (descriptor) {
	    var newModule;
	    this.clear();
	    newModule = Module.createFromDescriptor(this.app, descriptor);
	    this.metadata = newModule.metadata;
	    this.pages = newModule.pages;
	    return this.markDirty();
	  };

	  Module.prototype.markDirty = function () {
	    var i, len, page, ref, results;
	    ref = this.pages.models;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      page = ref[i];
	      results.push(page.markDirty());
	    }
	    return results;
	  };

	  Module.prototype.markForUpdate = function () {
	    var i, len, page, ref, results;
	    ref = this.pages.models;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      page = ref[i];
	      results.push(page.markForUpdate());
	    }
	    return results;
	  };

	  Module.prototype.__print = function () {
	    var chunk, i, j, len, len1, ref, ref1, ref2, results, t;
	    console.log('CHUNKS:');
	    ref = this.chunks.models;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      chunk = ref[i];
	      if (((ref1 = chunk.componentContent) != null ? ref1.textGroup : void 0) != null && chunk.componentContent.textGroup.length !== 0) {
	        ref2 = chunk.componentContent.textGroup.items;
	        for (j = 0, len1 = ref2.length; j < len1; j++) {
	          t = ref2[j];
	          console.log(chunk.id + '|' + chunk.get('index') + '|' + chunk.get('type') + ':"' + t.text.value + '"');
	        }
	        results.push(console.log('---'));
	      } else {
	        console.log(chunk.id + '|' + chunk.get('index') + '|' + chunk.get('type') + ':<EMPTY>');
	        results.push(console.log('---'));
	      }
	    }
	    return results;
	  };

	  return Module;
	}(Backbone.Model);

	Module.createFromDescriptor = function (app, descriptor) {
	  var i, len, m, pageDescriptor, pages, ref;
	  m = new Module(app, descriptor.id);
	  m.metadata = new Metadata();
	  pages = [];
	  ref = descriptor.pages;
	  for (i = 0, len = ref.length; i < len; i++) {
	    pageDescriptor = ref[i];
	    pages.push(Page.createFromDescriptor(pageDescriptor));
	  }
	  m.pages.reset(pages);
	  return m;
	};

	module.exports = Module;

/***/ },
/* 73 */
/***/ function(module, exports) {

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

/***/ },
/* 74 */
/***/ function(module, exports) {

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

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OboSelectionRect, PX_EDGE_PADDING, Screen;

	OboSelectionRect = __webpack_require__(17);

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

	  Screen.prototype.getScrollDistanceNeededToPutSelectionIntoView = function () {
	    var rect, selScreenRect;
	    selScreenRect = OboSelectionRect.createFromSelection();
	    rect = this.el.getBoundingClientRect();
	    if (!selScreenRect.valid) {
	      return 0;
	    }
	    if (selScreenRect.top < 0) {
	      return selScreenRect.top - PX_EDGE_PADDING;
	    }
	    if (selScreenRect.bottom > rect.height) {
	      return selScreenRect.bottom - rect.height + PX_EDGE_PADDING;
	    }
	    return 0;
	  };

	  Screen.prototype.scrollSelectionIntoViewIfNeeded = function () {
	    this.distance = this.getScrollDistanceNeededToPutSelectionIntoView();
	    return this.el.scrollTop += this.distance;
	  };

	  Screen.prototype.tweenSelectionIntoViewIfNeeded = function () {
	    this.distance = this.getScrollDistanceNeededToPutSelectionIntoView();
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

	  return Screen;
	}();

	window.__screen = Screen;

	module.exports = Screen;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ChunkSelection, Cursor, DOMSelection, DOMUtil, domType;

	Cursor = __webpack_require__(31);

	DOMSelection = __webpack_require__(5);

	DOMUtil = __webpack_require__(4);

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

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DOMSelection, OboSelectionRect, ObojoboDraft, Selection, VirtualSelection;

	ObojoboDraft = window.ObojoboDraft;

	OboSelectionRect = __webpack_require__(17);

	DOMSelection = __webpack_require__(5);

	VirtualSelection = __webpack_require__(32);

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

/***/ },
/* 78 */
/***/ function(module, exports) {

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

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObjectAssign, StyleableText, TextGroup, TextGroupItem, Util, addChildToGroup, createChild, getItemsArray, removeAllChildrenFromGroup, removeChildFromGroup, setChildToGroup;

	StyleableText = __webpack_require__(6);

	Util = __webpack_require__(19);

	TextGroupItem = __webpack_require__(35);

	ObjectAssign = __webpack_require__(12);

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
/* 80 */
/***/ function(module, exports) {

	'use strict';

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
	  var diff;
	  if (console._times[s] != null) {
	    diff = performance.now() - console._times[s].start;
	    console._times[s].count++;
	    console._times[s].time += diff;
	    console._times[s].avg = (console._times[s].time / console._times[s].count).toFixed(3);
	  }
	  clearTimeout(console._interval);
	  return console._interval = setTimeout(console.showTimeAverages, 1000);
	};

	console.showTimeAverages = function () {
	  var byTime, i, len, o, s;
	  byTime = [];
	  for (s in console._times) {
	    byTime.push({
	      s: s,
	      avg: console._times[s].avg
	    });
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
	  for (i = 0, len = byTime.length; i < len; i++) {
	    o = byTime[i];
	    console._log('%c' + o.avg + ': ' + o.s, 'color: blue;');
	    return;
	  }
	};

/***/ },
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 95 */
94,
/* 96 */
94,
/* 97 */
94,
/* 98 */
94,
/* 99 */
94,
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
/* 112 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_10' data-name='Layer 10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20.48 20.48'%3E %3Cdefs%3E %3Cstyle%3E .cls-1 %7B fill: %236714bd; %7D %3C/style%3E %3C/defs%3E %3Ctitle%3Etoolbar-icons%3C/title%3E %3Cg%3E %3Crect class='cls-1' x='15.15' y='4.57' width='5.75' height='18.82' rx='1.13' ry='1.13' transform='translate(9.4 -14.41) rotate(45)'/%3E %3Cpath class='cls-1' d='M11.06,25l-5.3,1.23L7,20.94a1.12,1.12,0,0,1,1.59,0l2.47,2.47A1.13,1.13,0,0,1,11.06,25Z' transform='translate(-5.76 -5.76)'/%3E %3C/g%3E %3C/svg%3E"

/***/ },
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
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BaseCommandHandler,
	    FocusableCommandHandler,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	BaseCommandHandler = __webpack_require__(44);

	module.exports = FocusableCommandHandler = function (superClass) {
	  extend(FocusableCommandHandler, superClass);

	  function FocusableCommandHandler() {
	    return FocusableCommandHandler.__super__.constructor.apply(this, arguments);
	  }

	  FocusableCommandHandler.prototype.deleteText = function (selection, chunk, deleteForwards) {
	    chunk.revert();
	    return chunk.selectAll();
	  };

	  return FocusableCommandHandler;
	}(BaseCommandHandler);

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var HEIGHT, MENU_OPEN_DURATION_MS, ObojoboDraft, SideMenuList, WIDTH;

	__webpack_require__(207);

	ObojoboDraft = window.ObojoboDraft;

	WIDTH = 30;

	HEIGHT = 30;

	MENU_OPEN_DURATION_MS = 100;

	SideMenuList = React.createClass({
	  displayName: "SideMenuList",

	  getInitialState: function getInitialState() {
	    return {
	      open: false,
	      hoveredLabel: null
	    };
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      enabled: true
	    };
	  },
	  open: function open() {
	    clearTimeout(this.timeoutId);
	    return this.setState({
	      open: true
	    });
	  },
	  close: function close() {
	    return this.timeoutId = setTimeout(function () {
	      return this.setState({
	        open: false,
	        hoveredLabel: null
	      });
	    }.bind(this), MENU_OPEN_DURATION_MS);
	  },
	  onMouseDown: function onMouseDown(componentClass) {
	    this.close();
	    return this.props.onMouseDown(componentClass);
	  },
	  setHoveredLabel: function setHoveredLabel(label) {
	    return this.setState({
	      hoveredLabel: label
	    });
	  },
	  render: function render() {
	    var children, isOpen, onMouseDown, self, setHoveredLabel;
	    if (!this.props.enabled) {
	      return null;
	    }
	    onMouseDown = this.onMouseDown;
	    children = [];
	    self = this;
	    setHoveredLabel = this.setHoveredLabel;
	    isOpen = this.props.alwaysOpen || this.state.open;
	    this.props.insertItems.forEach(function (insert, chunkType) {
	      var componentClass, mouseDown, styles;
	      componentClass = OBO.componentClassMap.getClassForType(chunkType);
	      mouseDown = function mouseDown(event) {
	        event.preventDefault();
	        return self.onMouseDown.bind(self, componentClass)();
	      };
	      styles = {
	        backgroundImage: ObojoboDraft.util.getBackgroundImage(insert.icon)
	      };
	      return children.push(React.createElement(
	        "div",
	        { className: "side-menu-button",
	          ref: "_" + insert.label,
	          key: chunkType
	        },
	        React.createElement(
	          "span",
	          { className: "label-container" },
	          React.createElement(
	            "span",
	            { className: "label" },
	            insert.label
	          )
	        ),
	        React.createElement(
	          "button",
	          {
	            onMouseOver: setHoveredLabel.bind(null, insert.label),
	            onMouseOut: setHoveredLabel.bind(null, null),
	            onMouseDown: mouseDown,
	            style: styles
	          },
	          insert.label
	        )
	      ));
	    });
	    return React.createElement(
	      "div",
	      {
	        className: 'editor--components--side-menu--side-menu-list' + (isOpen ? ' open' : ''),
	        onMouseOver: this.open,
	        onMouseOut: this.close,
	        style: { top: this.props.yPos + 'px' }
	      },
	      this.props.alwaysOpen ? null : React.createElement("div", { className: "insert-button" }),
	      React.createElement(
	        "div",
	        { ref: "insertList", className: "insert-list", style: { display: isOpen ? 'inline-block' : 'none' } },
	        children
	      )
	    );
	  }
	});

	module.exports = SideMenuList;

/***/ },
/* 129 */
/***/ function(module, exports) {

	module.exports = function atoa (a, n) { return Array.prototype.slice.call(a, n); }


/***/ },
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(134);

	window.Editor = __webpack_require__(156);

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk, ChunkUtil, OBO, ObojoboDraft, StyleType, TOOLBAR_BOLD, TOOLBAR_INDENT, TOOLBAR_INSERT, TOOLBAR_ITALIC, TOOLBAR_LINK, TOOLBAR_SUB, TOOLBAR_SUP, TOOLBAR_UNINDENT;

	TOOLBAR_BOLD = __webpack_require__(226);

	TOOLBAR_ITALIC = __webpack_require__(229);

	TOOLBAR_INDENT = __webpack_require__(227);

	TOOLBAR_INSERT = __webpack_require__(228);

	TOOLBAR_UNINDENT = __webpack_require__(233);

	TOOLBAR_SUB = __webpack_require__(231);

	TOOLBAR_SUP = __webpack_require__(232);

	TOOLBAR_LINK = __webpack_require__(230);

	OBO = window.OBO;

	ObojoboDraft = window.ObojoboDraft;

	StyleType = ObojoboDraft.text.StyleType;

	ChunkUtil = ObojoboDraft.chunk.util.ChunkUtil;

	Chunk = ObojoboDraft.models.Chunk;

	OBO.registerToolbarItem({
	  id: 'boldText',
	  type: 'toggle',
	  label: 'Bold text',
	  icon: TOOLBAR_BOLD,
	  state: 'off',
	  onClick: function onClick(toolbarItem, editorState, selection) {
	    return ChunkUtil.activateStyle(StyleType.BOLD, selection, editorState.styleBrush);
	  },
	  onSelectionUpdate: function onSelectionUpdate(toolbarItem, editorState, selection) {
	    var boldBrushState, boldState;
	    boldBrushState = editorState.styleBrush.getStyleState(StyleType.BOLD);
	    boldState = boldBrushState === 'apply' || boldBrushState !== 'remove' && selection.styles[StyleType.BOLD];
	    return toolbarItem.state = boldState ? 'on' : 'off';
	  }
	}).registerToolbarItem({
	  id: 'italicText',
	  type: 'toggle',
	  label: 'Italicize text',
	  icon: TOOLBAR_ITALIC,
	  state: 'off',
	  onClick: function onClick(toolbarItem, editorState, selection) {
	    return ChunkUtil.activateStyle(StyleType.ITALIC, selection, editorState.styleBrush);
	  },
	  onSelectionUpdate: function onSelectionUpdate(toolbarItem, editorState, selection) {
	    var italicBrushState, italicState;
	    italicBrushState = editorState.styleBrush.getStyleState(StyleType.ITALIC);
	    italicState = italicBrushState === 'apply' || italicBrushState !== 'remove' && selection.styles[StyleType.ITALIC];
	    return toolbarItem.state = italicState ? 'on' : 'off';
	  }
	}).registerToolbarItem({
	  id: 'link',
	  type: 'toggle',
	  label: 'Link',
	  icon: TOOLBAR_LINK,
	  state: 'off',
	  onClick: function onClick(toolbarItem, editorState, selection) {
	    var url;
	    url = prompt('url?');
	    return ChunkUtil.activateStyle(StyleType.LINK, selection, editorState.styleBrush, {
	      href: url
	    });
	  },
	  onSelectionUpdate: function onSelectionUpdate(toolbarItem, editorState, selection) {
	    var brushState, state;
	    brushState = editorState.styleBrush.getStyleState(StyleType.LINK);
	    state = brushState === 'apply' || brushState !== 'remove' && selection.styles[StyleType.LINK];
	    return toolbarItem.state = state ? 'on' : 'off';
	  }
	}).registerToolbarItem({
	  id: 'unindent',
	  type: 'button',
	  label: 'Unindent',
	  icon: TOOLBAR_UNINDENT,
	  onClick: function onClick(toolbarItem, editorState, selection) {
	    return ChunkUtil.send('indent', selection.virtual.all, selection, [true]);
	  }
	}).registerToolbarItem({
	  id: 'indent',
	  type: 'button',
	  label: 'Indent',
	  icon: TOOLBAR_INDENT,
	  onClick: function onClick(toolbarItem, editorState, selection) {
	    return ChunkUtil.send('indent', selection.virtual.all, selection, [false]);
	  }
	}).registerToolbarItem({
	  id: 'subscriptText',
	  type: 'button',
	  label: 'Subscript Text',
	  icon: TOOLBAR_SUB,
	  onClick: function onClick(toolbarItem, editorState, selection) {
	    return ChunkUtil.send('styleSelection', selection.virtual.all, selection, [StyleType.SUPERSCRIPT, -1]);
	  }
	}).registerToolbarItem({
	  id: 'superscriptText',
	  type: 'button',
	  label: 'Superscript Text',
	  icon: TOOLBAR_SUP,
	  onClick: function onClick(toolbarItem, editorState, selection) {
	    return ChunkUtil.send('styleSelection', selection.virtual.all, selection, [StyleType.SUPERSCRIPT, 1]);
	  }
	});

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BaseCommandHandler,
	    FocusableCommandHandler,
	    ToggleCommandHandler,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	BaseCommandHandler = __webpack_require__(44);

	FocusableCommandHandler = __webpack_require__(127);

	ToggleCommandHandler = function (superClass) {
	  extend(ToggleCommandHandler, superClass);

	  function ToggleCommandHandler(textCommandHandler, focusCommandHandler) {
	    this.textCommandHandler = textCommandHandler;
	    this.focusCommandHandler = focusCommandHandler != null ? focusCommandHandler : new FocusableCommandHandler();
	  }

	  ToggleCommandHandler.prototype.canMergeWith = function () {
	    return this.textCommandHandler.canMergeWith.apply(this, arguments);
	  };

	  ToggleCommandHandler.prototype.merge = function () {
	    return this.textCommandHandler.merge.apply(this, arguments);
	  };

	  ToggleCommandHandler.prototype.acceptAbsorb = function () {
	    return this.textCommandHandler.acceptAbsorb.apply(this, arguments);
	  };

	  ToggleCommandHandler.prototype.absorb = function () {
	    return this.textCommandHandler.absorb.apply(this, arguments);
	  };

	  ToggleCommandHandler.prototype.getTextMenuCommands = function () {
	    return this.textCommandHandler.getTextMenuCommands.apply(this, arguments);
	  };

	  ToggleCommandHandler.prototype.styleSelection = function () {
	    return this.textCommandHandler.styleSelection.apply(this, arguments);
	  };

	  ToggleCommandHandler.prototype.unstyleSelection = function () {
	    return this.textCommandHandler.unstyleSelection.apply(this, arguments);
	  };

	  ToggleCommandHandler.prototype.getSelectionStyles = function () {
	    return this.textCommandHandler.getSelectionStyles.apply(this, arguments);
	  };

	  ToggleCommandHandler.prototype.getCaretEdge = function (selection, chunk) {
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.getCaretEdge.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.getCaretEdge.apply(this, arguments);
	    }
	  };

	  ToggleCommandHandler.prototype.canRemoveSibling = function (selection, chunk) {
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.canRemoveSibling.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.canRemoveSibling.apply(this, arguments);
	    }
	  };

	  ToggleCommandHandler.prototype.insertText = function (selection, chunk, textToInsert, stylesToApply, stylesToRemove) {
	    if (stylesToApply == null) {
	      stylesToApply = null;
	    }
	    if (stylesToRemove == null) {
	      stylesToRemove = null;
	    }
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.insertText.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.insertText.apply(this, arguments);
	    }
	  };

	  ToggleCommandHandler.prototype.deleteText = function (selection, chunk, deleteForwards) {
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.deleteText.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.deleteText.apply(this, arguments);
	    }
	  };

	  ToggleCommandHandler.prototype.onEnter = function (selection, chunk, shiftKey) {
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.onEnter.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.onEnter.apply(this, arguments);
	    }
	  };

	  ToggleCommandHandler.prototype.splitText = function (selection, chunk) {
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.splitText.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.splitText.apply(this, arguments);
	    }
	  };

	  ToggleCommandHandler.prototype.deleteSelection = function (selection, chunk) {
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.deleteSelection.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.deleteSelection.apply(this, arguments);
	    }
	  };

	  ToggleCommandHandler.prototype.onTab = function (selection, chunk, untab) {
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.onTab.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.onTab.apply(this, arguments);
	    }
	  };

	  ToggleCommandHandler.prototype.split = function (selection, chunk) {
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.split.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.split.apply(this, arguments);
	    }
	  };

	  ToggleCommandHandler.prototype.getDOMStateBeforeInput = function (selection, chunk) {
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.getDOMStateBeforeInput.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.getDOMStateBeforeInput.apply(this, arguments);
	    }
	  };

	  ToggleCommandHandler.prototype.getDOMModificationAfterInput = function (selection, chunk, domStateBefore) {
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.getDOMModificationAfterInput.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.getDOMModificationAfterInput.apply(this, arguments);
	    }
	  };

	  ToggleCommandHandler.prototype.applyDOMModification = function (selection, chunk, domModifications) {
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.applyDOMModification.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.applyDOMModification.apply(this, arguments);
	    }
	  };

	  ToggleCommandHandler.prototype.onSelectAll = function (selection, chunk) {
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.onSelectAll.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.onSelectAll.apply(this, arguments);
	    }
	  };

	  ToggleCommandHandler.prototype.paste = function (selection, chunk, text, html) {
	    if (chunk.isEditing()) {
	      return this.textCommandHandler.paste.apply(this, arguments);
	    } else {
	      return this.focusCommandHandler.paste.apply(this, arguments);
	    }
	  };

	  return ToggleCommandHandler;
	}(BaseCommandHandler);

	module.exports = ToggleCommandHandler;

/***/ },
/* 136 */
/***/ function(module, exports) {

	'use strict';

	var ChunkUtil, InputHandler, Keyboard, ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	ChunkUtil = ObojoboDraft.chunk.util.ChunkUtil;

	Keyboard = ObojoboDraft.page.Keyboard;

	module.exports = InputHandler = function () {
	  function InputHandler() {}

	  InputHandler.prototype.send = function (fn, chunkOrChunks, data) {
	    return ChunkUtil.send(fn, chunkOrChunks, this.props.selection, data);
	  };

	  InputHandler.prototype.onKeyDown = function (event, selection, styleBrush) {
	    var caretEdge, chunk, deleteForwards, deleteSuccessful, metaOrCtrlKeyHeld, next, page, prev, selectAllWasHandled;
	    metaOrCtrlKeyHeld = event.metaKey || event.ctrlKey;
	    switch (event.keyCode) {
	      case Keyboard.BACKSPACE:
	      case Keyboard.DELETE:
	        event.preventDefault();
	        if (selection.virtual.type === 'caret') {
	          caretEdge = ChunkUtil.send('getCaretEdge', selection.startChunk, selection);
	          deleteForwards = event.keyCode === Keyboard.DELETE;
	          chunk = selection.startChunk;
	          prev = chunk.prevSibling();
	          next = chunk.nextSibling();
	          deleteSuccessful = ChunkUtil.send('deleteText', chunk, selection, [deleteForwards]);
	          if (!deleteSuccessful) {
	            switch (false) {
	              case !((caretEdge === 'start' || caretEdge === 'startAndEnd') && !deleteForwards && prev != null):
	                if (prev.isEmpty()) {
	                  prev.replaceWith(chunk);
	                  return true;
	                }
	                if (ChunkUtil.send('canMergeWith', chunk, selection, [prev]) && ChunkUtil.send('canMergeWith', prev, selection, [chunk])) {
	                  ChunkUtil.send('merge', prev, selection, [chunk]);
	                } else if (ChunkUtil.send('canRemoveSibling', chunk, selection, [prev])) {
	                  prev.remove();
	                }
	                break;
	              case !((caretEdge === 'end' || caretEdge === 'startAndEnd') && deleteForwards && next != null):
	                if (ChunkUtil.send('canMergeWith', chunk, selection, [next]) && ChunkUtil.send('canMergeWith', next, selection, [chunk])) {
	                  ChunkUtil.send('merge', chunk, selection, [next]);
	                } else if (ChunkUtil.send('canRemoveSibling', chunk, selection, [next])) {
	                  next.remove();
	                }
	            }
	          }
	        } else {
	          ChunkUtil.deleteSelection(selection);
	        }
	        return true;
	      case Keyboard.TAB:
	        event.preventDefault();
	        ChunkUtil.send('onTab', selection.virtual.all, selection, [event.shiftKey]);
	        return true;
	      case Keyboard.ENTER:
	        event.preventDefault();
	        ChunkUtil.deleteSelection(selection);
	        selection.startChunk.onEnter(event.shiftKey);
	        return true;
	      case Keyboard.LEFT_ARROW:
	      case Keyboard.RIGHT_ARROW:
	      case Keyboard.UP_ARROW:
	      case Keyboard.DOWN_ARROW:
	        if (!styleBrush.isClean) {
	          styleBrush.clean();
	          return true;
	        }
	    }
	    if (metaOrCtrlKeyHeld) {
	      switch (event.keyCode) {
	        case 66:
	          event.preventDefault();
	          ChunkUtil.activateStyle('b', selection, styleBrush);
	          return true;
	        case 73:
	          event.preventDefault();
	          ChunkUtil.activateStyle('i', selection, styleBrush);
	          return true;
	        case 65:
	          if (selection.virtual.type !== 'chunkSpan') {
	            selectAllWasHandled = ChunkUtil.send('onSelectAll', selection.startChunk, selection);
	            event.preventDefault();
	            if (!selectAllWasHandled) {
	              page = selection.startChunk.page;
	              page.chunks.first().selectStart(true);
	              page.chunks.last().selectEnd(true);
	            }
	            return true;
	          }
	      }
	    }
	    return false;
	  };

	  return InputHandler;
	}();

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BaseCommandHandler,
	    Chunk,
	    HtmlUtil,
	    ObojoboDraft,
	    StyleableText,
	    TEXTMENU_BOLD,
	    TEXTMENU_ITALIC,
	    TEXTMENU_LINK,
	    TEXTMENU_SUB,
	    TEXTMENU_SUP,
	    TextGroup,
	    TextGroupCommandHandler,
	    TextGroupEl,
	    TextGroupSelection,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	BaseCommandHandler = __webpack_require__(44);

	ObojoboDraft = window.ObojoboDraft;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	Chunk = ObojoboDraft.models.Chunk;

	StyleableText = ObojoboDraft.text.StyleableText;

	HtmlUtil = ObojoboDraft.util.HtmlUtil;

	TEXTMENU_BOLD = __webpack_require__(235);

	TEXTMENU_ITALIC = __webpack_require__(236);

	TEXTMENU_LINK = __webpack_require__(237);

	TEXTMENU_SUB = __webpack_require__(238);

	TEXTMENU_SUP = __webpack_require__(239);

	TextGroupCommandHandler = function (superClass) {
	  extend(TextGroupCommandHandler, superClass);

	  function TextGroupCommandHandler() {
	    return TextGroupCommandHandler.__super__.constructor.apply(this, arguments);
	  }

	  TextGroupCommandHandler.prototype.getCaretEdge = function (selection, chunk) {
	    var data, s, tgs;
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    data = chunk.componentContent;
	    s = tgs.start;
	    switch (false) {
	      case !(s === null || s.text == null):
	        return 'none';
	      case !(s.isGroupStart && s.isGroupEnd):
	        return 'startAndEnd';
	      case !s.isGroupStart:
	        return 'start';
	      case !s.isGroupEnd:
	        return 'end';
	      default:
	        return 'none';
	    }
	  };

	  TextGroupCommandHandler.prototype.isEmpty = function (selection, chunk) {
	    return chunk.componentContent.textGroup.isBlank;
	  };

	  TextGroupCommandHandler.prototype.canRemoveSibling = function (selection, chunk) {
	    return true;
	  };

	  TextGroupCommandHandler.prototype.insertText = function (selection, chunk, textToInsert, stylesToApply, stylesToRemove) {
	    var j, k, len, len1, sel, style;
	    if (stylesToApply == null) {
	      stylesToApply = null;
	    }
	    if (stylesToRemove == null) {
	      stylesToRemove = null;
	    }
	    chunk.markDirty();
	    console.time('insertText');
	    sel = new TextGroupSelection(chunk, selection.virtual);
	    if (sel.start.text == null) {
	      return;
	    }
	    sel.start.text.insertText(sel.start.offset, textToInsert);
	    if (stylesToApply != null) {
	      for (j = 0, len = stylesToApply.length; j < len; j++) {
	        style = stylesToApply[j];
	        sel.start.text.styleText(style, sel.start.offset, sel.start.offset + textToInsert.length);
	      }
	    }
	    if (stylesToRemove != null) {
	      for (k = 0, len1 = stylesToRemove.length; k < len1; k++) {
	        style = stylesToRemove[k];
	        sel.start.text.unstyleText(style, sel.start.offset, sel.start.offset + textToInsert.length);
	      }
	    }
	    selection.virtual.start.data.offset += textToInsert.length;
	    selection.virtual.collapse();
	    return console.timeEnd('insertText');
	  };

	  TextGroupCommandHandler.prototype.deleteText = function (selection, chunk, deleteForwards) {
	    var data, end, nextSibling, ref, s, start, tg, tgs;
	    chunk.markDirty();
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    data = chunk.componentContent;
	    if (tgs.start.text == null) {
	      return;
	    }
	    s = tgs.start;
	    tg = data.textGroup;
	    if (!deleteForwards && s.isGroupStart) {
	      if (data.indent != null && ~~data.indent > 0) {
	        data.indent--;
	        return true;
	      }
	      if (tg.isBlank && chunk.prevSibling() != null) {
	        chunk.prevSibling().selectEnd();
	        chunk.remove();
	        return true;
	      }
	      return false;
	    }
	    if (deleteForwards && s.isGroupEnd) {
	      if (tg.isBlank) {
	        nextSibling = chunk.nextSibling();
	        chunk.remove();
	        nextSibling.selectStart();
	        return true;
	      }
	      return false;
	    }
	    if (!deleteForwards && s.isTextStart && !s.isFirstText) {
	      tgs.setCaretToTextEnd(s.groupIndex - 1);
	      tg.merge(s.groupIndex - 1);
	      return true;
	    }
	    if (deleteForwards && s.isTextEnd && !s.isLastText && tg.length > 1) {
	      tg.merge(s.groupIndex);
	      return true;
	    }
	    ref = !deleteForwards ? [s.offset - 1, s.offset] : [s.offset, s.offset + 1], start = ref[0], end = ref[1];
	    tgs.start.text.deleteText(start, end);
	    tgs.setCaret(tgs.start.groupIndex, start);
	    return true;
	  };

	  TextGroupCommandHandler.prototype.onEnter = function (selection, chunk, shiftKey) {
	    return chunk.splitText();
	  };

	  TextGroupCommandHandler.prototype.splitText = function (selection, chunk) {
	    var textGroup, tgs;
	    chunk.markDirty();
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    if (tgs.start.text == null) {
	      return;
	    }
	    textGroup = chunk.componentContent.textGroup;
	    textGroup.splitText(tgs.start.groupIndex, tgs.start.offset);
	    return tgs.setCaretToTextStart(tgs.start.groupIndex + 1);
	  };

	  TextGroupCommandHandler.prototype.deleteSelection = function (selection, chunk) {
	    var pos, tg, tgs;
	    chunk.markDirty();
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    tg = chunk.componentContent.textGroup;
	    tg.deleteSpan(tgs.start.groupIndex, tgs.start.offset, tgs.end.groupIndex, tgs.end.offset, true, this.mergeTextGroups);
	    pos = selection.virtual.getPosition(chunk);
	    switch (pos) {
	      case 'start':
	      case 'contains':
	        return selection.virtual.collapse();
	      case 'end':
	        return selection.virtual.end = TextGroupSelection.getGroupStartCursor(chunk).virtualCursor;
	    }
	  };

	  TextGroupCommandHandler.prototype.styleSelection = function (selection, chunk, styleType, styleData) {
	    var sel;
	    chunk.markDirty();
	    sel = new TextGroupSelection(chunk, selection.virtual);
	    return chunk.componentContent.textGroup.styleText(sel.start.groupIndex, sel.start.offset, sel.end.groupIndex, sel.end.offset, styleType, styleData);
	  };

	  TextGroupCommandHandler.prototype.unstyleSelection = function (selection, chunk, styleType, styleData) {
	    var data, sel;
	    chunk.markDirty();
	    sel = new TextGroupSelection(chunk, selection.virtual);
	    data = chunk.componentContent;
	    return data.textGroup.unstyleText(sel.start.groupIndex, sel.start.offset, sel.end.groupIndex, sel.end.offset, styleType, styleData);
	  };

	  TextGroupCommandHandler.prototype.getSelectionStyles = function (selection, chunk) {
	    var data, sel;
	    sel = new TextGroupSelection(chunk, selection.virtual);
	    data = chunk.componentContent;
	    if (sel.start == null || sel.end == null) {
	      return {};
	    }
	    return data.textGroup.getStyles(sel.start.groupIndex, sel.start.offset, sel.end.groupIndex, sel.end.offset);
	  };

	  TextGroupCommandHandler.prototype.canMergeWith = function (selection, chunk, otherChunk) {
	    return chunk.componentContent.textGroup != null && otherChunk.componentContent.textGroup != null && chunk !== otherChunk;
	  };

	  TextGroupCommandHandler.prototype.merge = function (selection, consumerChunk, digestedChunk, mergeText) {
	    var consumerData, digestedData, i, item, oldIndex, oldTextLength;
	    if (mergeText == null) {
	      mergeText = true;
	    }
	    consumerChunk.markDirty();
	    consumerData = consumerChunk.componentContent;
	    digestedData = digestedChunk.componentContent;
	    if (digestedData.textGroup == null) {
	      digestedChunk.remove();
	      return;
	    }
	    if (consumerData.textGroup.isEmpty) {
	      oldTextLength = 0;
	    } else {
	      oldTextLength = consumerData.textGroup.last.text.length;
	    }
	    oldIndex = consumerData.textGroup.length - 1;
	    if (mergeText) {
	      consumerData.textGroup.last.text.merge(digestedData.textGroup.first.text);
	      digestedData.textGroup.remove(0);
	    }
	    i = 0;
	    while (!consumerData.textGroup.isFull && digestedData.textGroup.length > 0) {
	      item = digestedData.textGroup.first;
	      consumerData.textGroup.add(item.text, item.data);
	      digestedData.textGroup.remove(0);
	    }
	    if (digestedData.textGroup.length === 0) {
	      digestedChunk.remove();
	    }
	    return selection.virtual.setCaret(consumerChunk, {
	      groupIndex: oldIndex,
	      offset: oldTextLength
	    });
	  };

	  TextGroupCommandHandler.prototype.indent = function (selection, chunk, decreaseIndent) {
	    var all, data, j, len, results, textItem, tgs;
	    chunk.markDirty();
	    data = chunk.componentContent;
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    if (tgs.end.isFirstText) {
	      all = data.textGroup.items;
	    } else {
	      all = tgs.getAllSelectedTexts();
	    }
	    results = [];
	    for (j = 0, len = all.length; j < len; j++) {
	      textItem = all[j];
	      if (textItem.data.indent != null && !isNaN(textItem.data.indent)) {
	        if (!decreaseIndent) {
	          results.push(textItem.data.indent++);
	        } else if (textItem.data.indent > 0) {
	          results.push(textItem.data.indent--);
	        } else {
	          results.push(void 0);
	        }
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
	  };

	  TextGroupCommandHandler.prototype.onTab = function (selection, chunk, untab) {
	    var sel;
	    sel = new TextGroupSelection(chunk, selection.virtual);
	    if (sel.type === 'caret' && !sel.start.isTextStart) {
	      return chunk.insertText("\t");
	    }
	    return chunk.indent(untab);
	  };

	  TextGroupCommandHandler.prototype._insertTextGroup = function (selection, chunk, textGroup) {
	    var ctg, groupIndex, offset, ptg, tgs;
	    console.log('INSERT TEXT GROUP', arguments);
	    chunk.markDirty();
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    console.log('tgs', tgs.start);
	    ctg = tgs.start.textGroup;
	    ptg = textGroup;
	    groupIndex = tgs.start.groupIndex;
	    offset = tgs.start.offset;
	    chunk.splitText();
	    ctg.addGroupAt(ptg, groupIndex + 1);
	    ctg.merge(groupIndex + ptg.length);
	    ctg.merge(groupIndex);
	    if (ptg.length === 1) {
	      offset += ptg.last.text.length;
	    } else {
	      offset = ptg.last.text.length;
	    }
	    console.log('selvirt', offset, selection.virtual.toObject());
	    selection.virtual.start.data.offset = offset;
	    selection.virtual.start.data.groupIndex = groupIndex + ptg.length - 1;
	    selection.virtual.start.chunk = chunk;
	    selection.virtual.collapse();
	    return console.log('selvirt', offset, selection.virtual.toObject());
	  };

	  TextGroupCommandHandler.prototype.paste = function (selection, chunk, text, html, chunks) {
	    var caret, el, j, k, lastPastedChunk, len, len1, pastedChunk, ptg, splitChunks, st, sts;
	    console.log('paste', arguments);
	    switch (chunks.length) {
	      case 0:
	        if ((html != null ? html.length : void 0) > 0) {
	          el = document.createElement('div');
	          el.innerHTML = html;
	          el = HtmlUtil.sanitize(el);
	          document.body.appendChild(el);
	          sts = StyleableText.createFromElement(el);
	          if (sts.length === 0) {
	            return false;
	          }
	          ptg = TextGroup.create(2e308, {}, 0);
	          for (j = 0, len = sts.length; j < len; j++) {
	            st = sts[j];
	            ptg.add(st);
	          }
	          this._insertTextGroup(selection, chunk, ptg);
	          document.body.removeChild(el);
	          return true;
	        }
	        break;
	      case 1:
	        if (!chunk.canMergeWith(chunks[0]) || !chunks[0].canMergeWith(chunk)) {
	          return false;
	        }
	        this._insertTextGroup(selection, chunk, chunks[0].componentContent.textGroup);
	        return true;
	      default:
	        chunk.markDirty();
	        caret = selection.virtual.start.clone();
	        splitChunks = chunk.split();
	        for (k = 0, len1 = chunks.length; k < len1; k++) {
	          pastedChunk = chunks[k];
	          chunk.addChildBefore(pastedChunk);
	        }
	        if (splitChunks.prev != null && splitChunks.prev.canMergeWith(chunks[0]) && chunks[0].canMergeWith(splitChunks.prev)) {
	          splitChunks.prev.selectEnd();
	          splitChunks.prev.merge(chunks[0]);
	        }
	        lastPastedChunk = chunks[chunks.length - 1];
	        if (splitChunks.next != null && lastPastedChunk.canMergeWith(splitChunks.next) && splitChunks.next.canMergeWith(lastPastedChunk)) {
	          lastPastedChunk.selectEnd();
	          lastPastedChunk.merge(splitChunks.next);
	        } else {
	          lastPastedChunk.selectEnd();
	        }
	        chunk.remove();
	        return true;
	    }
	    return false;
	  };

	  TextGroupCommandHandler.prototype.acceptAbsorb = function (selection, chunkToBeDigested, consumerChunk) {
	    return chunkToBeDigested.componentContent.textGroup != null && consumerChunk.componentContent.textGroup != null && chunkToBeDigested !== consumerChunk;
	  };

	  TextGroupCommandHandler.prototype.absorb = function (selection, consumerChunk, digestedChunk) {
	    var digestedTextGroup, item, textGroup;
	    if (!digestedChunk.acceptAbsorb(consumerChunk)) {
	      digestedChunk.remove();
	      consumerChunk.selectAll();
	      return;
	    }
	    consumerChunk.markDirty();
	    textGroup = consumerChunk.componentContent.textGroup;
	    digestedTextGroup = digestedChunk.componentContent.textGroup;
	    textGroup.clear();
	    while (!digestedTextGroup.isEmpty) {
	      if (!textGroup.isFull) {
	        item = digestedTextGroup.remove(0);
	        textGroup.add(item.text, item.data);
	      } else {
	        item = digestedTextGroup.remove(0);
	        item.text.insertText(0, ' ');
	        textGroup.last.text.merge(item.text);
	      }
	    }
	    digestedChunk.remove();
	    return textGroup.fill();
	  };

	  TextGroupCommandHandler.prototype.split = function (selection, chunk) {
	    var allTextSelected, bottom, btg, data, endGroupIndex, endOffset, middle, mtg, result, sel, startGroupIndex, startOffset, top, ttg;
	    chunk.markDirty();
	    result = {
	      prev: null,
	      next: null
	    };
	    sel = new TextGroupSelection(chunk, selection.virtual);
	    startOffset = sel.start.offset;
	    startGroupIndex = sel.start.groupIndex;
	    endOffset = sel.end.offset;
	    endGroupIndex = sel.end.groupIndex;
	    data = chunk.componentContent;
	    allTextSelected = sel.start.isGroupStart && sel.end.isGroupEnd;
	    if (allTextSelected) {
	      return result;
	    }
	    top = chunk.clone();
	    middle = chunk;
	    bottom = chunk.clone();
	    ttg = top.componentContent.textGroup;
	    mtg = middle.componentContent.textGroup;
	    btg = bottom.componentContent.textGroup;
	    ttg.toSlice(0, startGroupIndex + 1);
	    mtg.toSlice(startGroupIndex, endGroupIndex + 1);
	    btg.toSlice(endGroupIndex);
	    ttg.deleteSpan(ttg.length - 1, startOffset, ttg.length - 1, ttg.last.text.length, false);
	    mtg.deleteSpan(mtg.length - 1, endOffset, mtg.length - 1, mtg.last.text.length, false);
	    mtg.deleteSpan(0, 0, 0, startOffset, false);
	    btg.deleteSpan(0, 0, 0, endOffset, false);
	    if (!ttg.isBlank) {
	      middle.addChildBefore(top);
	      result.prev = top;
	      if (ttg.last.text.length === 0) {
	        ttg.remove(ttg.last.index);
	      }
	    }
	    if (!btg.isBlank) {
	      middle.addChildAfter(bottom);
	      result.next = bottom;
	      if (btg.first.text.length === 0) {
	        btg.remove(0);
	      }
	    }
	    if (mtg.isEmpty) {
	      middle.revert();
	    }
	    middle.selectAll();
	    return result;
	  };

	  TextGroupCommandHandler.prototype.getDOMStateBeforeInput = function (selection, chunk) {
	    var tgs;
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    return {
	      charsFromStart: tgs.start.offset,
	      charsFromEnd: tgs.start.text.length - tgs.end.offset
	    };
	  };

	  TextGroupCommandHandler.prototype.getDOMModificationAfterInput = function (selection, chunk, domStateBefore) {
	    var el, newText;
	    el = TextGroupEl.getTextElementAtCursor(selection.virtual.start);
	    newText = el.textContent;
	    return {
	      text: newText.substring(domStateBefore.charsFromStart, newText.length - domStateBefore.charsFromEnd)
	    };
	  };

	  TextGroupCommandHandler.prototype.applyDOMModification = function (selection, chunk, domModifications) {
	    chunk.deleteSelection();
	    return chunk.insertText(domModifications.text);
	  };

	  TextGroupCommandHandler.prototype.getTextMenuCommands = function (selection, chunk) {
	    return [{
	      label: 'Bold',
	      image: TEXTMENU_BOLD,
	      fn: function fn(selection, chunk) {
	        if (selection.styles['b']) {
	          return chunk.unstyleSelection('b');
	        } else {
	          return chunk.styleSelection('b');
	        }
	      }
	    }, {
	      label: 'Italic',
	      image: TEXTMENU_ITALIC,
	      fn: function fn(selection, chunk) {
	        if (selection.styles['i']) {
	          return chunk.unstyleSelection('i');
	        } else {
	          return chunk.styleSelection('i');
	        }
	      }
	    }, {
	      label: 'Link...',
	      image: TEXTMENU_LINK,
	      onBeforeFn: function onBeforeFn() {
	        return {
	          href: prompt('Href?')
	        };
	      },
	      fn: function fn(selection, chunk, data) {
	        if ((data != null ? data.href : void 0) == null) {
	          return;
	        }
	        return chunk.styleSelection('a', {
	          href: data.href
	        });
	      }
	    }];
	  };

	  return TextGroupCommandHandler;
	}(BaseCommandHandler);

	module.exports = TextGroupCommandHandler;

/***/ },
/* 138 */
/***/ function(module, exports) {

	'use strict';

	var ChunkOptionsMenu, HEIGHT, MARGIN, WIDTH;

	MARGIN = 5;

	WIDTH = 30;

	HEIGHT = 30;

	ChunkOptionsMenu = React.createClass({
	  displayName: 'ChunkOptionsMenu',

	  getInitialState: function getInitialState() {
	    return {
	      chunkRect: this.props.selection.chunkRect
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    return this.setState({
	      chunkRect: nextProps.selection.chunkRect
	    });
	  },
	  onClick: function onClick(event) {
	    return this.props.handlerFn('clickah');
	  },
	  render: function render() {
	    var rect, ref;
	    rect = this.state.chunkRect;
	    if (!rect || ((ref = rect.chunks) != null ? ref.length : void 0) > 1) {
	      return null;
	    }
	    return React.createElement('button', {
	      onClick: this.onClick,
	      style: {
	        position: 'absolute',
	        zIndex: 1,
	        right: 0,
	        width: WIDTH,
	        height: HEIGHT,
	        top: rect.top + window.scrollY
	      }
	    }, 'Opts');
	  }
	});

	module.exports = ChunkOptionsMenu;

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DOMSelection, DebugMenu;

	DOMSelection = __webpack_require__(45).page.DOMSelection;

	DebugMenu = React.createClass({
	  displayName: 'DebugMenu',

	  getInitialState: function getInitialState() {
	    return {
	      target: null,
	      selection: null,
	      history: null,
	      listeningForKeyboard: false
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    return this.setState({
	      selection: nextProps.selection,
	      history: nextProps.history
	    });
	  },
	  show: function show(target) {
	    return this.setState({
	      target: target
	    });
	  },
	  hide: function hide(event) {
	    if (event.target === document.getElementById('debug-text')) {
	      return this.setState({
	        target: null
	      });
	    }
	  },
	  componentDidMount: function componentDidMount() {
	    return document.addEventListener('keydown', function (event) {
	      var sel;
	      if (this.state.target != null) {
	        console.log(event.keyCode);
	      }
	      if (event.keyCode === 192 && !this.state.listeningForKeyboard) {
	        event.preventDefault();
	        return this.setState({
	          awaken: true,
	          listeningForKeyboard: true
	        });
	      } else if (this.state.listeningForKeyboard) {
	        event.preventDefault();
	        this.state.listeningForKeyboard = false;
	        console.clear();
	        switch (event.keyCode) {
	          case 67:
	            if (this.state.target === 'chunk') {
	              return this.setState({
	                target: null
	              });
	            } else {
	              return this.setState({
	                target: 'chunk'
	              });
	            }
	            break;
	          case 83:
	            if (this.state.target === 'selection') {
	              return this.setState({
	                target: null
	              });
	            } else {
	              return this.setState({
	                target: 'selection'
	              });
	            }
	            break;
	          case 84:
	            if (this.state.target === 'text selection') {
	              return this.setState({
	                target: null
	              });
	            } else {
	              this.setState({
	                target: 'text selection'
	              });
	              return console.log(JSON.stringify(this.state.selection.getSelectionDescriptor(), null, 2));
	            }
	            break;
	          case 72:
	            if (this.state.target === 'history') {
	              return this.setState({
	                target: null
	              });
	            } else {
	              return this.setState({
	                target: 'history'
	              });
	            }
	            break;
	          case 77:
	            if (this.state.target === 'module') {
	              return this.setState({
	                target: null
	              });
	            } else {
	              return this.setState({
	                target: 'module'
	              });
	            }
	            break;
	          case 68:
	            sel = new DOMSelection();
	            console.log('window.start =', sel.startContainer);
	            console.log(sel.startOffset);
	            console.log('window.end =  ', sel.endContainer);
	            console.log(sel.endOffset);
	            window.start = sel.startContainer;
	            return window.end = sel.endContainer;
	        }
	      }
	    }.bind(this));
	  },
	  render: function render() {
	    var chunk, color, h, o, ref, selection, t, text;
	    if (!this.state.awaken) {
	      return null;
	    }
	    text = function () {
	      var i, j, len, len1, ref, ref1;
	      switch (this.state.target) {
	        case 'selection':
	          selection = this.state.selection;
	          o = {
	            commands: selection.commands,
	            textCommands: selection.chunkCommands,
	            styles: selection.styles,
	            futureStart: selection.futureStart,
	            futureEnd: selection.futureEnd,
	            desc: this.state.selection.getSelectionDescriptor()
	          };
	          return JSON.stringify(o, null, 2);
	        case 'text selection':
	          return JSON.stringify(this.state.selection.getSelectionDescriptor(), null, 2);
	        case 'chunk':
	          t = '';
	          ref = this.state.virtual.chunk.all;
	          for (i = 0, len = ref.length; i < len; i++) {
	            chunk = ref[i];
	            t += JSON.stringify(chunk.toJSON(), null, 2) + "\n";
	          }
	          return t;
	        case 'history':
	          h = [];
	          ref1 = this.state.history.stack;
	          for (j = 0, len1 = ref1.length; j < len1; j++) {
	            o = ref1[j];
	            h.unshift(o);
	            h.unshift('--------------------');
	          }
	          return JSON.stringify(h, null, 2);
	        case 'module':
	          return JSON.stringify(this.state.selection.virtual.module.toJSON(), null, 2);
	        default:
	          return '';
	      }
	    }.call(this);
	    color = this.state.listeningForKeyboard ? 'red' : 'black';
	    return React.createElement('div', {
	      onMouseOut: this.hide,
	      style: {
	        position: 'fixed',
	        zIndex: 99999,
	        right: 0,
	        top: 0
	      }
	    }, React.createElement('div', {
	      style: {
	        textAlign: 'right'
	      }
	    }, React.createElement('button', {
	      style: {
	        fontWeight: 'bold',
	        fontSize: '16pt',
	        color: this.state.target === 'module' ? 'green' : color
	      },
	      onMouseOver: this.show.bind(this, 'module')
	    }, 'M'), React.createElement('button', {
	      style: {
	        fontWeight: 'bold',
	        fontSize: '16pt',
	        color: this.state.target === 'selection' ? 'green' : color
	      },
	      onMouseOver: this.show.bind(this, 'selection')
	    }, 'S'), React.createElement('button', {
	      style: {
	        fontWeight: 'bold',
	        fontSize: '16pt',
	        color: this.state.target === 'text selection' ? 'green' : color
	      },
	      onMouseOver: this.show.bind(this, 'text selection')
	    }, 'T'), React.createElement('button', {
	      style: {
	        fontWeight: 'bold',
	        fontSize: '16pt',
	        color: this.state.target === 'chunk' ? 'green' : color
	      },
	      onMouseOver: this.show.bind(this, 'chunk')
	    }, 'C'), React.createElement('button', {
	      style: {
	        fontWeight: 'bold',
	        fontSize: '16pt',
	        color: this.state.target === 'history' ? 'green' : color
	      },
	      onMouseOver: this.show.bind(this, 'history')
	    }, 'H')), React.createElement('pre', {
	      id: 'debug-text',
	      style: {
	        display: text.length > 0 ? 'block' : 'none',
	        fontSize: '8pt',
	        margin: 0,
	        width: 400,
	        height: 700,
	        overflow: 'scroll',
	        border: '1px solid black',
	        background: '#fffdec'
	      }
	    }, ((ref = this.state.target) != null ? ref.toUpperCase() : void 0) + ":\n" + text.replace(/^\s*[{}]+\s*$/gm, '').replace(/\n\n+/gm, "\n").replace(/}\,/g, '')));
	  }
	});

	module.exports = DebugMenu;

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk, ChunkCollection, ChunkOptionsMenu, ChunkUtil, DOMSelection, DebugMenu, EditorApp, EditorPage, History, LoadingModal, Metadata, Modal, Module, OBO, ObojoboDraft, Page, Screen, Selection, SideMenu, SideMenuList, StyleBrush, StyleType, StylesMenu, TextMenu, Toolbar;

	__webpack_require__(202);

	Toolbar = __webpack_require__(149);

	SideMenu = __webpack_require__(145);

	ChunkOptionsMenu = __webpack_require__(138);

	StylesMenu = __webpack_require__(148);

	LoadingModal = __webpack_require__(142);

	DebugMenu = __webpack_require__(139);

	Modal = __webpack_require__(143);

	Selection = __webpack_require__(144);

	StyleBrush = __webpack_require__(147);

	EditorPage = __webpack_require__(141);

	History = __webpack_require__(155);

	SideMenuList = __webpack_require__(128);

	ObojoboDraft = window.ObojoboDraft;

	OBO = window.OBO;

	TextMenu = ObojoboDraft.components.TextMenu;

	ChunkUtil = ObojoboDraft.chunk.util.ChunkUtil;

	StyleType = ObojoboDraft.text.StyleType;

	Screen = ObojoboDraft.page.Screen;

	Module = ObojoboDraft.models.Module;

	Chunk = ObojoboDraft.models.Chunk;

	Page = ObojoboDraft.models.Page;

	Metadata = ObojoboDraft.models.Metadata;

	ChunkCollection = ObojoboDraft.models.ChunkCollection;

	DOMSelection = ObojoboDraft.selection.DOMSelection;

	EditorApp = React.createClass({
	  displayName: 'EditorApp',

	  getInitialState: function getInitialState() {
	    var i, item, len, module, ref;
	    console.log('CREATE MODULE');
	    module = this.props.module || new Module();
	    console.log(module);
	    module.app = this;
	    module.initIfNeeded();
	    module.fromDescriptor({
	      "metadata": {},
	      "pages": [{
	        "chunks": [{
	          "type": "ObojoboDraft.Chunks.Heading",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "Defining Plagiarism",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "headingLevel": 1
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 0,
	          "id": "cc3dab7a-28c7-414f-9f4c-f38d061151cc"
	        }, {
	          "type": "ObojoboDraft.Chunks.Blockquote",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "A total of 14 intersections (nine camera sites, three non-camera sites, and two control sites) were studied. Overall, the red light violation rate was reduced approximately 42% several months after the enforcement program began. Increases in driver compliance were not limited to the camera-equipped intersections but spilled over the non-equipped intersections as well. Results of public opinion surveys conducted approximately 6 weeks before, 6 weeks after, and 6 months after the camera enforcement began indicated that nearly 80% of Oxnard residents support using red light cameras as a supplement to police efforts to enforce traffic signal laws.",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }, {
	              "text": {
	                "value": "Rettig, Richard A., Allan F. Williams, Charles M. Farmer, and Amy F. Feldman. \"Evaluation of Red Light Camera Enforcement in Oxnard, California.\" Accident Analysis and Prevention 31.3 (1999): 169-74. Print.",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "type": "p"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 1,
	          "id": "fb20628e-3458-4394-88be-2bfc97ade5ac"
	        }, {
	          "type": "ObojoboDraft.Chunks.Heading",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "Academic Integrity",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "headingLevel": 2
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 2,
	          "id": "25614656-760c-4acd-aaa6-544d38a6ead6"
	        }, {
	          "type": "ObojoboDraft.Chunks.Figure",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "",
	                "styleList": [{
	                  "type": "i",
	                  "start": 0,
	                  "end": 0,
	                  "data": {}
	                }]
	              },
	              "data": {}
	            }],
	            "url": null,
	            "size": "small"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 3,
	          "id": "0852db63-aa97-4434-8b8d-838aae95fd17"
	        }, {
	          "type": "ObojoboDraft.Chunks.SingleText",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "This module is designed to help you recognize the common causes of plagiarism and show you how to avoid them.",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "type": "p"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 4,
	          "id": "91025d4d-e94d-4fbe-aa4f-c3c17707199c"
	        }, {
	          "type": "ObojoboDraft.Chunks.MathEquation",
	          "content": {
	            "latex": "y=\\sqrt{a^2+b^2}"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 5,
	          "id": "3c4ebecd-780c-4cf1-a74a-4a9f253aac85"
	        }, {
	          "type": "ObojoboDraft.Chunks.SingleText",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "The UCF Rules of Conduct, published in The Golden Rule Student Handbook 2012-2013 notes on page 16 that “In an instructional setting, plagiarism occurs when a writer deliberately uses someone else's language, ideas, or other original (not common-knowledge) material without acknowledging its source.",
	                "styleList": [{
	                  "type": "b",
	                  "start": 39,
	                  "end": 82,
	                  "data": {}
	                }]
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "type": "p"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 6,
	          "id": "1b67c32a-d665-4ac7-a2a0-b680e1d92e70"
	        }, {
	          "type": "ObojoboDraft.Chunks.Code",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "var el = document.createElement('div');",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }, {
	              "text": {
	                "value": "document.body.appendChild(el);",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "type": "p"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 7,
	          "id": "5e9fb984-4bb0-412e-b5f2-a314bb7d8572"
	        }, {
	          "type": "ObojoboDraft.Chunks.SingleText",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "This definition applies to texts published in print or on-line, to manuscripts, and to the work of other student writers” (Council of Writing Program Administrators).",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "type": "p"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 8,
	          "id": "f8bdafb3-905e-4c3b-b07e-4b5ba0b05539"
	        }, {
	          "type": "ObojoboDraft.Chunks.Break",
	          "content": {},
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 9,
	          "id": "82647907-91ac-4157-ab95-c24022d2a4d6"
	        }, {
	          "type": "ObojoboDraft.Chunks.SingleText",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "Violating academic standards by plagiarizing can have serious consequences that may include receiving a failing grade for an assignment or a course -- or suspension or expulsion from the university.",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "type": "p"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 10,
	          "id": "dc2b138e-b4fc-42c6-ac89-613afa6f8a98"
	        }, {
	          "type": "ObojoboDraft.Chunks.Heading",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "Detecting Plagiarism",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "headingLevel": 2
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 11,
	          "id": "1e85103b-4658-4597-a87a-c0555e722436"
	        }, {
	          "type": "ObojoboDraft.Chunks.YouTube",
	          "content": {
	            "videoId": "3NOdEMyq-9Q"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 12,
	          "id": "7a7190f7-2106-4f84-9cfa-dd764e1c5cd9"
	        }, {
	          "type": "ObojoboDraft.Chunks.SingleText",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "Students are expected to know and follow academic standards by citing the outside sources used in their work. Some UCF instructors utilize turnitin.com, an online search tool.",
	                "styleList": [{
	                  "type": "b",
	                  "start": 139,
	                  "end": 151,
	                  "data": {}
	                }]
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "type": "p"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 13,
	          "id": "bdfdc870-c23b-44a8-95d1-18ba58cab419"
	        }, {
	          "type": "ObojoboDraft.Chunks.Table",
	          "content": {
	            "textGroup": {
	              "textGroup": [{
	                "text": {
	                  "value": "Good",
	                  "styleList": null
	                },
	                "data": {}
	              }, {
	                "text": {
	                  "value": "Bad",
	                  "styleList": null
	                },
	                "data": {}
	              }, {
	                "text": {
	                  "value": "Family Man",
	                  "styleList": null
	                },
	                "data": {}
	              }, {
	                "text": {
	                  "value": "Vampire's Kiss",
	                  "styleList": null
	                },
	                "data": {}
	              }, {
	                "text": {
	                  "value": "National Treasure",
	                  "styleList": null
	                },
	                "data": {}
	              }, {
	                "text": {
	                  "value": "Ghost Rider",
	                  "styleList": null
	                },
	                "data": {}
	              }],
	              "numRows": 3,
	              "numCols": 2
	            },
	            "position": "center",
	            "header": true
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 14,
	          "id": "2c44dee8-0167-416e-8cb0-9f5e4c6cea8f"
	        }, {
	          "type": "ObojoboDraft.Chunks.SingleText",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "The turnitin software checks papers for originality by comparing a student's paper with papers submitted from other institutions and with content found on the web. After a paper is submitted, a report is sent that indicates if an author's work was properly used in the paper.",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "type": "p"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 15,
	          "id": "e75fed81-3849-4581-837b-205e06c0b134"
	        }, {
	          "type": "ObojoboDraft.Chunks.MultipleChoiceQuestion",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "Which is an example of plagiarism?",
	                "styleList": null
	              },
	              "data": {
	                "score": 0
	              }
	            }, {
	              "text": {
	                "value": "Using song lyrics in a report about cultural music",
	                "styleList": null
	              },
	              "data": {
	                "score": 100
	              }
	            }, {
	              "text": {
	                "value": "",
	                "styleList": null
	              },
	              "data": {
	                "score": 0
	              }
	            }, {
	              "text": {
	                "value": "Paraphrasing and citing text from an article",
	                "styleList": null
	              },
	              "data": {
	                "score": 0
	              }
	            }, {
	              "text": {
	                "value": "",
	                "styleList": null
	              },
	              "data": {
	                "score": 0
	              }
	            }, {
	              "text": {
	                "value": "Including George Washington's birth date in a paper",
	                "styleList": null
	              },
	              "data": {
	                "score": 0
	              }
	            }, {
	              "text": {
	                "value": "",
	                "styleList": null
	              },
	              "data": {
	                "score": 0
	              }
	            }],
	            "responseType": "pick-one"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 16,
	          "id": "8da20731-e180-4090-8533-2ca258c03291"
	        }, {
	          "type": "ObojoboDraft.Chunks.Heading",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "Causes of Plagiarism",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "headingLevel": 2
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 17,
	          "id": "c19b95c2-e7ac-41d7-8a4a-b239aa0ec8a4"
	        }, {
	          "type": "ObojoboDraft.Chunks.SingleText",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "Common causes of plagiarism include:",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "type": "p"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 18,
	          "id": "bb263299-f26f-4c9c-a616-985e1d212177"
	        }, {
	          "type": "ObojoboDraft.Chunks.List",
	          "content": {
	            "indent": 0,
	            "textGroup": [{
	              "text": {
	                "value": "using a direct quote without adding quotations and citing the source",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }, {
	              "text": {
	                "value": "paraphrasing or summarizing someone else's words or ideas without citing the source",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }, {
	              "text": {
	                "value": "submitting your own paper for more than one assignment",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }, {
	              "text": {
	                "value": "getting a friend to help you write a paper",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }, {
	              "text": {
	                "value": "borrowing or buying a paper",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }, {
	              "text": {
	                "value": "and other practices that may be identified by your professors or instructors.",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "listStyles": {
	              "type": "unordered",
	              "indents": {}
	            }
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 19,
	          "id": "8757d2f8-c16f-46e6-a082-7fda20a3ab78"
	        }]
	      }, {
	        "chunks": [{
	          "type": "ObojoboDraft.Chunks.Heading",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "Avoiding Plagiarism",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "headingLevel": 1
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 0,
	          "id": "5e05f97d-2d4b-4ace-89eb-0e49c1a738a9"
	        }, {
	          "type": "ObojoboDraft.Chunks.Heading",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "Citing Sources",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "headingLevel": 2
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 1,
	          "id": "9b005199-0e18-4c3d-9505-c30e53e012eb"
	        }, {
	          "type": "ObojoboDraft.Chunks.SingleText",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "To avoid plagiarism, cite all outside sources you use in your writing. The examples in this module describe how to use MLA style to cite sources. MLA style and formatting is published in the MLA Handbook for Writers of Research Papers, Seventh Edition. However, there are many other styles you may be asked to use in your courses. Check with your instructors to find out which style is required for a course. Other frequently used styles include: American Medical Association (AMA), American Psychological Association (APA), and the Chicago Manual of Style (CMS). To see detailed instructions about how to use a specific style along with formatting examples, consult the appropriate style manual. Copies of style manuals are available in the reference area of the library.",
	                "styleList": [{
	                  "type": "b",
	                  "start": 119,
	                  "end": 128,
	                  "data": {}
	                }, {
	                  "type": "b",
	                  "start": 191,
	                  "end": 251,
	                  "data": {}
	                }]
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "type": "p"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 2,
	          "id": "bf6effd1-42fe-4c93-bbe9-7886b53f84cc"
	        }, {
	          "type": "ObojoboDraft.Chunks.IFrame",
	          "content": {
	            "src": null
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 3,
	          "id": "c5d325ed-b02c-463d-98cb-221e03abf00f"
	        }, {
	          "type": "ObojoboDraft.Chunks.SingleText",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "Citing sources is typically a two-step process -- to cite sources using MLA style:",
	                "styleList": null
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "type": "p"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 4,
	          "id": "e0716201-b267-4138-ab9e-6e809206affe"
	        }, {
	          "type": "ObojoboDraft.Chunks.List",
	          "content": {
	            "indent": 0,
	            "textGroup": [{
	              "text": {
	                "value": "Step 1 - Create a Works Cited page, which should be added at the end of your paper, to list all of the required details about each source. Depending on the citation style you use, this page may be titled References or Bibliography.",
	                "styleList": [{
	                  "type": "b",
	                  "start": 18,
	                  "end": 29,
	                  "data": {}
	                }]
	              },
	              "data": {
	                "indent": 0
	              }
	            }, {
	              "text": {
	                "value": "Step 2 - Add a parenthetical citation within the body of your paper wherever you include a direct quote or any text or ideasthat are paraphrased and summarized from outside sources. Parenthetical citations (sometimes called in-text citations) refer readers to the specific entry listed on your Works Cited page.",
	                "styleList": [{
	                  "type": "b",
	                  "start": 15,
	                  "end": 37,
	                  "data": {}
	                }, {
	                  "type": "b",
	                  "start": 224,
	                  "end": 241,
	                  "data": {}
	                }, {
	                  "type": "b",
	                  "start": 294,
	                  "end": 306,
	                  "data": {}
	                }]
	              },
	              "data": {
	                "indent": 0
	              }
	            }],
	            "listStyles": {
	              "type": "unordered",
	              "indents": {}
	            }
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 5,
	          "id": "90442ca9-3607-4e62-8da9-8f16b8aec0f9"
	        }, {
	          "type": "ObojoboDraft.Chunks.MultipleChoiceQuestion",
	          "content": {
	            "textGroup": [{
	              "text": {
	                "value": "Read the text below and determine which answer gives the best example of how to summarize text.\n\nA total of 14 intersections (nine camera sites, three non-camera sites, and two control sites) were studied. Overall, the red light violation rate was reduced approximately 42% several months after the enforcement program began. Increases in driver compliance were not limited to the camera-equipped intersections but spilled over the non-equipped intersections as well. Results of public opinion surveys conducted approximately 6 weeks before, 6 weeks after, and 6 months after the camera enforcement began indicated that nearly 80% of Oxnard residents support using red light cameras as a supplement to police efforts to enforce traffic signal laws.\n\nRettig, Richard A., Allan F. Williams, Charles M. Farmer, and Amy F. Feldman. \"Evaluation of Red Light Camera Enforcement in Oxnard, California.\" Accident Analysis and Prevention 31.3 (1999): 169-74. Print.",
	                "styleList": null
	              },
	              "data": {
	                "score": 0
	              }
	            }, {
	              "text": {
	                "value": "In one study red light cameras reduced violations by 42% with compliance spreading to intersections without cameras as well, with residents overwhelmingly supporting the program (Rettig 169).",
	                "styleList": null
	              },
	              "data": {
	                "score": 100
	              }
	            }, {
	              "text": {
	                "value": "Correct. This example briefly restates the original source by conveying the main points and it properly cites the source.",
	                "styleList": null
	              },
	              "data": {
	                "score": 0
	              }
	            }, {
	              "text": {
	                "value": "Overall, the red light violation rate was reduced approximately 42% several months after the enforcement program began\" (Rettig 169).",
	                "styleList": null
	              },
	              "data": {
	                "score": 0
	              }
	            }, {
	              "text": {
	                "value": "Incorrect. This is an example of how to use a direct quote.",
	                "styleList": null
	              },
	              "data": {
	                "score": 0
	              }
	            }, {
	              "text": {
	                "value": "In Rettig's analysis, red light cameras reduced violations at 14 intersections, some with cameras and some without, by 42%. Eighty percent of Oxnard residents surveyed immediately before, immediately after and 6 months after implementation supported the red light camera program (169).",
	                "styleList": null
	              },
	              "data": {
	                "score": 0
	              }
	            }, {
	              "text": {
	                "value": "Incorrect. This is an example of how you might paraphrase the original source.",
	                "styleList": null
	              },
	              "data": {
	                "score": 0
	              }
	            }],
	            "responseType": "pick-one"
	          },
	          "contentType": "json",
	          "derivedFrom": null,
	          "index": 6,
	          "id": "7ef7940e-2cea-4112-b9d4-d9ec9b9ca42a"
	        }]
	      }]
	    });
	    this.history = new History();
	    this.selection = new Selection(module.pages.at(0));
	    this.textModifiers = [];
	    this.moduleChanged = false;
	    this.toolbarItemsListeningForSelectionUpdate = [];
	    ref = this.props.toolbarItems;
	    for (i = 0, len = ref.length; i < len; i++) {
	      item = ref[i];
	      if (item.onSelectionUpdate != null) {
	        this.toolbarItemsListeningForSelectionUpdate.push(item);
	      }
	    }
	    window.__force = function () {
	      return this.saveAndRenderModule();
	    }.bind(this);
	    window.__history = this.history;
	    window.__lo = module;
	    window.__s = this.selection;
	    window.__sd = function () {
	      return console.log(JSON.stringify(this.selection.getSelectionDescriptor(), null, 2));
	    }.bind(this);
	    window.__editor = this;
	    window.__tg = function (index) {
	      return module.chunks.at(index).componentContent.textGroup;
	    };
	    window.__tgs = function (index) {
	      return new ObojoboDraft.textGroup.TextGroupSelection(module.pages.at(this.state.activePageIndex).chunks.at(index), this.state.selection.virtual);
	    }.bind(this);
	    window.__editChunk = function (index, controlsEnabled) {
	      this.editChunk(__lo.chunks.at(index), controlsEnabled);
	      return __force({});
	    }.bind(this);
	    window.__undo = this.undo;
	    window.__redo = this.redo;
	    window.EditorApp = this;
	    return {
	      module: module,
	      activePageIndex: 0,
	      styleBrush: new StyleBrush(),
	      modalElement: null,
	      editingChunk: null,
	      textControlsEnabled: true,
	      sideMenuEnabled: true,
	      toolbarControlsEnabled: true,
	      loading: false,
	      selection: this.selection,
	      key: 0
	    };
	  },
	  _getActivePageRef: function _getActivePageRef() {
	    return this.refs['editorPage' + this.state.activePageIndex];
	  },
	  _getActivePageContainerRef: function _getActivePageContainerRef() {
	    return this.refs['pageContainer' + this.state.activePageIndex];
	  },
	  _onTextMenuCommand: function _onTextMenuCommand(commandLabel) {
	    this.selection.runTextCommands(commandLabel);
	    this.updateSelectionFromDOM();
	    return this.saveAndRenderModule();
	  },
	  _onSideMenuStartDrag: function _onSideMenuStartDrag() {
	    return this.setState({
	      textControlsEnabled: false,
	      toolbarControlsEnabled: false
	    });
	  },
	  _onSideMenuDrop: function _onSideMenuDrop() {
	    this.setState({
	      textControlsEnabled: true,
	      toolbarControlsEnabled: true
	    });
	    return this._getActivePageRef().forcePageRerender({
	      callback: function () {
	        return this.saveAndRenderModule();
	      }.bind(this)
	    });
	  },
	  _onSideMenuClick: function _onSideMenuClick(position, componentClass) {
	    var newChunk, onInsert, self;
	    this.setState({
	      loading: true
	    });
	    console.time('sideMenuClick');
	    self = this;
	    onInsert = this.props.insertItems.get(componentClass.type).onInsert;
	    if (position === 'before') {
	      onInsert(componentClass, 'before', self.selection.startChunk, self.selection, function () {
	        self.setState({
	          loading: false
	        });
	        return self.saveAndRenderModule();
	      });
	    } else {
	      newChunk = onInsert(componentClass, 'after', self.selection.endChunk, self.selection, function () {
	        self.setState({
	          loading: false
	        });
	        return self.saveAndRenderModule();
	      });
	    }
	    return console.timeEnd('sideMenuClick');
	  },
	  _onAppendMenuClick: function _onAppendMenuClick(componentClass) {
	    var newChunk, onInsert, page, self;
	    self = this;
	    onInsert = this.props.insertItems.get(componentClass.type).onInsert;
	    page = self.state.module.pages.at(self.state.activePageIndex);
	    return newChunk = onInsert(componentClass, 'after', page.chunks.at(page.chunks.length - 1), self.selection, function () {
	      self.setState({
	        loading: false
	      });
	      self.saveAndRenderModule();
	      return self.scrollToPageBottomAfterUpdate = true;
	    });
	  },
	  _onToolbarCommand: function _onToolbarCommand(command, data) {
	    command.onClick(command, this.state, this.selection, data);
	    this.saveAndRenderModule();
	    return window.setTimeout(function () {
	      return this.selection.selectDOM();
	    }.bind(this));
	  },
	  _onKeyDown: function _onKeyDown(event) {
	    if (event.metaKey || event.ctrlKey) {
	      switch (event.keyCode) {
	        case 90:
	          event.preventDefault();
	          if (event.shiftKey) {
	            return this.redo();
	          } else {
	            return this.undo();
	          }
	          break;
	        case 89:
	          event.preventDefault();
	          return this.redo();
	        case 83:
	          event.preventDefault();
	          if (event.shiftKey) {
	            return location.hash = encodeURIComponent('json:' + JSON.stringify(this.state.module.toJSON()));
	          } else {
	            return this.state.module.save();
	          }
	      }
	    }
	  },
	  _onMouseUp: function _onMouseUp(event) {
	    if (this.editingChunk == null && !DOMSelection.includes(ReactDOM.findDOMNode(this._getActivePageRef()))) {
	      return this.renderModule();
	    }
	  },
	  encodeState: function encodeState() {
	    console.log('ENCODE');
	    console.log(JSON.stringify(this.state.selection.virtual.toObject(), null, 2));
	    return {
	      module: this.state.module.toJSON(),
	      styleBrush: this.state.styleBrush.toObject(),
	      modalElement: '@TODO',
	      editingChunkIndex: this.state.editingChunk != null ? this.state.editingChunk.get('index') : -1,
	      textControlsEnabled: this.state.textControlsEnabled,
	      sideMenuEnabled: this.state.sideMenuEnabled,
	      toolbarControlsEnabled: this.state.toolbarControlsEnabled,
	      loading: this.state.loading,
	      selection: this.state.selection.getSelectionDescriptor(),
	      activePageIndex: this.state.activePageIndex
	    };
	  },
	  restoreState: function restoreState(o) {
	    this.state.module.fromDescriptor(o.module);
	    if (this.state.activePageIndex !== o.activePageIndex) {
	      this.selectPage(this.state.module.pages.at(o.activePageIndex));
	    }
	    this.state.selection.virtual.fromObject(o.selection);
	    console.clear();
	    console.log(JSON.stringify(this.state.selection.virtual.toObject(), null, 2));
	    this.needSelectionUpdate = true;
	    return this.setState({
	      module: this.state.module,
	      styleBrush: StyleBrush.fromObject(o.styleBrush),
	      editingChunk: o.editingChunkIndex === -1 ? null : this.state.module.chunks.at(o.editingChunkIndex),
	      textControlsEnabled: o.textControlsEnabled,
	      sideMenuEnabled: o.sideMenuEnabled,
	      toolbarControlsEnabled: o.toolbarControlsEnabled,
	      loading: o.loading,
	      selection: this.state.selection,
	      activePageIndex: o.activePageIndex,
	      key: this.state.key + 1
	    });
	  },
	  saveAndRenderModule: function saveAndRenderModule() {
	    if (this.saveModule()) {
	      return this.renderModule();
	    }
	  },
	  saveModule: function saveModule() {
	    console.time('history');
	    this.moduleChanged = this.history.add(this.encodeState());
	    console.timeEnd('history');
	    return window.localStorage.__module = JSON.stringify(this.state.module.toJSON());
	  },
	  renderModule: function renderModule() {
	    if (this.state.textControlsEnabled) {
	      this.needSelectionUpdate = true;
	    }
	    return this.setState({
	      module: this.state.module
	    });
	  },
	  updateSelectionFromDOM: function updateSelectionFromDOM(selectDOM) {
	    var i, item, len, ref;
	    if (selectDOM == null) {
	      selectDOM = true;
	    }
	    this.selection.update();
	    if (selectDOM) {
	      this.selection.selectDOM();
	    }
	    ref = this.toolbarItemsListeningForSelectionUpdate;
	    for (i = 0, len = ref.length; i < len; i++) {
	      item = ref[i];
	      if (item.onSelectionUpdate) {
	        item.onSelectionUpdate(item, this.state, this.selection);
	      }
	    }
	    return this.setState({
	      selection: this.selection
	    });
	  },
	  undo: function undo() {
	    var history;
	    history = this.history.undo();
	    return this.restoreState(history);
	  },
	  redo: function redo() {
	    var history;
	    history = this.history.redo();
	    return this.restoreState(history);
	  },
	  showModal: function showModal(component) {
	    return this.setState({
	      modalElement: component
	    });
	  },
	  editChunk: function editChunk(chunk, controlsEnabled) {
	    if (controlsEnabled == null) {
	      controlsEnabled = {};
	    }
	    chunk.markForUpdate();
	    if (!controlsEnabled.textControlsEnabled) {
	      controlsEnabled.textControlsEnabled = false;
	    }
	    if (!controlsEnabled.sideMenuEnabled) {
	      controlsEnabled.sideMenuEnabled = false;
	    }
	    if (!controlsEnabled.toolbarControlsEnabled) {
	      controlsEnabled.toolbarControlsEnabled = false;
	    }
	    return this.setState({
	      editingChunk: chunk,
	      textControlsEnabled: controlsEnabled.textControlsEnabled,
	      sideMenuEnabled: controlsEnabled.sideMenuEnabled,
	      toolbarControlsEnabled: controlsEnabled.toolbarControlsEnabled
	    });
	  },
	  stopEditing: function stopEditing() {
	    if (this.state.editingChunk) {
	      this.state.editingChunk.markForUpdate();
	    }
	    this.setState({
	      editingChunk: null,
	      sideMenuEnabled: true,
	      textControlsEnabled: true,
	      toolbarControlsEnabled: true
	    });
	    return this.updateSelectionFromDOM();
	  },
	  setLoading: function setLoading(val) {
	    return this.setState({
	      loading: val
	    });
	  },
	  triggerKeyListeners: function triggerKeyListeners() {
	    var i, len, listener, ref;
	    if (this.moduleChanged) {
	      delete this.moduleChanged;
	      console.time('textListeners');
	      ref = OBO.textListeners;
	      for (i = 0, len = ref.length; i < len; i++) {
	        listener = ref[i];
	        listener.match(this.selection, this);
	      }
	      return console.timeEnd('textListeners');
	    }
	  },
	  componentDidMount: function componentDidMount() {
	    this.screen = new Screen(this.refs.main);
	    this.state.module.pages.at(0).chunks.at(0).selectStart();
	    ReactDOM.findDOMNode(this._getActivePageRef()).focus();
	    document.addEventListener('keydown', this._onKeyDown);
	    return this.saveAndRenderModule();
	  },
	  componentWillUpdate: function componentWillUpdate() {
	    return this.state.module.initIfNeeded();
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    if (this.needSelectionUpdate != null) {
	      delete this.needSelectionUpdate;
	      this.selection.selectDOM();
	      this.updateSelectionFromDOM();
	    }
	    if (this.scrollToPageBottomAfterUpdate) {
	      delete this.scrollToPageBottomAfterUpdate;
	      ReactDOM.findDOMNode(this._getActivePageContainerRef()).scrollIntoView(false);
	      this.selection.selectDOM();
	      return this.updateSelectionFromDOM();
	    }
	  },
	  selectPage: function selectPage(page) {
	    this.selection.setPage(page);
	    page.chunks.at(page.chunks.models.length - 1).selectEnd();
	    this.needSelectionUpdate = true;
	    return this.setState({
	      activePageIndex: this.state.module.pages.models.indexOf(page)
	    });
	  },
	  addPage: function addPage(index) {
	    var newPage;
	    newPage = new Page();
	    this.state.module.pages.add(newPage, {
	      at: index + 1
	    });
	    newPage.initIfNeeded();
	    this.scrollToPageBottomAfterUpdate = true;
	    this.selectPage(newPage);
	    return this.saveAndRenderModule();
	  },
	  onPageMouseDown: function onPageMouseDown(page, pageIndex) {
	    if (pageIndex !== this.state.activePageIndex) {
	      return this.selectPage(page);
	    }
	  },
	  deletePage: function deletePage(page) {
	    var pageIndex;
	    pageIndex = this.state.module.pages.models.indexOf(page);
	    this.state.module.pages.remove(page);
	    this.state.module.initIfNeeded();
	    pageIndex = Math.max(0, pageIndex - 1);
	    this.selectPage(this.state.module.pages.at(pageIndex));
	    return this.saveAndRenderModule();
	  },
	  render: function render() {
	    var addPage, deletePage, editorPages, onPageMouseDown, saveAndRenderModuleFn, saveHistoryFn, selection, setControlsStateFn, setLoadingFn, showModalFn, sideMenuEnabled, textControlsEnabled, toolbarControlsEnabled, updateSelectionFromDOMFn;
	    console.time('renderEditor');
	    saveHistoryFn = this.saveHistory;
	    showModalFn = this.showModal;
	    setLoadingFn = this.setLoading;
	    selection = this.selection;
	    saveAndRenderModuleFn = this.saveAndRenderModule;
	    updateSelectionFromDOMFn = this.updateSelectionFromDOM;
	    setControlsStateFn = this.setControlsState;
	    addPage = this.addPage;
	    onPageMouseDown = this.onPageMouseDown;
	    deletePage = this.deletePage;
	    if (this.state.loading || this.state.modalElement != null) {
	      sideMenuEnabled = false;
	      textControlsEnabled = false;
	      toolbarControlsEnabled = false;
	    } else {
	      sideMenuEnabled = this.state.sideMenuEnabled;
	      textControlsEnabled = this.state.textControlsEnabled;
	      toolbarControlsEnabled = this.state.toolbarControlsEnabled;
	    }
	    editorPages = this.state.module.pages.models.map(function (page, index) {
	      var isActive;
	      isActive = this.state.activePageIndex === index;
	      return React.createElement(
	        'div',
	        { key: index, ref: 'pageContainer' + index, className: 'page-container' + (isActive ? ' active' : '') },
	        React.createElement(
	          'button',
	          { className: 'add-page-btn top', onClick: addPage.bind(null, index - 1) },
	          '+ Add Page'
	        ),
	        React.createElement(EditorPage, {
	          'data-page-index': index,
	          pageIndex: index,
	          onMouseDown: onPageMouseDown,
	          module: this.state.module,
	          page: page,
	          selection: this.selection,
	          styleBrush: this.state.styleBrush,
	          saveAndRenderModuleFn: saveAndRenderModuleFn,
	          updateSelectionFromDOMFn: updateSelectionFromDOMFn,
	          showModalFn: showModalFn,
	          setLoadingFn: setLoadingFn,
	          editChunk: this.editChunk,
	          stopEditing: this.stopEditing,
	          editingChunk: this.state.editingChunk,
	          enabled: textControlsEnabled,
	          pageEdit: this.state.editingChunk === null,
	          screen: this.screen,
	          triggerKeyListeners: this.triggerKeyListeners,
	          deletePage: deletePage,
	          ref: 'editorPage' + index
	        }),
	        isActive ? React.createElement(
	          'div',
	          { className: 'append-menu' },
	          React.createElement(SideMenuList, {
	            alwaysOpen: true,
	            insertItems: this.props.insertItems,
	            onMouseDown: this._onAppendMenuClick,
	            yPos: 0,
	            enabled: this.state.sideMenuEnabled
	          })
	        ) : null,
	        React.createElement(
	          'button',
	          { className: 'add-page-btn bottom', onClick: addPage.bind(null, index) },
	          '+ Add Page'
	        )
	      );
	    }.bind(this));
	    return React.createElement(
	      'div',
	      { className: 'editor--components--editor-app document', onMouseUp: this._onMouseUp, key: this.state.key },
	      React.createElement(
	        'div',
	        { className: 'toolbar-wrapper' + (!textControlsEnabled ? ' disabled' : '') },
	        React.createElement(Toolbar, { selection: this.selection, commandHandler: this._onToolbarCommand, commands: this.props.toolbarItems, enabled: toolbarControlsEnabled })
	      ),
	      React.createElement(
	        'main',
	        { ref: 'main' },
	        React.createElement(
	          'div',
	          { className: 'wrapper' },
	          React.createElement('div', { className: 'guidelines' }),
	          editorPages,
	          React.createElement(
	            'div',
	            { ref: 'controls', className: 'controls' },
	            React.createElement(DebugMenu, { selection: this.selection, history: this.history, controlsEl: this.refs.controls }),
	            React.createElement(SideMenu, {
	              renderModuleFn: this.renderModule,
	              selection: this.selection,
	              module: this.state.module,
	              handlerFn: this._onSideMenuClick,
	              insertItems: this.props.insertItems,
	              controlsEl: this.refs.controls,
	              onStartDrag: this._onSideMenuStartDrag,
	              onDrop: this._onSideMenuDrop,
	              enabled: sideMenuEnabled
	            }),
	            React.createElement(TextMenu, {
	              relativeToElement: this.refs.controls,
	              selectionRect: this.state.selection.rect,
	              commandHandler: this._onTextMenuCommand,
	              commands: this.state.selection.textCommands,
	              enabled: textControlsEnabled
	            })
	          )
	        )
	      ),
	      React.createElement(Modal, { modalElement: this.state.modalElement, showModalFn: showModalFn }),
	      React.createElement(LoadingModal, { show: this.state.loading })
	    );
	  }
	});

	module.exports = EditorApp;

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk, ChunkClipboard, ChunkEl, ChunkUtil, DOMUtil, DeleteButton, EditorPage, InputHandler, Keyboard, ObojoboDraft, StyleType, VirtualSelection;

	__webpack_require__(203);

	InputHandler = __webpack_require__(136);

	ChunkClipboard = __webpack_require__(154);

	ObojoboDraft = window.ObojoboDraft;

	Keyboard = ObojoboDraft.page.Keyboard;

	StyleType = ObojoboDraft.text.StyleType;

	Chunk = ObojoboDraft.models.Chunk;

	DOMUtil = ObojoboDraft.page.DOMUtil;

	ChunkUtil = ObojoboDraft.chunk.util.ChunkUtil;

	ChunkEl = ObojoboDraft.components.Chunk;

	VirtualSelection = ObojoboDraft.selection.VirtualSelection;

	DeleteButton = ObojoboDraft.components.DeleteButton;

	/*
	A better focus alg

	componentWillReceiveProps: (nextProps) ->
		console.clear()
		console.log 'CWRP???', @props.selectionState, nextProps.selectionState

		if @props.selectionState isnt nextProps.selectionState
			if nextProps.selectionState is 'contains'
				console.log 'T'
				@props.chunk.markForUpdate()
				@setState {
					focused: true
				}
			else if @props.selectionState is 'contains'
				console.log 'F'
				@props.chunk.markForUpdate()
				@setState {
					focused: false
				}
	 */

	EditorPage = React.createClass({
	  displayName: 'EditorPage',

	  getInitialState: function getInitialState() {
	    this.chunkClipboard = new ChunkClipboard();
	    this.inputHandler = new InputHandler();
	    window.__cc = this.chunkClipboard;
	    window.__send = function (fn, chunkOrChunks, data) {
	      return this.send(fn, chunkOrChunks, data);
	    }.bind(this);
	    window.__do = function (chunkIndexArray, componentFn, args) {
	      var chunks, i, index, len, rtn;
	      console.clear();
	      chunks = [];
	      for (i = 0, len = chunkIndexArray.length; i < len; i++) {
	        index = chunkIndexArray[i];
	        chunks.push(__lo.chunks.at(index));
	      }
	      rtn = __send(componentFn, chunks, args);
	      __force({});
	      return rtn;
	    };
	    window.__setSel = function (startIndex, startGroupIndex, startOffset, endIndex, endGroupIndex, endOffset) {
	      if (startIndex == null) {
	        startIndex = 0;
	      }
	      if (startGroupIndex == null) {
	        startGroupIndex = 0;
	      }
	      if (startOffset == null) {
	        startOffset = 0;
	      }
	      if (endIndex == null) {
	        endIndex = null;
	      }
	      if (endGroupIndex == null) {
	        endGroupIndex = null;
	      }
	      if (endOffset == null) {
	        endOffset = null;
	      }
	      if (endIndex == null) {
	        endIndex = startIndex;
	      }
	      if (endGroupIndex == null) {
	        endGroupIndex = startGroupIndex;
	      }
	      if (endOffset == null) {
	        endOffset = startOffset;
	      }
	      __s.setFutureFromDescriptor({
	        start: {
	          index: startIndex,
	          data: {
	            groupIndex: startGroupIndex,
	            offset: startOffset
	          }
	        },
	        end: {
	          index: endIndex,
	          data: {
	            groupIndex: endGroupIndex,
	            offset: endOffset
	          }
	        }
	      });
	      return __force({});
	    };
	    return {
	      key: 0
	    };
	  },
	  forcePageRerender: function forcePageRerender(data) {
	    this.forcedRerenderPayload = data;
	    return this.setState({
	      key: this.state.key + 1
	    });
	  },
	  send: function send(fn, chunkOrChunks, data) {
	    return ChunkUtil.send(fn, chunkOrChunks, this.props.selection, data);
	  },
	  onKeyDownPutChunkOnClipboard: function onKeyDownPutChunkOnClipboard(event, chunk, afterCallback) {
	    var hijackEl;
	    if (afterCallback == null) {
	      afterCallback = function afterCallback() {};
	    }
	    if ((event.keyCode === 67 || event.keyCode === 88) && (event.ctrlKey || event.metaKey)) {
	      this.copyHijackCallback = afterCallback;
	      console.log(this.copyHijackCallback);
	      hijackEl = this.createCopyHijackElement(chunk);
	      document.body.appendChild(hijackEl);
	      hijackEl.focus();
	      hijackEl.select();
	      return true;
	    }
	    return false;
	  },
	  createCopyHijackElement: function createCopyHijackElement(chunk) {
	    var el;
	    el = document.createElement('textarea');
	    el.style.position = 'fixed';
	    el.style.top = '-9999px';
	    el.style.left = '0';
	    el.style.zIndex = '999999';
	    el.textContent = chunk.getDomEl().textContent;
	    el.id = 'obojobo-draft-engine-copy-field';
	    el.addEventListener('keyup', this.onCopyHijackElementKeyUp);
	    this.chunkClipboard.storeChunksByText([chunk], el.textContent);
	    return el;
	  },
	  onCopyHijackElementKeyUp: function onCopyHijackElementKeyUp(event) {
	    console.log(this.copyHijackCallback);
	    if (this.copyHijackCallback) {
	      this.destroyCopyHijackElement();
	      this.copyHijackCallback();
	      delete this.copyHijackCallback;
	    }
	    return this.props.updateSelectionFromDOMFn();
	  },
	  destroyCopyHijackElement: function destroyCopyHijackElement() {
	    var el;
	    el = document.getElementById('obojobo-draft-engine-copy-field');
	    if (el != null) {
	      return el.parentElement.removeChild(el);
	    }
	  },
	  onEvent: function onEvent(event) {
	    if (!this.props.enabled) {
	      return;
	    }
	    switch (event.type) {
	      case 'keydown':
	        return this.onKeyDown(event);
	      case 'keypress':
	        return this.onKeyPress(event);
	      case 'keyup':
	        return this.onKeyUp(event);
	      case 'paste':
	        return this.onPaste(event);
	      case 'copy':
	        return this.onCopy(event);
	      case 'cut':
	        return this.onCut(event);
	      case 'mousedown':
	        return this.onMouseDown(event);
	      case 'mouseup':
	        return this.onMouseUp(event);
	      case 'input':
	        return this.onInput(event);
	      case 'contextmenu':
	        return this.onContextMenu(event);
	    }
	  },
	  onKeyDown: function onKeyDown(event) {
	    var result;
	    if (this.copyHijackCallback) {
	      return true;
	    }
	    if (!event.metaKey && !event.altKey && !event.ctrlKey) {
	      this.props.screen.tweenSelectionIntoViewIfNeeded();
	    }
	    this.props.updateSelectionFromDOMFn();
	    result = this.inputHandler.onKeyDown(event, this.props.selection, this.props.styleBrush);
	    if (result) {
	      return this.props.saveAndRenderModuleFn();
	    }
	  },
	  onContextMenu: function onContextMenu() {
	    return this.props.updateSelectionFromDOMFn();
	  },
	  onInput: function onInput(event) {
	    var inputActivityData;
	    if (this.blockInputEvent != null) {
	      delete this.blockInputEvent;
	      return;
	    }
	    if (this.props.selection.virtual.type === 'chunkSpan') {
	      this.forcePageRerender({
	        callback: function () {
	          return setTimeout(function () {
	            return this.props.saveAndRenderModuleFn();
	          }.bind(this));
	        }.bind(this)
	      });
	      return;
	    }
	    inputActivityData = {
	      chunk: this.props.selection.startChunk,
	      savedDOMState: this.props.selection.startChunk.getDOMStateBeforeInput(),
	      callback: function (data) {
	        data.chunk.applyDOMModification(data.domModification);
	        return setTimeout(function () {
	          this.props.saveAndRenderModuleFn();
	          return this.props.screen.scrollSelectionIntoViewIfNeeded();
	        }.bind(this));
	      }.bind(this)
	    };
	    this.props.selection.saveVirtualSelection();
	    inputActivityData.domModification = inputActivityData.chunk.getDOMModificationAfterInput(inputActivityData.savedDOMState);
	    this.props.updateSelectionFromDOMFn();
	    this.props.selection.restoreVirtualSelection();
	    this.forcePageRerender(inputActivityData);
	    return true;
	  },
	  onKeyPress: function onKeyPress(event) {
	    var char;
	    this.props.updateSelectionFromDOMFn();
	    event.preventDefault();
	    char = String.fromCharCode(event.charCode);
	    return this.sendText(char);
	  },
	  onKeyUp: function onKeyUp(event) {
	    this.props.updateSelectionFromDOMFn();
	    if (event.keyCode === Keyboard.SPACE) {
	      this.props.triggerKeyListeners();
	    }
	    return true;
	  },
	  saveSelectionToClipboard: function saveSelectionToClipboard() {
	    var chunk, i, len, ref, toStore;
	    this.chunkClipboard.clear();
	    toStore = [];
	    ref = this.props.selection.virtual.all;
	    for (i = 0, len = ref.length; i < len; i++) {
	      chunk = ref[i];
	      toStore.push(chunk.getCopyOfSelection(true));
	    }
	    return this.chunkClipboard.storeChunksByText(toStore, window.getSelection().toString());
	  },
	  onCopy: function onCopy(event) {
	    this.saveSelectionToClipboard();
	    return true;
	  },
	  onCut: function onCut(event) {
	    var forcedRerenderData;
	    this.blockInputEvent = true;
	    this.saveSelectionToClipboard();
	    this.props.updateSelectionFromDOMFn();
	    forcedRerenderData = {
	      selection: this.props.selection.getSelectionDescriptor(),
	      callback: function () {
	        ChunkUtil.deleteSelection(this.props.selection);
	        return this.props.saveAndRenderModuleFn();
	      }.bind(this)
	    };
	    setTimeout(function () {
	      return this.forcePageRerender(forcedRerenderData);
	    }.bind(this));
	    return true;
	  },
	  onPaste: function onPaste(event) {
	    var html, pasteSuccessful, pastedChunks, storedChunks, text;
	    event.preventDefault();
	    this.props.selection.update();
	    ChunkUtil.deleteSelection(this.props.selection);
	    html = event.clipboardData.getData('text/html');
	    text = event.clipboardData.getData('text/plain');
	    pastedChunks = [];
	    storedChunks = this.chunkClipboard.get(text);
	    console.log(text, html, storedChunks);
	    if (storedChunks != null) {
	      pastedChunks = storedChunks;
	    } else {
	      this.chunkClipboard.clear();
	    }
	    pasteSuccessful = this.props.selection.startChunk.paste(text, html, pastedChunks);
	    console.log('pasteSuccessful?', pasteSuccessful);
	    if (pasteSuccessful) {
	      this.props.saveAndRenderModuleFn();
	      return;
	    }
	    if (pastedChunks.length > 0) {
	      this.insertPastedChunks(pastedChunks);
	      return;
	    }
	    return this.sendText(text);
	  },
	  insertPastedChunks: function insertPastedChunks(pastedChunks) {
	    var chunk, i, len, refChunk, refChunkCaretEdge;
	    ChunkUtil.deleteSelection(this.props.selection);
	    refChunk = this.props.selection.startChunk;
	    refChunkCaretEdge = refChunk.getCaretEdge();
	    refChunk.split();
	    for (i = 0, len = pastedChunks.length; i < len; i++) {
	      chunk = pastedChunks[i];
	      console.log('refChunk');
	      refChunk.addChildAfter(chunk);
	      refChunk = chunk;
	      console.log('add in', chunk.get('type'), chunk);
	    }
	    this.props.selection.startChunk.remove();
	    if (refChunkCaretEdge === 'start' || refChunkCaretEdge === 'startAndEnd') {
	      refChunk.nextSibling().selectStart();
	    } else {
	      refChunk.selectEnd();
	    }
	    return this.props.saveAndRenderModuleFn();
	  },
	  onMouseDown: function onMouseDown(event) {
	    this.props.onMouseDown(this.props.page, this.props.pageIndex);
	    this.props.selection.clear();
	    this.props.styleBrush.clean();
	    return true;
	  },
	  onMouseUp: function onMouseUp(event) {
	    setTimeout(this.props.updateSelectionFromDOMFn.bind(null, false));
	    return true;
	  },
	  onClick: function onClick(event) {
	    var clickedChunk, clickedChunkIndex;
	    clickedChunkIndex = ~~DOMUtil.findParentAttr(event.target, 'data-component-index');
	    clickedChunk = this.props.page.chunks.at(clickedChunkIndex);
	    if (this.props.editingChunk !== null && this.props.editingChunk !== clickedChunk) {
	      this.props.stopEditing();
	      return this.props.saveAndRenderModuleFn();
	    }
	  },
	  sendText: function sendText(char) {
	    var styleBrush;
	    styleBrush = this.props.styleBrush;
	    ChunkUtil.deleteSelection(this.props.selection);
	    console.time('sendText');
	    this.props.selection.startChunk.insertText(char, styleBrush.stylesToApply, styleBrush.stylesToRemove);
	    console.timeEnd('sendText');
	    return this.props.saveAndRenderModuleFn();
	  },
	  componentDidMount: function componentDidMount() {
	    document.execCommand("enableObjectResizing", false, "false");
	    return document.execCommand("enableInlineTableEditing", false, "false");
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    console.timeEnd('renderPage');
	    if (this.forcedRerenderPayload && this.forcedRerenderPayload.callback != null) {
	      this.forcedRerenderPayload.callback(this.forcedRerenderPayload);
	    }
	    return delete this.forcedRerenderPayload;
	  },
	  focusOnEditor: function focusOnEditor() {
	    return this.refs.editor.focus();
	  },
	  selectStart: function selectStart() {
	    console.log('SELECT START');
	    this.focusOnEditor();
	    return this.props.page.chunks.at(0).selectStart();
	  },
	  selectEnd: function selectEnd() {
	    this.focusOnEditor();
	    return this.props.page.chunks.at(this.props.page.chunks.length - 1).selectEnd();
	  },
	  onDeleteButtonClick: function onDeleteButtonClick() {
	    return this.props.deletePage(this.props.page);
	  },
	  render: function render() {
	    var chunkClipboard, chunks, curChunkSel, editChunkFn, editingChunk, loading, module, onEvent, onKeyDownPutChunkOnClipboard, pageIndex, saveAndRenderModuleFn, saveHistoryFn, selection, showModalFn, stopEditingFn, updateSelectionFromDOMFn;
	    console.time('renderPage');
	    saveHistoryFn = this.saveHistory;
	    editChunkFn = this.props.editChunk;
	    stopEditingFn = this.props.stopEditing;
	    window.__activateFn = this.activateChunk;
	    showModalFn = this.props.showModalFn;
	    selection = this.props.selection;
	    saveAndRenderModuleFn = this.props.saveAndRenderModuleFn;
	    chunkClipboard = this.chunkClipboard;
	    onEvent = this.onEvent;
	    onKeyDownPutChunkOnClipboard = this.onKeyDownPutChunkOnClipboard;
	    updateSelectionFromDOMFn = this.props.updateSelectionFromDOMFn;
	    editingChunk = this.props.editingChunk;
	    loading = this.props.loading;
	    module = this.props.module;
	    pageIndex = this.props.pageIndex;
	    curChunkSel = VirtualSelection.fromDOMSelection(this.props.page);
	    chunks = this.props.page.chunks.models.map(function (chunk, index) {
	      var Component = chunk.getComponent();
	      var chunkSelectionState = curChunkSel ? curChunkSel.getPosition(chunk) : 'none';

	      return React.createElement(
	        'div',
	        {
	          className: 'component selection-' + chunkSelectionState + (editingChunk === chunk ? ' editing-chunk' : ' not-editing-chunk'),
	          'data-component-type': chunk.get('type'),
	          'data-component-index': index,
	          'data-page-index': pageIndex,
	          'data-oboid': chunk.cid,
	          'data-id': chunk.get('id'),
	          'data-server-index': chunk.get('index'),
	          'data-server-id': chunk.get('id'),
	          'data-server-derived-from': chunk.get('derivedFrom'),
	          'data-changed': chunk.dirty,
	          'data-todo': chunk.get('index') + ':' + chunk.get('id'),
	          key: chunk.get('id')
	        },
	        React.createElement(Component, {
	          chunk: chunk,
	          saveAndRenderModuleFn: saveAndRenderModuleFn,
	          editChunk: editChunkFn,
	          stopEditing: stopEditingFn,
	          showModalFn: showModalFn,
	          isEditing: editingChunk === chunk,
	          selection: selection,
	          selectionState: chunkSelectionState,
	          updateSelectionFromDOMFn: updateSelectionFromDOMFn,
	          module: module,
	          chunkClipboard: chunkClipboard,
	          onKeyDownPutChunkOnClipboard: onKeyDownPutChunkOnClipboard,
	          shouldPreventTab: editingChunk !== null && editingChunk !== chunk
	        })
	      );
	    });;
	    return React.createElement(
	      'div',
	      {
	        className: 'editor--components--editor-page' + (editingChunk !== null ? ' editing' : ''),
	        key: this.state.key,
	        'data-cid': this.props.page.cid,
	        onKeyDown: this.onEvent,
	        onKeyPress: this.onEvent,
	        onKeyUp: this.onEvent,
	        onPaste: this.onEvent,
	        onCut: this.onEvent,
	        onCopy: this.onEvent,
	        onMouseDown: this.onEvent,
	        onMouseUp: this.onEvent,
	        onContextMenu: this.onEvent,
	        onInput: this.onEvent,
	        onClick: this.onClick,
	        ref: 'editor'
	      },
	      React.createElement(
	        'div',
	        {
	          className: 'chunks',
	          contentEditable: this.props.pageEdit,
	          suppressContentEditableWarning: true
	        },
	        chunks
	      ),
	      React.createElement(DeleteButton, { onClick: this.onDeleteButtonClick })
	    );
	  }
	});

	module.exports = EditorPage;

/***/ },
/* 142 */
/***/ function(module, exports) {

	"use strict";

	var LoadingModal;

	LoadingModal = React.createClass({
	  displayName: "LoadingModal",

	  render: function render() {
	    if (!this.props.show) {
	      return null;
	    }
	    return React.createElement(
	      "div",
	      { className: "loading-modal" },
	      "Loading......"
	    );
	  }
	});

	module.exports = LoadingModal;

/***/ },
/* 143 */
/***/ function(module, exports) {

	'use strict';

	var Modal;

	Modal = React.createClass({
	  displayName: 'Modal',

	  getInitialState: function getInitialState() {
	    return {
	      modalElement: null
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    var cloneEl;
	    if (nextProps.modalElement != null) {
	      cloneEl = React.cloneElement(nextProps.modalElement, {
	        modal: this
	      });
	      return this.setState({
	        modalElement: cloneEl
	      });
	    } else if (nextProps.modalElement === null) {
	      return this.setState({
	        modalElement: null
	      });
	    }
	  },
	  onButtonClick: function onButtonClick(modalElementClickFn) {
	    if (modalElementClickFn != null) {
	      return modalElementClickFn(this);
	    }
	    return this.close();
	  },
	  close: function close() {
	    return this.props.showModalFn(null);
	  },
	  render: function render() {
	    if (this.state.modalElement === null) {
	      return null;
	    }
	    return React.createElement('div', {
	      style: {
	        background: 'rgba(0, 0, 0, 0.2)',
	        position: 'absolute',
	        left: 0,
	        right: 0,
	        bottom: 0,
	        top: 0
	      }
	    }, [React.createElement('div', {
	      style: {
	        background: 'white',
	        position: 'absolute',
	        left: '50%',
	        top: '35%',
	        transform: 'translate(-50%,-50%)'
	      }
	    }, [this.state.modalElement.props.showCancelButton === false ? null : React.createElement('button', {
	      onClick: this.onButtonClick.bind(this, this.state.modalElement.props.cancel)
	    }, 'X'), this.state.modalElement])]);
	  }
	});

	module.exports = Modal;

/***/ },
/* 144 */
/***/ function(module, exports) {

	'use strict';

	var DOMSelection,
	    OboSelectionRect,
	    ObojoboDraft,
	    Selection,
	    SelectionBase,
	    VirtualSelection,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	ObojoboDraft = window.ObojoboDraft;

	SelectionBase = ObojoboDraft.selection.Selection;

	OboSelectionRect = ObojoboDraft.selection.OboSelectionRect;

	DOMSelection = ObojoboDraft.selection.DOMSelection;

	VirtualSelection = ObojoboDraft.selection.VirtualSelection;

	Selection = function (superClass) {
	  extend(Selection, superClass);

	  function Selection() {
	    return Selection.__super__.constructor.apply(this, arguments);
	  }

	  Selection.prototype.clear = function () {
	    Selection.__super__.clear.call(this);
	    this.commands = {};
	    this.textCommands = [];
	    return this.styles = {};
	  };

	  Selection.prototype.runTextCommands = function (label) {
	    var chunk, command, data, i, len, ref, results;
	    command = this.commands[label].commandFnByIndex[this.virtual.start.chunk.get('index')];
	    data = null;
	    if (command.onBeforeFn != null) {
	      data = command.onBeforeFn.apply(this, [this]);
	    }
	    ref = this.virtual.all;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      chunk = ref[i];
	      command = this.commands[label].commandFnByIndex[chunk.get('index')];
	      results.push(command.fn.apply(this, [this, chunk, data]));
	    }
	    return results;
	  };

	  Selection.prototype.update = function () {
	    Selection.__super__.update.call(this);
	    this.updateTextCommands();
	    return this.updateStyles();
	  };

	  Selection.prototype.updateTextCommands = function () {
	    var all, allCommands, chunk, command, commandFnByIndex, commands, i, j, label, len, len1, numChunks, type;
	    this.commands = {};
	    this.textCommands = [];
	    type = this.virtual.type;
	    if (type === 'none' || type === 'caret') {
	      return;
	    }
	    console.time('updateTextCommands');
	    allCommands = {};
	    all = this.virtual.all;
	    for (i = 0, len = all.length; i < len; i++) {
	      chunk = all[i];
	      commands = chunk.getTextMenuCommands(this);
	      if (commands == null) {
	        continue;
	      }
	      for (j = 0, len1 = commands.length; j < len1; j++) {
	        command = commands[j];
	        if (allCommands[command.label] != null) {
	          allCommands[command.label].count += 1;
	          allCommands[command.label].commandFnByIndex[chunk.get('index')] = command;
	        } else {
	          commandFnByIndex = {};
	          commandFnByIndex[chunk.get('index')] = command;
	          allCommands[command.label] = {
	            count: 1,
	            label: command.label,
	            image: command.image,
	            commandFnByIndex: commandFnByIndex
	          };
	        }
	      }
	    }
	    numChunks = all.length;
	    for (label in allCommands) {
	      command = allCommands[label];
	      if (command.count === numChunks) {
	        this.commands[command.label] = command;
	        this.textCommands.push(command);
	      }
	    }
	    return console.timeEnd('updateTextCommands');
	  };

	  Selection.prototype.updateStyles = function () {
	    var all, allStyles, chunk, i, len, numChunks, style, styles;
	    console.time('updateStyles');
	    this.styles = {};
	    all = this.virtual.all;
	    numChunks = all.length;
	    allStyles = {};
	    for (i = 0, len = all.length; i < len; i++) {
	      chunk = all[i];
	      styles = chunk.getSelectionStyles();
	      if (!styles) {
	        return;
	      }
	      for (style in styles) {
	        if (allStyles[style] == null) {
	          allStyles[style] = 1;
	        } else {
	          allStyles[style]++;
	        }
	      }
	    }
	    for (style in allStyles) {
	      if (allStyles[style] === numChunks) {
	        this.styles[style] = style;
	      }
	    }
	    return console.timeEnd('updateStyles');
	  };

	  return Selection;
	}(SelectionBase);

	module.exports = Selection;

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DOMUtil, HEIGHT, MARGIN, ObojoboDraft, SideMenu, SideMenuHandle, SideMenuList, WIDTH, dragula;

	__webpack_require__(205);

	__webpack_require__(200);

	SideMenuList = __webpack_require__(128);

	SideMenuHandle = __webpack_require__(146);

	dragula = __webpack_require__(199);

	ObojoboDraft = window.ObojoboDraft;

	DOMUtil = ObojoboDraft.page.DOMUtil;

	MARGIN = 15;

	WIDTH = 30;

	HEIGHT = 30;

	SideMenu = React.createClass({
	  displayName: 'SideMenu',

	  getInitialState: function getInitialState() {
	    return {
	      chunkRect: this.props.selection.chunkRect,
	      draggedNode: null
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (!nextProps.enabled) {
	      this.dragAndDropReady = false;
	    }
	    return this.setState({
	      chunkRect: nextProps.selection.chunkRect
	    });
	  },
	  onBeforeClick: function onBeforeClick(componentClass) {
	    return this.props.handlerFn('before', componentClass);
	  },
	  onAfterClick: function onAfterClick(componentClass) {
	    return this.props.handlerFn('after', componentClass);
	  },
	  setupDragAndDrop: function setupDragAndDrop() {
	    var thisEl;
	    if (this.dragAndDropReady) {
	      return;
	    }
	    if (this.drake) {
	      this.drake.destroy();
	    }
	    thisEl = ReactDOM.findDOMNode(this);
	    this.drake = dragula([this.props.controlsEl], {
	      moves: function moves(el) {
	        return el === thisEl;
	      }
	    });
	    this.drake.on('drag', this.onDrag);
	    return this.drake.on('dragend', this.onDragEnd);
	  },
	  onDrag: function onDrag(el) {
	    var chunk, chunkCloneEl, chunkEl, draggedContainer, i, len, ref;
	    this.props.onStartDrag();
	    draggedContainer = document.createElement('div');
	    draggedContainer.classList.add('dragged-container');
	    draggedContainer.style.width = this.state.chunkRect.width + 'px';
	    ref = this.props.selection.virtual.all;
	    for (i = 0, len = ref.length; i < len; i++) {
	      chunk = ref[i];
	      chunkEl = chunk.getDomEl();
	      chunkEl.classList.add('editor--components--side-menu--dragged');
	      chunkCloneEl = chunkEl.cloneNode(true);
	      chunkCloneEl.setAttribute('data-id', '0');
	      chunkCloneEl.classList.add('drag-clone');
	      draggedContainer.appendChild(chunkCloneEl);
	    }
	    document.addEventListener('mousemove', this.boundMouseMoveListener);
	    this.setState({
	      draggedNode: draggedContainer
	    });
	    return true;
	  },
	  onMouseMove: function onMouseMove(event) {
	    var chunk, chunkEl, el, i, j, k, l, len, len1, len2, len3, mouseChunk, mouseChunkEl, ref, ref1, ref2, ref3, selChunk, startChunk;
	    console.log(this.dragNewIndex);
	    if (!this.lastClientY) {
	      this.lastClientY = event.clientY;
	    }
	    if (event.clientY > this.lastClientY) {
	      this.direction = 'down';
	    } else if (event.clientY < this.lastClientY) {
	      this.direction = 'up';
	    }
	    this.lastClientY = event.clientY;
	    startChunk = this.props.selection.startChunk;
	    selChunk = startChunk.getDomEl();
	    el = document.elementFromPoint(window.innerWidth / 2, event.clientY);
	    mouseChunk = this.props.selection.page.chunks.get(DOMUtil.findParentAttr(el, 'data-id'));
	    if (mouseChunk == null) {
	      return;
	    }
	    mouseChunkEl = mouseChunk.getDomEl();
	    if (this.direction === 'down' && this.dragNewIndex > mouseChunk.get('index') || this.direction === 'up' && this.dragNewIndex < mouseChunk.get('index')) {
	      return;
	    }
	    this.dragNewIndex = mouseChunk.get('index');
	    console.log('DNI', mouseChunk.get('index'));
	    switch (this.direction) {
	      case 'up':
	        ref = Object.assign([], this.props.selection.virtual.all).reverse();
	        for (i = 0, len = ref.length; i < len; i++) {
	          chunk = ref[i];
	          this.props.selection.page.moveChunk(chunk, this.dragNewIndex);
	        }
	        ref1 = this.props.selection.page.chunks.models;
	        for (j = 0, len1 = ref1.length; j < len1; j++) {
	          chunk = ref1[j];
	          chunkEl = chunk.getDomEl();
	          chunkEl.parentElement.appendChild(chunkEl);
	        }
	        break;
	      case 'down':
	        ref2 = this.props.selection.virtual.all;
	        for (k = 0, len2 = ref2.length; k < len2; k++) {
	          chunk = ref2[k];
	          this.props.selection.page.moveChunk(chunk, this.dragNewIndex);
	        }
	        ref3 = this.props.selection.page.chunks.models;
	        for (l = 0, len3 = ref3.length; l < len3; l++) {
	          chunk = ref3[l];
	          chunkEl = chunk.getDomEl();
	          chunkEl.parentElement.appendChild(chunkEl);
	        }
	    }
	    this.props.renderModuleFn();
	    return true;
	  },
	  onDragEnd: function onDragEnd() {
	    delete this.lastClientY;
	    delete this.direction;
	    delete this.dragNewIndex;
	    document.removeEventListener('mousemove', this.boundMouseMoveListener);
	    this.props.onDrop();
	    return this.setState({
	      draggedNode: null
	    });
	  },
	  componentDidMount: function componentDidMount() {
	    return this.boundMouseMoveListener = this.onMouseMove;
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    return this.dragAndDropReady = false;
	  },
	  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	    var chunk, chunkEl, i, j, len, len1, ref, ref1, results, results1;
	    if (this.state.draggedNode != null) {
	      ref = this.props.selection.virtual.all;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        chunk = ref[i];
	        chunkEl = chunk.getDomEl();
	        results.push(chunkEl.classList.add('editor--components--side-menu--dragged'));
	      }
	      return results;
	    } else if (this.state.draggedNode == null && prevState.draggedNode != null) {
	      ref1 = this.props.selection.virtual.all;
	      results1 = [];
	      for (j = 0, len1 = ref1.length; j < len1; j++) {
	        chunk = ref1[j];
	        chunkEl = chunk.getDomEl();
	        results1.push(chunkEl.classList.remove('editor--components--side-menu--dragged'));
	      }
	      return results1;
	    }
	  },
	  render: function render() {
	    var bottom, chunkRect, ctrlRect, styles, top;
	    if (!this.props.enabled) {
	      return null;
	    }
	    chunkRect = this.state.chunkRect;
	    if (!chunkRect || !this.props.controlsEl) {
	      return null;
	    }
	    ctrlRect = this.props.controlsEl.getBoundingClientRect();
	    top = chunkRect.top - ctrlRect.top - MARGIN;
	    bottom = chunkRect.bottom - ctrlRect.top - MARGIN;
	    styles = {
	      top: top
	    };
	    return React.createElement(
	      'div',
	      { className: 'editor--components--side-menu' + (this.state.draggedNode ? ' dragging' : ''), style: styles, onMouseOver: this.setupDragAndDrop },
	      React.createElement(
	        'div',
	        { className: 'side-menu-container' },
	        React.createElement(SideMenuHandle, { yPos: HEIGHT / 2, height: bottom - top }),
	        React.createElement(SideMenuList, { insertItems: this.props.insertItems, onMouseDown: this.onBeforeClick, yPos: 0 }),
	        React.createElement(SideMenuList, { insertItems: this.props.insertItems, onMouseDown: this.onAfterClick, yPos: bottom - top })
	      ),
	      this.state.draggedNode ? React.createElement('div', { className: 'clone-container', ref: 'cloneContainer', dangerouslySetInnerHTML: { __html: this.state.draggedNode.outerHTML } }) : null
	    );
	  }
	});

	module.exports = SideMenu;

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SideMenuHandle, getBackgroundImage, img;

	__webpack_require__(206);

	img = __webpack_require__(234);

	getBackgroundImage = __webpack_require__(45).util.getBackgroundImage;

	SideMenuHandle = React.createClass({
	  displayName: 'SideMenuHandle',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      yPos: 0,
	      height: 0
	    };
	  },
	  render: function render() {
	    var styles;
	    styles = {
	      position: 'absolute',
	      left: 0,
	      top: this.props.yPos,
	      height: this.props.height,
	      backgroundImage: getBackgroundImage(img)
	    };
	    return React.createElement('div', {
	      className: 'editor--components--side-menu--side-menu-handle',
	      style: styles
	    });
	  }
	});

	module.exports = SideMenuHandle;

/***/ },
/* 147 */
/***/ function(module, exports) {

	"use strict";

	var StyleBrush;

	StyleBrush = function () {
	  function StyleBrush() {
	    this.clean();
	  }

	  StyleBrush.prototype.clean = function () {
	    this.toApply = new Set();
	    return this.toRemove = new Set();
	  };

	  StyleBrush.prototype.add = function (style, toRemove) {
	    if (toRemove == null) {
	      toRemove = false;
	    }
	    if (toRemove) {
	      if (this.toApply.has(style)) {
	        this.toApply["delete"](style);
	      }
	      return this.toRemove.add(style);
	    } else {
	      if (this.toRemove.has(style)) {
	        this.toRemove["delete"](style);
	      }
	      return this.toApply.add(style);
	    }
	  };

	  StyleBrush.prototype.getStyleState = function (style) {
	    if (this.toRemove.has(style)) {
	      return 'remove';
	    }
	    if (this.toApply.has(style)) {
	      return 'apply';
	    }
	    return null;
	  };

	  StyleBrush.prototype.toObject = function () {
	    return {
	      toApply: Array.from(this.toApply),
	      toRemove: Array.from(this.toRemove)
	    };
	  };

	  return StyleBrush;
	}();

	Object.defineProperties(StyleBrush.prototype, {
	  "isClean": {
	    get: function get() {
	      return this.toApply.size + this.toRemove.size === 0;
	    }
	  },
	  "stylesToApply": {
	    get: function get() {
	      var arr;
	      arr = [];
	      this.toApply.forEach(function (value) {
	        return arr.push(value);
	      });
	      return arr;
	    }
	  },
	  "stylesToRemove": {
	    get: function get() {
	      var arr;
	      arr = [];
	      this.toRemove.forEach(function (value) {
	        return arr.push(value);
	      });
	      return arr;
	    }
	  }
	});

	StyleBrush.fromObject = function (o) {
	  var sb;
	  sb = new StyleBrush();
	  sb.toApply = new Set(o.toApply);
	  sb.toRemove = new Set(o.toRemove);
	  return sb;
	};

	module.exports = StyleBrush;

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var LoadingModal;

	__webpack_require__(204);

	LoadingModal = React.createClass({
	  displayName: "LoadingModal",

	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "loading-modal" },
	      "LOADING..."
	    );
	  }
	});

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Toolbar, defaultToolbarClasses;

	__webpack_require__(208);

	defaultToolbarClasses = {
	  separator: __webpack_require__(152),
	  button: __webpack_require__(150),
	  toggle: __webpack_require__(153),
	  select: __webpack_require__(151)
	};

	Toolbar = React.createClass({
	  displayName: 'Toolbar',

	  statics: {
	    disabledStyles: {
	      opacity: 0.5,
	      pointerEvents: 'none'
	    }
	  },
	  getInitialState: function getInitialState() {
	    return {
	      selection: this.props.selection,
	      commands: this.props.commands
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    return this.setState({
	      selection: nextProps.selection,
	      commands: nextProps.commands
	    });
	  },
	  render: function render() {
	    var commandHandler, styles;
	    commandHandler = this.props.commandHandler;
	    styles = {};
	    if (!this.props.enabled) {
	      styles = Toolbar.disabledStyles;
	    }
	    return React.createElement('div', {
	      className: 'editor--components--toolbar',
	      style: styles
	    }, React.createElement('div', {
	      className: 'wrapper'
	    }, this.state.commands.map(function (command, index) {
	      var Component;
	      if (typeof command.type === 'string') {
	        Component = defaultToolbarClasses[command.type];
	      } else {
	        Component = command.type;
	      }
	      return React.createElement(Component, {
	        command: command,
	        commandHandler: commandHandler,
	        key: index
	      });
	    })));
	  }
	});

	module.exports = Toolbar;

/***/ },
/* 150 */
/***/ function(module, exports) {

	'use strict';

	var Button;

	Button = React.createClass({
	  displayName: 'Button',

	  onMouseDown: function onMouseDown(event) {
	    event.preventDefault();
	    return this.props.commandHandler(this.props.command);
	  },
	  render: function render() {
	    return React.createElement(
	      'a',
	      {
	        className: 'button',
	        onMouseDown: this.onMouseDown,
	        alt: this.props.command.label,
	        style: { backgroundImage: 'url("' + this.props.command.icon + '")' }
	      },
	      this.props.command.label
	    );
	  }
	});

	module.exports = Button;

/***/ },
/* 151 */
/***/ function(module, exports) {

	'use strict';

	var Select;

	Select = React.createClass({
	  displayName: 'Select',

	  getInitialState: function getInitialState() {
	    return {
	      selectedOption: 0
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    return this.setState({
	      selectedOption: nextProps.command.selectedOption
	    });
	  },
	  onChange: function onChange(event) {
	    this.setState({
	      selectedOption: event.target.value
	    });
	    this.props.command.selectedOption = event.target.value;
	    return this.props.commandHandler(this.props.command, {
	      option: event.target.value
	    });
	  },
	  render: function render() {
	    var opts, selectedOption;
	    selectedOption = this.state.selectedOption;
	    opts = this.props.command.options.map(function (option, index) {
	      return React.createElement('option', {
	        key: index,
	        value: option
	      }, option);
	    });
	    if (selectedOption === null) {
	      opts.push(React.createElement('option', {
	        key: -1,
	        value: -1,
	        selected: true
	      }, '---'));
	    }
	    return React.createElement('select', {
	      className: 'select',
	      onChange: this.onChange,
	      alt: this.props.command.label,
	      value: selectedOption
	    }, opts);
	  }
	});

	module.exports = Select;

/***/ },
/* 152 */
/***/ function(module, exports) {

	'use strict';

	var Separator;

	Separator = React.createClass({
	  displayName: 'Separator',

	  render: function render() {
	    return React.createElement('hr');
	  }
	});

	module.exports = Separator;

/***/ },
/* 153 */
/***/ function(module, exports) {

	'use strict';

	var Toggle;

	Toggle = React.createClass({
	  displayName: 'Toggle',

	  onMouseDown: function onMouseDown(event) {
	    event.preventDefault();
	    return this.props.commandHandler(this.props.command);
	  },
	  render: function render() {
	    return React.createElement('a', {
	      className: 'toggle ' + (this.props.command.state != null ? " " + this.props.command.state : ""),
	      onMouseDown: this.onMouseDown,
	      alt: this.props.command.label,
	      style: {
	        backgroundImage: 'url("' + this.props.command.icon + '")'
	      }
	    }, this.props.command.label);
	  }
	});

	module.exports = Toggle;

/***/ },
/* 154 */
/***/ function(module, exports) {

	"use strict";

	var Chunk, ChunkClipboard, ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	Chunk = ObojoboDraft.models.Chunk;

	ChunkClipboard = function () {
	  function ChunkClipboard() {
	    var e, ref;
	    this.chunks = {};
	    if (((ref = window.localStorage) != null ? ref.chunkClipboard : void 0) != null) {
	      try {
	        this.chunks = JSON.parse(window.localStorage.chunkClipboard);
	      } catch (error) {
	        e = error;
	      }
	    }
	  }

	  ChunkClipboard.prototype.clear = function () {
	    var ref;
	    this.chunks = {};
	    if (((ref = window.localStorage) != null ? ref.chunkClipboard : void 0) != null) {
	      return delete window.localStorage.chunkClipboard;
	    }
	  };

	  ChunkClipboard.prototype.storeChunksByText = function (chunks, text) {
	    var chunk, i, len, toStore;
	    this.clear();
	    toStore = [];
	    for (i = 0, len = chunks.length; i < len; i++) {
	      chunk = chunks[i];
	      toStore.push(chunk.toJSON());
	    }
	    this.chunks[text] = toStore;
	    return this.writeToLocalStorage();
	  };

	  ChunkClipboard.prototype.get = function (text) {
	    var chunk, chunks, i, len, newChunk, returns;
	    if (!this.chunks[text]) {
	      return null;
	    }
	    chunks = this.chunks[text];
	    returns = [];
	    for (i = 0, len = chunks.length; i < len; i++) {
	      chunk = chunks[i];
	      newChunk = new Chunk(chunk);
	      newChunk.assignNewId();
	      returns.push(newChunk);
	    }
	    return returns;
	  };

	  ChunkClipboard.prototype.writeToLocalStorage = function () {
	    var e;
	    if (window.localStorage != null) {
	      try {
	        return window.localStorage.chunkClipboard = JSON.stringify(this.chunks);
	      } catch (error) {
	        e = error;
	      }
	    }
	  };

	  return ChunkClipboard;
	}();

	module.exports = ChunkClipboard;

/***/ },
/* 155 */
/***/ function(module, exports) {

	'use strict';

	var History;

	History = function () {
	  function History() {
	    this.stack = [];
	    this.ptr = 0;
	  }

	  History.prototype.add = function (o) {
	    if (this.ptr < this.stack.length - 1) {
	      this.stack.splice(this.ptr, 2e308);
	    }
	    o = JSON.stringify(o);
	    if (this.length > 0 && this.stack[this.length - 1] === o) {
	      return false;
	    }
	    this.stack.push(o);
	    this.ptr = this.stack.length - 1;
	    return true;
	  };

	  History.prototype.undo = function () {
	    this.ptr = Math.max(this.ptr - 1, 0);
	    return this.current;
	  };

	  History.prototype.redo = function () {
	    this.ptr = Math.min(this.ptr + 1, this.stack.length - 1);
	    return this.current;
	  };

	  History.prototype.__debug_print = function () {
	    var i, j, len, o, ref, results, s;
	    console.log('HISTORY:');
	    ref = this.stack;
	    results = [];
	    for (i = j = 0, len = ref.length; j < len; i = ++j) {
	      o = ref[i];
	      s = '   ';
	      if (i === this.ptr) {
	        s = '-->';
	      }
	      o = JSON.parse(o);
	      results.push(console.log(i + '.', s, JSON.stringify(o.module.chunks[0].content.textGroup[0].text.value, null, 4), o.selection.start.index, o.selection.start.data.groupIndex, o.selection.start.data.offset, o.selection.end.index, o.selection.end.data.groupIndex, o.selection.end.data.offset));
	    }
	    return results;
	  };

	  return History;
	}();

	Object.defineProperties(History.prototype, {
	  "length": {
	    get: function get() {
	      return this.stack.length;
	    }
	  },
	  "current": {
	    get: function get() {
	      return JSON.parse(this.stack[this.ptr]);
	    }
	  }
	});

	module.exports = History;

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  components: {
	    EditorApp: __webpack_require__(140)
	  },
	  chunk: {
	    BaseCommandHandler: __webpack_require__(44),
	    focusableChunk: {
	      FocusableCommandHandler: __webpack_require__(127),
	      ToggleCommandHandler: __webpack_require__(135)
	    },
	    textChunk: {
	      TextGroupCommandHandler: __webpack_require__(137)
	    }
	  }
	};

/***/ },
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ticky = __webpack_require__(259);

	module.exports = function debounce (fn, args, ctx) {
	  if (!fn) { return; }
	  ticky(function run () {
	    fn.apply(ctx || null, args || []);
	  });
	};


/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var atoa = __webpack_require__(129);
	var debounce = __webpack_require__(193);

	module.exports = function emitter (thing, options) {
	  var opts = options || {};
	  var evt = {};
	  if (thing === undefined) { thing = {}; }
	  thing.on = function (type, fn) {
	    if (!evt[type]) {
	      evt[type] = [fn];
	    } else {
	      evt[type].push(fn);
	    }
	    return thing;
	  };
	  thing.once = function (type, fn) {
	    fn._once = true; // thing.off(fn) still works!
	    thing.on(type, fn);
	    return thing;
	  };
	  thing.off = function (type, fn) {
	    var c = arguments.length;
	    if (c === 1) {
	      delete evt[type];
	    } else if (c === 0) {
	      evt = {};
	    } else {
	      var et = evt[type];
	      if (!et) { return thing; }
	      et.splice(et.indexOf(fn), 1);
	    }
	    return thing;
	  };
	  thing.emit = function () {
	    var args = atoa(arguments);
	    return thing.emitterSnapshot(args.shift()).apply(this, args);
	  };
	  thing.emitterSnapshot = function (type) {
	    var et = (evt[type] || []).slice(0);
	    return function () {
	      var args = atoa(arguments);
	      var ctx = this || thing;
	      if (type === 'error' && opts.throws !== false && !et.length) { throw args.length === 1 ? args[0] : args; }
	      et.forEach(function emitter (listen) {
	        if (opts.async) { debounce(listen, args, ctx); } else { listen.apply(ctx, args); }
	        if (listen._once) { thing.off(type, listen); }
	      });
	      return thing;
	    };
	  };
	  return thing;
	};


/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var customEvent = __webpack_require__(197);
	var eventmap = __webpack_require__(196);
	var doc = global.document;
	var addEvent = addEventEasy;
	var removeEvent = removeEventEasy;
	var hardCache = [];

	if (!global.addEventListener) {
	  addEvent = addEventHard;
	  removeEvent = removeEventHard;
	}

	module.exports = {
	  add: addEvent,
	  remove: removeEvent,
	  fabricate: fabricateEvent
	};

	function addEventEasy (el, type, fn, capturing) {
	  return el.addEventListener(type, fn, capturing);
	}

	function addEventHard (el, type, fn) {
	  return el.attachEvent('on' + type, wrap(el, type, fn));
	}

	function removeEventEasy (el, type, fn, capturing) {
	  return el.removeEventListener(type, fn, capturing);
	}

	function removeEventHard (el, type, fn) {
	  var listener = unwrap(el, type, fn);
	  if (listener) {
	    return el.detachEvent('on' + type, listener);
	  }
	}

	function fabricateEvent (el, type, model) {
	  var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
	  if (el.dispatchEvent) {
	    el.dispatchEvent(e);
	  } else {
	    el.fireEvent('on' + type, e);
	  }
	  function makeClassicEvent () {
	    var e;
	    if (doc.createEvent) {
	      e = doc.createEvent('Event');
	      e.initEvent(type, true, true);
	    } else if (doc.createEventObject) {
	      e = doc.createEventObject();
	    }
	    return e;
	  }
	  function makeCustomEvent () {
	    return new customEvent(type, { detail: model });
	  }
	}

	function wrapperFactory (el, type, fn) {
	  return function wrapper (originalEvent) {
	    var e = originalEvent || global.event;
	    e.target = e.target || e.srcElement;
	    e.preventDefault = e.preventDefault || function preventDefault () { e.returnValue = false; };
	    e.stopPropagation = e.stopPropagation || function stopPropagation () { e.cancelBubble = true; };
	    e.which = e.which || e.keyCode;
	    fn.call(el, e);
	  };
	}

	function wrap (el, type, fn) {
	  var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
	  hardCache.push({
	    wrapper: wrapper,
	    element: el,
	    type: type,
	    fn: fn
	  });
	  return wrapper;
	}

	function unwrap (el, type, fn) {
	  var i = find(el, type, fn);
	  if (i) {
	    var wrapper = hardCache[i].wrapper;
	    hardCache.splice(i, 1); // free up a tad of memory
	    return wrapper;
	  }
	}

	function find (el, type, fn) {
	  var i, item;
	  for (i = 0; i < hardCache.length; i++) {
	    item = hardCache[i];
	    if (item.element === el && item.type === type && item.fn === fn) {
	      return i;
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 196 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var eventmap = [];
	var eventname = '';
	var ron = /^on/;

	for (eventname in global) {
	  if (ron.test(eventname)) {
	    eventmap.push(eventname.slice(2));
	  }
	}

	module.exports = eventmap;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 197 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	var NativeCustomEvent = global.CustomEvent;

	function useNative () {
	  try {
	    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
	    return  'cat' === p.type && 'bar' === p.detail.foo;
	  } catch (e) {
	  }
	  return false;
	}

	/**
	 * Cross-browser `CustomEvent` constructor.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
	 *
	 * @public
	 */

	module.exports = useNative() ? NativeCustomEvent :

	// IE >= 9
	'function' === typeof document.createEvent ? function CustomEvent (type, params) {
	  var e = document.createEvent('CustomEvent');
	  if (params) {
	    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
	  } else {
	    e.initCustomEvent(type, false, false, void 0);
	  }
	  return e;
	} :

	// IE <= 8
	function CustomEvent (type, params) {
	  var e = document.createEventObject();
	  e.type = type;
	  if (params) {
	    e.bubbles = Boolean(params.bubbles);
	    e.cancelable = Boolean(params.cancelable);
	    e.detail = params.detail;
	  } else {
	    e.bubbles = false;
	    e.cancelable = false;
	    e.detail = void 0;
	  }
	  return e;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 198 */
/***/ function(module, exports) {

	'use strict';

	var cache = {};
	var start = '(?:^|\\s)';
	var end = '(?:\\s|$)';

	function lookupClass (className) {
	  var cached = cache[className];
	  if (cached) {
	    cached.lastIndex = 0;
	  } else {
	    cache[className] = cached = new RegExp(start + className + end, 'g');
	  }
	  return cached;
	}

	function addClass (el, className) {
	  var current = el.className;
	  if (!current.length) {
	    el.className = className;
	  } else if (!lookupClass(className).test(current)) {
	    el.className += ' ' + className;
	  }
	}

	function rmClass (el, className) {
	  el.className = el.className.replace(lookupClass(className), ' ').trim();
	}

	module.exports = {
	  add: addClass,
	  rm: rmClass
	};


/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var emitter = __webpack_require__(194);
	var crossvent = __webpack_require__(195);
	var classes = __webpack_require__(198);
	var doc = document;
	var documentElement = doc.documentElement;

	function dragula (initialContainers, options) {
	  var len = arguments.length;
	  if (len === 1 && Array.isArray(initialContainers) === false) {
	    options = initialContainers;
	    initialContainers = [];
	  }
	  var _mirror; // mirror image
	  var _source; // source container
	  var _item; // item being dragged
	  var _offsetX; // reference x
	  var _offsetY; // reference y
	  var _moveX; // reference move x
	  var _moveY; // reference move y
	  var _initialSibling; // reference sibling when grabbed
	  var _currentSibling; // reference sibling now
	  var _copy; // item used for copying
	  var _renderTimer; // timer for setTimeout renderMirrorImage
	  var _lastDropTarget = null; // last container item was over
	  var _grabbed; // holds mousedown context until first mousemove

	  var o = options || {};
	  if (o.moves === void 0) { o.moves = always; }
	  if (o.accepts === void 0) { o.accepts = always; }
	  if (o.invalid === void 0) { o.invalid = invalidTarget; }
	  if (o.containers === void 0) { o.containers = initialContainers || []; }
	  if (o.isContainer === void 0) { o.isContainer = never; }
	  if (o.copy === void 0) { o.copy = false; }
	  if (o.copySortSource === void 0) { o.copySortSource = false; }
	  if (o.revertOnSpill === void 0) { o.revertOnSpill = false; }
	  if (o.removeOnSpill === void 0) { o.removeOnSpill = false; }
	  if (o.direction === void 0) { o.direction = 'vertical'; }
	  if (o.ignoreInputTextSelection === void 0) { o.ignoreInputTextSelection = true; }
	  if (o.mirrorContainer === void 0) { o.mirrorContainer = doc.body; }

	  var drake = emitter({
	    containers: o.containers,
	    start: manualStart,
	    end: end,
	    cancel: cancel,
	    remove: remove,
	    destroy: destroy,
	    canMove: canMove,
	    dragging: false
	  });

	  if (o.removeOnSpill === true) {
	    drake.on('over', spillOver).on('out', spillOut);
	  }

	  events();

	  return drake;

	  function isContainer (el) {
	    return drake.containers.indexOf(el) !== -1 || o.isContainer(el);
	  }

	  function events (remove) {
	    var op = remove ? 'remove' : 'add';
	    touchy(documentElement, op, 'mousedown', grab);
	    touchy(documentElement, op, 'mouseup', release);
	  }

	  function eventualMovements (remove) {
	    var op = remove ? 'remove' : 'add';
	    touchy(documentElement, op, 'mousemove', startBecauseMouseMoved);
	  }

	  function movements (remove) {
	    var op = remove ? 'remove' : 'add';
	    crossvent[op](documentElement, 'selectstart', preventGrabbed); // IE8
	    crossvent[op](documentElement, 'click', preventGrabbed);
	  }

	  function destroy () {
	    events(true);
	    release({});
	  }

	  function preventGrabbed (e) {
	    if (_grabbed) {
	      e.preventDefault();
	    }
	  }

	  function grab (e) {
	    _moveX = e.clientX;
	    _moveY = e.clientY;

	    var ignore = whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
	    if (ignore) {
	      return; // we only care about honest-to-god left clicks and touch events
	    }
	    var item = e.target;
	    var context = canStart(item);
	    if (!context) {
	      return;
	    }
	    _grabbed = context;
	    eventualMovements();
	    if (e.type === 'mousedown') {
	      if (isInput(item)) { // see also: https://github.com/bevacqua/dragula/issues/208
	        item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
	      } else {
	        e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
	      }
	    }
	  }

	  function startBecauseMouseMoved (e) {
	    if (!_grabbed) {
	      return;
	    }
	    if (whichMouseButton(e) === 0) {
	      release({});
	      return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
	    }
	    // truthy check fixes #239, equality fixes #207
	    if (e.clientX !== void 0 && e.clientX === _moveX && e.clientY !== void 0 && e.clientY === _moveY) {
	      return;
	    }
	    if (o.ignoreInputTextSelection) {
	      var clientX = getCoord('clientX', e);
	      var clientY = getCoord('clientY', e);
	      var elementBehindCursor = doc.elementFromPoint(clientX, clientY);
	      if (isInput(elementBehindCursor)) {
	        return;
	      }
	    }

	    var grabbed = _grabbed; // call to end() unsets _grabbed
	    eventualMovements(true);
	    movements();
	    end();
	    start(grabbed);

	    var offset = getOffset(_item);
	    _offsetX = getCoord('pageX', e) - offset.left;
	    _offsetY = getCoord('pageY', e) - offset.top;

	    classes.add(_copy || _item, 'gu-transit');
	    renderMirrorImage();
	    drag(e);
	  }

	  function canStart (item) {
	    if (drake.dragging && _mirror) {
	      return;
	    }
	    if (isContainer(item)) {
	      return; // don't drag container itself
	    }
	    var handle = item;
	    while (getParent(item) && isContainer(getParent(item)) === false) {
	      if (o.invalid(item, handle)) {
	        return;
	      }
	      item = getParent(item); // drag target should be a top element
	      if (!item) {
	        return;
	      }
	    }
	    var source = getParent(item);
	    if (!source) {
	      return;
	    }
	    if (o.invalid(item, handle)) {
	      return;
	    }

	    var movable = o.moves(item, source, handle, nextEl(item));
	    if (!movable) {
	      return;
	    }

	    return {
	      item: item,
	      source: source
	    };
	  }

	  function canMove (item) {
	    return !!canStart(item);
	  }

	  function manualStart (item) {
	    var context = canStart(item);
	    if (context) {
	      start(context);
	    }
	  }

	  function start (context) {
	    if (isCopy(context.item, context.source)) {
	      _copy = context.item.cloneNode(true);
	      drake.emit('cloned', _copy, context.item, 'copy');
	    }

	    _source = context.source;
	    _item = context.item;
	    _initialSibling = _currentSibling = nextEl(context.item);

	    drake.dragging = true;
	    drake.emit('drag', _item, _source);
	  }

	  function invalidTarget () {
	    return false;
	  }

	  function end () {
	    if (!drake.dragging) {
	      return;
	    }
	    var item = _copy || _item;
	    drop(item, getParent(item));
	  }

	  function ungrab () {
	    _grabbed = false;
	    eventualMovements(true);
	    movements(true);
	  }

	  function release (e) {
	    ungrab();

	    if (!drake.dragging) {
	      return;
	    }
	    var item = _copy || _item;
	    var clientX = getCoord('clientX', e);
	    var clientY = getCoord('clientY', e);
	    var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
	    var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
	    if (dropTarget && ((_copy && o.copySortSource) || (!_copy || dropTarget !== _source))) {
	      drop(item, dropTarget);
	    } else if (o.removeOnSpill) {
	      remove();
	    } else {
	      cancel();
	    }
	  }

	  function drop (item, target) {
	    var parent = getParent(item);
	    if (_copy && o.copySortSource && target === _source) {
	      parent.removeChild(_item);
	    }
	    if (isInitialPlacement(target)) {
	      drake.emit('cancel', item, _source, _source);
	    } else {
	      drake.emit('drop', item, target, _source, _currentSibling);
	    }
	    cleanup();
	  }

	  function remove () {
	    if (!drake.dragging) {
	      return;
	    }
	    var item = _copy || _item;
	    var parent = getParent(item);
	    if (parent) {
	      parent.removeChild(item);
	    }
	    drake.emit(_copy ? 'cancel' : 'remove', item, parent, _source);
	    cleanup();
	  }

	  function cancel (revert) {
	    if (!drake.dragging) {
	      return;
	    }
	    var reverts = arguments.length > 0 ? revert : o.revertOnSpill;
	    var item = _copy || _item;
	    var parent = getParent(item);
	    var initial = isInitialPlacement(parent);
	    if (initial === false && reverts) {
	      if (_copy) {
	        if (parent) {
	          parent.removeChild(_copy);
	        }
	      } else {
	        _source.insertBefore(item, _initialSibling);
	      }
	    }
	    if (initial || reverts) {
	      drake.emit('cancel', item, _source, _source);
	    } else {
	      drake.emit('drop', item, parent, _source, _currentSibling);
	    }
	    cleanup();
	  }

	  function cleanup () {
	    var item = _copy || _item;
	    ungrab();
	    removeMirrorImage();
	    if (item) {
	      classes.rm(item, 'gu-transit');
	    }
	    if (_renderTimer) {
	      clearTimeout(_renderTimer);
	    }
	    drake.dragging = false;
	    if (_lastDropTarget) {
	      drake.emit('out', item, _lastDropTarget, _source);
	    }
	    drake.emit('dragend', item);
	    _source = _item = _copy = _initialSibling = _currentSibling = _renderTimer = _lastDropTarget = null;
	  }

	  function isInitialPlacement (target, s) {
	    var sibling;
	    if (s !== void 0) {
	      sibling = s;
	    } else if (_mirror) {
	      sibling = _currentSibling;
	    } else {
	      sibling = nextEl(_copy || _item);
	    }
	    return target === _source && sibling === _initialSibling;
	  }

	  function findDropTarget (elementBehindCursor, clientX, clientY) {
	    var target = elementBehindCursor;
	    while (target && !accepted()) {
	      target = getParent(target);
	    }
	    return target;

	    function accepted () {
	      var droppable = isContainer(target);
	      if (droppable === false) {
	        return false;
	      }

	      var immediate = getImmediateChild(target, elementBehindCursor);
	      var reference = getReference(target, immediate, clientX, clientY);
	      var initial = isInitialPlacement(target, reference);
	      if (initial) {
	        return true; // should always be able to drop it right back where it was
	      }
	      return o.accepts(_item, target, _source, reference);
	    }
	  }

	  function drag (e) {
	    if (!_mirror) {
	      return;
	    }
	    e.preventDefault();

	    var clientX = getCoord('clientX', e);
	    var clientY = getCoord('clientY', e);
	    var x = clientX - _offsetX;
	    var y = clientY - _offsetY;

	    _mirror.style.left = x + 'px';
	    _mirror.style.top = y + 'px';

	    var item = _copy || _item;
	    var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
	    var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
	    var changed = dropTarget !== null && dropTarget !== _lastDropTarget;
	    if (changed || dropTarget === null) {
	      out();
	      _lastDropTarget = dropTarget;
	      over();
	    }
	    var parent = getParent(item);
	    if (dropTarget === _source && _copy && !o.copySortSource) {
	      if (parent) {
	        parent.removeChild(item);
	      }
	      return;
	    }
	    var reference;
	    var immediate = getImmediateChild(dropTarget, elementBehindCursor);
	    if (immediate !== null) {
	      reference = getReference(dropTarget, immediate, clientX, clientY);
	    } else if (o.revertOnSpill === true && !_copy) {
	      reference = _initialSibling;
	      dropTarget = _source;
	    } else {
	      if (_copy && parent) {
	        parent.removeChild(item);
	      }
	      return;
	    }
	    if (
	      (reference === null && changed) ||
	      reference !== item &&
	      reference !== nextEl(item)
	    ) {
	      _currentSibling = reference;
	      dropTarget.insertBefore(item, reference);
	      drake.emit('shadow', item, dropTarget, _source);
	    }
	    function moved (type) { drake.emit(type, item, _lastDropTarget, _source); }
	    function over () { if (changed) { moved('over'); } }
	    function out () { if (_lastDropTarget) { moved('out'); } }
	  }

	  function spillOver (el) {
	    classes.rm(el, 'gu-hide');
	  }

	  function spillOut (el) {
	    if (drake.dragging) { classes.add(el, 'gu-hide'); }
	  }

	  function renderMirrorImage () {
	    if (_mirror) {
	      return;
	    }
	    var rect = _item.getBoundingClientRect();
	    _mirror = _item.cloneNode(true);
	    _mirror.style.width = getRectWidth(rect) + 'px';
	    _mirror.style.height = getRectHeight(rect) + 'px';
	    classes.rm(_mirror, 'gu-transit');
	    classes.add(_mirror, 'gu-mirror');
	    o.mirrorContainer.appendChild(_mirror);
	    touchy(documentElement, 'add', 'mousemove', drag);
	    classes.add(o.mirrorContainer, 'gu-unselectable');
	    drake.emit('cloned', _mirror, _item, 'mirror');
	  }

	  function removeMirrorImage () {
	    if (_mirror) {
	      classes.rm(o.mirrorContainer, 'gu-unselectable');
	      touchy(documentElement, 'remove', 'mousemove', drag);
	      getParent(_mirror).removeChild(_mirror);
	      _mirror = null;
	    }
	  }

	  function getImmediateChild (dropTarget, target) {
	    var immediate = target;
	    while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
	      immediate = getParent(immediate);
	    }
	    if (immediate === documentElement) {
	      return null;
	    }
	    return immediate;
	  }

	  function getReference (dropTarget, target, x, y) {
	    var horizontal = o.direction === 'horizontal';
	    var reference = target !== dropTarget ? inside() : outside();
	    return reference;

	    function outside () { // slower, but able to figure out any position
	      var len = dropTarget.children.length;
	      var i;
	      var el;
	      var rect;
	      for (i = 0; i < len; i++) {
	        el = dropTarget.children[i];
	        rect = el.getBoundingClientRect();
	        if (horizontal && (rect.left + rect.width / 2) > x) { return el; }
	        if (!horizontal && (rect.top + rect.height / 2) > y) { return el; }
	      }
	      return null;
	    }

	    function inside () { // faster, but only available if dropped inside a child element
	      var rect = target.getBoundingClientRect();
	      if (horizontal) {
	        return resolve(x > rect.left + getRectWidth(rect) / 2);
	      }
	      return resolve(y > rect.top + getRectHeight(rect) / 2);
	    }

	    function resolve (after) {
	      return after ? nextEl(target) : target;
	    }
	  }

	  function isCopy (item, container) {
	    return typeof o.copy === 'boolean' ? o.copy : o.copy(item, container);
	  }
	}

	function touchy (el, op, type, fn) {
	  var touch = {
	    mouseup: 'touchend',
	    mousedown: 'touchstart',
	    mousemove: 'touchmove'
	  };
	  var pointers = {
	    mouseup: 'pointerup',
	    mousedown: 'pointerdown',
	    mousemove: 'pointermove'
	  };
	  var microsoft = {
	    mouseup: 'MSPointerUp',
	    mousedown: 'MSPointerDown',
	    mousemove: 'MSPointerMove'
	  };
	  if (global.navigator.pointerEnabled) {
	    crossvent[op](el, pointers[type], fn);
	  } else if (global.navigator.msPointerEnabled) {
	    crossvent[op](el, microsoft[type], fn);
	  } else {
	    crossvent[op](el, touch[type], fn);
	    crossvent[op](el, type, fn);
	  }
	}

	function whichMouseButton (e) {
	  if (e.touches !== void 0) { return e.touches.length; }
	  if (e.which !== void 0 && e.which !== 0) { return e.which; } // see https://github.com/bevacqua/dragula/issues/261
	  if (e.buttons !== void 0) { return e.buttons; }
	  var button = e.button;
	  if (button !== void 0) { // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
	    return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
	  }
	}

	function getOffset (el) {
	  var rect = el.getBoundingClientRect();
	  return {
	    left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
	    top: rect.top + getScroll('scrollTop', 'pageYOffset')
	  };
	}

	function getScroll (scrollProp, offsetProp) {
	  if (typeof global[offsetProp] !== 'undefined') {
	    return global[offsetProp];
	  }
	  if (documentElement.clientHeight) {
	    return documentElement[scrollProp];
	  }
	  return doc.body[scrollProp];
	}

	function getElementBehindPoint (point, x, y) {
	  var p = point || {};
	  var state = p.className;
	  var el;
	  p.className += ' gu-hide';
	  el = doc.elementFromPoint(x, y);
	  p.className = state;
	  return el;
	}

	function never () { return false; }
	function always () { return true; }
	function getRectWidth (rect) { return rect.width || (rect.right - rect.left); }
	function getRectHeight (rect) { return rect.height || (rect.bottom - rect.top); }
	function getParent (el) { return el.parentNode === doc ? null : el.parentNode; }
	function isInput (el) { return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable(el); }
	function isEditable (el) {
	  if (!el) { return false; } // no parents were editable
	  if (el.contentEditable === 'false') { return false; } // stop the lookup
	  if (el.contentEditable === 'true') { return true; } // found a contentEditable element in the chain
	  return isEditable(getParent(el)); // contentEditable is set to 'inherit'
	}

	function nextEl (el) {
	  return el.nextElementSibling || manually();
	  function manually () {
	    var sibling = el;
	    do {
	      sibling = sibling.nextSibling;
	    } while (sibling && sibling.nodeType !== 1);
	    return sibling;
	  }
	}

	function getEventHost (e) {
	  // on touchend event, we have to use `e.changedTouches`
	  // see http://stackoverflow.com/questions/7192563/touchend-event-properties
	  // see https://github.com/bevacqua/dragula/issues/34
	  if (e.targetTouches && e.targetTouches.length) {
	    return e.targetTouches[0];
	  }
	  if (e.changedTouches && e.changedTouches.length) {
	    return e.changedTouches[0];
	  }
	  return e;
	}

	function getCoord (coord, e) {
	  var host = getEventHost(e);
	  var missMap = {
	    pageX: 'clientX', // IE8
	    pageY: 'clientY' // IE8
	  };
	  if (coord in missMap && !(coord in host) && missMap[coord] in host) {
	    coord = missMap[coord];
	  }
	  return host[coord];
	}

	module.exports = dragula;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 200 */
94,
/* 201 */,
/* 202 */
94,
/* 203 */
94,
/* 204 */
94,
/* 205 */
94,
/* 206 */
94,
/* 207 */
94,
/* 208 */
94,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
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
/* 224 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();

	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();

	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();

	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();

	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(224)))

/***/ },
/* 226 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_3' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 32 32' style='enable-background:new 0 0 32 32;' xml:space='preserve'%3E %3Cg transform='translate(0 1)'%3E %3Cpath d='M21.5,15c0.4,0.3,0.7,0.6,0.9,1s0.4,0.8,0.4,1.4c0,0.6-0.1,1.2-0.4,1.6s-0.6,0.8-1.1,1c-0.5,0.3-1.1,0.5-1.8,0.6 s-1.5,0.2-2.4,0.2h-6.5v-0.7c0.2,0,0.4,0,0.7-0.1s0.5-0.1,0.6-0.1c0.2-0.1,0.4-0.2,0.4-0.3s0.1-0.3,0.1-0.6v-8.8 c0-0.2,0-0.4-0.1-0.5S12,9.4,11.7,9.3c-0.2-0.1-0.4-0.1-0.6-0.2S10.7,9,10.5,9V8.3h6.8c1.7,0,2.9,0.2,3.7,0.7s1.1,1.2,1.1,2.1 c0,0.4-0.1,0.8-0.3,1.1s-0.4,0.6-0.7,0.8c-0.3,0.2-0.6,0.4-1,0.6s-0.8,0.3-1.3,0.4v0.2c0.5,0,0.9,0.1,1.4,0.3S21.1,14.8,21.5,15z M18.7,11.3c0-0.7-0.2-1.2-0.6-1.6s-1-0.6-1.8-0.6c-0.1,0-0.3,0-0.4,0s-0.3,0-0.5,0v4.6h0.5c0.9,0,1.6-0.2,2.1-0.7 S18.7,12,18.7,11.3z M19.3,17.3c0-0.9-0.3-1.5-0.8-2c-0.5-0.5-1.3-0.7-2.2-0.7c-0.1,0-0.3,0-0.4,0s-0.3,0-0.4,0v4.6 c0.1,0.2,0.2,0.4,0.5,0.6c0.3,0.1,0.6,0.2,1,0.2c0.7,0,1.3-0.2,1.7-0.7C19.1,18.8,19.3,18.1,19.3,17.3z'/%3E %3C/g%3E %3C/svg%3E"

/***/ },
/* 227 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_5' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 32 32' style='enable-background:new 0 0 32 32;' xml:space='preserve'%3E %3Cstyle type='text/css'%3E .st0%7Bopacity:0.6;%7D %3C/style%3E %3Cpolygon points='10.7,8.5 8.8,10 7,11.5 7,8.5 7,5.5 8.8,7 '/%3E %3Cg class='st0'%3E %3Crect x='13.8' y='8' width='11.2' height='1'/%3E %3Crect x='7' y='13' width='18' height='1'/%3E %3Crect x='7' y='18' width='18' height='1'/%3E %3Crect x='7' y='23' width='18' height='1'/%3E %3C/g%3E %3C/svg%3E"

/***/ },
/* 228 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_8' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 32 32' style='enable-background:new 0 0 32 32;' xml:space='preserve'%3E %3Cg%3E %3Cpath d='M15.1,16.9H9.8v-1.8h5.3V9.4h1.9v5.7h5.3v1.8h-5.3v5.7h-1.9V16.9z'/%3E %3C/g%3E %3C/svg%3E"

/***/ },
/* 229 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_4' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 32 32' style='enable-background:new 0 0 32 32;' xml:space='preserve'%3E %3Cg%3E %3Cpath d='M20,9.3l-0.1,0.6c-0.2,0-0.4,0-0.7,0.1s-0.5,0.1-0.7,0.1c-0.2,0.1-0.4,0.2-0.5,0.4s-0.2,0.3-0.2,0.5l-2.1,9.1 c0,0,0,0.1,0,0.1s0,0.1,0,0.1c0,0.1,0,0.2,0.1,0.3c0.1,0.1,0.2,0.2,0.3,0.2c0.1,0,0.3,0.1,0.6,0.1s0.5,0.1,0.7,0.1l-0.1,0.6h-5.6 l0.1-0.6c0.2,0,0.4,0,0.7-0.1s0.5-0.1,0.7-0.1c0.2-0.1,0.4-0.2,0.5-0.3s0.2-0.3,0.2-0.5l2.1-9.1c0-0.1,0-0.1,0-0.2s0-0.1,0-0.2 c0-0.1,0-0.2-0.1-0.3s-0.2-0.2-0.3-0.2S15.1,10,14.8,10s-0.5-0.1-0.6-0.1l0.1-0.6H20z'/%3E %3C/g%3E %3C/svg%3E"

/***/ },
/* 230 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_11' data-name='Layer 11' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cg transform='translate(3.5 9.5)'%3E%3Cpath d='M19,14.48a4,4,0,0,0-.38-1.6,4.47,4.47,0,0,0-1.23-1.6,4.38,4.38,0,0,0-2.79-1H7.16A4.42,4.42,0,0,0,5,18.59a4.27,4.27,0,0,0,2.11.54l4.53,0a5.65,5.65,0,0,1-.27-1.58H7.16A2.69,2.69,0,0,1,5.58,17a4.38,4.38,0,0,1-.42-.35,2.75,2.75,0,0,1-.83-2,2.83,2.83,0,0,1,2.83-2.83h7.42a.65.65,0,0,1,.18,0,2.75,2.75,0,0,1,2,1,2.57,2.57,0,0,1,.62,1.55.62.62,0,0,1,0,.24,2.74,2.74,0,0,1-.4,1.44.56.56,0,0,1-.08.13,3,3,0,0,1-.35.42,1.45,1.45,0,0,1-.34.29v0a.93.93,0,0,0,0,.3A1.22,1.22,0,0,0,17,18.43a4.5,4.5,0,0,0,1.84-2.36A4.73,4.73,0,0,0,19,14.71,1.22,1.22,0,0,0,19,14.48Z' transform='translate(-2.73 -10.29)'/%3E%3Cpath d='M24.84,12.88H20.31a5.87,5.87,0,0,1,.27,1.6h4.26a2.82,2.82,0,1,1,0,5.64H17.4a.54.54,0,0,1-.16,0,2.67,2.67,0,0,1-2-1,2.57,2.57,0,0,1-.62-1.55.51.51,0,0,1,0-.22A2.66,2.66,0,0,1,15,15.85a2.51,2.51,0,0,1,.75-.83.93.93,0,0,0,0-.3A1.22,1.22,0,0,0,15,13.58h0a4.45,4.45,0,0,0-1.82,2.35A4.84,4.84,0,0,0,13,17.3a1.06,1.06,0,0,0,0,.22,4,4,0,0,0,.38,1.6,4.47,4.47,0,0,0,1.23,1.6,4.34,4.34,0,0,0,2.78,1h7.44a4.41,4.41,0,1,0,0-8.83Zm-7.44,1.6H19a4,4,0,0,0-.38-1.6H17.4a4.35,4.35,0,0,0-.65,0,2.57,2.57,0,0,1,.62,1.55Z' transform='translate(-2.73 -10.29)'/%3E%3C/g%3E%3C/svg%3E"

/***/ },
/* 231 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_13' data-name='Layer 13' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cg transform='translate(7 10)'%3E%3Cpath fill-opacity='.7' d='M17.73,22.38H12.48v-.77l.89-.12q.37-.06.37-.3a.82.82,0,0,0-.12-.32q-.12-.22-.23-.41l-.8-1.21q-.51-.76-1.24-1.82-.6.75-1.12,1.47L9.17,20.41A2.32,2.32,0,0,0,9,20.7a.67.67,0,0,0-.09.28q0,.26.33.42a2.84,2.84,0,0,0,1,.23v.74H6v-.72a4.49,4.49,0,0,0,1.27-.56,4.4,4.4,0,0,0,.89-.82l1-1.28q.65-.82,1.67-2.21L9.39,14.72,8,12.69A2.78,2.78,0,0,0,7.29,12a1.9,1.9,0,0,0-1.1-.27v-.77h5v.77a5.68,5.68,0,0,0-.73,0c-.24,0-.36.1-.36.21a.49.49,0,0,0,.07.23,3.12,3.12,0,0,0,.17.28l.79,1.22q.54.82,1.16,1.74l.95-1.3q.54-.74,1-1.42a1.47,1.47,0,0,0,.09-.2.67.67,0,0,0,0-.24q0-.24-.4-.39a4.23,4.23,0,0,0-.76-.2v-.74h4.22v.72A4.93,4.93,0,0,0,16,12.2a3.65,3.65,0,0,0-.85.74q-.38.48-.91,1.17l-1.48,2,1.72,2.44q.66,1,1.33,2a3,3,0,0,0,.75.81,2.15,2.15,0,0,0,1.13.34Z' transform='translate(-6.01 -10.93)'/%3E%3Cpath d='M26.37,27.26h-7.1v-1a4.44,4.44,0,0,1,.57-.53q.36-.29.86-.63.3-.2.73-.45l1-.53a7.32,7.32,0,0,0,.92-.56,2.94,2.94,0,0,0,.59-.6,1.89,1.89,0,0,0,.28-.59,3.66,3.66,0,0,0,.11-1,1.75,1.75,0,0,0-.51-1.39,1.91,1.91,0,0,0-1.3-.44,2.29,2.29,0,0,0-.93.19,1.45,1.45,0,0,0-.66.53l.13.58a2.8,2.8,0,0,1,.08.65.68.68,0,0,1-.24.51,1,1,0,0,1-.71.22.7.7,0,0,1-.58-.26,1.11,1.11,0,0,1-.2-.7,1.69,1.69,0,0,1,.23-.82,2.64,2.64,0,0,1,.65-.76,3.33,3.33,0,0,1,1-.55,4,4,0,0,1,1.33-.21,4,4,0,0,1,2.47.69A2.21,2.21,0,0,1,26,21.43a3,3,0,0,1-.16,1,2.06,2.06,0,0,1-.53.8,4,4,0,0,1-.94.66q-.54.28-1.64.77-.66.3-1.23.62a6.39,6.39,0,0,0-.93.62h5.83Z' transform='translate(-6.01 -10.93)'/%3E%3C/g%3Eg%3E%3C/svg%3E"

/***/ },
/* 232 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_12' data-name='Layer 12' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cg transform='translate(7 3)'%3E%3Cpath fill-opacity='.7' d='M17.73,22.38H12.48v-.77l.89-.12q.37-.06.37-.3a.82.82,0,0,0-.12-.32q-.12-.22-.23-.41l-.8-1.21q-.51-.76-1.24-1.82-.6.75-1.12,1.47L9.17,20.41A2.32,2.32,0,0,0,9,20.7a.67.67,0,0,0-.09.28q0,.26.33.42a2.84,2.84,0,0,0,1,.23v.74H6v-.72a4.49,4.49,0,0,0,1.27-.56,4.4,4.4,0,0,0,.89-.82l1-1.28q.65-.82,1.67-2.21L9.39,14.72,8,12.69A2.78,2.78,0,0,0,7.29,12a1.9,1.9,0,0,0-1.1-.27v-.77h5v.77a5.68,5.68,0,0,0-.73,0c-.24,0-.36.1-.36.21a.49.49,0,0,0,.07.23,3.12,3.12,0,0,0,.17.28l.79,1.22q.54.82,1.16,1.74l.95-1.3q.54-.74,1-1.42a1.47,1.47,0,0,0,.09-.2.67.67,0,0,0,0-.24q0-.24-.4-.39a4.23,4.23,0,0,0-.76-.2v-.74h4.22v.72A4.93,4.93,0,0,0,16,12.2a3.65,3.65,0,0,0-.85.74q-.38.48-.91,1.17l-1.48,2,1.72,2.44q.66,1,1.33,2a3,3,0,0,0,.75.81,2.15,2.15,0,0,0,1.13.34Z' transform='translate(-6.01 -3.61)'/%3E%3Cpath d='M26.37,12h-7.1V11a4.44,4.44,0,0,1,.57-.53q.36-.29.86-.63.3-.2.73-.45l1-.53a7.32,7.32,0,0,0,.92-.56,2.94,2.94,0,0,0,.59-.6,1.89,1.89,0,0,0,.28-.59,3.66,3.66,0,0,0,.11-1,1.75,1.75,0,0,0-.51-1.39,1.91,1.91,0,0,0-1.3-.44,2.29,2.29,0,0,0-.93.19,1.45,1.45,0,0,0-.66.53l.13.58a2.8,2.8,0,0,1,.08.65.68.68,0,0,1-.24.51,1,1,0,0,1-.71.22.7.7,0,0,1-.58-.26,1.11,1.11,0,0,1-.2-.7,1.69,1.69,0,0,1,.23-.82,2.64,2.64,0,0,1,.65-.76,3.33,3.33,0,0,1,1-.55,4,4,0,0,1,1.33-.21,4,4,0,0,1,2.47.69A2.21,2.21,0,0,1,26,6.16a3,3,0,0,1-.16,1,2.06,2.06,0,0,1-.53.8,4,4,0,0,1-.94.66q-.54.28-1.64.77-.66.3-1.23.62a6.39,6.39,0,0,0-.93.62h5.83Z' transform='translate(-6.01 -3.61)'/%3E%3C/g%3E%3C/svg%3E"

/***/ },
/* 233 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_6' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 32 32' style='enable-background:new 0 0 32 32;' xml:space='preserve'%3E %3Cstyle type='text/css'%3E .st0%7Bopacity:0.6;%7D %3C/style%3E %3Cpolygon points='7,8.5 8.8,10 10.7,11.5 10.7,8.5 10.7,5.5 8.8,7 '/%3E %3Cg class='st0'%3E %3Crect x='13.8' y='8' width='11.2' height='1'/%3E %3Crect x='7' y='13' width='18' height='1'/%3E %3Crect x='7' y='18' width='18' height='1'/%3E %3Crect x='7' y='23' width='18' height='1'/%3E %3C/g%3E %3C/svg%3E"

/***/ },
/* 234 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_2' data-name='Layer 2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 7.48 10.48'%3E%3Cdefs%3E%3Cstyle%3E.c%7Bfill:black;fill-opacity:.5;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Ehandle%3C/title%3E%3Ccircle class='c' cx='0.74' cy='0.74' r='0.74'/%3E%3Ccircle class='c' cx='3.74' cy='0.74' r='0.74'/%3E%3Ccircle class='c' cx='6.74' cy='0.74' r='0.74'/%3E%3Ccircle class='c' cx='0.74' cy='4.74' r='0.74'/%3E%3Ccircle class='c' cx='3.74' cy='4.74' r='0.74'/%3E%3Ccircle class='c' cx='6.74' cy='4.74' r='0.74'/%3E%3Ccircle class='c' cx='0.74' cy='8.74' r='0.74'/%3E%3Ccircle class='c' cx='3.74' cy='8.74' r='0.74'/%3E%3Ccircle class='c' cx='6.74' cy='8.74' r='0.74'/%3E%3C/svg%3E"

/***/ },
/* 235 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_10' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 20 20' style='enable-background:new 0 0 20 20;' xml:space='preserve'%3E %3Cstyle type='text/css'%3E .st0%7Bfill:%23FFFFFF;%7D %3C/style%3E %3Cg%3E %3Cpath class='st0' d='M14.9,10.6c0.4,0.3,0.7,0.6,0.9,1s0.4,0.8,0.4,1.4c0,0.6-0.1,1.2-0.4,1.6s-0.6,0.8-1.1,1 c-0.5,0.3-1.1,0.5-1.8,0.6s-1.5,0.2-2.4,0.2H3.9v-0.7c0.2,0,0.4,0,0.7-0.1s0.5-0.1,0.6-0.1c0.2-0.1,0.4-0.2,0.4-0.3 s0.1-0.3,0.1-0.6V5.7c0-0.2,0-0.4-0.1-0.5S5.4,4.9,5.1,4.8C4.9,4.7,4.7,4.7,4.5,4.6S4,4.5,3.9,4.5V3.8h6.8c1.7,0,2.9,0.2,3.7,0.7 s1.1,1.2,1.1,2.1c0,0.4-0.1,0.8-0.3,1.1s-0.4,0.6-0.7,0.8c-0.3,0.2-0.6,0.4-1,0.6s-0.8,0.3-1.3,0.4v0.2c0.5,0,0.9,0.1,1.4,0.3 S14.5,10.3,14.9,10.6z M12,6.8c0-0.7-0.2-1.2-0.6-1.6s-1-0.6-1.8-0.6c-0.1,0-0.3,0-0.4,0s-0.3,0-0.5,0v4.6h0.5 c0.9,0,1.6-0.2,2.1-0.7S12,7.6,12,6.8z M12.7,12.8c0-0.9-0.3-1.5-0.8-2c-0.5-0.5-1.3-0.7-2.2-0.7c-0.1,0-0.3,0-0.4,0s-0.3,0-0.4,0 v4.6c0.1,0.2,0.2,0.4,0.5,0.6c0.3,0.1,0.6,0.2,1,0.2c0.7,0,1.3-0.2,1.7-0.7C12.4,14.3,12.7,13.7,12.7,12.8z'/%3E %3C/g%3E %3C/svg%3E"

/***/ },
/* 236 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='i' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 20 20' style='enable-background:new 0 0 20 20;' xml:space='preserve'%3E %3Cstyle type='text/css'%3E .st0%7Bfill:%23FFFFFF;%7D %3C/style%3E %3Cg%3E %3Cpath class='st0' d='M14.3,3.8l-0.1,0.6c-0.2,0-0.4,0-0.7,0.1s-0.5,0.1-0.7,0.1c-0.2,0.1-0.4,0.2-0.5,0.4S12,5.2,12,5.4l-2.1,9.1 c0,0,0,0.1,0,0.1s0,0.1,0,0.1c0,0.1,0,0.2,0.1,0.3c0.1,0.1,0.2,0.2,0.3,0.2c0.1,0,0.3,0.1,0.6,0.1s0.5,0.1,0.7,0.1l-0.1,0.6H5.7 l0.1-0.6c0.2,0,0.4,0,0.7-0.1s0.5-0.1,0.7-0.1c0.2-0.1,0.4-0.2,0.5-0.3s0.2-0.3,0.2-0.5l2.1-9.1c0-0.1,0-0.1,0-0.2s0-0.1,0-0.2 c0-0.1,0-0.2-0.1-0.3S9.9,4.7,9.7,4.7S9.4,4.5,9.1,4.5S8.6,4.4,8.5,4.3l0.1-0.6H14.3z'/%3E %3C/g%3E %3C/svg%3E"

/***/ },
/* 237 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='link' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 20 20' style='enable-background:new 0 0 20 20;' xml:space='preserve'%3E %3Cstyle type='text/css'%3E .st0%7Bfill:%23FFFFFF;%7D %3C/style%3E %3Cg%3E %3Cpath class='st0' d='M12.2,9c0-0.4-0.1-0.8-0.3-1.2c-0.2-0.5-0.5-0.8-0.9-1.2C10.5,6.2,9.8,6,9,6H3.6C1.9,6,0.4,7.4,0.4,9.2 c0,1.2,0.7,2.3,1.7,2.8c0.5,0.3,1,0.4,1.5,0.4l3.3,0c-0.1-0.4-0.2-0.7-0.2-1.1H3.6c-0.4,0-0.8-0.1-1.1-0.4 c-0.1-0.1-0.2-0.2-0.3-0.3c-0.4-0.4-0.6-0.9-0.6-1.4c0-1.1,0.9-2.1,2.1-2.1H9c0,0,0.1,0,0.1,0c0.6,0,1.1,0.3,1.4,0.7 C10.9,8.2,11,8.6,11.1,9c0,0.1,0,0.1,0,0.2c0,0.4-0.1,0.7-0.3,1c0,0,0,0.1-0.1,0.1c-0.1,0.1-0.2,0.2-0.3,0.3 c-0.1,0.1-0.2,0.2-0.2,0.2c0,0,0,0,0,0c0,0.1,0,0.1,0,0.2c0,0.4,0.2,0.7,0.6,0.8c0.6-0.4,1.1-1,1.3-1.7c0.1-0.3,0.2-0.6,0.2-1 C12.2,9.1,12.2,9.1,12.2,9z'/%3E %3Cpath class='st0' d='M16.5,7.9h-3.3c0.1,0.4,0.2,0.8,0.2,1.2h3.1c1.1,0,2.1,0.9,2.1,2.1c0,1.1-0.9,2-2.1,2h-5.4c0,0-0.1,0-0.1,0 c-0.6,0-1.1-0.3-1.4-0.7c-0.3-0.3-0.4-0.7-0.5-1.1c0,0,0-0.1,0-0.2c0-0.4,0.1-0.8,0.3-1.1c0.1-0.2,0.3-0.5,0.5-0.6 c0-0.1,0-0.1,0-0.2c0-0.4-0.2-0.7-0.6-0.8c0,0,0,0,0,0c-0.6,0.4-1.1,1-1.3,1.7c-0.1,0.3-0.2,0.6-0.2,1c0,0.1,0,0.1,0,0.2 c0,0.4,0.1,0.8,0.3,1.2c0.2,0.5,0.5,0.8,0.9,1.2c0.5,0.5,1.3,0.7,2,0.7h5.4c1.8,0,3.2-1.4,3.2-3.2C19.7,9.3,18.2,7.9,16.5,7.9z M11.1,9h1.1c0-0.4-0.1-0.8-0.3-1.2h-0.9c-0.2,0-0.3,0-0.5,0C10.9,8.2,11,8.6,11.1,9C11.1,9,11.1,9,11.1,9z'/%3E %3C/g%3E %3C/svg%3E"

/***/ },
/* 238 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='sub' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 20 20' style='enable-background:new 0 0 20 20;' xml:space='preserve'%3E %3Cstyle type='text/css'%3E .st0%7Bfill:%23FFFFFF;%7D %3C/style%3E %3Cg%3E %3Cpath class='st0' d='M10,13H7.3v-0.4c0.2,0,0.3,0,0.4-0.1c0.1,0,0.2-0.1,0.2-0.2c0,0,0-0.1-0.1-0.2S7.8,12.1,7.8,12 c-0.1-0.2-0.2-0.4-0.4-0.6c-0.2-0.3-0.4-0.6-0.6-0.9c-0.2,0.3-0.4,0.5-0.6,0.7C6,11.5,5.9,11.7,5.7,12c0,0-0.1,0.1-0.1,0.1 s0,0.1,0,0.1c0,0.1,0.1,0.2,0.2,0.2c0.1,0.1,0.3,0.1,0.5,0.1V13H4.1v-0.4c0.3-0.1,0.5-0.2,0.6-0.3s0.3-0.2,0.4-0.4 c0.1-0.2,0.3-0.4,0.5-0.6s0.5-0.6,0.8-1.1c-0.2-0.3-0.4-0.6-0.7-1s-0.5-0.8-0.7-1C5,8,4.8,7.8,4.7,7.7C4.6,7.7,4.4,7.6,4.2,7.6V7.2 h2.5v0.4c-0.1,0-0.2,0-0.4,0S6.1,7.7,6.1,7.7c0,0,0,0.1,0,0.1S6.2,7.9,6.3,8c0.1,0.1,0.2,0.3,0.4,0.6C6.8,8.9,7,9.2,7.2,9.5 c0.1-0.2,0.3-0.4,0.5-0.7c0.2-0.2,0.3-0.5,0.5-0.7c0,0,0-0.1,0-0.1s0-0.1,0-0.1c0-0.1-0.1-0.1-0.2-0.2S7.8,7.6,7.7,7.6V7.2h2.1v0.4 C9.5,7.7,9.3,7.8,9.1,7.9S8.8,8.1,8.7,8.2C8.6,8.4,8.4,8.6,8.2,8.8c-0.2,0.2-0.4,0.6-0.7,1c0.4,0.5,0.6,0.9,0.9,1.2 c0.2,0.3,0.4,0.7,0.7,1c0.1,0.2,0.2,0.3,0.4,0.4s0.3,0.2,0.6,0.2V13z'/%3E %3C/g%3E %3Cg%3E %3Cpath class='st0' d='M16.8,17h-5.5v-0.8c0.1-0.1,0.3-0.3,0.4-0.4c0.2-0.2,0.4-0.3,0.7-0.5c0.2-0.1,0.3-0.2,0.6-0.3s0.5-0.3,0.7-0.4 c0.3-0.2,0.5-0.3,0.7-0.4c0.2-0.1,0.3-0.3,0.5-0.5c0.1-0.1,0.2-0.3,0.2-0.5c0.1-0.2,0.1-0.4,0.1-0.8c0-0.5-0.1-0.8-0.4-1.1 c-0.3-0.2-0.6-0.3-1-0.3c-0.3,0-0.5,0-0.7,0.1s-0.4,0.2-0.5,0.4c0,0.1,0.1,0.3,0.1,0.4s0.1,0.3,0.1,0.5c0,0.1-0.1,0.3-0.2,0.4 s-0.3,0.2-0.5,0.2c-0.2,0-0.3-0.1-0.5-0.2s-0.2-0.3-0.2-0.5c0-0.2,0.1-0.4,0.2-0.6s0.3-0.4,0.5-0.6c0.2-0.2,0.5-0.3,0.8-0.4 s0.7-0.2,1-0.2c0.8,0,1.4,0.2,1.9,0.5s0.7,0.8,0.7,1.4c0,0.3,0,0.5-0.1,0.8c-0.1,0.2-0.2,0.4-0.4,0.6c-0.2,0.2-0.4,0.4-0.7,0.5 c-0.3,0.1-0.7,0.3-1.3,0.6c-0.3,0.2-0.7,0.3-0.9,0.5c-0.3,0.2-0.5,0.3-0.7,0.5h4.5V17z'/%3E %3C/g%3E %3C/svg%3E"

/***/ },
/* 239 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='sup' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 20 20' style='enable-background:new 0 0 20 20;' xml:space='preserve'%3E %3Cstyle type='text/css'%3E .st0%7Bfill:%23FFFFFF;%7D %3C/style%3E %3Cg%3E %3Cpath class='st0' d='M10,13H7.3v-0.4c0.2,0,0.3,0,0.4-0.1c0.1,0,0.2-0.1,0.2-0.2c0,0,0-0.1-0.1-0.2S7.8,12.1,7.8,12 c-0.1-0.2-0.2-0.4-0.4-0.6c-0.2-0.3-0.4-0.6-0.6-0.9c-0.2,0.3-0.4,0.5-0.6,0.7C6,11.5,5.9,11.7,5.7,12c0,0-0.1,0.1-0.1,0.1 s0,0.1,0,0.1c0,0.1,0.1,0.2,0.2,0.2c0.1,0.1,0.3,0.1,0.5,0.1V13H4.1v-0.4c0.3-0.1,0.5-0.2,0.6-0.3s0.3-0.2,0.4-0.4 c0.1-0.2,0.3-0.4,0.5-0.6s0.5-0.6,0.8-1.1c-0.2-0.3-0.4-0.6-0.7-1s-0.5-0.8-0.7-1C5,8,4.8,7.8,4.7,7.7C4.6,7.7,4.4,7.6,4.2,7.6V7.2 h2.5v0.4c-0.1,0-0.2,0-0.4,0S6.1,7.7,6.1,7.7c0,0,0,0.1,0,0.1S6.2,7.9,6.3,8c0.1,0.1,0.2,0.3,0.4,0.6C6.8,8.9,7,9.2,7.2,9.5 c0.1-0.2,0.3-0.4,0.5-0.7c0.2-0.2,0.3-0.5,0.5-0.7c0,0,0-0.1,0-0.1s0-0.1,0-0.1c0-0.1-0.1-0.1-0.2-0.2S7.8,7.6,7.7,7.6V7.2h2.1v0.4 C9.5,7.7,9.3,7.8,9.1,7.9S8.8,8.1,8.7,8.2C8.6,8.4,8.4,8.6,8.2,8.8c-0.2,0.2-0.4,0.6-0.7,1c0.4,0.5,0.6,0.9,0.9,1.2 c0.2,0.3,0.4,0.7,0.7,1c0.1,0.2,0.2,0.3,0.4,0.4s0.3,0.2,0.6,0.2V13z'/%3E %3C/g%3E %3Cg%3E %3Cpath class='st0' d='M16.8,10h-5.5V9.2c0.1-0.1,0.3-0.3,0.4-0.4c0.2-0.2,0.4-0.3,0.7-0.5c0.2-0.1,0.3-0.2,0.6-0.3s0.5-0.3,0.7-0.4 c0.3-0.2,0.5-0.3,0.7-0.4c0.2-0.1,0.3-0.3,0.5-0.5c0.1-0.1,0.2-0.3,0.2-0.5c0.1-0.2,0.1-0.4,0.1-0.8c0-0.5-0.1-0.8-0.4-1.1 c-0.3-0.2-0.6-0.3-1-0.3c-0.3,0-0.5,0-0.7,0.1s-0.4,0.2-0.5,0.4c0,0.1,0.1,0.3,0.1,0.4s0.1,0.3,0.1,0.5c0,0.1-0.1,0.3-0.2,0.4 s-0.3,0.2-0.5,0.2c-0.2,0-0.3-0.1-0.5-0.2s-0.2-0.3-0.2-0.5c0-0.2,0.1-0.4,0.2-0.6s0.3-0.4,0.5-0.6c0.2-0.2,0.5-0.3,0.8-0.4 s0.7-0.2,1-0.2c0.8,0,1.4,0.2,1.9,0.5s0.7,0.8,0.7,1.4c0,0.3,0,0.5-0.1,0.8c-0.1,0.2-0.2,0.4-0.4,0.6c-0.2,0.2-0.4,0.4-0.7,0.5 c-0.3,0.1-0.7,0.3-1.3,0.6c-0.3,0.2-0.7,0.3-0.9,0.5c-0.3,0.2-0.5,0.3-0.7,0.5h4.5V10z'/%3E %3C/g%3E %3C/svg%3E"

/***/ },
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
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {var si = typeof setImmediate === 'function', tick;
	if (si) {
	  tick = function (fn) { setImmediate(fn); };
	} else {
	  tick = function (fn) { setTimeout(fn, 0); };
	}

	module.exports = tick;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(260).setImmediate))

/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	var apply = Function.prototype.apply;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// setimmediate attaches itself to the global object
	__webpack_require__(225);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;


/***/ }
/******/ ])));