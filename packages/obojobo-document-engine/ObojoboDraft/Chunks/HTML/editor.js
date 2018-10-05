import React from 'react'

const HTML_NODE = 'ObojoboDraft.Chunks.HTML'

const Node = props => {
	return (
		<div className={'component'}>
			<div className={'obojobo-draft--chunks--html viewer pad'}>{props.children}</div>
		</div>
	)
}

const insertNode = change => {
	change
		.insertBlock({
			type: HTML_NODE
		})
		.moveToStartOfNextText()
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = {}
	json.content.html = node.text
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type

	json.nodes = [
		{
			object: 'text',
			leaves: [
				{
					text: node.content.html
				}
			]
		}
	]

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case HTML_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.HTML': {
				nodes: [
					{
						match: [{ object: 'text' }],
						min: 1
					}
				]
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
