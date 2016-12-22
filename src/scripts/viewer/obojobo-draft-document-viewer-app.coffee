"use strict";

navStore = window.Viewer.stores.navStore
ScoreStore = window.Viewer.stores.ScoreStore
assessmentStore = window.Viewer.stores.assessmentStore
APIUtil = window.Viewer.util.APIUtil

JSONInput = require 'Viewer/components/jsoninput'

debounce = (ms, cb) ->
	clearTimeout debounce.id
	debounce.id = setTimeout cb, ms
debounce.id = null

# set up global event listeners
Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher

Dispatcher.on
	'assessment:startAttempt': (payload) => APIUtil.postEvent(moduleData.model, 'assessment:startAttempt', payload.value)
	'assessment:endAttempt':   (payload) => APIUtil.postEvent(moduleData.model, 'assessment:endAttempt', payload.value)
	'score:set':               (payload) => APIUtil.postEvent(moduleData.model, 'score:set', payload.value)
	'window:focus':            (payload) => APIUtil.postEvent(moduleData.model, 'windowFocus', {})
	'window:blur':             (payload) => APIUtil.postEvent(moduleData.model, 'windowFocus', {})

# Set up listeners for window for blur/focus
onFocus = ->
	document.body.className = 'is-focused-window'
	Dispatcher.trigger 'window:focus'

onBlur = ->
	document.body.className = 'is-blured-window'
	Dispatcher.trigger 'window:blur'

ie = false;
`//@cc_on ie = true`
if ie
	document.onfocusin = onFocus
	document.onfocusout = onBlur
else
	window.onfocus = onFocus
	window.onblur = onBlur


moduleData =
	model: null
	navState: null
	scoreState: null
	assessmentState: null

render = =>
	console.log 'RENDER'
	moduleData.navState = navStore.getState()
	moduleData.scoreState = ScoreStore.getState()
	moduleData.assessmentState = assessmentStore.getState()

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

	ReactDOM.render `<div className="root">
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
		navStore.init moduleData.model, moduleData.model.modelState.start
	else
		stateData = JSON.parse(window.localStorage.stateData)
		console.log 'STATE DATA', stateData

		navStore.setState stateData.navState
		ScoreStore.setState stateData.scoreState
		assessmentStore.setState stateData.assessmentState

	render()

# === SET UP DATA STORES ===
navStore.onChange render
ScoreStore.onChange render
assessmentStore.onChange render


# === FIGURE OUT WHERE TO GET THE DOCUMENT FROM ===
if window.location.hash.indexOf('legacy') > -1
	# support legacy objects
	legacyJson = require 'json!../../../citing-sources-mla.json'
	moduleData.model =  window.ObojoboDraft.Common.models.Legacy.createModuleFromObo2ModuleJSON legacyJson
	navStore.init moduleData.model
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
