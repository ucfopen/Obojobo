import './page-editor.scss'

import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'
import ActionButton from 'obojobo-chunks-action-button/editor'
import Assessment from 'obojobo-sections-assessment/editor'
import Break from 'obojobo-chunks-break/editor'
import ClipboardPlugin from '../plugins/clipboard-plugin'
import Code from 'obojobo-chunks-code/editor'
import Common from 'obojobo-document-engine/src/scripts/common'
import Component from './node/editor'
import { Editor } from 'slate-react'
import EditorSchema from '../plugins/editor-schema'
import EditorStore from '../stores/editor-store'
import Figure from 'obojobo-chunks-figure/editor'
import HTML from 'obojobo-chunks-html/editor'
import Heading from 'obojobo-chunks-heading/editor'
import IFrame from 'obojobo-chunks-iframe/editor'
import List from 'obojobo-chunks-list/editor'
import MCAnswer from 'obojobo-chunks-multiple-choice-assessment/MCAnswer/editor'
import MCAssessment from 'obojobo-chunks-multiple-choice-assessment/editor'
import MCChoice from 'obojobo-chunks-multiple-choice-assessment/MCChoice/editor'
import MCFeedback from 'obojobo-chunks-multiple-choice-assessment/MCFeedback/editor'
import MarkToolbar from './toolbar'
import MathEquation from 'obojobo-chunks-math-equation/editor'
import NumericAssessment from 'obojobo-chunks-numeric-assessment/editor'
import NumericFeedback from 'obojobo-chunks-numeric-assessment/NumericFeedback/editor'
import Page from 'obojobo-pages-page/editor'
import Question from 'obojobo-chunks-question/editor'
import QuestionBank from 'obojobo-chunks-question-bank/editor'
import React from 'react'
import Rubric from 'obojobo-sections-assessment/components/rubric/editor'
import ScoreActions from 'obojobo-sections-assessment/post-assessment/editor-component'
import SelectParameter from './parameter-node/select-parameter'
import Table from 'obojobo-chunks-table/editor'
import Text from 'obojobo-chunks-text/editor'
import TextParameter from './parameter-node/text-parameter'
import ToggleParameter from './parameter-node/toggle-parameter'
import { Value } from 'slate'
import YouTube from 'obojobo-chunks-youtube/editor'

const { SimpleDialog } = Common.components.modal
const { ModalUtil } = Common.util
const { Button } = Common.components

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

const plugins = [
	Component.plugins,
	MarkToolbar.plugins,
	ActionButton.plugins,
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
	NumericAssessment.plugins,
	NumericFeedback.plugins,
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

class PageEditor extends React.Component {
	constructor(props) {
		super(props)
		const json = this.importFromJSON()

		this.state = {
			value: Value.fromJSON(json)
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// Deal with deleted page
		if (!this.props.page) {
			return
		}
		if (!prevProps.page) {
			this.setState({ value: Value.fromJSON(this.importFromJSON()) })
			return
		}

		// Save changes when switching pages
		if (prevProps.page.id !== this.props.page.id) {
			this.exportToJSON(prevProps.page, prevState.value)
			this.setState({ value: Value.fromJSON(this.importFromJSON()) })
		}
	}

	renderEmpty() {
		return <p>No content available, click on a page to start editing</p>
	}

	ref(editor) {
		this.editor = editor
	}

	render() {
		if (this.props.page === null) return this.renderEmpty()

		return (
			<div className={'editor--page-editor'}>
				<div className={'toolbar'}>
					<MarkToolbar.components.Node getEditor={this.getEditor.bind(this)} />
				</div>
				<Editor
					className={'component obojobo-draft--pages--page'}
					value={this.state.value}
					ref={this.ref.bind(this)}
					onChange={change => this.onChange(change)}
					plugins={plugins}
				/>
				{this.renderExportButton()}
			</div>
		)
	}

	getEditor() {
		return this.editor
	}

	onChange(change) {
		// Check if any nodes have been changed
		const nodesChanged = change.operations
			.toJSON()
			.some(
				operation =>
					operation.type === 'set_node' ||
					operation.type === 'insert_node' ||
					operation.type === 'add_mark' ||
					operation.type === 'set_mark'
			)

		if (nodesChanged) {
			// Hacky solution: editor changes need an uninterrupted React render cycle
			// Calling ModalUtil.hide right after Modals are finished interrupts this asyncronously
			// This hack only works because Modals are not directly a part of the Slate Editor
			ModalUtil.hide()
		}

		this.setState({ value: change.value })
	}

	exportToJSON(page, value) {
		if (page.get('type') === ASSESSMENT_NODE) {
			const json = Common.Registry.getItemForType(ASSESSMENT_NODE).slateToObo(
				value.document.nodes.get(0)
			)
			page.set('children', json.children)
			page.set('content', json.content)

			return json
		} else {
			// Build page wrapper
			const json = {}
			json.children = []

			value.document.nodes.forEach(child => {
				const oboChild = Component.helpers.slateToObo(child)
				json.children.push(oboChild)
			})

			page.set('children', json.children)

			return json
		}
	}

	importFromJSON() {
		const { page } = this.props

		const json = { document: { nodes: [] } }

		if (page.get('type') === ASSESSMENT_NODE) {
			json.document.nodes.push(Assessment.helpers.oboToSlate(page))
		} else {
			page.attributes.children.forEach(child => {
				json.document.nodes.push(Component.helpers.oboToSlate(child))
			})
		}

		return json
	}

	renderExportButton() {
		return (
			<div className="footer-menu">
				<Button className={'exporter'} onClick={() => this.saveDraft(EditorStore.state.startingId)}>
					{'Save Document'}
				</Button>
			</div>
		)
	}

	saveDraft(startPage = null) {
		this.exportToJSON(this.props.page, this.state.value)
		const json = this.props.model.flatJSON()
		json.content.start = startPage

		// deal with content
		this.props.model.children.forEach(child => {
			let contentJSON = {}

			switch (child.get('type')) {
				case CONTENT_NODE:
					contentJSON = child.flatJSON()

					for (const item of Array.from(child.children.models)) {
						contentJSON.children.push({
							id: item.get('id'),
							type: item.get('type'),
							content: item.get('content'),
							children: item.get('children')
						})
					}
					break

				case ASSESSMENT_NODE:
					contentJSON.id = child.get('id')
					contentJSON.type = child.get('type')
					contentJSON.children = child.get('children')
					contentJSON.content = child.get('content')
					break
			}

			json.children.push(contentJSON)
		})

		APIUtil.postDraft(this.props.draftId, json)
			.then(result => {
				const title =
					result.status === 'ok' ? 'Successfully saved draft' : 'Error: ' + result.value.message
				ModalUtil.show(<SimpleDialog ok title={title} />)
			})
			.catch(error => {
				// eslint-disable-next-line no-console
				console.error(error)
				ModalUtil.show(<SimpleDialog ok title={'Unkown error saving draft'} />)
			})
	}
}

export default PageEditor
