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
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

const remove = (editor, element) => {
	const path = ReactEditor.findPath(editor, element)
	return Transforms.removeNodes(editor, { at: path })
}

const addQuestion = (editor, element) => {
	const Question = Common.Registry.getItemForType(QUESTION_NODE)
	const path = ReactEditor.findPath(editor, element)
	return Transforms.insertNodes(editor, Question.insertJSON, {
		at: path.concat(element.children.length)
	})
}

const addQuestionBank = (editor, element) => {
	const path = ReactEditor.findPath(editor, element)
	return Transforms.insertNodes(editor, emptyQB, { at: path.concat(element.children.length) })
}

const changeChooseType = (editor, element, event) => {
	event.stopPropagation()
	const chooseAll = event.target.value === 'all'

	const path = ReactEditor.findPath(editor, element)
	Transforms.setNodes(editor, { content: { ...element.content, chooseAll } }, { at: path })
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

const freezeEditor = editor => {
	editor.toggleEditable(false)
}

const unfreezeEditor = editor => {
	editor.toggleEditable(true)
}

const displaySettings = (editor, element, content, boundFreezeEditor, boundUnFreezeEditor) => {

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
						checked={content.chooseAll}
						onChange={changeChooseType.bind(this, editor, element)}
						onFocus={boundFreezeEditor}
						onBlur={boundUnFreezeEditor}
					/>
					All questions
				</label>
				<span> or</span>
				<label>
					<input
						type="radio"
						name={radioGroupName}
						value="pick"
						checked={!content.chooseAll}
						onChange={changeChooseType.bind(this, editor, element)}
						onFocus={boundFreezeEditor}
						onBlur={boundUnFreezeEditor}
					/>
					Pick
				</label>
				<input
					type="number"
					value={content.choose}
					disabled={content.chooseAll}
					onClick={event => event.stopPropagation()}
					onChange={changeChooseAmount.bind(this, editor, element)}
					onFocus={boundFreezeEditor}
					onBlur={boundUnFreezeEditor}
					min="1"
				/>
			</fieldset>
			<label className="select">
				How should questions be selected?
				<select
					value={content.select}
					onClick={event => event.stopPropagation()}
					onChange={changeSelect.bind(this, editor, element)}
					onFocus={boundFreezeEditor}
					onBlur={boundUnFreezeEditor}
				>
					<option value="sequential">In order</option>
					<option value="random">Randomly</option>
					<option value="random-unseen">Randomly, with no repeats</option>
				</select>
			</label>
		</div>
	)
}

const QuestionBank = props => {
	const { editor, element, children } = props
	const boundFreezeEditor = freezeEditor.bind(this, editor)
	const boundUnFreezeEditor = unfreezeEditor.bind(this, editor)
	return (
		<Node {...props}>
			<div className={'obojobo-draft--chunks--question-bank editor-bank'}>
				<Button
					className="delete-button"
					onClick={() => {
						remove(editor, element)
					}}
					onFocus={boundFreezeEditor}
					onBlur={boundUnFreezeEditor}
				>
					&times;
				</Button>
				{displaySettings(editor, element, element.content, boundFreezeEditor, boundUnFreezeEditor)}
				{children}
				<div className="button-bar" contentEditable={false}>
					<Button
						onClick={() => {
							addQuestion(editor, element)
						}}
					>
						Add Question
					</Button>
					<Button
						onClick={() => {
							addQuestionBank(editor, element)
						}}
					>
						Add Question Bank
					</Button>
				</div>
			</div>
		</Node>
	)
}

export default memo(withSlateWrapper(QuestionBank))
