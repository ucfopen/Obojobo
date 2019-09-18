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
	precisionType: 'Significant digits'
}

class NumericAssessment extends React.Component {
	constructor() {
		super()

		this.state = {
			responses: [{ ...emptyResponse }]
		}
	}

	onDeteteResponse(index) {
		let updateResponses = this.state.responses
		updateResponses.splice(index, 1)

		if (updateResponses.length <= 0) {
			updateResponses = [{ ...emptyResponse }]
		}

		this.setState({
			responses: updateResponses
		})
	}

	onClickDropdown(responseIndex, event) {
		const { name, value } = event.target

		const updateResponses = this.state.responses
		updateResponses[responseIndex][name] = value

		this.setState({ responses: updateResponses })
	}

	onAddNumericInput() {
		this.setState({
			responses: [...this.state.responses, { ...emptyResponse }]
		})
	}

	onInputChange(responseIndex, event) {
		const { name, value } = event.target

		const updateResponses = this.state.responses
		updateResponses[responseIndex][name] = value

		this.setState({
			responses: updateResponses
		})
	}

	render() {
		return (
			<div className="component obojobo-draft--chunks--numeric-assessment" contentEditable={false}>
				{this.state.responses.map((response, index) => (
					<NumericInput
						response={response}
						onClickDropdown={event => this.onClickDropdown(index, event)}
						onDeteteResponse={() => this.onDeteteResponse(index)}
						onInputChange={event => this.onInputChange(index, event)}
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
