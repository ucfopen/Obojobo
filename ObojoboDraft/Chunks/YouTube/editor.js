import React from 'react'

const YOUTUBE_NODE = 'ObojoboDraft.Chunks.YouTube'

class Node extends React.Component {
	constructor(props) {
		super(props)
	}

	handleSourceChange(event) {
		const editor = this.props.editor
		const change = editor.value.change()

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					videoId: event.target.value
				}
			}
		})
		editor.onChange(change)
	}

	renderFrame() {
		const { isFocused } = this.props
		const content = this.props.node.data.get('content')

		const wrapperStyle = {
			position: 'relative',
			outline: isFocused ? '2px solid blue' : 'none'
		}

		const maskStyle = {
			display: isFocused ? 'none' : 'block',
			position: 'absolute',
			top: '0',
			left: '0',
			height: '100%',
			width: '100%',
			cursor: 'cell',
			zIndex: 1
		}

		return (
			<div className={'obojobo-draft--chunks--you-tube viewer'} style={wrapperStyle}>
				<div style={maskStyle} />
				<iframe
					src={'https://www.youtube.com/embed/' + content.videoId}
					frameBorder="0"
					allowFullScreen="true"
				/>
				<input
					value={content.videoId}
					aria-label={'Youtube Video Id'}
					onChange={event => this.handleSourceChange(event)}
					onClick={event => event.stopPropagation()}
				/>
			</div>
		)
	}

	render() {
		return <div className={'component'}>{this.renderFrame()}</div>
	}
}

const insertNode = change => {
	change
		.insertBlock({
			type: YOUTUBE_NODE,
			data: { content: { videoId: 'FaHEusBG20c' } }
		})
		.moveToStartOfNextText()
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}
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

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case YOUTUBE_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.YouTube': {
				isVoid: true
			}
		}
	}
}

const YouTube = {
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

export default YouTube
