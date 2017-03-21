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

	module.exports = __webpack_require__(83);


/***/ },

/***/ 83:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Editor, Error, FocusableSelectionHandler, ObojoboDraft, selectionHandler;

	__webpack_require__(102);

	Editor = window.Editor;

	ObojoboDraft = window.ObojoboDraft;

	FocusableSelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler;

	selectionHandler = new FocusableSelectionHandler();

	Error = React.createClass({
	  displayName: 'Error',

	  statics: {
	    type: 'ObojoboDraft.Chunks.Error',
	    register: function register() {
	      return OBO.registerChunk(Error, {
	        error: true
	      });
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
	    return null;
	  }
	});

	Error.register();

	module.exports = Error;

/***/ },

/***/ 102:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });