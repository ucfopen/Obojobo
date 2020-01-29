import './viewer-component.scss'
import './editor-component.scss'

import React, { memo } from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import debounce from 'obojobo-document-engine/src/scripts/common/util/debounce'

import emptyQB from './empty-node.json'

const { Button } = Common.components
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

class QuestionBank extends React.Component {
	constructor(props) {
		super(props)

		//this.updateNodeFromState = debounce(200, this.updateNodeFromState)

		// copy the attributes we want into state
		const content = this.props.element.content
		this.state = this.contentToStateObj(content)

		this.freezeEditor = this.freezeEditor.bind(this)
		this.unfreezeEditor = this.unfreezeEditor.bind(this)
		this.onChangeChooseAll = this.onChangeChooseAll.bind(this)
		this.remove = this.remove.bind(this)
		this.addQuestion = this.addQuestion.bind(this)
		this.addQuestionBank = this.addQuestionBank.bind(this)
	}

	contentToStateObj(content) {
		console.log(content)
		return {
			choose: content.choose || 1,
			chooseAll: content.chooseAll,
			select: content.select || 'sequential',
		}
	}

	updateNodeFromState() {
		console.log('hewwo?')
		const content = this.props.element.content
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(
			this.props.editor, 
			{ content: {...content, ...this.state} }, 
			{ at: path }
		)
	}

	remove() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.removeNodes(this.props.editor, { at: path })
	}

	addQuestion() {
		const Question = Common.Registry.getItemForType(QUESTION_NODE)
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.insertNodes(
			this.props.editor,
			Question.insertJSON,
			{ at: path.concat(this.props.element.children.length) }
		)
	}

	addQuestionBank() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.insertNodes(
			this.props.editor,
			emptyQB,
			{ at: path.concat(this.props.element.children.length) }
		)
	}

	onChangeContent(key, event) {
		this.setState({ [key]: event.target.value }) // update the display now
		this.updateNodeFromState() // debounced to reduce lag as it updates the document
	}

	onChangeChooseAll(event) {
		this.setState({ chooseAll: event.target.value === 'all' }) // update the display now
		this.updateNodeFromState() // debounced to reduce lag as it updates the document
	}

	freezeEditor() {
		this.props.editor.toggleEditable(false)
	}

	unfreezeEditor() {
		this.props.editor.toggleEditable(true)
	}

	displaySettings() {
		const content = this.props.element.content
		return (
			<div className={'qb-settings'}>
				<fieldset className="choose">
					<legend>How many questions should be displayed?</legend>
					<label>
						<input
							type="radio"
							name="choose"
							value="all"
							checked={content.chooseAll}
							onChange={this.onChangeChooseAll}/>
						All questions
					</label>
					<span> or</span>
					<label>
						<input
							type="radio"
							name="choose"
							value="pick"
							checked={!content.chooseAll}
							onChange={this.onChangeChooseAll}/>
						Pick
					</label>
					<input
						type="number"
						value={content.choose}
						disabled={content.chooseAll}
						onChange={this.onChangeContent.bind(this, 'choose')}
						onFocus={this.freezeEditor}
						onBlur={this.unfreezeEditor}/>
				</fieldset>
				<label className="select">
					How should questions be selected?
					<select
						value={content.select}
						onClick={event => event.stopPropagation()}
						onChange={this.onChangeContent.bind(this, 'select')}>
						<option value="sequential">In order</option>
						<option value="random">Randomly</option>
						<option value="random-unseen">Randomly, with no repeats</option>
					</select>
				</label>
			</div>
		)
	}

	render() {
		console.log(this.state)
		return (
			<Node {...this.props}>
				<div className={'obojobo-draft--chunks--question-bank editor-bank'}>
					<Button
						className="delete-button"
						onClick={this.remove}>
						&times;
					</Button>
					{this.displaySettings()}
					{this.props.children}
					<div className="button-bar">
						<Button
							onClick={this.addQuestion}>
							Add Question
						</Button>
						<Button
							onClick={this.addQuestionBank}>
							Add Question Bank
						</Button>
					</div>
				</div>
			</Node>
		)
	}
}

export default memo(withSlateWrapper(QuestionBank))
