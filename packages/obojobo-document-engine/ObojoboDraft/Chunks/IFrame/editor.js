import React from 'react'
import { Block } from 'slate'
import emptyNode from './empty-node.json'

const IFRAME_NODE = 'ObojoboDraft.Chunks.IFrame'

class Node extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	handleSourceChange(event) {
		const editor = this.props.editor
		const change = editor.value.change()

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					src: event.target.value
				}
			}
		})
		editor.onChange(change)
	}

	renderInput() {
		return (
			<div>
				<input
					value={this.props.node.data.get('content').src}
					onChange={event => this.handleSourceChange(event)}
					onClick={event => event.stopPropagation()}
				/>
			</div>
		)
	}

	renderFrame() {
		const { isFocused } = this.props

		const wrapperStyle = {
			position: 'relative',
			outline: isFocused ? '2px solid blue' : 'none'
		}

		const maskStyle = {
			display: isFocused ? 'none' : 'block',
			position: 'absolute',
			top: '0',
			left: '0',
			height: '100%',
			width: '100%',
			cursor: 'cell',
			zIndex: 1
		}

		return (
			<div className={'obojobo-draft--chunks--iframe viewer'} style={wrapperStyle}>
				<div style={maskStyle} />
				<iframe
					is
					src={this.props.node.data.get('content').src}
					frameBorder="0"
					allowFullScreen="true"
				/>
			</div>
		)
	}

	render() {
		return (
			<div className={'component'}>
				{this.renderFrame()}
				{this.props.isSelected ? this.renderInput() : null}
			</div>
		)
	}
}

const insertNode = change => {
	change
		.insertBlock(Block.fromJSON(emptyNode))
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: node.content }

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case IFRAME_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.IFrame': {
				isVoid: true
			}
		}
	}
}

const IFrame = {
	name: IFRAME_NODE,
	components: {
		Node
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate
	},
	json: {
		emptyNode
	},
	plugins
}

export default IFrame
