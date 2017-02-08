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

	module.exports = __webpack_require__(177);


/***/ },

/***/ 90:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft, SelectionHandler, SingleText, TextChunk, TextGroup, TextGroupEl, selectionHandler;

	__webpack_require__(108);

	ObojoboDraft = window.ObojoboDraft;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	TextChunk = ObojoboDraft.chunk.TextChunk;

	SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;

	selectionHandler = new SelectionHandler();

	SingleText = React.createClass({
	  displayName: 'SingleText',

	  statics: {
	    type: 'ObojoboDraft.Chunks.SingleText',
	    register: function register() {
	      return OBO.registerChunk(SingleText, {
	        "default": true
	      });
	    },
	    getSelectionHandler: function getSelectionHandler(chunk) {
	      return selectionHandler;
	    },
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      return {
	        textGroup: TextGroup.fromDescriptor(descriptor.content.textGroup, 2e308, {
	          indent: 0
	        }),
	        type: descriptor.content.type
	      };
	    },
	    cloneNodeData: function cloneNodeData(data) {
	      var clone;
	      clone = data.textGroup.clone();
	      return {
	        textGroup: clone,
	        type: data.type
	      };
	    },
	    createNewNodeData: function createNewNodeData() {
	      return {
	        textGroup: TextGroup.create(2e308, {
	          indent: 0
	        }),
	        type: 'p'
	      };
	    },
	    getDataDescriptor: function getDataDescriptor(chunk) {
	      var data;
	      data = chunk.componentContent;
	      return {
	        textGroup: data.textGroup.toDescriptor(),
	        type: data.type
	      };
	    }
	  },
	  render: function render() {
	    var data, texts;
	    data = this.props.chunk.componentContent;
	    texts = data.textGroup.items.map(function (textItem, index) {
	      return React.createElement(TextGroupEl, { text: textItem.text, groupIndex: index, indent: textItem.data.indent, key: index });
	    });
	    return React.createElement(
	      TextChunk,
	      { className: 'obojobo-draft--chunks--single-text pad' },
	      React.createElement(
	        'p',
	        null,
	        texts
	      )
	    );
	  }
	});

	SingleText.register();

	module.exports = SingleText;

/***/ },

/***/ 108:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 176:
/***/ function(module, exports) {

	"use strict";

	var CommandHandler,
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

	module.exports = CommandHandler = function (superClass) {
	  extend(CommandHandler, superClass);

	  function CommandHandler() {
	    return CommandHandler.__super__.constructor.apply(this, arguments);
	  }

	  CommandHandler.prototype.onEnter = function (selection, chunk, shiftKey) {
	    var sibChunk, splitChildren, textGroup, tgs;
	    chunk.markDirty();
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    textGroup = chunk.componentContent.textGroup;
	    if (tgs.start.text.length !== 0) {
	      chunk.splitText();
	      return;
	    }
	    if (textGroup.length === 1) {
	      sibChunk = chunk.clone();
	      sibChunk.componentContent.textGroup.init(1);
	      chunk.addChildAfter(sibChunk);
	      return sibChunk.selectStart();
	    } else {
	      return splitChildren = chunk.split();
	    }
	  };

	  return CommandHandler;
	}(TextGroupCommandHandler);

/***/ },

/***/ 177:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk, CommandHandler, Editor, OBO, ObojoboDraft, SelectionHandler, SingleText, TextGroup, TextGroupCommandHandler, TextGroupSelection, Viewer, commandHandler, linkify, selectionHandler;

	Viewer = __webpack_require__(90);

	CommandHandler = __webpack_require__(176);

	commandHandler = new CommandHandler();

	Editor = window.Editor;

	ObojoboDraft = window.ObojoboDraft;

	OBO = window.OBO;

	SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;

	TextGroupCommandHandler = Editor.chunk.textChunk.TextGroupCommandHandler;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	Chunk = ObojoboDraft.models.Chunk;

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	linkify = ObojoboDraft.chunk.textChunk.Linkify;

	selectionHandler = new SelectionHandler();

	SingleText = React.createClass({
	  displayName: 'SingleText',

	  statics: {
	    type: 'ObojoboDraft.Chunks.SingleText',
	    register: function register() {
	      OBO.registerChunk(SingleText, {
	        "default": true,
	        insertItem: {
	          label: 'Text',
	          icon: __webpack_require__(252),
	          onInsert: ObojoboDraft.chunk.util.Insert
	        }
	      });
	      return OBO.registerTextListener({
	        match: function match(selection, editor) {
	          var savedSelection, tgs;
	          if (selection.virtual.type === 'caret' && selection.startChunk.componentContent.textGroup != null) {
	            selection.saveVirtualSelection();
	            savedSelection = selection.virtual.clone();
	            tgs = new TextGroupSelection(selection.startChunk, selection.virtual);
	            if (tgs.start.text.value.charAt(tgs.start.offset - 1) === ' ') {
	              if (linkify(selection.startChunk, tgs.start.textGroupItem)) {
	                return editor.renderModule();
	              }
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
	  shouldComponentUpdate: function shouldComponentUpdate() {
	    return this.props.chunk.needsUpdate;
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    return this.props.chunk.markUpdated();
	  },
	  render: function render() {
	    return React.createElement(Viewer, this.props);
	  }
	});

	SingleText.register();

	module.exports = SingleText;

/***/ },

/***/ 252:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 13.08 14.57'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bopacity:0.55;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Etext%3C/title%3E%3Cg class='cls-1'%3E%3Cpath d='M18.74,5.2V9.14H18.35a6.22,6.22,0,0,0-.76-2,2.93,2.93,0,0,0-1.15-1A3.68,3.68,0,0,0,15,6H13.93V17.28a4.58,4.58,0,0,0,.12,1.4,1.1,1.1,0,0,0,.48.49,1.94,1.94,0,0,0,1,.21H16v0.4H8.37v-0.4H8.86a2,2,0,0,0,1-.23,1,1,0,0,0,.44-0.52,4.43,4.43,0,0,0,.12-1.35V6H9.38a3.06,3.06,0,0,0-2.14.62A4.12,4.12,0,0,0,6.06,9.14H5.66V5.2H18.74Z' transform='translate(-5.66 -5.2)'/%3E%3C/g%3E%3C/svg%3E"

/***/ }

/******/ });