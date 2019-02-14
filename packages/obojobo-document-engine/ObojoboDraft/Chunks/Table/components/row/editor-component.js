import React from 'react'

class Row extends React.Component {
	deleteRow() {
		const editor = this.props.editor

		const parent = editor.value.document.getDescendant(this.props.parent.key)
		// get reference to content (which will be mutated)
		const content = parent.data.get('content')
		// mutate
		content.textGroup.numRows--

		if (parent.nodes.get(0).key === this.props.node.key) {
			const sibling = parent.nodes.get(1)

			// If this is the only row in the table, delete the table
			if (!sibling) {
				return editor.removeNodeByKey(parent.key)
			}

			// Set sibling as new header
			sibling.nodes.forEach(cell => {
				editor.setNodeByKey(cell.key, { data: { content: { header: content.header } } })
			})
			editor.setNodeByKey(sibling.key, { data: { content: { header: content.header } } })
		}

		return editor.removeNodeByKey(this.props.node.key)
	}

	render() {
		return (
			<tr>
				{this.props.children}
				<td className={'delete-cell'}>
					<button onClick={() => this.deleteRow()}>{'X'}</button>
				</td>
			</tr>
		)
	}
}

export default Row
