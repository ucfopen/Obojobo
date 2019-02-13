import './viewer-component.scss'

import React from 'react'

import Viewer from 'Viewer'

const { OboComponent } = Viewer.components

const QuestionBank = props => (
	<OboComponent
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
)

export default QuestionBank
