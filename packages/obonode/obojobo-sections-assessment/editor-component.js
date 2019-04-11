import './editor-component.scss'

import React from 'react'
import { Block } from 'slate'

import emptyRubric from './components/rubric/empty-node.json'

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'

class Assessment extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	addRubric() {
		const editor = this.props.editor

		const newRubric = Block.create(emptyRubric)
		return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newRubric)
	}

	render() {
		const hasRubric = this.props.node.nodes.size === 5
		return (
			<div className={'obojobo-draft--sections--assessment'}>
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
