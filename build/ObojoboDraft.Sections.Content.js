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

	module.exports = __webpack_require__(188);


/***/ },

/***/ 187:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Common, NavUtil, OboComponent, OboModel;

	__webpack_require__(233);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	OboModel = Common.models.OboModel;

	NavUtil = window.Viewer.util.NavUtil;

	module.exports = React.createClass({
	  displayName: "exports",

	  render: function render() {
	    var ChildComponent, child, childEl, navTargetModel;
	    childEl = null;
	    navTargetModel = NavUtil.getNavTargetModel(this.props.moduleData.navState);
	    if (navTargetModel) {
	      child = this.props.model.getChildContainingModel(navTargetModel);
	      ChildComponent = child.getComponentClass();
	      childEl = React.createElement(ChildComponent, { model: child, moduleData: this.props.moduleData });
	    }
	    return React.createElement(
	      OboComponent,
	      {
	        model: this.props.model,
	        moduleData: this.props.moduleData,
	        className: "obojobo-draft--sections--content"
	      },
	      React.createElement(
	        "div",
	        null,
	        childEl
	      )
	    );
	  }
	});

/***/ },

/***/ 188:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Sections.Content', {
	  type: 'section',
	  "default": true,
	  adapter: null,
	  componentClass: __webpack_require__(187),
	  selectionHandler: null,
	  getNavItem: function getNavItem(model) {
	    return {
	      type: 'hidden',
	      showChildren: true
	    };
	  },
	  generateNav: function generateNav(model) {
	    var child, i, index, len, nav, ref;
	    nav = [];
	    ref = model.children.models;
	    for (index = i = 0, len = ref.length; i < len; index = ++i) {
	      child = ref[index];
	      nav.push({
	        type: 'link',
	        label: child.title,
	        id: child.get('id')
	      });
	    }
	    nav.push({
	      type: 'seperator'
	    });
	    return nav;
	  }
	});

/***/ },

/***/ 233:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });