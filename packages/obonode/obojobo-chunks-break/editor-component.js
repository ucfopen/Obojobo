import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'


const contentDescription = [
	{
		name: 'width',
		description: 'Width',
		type: 'select',
		values: [
			{
				value: 'normal',
				description: 'Normal'
			},
			{
				value: 'large',
				description: 'Large'
			},
		]
	}
]

class Break extends React.Component {
	toggleSize() {
		const editor = this.props.editor
		const content = this.props.node.data.get('content')

		const newSize = content.width === 'normal' ? 'large' : 'normal'
		content.width = newSize

		return editor.setNodeByKey(this.props.node.key, {
			data: { content }
		})
	}

	render() {
		const { isSelected } = this.props
		return (
			<Node {...this.props} contentDescription={contentDescription}>
				<div
					className={`non-editable-chunk obojobo-draft--chunks--break viewer width-${
						this.props.node.data.get('content').width
					}`}>
					<hr />
					{isSelected ? <button onClick={() => this.toggleSize()}>Toggle Size</button> : null}
				</div>
			</Node>
		)
	}
}

export default Break
