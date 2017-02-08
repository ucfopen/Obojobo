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

	module.exports = __webpack_require__(187);


/***/ },

/***/ 92:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var FocusableSelectionHandler, IFrame, ObojoboDraft, selectionHandler;

	__webpack_require__(110);

	ObojoboDraft = window.ObojoboDraft;

	FocusableSelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler;

	selectionHandler = new FocusableSelectionHandler();

	IFrame = React.createClass({
	  displayName: 'IFrame',

	  statics: {
	    type: 'ObojoboDraft.Chunks.IFrame',
	    register: function register() {
	      return OBO.registerChunk(IFrame);
	    },
	    label: 'IFrame',
	    getSelectionHandler: function getSelectionHandler() {
	      return selectionHandler;
	    },
	    createNewNodeData: function createNewNodeData() {
	      return {
	        src: null
	      };
	    },
	    cloneNodeData: function cloneNodeData(data) {
	      return {
	        src: data.src
	      };
	    },
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      return {
	        src: descriptor.content.src
	      };
	    },
	    getDataDescriptor: function getDataDescriptor(chunk) {
	      return {
	        src: chunk.componentContent.src
	      };
	    }
	  },
	  render: function render() {
	    var data;
	    data = this.props.chunk.componentContent;
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--chunks--iframe viewer' },
	      React.createElement('iframe', { src: data.src, frameBorder: '0', allowFullScreen: 'true' })
	    );
	  }
	});

	IFrame.register();

	module.exports = IFrame;

/***/ },

/***/ 110:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 187:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk, DeleteButton, EditButton, Editor, FocusableChunk, FocusableCommandHandler, FocusableSelectionHandler, IFrame, Keyboard, OBO, ObojoboDraft, SingleInputBubble, Viewer, commandHandler, selectionHandler;

	__webpack_require__(222);

	Viewer = __webpack_require__(92);

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

	IFrame = React.createClass({
	  displayName: 'IFrame',

	  statics: {
	    type: 'ObojoboDraft.Chunks.IFrame',
	    register: function register() {
	      return OBO.registerChunk(IFrame, {
	        insertItem: {
	          label: 'Embedded Page',
	          icon: __webpack_require__(257),
	          onInsert: ObojoboDraft.chunk.util.Insert
	        }
	      });
	    },
	    label: 'IFrame',
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
	      userSrc: this.props.chunk.componentContent.src
	    };
	  },
	  startEditing: function startEditing() {
	    return this.props.editChunk(this.props.chunk);
	  },
	  onChange: function onChange(newValue) {
	    this.props.chunk.markForUpdate();
	    return this.setState({
	      userSrc: newValue
	    });
	  },
	  onClose: function onClose() {
	    this.props.chunk.markDirty();
	    this.props.chunk.componentContent.src = this.state.userSrc;
	    this.props.stopEditing();
	    this.props.selection.virtual.setCaret(this.props.chunk.get('index'), {
	      groupIndex: 'anchor:main',
	      offset: 0
	    });
	    return this.props.saveAndRenderModuleFn();
	  },
	  "delete": function _delete() {
	    var chunk;
	    chunk = this.props.chunk;
	    chunk.revert();
	    chunk.selectStart();
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
	  shouldComponentUpdate: function shouldComponentUpdate() {
	    return this.props.chunk.needsUpdate;
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
	          return React.createElement(
	            'div',
	            { className: 'edit' },
	            React.createElement(Viewer, this.props),
	            React.createElement(SingleInputBubble, { label: 'Source', value: this.state.userSrc, onChange: this.onChange, onClose: this.onClose, onCancel: this.onCancel })
	          );
	        case !data.src:
	          return React.createElement(Viewer, this.props);
	        default:
	          return React.createElement(
	            'div',
	            { className: 'placeholder' },
	            'Double click here to embed a url'
	          );
	      }
	    }.call(this);
	    return React.createElement(
	      FocusableChunk,
	      { onDoubleClick: this.startEditing, onKeyDown: this.onAnchorKeyDown, className: 'obojobo-draft--chunks--iframe editor' + (this.props.isEditing ? ' focus' : ''), shouldPreventTab: this.props.shouldPreventTab },
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

	IFrame.register();

	module.exports = IFrame;

/***/ },

/***/ 222:
110,

/***/ 257:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cdefs%3E%3Cstyle%3E.cls-2%7Bopacity:0.55;%7D.cls-3%7Bfill:none;stroke:%23000;stroke-miterlimit:10;stroke-width:2px;%7D%3C/style%3E%3C/defs%3E%3Cg id='Layer_4' data-name='Layer 4'%3E%3Cg class='cls-2'%3E%3Cpolyline class='cls-3' points='6.58 16.71 1.88 12 6.58 7.29'/%3E%3Cpolyline class='cls-3' points='17.42 16.71 22.13 12 17.42 7.29'/%3E%3Cline class='cls-3' x1='14.99' y1='7.29' x2='9.01' y2='16.71'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"

/***/ }

/******/ })));