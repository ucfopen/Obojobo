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

		let buttonLabel
		let buttonAriaLabel
		if (this.props.isAttemptSubmitting) {
			buttonLabel = buttonAriaLabel = 'Loading ...'
		} else if (!this.props.isAttemptReadyToSubmit) {
			buttonLabel = 'Submit'
			buttonAriaLabel = 'Submit (Not all questions have been saved)'
		} else {
			buttonLabel = buttonAriaLabel = 'Submit'
		}

		return (
			<div className="test">
				<Component model={this.props.model} moduleData={this.props.moduleData} />
				<div className="submit-button">
					<Button
						ariaLabel={buttonAriaLabel}
						disabled={this.props.isAttemptSubmitting}
						onClick={this.props.onClickSubmit}
						value={buttonLabel}
					/>
					{!this.props.isAttemptReadyToSubmit ? (
						<span aria-hidden className="incomplete-notice">
							(Not all questions have been saved)
						</span>
					) : null}
				</div>
			</div>
		)
	}
}

export default AssessmentTest
