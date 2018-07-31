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
	json.content = {}
	json.content.headingLevel = node.data.get('content').level
	json.content.textGroup = []

	const line = {
		text: { value: node.text, styleList: [] }
	}

	let currIndex = 0

	node.nodes.forEach(text => {
		text.leaves.forEach(textRange => {
			textRange.marks.forEach(mark => {
				const style = {
					start: currIndex,
					end: currIndex + textRange.text.length,
					type: mark.type,
					data: JSON.parse(JSON.stringify(mark.data))
				}
				line.text.styleList.push(style)
			})
			currIndex += textRange.text.length
		})
	})

	json.content.textGroup.push(line)
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: {} }
	json.data.content.level = node.content.headingLevel

	json.nodes = []
	node.content.textGroup.forEach(line => {
		const headingline = {
			object: 'text',
			leaves: [
				{
					text: line.text.value
				}
			]
		}

		json.nodes.push(headingline)
	})

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
		slateToObo,
		oboToSlate,
	},
	plugins
}

export default Heading
