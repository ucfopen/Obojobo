import React from 'react'

const Node = props => {
	return (
		<p {...props.attributes}>
			<span contentEditable={false}>{props.node.data.get('display') + ': '}</span>
			<span>{props.children}</span>
		</p>
	)
}

const slateToObo = node => {
	const json = {}
	json[node.data.get('name')] = node.text

	return json
}

const oboToSlate = (name, value, display) => {
	const json = {}
	json.object = 'block'
	json.type = 'Parameter'
	json.data = { name: name, display: display }

	json.nodes = [
		{
			object: 'text',
			leaves: [
				{
					text: value
				}
			]
		}
	]

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case 'Parameter':
				return <Node {...props} />
		}
	}
}

const ParameterNode = {
	components: {
		Node
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

export default ParameterNode
