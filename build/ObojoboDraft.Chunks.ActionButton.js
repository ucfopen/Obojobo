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

		/***/ /***/ 163: function(module, exports, __webpack_require__) {
			module.exports = __webpack_require__(26)

			/***/
		},

		/***/ /***/ 26: function(module, exports, __webpack_require__) {
			'use strict'

			var _adapter = __webpack_require__(47)

			var _adapter2 = _interopRequireDefault(_adapter)

			var _viewerComponent = __webpack_require__(48)

			var _viewerComponent2 = _interopRequireDefault(_viewerComponent)

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler

			_Common2.default.Store.registerModel('ObojoboDraft.Chunks.ActionButton', {
				type: 'chunk',
				adapter: _adapter2.default,
				componentClass: _viewerComponent2.default,
				selectionHandler: new SelectionHandler() //@TODO
			})

			/***/
		},

		/***/ /***/ 47: function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			var TextGroup = _Common2.default.textGroup.TextGroup

			var TextGroupAdapter = {
				construct: function construct(model, attrs) {
					if (
						__guard__(attrs != null ? attrs.content : undefined, function(x) {
							return x.textGroup
						}) != null
					) {
						model.modelState.textGroup = TextGroup.fromDescriptor(
							attrs.content.textGroup,
							Infinity,
							{
								indent: 0
							}
						)
					} else if (
						__guard__(attrs != null ? attrs.content : undefined, function(x1) {
							return x1.label
						})
					) {
						model.modelState.label = attrs.content.label
					} else {
						model.modelState.label = ''
					}

					if (
						__guard__(attrs != null ? attrs.content : undefined, function(x2) {
							return x2.align
						})
					) {
						return (model.modelState.align = attrs.content.align)
					} else {
						return (model.modelState.align = 'center')
					}
				},
				clone: function clone(model, _clone) {
					if (_clone.modelState.textGroup)
						_clone.modelState.textGroup = model.modelState.textGroup.clone()
					else _clone.modelState.label = model.modelState.label
					_clone.modelState.align = model.modelState.align
				},
				toJSON: function toJSON(model, json) {
					if (json.content.textGroup)
						json.content.textGroup = model.modelState.textGroup.toDescriptor()
					else json.content.label = model.modelState.label
					json.content.align = model.modelState.align
				},
				toText: function toText(model) {
					return model.modelState.textGroup.first.text.value
				}
			}

			exports.default = TextGroupAdapter

			function __guard__(value, transform) {
				return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
			}

			/***/
		},

		/***/ /***/ 48: function(module, exports, __webpack_require__) {
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
			var Button = _Common2.default.components.Button
			var TextGroupEl = _Common2.default.chunk.textChunk.TextGroupEl
			var TextChunk = _Common2.default.chunk.TextChunk

			var ActionButton = (function(_React$Component) {
				_inherits(ActionButton, _React$Component)

				function ActionButton() {
					_classCallCheck(this, ActionButton)

					return _possibleConstructorReturn(
						this,
						(ActionButton.__proto__ || Object.getPrototypeOf(ActionButton)).apply(this, arguments)
					)
				}

				_createClass(ActionButton, [
					{
						key: 'onClick',
						value: function onClick() {
							return this.props.model.processTrigger('onClick')
						}
					},
					{
						key: 'render',
						value: function render() {
							var textItem = this.props.model.modelState.textGroup
								? this.props.model.modelState.textGroup.first
								: ''
							return React.createElement(
								OboComponent,
								{ model: this.props.model, moduleData: this.props.moduleData },
								React.createElement(
									TextChunk,
									{ className: 'obojobo-draft--chunks--action-button pad' },
									React.createElement(
										Button,
										{
											onClick: this.onClick.bind(this),
											value: this.props.model.modelState.label,
											align: this.props.model.modelState.align
										},
										React.createElement(TextGroupEl, {
											textItem: textItem,
											groupIndex: '0',
											parentModel: this.props.model
										})
									)
								)
							)
						}
					}
				])

				return ActionButton
			})(React.Component)

			exports.default = ActionButton

			/***/
		}

		/******/
	}
)
