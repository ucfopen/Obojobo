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

	module.exports = __webpack_require__(81);


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

/***/ }

/******/ });