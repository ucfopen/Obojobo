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

	module.exports = __webpack_require__(172);


/***/ },

/***/ 11:
/***/ function(module, exports) {

	'use strict';

	var Dispatcher, NavUtil, OboModel;

	Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher;

	OboModel = window.ObojoboDraft.Common.models.OboModel;

	NavUtil = {
	  goPrev: function goPrev() {
	    return Dispatcher.trigger('nav:prev');
	  },
	  goNext: function goNext() {
	    return Dispatcher.trigger('nav:next');
	  },
	  goto: function goto(id) {
	    return Dispatcher.trigger('nav:goto', {
	      value: {
	        id: id
	      }
	    });
	  },
	  lock: function lock() {
	    return Dispatcher.trigger('nav:lock');
	  },
	  unlock: function unlock() {
	    return Dispatcher.trigger('nav:unlock');
	  },
	  close: function close() {
	    return Dispatcher.trigger('nav:close');
	  },
	  open: function open() {
	    return Dispatcher.trigger('nav:open');
	  },
	  disable: function disable() {
	    return Dispatcher.trigger('nav:disable');
	  },
	  enable: function enable() {
	    return Dispatcher.trigger('nav:enable');
	  },
	  toggle: function toggle() {
	    return Dispatcher.trigger('nav:toggle');
	  },
	  openExternalLink: function openExternalLink(url) {
	    return Dispatcher.trigger('nav:openExternalLink', {
	      value: {
	        url: url
	      }
	    });
	  },
	  getNavTarget: function getNavTarget(state) {
	    var navItem;
	    navItem = state.items[state.navTargetIndex];
	    if (!navItem) {
	      return null;
	    }
	    return navItem;
	  },
	  getNavTargetModel: function getNavTargetModel(state) {
	    var navTarget;
	    navTarget = NavUtil.getNavTarget(state);
	    if (!navTarget) {
	      return null;
	    }
	    return OboModel.models[navTarget.id];
	  },
	  getPrevIndex: function getPrevIndex(state) {
	    var index, item;
	    index = state.navTargetIndex;
	    while (true) {
	      index--;
	      item = state.items[index];
	      if (item == null) {
	        break;
	      }
	      if (item.type === 'link') {
	        return index;
	      }
	    }
	    return null;
	  },
	  getNextIndex: function getNextIndex(state) {
	    var index, item;
	    index = state.navTargetIndex;
	    while (true) {
	      index++;
	      item = state.items[index];
	      if (item == null) {
	        break;
	      }
	      if (item.type === 'link') {
	        return index;
	      }
	    }
	    return null;
	  },
	  getPrev: function getPrev(state) {
	    return state.items[NavUtil.getPrevIndex(state)];
	  },
	  getNext: function getNext(state) {
	    return state.items[NavUtil.getNextIndex(state)];
	  },
	  getIndexById: function getIndexById(state, id) {
	    var i, index, item, len, ref;
	    ref = state.items;
	    for (index = i = 0, len = ref.length; i < len; index = ++i) {
	      item = ref[index];
	      if (item.id === id) {
	        return index;
	      }
	    }
	    return null;
	  },
	  canNavigate: function canNavigate(state) {
	    return !state.locked && !state.disabled;
	  }
	};

	module.exports = NavUtil;

/***/ },

/***/ 35:
/***/ function(module, exports) {

	'use strict';

	var APIUtil, createParsedJsonPromise;

	createParsedJsonPromise = function createParsedJsonPromise(promise) {
	  var jsonPromise;
	  jsonPromise = new Promise(function (resolve, reject) {
	    return promise.then(function (_this) {
	      return function (res) {
	        return res.json();
	      };
	    }(this)).then(function (_this) {
	      return function (json) {
	        if (json.status === 'error') {
	          console.error(json.value);
	        }
	        return resolve(json);
	      };
	    }(this))["catch"](function (_this) {
	      return function (error) {
	        return reject(error);
	      };
	    }(this));
	  });
	  return jsonPromise;
	};

	APIUtil = {
	  get: function get(endpoint) {
	    return fetch(endpoint, {
	      method: 'GET',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      }
	    });
	  },
	  post: function post(endpoint, body) {
	    if (body == null) {
	      body = {};
	    }
	    console.log('post', endpoint, body);
	    return fetch(endpoint, {
	      method: 'POST',
	      body: JSON.stringify(body),
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      }
	    });
	  },
	  postEvent: function postEvent(lo, eventAction, eventPayload) {
	    return APIUtil.post('/api/events', {
	      event: {
	        action: eventAction,
	        draft_id: lo.get('_id'),
	        draft_rev: lo.get('_rev'),
	        actor_time: new Date().toISOString(),
	        payload: eventPayload
	      }
	    });
	  },
	  saveState: function saveState(lo, state) {
	    return APIUtil.postEvent(lo, 'saveState', state);
	  },
	  fetchDraft: function fetchDraft(id) {
	    return createParsedJsonPromise(fetch("/api/drafts/" + id));
	  },
	  getAttempts: function getAttempts(lo) {
	    return createParsedJsonPromise(APIUtil.get("/api/assessments/attempts/user/4/draft/" + lo.get('_id')));
	  },
	  startAttempt: function startAttempt(lo, assessment, questions) {
	    return createParsedJsonPromise(APIUtil.post('/api/assessments/attempt/start', {
	      draftId: lo.get('_id'),
	      assessmentId: assessment.get('id'),
	      actor: 4,
	      questions: '@TODO'
	    }));
	  },
	  endAttempt: function endAttempt(attempt) {
	    console.log('EA', attempt);
	    return createParsedJsonPromise(APIUtil.post("/api/assessments/attempt/" + attempt.id + "/end"));
	  }
	};

	module.exports = APIUtil;

/***/ },

/***/ 66:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Dispatcher,
	    NavStore,
	    NavUtil,
	    OBO,
	    OboModel,
	    Store,
	    navStore,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	NavUtil = __webpack_require__(11);

	OBO = window.OBO;

	Store = window.ObojoboDraft.Common.flux.Store;

	Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher;

	OboModel = window.ObojoboDraft.Common.models.OboModel;

	NavStore = function (superClass) {
	  extend(NavStore, superClass);

	  function NavStore() {
	    NavStore.__super__.constructor.call(this, 'navstore');
	    this.state = {
	      items: [],
	      navTargetIndex: -1,
	      locked: false,
	      open: true
	    };
	  }

	  NavStore.prototype.init = function (model, startingId) {
	    Dispatcher.on({
	      'nav:prev': function (_this) {
	        return function (payload) {
	          return _this.gotoIndex(NavUtil.getPrevIndex(_this.state));
	        };
	      }(this),
	      'nav:next': function (_this) {
	        return function (payload) {
	          return _this.gotoIndex(NavUtil.getNextIndex(_this.state));
	        };
	      }(this),
	      'nav:goto': function (_this) {
	        return function (payload) {
	          return _this.gotoIndex(NavUtil.getIndexById(_this.state, payload.value.id));
	        };
	      }(this),
	      'nav:lock': function (_this) {
	        return function (payload) {
	          return _this.setAndTrigger({
	            locked: true
	          });
	        };
	      }(this),
	      'nav:unlock': function (_this) {
	        return function (payload) {
	          return _this.setAndTrigger({
	            locked: false
	          });
	        };
	      }(this),
	      'nav:close': function (_this) {
	        return function (payload) {
	          return _this.setAndTrigger({
	            open: false
	          });
	        };
	      }(this),
	      'nav:open': function (_this) {
	        return function (payload) {
	          return _this.setAndTrigger({
	            open: true
	          });
	        };
	      }(this),
	      'nav:disable': function (_this) {
	        return function (payload) {
	          return _this.setAndTrigger({
	            disabled: true,
	            locked: true,
	            open: false
	          });
	        };
	      }(this),
	      'nav:enable': function (_this) {
	        return function (payload) {
	          return _this.setAndTrigger({
	            disabled: false,
	            locked: false
	          });
	        };
	      }(this),
	      'nav:toggle': function (_this) {
	        return function (payload) {
	          return _this.setAndTrigger({
	            open: !_this.state.open
	          });
	        };
	      }(this),
	      'nav:openExternalLink': function (_this) {
	        return function (payload) {
	          window.open(payload.value.url);
	          return _this.triggerChange();
	        };
	      }(this)
	    });
	    this.state.items = this.generateNav(model);
	    if (startingId != null) {
	      return this.gotoIndex(NavUtil.getIndexById(this.state, startingId));
	    } else {
	      return this.gotoIndex(NavUtil.getNextIndex(this.state));
	    }
	  };

	  NavStore.prototype.getState = function () {
	    return this.state;
	  };

	  NavStore.prototype.setState = function (newState) {
	    return this.state = newState;
	  };

	  NavStore.prototype.gotoIndex = function (newNavTargetIndex) {
	    var navTargetModel, ref;
	    navTargetModel = (ref = NavUtil.getNavTargetModel(this.state)) != null ? ref.processTrigger('onNavExit') : void 0;
	    this.state.navTargetIndex = newNavTargetIndex;
	    NavUtil.getNavTargetModel(this.state).processTrigger('onNavEnter');
	    return this.triggerChange();
	  };

	  NavStore.prototype.generateNav = function (model) {
	    var child, i, item, len, nav, ref;
	    nav = [];
	    item = OBO.getItemForType(model.get('type'));
	    if (item.generateNav != null) {
	      nav = nav.concat(item.generateNav(model));
	    }
	    ref = model.children.models;
	    for (i = 0, len = ref.length; i < len; i++) {
	      child = ref[i];
	      nav = nav.concat(this.generateNav(child));
	    }
	    return nav;
	  };

	  return NavStore;
	}(Store);

	navStore = new NavStore();

	window.__ns = navStore;

	module.exports = navStore;

/***/ },

/***/ 67:
/***/ function(module, exports) {

	'use strict';

	var AssessmentUtil, Dispatcher;

	Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher;

	AssessmentUtil = {
	  getAssessmentForModel: function getAssessmentForModel(state, model) {
	    var assessment, assessmentModel;
	    if (model.get('type') === 'ObojoboDraft.Sections.Assessment') {
	      assessmentModel = model;
	    } else {
	      assessmentModel = model.getParentOfType('ObojoboDraft.Sections.Assessment');
	    }
	    if (!assessmentModel) {
	      return null;
	    }
	    assessment = state.assessments[assessmentModel.get('id')];
	    if (!assessment) {
	      return null;
	    }
	    return assessment;
	  },
	  getLastAttemptScoreForModel: function getLastAttemptScoreForModel(state, model) {
	    var assessment;
	    assessment = AssessmentUtil.getAssessmentForModel(state, model);
	    if (!assessment) {
	      return null;
	    }
	    if (assessment.attempts.length === 0) {
	      return 0;
	    }
	    return assessment.attempts[assessment.attempts.length - 1].score;
	  },
	  getHighestAttemptScoreForModel: function getHighestAttemptScoreForModel(state, model) {
	    var assessment;
	    assessment = AssessmentUtil.getAssessmentForModel(state, model);
	    if (!assessment) {
	      return null;
	    }
	    return assessment.attempts.map(function (attempt) {
	      return attempt.score;
	    }).reduce(function (a, b) {
	      return Math.max(a, b);
	    }, 0);
	  },
	  getCurrentAttemptForModel: function getCurrentAttemptForModel(state, model) {
	    var assessment;
	    assessment = AssessmentUtil.getAssessmentForModel(state, model);
	    if (!assessment) {
	      return null;
	    }
	    return assessment.current;
	  },
	  isCurrentAttemptIncomplete: function isCurrentAttemptIncomplete(state, model) {
	    var current, i, len, ref, score;
	    console.log('@TODO');
	    current = AssessmentUtil.getCurrentAttemptForModel(state, model);
	    if (!current) {
	      return null;
	    }
	    ref = Object.values(current.responses);
	    for (i = 0, len = ref.length; i < len; i++) {
	      score = ref[i];
	      if (score === null) {
	        return true;
	      }
	    }
	    return false;
	  },
	  getLastAttemptForModel: function getLastAttemptForModel(state, model) {
	    var assessment;
	    assessment = AssessmentUtil.getAssessmentForModel(state, model);
	    if (!assessment || assessment.attempts.length === 0) {
	      return null;
	    }
	    return assessment.attempts[assessment.attempts.length - 1];
	  },
	  getAttemptAverage: function getAttemptAverage(attempt) {
	    console.log('@TODO');
	    return 0;
	  },
	  getLastAttemptAverageForModel: function getLastAttemptAverageForModel(state, model) {
	    var lastAttempt;
	    lastAttempt = AssessmentUtil.getLastAttemptForModel(state, model);
	    if (!lastAttempt) {
	      return null;
	    }
	    return AssessmentUtil.getAttemptAverage(lastAttempt);
	  },
	  getAllAveragesForModel: function getAllAveragesForModel(state, model) {
	    var assessment, attempt, i, len, ref, scores;
	    assessment = AssessmentUtil.getAssessmentForModel(state, model);
	    if (assessment === null || assessment.attempts.length === 0) {
	      return null;
	    }
	    scores = [];
	    ref = assessment.attempts;
	    for (i = 0, len = ref.length; i < len; i++) {
	      attempt = ref[i];
	      scores.push(AssessmentUtil.getAttemptAverage(attempt));
	    }
	    return scores;
	  },
	  getHighestAssessmentScoreForModel: function getHighestAssessmentScoreForModel(state, model) {
	    var assessment;
	    assessment = AssessmentUtil.getAssessmentForModel(state, model);
	    if (assessment === null || assessment.attempts.length === 0) {
	      return null;
	    }
	    return AssessmentUtil.getAllAveragesForModel(state, model).reduce(function (a, b) {
	      return Math.max(a, b);
	    });
	  },
	  getDataForAssessment: function getDataForAssessment(state, model, key) {
	    var assessment;
	    assessment = AssessmentUtil.getAssessmentForModel(state, model);
	    if ((assessment != null ? assessment.current : void 0) == null) {
	      return null;
	    }
	    return assessment.data[key];
	  },
	  getDataForCurrentAttempt: function getDataForCurrentAttempt(state, model, key) {
	    var assessment;
	    assessment = AssessmentUtil.getAssessmentForModel(state, model);
	    if ((assessment != null ? assessment.current : void 0) == null) {
	      return null;
	    }
	    return assessment.current.data[key];
	  },
	  startAttempt: function startAttempt(model) {
	    return Dispatcher.trigger('assessment:startAttempt', {
	      value: {
	        id: model.get('id')
	      }
	    });
	  },
	  endAttempt: function endAttempt(model) {
	    return Dispatcher.trigger('assessment:endAttempt', {
	      value: {
	        id: model.get('id')
	      }
	    });
	  },
	  registerQuestionForAttempt: function registerQuestionForAttempt(question) {
	    return Dispatcher.trigger('assessment:registerQuestionForAttempt', {
	      value: {
	        id: question.get('id')
	      }
	    });
	  },
	  registerDataForAssessment: function registerDataForAssessment(model, key, value) {
	    return Dispatcher.trigger('assessment:registerDataForAssessment', {
	      value: {
	        id: model.get('id'),
	        dataKey: key,
	        dataValue: value
	      }
	    });
	  },
	  registerDataForCurrentAttempt: function registerDataForCurrentAttempt(model, key, value) {
	    return Dispatcher.trigger('assessment:registerDataForCurrentAttempt', {
	      value: {
	        id: model.get('id'),
	        dataKey: key,
	        dataValue: value
	      }
	    });
	  }
	};

	module.exports = AssessmentUtil;

/***/ },

/***/ 68:
/***/ function(module, exports) {

	'use strict';

	var Dispatcher, OboModel, QuestionUtil;

	Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher;

	OboModel = window.ObojoboDraft.Common.models.OboModel;

	QuestionUtil = {
	  setResponse: function setResponse(id, response) {
	    return Dispatcher.trigger('question:setResponse', {
	      value: {
	        id: id,
	        response: response
	      }
	    });
	  },
	  resetResponse: function resetResponse(id) {
	    return Dispatcher.trigger('question:resetResponse', {
	      value: {
	        id: id
	      }
	    });
	  },
	  viewQuestion: function viewQuestion(id) {
	    return Dispatcher.trigger('question:view', {
	      value: {
	        id: id
	      }
	    });
	  },
	  hideQuestion: function hideQuestion(id) {
	    return Dispatcher.trigger('question:hide', {
	      value: {
	        id: id
	      }
	    });
	  },
	  getViewState: function getViewState(state, model) {
	    var modelId;
	    modelId = model.get('id');
	    if (state.viewing === modelId) {
	      return 'active';
	    }
	    if (state.viewedQuestions[modelId]) {
	      return 'viewed';
	    }
	    return 'hidden';
	  },
	  getResponse: function getResponse(state, model) {
	    var response;
	    return response = state.responses[model.get('id')];
	  }
	};

	module.exports = QuestionUtil;

/***/ },

/***/ 69:
/***/ function(module, exports) {

	'use strict';

	var Dispatcher, ScoreUtil;

	Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher;

	ScoreUtil = {
	  setScore: function setScore(id, score) {
	    return Dispatcher.trigger('score:set', {
	      value: {
	        id: id,
	        score: score
	      }
	    });
	  },
	  clearScore: function clearScore(id) {
	    return Dispatcher.trigger('score:clear', {
	      value: {
	        id: id
	      }
	    });
	  }
	};

	module.exports = ScoreUtil;

/***/ },

/***/ 161:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var InlineNavButton, NavUtil;

	__webpack_require__(204);

	NavUtil = __webpack_require__(11);

	InlineNavButton = React.createClass({
	  displayName: 'InlineNavButton',

	  onClick: function onClick() {
	    if (this.props.disabled) {
	      return;
	    }
	    switch (this.props.type) {
	      case 'prev':
	        return NavUtil.goPrev();
	      case 'next':
	        return NavUtil.goNext();
	    }
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      {
	        className: 'viewer--components--inline-nav-button' + ' is-' + this.props.type + (this.props.disabled ? ' is-disabled' : ' is-enabled'),
	        onClick: this.onClick
	      },
	      this.props.title
	    );
	  }
	});

	module.exports = InlineNavButton;

/***/ },

/***/ 163:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Nav, NavUtil, arrowImg, getBackgroundImage, hamburgerImg, lockImg, navStore;

	__webpack_require__(205);

	navStore = __webpack_require__(66);

	NavUtil = __webpack_require__(11);

	hamburgerImg = __webpack_require__(226);

	arrowImg = __webpack_require__(225);

	lockImg = __webpack_require__(227);

	getBackgroundImage = window.ObojoboDraft.Common.util.getBackgroundImage;

	Nav = React.createClass({
			displayName: 'Nav',

			getInitialState: function getInitialState() {
					return {
							hover: false
					};
			},
			onClick: function onClick(item) {
					return NavUtil.goto(item.id);
			},
			hideNav: function hideNav() {
					return NavUtil.toggle();
			},
			onMouseOver: function onMouseOver() {
					return this.setState({
							hover: true
					});
			},
			onMouseOut: function onMouseOut() {
					return this.setState({
							hover: false
					});
			},
			render: function render() {
					var bg, lockEl;
					if (this.props.navState.open || this.state.hover) {
							bg = getBackgroundImage(arrowImg);
					} else {
							bg = getBackgroundImage(hamburgerImg);
					}
					if (this.props.navState.locked) {
							lockEl = React.createElement(
									'div',
									{ className: 'lock-icon' },
									React.createElement('img', { src: lockImg })
							);
					} else {
							lockEl = null;
					}
					return React.createElement(
							'div',
							{ className: 'viewer--components--nav' + (this.props.navState.locked ? ' is-locked' : ' is-unlocked') + (this.props.navState.open ? ' is-open' : ' is-closed') + (this.props.navState.disabled ? ' is-disabled' : ' is-enabled') },
							React.createElement(
									'button',
									{
											className: 'toggle-button',
											onClick: this.hideNav,
											onMouseOver: this.onMouseOver,
											onMouseOut: this.onMouseOut,
											style: {
													backgroundImage: bg,
													transform: !this.props.navState.open && this.state.hover ? 'rotate(180deg)' : ''
											}
									},
									'Toggle Navigation Menu'
							),
							React.createElement(
									'ul',
									null,
									this.props.navState.items.map(function (item, index) {
											switch (item.type) {
													case 'heading':
															var isSelected = false;
															return React.createElement(
																	'li',
																	{ key: index, className: 'heading' + (isSelected ? ' is-selected' : ' is-not-select') },
																	React.createElement(
																			'a',
																			null,
																			item.label
																	)
															);
															break;

													case 'link':
															var isSelected = this.props.navState.navTargetIndex === index;
															return React.createElement(
																	'li',
																	{ key: index, onClick: this.onClick.bind(null, item), className: 'link' + (isSelected ? ' is-selected' : ' is-not-select') },
																	React.createElement(
																			'a',
																			null,
																			item.label
																	),
																	lockEl
															);
															break;

													case 'seperator':
															return React.createElement(
																	'li',
																	{ key: index, className: 'seperator' },
																	React.createElement('hr', null)
															);
															break;

											}
									}.bind(this))
							)
					);
			}
	});

	module.exports = Nav;

/***/ },

/***/ 164:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Common, Dispatcher, InlineNavButton, Legacy, ModalContainer, ModalUtil, Nav, NavUtil, OBO, OboModel, ReactDOM, SimpleDialog, ViewerApp;

	__webpack_require__(206);

	InlineNavButton = __webpack_require__(161);

	NavUtil = __webpack_require__(11);

	OBO = window.OBO;

	Common = window.ObojoboDraft.Common;

	Legacy = Common.models.Legacy;

	OboModel = Common.models.OboModel;

	Nav = __webpack_require__(163);

	ReactDOM = window.ReactDOM;

	Dispatcher = Common.flux.Dispatcher;

	ModalContainer = Common.components.ModalContainer;

	SimpleDialog = Common.components.modal.SimpleDialog;

	ModalUtil = Common.util.ModalUtil;

	Dispatcher.on('all', function (eventName, payload) {
	  return console.log('EVENT TRIGGERED', eventName);
	});

	Dispatcher.on('viewer:alert', function (payload) {
	  return ModalUtil.show(React.createElement(
	    SimpleDialog,
	    { ok: true, title: payload.value.title },
	    payload.value.message
	  ));
	});

	ViewerApp = React.createClass({
	  displayName: 'ViewerApp',

	  getInitialState: function getInitialState() {
	    OBO.loadDependency('https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css');
	    Dispatcher.on('viewer:scrollTo', function (payload) {
	      return ReactDOM.findDOMNode(this.refs.container).scrollTop = payload.value;
	    });
	    return {
	      navTargetIndex: this.props.moduleData.navState.navTargetIndex
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    var navTargetIndex, nextNavTargetIndex;
	    navTargetIndex = this.props.moduleData.navState.navTargetIndex;
	    nextNavTargetIndex = nextProps.moduleData.navState.navTargetIndex;
	    if (this.state.navTargetIndex !== nextNavTargetIndex) {
	      this.needsScroll = true;
	      return this.setState({
	        navTargetIndex: nextNavTargetIndex
	      });
	    }
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    var el;
	    if (this.lastCanNavigate !== NavUtil.canNavigate(this.props.moduleData.navState)) {
	      this.needsScroll = true;
	    }
	    this.lastCanNavigate = NavUtil.canNavigate(this.props.moduleData.navState);
	    if (this.needsScroll != null) {
	      el = ReactDOM.findDOMNode(this.refs.prev);
	      if (el) {
	        ReactDOM.findDOMNode(this.refs.container).scrollTop = ReactDOM.findDOMNode(el).getBoundingClientRect().height;
	      } else {
	        ReactDOM.findDOMNode(this.refs.container).scrollTop = 0;
	      }
	      return delete this.needsScroll;
	    }
	  },
	  update: function update(json) {
	    var e, o;
	    try {
	      return o = JSON.parse(json);
	    } catch (error) {
	      e = error;
	      alert('Error parsing JSON');
	      this.setState({
	        model: this.state.model
	      });
	    }
	  },
	  onBack: function onBack() {
	    return NavUtil.goPrev();
	  },
	  onNext: function onNext() {
	    return NavUtil.goNext();
	  },
	  render: function render() {
	    var ModuleComponent, modal, nextEl, nextNav, prevEl, prevNav;
	    window.__lo = this.props.moduleData.model;
	    ModuleComponent = this.props.moduleData.model.getComponentClass();
	    console.log(this.props);
	    prevNav = nextNav = null;
	    if (NavUtil.canNavigate(this.props.moduleData.navState)) {
	      prevNav = NavUtil.getPrev(this.props.moduleData.navState);
	      if (prevNav) {
	        prevEl = React.createElement(InlineNavButton, { ref: 'prev', type: 'prev', title: OboModel.models[prevNav.id].title });
	      } else {
	        prevEl = React.createElement(InlineNavButton, { ref: 'prev', type: 'prev', title: 'Start of content', disabled: true });
	      }
	      nextNav = NavUtil.getNext(this.props.moduleData.navState);
	      if (nextNav) {
	        nextEl = React.createElement(InlineNavButton, { ref: 'next', type: 'next', title: OboModel.models[nextNav.id].title });
	      } else {
	        nextEl = React.createElement(InlineNavButton, { ref: 'next', type: 'next', title: 'End of content', disabled: true });
	      }
	    }
	    modal = ModalUtil.getCurrentModal(this.props.moduleData.modalState);
	    return React.createElement(
	      'div',
	      { ref: 'container', className: 'viewer--viewer-app' + (this.props.moduleData.navState.locked ? ' is-locked-nav' : ' is-unlocked-nav') + (this.props.moduleData.navState.open ? ' is-open-nav' : ' is-closed-nav') + (this.props.moduleData.navState.disabled ? ' is-disabled-nav' : ' is-enabled-nav') },
	      React.createElement(Nav, { navState: this.props.moduleData.navState }),
	      prevEl,
	      React.createElement(ModuleComponent, { model: this.props.moduleData.model, moduleData: this.props.moduleData }),
	      nextEl,
	      modal ? React.createElement(
	        ModalContainer,
	        null,
	        modal
	      ) : null
	    );
	  }
	});

	module.exports = ViewerApp;

/***/ },

/***/ 165:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  components: {
	    ViewerApp: __webpack_require__(164)
	  },
	  stores: {
	    ScoreStore: __webpack_require__(168),
	    AssessmentStore: __webpack_require__(166),
	    NavStore: __webpack_require__(66),
	    QuestionStore: __webpack_require__(167)
	  },
	  util: {
	    AssessmentUtil: __webpack_require__(67),
	    NavUtil: __webpack_require__(11),
	    ScoreUtil: __webpack_require__(69),
	    APIUtil: __webpack_require__(35),
	    QuestionUtil: __webpack_require__(68)
	  }
	};

/***/ },

/***/ 166:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var APIUtil,
	    AssessmentStore,
	    AssessmentUtil,
	    Dispatcher,
	    ErrorUtil,
	    OboModel,
	    QuestionUtil,
	    ScoreUtil,
	    Store,
	    assessmentStore,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	AssessmentUtil = __webpack_require__(67);

	ScoreUtil = __webpack_require__(69);

	QuestionUtil = __webpack_require__(68);

	APIUtil = __webpack_require__(35);

	Store = window.ObojoboDraft.Common.flux.Store;

	Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher;

	OboModel = window.ObojoboDraft.Common.models.OboModel;

	ErrorUtil = window.ObojoboDraft.Common.util.ErrorUtil;

	AssessmentStore = function (superClass) {
	  extend(AssessmentStore, superClass);

	  function AssessmentStore() {
	    AssessmentStore.__super__.constructor.call(this, 'assessmentstore');
	    this.state = {
	      assessments: {}
	    };
	    Dispatcher.on('assessment:startAttempt', function (_this) {
	      return function (payload) {
	        var id, model;
	        id = payload.value.id;
	        model = OboModel.models[id];
	        return APIUtil.startAttempt(model.getRoot(), model, {}).then(function (res) {
	          var c, child, i, j, lastAttempt, len, len1, question, ref;
	          if (res.status === 'error') {
	            return ErrorUtil.errorResponse(res);
	          }
	          model.children.at(1).children.reset();
	          ref = res.value.questions;
	          for (i = 0, len = ref.length; i < len; i++) {
	            child = ref[i];
	            c = OboModel.create(child);
	            console.log('ADD', child, c);
	            model.children.at(1).children.add(c);
	          }
	          if (!_this.state.assessments[id]) {
	            _this.state.assessments[id] = {
	              current: null,
	              attempts: [],
	              data: {}
	            };
	          }
	          lastAttempt = AssessmentUtil.getLastAttemptForModel(_this.state, model);
	          if (lastAttempt) {
	            for (j = 0, len1 = lastAttempt.length; j < len1; j++) {
	              question = lastAttempt[j];
	              ScoreUtil.clearScore(question);
	            }
	          }
	          _this.state.assessments[id].current = _this.generateNewAttempt(res.value.attemptId);
	          console.log('NOW STATE IS', _this.state);
	          model.processTrigger('onStartAttempt');
	          return _this.triggerChange();
	        });
	      };
	    }(this));
	    Dispatcher.on('assessment:endAttempt', function (_this) {
	      return function (payload) {
	        var assessment, id, model;
	        console.log('ASS STATE', _this.state);
	        id = payload.value.id;
	        model = OboModel.models[id];
	        assessment = _this.state.assessments[id];
	        return APIUtil.endAttempt(assessment.current).then(function (res) {
	          var i, len, ref;
	          if (res.status === 'error') {
	            return ErrorUtil.errorResponse(res);
	          }
	          ref = assessment.current.viewed;
	          for (i = 0, len = ref.length; i < len; i++) {
	            id = ref[i];
	            QuestionUtil.hideQuestion(id);
	          }
	          for (id in assessment.current.responses) {
	            console.log('RESET RESPONSE', id);
	            QuestionUtil.resetResponse(id);
	          }
	          assessment.current.score = res.value.score;
	          assessment.attempts.push(assessment.current);
	          assessment.current = null;
	          model.processTrigger('onEndAttempt');
	          return _this.triggerChange();
	        });
	      };
	    }(this));
	    Dispatcher.on('question:view', function (_this) {
	      return function (payload) {
	        var assessment, id, model;
	        id = payload.value.id;
	        model = OboModel.models[id];
	        assessment = AssessmentUtil.getAssessmentForModel(_this.state, model);
	        if ((assessment != null ? assessment.current : void 0) != null) {
	          return assessment.current.viewed.push(payload.value.id);
	        }
	      };
	    }(this));
	    Dispatcher.on('question:setResponse', function (_this) {
	      return function (payload) {
	        var assessment, id, model, questionModel, ref;
	        id = payload.value.id;
	        model = OboModel.models[id];
	        console.log('SET RESPONSE', payload, model);
	        assessment = AssessmentUtil.getAssessmentForModel(_this.state, model);
	        if ((assessment != null ? (ref = assessment.current) != null ? ref.responses : void 0 : void 0) != null) {
	          assessment.current.responses[id] = payload.value.response;
	          console.log('@TODO - Howsa?');
	          questionModel = model.getParentOfType('ObojoboDraft.Chunks.Question');
	          console.log('QUESTION SET RESPONSE', questionModel);
	          APIUtil.postEvent(model.getRoot(), 'question:setResponse', {
	            attemptId: assessment.current.id,
	            questionId: questionModel.get('id'),
	            response: payload.value.response
	          });
	          return _this.triggerChange();
	        }
	      };
	    }(this));
	    Dispatcher.on('assessment:registerQuestionForAttempt', function (_this) {
	      return function (payload) {
	        return console.log('@TODO - THIS DOES NOTHING!');
	      };
	    }(this));
	    Dispatcher.on('assessment:registerDataForAssessment', function (_this) {
	      return function (payload) {
	        var assessment, id, key, model, value;
	        id = payload.value.id;
	        model = OboModel.models[id];
	        key = payload.value.dataKey;
	        value = payload.value.dataValue;
	        assessment = AssessmentUtil.getAssessmentForModel(_this.state, model);
	        if (assessment.data != null) {
	          assessment.data[key] = value;
	        }
	        return _this.triggerChange();
	      };
	    }(this));
	    Dispatcher.on('assessment:registerDataForCurrentAttempt', function (_this) {
	      return function (payload) {
	        var assessment, id, key, model, value;
	        id = payload.value.id;
	        model = OboModel.models[id];
	        key = payload.value.dataKey;
	        value = payload.value.dataValue;
	        assessment = AssessmentUtil.getAssessmentForModel(_this.state, model);
	        if (assessment.current != null) {
	          assessment.current.data[key] = value;
	        }
	        return _this.triggerChange();
	      };
	    }(this));
	  }

	  AssessmentStore.prototype.generateNewAttempt = function (id) {
	    return {
	      id: id,
	      responses: {},
	      data: {},
	      viewed: [],
	      score: 0
	    };
	  };

	  AssessmentStore.prototype.getState = function () {
	    return this.state;
	  };

	  AssessmentStore.prototype.setState = function (newState) {
	    return this.state = newState;
	  };

	  return AssessmentStore;
	}(Store);

	assessmentStore = new AssessmentStore();

	module.exports = assessmentStore;

/***/ },

/***/ 167:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var APIUtil,
	    Dispatcher,
	    OboModel,
	    QuestionStore,
	    Store,
	    questionStore,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	APIUtil = __webpack_require__(35);

	Store = window.ObojoboDraft.Common.flux.Store;

	Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher;

	OboModel = window.ObojoboDraft.Common.models.OboModel;

	QuestionStore = function (superClass) {
	  extend(QuestionStore, superClass);

	  function QuestionStore() {
	    QuestionStore.__super__.constructor.call(this, 'questionStore');
	    this.state = {
	      viewing: null,
	      viewedQuestions: {},
	      responses: {}
	    };
	    Dispatcher.on({
	      'question:setResponse': function (_this) {
	        return function (payload) {
	          _this.state.responses[payload.value.id] = payload.value.response;
	          return _this.triggerChange();
	        };
	      }(this),
	      'question:resetResponse': function (_this) {
	        return function (payload) {
	          delete _this.state.responses[payload.value.id];
	          return _this.triggerChange();
	        };
	      }(this),
	      'question:hide': function (_this) {
	        return function (payload) {
	          APIUtil.postEvent(OboModel.models[payload.value.id], 'question:hide', {
	            questionId: payload.value.id
	          });
	          delete _this.state.viewedQuestions[payload.value.id];
	          if (_this.state.viewing === payload.value.id) {
	            _this.state.viewing = null;
	          }
	          return _this.triggerChange();
	        };
	      }(this),
	      'question:view': function (_this) {
	        return function (payload) {
	          APIUtil.postEvent(OboModel.models[payload.value.id], 'question:view', {
	            questionId: payload.value.id
	          });
	          _this.state.viewedQuestions[payload.value.id] = true;
	          _this.state.viewing = payload.value.id;
	          return _this.triggerChange();
	        };
	      }(this)
	    });
	  }

	  QuestionStore.prototype.getState = function () {
	    return this.state;
	  };

	  QuestionStore.prototype.setState = function (newState) {
	    return this.state = newState;
	  };

	  return QuestionStore;
	}(Store);

	questionStore = new QuestionStore();

	module.exports = questionStore;

/***/ },

/***/ 168:
/***/ function(module, exports) {

	'use strict';

	var Dispatcher,
	    ScoreStore,
	    Store,
	    scoreStore,
	    extend = function extend(child, parent) {
	  for (var key in parent) {
	    if (hasProp.call(parent, key)) child[key] = parent[key];
	  }function ctor() {
	    this.constructor = child;
	  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
	},
	    hasProp = {}.hasOwnProperty;

	Store = window.ObojoboDraft.Common.flux.Store;

	Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher;

	ScoreStore = function (superClass) {
	  extend(ScoreStore, superClass);

	  function ScoreStore() {
	    ScoreStore.__super__.constructor.call(this, 'scorestore');
	    this.state = {
	      scores: {},
	      viewing: null,
	      viewed: {}
	    };
	    Dispatcher.on({
	      'score:set': function (_this) {
	        return function (payload) {
	          console.log('setScore', payload);
	          _this.state.scores[payload.value.id] = payload.value.score;
	          return _this.triggerChange();
	        };
	      }(this),
	      'score:clear': function (_this) {
	        return function (payload) {
	          delete _this.state.scores[payload.value.id];
	          return _this.triggerChange();
	        };
	      }(this)
	    });
	  }

	  ScoreStore.prototype.getScore = function (model) {
	    var score;
	    score = this.state.scores[model.get('id')];
	    if (typeof score === 'undefined') {
	      return null;
	    }
	    return score;
	  };

	  ScoreStore.prototype.getState = function () {
	    return this.state;
	  };

	  ScoreStore.prototype.setState = function (newState) {
	    return this.state = newState;
	  };

	  return ScoreStore;
	}(Store);

	scoreStore = new ScoreStore();

	module.exports = scoreStore;

/***/ },

/***/ 172:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	window.Viewer = __webpack_require__(165);

/***/ },

/***/ 204:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 205:
204,

/***/ 206:
204,

/***/ 225:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3C!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E %3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='-290 387 30 20' style='enable-background:new -290 387 30 20;' xml:space='preserve'%3E %3Cpath d='M-272.5,405.4l-12.1-7.4c-0.6-0.4-0.6-1.7,0-2.1l12.1-7.4c0.5-0.3,1,0.3,1,1.1v14.7C-271.4,405.2-272,405.7-272.5,405.4z' fill='rgba(0, 0, 0, .2)' transform='translate(2, 0)'/%3E %3C/svg%3E"

/***/ },

/***/ 226:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3Csvg width='30' height='20' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' version='1.1'%3E %3Cline x1='0' y1='10' x2='100' y2='10' stroke='rgba(0, 0, 0, .2)' stroke-width='20' stroke-linecap='round' /%3E %3Cline x1='0' y1='50' x2='100' y2='50' stroke='rgba(0, 0, 0, .2)' stroke-width='20' stroke-linecap='round' /%3E %3Cline x1='0' y1='90' x2='100' y2='90' stroke='rgba(0, 0, 0, .2)' stroke-width='20' stroke-linecap='round' /%3E %3C/svg%3E"

/***/ },

/***/ 227:
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='utf-8'?%3E %3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 10 16' style='enable-background:new 0 0 10 16;' xml:space='preserve'%3E %3Cpath fill='white' id='XMLID_6_' d='M9.1,6H8.5V3.5C8.5,1.5,6.9,0,5,0C3.1,0,1.6,1.5,1.6,3.5l0,2.5H0.9C0.4,6,0,6.4,0,6.9v8.2 C0,15.6,0.4,16,0.9,16h8.2c0.5,0,0.9-0.4,0.9-0.9V6.9C10,6.4,9.6,6,9.1,6z M3.3,3.4c0-0.9,0.8-1.6,1.7-1.6c0.9,0,1.7,0.8,1.7,1.7V6 H3.3V3.4z'/%3E %3C/svg%3E"

/***/ }

/******/ })));