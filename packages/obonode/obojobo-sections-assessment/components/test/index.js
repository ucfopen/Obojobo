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
		let currentClickHandler
		// ideally this would read 'Current question has not been saved' if the current question hasn't been answered
		// double ideally the 'Next' button would be disabled if the current question hasn't been answered
		let incompleteNotice = null

		// optionally indicate a single question index
		// this will match a 'current question', which can be passed down
		//  to a child question bank and used here to display 'question X of Y'
		// TODO: move this any other logic to determine if the user can proceed to the next question
		//  into the parent component?
		let questionIndex = null
		const assessmentConfig = this.props.model.parent.attributes.content
		if (assessmentConfig.pace && assessmentConfig.pace === 'single') {
			const assessmentId = this.props.model.parent.attributes.id
			const currentAssessmentState = this.props.moduleData.assessmentState.assessments[assessmentId]
				.current.state
			questionIndex = currentAssessmentState.currentQuestion
		}

		if (this.props.isAttemptSubmitting) {
			buttonLabel = buttonAriaLabel = 'Loading ...'
			currentClickHandler = () => {}
		} else if (!this.props.isAttemptReadyToSubmit) {
			if (questionIndex !== null) {
				buttonLabel = 'Next'
				buttonAriaLabel = 'Next Question'
				currentClickHandler = this.props.onClickNext
			} else {
				buttonLabel = 'Submit'
				buttonAriaLabel = 'Submit (Not all questions have been saved)'
				currentClickHandler = this.props.onClickSubmit

				incompleteNotice = (
					<span aria-hidden className="incomplete-notice">
						(Not all questions have been saved)
					</span>
				)
			}
		} else {
			buttonLabel = buttonAriaLabel = 'Submit'
			currentClickHandler = this.props.onClickSubmit
		}

		return (
			<div className="test">
				{questionIndex !== null ? (
					<p className="current-question">
						Question {questionIndex + 1} of {this.props.model.children.models.length}
					</p>
				) : null}
				<Component
					model={this.props.model}
					moduleData={this.props.moduleData}
					questionIndex={questionIndex}
				/>
				<div className="submit-button">
					<Button
						ariaLabel={buttonAriaLabel}
						disabled={this.props.isAttemptSubmitting}
						onClick={currentClickHandler}
						value={buttonLabel}
					/>
					{incompleteNotice}
				</div>
			</div>
		)
	}
}

export default AssessmentTest
