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

	module.exports = __webpack_require__(194);


/***/ },

/***/ 194:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var APIUtil, Dispatcher, _debounce, ie, moduleData, onBlur, onFocus, render;

	__webpack_require__(234).polyfill();

	APIUtil = window.Viewer.util.APIUtil;

	_debounce = function debounce(ms, cb) {
	  clearTimeout(_debounce.id);
	  return _debounce.id = setTimeout(cb, ms);
	};

	_debounce.id = null;

	Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher;

	onFocus = function onFocus() {
	  document.body.className = 'is-focused-window';
	  return Dispatcher.trigger('window:focus');
	};

	onBlur = function onBlur() {
	  document.body.className = 'is-blured-window';
	  return Dispatcher.trigger('window:blur');
	};

	ie = false;

	//@cc_on ie = true;

	if (ie) {
	  document.onfocusin = onFocus;
	  document.onfocusout = onBlur;
	} else {
	  window.onfocus = onFocus;
	  window.onblur = onBlur;
	}

	moduleData = {
	  model: null,
	  navState: null,
	  scoreState: null,
	  questionState: null,
	  assessmentState: null,
	  modalState: null
	};

	render = function (_this) {
	  return function (initialState) {
	    console.log('RENDER');
	    return ReactDOM.render(React.createElement(
	      'div',
	      { className: 'root' },
	      React.createElement(window.Viewer.components.ViewerApp, { initialState: initialState })
	    ), document.getElementById('viewer-app'));
	  };
	}(undefined);

	history.replaceState('', document.title, '/view/' + window.__oboGlobals.draftId + window.location.search);

	window.addEventListener('popstate', function (event) {
	  debugger;
	});

	render(window.__oboGlobals);

/***/ },

/***/ 234:
/***/ function(module, exports, __webpack_require__) {

	/*
	 * smoothscroll polyfill - v0.3.4
	 * https://iamdustan.github.io/smoothscroll
	 * 2016 (c) Dustan Kasten, Jeremias Menichelli - MIT License
	 */

	(function(w, d, undefined) {
	  'use strict';

	  /*
	   * aliases
	   * w: window global object
	   * d: document
	   * undefined: undefined
	   */

	  // polyfill
	  function polyfill() {
	    // return when scrollBehavior interface is supported
	    if ('scrollBehavior' in d.documentElement.style) {
	      return;
	    }

	    /*
	     * globals
	     */
	    var Element = w.HTMLElement || w.Element;
	    var SCROLL_TIME = 468;

	    /*
	     * object gathering original scroll methods
	     */
	    var original = {
	      scroll: w.scroll || w.scrollTo,
	      scrollBy: w.scrollBy,
	      scrollIntoView: Element.prototype.scrollIntoView
	    };

	    /*
	     * define timing method
	     */
	    var now = w.performance && w.performance.now
	      ? w.performance.now.bind(w.performance) : Date.now;

	    /**
	     * changes scroll position inside an element
	     * @method scrollElement
	     * @param {Number} x
	     * @param {Number} y
	     */
	    function scrollElement(x, y) {
	      this.scrollLeft = x;
	      this.scrollTop = y;
	    }

	    /**
	     * returns result of applying ease math function to a number
	     * @method ease
	     * @param {Number} k
	     * @returns {Number}
	     */
	    function ease(k) {
	      return 0.5 * (1 - Math.cos(Math.PI * k));
	    }

	    /**
	     * indicates if a smooth behavior should be applied
	     * @method shouldBailOut
	     * @param {Number|Object} x
	     * @returns {Boolean}
	     */
	    function shouldBailOut(x) {
	      if (typeof x !== 'object'
	            || x === null
	            || x.behavior === undefined
	            || x.behavior === 'auto'
	            || x.behavior === 'instant') {
	        // first arg not an object/null
	        // or behavior is auto, instant or undefined
	        return true;
	      }

	      if (typeof x === 'object'
	            && x.behavior === 'smooth') {
	        // first argument is an object and behavior is smooth
	        return false;
	      }

	      // throw error when behavior is not supported
	      throw new TypeError('behavior not valid');
	    }

	    /**
	     * finds scrollable parent of an element
	     * @method findScrollableParent
	     * @param {Node} el
	     * @returns {Node} el
	     */
	    function findScrollableParent(el) {
	      var isBody;
	      var hasScrollableSpace;
	      var hasVisibleOverflow;

	      do {
	        el = el.parentNode;

	        // set condition variables
	        isBody = el === d.body;
	        hasScrollableSpace =
	          el.clientHeight < el.scrollHeight ||
	          el.clientWidth < el.scrollWidth;
	        hasVisibleOverflow =
	          w.getComputedStyle(el, null).overflow === 'visible';
	      } while (!isBody && !(hasScrollableSpace && !hasVisibleOverflow));

	      isBody = hasScrollableSpace = hasVisibleOverflow = null;

	      return el;
	    }

	    /**
	     * self invoked function that, given a context, steps through scrolling
	     * @method step
	     * @param {Object} context
	     */
	    function step(context) {
	      // call method again on next available frame
	      context.frame = w.requestAnimationFrame(step.bind(w, context));

	      var time = now();
	      var value;
	      var currentX;
	      var currentY;
	      var elapsed = (time - context.startTime) / SCROLL_TIME;

	      // avoid elapsed times higher than one
	      elapsed = elapsed > 1 ? 1 : elapsed;

	      // apply easing to elapsed time
	      value = ease(elapsed);

	      currentX = context.startX + (context.x - context.startX) * value;
	      currentY = context.startY + (context.y - context.startY) * value;

	      context.method.call(context.scrollable, currentX, currentY);

	      // return when end points have been reached
	      if (currentX === context.x && currentY === context.y) {
	        w.cancelAnimationFrame(context.frame);
	        return;
	      }
	    }

	    /**
	     * scrolls window with a smooth behavior
	     * @method smoothScroll
	     * @param {Object|Node} el
	     * @param {Number} x
	     * @param {Number} y
	     */
	    function smoothScroll(el, x, y) {
	      var scrollable;
	      var startX;
	      var startY;
	      var method;
	      var startTime = now();
	      var frame;

	      // define scroll context
	      if (el === d.body) {
	        scrollable = w;
	        startX = w.scrollX || w.pageXOffset;
	        startY = w.scrollY || w.pageYOffset;
	        method = original.scroll;
	      } else {
	        scrollable = el;
	        startX = el.scrollLeft;
	        startY = el.scrollTop;
	        method = scrollElement;
	      }

	      // cancel frame when a scroll event's happening
	      if (frame) {
	        w.cancelAnimationFrame(frame);
	      }

	      // scroll looping over a frame
	      step({
	        scrollable: scrollable,
	        method: method,
	        startTime: startTime,
	        startX: startX,
	        startY: startY,
	        x: x,
	        y: y,
	        frame: frame
	      });
	    }

	    /*
	     * ORIGINAL METHODS OVERRIDES
	     */

	    // w.scroll and w.scrollTo
	    w.scroll = w.scrollTo = function() {
	      // avoid smooth behavior if not required
	      if (shouldBailOut(arguments[0])) {
	        original.scroll.call(
	          w,
	          arguments[0].left || arguments[0],
	          arguments[0].top || arguments[1]
	        );
	        return;
	      }

	      // LET THE SMOOTHNESS BEGIN!
	      smoothScroll.call(
	        w,
	        d.body,
	        ~~arguments[0].left,
	        ~~arguments[0].top
	      );
	    };

	    // w.scrollBy
	    w.scrollBy = function() {
	      // avoid smooth behavior if not required
	      if (shouldBailOut(arguments[0])) {
	        original.scrollBy.call(
	          w,
	          arguments[0].left || arguments[0],
	          arguments[0].top || arguments[1]
	        );
	        return;
	      }

	      // LET THE SMOOTHNESS BEGIN!
	      smoothScroll.call(
	        w,
	        d.body,
	        ~~arguments[0].left + (w.scrollX || w.pageXOffset),
	        ~~arguments[0].top + (w.scrollY || w.pageYOffset)
	      );
	    };

	    // Element.prototype.scrollIntoView
	    Element.prototype.scrollIntoView = function() {
	      // avoid smooth behavior if not required
	      if (shouldBailOut(arguments[0])) {
	        original.scrollIntoView.call(this, arguments[0] || true);
	        return;
	      }

	      // LET THE SMOOTHNESS BEGIN!
	      var scrollableParent = findScrollableParent(this);
	      var parentRects = scrollableParent.getBoundingClientRect();
	      var clientRects = this.getBoundingClientRect();

	      if (scrollableParent !== d.body) {
	        // reveal element inside parent
	        smoothScroll.call(
	          this,
	          scrollableParent,
	          scrollableParent.scrollLeft + clientRects.left - parentRects.left,
	          scrollableParent.scrollTop + clientRects.top - parentRects.top
	        );
	        // reveal parent in viewport
	        w.scrollBy({
	          left: parentRects.left,
	          top: parentRects.top,
	          behavior: 'smooth'
	        });
	      } else {
	        // reveal element in viewport
	        w.scrollBy({
	          left: clientRects.left,
	          top: clientRects.top,
	          behavior: 'smooth'
	        });
	      }
	    };
	  }

	  if (true) {
	    // commonjs
	    module.exports = { polyfill: polyfill };
	  } else {
	    // global
	    polyfill();
	  }
	})(window, document);


/***/ }

/******/ });