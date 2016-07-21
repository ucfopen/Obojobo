# window.React = require 'react'
# window.Perf = require 'react-addons-perf'

"use strict";

console.clear()
console.log '2'

require './bootstrap'

loadModule = require './loadModule'

Editor = require 'editor'
EditorApp = Editor.components.EditorApp

moduleId = decodeURIComponent(document.location.hash).substr(1)

loadModule moduleId, (items) ->
	ReactDOM.render `<EditorApp
						module={items.module}
						chunks={items.chunks}
						insertItems={items.insertItems}
						toolbarItems={items.toolbarItems}
					/>`, document.getElementById('editor-app')