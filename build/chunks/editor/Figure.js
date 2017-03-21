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

	module.exports = __webpack_require__(165);


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

/***/ },

/***/ 164:
/***/ function(module, exports) {

	'use strict';

	var Chunk,
	    CommandHandler,
	    Editor,
	    FocusableCommandHandler,
	    ObojoboDraft,
	    TextGroupCommandHandler,
	    TextGroupSelection,
	    _selectionInAnchor,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	Editor = window.Editor;

	ObojoboDraft = window.ObojoboDraft;

	TextGroupCommandHandler = Editor.chunk.textChunk.TextGroupCommandHandler;

	FocusableCommandHandler = Editor.chunk.focusableChunk.FocusableCommandHandler;

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	Chunk = ObojoboDraft.models.Chunk;

	_selectionInAnchor = function _selectionInAnchor(selection, chunk) {
	  var ref, ref1, tgs;
	  tgs = new TextGroupSelection(chunk, selection.virtual);
	  return ((ref = tgs.start) != null ? ref.groupIndex : void 0) === 'anchor:main' || ((ref1 = tgs.end) != null ? ref1.groupIndex : void 0) === 'anchor:main';
	};

	module.exports = CommandHandler = function (superClass) {
	  extend(CommandHandler, superClass);

	  function CommandHandler() {
	    return CommandHandler.__super__.constructor.apply(this, arguments);
	  }

	  CommandHandler.prototype._revert = function (chunk) {
	    var newChunk;
	    console.log('revert');
	    newChunk = Chunk.create();
	    chunk.addChildAfter(newChunk);
	    newChunk.absorb(chunk);
	    return newChunk;
	  };

	  CommandHandler.prototype.getCaretEdge = function (selection, chunk) {
	    if (_selectionInAnchor(selection, chunk)) {
	      return 'start';
	    }
	    return CommandHandler.__super__.getCaretEdge.call(this, selection, chunk);
	  };

	  CommandHandler.prototype.deleteText = function (selection, chunk, deleteForwards) {
	    var s, tgs;
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    s = tgs.start;
	    if (s.groupIndex === 'anchor:main') {
	      chunk = this._revert(chunk);
	      chunk.selectStart();
	      if (chunk.prevSibling() && !deleteForwards) {
	        chunk.prevSibling().selectEnd();
	      }
	      return true;
	    }
	    if (!deleteForwards && s.isGroupStart) {
	      chunk = this._revert(chunk);
	      chunk.selectStart();
	      return true;
	    }
	    if (deleteForwards && s.isGroupEnd) {
	      return false;
	    }
	    return CommandHandler.__super__.deleteText.call(this, selection, chunk, deleteForwards);
	  };

	  CommandHandler.prototype.styleSelection = function (selection, chunk, styleType, styleData) {
	    if (_selectionInAnchor(selection, chunk)) {
	      return;
	    }
	    return CommandHandler.__super__.styleSelection.call(this, selection, chunk, styleType, styleData);
	  };

	  CommandHandler.prototype.unstyleSelection = function (selection, chunk, styleType, styleData) {
	    if (_selectionInAnchor(selection, chunk)) {
	      return;
	    }
	    return CommandHandler.__super__.unstyleSelection.call(this, selection, chunk, styleType, styleData);
	  };

	  CommandHandler.prototype.getSelectionStyles = function (selection, chunk) {
	    if (_selectionInAnchor(selection, chunk)) {
	      return;
	    }
	    return CommandHandler.__super__.getSelectionStyles.call(this, selection, chunk);
	  };

	  CommandHandler.prototype.onEnter = function (selection, chunk, shiftKey) {
	    if (_selectionInAnchor(selection, chunk)) {
	      TextGroupSelection.setCaretToTextStart(chunk, 0, selection.virtual);
	      chunk.splitText();
	      chunk.selectEnd();
	      return;
	    }
	    return CommandHandler.__super__.onEnter.call(this, selection, chunk, shiftKey);
	  };

	  CommandHandler.prototype.split = function (selection, chunk) {
	    if (_selectionInAnchor(selection, chunk)) {
	      TextGroupSelection.setCaretToTextStart(chunk, 0, selection.virtual);
	      chunk.splitText();
	      chunk.selectAll();
	      return;
	    }
	    return CommandHandler.__super__.split.call(this, selection, chunk, shiftKey);
	  };

	  CommandHandler.prototype.splitText = function (selection, chunk, shiftKey) {
	    var newNode, newText, tgs;
	    if (_selectionInAnchor(selection, chunk)) {
	      return;
	    }
	    chunk.markDirty();
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    newText = tgs.start.text.split(tgs.start.offset);
	    newNode = Chunk.create();
	    newNode.componentContent.textGroup.first.text = newText;
	    chunk.addChildAfter(newNode);
	    return newNode.selectStart();
	  };

	  CommandHandler.prototype.paste = function (selection, chunk, text, html, chunks) {
	    var pasteIntoChunk;
	    if (_selectionInAnchor(selection, chunk)) {
	      chunk = this._revert(chunk);
	      pasteIntoChunk = Chunk.create();
	      chunk.addChildBefore(pasteIntoChunk);
	      pasteIntoChunk.selectAll();
	      return pasteIntoChunk.paste(text, html, chunks);
	    }
	    return this.insertText(selection, chunk, text);
	  };

	  CommandHandler.prototype.canMergeWith = function (selection, chunk, otherChunk) {
	    return CommandHandler.__super__.canMergeWith.call(this, selection, chunk, otherChunk) && chunk.nextSibling() === otherChunk;
	  };

	  CommandHandler.prototype.canRemoveSibling = function (selection, sibling) {
	    return false;
	  };

	  CommandHandler.prototype.onSelectAll = function (selection, chunk) {
	    TextGroupSelection.selectText(chunk, 0, selection.virtual);
	    return true;
	  };

	  return CommandHandler;
	}(TextGroupCommandHandler);

/***/ },

/***/ 165:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Anchor, Chunk, ChunkUtil, DOMSelection, DeleteButton, Figure, FocusableChunk, Image, Keyboard, OBO, ObojoboDraft, SelectionHandler, SingleInputBubble, TextCommandHandler, TextGroup, TextGroupEl, TextGroupSelection, TextGroupSelectionHandler, Viewer, commandHandler, selectionHandler, sizes;

	__webpack_require__(212);

	__webpack_require__(52);

	Viewer = __webpack_require__(84);

	ObojoboDraft = window.ObojoboDraft;

	OBO = window.OBO;

	TextCommandHandler = __webpack_require__(164);

	SelectionHandler = __webpack_require__(47);

	Image = __webpack_require__(46);

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	Anchor = ObojoboDraft.components.Anchor;

	Chunk = ObojoboDraft.models.Chunk;

	DOMSelection = ObojoboDraft.selection.DOMSelection;

	Keyboard = ObojoboDraft.page.Keyboard;

	FocusableChunk = ObojoboDraft.chunk.FocusableChunk;

	SingleInputBubble = ObojoboDraft.components.modal.bubble.SingleInputBubble;

	ChunkUtil = ObojoboDraft.chunk.util.ChunkUtil;

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	TextGroupSelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;

	DeleteButton = ObojoboDraft.components.DeleteButton;

	commandHandler = new TextCommandHandler();

	selectionHandler = new SelectionHandler();

	sizes = ['small', 'medium', 'large'];

	Figure = React.createClass({
	  displayName: 'Figure',

	  statics: {
	    type: 'ObojoboDraft.Chunks.Figure',
	    register: function register() {
	      OBO.registerChunk(Figure, {
	        insertItem: {
	          label: 'Figure',
	          icon: __webpack_require__(244),
	          onInsert: ObojoboDraft.chunk.util.Insert
	        }
	      });
	      return OBO.registerToolbarItem({
	        id: 'insertFigure',
	        type: 'button',
	        label: 'Insert Figure',
	        icon: __webpack_require__(245),
	        onClick: function onClick(toolbarItem, editorState) {
	          var newChunk;
	          newChunk = Chunk.create(Figure);
	          console.log('BEFORE');
	          __lo.__print();
	          editorState.selection.startChunk.addChildBefore(newChunk);
	          newChunk.replaceSelection();
	          newChunk.selectStart();
	          console.log('AFTER');
	          return __lo.__print();
	        }
	      });
	    },
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
	  setSize: function setSize(size) {
	    var data;
	    this.props.chunk.markDirty();
	    data = this.props.chunk.componentContent;
	    data.size = size;
	    return this.props.saveAndRenderModuleFn();
	  },
	  nextSize: function nextSize(event) {
	    var data;
	    event.preventDefault();
	    data = this.props.chunk.componentContent;
	    return this.setSize(sizes[(sizes.indexOf(data.size) + 1) % sizes.length]);
	  },
	  onAnchorKeyDown: function onAnchorKeyDown(event) {
	    this.markChunkForUpdate();
	    return this.props.onKeyDownPutChunkOnClipboard(event, this.props.chunk);
	  },
	  setImageURL: function setImageURL() {
	    this.props.chunk.markDirty();
	    return this.props.editChunk(this.props.chunk);
	  },
	  onChange: function onChange(newValue) {
	    this.props.chunk.markDirty();
	    console.log('YT on Change', newValue);
	    return this.setState({
	      userImageURL: newValue
	    });
	  },
	  onClose: function onClose() {
	    this.props.chunk.markDirty();
	    this.props.chunk.componentContent.url = this.state.userImageURL;
	    this.setState({
	      chunk: this.props.chunk
	    });
	    this.props.stopEditing();
	    this.props.selection.virtual.setCaret(this.props.chunk.get('index'), {
	      groupIndex: 'anchor:main',
	      offset: 0
	    });
	    return this.props.saveAndRenderModuleFn();
	  },
	  onDeleteButtonClick: function onDeleteButtonClick() {
	    var chunk;
	    chunk = this.props.chunk;
	    commandHandler._revert(chunk).selectEnd();
	    return this.props.saveAndRenderModuleFn();
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (this.props.selectionState !== nextProps.selectionState) {
	      return this.props.chunk.markForUpdate();
	    }
	  },
	  shouldComponentUpdate: function shouldComponentUpdate() {
	    return this.props.chunk.needsUpdate;
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    return this.props.chunk.markUpdated();
	  },
	  markChunkForUpdate: function markChunkForUpdate() {
	    return this.props.chunk.markForUpdate();
	  },
	  render: function render() {
	    var data, focus, pos;
	    data = this.props.chunk.componentContent;
	    focus = 'none';
	    pos = this.props.selectionState;
	    if (pos === 'contains' || pos === 'start' || pos === 'inside' || pos === 'end') {
	      focus = function () {
	        switch (this.props.selection.virtual.start.data.groupIndex) {
	          case 'anchor:main':
	            return 'anchor';
	          default:
	            return 'caption';
	        }
	      }.call(this);
	    }
	    return React.createElement(
	      FocusableChunk,
	      {
	        className: 'obojobo-draft--chunks--figure editor ' + data.size,
	        ref: 'component',
	        onClick: this.markChunkForUpdate,
	        onFocus: this.markChunkForUpdate,
	        onBlur: this.markChunkForUpdate,
	        onKeyDown: this.onAnchorKeyDown,
	        shouldPreventTab: this.props.shouldPreventTab
	      },
	      React.createElement(
	        'figure',
	        {
	          className: (data.textGroup.first.text.length === 0 && focus !== 'caption' ? 'empty-caption' : '') + ' focus-' + focus,
	          onClick: this.markChunkForUpdate,
	          unselectable: 'on'
	        },
	        React.createElement(
	          'div',
	          { className: 'container highlight-on-hover' + (focus === 'anchor' ? ' outline-on-selection' : ''), ref: 'container' },
	          React.createElement(Image, { chunk: this.props.chunk }),
	          React.createElement(
	            'div',
	            { className: 'size-controls' },
	            React.createElement(
	              'button',
	              { onMouseDown: this.nextSize },
	              'Size'
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'img-controls' },
	            React.createElement(
	              'button',
	              { onMouseDown: this.setImageURL },
	              'Set image from URL'
	            ),
	            React.createElement(
	              'button',
	              { onMouseDown: this.todo },
	              'Upload image'
	            )
	          ),
	          !this.props.isEditing && focus === 'anchor' ? React.createElement(DeleteButton, { onClick: this.onDeleteButtonClick, shouldPreventTab: this.props.shouldPreventTab }) : null
	        ),
	        React.createElement(
	          'figcaption',
	          {
	            className: 'pad',
	            contentEditable: 'true',
	            suppressContentEditableWarning: true,
	            ref: 'caption',
	            tabIndex: this.props.shouldPreventTab ? '-1' : ''
	          },
	          React.createElement(TextGroupEl, { text: data.textGroup.first.text, groupIndex: '0' })
	        )
	      ),
	      this.props.isEditing ? React.createElement(SingleInputBubble, {
	        label: 'Image URL',
	        value: this.state.userImageURL,
	        onChange: this.onChange,
	        onClose: this.onClose,
	        onCancel: this.onCancel
	      }) : null
	    );
	  }
	});

	Figure.register();

	module.exports = Figure;

/***/ },

/***/ 212:
52,

/***/ 244:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 21.61 16.3'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bopacity:0.55;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Efigure%3C/title%3E%3Cg class='cls-1'%3E%3Cpath d='M1.2,3.85v16.3H22.8V3.85H1.2ZM21.91,19.26H18.55A1.65,1.65,0,0,0,18.38,19l-4.72-4.72a1.68,1.68,0,0,0-2.37,0L10.61,15,6.68,11.08a1.67,1.67,0,0,0-2.37,0L2.09,13.31V4.74H21.91V19.26Z' transform='translate(-1.2 -3.85)'/%3E%3Ccircle cx='15.55' cy='5.98' r='2.49'/%3E%3C/g%3E%3C/svg%3E"

/***/ },

/***/ 245:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_9' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 32 32' style='enable-background:new 0 0 32 32;' xml:space='preserve'%3E %3Cstyle type='text/css'%3E .st0%7Bfill:%23DEDDDD;stroke:%23000000;stroke-miterlimit:10;%7D .st1%7Bfill:%23FFFFFF;stroke:%23000000;stroke-miterlimit:10;%7D %3C/style%3E %3Crect x='4.4' y='7.3' class='st0' width='23.3' height='17.3'/%3E %3Cpath class='st1' d='M23.6,24.6H4.4V18l3-3c0.7-0.7,1.9-0.7,2.7,0l4.4,4.4l0.8-0.8c0.7-0.7,1.9-0.7,2.7,0l5.3,5.3 C23.4,24.1,23.5,24.4,23.6,24.6z'/%3E %3Ccircle class='st1' cx='21.3' cy='13.6' r='3.4'/%3E %3C/svg%3E"

/***/ }

/******/ })));