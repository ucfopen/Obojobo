import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

const { Button } = Common.components

class Table extends React.Component {
	constructor(props) {
		super(props)
	}

	toggleHeader() {
		const editor = this.props.editor

		const topRow = this.props.node.nodes.get(1)
		const content = topRow.data.get('content')
		const toggledHeader = !content.header

		content.header = toggledHeader

		// change the header flag on the top row
		editor.setNodeByKey(topRow.key, {
			data: { content }
		})

		// change the header flag on each cell of the top row
		topRow.nodes.forEach(cell => {
			return editor.setNodeByKey(cell.key, {
				data: { content: { header: toggledHeader } }
			})
		})
	}

	renderButton() {
		return (
			<div className="buttonbox-box" contentEditable={false}>
				<div className="box-border">
					<Button className="toggle-header" onClick={this.toggleHeader.bind(this)}>
						Toggle Header
					</Button>
				</div>
			</div>
		)
	}

	render() {
		return (
			<Node {...this.props}>
				<div className={'obojobo-draft--chunks--table viewer pad'}>
					<div className={'container'}>
						<table className="view" key="table">
							<tbody>{this.props.children}</tbody>
						</table>
					</div>
					{this.props.isSelected ? this.renderButton() : null}
				</div>
			</Node>
		)
	}
}

export default Table
