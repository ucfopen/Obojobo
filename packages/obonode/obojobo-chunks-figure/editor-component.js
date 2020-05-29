import './viewer-component.scss'
import './editor-component.scss'

import { ReactEditor } from 'slate-react'
import { Editor, Transforms } from 'slate'

import Common from 'obojobo-document-engine/src/scripts/common'
import EditorStore from 'obojobo-document-engine/src/scripts/oboeditor/stores/editor-store'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import Image from './image'
import ImageProperties from './image-properties-modal'
import React from 'react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

const { ModalUtil } = Common.util
const { Button } = Common.components

/**
 * Display an Obojobo Figure node.  Users can type below the figure to add a caption.
 * When the node is selected, the figure is outlined, and a delete button and image properties
 * button appear.  The Image properties button opens up a modal that alows the user to
 * select an image, and set its size and alt text. Clicking on the image when it is not selected
 * will move the cursor to the start of the figurecaption
 */
class Figure extends React.Component {
	constructor(props) {
		super(props)
		this.focusFigure = this.focusFigure.bind(this)
		this.deleteNode = this.deleteNode.bind(this)
		this.showImagePropertiesModal = this.showImagePropertiesModal.bind(this)
		this.changeProperties = this.changeProperties.bind(this)
	}
	focusFigure() {
		if (!this.props.selected) {
			const path = ReactEditor.findPath(this.props.editor, this.props.element)
			const start = Editor.start(this.props.editor, path)
			Transforms.setSelection(this.props.editor, {
				focus: start,
				anchor: start
			})
		}
	}

	deleteNode() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.removeNodes(this.props.editor, { at: path })
	}

	showImagePropertiesModal() {
		ModalUtil.show(
			<ImageProperties
				allowedUploadTypes={EditorStore.state.settings.allowedUploadTypes}
				content={this.props.element.content}
				onConfirm={this.changeProperties}
			/>
		)
	}

	changeProperties(content) {
		ModalUtil.hide()
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, ...content } },
			{ at: path }
		)
	}

	render() {
		const { content } = this.props.element
		const hasAltText = content.alt && content.alt.length !== 0
		const selected = this.props.selected
		const isSelected = isOrNot(selected, 'selected')

		const customStyle = {}
		if (content.size === 'custom') {
			if (content.width) {
				customStyle.width = content.width + 'px'
			}

			if (content.height) {
				customStyle.height = content.height + 'px'
			}

			customStyle['maxWidth'] = '100%'
		}
		return (
			<Node {...this.props}>
				<div className={`obojobo-draft--chunks--figure viewer ${content.size} ${isSelected}`}>
					{hasAltText ? null : (
						<div
							contentEditable={false}
							className="accessibility-warning"
							style={{ userSelect: 'none' }}
						>
							Accessibility Warning: No Alt Text!
						</div>
					)}
					<figure className="container" style={customStyle}>
						<div
							className={`figure-box  ${isSelected}`}
							contentEditable={false}
							onClick={this.focusFigure}
						>
							<Button className="delete-button" onClick={this.deleteNode}>
								×
							</Button>
							<div className="image-toolbar">
								<Button className="properties-button" onClick={this.showImagePropertiesModal}>
									Image Properties
								</Button>
							</div>
							<Image
								key={content.url + content.width + content.height + content.size}
								chunk={{ modelState: content }}
								lazyLoad={false}
							/>
						</div>
						<figcaption className="align-center">{this.props.children}</figcaption>
					</figure>
				</div>
			</Node>
		)
	}
}

export default withSlateWrapper(Figure)
