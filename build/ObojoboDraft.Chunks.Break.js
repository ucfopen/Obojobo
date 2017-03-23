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

	module.exports = __webpack_require__(103);


/***/ },

/***/ 101:
/***/ function(module, exports) {

	'use strict';

	var Adapter;

	Adapter = {
	  toText: function toText(model) {
	    return '---';
	  }
	};

	module.exports = Adapter;

/***/ },

/***/ 102:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Break, Common, NonEditableChunk, OboComponent;

	__webpack_require__(200);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	NonEditableChunk = Common.chunk.NonEditableChunk;

	Break = React.createClass({
		displayName: "Break",

		render: function render() {
			return React.createElement(
				OboComponent,
				{ model: this.props.model, moduleData: this.props.moduleData },
				React.createElement(
					NonEditableChunk,
					{ className: "obojobo-draft--chunks--break viewer" },
					React.createElement("hr", null)
				)
			);
		}
	});

	module.exports = Break;

/***/ },

/***/ 103:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common;

	Common = window.ObojoboDraft.Common;

	OBO.register('ObojoboDraft.Chunks.Break', {
	  type: 'chunk',
	  adapter: __webpack_require__(101),
	  componentClass: __webpack_require__(102),
	  selectionHandler: new Common.chunk.focusableChunk.FocusableSelectionHandler()
	});

/***/ },

/***/ 200:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });