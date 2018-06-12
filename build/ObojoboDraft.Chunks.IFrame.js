/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 298);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = Common;

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = Viewer;

/***/ }),

/***/ 107:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _adapter = __webpack_require__(135);

var _adapter2 = _interopRequireDefault(_adapter);

var _viewerComponent = __webpack_require__(138);

var _viewerComponent2 = _interopRequireDefault(_viewerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectionHandler = _Common2.default.chunk.focusableChunk.FocusableSelectionHandler;

_Common2.default.Store.registerModel('ObojoboDraft.Chunks.IFrame', {
	type: 'chunk',
	adapter: _adapter2.default,
	componentClass: _viewerComponent2.default,
	selectionHandler: new SelectionHandler(),
	getFullScreenElement: function getFullScreenElement(el) {
		var iframeEls = el.getElementsByTagName('iframe');

		return iframeEls && iframeEls[0] ? iframeEls[0] : null;
	}
});

/***/ }),

/***/ 135:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setModelStateProp = _Common2.default.util.setModelStateProp;

exports.default = {
	construct: function construct(model, attrs) {
		var s = setModelStateProp.bind(this, model, attrs);

		s('type', 'media', function (p) {
			return p.toLowerCase() === 'webpage' ? 'webpage' : 'media';
		});

		var defaultNewWindow = void 0;
		var defaultBorder = void 0;
		var defaultFit = void 0;
		var defaultControls = void 0;

		switch (model.modelState.type) {
			case 'webpage':
				defaultNewWindow = true;
				defaultBorder = true;
				defaultFit = 'scroll';
				defaultControls = ['zoom', 'reload', 'expand'];
				break;

			case 'media':
			default:
				defaultNewWindow = false;
				defaultBorder = false;
				defaultFit = 'scale';
				defaultControls = ['reload', 'expand'];
				break;
		}

		s('newWindow', defaultNewWindow, function (p) {
			return p === true;
		});
		s('border', defaultBorder);
		s('fit', defaultFit, function (p) {
			return p.toLowerCase();
		}, ['scroll', 'scale']);
		s('src', null);
		s('width', null, function (p) {
			return parseInt(p, 10) || null;
		});
		s('height', null, function (p) {
			return parseInt(p, 10) || null;
		});
		s('zoom', 1, function (p) {
			return parseFloat(p) || 1;
		});
		s('newWindowSrc', null);
		s('autoload', false, function (p) {
			return p === true;
		});
		s('title', null);
		s('controls', defaultControls, function (p) {
			return p.split(',').map(function (c) {
				return c.toLowerCase().replace(/ /g, '');
			});
		});
		s('expandedSize', 'full', function (p) {
			return p.toLowerCase();
		}, ['full', 'restricted']);
	},
	clone: function clone(model, _clone) {
		_clone.modelState.type = model.modelState.type;
		_clone.modelState.src = model.modelState.src;
		_clone.modelState.width = model.modelState.width;
		_clone.modelState.height = model.modelState.height;
		_clone.modelState.zoom = model.modelState.zoom;
		_clone.modelState.border = model.modelState.border;
		_clone.modelState.newWindow = model.modelState.newWindow;
		_clone.modelState.newWindowSrc = model.modelState.newWindowSrc;
		_clone.modelState.autoload = model.modelState.autoload;
		_clone.modelState.fit = model.modelState.fit;
		_clone.modelState.expandedSize = model.modelState.expandedSize;
		_clone.modelState.title = model.modelState.title;
		_clone.modelState.controls = model.modelState.controls;
	},
	toJSON: function toJSON(model, json) {
		json.content.type = model.modelState.type;
		json.content.src = model.modelState.src;
		json.content.width = model.modelState.width;
		json.content.height = model.modelState.height;
		json.content.zoom = model.modelState.zoom;
		json.content.border = model.modelState.border;
		json.content.newWindow = model.modelState.newWindow;
		json.content.newWindowSrc = model.modelState.newWindowSrc;
		json.content.autoload = model.modelState.autoload;
		json.content.fit = model.modelState.fit;
		json.content.expandedSize = model.modelState.expandedSize;
		json.content.title = model.modelState.title;
		json.content.controls = model.modelState.controls;
	},
	toText: function toText(model) {
		return model.modelState.src;
	}
};

/***/ }),

/***/ 136:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(272);

var _urlParse = __webpack_require__(260);

var _urlParse2 = _interopRequireDefault(_urlParse);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isOrNot = _Common2.default.util.isOrNot;

exports.default = function (props) {
	var controlsOpts = props.controlsOptions;
	var isShowingSizeControls = controlsOpts.zoom || controlsOpts.expand || controlsOpts.unexpand;
	var newWindowToolTip = (0, _urlParse2.default)(props.newWindowSrc).hostname;

	return React.createElement(
		'div',
		{
			className: 'obojobo-draft--chunks--iframe--controls' + isOrNot(controlsOpts.unexpand, 'unexpandable') + isOrNot(controlsOpts.expand, 'expandable') + isOrNot(controlsOpts.zoom, 'zoomable') + isOrNot(controlsOpts.reload, 'reloadable')
		},
		controlsOpts.reload ? React.createElement(
			'div',
			{ className: 'control-button-container reload' },
			React.createElement(
				'button',
				{ className: 'reload-button', onClick: props.reload },
				'Reload'
			),
			React.createElement(
				'span',
				{ className: 'tool-tip' },
				'Reload'
			)
		) : null,
		controlsOpts.newWindow ? React.createElement(
			'div',
			{ className: 'new-window-link' },
			React.createElement(
				'a',
				{ target: '_blank', href: props.newWindowSrc },
				'View in a new window'
			),
			React.createElement(
				'span',
				{ className: 'tool-tip' },
				newWindowToolTip
			)
		) : null,
		isShowingSizeControls ? React.createElement(
			'div',
			{ className: 'size-controls' },
			controlsOpts.zoom ? React.createElement(
				'div',
				{ className: 'zoom-controls' },
				props.isZoomAbleToBeReset ? React.createElement(
					'div',
					{ className: 'control-button-container zoom-reset' },
					React.createElement(
						'button',
						{ className: 'zoom-reset-button', onClick: props.zoomReset },
						'Reset zoom'
					),
					React.createElement(
						'span',
						{ className: 'tool-tip' },
						'Reset zoom'
					)
				) : null,
				React.createElement(
					'div',
					{ className: 'control-button-container zoom-out' },
					React.createElement(
						'button',
						{
							disabled: props.isUnableToZoomOut,
							className: 'zoom-out-button',
							onClick: props.zoomOut
						},
						'Zoom out'
					),
					React.createElement(
						'span',
						{ className: 'tool-tip' },
						props.isUnableToZoomOut ? "Whoa that's tiny! 😲" : 'Zoom out'
					)
				),
				React.createElement(
					'div',
					{ className: 'control-button-container zoom-in' },
					React.createElement(
						'button',
						{ className: 'zoom-in-button', onClick: props.zoomIn },
						'Zoom in'
					),
					React.createElement(
						'span',
						{ className: 'tool-tip' },
						'Zoom in'
					)
				)
			) : null,
			controlsOpts.expand ? React.createElement(
				'div',
				{ className: 'control-button-container expand' },
				React.createElement(
					'button',
					{ className: 'expand-button', onClick: props.expand },
					'View larger'
				),
				React.createElement(
					'span',
					{ className: 'tool-tip' },
					'View larger'
				)
			) : null,
			controlsOpts.unexpand ? React.createElement(
				'div',
				{ className: 'control-button-container unexpand' },
				React.createElement(
					'button',
					{ className: 'unexpand-button', onClick: props.expandClose },
					'Resume to original size'
				),
				React.createElement(
					'span',
					{ className: 'tool-tip' },
					'Resume to original size'
				)
			) : null
		) : null
	);
};

/***/ }),

/***/ 137:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getRenderSettings = exports.getZoomValues = exports.getAfterStyle = exports.getIFrameStyle = exports.getScaleDimensions = exports.getScaleAmount = exports.getSetDimensions = exports.getDisplayedTitle = exports.getMediaSize = exports.getSizeState = exports.getControlsOptions = exports.getIsShowing = undefined;

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MediaUtil = _Viewer2.default.util.MediaUtil;

var SIZE_STATE_EXPANDED = 'expanded';
var SIZE_STATE_ABLE_TO_EXPAND = 'ableToExpand';
var SIZE_STATE_UNABLE_TO_EXPAND = 'unableToExpand';

var getIsShowing = function getIsShowing(mediaState, model) {
	return (model.modelState.autoload || MediaUtil.isShowingMedia(mediaState, model)) && model.modelState.src !== null;
};

var getControlsOptions = function getControlsOptions(modelState, sizeState) {
	var isZoomControlEnabled = modelState.controls.indexOf('zoom') > -1;
	var isReloadControlEnabled = modelState.controls.indexOf('reload') > -1;
	var isExpandControlNeeded = modelState.controls.indexOf('expand') > -1 && sizeState === SIZE_STATE_ABLE_TO_EXPAND;
	var isUnexpandControlNeeded = sizeState === SIZE_STATE_EXPANDED;
	var newWindowEnabled = modelState.newWindow !== null;

	return {
		zoom: isZoomControlEnabled,
		reload: isReloadControlEnabled,
		expand: isExpandControlNeeded,
		unexpand: isUnexpandControlNeeded,
		newWindow: newWindowEnabled,
		isControlsEnabled: isZoomControlEnabled || isReloadControlEnabled || isExpandControlNeeded || isUnexpandControlNeeded || newWindowEnabled
	};
};

var getSizeState = function getSizeState(expandedSize, scaleAmount, mediaSize) {
	if (mediaSize === 'large') return SIZE_STATE_EXPANDED;
	if (expandedSize === 'full' || expandedSize === 'restricted' && scaleAmount < 1) return SIZE_STATE_ABLE_TO_EXPAND;
	return SIZE_STATE_UNABLE_TO_EXPAND;
};

var getMediaSize = function getMediaSize(mediaState, model, defaultSizeIfNotSet) {
	return MediaUtil.getSize(mediaState, model) || defaultSizeIfNotSet;
};

var getDisplayedTitle = function getDisplayedTitle(modelState) {
	if (modelState.src === null) {
		return 'IFrame missing src attribute';
	} else if (modelState.title) {
		return modelState.title;
	}

	return (modelState.src || '').replace(/^https?:\/\//, '');
};

var getSetDimensions = function getSetDimensions(modelState, defaultWidth, defaultHeight) {
	return {
		w: modelState.width || defaultWidth,
		h: modelState.height || defaultHeight
	};
};

var getScaleAmount = function getScaleAmount(actualWidth, padding, setWidth) {
	return Math.min(1, (actualWidth - padding) / setWidth);
};

var getScaleDimensions = function getScaleDimensions(modelState, zoom, isExpanded, scaleAmount, minScale, setDimensions) {
	var scale = void 0;
	var containerStyle = {};

	if (isExpanded) {
		scale = zoom;

		if (modelState.expandedSize === 'restricted') {
			containerStyle.maxWidth = setDimensions.w;
			containerStyle.maxHeight = setDimensions.h;
		}
	} else {
		if (modelState.fit === 'scroll') {
			scale = zoom;
			containerStyle = {
				width: setDimensions.w,
				height: setDimensions.h
			};
		} else {
			scale = scaleAmount * zoom;
			containerStyle = {
				width: setDimensions.w
			};
		}
	}

	scale = Math.max(minScale, scale);

	return {
		scale: scale,
		containerStyle: containerStyle
	};
};

var getIFrameStyle = function getIFrameStyle(scale) {
	return {
		transform: 'scale(' + scale + ')',
		width: 1 / scale * 100 + '%',
		height: 1 / scale * 100 + '%'
	};
};

var getAfterStyle = function getAfterStyle(setWidth, setHeight, fit) {
	return fit === 'scale' ? {
		paddingTop: setHeight / setWidth * 100 + '%'
	} : {
		height: setHeight
	};
};

var getZoomValues = function getZoomValues(mediaState, model) {
	var userZoom = MediaUtil.getZoom(mediaState, model);
	var initialZoom = model.modelState.zoom;
	var currentZoom = userZoom || initialZoom;
	var isZoomDifferentFromInitial = currentZoom !== initialZoom;

	return {
		userZoom: userZoom,
		initialZoom: initialZoom,
		currentZoom: currentZoom,
		isZoomDifferentFromInitial: isZoomDifferentFromInitial
	};
};

var getRenderSettings = function getRenderSettings(model, actualWidth, padding, defaultSize, defaultWidth, defaultHeight, minScale, mediaState) {
	var ms = model.modelState;
	var zoomValues = getZoomValues(mediaState, model);
	var zoom = zoomValues.currentZoom;
	var setDimensions = getSetDimensions(ms, defaultWidth, defaultHeight);
	var mediaSize = getMediaSize(mediaState, model, defaultSize);
	var scaleAmount = getScaleAmount(actualWidth, padding, setDimensions.w);
	var displayedTitle = getDisplayedTitle(ms);
	var sizeState = getSizeState(ms.expandedSize, scaleAmount, mediaSize);
	var isExpanded = sizeState === SIZE_STATE_EXPANDED;
	var scaleDimensions = getScaleDimensions(ms, zoom, isExpanded, scaleAmount, minScale, setDimensions);
	var controlsOpts = getControlsOptions(ms, sizeState);
	var isAtMinScale = scaleDimensions.scale === minScale;
	var iframeStyle = getIFrameStyle(scaleDimensions.scale);
	var afterStyle = getAfterStyle(setDimensions.w, setDimensions.h, ms.fit);
	var isShowing = getIsShowing(mediaState, model);

	return {
		zoomValues: zoomValues,
		zoom: zoom,
		mediaSize: mediaSize,
		displayedTitle: displayedTitle,
		isExpanded: isExpanded,
		scaleDimensions: scaleDimensions,
		isShowing: isShowing,
		controlsOpts: controlsOpts,
		isAtMinScale: isAtMinScale,
		iframeStyle: iframeStyle,
		afterStyle: afterStyle
	};
};

exports.getIsShowing = getIsShowing;
exports.getControlsOptions = getControlsOptions;
exports.getSizeState = getSizeState;
exports.getMediaSize = getMediaSize;
exports.getDisplayedTitle = getDisplayedTitle;
exports.getSetDimensions = getSetDimensions;
exports.getScaleAmount = getScaleAmount;
exports.getScaleDimensions = getScaleDimensions;
exports.getIFrameStyle = getIFrameStyle;
exports.getAfterStyle = getAfterStyle;
exports.getZoomValues = getZoomValues;
exports.getRenderSettings = getRenderSettings;

/***/ }),

/***/ 138:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(273);

var _react = __webpack_require__(290);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(291);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Common = __webpack_require__(0);

var _Common2 = _interopRequireDefault(_Common);

var _Viewer = __webpack_require__(1);

var _Viewer2 = _interopRequireDefault(_Viewer);

var _controls = __webpack_require__(136);

var _controls2 = _interopRequireDefault(_controls);

var _renderSettings = __webpack_require__(137);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import parseURL from 'url-parse'

var DEFAULT_WIDTH = 710;
var DEFAULT_HEIGHT = 500;
var MIN_SCALE = 0.1;

var _Common$components = _Common2.default.components,
    OboComponent = _Common$components.OboComponent,
    Button = _Common$components.Button;

var Dispatcher = _Common2.default.flux.Dispatcher;
var MediaUtil = _Viewer2.default.util.MediaUtil;
var NavUtil = _Viewer2.default.util.NavUtil;
var MediaStore = _Viewer2.default.stores.MediaStore;
var Logo = _Viewer2.default.components.Logo;
var Header = _Viewer2.default.components.Header;
var isOrNot = _Common2.default.util.isOrNot;

var IFrame = function (_React$Component) {
	_inherits(IFrame, _React$Component);

	function IFrame(props) {
		_classCallCheck(this, IFrame);

		var _this = _possibleConstructorReturn(this, (IFrame.__proto__ || Object.getPrototypeOf(IFrame)).call(this, props));

		_this.boundOnClickBlocker = _this.onClickBlocker.bind(_this);
		_this.boundOnClickExpand = _this.onClickExpand.bind(_this);
		_this.boundOnClickExpandClose = _this.onClickExpandClose.bind(_this);
		_this.boundOnZoomReset = _this.onClickZoomReset.bind(_this);
		_this.boundOnReload = _this.onClickReload.bind(_this);
		_this.boundOnViewerContentAreaResized = _this.onViewerContentAreaResized.bind(_this);

		_this.state = {
			actualWidth: 0,
			padding: 0
		};
		return _this;
	}

	_createClass(IFrame, [{
		key: 'getMeasuredDimensions',
		value: function getMeasuredDimensions() {
			var cs = window.getComputedStyle(_reactDom2.default.findDOMNode(this.refs.main), null);

			return {
				width: _reactDom2.default.findDOMNode(this).getBoundingClientRect().width,
				padding: parseFloat(cs.getPropertyValue('padding-left')) + parseFloat(cs.getPropertyValue('padding-right'))
			};
		}
	}, {
		key: 'onViewerContentAreaResized',
		value: function onViewerContentAreaResized() {
			var dims = this.getMeasuredDimensions();

			this.setState({
				actualWidth: dims.width,
				padding: dims.padding
			});
		}
	}, {
		key: 'onClickBlocker',
		value: function onClickBlocker() {
			MediaUtil.show(this.props.model.get('id'));
		}
	}, {
		key: 'onClickExpand',
		value: function onClickExpand() {
			MediaUtil.setSize(this.props.model.get('id'), 'large');
		}
	}, {
		key: 'onClickExpandClose',
		value: function onClickExpandClose() {
			MediaUtil.setSize(this.props.model.get('id'), null);
		}
	}, {
		key: 'onClickZoomReset',
		value: function onClickZoomReset() {
			MediaUtil.resetZoom(this.props.model.get('id'));
		}
	}, {
		key: 'onClickSetZoom',
		value: function onClickSetZoom(newZoom) {
			MediaUtil.setZoom(this.props.model.get('id'), newZoom);
		}
	}, {
		key: 'onClickReload',
		value: function onClickReload() {
			var _this2 = this;

			var src = this.props.model.modelState.src;

			this.refs.iframe.src = '';
			setTimeout(function () {
				_this2.refs.iframe.src = src;
			});
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var dims = this.getMeasuredDimensions();

			this.setState({
				actualWidth: dims.width,
				padding: dims.padding
			});

			if (window.ResizeObserver && window.ResizeObserver.prototype && window.ResizeObserver.prototype.observe && window.ResizeObserver.prototype.disconnect) {
				this.resizeObserver = new ResizeObserver(this.boundOnViewerContentAreaResized);
				this.resizeObserver.observe(_reactDom2.default.findDOMNode(this));
			} else {
				Dispatcher.on('viewer:contentAreaResized', this.boundOnViewerContentAreaResized);
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.resizeObserver) this.resizeObserver.disconnect();
			Dispatcher.off('viewer:contentAreaResized', this.boundOnViewerContentAreaResized);

			if (!this.props.model.modelState.autoload && MediaUtil.isShowingMedia(this.props.moduleData.mediaState, this.props.model)) {
				MediaUtil.hide(this.props.model.get('id'), 'viewerClient');
			}
		}
	}, {
		key: 'renderExpandedBackground',
		value: function renderExpandedBackground() {
			return _react2.default.createElement(
				'div',
				{ className: 'expanded-background' },
				_react2.default.createElement(Header, {
					logoPosition: 'left',
					moduleTitle: this.props.moduleData.model.title,
					location: NavUtil.getNavTargetModel(this.props.moduleData.navState).title || ''
				}),
				_react2.default.createElement(
					Button,
					{ onClick: this.boundOnClickExpandClose },
					'Close'
				)
			);
		}
	}, {
		key: 'render',
		value: function render() {
			var model = this.props.model;
			var ms = model.modelState;

			var _getRenderSettings = (0, _renderSettings.getRenderSettings)(model, this.state.actualWidth, this.state.padding, MediaStore.constructor.SIZE_DEFAULT, DEFAULT_WIDTH, DEFAULT_HEIGHT, MIN_SCALE, this.props.moduleData.mediaState),
			    zoomValues = _getRenderSettings.zoomValues,
			    zoom = _getRenderSettings.zoom,
			    mediaSize = _getRenderSettings.mediaSize,
			    displayedTitle = _getRenderSettings.displayedTitle,
			    isExpanded = _getRenderSettings.isExpanded,
			    scaleDimensions = _getRenderSettings.scaleDimensions,
			    isShowing = _getRenderSettings.isShowing,
			    controlsOpts = _getRenderSettings.controlsOpts,
			    isAtMinScale = _getRenderSettings.isAtMinScale,
			    iframeStyle = _getRenderSettings.iframeStyle,
			    afterStyle = _getRenderSettings.afterStyle;

			return _react2.default.createElement(
				OboComponent,
				{ model: this.props.model, moduleData: this.props.moduleData },
				_react2.default.createElement(
					'div',
					{
						className: 'obojobo-draft--chunks--iframe viewer pad' + isOrNot(this.props.moduleData.isPreviewing, 'previewing') + isOrNot(ms.border, 'bordered') + isOrNot(isShowing, 'showing') + isOrNot(controlsOpts.isControlsEnabled, 'controls-enabled') + isOrNot(ms.src === null, 'missing-src') + isOrNot(scaleDimensions.scale > 1, 'scaled-up') + (' is-size-' + mediaSize),
						ref: 'main'
					},
					isExpanded ? this.renderExpandedBackground() : null,
					_react2.default.createElement(
						'div',
						{
							className: 'container',
							ref: 'container',
							onClick: isShowing || ms.src !== null ? this.boundOnClickBlocker : null,
							style: scaleDimensions.containerStyle
						},
						_react2.default.createElement(
							'div',
							{ className: 'iframe-container', ref: 'iframeContainer' },
							!isShowing ? _react2.default.createElement('div', { className: 'blocker', style: iframeStyle }) : _react2.default.createElement('iframe', {
								ref: 'iframe',
								title: ms.title,
								src: ms.src,
								is: true,
								frameBorder: '0',
								allow: 'geolocation; microphone; camera; midi; encrypted-media; vr',
								style: iframeStyle
							})
						),
						_react2.default.createElement('div', { className: 'after', style: afterStyle }),
						isShowing ? null : _react2.default.createElement(
							'div',
							{ className: 'click-to-load' },
							_react2.default.createElement(
								'span',
								{ className: 'title' },
								displayedTitle
							),
							ms.src === null ? null : _react2.default.createElement(
								Button,
								null,
								'View Content'
							)
						),
						_react2.default.createElement(_controls2.default, {
							newWindowSrc: ms.newWindowSrc ? ms.newWindowSrc : ms.src,
							controlsOptions: controlsOpts,
							isZoomAbleToBeReset: zoomValues.isZoomDifferentFromInitial,
							isUnableToZoomOut: isAtMinScale,
							reload: this.boundOnReload,
							zoomIn: this.onClickSetZoom.bind(this, zoom + 0.1),
							zoomOut: this.onClickSetZoom.bind(this, zoom - 0.1),
							zoomReset: this.boundOnZoomReset,
							expand: this.boundOnClickExpand,
							expandClose: this.boundOnClickExpandClose
						})
					)
				)
			);
		}
	}]);

	return IFrame;
}(_react2.default.Component);

exports.default = IFrame;

/***/ }),

/***/ 257:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String} The decoded string.
 * @api private
 */
function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g,
      result = {},
      part;

  //
  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
  // the lastIndex property so we can continue executing this loop until we've
  // parsed all results.
  //
  for (; part = parser.exec(query); result[decode(part[1])] = decode(part[2])) {}

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

/***/ }),

/***/ 258:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */

module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
      return port !== 80;

    case 'https':
    case 'wss':
      return port !== 443;

    case 'ftp':
      return port !== 21;

    case 'gopher':
      return port !== 70;

    case 'file':
      return false;
  }

  return port !== 0;
};

/***/ }),

/***/ 260:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var required = __webpack_require__(258),
    qs = __webpack_require__(257),
    protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i,
    slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [['#', 'hash'], // Extract from the back.
['?', 'query'], // Extract from the back.
['/', 'pathname'], // Extract from the back.
['@', 'auth', 1], // Extract from the front.
[NaN, 'host', undefined, 1, 1], // Set left over value.
[/:(\d+)$/, 'port', undefined, 1], // RegExp the back.
[NaN, 'hostname', undefined, 1, 1] // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @api public
 */
function lolcation(loc) {
  loc = loc || global.location || {};

  var finaldestination = {},
      type = typeof loc === 'undefined' ? 'undefined' : _typeof(loc),
      key;

  if ('blob:' === loc.protocol) {
    finaldestination = new URL(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new URL(loc, {});
    for (key in ignore) {
      delete finaldestination[key];
    }
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @api private
 */
function extractProtocol(address) {
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @api private
 */
function resolve(relative, base) {
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/')),
      i = path.length,
      last = path[i - 1],
      unshift = false,
      up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} location Location defaults for relative paths.
 * @param {Boolean|Function} parser Parser for the query string.
 * @api public
 */
function URL(address, location, parser) {
  if (!(this instanceof URL)) {
    return new URL(address, location, parser);
  }

  var relative,
      extracted,
      parse,
      instruction,
      index,
      key,
      instructions = rules.slice(),
      type = typeof location === 'undefined' ? 'undefined' : _typeof(location),
      url = this,
      i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[2] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];
    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if (index = parse.exec(address)) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (relative && instruction[3] ? location[key] || '' : '');

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (relative && location.slashes && url.pathname.charAt(0) !== '/' && (url.pathname !== '' || location.pathname !== '')) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL}
 * @api public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname + ':' + value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':' + url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:' ? url.protocol + '//' + url.host : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String}
 * @api public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query,
      url = this,
      protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':' + url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === _typeof(url.query) ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?' + query : query;

  if (url.hash) result += url.hash;

  return result;
}

URL.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
URL.extractProtocol = extractProtocol;
URL.location = lolcation;
URL.qs = qs;

module.exports = URL;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(261)))

/***/ }),

/***/ 261:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),

/***/ 272:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 273:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 290:
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ 291:
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),

/***/ 298:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(107);


/***/ })

/******/ });