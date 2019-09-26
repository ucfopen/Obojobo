import './editor-component.scss'
import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import { Block } from 'slate'
import RangeModal from './range-modal'

const { ModalUtil } = Common.util
const { Button } = Common.components
const SCORE_NODE = 'ObojoboDraft.Sections.Assessment.ScoreAction'

class PostAssessment extends React.Component {
	constructor(props) {
		super(props)
		this.showRangeModal = this.showRangeModal.bind(this)
		this.addAction = this.addAction.bind(this)
	}

	showRangeModal() {
		ModalUtil.show(<RangeModal for={'100'} onConfirm={this.addAction} />)
	}

	addAction(rangeString) {
		const newScore = Block.create({
			type: SCORE_NODE,
			data: { for: rangeString }
		})

		return this.props.editor.insertNodeByKey(
			this.props.node.key,
			this.props.node.nodes.size,
			newScore
		)
	}

	render() {
		return (
			<div className={'scoreactions'}>
				<h1 contentEditable={false}>Score Actions</h1>
				{this.props.children}
				<Button onClick={this.showRangeModal}>Add Action</Button>
			</div>
		)
	}
}

export default PostAssessment
