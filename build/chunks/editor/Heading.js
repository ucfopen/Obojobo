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

	module.exports = __webpack_require__(168);


/***/ },

/***/ 86:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Heading, ObojoboDraft, SelectionHandler, TextChunk, TextGroup, TextGroupEl, selectionHandler;

	__webpack_require__(104);

	ObojoboDraft = window.ObojoboDraft;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	TextChunk = ObojoboDraft.chunk.TextChunk;

	SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;

	selectionHandler = new SelectionHandler();

	Heading = React.createClass({
	  displayName: 'Heading',

	  statics: {
	    type: 'ObojoboDraft.Chunks.Heading',
	    register: function register() {
	      return OBO.registerChunk(Heading);
	    },
	    getSelectionHandler: function getSelectionHandler() {
	      return selectionHandler;
	    },
	    createNewNodeData: function createNewNodeData() {
	      var tg;
	      tg = TextGroup.create(1, {
	        indent: 0
	      });
	      return {
	        textGroup: tg,
	        headingLevel: 1
	      };
	    },
	    cloneNodeData: function cloneNodeData(data) {
	      return {
	        textGroup: data.textGroup.clone(),
	        headingLevel: data.headingLevel
	      };
	    },
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      return {
	        textGroup: TextGroup.fromDescriptor(descriptor.content.textGroup, 1, {
	          indent: 0
	        }),
	        headingLevel: descriptor.content.headingLevel
	      };
	    },
	    getDataDescriptor: function getDataDescriptor(chunk) {
	      var data;
	      data = chunk.componentContent;
	      return {
	        textGroup: data.textGroup.toDescriptor(),
	        headingLevel: data.headingLevel
	      };
	    }
	  },
	  render: function render() {
	    var data, inner;
	    data = this.props.chunk.componentContent;
	    inner = React.createElement('h' + data.headingLevel, null, React.createElement(TextGroupEl, { text: data.textGroup.first.text, indent: data.textGroup.first.data.indent, groupIndex: '0' }));
	    return React.createElement(
	      TextChunk,
	      { className: 'obojobo-draft--chunks--heading pad' },
	      inner
	    );
	  }
	});

	Heading.register();

	module.exports = Heading;

/***/ },

/***/ 104:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 167:
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

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	Chunk = ObojoboDraft.models.Chunk;

	module.exports = CommandHandler = function (superClass) {
	  extend(CommandHandler, superClass);

	  function CommandHandler() {
	    return CommandHandler.__super__.constructor.apply(this, arguments);
	  }

	  CommandHandler.prototype.splitText = function (selection, chunk, shiftKey) {
	    var newChunk, newNode, newText, tgs;
	    chunk.markDirty();
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    if (tgs.start.isGroupStart) {
	      newChunk = Chunk.create();
	      chunk.addChildBefore(newChunk);
	      return;
	    }
	    newText = tgs.start.text.split(tgs.start.offset);
	    newNode = Chunk.create();
	    newNode.componentContent.textGroup.first.text = newText;
	    chunk.addChildAfter(newNode);
	    return newNode.selectStart();
	  };

	  return CommandHandler;
	}(TextGroupCommandHandler);

/***/ },

/***/ 168:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk, ChunkUtil, CommandHandler, Heading, OBO, ObojoboDraft, SelectionHandler, TextChunk, TextGroup, TextGroupEl, TextGroupSelection, Viewer, commandHandler, selectionHandler;

	__webpack_require__(214);

	Viewer = __webpack_require__(86);

	CommandHandler = __webpack_require__(167);

	commandHandler = new CommandHandler();

	ObojoboDraft = window.ObojoboDraft;

	OBO = window.OBO;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	Chunk = ObojoboDraft.models.Chunk;

	TextChunk = ObojoboDraft.chunk.TextChunk;

	ChunkUtil = ObojoboDraft.chunk.util.ChunkUtil;

	SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	selectionHandler = new SelectionHandler();

	Heading = React.createClass({
	  displayName: 'Heading',

	  statics: {
	    type: 'ObojoboDraft.Chunks.Heading',
	    register: function register() {
	      OBO.registerChunk(Heading);
	      OBO.registerToolbarItem({
	        id: 'headingSelector',
	        type: 'select',
	        label: 'Change text type',
	        selectedOption: 'Heading 1',
	        options: ['Heading 1', 'Heading 2', 'Normal Text'],
	        onClick: function onClick(toolbarItem, editorState, selection) {
	          var newChunk;
	          switch (toolbarItem.selectedOption) {
	            case 'Heading 1':
	              newChunk = Chunk.create('ObojoboDraft.Chunks.Heading');
	              newChunk.componentContent.headingLevel = 1;
	              newChunk.componentContent.textGroup.first.text.styleText('b');
	              newChunk.componentContent.textGroup.first.text.insertText(0, 'h1');
	              break;
	            case 'Heading 2':
	              newChunk = Chunk.create('ObojoboDraft.Chunks.Heading');
	              newChunk.componentContent.headingLevel = 2;
	              break;
	            case 'Normal Text':
	              newChunk = Chunk.create('ObojoboDraft.Chunks.SingleText');
	          }
	          return ChunkUtil.replaceTextsWithinSelection(editorState.selection, newChunk);
	        },
	        onSelectionUpdate: function onSelectionUpdate(toolbarItem, editorState, selection) {
	          var chunk, headingLevel, i, len, ref, ref1, ref2, type;
	          if (((ref = selection.virtual) != null ? (ref1 = ref.start) != null ? ref1.chunk : void 0 : void 0) != null) {
	            type = selection.startChunk.get('type');
	            headingLevel = 0;
	            if (type === 'ObojoboDraft.Chunks.Heading') {
	              headingLevel = selection.startChunk.componentContent.headingLevel;
	            }
	            ref2 = selection.virtual.all;
	            for (i = 0, len = ref2.length; i < len; i++) {
	              chunk = ref2[i];
	              if (chunk.get('type') !== type) {
	                type = null;
	                break;
	              } else if (type === 'ObojoboDraft.Chunks.Heading' && chunk.componentContent.headingLevel !== headingLevel) {
	                type = null;
	                break;
	              }
	            }
	            if (type != null) {
	              switch (type + headingLevel) {
	                case 'ObojoboDraft.Chunks.Heading1':
	                  return toolbarItem.selectedOption = 'Heading 1';
	                case 'ObojoboDraft.Chunks.Heading2':
	                  return toolbarItem.selectedOption = 'Heading 2';
	                default:
	                  return toolbarItem.selectedOption = 'Normal Text';
	              }
	            } else {
	              return toolbarItem.selectedOption = null;
	            }
	          }
	        }
	      });
	      return OBO.registerTextListener({
	        match: function match(selection, editor) {
	          var chunk, newChunk, ref, st, tgs;
	          console.clear();
	          console.log('heading match');
	          if (selection.virtual.type === 'caret' && selection.startChunk.getComponent() === OBO.componentClassMap.defaultClass && ((ref = selection.startChunk.componentContent.textGroup) != null ? ref.first : void 0) != null) {
	            chunk = selection.startChunk;
	            tgs = new TextGroupSelection(chunk, selection.virtual);
	            st = tgs.start.textGroupItem.text.value;
	            if (st === '# ' || st === '## ') {
	              newChunk = Chunk.create(Heading);
	              if (st === '## ') {
	                newChunk.componentContent.headingLevel = 2;
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
	    getSelectionHandler: function getSelectionHandler() {
	      return selectionHandler;
	    },
	    getCommandHandler: function getCommandHandler() {
	      return commandHandler;
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

	Heading.register();

	module.exports = Heading;

/***/ },

/***/ 214:
104

/******/ })));