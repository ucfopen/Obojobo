"use strict";

# polyfills:
require('smoothscroll-polyfill').polyfill()

# ModalStore = window.ObojoboDraft.Common.stores.ModalStore
# NavStore = window.Viewer.stores.NavStore
# ScoreStore = window.Viewer.stores.ScoreStore
# QuestionStore = window.Viewer.stores.QuestionStore
# AssessmentStore = window.Viewer.stores.AssessmentStore
APIUtil = window.Viewer.util.APIUtil

OboGlobals = window.ObojoboDraft.Common.util.OboGlobals

debounce = (ms, cb) ->
	clearTimeout debounce.id
	debounce.id = setTimeout cb, ms
debounce.id = null

# set up global event listeners
Dispatcher = window.ObojoboDraft.Common.flux.Dispatcher

# Dispatcher.on
# 	'assessment:startAttempt': (payload) => APIUtil.postEvent(moduleData.model, 'assessment:startAttempt', payload.value)
# 	'assessment:endAttempt':   (payload) => APIUtil.postEvent(moduleData.model, 'assessment:endAttempt', payload.value)
# 	'score:set':               (payload) => APIUtil.postEvent(moduleData.model, 'score:set', payload.value)
# 	'window:focus':            (payload) => APIUtil.postEvent(moduleData.model, 'windowFocus', {})
# 	'window:blur':             (payload) => APIUtil.postEvent(moduleData.model, 'windowFocus', {})

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
	questionState: null
	assessmentState: null
	modalState: null

render = =>
	# moduleData.navState = NavStore.getState()
	# moduleData.scoreState = ScoreStore.getState()
	# moduleData.questionState = QuestionStore.getState()
	# moduleData.assessmentState = AssessmentStore.getState()
	# moduleData.modalState = ModalStore.getState()

	# window.localStorage.stateData = JSON.stringify({
	# 	navState:        moduleData.navState,
	# 	scoreState:      moduleData.scoreState,
	# 	questionState:   moduleData.questionState,
	# 	assessmentState: moduleData.assessmentState
	# })

	# debounce 2000, ->
	# 	console.log 'SAVE STATE'
	# 	APIUtil.saveState moduleData.model, {
	# 		navState: moduleData.navState
	# 		scoreState: moduleData.scoreState
	# 		questionState: moduleData.questionState
	# 		assessmentState: moduleData.assessmentState
	# 	}

	ReactDOM.render `<div className="root">
		<window.Viewer.components.ViewerApp />
	</div>`, document.getElementById('viewer-app')




# showDocument = (json) =>
# 	# OboModel = window.ObojoboDraft.Common.models.OboModel
# 	# moduleData.model = OboModel.create(json)

# 	# APIUtil.getAttempts(moduleData.model).then (res) =>
# 	# 	console.log('ATTEMPTS', res)
# 	# 	return

# 	# 	if true or not window.localStorage.stateData?
# 	# 		console.log moduleData.model
# 	# 		# NavStore.init moduleData.model, moduleData.model.modelState.start
# 	# 	else
# 	# 		stateData = JSON.parse(window.localStorage.stateData)
# 	# 		console.log 'STATE DATA', stateData

# 	# 		NavStore.setState stateData.navState
# 	# 		ScoreStore.setState stateData.scoreState
# 	# 		QuestionStore.setState stateData.questionState
# 	# 		AssessmentStore.setState stateData.assessmentState

# 		render(json)

# # === SET UP DATA STORES ===
# NavStore.onChange render
# ScoreStore.onChange render
# QuestionStore.onChange render
# AssessmentStore.onChange render
# ModalStore.onChange render


# === FIGURE OUT WHERE TO GET THE DOCUMENT FROM ===
# if window.location.hash.indexOf('legacy') > -1
# 	# support legacy objects
# 	legacyJson = require 'json!../../../citing-sources-mla.json'
# 	moduleData.model =  window.ObojoboDraft.Common.models.Legacy.createModuleFromObo2ModuleJSON legacyJson
# 	NavStore.init moduleData.model
# 	render()

# else if window.location.hash.indexOf('file') > -1
# 	# load from our test file
# 	json = require 'json!../../../test-object.json'
# 	showDocument(json)


# else
# 	# load from api
# 	APIUtil.fetchDraft('sample').then (res) => showDocument(res.value)
# window.location.pathname = '/view/' + window.__oboGlobals.draftId
history.replaceState('', document.title, '/view/' + OboGlobals.get('draftId') + window.location.search)

# window.addEventListener 'popstate', (event) ->
# 	console.log('event', event)
# 	debugger


render()