import React from 'react'

import MCAssessmentResults from './mc-assessment-results'

const MCAssessmentAnswerChoices = props => {
	const responseType = props.responseType
	const isTypePickAll = responseType === 'pick-all'
	const isAnswerScored = props.score !== null // Question has been submitted in practice or scored by server in assessment

	return (
		<div role={isTypePickAll ? null : 'radiogroup'}>
			<div className="for-screen-reader-only" tabIndex="-1">
				{isAnswerScored ? (
					<MCAssessmentResults
						score={props.score}
						isTypePickAll={isTypePickAll}
						correctLabel={props.correctLabel}
						incorrectLabel={props.incorrectLabel}
						pickAllIncorrectMessage={props.pickAllIncorrectMessage}
						isForScreenReader
					/>
				) : null}
			</div>
			{props.models.map((model, index) => {
				const Component = model.getComponentClass()

				return (
					<Component
						key={model.attributes.id}
						model={model}
						moduleData={props.moduleData}
						responseType={responseType}
						isShowingExplanation
						mode={props.mode}
						questionSubmitted={isAnswerScored}
						choiceIndex={index}
					/>
				)
			})}
		</div>
	)
}

export default MCAssessmentAnswerChoices

// export default class MCAssessmentAnswerChoices extends React.Component {
// 	constructor(props) {
// 		super(props)
// 		this.resultsRef = React.createRef()
// 		console.log('MCAssessmentAnswerChoices', this.props)
// 	}

// 	focusOnResults() {
// 		focus(this.resultsRef.current)
// 	}

// 	render() {
// 		const responseType = this.props.responseType
// 		const isTypePickAll = responseType === 'pick-all'
// 		const isAnswerScored = this.props.score !== null // Question has been submitted in practice or scored by server in assessment

// 		return (
// 			<div role={isTypePickAll ? null : 'radiogroup'}>
// 				<div className="for-screen-reader-only" ref={this.resultsRef} tabIndex="-1">
// 					{isAnswerScored ? (
// 						<MCAssessmentResults
// 							score={this.props.score}
// 							isTypePickAll={isTypePickAll}
// 							correctLabel={this.props.correctLabel}
// 							incorrectLabel={this.props.incorrectLabel}
// 							pickAllIncorrectMessage={this.props.pickAllIncorrectMessage}
// 							isForScreenReader
// 						/>
// 					) : null}
// 				</div>
// 				{this.props.models.map((model, index) => {
// 					const Component = model.getComponentClass()
// 					return (
// 						<Component
// 							key={model.get('id')}
// 							model={model}
// 							moduleData={this.props.moduleData}
// 							responseType={responseType}
// 							isShowingExplanation
// 							mode={this.props.mode}
// 							questionSubmitted={isAnswerScored}
// 							choiceIndex={index}
// 						/>
// 					)
// 				})}
// 			</div>
// 		)
// 	}
// }
