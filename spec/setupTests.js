// Hack to get LaTeX to not warn about quirks mode:
document.write('<!DOCTYPE html><body><div id="viewer-app"></div></body>');

window.React = require('react');
window.ReactDOM = require('react-dom');
window._ = require('underscore');
window.Backbone = require('backbone');

window.__oboGlobals = {};

require("../build/obo.js")
require("../build/obojobo-draft.js")
require("../build/obojobo-draft-document-viewer.js")