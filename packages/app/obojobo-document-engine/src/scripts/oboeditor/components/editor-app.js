import '../../../scss/main.scss'
// uses viewer css for styling
import '../../../scripts/viewer/components/viewer-app.scss'
import 'obojobo-modules-module/viewer-component.scss'
import './editor-app.scss'

import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'
import Common from 'obojobo-document-engine/src/scripts/common'
import CodeEditor from './code-editor'
import EditorStore from '../stores/editor-store'
import EditorUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/editor-util'
import { KeyUtils } from 'slate'
import PageEditor from './page-editor'
import React from 'react'
import generateId from '../generate-ids'

const { ModalContainer } = Common.components
const { ModalUtil } = Common.util
const { ModalStore } = Common.stores
const { OboModel } = Common.models

const XML_MODE = 'xml'
const JSON_MODE = 'json'
const VISUAL_MODE = 'visual'

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
			code: null
		}

		// Make Slate nodes generate with UUIDs
		KeyUtils.setGenerator(generateId)

		this.onEditorStoreChange = () => this.setState({ editorState: EditorStore.getState() })
		this.onModalStoreChange = () => this.setState({ modalState: ModalStore.getState() })

		// === SET UP DATA STORES ===
		EditorStore.onChange(this.onEditorStoreChange)
		ModalStore.onChange(this.onModalStoreChange)

		this.switchMode = this.switchMode.bind(this)
	}

	getVisualEditorState(draftId, draftModel) {
		const json = JSON.parse(draftModel)
		const obomodel = OboModel.create(json)
		EditorStore.init(
			obomodel,
			json.content.start,
			this.props.settings,
			window.location.pathname
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
			type: "ObojoboDraft.Modules.Module",
			content: {
				title: EditorUtil.getTitleFromString(draftModel, this.state.mode)
			}
		})

		EditorStore.init(
			obomodel,
			null,
			this.props.settings,
			window.location.pathname
		)

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

	reloadDraft(draftId, mode) {
		return APIUtil.getFullDraft(draftId, mode === VISUAL_MODE ? JSON_MODE : mode)
			.then(response => {
				let json
				switch(mode) {
					case XML_MODE:
						// Calling getFullDraft with xml will return plain text xml
						return response
					default:
						json = JSON.parse(response)
						if(json.status === 'error') throw json.value

						return JSON.stringify(json.value, null, 4)
				}
			}) 
			.then(draftModel => {
				switch(mode) {
					case VISUAL_MODE:
						return this.setState(this.getVisualEditorState(draftId, draftModel))
					default:
						return this.setState(this.getCodeEditorState(draftId, draftModel))
				}
			})
			.catch(err => {
				// eslint-disable-next-line no-console
				console.error(err)
				return this.setState({ requestStatus: 'invalid', requestError: err })
			})
	}

	componentDidMount() {
		const urlTokens = document.location.pathname.split('/')
		const draftId = urlTokens[2] ? urlTokens[2] : null
		ModalStore.init()

		return this.reloadDraft(draftId, this.state.mode)
	}

	componentWillUnmount() {
		EditorStore.offChange(this.onEditorStoreChange)
		ModalStore.offChange(this.onModalStoreChange)
	}

	renderCodeEditor() {
		return <CodeEditor 
			initialCode={this.state.code} 
			model={this.state.model} 
			draftId={this.state.draftId}
			mode={this.state.mode} 
			switchMode={this.switchMode}/>
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
				{this.state.mode === VISUAL_MODE ?
				this.renderVisualEditor() :
				this.renderCodeEditor()}
				
				{modalItem && modalItem.component ? (
					<ModalContainer>{modalItem.component}</ModalContainer>
				) : null}
			</div>
		)
	}
}

export default EditorApp
