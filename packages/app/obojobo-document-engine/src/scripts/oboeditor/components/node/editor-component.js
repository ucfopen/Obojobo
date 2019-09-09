import React from 'react'
import { Block } from 'slate'
import Common from 'Common'

import DropMenu from './components/insert-menu'

import './editor-component.scss'

class Node extends React.Component {
	cloneNodeJSON(sourceJSON) {
		return JSON.parse(JSON.stringify(sourceJSON))
	}

	insertBlockAtStart(item) {
		const json = this.cloneNodeJSON(item.insertJSON)

		return this.props.editor.insertNodeByKey(this.props.node.key, 0, Block.create(json))
	}

	insertBlockAtEnd(item) {
		const json = this.cloneNodeJSON(item.insertJSON)

		return this.props.editor.insertNodeByKey(
			this.props.node.key,
			this.props.node.nodes.size,
			Block.create(json)
		)
	}

	convertItemsToArray(items) {
		return Array.from(items.values())
	}

	render() {
		return (
			<div className={'oboeditor-component component'} data-obo-component="true">
				{this.props.isSelected ? (
					<div className={'component-toolbar'}>
						<DropMenu
							dropOptions={Common.Registry.getItems(this.convertItemsToArray)}
							className={'align-left top'}
							icon="+"
							masterOnClick={this.insertBlockAtStart.bind(this)}
						/>
						<DropMenu
							dropOptions={Common.Registry.getItems(this.convertItemsToArray)}
							className={'align-left bottom'}
							icon="+"
							masterOnClick={this.insertBlockAtEnd.bind(this)}
						/>
					</div>
				) : null}
				{this.props.children}
			</div>
		)
	}
}

export default Node
