import React from 'react'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const Node = props => {
	const HTag = `h${props.node.data.get('content').level || 1}`
	return (
		<div className={'component'}>
			<div className={'text-chunk obojobo-draft--chunks--heading pad'}>
				<HTag>{props.children}</HTag>
			</div>
		</div>
	)
}

const toggleNode = change => {
	// Find the current deepest heading level
	let deepest = 0

	change.value.blocks.forEach(block => {
		if (block.data.get('content')
			&& block.data.get('content').level
			&& block.data.get('content').level > 0) {
			deepest = block.data.get('content').level
		}
	})

	// Increment to the next heading level, or text if h6
	deepest = (deepest + 1) % 7

	change.setBlocks(
		deepest === 0
			? { type: TEXT_NODE, data: { content: { indent: 0 }}}
			: { type: HEADING_NODE, data: { content: { level: deepest }}}
	)
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case HEADING_NODE:
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Heading': {
				nodes: [{ objects: ['text'] }]
			}
		}
	}
}

const Heading = {
	components: {
		Node,
	},
	helpers: {
		toggleNode,
		slateToObo
	},
	plugins
}

export default Heading
