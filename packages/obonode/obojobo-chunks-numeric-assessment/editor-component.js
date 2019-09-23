import './editor-component.scss'

import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common'
import NumericInput from './components/numeric-input'

const { Button } = Common.components

const emptyResponse = {
	requirement: 'Exact answer',
	answerInput: '',
	startInput: '',
	endInput: '',
	marginType: 'Absolute',
	precisionType: 'Significant digits',
	score: 100
}

class NumericAssessment extends React.Component {
	constructor() {
		super()

		this.state = {
			currSelected: null
		}
	}

	onDetete(index) {
		let scoreRules = this.props.node.data.get('scoreRules')
		scoreRules.splice(index, 1)

		if (scoreRules.length <= 0) {
			scoreRules = [{ ...emptyResponse }]
		}

		const editor = this.props.editor
		editor.setNodeByKey(this.props.node.key, {
			data: { scoreRules }
		})
	}

	onClickDropdown(responseIndex, event) {
		const { name, value } = event.target

		const scoreRules = this.props.node.data.get('scoreRules')
		scoreRules[responseIndex][name] = value

		const editor = this.props.editor
		editor.setNodeByKey(this.props.node.key, {
			data: { scoreRules }
		})
	}

	onAddNumericInput() {
		const scoreRules = this.props.node.data.get('scoreRules')
		scoreRules.push({ ...emptyResponse })

		const editor = this.props.editor
		editor.setNodeByKey(this.props.node.key, {
			data: { scoreRules }
		})
	}

	onInputChange(responseIndex, event) {
		const { name, value } = event.target

		const scoreRules = this.props.node.data.get('scoreRules')
		scoreRules[responseIndex][name] = value

		const editor = this.props.editor
		editor.setNodeByKey(this.props.node.key, {
			data: { scoreRules }
		})
	}

	onSetCurrSelected(index) {
		this.setState({ currSelected: index })
	}

	onHandleScoreChange(index) {
		const scoreRules = this.props.node.data.get('scoreRules')
		scoreRules[index].score = scoreRules[index].score == 100 ? 0 : 100

		const editor = this.props.editor
		editor.setNodeByKey(this.props.node.key, {
			data: { scoreRules }
		})
	}

	render() {
		const scoreRules = this.props.node.data.get('scoreRules')

		return (
			<div className="component obojobo-draft--chunks--numeric-assessment" contentEditable={false}>
				{scoreRules.map((scoreRule, index) => (
					<NumericInput
						isSelected={this.state.currSelected == index}
						score={scoreRule.score}
						response={scoreRule}
						onClickDropdown={event => this.onClickDropdown(index, event)}
						onDetete={() => this.onDetete(index)}
						onInputChange={event => this.onInputChange(index, event)}
						onSetCurrSelected={() => this.onSetCurrSelected(index)}
						onHandleScoreChange={() => this.onHandleScoreChange(index)}
					/>
				))}

				<Button className="add-answer-btn pad" onClick={() => this.onAddNumericInput()}>
					Add possible answer
				</Button>
			</div>
		)
	}
}

export default NumericAssessment
