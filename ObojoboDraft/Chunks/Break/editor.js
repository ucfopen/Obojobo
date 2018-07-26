import React from 'react'

const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

class Node extends React.Component {
	toggleSize() {
		const content = this.props.node.data.get('content')
		const newSize = (content.width === 'normal' ? 'large' : 'normal')
		content.width = newSize

		this.forceUpdate()
	}

	render() {
		const { isSelected } = this.props

		return (
			<div className={'component'}>
				<div
					className={`non-editable-chunk obojobo-draft--chunks--break viewer width-${this.props.node.data.get('content').width}`}
					{...this.props.attributes}>
					<hr/>
					{isSelected ? <button onClick={() => this.toggleSize()}>Toggle Size</button> : null}
				</div>
			</div>
		)
	}
}

const insertNode = change => {
	change
		.insertBlock({
			type: BREAK_NODE,
			data: { content: { width: 'normal' } },
			isVoid: true
		})
		.collapseToStartOfNextText()
		.focus()
}

const slateToObo = node => {
	if (node.type !== BREAK_NODE) return null

	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content')

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case BREAK_NODE:
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Break': {
				isVoid: true,
			}
		}
	}
}

const Break ={
	components: {
		Node,
	},
	helpers: {
		insertNode,
		slateToObo,
	},
	plugins
}

export default Break
