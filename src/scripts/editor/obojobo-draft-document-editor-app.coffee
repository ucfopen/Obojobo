# window.React = require 'react'
# window.Perf = require 'react-addons-perf'

"use strict";

console.log 'editor', OBO

# setup toolbar
# require './toolbar'

# load chunks
# require 'chunks/editor'




loadModule = require '../loadmodule'

Editor = window.Editor
EditorApp = Editor.components.EditorApp

moduleId = decodeURIComponent(document.location.hash).substr(1)

loadModule moduleId, (items) ->
	ReactDOM.render `<EditorApp
						module={items.module}
						chunks={items.chunks}
						insertItems={items.insertItems}
						toolbarItems={items.toolbarItems}
					/>`, document.getElementById('editor-app')