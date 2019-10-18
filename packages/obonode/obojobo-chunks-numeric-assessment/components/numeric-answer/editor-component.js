import './editor-component.scss'

import React from 'react'

import NumericHeader from './numeric-header'
import NumericOption from './numeric-option'
import { MARGIN_OF_ERROR, PRECISE_RESPONSE, fullTextToSimplifed } from '../../constants'

const NumericInput = props => {
	const onHandleScoreChange = () => {
		const numericChoice = {
			...props.node.data.get('numericChoice')
		}
		numericChoice.score = numericChoice.score == '100' ? '0' : '100'

		const editor = props.editor
		editor.setNodeByKey(props.node.key, {
			data: { numericChoice }
		})
	}

	const onHandleInputChange = event => {
		const { name, value } = event.target

		const numericChoice = { ...props.node.data.get('numericChoice'), [name]: value }

		const editor = props.editor
		editor.setNodeByKey(props.node.key, {
			data: { numericChoice }
		})
	}

	const onClickDropdown = event => {
		const { name, value } = event.target

		const numericChoice = props.node.data.get('numericChoice')
		let updatenumericChoice

		if (name === 'requirement') {
			updatenumericChoice = {
				[name]: fullTextToSimplifed[value],
				score: numericChoice.score
			}
			switch (value) {
				case PRECISE_RESPONSE: {
					updatenumericChoice.type = 'sig-figs'
				}
				case MARGIN_OF_ERROR: {
					updatenumericChoice.type = 'percent'
				}
			}
		} else {
			updatenumericChoice = {
				...numericChoice,
				[name]: fullTextToSimplifed[value]
			}
		}

		props.editor.setNodeByKey(props.node.key, {
			data: { numericChoice: updatenumericChoice }
		})
	}

	const numericChoice = props.node.data.get('numericChoice')
	const { score } = numericChoice

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
				<thead>
					<NumericHeader requirement={numericChoice.requirement} />
				</thead>
				<tbody>
					<NumericOption
						numericChoice={numericChoice}
						onHandleInputChange={onHandleInputChange}
						onClickDropdown={onClickDropdown}
					/>
				</tbody>
			</table>
		</div>
	)
}

export default NumericInput
