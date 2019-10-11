import './numeric-input.scss'

import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common'
import NumericHeader from './numeric-header'
import NumericOption from './numeric-option'

const { Button } = Common.components

const NumericInput = props => {
	const onHandleScoreChange = () => {
		const numericRule = {
			...props.node.data.get('numericRule')
		}
		numericRule.score = numericRule.score == '100' ? '0' : '100'

		const editor = props.editor
		editor.setNodeByKey(props.node.key, {
			data: { numericRule }
		})
	}

	const onHandleInputChange = event => {
		const { name, value } = event.target

		const numericRule = { ...props.node.data.get('numericRule'), [name]: value }

		const editor = props.editor
		editor.setNodeByKey(props.node.key, {
			data: { numericRule }
		})
	}

	const onClickDropdown = event => {
		const { name, value } = event.target

		const numericRule = { ...props.node.data.get('numericRule'), [name]: value }

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

	const numericRule = props.node.data.get('numericRule')
	const { score } = numericRule

	return (
		<div className="numeric-input-container" onClick={props.onSetCurrSelected}>
			<button
				className={'correct-button ' + (score == 100 ? 'is-correct' : 'is-not-correct')}
				tabIndex="0"
				onClick={onHandleScoreChange}
			>
				{score === 100 ? '✔' : '✖'}
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
		</div>
	)
}

export default NumericInput
