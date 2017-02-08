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

	module.exports = __webpack_require__(132);


/***/ },

/***/ 54:
/***/ function(module, exports) {

	"use strict";

	var API, Head, Module, OBO, ObojoboDraft, loadModule;

	ObojoboDraft = window.ObojoboDraft;

	OBO = window.OBO;

	Head = ObojoboDraft.page.Head;

	Module = ObojoboDraft.models.Module;

	API = ObojoboDraft.net.API;

	loadModule = function loadModule(id, loadCallback) {
	  if ((id != null ? id.length : void 0) != null && id.length > 0) {
	    return API.module.get(id, function (descr) {
	      return loadCallback(Module.createFromDescriptor(null, descr));
	    });
	  } else {
	    return loadCallback(new Module());
	  }
	};

	module.exports = function (moduleId, loadCallback) {
	  return OBO.getChunks(function (chunks) {
	    return loadModule(moduleId, function (module) {
	      return loadCallback({
	        module: module,
	        insertItems: OBO.insertItems,
	        chunks: chunks,
	        toolbarItems: OBO.toolbarItems
	      });
	    });
	  });
	};

/***/ },

/***/ 132:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var EditorApp, loadModule, moduleId;

	loadModule = __webpack_require__(54);

	EditorApp = window.Editor.components.EditorApp;

	moduleId = decodeURIComponent(document.location.hash).substr(1);

	loadModule(moduleId, function (items) {
					return ReactDOM.render(React.createElement(EditorApp, {
									module: items.module,
									chunks: items.chunks,
									insertItems: items.insertItems,
									toolbarItems: items.toolbarItems
					}), document.getElementById('editor-app'));
	});

/***/ }

/******/ });