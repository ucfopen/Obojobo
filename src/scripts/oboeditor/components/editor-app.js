import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'
import { setKeyGenerator } from 'slate'
import React from 'react'

import Common from 'Common'
import PageEditor from './page-editor'
import EditorNav from './editor-nav'

import APIUtil from '../../viewer/util/api-util'
import EditorStore from '../stores/editor-store'

import generateId from '../generate-ids'
import defaultPage from '../documents/default-page.json'

import Store from '../store'

import './editor-app.scss'

const { ModalContainer } = Common.components
const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util
const { OboModel } = Common.models

class EditorApp extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			model: null,
			editorState: null,
			modalState: null,
			navTargetId: null,
			loading: true,
			draftId: null
		}

		// Make Slate nodes generate with UUIDs
		setKeyGenerator(generateId)

		this.onEditorStoreChange = () => this.setState({ editorState: EditorStore.getState() })
	}

	componentDidMount() {
		let urlTokens = document.location.pathname.split('/')
		this.state.draftId = urlTokens[2] ? urlTokens[2] : null

		return APIUtil.getDraft(this.state.draftId)
		.then(({ value: draftModel }) => {
			this.state.model = OboModel.create(draftModel)

			EditorStore.init(
				this.state.model,
				this.state.model.modelState.start,
				window.location.pathname
			)

			this.state.editorState = EditorStore.getState()
			//this.state.modalState = ModalStore.getState()

			this.setState({ loading: false })
		})
	}

	componentWillMount() {
		// === SET UP DATA STORES ===
		EditorStore.onChange(this.onEditorStoreChange)
		//ModalStore.onChange(this.onModalStoreChange)
	}

	componentWillUnmount() {
		EditorStore.offChange(this.onEditorStoreChange)
		//ModalStore.offChange(this.onModalStoreChange)
	}

	render() {
		if(this.state.loading) return <p>Loading</p>
		return (
			<div className={'viewer--viewer-app is-loaded is-unlocked-nav is-open-nav is-enabled-nav is-focus-state-inactive'}>
				<EditorNav navState={this.state.editorState} model={this.state.model} />
				<div className={'component obojobo-draft--modules--module'}>
					<PageEditor page={this.state.editorState.currentModel} context={this.state.editorState.context} model={this.state.model} draftId={this.state.draftId}/>
				</div>
			</div>
		)
	}
}

export default EditorApp
