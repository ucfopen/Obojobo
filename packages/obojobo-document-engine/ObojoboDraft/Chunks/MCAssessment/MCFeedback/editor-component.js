import React from 'react'

class MCFeedback extends React.Component {
	delete() {
		const editor = this.props.editor
		const change = editor.value.change()
		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}
	render() {
		return (
			<div
				className={'component obojobo-draft--chunks--mc-assessment--mc-feedback editor-feedback'}
			>
				<button className={'delete-node-button'} onClick={() => this.delete()}>
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
