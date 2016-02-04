"use strict";

React = require 'react'
EditorApp = require './editor/components/editorapp'
API = require './net/api'


API.module.get document.location.hash.substr(1), (module) ->
# API.module.get 'Y5Nr5', (module) ->
	console.log 'I GOT A THING', module
	React.render React.createElement(EditorApp, {module:module}), document.getElementById('editor-app')