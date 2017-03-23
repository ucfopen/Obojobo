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

	module.exports = __webpack_require__(100);


/***/ },

/***/ 98:
/***/ function(module, exports) {

	'use strict';

	var Adapter;

	Adapter = {
	  construct: function construct(model, attrs) {
	    var ref;
	    if ((attrs != null ? (ref = attrs.content) != null ? ref.label : void 0 : void 0) != null) {
	      return model.modelState.label = attrs.content.label;
	    } else {
	      return model.modelState.label = 'Button';
	    }
	  },
	  clone: function clone(model, _clone) {
	    return _clone.modelState.label = model.modelState.label;
	  },
	  toJSON: function toJSON(model, json) {
	    return json.content.label = model.modelState.label;
	  },
	  toText: function toText(model) {
	    return model.modelState.label;
	  }
	};

	module.exports = Adapter;

/***/ },

/***/ 99:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ActionButton, Button, Common, OboComponent;

	__webpack_require__(198);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	Button = Common.components.Button;

	ActionButton = React.createClass({
	  displayName: 'ActionButton',

	  onClick: function onClick() {
	    return this.props.model.processTrigger('onClick');
	  },
	  render: function render() {
	    return React.createElement(
	      OboComponent,
	      { model: this.props.model, moduleData: this.props.moduleData },
	      React.createElement(
	        'div',
	        { className: 'obojobo-draft--chunks--action-button' },
	        React.createElement(Button, { onClick: this.onClick, value: this.props.model.modelState.label })
	      )
	    );
	  }
	});

	module.exports = ActionButton;

/***/ },

/***/ 100:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.ActionButton', {
	  type: 'chunk',
	  adapter: __webpack_require__(98),
	  componentClass: __webpack_require__(99),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 198:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });