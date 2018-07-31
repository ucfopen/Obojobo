import React from 'react'

const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'

class Node extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props.node.data.get('content')
	}

	handleAltChange() {
		const newAltText = window.prompt('Enter the new alt text:', this.state.alt)
			|| this.state.alt

		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ alt: newAltText })

		change.setNodeByKey(this.props.node.key, { data: { content: {
			alt: newAltText,
			url: this.state.url,
			size: this.state.size,
			height: this.state.height,
			width: this.state.width
		}}})
		editor.onChange(change)
	}

	handleURLChange() {
		const newURL = window.prompt('Enter the new URL:', this.state.url)
			|| this.state.url

		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ url: newURL })

		change.setNodeByKey(this.props.node.key, { data: { content: {
			url: newURL,
			alt: this.state.alt,
			size: this.state.size,
			height: this.state.height,
			width: this.state.width
		}}})
		editor.onChange(change)
	}

	handleSizeChange(event) {
		const newSize = event.target.value
		// height and width will clear out the old values if custom is not selected
		let newHeight = null
		let newWidth = null
		if (newSize === 'custom') {
			newHeight = window.prompt('Enter the new height:', this.state.height)
			newWidth = window.prompt('Enter the new width:', this.state.width)
		}

		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ size: newSize, height: newHeight, width: newWidth })

		change.setNodeByKey(this.props.node.key, { data: { content: {
			url: this.state.url,
			alt: this.state.alt,
			size: newSize,
			height: newHeight,
			width: newWidth
		}}})
		editor.onChange(change)
	}

	deleteNode() {
		const editor = this.props.editor
		const change = editor.value.change()

		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
	}

	renderEditToolbar() {
		return (
			<div className={'image-toolbar'}>
				<button onClick={() => this.handleAltChange()}>{'Edit Alt Text'}</button>
				<button onClick={() => this.handleURLChange()}>{'Edit URL'}</button>
				<select
					name={'Size'}
					value={this.state.size}
					onChange={event => this.handleSizeChange(event)}
					onClick={event => event.stopPropagation()}>
					<option value={'small'}>{'small'}</option>
					<option value={'medium'}>{'medium'}</option>
					<option value={'large'}>{'large'}</option>
					<option value={'custom'}>{'custom'}</option>
				</select>
				<div>
					<button className={'delete-node'} onClick={() => this.deleteNode()}>{'X'}</button>
				</div>
			</div>
		)
	}

	render() {
		const { isSelected } = this.props
		let isCustom = false
		const imgStyles = {}

		if(this.state.size === 'custom'){
			if (this.state.width) {
				imgStyles.width = this.state.width + 'px'
			}

			if (this.state.height) {
				imgStyles.height = this.state.height + 'px'
			}
			isCustom = true
		}

		return (
			<div
				className={'component'}
			{...this.props.attributes} >
				<div className={`obojobo-draft--chunks--figure viewer ` + this.state.size}>
					{isSelected ? this.renderEditToolbar(): null}
					<div className={'container'}>
						{isCustom ?
							<img
								src={this.state.url}
								unselectable="on"
								alt={this.state.alt}
								style={imgStyles}/>:
							<img
								src={this.state.url}
								unselectable="on"
								alt={this.state.alt} />
						}
						<figcaption>{this.props.children}</figcaption>
					</div>
				</div>
			</div>
		)
	}
}

const insertNode = change => {
	change
		.insertBlock({
			type: FIGURE_NODE,
			data: { content: { size: 'medium', alt: '',  url: 'data:image/gif;base64,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'} }
		})
		.collapseToStartOfNextText()
		.focus()
}

const slateToObo = node => {
	if (node.type !== FIGURE_NODE) return null

	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content')

	json.content.textGroup = []
	const captionLine = {
		text: { value: node.text, styleList: [] },
		data: null
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
				captionLine.text.styleList.push(style)
			})
			currIndex += textRange.text.length
		})
	})

	json.content.textGroup.push(captionLine)
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
	// If there is currently no caption, add one
	if(!node.content.textGroup) {
		const caption = {
			object: 'text',
			leaves: [
				{
					text: ''
				}
			]
		}
		json.nodes.push(caption)
		return json
	}

	node.content.textGroup.forEach(line => {
		const caption = {
			object: 'text',
			leaves: [
				{
					text: line.text.value
				}
			]
		}

		json.nodes.push(caption)
	})

	return json
}

const plugins = {
	renderNode(props){
		switch (props.node.type) {
			case FIGURE_NODE:
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.Figure': {
				nodes: [{ objects: ['text'] }]
			}
		}
	}
}

const Figure = {
	components: {
		Node,
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate,
	},
	plugins
}

export default Figure
