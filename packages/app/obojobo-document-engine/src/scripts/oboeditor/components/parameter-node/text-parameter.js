import React from 'react'

import KeyDownUtil from '../../util/keydown-util'

import './parameter-node.scss'

const TEXT_PARAMETER = 'oboeditor.text-parameter'

const Node = props => {


	console.log(props.node.toJSON())
	return (
		<div className={'parameter-node'} {...props.attributes}>
			<span contentEditable={false}>{props.node.data.get('display') + ': '}</span>
			<span>{props.children}</span>
		</div>
	)
}

const isType = editor => {
	return editor.value.blocks.some(block => {
		return block.type === TEXT_PARAMETER
	})
}

const slateToObo = node => {
	const json = {}
	json[node.data.get('name')] = node.text

	return json
}

const oboToSlate = (name, value, display) => ({
	object: 'block',
	type: TEXT_PARAMETER,
	data: {
		name: name,
		display: display
	},
	nodes: [
		{
			object: 'text',
			leaves: [
				{
					text: value
				}
			]
		}
	]
})

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case TEXT_PARAMETER:
				return <Node {...props} />
			default:
				return next()
		}
	},
	onKeyDown(event, editor, next) {
		// See if any of the selected nodes are a parameter
		const isParameter = isType(editor)
		if (!isParameter) return next()

		switch (event.key) {
			case 'Backspace':
			case 'Delete':
				return KeyDownUtil.deleteNodeContents(event, editor, next)

			case 'Enter':
				// Disallows enter
				event.preventDefault()
				return true

			default:
				return next()
		}
	}
}

const TextParameter = {
	components: {
		Node
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

export default TextParameter
