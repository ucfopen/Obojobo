import React from 'react'

class MCFeedback extends React.Component {
	delete() {
		const editor = this.props.editor
		return editor.removeNodeByKey(this.props.node.key)
	}
	render() {
		return (
			<div
				className={'component obojobo-draft--chunks--mc-assessment--mc-feedback editor-feedback'}
			>
				<button className={'delete-node'} onClick={() => this.delete()}>
					X
				</button>
				<span className={'label'} contentEditable={false}>
					{'Feedback'}
				</span>
				{this.props.children}
			</div>
		)
	}
}

export default MCFeedback
