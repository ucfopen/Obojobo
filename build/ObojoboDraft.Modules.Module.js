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

	module.exports = __webpack_require__(179);


/***/ },

/***/ 177:
/***/ function(module, exports) {

	'use strict';

	var Adapter;

	Adapter = {
	  construct: function construct(model, attrs) {
	    var ref;
	    if ((attrs != null ? (ref = attrs.content) != null ? ref.start : void 0 : void 0) != null) {
	      if (attrs.content.start === 'unlimited') {
	        return model.modelState.start = null;
	      } else {
	        return model.modelState.start = attrs.content.start;
	      }
	    }
	  },
	  clone: function clone(model, _clone) {
	    return _clone.modelState.start = model.modelState.start;
	  },
	  toJSON: function toJSON(model, json) {
	    return json.content.start = model.modelState.start;
	  }
	};

	module.exports = Adapter;

/***/ },

/***/ 178:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Common, Dispatcher, NavUtil, OboComponent, OboModel, navStore;

	__webpack_require__(228);

	navStore = window.Viewer.stores.navStore;

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	OboModel = Common.models.OboModel;

	Dispatcher = Common.flux.Dispatcher;

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
	        className: "obojobo-draft--modules--module"
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

/***/ 179:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Modules.Module', {
	  type: 'module',
	  "default": true,
	  adapter: __webpack_require__(177),
	  componentClass: __webpack_require__(178),
	  selectionHandler: null,
	  getNavItem: function getNavItem(model) {
	    return {
	      type: 'heading',
	      label: model.title,
	      showChildren: true
	    };
	  },
	  generateNav: function generateNav(model) {
	    return [{
	      type: 'heading',
	      label: model.title
	    }];
	  }
	});

/***/ },

/***/ 228:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });