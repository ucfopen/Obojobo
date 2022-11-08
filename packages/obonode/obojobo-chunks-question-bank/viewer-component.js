import './viewer-component.scss'

import React from 'react'
import Viewer from 'Viewer'

const { OboComponent } = Viewer.components

const QuestionBank = props => {
	// here's what we have:
	// const assessmentId = props.model.parent.attributes.id
	// const currentAssessmentState = props.moduleData.assessments[assessmentId].current.state
	// some complicated parsing of the above might be able to pre-answer questions as they're rendered below?

	// the assessment model itself is tracking the question pace
	// hopefully we can contrive some way of tracking a 'current question index'
	// the 'Submit' button is controlled elsewhere - that'd have to be a 'Next' button for assessments
	// running in one-question-at-a-time mode, but we'd have to control the currently displayed question
	// here, so there needs to be communication somehow

	return <OboComponent
		model={props.model}
		moduleData={props.moduleData}
		className="obojobo-draft--chunks--question-bank"
	>
		{props.model.children.models.map((child, index) => {
			const Component = child.getComponentClass()

			return (
				<Component
					key={index}
					model={child}
					moduleData={props.moduleData}
					questionIndex={index}
					numQuestionsInBank={props.model.children.models.length}
				/>
			)
		})}
	</OboComponent>
}

export default QuestionBank
