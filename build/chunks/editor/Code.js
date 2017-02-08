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

	module.exports = __webpack_require__(162);


/***/ },

/***/ 82:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Code, ObojoboDraft, SelectionHandler, TextChunk, TextGroup, TextGroupEl, selectionHandler;

	__webpack_require__(101);

	ObojoboDraft = window.ObojoboDraft;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	TextChunk = ObojoboDraft.chunk.TextChunk;

	SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;

	selectionHandler = new SelectionHandler();

	Code = React.createClass({
	  displayName: 'Code',

	  statics: {
	    type: 'ObojoboDraft.Chunks.Code',
	    register: function register() {
	      return OBO.registerChunk(Code);
	    },
	    getSelectionHandler: function getSelectionHandler(chunk) {
	      return selectionHandler;
	    },
	    createNewNodeData: function createNewNodeData() {
	      return {
	        textGroup: TextGroup.create(2e308, {
	          indent: 0
	        }),
	        type: 'p'
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
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      return {
	        textGroup: TextGroup.fromDescriptor(descriptor.content.textGroup, 2e308, {
	          indent: 0
	        }),
	        type: descriptor.content.type
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
	      { className: 'obojobo-draft--chunks--code pad' },
	      React.createElement(
	        'pre',
	        null,
	        React.createElement(
	          'code',
	          null,
	          texts
	        )
	      )
	    );
	  }
	});

	Code.register();

	module.exports = Code;

/***/ },

/***/ 101:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 161:
/***/ function(module, exports) {

	"use strict";

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

	Chunk = ObojoboDraft.models.Chunk;

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	module.exports = CommandHandler = function (superClass) {
	  extend(CommandHandler, superClass);

	  function CommandHandler() {
	    return CommandHandler.__super__.constructor.apply(this, arguments);
	  }

	  CommandHandler.prototype.onEnter = function (selection, chunk, shiftKey) {
	    var newChunk;
	    chunk.markDirty();
	    if (!shiftKey) {
	      chunk.splitText();
	      return;
	    }
	    newChunk = Chunk.create();
	    chunk.addChildAfter(newChunk);
	    return newChunk.selectStart();
	  };

	  CommandHandler.prototype.onSelectAll = function (selection, chunk) {
	    chunk.selectAll();
	    return true;
	  };

	  CommandHandler.prototype.deleteText = function (selection, chunk, deleteForwards) {
	    var data, s, tgs;
	    chunk.markDirty();
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    data = chunk.componentContent;
	    s = tgs.start;
	    if (s.isTextStart && s.textGroupItem.data.indent > 0) {
	      s.textGroupItem.data.indent--;
	      return;
	    }
	    return CommandHandler.__super__.deleteText.call(this, selection, chunk, deleteForwards);
	  };

	  CommandHandler.prototype.indent = function (selection, chunk, decreaseIndent) {
	    var all, data, i, len, results, textItem, tgs;
	    chunk.markDirty();
	    data = chunk.componentContent;
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    all = tgs.getAllSelectedTexts();
	    results = [];
	    for (i = 0, len = all.length; i < len; i++) {
	      textItem = all[i];
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

	  return CommandHandler;
	}(TextGroupCommandHandler);

/***/ },

/***/ 162:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk, Code, CommandHandler, Editor, OBO, ObojoboDraft, SelectionHandler, TextGroup, TextGroupCommandHandler, Viewer, commandHandler, selectionHandler;

	__webpack_require__(211);

	Viewer = __webpack_require__(82);

	CommandHandler = __webpack_require__(161);

	commandHandler = new CommandHandler();

	Editor = window.Editor;

	ObojoboDraft = window.ObojoboDraft;

	OBO = window.OBO;

	TextGroupCommandHandler = Editor.chunk.textChunk.TextGroupCommandHandler;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	Chunk = ObojoboDraft.models.Chunk;

	SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;

	selectionHandler = new SelectionHandler();

	Code = React.createClass({
	  displayName: 'Code',

	  statics: {
	    type: 'ObojoboDraft.Chunks.Code',
	    register: function register() {
	      return OBO.registerChunk(Code, {
	        insertItem: {
	          label: 'Code Block',
	          icon: __webpack_require__(243),
	          onInsert: ObojoboDraft.chunk.util.Insert
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

	Code.register();

	module.exports = Code;

/***/ },

/***/ 211:
101,

/***/ 243:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16.09 12.79'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bopacity:0.55;%7D.cls-2%7Bfill:%23231f20;%7D.cls-3%7Bfill:none;stroke:%23000;stroke-linecap:round;stroke-linejoin:round;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Einsert-icon%3C/title%3E%3Cg class='cls-1'%3E%3Crect class='cls-2' x='5.55' y='0.59' width='10.54' height='0.84'/%3E%3Crect class='cls-2' x='0.11' y='6.28' width='15.98' height='0.84'/%3E%3Crect class='cls-2' x='0.11' y='11.96' width='15.98' height='0.84'/%3E%3Cpolyline class='cls-3' points='0.5 0.5 2.98 2.38 0.5 4.27'/%3E%3Crect class='cls-2' x='5.55' y='3.43' width='10.54' height='0.84'/%3E%3Crect class='cls-2' x='0.11' y='9.12' width='15.98' height='0.84'/%3E%3C/g%3E%3C/svg%3E"

/***/ }

/******/ })));