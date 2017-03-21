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

	module.exports = __webpack_require__(188);


/***/ },

/***/ 93:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var FocusableSelectionHandler, ObojoboDraft, YouTube, selectionHandler;

	__webpack_require__(111);

	ObojoboDraft = window.ObojoboDraft;

	FocusableSelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler;

	selectionHandler = new FocusableSelectionHandler();

	YouTube = React.createClass({
	  displayName: 'YouTube',

	  statics: {
	    type: 'ObojoboDraft.Chunks.YouTube',
	    register: function register() {
	      return OBO.registerChunk(YouTube);
	    },
	    label: 'YouTube Video',
	    getSelectionHandler: function getSelectionHandler() {
	      return selectionHandler;
	    },
	    createNewNodeData: function createNewNodeData() {
	      return {
	        videoId: null
	      };
	    },
	    cloneNodeData: function cloneNodeData(data) {
	      return {
	        videoId: data.videoId
	      };
	    },
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      return {
	        videoId: descriptor.content.videoId
	      };
	    },
	    getDataDescriptor: function getDataDescriptor(chunk) {
	      return {
	        videoId: chunk.componentContent.videoId
	      };
	    }
	  },
	  render: function render() {
	    var data;
	    data = this.props.chunk.componentContent;
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--chunks--you-tube viewer' },
	      React.createElement('iframe', { src: 'https://www.youtube.com/embed/' + data.videoId, frameBorder: '0', allowFullScreen: 'true' })
	    );
	  }
	});

	YouTube.register();

	module.exports = YouTube;

/***/ },

/***/ 111:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 188:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Chunk, DeleteButton, EditButton, Editor, FocusableChunk, FocusableCommandHandler, FocusableSelectionHandler, Keyboard, OBO, ObojoboDraft, SingleInputBubble, Viewer, YouTube, commandHandler, selectionHandler;

	__webpack_require__(223);

	Viewer = __webpack_require__(93);

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

	YouTube = React.createClass({
	  displayName: 'YouTube',

	  statics: {
	    type: 'ObojoboDraft.Chunks.YouTube',
	    register: function register() {
	      return OBO.registerChunk(YouTube, {
	        insertItem: {
	          label: 'YouTube Video',
	          icon: __webpack_require__(258),
	          onInsert: ObojoboDraft.chunk.util.Insert
	        }
	      });
	    },
	    label: 'YouTube Video',
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
	      userVideoId: this.props.chunk.componentContent.videoId
	    };
	  },
	  startEditing: function startEditing() {
	    return this.props.editChunk(this.props.chunk);
	  },
	  onChange: function onChange(newValue) {
	    this.props.chunk.markForUpdate();
	    return this.setState({
	      userVideoId: newValue
	    });
	  },
	  onClose: function onClose() {
	    this.props.chunk.markDirty();
	    this.props.chunk.componentContent.videoId = this.state.userVideoId;
	    this.props.stopEditing();
	    this.props.chunk.selectStart();
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
	            React.createElement(SingleInputBubble, { label: 'YouTube Video ID', value: this.state.userVideoId, onChange: this.onChange, onClose: this.onClose, onCancel: this.onCancel })
	          );
	        case !data.videoId:
	          return React.createElement(Viewer, this.props);
	        default:
	          return React.createElement(
	            'div',
	            { className: 'placeholder' },
	            'Double click here to specify a YouTube video'
	          );
	      }
	    }.call(this);
	    return React.createElement(
	      FocusableChunk,
	      { onDoubleClick: this.startEditing, onKeyDown: this.onAnchorKeyDown, className: 'obojobo-draft--chunks--you-tube editor' + (this.props.isEditing ? ' focus' : ''), shouldPreventTab: this.props.shouldPreventTab },
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

	YouTube.register();

	module.exports = YouTube;

/***/ },

/***/ 223:
111,

/***/ 258:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18.17 12.78'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bopacity:0.55;%7D.cls-2%7Bfill:%23282928;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Eyoutube%3C/title%3E%3Cg id='Lozenge' class='cls-1'%3E%3Cpath class='cls-2' d='M20.91,8.37a3.93,3.93,0,0,0-.72-1.8,2.6,2.6,0,0,0-1.82-.77C15.82,5.61,12,5.61,12,5.61h0s-3.81,0-6.36.18a2.6,2.6,0,0,0-1.82.77,3.93,3.93,0,0,0-.72,1.8,27.48,27.48,0,0,0-.18,2.94v1.38a27.48,27.48,0,0,0,.18,2.94,3.93,3.93,0,0,0,.72,1.8,3.08,3.08,0,0,0,2,.78c1.45,0.14,6.18.18,6.18,0.18s3.82,0,6.36-.19a2.6,2.6,0,0,0,1.82-.77,3.93,3.93,0,0,0,.72-1.8,27.52,27.52,0,0,0,.18-2.94V11.31A27.52,27.52,0,0,0,20.91,8.37Zm-10.78,6V9.25L15,11.81Z' transform='translate(-2.91 -5.61)'/%3E%3C/g%3E%3C/svg%3E"

/***/ }

/******/ })));