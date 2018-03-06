/******/ ;(function(modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/ var installedModules = {} // The require function
	/******/
	/******/ /******/ function __webpack_require__(moduleId) {
		/******/
		/******/ // Check if module is in cache
		/******/ if (installedModules[moduleId]) {
			/******/ return installedModules[moduleId].exports
			/******/
		} // Create a new module (and put it into the cache)
		/******/ /******/ var module = (installedModules[moduleId] = {
			/******/ i: moduleId,
			/******/ l: false,
			/******/ exports: {}
			/******/
		}) // Execute the module function
		/******/
		/******/ /******/ modules[moduleId].call(
			module.exports,
			module,
			module.exports,
			__webpack_require__
		) // Flag the module as loaded
		/******/
		/******/ /******/ module.l = true // Return the exports of the module
		/******/
		/******/ /******/ return module.exports
		/******/
	} // expose the modules object (__webpack_modules__)
	/******/
	/******/
	/******/ /******/ __webpack_require__.m = modules // expose the module cache
	/******/
	/******/ /******/ __webpack_require__.c = installedModules // identity function for calling harmony imports with the correct context
	/******/
	/******/ /******/ __webpack_require__.i = function(value) {
		return value
	} // define getter function for harmony exports
	/******/
	/******/ /******/ __webpack_require__.d = function(exports, name, getter) {
		/******/ if (!__webpack_require__.o(exports, name)) {
			/******/ Object.defineProperty(exports, name, {
				/******/ configurable: false,
				/******/ enumerable: true,
				/******/ get: getter
				/******/
			})
			/******/
		}
		/******/
	} // getDefaultExport function for compatibility with non-harmony modules
	/******/
	/******/ /******/ __webpack_require__.n = function(module) {
		/******/ var getter =
			module && module.__esModule
				? /******/ function getDefault() {
						return module['default']
					}
				: /******/ function getModuleExports() {
						return module
					}
		/******/ __webpack_require__.d(getter, 'a', getter)
		/******/ return getter
		/******/
	} // Object.prototype.hasOwnProperty.call
	/******/
	/******/ /******/ __webpack_require__.o = function(object, property) {
		return Object.prototype.hasOwnProperty.call(object, property)
	} // __webpack_public_path__
	/******/
	/******/ /******/ __webpack_require__.p = 'build/' // Load entry module and return exports
	/******/
	/******/ /******/ return __webpack_require__((__webpack_require__.s = 176))
	/******/
})(
	/************************************************************************/
	/******/ {
		/***/ /***/ 0: function(module, exports) {
			module.exports = Common

			/***/
		},

		/***/ /***/ 154: function(module, exports) {
			// removed by extract-text-webpack-plugin
			/***/
		},

		/***/ /***/ 176: function(module, exports, __webpack_require__) {
			module.exports = __webpack_require__(38)

			/***/
		},

		/***/ /***/ 18: function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i]
						descriptor.enumerable = descriptor.enumerable || false
						descriptor.configurable = true
						if ('value' in descriptor) descriptor.writable = true
						Object.defineProperty(target, descriptor.key, descriptor)
					}
				}
				return function(Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps)
					if (staticProps) defineProperties(Constructor, staticProps)
					return Constructor
				}
			})()

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError('Cannot call a class as a function')
				}
			}

			function _possibleConstructorReturn(self, call) {
				if (!self) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
				}
				return call && (typeof call === 'object' || typeof call === 'function') ? call : self
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== 'function' && superClass !== null) {
					throw new TypeError(
						'Super expression must either be null or a function, not ' + typeof superClass
					)
				}
				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
				})
				if (superClass)
					Object.setPrototypeOf
						? Object.setPrototypeOf(subClass, superClass)
						: (subClass.__proto__ = superClass)
			}

			var TextGroup = _Common2.default.textGroup.TextGroup
			var TextGroupItem = _Common2.default.textGroup.TextGroupItem

			var Util = _Common2.default.textGroup.TextGroupUtil
			var StyleableText = _Common2.default.text.StyleableText

			var GridTextGroup = (function(_TextGroup) {
				_inherits(GridTextGroup, _TextGroup)

				function GridTextGroup(numRows, numCols, dataTemplate, initialItems) {
					_classCallCheck(this, GridTextGroup)

					var _this = _possibleConstructorReturn(
						this,
						(GridTextGroup.__proto__ || Object.getPrototypeOf(GridTextGroup))
							.call(this, numRows * numCols, dataTemplate, initialItems)
					)

					_this.numRows = numRows
					_this.numCols = numCols
					_this.fill()
					return _this
				}

				_createClass(
					GridTextGroup,
					[
						{
							key: 'addRow',
							value: function addRow(rowIndex, text, data) {
								if (rowIndex == null) {
									rowIndex = this.numRows
								}
								if (text == null) {
									text = null
								}
								if (data == null) {
									data = null
								}
								// 0 | 1 | 2
								// 3 | 4 | 5
								// 6 | 7 | 8

								this.maxItems += this.numCols

								var firstInRowIndex = rowIndex * this.numCols
								for (
									var i = firstInRowIndex,
										end = firstInRowIndex + this.numCols - 1,
										asc = firstInRowIndex <= end;
									asc ? i <= end : i >= end;
									asc ? i++ : i--
								) {
									this.addAt(i, text, data)
								}

								this.numRows++

								return this
							}
						},
						{
							key: 'addCol',
							value: function addCol(colIndex, text, data) {
								if (colIndex == null) {
									colIndex = this.numCols
								}
								if (text == null) {
									text = null
								}
								if (data == null) {
									data = null
								}
								this.maxItems += this.numRows

								for (var i = this.numRows - 1; i >= 0; i--) {
									this.addAt(i * this.numCols + colIndex, text, data)
								}

								this.numCols++

								return this
							}
						},
						{
							key: 'removeRow',
							value: function removeRow(rowIndex) {
								if (rowIndex == null) {
									rowIndex = this.numRows - 1
								}
								this.maxItems -= this.numCols

								var firstInRowIndex = rowIndex * this.numCols
								for (
									var i = firstInRowIndex,
										end = firstInRowIndex + this.numCols - 1,
										asc = firstInRowIndex <= end;
									asc ? i <= end : i >= end;
									asc ? i++ : i--
								) {
									this.remove(firstInRowIndex)
								}

								this.numRows--

								return this
							}
						},
						{
							key: 'removeCol',
							value: function removeCol(colIndex) {
								if (colIndex == null) {
									colIndex = this.numCols - 1
								}
								this.maxItems -= this.numRows

								for (var i = this.numRows - 1; i >= 0; i--) {
									this.remove(i * this.numCols + colIndex)
								}

								this.numCols--

								return this
							}
						},
						{
							key: 'clone',
							value: function clone(cloneDataFn) {
								if (cloneDataFn == null) {
									cloneDataFn = Util.defaultCloneFn
								}
								var clonedItems = []

								var _iteratorNormalCompletion = true
								var _didIteratorError = false
								var _iteratorError = undefined

								try {
									for (
										var _iterator = this.items[Symbol.iterator](), _step;
										!(_iteratorNormalCompletion = (_step = _iterator.next()).done);
										_iteratorNormalCompletion = true
									) {
										var item = _step.value

										clonedItems.push(item.clone(cloneDataFn))
									}
								} catch (err) {
									_didIteratorError = true
									_iteratorError = err
								} finally {
									try {
										if (!_iteratorNormalCompletion && _iterator.return) {
											_iterator.return()
										}
									} finally {
										if (_didIteratorError) {
											throw _iteratorError
										}
									}
								}

								return new GridTextGroup(this.numRows, this.numCols, this.dataTemplate, clonedItems)
							}
						},
						{
							key: 'toDescriptor',
							value: function toDescriptor(dataToDescriptorFn) {
								if (dataToDescriptorFn == null) {
									dataToDescriptorFn = Util.defaultCloneFn
								}
								var desc = []

								var _iteratorNormalCompletion2 = true
								var _didIteratorError2 = false
								var _iteratorError2 = undefined

								try {
									for (
										var _iterator2 = this.items[Symbol.iterator](), _step2;
										!(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
										_iteratorNormalCompletion2 = true
									) {
										var item = _step2.value

										desc.push({
											text: item.text.getExportedObject(),
											data: dataToDescriptorFn(item.data)
										})
									}
								} catch (err) {
									_didIteratorError2 = true
									_iteratorError2 = err
								} finally {
									try {
										if (!_iteratorNormalCompletion2 && _iterator2.return) {
											_iterator2.return()
										}
									} finally {
										if (_didIteratorError2) {
											throw _iteratorError2
										}
									}
								}

								return {
									textGroup: desc,
									numRows: this.numRows,
									numCols: this.numCols
								}
							}
						},
						{
							key: '__grid_print',
							value: function __grid_print() {
								var _this2 = this

								var s = void 0
								var i = void 0,
									item = void 0
								console.log('========================')
								return __range__(0, this.numRows, false).map(function(row) {
									return (// console.log 'row', row
										(s = []), __range__(0, _this2.numCols, false).map(function(col) {
											return (// console.log '  col', col
												(i = row * _this2.numCols + col), // console.log '    i', i
												(item =
													_this2.items[i]), s.push((item.text.value + '          ').substr(0, 10)) )
										}), console.log(s) )
								})
							}
						}
					],
					[
						{
							key: 'fromDescriptor',
							value: function fromDescriptor(
								descriptor,
								maxItems,
								dataTemplate,
								restoreDataDescriptorFn
							) {
								if (restoreDataDescriptorFn == null) {
									restoreDataDescriptorFn = Util.defaultCloneFn
								}
								var items = []
								var _iteratorNormalCompletion3 = true
								var _didIteratorError3 = false
								var _iteratorError3 = undefined

								try {
									for (
										var _iterator3 = Array.from(descriptor.textGroup)[Symbol.iterator](), _step3;
										!(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done);
										_iteratorNormalCompletion3 = true
									) {
										var item = _step3.value

										items.push(
											new TextGroupItem(
												StyleableText.createFromObject(item.text),
												restoreDataDescriptorFn(item.data)
											)
										)
									}
								} catch (err) {
									_didIteratorError3 = true
									_iteratorError3 = err
								} finally {
									try {
										if (!_iteratorNormalCompletion3 && _iterator3.return) {
											_iterator3.return()
										}
									} finally {
										if (_didIteratorError3) {
											throw _iteratorError3
										}
									}
								}

								return new GridTextGroup(
									descriptor.numRows,
									descriptor.numCols,
									dataTemplate,
									items
								)
							}
						},
						{
							key: 'create',
							value: function create(numRows, numCols, dataTemplate) {
								if (dataTemplate == null) {
									dataTemplate = {}
								}
								var group = new GridTextGroup(numRows, numCols, dataTemplate)
								group.init(group.maxItems)

								return group
							}
						}
					]
				)

				return GridTextGroup
			})(TextGroup)
			// console.log '---------------------'

			// window.GridTextGroup = GridTextGroup

			// window.g = new GridTextGroup(2,2)
			// g.init(4)
			// g.get(0).text.value = 'a0'
			// g.get(1).text.value = 'a1'
			// g.get(2).text.value = 'b0'
			// g.get(3).text.value = 'b1'

			exports.default = GridTextGroup

			function __range__(left, right, inclusive) {
				var range = []
				var ascending = left < right
				var end = !inclusive ? right : ascending ? right + 1 : right - 1
				for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
					range.push(i)
				}
				return range
			}

			/***/
		},

		/***/ /***/ 19: function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i]
						descriptor.enumerable = descriptor.enumerable || false
						descriptor.configurable = true
						if ('value' in descriptor) descriptor.writable = true
						Object.defineProperty(target, descriptor.key, descriptor)
					}
				}
				return function(Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps)
					if (staticProps) defineProperties(Constructor, staticProps)
					return Constructor
				}
			})()

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError('Cannot call a class as a function')
				}
			}

			function _possibleConstructorReturn(self, call) {
				if (!self) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
				}
				return call && (typeof call === 'object' || typeof call === 'function') ? call : self
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== 'function' && superClass !== null) {
					throw new TypeError(
						'Super expression must either be null or a function, not ' + typeof superClass
					)
				}
				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
				})
				if (superClass)
					Object.setPrototypeOf
						? Object.setPrototypeOf(subClass, superClass)
						: (subClass.__proto__ = superClass)
			}

			var SelectionHandler = void 0

			var TextGroupSelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler
			var TextGroupSelection = _Common2.default.textGroup.TextGroupSelection

			exports.default = SelectionHandler = (function(_TextGroupSelectionHa) {
				_inherits(SelectionHandler, _TextGroupSelectionHa)

				function SelectionHandler() {
					_classCallCheck(this, SelectionHandler)

					return _possibleConstructorReturn(
						this,
						(SelectionHandler.__proto__ || Object.getPrototypeOf(SelectionHandler))
							.apply(this, arguments)
					)
				}

				_createClass(SelectionHandler, [
					{
						key: 'selectAll',
						value: function selectAll(selection, chunk) {
							var tgs = new TextGroupSelection(chunk, selection.virtual)

							if (tgs.type !== 'multipleTextSpan') {
								return tgs.selectText(tgs.start.groupIndex)
							} else {
								return tgs.selectGroup()
							}
						}
					}
				])

				return SelectionHandler
			})(TextGroupSelectionHandler)

			/***/
		},

		/***/ /***/ 38: function(module, exports, __webpack_require__) {
			'use strict'

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			var _selectionHandler = __webpack_require__(19)

			var _selectionHandler2 = _interopRequireDefault(_selectionHandler)

			var _adapter = __webpack_require__(77)

			var _adapter2 = _interopRequireDefault(_adapter)

			var _viewerComponent = __webpack_require__(78)

			var _viewerComponent2 = _interopRequireDefault(_viewerComponent)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			_Common2.default.Store.registerModel('ObojoboDraft.Chunks.Table', {
				type: 'chunk',
				adapter: _adapter2.default,
				componentClass: _viewerComponent2.default,
				selectionHandler: new _selectionHandler2.default()
			})

			/***/
		},

		/***/ /***/ 77: function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _gridTextGroup = __webpack_require__(18)

			var _gridTextGroup2 = _interopRequireDefault(_gridTextGroup)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			var Adapter = {
				construct: function construct(model, attrs) {
					if (
						__guard__(attrs != null ? attrs.content : undefined, function(x) {
							return x.textGroup
						}) != null
					) {
						model.modelState.textGroup = _gridTextGroup2.default.fromDescriptor(
							attrs.content.textGroup,
							Infinity,
							{
								indent: 0
							}
						)
					} else {
						model.modelState.textGroup = _gridTextGroup2.default.create(3, 2)
					}

					if (
						__guard__(attrs != null ? attrs.content : undefined, function(x1) {
							return x1.header
						}) != null
					) {
						return (model.modelState.header = attrs.content.header)
					} else {
						return (model.modelState.header = true)
					}
				},
				clone: function clone(model, _clone) {
					_clone.modelState.textGroup = model.modelState.textGroup.clone()
					return (_clone.modelState.header = model.modelState.header)
				},
				toJSON: function toJSON(model, json) {
					json.content.textGroup = model.modelState.textGroup.toDescriptor()
					return (json.content.header = model.modelState.header)
				},
				toText: function toText(model) {
					var longestStringLength = 0
					var _iteratorNormalCompletion = true
					var _didIteratorError = false
					var _iteratorError = undefined

					try {
						for (
							var _iterator = Array.from(model.modelState.textGroup.items)[Symbol.iterator](),
								_step;
							!(_iteratorNormalCompletion = (_step = _iterator.next()).done);
							_iteratorNormalCompletion = true
						) {
							var textItem = _step.value

							longestStringLength = Math.max(longestStringLength, textItem.text.value.length)
						}
					} catch (err) {
						_didIteratorError = true
						_iteratorError = err
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return()
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError
							}
						}
					}

					var pad = ' '.repeat(longestStringLength)
					var border = '-'.repeat(longestStringLength)

					var text = ''

					text += border + '\n'
					for (
						var row = 0, end = model.modelState.textGroup.numRows, asc = 0 <= end;
						asc ? row < end : row > end;
						asc ? row++ : row--
					) {
						// console.log 'row', row
						var s = []
						for (
							var col = 0, end1 = model.modelState.textGroup.numCols, asc1 = 0 <= end1;
							asc1 ? col < end1 : col > end1;
							asc1 ? col++ : col--
						) {
							// console.log '  col', col
							var i = row * model.modelState.textGroup.numCols + col

							// console.log '    i', i
							var item = model.modelState.textGroup.items[i]
							s.push((item.text.value + pad).substr(0, pad.length))
						}
						text += '| ' + s.join(' | ') + ' |\n' + border + '\n'
					}

					return text
				}
			}

			exports.default = Adapter

			function __guard__(value, transform) {
				return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
			}

			/***/
		},

		/***/ /***/ 78: function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _createClass = (function() {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i]
						descriptor.enumerable = descriptor.enumerable || false
						descriptor.configurable = true
						if ('value' in descriptor) descriptor.writable = true
						Object.defineProperty(target, descriptor.key, descriptor)
					}
				}
				return function(Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps)
					if (staticProps) defineProperties(Constructor, staticProps)
					return Constructor
				}
			})()

			__webpack_require__(154)

			var _gridTextGroup = __webpack_require__(18)

			var _gridTextGroup2 = _interopRequireDefault(_gridTextGroup)

			var _selectionHandler = __webpack_require__(19)

			var _selectionHandler2 = _interopRequireDefault(_selectionHandler)

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			function _classCallCheck(instance, Constructor) {
				if (!(instance instanceof Constructor)) {
					throw new TypeError('Cannot call a class as a function')
				}
			}

			function _possibleConstructorReturn(self, call) {
				if (!self) {
					throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
				}
				return call && (typeof call === 'object' || typeof call === 'function') ? call : self
			}

			function _inherits(subClass, superClass) {
				if (typeof superClass !== 'function' && superClass !== null) {
					throw new TypeError(
						'Super expression must either be null or a function, not ' + typeof superClass
					)
				}
				subClass.prototype = Object.create(superClass && superClass.prototype, {
					constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
				})
				if (superClass)
					Object.setPrototypeOf
						? Object.setPrototypeOf(subClass, superClass)
						: (subClass.__proto__ = superClass)
			}

			var TextGroupEl = _Common2.default.chunk.textChunk.TextGroupEl
			var OboComponent = _Common2.default.components.OboComponent

			var Table = (function(_React$Component) {
				_inherits(Table, _React$Component)

				function Table() {
					_classCallCheck(this, Table)

					return _possibleConstructorReturn(
						this,
						(Table.__proto__ || Object.getPrototypeOf(Table)).apply(this, arguments)
					)
				}

				_createClass(Table, [
					{
						key: 'render',
						value: function render() {
							var _this2 = this

							var header = void 0,
								row = void 0
							var model = this.props.model

							var data = model.modelState
							var numCols = data.textGroup.numCols

							if (data.header) {
								row = data.textGroup.items.slice(0, numCols).map(function(textGroupItem, index) {
									return React.createElement(
										'th',
										{
											key: index,
											className: 'cell row-0 col-' + index,
											'data-table-position': model.get('id') + ',0,' + index
										},
										React.createElement(TextGroupEl, {
											parentModel: _this2.props.model,
											textItem: textGroupItem,
											groupIndex: index
										})
									)
								})

								header = React.createElement('tr', { key: 'header' }, row)
							} else {
								header = null
							}

							var startIndex = data.header ? 1 : 0
							var rows = __range__(startIndex, data.textGroup.numRows, false).map(function(rowNum) {
								row = data.textGroup.items
									.slice(rowNum * numCols, (rowNum + 1) * numCols)
									.map(function(textGroupItem, index) {
										return React.createElement(
											'td',
											{
												key: index,
												className: 'cell row-' + rowNum + ' col-' + index,
												'data-table-position': model.get('id') + ',' + rowNum + ',' + index
											},
											React.createElement(TextGroupEl, {
												parentModel: _this2.props.model,
												textItem: textGroupItem,
												groupIndex: rowNum * numCols + index
											})
										)
									})

								return React.createElement('tr', { key: rowNum }, row)
							})

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
											{ className: 'view', ref: 'table', key: 'table' },
											React.createElement('thead', { key: 'thead' }, header),
											React.createElement('tbody', { key: 'tbody' }, rows)
										)
									)
								)
							)
						}
					}
				])

				return Table
			})(React.Component)

			exports.default = Table

			function __range__(left, right, inclusive) {
				var range = []
				var ascending = left < right
				var end = !inclusive ? right : ascending ? right + 1 : right - 1
				for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
					range.push(i)
				}
				return range
			}

			/***/
		}

		/******/
	}
)
