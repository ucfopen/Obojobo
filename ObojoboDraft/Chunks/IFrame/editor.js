import React from 'react'

const IFRAME_NODE = 'ObojoboDraft.Chunks.IFrame'

class Node extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props.node.data.get('content')
	}

	handleTypeChange(event){
		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ src: event.target.value })

		change.setNodeByKey(this.props.node.key, { data: { content: {
			src: event.target.value
		}}})
		editor.onChange(change)
	}

	renderInput() {
		return (
			<div>
				<input
					value={this.state.src}
					onChange={event => this.handleSourceChange(event)}
					onClick={event => event.stopPropagation()} />
			</div>
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
			<div className={'obojobo-draft--chunks--iframe viewer'} style={wrapperStyle}>
				<div style={maskStyle} />
				<iframe
					is
					src={this.state.src}
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
	change
		.insertBlock({
			type: IFRAME_NODE,
			data: { content: { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ' } },
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

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case IFRAME_NODE:
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.IFrame': {
				isVoid: true,
			}
		}
	}
}

const IFrame = {
	components: {
		Node,
	},
	helpers: {
		insertNode,
		slateToObo
	},
	plugins
}

export default IFrame
