import './viewer-component.scss'
import './editor-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import EditorStore from 'obojobo-document-engine/src/scripts/oboeditor/stores/editor-store'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import Image from './image'
import ImageProperties from './image-properties-modal'
import React from 'react'

const { ModalUtil } = Common.util
const { Button } = Common.components

class Figure extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			imageIsSelected: false
		}

		this.handleClick = this.handleClick.bind(this)
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClick, false)
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClick, false)
	}

	handleClick(event) {
		if (!this.node || this.node.contains(event.target)) return
		this.setState({ imageIsSelected: false })
	}

	showImagePropertiesModal() {
		ModalUtil.show(
			<ImageProperties
				allowedUploadTypes={EditorStore.state.settings.allowedUploadTypes}
				content={this.props.node.data.get('content')}
				onConfirm={this.changeProperties.bind(this)}
			/>
		)
	}

	changeProperties(content) {
		const editor = this.props.editor
		editor.setNodeByKey(this.props.node.key, {
			data: { content }
		})
	}

	deleteNode() {
		const editor = this.props.editor
		editor.removeNodeByKey(this.props.node.key)
	}

	render() {
		const content = this.props.node.data.get('content')

		const isCustom = content.size === 'custom'
		const imgStyles = {}

		if (isCustom) {
			if (content.width) {
				imgStyles.width = content.width + 'px'
			}

			if (content.height) {
				imgStyles.height = content.height + 'px'
			}
		}

		const hasAltText = content.alt && content.alt.length !== 0

		const contentDescription = [
			{
				name: 'alt',
				description: 'Alt Text',
				type: 'input'
			},
			{
				name: 'url',
				description: 'URL',
				type: 'input'
			},
			{
				name: 'size',
				description: 'Size',
				type: 'select',
				values: [
					{
						value: 'small',
						description: 'Small'
					},
					{
						value: 'medium',
						description: 'Medium'
					},
					{
						value: 'large',
						description: 'Large'
					},
					{
						value: 'custom',
						description: 'Custom'
					},
				]
			},
			{
				name: 'width',
				description: 'Width',
				type: 'input'
			},
			{
				name: 'height',
				description: 'Height',
				type: 'input'
			}
		]

		return (
			<Node {...this.props} contentDescription={contentDescription}>
				<div className={`obojobo-draft--chunks--figure viewer ${content.size}`}>
					<div className="container">
						{hasAltText ? null : <div contentEditable={false}>Accessibility Warning: No Alt Text!</div>}
						<div className="figure-box" contentEditable={false}>
							<Button 
								className="delete-button" 
								onClick={this.deleteNode.bind(this)}>
								×
							</Button>
							<div className="image-toolbar">
								<Button
									className="properties-button"
									onClick={this.showImagePropertiesModal.bind(this)}
								>
									Image Properties
								</Button>
							</div>
							<Image
								key={content.url + content.width + content.height + content.size}
								chunk={{ modelState: content }}
							/>
						</div>

						{/* uses children below because the caption is a textgroup */}
						<figcaption>{this.props.children}</figcaption>
					</div>
				</div>
			</Node>
		)
	}
}

export default Figure
