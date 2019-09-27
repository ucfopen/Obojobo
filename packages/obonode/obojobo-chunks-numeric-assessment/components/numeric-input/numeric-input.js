import './numeric-input.scss'

import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common'
import NumericHeader from './numeric-header'
import NumericOption from './numeric-option'

const { Button } = Common.components

class NumericInput extends React.Component {
	constructor() {
		super()

		this.state = {
			isEditting: false
		}
	}

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

	onAddFeedback() {
		this.setState({ isEditting: true })
	}

	render() {
		const scoreRule = this.props.node.data.get('scoreRule')
		const { score } = scoreRule

		const isSelected = this.props.isSelected
		const className = 'numeric-input-container' + (isSelected ? ' is-selected' : '')

		return (
			<div className={className} onClick={this.props.onSetCurrSelected}>
				<button
					className={'correct-button ' + (score == 100 ? 'is-correct' : 'is-not-correct')}
					tabIndex="0"
					onClick={() => this.onHandleScoreChange()}
				>
					{score == 100 ? '✔' : '✖'}
				</button>

				<table contentEditable={false}>
					<NumericHeader requirement={scoreRule.requirement} />
					<NumericOption
						scoreRule={scoreRule}
						onHandleInputChange={event => this.onHandleInputChange(event)}
						onClickDropdown={event => this.onClickDropdown(event)}
					/>
				</table>

				<Button className="delete-button" onClick={() => this.onDelete(event)}>
					×
				</Button>

				{this.state.isEditting ? (
					<div className="numeric-feedback-editor">{this.props.children}</div>
				) : (
					<div className="obojobo-draft--components--button alt-action is-not-dangerous align-center add-feedback-btn">
						<button className="button" onClick={() => this.onAddFeedback()} contentEditable={false}>
							Add Feedback
						</button>
					</div>
				)}
			</div>
		)
	}
}

export default NumericInput
