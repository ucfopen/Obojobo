import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

const { Button } = Common.components

class NumericFeedback extends React.Component {
	delete() {
		const editor = this.props.editor
		return editor.removeNodeByKey(this.props.node.key)
	}
	render() {
		return (
			<div className="component obojobo-draft--chunks--numeric-assessment--numeric-feedback editor-feedback">
				<Button className="delete-button" onClick={this.delete.bind(this)}>
					×
				</Button>
				<span className="label" contentEditable={false}>
					Feedback
				</span>
				{this.props.children}
			</div>
		)
	}
}

export default NumericFeedback
