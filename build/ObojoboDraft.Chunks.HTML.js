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
	/******/ /******/ return __webpack_require__((__webpack_require__.s = 163))
	/******/
})(
	/************************************************************************/
	/******/ {
		/***/ /***/ 0: function(module, exports) {
			module.exports = Common

			/***/
		},

		/***/ /***/ 139: function(module, exports) {
			// removed by extract-text-webpack-plugin
			/***/
		},

		/***/ /***/ 16: function(module, exports) {
			module.exports = katex

			/***/
		},

		/***/ /***/ 163: function(module, exports, __webpack_require__) {
			module.exports = __webpack_require__(29)

			/***/
		},

		/***/ /***/ 29: function(module, exports, __webpack_require__) {
			'use strict'

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			var _adapter = __webpack_require__(55)

			var _adapter2 = _interopRequireDefault(_adapter)

			var _viewerComponent = __webpack_require__(56)

			var _viewerComponent2 = _interopRequireDefault(_viewerComponent)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			var SelectionHandler = _Common2.default.chunk.focusableChunk.FocusableSelectionHandler

			_Common2.default.Store.registerModel('ObojoboDraft.Chunks.HTML', {
				type: 'chunk',
				adapter: _adapter2.default,
				componentClass: _viewerComponent2.default,
				selectionHandler: new SelectionHandler()
			})

			/***/
		},

		/***/ /***/ 55: function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})
			var Adapter = {
				construct: function construct(model, attrs) {
					if (
						__guard__(attrs != null ? attrs.content : undefined, function(x) {
							return x.html
						}) != null
					) {
						model.modelState.html = attrs.content.html
					} else {
						model.modelState.html = null
					}

					if (
						__guard__(attrs != null ? attrs.content : undefined, function(x1) {
							return x1.align
						}) != null
					) {
						return (model.modelState.align = attrs.content.align)
					} else {
						return (model.modelState.align = 'left')
					}
				},
				clone: function clone(model, _clone) {
					_clone.modelState.html = model.modelState.html
					_clone.modelState.align = model.modelState.align
				},
				toJSON: function toJSON(model, json) {
					json.content.html = model.modelState.html
					json.content.align = model.modelState.align
				},
				toText: function toText(model) {
					var node = document.createElement('p')
					node.innerHTML = model.modelState.html

					return node.textContent
				}
			}

			exports.default = Adapter

			function __guard__(value, transform) {
				return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
			}

			/***/
		},

		/***/ /***/ 56: function(module, exports, __webpack_require__) {
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

			__webpack_require__(139)

			var _katex = __webpack_require__(16)

			var _katex2 = _interopRequireDefault(_katex)

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

			var OboComponent = _Common2.default.components.OboComponent

			var HTML = (function(_React$Component) {
				_inherits(HTML, _React$Component)

				function HTML() {
					_classCallCheck(this, HTML)

					return _possibleConstructorReturn(
						this,
						(HTML.__proto__ || Object.getPrototypeOf(HTML)).apply(this, arguments)
					)
				}

				_createClass(HTML, [
					{
						key: 'createMarkup',
						value: function createMarkup() {
							var div = document.createElement('div')
							div.innerHTML = this.props.model.modelState.html

							var latexes = div.querySelectorAll('.latex')

							var _iteratorNormalCompletion = true
							var _didIteratorError = false
							var _iteratorError = undefined

							try {
								for (
									var _iterator = Array.from(latexes)[Symbol.iterator](), _step;
									!(_iteratorNormalCompletion = (_step = _iterator.next()).done);
									_iteratorNormalCompletion = true
								) {
									var el = _step.value

									el.innerHTML = _katex2.default.renderToString(el.innerHTML)
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

							return { __html: div.innerHTML }
						}
					},
					{
						key: 'render',
						value: function render() {
							var data = this.props.model.modelState

							return React.createElement(
								OboComponent,
								{ model: this.props.model, moduleData: this.props.moduleData },
								React.createElement('div', {
									className: 'obojobo-draft--chunks--html viewer pad align-' + data.align,
									dangerouslySetInnerHTML: this.createMarkup()
								})
							)
						}
					}
				])

				return HTML
			})(React.Component)

			exports.default = HTML

			/***/
		}

		/******/
	}
)
