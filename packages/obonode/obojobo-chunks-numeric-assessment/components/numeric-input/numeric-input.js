import './numeric-input.scss'

import React from 'react'
import { Block } from 'slate'

import Common from 'obojobo-document-engine/src/scripts/common'
import NumericHeader from './numeric-header'
import NumericOption from './numeric-option'
import { NUMERIC_FEEDBACK } from '../../constant'

const { Button } = Common.components

const NumericInput = props => {
	const onHandleScoreChange = () => {
		const numericRule = props.node.data.get('numericRule')
		numericRule.score = numericRule.score == '100' ? '0' : '100'

		const editor = props.editor
		editor.setNodeByKey(props.node.key, {
			data: { numericRule }
		})
	}

	const onHandleInputChange = event => {
		const { name, value } = event.target

		const numericRule = props.node.data.get('numericRule')
		numericRule[name] = value

		const editor = props.editor
		editor.setNodeByKey(props.node.key, {
			data: { numericRule }
		})
	}

	const onClickDropdown = event => {
		const { name, value } = event.target

		const numericRule = props.node.data.get('numericRule')
		numericRule[name] = value

		const editor = props.editor
		editor.setNodeByKey(props.node.key, {
			data: { numericRule }
		})
	}

	const onDelete = event => {
		event.stopPropagation()
		const editor = props.editor
		return editor.removeNodeByKey(props.node.key)
	}

	const onAddFeedback = () => {
		const editor = props.editor

		const numericRule = props.node.data.get('numericRule')
		if (!numericRule.hasFeedback) {
			numericRule.hasFeedback = true
			const newFeedback = Block.create({
				object: 'block',
				type: NUMERIC_FEEDBACK
			})

			editor.insertNodeByKey(props.node.key, 0, newFeedback)
			editor.setNodeByKey(props.node.key, {
				data: { numericRule }
			})
		}
	}

	const numericRule = props.node.data.get('numericRule')
	const { score } = numericRule

	const isSelected = props.isSelected
	const hasFeedback = numericRule.hasFeedback
	const className = 'numeric-input-container' + (isSelected ? ' is-selected' : '')
	return (
		<div className={className} onClick={props.onSetCurrSelected}>
			<button
				className={'correct-button ' + (score == 100 ? 'is-correct' : 'is-not-correct')}
				tabIndex="0"
				onClick={onHandleScoreChange}
			>
				{score == 100 ? '✔' : '✖'}
			</button>

			<table contentEditable={false}>
				<NumericHeader requirement={numericRule.requirement} />
				<NumericOption
					numericRule={numericRule}
					onHandleInputChange={onHandleInputChange}
					onClickDropdown={onClickDropdown}
				/>
			</table>

			<Button className="delete-button" onClick={onDelete} contentEditable={false}>
				×
			</Button>

			{hasFeedback ? (
				props.children
			) : (
				<div className="obojobo-draft--components--button alt-action is-not-dangerous align-center add-feedback-btn">
					<button className="button" onClick={onAddFeedback} contentEditable={false}>
						Add Feedback
					</button>
				</div>
			)}
		</div>
	)
}

export default NumericInput
