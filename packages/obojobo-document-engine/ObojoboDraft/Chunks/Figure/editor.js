/* eslint no-alert: 0 */
import React from 'react'
import { Block } from 'slate'
import TextUtil from '../../../src/scripts/oboeditor/util/text-util'

import emptyNode from './empty-node.json'
import Icon from './icon'

const FIGURE_NODE = 'ObojoboDraft.Chunks.Figure'

class Node extends React.Component {
	constructor(props) {
		super(props)
	}

	handleAltChange() {
		const editor = this.props.editor
		const change = editor.value.change()
		const content = this.props.node.data.get('content')

		const newAltText = window.prompt('Enter the new alt text:', content.alt) || content.alt

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					alt: newAltText,
					url: content.url,
					size: content.size,
					height: content.height,
					width: content.width
				}
			}
		})
		editor.onChange(change)
	}

	handleURLChange() {
		const editor = this.props.editor
		const change = editor.value.change()
		const content = this.props.node.data.get('content')

		const newURL = window.prompt('Enter the new URL:', content.url) || content.url

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					url: newURL,
					alt: content.alt,
					size: content.size,
					height: content.height,
					width: content.width
				}
			}
		})
		editor.onChange(change)
	}

	handleSizeChange(event) {
		const content = this.props.node.data.get('content')
		const newSize = event.target.value
		// height and width will clear out the old values if custom is not selected
		let newHeight = null
		let newWidth = null
		if (newSize === 'custom') {
			newHeight = window.prompt('Enter the new height:', content.height || null)
			newWidth = window.prompt('Enter the new width:', content.width || null)
		}

		const editor = this.props.editor
		const change = editor.value.change()

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					url: content.url,
					alt: content.alt,
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
			<div className="image-toolbar">
				<button onClick={() => this.handleAltChange()}>Edit Alt Text</button>
				<button onClick={() => this.handleURLChange()}>Edit URL</button>
				<select
					name={'Size'}
					value={this.props.node.data.get('content').size}
					onChange={event => this.handleSizeChange(event)}
					onClick={event => event.stopPropagation()}
				>
					<option value="small">small</option>
					<option value="medium">medium</option>
					<option value="large">large</option>
					<option value="custom">custom</option>
				</select>
				<div>
					<button className="delete-node" onClick={() => this.deleteNode()}>
						{'X'}
					</button>
				</div>
			</div>
		)
	}

	render() {
		const content = this.props.node.data.get('content')

		let isCustom = false
		const imgStyles = {}

		if (content.size === 'custom') {
			if (content.width) {
				imgStyles.width = content.width + 'px'
			}

			if (content.height) {
				imgStyles.height = content.height + 'px'
			}
			isCustom = true
		}

		const hasImage = content.url && content.url.length !== 0
		const hasAltText = content.alt && content.alt.length !== 0

		return (
			<div className={`obojobo-draft--chunks--figure viewer ` + content.size}>
				{this.renderEditToolbar()}
				<div className={'container'}>
					{hasAltText ? null : <div>Accessibility Warning: No Alt Text!</div>}

					{hasImage ? null : <div>No Image Selected, Please Add an Image URL</div>}

					{isCustom ? (
						<img
							title={content.alt}
							src={content.url}
							unselectable="on"
							alt={content.alt}
							style={imgStyles}
						/>
					) : (
						<img title={content.alt} src={content.url} unselectable="on" alt={content.alt} />
					)}
					{/* uses children below because the caption is a textgroup */}
					<figcaption>{this.props.children}</figcaption>
				</div>
			</div>
		)
	}
}

const insertNode = change => {
	change
		.insertBlock(Block.fromJSON(emptyNode))
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
				return <Node {...props} {...props.attributes} />
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
				nodes: [
					{
						match: [{ object: 'text' }],
						min: 0
					}
				]
			}
		}
	}
}

const Figure = {
	name: FIGURE_NODE,
	components: {
		Node,
		Icon
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate
	},
	json: {
		emptyNode
	},
	plugins
}

export default Figure
