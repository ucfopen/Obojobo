import '../../../scss/main.scss'
// uses viewer css for styling
import '../../viewer/components/viewer-app.scss'
import 'obojobo-modules-module/viewer-component.scss'

import APIUtil from '../../viewer/util/api-util'
import Common from '../../common'
import EditorNav from './editor-nav'
import EditorStore from '../stores/editor-store'
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
import MarkToolbar from './toolbar'

// Modular plugins
import Assessment from 'obojobo-sections-assessment/editor'
import Break from 'obojobo-chunks-break/editor'
import Code from 'obojobo-chunks-code/editor'
import Figure from 'obojobo-chunks-figure/editor'
import HTML from 'obojobo-chunks-html/editor'
import Heading from 'obojobo-chunks-heading/editor'
import IFrame from 'obojobo-chunks-iframe/editor'
import List from 'obojobo-chunks-list/editor'
import MCAnswer from 'obojobo-chunks-multiple-choice-assessment/MCAnswer/editor'
import MCAssessment from 'obojobo-chunks-multiple-choice-assessment/editor'
import MCChoice from 'obojobo-chunks-multiple-choice-assessment/MCChoice/editor'
import MCFeedback from 'obojobo-chunks-multiple-choice-assessment/MCFeedback/editor'
import MathEquation from 'obojobo-chunks-math-equation/editor'
import Page from 'obojobo-pages-page/editor'
import Question from 'obojobo-chunks-question/editor'
import QuestionBank from 'obojobo-chunks-question-bank/editor'
import Rubric from 'obojobo-sections-assessment/components/rubric/editor'
import Table from 'obojobo-chunks-table/editor'
import Text from 'obojobo-chunks-text/editor'
import YouTube from 'obojobo-chunks-youtube/editor'
import ScoreActions from 'obojobo-sections-assessment/post-assessment/editor-component'

const { ModalContainer } = Common.components
const { ModalUtil } = Common.util
const { ModalStore } = Common.stores
const { OboModel } = Common.models


let plugins = [
	Component.plugins,
	MarkToolbar.plugins,
	Break.plugins,
	Code.plugins,
	Figure.plugins,
	Heading.plugins,
	IFrame.plugins,
	List.plugins,
	MathEquation.plugins,
	Table.plugins,
	Text.plugins,
	YouTube.plugins,
	QuestionBank.plugins,
	Question.plugins,
	MCAssessment.plugins,
	MCChoice.plugins,
	MCAnswer.plugins,
	MCFeedback.plugins,
	HTML.plugins,
	ScoreActions.plugins,
	Page.plugins,
	Rubric.plugins,
	ToggleParameter.plugins,
	SelectParameter.plugins,
	TextParameter.plugins,
	Assessment.plugins,
	EditorSchema,
	ClipboardPlugin
]

const registerNodes = () => {
	const pluginsFromModules = [...require('obojobo-chunks-action-button').obojobo.editorScripts]

	pluginsFromModules.forEach(p => {
		// register the node
		Common.Registry.registerModel(p.name, {
			name: p.menuLabel,
			icon: p.icon,
			isInsertable: p.isInsertable,
			insertJSON: p.json.emptyNode,
			slateToObo: p.helpers.slateToObo,
			oboToSlate: p.helpers.oboToSlate,
			plugins: p.plugins
		})

		// register plugins
		// @TODO - this could happen inside registerModel
		// and later be extracted directly by PageEditor?
		plugins.push(p.plugins)
	})
}

registerNodes()


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
			draft: null
		}

		// Make Slate nodes generate with UUIDs
		KeyUtils.setGenerator(generateId)

		this.onEditorStoreChange = () => this.setState({ editorState: EditorStore.getState() })
		this.onModalStoreChange = () => this.setState({ modalState: ModalStore.getState() })

		// === SET UP DATA STORES ===
		EditorStore.onChange(this.onEditorStoreChange)
		ModalStore.onChange(this.onModalStoreChange)
	}

	componentDidMount() {
		const urlTokens = document.location.pathname.split('/')
		const draftId = urlTokens[2] ? urlTokens[2] : null

		return APIUtil.getFullDraft(draftId)
			.then(response => {
				ModalStore.init()

				if (response.status === 'error') throw response.value
				return response
			})
			.then(({ value: draftModel }) => {
				const obomodel = OboModel.create(draftModel)
				EditorStore.init(
					obomodel,
					draftModel.content.start,
					this.props.settings,
					window.location.pathname
				)

				return this.setState({
					modalState: ModalStore.getState(),
					editorState: EditorStore.getState(),
					draftId,
					draft: draftModel,
					model: obomodel,
					loading: false
				})
			})
			.catch(err => {
				// eslint-disable-next-line no-console
				console.error(err)
				return this.setState({ requestStatus: 'invalid', requestError: err })
			})
	}

	componentWillUnmount() {
		EditorStore.offChange(this.onEditorStoreChange)
		ModalStore.offChange(this.onModalStoreChange)
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
			<div
				className={
					'viewer--viewer-app editor--editor-app is-loaded is-unlocked-nav is-open-nav is-enabled-nav is-focus-state-inactive'
				}
			>
				<EditorNav
					navState={this.state.editorState}
					model={this.state.model}
					draftId={this.state.draftId}
				/>
				<div className={'component obojobo-draft--modules--module'} role="main" data-obo-component>
					<PageEditor
						page={this.state.editorState.currentPageModel}
						context={this.state.editorState.context}
						model={this.state.model}
						draft={this.state.draft}
						draftId={this.state.draftId}
						plugins={plugins}
					/>
				</div>
				{modalItem && modalItem.component ? (
					<ModalContainer>{modalItem.component}</ModalContainer>
				) : null}
			</div>
		)
	}
}

export default EditorApp
