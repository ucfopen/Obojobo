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

	module.exports = __webpack_require__(86);


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

/***/ }

/******/ });