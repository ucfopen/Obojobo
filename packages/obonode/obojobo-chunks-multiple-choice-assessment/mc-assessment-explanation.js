import { CSSTransition } from 'react-transition-group'
import Common from 'Common'
import React from 'react'

const { Button } = Common.components
const { focus } = Common.page

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

		let hideExplanationLabel
		let showExplanationLabel

		switch (this.props.mode) {
			case 'survey':
				hideExplanationLabel = 'Hide About this question'
				showExplanationLabel = 'About this question'
				break

			default:
				hideExplanationLabel = 'Hide Explanation'
				showExplanationLabel = 'Read an explanation of the answer'
				break
		}

		return (
			<div className={`solution is-mode-${this.props.mode}`} key="solution">
				{isShowingExplanation ? (
					<Button
						altAction
						onClick={this.props.onClickHideExplanation}
						value={hideExplanationLabel}
					/>
				) : (
					<Button
						className="show-explanation-button"
						altAction
						onClick={this.props.onClickShowExplanation}
						value={showExplanationLabel}
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
