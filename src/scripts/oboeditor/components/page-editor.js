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
import ScoreActions from '../../../../ObojoboDraft/Sections/Assessment/post-assessment/editor'
import Rubric from '../../../../ObojoboDraft/Sections/Assessment/components/rubric/editor'
import DefaultNode from './default-node'
import basicMark from '../marks/basic-mark'
import ParameterNode from './parameter-node'

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'

const BOLD_MARK = 'b'
const ITALIC_MARK = 'i'
const STRIKE_MARK = 'del'
const QUOTE_MARK = 'q'

const SUPERSCRIPT_MARK = 'sup'
const LATEX_MARK = '_latex'
const LINK_MARK = 'a'

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
	basicMark({ type: BOLD_MARK, key: 'b' }),
	basicMark({ type: ITALIC_MARK, key: 'i' }),
	basicMark({ type: STRIKE_MARK, key: 's' }),
	basicMark({ type: LINK_MARK, key: 'k' }),
	basicMark({ type: QUOTE_MARK, key: 'm' }),
	basicMark({ type: SUPERSCRIPT_MARK, key: 'n' }),
	basicMark({ type: LATEX_MARK, key: 'l' }),
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
	ParameterNode.plugins
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

		return (
			<div className={'editor'}>
				<div className={'dropdown'}>
					<button>+ Insert Node</button>
					<div className={'drop-content'}>
						{Object.entries(nodes).map(item => {
							return this.buildButton(item)
						})}
					</div>
				</div>
				<Editor
					className={'component obojobo-draft--pages--page'}
					placeholder="Obojobo Visual Editor"
					value={this.state.value}
					onChange={change => this.onChange(change)}
					renderMark={props => this.renderMark(props)}
					plugins={plugins}
				/>
				{this.renderExportButton()}
			</div>
		)
	}

	onChange({ value }) {
		this.setState({ value })
	}

	renderMark(props) {
		switch (props.mark.type) {
			case BOLD_MARK:
				return <strong>{props.children}</strong>
			case ITALIC_MARK:
				return <em>{props.children}</em>
			case STRIKE_MARK:
				return <del>{props.children}</del>
			case QUOTE_MARK:
				return <q>{props.children}</q>
			case LINK_MARK:
				return <a href="www.myucf.edu">{props.children}</a>
		}
	}

	insertBlock(item) {
		const { value } = this.state
		const change = value.change()

		item[1].helpers.insertNode(change)

		this.onChange(change)
	}

	buildButton(item) {
		if (dontInsert.includes(item[0])) return null
		return (
			<button key={item[0]} onClick={() => this.insertBlock(item)}>
				{item[0]}
			</button>
		)
	}

	exportToJSON(page, value) {
		// Build page wrapper
		const json = {}
		json.children = []

		json.content = page.get('content')

		value.document.nodes.forEach(child => {
			if (child.type === ACTIONS_NODE) {
				json.content.scoreActions = ScoreActions.helpers.slateToObo(child)
			} else if (child.type === RUBRIC_NODE) {
				json.content.rubric = Rubric.helpers.slateToObo(child)
			} else if (nodes.hasOwnProperty(child.type)) {
				// If the current Node is a registered OboNode, use its custom converter
				json.children.push(nodes[child.type].helpers.slateToObo(child))
			} else {
				json.children.push(DefaultNode.helpers.slateToObo(child))
			}
		})

		page.set('children', json.children)
		page.set('content', json.content)
		return json
	}

	importFromJSON() {
		const { page } = this.props

		const json = { document: { nodes: [] } }

		page.attributes.children.forEach(child => {
			// If the current Node is a registered OboNode, use its custom converter
			if (nodes.hasOwnProperty(child.type)) {
				json.document.nodes.push(nodes[child.type].helpers.oboToSlate(child))
			} else {
				json.document.nodes.push(DefaultNode.helpers.oboToSlate(child))
			}
		})

		const content = page.get('content')
		if (page.get('type') === ASSESSMENT_NODE) {
			json.document.nodes.push(ScoreActions.helpers.oboToSlate(content.scoreActions))
			if (content.rubric) json.document.nodes.push(Rubric.helpers.oboToSlate(content.rubric))
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
				(contentJSON.id = child.get('id')),
					(contentJSON.type = child.get('type')),
					(contentJSON.children = child.get('children'))
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
