import './viewer-component.scss'
import './editor-component.scss'

import { Block } from 'slate'
import React from 'react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

class Table extends React.Component {
	constructor(props) {
		super(props)
	}

	toggleHeader() {
		const editor = this.props.editor

		const topRow = this.props.node.nodes.get(0)
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

	render() {
		return (
			<Node {...this.props}>
				<div className={'obojobo-draft--chunks--table viewer pad'}>
					<div className={'container'}>
						<table className="view" key="table">
							<tbody>
								{this.props.children}
							</tbody>
						</table>
					</div>
					<div className={'table-editor-buttons'}>
						<button onClick={() => this.toggleHeader()}>{'Toggle Header'}</button>
					</div>
				</div>
			</Node>
		)
	}
}

export default Table
