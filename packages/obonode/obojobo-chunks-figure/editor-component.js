import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import ImageProperties from './image-properties-modal'
import Image from './image'

const { ModalUtil } = Common.util
const { Button } = Common.components
const isOrNot = Common.util.isOrNot

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

	onImageClick() {
		this.setState({ imageIsSelected: true })
	}

	showImagePropertiesModal() {
		ModalUtil.show(
			<ImageProperties
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

		return editor.removeNodeByKey(this.props.node.key)
	}

	renderEditToolbar() {
		return (
			<div className="image-toolbar">
				<Button className="properties-button" onClick={this.showImagePropertiesModal.bind(this)}>
					Image Properties
				</Button>
			</div>
		)
	}

	render() {
		const content = this.props.node.data.get('content')
		const isSelected = this.props.isSelected

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

		return (
			<div className={`obojobo-draft--chunks--figure viewer ${content.size}`}>
				<div className="container">
					{hasAltText ? null : <div>Accessibility Warning: No Alt Text!</div>}
					<div
						className={
							'figure-box ' + isOrNot(isSelected || this.state.imageIsSelected, 'selected')
						}
						onClick={this.onImageClick.bind(this)}
					>
						<Button className="delete-button" onClick={this.deleteNode.bind(this)}>
							×
						</Button>
						{this.renderEditToolbar()}
						<Image chunk={{ modelState: content }} />
					</div>

					{/* uses children below because the caption is a textgroup */}
					<figcaption>{this.props.children}</figcaption>
				</div>
			</div>
		)
	}
}

export default Figure
