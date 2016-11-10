"use strict";

Common = window.ObojoboDraft.Common
OboModel = Common.models.OboModel

t = OboModel.create('ObojoboDraft.Chunks.Text')
t2 = OboModel.create('chunk')
t3 = OboModel.create({ type:'ObojoboDraft.Chunks.Text', children:null })

console.log 'items be=', t, t2, t3


c = OBO.getDefaultItemForType('chunk')
# OBO.register "ObojoboDraft.Chunks.List", Object.assign({}, c)
# OBO.register "ObojoboDraft.Chunks.MCAssessment", Object.assign({}, c)
# OBO.register "ObojoboDraft.Chunks.Question", Object.assign({}, c)
# OBO.register "ObojoboDraft.Chunks.QuestionBank", Object.assign({}, c)
# OBO.register "ObojoboDraft.Chunks.Text", Object.assign({}, c)
# OBO.register "ObojoboDraft.Modules.Module", Object.assign({}, c)
# OBO.register "ObojoboDraft.Sections.Content", Object.assign({}, c)
OBO.register "ObojoboDraft.Pages.AssessmentIntro", Object.assign({}, c)
# OBO.register "ObojoboDraft.Pages.Page", Object.assign({}, c)
# OBO.register "ObojoboDraft.Sections.Assessment", Object.assign({}, c)





moduleData = require 'json!../../../test-object.json'
console.log moduleData

Viewer = window.Viewer
ViewerApp = Viewer.components.ViewerApp


# console.log t4
# t4 = OboModel.create(moduleData)
ReactDOM.render `<ViewerApp
					moduleData={moduleData}
				/>`, document.getElementById('viewer-app')


# loadModule = require '../loadmodule'

# Viewer = window.Viewer
# ViewerApp = Viewer.components.ViewerApp

# moduleId = decodeURIComponent(document.location.hash).substr(1)

# loadModule moduleId, (items) ->
# 	console.log 'items be', items

	# items.module = items.module.constructor.createFromDescriptor null, JSON.parse(window.localStorage.__module)
	# moduleData = require 'json!../../../test-object.json'

	# ReactDOM.render `<ViewerApp
	# 					moduleData={moduleData}
	# 					chunks={items.chunks}
	# 					insertItems={items.insertItems}
	# 					toolbarItems={items.toolbarItems}
	# 				/>`, document.getElementById('viewer-app')