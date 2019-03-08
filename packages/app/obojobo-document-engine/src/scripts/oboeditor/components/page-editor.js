/* eslint no-alert: 0 */
import React from 'react'
import Common from 'Common'
import { Value } from 'slate'
import { Editor } from 'slate-react'
import APIUtil from '../../viewer/util/api-util'

import ActionButton from 'obojobo-chunks-action-button/editor'
import Break from 'obojobo-chunks-break/editor'
import Code from 'obojobo-chunks-code/editor'
import Figure from 'obojobo-chunks-figure/editor'
import Heading from 'obojobo-chunks-heading/editor'
import HTML from 'obojobo-chunks-html/editor'
import IFrame from 'obojobo-chunks-iframe/editor'
import List from 'obojobo-chunks-list/editor'
import MathEquation from 'obojobo-chunks-math-equation/editor'
import Table from 'obojobo-chunks-table/editor'
import Text from 'obojobo-chunks-text/editor'
import YouTube from 'obojobo-chunks-youtube/editor'
import QuestionBank from 'obojobo-chunks-question-bank/editor'
import Question from 'obojobo-chunks-question/editor'
import MCAssessment from 'obojobo-chunks-multiple-choice-assessment/editor'
import MCChoice from 'obojobo-chunks-multiple-choice-assessment/MCChoice/editor'
import MCAnswer from 'obojobo-chunks-multiple-choice-assessment/MCAnswer/editor'
import MCFeedback from 'obojobo-chunks-multiple-choice-assessment/MCFeedback/editor'
import Page from 'obojobo-pages-page/editor'
import Assessment from 'obojobo-sections-assessment/editor'
import ScoreActions from 'obojobo-sections-assessment/post-assessment/editor'
import Rubric from 'obojobo-sections-assessment/components/rubric/editor'
import ParameterNode from './parameter-node'
import Component from './node/editor'
import MarkToolbar from './toolbar'
import EditorSchema from '../plugins/editor-schema'

import './page-editor.scss'

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
	MCChoice.plugins,
	MCAnswer.plugins,
	MCFeedback.plugins,
	HTML.plugins,
	ScoreActions.plugins,
	Page.plugins,
	Rubric.plugins,
	ParameterNode.plugins,
	Assessment.plugins,
	EditorSchema
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

	onChange({ value }) {
		this.setState({ value })
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
				// wraps each node with oboeditor-component
				json.document.nodes.push(Component.helpers.oboToSlate(child))
			})
		}

		return json
	}

	renderExportButton() {
		return (
			<div className="footer-menu">
				<button className={'exporter'} onClick={() => this.saveDraft()}>
					{'Save Document'}
				</button>
			</div>
		)
	}

	saveDraft() {
		this.exportToJSON(this.props.page, this.state.value)
		const json = this.props.model.flatJSON()

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

		APIUtil.postDraft(this.props.draftId, json).then(result => {
			if (result.status === 'ok') {
				window.alert('Successfully saved draft')
			}
		})
	}
}

export default PageEditor
