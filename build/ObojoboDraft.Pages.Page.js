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

	module.exports = __webpack_require__(181);


/***/ },

/***/ 180:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, NavUtil, OboComponent;

	__webpack_require__(231);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	NavUtil = window.Viewer.util.NavUtil;

	module.exports = React.createClass({
			displayName: 'exports',

			componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
					if (nextProps.moduleData.navState.navTargetId !== this.props.moduleData.navState.navTargetId) {
							return NavUtil.setFlag(this.props.moduleData.navState.navTargetId, 'visited', true);
					}
			},
			render: function render() {
					return React.createElement(
							OboComponent,
							{
									model: this.props.model,
									moduleData: this.props.moduleData,
									className: 'obojobo-draft--pages--page'
							},
							this.props.model.children.models.map(function (child, index) {
									var Component = child.getComponentClass();

									return React.createElement(Component, { key: index, model: child, moduleData: this.props.moduleData });
							}.bind(this))
					);
			}
	});

/***/ },

/***/ 181:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Dispatcher, ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	Dispatcher = ObojoboDraft.Common.flux.Dispatcher;

	OBO.register('ObojoboDraft.Pages.Page', {
	  type: 'page',
	  "default": true,
	  componentClass: __webpack_require__(180),
	  selectionHandler: null,
	  getNavItem: function getNavItem(model) {
	    var title;
	    title = '';
	    if (model.title != null) {
	      title = model.title;
	    }
	    return {
	      type: 'link',
	      label: model.title,
	      path: [title.toLowerCase().replace(/ /g, '-')],
	      showChildren: false
	    };
	  }
	});

/***/ },

/***/ 231:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });