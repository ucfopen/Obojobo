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

	module.exports = __webpack_require__(135);


/***/ },

/***/ 133:
/***/ function(module, exports) {

	"use strict";

	var Adapter;

	Adapter = {
	  construct: function construct(model, attrs) {
	    var ref, ref1, ref2, ref3;
	    if ((attrs != null ? (ref = attrs.content) != null ? ref.choose : void 0 : void 0) != null) {
	      model.modelState.choose = attrs.content.choose;
	    } else {
	      model.modelState.choose = 2e308;
	    }
	    if ((attrs != null ? (ref1 = attrs.content) != null ? ref1.groupSize : void 0 : void 0) != null) {
	      model.modelState.groupSize = attrs.content.groupSize;
	    } else {
	      model.modelState.groupSize = 1;
	    }
	    if ((attrs != null ? (ref2 = attrs.content) != null ? ref2.select : void 0 : void 0) != null) {
	      model.modelState.select = attrs.content.select;
	    } else {
	      model.modelState.select = "sequential";
	    }
	    if ((attrs != null ? (ref3 = attrs.content) != null ? ref3.shuffleGroup : void 0 : void 0) != null) {
	      return model.modelState.shuffleGroup = attrs.content.shuffleGroup;
	    } else {
	      return model.modelState.shuffleGroup = false;
	    }
	  },
	  clone: function clone(model, _clone) {
	    _clone.modelState.choose = model.modelState.choose;
	    _clone.modelState.groupSize = model.modelState.groupSize;
	    _clone.modelState.select = model.modelState.select;
	    return _clone.modelState.resetWhenEmpty = model.modelState.resetWhenEmpty;
	  },
	  toJSON: function toJSON(model, json) {
	    json.content.choose = model.modelState.choose;
	    json.content.groupSize = model.modelState.groupSize;
	    json.content.select = model.modelState.select;
	    return json.content.resetWhenEmpty = model.modelState.resetWhenEmpty;
	  }
	};

	module.exports = Adapter;

/***/ },

/***/ 134:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Common, OboComponent, QuestionBank;

	__webpack_require__(213);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	QuestionBank = React.createClass({
		displayName: "QuestionBank",

		render: function render() {
			return React.createElement(
				OboComponent,
				{
					model: this.props.model,
					moduleData: this.props.moduleData,
					className: "obojobo-draft--chunks--question-bank"
				},
				this.props.model.children.models.map(function (child, index) {
					var Component = child.getComponentClass();

					return React.createElement(Component, { key: index, model: child, moduleData: this.props.moduleData });
				}.bind(this))
			);
		}
	});

	module.exports = QuestionBank;

/***/ },

/***/ 135:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.QuestionBank', {
	  type: 'chunk',
	  adapter: __webpack_require__(133),
	  componentClass: __webpack_require__(134),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 213:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });