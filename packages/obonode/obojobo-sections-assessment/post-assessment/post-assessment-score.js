import React from 'react'
import { ReactEditor } from 'slate-react'
import { Transforms } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import RangeModal from './range-modal'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

const { ModalUtil } = Common.util
const { Button } = Common.components

class PostAssessmentScore extends React.Component {
	constructor(props) {
		super(props)
		this.showRangeModal = this.showRangeModal.bind(this)
		this.deleteNode = this.deleteNode.bind(this)
		this.changeRange = this.changeRange.bind(this)
	}

	showRangeModal() {
		ModalUtil.show(<RangeModal for={this.props.element.content.for} onConfirm={this.changeRange} />)
	}

	changeRange(newRangeString) {
		ModalUtil.hide()
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, for: newRangeString } },
			{ at: path }
		)
	}

	deleteNode() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.removeNodes(this.props.editor, { at: path })
	}

	render() {
		const dataFor = this.props.element.content.for
		return (
			<div>
				<div className={'action-data'}>
					<h2 contentEditable={false}>{'Score Range: ' + dataFor + ' '}</h2>
					<button
						className="range-edit"
						onClick={this.showRangeModal}
						aria-label="Edit Score Range"
						contentEditable={false}
					>
						✎
					</button>
				</div>
				<div className={'score-actions-page pad'}>
					{this.props.children}
					<Button className={'delete-button'} onClick={this.deleteNode} contentEditable={false}>
						×
					</Button>
				</div>
			</div>
		)
	}
}

export default withSlateWrapper(PostAssessmentScore)
