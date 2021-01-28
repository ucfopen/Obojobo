import './editor-component.scss'
import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import RangeModal from './range-modal'

const { ModalUtil } = Common.util
const { Button } = Common.components
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const SCORE_NODE = 'ObojoboDraft.Sections.Assessment.ScoreAction'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

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
		ModalUtil.hide()
		const actionsPath = ReactEditor.findPath(this.props.editor, this.props.element)

		Transforms.insertNodes(
			this.props.editor,
			{
				type: ACTIONS_NODE,
				subtype: SCORE_NODE,
				content: {
					for: rangeString
				},
				children: [
					{
						type: PAGE_NODE,
						content: {},
						children: [
							{
								type: TEXT_NODE,
								content: {},
								children: [{ text: '' }]
							}
						]
					}
				]
			},
			{ at: actionsPath.concat(this.props.element.children.length) }
		)
	}

	render() {
		return (
			<div className={'scoreactions'}>
				<h1 contentEditable={false}>Score Actions</h1>
				{this.props.children}
				<div contentEditable={false}>
					<Button onClick={this.showRangeModal} contentEditable={false}>
						Add Action
					</Button>
				</div>
			</div>
		)
	}
}

export default withSlateWrapper(PostAssessment)
