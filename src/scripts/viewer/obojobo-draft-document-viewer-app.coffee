"use strict";

NavStore = window.Viewer.stores.NavStore
ScoreStore = window.Viewer.stores.ScoreStore
AssessmentStore = window.Viewer.stores.AssessmentStore
APIUtil = window.Viewer.util.APIUtil

JSONInput = require 'Viewer/components/jsoninput'

debounce = (ms, cb) ->
	clearTimeout debounce.id
	debounce.id = setTimeout cb, ms
debounce.id = null

window.ObojoboDraft.Common.flux.Dispatcher.register (payload) ->
	switch payload.type
		when 'assessment:startAttempt'
			APIUtil.postEvent moduleData.model, 'assessment:startAttempt', payload.value

		when 'assessment:endAttempt'
			APIUtil.postEvent moduleData.model, 'assessment:endAttempt', payload.value

		when 'score:set'
			APIUtil.postEvent moduleData.model, 'score:set', payload.value



moduleData =
	model: null
	navState: null
	scoreState: null
	assessmentState: null

render = =>
	moduleData.navState = NavStore.getState()
	moduleData.scoreState = ScoreStore.getState()
	moduleData.assessmentState = AssessmentStore.getState()

	window.localStorage.stateData = JSON.stringify({
		navState:        moduleData.navState,
		scoreState:      moduleData.scoreState,
		assessmentState: moduleData.assessmentState
	})

	debounce 2000, ->
		# console.clear()
		console.log 'SEND'
		APIUtil.saveState moduleData.model, {
			navState: moduleData.navState
			scoreState: moduleData.scoreState
			assessmentState: moduleData.assessmentState
		}

	ReactDOM.render `<div>
		<window.Viewer.components.ViewerApp moduleData={moduleData} />
		<JSONInput onChange={onChangeJSON} value={JSON.stringify(moduleData.model.toJSON(), null, 2)} />
	</div>`, document.getElementById('viewer-app')


onChangeJSON = (json) ->
	try
		o = JSON.parse(json)
	catch e
		alert 'Error parsing JSON'
		return

	OboModel = window.ObojoboDraft.Common.models.OboModel
	newModule = OboModel.create o

	moduleData.model = newModule
	render()

showDocument = (json) =>
	OboModel = window.ObojoboDraft.Common.models.OboModel
	moduleData.model = OboModel.create(json)

	if true or not window.localStorage.stateData?
		console.log moduleData.model
		NavStore.init moduleData.model, moduleData.model.modelState.start
	else
		stateData = JSON.parse(window.localStorage.stateData)
		console.log 'STATE DATA', stateData

		NavStore.setState stateData.navState
		ScoreStore.setState stateData.scoreState
		AssessmentStore.setState stateData.assessmentState

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
	APIUtil.fetchDraft('sample').then (json) => showDocument(json)
