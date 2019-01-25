import { KeyUtils } from 'slate'
import React from 'react'

import Common from 'Common'
import PageEditor from './page-editor'
import EditorNav from './editor-nav'

import APIUtil from '../../viewer/util/api-util'
import EditorStore from '../stores/editor-store'

import generateId from '../generate-ids'

import '../../../scss/main.scss'
// uses viewer css for styling
import '../../../scripts/viewer/components/viewer-app.scss'
import '../../../../ObojoboDraft/Modules/Module/viewer-component.scss'

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
		KeyUtils.setGenerator(generateId)

		this.onEditorStoreChange = () => {
			this.setState({ editorState: EditorStore.getState() })
		}

		// === SET UP DATA STORES ===
		EditorStore.onChange(this.onEditorStoreChange)
	}

	componentDidMount() {
		const urlTokens = document.location.pathname.split('/')
		const draftId = urlTokens[2] ? urlTokens[2] : null

		return APIUtil.getDraft(draftId)
			.then(response => {
				if (response.status === 'error') throw response.value
				return response
			})
			.then(({ value: draftModel }) => {
				const obomodel = OboModel.create(draftModel)

				EditorStore.init(obomodel, obomodel.modelState.start, window.location.pathname)

				this.setState({
					editorState: EditorStore.getState(),
					draftId,
					model: obomodel,
					loading: false
				})
			})
			.catch(err => {
				// eslint-disable-next-line
				console.log(err)
				this.setState({ requestStatus: 'invalid', requestError: err })
			})
	}

	componentWillUnmount() {
		EditorStore.offChange(this.onEditorStoreChange)
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
		return (
			<div
				className={
					'viewer--viewer-app is-loaded is-unlocked-nav is-open-nav is-enabled-nav is-focus-state-inactive'
				}
			>
				<EditorNav
					navState={this.state.editorState}
					model={this.state.model}
					draftId={this.state.draftId}
				/>
				<div className={'component obojobo-draft--modules--module'}>
					<PageEditor
						page={this.state.editorState.currentModel}
						context={this.state.editorState.context}
						model={this.state.model}
						draftId={this.state.draftId}
					/>
				</div>
			</div>
		)
	}
}

export default EditorApp
