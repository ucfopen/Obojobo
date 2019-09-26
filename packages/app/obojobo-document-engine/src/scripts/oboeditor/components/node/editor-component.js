import React from 'react'
import { Block } from 'slate'
import Common from 'Common'

import DropMenu from './components/insert-menu'
import MoreInfoIcon from '../../assets/more-info-icon'

import MoreInfoBox from '../navigation/more-info-box'

import './editor-component.scss'

class Node extends React.Component {
	insertBlockAtStart(item) {
		const editor = this.props.editor

		return editor.insertNodeByKey(this.props.node.key, 0, Block.create(item.insertJSON))
	}

	insertBlockAtEnd(item) {
		const editor = this.props.editor

		return editor.insertNodeByKey(
			this.props.node.key,
			this.props.node.nodes.size,
			Block.create(item.insertJSON)
		)
	}

	convertItemsToArray(items) {
		return Array.from(items.values())
	}

	saveId() {
		console.log('mblargh')
	}

	saveContent() {
		console.log('aaaaaaaaaaaah')
	}

	render() {
		const node = this.props.node.nodes.get(0)

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
				{this.props.isSelected ? (
					<MoreInfoBox
						className="content-node"
						id={node.key}
						content={node.data.toJSON().content}
						saveId={this.saveId}
						saveContent={this.saveContent}
						contentDescription={[
							{
								name: 'title',
								description: 'Title',
								type: 'string'
							}
						]}
					/>
				) : null}
			</div>
		)
	}
}

export default Node
