import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
const { Button } = Common.components
class Mod extends React.Component {
	constructor(props) {
		super(props)
		this.deleteNode = this.deleteNode.bind(this)
	}

	deleteNode() {
		const editor = this.props.editor

		const parent = editor.value.document.getDescendant(this.props.parent.key)

		const sibling = parent.nodes.get(1)

		// If this is the only row in the list, delete the list
		if (!sibling) {
			return editor.removeNodeByKey(parent.key)
		}

		return editor.removeNodeByKey(this.props.node.key)
	}

	render() {
		return (
			<div className={'mod pad'}>
				{this.props.children}
				<Button className={'delete-button'} onClick={this.deleteNode}>
					×
				</Button>
			</div>
		)
	}
}

export default Mod
