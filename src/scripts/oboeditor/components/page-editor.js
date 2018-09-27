/* eslint no-alert: 0 */

import React from 'react'

import { Value } from 'slate'
import { Editor } from 'slate-react'
import APIUtil from '../../viewer/util/api-util'

import ActionButton from '../../../../ObojoboDraft/Chunks/ActionButton/editor'
import Break from '../../../../ObojoboDraft/Chunks/Break/editor'
import Code from '../../../../ObojoboDraft/Chunks/Code/editor'
import Figure from '../../../../ObojoboDraft/Chunks/Figure/editor'
import Heading from '../../../../ObojoboDraft/Chunks/Heading/editor'
import HTML from '../../../../ObojoboDraft/Chunks/HTML/editor'
import IFrame from '../../../../ObojoboDraft/Chunks/IFrame/editor'
import List from '../../../../ObojoboDraft/Chunks/List/editor'
import MathEquation from '../../../../ObojoboDraft/Chunks/MathEquation/editor'
import Table from '../../../../ObojoboDraft/Chunks/Table/editor'
import Text from '../../../../ObojoboDraft/Chunks/Text/editor'
import YouTube from '../../../../ObojoboDraft/Chunks/YouTube/editor'
import QuestionBank from '../../../../ObojoboDraft/Chunks/QuestionBank/editor'
import Question from '../../../../ObojoboDraft/Chunks/Question/editor'
import MCAssessment from '../../../../ObojoboDraft/Chunks/MCAssessment/editor'
import MCChoice from '../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/editor'
import MCAnswer from '../../../../ObojoboDraft/Chunks/MCAssessment/MCAnswer/editor'
import MCFeedback from '../../../../ObojoboDraft/Chunks/MCAssessment/MCFeedback/editor'
import Page from '../../../../ObojoboDraft/Pages/Page/editor'
import Assessment from '../../../../ObojoboDraft/Sections/Assessment/editor'
import ScoreActions from '../../../../ObojoboDraft/Sections/Assessment/post-assessment/editor'
import Rubric from '../../../../ObojoboDraft/Sections/Assessment/components/rubric/editor'
import DefaultNode from './default-node'
import ParameterNode from './parameter-node'
import MarkToolbar from './toolbar'

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

const nodes = {
	'ObojoboDraft.Chunks.ActionButton': ActionButton,
	'ObojoboDraft.Chunks.Break': Break,
	'ObojoboDraft.Chunks.Code': Code,
	'ObojoboDraft.Chunks.Figure': Figure,
	'ObojoboDraft.Chunks.Heading': Heading,
	'ObojoboDraft.Chunks.HTML': HTML,
	'ObojoboDraft.Chunks.IFrame': IFrame,
	'ObojoboDraft.Chunks.List': List,
	'ObojoboDraft.Chunks.MathEquation': MathEquation,
	'ObojoboDraft.Chunks.Table': Table,
	'ObojoboDraft.Chunks.Text': Text,
	'ObojoboDraft.Chunks.YouTube': YouTube,
	'ObojoboDraft.Chunks.QuestionBank': QuestionBank,
	'ObojoboDraft.Chunks.Question': Question,
	'ObojoboDraft.Chunks.MCAssessment': MCAssessment,
	'ObojoboDraft.Chunks.MCAssessment.MCChoice': MCChoice,
	'ObojoboDraft.Chunks.MCAssessment.MCAnswer': MCAnswer,
	'ObojoboDraft.Chunks.MCAssessment.MCFeedback': MCFeedback,
	'ObojoboDraft.Pages.Page': Page
}

const dontInsert = [
	'ObojoboDraft.Chunks.HTML',
	'ObojoboDraft.Chunks.MCAssessment',
	'ObojoboDraft.Chunks.MCAssessment.MCChoice',
	'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
	'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
	'ObojoboDraft.Pages.Page'
]

const plugins = [
	...MarkToolbar.plugins,
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
	Assessment.plugins
]

class PageEditor extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			value: Value.fromJSON(this.importFromJSON())
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

	render() {
		if (this.props.page === null) return this.renderEmpty()
		const MarkToolBarNode = MarkToolbar.components.Node

		return (
			<div className={'editor'}>
				<div className={'toolbar'}>
					<MarkToolBarNode value={this.state.value} onChange={change => this.onChange(change)} />
					<div className={'dropdown'}>
						<button>+ Insert Node</button>
						<div className={'drop-content'}>
							{Object.entries(nodes).map(item => {
								return this.buildButton(item)
							})}
						</div>
					</div>
				</div>
				<Editor
					className={'component obojobo-draft--pages--page'}
					placeholder="Obojobo Visual Editor"
					value={this.state.value}
					onChange={change => this.onChange(change)}
					plugins={plugins}
				/>
				{this.renderExportButton()}
			</div>
		)
	}

	onChange({ value }) {
		this.setState({ value })
	}

	insertBlock(block) {
		const { value } = this.state
		const change = value.change()

		block.helpers.insertNode(change)

		this.onChange(change)
	}

	buildButton(item) {
		if (dontInsert.includes(item[0])) return null
		return (
			<button key={item[0]} onClick={() => this.insertBlock(item[1])}>
				{item[0]}
			</button>
		)
	}

	exportToJSON(page, value) {
		if (page.get('type') === ASSESSMENT_NODE) {
			const json = Assessment.helpers.slateToObo(value.document.nodes.get(0))
			page.set('children', json.children)
			page.set('content', json.content)
			return json
		} else {
			// Build page wrapper
			const json = {}
			json.children = []

			value.document.nodes.forEach(child => {
				if (nodes.hasOwnProperty(child.type)) {
					// If the current Node is a registered OboNode, use its custom converter
					json.children.push(nodes[child.type].helpers.slateToObo(child))
				} else {
					json.children.push(DefaultNode.helpers.slateToObo(child))
				}
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
				// If the current Node is a registered OboNode, use its custom converter
				if (nodes.hasOwnProperty(child.type)) {
					json.document.nodes.push(nodes[child.type].helpers.oboToSlate(child))
				} else {
					json.document.nodes.push(DefaultNode.helpers.oboToSlate(child))
				}
			})
		}

		return json
	}

	renderExportButton() {
		return (
			<button className={'exporter'} onClick={() => this.saveDraft()}>
				{'Save Document'}
			</button>
		)
	}

	saveDraft() {
		this.exportToJSON(this.props.page, this.state.value)
		const json = this.props.model.flatJSON()

		// deal with content
		this.props.model.children.forEach(child => {
			let contentJSON = {}

			if (child.get('type') === CONTENT_NODE) {
				contentJSON = child.flatJSON()

				for (const item of Array.from(child.children.models)) {
					contentJSON.children.push({
						id: item.get('id'),
						type: item.get('type'),
						content: item.get('content'),
						children: item.get('children')
					})
				}
			} else if (child.get('type') === ASSESSMENT_NODE) {
				contentJSON.id = child.get('id')
				contentJSON.type = child.get('type')
				contentJSON.children = child.get('children')
				contentJSON.content = child.get('content')
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
