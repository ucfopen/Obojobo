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
	/******/ /******/ return __webpack_require__((__webpack_require__.s = 172))
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

		/***/ /***/ 147: function(module, exports) {
			// removed by extract-text-webpack-plugin
			/***/
		},

		/***/ /***/ 148: function(module, exports) {
			// removed by extract-text-webpack-plugin
			/***/
		},

		/***/ /***/ 149: function(module, exports) {
			// removed by extract-text-webpack-plugin
			/***/
		},

		/***/ /***/ 15: function(module, exports) {
			// removed by extract-text-webpack-plugin
			/***/
		},

		/***/ /***/ 172: function(module, exports, __webpack_require__) {
			module.exports = __webpack_require__(34)

			/***/
		},

		/***/ /***/ 34: function(module, exports, __webpack_require__) {
			'use strict'

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			__webpack_require__(7)

			__webpack_require__(65)

			__webpack_require__(67)

			var _adapter = __webpack_require__(68)

			var _adapter2 = _interopRequireDefault(_adapter)

			var _viewerComponent = __webpack_require__(69)

			var _viewerComponent2 = _interopRequireDefault(_viewerComponent)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler

			_Common2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment', {
				type: 'chunk',
				adapter: _adapter2.default,
				componentClass: _viewerComponent2.default,
				selectionHandler: new SelectionHandler()
			})

			/***/
		},

		/***/ /***/ 64: function(module, exports, __webpack_require__) {
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

			__webpack_require__(147)

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

			var MCAnswer = (function(_React$Component) {
				_inherits(MCAnswer, _React$Component)

				function MCAnswer() {
					_classCallCheck(this, MCAnswer)

					return _possibleConstructorReturn(
						this,
						(MCAnswer.__proto__ || Object.getPrototypeOf(MCAnswer)).apply(this, arguments)
					)
				}

				_createClass(MCAnswer, [
					{
						key: 'render',
						value: function render() {
							var _this2 = this

							return React.createElement(
								OboComponent,
								{
									model: this.props.model,
									moduleData: this.props.moduleData,
									className: 'obojobo-draft--chunks--mc-assessment--mc-answer'
								},
								this.props.model.children.models.map(function(child, index) {
									var Component = child.getComponentClass()
									return React.createElement(Component, {
										key: child.get('id'),
										model: child,
										moduleData: _this2.props.moduleData
									})
								})
							)
						}
					}
				])

				return MCAnswer
			})(React.Component)

			exports.default = MCAnswer

			/***/
		},

		/***/ /***/ 65: function(module, exports, __webpack_require__) {
			'use strict'

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			var _viewerComponent = __webpack_require__(64)

			var _viewerComponent2 = _interopRequireDefault(_viewerComponent)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler

			_Common2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCAnswer', {
				type: 'chunk',
				adapter: null,
				componentClass: _viewerComponent2.default,
				selectionHandler: new SelectionHandler()
			})

			/***/
		},

		/***/ /***/ 66: function(module, exports, __webpack_require__) {
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

			__webpack_require__(148)

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

			var MCFeedback = (function(_React$Component) {
				_inherits(MCFeedback, _React$Component)

				function MCFeedback() {
					_classCallCheck(this, MCFeedback)

					return _possibleConstructorReturn(
						this,
						(MCFeedback.__proto__ || Object.getPrototypeOf(MCFeedback)).apply(this, arguments)
					)
				}

				_createClass(MCFeedback, [
					{
						key: 'render',
						value: function render() {
							var _this2 = this

							return React.createElement(
								OboComponent,
								{
									model: this.props.model,
									moduleData: this.props.moduleData,
									className:
										'obojobo-draft--chunks--mc-assessment--mc-feedback' +
										(this.props.model.parent.modelState.score === 100
											? ' is-correct-feedback'
											: ' is-incorrect-feedback'),
									'data-choice-label': this.props.label
								},
								this.props.model.children.models.map(function(child, index) {
									var Component = child.getComponentClass()
									return React.createElement(Component, {
										key: child.get('id'),
										model: child,
										moduleData: _this2.props.moduleData
									})
								})
							)
						}
					}
				])

				return MCFeedback
			})(React.Component)

			exports.default = MCFeedback

			/***/
		},

		/***/ /***/ 67: function(module, exports, __webpack_require__) {
			'use strict'

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			var _viewerComponent = __webpack_require__(66)

			var _viewerComponent2 = _interopRequireDefault(_viewerComponent)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler

			_Common2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCFeedback', {
				type: 'chunk',
				adapter: null,
				componentClass: _viewerComponent2.default,
				selectionHandler: new SelectionHandler()
			})

			/***/
		},

		/***/ /***/ 68: function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})
			var Adapter = {
				construct: function construct(model, attrs) {
					if (
						__guard__(attrs != null ? attrs.content : undefined, function(x) {
							return x.responseType
						}) != null
					) {
						model.modelState.responseType = attrs.content.responseType
					} else {
						model.modelState.responseType = ''
					}

					if (
						__guard__(attrs != null ? attrs.content : undefined, function(x) {
							return x.shuffle
						}) == false
					) {
						model.modelState.shuffle = attrs.content.shuffle
					} else {
						model.modelState.shuffle = true
					}
				},
				clone: function clone(model, _clone) {
					_clone.modelState.responseType = model.modelState.responseType
					_clone.modelState.shuffle = model.modelState.shuffle
				},
				toJSON: function toJSON(model, json) {
					json.content.responseType = model.modelState.responseType
					json.content.shuffle = model.modelState.shuffle
				}
			}

			exports.default = Adapter

			function __guard__(value, transform) {
				return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
			}

			/***/
		},

		/***/ /***/ 69: function(module, exports, __webpack_require__) {
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

			__webpack_require__(149)

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

			var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

			var OboComponent = _Common2.default.components.OboComponent
			var Button = _Common2.default.components.Button
			var OboModel = _Common2.default.models.OboModel
			var Dispatcher = _Common2.default.flux.Dispatcher
			var DOMUtil = _Common2.default.page.DOMUtil
			// FocusUtil = Common.util.FocusUtil

			var QuestionUtil = _Viewer2.default.util.QuestionUtil
			var NavUtil = _Viewer2.default.util.NavUtil

			// @TODO - This wont update if new children are passed in via props

			var MCAssessment = (function(_React$Component) {
				_inherits(MCAssessment, _React$Component)

				function MCAssessment(props) {
					_classCallCheck(this, MCAssessment)

					var _this = _possibleConstructorReturn(
						this,
						(MCAssessment.__proto__ || Object.getPrototypeOf(MCAssessment)).call(this, props)
					)

					_this.onClickShowExplanation = _this.onClickShowExplanation.bind(_this)
					_this.onClickHideExplanation = _this.onClickHideExplanation.bind(_this)
					_this.onClickSubmit = _this.onClickSubmit.bind(_this)
					_this.onClickReset = _this.onClickReset.bind(_this)
					_this.onClick = _this.onClick.bind(_this)
					_this.onCheckAnswer = _this.onCheckAnswer.bind(_this)
					_this.isShowingExplanation = _this.isShowingExplanation.bind(_this)
					return _this
				}

				_createClass(MCAssessment, [
					{
						key: 'getQuestionModel',
						value: function getQuestionModel() {
							return this.props.model.getParentOfType('ObojoboDraft.Chunks.Question')
						}
					},
					{
						key: 'getResponseData',
						value: function getResponseData() {
							var questionResponse = QuestionUtil.getResponse(
								this.props.moduleData.questionState,
								this.getQuestionModel(),
								this.props.moduleData.navState.context
							) || { ids: [] }

							var correct = new Set()
							var responses = new Set()
							var childId = void 0

							var _iteratorNormalCompletion = true
							var _didIteratorError = false
							var _iteratorError = undefined

							try {
								for (
									var _iterator = Array.from(this.props.model.children.models)[Symbol.iterator](),
										_step;
									!(_iteratorNormalCompletion = (_step = _iterator.next()).done);
									_iteratorNormalCompletion = true
								) {
									var child = _step.value

									childId = child.get('id')

									if (child.modelState.score === 100) {
										correct.add(childId)
									}

									if (questionResponse.ids.indexOf(childId) !== -1) {
										responses.add(childId)
									}
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

							return {
								correct: correct,
								responses: responses
							}
						}
					},
					{
						key: 'calculateScore',
						value: function calculateScore() {
							var responseData = this.getResponseData()
							var correct = responseData.correct
							var responses = responseData.responses

							switch (this.props.model.modelState.responseType) {
								case 'pick-all':
									if (correct.size !== responses.size) {
										return 0
									}
									var score = 100
									correct.forEach(function(id) {
										if (!responses.has(id)) {
											return (score = 0)
										}
									})
									return score

								default:
									// pick-one | pick-one-multiple-correct
									var _iteratorNormalCompletion2 = true
									var _didIteratorError2 = false
									var _iteratorError2 = undefined

									try {
										for (
											var _iterator2 = Array.from(Array.from(correct))[Symbol.iterator](), _step2;
											!(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
											_iteratorNormalCompletion2 = true
										) {
											var id = _step2.value

											if (responses.has(id)) {
												return 100
											}
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

									return 0
							}
						}
					},
					{
						key: 'isShowingExplanation',
						value: function isShowingExplanation() {
							return QuestionUtil.isShowingExplanation(
								this.props.moduleData.questionState,
								this.getQuestionModel()
							)
						}
					},
					{
						key: 'retry',
						value: function retry() {
							QuestionUtil.retryQuestion(
								this.getQuestionModel().get('id'),
								this.props.moduleData.navState.context
							)
						}
					},
					{
						key: 'hideExplanation',
						value: function hideExplanation() {
							QuestionUtil.hideExplanation(this.getQuestionModel().get('id'), 'user')
						}
					},
					{
						key: 'onClickReset',
						value: function onClickReset(event) {
							event.preventDefault()

							this.retry()
						}
					},
					{
						key: 'onClickSubmit',
						value: function onClickSubmit(event) {
							event.preventDefault()

							QuestionUtil.setScore(
								this.getQuestionModel().get('id'),
								this.calculateScore(),
								this.props.moduleData.navState.context
							)
							QuestionUtil.checkAnswer(this.getQuestionModel().get('id'))
						}
					},
					{
						key: 'onClickShowExplanation',
						value: function onClickShowExplanation(event) {
							event.preventDefault()

							QuestionUtil.showExplanation(this.getQuestionModel().get('id'))
						}
					},
					{
						key: 'onClickHideExplanation',
						value: function onClickHideExplanation(event) {
							event.preventDefault()

							this.hideExplanation()
						}
					},
					{
						key: 'onClick',
						value: function onClick(event) {
							var response = void 0
							var questionModel = this.getQuestionModel()
							var mcChoiceEl = DOMUtil.findParentWithAttr(
								event.target,
								'data-type',
								'ObojoboDraft.Chunks.MCAssessment.MCChoice'
							)
							if (!mcChoiceEl) {
								return
							}

							var mcChoiceId = mcChoiceEl.getAttribute('data-id')
							if (!mcChoiceId) {
								return
							}

							if (this.getScore() !== null) {
								this.retry()
							}

							switch (this.props.model.modelState.responseType) {
								case 'pick-all':
									response = QuestionUtil.getResponse(
										this.props.moduleData.questionState,
										questionModel,
										this.props.moduleData.navState.context
									) || {
										ids: []
									}
									var responseIndex = response.ids.indexOf(mcChoiceId)

									if (responseIndex === -1) {
										response.ids.push(mcChoiceId)
									} else {
										response.ids.splice(responseIndex, 1)
									}
									break

								default:
									response = {
										ids: [mcChoiceId]
									}
									break
							}

							QuestionUtil.setResponse(
								questionModel.get('id'),
								response,
								mcChoiceId,
								this.props.moduleData.navState.context,
								this.props.moduleData.navState.context.split(':')[1],
								this.props.moduleData.navState.context.split(':')[2]
							)
						}
					},
					{
						key: 'getScore',
						value: function getScore() {
							return QuestionUtil.getScoreForModel(
								this.props.moduleData.questionState,
								this.getQuestionModel(),
								this.props.moduleData.navState.context
							)
						}
					},
					{
						key: 'componentWillReceiveProps',
						value: function componentWillReceiveProps() {
							this.sortIds()
						}
					},
					{
						key: 'componentDidMount',
						value: function componentDidMount() {
							Dispatcher.on('question:checkAnswer', this.onCheckAnswer)
						}
					},
					{
						key: 'componentWillUnmount',
						value: function componentWillUnmount() {
							Dispatcher.off('question:checkAnswer', this.onCheckAnswer)
						}
					},
					{
						key: 'onCheckAnswer',
						value: function onCheckAnswer(payload) {
							var questionId = this.getQuestionModel().get('id')

							if (payload.value.id === questionId) {
								QuestionUtil.setScore(
									questionId,
									this.calculateScore(),
									this.props.moduleData.navState.context
								)
							}
						}
					},
					{
						key: 'componentWillMount',
						value: function componentWillMount() {
							this.sortIds()
						}
					},
					{
						key: 'sortIds',
						value: function sortIds() {
							if (
								!QuestionUtil.getData(
									this.props.moduleData.questionState,
									this.props.model,
									'sortedIds'
								)
							) {
								var ids = this.props.model.children.models.map(function(model) {
									return model.get('id')
								})
								if (this.props.model.modelState.shuffle) ids = _.shuffle(ids)
								QuestionUtil.setData(this.props.model.get('id'), 'sortedIds', ids)
							}
						}
					},
					{
						key: 'render',
						value: function render() {
							var _this2 = this

							var responseType = this.props.model.modelState.responseType

							var isShowingExplanation = this.isShowingExplanation()
							var score = this.getScore()
							var questionSubmitted = score !== null
							var questionAnswered = this.getResponseData().responses.size >= 1
							var sortedIds = QuestionUtil.getData(
								this.props.moduleData.questionState,
								this.props.model,
								'sortedIds'
							)
							// sortedIds = _.shuffle(@props.model.children.models).map (model) -> model.get('id')

							if (!sortedIds) return false

							var feedbacks = Array.from(this.getResponseData().responses)
								.filter(function(mcChoiceId) {
									return OboModel.models[mcChoiceId].children.length > 1
								})
								.sort(function(id1, id2) {
									return sortedIds.indexOf(id1) - sortedIds.indexOf(id2)
								})
								.map(function(mcChoiceId) {
									return OboModel.models[mcChoiceId].children.at(1)
								})

							var solution = this.props.model.parent.modelState.solution

							if (solution != null) {
								var SolutionComponent = solution.getComponentClass()
							}

							return React.createElement(
								OboComponent,
								{
									model: this.props.model,
									moduleData: this.props.moduleData,
									onClick: this.props.mode !== 'review' ? this.onClick : null,
									tag: 'form',
									className:
										'obojobo-draft--chunks--mc-assessment' +
										(' is-response-type-' + this.props.model.modelState.responseType) +
										(isShowingExplanation
											? ' is-showing-explanation'
											: ' is-not-showing-explantion') +
										(score === null ? ' is-unscored' : ' is-scored')
								},
								React.createElement(
									'span',
									{ className: 'instructions' },
									(function() {
										switch (responseType) {
											case 'pick-one':
												return React.createElement('span', null, 'Pick the correct answer')
											case 'pick-one-multiple-correct':
												return React.createElement('span', null, 'Pick one of the correct answers')
											case 'pick-all':
												return React.createElement(
													'span',
													null,
													'Pick ',
													React.createElement('b', null, 'all'),
													' of the correct answers'
												)
										}
									})()
								),
								sortedIds.map(function(id, index) {
									var child = OboModel.models[id]
									if (child.get('type') !== 'ObojoboDraft.Chunks.MCAssessment.MCChoice') {
										return null
									}

									var Component = child.getComponentClass()
									return React.createElement(Component, {
										key: child.get('id'),
										model: child,
										moduleData: _this2.props.moduleData,
										responseType: responseType,
										isShowingExplanation: true,
										mode: _this2.props.mode,
										questionSubmitted: questionSubmitted,
										label: String.fromCharCode(index + 65)
									})
								}),
								React.createElement(
									'div',
									{ className: 'submit-and-result-container' },
									this.props.mode === 'practice'
										? questionSubmitted
											? React.createElement(
													'div',
													{ className: 'submit' },
													React.createElement(Button, {
														altAction: true,
														onClick: this.onClickReset,
														value: 'Try Again'
													})
												)
											: React.createElement(
													'div',
													{ className: 'submit' },
													React.createElement(Button, {
														onClick: this.onClickSubmit,
														value: 'Check Your Answer',
														disabled: !questionAnswered
													})
												)
										: null,
									questionSubmitted
										? score === 100
											? React.createElement(
													'div',
													{ className: 'result-container' },
													React.createElement('p', { className: 'result correct' }, 'Correct!')
												)
											: React.createElement(
													'div',
													{ className: 'result-container' },
													React.createElement('p', { className: 'result incorrect' }, 'Incorrect'),
													responseType === 'pick-all'
														? React.createElement(
																'span',
																{ className: 'pick-all-instructions' },
																'You have either missed some correct answers or selected some incorrect answers'
															)
														: null
												)
										: null
								),
								React.createElement(
									ReactCSSTransitionGroup,
									{
										component: 'div',
										transitionName: 'submit',
										transitionEnterTimeout: 800,
										transitionLeaveTimeout: 800
									},
									questionSubmitted && (feedbacks.length > 0 || solution)
										? React.createElement(
												'div',
												{ className: 'solution', key: 'solution' },
												React.createElement(
													'div',
													{ className: 'score' },
													feedbacks.length === 0
														? null
														: React.createElement(
																'div',
																{
																	className:
																		'feedback' +
																		(responseType === 'pick-all'
																			? ' is-pick-all-feedback'
																			: ' is-not-pick-all-feedback')
																},
																feedbacks.map(function(model) {
																	var Component = model.getComponentClass()
																	return React.createElement(Component, {
																		key: model.get('id'),
																		model: model,
																		moduleData: _this2.props.moduleData,
																		responseType: responseType,
																		isShowingExplanation: true,
																		questionSubmitted: true,
																		label: String.fromCharCode(
																			sortedIds.indexOf(model.parent.get('id')) + 65
																		)
																	})
																})
															)
												),
												isShowingExplanation
													? React.createElement(Button, {
															altAction: true,
															onClick: this.onClickHideExplanation,
															value: 'Hide Explanation'
														})
													: solution
														? React.createElement(Button, {
																altAction: true,
																onClick: this.onClickShowExplanation,
																value: 'Read an explanation of the answer'
															})
														: null,
												React.createElement(
													ReactCSSTransitionGroup,
													{
														component: 'div',
														transitionName: 'solution',
														transitionEnterTimeout: 800,
														transitionLeaveTimeout: 800
													},
													isShowingExplanation
														? React.createElement(
																'div',
																{ className: 'solution-container', key: 'solution-component' },
																React.createElement(SolutionComponent, {
																	model: solution,
																	moduleData: this.props.moduleData
																})
															)
														: null
												)
											)
										: null
								)
							)
						}
					}
				])

				return MCAssessment
			})(React.Component)

			exports.default = MCAssessment

			function __guard__(value, transform) {
				return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
			}

			/***/
		},

		/***/ /***/ 7: function(module, exports, __webpack_require__) {
			'use strict'

			var _Common = __webpack_require__(0)

			var _Common2 = _interopRequireDefault(_Common)

			var _adapter = __webpack_require__(8)

			var _adapter2 = _interopRequireDefault(_adapter)

			var _viewerComponent = __webpack_require__(9)

			var _viewerComponent2 = _interopRequireDefault(_viewerComponent)

			function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : { default: obj }
			}

			var SelectionHandler = _Common2.default.chunk.textChunk.TextGroupSelectionHandler

			_Common2.default.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCChoice', {
				type: 'chunk',
				adapter: _adapter2.default,
				componentClass: _viewerComponent2.default,
				selectionHandler: new SelectionHandler()
			})

			/***/
		},

		/***/ /***/ 8: function(module, exports, __webpack_require__) {
			'use strict'

			Object.defineProperty(exports, '__esModule', {
				value: true
			})
			var Adapter = {
				construct: function construct(model, attrs) {
					if (
						__guard__(attrs != null ? attrs.content : undefined, function(x) {
							return x.score
						}) != null
					) {
						model.modelState.score = attrs.content.score
						return (model.modelState._score = attrs.content.score)
					} else {
						return (model.modelState.score = '')
					}
				},
				clone: function clone(model, _clone) {
					return (_clone.modelState.score = model.modelState.score)
				},
				toJSON: function toJSON(model, json) {
					return (json.content.score = model.modelState.score)
				}
			}

			exports.default = Adapter

			function __guard__(value, transform) {
				return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
			}

			/***/
		},

		/***/ /***/ 9: function(module, exports, __webpack_require__) {
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

			__webpack_require__(15)

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
			var QuestionUtil = _Viewer2.default.util.QuestionUtil

			var MCChoice = (function(_React$Component) {
				_inherits(MCChoice, _React$Component)

				function MCChoice() {
					_classCallCheck(this, MCChoice)

					return _possibleConstructorReturn(
						this,
						(MCChoice.__proto__ || Object.getPrototypeOf(MCChoice)).apply(this, arguments)
					)
				}

				_createClass(
					MCChoice,
					[
						{
							key: 'getQuestionModel',
							value: function getQuestionModel() {
								return this.props.model.getParentOfType('ObojoboDraft.Chunks.Question')
							}
						},
						{
							key: 'createFeedbackItem',
							value: function createFeedbackItem(message) {
								var feedback = OboModel.create('ObojoboDraft.Chunks.MCAssessment.MCFeedback')
								var text = OboModel.create('ObojoboDraft.Chunks.Text')
								// console.log('text', text)
								text.modelState.textGroup.first.text.insertText(0, message)
								// console.log('feedback', feedback)
								feedback.children.add(text)

								return feedback
							}
						},
						{
							key: 'getInputType',
							value: function getInputType() {
								switch (this.props.responseType) {
									case 'pick-all':
										return 'checkbox'
									default:
										//'pick-one', 'pick-one-multiple-correct'
										return 'radio'
								}
							}
						},
						{
							key: 'render',
							value: function render() {
								var _this2 = this

								var questionId = this.getQuestionModel().id
								var response = QuestionUtil.getResponse(
									this.props.moduleData.questionState,
									this.getQuestionModel(),
									this.props.moduleData.navState.context
								) || { ids: [] }

								var isSelected = response.ids.indexOf(this.props.model.get('id')) !== -1

								var isCorrect = void 0
								if (this.props.mode === 'review') {
									if (
										!this.props.moduleData.questionState.scores[
											this.props.moduleData.navState.context
										]
									)
										return React.createElement('div', null)
									isCorrect =
										this.props.moduleData.questionState.scores[
											this.props.moduleData.navState.context
										][questionId].score === 100
								} else isCorrect = this.props.model.modelState.score === 100

								return React.createElement(
									OboComponent,
									{
										model: this.props.model,
										moduleData: this.props.moduleData,
										className:
											'obojobo-draft--chunks--mc-assessment--mc-choice' +
											(isSelected ? ' is-selected' : ' is-not-selected') +
											(isCorrect ? ' is-correct' : ' is-incorrect') +
											' is-mode-' +
											this.props.mode,
										'data-choice-label': this.props.label
									},
									React.createElement('input', {
										ref: 'input',
										type: this.getInputType(),
										value: this.props.model.get('id'),
										checked: isSelected,
										onChange: function onChange() {},
										name: this.props.model.parent.get('id')
									}),
									React.createElement(
										'div',
										{ className: 'children' },
										this.props.model.children.map(function(child, index) {
											var type = child.get('type')
											var isAnswerItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
											var isFeedbackItem = type === 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'

											if (isAnswerItem) {
												var Component = child.getComponentClass()
												return React.createElement(Component, {
													key: child.get('id'),
													model: child,
													moduleData: _this2.props.moduleData
												})
											}
										})
									)
								)
							}
						}
					],
					[
						{
							key: 'defaultProps',
							get: function get() {
								return {
									responseType: null,
									revealAll: false,
									questionSubmitted: false
								}
							}
						}
					]
				)

				return MCChoice
			})(React.Component)

			exports.default = MCChoice

			function __guard__(value, transform) {
				return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
			}

			/***/
		}

		/******/
	}
)
