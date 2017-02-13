# delete localStorage.stateData






"use strict";

ModalStore = window.ObojoboDraft.Common.stores.ModalStore
NavStore = window.Viewer.stores.NavStore
ScoreStore = window.Viewer.stores.ScoreStore
AssessmentStore = window.Viewer.stores.AssessmentStore
APIUtil = window.Viewer.util.APIUtil
NavUtil = window.Viewer.util.NavUtil

JSONInput = require 'Viewer/components/jsoninput'

button = document.createElement 'button'
button.appendChild document.createTextNode('RESET')
button.style.position = 'fixed'
button.style.top = '0'
button.style.right = '0'
button.id = '--reset-all'
button.onclick = ->
	if confirm('Are you sure you want to reset all saved changes and revert back to the example?')
		delete window.localStorage.__edit
		window.location.reload()

document.body.appendChild(button)

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


moduleData = {}

render = =>
	console.log 'RENDER'
	moduleData.navState = NavStore.getState()
	moduleData.scoreState = ScoreStore.getState()
	moduleData.assessmentState = AssessmentStore.getState()
	moduleData.modalState = ModalStore.getState()

	window.localStorage.stateData = JSON.stringify({
		navState:        moduleData.navState,
		scoreState:      moduleData.scoreState,
		assessmentState: moduleData.assessmentState
	})

	debounce 2000, ->
		APIUtil.saveState moduleData.model, {
			navState: moduleData.navState
			scoreState: moduleData.scoreState
			assessmentState: moduleData.assessmentState
		}

	ReactDOM.render `<div className="root">
		<window.Viewer.components.ViewerApp moduleData={moduleData} />
		<JSONInput onChange={onChangeJSON} value={JSON.stringify(moduleData.model.toJSON(), null, 2)} />
	</div>`, document.getElementById('viewer-app')


onChangeJSON = (o) ->


	# OboModel = window.ObojoboDraft.Common.models.OboModel
	# newModule = OboModel.create o

	# moduleData.model = newModule
	showDocument(o)

showDocument = (json) =>
	moduleData =
		model: null
		navState: null
		scoreState: null
		assessmentState: null
		modalState: null

	OboModel = window.ObojoboDraft.Common.models.OboModel
	OboModel.models = {}
	# debugger
	moduleData.model = OboModel.create(json)

	# if true or not window.localStorage.stateData?


	# if not window.localStorage.stateData?
	if true or not window.localStorage.stateData?
		console.log moduleData
		NavStore.init moduleData.model
		NavUtil.goto moduleData.model.modelState.start
	else
		stateData = JSON.parse(window.localStorage.stateData)
		console.log 'STATE DATA', stateData

		NavStore.setState stateData.navState
		ScoreStore.setState stateData.scoreState
		AssessmentStore.setState stateData.assessmentState

		NavStore.init moduleData.model

	render()

# === SET UP DATA STORES ===
NavStore.onChange render
ScoreStore.onChange render
AssessmentStore.onChange render
ModalStore.onChange render


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

else if window.location.hash.indexOf('sample') > -1
	# load from api
	APIUtil.fetchDraft('sample').then (json) => showDocument(json)



else
	# load from local storage
	if window.localStorage.__edit
		json = JSON.parse window.localStorage.__edit
	else
		json = require 'json!../../../test-object.json'

	showDocument(json)

