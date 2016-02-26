"use strict";

React = require 'react'
EditorApp = require './editor/components/editorapp'
API = require './net/api'

require './util/console'

id = document.location.hash.substr(1)

render = (module = null) ->
	React.render React.createElement(EditorApp, {module:module}), document.getElementById('editor-app')

if id isnt ''
	API.module.get id, render
else
	render()