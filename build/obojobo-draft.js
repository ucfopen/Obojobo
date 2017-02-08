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

	module.exports = __webpack_require__(190);


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
/* 44 */,
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
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(201);

	window.ObojoboDraft = __webpack_require__(45);

/***/ },
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */
94
/******/ ])));