import React from 'react'

const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

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

const insertNode = change => {
	change
		.insertBlock({
			type: HEADING_NODE,
			data: { content: { level: 2 } }
		})
		.collapseToStartOfNextText()
		.focus()
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
		Node
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate
	},
	plugins
}

export default Heading
