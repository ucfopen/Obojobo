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

		// This debounce is necessary to get slate to update the node data.
		// I've tried several ways to remove it but haven't been able to
		// get it work :(
		// If you have a solution please have at it!
		this.updateNodeFromState = debounce(1, this.updateNodeFromState)

		// copy the attributes we want into state
		const content = this.props.element.content
		this.state = this.contentToStateObj(content)

		this.freezeEditor = this.freezeEditor.bind(this)
		this.unfreezeEditor = this.unfreezeEditor.bind(this)
	}

	updateNodeFromState() {
		const content = this.props.element.content
		delete this.state.open
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(this.props.editor, { content: { ...content, ...this.state } }, { at: path })
	}

	componentDidUpdate(prevProps) {
		if (prevProps.selected && !this.props.selected) {
			this.updateNodeFromState()
		}
	}

	contentToStateObj(content) {
		return {
			chooseAll: content.chooseAll,
			choose: content.choose || 1,
			select: content.select || 'sequential'
		}
	}

	remove() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.removeNodes(this.props.editor, { at: path })
	}

	addQuestion() {
		const Question = Common.Registry.getItemForType(QUESTION_NODE)
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.insertNodes(this.props.editor, Question.insertJSON, {
			at: path.concat(this.props.element.children.length)
		})
	}

	addQuestionBank() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.insertNodes(this.props.editor, emptyQB, {
			at: path.concat(this.props.element.children.length)
		})
	}

	changeChooseType(event) {
		event.stopPropagation()
		const chooseAll = event.target.value === 'all'
		this.setState({ chooseAll }) // update the display now
	}

	onChangeContent(key, event) {
		const newContent = { [key]: event.target.value }
		this.setState(newContent) // update the display now
	}

	freezeEditor() {
		clearTimeout(window.restoreEditorFocusId)
		this.props.editor.toggleEditable(false)
	}

	unfreezeEditor() {
		window.restoreEditorFocusId = setTimeout(() => {
			this.updateNodeFromState()
			this.props.editor.toggleEditable(true)
		})
	}

	displaySettings(editor, element) {
		const radioGroupName = `${element.id}-choose`
		return (
			<div className={'qb-settings'} contentEditable={false}>
				<fieldset className="choose">
					<legend>How many questions should be displayed?</legend>
					<label>
						<input
							type="radio"
							name={radioGroupName}
							value="all"
							checked={this.state.chooseAll}
							onChange={this.changeChooseType.bind(this)}
							onFocus={this.freezeEditor}
							onBlur={this.unfreezeEditor}
						/>
						All questions
					</label>
					<span> or</span>
					<label>
						<input
							type="radio"
							name={radioGroupName}
							value="pick"
							checked={!this.state.chooseAll}
							onChange={this.changeChooseType.bind(this)}
							onFocus={this.freezeEditor}
							onBlur={this.unfreezeEditor}
						/>
						Pick
					</label>
					<input
						type="number"
						value={this.state.choose}
						disabled={this.state.chooseAll}
						onClick={event => event.stopPropagation()}
						onChange={this.onChangeContent.bind(this, 'choose')}
						onFocus={this.freezeEditor}
						onBlur={this.unfreezeEditor}
					/>
				</fieldset>
				<label className="select">
					How should questions be selected?
					<select
						value={this.state.select}
						onClick={event => event.stopPropagation()}
						onChange={this.onChangeContent.bind(this, 'select')}
						onFocus={this.freezeEditor}
						onBlur={this.unfreezeEditor}
					>
						<option value="sequential">In order</option>
						<option value="random">Randomly</option>
						<option value="random-unseen">Randomly, with no repeats</option>
					</select>
				</label>
			</div>
		)
	}

	render() {
		const { editor, element, children } = this.props
		return (
			<Node {...this.props}>
				<div className={'obojobo-draft--chunks--question-bank editor-bank'}>
					<Button
						className="delete-button"
						onClick={this.remove.bind(this)}
						onFocus={this.freezeEditor}
						onBlur={this.unfreezeEditor}
					>
						&times;
					</Button>
					{this.displaySettings(editor, element, element.content)}
					{children}
					<div className="button-bar" contentEditable={false}>
						<Button onClick={this.addQuestion.bind(this)}>Add Question</Button>
						<Button onClick={this.addQuestionBank.bind(this)}>Add Question Bank</Button>
					</div>
				</div>
			</Node>
		)
	}
}

export default memo(withSlateWrapper(QuestionBank))
