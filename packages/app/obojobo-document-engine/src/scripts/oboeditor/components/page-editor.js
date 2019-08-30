import './page-editor.scss'

import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'
import ActionButton from 'obojobo-chunks-action-button/editor'
import AlignMarks from './marks/align-marks'
import Assessment from 'obojobo-sections-assessment/editor'
import BasicMarks from './marks/basic-marks'
import Break from 'obojobo-chunks-break/editor'
import ClipboardPlugin from '../plugins/clipboard-plugin'
import Code from 'obojobo-chunks-code/editor'
import Common from 'obojobo-document-engine/src/scripts/common'
import Component from './node/editor'
import ContentToolbar from './toolbars/content-toolbar'
import { Editor } from 'slate-react'
import EditorSchema from '../plugins/editor-schema'
import EditorStore from '../stores/editor-store'
import Figure from 'obojobo-chunks-figure/editor'
import FileToolbar from './toolbars/file-toolbar'
import HTML from 'obojobo-chunks-html/editor'
import Heading from 'obojobo-chunks-heading/editor'
import IFrame from 'obojobo-chunks-iframe/editor'
import IndentMarks from './marks/indent-marks'
import LinkMark from './marks/link-mark'
import List from 'obojobo-chunks-list/editor'
import MCAnswer from 'obojobo-chunks-multiple-choice-assessment/MCAnswer/editor'
import MCAssessment from 'obojobo-chunks-multiple-choice-assessment/editor'
import MCChoice from 'obojobo-chunks-multiple-choice-assessment/MCChoice/editor'
import MCFeedback from 'obojobo-chunks-multiple-choice-assessment/MCFeedback/editor'
import MathEquation from 'obojobo-chunks-math-equation/editor'
import Page from 'obojobo-pages-page/editor'
import Question from 'obojobo-chunks-question/editor'
import QuestionBank from 'obojobo-chunks-question-bank/editor'
import React from 'react'
import Rubric from 'obojobo-sections-assessment/components/rubric/editor'
import ScoreActions from 'obojobo-sections-assessment/post-assessment/editor-component'
import ScriptMarks from './marks/script-marks'
import SelectParameter from './parameter-node/select-parameter'
import Table from 'obojobo-chunks-table/editor'
import Text from 'obojobo-chunks-text/editor'
import TextParameter from './parameter-node/text-parameter'
import ToggleParameter from './parameter-node/toggle-parameter'
import { Value } from 'slate'
import YouTube from 'obojobo-chunks-youtube/editor'

const { ModalUtil } = Common.util

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

const plugins = [
	Component.plugins,
	BasicMarks.plugins,
	LinkMark.plugins,
	ScriptMarks.plugins,
	AlignMarks.plugins,
	IndentMarks.plugins,
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

		this.saveModule = this.saveModule.bind(this)
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
			<div className={'component obojobo-draft--modules--module editor--page-editor'} role="main">
				<div className="draft-toolbars">
					<div className="draft-title">{this.props.model.title}</div>
					<FileToolbar
						getEditor={this.getEditor.bind(this)}
						model={this.props.model}
						draftId={this.props.draftId}
						onSave={this.saveModule}
					/>
					<ContentToolbar getEditor={this.getEditor.bind(this)} />
				</div>
				<Editor
					className={'component obojobo-draft--pages--page'}
					value={this.state.value}
					ref={this.ref.bind(this)}
					onChange={change => this.onChange(change)}
					plugins={plugins}
				/>
			</div>
		)
	}

	getEditor() {
		return this.editor
	}

	onChange(change) {
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

	saveModule(draftId) {
		this.exportToJSON(this.props.page, this.state.value)
		const json = this.props.model.flatJSON()
		json.content.start = EditorStore.state.startingId

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

		return APIUtil.postDraft(draftId, JSON.stringify(json))
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
}

export default PageEditor
