import React from 'react'
import TextUtil from '../../../src/scripts/oboeditor/util/text-util'

const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'

class Node extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	handleAltChange() {
		const newAltText = window.prompt('Enter the new alt text:', this.state.alt)

		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ alt: newAltText })

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					alt: newAltText,
					url: this.state.url,
					size: this.state.size,
					height: this.state.height,
					width: this.state.width
				}
			}
		})
		editor.onChange(change)
	}

	handleURLChange() {
		const newURL = window.prompt('Enter the new URL:', this.state.url)

		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ url: newURL })

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					url: newURL,
					alt: this.state.alt,
					size: this.state.size,
					height: this.state.height,
					width: this.state.width
				}
			}
		})
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

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					url: this.state.url,
					alt: this.state.alt,
					size: newSize,
					height: newHeight,
					width: newWidth
				}
			}
		})
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
					onClick={event => event.stopPropagation()}
				>
					<option value={'small'}>{'small'}</option>
					<option value={'medium'}>{'medium'}</option>
					<option value={'large'}>{'large'}</option>
					<option value={'custom'}>{'custom'}</option>
				</select>
				<div>
					<button className={'delete-node'} onClick={() => this.deleteNode()}>
						{'X'}
					</button>
				</div>
			</div>
		)
	}

	render() {
		let isCustom = false
		const imgStyles = {}

		if (this.state.size === 'custom') {
			if (this.state.width) {
				imgStyles.width = this.state.width + 'px'
			}

			if (this.state.height) {
				imgStyles.height = this.state.height + 'px'
			}
			isCustom = true
		}

		const hasImage = this.state.url && this.state.url.length !== 0
		const hasAltText = this.state.alt && this.state.alt.length !== 0

		return (
			<div className={'component'} {...this.props.attributes}>
				<div className={`obojobo-draft--chunks--figure viewer ` + this.state.size}>
					{this.renderEditToolbar()}
					<div className={'container'}>
						{hasAltText ? null : <div>{'Accessibility Warning: No Alt Text!'}</div>}

						{hasImage ? null : <div>{'No Image Selected, Please Add an Image URL'}</div>}

						{isCustom ? (
							<img
								title={this.state.alt}
								src={this.state.url}
								unselectable="on"
								alt={this.state.alt}
								style={imgStyles}
							/>
						) : (
							<img
								title={this.state.alt}
								src={this.state.url}
								unselectable="on"
								alt={this.state.alt}
							/>
						)}
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
			data: {
				content: {
					size: 'medium',
					alt: null,
					url: null
				}
			}
		})
		.collapseToStartOfNextText()
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content')

	json.content.textGroup = []
	const captionLine = {
		text: { value: node.text, styleList: [] },
		data: null
	}

	node.nodes.forEach(text => {
		TextUtil.slateToOboText(text, captionLine)
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
	if (!node.content.textGroup) {
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
			leaves: TextUtil.parseMarkings(line)
		}

		json.nodes.push(caption)
	})

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case FIGURE_NODE:
				return <Node {...props} />
		}
	},
	renderPlaceholder(props) {
		const { node } = props
		if (node.object !== 'block' || node.type !== FIGURE_NODE) return
		if (node.text !== '') return

		return (
			<span className={'placeholder align-center'} contentEditable={false}>
				{'Type Your Caption Here'}
			</span>
		)
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
		Node
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate
	},
	plugins
}

export default Figure
