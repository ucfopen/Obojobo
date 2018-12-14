import './viewer-component.scss'

import React from 'react'
import { Block } from 'slate'

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'

class Assessment extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	addRubric() {
		const editor = this.props.editor
		const change = editor.value.change()

		const newRubric = Block.create({
			type: RUBRIC_NODE,
			data: { content: { type: 'pass-fail' } }
		})
		change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newRubric)

		editor.onChange(change)
	}

	render() {
		const hasRubric = this.props.node.nodes.size === 5
		return (
			<div className={'assessment'}>
				{this.props.children}
				{!hasRubric ? (
					<button className={'add-rubric'} onClick={() => this.addRubric()}>
						{'Add Rubric'}
					</button>
				) : null}
			</div>
		)
	}
}

export default Assessment
