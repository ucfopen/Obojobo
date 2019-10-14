import './editor-component.scss'

import React from 'react'

import NumericHeader from './numeric-header'
import NumericOption from './numeric-option'
import { MARGIN_OF_ERROR, PRECISE_RESPONSE, fullTextToSimplifed } from '../../constants'

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

		const numericRule = props.node.data.get('numericRule')
		let updateNumericRule

		if (name === 'requirement') {
			updateNumericRule = {
				[name]: fullTextToSimplifed[value],
				score: numericRule.score
			}
			switch (value) {
				case PRECISE_RESPONSE: {
					updateNumericRule.type = 'sig-figs'
				}
				case MARGIN_OF_ERROR: {
					updateNumericRule.type = 'percent'
				}
			}
		} else {
			updateNumericRule = {
				...numericRule,
				[name]: fullTextToSimplifed[value]
			}
		}

		props.editor.setNodeByKey(props.node.key, {
			data: { numericRule: updateNumericRule }
		})
	}

	const numericRule = props.node.data.get('numericRule')
	const { score } = numericRule

	return (
		<div className="numeric-input-container pad" onClick={props.onSetCurrSelected}>
			<button
				className={'correct-button ' + (score == '100' ? 'is-correct' : 'is-not-correct')}
				tabIndex="0"
				onClick={onHandleScoreChange}
			>
				{score == '100' ? '✔' : '✖'}
			</button>

			<table contentEditable={false}>
				<NumericHeader requirement={numericRule.requirement} />
				<NumericOption
					numericRule={numericRule}
					onHandleInputChange={onHandleInputChange}
					onClickDropdown={onClickDropdown}
				/>
			</table>
		</div>
	)
}

export default NumericInput
