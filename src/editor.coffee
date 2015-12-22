"use strict";

React = require 'react'
EditorApp = require './editor/components/editorapp'

React.render React.createElement(EditorApp), document.getElementById('editor-app')