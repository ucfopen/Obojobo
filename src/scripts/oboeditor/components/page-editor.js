import React from 'react'

import { Value, Schema } from 'slate'
import { Editor } from 'slate-react'
import initialValue from '../documents/value.json'

import ActionButton from '../../../../ObojoboDraft/Chunks/ActionButton/editor'
import Break from '../../../../ObojoboDraft/Chunks/Break/editor'
import Code from '../../../../ObojoboDraft/Chunks/Code/editor'
import Figure from '../../../../ObojoboDraft/Chunks/Figure/editor'
import Heading from '../../../../ObojoboDraft/Chunks/Heading/editor'
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
import DefaultNode from './default-node'
import BasicMark from '../marks/basic-mark'

const BUTTON_NODE = 'ObojoboDraft.Chunks.ActionButton'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'
const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const IFRAME_NODE = 'ObojoboDraft.Chunks.IFrame'
const LIST_NODE = 'ObojoboDraft.Chunks.List'
const MATH_NODE = 'ObojoboDraft.Chunks.MathEquation'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const MCANSWER_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const YOUTUBE_NODE = 'ObojoboDraft.Chunks.YouTube'

const PAGE_NODE = 'ObojoboDraft.Pages.Page'

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
	'ObojoboDraft.Pages.Page': Page,
}

const plugins = [
	BasicMark({ type: BOLD_MARK, key: 'b' }),
	BasicMark({ type: ITALIC_MARK, key: 'i' }),
	BasicMark({ type: STRIKE_MARK, key: 's' }),
	BasicMark({ type: LINK_MARK, key: 'k' }),
	BasicMark({ type: QUOTE_MARK, key: 'm' }),
	BasicMark({ type: SUPERSCRIPT_MARK, key: 'n' }),
	BasicMark({ type: LATEX_MARK, key: 'l' }),
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
	MCFeedback.plugins
]

class PageEditor extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			value: Value.fromJSON(this.importFromJSON()),
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// Deal with deleted page
		if(this.props.page === null){
			return
		}
		if(prevProps.page === null){
			this.setState({value: Value.fromJSON(this.importFromJSON())})
			return
		}

		// Save changes when switching pages
		if(prevProps.page.id !== this.props.page.id){
			this.exportToJSON(prevProps.page, prevState.value)
			this.setState({value: Value.fromJSON(this.importFromJSON())})
			return
		}
	}

	renderEmpty() {
		return <p>No content avalible, click on a page to start editing</p>
	}

	render() {
		if(this.props.page === null) return this.renderEmpty()

		return (
			<div className={'editor'} >
				<div className={'toolbar'}>
					{Object.entries(nodes).map(item => {
						return this.buildButton(item)
					})}
				</div>

				<span className={'id-holder'}>{'Id: ' + this.props.page.id}</span>
				<Editor
					className={'component obojobo-draft--pages--page'}
					placeholder="Obojobo Visual Editor"
					value={this.state.value}
					onChange={change => this.onChange(change)}
					renderMark={props => this.renderMark(props)}
					plugins={plugins}
				/>
			</div>
		)
	}

	onChange({ value }) {
		this.setState({ value })
	}

	renderMark(props){
		switch (props.mark.type){
			case BOLD_MARK:
				return <strong>{props.children}</strong>
			case ITALIC_MARK:
				return <em>{props.children}</em>
			case STRIKE_MARK:
				return <del>{props.children}</del>
			case QUOTE_MARK:
				return <blockquote>{props.children}</blockquote>
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
		return (
			<button
				key={item[0]}
				onClick={() => this.insertBlock(item)}>
				{item[0]}
			</button>
		)
	}

	exportToJSON(page, value) {
		// Build page wrapper
		const json = {}
		json.id = page.id
		json.type = PAGE_NODE
		json.content = page.content
		json.children = []

		value.document.nodes.forEach(child => {
			// If the current Node is a registered OboNode, use its custom converter
			if(nodes.hasOwnProperty(child.type)){
				json.children.push(nodes[child.type].helpers.slateToObo(child))
			} else {
				json.children.push(DefaultNode.helpers.slateToObo(child))
			}
		})

		page.set('children', json.children)
		return json
	}

	importFromJSON() {
		const { page } = this.props

		const json = { document: { nodes: [] }}

		page.attributes.children.forEach(child => {
			// If the current Node is a registered OboNode, use its custom converter
			if(nodes.hasOwnProperty(child.type)){
				json.document.nodes.push(nodes[child.type].helpers.oboToSlate(child))
			} else {
				json.document.nodes.push(DefaultNode.helpers.oboToSlate(child))
			}
		})
		return json
	}

	renderExportButton() {
		return (
			<Button onClick={() => this.exportToJSON()}>
				<p>{'Export To Obojobo'}</p>
			</Button>
		)
	}
}

export default PageEditor
