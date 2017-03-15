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

	module.exports = __webpack_require__(138);


/***/ },

/***/ 137:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, Dispatcher, OboComponent, Text, TextChunk, TextGroupEl, varRegex;

	__webpack_require__(211);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	TextGroupEl = Common.chunk.textChunk.TextGroupEl;

	TextChunk = Common.chunk.TextChunk;

	Dispatcher = Common.flux.Dispatcher;

	varRegex = /\{\{(.+?)\}\}/;

	Text = React.createClass({
	  displayName: 'Text',

	  render: function render() {
	    var texts;
	    texts = this.props.model.modelState.textGroup.items.map(function (_this) {
	      return function (textItem, index) {
	        var match, newText, startIndex, variable;
	        if (textItem.text.value.indexOf('{{')) {
	          match = null;
	          textItem = textItem.clone();
	          console.log('TODO - Change this so that it splits into tokens so it doesnt have to replace {{unknown}} with unknown');
	          while ((match = varRegex.exec(textItem.text.value)) !== null) {
	            variable = match[1];
	            newText = window.OBO.getTextForVariable(variable, _this.props.model, _this.props.moduleData);
	            if (newText === null) {
	              newText = match[1];
	            }
	            newText = '' + newText;
	            startIndex = textItem.text.value.indexOf(match[0], varRegex.lastIndex);
	            textItem.text.replaceText(startIndex, startIndex + match[0].length, newText);
	          }
	        }
	        return React.createElement(TextGroupEl, { text: textItem.text, groupIndex: index, indent: textItem.data.indent, key: index });
	      };
	    }(this));
	    return React.createElement(
	      OboComponent,
	      { model: this.props.model, moduleData: this.props.moduleData },
	      React.createElement(
	        TextChunk,
	        { className: 'obojobo-draft--chunks--single-text pad' },
	        texts
	      )
	    );
	  }
	});

	module.exports = Text;

/***/ },

/***/ 138:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.Text', {
	  type: 'chunk',
	  "default": true,
	  adapter: ObojoboDraft.Common.chunk.textChunk.TextGroupAdapter,
	  componentClass: __webpack_require__(137),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 211:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });