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

	module.exports = __webpack_require__(137);


/***/ },

/***/ 135:
/***/ function(module, exports) {

	"use strict";

	var Adapter;

	Adapter = {
	  construct: function construct(model, attrs) {
	    var ref;
	    if ((attrs != null ? (ref = attrs.content) != null ? ref.src : void 0 : void 0) != null) {
	      return model.modelState.src = src;
	    } else {
	      return model.modelState.src = null;
	    }
	  },
	  clone: function clone(model, _clone) {
	    return _clone.modelState.src = model.modelState.src;
	  },
	  toJSON: function toJSON(model, json) {
	    return json.content.src = model.modelState.src;
	  },
	  toText: function toText(model) {
	    return model.modelState.src;
	  }
	};

	module.exports = Adapter;

/***/ },

/***/ 136:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, IFrame, OboComponent;

	__webpack_require__(260);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	IFrame = React.createClass({
		displayName: 'IFrame',

		render: function render() {
			return React.createElement(
				OboComponent,
				{ model: this.props.model, moduleData: this.props.moduleData },
				React.createElement(
					'div',
					{ className: 'obojobo-draft--chunks--iframe viewer' },
					React.createElement('iframe', { src: this.props.model.modelState.src, frameBorder: '0', allowFullScreen: 'true' })
				)
			);
		}
	});

	module.exports = IFrame;

/***/ },

/***/ 137:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common;

	Common = window.ObojoboDraft.Common;

	OBO.register('ObojoboDraft.Chunks.IFrame', {
	  type: 'chunk',
	  adapter: __webpack_require__(135),
	  componentClass: __webpack_require__(136),
	  selectionHandler: new Common.chunk.focusableChunk.FocusableSelectionHandler()
	});

/***/ },

/***/ 260:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });