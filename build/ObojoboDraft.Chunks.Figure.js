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

	module.exports = __webpack_require__(128);


/***/ },

/***/ 124:
/***/ function(module, exports) {

	'use strict';

	var Adapter, Common, TextGroupAdapter;

	Common = window.ObojoboDraft.Common;

	TextGroupAdapter = Common.chunk.textChunk.TextGroupAdapter;

	Adapter = {
	  construct: function construct(model, attrs) {
	    var ref, ref1, ref2, ref3, ref4;
	    TextGroupAdapter.construct(model, attrs);
	    model.modelState.textGroup.maxItems = 1;
	    if (attrs != null ? (ref = attrs.content) != null ? ref.url : void 0 : void 0) {
	      model.modelState.url = attrs.content.url;
	    } else {
	      model.modelState.url = null;
	    }
	    if (attrs != null ? (ref1 = attrs.content) != null ? ref1.size : void 0 : void 0) {
	      model.modelState.size = attrs.content.size;
	    } else {
	      model.modelState.size = 'small';
	    }
	    if (attrs != null ? (ref2 = attrs.content) != null ? ref2.width : void 0 : void 0) {
	      model.modelState.width = attrs.content.width;
	    } else {
	      model.modelState.width = null;
	    }
	    if (attrs != null ? (ref3 = attrs.content) != null ? ref3.height : void 0 : void 0) {
	      model.modelState.height = attrs.content.height;
	    } else {
	      model.modelState.height = null;
	    }
	    if (attrs != null ? (ref4 = attrs.content) != null ? ref4.alt : void 0 : void 0) {
	      return model.modelState.alt = attrs.content.alt;
	    } else {
	      return model.modelState.alt = null;
	    }
	  },
	  clone: function clone(model, _clone) {
	    TextGroupAdapter.clone(model, _clone);
	    _clone.modelState.url = model.modelState.url;
	    _clone.modelState.size = model.modelState.size;
	    _clone.modelState.width = model.modelState.width;
	    _clone.modelState.height = model.modelState.height;
	    return _clone.modelState.alt = model.modelState.alt;
	  },
	  toJSON: function toJSON(model, json) {
	    TextGroupAdapter.toJSON(model, json);
	    json.content.url = model.modelState.url;
	    json.content.size = model.modelState.size;
	    json.content.width = model.modelState.width;
	    json.content.height = model.modelState.height;
	    return json.content.alt = model.modelState.alt;
	  },
	  toText: function toText(model) {
	    return 'Image: ' + model.modelState.url + "\n Caption:" + TextGroupAdapter.toText(model);
	  }
	};

	module.exports = Adapter;

/***/ },

/***/ 125:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, Image;

	Common = window.ObojoboDraft.Common;

	Image = React.createClass({
	  displayName: 'Image',

	  render: function render() {
	    var data, imgStyles;
	    data = this.props.chunk.modelState;
	    if (data.url == null) {
	      imgStyles = {
	        backgroundImage: Common.util.getBackgroundImage(__webpack_require__(294)),
	        backgroundSize: '16px',
	        height: '300px'
	      };
	      return React.createElement('div', { className: 'img-placeholder', style: imgStyles });
	    }
	    switch (data.size) {
	      case 'small':
	      case 'medium':
	      case 'large':
	        return React.createElement('img', { src: data.url, unselectable: 'on', alt: data.alt });
	      case 'custom':
	        imgStyles = {};
	        if (data.width != null) {
	          imgStyles.width = data.width + 'px';
	        }
	        if (data.height != null) {
	          imgStyles.height = data.height + 'px';
	        }
	        return React.createElement('img', { src: data.url, unselectable: 'on', alt: data.alt, style: imgStyles });
	    }
	  }
	});

	module.exports = Image;

/***/ },

/***/ 126:
/***/ function(module, exports) {

	"use strict";

	var Chunk,
	    Common,
	    FocusableSelectionHandler,
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

	Common = window.ObojoboDraft.Common;

	TextGroupSelectionHandler = Common.chunk.textChunk.TextGroupSelectionHandler;

	FocusableSelectionHandler = Common.chunk.focusableChunk.FocusableSelectionHandler;

	Chunk = Common.models.Chunk;

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

/***/ 127:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, Figure, Image, NonEditableChunk, OboComponent, TextGroupEl;

	__webpack_require__(257);

	Image = __webpack_require__(125);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	TextGroupEl = Common.chunk.textChunk.TextGroupEl;

	NonEditableChunk = Common.chunk.NonEditableChunk;

	Figure = React.createClass({
		displayName: 'Figure',

		render: function render() {
			var data;
			data = this.props.model.modelState;
			return React.createElement(
				OboComponent,
				{ model: this.props.model, moduleData: this.props.moduleData },
				React.createElement(
					NonEditableChunk,
					{ className: 'obojobo-draft--chunks--figure viewer ' + data.size, ref: 'component' },
					React.createElement(
						'div',
						{ className: 'container' },
						React.createElement(
							'figure',
							{ unselectable: 'on' },
							React.createElement(Image, { chunk: this.props.model }),
							data.textGroup.first.text.length > 0 ? React.createElement(
								'figcaption',
								{ ref: 'caption' },
								React.createElement(TextGroupEl, { parentModel: this.props.model, textItem: data.textGroup.first, groupIndex: '0' })
							) : null
						)
					)
				)
			);
		}
	});

	module.exports = Figure;

/***/ },

/***/ 128:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft, SelectionHandler;

	SelectionHandler = __webpack_require__(126);

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.Figure', {
	  type: 'chunk',
	  adapter: __webpack_require__(124),
	  componentClass: __webpack_require__(127),
	  selectionHandler: new SelectionHandler()
	});

/***/ },

/***/ 257:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 294:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bopacity:0.03;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Ebg%3C/title%3E%3Crect class='cls-1' width='6' height='6'/%3E%3Crect class='cls-1' x='6' y='6' width='6' height='6'/%3E%3C/svg%3E"

/***/ }

/******/ });