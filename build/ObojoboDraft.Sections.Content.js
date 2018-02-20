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
	/******/ /******/ return __webpack_require__((__webpack_require__.s = 178))
	/******/
})(
	/************************************************************************/
	/******/ {
		/***/ /***/ 0: function(module, exports) {
			module.exports = Common

			/***/
		},

		/***/ /***/ 1: function(module, exports) {
			module.exports = Viewer

			/***/
		},

		/***/ /***/ 157: function(module, exports) {
			// removed by extract-text-webpack-plugin
			/***/
		},

		/***/ /***/ 178: function(module, exports, __webpack_require__) {
			module.exports = __webpack_require__(43)

			/***/
		},

		/***/ /***/ 43: function(module, exports, __webpack_require__) {
			'use strict'

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			var _viewerComponent = __webpack_require__(89)

			var _viewerComponent2 = _interopRequireDefault(_viewerComponent)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			_Common2.default.Store.registerModel('ObojoboDraft.Sections.Content', {
				type: 'section',
				default: true,
				adapter: null,
				componentClass: _viewerComponent2.default,
				selectionHandler: null,
				getNavItem: function getNavItem(model) {
					return {
						type: 'hidden',
						showChildren: true
					}
				},
				generateNav: function generateNav(model) {
					var nav = []

					for (var index = 0; index < model.children.models.length; index++) {
						var child = model.children.models[index]
						nav.push({
							type: 'link',
							label: child.title,
							id: child.get('id')
						})
					}

					nav.push({
						type: 'seperator'
					})

					return nav
				}
			})

			/***/
		},

		/***/ /***/ 89: function(module, exports, __webpack_require__) {
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

			__webpack_require__(157)

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			var _Viewer = __webpack_require__(1)

			var _Viewer2 = _interopRequireDefault(_Viewer)

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
			var OboModel = _Common2.default.models.OboModel
			var NavUtil = _Viewer2.default.util.NavUtil

			var Content = (function(_React$Component) {
				_inherits(Content, _React$Component)

				function Content() {
					_classCallCheck(this, Content)

					return _possibleConstructorReturn(
						this,
						(Content.__proto__ || Object.getPrototypeOf(Content)).apply(this, arguments)
					)
				}

				_createClass(Content, [
					{
						key: 'render',
						value: function render() {
							var childEl = null
							var navTargetModel = NavUtil.getNavTargetModel(this.props.moduleData.navState)

							if (navTargetModel) {
								var ChildComponent = navTargetModel.getComponentClass()
								childEl = React.createElement(ChildComponent, {
									model: navTargetModel,
									moduleData: this.props.moduleData
								})
							}

							return React.createElement(
								OboComponent,
								{
									model: this.props.model,
									moduleData: this.props.moduleData,
									className: 'obojobo-draft--sections--content'
								},
								React.createElement('div', null, childEl)
							)
						}
					}
				])

				return Content
			})(React.Component)

			exports.default = Content

			/***/
		}

		/******/
	}
)
