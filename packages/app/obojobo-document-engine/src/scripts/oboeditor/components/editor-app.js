import '../../../scss/main.scss'
// uses viewer css for styling
import '../../viewer/components/viewer-app.scss'
import 'obojobo-modules-module/viewer-component.scss'
import './editor-app.scss'

import APIUtil from '../../viewer/util/api-util' //@TODO: move api-util out of viewer
import Common from '../../common'
import CodeEditor from './code-editor'
import EditorStore from '../stores/editor-store'
import EditorUtil from '../util/editor-util'
import { KeyUtils } from 'slate'
import PageEditor from './page-editor'
import React from 'react'
import generateId from '../generate-ids'
import enableWindowCloseDispatcher from '../../common/util/close-window-dispatcher'
import ObojoboIdleTimer from '../../common/components/obojobo-idle-timer'

// PLUGINS
import ClipboardPlugin from '../plugins/clipboard-plugin'
import EditorSchema from '../plugins/editor-schema'
import Component from './node/editor'
import SelectParameter from './parameter-node/select-parameter'
import TextParameter from './parameter-node/text-parameter'
import ToggleParameter from './parameter-node/toggle-parameter'
import MarkToolbar from './toolbars/content-toolbar'

const ModalContainer = Common.components.ModalContainer
const ModalUtil = Common.util.ModalUtil
const ModalStore = Common.stores.ModalStore
const OboModel = Common.models.OboModel
const Dispatcher = Common.flux.Dispatcher

const XML_MODE = 'xml'
const VISUAL_MODE = 'visual'
const RENEW_LOCK_INTERVAL = 60000 * .2 // 4.9 minutes in milliseconds
const IDLE_TIMEOUT_DURATION_MS = 60000 * .1 // 30 minutes in milliseconds

const plugins = [
	Component.plugins,
	MarkToolbar.plugins,
	ToggleParameter.plugins,
	SelectParameter.plugins,
	TextParameter.plugins,
	EditorSchema,
	ClipboardPlugin
]

class EditorApp extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			model: null,
			editorState: null,
			modalState: null,
			navTargetId: null,
			loading: true,
			draftId: null,
			draft: null,
			mode: VISUAL_MODE,
			code: null,
			requestStatus: null,
			requestError: null
		}

		// register plugins from dynamic registry items
		Common.Registry.getItems(items => {
			items.forEach(i => {
				if (i.plugins) plugins.push(i.plugins)
			})
		})

		// Make Slate nodes generate with UUIDs
		KeyUtils.setGenerator(generateId)

		// === SET UP DATA STORES ===
		this.onEditorStoreChange = () => this.setState({ editorState: EditorStore.getState() })
		this.onModalStoreChange = () => this.setState({ modalState: ModalStore.getState() })
		EditorStore.onChange(this.onEditorStoreChange)
		ModalStore.onChange(this.onModalStoreChange)

		this.switchMode = this.switchMode.bind(this)
		this.renewLockInterval = null
	}


	getVisualEditorState(draftId, draftModel) {
		const json = JSON.parse(draftModel)
		const obomodel = OboModel.create(json)
		EditorStore.init(
			obomodel,
			json.content.start,
			this.props.settings,
			window.location.pathname,
			this.state.mode
		)

		return {
			modalState: ModalStore.getState(),
			editorState: EditorStore.getState(),
			draftId,
			draft: json,
			model: obomodel,
			loading: false
		}
	}

	getCodeEditorState(draftId, draftModel) {
		const obomodel = OboModel.create({
			type: 'ObojoboDraft.Modules.Module',
			content: {
				title: EditorUtil.getTitleFromString(draftModel, this.state.mode)
			}
		})

		EditorStore.init(obomodel, null, this.props.settings, window.location.pathname, this.state.mode)

		return {
			modalState: ModalStore.getState(),
			editorState: EditorStore.getState(),
			code: draftModel,
			draftId,
			draft: draftModel,
			model: obomodel,
			loading: false
		}
	}

	switchMode(mode) {
		this.setState({ mode, loading: true })
		this.reloadDraft(this.state.draftId, mode)
	}

	displayLockedModal() {
		this.setState({
			requestStatus: 'invalid',
			requestError: {
				title: 'Module is Being Edited.',
				message: 'Someone else is currently editing this module, please try again later.'
			}
		})
	}

	startRenewEditLockInterval(draftId) {
		return this.createEditLock(draftId)
			.then(() => {
				this.renewLockInterval = setInterval(() => {
					this.createEditLock(this.state.draftId).catch(() => {
						this.displayLockedModal()
					})
				}, RENEW_LOCK_INTERVAL)
			})
			.catch(() => {
				this.displayLockedModal()
			})
	}

	createEditLock(draftId) {
		return APIUtil.requestEditLock(draftId).then(json => {
			if (json.status === 'error') throw new Error('Unable to lock module.')
		})
	}

	reloadDraft(draftId, mode) {
		return APIUtil.getFullDraft(draftId, mode === VISUAL_MODE ? 'json' : mode)
			.then(response => {
				let json
				switch (mode) {
					case XML_MODE:
						// Calling getFullDraft with xml will return plain text xml
						return response
					default:
						json = JSON.parse(response)
						if (json.status === 'error') throw json.value

						return JSON.stringify(json.value, null, 4)
				}
			})
			.then(draftModel => {
				switch (mode) {
					case VISUAL_MODE:
						return this.setState({ ...this.getVisualEditorState(draftId, draftModel), mode })
					default:
						return this.setState({ ...this.getCodeEditorState(draftId, draftModel), mode })
				}
			})
			.catch(err => {
				// eslint-disable-next-line no-console
				console.error(err)
				return this.setState({ requestStatus: 'invalid', requestError: err, mode })
			})
	}

	componentDidMount() {
		const urlTokens = document.location.pathname.split('/')

		// get draftID from location
		const draftId = urlTokens[3] ? urlTokens[3] : null

		// get the mode from the location
		let mode = urlTokens[2] || VISUAL_MODE // default to visual
		if (mode === 'classic') mode = XML_MODE // convert classic to xml

		ModalStore.init()

		return this.startRenewEditLockInterval(draftId)
			.then(() => {
				enableWindowCloseDispatcher()
				Dispatcher.on('window:closeNow', this.onWindowInactive.bind(this))
				Dispatcher.on('window:inactive', this.onWindowInactive.bind(this))
				Dispatcher.on('window:returnFromInactive', this.onWindowReturnFromInactive.bind(this))
				return this.reloadDraft(draftId, this.state.mode)
			})
	}

	onWindowInactive(event){
		// delete my lock
		navigator.sendBeacon(`/api/locks/${this.state.draftId}/delete`)
		clearInterval(this.renewLockInterval)
		this.renewLockInterval = null
	}

	onWindowReturnFromInactive(event){
		this.startRenewEditLockInterval(this.state.draftId)
	}

	componentWillUnmount() {
		EditorStore.offChange(this.onEditorStoreChange)
		ModalStore.offChange(this.onModalStoreChange)
	}

	renderCodeEditor() {
		return (
			<CodeEditor
				initialCode={this.state.code}
				model={this.state.model}
				draftId={this.state.draftId}
				mode={this.state.mode}
				switchMode={this.switchMode}
				insertableItems={Common.Registry.insertableItems}
			/>
		)
	}

	renderVisualEditor() {
		return (
			<PageEditor
				page={this.state.editorState.currentPageModel}
				navState={this.state.editorState}
				context={this.state.editorState.context}
				model={this.state.model}
				draft={this.state.draft}
				draftId={this.state.draftId}
				switchMode={this.switchMode}
				insertableItems={Common.Registry.insertableItems}
			/>
		)
	}

	render() {
		if (this.state.requestStatus === 'invalid') {
			return (
				<div className="viewer--viewer-app--visit-error">
					<h1>{this.state.requestError.title || 'Error'}</h1>
					{this.state.requestError.type ? <h2>{this.state.requestError.type}</h2> : null}
					<div>{this.state.requestError.message}</div>
				</div>
			)
		}

		if (this.state.loading) return <p>Loading</p>

		const modalItem = ModalUtil.getCurrentModal(this.state.modalState)
		return (
			<div className="visual-editor--editor-app">
				<ObojoboIdleTimer timeout={IDLE_TIMEOUT_DURATION_MS}/>
				{this.state.mode === VISUAL_MODE ? this.renderVisualEditor() : this.renderCodeEditor()}
				{modalItem && modalItem.component ? (
					<ModalContainer>{modalItem.component}</ModalContainer>
				) : null}
			</div>
		)
	}
}

export default EditorApp
