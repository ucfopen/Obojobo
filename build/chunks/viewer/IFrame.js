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

	module.exports = __webpack_require__(92);


/***/ },

/***/ 92:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var FocusableSelectionHandler, IFrame, ObojoboDraft, selectionHandler;

	__webpack_require__(110);

	ObojoboDraft = window.ObojoboDraft;

	FocusableSelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler;

	selectionHandler = new FocusableSelectionHandler();

	IFrame = React.createClass({
	  displayName: 'IFrame',

	  statics: {
	    type: 'ObojoboDraft.Chunks.IFrame',
	    register: function register() {
	      return OBO.registerChunk(IFrame);
	    },
	    label: 'IFrame',
	    getSelectionHandler: function getSelectionHandler() {
	      return selectionHandler;
	    },
	    createNewNodeData: function createNewNodeData() {
	      return {
	        src: null
	      };
	    },
	    cloneNodeData: function cloneNodeData(data) {
	      return {
	        src: data.src
	      };
	    },
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      return {
	        src: descriptor.content.src
	      };
	    },
	    getDataDescriptor: function getDataDescriptor(chunk) {
	      return {
	        src: chunk.componentContent.src
	      };
	    }
	  },
	  render: function render() {
	    var data;
	    data = this.props.chunk.componentContent;
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--chunks--iframe viewer' },
	      React.createElement('iframe', { src: data.src, frameBorder: '0', allowFullScreen: 'true' })
	    );
	  }
	});

	IFrame.register();

	module.exports = IFrame;

/***/ },

/***/ 110:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });