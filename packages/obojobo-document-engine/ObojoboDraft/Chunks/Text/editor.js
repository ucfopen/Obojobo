import React from 'react'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'

const Node = props => {
	return (
		<div className={'component'}>
			<div className={'text-chunk obojobo-draft--chunks--single-text pad'}>
				<span className={`text align-left`} data-indent={props.node.data.get('content').indent}>
					{props.children}
				</span>
			</div>
		</div>
	)
}

const insertNode = change => {
	change
		.insertBlock({
			type: TEXT_NODE,
			data: { content: { indent: 0 } }
		})
		.collapseToStartOfNextText()
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = {}
	json.content.textGroup = []

	const line = {
		text: { value: node.text, styleList: [] },
		data: { indent: node.data.get('content').indent }
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
	json.data = { content: node.content }

	json.nodes = []
	node.content.textGroup.forEach(line => {
		const textLine = {
			object: 'text',
			leaves: [
				{
					text: line.text.value
				}
			]
		}

		json.nodes.push(textLine)
	})

	return json
}

const plugins = {
	onKeyDown(event, change) {
		const isText = change.value.blocks.some(block => block.type === TEXT_NODE)

		// Shift Tab
		if (isText && event.key === 'Tab' && event.shiftKey) {
			event.preventDefault()
			change.value.blocks.forEach(block => {
				let newIndent = block.data.get('content').indent - 1
				if (newIndent < 1) newIndent = 0

				return change.setNodeByKey(block.key, {
					data: { content: { indent: newIndent } }
				})
			})
			return true
		}

		// Tab indent
		if (isText && event.key === 'Tab') {
			event.preventDefault()
			change.value.blocks.forEach(block =>
				change.setNodeByKey(block.key, {
					data: { content: { indent: block.data.get('content').indent + 1 } }
				})
			)
			return true
		}
	},
	renderNode(props) {
		switch (props.node.type) {
			case TEXT_NODE:
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Text': {
				nodes: [{ objects: ['text'] }]
			}
		}
	}
}

const Text = {
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

export default Text
