import React from 'react'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const Node = props => {
	return (
		<p {...props.attributes}>{props.childen}</p>
	)
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	if (node.data) json.content = node.data.get('content') || {}
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

const DefaultNode = {
	components: {
		Node
	},
	helpers: {
		slateToObo,
		oboToSlate,
	}
}

export default DefaultNode
