import React from 'react'

const YOUTUBE_NODE = 'ObojoboDraft.Chunks.YouTube'

class Node extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props.node.data.get('content')
	}

	handleSourceChange(event){
		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ videoId: event.target.value })

		change.setNodeByKey(this.props.node.key, { data: { content: {
			videoId: event.target.value
		}}})
		editor.onChange(change)
	}

	renderInput() {
		return (
			<input
				value={this.state.videoId}
				onChange={event => this.handleSourceChange(event)}
				onClick={event => event.stopPropagation()} />
		)
	}

	renderFrame() {
		const { isFocused } = this.props

		const wrapperStyle = {
			position: 'relative',
			outline: isFocused ? '2px solid blue' : 'none',
		}

		const maskStyle = {
			display: isFocused ? 'none' : 'block',
			position: 'absolute',
			top: '0',
			left: '0',
			height: '100%',
			width: '100%',
			cursor: 'cell',
			zIndex: 1,
		}

		const iframeStyle = {
			display: 'block',
		}

		return (
			<div className={'obojobo-draft--chunks--you-tube viewer'} style={wrapperStyle}>
				<div style={maskStyle} />
				<iframe
					src={'https://www.youtube.com/embed/' + this.state.videoId}
					frameBorder="0"
					allowFullScreen="true"
				/>
			</div>
		)
	}

	render() {
		const { isSelected } = this.props

		return (
			<div className={'component'} {...this.props.attributes}>
				{this.renderFrame()}
				{isSelected ? this.renderInput() : null}
			</div>
		)
	}
}

const insertNode = change => {
	console.log('inserting')
	change
		.insertBlock({
			type: YOUTUBE_NODE,
			data: { content: { videoId: 'FaHEusBG20c' } },
			isVoid: true
		})
		.collapseToStartOfNextText()
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
	json.isVoid = true

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case YOUTUBE_NODE:
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.YouTube': {
				isVoid: true,
			}
		}
	}
}

const YouTube = {
	components: {
		Node,
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate
	},
	plugins
}

export default YouTube
