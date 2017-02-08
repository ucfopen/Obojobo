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
/******/ ((function(modules) {
	// Check all modules for deduplicated modules
	for(var i in modules) {
		if(Object.prototype.hasOwnProperty.call(modules, i)) {
			switch(typeof modules[i]) {
			case "function": break;
			case "object":
				// Module can be created from a template
				modules[i] = (function(_m) {
					var args = _m.slice(1), fn = modules[_m[0]];
					return function (a,b,c) {
						fn.apply(this, [a,b,c].concat(args));
					};
				}(modules[i]));
				break;
			default:
				// Module is a copy of another module
				modules[i] = modules[modules[i]];
				break;
			}
		}
	}
	return modules;
}({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(166);


/***/ },

/***/ 85:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var FocusableSelectionHandler, HTML, ObojoboDraft, selectionHandler;

	__webpack_require__(103);

	ObojoboDraft = window.ObojoboDraft;

	FocusableSelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler;

	selectionHandler = new FocusableSelectionHandler();

	HTML = React.createClass({
	  displayName: 'HTML',

	  statics: {
	    type: 'ObojoboDraft.Chunks.HTML',
	    register: function register() {
	      return OBO.registerChunk(HTML);
	    },
	    label: 'HTML',
	    getSelectionHandler: function getSelectionHandler() {
	      return selectionHandler;
	    },
	    createNewNodeData: function createNewNodeData() {
	      return {
	        html: null
	      };
	    },
	    cloneNodeData: function cloneNodeData(data) {
	      return {
	        html: data.html
	      };
	    },
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      return {
	        html: descriptor.content.html
	      };
	    },
	    getDataDescriptor: function getDataDescriptor(chunk) {
	      return {
	        html: chunk.componentContent.html
	      };
	    }
	  },
	  render: function render() {
	    var data;
	    data = this.props.chunk.componentContent;
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--chunks--html pad viewer' },
	      React.createElement('div', { dangerouslySetInnerHTML: { __html: data.html } })
	    );
	  }
	});

	module.exports = HTML;

/***/ },

/***/ 103:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 166:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk, DeleteButton, EditButton, Editor, FocusableChunk, FocusableCommandHandler, FocusableSelectionHandler, HTML, Keyboard, OBO, ObojoboDraft, SingleInputBubble, Viewer, commandHandler, selectionHandler;

	__webpack_require__(213);

	Viewer = __webpack_require__(85);

	ObojoboDraft = window.ObojoboDraft;

	OBO = window.OBO;

	Editor = window.Editor;

	FocusableCommandHandler = Editor.chunk.focusableChunk.FocusableCommandHandler;

	Chunk = ObojoboDraft.models.Chunk;

	FocusableChunk = ObojoboDraft.chunk.FocusableChunk;

	SingleInputBubble = ObojoboDraft.components.modal.bubble.SingleInputBubble;

	Keyboard = ObojoboDraft.page.Keyboard;

	DeleteButton = ObojoboDraft.components.DeleteButton;

	EditButton = ObojoboDraft.components.EditButton;

	FocusableSelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler;

	commandHandler = new FocusableCommandHandler();

	selectionHandler = new FocusableSelectionHandler();

	HTML = React.createClass({
	  displayName: 'HTML',

	  statics: {
	    type: 'ObojoboDraft.Chunks.HTML',
	    register: function register() {
	      return OBO.registerChunk(HTML, {
	        insertItem: {
	          label: 'HTML',
	          icon: __webpack_require__(246),
	          onInsert: ObojoboDraft.chunk.util.Insert
	        }
	      });
	    },
	    label: 'HTML Video',
	    getCommandHandler: function getCommandHandler() {
	      return commandHandler;
	    },
	    getSelectionHandler: function getSelectionHandler() {
	      return selectionHandler;
	    },
	    createNewNodeData: Viewer.createNewNodeData,
	    cloneNodeData: Viewer.cloneNodeData,
	    createNodeDataFromDescriptor: Viewer.createNodeDataFromDescriptor,
	    getDataDescriptor: Viewer.getDataDescriptor
	  },
	  getInitialState: function getInitialState() {
	    return {
	      userHTML: this.props.chunk.componentContent.html
	    };
	  },
	  startEditing: function startEditing() {
	    return this.props.editChunk(this.props.chunk);
	  },
	  onChange: function onChange(event) {
	    this.props.chunk.markDirty();
	    this.props.chunk.componentContent.html = event.target.value;
	    return this.setState({
	      userHTML: event.target.value
	    });
	  },
	  "delete": function _delete() {
	    var chunk;
	    chunk = this.props.chunk;
	    chunk.revert();
	    return this.props.saveAndRenderModuleFn();
	  },
	  onAnchorKeyDown: function onAnchorKeyDown(event) {
	    this.props.onKeyDownPutChunkOnClipboard(event, this.props.chunk);
	    switch (event.keyCode) {
	      case Keyboard.ENTER:
	        event.preventDefault();
	        this.startEditing();
	    }
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    return this.props.chunk.markUpdated();
	  },
	  render: function render() {
	    var contents, data;
	    data = this.props.chunk.componentContent;
	    contents = function () {
	      switch (false) {
	        case !this.props.isEditing:
	          return React.createElement('textarea', { value: this.state.userHTML, onChange: this.onChange });
	        case !data.html:
	          return React.createElement(Viewer, this.props);
	        default:
	          return React.createElement(
	            'div',
	            { className: 'placeholder' },
	            'Double click here to specify a HTML video'
	          );
	      }
	    }.call(this);
	    return React.createElement(
	      FocusableChunk,
	      { onDoubleClick: this.startEditing, onKeyDown: this.onAnchorKeyDown, className: 'obojobo-draft--chunks--html pad editor' + (this.props.isEditing ? ' focus' : ''), shouldPreventTab: this.props.shouldPreventTab },
	      React.createElement(
	        'div',
	        { className: 'container outline-on-selection highlight-on-hover' },
	        !this.props.isEditing ? React.createElement(DeleteButton, { onClick: this.delete, shouldPreventTab: this.props.shouldPreventTab }) : null,
	        !this.props.isEditing ? React.createElement(EditButton, { onClick: this.startEditing }) : null,
	        contents
	      )
	    );
	  }
	});

	module.exports = HTML;

/***/ },

/***/ 213:
103,

/***/ 246:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16.09 12.79'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bopacity:0.55;%7D.cls-2%7Bfill:%23231f20;%7D.cls-3%7Bfill:none;stroke:%23000;stroke-linecap:round;stroke-linejoin:round;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Einsert-icon%3C/title%3E%3Cg class='cls-1'%3E%3Crect class='cls-2' x='5.55' y='0.59' width='10.54' height='0.84'/%3E%3Crect class='cls-2' x='0.11' y='6.28' width='15.98' height='0.84'/%3E%3Crect class='cls-2' x='0.11' y='11.96' width='15.98' height='0.84'/%3E%3Cpolyline class='cls-3' points='0.5 0.5 2.98 2.38 0.5 4.27'/%3E%3Crect class='cls-2' x='5.55' y='3.43' width='10.54' height='0.84'/%3E%3Crect class='cls-2' x='0.11' y='9.12' width='15.98' height='0.84'/%3E%3C/g%3E%3C/svg%3E"

/***/ }

/******/ })));