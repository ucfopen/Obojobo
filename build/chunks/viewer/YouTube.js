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

	module.exports = __webpack_require__(93);


/***/ },

/***/ 93:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var FocusableSelectionHandler, ObojoboDraft, YouTube, selectionHandler;

	__webpack_require__(111);

	ObojoboDraft = window.ObojoboDraft;

	FocusableSelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler;

	selectionHandler = new FocusableSelectionHandler();

	YouTube = React.createClass({
	  displayName: 'YouTube',

	  statics: {
	    type: 'ObojoboDraft.Chunks.YouTube',
	    register: function register() {
	      return OBO.registerChunk(YouTube);
	    },
	    label: 'YouTube Video',
	    getSelectionHandler: function getSelectionHandler() {
	      return selectionHandler;
	    },
	    createNewNodeData: function createNewNodeData() {
	      return {
	        videoId: null
	      };
	    },
	    cloneNodeData: function cloneNodeData(data) {
	      return {
	        videoId: data.videoId
	      };
	    },
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      return {
	        videoId: descriptor.content.videoId
	      };
	    },
	    getDataDescriptor: function getDataDescriptor(chunk) {
	      return {
	        videoId: chunk.componentContent.videoId
	      };
	    }
	  },
	  render: function render() {
	    var data;
	    data = this.props.chunk.componentContent;
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--chunks--you-tube viewer' },
	      React.createElement('iframe', { src: 'https://www.youtube.com/embed/' + data.videoId, frameBorder: '0', allowFullScreen: 'true' })
	    );
	  }
	});

	YouTube.register();

	module.exports = YouTube;

/***/ },

/***/ 111:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });