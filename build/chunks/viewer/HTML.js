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

	module.exports = __webpack_require__(85);


/***/ },

/***/ 85:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var FocusableSelectionHandler, HTML, ObojoboDraft, selectionHandler;

	__webpack_require__(103);

	ObojoboDraft = window.ObojoboDraft;

	FocusableSelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler;

	selectionHandler = new FocusableSelectionHandler();

	HTML = React.createClass({
	  displayName: 'HTML',

	  statics: {
	    type: 'ObojoboDraft.Chunks.HTML',
	    register: function register() {
	      return OBO.registerChunk(HTML);
	    },
	    label: 'HTML',
	    getSelectionHandler: function getSelectionHandler() {
	      return selectionHandler;
	    },
	    createNewNodeData: function createNewNodeData() {
	      return {
	        html: null
	      };
	    },
	    cloneNodeData: function cloneNodeData(data) {
	      return {
	        html: data.html
	      };
	    },
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      return {
	        html: descriptor.content.html
	      };
	    },
	    getDataDescriptor: function getDataDescriptor(chunk) {
	      return {
	        html: chunk.componentContent.html
	      };
	    }
	  },
	  render: function render() {
	    var data;
	    data = this.props.chunk.componentContent;
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--chunks--html pad viewer' },
	      React.createElement('div', { dangerouslySetInnerHTML: { __html: data.html } })
	    );
	  }
	});

	module.exports = HTML;

/***/ },

/***/ 103:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });