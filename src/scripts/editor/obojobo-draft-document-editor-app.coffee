# window.React = require 'react'
# window.Perf = require 'react-addons-perf'

"use strict";

# console.log 'editor', OBOoo

# setup toolbar
# require './toolbar'

# load chunks
# require 'chunks/editor'




loadModule = require '../loadmodule'

EditorApp = require 'Editor/components/editorapp'

moduleId = decodeURIComponent(document.location.hash).substr(1)

loadModule moduleId, (items) ->
	ReactDOM.render `<EditorApp
						module={items.module}
						chunks={items.chunks}
						insertItems={items.insertItems}
						toolbarItems={items.toolbarItems}
					/>`, document.getElementById('editor-app')