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

/***/ 97:
/***/ function(module, exports) {

	"use strict";

	var ComponentClassMap;

	ComponentClassMap = function () {
	  function ComponentClassMap() {
	    this.nameToClass = new Map();
	    this.classToName = new Map();
	    this.defaultClass = null;
	    this.errorClass = null;
	  }

	  ComponentClassMap.prototype.setDefault = function (type) {
	    return this.defaultClass = this.getClassForType(type);
	  };

	  ComponentClassMap.prototype.setError = function (type) {
	    return this.errorClass = this.getClassForType(type);
	  };

	  ComponentClassMap.prototype.register = function (type, componentClass) {
	    this.nameToClass.set(type, componentClass);
	    return this.classToName.set(componentClass, type);
	  };

	  ComponentClassMap.prototype.getClassForType = function (type) {
	    var componentClass;
	    componentClass = this.nameToClass.get(type);
	    if (componentClass == null) {
	      return this.errorClass;
	    }
	    return componentClass;
	  };

	  ComponentClassMap.prototype.getTypeOfClass = function (componentClass) {
	    return this.classToName.get(componentClass);
	  };

	  ComponentClassMap.prototype.hasType = function (type) {
	    return this.nameToClass.has(type);
	  };

	  ComponentClassMap.prototype.hasClass = function (componentClass) {
	    return this.classToName.has(componentClass);
	  };

	  return ComponentClassMap;
	}();

	module.exports = ComponentClassMap;

/***/ },

/***/ 194:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ComponentClassMap, OBO, componentClassMap, defaults, getItemsCallbacks, insertItems, items, itemsLoaded, registeredToolbarItems, textListeners, toolbarItems, triggerActions, variableHandlers;

	ComponentClassMap = __webpack_require__(97);

	componentClassMap = new ComponentClassMap();

	items = new Map();

	itemsLoaded = 0;

	getItemsCallbacks = [];

	defaults = new Map();

	insertItems = new Map();

	registeredToolbarItems = {
	  'separator': {
	    id: 'separator',
	    type: 'separator'
	  }
	};

	toolbarItems = [];

	textListeners = [];

	triggerActions = {};

	variableHandlers = new Map();

	window.__VH = variableHandlers;

	OBO = function () {
	  function OBO() {}

	  OBO.prototype.loadDependency = function (url, onLoadCallback) {
	    var el, type;
	    if (onLoadCallback == null) {
	      onLoadCallback = function onLoadCallback() {};
	    }
	    type = url.substr(url.lastIndexOf('.') + 1);
	    switch (type) {
	      case 'js':
	        el = document.createElement('script');
	        el.setAttribute('src', url);
	        el.onload = onLoadCallback;
	        document.head.appendChild(el);
	        break;
	      case 'css':
	        el = document.createElement('link');
	        el.setAttribute('rel', 'stylesheet');
	        el.setAttribute('href', url);
	        document.head.appendChild(el);
	        onLoadCallback();
	    }
	    return this;
	  };

	  OBO.prototype.register = function (className, opts) {
	    var cb, loadDependency, promises, ref, variable;
	    if (opts == null) {
	      opts = {};
	    }
	    items.set(className, opts);
	    opts = Object.assign({
	      type: null,
	      dependencies: [],
	      "default": false,
	      error: false,
	      insertItem: null,
	      modelClass: null,
	      componentClass: null,
	      selectionHandler: null,
	      commandHandler: null,
	      variables: {},
	      init: function init() {}
	    }, opts);
	    if (opts["default"]) {
	      defaults.set(opts.type, className);
	    }
	    if (opts.insertItem) {
	      insertItems.set(chunkClass.type, opts.insertItem);
	    }
	    opts.init();
	    ref = opts.variables;
	    for (variable in ref) {
	      cb = ref[variable];
	      variableHandlers.set(variable, cb);
	    }
	    loadDependency = this.loadDependency;
	    promises = opts.dependencies.map(function (dependency) {
	      return new Promise(function (resolve, reject) {
	        return loadDependency(dependency, resolve);
	      });
	    });
	    Promise.all(promises).then(function () {
	      var callback, i, len;
	      itemsLoaded++;
	      if (itemsLoaded === items.size) {
	        for (i = 0, len = getItemsCallbacks.length; i < len; i++) {
	          callback = getItemsCallbacks[i];
	          callback(chunks);
	        }
	        return getItemsCallbacks = [];
	      }
	    });
	    return this;
	  };

	  OBO.prototype.getDefaultItemForModelType = function (modelType) {
	    var type;
	    type = defaults.get(modelType);
	    if (!type) {
	      return null;
	    }
	    return items.get(type);
	  };

	  OBO.prototype.getItemForType = function (type) {
	    return items.get(type);
	  };

	  OBO.prototype.registerToolbarItem = function (opts) {
	    registeredToolbarItems[opts.id] = opts;
	    return this;
	  };

	  OBO.prototype.addToolbarItem = function (id) {
	    toolbarItems.push(Object.assign({}, registeredToolbarItems[id]));
	    return this;
	  };

	  OBO.prototype.registerTextListener = function (opts, position) {
	    if (position == null) {
	      position = -1;
	    }
	    if (position > -1) {
	      textListeners.splice(position, 0, opts);
	    } else {
	      textListeners.push(opts);
	    }
	    return this;
	  };

	  OBO.prototype.getItems = function (callback) {
	    if (true) {
	      callback(items);
	    } else {
	      getItemsCallbacks.push(callback);
	    }
	    return null;
	  };

	  OBO.prototype.getDefaultItemForType = function (type) {
	    var className;
	    className = defaults.get(type);
	    if (className == null) {
	      return null;
	    }
	    return items.get(className);
	  };

	  OBO.prototype.getTextForVariable = function (variable, model, viewerState) {
	    var cb;
	    cb = variableHandlers.get(variable);
	    if (!cb) {
	      return null;
	    }
	    return cb.call(null, model, viewerState);
	  };

	  return OBO;
	}();

	Object.defineProperties(OBO.prototype, {
	  insertItems: {
	    get: function get() {
	      return insertItems;
	    }
	  },
	  registeredToolbarItems: {
	    get: function get() {
	      return registeredToolbarItems;
	    }
	  },
	  toolbarItems: {
	    get: function get() {
	      return toolbarItems;
	    }
	  },
	  textListeners: {
	    get: function get() {
	      return textListeners;
	    }
	  },
	  triggerActions: {
	    get: function get() {
	      return triggerActions;
	    }
	  },
	  __debug__chunks: {
	    get: function get() {
	      return chunks;
	    }
	  }
	});

	window.OBO = new OBO();

/***/ }

/******/ });