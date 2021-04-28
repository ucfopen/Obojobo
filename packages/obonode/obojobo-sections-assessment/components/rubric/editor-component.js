import './editor-component.scss'

import React from 'react'
import { ReactEditor } from 'slate-react'
import { Transforms } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import EditorUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/editor-util'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import RubricModal from './rubric-modal'

const { Button } = Common.components
const { ModalUtil } = Common.util
const { OboModel } = Common.models

class Rubric extends React.Component {
	constructor(props) {
		super(props)

		this.unfreezeEditor = this.unfreezeEditor.bind(this)
		this.freezeEditor = this.freezeEditor.bind(this)
		this.openAssessmentRubricModal = this.openAssessmentRubricModal.bind(this)
		this.changeRubricProperties = this.changeRubricProperties.bind(this)
		this.onCloseRubricModal = this.onCloseRubricModal.bind(this)
	}

	changeRubricProperties(content) {
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
			</div>
		)
	}
}

export default withSlateWrapper(Rubric)
