import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

const { Button } = Common.components

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

	renderButton() {
		return (
			<div className="buttonbox-box" contentEditable={false}>
				<div className="box-border">
					<Button className="toggle-size" onClick={this.toggleSize.bind(this)}>
						Toggle Size
					</Button>
				</div>
			</div>
		)
	}

	render() {
		return (
			<Node {...this.props}>
				<div
					className={`non-editable-chunk obojobo-draft--chunks--break viewer width-${
						this.props.node.data.get('content').width
					}`}>
					<hr />
					{this.props.isSelected ? this.renderButton() : null}
				</div>
			</Node>
		)
	}
}

export default Break
