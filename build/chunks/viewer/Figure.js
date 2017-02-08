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

	module.exports = __webpack_require__(84);


/***/ },

/***/ 46:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Image, ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	Image = React.createClass({
	  displayName: 'Image',

	  render: function render() {
	    var data, imgStyles;
	    data = this.props.chunk.componentContent;
	    if (data.url == null) {
	      imgStyles = {
	        backgroundImage: ObojoboDraft.util.getBackgroundImage(__webpack_require__(113)),
	        backgroundSize: '16px',
	        height: '300px'
	      };
	      return React.createElement('div', { className: 'img-placeholder', style: imgStyles });
	    }
	    switch (data.size) {
	      case 'small':
	      case 'medium':
	        return React.createElement('img', { src: data.url, unselectable: 'on' });
	      case 'large':
	        imgStyles = {
	          backgroundImage: "url('" + data.url + "')",
	          backgroundSize: 'cover',
	          backgroundPosition: 'center',
	          height: '300px'
	        };
	        return React.createElement('img', { unselectable: 'on', style: imgStyles });
	    }
	  }
	});

	module.exports = Image;

/***/ },

/***/ 47:
/***/ function(module, exports) {

	"use strict";

	var Chunk,
	    FocusableSelectionHandler,
	    ObojoboDraft,
	    SelectionHandler,
	    TextGroupSelectionHandler,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	ObojoboDraft = window.ObojoboDraft;

	TextGroupSelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;

	FocusableSelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler;

	Chunk = ObojoboDraft.models.Chunk;

	module.exports = SelectionHandler = function (superClass) {
	  extend(SelectionHandler, superClass);

	  function SelectionHandler() {
	    return SelectionHandler.__super__.constructor.apply(this, arguments);
	  }

	  SelectionHandler.prototype.selectStart = function (selection, chunk) {
	    return FocusableSelectionHandler.prototype.selectStart(selection, chunk);
	  };

	  return SelectionHandler;
	}(TextGroupSelectionHandler);

/***/ },

/***/ 52:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 84:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Figure, Image, NonEditableChunk, ObojoboDraft, SelectionHandler, TextGroup, TextGroupEl, TextGroupSelectionHandler, selectionHandler;

	__webpack_require__(52);

	Image = __webpack_require__(46);

	SelectionHandler = __webpack_require__(47);

	ObojoboDraft = window.ObojoboDraft;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	NonEditableChunk = ObojoboDraft.chunk.NonEditableChunk;

	TextGroupSelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;

	selectionHandler = new SelectionHandler();

	Figure = React.createClass({
	  displayName: 'Figure',

	  statics: {
	    type: 'ObojoboDraft.Chunks.Figure',
	    register: function register() {
	      return OBO.registerChunk(Figure);
	    },
	    getSelectionHandler: function getSelectionHandler(chunk) {
	      return selectionHandler;
	    },
	    createNewNodeData: function createNewNodeData() {
	      var tg;
	      tg = TextGroup.create(1);
	      tg.first.text.styleText('i');
	      return {
	        textGroup: tg,
	        url: null,
	        size: 'small'
	      };
	    },
	    cloneNodeData: function cloneNodeData(data) {
	      return {
	        textGroup: data.textGroup.clone(),
	        url: data.url,
	        size: data.size
	      };
	    },
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      return {
	        textGroup: TextGroup.fromDescriptor(descriptor.content.textGroup, 1),
	        url: descriptor.content.url,
	        size: descriptor.content.size || 'small'
	      };
	    },
	    getDataDescriptor: function getDataDescriptor(chunk) {
	      var data;
	      data = chunk.componentContent;
	      return {
	        textGroup: data.textGroup.toDescriptor(),
	        url: data.url,
	        size: data.size
	      };
	    }
	  },
	  render: function render() {
	    var data;
	    data = this.props.chunk.componentContent;
	    return React.createElement(
	      NonEditableChunk,
	      { className: 'obojobo-draft--chunks--figure viewer ' + data.size, ref: 'component' },
	      React.createElement(
	        'div',
	        { className: 'container' },
	        React.createElement(
	          'figure',
	          { unselectable: 'on' },
	          React.createElement(Image, { chunk: this.props.chunk }),
	          data.textGroup.first.text.length > 0 ? React.createElement(
	            'figcaption',
	            { ref: 'caption' },
	            React.createElement(TextGroupEl, { text: data.textGroup.first.text, groupIndex: '0' })
	          ) : null
	        )
	      )
	    );
	  }
	});

	Figure.register();

	module.exports = Figure;

/***/ },

/***/ 113:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bopacity:0.03;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Ebg%3C/title%3E%3Crect class='cls-1' width='6' height='6'/%3E%3Crect class='cls-1' x='6' y='6' width='6' height='6'/%3E%3C/svg%3E"

/***/ }

/******/ });