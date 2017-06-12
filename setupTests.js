const path = require('path')

// Hack to get LaTeX to not warn about quirks mode:
document.write('<!DOCTYPE html><body><div id="viewer-app"></div></body>');

global.oboRequire = name => require(path.join(__dirname, `../../${name}`))

window.React = require('react');
window.ReactDOM = require('react-dom');
window._ = require('underscore');
window.Backbone = require('backbone');
window.katex = require('katex');

React.addons = {
	CSSTransitionGroup: require('react-transition-group/CSSTransitionGroup')
}

window.__oboGlobals = {};

// require("../build/obo.js")
// window.ObojoboDraft = require("../build/obojobo-draft.js")
// window.Viewer = require('../build/viewer.js')

// require("../build/viewer-app.js")
