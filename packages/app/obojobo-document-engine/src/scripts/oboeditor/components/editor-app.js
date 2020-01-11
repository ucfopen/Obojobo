import '../../../scss/main.scss'
// uses viewer css for styling
import '../../viewer/components/viewer-app.scss'
import 'obojobo-modules-module/viewer-component.scss'
import './editor-app.scss'

import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'
import Common from '../../common'
import CodeEditor from './code-editor'
import EditorStore from '../stores/editor-store'
import EditorUtil from '../util/editor-util'
import { KeyUtils } from 'slate'
import PageEditor from './page-editor'
import React from 'react'
import generateId from '../generate-ids'

// PLUGINS
import ClipboardPlugin from '../plugins/clipboard-plugin'
import EditorSchema from '../plugins/editor-schema'
import Component from './node/editor'
import SelectParameter from './parameter-node/select-parameter'
import TextParameter from './parameter-node/text-parameter'
import ToggleParameter from './parameter-node/toggle-parameter'
import MarkToolbar from './toolbars/content-toolbar'

const { ModalContainer } = Common.components
const { ModalUtil } = Common.util
const { ModalStore } = Common.stores
const { OboModel } = Common.models

const XML_MODE = 'xml'
const JSON_MODE = 'json'
const VISUAL_MODE = 'visual'

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
			model: null, // Instance of OboModel
			draft: null, // raw xml string OR parsed json from server
			editorState: null,
			modalState: null,
			navTargetId: null,
			loading: true,
			draftId: null,
			mode: VISUAL_MODE
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
	}

	getEditorState(draftId, draftModelString, draftModelJSON){
		const obomodel = OboModel.create(draftModelJSON)
		const draft = this.state.mode === VISUAL_MODE ? draftModelJSON : draftModelString
		const startId = this.state.mode === VISUAL_MODE ? draftModelJSON.content.start : null

		EditorStore.init(
			obomodel,
			startId,
			this.props.settings,
			window.location.pathname,
			this.state.mode
		)

		return {
			modalState: ModalStore.getState(),
			editorState: EditorStore.getState(),
			draftId,
			draft,
			model: obomodel,
			loading: false
		}
	}

	switchMode(mode) {
		this.setState({ mode, loading: true })
		this.reloadDraft(this.state.draftId, mode)
	}

	reloadDraft(draftId, mode) {
		return APIUtil.getFullDraft(draftId, mode === VISUAL_MODE ? 'json' : mode)
			.then(response => {
				let draftModelString
				let draftModelJSON
				switch (mode) {
					case XML_MODE:
						// Calling getFullDraft with xml will return plain text xml
						// if we're using XML we need to recreate the top level OboNode
						// 1: shortcut to avoid converting xml response to json
						// 2: so various parts of the editor can look up the title from OboNode
						// 3: Obonode.getRoot() can become unreliable with multiple trees in use
						draftModelJSON = {
							id: draftId,
							type: 'ObojoboDraft.Modules.Module',
								content: {
									title: EditorUtil.getTitleFromString(response, mode)
								}
							}
						draftModelString = response
						break

					default:
						const json = JSON.parse(response)
						if (json.status === 'error') throw json.value

						draftModelJSON = json.value
						draftModelString = JSON.stringify(draftModelJSON, null, 4)
						break
				}

				this.setState({ ...this.getEditorState(draftId, draftModelString, draftModelJSON), mode })
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

		ModalStore.init()
		return this.reloadDraft(draftId, this.state.mode)
	}

	componentWillUnmount() {
		EditorStore.offChange(this.onEditorStoreChange)
		ModalStore.offChange(this.onModalStoreChange)
	}

	renderCodeEditor() {
		return (
			<CodeEditor
				initialCode={this.state.draft}
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
					<h1>Error</h1>
					<h2>{this.state.requestError.type}</h2>
					<div>{this.state.requestError.message}</div>
				</div>
			)
		}

		if (this.state.loading) return <p>Loading</p>

		const modalItem = ModalUtil.getCurrentModal(this.state.modalState)
		return (
			<div className="visual-editor--editor-app">
				{this.state.mode === VISUAL_MODE ? this.renderVisualEditor() : this.renderCodeEditor()}
				{modalItem && modalItem.component ? (
					<ModalContainer>{modalItem.component}</ModalContainer>
				) : null}
			</div>
		)
	}
}

export default EditorApp
