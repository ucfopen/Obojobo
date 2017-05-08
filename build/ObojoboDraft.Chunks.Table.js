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
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(155);


/***/ }),

/***/ 75:
/***/ (function(module, exports) {

	'use strict';

	var Common,
	    GridTextGroup,
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

	Common = window.ObojoboDraft.Common;

	TextGroup = Common.textGroup.TextGroup;

	TextGroupItem = Common.textGroup.TextGroupItem;

	Util = Common.textGroup.TextGroupUtil;

	StyleableText = Common.text.StyleableText;

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

/***/ }),

/***/ 76:
/***/ (function(module, exports) {

	'use strict';

	var Common,
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

	Common = window.ObojoboDraft.Common;

	TextGroupSelectionHandler = Common.chunk.textChunk.TextGroupSelectionHandler;

	TextGroupSelection = Common.textGroup.TextGroupSelection;

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

/***/ }),

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Adapter, GridTextGroup;

	GridTextGroup = __webpack_require__(75);

	Adapter = {
	  construct: function construct(model, attrs) {
	    var ref, ref1;
	    if ((attrs != null ? (ref = attrs.content) != null ? ref.textGroup : void 0 : void 0) != null) {
	      model.modelState.textGroup = GridTextGroup.fromDescriptor(attrs.content.textGroup, 2e308, {
	        indent: 0
	      });
	    } else {
	      model.modelState.textGroup = GridTextGroup.create(3, 2);
	    }
	    if ((attrs != null ? (ref1 = attrs.content) != null ? ref1.header : void 0 : void 0) != null) {
	      return model.modelState.header = attrs.content.header;
	    } else {
	      return model.modelState.header = true;
	    }
	  },
	  clone: function clone(model, _clone) {
	    _clone.modelState.textGroup = model.modelState.textGroup.clone();
	    return _clone.modelState.header = model.modelState.header;
	  },
	  toJSON: function toJSON(model, json) {
	    json.content.textGroup = model.modelState.textGroup.toDescriptor();
	    return json.content.header = model.modelState.header;
	  },
	  toText: function toText(model) {
	    var border, col, i, item, j, k, l, len, longestStringLength, pad, ref, ref1, ref2, row, s, text, textItem;
	    longestStringLength = 0;
	    ref = model.modelState.textGroup.items;
	    for (j = 0, len = ref.length; j < len; j++) {
	      textItem = ref[j];
	      longestStringLength = Math.max(longestStringLength, textItem.text.value.length);
	    }
	    pad = ' '.repeat(longestStringLength);
	    border = '-'.repeat(longestStringLength);
	    text = '';
	    text += border + "\n";
	    for (row = k = 0, ref1 = model.modelState.textGroup.numRows; 0 <= ref1 ? k < ref1 : k > ref1; row = 0 <= ref1 ? ++k : --k) {
	      s = [];
	      for (col = l = 0, ref2 = model.modelState.textGroup.numCols; 0 <= ref2 ? l < ref2 : l > ref2; col = 0 <= ref2 ? ++l : --l) {
	        i = row * model.modelState.textGroup.numCols + col;
	        item = model.modelState.textGroup.items[i];
	        s.push((item.text.value + pad).substr(0, pad.length));
	      }
	      text += "| " + s.join(' | ') + " |" + "\n" + border + "\n";
	    }
	    return text;
	  }
	};

	module.exports = Adapter;

/***/ }),

/***/ 154:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Common, GridTextGroup, OboComponent, SelectionHandler, Table, TextGroupEl;

	__webpack_require__(266);

	GridTextGroup = __webpack_require__(75);

	SelectionHandler = __webpack_require__(76);

	Common = window.ObojoboDraft.Common;

	TextGroupEl = Common.chunk.textChunk.TextGroupEl;

	OboComponent = Common.components.OboComponent;

	Table = React.createClass({
		displayName: 'Table',

		render: function render() {
			var data, header, i, model, numCols, ref, results, row, rows, startIndex;
			model = this.props.model;
			data = model.modelState;
			numCols = data.textGroup.numCols;
			if (data.header) {
				row = data.textGroup.items.slice(0, numCols).map(function (textGroupItem, index) {
					return React.createElement(
						'th',
						{
							key: index,
							className: 'cell row-0 col-' + index,
							'data-table-position': model.get('id') + ',0,' + index
						},
						React.createElement(TextGroupEl, { parentModel: this.props.model, textItem: textGroupItem, groupIndex: index })
					);
				}.bind(this));
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
							'data-table-position': model.get('id') + ',' + rowNum + ',' + index
						},
						React.createElement(TextGroupEl, { parentModel: this.props.model, textItem: textGroupItem, groupIndex: rowNum * numCols + index })
					);
				}.bind(this));
				return React.createElement(
					'tr',
					{ key: rowNum },
					row
				);
			}.bind(this));
			return React.createElement(
				OboComponent,
				{ model: this.props.model, moduleData: this.props.moduleData },
				React.createElement(
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
				)
			);
		}
	});

	module.exports = Table;

/***/ }),

/***/ 155:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft, SelectionHandler;

	SelectionHandler = __webpack_require__(76);

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.Table', {
	  type: 'chunk',
	  adapter: __webpack_require__(153),
	  componentClass: __webpack_require__(154),
	  selectionHandler: new SelectionHandler()
	});

/***/ }),

/***/ 266:
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ })

/******/ });