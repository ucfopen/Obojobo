import React from 'react'

export default class MCAssessmentAnswerChoices extends React.Component {
	constructor(props) {
		super(props)
		this.resultsRef = React.createRef()
	}

	render() {
		const responseType = this.props.responseType
		const isTypePickAll = responseType === 'pick-all'
		const isAnswerScored = this.props.score !== null // Question has been submitted in practice or scored by server in assessment

		return (
			<div role={isTypePickAll ? null : 'radiogroup'}>
				{this.props.models.map((model, index) => {
					const Component = model.getComponentClass()
					return (
						<Component
							key={model.get('id')}
							model={model}
							questionModel={this.props.questionModel}
							moduleData={this.props.moduleData}
							responseType={responseType}
							isShowingExplanation
							isAnswerRevealed={this.props.isAnswerRevealed}
							mode={this.props.mode}
							type={this.props.type}
							questionSubmitted={isAnswerScored}
							choiceIndex={index}
						/>
					)
				})}
			</div>
		)
	}
}
