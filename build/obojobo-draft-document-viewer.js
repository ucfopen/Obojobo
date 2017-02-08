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

	module.exports = __webpack_require__(192);


/***/ },

/***/ 157:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DOMSelection, ObojoboDraft, Selection, TextGroupEl, TextMenu, ViewerApp, ViewerPage, VirtualSelection;

	__webpack_require__(209);

	ViewerPage = __webpack_require__(158);

	ObojoboDraft = window.ObojoboDraft;

	VirtualSelection = ObojoboDraft.selection.VirtualSelection;

	DOMSelection = ObojoboDraft.selection.DOMSelection;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	Selection = ObojoboDraft.selection.Selection;

	TextMenu = ObojoboDraft.components.TextMenu;

	ViewerApp = React.createClass({
	  displayName: 'ViewerApp',

	  statics: {
	    textCommands: [{
	      label: 'Bookmark',
	      image: __webpack_require__(240)
	    }, {
	      label: 'Comment',
	      image: __webpack_require__(241)
	    }]
	  },
	  getInitialState: function getInitialState() {
	    this.props.module.app = this;
	    window.__lo = this.props.module;
	    return {
	      selection: new Selection(this.props.module),
	      module: this.props.module,
	      textCommands: [],
	      highlights: []
	    };
	  },
	  applyHighlights: function applyHighlights() {
	    var chunk, highlight, i, len, ref, results;
	    ref = this.state.highlights;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      highlight = ref[i];
	      this.state.selection.virtual.fromObject(highlight.selection);
	      results.push(function () {
	        var j, len1, ref1, results1;
	        ref1 = this.state.selection.virtual.all;
	        results1 = [];
	        for (j = 0, len1 = ref1.length; j < len1; j++) {
	          chunk = ref1[j];
	          results1.push(chunk.highlightSelection(highlight.comment));
	        }
	        return results1;
	      }.call(this));
	    }
	    return results;
	  },
	  _onTextMenuCommand: function _onTextMenuCommand(commandLabel) {
	    var chunk, comment, i, len, ref;
	    switch (commandLabel.toLowerCase()) {
	      case 'comment':
	        comment = prompt('Comment?');
	        this.state.selection.update();
	        ref = this.state.selection.virtual.all;
	        for (i = 0, len = ref.length; i < len; i++) {
	          chunk = ref[i];
	          chunk.highlightSelection(comment);
	        }
	        return this.forceUpdate();
	    }
	  },
	  _onMouseUp: function _onMouseUp() {
	    var textCommands;
	    this.state.selection.update();
	    this.state.selection.selectDOM();
	    if (this.state.selection.virtual.type === 'caret') {
	      textCommands = [];
	    } else {
	      textCommands = ViewerApp.textCommands;
	    }
	    return this.setState({
	      selection: this.state.selection,
	      textCommands: textCommands
	    });
	  },
	  componentDidMount: function componentDidMount() {
	    this.applyHighlights();
	    return this.forceUpdate();
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    return this.state.selection.selectDOM();
	  },
	  render: function render() {
	    window.__state = this.state;
	    window.__sel = this.state.selection;
	    return React.createElement(
	      'div',
	      { className: 'viewer--components--viewer-app document', onMouseUp: this._onMouseUp },
	      React.createElement(
	        'main',
	        { ref: 'main' },
	        React.createElement(
	          'div',
	          { ref: 'container', className: 'wrapper' },
	          this.props.module.pages.models.map(function (page, index) {
	            return React.createElement(
	              'div',
	              { className: 'page-container', key: index },
	              React.createElement(ViewerPage, {
	                module: this.props.module,
	                page: page,
	                ref: 'viewerPage' + index
	              })
	            );
	          }.bind(this)),
	          React.createElement(TextMenu, {
	            relativeToElement: this.refs.container,
	            selectionRect: this.state.selection.rect,
	            commandHandler: this._onTextMenuCommand,
	            commands: this.state.textCommands,
	            enabled: true
	          })
	        )
	      )
	    );
	  }
	});

	module.exports = ViewerApp;

/***/ },

/***/ 158:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ViewerPage;

	__webpack_require__(210);

	ViewerPage = React.createClass({
		displayName: 'ViewerPage',

		render: function render() {
			var chunks, props;
			props = this.props;
			chunks = props.page.chunks.models.map(function (chunk, index) {
				var Component = chunk.getComponent();

				return React.createElement(
					'div',
					{
						className: 'component',
						'data-component-type': chunk.get('type'),
						'data-component-index': index,
						'data-oboid': chunk.cid,
						'data-id': chunk.get('id'),
						'data-server-index': chunk.get('index'),
						'data-server-id': chunk.get('id'),
						'data-server-derived-from': chunk.get('derivedFrom'),
						'data-changed': chunk.dirty,
						'data-todo': chunk.get('index') + ':' + chunk.get('id'),
						key: index
					},
					React.createElement(Component, {
						chunk: chunk,
						page: props.page,
						module: props.module
					})
				);
			});;
			return React.createElement(
				'div',
				{
					className: 'viewer--components--viewer-page',
					ref: 'viewer'
				},
				chunks
			);
		}
	});

	module.exports = ViewerPage;

/***/ },

/***/ 159:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  components: {
	    ViewerApp: __webpack_require__(157)
	  }
	};

/***/ },

/***/ 192:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	window.Viewer = __webpack_require__(159);

/***/ },

/***/ 209:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 210:
209,

/***/ 240:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_11' data-name='Layer 11' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23231f20;%7D.cls-2%7Bfill:%23fff;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Ebookmark-icon%3C/title%3E%3Cpath class='cls-2' d='M10.28,3.81L12.1,7.49a0.32,0.32,0,0,0,.24.17L16.4,8.26a0.32,0.32,0,0,1,.18.54l-2.94,2.87a0.32,0.32,0,0,0-.09.28l0.69,4a0.32,0.32,0,0,1-.46.33l-3.63-1.91a0.32,0.32,0,0,0-.3,0L6.22,16.33A0.32,0.32,0,0,1,5.76,16l0.69-4a0.32,0.32,0,0,0-.09-0.28L3.42,8.8A0.32,0.32,0,0,1,3.6,8.26l4.06-.59A0.32,0.32,0,0,0,7.9,7.49L9.72,3.81A0.32,0.32,0,0,1,10.28,3.81Z'/%3E%3C/svg%3E"

/***/ },

/***/ 241:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_11' data-name='Layer 11' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23231f20;%7D.cls-2%7Bfill:%23fff;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Ecomment-icon%3C/title%3E%3Cpath class='cls-2' d='M15.75,5.79H4.25a2.1,2.1,0,0,0-2.1,2.1V12.2a2.1,2.1,0,0,0,2.1,2.1h6.1l4.22,4.1v-4.1h1.17a2.1,2.1,0,0,0,2.1-2.1V7.9A2.1,2.1,0,0,0,15.75,5.79Z'/%3E%3C/svg%3E"

/***/ }

/******/ })));