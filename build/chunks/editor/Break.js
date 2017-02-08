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

	module.exports = __webpack_require__(160);


/***/ },

/***/ 81:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Break, FocusableSelectionHandler, NonEditableChunk, ObojoboDraft, selectionHandler;

	__webpack_require__(100);

	ObojoboDraft = window.ObojoboDraft;

	NonEditableChunk = ObojoboDraft.chunk.NonEditableChunk;

	FocusableSelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler;

	selectionHandler = new FocusableSelectionHandler();

	Break = React.createClass({
	  displayName: 'Break',

	  statics: {
	    type: 'ObojoboDraft.Chunks.Break',
	    register: function register() {
	      return OBO.registerChunk(Break);
	    },
	    getSelectionHandler: function getSelectionHandler() {
	      return selectionHandler;
	    },
	    createNewNodeData: function createNewNodeData() {
	      return {};
	    },
	    cloneNodeData: function cloneNodeData(data) {
	      return {};
	    },
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      return {};
	    },
	    getDataDescriptor: function getDataDescriptor(chunk) {
	      return {};
	    }
	  },
	  render: function render() {
	    return React.createElement(
	      NonEditableChunk,
	      { className: 'obojobo-draft--chunks--break viewer' },
	      React.createElement('hr', null)
	    );
	  }
	});

	Break.register();

	module.exports = Break;

/***/ },

/***/ 100:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 160:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Break, Chunk, FocusableSelectionHandler, OBO, ObojoboDraft, Viewer, selectionHandler;

	Viewer = __webpack_require__(81);

	ObojoboDraft = window.ObojoboDraft;

	OBO = window.OBO;

	Chunk = ObojoboDraft.models.Chunk;

	FocusableSelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler;

	selectionHandler = new FocusableSelectionHandler();

	Break = React.createClass({
	  displayName: 'Break',

	  statics: {
	    type: 'ObojoboDraft.Chunks.Break',
	    register: function register() {
	      OBO.registerChunk(Break, {
	        insertItem: {
	          label: 'Break',
	          icon: __webpack_require__(242),
	          onInsert: function onInsert(componentClass, position, referenceChunk, selection, callback) {
	            var focusChunk, newChunk;
	            newChunk = Chunk.create(componentClass);
	            focusChunk = null;
	            switch (position) {
	              case 'before':
	                referenceChunk.addChildBefore(newChunk);
	                if (newChunk.isFirst()) {
	                  focusChunk = Chunk.create();
	                  newChunk.addChildBefore(focusChunk);
	                } else {
	                  focusChunk = newChunk.prevSibling();
	                }
	                break;
	              case 'after':
	                referenceChunk.addChildAfter(newChunk);
	                if (newChunk.isLast()) {
	                  focusChunk = Chunk.create();
	                  newChunk.addChildAfter(focusChunk);
	                } else {
	                  focusChunk = newChunk.nextSibling();
	                }
	            }
	            focusChunk.selectEnd();
	            return callback();
	          }
	        }
	      });
	      return OBO.registerTextListener({
	        match: function match(selection, editor) {
	          var chunk, chunkAfter, newChunk, ref, st;
	          if (selection.virtual.type === 'caret' && ((ref = selection.startChunk.componentContent.textGroup) != null ? ref.first : void 0) != null) {
	            st = selection.startChunk.componentContent.textGroup.first.text.value;
	            if (st.indexOf("---") === 0 && st.length === 3) {
	              chunk = selection.startChunk;
	              newChunk = Chunk.create(Break);
	              chunk.replaceWith(newChunk);
	              newChunk.markDirty();
	              chunkAfter = Chunk.create();
	              newChunk.addChildAfter(chunkAfter);
	              chunkAfter.selectAll();
	              return editor.renderModule();
	            }
	          }
	        }
	      });
	    },
	    getCommandHandler: function getCommandHandler() {
	      return null;
	    },
	    getSelectionHandler: function getSelectionHandler() {
	      return selectionHandler;
	    },
	    createNewNodeData: Viewer.createNewNodeData,
	    cloneNodeData: Viewer.cloneNodeData,
	    createNodeDataFromDescriptor: Viewer.createNodeDataFromDescriptor,
	    getDataDescriptor: Viewer.getDataDescriptor
	  },
	  render: function render() {
	    return React.createElement(Viewer, this.props);
	  }
	});

	Break.register();

	module.exports = Break;

/***/ },

/***/ 242:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18.17 16.52'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bopacity:0.09;%7D.cls-2%7Bfill:%23231f20;%7D.cls-3%7Bfill:none;stroke:%23231f20;stroke-linecap:round;stroke-miterlimit:10;opacity:0.55;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Ebreak%3C/title%3E%3Cg class='cls-1'%3E%3Crect class='cls-2' width='18.17' height='0.84'/%3E%3Crect class='cls-2' y='2.37' width='11.75' height='0.84'/%3E%3Crect class='cls-2' y='13' width='18.17' height='0.84'/%3E%3Crect class='cls-2' y='15.68' width='15.25' height='0.84'/%3E%3C/g%3E%3Cline class='cls-3' x1='3.44' y1='7.91' x2='14.73' y2='7.91'/%3E%3C/svg%3E"

/***/ }

/******/ });