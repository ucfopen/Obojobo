import './viewer-component.scss'
import './editor-component.scss'

import React, { memo } from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

import emptyQB from './empty-node.json'

const { Button } = Common.components
const isOrNot = Common.util.isOrNot
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'

const remove = (editor, element) => {
	const path = ReactEditor.findPath(editor, element)
	return Transforms.removeNodes(editor, { at: path })
}

const addQuestion = (editor, element) => {
	const Question = Common.Registry.getItemForType(QUESTION_NODE)
	const path = ReactEditor.findPath(editor, element)
	return Transforms.insertNodes(
		editor,
		Question.insertJSON,
		{ at: path.concat(element.children.length) }
	)
}

const addQuestionBank = (editor, element) => {
	const path = ReactEditor.findPath(editor, element)
	return Transforms.insertNodes(
		editor,
		emptyQB,
		{ at: path.concat(element.children.length) }
	)
}

const changeChooseType = (editor, element, event) => {
	event.stopPropagation()
	const chooseAll = event.target.value === 'all'

	const path = ReactEditor.findPath(editor, element)
	Transforms.setNodes(
		editor, 
		{ content: { ...element.content, chooseAll } },
		{ at: path }
	)
}

const changeChooseAmount = (editor, element, event) => {
	const path = ReactEditor.findPath(editor, element)
	Transforms.setNodes(
		editor, 
		{ content: { ...element.content, choose: event.target.value } },
		{ at: path }
	)
}

const changeSelect = (editor, element, event) => {
	const path = ReactEditor.findPath(editor, element)
	Transforms.setNodes(
		editor, 
		{ content: { ...element.content, select: event.target.value } },
		{ at: path }
	)
}

const freezeEditor = (editor) => {
	editor.toggleEditable(false)
}

const unfreezeEditor = (editor) => {
	editor.toggleEditable(true)
}

const displaySettings = (editor, element, content) => {
	const radioGroupName = `${element.id}-choose`
	return (
		<div className={'qb-settings'}>
			<fieldset className="choose">
				<legend>How many questions should be displayed?</legend>
				<label>
					<input
						type="radio"
						name={radioGroupName}
						value="all"
						checked={content.chooseAll}
						onChange={changeChooseType.bind(this, editor, element)}/>
					All questions
				</label>
				<span> or</span>
				<label>
					<input
						type="radio"
						name={radioGroupName}
						value="pick"
						checked={!content.chooseAll}
						onChange={changeChooseType.bind(this, editor, element)}/>
					Pick
				</label>
				<input
					type="number"
					value={content.choose}
					disabled={content.chooseAll}
					onClick={event => event.stopPropagation()}
					onChange={changeChooseAmount.bind(this, editor, element)}
					onFocus={freezeEditor.bind(this, editor)}
					onBlur={unfreezeEditor.bind(this, editor)}/>
			</fieldset>
			<label className="select">
				How should questions be selected?
				<select
					value={content.select}
					onClick={event => event.stopPropagation()}
					onChange={changeSelect.bind(this, editor, element)}>
					<option value="sequential">In order</option>
					<option value="random">Randomly</option>
					<option value="random-unseen">Randomly, with no repeats</option>
				</select>
			</label>
		</div>
	)
}

class QuestionBank extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			open: true
		}

		this.toggleOpen = this.toggleOpen.bind(this)
	}

	// When the selected prop changes from false to true, toggle state open

	toggleOpen() {
		this.setState(prevState => {
			if(prevState.open) {
				// If the qb is the only node, closing fails

				// Move the selection outside of the qb if it is currently in there
				return ({ open: false })
			}

			return ({ open: true })
		})
	}

	displaySummary() {
		const { element } = this.props

		const qChildren = element.children.filter(node => node.type === QUESTION_NODE).length
		const qbChildren = element.children.filter(node => node.type === QUESTION_BANK_NODE).length

		// Parse the number of children into readable text
		let qText = qChildren > 0 ? qChildren + ' Question' : ''
		qText = qChildren > 1 ? qText + 's' : qText
		qText = qText && qbChildren > 0 ? qText + ' and ' : qText

		let qbText = qbChildren > 0 ? qbChildren + ' nested Question Bank' : ''
		qbText = qbChildren > 1 ? qbText + 's' : qbText

		// There will always be at least one question/questionbank inside a question bank
		// so we will always need to display this text.
		return (
			<div contentEditable={false}>
				{ qText + qbText + ' hidden' }
			</div>
		)
	}

	render() {
		const { editor, element, children } = this.props

		const className = 'obojobo-draft--chunks--question-bank editor-bank ' 
			+ isOrNot(this.state.open, 'open')

		return (
			<Node {...this.props}>
				<div className={className}>
					<Button
						className="collapse-button"
						onClick={this.toggleOpen}
						contentEditable={false}>
						{'⌃'}
					</Button>
					<Button
						className="delete-button"
						onClick={() => {
							remove(editor, element)
						}}
						contentEditable={false}>
						&times;
					</Button>
					{!this.state.open ? this.displaySummary() : null}
					<div className="question-bank-content">
						{displaySettings(editor, element, element.content)}
						{children}
						<div className="button-bar">
							<Button
								onClick={() => {
									addQuestion(editor, element)
								}}>
								Add Question
							</Button>
							<Button
								onClick={() => {
									addQuestionBank(editor, element)
								}}>
								Add Question Bank
							</Button>
						</div>
					</div>
				</div>
			</Node>
		)
	}
}

export default memo(withSlateWrapper(QuestionBank))
