import Common from 'obojobo-document-engine/src/scripts/common'
import { FOCUS_ON_ASSESSMENT_CONTENT } from '../../assessment-event-constants'
import React from 'react'

const { Button } = Common.components
const { Dispatcher } = Common.flux

class AssessmentTest extends React.Component {
	constructor() {
		super()
		this.boundFocusOnContent = this.focusOnContent.bind(this)
	}

	componentDidMount() {
		Dispatcher.on(FOCUS_ON_ASSESSMENT_CONTENT, this.boundFocusOnContent)
	}

	componentWillUnmount() {
		Dispatcher.off(FOCUS_ON_ASSESSMENT_CONTENT, this.boundFocusOnContent)
	}

	focusOnContent() {
		const firstQuestion = this.props.model.children.at(0)
		if (!firstQuestion) return false

		const componentClass = firstQuestion.getComponentClass()
		if (!componentClass) return false

		componentClass.focusOnContent(firstQuestion)
		return true
	}

	render() {
		const Component = this.props.model.getComponentClass()

		let submitButtonText = 'Loading ...'
		if (!this.props.isAttemptComplete) {
			submitButtonText = 'Submit (Not all questions have been answered)'
		} else if (!this.props.isFetching) {
			submitButtonText = 'Submit'
		}

		return (
			<div className="test">
				<Component model={this.props.model} moduleData={this.props.moduleData} />
				<div className="submit-button">
					<Button
						disabled={this.props.isFetching}
						onClick={this.props.onClickSubmit}
						value={submitButtonText}
					/>
				</div>
			</div>
		)
	}
}

export default AssessmentTest
