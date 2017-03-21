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
}({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(170);


/***/ },

/***/ 40:
/***/ function(module, exports) {

	'use strict';

	var ListStyle, ListStyles, getDefaultBulletStyle, getStyleWithDefaults, orderedDefaultBulletStyles, unorderedDefaultBulletStyles;

	getDefaultBulletStyle = function getDefaultBulletStyle(indent, type) {
	  var defaults;
	  defaults = type === 'ordered' ? orderedDefaultBulletStyles : unorderedDefaultBulletStyles;
	  return defaults[indent % defaults.length];
	};

	getStyleWithDefaults = function getStyleWithDefaults(indent, defaultType, style) {
	  var styleWithDefaults;
	  if (style == null) {
	    style = null;
	  }
	  styleWithDefaults = new ListStyle();
	  styleWithDefaults.type = (style != null ? style.type : void 0) ? style.type : defaultType;
	  styleWithDefaults.start = (style != null ? style.start : void 0) ? style.start : 1;
	  styleWithDefaults.bulletStyle = (style != null ? style.bulletStyle : void 0) ? style.bulletStyle : getDefaultBulletStyle(indent, styleWithDefaults.type);
	  return styleWithDefaults;
	};

	ListStyle = function () {
	  function ListStyle(opts) {
	    if (opts == null) {
	      opts = {};
	    }
	    this.type = opts.type || null;
	    this.start = opts.start || null;
	    this.bulletStyle = opts.bulletStyle || null;
	  }

	  ListStyle.prototype.toDescriptor = function () {
	    return {
	      type: this.type || null,
	      start: this.start || null,
	      bulletStyle: this.bulletStyle || null
	    };
	  };

	  ListStyle.prototype.clone = function () {
	    return new ListStyle(this);
	  };

	  return ListStyle;
	}();

	ListStyles = function () {
	  function ListStyles(type) {
	    this.type = type;
	    this.styles = {};
	  }

	  ListStyles.prototype.init = function () {
	    this.type = ListStyles.TYPE_UNORDERED;
	    return this.styles = {};
	  };

	  ListStyles.prototype.set = function (indent, opts) {
	    return this.styles[indent] = new ListStyle(opts);
	  };

	  ListStyles.prototype.get = function (indent) {
	    return getStyleWithDefaults(indent, this.type, this.styles[indent]);
	  };

	  ListStyles.prototype.getSetStyles = function (indent) {
	    var style;
	    style = this.styles[indent];
	    if (!style) {
	      return new ListStyle();
	    }
	    return style;
	  };

	  ListStyles.prototype.toDescriptor = function () {
	    var desc, indent, ref, style;
	    desc = {
	      type: this.type,
	      indents: {}
	    };
	    ref = this.styles;
	    for (indent in ref) {
	      style = ref[indent];
	      desc.indents[indent] = style.toDescriptor();
	    }
	    return desc;
	  };

	  ListStyles.prototype.clone = function () {
	    var clone, indent, ref, style;
	    clone = new ListStyles(this.type);
	    ref = this.styles;
	    for (indent in ref) {
	      style = ref[indent];
	      clone.styles[indent] = style.clone();
	    }
	    return clone;
	  };

	  ListStyles.prototype.map = function (fn) {
	    var indent, ref, results, style;
	    ref = this.styles;
	    results = [];
	    for (indent in ref) {
	      style = ref[indent];
	      results.push(fn(style, indent));
	    }
	    return results;
	  };

	  return ListStyles;
	}();

	ListStyles.fromDescriptor = function (descriptor) {
	  var indent, ref, style, styles;
	  styles = new ListStyles(descriptor.type);
	  ref = descriptor.indents;
	  for (indent in ref) {
	    style = ref[indent];
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

	unorderedDefaultBulletStyles = [ListStyles.STYLE_FILLED_CIRCLE, ListStyles.STYLE_HOLLOW_CIRCLE, ListStyles.STYLE_SQUARE];

	orderedDefaultBulletStyles = [ListStyles.STYLE_NUMERIC, ListStyles.STYLE_UPPERCASE_LETTER, ListStyles.STYLE_UPPERCASE_ROMAN, ListStyles.STYLE_LOWERCASE_LETTER, ListStyles.STYLE_LOWERCASE_ROMAN];

	module.exports = ListStyles;

/***/ },

/***/ 87:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk, List, ListStyles, MockElement, MockTextNode, ObojoboDraft, SelectionHandler, TextChunk, TextGroup, TextGroupEl, selectionHandler;

	__webpack_require__(105);

	ListStyles = __webpack_require__(40);

	ObojoboDraft = window.ObojoboDraft;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	Chunk = ObojoboDraft.models.Chunk;

	MockElement = ObojoboDraft.mockDOM.MockElement;

	MockTextNode = ObojoboDraft.mockDOM.MockTextNode;

	TextChunk = ObojoboDraft.chunk.TextChunk;

	SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;

	selectionHandler = new SelectionHandler();

	List = React.createClass({
	  displayName: 'List',

	  statics: {
	    type: 'ObojoboDraft.Chunks.List',
	    register: function register() {
	      return OBO.registerChunk(List);
	    },
	    getSelectionHandler: function getSelectionHandler(chunk) {
	      return selectionHandler;
	    },
	    createNewNodeData: function createNewNodeData() {
	      return {
	        textGroup: TextGroup.create(2e308, {
	          indent: 0
	        }),
	        indent: 0,
	        listStyles: new ListStyles('unordered')
	      };
	    },
	    cloneNodeData: function cloneNodeData(data) {
	      return {
	        textGroup: data.textGroup.clone(),
	        indent: data.indent,
	        listStyles: data.listStyles.clone()
	      };
	    },
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      return {
	        textGroup: TextGroup.fromDescriptor(descriptor.content.textGroup, 2e308, {
	          indent: 0
	        }),
	        indent: 0,
	        listStyles: ListStyles.fromDescriptor(descriptor.content.listStyles)
	      };
	    },
	    getDataDescriptor: function getDataDescriptor(chunk) {
	      var data;
	      data = chunk.componentContent;
	      return {
	        indent: data.indent,
	        textGroup: data.textGroup.toDescriptor(),
	        listStyles: data.listStyles.toDescriptor()
	      };
	    }
	  },
	  createMockListElement: function createMockListElement(data, indentLevel) {
	    var el, style, tag;
	    style = data.listStyles.get(indentLevel);
	    tag = style.type === 'unordered' ? 'ul' : 'ol';
	    el = new MockElement(tag);
	    el.start = style.start;
	    el._listStyleType = style.bulletStyle;
	    return el;
	  },
	  addItemToList: function addItemToList(ul, li, lis) {
	    ul.addChild(li);
	    li.listStyleType = ul._listStyleType;
	    return lis.push(li);
	  },
	  render: function render() {
	    var curIndentLevel, curIndex, curUl, data, i, item, itemIndex, j, len, len1, li, lis, newLi, newUl, ref, ref1, ref2, ref3, ref4, ref5, ref6, rootUl, text, texts;
	    window.yeOldListHandler = List.commandHandler;
	    window.yeOldListChunk = this.props.chunk;
	    data = this.props.chunk.componentContent;
	    texts = data.textGroup;
	    curIndentLevel = 0;
	    curIndex = 0;
	    rootUl = curUl = this.createMockListElement(data, curIndentLevel);
	    lis = [];
	    li = new MockElement('li');
	    this.addItemToList(curUl, li, lis);
	    ref = texts.items;
	    for (itemIndex = i = 0, len = ref.length; i < len; itemIndex = ++i) {
	      item = ref[itemIndex];
	      if (item.data.indent < curIndentLevel) {
	        while (curIndentLevel > item.data.indent) {
	          curUl = curUl.parent.parent;
	          curIndentLevel--;
	        }
	      } else if (item.data.indent > curIndentLevel) {
	        while (curIndentLevel < item.data.indent) {
	          curIndentLevel++;
	          if (((ref1 = curUl.lastChild.lastChild) != null ? ref1.type : void 0) !== 'ul' && ((ref2 = curUl.lastChild.lastChild) != null ? ref2.type : void 0) !== 'ol') {
	            newUl = this.createMockListElement(data, curIndentLevel);
	            newLi = new MockElement('li');
	            this.addItemToList(newUl, newLi, lis);
	            curUl.lastChild.addChild(newUl);
	            curUl = newUl;
	          } else {
	            curUl = curUl.lastChild.lastChild;
	          }
	        }
	      }
	      if (!(((ref3 = curUl.lastChild) != null ? ref3.type : void 0) === 'li') || ((ref4 = curUl.lastChild) != null ? ref4.lastChild : void 0) != null) {
	        li = new MockElement('li');
	        this.addItemToList(curUl, li, lis);
	      }
	      text = new MockTextNode(item.text);
	      text.index = curIndex;
	      curIndex++;
	      curUl.lastChild.addChild(text);
	    }
	    for (j = 0, len1 = lis.length; j < len1; j++) {
	      li = lis[j];
	      if (((ref5 = li.children) != null ? (ref6 = ref5[0]) != null ? ref6.nodeType : void 0 : void 0) !== 'text') {
	        li.listStyleType = 'none';
	      }
	    }
	    return React.createElement(
	      TextChunk,
	      { className: 'obojobo-draft--chunks--list pad' },
	      React.createElement(
	        'div',
	        { 'data-indent': data.indent },
	        this.renderEl(rootUl, 0, 0)
	      )
	    );
	  },
	  renderEl: function renderEl(node, index, indent) {
	    var key;
	    key = this.props.chunk.cid + '-' + indent + '-' + index;
	    switch (node.nodeType) {
	      case 'text':
	        return React.createElement(TextGroupEl, { text: node.text, key: key, groupIndex: node.index });
	      case 'element':
	        return React.createElement(node.type, {
	          key: key,
	          start: node.start,
	          style: {
	            listStyleType: node.listStyleType
	          }
	        }, this.renderChildren(node.children, indent + 1));
	    }
	  },
	  renderChildren: function renderChildren(children, indent) {
	    var child, els, i, index, len;
	    els = [];
	    for (index = i = 0, len = children.length; i < len; index = ++i) {
	      child = children[index];
	      els.push(this.renderEl(child, index, indent));
	    }
	    return els;
	  }
	});

	List.register();

	module.exports = List;

/***/ },

/***/ 105:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 169:
/***/ function(module, exports) {

	'use strict';

	var Chunk,
	    CommandHandler,
	    Editor,
	    ObojoboDraft,
	    TextGroupCommandHandler,
	    TextGroupSelection,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	Editor = window.Editor;

	ObojoboDraft = window.ObojoboDraft;

	TextGroupCommandHandler = Editor.chunk.textChunk.TextGroupCommandHandler;

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	Chunk = ObojoboDraft.models.Chunk;

	module.exports = CommandHandler = function (superClass) {
	  extend(CommandHandler, superClass);

	  function CommandHandler() {
	    return CommandHandler.__super__.constructor.apply(this, arguments);
	  }

	  CommandHandler.prototype.recalculateStartValues = function (refTextGroup, listStyles) {
	    var i, indentLevel, indents, item, len, ref, results, startAddition, style;
	    indents = {};
	    ref = refTextGroup.items;
	    for (i = 0, len = ref.length; i < len; i++) {
	      item = ref[i];
	      indentLevel = item.data.indent;
	      if (indents[indentLevel] == null) {
	        indents[indentLevel] = 1;
	      } else {
	        indents[indentLevel]++;
	      }
	    }
	    results = [];
	    for (indentLevel in indents) {
	      startAddition = indents[indentLevel];
	      style = listStyles.getSetStyles(indentLevel);
	      if (style.start !== null) {
	        results.push(style.start += startAddition);
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
	  };

	  CommandHandler.prototype.onEnter = function (selection, chunk, shiftKey) {
	    var afterNode, caretInLastItem, data, inbetweenNode, item, tgs;
	    chunk.markDirty();
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    data = chunk.componentContent;
	    item = data.textGroup.get(tgs.start.groupIndex);
	    if (item.text.length !== 0) {
	      return chunk.splitText();
	    }
	    if (item.data.indent > 0) {
	      item.data.indent--;
	      tgs.setCaretToTextStart(tgs.start.groupIndex);
	      return;
	    }
	    caretInLastItem = tgs.start.text === data.textGroup.last.text;
	    if (!caretInLastItem) {
	      afterNode = chunk.clone();
	      afterNode.componentContent.textGroup = data.textGroup.splitBefore(tgs.start.groupIndex + 1);
	    }
	    inbetweenNode = Chunk.create();
	    data.textGroup.remove(tgs.start.groupIndex);
	    chunk.addChildAfter(inbetweenNode);
	    if (!caretInLastItem) {
	      this.recalculateStartValues(data.textGroup, afterNode.componentContent.listStyles);
	      inbetweenNode.addChildAfter(afterNode);
	    }
	    if (chunk.componentContent.textGroup.isEmpty) {
	      chunk.remove();
	    }
	    return inbetweenNode.selectStart();
	  };

	  CommandHandler.prototype.deleteSelection = function (selection, chunk) {
	    var selType, textGroup;
	    selType = selection.virtual.type;
	    textGroup = chunk.componentContent.textGroup;
	    CommandHandler.__super__.deleteSelection.call(this, selection, chunk);
	    if (textGroup.length === 1 && textGroup.first.text.length === 0 && selType === 'chunkSpan') {
	      return chunk.revert();
	    }
	  };

	  CommandHandler.prototype.deleteText = function (selection, chunk, deleteForwards) {
	    var bottom, data, middle, newChunk, s, tgs, top;
	    chunk.markDirty();
	    console.log('deleteText', this, this.recalculateStartValues);
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    data = chunk.componentContent;
	    s = tgs.start;
	    if (!deleteForwards && !s.isFirstText && s.isTextStart && s.textGroupItem.data.indent > 0) {
	      s.textGroupItem.data.indent--;
	      return true;
	    }
	    if (!deleteForwards && s.isTextStart && s.textGroupItem.data.indent === 0 && (s.groupIndex > 0 || data.indent === 0)) {
	      newChunk = Chunk.create();
	      newChunk.componentContent.textGroup.first.text = s.textGroupItem.text;
	      if (s.isFirstText) {
	        top = chunk;
	        bottom = chunk.clone();
	        bottom.componentContent.textGroup.toSlice(1);
	        this.recalculateStartValues(bottom.componentContent.textGroup, top.componentContent.listStyles);
	        top.replaceWith(newChunk);
	        newChunk.addChildAfter(bottom);
	      } else if (s.isLastText) {
	        top = chunk;
	        top.componentContent.textGroup.toSlice(0, data.textGroup.length - 1);
	        top.addChildAfter(newChunk);
	      } else {
	        top = chunk;
	        middle = newChunk;
	        bottom = chunk.clone();
	        top.componentContent.textGroup.toSlice(0, s.groupIndex);
	        bottom.componentContent.textGroup.toSlice(s.groupIndex + 2);
	        this.recalculateStartValues(top.componentContent.textGroup, bottom.componentContent.listStyles);
	        top.addChildAfter(middle);
	        middle.addChildAfter(bottom);
	      }
	      newChunk.selectStart();
	      return true;
	    }
	    return CommandHandler.__super__.deleteText.call(this, selection, chunk, deleteForwards);
	  };

	  return CommandHandler;
	}(TextGroupCommandHandler);

/***/ },

/***/ 170:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk, ChunkUtil, CommandHandler, List, ListDetector, ListStyles, OBO, ObojoboDraft, SelectionHandler, TextGroup, TextGroupSelection, Viewer, commandHandler, _onSelectionUpdate, selectionHandler;

	__webpack_require__(215);

	Viewer = __webpack_require__(87);

	ListStyles = __webpack_require__(40);

	ListDetector = __webpack_require__(171);

	CommandHandler = __webpack_require__(169);

	commandHandler = new CommandHandler();

	ObojoboDraft = window.ObojoboDraft;

	OBO = window.OBO;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	Chunk = ObojoboDraft.models.Chunk;

	ChunkUtil = ObojoboDraft.chunk.util.ChunkUtil;

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;

	selectionHandler = new SelectionHandler();

	_onSelectionUpdate = function onSelectionUpdate(toolbarItem, editorState, targetListType) {
	  var chunk, listType;
	  chunk = editorState.selection.startChunk;
	  if (editorState.selection.virtual.type === 'chunkSpan' || chunk == null || chunk.get('type') !== List.type) {
	    toolbarItem.state = 'off';
	    return;
	  }
	  listType = chunk.componentContent.listStyles.type;
	  return toolbarItem.state = listType === targetListType ? 'on' : 'off';
	};

	List = React.createClass({
	  displayName: 'List',

	  statics: {
	    type: 'ObojoboDraft.Chunks.List',
	    register: function register() {
	      OBO.registerChunk(List, {
	        insertItem: {
	          label: 'List',
	          icon: __webpack_require__(247),
	          onInsert: ObojoboDraft.chunk.util.Insert
	        }
	      });
	      OBO.registerToolbarItem({
	        id: 'insertUnorderedList',
	        type: 'toggle',
	        label: 'Unordered List',
	        icon: __webpack_require__(248),
	        onClick: function onClick(toolbarItem, editorState) {
	          var newChunk;
	          if (toolbarItem.state === 'on') {
	            newChunk = Chunk.create();
	          } else {
	            newChunk = Chunk.create(List);
	          }
	          return ChunkUtil.replaceTextsWithinSelection(editorState.selection, newChunk);
	        },
	        onSelectionUpdate: function onSelectionUpdate(toolbarItem, editorState, selection) {
	          return _onSelectionUpdate(toolbarItem, editorState, 'unordered');
	        }
	      });
	      OBO.registerToolbarItem({
	        id: 'insertOrderedList',
	        type: 'toggle',
	        label: 'Ordered List',
	        icon: __webpack_require__(249),
	        onClick: function onClick(toolbarItem, editorState) {
	          var newChunk;
	          if (toolbarItem.state === 'on') {
	            newChunk = Chunk.create();
	          } else {
	            newChunk = Chunk.create(List);
	            newChunk.componentContent.listStyles.type = 'ordered';
	          }
	          return ChunkUtil.replaceTextsWithinSelection(editorState.selection, newChunk);
	        },
	        onSelectionUpdate: function onSelectionUpdate(toolbarItem, editorState, selection) {
	          return _onSelectionUpdate(toolbarItem, editorState, 'ordered');
	        }
	      });
	      return OBO.registerTextListener({
	        match: function match(selection, editor) {
	          var chunk, listResults, listStyles, newChunk, ref, st, tgs;
	          if (selection.virtual.type === 'caret' && selection.startChunk.getComponent() === OBO.componentClassMap.defaultClass && ((ref = selection.startChunk.componentContent.textGroup) != null ? ref.first : void 0) != null) {
	            chunk = selection.startChunk;
	            tgs = new TextGroupSelection(chunk, selection.virtual);
	            st = tgs.start.textGroupItem.text.value;
	            listResults = ListDetector(st);
	            if (listResults) {
	              newChunk = Chunk.create(List);
	              if (listResults.type === 'ordered') {
	                listStyles = newChunk.componentContent.listStyles;
	                listStyles.type = 'ordered';
	                listStyles.set(0, {
	                  start: listResults.symbolIndex,
	                  bulletStyle: listResults.symbolStyle
	                });
	              }
	              chunk.addChildBefore(newChunk);
	              tgs.selectText(tgs.start.groupIndex);
	              newChunk.replaceSelection();
	              newChunk.deleteSelection();
	              return editor.renderModule();
	            }
	          }
	        }
	      });
	    },
	    getCommandHandler: function getCommandHandler(chunk) {
	      return commandHandler;
	    },
	    getSelectionHandler: function getSelectionHandler(chunk) {
	      return selectionHandler;
	    },
	    createNewNodeData: Viewer.createNewNodeData,
	    cloneNodeData: Viewer.cloneNodeData,
	    createNodeDataFromDescriptor: Viewer.createNodeDataFromDescriptor,
	    getDataDescriptor: Viewer.getDataDescriptor
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    return this.props.chunk.markUpdated();
	  },
	  shouldComponentUpdate: function shouldComponentUpdate() {
	    return this.props.chunk.needsUpdate;
	  },
	  render: function render() {
	    return React.createElement(Viewer, this.props);
	  }
	});

	List.register();

	module.exports = List;

/***/ },

/***/ 171:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ListStyles, getSymbolIndex, getSymbolStyle, looksLikeListItem, regexes, replace;

	ListStyles = __webpack_require__(40);

	regexes = {
	  bulletListItem: /^[ \t]*(\*)[ \t]+([\s\S]*)/,
	  numericListItem: /^[ \t]*([0-9]+|[A-Za-z]|VIII|VII|VI|IV|IX|III|II|viii|vii|vi|iv|ix|iii|ii)\.[ \t]+([\s\S]*)/,
	  symbolUpperRoman: /VIII|VII|VI|IV|IX|V|III|II|I/,
	  symbolLowerRoman: /viii|vii|vi|iv|ix|v|iii|ii|i/,
	  symbolUpperLetter: /[A-Z]+/,
	  symbolLowerLetter: /[a-z]+/,
	  symbolLeadingZeroNumber: /0+[0-9]+/,
	  symbolNumber: /[0-9]+/
	};

	looksLikeListItem = function looksLikeListItem(s) {
	  var bullet, numericList, result, symbolIndex, symbolStyle;
	  result = false;
	  if (s.length === 2) {
	    bullet = replace(s, 'bulletListItem');
	    if (bullet != null) {
	      result = {
	        type: ListStyles.TYPE_UNORDERED,
	        text: bullet.text,
	        index: bullet.text.length,
	        symbol: '*',
	        symbolIndex: 1,
	        defaultSymbol: true,
	        symbolStyle: ''
	      };
	    }
	  } else if (s.length === 3 || s.length === 4) {
	    numericList = replace(s, 'numericListItem');
	    if (numericList != null) {
	      symbolStyle = getSymbolStyle(numericList.symbol);
	      symbolIndex = getSymbolIndex(numericList.symbol, symbolStyle);
	      result = {
	        type: ListStyles.TYPE_ORDERED,
	        text: numericList.text,
	        index: numericList.text.length,
	        symbol: numericList.symbol,
	        symbolIndex: symbolIndex,
	        defaultSymbol: numericList.symbol === "1",
	        symbolStyle: symbolStyle
	      };
	    }
	  }
	  return result;
	};

	replace = function replace(s, regexName) {
	  var matches;
	  matches = regexes[regexName].exec(s);
	  if (matches == null || matches.length <= 1) {
	    return null;
	  }
	  return {
	    symbol: matches[1],
	    text: matches[2]
	  };
	};

	getSymbolStyle = function getSymbolStyle(symbol) {
	  var matches;
	  matches = regexes.symbolLeadingZeroNumber.exec(symbol);
	  if (matches) {
	    return ListStyles.STYLE_LEAD_ZERO_NUMERIC;
	  }
	  matches = regexes.symbolNumber.exec(symbol);
	  if (matches) {
	    return ListStyles.STYLE_NUMERIC;
	  }
	  matches = regexes.symbolUpperRoman.exec(symbol);
	  if (matches) {
	    return ListStyles.STYLE_UPPERCASE_ROMAN;
	  }
	  matches = regexes.symbolLowerRoman.exec(symbol);
	  if (matches) {
	    return ListStyles.STYLE_LOWERCASE_ROMAN;
	  }
	  matches = regexes.symbolUpperLetter.exec(symbol);
	  if (matches) {
	    return ListStyles.STYLE_UPPERCASE_LETTER;
	  }
	  matches = regexes.symbolLowerLetter.exec(symbol);
	  if (matches) {
	    return ListStyles.STYLE_LOWERCASE_LETTER;
	  }
	  return null;
	};

	getSymbolIndex = function getSymbolIndex(symbol, symbolStyle) {
	  switch (symbolStyle) {
	    case ListStyles.STYLE_NUMERIC:
	    case ListStyles.STYLE_LEAD_ZERO_NUMERIC:
	      return parseInt(symbol, 10);
	    case ListStyles.STYLE_LOWERCASE_LETTER:
	      return symbol.charCodeAt(0) - 96;
	    case ListStyles.STYLE_UPPERCASE_LETTER:
	      return symbol.charCodeAt(0) - 64;
	    case ListStyles.STYLE_LOWERCASE_ROMAN:
	    case ListStyles.STYLE_UPPERCASE_ROMAN:
	      switch (symbol.toLowerCase()) {
	        case 'i':
	          return 1;
	        case 'ii':
	          return 2;
	        case 'iii':
	          return 3;
	        case 'iv':
	          return 4;
	        case 'v':
	          return 5;
	        case 'vi':
	          return 6;
	        case 'vii':
	          return 7;
	        case 'viii':
	          return 8;
	        case 'xi':
	          return 9;
	        default:
	          return 1;
	      }
	      break;
	    default:
	      return 1;
	  }
	};

	module.exports = looksLikeListItem;

/***/ },

/***/ 215:
105,

/***/ 247:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15.04 14.32'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bopacity:0.55;%7D.cls-2%7Bfill:%23231f20;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Elist%3C/title%3E%3Cg class='cls-1'%3E%3Ccircle cx='1.48' cy='1.48' r='1.48'/%3E%3Ccircle cx='1.48' cy='7.16' r='1.48'/%3E%3Ccircle cx='1.48' cy='12.84' r='1.48'/%3E%3Crect class='cls-2' x='4.51' y='1.06' width='10.54' height='0.84'/%3E%3Crect class='cls-2' x='4.51' y='6.74' width='10.54' height='0.84'/%3E%3Crect class='cls-2' x='4.51' y='12.42' width='10.54' height='0.84'/%3E%3C/g%3E%3C/svg%3E"

/***/ },

/***/ 248:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 32 32' style='enable-background:new 0 0 32 32;' xml:space='preserve'%3E %3Cstyle type='text/css'%3E .st0%7Bdisplay:none;fill:%23E5E5E5;%7D %3C/style%3E %3Crect x='0' y='0' class='st0' width='32' height='32'/%3E %3Ccircle cx='7.8' cy='9.2' r='1.8'/%3E %3Ccircle cx='7.8' cy='16' r='1.8'/%3E %3Ccircle cx='7.8' cy='22.8' r='1.8'/%3E %3Crect x='14.4' y='8.7' width='12.6' height='1'/%3E %3Crect x='14.4' y='15.5' width='12.6' height='1'/%3E %3Crect x='14.4' y='22.3' width='12.6' height='1'/%3E %3C/svg%3E"

/***/ },

/***/ 249:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_2' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 32 32' style='enable-background:new 0 0 32 32;' xml:space='preserve'%3E %3Cstyle type='text/css'%3E .st0%7Bfill:none;stroke:%23000000;stroke-linecap:square;stroke-miterlimit:10;%7D %3C/style%3E %3Cline class='st0' x1='14.9' y1='9.2' x2='26.5' y2='9.2'/%3E %3Cline class='st0' x1='14.9' y1='16' x2='26.5' y2='16'/%3E %3Cline class='st0' x1='14.9' y1='22.8' x2='26.5' y2='22.8'/%3E %3Cg%3E %3Cpath d='M6.3,9.5h1.2V5.7H6.5V5.3C7,5.2,7.3,5.1,7.6,4.9h0.5v4.6h1.1V10H6.3V9.5z'/%3E %3Cpath d='M10.6,9.1c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5c-0.3,0-0.5-0.2-0.5-0.5C10.2,9.3,10.4,9.1,10.6,9.1z'/%3E %3Cpath d='M6,16.6c1.5-1.5,2.4-2.4,2.4-3.3c0-0.6-0.3-1-1-1c-0.4,0-0.8,0.3-1.1,0.6L6,12.6c0.4-0.5,0.9-0.8,1.5-0.8 c0.9,0,1.5,0.6,1.5,1.5c0,1-0.9,1.9-2.1,3.2c0.3,0,0.6,0,0.9,0h1.5V17H6V16.6z'/%3E %3Cpath d='M10.6,16.1c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5c-0.3,0-0.5-0.2-0.5-0.5C10.2,16.3,10.4,16.1,10.6,16.1z'/%3E %3Cpath d='M6.2,22.9c0.3,0.3,0.7,0.6,1.3,0.6c0.6,0,1.1-0.4,1.1-0.9c0-0.6-0.4-1-1.6-1v-0.5c1.1,0,1.4-0.4,1.4-1 c0-0.5-0.3-0.8-0.9-0.8c-0.4,0-0.8,0.2-1.1,0.5l-0.4-0.4c0.4-0.4,0.9-0.6,1.5-0.6c0.9,0,1.5,0.5,1.5,1.3c0,0.6-0.4,1-0.9,1.2v0 c0.6,0.1,1.1,0.6,1.1,1.3c0,0.9-0.7,1.5-1.7,1.5c-0.8,0-1.3-0.3-1.7-0.7L6.2,22.9z'/%3E %3Cpath d='M10.6,23.1c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5c-0.3,0-0.5-0.2-0.5-0.5C10.2,23.3,10.4,23.1,10.6,23.1z'/%3E %3C/g%3E %3C/svg%3E"

/***/ }

/******/ })));