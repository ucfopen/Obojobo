import './viewer-component.scss'
import './editor-component.scss'

import React, { memo, useCallback } from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import EditorUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/editor-util'
import ImportQuestionModal from './import-questions-modal'

import emptyQB from './empty-node.json'

const { Button } = Common.components
const { ModalUtil } = Common.util

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

const displaySettings = (editor, element, content) => {
	const radioGroupName = `${element.id}-choose`

	const changeChooseTypeHandler = useCallback(
		event => {
			changeChooseType(editor, element, event)
		},
		[editor, element]
	)

	const changeSelectHandler = useCallback(
		event => {
			changeSelect(editor, element, event)
		},
		[editor, element]
	)

	const changeChooseAmountHandler = useCallback(
		event => {
			changeChooseAmount(editor, element, event)
		},
		[editor, element]
	)

	const freezeEditorHandler = useCallback(() => {
		freezeEditor(editor)
	}, [editor])
	const unFreezeEditorHandler = useCallback(() => {
		unfreezeEditor(editor)
	}, [editor])

	const stopPropagation = useCallback(event => event.stopPropagation())

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
						onChange={changeChooseTypeHandler}
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
						onChange={changeChooseTypeHandler}
					/>
					Pick
				</label>
				<input
					type="number"
					value={content.choose}
					disabled={content.chooseAll}
					onClick={stopPropagation}
					onChange={changeChooseAmountHandler}
					onFocus={freezeEditorHandler}
					onBlur={unFreezeEditorHandler}
				/>
			</fieldset>
			<label className="select">
				How should questions be selected?
				<select value={content.select} onClick={stopPropagation} onChange={changeSelectHandler}>
					<option value="sequential">In order</option>
					<option value="random">Randomly</option>
					<option value="random-unseen">Randomly, with no repeats</option>
				</select>
			</label>
		</div>
	)
}

const getQuestionList = draft => {
	if (draft.type === QUESTION_NODE) return [draft]

	let result = []
	for (const node of draft.children) {
		result = result.concat(getQuestionList(node))
	}

	return result
}

const QuestionBank = props => {
	const { editor, element, children } = props

	const contentDescription = [
		{
			name: 'Import Questions',
			description: 'Import',
			type: 'button',
			action: () => {
				const json = EditorUtil.json().attributes
				const questionList = getQuestionList(json)
				// const question = Common.Registry.getItemForType(QUESTION_NODE)
				// console.log(question.oboToSlate(questionList[0]))
				// const node = question.oboToSlate(questionList[0])

				// const path = ReactEditor.findPath(editor, element)
				// return Transforms.insertNodes(editor, node, {
				// 	at: path.concat(element.children.length)
				// })

				ModalUtil.show(<ImportQuestionModal questionList={questionList} />)
			}
		}
	]

	return (
		<Node {...props} contentDescription={contentDescription}>
			<div className={'obojobo-draft--chunks--question-bank editor-bank'}>
				<Button
					className="delete-button"
					onClick={() => {
						remove(editor, element)
					}}
				>
					&times;
				</Button>
				{displaySettings(editor, element, element.content)}
				{children}
				<div className="button-bar">
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
