import { CSSTransition } from 'react-transition-group'
import Common from 'Common'
import React from 'react'

const { Button } = Common.components
const { focus } = Common.page

const DEFAULT_READ_EXPLANATION_LABEL = 'Read an explanation of the answer'
const DEFAULT_HIDE_EXPLANATION_LABEL = 'Hide Explanation'
export default class MCAssessmentExplanation extends React.Component {
	constructor(props) {
		super(props)
		this.solutionLabelRef = React.createRef()
		this.animationOnEntered = this.props.animationOnEntered.bind(this)
		this.animationOnExit = this.props.animationOnExit.bind(this)
		this.animationOnExiting = this.props.animationOnExiting
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
		const showSolutionLabel = this.props.showSolutionLabel || DEFAULT_READ_EXPLANATION_LABEL
		const hideSolutionLabel = this.props.hideSolutionLabel || DEFAULT_HIDE_EXPLANATION_LABEL
		return (
			<div className="solution" key="solution">
				{isShowingExplanation ? (
					<Button altAction onClick={this.props.onClickHideExplanation} value={hideSolutionLabel} />
				) : (
					<Button
						className="show-explanation-button"
						altAction
						onClick={this.props.onClickShowExplanation}
						value={showSolutionLabel}
					/>
				)}
				<CSSTransition
					in={isShowingExplanation}
					classNames="solution"
					timeout={this.props.animationTransitionTime}
					onEntered={this.animationOnEntered}
					onExit={this.animationOnExit}
					onExiting={this.animationOnExiting}
				>
					{isShowingExplanation ? (
						<div
							tabIndex="-1"
							role="region"
							className="solution-container"
							key="solution-component"
							aria-labelledby="obojobo-draft--chunks--mc-assessment--solution-label"
							ref={node => (this.solutionContainerRef = node)}
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
						<div className="solution-container-animation-placeholder" />
					)}
				</CSSTransition>
			</div>
		)
	}
}
