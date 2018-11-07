import React from 'react'

const HTML_NODE = 'ObojoboDraft.Chunks.HTML'

const Node = props => {
	return (
		<div className={'component'}>
			<div className={'obojobo-draft--chunks--html viewer pad html-editor'}>
				<pre>{props.children}</pre>
			</div>
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
	onKeyDown(event, change) {
		const isHTML = change.value.blocks.some(block => block.type === HTML_NODE)
		if (!isHTML) return

		// Insert a softbreak on enter
		if (event.key === 'Enter') {
			event.preventDefault()
			change.insertText('\n')
			return true
		}

		// Tab insert
		if (event.key === 'Tab') {
			event.preventDefault()
			change.insertText('\t')
			return true
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

const HTML = {
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

export default HTML
