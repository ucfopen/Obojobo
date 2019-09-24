import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import RangeModal from './range-modal'
const { ModalUtil } = Common.util
const { Button } = Common.components

class PostAssessmentScore extends React.Component {
	showRangeModal() {
		ModalUtil.show(
			<RangeModal for={this.props.node.data.get('for')} onConfirm={this.changeRange.bind(this)} />
		)
	}

	changeRange(newRangeString) {
		this.props.editor.setNodeByKey(this.props.node.key, { data: { for: newRangeString } })
	}

	deleteNode() {
		return this.props.editor.removeNodeByKey(this.props.node.key)
	}

	render() {
		const dataFor = this.props.node.data.get('for')
		return (
			<div>
				<div className={'action-data'}>
					<h2>{'Score Range: ' + dataFor + ' '}</h2>
					<button
						className="range-edit"
						onClick={this.showRangeModal.bind(this)}
						aria-label="Edit Score Range"
					>
						✎
					</button>
				</div>
				<div className={'score-actions-page pad'}>
					{this.props.children}
					<Button className={'delete-button'} onClick={() => this.deleteNode()}>
						×
					</Button>
				</div>
			</div>
		)
	}
}

export default PostAssessmentScore
