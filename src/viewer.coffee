"use strict";

React = require 'react'
ViewerApp = require './viewer/components/viewerapp'
API = require './net/api'


API.module.get document.location.hash.substr(1), (module) ->
# API.module.get 'Y5Nr5', (module) ->
	console.log 'I GOT A THING', module
	React.render React.createElement(ViewerApp, {module:module}), document.getElementById('viewer-app')