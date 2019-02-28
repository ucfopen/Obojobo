import { CSSTransition } from 'react-transition-group'
import Common from 'Common'
import React from 'react'

const { Button } = Common.components
const { focus } = Common.page

export default class MCAssessmentExplanation extends React.Component {
	constructor(props) {
		super(props)
		this.solutionLabelRef = React.createRef()
	}

	focusOnExplanation() {
		// Attempt to call focusOnContent on the solution component
		try {
			const solutionModel = this.props.solutionModel
			const SolutionComponent = solutionModel.getComponentClass()
			SolutionComponent.focusOnContent(solutionModel)
		} catch (e) {
			// If that fails, simply focus on the label as a work-around:
			focus(this.solutionLabelRef.current)
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
				<CSSTransition
					in={isShowingExplanation}
					classNames="solution"
					timeout={this.props.animationTransitionTime}
					>
					{isShowingExplanation ? (
						<div
							tabIndex="-1"
							role="region"
							className="solution-container"
							key="solution-component"
							aria-labelledby="obojobo-draft--chunks--mc-assessment--solution-label"
						>
							<span
								id="obojobo-draft--chunks--mc-assessment--solution-label"
								className="for-screen-reader-only"
								ref={this.solutionLabelRef}
							>
								Explanation of the answer:
							</span>
							<SolutionComponent model={solutionModel} moduleData={this.props.moduleData} />
						</div>
					) : (
						<span />
					)}
				</CSSTransition>
			</div>
		)
	}
}
