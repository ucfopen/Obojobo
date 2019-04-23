import './editor-component.scss'

import React from 'react'
import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

const { Button } = Common.components

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'

class Assessment extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	addRubric() {
		const editor = this.props.editor

		const newRubric = Block.create({
			type: RUBRIC_NODE,
			data: { content: { type: 'pass-fail' } }
		})
		return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newRubric)
	}

	render() {
		const hasRubric = this.props.node.nodes.size === 5
		return (
			<div className={'obojobo-draft--sections--assessment'}>
				{this.props.children}
				{!hasRubric ? (
					<Button className={'add-rubric'} onClick={() => this.addRubric()}>
						{'Add Rubric'}
					</Button>
				) : null}
			</div>
		)
	}
}

export default Assessment
