import React from 'react'

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

import Common from 'Common'
const { Button } = Common.components
const { focus } = Common.page

export default class MCAssessmentExplanation extends React.Component {
	focusOnExplanation() {
		// Attempt to call focusOnContent on the solution component
		try {
			const solutionModel = this.props.solutionModel
			const SolutionComponent = solutionModel.getComponentClass()
			SolutionComponent.focusOnContent(solutionModel)
		} catch (e) {
			// If that fails, simply focus on the label as a work-around:
			focus(this.refs.label)
		}
	}

	render() {
		const isShowingExplanation = this.props.isShowingExplanation
		const solutionModel = this.props.solutionModel
		const SolutionComponent = solutionModel.getComponentClass()

		return (
			<div className="solution" key="solution">
				{isShowingExplanation ? (
					<Button altAction onClick={this.props.onClickHideExplanation} value="Hide Explanation" />
				) : (
					<Button
						className="show-explanation-button"
						altAction
						onClick={this.props.onClickShowExplanation}
						value="Read an explanation of the answer"
					/>
				)}
				<ReactCSSTransitionGroup
					component="div"
					transitionName="solution"
					transitionEnterTimeout={this.props.animationTransitionTime}
					transitionLeaveTimeout={this.props.animationTransitionTime}
				>
					{isShowingExplanation ? (
						<div
							ref={node => {
								this.refSolutionContainer = node
							}}
							tabIndex="-1"
							role="region"
							className="solution-container"
							key="solution-component"
							aria-labelledby="obojobo-draft--chunks--mc-assessment--solution-label"
						>
							<span
								id="obojobo-draft--chunks--mc-assessment--solution-label"
								className="for-screen-reader-only"
								ref="label"
							>
								Explanation of the answer:
							</span>
							<SolutionComponent model={solutionModel} moduleData={this.props.moduleData} />
						</div>
					) : null}
				</ReactCSSTransitionGroup>
			</div>
		)
	}
}
