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

	module.exports = __webpack_require__(180);


/***/ },

/***/ 50:
/***/ function(module, exports) {

	'use strict';

	var GridTextGroup,
	    ObojoboDraft,
	    StyleableText,
	    TextGroup,
	    TextGroupItem,
	    Util,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	ObojoboDraft = window.ObojoboDraft;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	TextGroupItem = ObojoboDraft.textGroup.TextGroupItem;

	Util = ObojoboDraft.textGroup.TextGroupUtil;

	StyleableText = ObojoboDraft.text.StyleableText;

	GridTextGroup = function (superClass) {
	  extend(GridTextGroup, superClass);

	  function GridTextGroup(numRows1, numCols1, dataTemplate, initialItems) {
	    this.numRows = numRows1;
	    this.numCols = numCols1;
	    GridTextGroup.__super__.constructor.call(this, this.numRows * this.numCols, dataTemplate, initialItems);
	    this.setDimensions();
	  }

	  GridTextGroup.prototype.addRow = function (rowIndex, text, data) {
	    var firstInRowIndex, i, j, ref, ref1;
	    if (rowIndex == null) {
	      rowIndex = this.numRows;
	    }
	    if (text == null) {
	      text = null;
	    }
	    if (data == null) {
	      data = null;
	    }
	    console.log('addRow', rowIndex);
	    this.maxItems += this.numCols;
	    firstInRowIndex = rowIndex * this.numCols;
	    for (i = j = ref = firstInRowIndex, ref1 = firstInRowIndex + this.numCols - 1; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
	      this.addAt(i, text, data);
	    }
	    this.numRows++;
	    return this;
	  };

	  GridTextGroup.prototype.addCol = function (colIndex, text, data) {
	    var i, j, ref;
	    if (colIndex == null) {
	      colIndex = this.numCols;
	    }
	    if (text == null) {
	      text = null;
	    }
	    if (data == null) {
	      data = null;
	    }
	    this.maxItems += this.numRows;
	    for (i = j = ref = this.numRows - 1; j >= 0; i = j += -1) {
	      this.addAt(i * this.numCols + colIndex, text, data);
	    }
	    this.numCols++;
	    return this;
	  };

	  GridTextGroup.prototype.removeRow = function (rowIndex) {
	    var firstInRowIndex, i, j, ref, ref1;
	    if (rowIndex == null) {
	      rowIndex = this.numRows - 1;
	    }
	    this.maxItems -= this.numCols;
	    firstInRowIndex = rowIndex * this.numCols;
	    for (i = j = ref = firstInRowIndex, ref1 = firstInRowIndex + this.numCols - 1; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
	      this.remove(firstInRowIndex);
	    }
	    this.numRows--;
	    return this;
	  };

	  GridTextGroup.prototype.removeCol = function (colIndex) {
	    var i, j, ref;
	    if (colIndex == null) {
	      colIndex = this.numCols - 1;
	    }
	    this.maxItems -= this.numRows;
	    for (i = j = ref = this.numRows - 1; j >= 0; i = j += -1) {
	      this.remove(i * this.numCols + colIndex);
	    }
	    this.numCols--;
	    return this;
	  };

	  GridTextGroup.prototype.setDimensions = function (numRows, numCols) {
	    while (this.numRows < numRows) {
	      this.addRow();
	    }
	    while (this.numRows > numRows) {
	      this.removeRow();
	    }
	    while (this.numCols < numCols) {
	      this.addCol();
	    }
	    while (this.numCols > numCols) {
	      this.removeCol();
	    }
	    return this;
	  };

	  GridTextGroup.prototype.getCellPositionForIndex = function (index) {
	    var row;
	    console.log('gcpfi', index);
	    row = Math.floor(index / this.numCols);
	    return {
	      row: row,
	      col: index - row * this.numCols
	    };
	  };

	  GridTextGroup.prototype.getIndexForCellPosition = function (cellPos) {
	    if (cellPos.row < 0 || cellPos.row > this.numRows - 1 || cellPos.col < 0 || cellPos.col > this.numCols - 1) {
	      return -1;
	    }
	    return cellPos.row * this.numCols + cellPos.col;
	  };

	  GridTextGroup.prototype.clone = function (cloneDataFn) {
	    var clonedItems, item, j, len, ref;
	    if (cloneDataFn == null) {
	      cloneDataFn = Util.defaultCloneFn;
	    }
	    clonedItems = [];
	    ref = this.items;
	    for (j = 0, len = ref.length; j < len; j++) {
	      item = ref[j];
	      clonedItems.push(item.clone(cloneDataFn));
	    }
	    return new GridTextGroup(this.numRows, this.numCols, this.dataTemplate, clonedItems);
	  };

	  GridTextGroup.prototype.toDescriptor = function (dataToDescriptorFn) {
	    var desc, item, j, len, ref;
	    if (dataToDescriptorFn == null) {
	      dataToDescriptorFn = Util.defaultCloneFn;
	    }
	    desc = [];
	    ref = this.items;
	    for (j = 0, len = ref.length; j < len; j++) {
	      item = ref[j];
	      desc.push({
	        text: item.text.getExportedObject(),
	        data: dataToDescriptorFn(item.data)
	      });
	    }
	    return {
	      textGroup: desc,
	      numRows: this.numRows,
	      numCols: this.numCols
	    };
	  };

	  GridTextGroup.prototype.__grid_print = function () {
	    var col, i, item, j, k, ref, ref1, results, row, s;
	    console.log('========================');
	    results = [];
	    for (row = j = 0, ref = this.numRows; 0 <= ref ? j < ref : j > ref; row = 0 <= ref ? ++j : --j) {
	      s = [];
	      for (col = k = 0, ref1 = this.numCols; 0 <= ref1 ? k < ref1 : k > ref1; col = 0 <= ref1 ? ++k : --k) {
	        i = row * this.numCols + col;
	        item = this.items[i];
	        s.push((item.text.value + '          ').substr(0, 10));
	      }
	      results.push(console.log(s));
	    }
	    return results;
	  };

	  return GridTextGroup;
	}(TextGroup);

	GridTextGroup.fromDescriptor = function (descriptor, maxItems, dataTemplate, restoreDataDescriptorFn) {
	  var item, items, j, len, ref;
	  if (restoreDataDescriptorFn == null) {
	    restoreDataDescriptorFn = Util.defaultCloneFn;
	  }
	  items = [];
	  ref = descriptor.textGroup;
	  for (j = 0, len = ref.length; j < len; j++) {
	    item = ref[j];
	    items.push(new TextGroupItem(StyleableText.createFromObject(item.text), restoreDataDescriptorFn(item.data)));
	  }
	  return new GridTextGroup(descriptor.numRows, descriptor.numCols, dataTemplate, items);
	};

	GridTextGroup.create = function (numRows, numCols, dataTemplate) {
	  var group;
	  if (dataTemplate == null) {
	    dataTemplate = {};
	  }
	  group = new GridTextGroup(numRows, numCols, dataTemplate);
	  group.init(group.maxItems);
	  return group;
	};

	module.exports = GridTextGroup;

/***/ },

/***/ 51:
/***/ function(module, exports) {

	'use strict';

	var ObojoboDraft,
	    SelectionHandler,
	    TextGroupSelection,
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

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	module.exports = SelectionHandler = function (superClass) {
	  extend(SelectionHandler, superClass);

	  function SelectionHandler() {
	    return SelectionHandler.__super__.constructor.apply(this, arguments);
	  }

	  SelectionHandler.prototype.selectAll = function (selection, chunk) {
	    var tgs;
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    if (tgs.type !== 'multipleTextSpan') {
	      return tgs.selectText(tgs.start.groupIndex);
	    } else {
	      return tgs.selectGroup();
	    }
	  };

	  return SelectionHandler;
	}(TextGroupSelectionHandler);

/***/ },

/***/ 91:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var GridTextGroup, ObojoboDraft, SelectionHandler, Table, TextGroupEl, TextGroupSelectionHandler, selectionHandler;

	__webpack_require__(109);

	GridTextGroup = __webpack_require__(50);

	SelectionHandler = __webpack_require__(51);

	ObojoboDraft = window.ObojoboDraft;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	TextGroupSelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;

	selectionHandler = new SelectionHandler();

	Table = React.createClass({
	  displayName: 'Table',

	  statics: {
	    type: 'ObojoboDraft.Chunks.Table',
	    register: function register() {
	      return OBO.registerChunk(Table);
	    },
	    getSelectionHandler: function getSelectionHandler(chunk) {
	      return selectionHandler;
	    },
	    createNewNodeData: function createNewNodeData() {
	      return {
	        textGroup: GridTextGroup.create(3, 2),
	        position: 'center',
	        header: true
	      };
	    },
	    cloneNodeData: function cloneNodeData(data) {
	      return {
	        textGroup: data.textGroup.clone(),
	        position: data.position,
	        header: data.header
	      };
	    },
	    createNodeDataFromDescriptor: function createNodeDataFromDescriptor(descriptor) {
	      var content;
	      content = descriptor.content;
	      return {
	        textGroup: GridTextGroup.fromDescriptor(content.textGroup),
	        position: content.position,
	        header: content.header
	      };
	    },
	    getDataDescriptor: function getDataDescriptor(chunk) {
	      var data;
	      data = chunk.componentContent;
	      return {
	        textGroup: data.textGroup.toDescriptor(),
	        position: data.position,
	        header: data.header
	      };
	    }
	  },
	  render: function render() {
	    var chunk, data, header, i, numCols, ref, results, row, rows, startIndex;
	    chunk = this.props.chunk;
	    data = chunk.componentContent;
	    numCols = data.textGroup.numCols;
	    if (data.header) {
	      row = data.textGroup.items.slice(0, numCols).map(function (textGroupItem, index) {
	        return React.createElement(
	          'th',
	          {
	            key: index,
	            className: 'cell row-0 col-' + index,
	            'data-table-position': chunk.get('id') + ',0,' + index
	          },
	          React.createElement(TextGroupEl, { text: textGroupItem.text, groupIndex: index })
	        );
	      });
	      header = React.createElement(
	        'tr',
	        { key: 'header' },
	        row
	      );
	    } else {
	      header = null;
	    }
	    startIndex = data.header ? 1 : 0;
	    rows = function () {
	      results = [];
	      for (var i = startIndex, ref = data.textGroup.numRows; startIndex <= ref ? i < ref : i > ref; startIndex <= ref ? i++ : i--) {
	        results.push(i);
	      }
	      return results;
	    }.apply(this).map(function (rowNum) {
	      row = data.textGroup.items.slice(rowNum * numCols, (rowNum + 1) * numCols).map(function (textGroupItem, index) {
	        return React.createElement(
	          'td',
	          {
	            key: index,
	            className: 'cell row-' + rowNum + ' col-' + index,
	            'data-table-position': chunk.get('id') + ',' + rowNum + ',' + index
	          },
	          React.createElement(TextGroupEl, { text: textGroupItem.text, groupIndex: rowNum * numCols + index })
	        );
	      });
	      return React.createElement(
	        'tr',
	        { key: rowNum },
	        row
	      );
	    });
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--chunks--table viewer pad' },
	      React.createElement(
	        'div',
	        { className: 'container' },
	        React.createElement(
	          'table',
	          {
	            className: 'view',
	            ref: 'table',
	            key: 'table'
	          },
	          React.createElement(
	            'thead',
	            { key: 'thead' },
	            header
	          ),
	          React.createElement(
	            'tbody',
	            { key: 'tbody' },
	            rows
	          )
	        )
	      )
	    );
	  }
	});

	Table.register();

	module.exports = Table;

/***/ },

/***/ 109:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 178:
/***/ function(module, exports) {

	'use strict';

	var CommandHandler,
	    Editor,
	    ObojoboDraft,
	    TextGroupCommandHandler,
	    TextGroupSelection,
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

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	module.exports = CommandHandler = function (superClass) {
	  extend(CommandHandler, superClass);

	  function CommandHandler() {
	    return CommandHandler.__super__.constructor.apply(this, arguments);
	  }

	  CommandHandler.prototype.deleteSelection = function (selection, chunk) {
	    var tgs;
	    chunk.markDirty();
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    chunk.componentContent.textGroup.clearSpan(tgs.start.groupIndex, tgs.start.offset, tgs.end.groupIndex, tgs.end.offset);
	    if (tgs.position === 'start' || tgs.position === 'contains') {
	      return selection.virtual.setCaret(chunk, {
	        offset: tgs.start.offset,
	        groupIndex: tgs.start.groupIndex
	      });
	    }
	  };

	  CommandHandler.prototype.deleteText = function (selection, chunk, deleteForwards) {
	    var caret, tgs;
	    tgs = new TextGroupSelection(chunk, selection.virtual);
	    caret = tgs.start;
	    if (caret.isTextStart && !deleteForwards || caret.isTextEnd && deleteForwards) {
	      return false;
	    }
	    return CommandHandler.__super__.deleteText.call(this, selection, chunk, deleteForwards);
	  };

	  CommandHandler.prototype.onSelectAll = function (selection, chunk) {
	    chunk.selectAll();
	    return true;
	  };

	  CommandHandler.prototype.paste = function (selection, chunk, text, html) {
	    return this.insertText(selection, chunk, text);
	  };

	  CommandHandler.prototype.canRemoveSibling = function (selection, sibling) {
	    return false;
	  };

	  return CommandHandler;
	}(TextGroupCommandHandler);

/***/ },

/***/ 179:
/***/ function(module, exports) {

	"use strict";

	module.exports = React.createClass({
	  displayName: "exports",

	  getInitialState: function getInitialState() {
	    return {
	      rows: this.props.rows,
	      cols: this.props.cols
	    };
	  },
	  onUpdateRows: function onUpdateRows(event) {
	    this.setState({
	      rows: ~~event.target.value
	    });
	    return this.props.onChange(~~event.target.value, this.state.cols);
	  },
	  onUpdateCols: function onUpdateCols(event) {
	    this.setState({
	      cols: ~~event.target.value
	    });
	    return this.props.onChange(this.state.rows, ~~event.target.value);
	  },
	  render: function render() {
	    return React.createElement(
	      "div",
	      null,
	      React.createElement(
	        "label",
	        null,
	        "rows:"
	      ),
	      React.createElement("input", { type: "number", value: this.state.rows, onChange: this.onUpdateRows }),
	      React.createElement(
	        "label",
	        null,
	        "cols:"
	      ),
	      React.createElement("input", { type: "number", value: this.state.cols, onChange: this.onUpdateCols })
	    );
	  }
	});

/***/ },

/***/ 180:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Button, Chunk, ChunkUtil, CreateForm, DeleteButton, EditButton, Editor, FocusableChunk, GridButton, GridTextGroup, Keyboard, NonEditableChunk, OBO, ObojoboDraft, SelectionHandler, StyleableText, Table, TableControls, TextCommandHandler, TextGroup, TextGroupCursor, TextGroupEl, TextGroupSelection, ToggleCommandHandler, ToggleSelectionHandler, Viewer, commandHandler, selectionHandler;

	__webpack_require__(218);

	TextCommandHandler = __webpack_require__(178);

	Viewer = __webpack_require__(91);

	CreateForm = __webpack_require__(179);

	GridTextGroup = __webpack_require__(50);

	TableControls = __webpack_require__(182);

	GridButton = __webpack_require__(181);

	SelectionHandler = __webpack_require__(51);

	ObojoboDraft = window.ObojoboDraft;

	OBO = window.OBO;

	TextGroupSelection = ObojoboDraft.textGroup.TextGroupSelection;

	TextGroupCursor = ObojoboDraft.textGroup.TextGroupCursor;

	StyleableText = ObojoboDraft.text.StyleableText;

	TextGroup = ObojoboDraft.textGroup.TextGroup;

	TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl;

	Chunk = ObojoboDraft.models.Chunk;

	NonEditableChunk = ObojoboDraft.chunk.NonEditableChunk;

	FocusableChunk = ObojoboDraft.chunk.FocusableChunk;

	Keyboard = ObojoboDraft.page.Keyboard;

	ChunkUtil = ObojoboDraft.chunk.util.ChunkUtil;

	Button = ObojoboDraft.components.Button;

	EditButton = ObojoboDraft.components.EditButton;

	DeleteButton = ObojoboDraft.components.DeleteButton;

	ToggleSelectionHandler = ObojoboDraft.chunk.focusableChunk.ToggleSelectionHandler;

	Editor = window.Editor;

	ToggleCommandHandler = Editor.chunk.focusableChunk.ToggleCommandHandler;

	commandHandler = new ToggleCommandHandler(new TextCommandHandler());

	selectionHandler = new ToggleSelectionHandler(new SelectionHandler());

	Table = React.createClass({
	  displayName: 'Table',

	  statics: {
	    type: 'ObojoboDraft.Chunks.Table',
	    register: function register() {
	      OBO.registerChunk(Table, {
	        insertItem: {
	          label: 'Table',
	          icon: __webpack_require__(253),
	          onInsert: ObojoboDraft.chunk.util.Insert
	        }
	      });
	      return OBO.registerToolbarItem({
	        id: 'insertTable',
	        type: GridButton,
	        label: 'Table',
	        icon: __webpack_require__(256),
	        onClick: function onClick(toolbarItem, editorState, selection, data) {
	          var newChunk;
	          newChunk = Chunk.create(Table);
	          console.clear();
	          console.log('DATA', data);
	          newChunk.componentContent.textGroup.setDimensions(data.rows, data.cols);
	          console.log(newChunk.componentContent.textGroup);
	          return ChunkUtil.replaceTextsWithinSelection(editorState.selection, newChunk, editorState.selection.virtual.type !== 'caret');
	        }
	      });
	    },
	    getCommandHandler: function getCommandHandler(chunk, selection) {
	      return commandHandler;
	    },
	    getSelectionHandler: function getSelectionHandler(chunk, selection) {
	      return selectionHandler;
	    },
	    createNewNodeData: Viewer.createNewNodeData,
	    cloneNodeData: Viewer.cloneNodeData,
	    createNodeDataFromDescriptor: Viewer.createNodeDataFromDescriptor,
	    getDataDescriptor: Viewer.getDataDescriptor
	  },
	  getInitialState: function getInitialState() {
	    return {
	      focus: {
	        row: 0,
	        col: 0,
	        offset: 'start'
	      }
	    };
	  },
	  addRow: function addRow(index) {
	    var data;
	    if (index == null) {
	      index = null;
	    }
	    this.props.chunk.markDirty();
	    data = this.props.chunk.componentContent;
	    if (index == null) {
	      index = data.textGroup.numRows;
	    }
	    data.textGroup.addRow(index);
	    return this.setState({
	      focus: {
	        row: index,
	        col: this.state.focus.col,
	        offset: 'start'
	      }
	    });
	  },
	  addCol: function addCol(index) {
	    var data;
	    if (index == null) {
	      index = null;
	    }
	    this.props.chunk.markDirty();
	    data = this.props.chunk.componentContent;
	    if (index == null) {
	      index = data.textGroup.numCols;
	    }
	    data.textGroup.addCol(index);
	    return this.setState({
	      focus: {
	        row: this.state.focus.row,
	        col: index,
	        offset: 'start'
	      }
	    });
	  },
	  removeRow: function removeRow(index) {
	    var data;
	    this.props.chunk.markDirty();
	    data = this.props.chunk.componentContent;
	    if (data.textGroup.numRows === 1) {
	      this.props.chunk.revert();
	      this.props.saveAndRenderModuleFn();
	      return;
	    }
	    data.textGroup.removeRow(index);
	    if (this.state.focus.row >= index) {
	      return this.setState({
	        focus: {
	          row: Math.min(index, data.textGroup.numRows - 1),
	          col: this.state.focus.col,
	          offset: 'end'
	        }
	      });
	    }
	  },
	  removeCol: function removeCol(index) {
	    var data;
	    this.props.chunk.markDirty();
	    data = this.props.chunk.componentContent;
	    if (data.textGroup.numCols === 1) {
	      this.props.chunk.revert();
	      this.props.saveAndRenderModuleFn();
	      return;
	    }
	    data.textGroup.removeCol(index);
	    if (this.state.focus.col >= index) {
	      return this.setState({
	        focus: {
	          row: this.state.focus.row,
	          col: Math.min(index, data.textGroup.numCols - 1),
	          offset: 'end'
	        }
	      });
	    }
	  },
	  updateControls: function updateControls(event) {
	    var groupIndex, tgs;
	    this.props.updateSelectionFromDOMFn();
	    tgs = new TextGroupSelection(this.props.chunk, this.props.selection.virtual);
	    if (tgs.type === 'caret') {
	      groupIndex = tgs.start.groupIndex;
	      this.props.chunk.markForUpdate();
	      return this.props.saveAndRenderModuleFn();
	    }
	  },
	  onKeyDown2: function onKeyDown2(newFocus) {
	    if (this.props.chunk.componentContent.textGroup.getIndexForCellPosition(newFocus) !== -1) {
	      this.setState({
	        focus: newFocus
	      });
	      this.props.chunk.markForUpdate();
	      return true;
	    }
	    return false;
	  },
	  onKeyDown: function onKeyDown(event) {
	    var arrowKeyPressed, tgs;
	    arrowKeyPressed = false;
	    tgs = new TextGroupSelection(this.props.chunk, this.props.selection.virtual);
	    if (tgs.type !== 'caret') {
	      return true;
	    }
	    switch (event.keyCode) {
	      case Keyboard.UP_ARROW:
	        this.onKeyDown2({
	          row: this.state.focus.row - 1,
	          col: this.state.focus.col,
	          offset: 'end'
	        });
	        arrowKeyPressed = true;
	        break;
	      case Keyboard.DOWN_ARROW:
	        this.onKeyDown2({
	          row: this.state.focus.row + 1,
	          col: this.state.focus.col,
	          offset: 'end'
	        });
	        arrowKeyPressed = true;
	        break;
	      case Keyboard.RIGHT_ARROW:
	        if (tgs.start.isTextEnd) {
	          if (this.state.focus.col === this.props.chunk.componentContent.textGroup.numCols - 1) {
	            this.onKeyDown2({
	              row: this.state.focus.row + 1,
	              col: 0,
	              offset: 'start'
	            });
	          } else {
	            this.onKeyDown2({
	              row: this.state.focus.row,
	              col: this.state.focus.col + 1,
	              offset: 'start'
	            });
	          }
	          arrowKeyPressed = true;
	        }
	        break;
	      case Keyboard.LEFT_ARROW:
	        if (tgs.start.isTextStart) {
	          if (this.state.focus.col === 0) {
	            if (this.state.focus.row !== 0) {
	              this.onKeyDown2({
	                row: this.state.focus.row - 1,
	                col: this.props.chunk.componentContent.textGroup.numCols - 1,
	                offset: 'end'
	              });
	            }
	          } else {
	            this.onKeyDown2({
	              row: this.state.focus.row,
	              col: this.state.focus.col - 1,
	              offset: 'end'
	            });
	          }
	          arrowKeyPressed = true;
	        }
	    }
	    if (arrowKeyPressed) {
	      event.preventDefault();
	      event.stopPropagation();
	      return false;
	    }
	    return true;
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.shouldPreventTab !== this.props.shouldPreventTab) {
	      return this.props.chunk.markForUpdate();
	    }
	  },
	  shouldComponentUpdate: function shouldComponentUpdate() {
	    return this.props.chunk.needsUpdate;
	  },
	  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	    this.props.chunk.markUpdated();
	    if (this.props.isEditing && !prevProps.isEditing) {
	      setTimeout(function () {
	        this.refs.editTable.focus();
	        return this.updateControls();
	      }.bind(this));
	    }
	    return setTimeout(function () {
	      return this.selectCell();
	    }.bind(this));
	  },
	  selectCell: function selectCell() {
	    var chunk, data, groupIndex, offset, tgs;
	    tgs = new TextGroupSelection(this.props.chunk, this.props.selection.virtual);
	    chunk = this.props.chunk;
	    data = chunk.componentContent;
	    if (tgs.type === 'caret') {
	      groupIndex = data.textGroup.getIndexForCellPosition(this.state.focus);
	      if (tgs.start.groupIndex !== groupIndex) {
	        offset = function () {
	          switch (this.state.focus.offset) {
	            case 'start':
	              return 0;
	            case 'end':
	              return data.textGroup.get(groupIndex).text.length;
	          }
	        }.call(this);
	        this.props.selection.virtual.setCaret(this.props.chunk, {
	          offset: offset,
	          groupIndex: groupIndex
	        });
	        return this.props.selection.selectDOM();
	      }
	    }
	  },
	  onTableMenuCommand: function onTableMenuCommand(info) {
	    this.refs.editTable.focus();
	    switch (info.command) {
	      case 'insertColLeft':
	        return this.addCol(info.col);
	      case 'insertColRight':
	        return this.addCol(info.col + 1);
	      case 'insertRowAbove':
	        return this.addRow(info.row);
	      case 'insertRowBelow':
	        return this.addRow(info.row + 1);
	      case 'deleteCol':
	        return this.removeCol(info.col);
	      case 'deleteRow':
	        return this.removeRow(info.row);
	    }
	  },
	  onEditButtonClick: function onEditButtonClick(event) {
	    event.preventDefault();
	    return this.startEditing();
	  },
	  onDeleteButtonClick: function onDeleteButtonClick(event) {
	    var chunk;
	    chunk = this.props.chunk;
	    chunk.revert();
	    chunk.selectStart();
	    return this.props.saveAndRenderModuleFn();
	  },
	  onDoubleClick: function onDoubleClick(event) {
	    var attrs, el, els, i, len;
	    if (document.elementsFromPoint != null) {
	      els = document.elementsFromPoint(event.clientX, event.clientY);
	      for (i = 0, len = els.length; i < len; i++) {
	        el = els[i];
	        if (el.getAttribute('data-table-position') != null) {
	          attrs = el.getAttribute('data-table-position').split(',');
	          if (attrs[0] === this.props.chunk.get('id')) {
	            return this.startEditing(~~attrs[1], ~~attrs[2]);
	          }
	        }
	      }
	    }
	    return this.startEditing(0, 0);
	  },
	  startEditing: function startEditing(row, col) {
	    if (row == null) {
	      row = 0;
	    }
	    if (col == null) {
	      col = 0;
	    }
	    this.setFocus(row, col, 'end');
	    return this.props.editChunk(this.props.chunk, {
	      textControlsEnabled: true
	    });
	  },
	  setFocus: function setFocus(row, col, offset) {
	    this.props.chunk.markForUpdate();
	    return this.setState({
	      focus: {
	        row: row,
	        col: col,
	        offset: offset
	      }
	    });
	  },
	  onAnchorKeyDown: function onAnchorKeyDown(event) {
	    this.props.onKeyDownPutChunkOnClipboard(event, this.props.chunk);
	    if (event.keyCode === Keyboard.ENTER) {
	      this.startEditing();
	      event.preventDefault();
	      false;
	    }
	    return true;
	  },
	  onCloseButtonClick: function onCloseButtonClick(event) {
	    this.props.stopEditing();
	    this.props.chunk.selectStart();
	    return this.props.saveAndRenderModuleFn();
	  },
	  render: function render() {
	    if (this.props.isEditing) {
	      return this.renderTableWithControls();
	    } else {
	      return this.renderPreview();
	    }
	  },
	  renderTableWithControls: function renderTableWithControls() {
	    var chunk;
	    chunk = this.props.chunk;
	    return React.createElement(
	      NonEditableChunk,
	      { className: 'obojobo-draft--chunks--table editor pad' },
	      React.createElement(
	        'div',
	        { className: 'container editing' },
	        React.createElement(TableControls, {
	          selection: this.props.selection,
	          chunk: this.props.chunk,
	          focus: this.state.focus,
	          addRow: this.addRow,
	          addCol: this.addCol,
	          removeRow: this.removeRow,
	          removeCol: this.removeCol,
	          onTableMenuCommand: this.onTableMenuCommand
	        }),
	        this.renderEditTable()
	      ),
	      React.createElement(Button, { onClick: this.onCloseButtonClick, value: 'Done' })
	    );
	  },
	  renderEditTable: function renderEditTable() {
	    var chunk, data, header, i, numCols, ref, results, row, rows, setFocus, startIndex;
	    chunk = this.props.chunk;
	    data = chunk.componentContent;
	    numCols = data.textGroup.numCols;
	    setFocus = this.setFocus;
	    if (data.header) {
	      row = data.textGroup.items.slice(0, numCols).map(function (textGroupItem, index) {
	        return React.createElement(
	          'th',
	          {
	            key: index,
	            className: 'cell row-0 col-' + index,
	            'data-table-position': chunk.get('id') + ',0,' + index,
	            onClick: setFocus.bind(null, 0, index, 'end')
	          },
	          React.createElement(TextGroupEl, { text: textGroupItem.text, groupIndex: index })
	        );
	      });
	      header = React.createElement(
	        'tr',
	        { key: 'header' },
	        row
	      );
	    } else {
	      header = null;
	    }
	    startIndex = data.header ? 1 : 0;
	    rows = function () {
	      results = [];
	      for (var i = startIndex, ref = data.textGroup.numRows; startIndex <= ref ? i < ref : i > ref; startIndex <= ref ? i++ : i--) {
	        results.push(i);
	      }
	      return results;
	    }.apply(this).map(function (rowNum) {
	      row = data.textGroup.items.slice(rowNum * numCols, (rowNum + 1) * numCols).map(function (textGroupItem, index) {
	        return React.createElement(
	          'td',
	          {
	            key: index,
	            className: 'cell row-' + rowNum + ' col-' + index,
	            'data-table-position': chunk.get('id') + ',' + rowNum + ',' + index,
	            onClick: setFocus.bind(null, rowNum, index, 'end')
	          },
	          React.createElement(TextGroupEl, { text: textGroupItem.text, groupIndex: rowNum * numCols + index })
	        );
	      });
	      return React.createElement(
	        'tr',
	        { key: rowNum },
	        row
	      );
	    });
	    return React.createElement(
	      'table',
	      {
	        className: 'edit-table',
	        ref: 'editTable',
	        key: 'editTable',
	        contentEditable: 'true',
	        suppressContentEditableWarning: true,
	        onClick: this.updateControls,
	        onKeyDown: this.onKeyDown,
	        onFocus: this.updateControls
	      },
	      React.createElement(
	        'thead',
	        { key: 'thead' },
	        header
	      ),
	      React.createElement(
	        'tbody',
	        { key: 'tbody' },
	        rows
	      )
	    );
	  },
	  renderPreview: function renderPreview() {
	    return React.createElement(
	      FocusableChunk,
	      {
	        className: 'obojobo-draft--chunks--table preview outline-on-selection highlight-on-hover',
	        onKeyDown: this.onAnchorKeyDown,
	        onDoubleClick: this.onDoubleClick,
	        shouldPreventTab: this.props.shouldPreventTab
	      },
	      React.createElement(Viewer, this.props),
	      React.createElement(EditButton, { onClick: this.onEditButtonClick }),
	      React.createElement(DeleteButton, { onClick: this.onDeleteButtonClick })
	    );
	  }
	});

	Table.register();

	module.exports = Table;

/***/ },

/***/ 181:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DEFAULT_NUM_COLS, DEFAULT_NUM_ROWS, GridButton, MOUSE_OUT_DELAY_MS, NUM_COLS, NUM_ROWS;

	__webpack_require__(219);

	MOUSE_OUT_DELAY_MS = 500;

	NUM_ROWS = 6;

	NUM_COLS = 6;

	DEFAULT_NUM_ROWS = 3;

	DEFAULT_NUM_COLS = 2;

	GridButton = React.createClass({
	  displayName: 'GridButton',

	  getInitialState: function getInitialState() {
	    return {
	      open: false,
	      desiredRows: DEFAULT_NUM_ROWS,
	      desiredCols: DEFAULT_NUM_COLS
	    };
	  },
	  onButtonMouseOver: function onButtonMouseOver() {
	    this.setDimensions(DEFAULT_NUM_ROWS, DEFAULT_NUM_COLS);
	    return this.onMouseOver();
	  },
	  onMouseOver: function onMouseOver() {
	    clearInterval(this.mouseOutTimeoutId);
	    return this.setState({
	      open: true
	    });
	  },
	  onMouseOut: function onMouseOut() {
	    return this.mouseOutTimeoutId = setTimeout(function () {
	      return this.setState(this.getInitialState());
	    }.bind(this), MOUSE_OUT_DELAY_MS);
	  },
	  onMouseDown: function onMouseDown() {
	    event.preventDefault();
	    this.setState(this.getInitialState());
	    return this.props.commandHandler(this.props.command, {
	      rows: this.state.desiredRows,
	      cols: this.state.desiredCols
	    });
	  },
	  setDimensions: function setDimensions(rows, cols) {
	    return this.setState({
	      desiredRows: rows,
	      desiredCols: cols
	    });
	  },
	  createRow: function createRow(rowIndex) {
	    var i, onMouseDown, results, self, setDimensions, state;
	    state = this.state;
	    setDimensions = this.setDimensions;
	    onMouseDown = this.onMouseDown;
	    self = this;
	    return React.createElement('tr', {
	      key: rowIndex
	    }, function () {
	      results = [];
	      for (var i = 0; 0 <= NUM_COLS ? i < NUM_COLS : i > NUM_COLS; 0 <= NUM_COLS ? i++ : i--) {
	        results.push(i);
	      }
	      return results;
	    }.apply(this).map(function (colIndex) {
	      return React.createElement('td', {
	        className: (rowIndex <= state.desiredRows - 1 && colIndex <= state.desiredCols - 1 ? 'selected ' : '') + (rowIndex + 1 + '-' + (colIndex + 1)),
	        key: rowIndex + '-' + colIndex,
	        onMouseOver: setDimensions.bind(self, rowIndex + 1, colIndex + 1),
	        onMouseDown: onMouseDown.bind(self)
	      });
	    }));
	  },
	  render: function render() {
	    var createRow, grid, i, results, rows, tooltip;
	    createRow = this.createRow;
	    if (this.state.open) {
	      rows = function () {
	        results = [];
	        for (var i = 0; 0 <= NUM_ROWS ? i < NUM_ROWS : i > NUM_ROWS; 0 <= NUM_ROWS ? i++ : i--) {
	          results.push(i);
	        }
	        return results;
	      }.apply(this).map(function (index) {
	        return createRow(index);
	      });
	      grid = React.createElement(
	        'table',
	        {
	          onMouseOver: this.onMouseOver,
	          onMouseOut: this.onMouseOut,
	          key: 'table'
	        },
	        React.createElement(
	          'tbody',
	          null,
	          rows
	        )
	      );
	      tooltip = React.createElement(
	        'div',
	        { className: 'tooltip', key: 'tip' },
	        'Insert ',
	        this.state.desiredRows,
	        '\xD7',
	        this.state.desiredCols,
	        ' table'
	      );
	    } else {
	      grid = null;
	      tooltip = null;
	    }
	    return React.createElement(
	      'div',
	      { className: 'grid-button', key: 'button', onMouseDown: this.onMouseDown.bind(this, DEFAULT_NUM_ROWS, DEFAULT_NUM_COLS) },
	      React.createElement(
	        'a',
	        {
	          onMouseOver: this.onButtonMouseOver,
	          onMouseOut: this.onMouseOut,
	          alt: this.props.command.label,
	          style: { 'backgroundImage': 'url("' + this.props.command.icon + '")' }
	        },
	        'this.props.command.label'
	      ),
	      React.createElement(
	        'div',
	        { className: 'table-container' },
	        grid,
	        tooltip
	      )
	    );
	  }
	});

	module.exports = GridButton;

/***/ },

/***/ 182:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft, TableControls, TableMenu, insertButton;

	__webpack_require__(220);

	TableMenu = __webpack_require__(183);

	insertButton = __webpack_require__(254);

	ObojoboDraft = window.ObojoboDraft;

	TableControls = React.createClass({
	  displayName: 'TableControls',

	  addRow: function addRow(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    return this.props.addRow();
	  },
	  addCol: function addCol(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    return this.props.addCol();
	  },
	  getCellPosition: function getCellPosition(type, position) {
	    var bbox, cell, cellBbox, el;
	    el = this.props.chunk.getDomEl();
	    bbox = this.refs.self.getBoundingClientRect();
	    cellBbox = function () {
	      switch (type) {
	        case 'row':
	          cell = el.querySelector(".row-" + position + ".col-0");
	          return cell.getBoundingClientRect();
	        case 'col':
	          cell = el.querySelector(".row-0.col-" + position);
	          return cell.getBoundingClientRect();
	      }
	    }();
	    return {
	      left: cellBbox.left - bbox.left,
	      top: cellBbox.top - bbox.top,
	      right: cellBbox.right - bbox.right,
	      bottom: cellBbox.bottom - bbox.bottom,
	      width: cellBbox.width,
	      height: cellBbox.height
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    return this.positionMenus();
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    return this.positionMenus();
	  },
	  positionMenus: function positionMenus() {
	    var getCellPosition, i, j, ref, ref1, refs, results, results1;
	    refs = this.refs;
	    getCellPosition = this.getCellPosition;
	    (function () {
	      results = [];
	      for (var i = 0, ref = this.props.chunk.componentContent.textGroup.numRows; 0 <= ref ? i < ref : i > ref; 0 <= ref ? i++ : i--) {
	        results.push(i);
	      }
	      return results;
	    }).apply(this).map(function (index) {
	      var el, pos;
	      el = ReactDOM.findDOMNode(refs["menu_row_" + index]);
	      pos = getCellPosition('row', index);
	      el.style.left = pos.left + "px";
	      return el.style.top = pos.top + "px";
	    });
	    return function () {
	      results1 = [];
	      for (var j = 0, ref1 = this.props.chunk.componentContent.textGroup.numCols; 0 <= ref1 ? j < ref1 : j > ref1; 0 <= ref1 ? j++ : j--) {
	        results1.push(j);
	      }
	      return results1;
	    }.apply(this).map(function (index) {
	      var el, pos;
	      el = ReactDOM.findDOMNode(refs["menu_col_" + index]);
	      pos = getCellPosition('col', index);
	      el.style.left = pos.left + "px";
	      return el.style.top = pos.top + "px";
	    });
	  },
	  render: function render() {
	    var bgInsert, cols, getCellPosition, i, j, onTableMenuCommand, ref, ref1, results, results1, rows;
	    onTableMenuCommand = this.props.onTableMenuCommand;
	    bgInsert = ObojoboDraft.util.getBackgroundImage(insertButton);
	    getCellPosition = this.getCellPosition;
	    rows = function () {
	      results = [];
	      for (var i = 0, ref = this.props.chunk.componentContent.textGroup.numRows; 0 <= ref ? i < ref : i > ref; 0 <= ref ? i++ : i--) {
	        results.push(i);
	      }
	      return results;
	    }.apply(this).map(function (index) {
	      return React.createElement(TableMenu, {
	        onMenuCommand: onTableMenuCommand,
	        type: 'row',
	        row: index,
	        ref: 'menu_row_' + index
	      });
	    });
	    cols = function () {
	      results1 = [];
	      for (var j = 0, ref1 = this.props.chunk.componentContent.textGroup.numCols; 0 <= ref1 ? j < ref1 : j > ref1; 0 <= ref1 ? j++ : j--) {
	        results1.push(j);
	      }
	      return results1;
	    }.apply(this).map(function (index) {
	      return React.createElement(TableMenu, {
	        onMenuCommand: onTableMenuCommand,
	        type: 'col',
	        col: index,
	        ref: 'menu_col_' + index
	      });
	    });
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--chunks--table--table-controls', ref: 'self' },
	      React.createElement(
	        'div',
	        { className: 'rows' },
	        rows
	      ),
	      React.createElement(
	        'div',
	        { className: 'cols' },
	        cols
	      ),
	      React.createElement(
	        'button',
	        {
	          className: 'add-row',
	          key: '0',
	          onMouseDown: this.addRow,
	          style: {
	            backgroundImage: bgInsert
	          } },
	        'Add a row'
	      ),
	      React.createElement(
	        'button',
	        {
	          className: 'add-col',
	          key: '1',
	          onMouseDown: this.addCol,
	          style: {
	            backgroundImage: bgInsert
	          } },
	        'Add a column'
	      )
	    );
	  }
	});

	module.exports = TableControls;

/***/ },

/***/ 183:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Assets, ObojoboDraft, TableMenu, icon;

	__webpack_require__(221);

	ObojoboDraft = window.ObojoboDraft;

	Assets = ObojoboDraft.Assets;

	icon = ObojoboDraft.util.getBackgroundImage(__webpack_require__(255));

	TableMenu = React.createClass({
	  displayName: 'TableMenu',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      row: null,
	      col: null,
	      type: null,
	      onMenuCommand: function onMenuCommand() {}
	    };
	  },
	  onClick: function onClick(cmd, event) {
	    event.preventDefault();
	    event.stopPropagation();
	    this.props.onMenuCommand({
	      row: this.props.row,
	      col: this.props.col,
	      command: cmd
	    });
	    return false;
	  },
	  render: function render() {
	    switch (this.props.type) {
	      case 'row':
	        return this.renderRow();
	      case 'col':
	        return this.renderCol();
	      default:
	        return null;
	    }
	  },
	  renderRow: function renderRow() {
	    var styles;
	    styles = {
	      backgroundImage: icon
	    };
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--chunks--table--table-menu row', style: styles },
	      React.createElement(
	        'ul',
	        null,
	        React.createElement(
	          'li',
	          { className: 'insert-above', onClick: this.onClick.bind(null, 'insertRowAbove') },
	          'Insert 1 row above'
	        ),
	        React.createElement(
	          'li',
	          { className: 'insert-below', onClick: this.onClick.bind(null, 'insertRowBelow') },
	          'Insert 1 row below'
	        ),
	        React.createElement(
	          'li',
	          { className: 'delete', onClick: this.onClick.bind(null, 'deleteRow') },
	          'Delete this row'
	        )
	      )
	    );
	  },
	  renderCol: function renderCol() {
	    var styles;
	    styles = {
	      backgroundImage: icon
	    };
	    return React.createElement(
	      'div',
	      { className: 'obojobo-draft--chunks--table--table-menu col', style: styles },
	      React.createElement(
	        'ul',
	        null,
	        React.createElement(
	          'li',
	          { className: 'insert-left', onClick: this.onClick.bind(null, 'insertColLeft') },
	          'Insert 1 column left'
	        ),
	        React.createElement(
	          'li',
	          { className: 'insert-right', onClick: this.onClick.bind(null, 'insertColRight') },
	          'Insert 1 column right'
	        ),
	        React.createElement(
	          'li',
	          { className: 'delete', onClick: this.onClick.bind(null, 'deleteCol') },
	          'Delete this column'
	        )
	      )
	    );
	  }
	});

	module.exports = TableMenu;

/***/ },

/***/ 218:
109,

/***/ 219:
109,

/***/ 220:
109,

/***/ 221:
109,

/***/ 253:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 19.5 14.75'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bopacity:0.55;%7D.cls-2%7Bfill:none;stroke:%23231f20;stroke-miterlimit:10;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Etable%3C/title%3E%3Cg class='cls-1'%3E%3Crect class='cls-2' x='0.5' y='0.5' width='18.5' height='13.75'/%3E%3Cline class='cls-2' x1='9.75' y1='0.5' x2='9.75' y2='14.25'/%3E%3Cline class='cls-2' x1='0.5' y1='9.67' x2='19' y2='9.67'/%3E%3Cline class='cls-2' x1='0.5' y1='5.08' x2='19' y2='5.08'/%3E%3C/g%3E%3C/svg%3E"

/***/ },

/***/ 254:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 18.1 27.3' style='enable-background:new 0 0 18.1 27.3;' xml:space='preserve'%3E %3Cstyle type='text/css'%3E .st0%7Bfill:%23FFFFFF;stroke:%236714bd;stroke-miterlimit:10;%7D .st1%7Bfill:%236714bd;%7D %3C/style%3E %3Cg class='g'%3E %3Cpath class='st0' d='M17.6,9.1V4.5c0-2.2-1.8-4-4-4H4.5c-2.2,0-4,1.8-4,4v4.6v4.6v4l8.6,9l8.6-9L17.6,9.1L17.6,9.1z'/%3E %3Cpolygon class='st1' points='13.8,9 10.4,9 10.4,5.6 7.7,5.6 7.7,9 4.3,9 4.3,11.7 7.7,11.7 7.7,15.1 10.4,15.1 10.4,11.7 13.8,11.7 '/%3E %3C/g%3E %3C/svg%3E"

/***/ },

/***/ 255:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 25'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23bcbcbc;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Etable-menu-icon%3C/title%3E%3Cpath class='cls-1' d='M25,25H0V0H25V25ZM1,24H24V1H1V24Z'/%3E%3Cpolygon class='cls-1' points='12.5 17.39 16.72 12.5 20.93 7.61 12.5 7.61 4.07 7.61 8.28 12.5 12.5 17.39'/%3E%3C/svg%3E"

/***/ },

/***/ 256:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_7' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 32 32' style='enable-background:new 0 0 32 32;' xml:space='preserve'%3E %3Cstyle type='text/css'%3E .st0%7Bfill:none;stroke:%23000000;stroke-miterlimit:10;%7D %3C/style%3E %3Cg%3E %3Crect x='4.4' y='7.4' class='st0' width='23.3' height='17.3'/%3E %3Cline class='st0' x1='16' y1='7.4' x2='16' y2='24.6'/%3E %3Cline class='st0' x1='4.4' y1='18.9' x2='27.6' y2='18.9'/%3E %3Cline class='st0' x1='4.4' y1='13.1' x2='27.6' y2='13.1'/%3E %3C/g%3E %3C/svg%3E"

/***/ }

/******/ })));