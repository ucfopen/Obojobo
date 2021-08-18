import './editor-component.scss'

import React from 'react'
import { ReactEditor } from 'slate-react'
import { Transforms } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import EditorUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/editor-util'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import RubricModal from './rubric-modal'

const { Button, MoreInfoButton } = Common.components
const { ModalUtil } = Common.util
const { OboModel } = Common.models

class Rubric extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			rubricContent: this.props.element.content
		}

		this.unfreezeEditor = this.unfreezeEditor.bind(this)
		this.freezeEditor = this.freezeEditor.bind(this)
		this.openAssessmentRubricModal = this.openAssessmentRubricModal.bind(this)
		this.changeRubricProperties = this.changeRubricProperties.bind(this)
		this.onCloseRubricModal = this.onCloseRubricModal.bind(this)
	}

	changeRubricProperties(content) {
		this.setState({ rubricContent: content })

		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(this.props.editor, { content: { ...content } }, { at: path })
		this.onCloseRubricModal()
	}

	onCloseRubricModal() {
		ModalUtil.hide()
		this.unfreezeEditor()
	}

	freezeEditor() {
		this.props.editor.toggleEditable(false)
	}

	unfreezeEditor() {
		this.props.editor.toggleEditable(true)
	}

	openAssessmentRubricModal(event) {
		event.preventDefault()
		event.stopPropagation()

		this.freezeEditor()

		const currentAssessmentId = EditorUtil.getCurrentAssessmentId(OboModel.models)

		ModalUtil.show(
			<RubricModal
				{...this.props}
				onConfirm={this.changeRubricProperties}
				onCancel={this.onCloseRubricModal}
				model={OboModel.models[currentAssessmentId]}
			/>
		)
	}

	render() {
		const content = this.props.element.content
		const className = 'rubric pad ' + 'is-type-' + content.type

		return (
			<div className={className} contentEditable={false} ref={this.selfRef}>
				<Button onClick={this.openAssessmentRubricModal}>Edit Assessment Rubric</Button>
				<MoreInfoButton ariaLabel="Click for a summary of your current rubric settings">
					<div className="wrapper">
						<span className="about">Your current rubric settings:</span>
						<ul>
							<li>
								<b>Recorded scores will be determined by:</b>
								{this.state.rubricContent.type === 'highest' && (
									<span>Always using the highest attempt score</span>
								)}
								{this.state.rubricContent.type === 'pass-fail' && <span>A threshold</span>}
							</li>
							{this.state.rubricContent.type === 'pass-fail' && (
								<div>
									<li>
										<b>To pass, students must score at least: </b>
										<span>{this.state.rubricContent.passingAttemptScore}%</span>
									</li>
									<li>
										<b>When passing, set the assessment score to: </b>
										{this.state.rubricContent.passedType === '$attempt_score' ? (
											<span>The attempt score</span>
										) : (
											<span>{this.state.rubricContent.passedResult}%</span>
										)}
									</li>
									<li>
										{this.state.rubricContent.failedType === '$attempt_score' && (
											<div>
												<b>When failing, set the assessment score to: </b>
												<span>The attempt score</span>
											</div>
										)}

										{this.state.rubricContent.failedType === 'no-score' && (
											<div>
												<b>When failing: </b>
												<span>No score will be saved</span>
											</div>
										)}

										{this.state.rubricContent.failedType === 'set-value' && (
											<div>
												<b>When failing, set the assessment score to: </b>
												<span>{this.state.rubricContent.failedResult}%</span>
											</div>
										)}
									</li>
									<li>
										{this.state.rubricContent.unableToPassType === 'no-value' && (
											<div>
												<b>If the student is out of attempts and did not pass: </b>
												<span>Don&apos;t do anything</span>
											</div>
										)}

										{this.state.rubricContent.unableToPassType === '$highest_attempt_score' && (
											<div>
												<b>If the student is out of attempts and did not pass: </b>
												<span>Set the assessment score to the highest attempt score</span>
											</div>
										)}

										{this.state.rubricContent.unableToPassType === 'no-score' && (
											<div>
												<b>If the student is out of attempts and did not pass: </b>
												<span>Don&apos;t save the assessment score</span>
											</div>
										)}

										{this.state.rubricContent.unableToPassType === 'set-value' && (
											<div>
												<b>
													If the student is out of attempts and did not pass, set assessment score
													to:{' '}
												</b>
												<span>{this.state.rubricContent.unableToPassResult}%</span>
											</div>
										)}
									</li>
									<li>
										<b>Extra credit and penalties: </b>
										{this.state.rubricContent.mods.length === 0 ? (
											<span>You didn&apos;t set any extra credit and penalty rules</span>
										) : (
											<span>
												You have {this.state.rubricContent.mods.length} extra credit and penalty
												rules set on this rubric. Check your rubric for more information.
											</span>
										)}
									</li>
								</div>
							)}
						</ul>
					</div>
				</MoreInfoButton>
			</div>
		)
	}
}

export default withSlateWrapper(Rubric)
