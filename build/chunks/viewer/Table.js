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

	module.exports = __webpack_require__(91);


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

/***/ }

/******/ });