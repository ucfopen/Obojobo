"use strict";
NavStore = require 'Viewer/stores/navstore'
ScoreStore = require 'Viewer/stores/scorestore'
AssessmentStore = require 'Viewer/stores/assessmentstore'

moduleData =
	model: null
	navState: null
	scoreState: null
	assessmentState: null

render = =>
	console.log 'RENDER'
	moduleData.navState = NavStore.getState()
	moduleData.scoreState = ScoreStore.getState()
	moduleData.assessmentState = AssessmentStore.getState()
	ReactDOM.render `<window.Viewer.components.ViewerApp moduleData={moduleData} />`, document.getElementById('viewer-app')

showDocument = (json) =>
	OboModel = window.ObojoboDraft.Common.models.OboModel
	moduleData.model = OboModel.create(json)
	NavStore.init moduleData.model
	render()

# === SET UP DATA STORES ===
NavStore.addChangeListener render
ScoreStore.addChangeListener render
AssessmentStore.addChangeListener render


# === FIGURE OUT WHERE TO GET THE DOCUMENT FROM ===
if window.location.hash.indexOf('legacy') > -1
	# support legacy objects
	legacyJson = require 'json!../../../citing-sources-mla.json'
	moduleData.model =  window.ObojoboDraft.Common.models.Legacy.createModuleFromObo2ModuleJSON legacyJson
	NavStore.init moduleData.model
	render()

else if window.location.hash.indexOf('file') > -1
	# load from our test file
	json = require 'json!../../../test-object.json'
	showDocument(json)

else if window.localStorage.__lo?
	# load from local storage
	try
		json = JSON.parse(window.localStorage.__lo)
		showDocument(json)

	catch e
		# ...
else
	# load from api
	fetch '/api/drafts/sample'
	.then (resp) => resp.json() # convert resp to json
	.then (json) => showDocument(json) # render
	.catch (error) =>
		console.log 'error', error
		throw error
