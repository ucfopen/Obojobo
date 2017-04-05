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

	module.exports = __webpack_require__(161);


/***/ },

/***/ 159:
/***/ function(module, exports) {

	"use strict";

	var Adapter;

	Adapter = {
	  construct: function construct(model, attrs) {
	    var ref;
	    if ((attrs != null ? (ref = attrs.content) != null ? ref.videoId : void 0 : void 0) != null) {
	      return model.modelState.videoId = attrs.content.videoId;
	    } else {
	      return model.modelState.videoId = null;
	    }
	  },
	  clone: function clone(model, _clone) {
	    return _clone.modelState.videoId = model.modelState.videoId;
	  },
	  toJSON: function toJSON(model, json) {
	    return json.content.videoId = model.modelState.videoId;
	  },
	  toText: function toText(model) {
	    return "https://www.youtube.com/watch?v=" + model.modelState.videoId;
	  }
	};

	module.exports = Adapter;

/***/ },

/***/ 160:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, OboComponent, YouTube;

	__webpack_require__(269);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	YouTube = React.createClass({
	  displayName: 'YouTube',

	  render: function render() {
	    var data;
	    data = this.props.model.modelState;
	    return React.createElement(
	      OboComponent,
	      { model: this.props.model, moduleData: this.props.moduleData },
	      React.createElement(
	        'div',
	        { className: 'obojobo-draft--chunks--you-tube viewer' },
	        React.createElement('iframe', { src: 'https://www.youtube.com/embed/' + data.videoId, frameBorder: '0', allowFullScreen: 'true' })
	      )
	    );
	  }
	});

	module.exports = YouTube;

/***/ },

/***/ 161:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common;

	Common = window.ObojoboDraft.Common;

	OBO.register('ObojoboDraft.Chunks.YouTube', {
	  type: 'chunk',
	  adapter: __webpack_require__(159),
	  componentClass: __webpack_require__(160),
	  selectionHandler: new Common.chunk.focusableChunk.FocusableSelectionHandler()
	});

/***/ },

/***/ 269:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });