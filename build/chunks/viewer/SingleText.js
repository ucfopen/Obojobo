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

	module.exports = __webpack_require__(90);


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

/***/ }

/******/ });