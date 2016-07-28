# window.React = require 'react'
# window.Perf = require 'react-addons-perf'

"use strict";

console.log 'editor', OBO

# setup toolbar
# require './toolbar'

# load chunks
# require 'chunks/editor'




loadModule = require '../loadModule'

Viewer = window.Viewer
ViewerApp = Viewer.components.ViewerApp

moduleId = decodeURIComponent(document.location.hash).substr(1)

loadModule moduleId, (items) ->
	items.module = items.module.constructor.createFromDescriptor JSON.parse(window.localStorage.__module)
	ReactDOM.render `<ViewerApp
						module={items.module}
						chunks={items.chunks}
						insertItems={items.insertItems}
						toolbarItems={items.toolbarItems}
					/>`, document.getElementById('viewer-app')