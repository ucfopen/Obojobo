# window.React = require 'react'
# window.Perf = require 'react-addons-perf'

"use strict";

require './bootstrap'

loadModule = require './loadModule'

Viewer = require 'viewer'
ViewerApp = Viewer.components.EditorApp

moduleId = decodeURIComponent(document.location.hash).substr(1)

loadModule moduleId, (items) ->
	ReactDOM.render `<ViewerApp
						module={items.module}
						chunks={items.chunks}
						insertItems={items.insertItems}
						toolbarItems={items.toolbarItems}
					/>`, document.getElementById('viewer-app')