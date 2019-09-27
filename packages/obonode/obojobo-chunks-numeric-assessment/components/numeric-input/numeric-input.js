import './numeric-input.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import constant from '../../constant'
import renderHeader from './render-header'
import renderOption from './render-option'

const { Button } = Common.components
const { requirementDropdown } = constant

class NumericInput extends React.Component {
	onHandleScoreChange() {
		const scoreRule = this.props.node.data.get('scoreRule')
		scoreRule.score = scoreRule.score == '100' ? '0' : '100'

		const editor = this.props.editor
		editor.setNodeByKey(this.props.node.key, {
			data: { scoreRule }
		})
	}

	onHandleInputChange(event) {
		const { name, value } = event.target

		const scoreRule = this.props.node.data.get('scoreRule')
		scoreRule[name] = value

		const editor = this.props.editor
		editor.setNodeByKey(this.props.node.key, {
			data: { scoreRule }
		})
	}

	onClickDropdown(event) {
		const { name, value } = event.target

		const scoreRule = this.props.node.data.get('scoreRule')
		scoreRule[name] = value

		const editor = this.props.editor
		editor.setNodeByKey(this.props.node.key, {
			data: { scoreRule }
		})
	}

	onDelete(event) {
		event.stopPropagation()
		const editor = this.props.editor
		return editor.removeNodeByKey(this.props.node.key)
	}

	render() {
		const scoreRule = this.props.node.data.get('scoreRule')
		const { score } = scoreRule

		const isSelected = this.props.isSelected
		const className = 'numeric-input-container' + (isSelected ? ' is-selected' : '')

		return (
			<div className={className} onClick={this.props.onSetCurrSelected} contentEditable={false}>
				<button
					className={'correct-button ' + (score == 100 ? 'is-correct' : 'is-not-correct')}
					tabIndex="0"
					onClick={() => this.onHandleScoreChange()}
				>
					{score == 100 ? '✔' : '✖'}
				</button>

				<table>
					<tr>
						<th>Requirement</th>
						{renderHeader(scoreRule.requirement)}
					</tr>
					<tr>
						<td>
							<select
								className="select-item"
								name="requirement"
								onChange={event => this.onClickDropdown(event)}
							>
								{requirementDropdown.map(requirement => (
									<option>{requirement}</option>
								))}
							</select>
						</td>
						{renderOption(
							scoreRule,
							event => this.onHandleInputChange(event),
							event => this.onClickDropdown(event)
						)}
					</tr>
				</table>
				<Button className="delete-button" onClick={() => this.onDelete(event)}>
					×
				</Button>
				{isSelected ? (
					<div className="obojobo-draft--components--button alt-action is-not-dangerous align-center add-feedback-btn">
						<button className="button">Add Feedback</button>
					</div>
				) : null}
			</div>
		)
	}
}

export default NumericInput
