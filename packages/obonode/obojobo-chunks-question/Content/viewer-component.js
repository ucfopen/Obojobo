import './viewer-component.scss'

import React from 'react'
import SurveyQuestionIcon from '../survey-question-icon'

const QuestionContent = props => (
	<div className="obojobo-draft--chunks--question--content">
		{props.model.modelState.type === 'survey' ? <SurveyQuestionIcon /> : null}
		{props.model.children.models.slice(0, -1).map(child => {
			const Component = child.getComponentClass()
			return <Component key={child.get('id')} model={child} moduleData={props.moduleData} />
		})}
	</div>
)

export default QuestionContent
