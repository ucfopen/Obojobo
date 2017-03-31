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

	module.exports = __webpack_require__(176);


/***/ },

/***/ 175:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Common, Group, OboComponent;

	__webpack_require__(229);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	Group = React.createClass({
		displayName: "Group",

		render: function render() {
			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					className: "obojobo-draft--group"
				},
				this.props.model.children.models.map(function (child, index) {
					var Component = child.getComponentClass();
					return React.createElement(Component, { key: index, model: child, moduleData: this.props.moduleData });
				}.bind(this))
			);
		}
	});

	module.exports = Group;

/***/ },

/***/ 176:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Group', {
	  type: 'group',
	  "default": true,
	  adapter: null,
	  componentClass: __webpack_require__(175),
	  selectionHandler: null
	});

/***/ },

/***/ 229:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });