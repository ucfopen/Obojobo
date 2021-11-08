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
import {
	freezeEditor,
	unfreezeEditor
} from 'obojobo-document-engine/src/scripts/oboeditor/util/freeze-unfreeze-editor'
import ImageCaptionWidthTypes from './image-caption-width-types'

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

		this.figureRef = React.createRef()

		this.focusFigure = this.focusFigure.bind(this)
		this.deleteNode = this.deleteNode.bind(this)
		this.showImagePropertiesModal = this.showImagePropertiesModal.bind(this)
		this.changeProperties = this.changeProperties.bind(this)
		this.returnFocusOnTab = this.returnFocusOnTab.bind(this)
		this.returnFocusOnShiftTab = this.returnFocusOnShiftTab.bind(this)
		this.onCloseImagePropertiesModal = this.onCloseImagePropertiesModal.bind(this)

		this.selectFigureText = this.selectFigureText.bind(this)
	}

	selectFigureText() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		const start = Editor.start(this.props.editor, path)
		Transforms.setSelection(this.props.editor, {
			focus: start,
			anchor: start
		})
	}

	componentDidUpdate(previousProps) {
		// If we're moving from a floating image to a non-floating image
		if (!this.props.element.content.wrapText && previousProps.element.content.wrapText) {
			// Replace the child's text with what we were storying in 'captionText'
			const captionText = this.props.element.content.captionText

			// Set the selection to the beginning of the text block
			this.selectFigureText()
			// // Delete the entire contents of the editor's text component then replace it with the caption
			Editor.deleteForward(this.props.editor, { unit: 'block' })
			Editor.insertText(this.props.editor, captionText)
		}
	}

	focusFigure() {
		if (!this.props.selected) {
			this.selectFigureText()
		}
	}

	deleteNode() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.removeNodes(this.props.editor, { at: path })
	}

	showImagePropertiesModal() {
		freezeEditor(this.props.editor)

		const originalCaptionText = this.props.children.props.node.children[0].text

		ModalUtil.show(
			<ImageProperties
				allowedUploadTypes={EditorStore.state.settings.allowedUploadTypes}
				content={this.props.element.content}
				originalCaptionText={originalCaptionText}
				onConfirm={this.changeProperties}
				onCancel={this.onCloseImagePropertiesModal}
			/>
		)
	}

	onCloseImagePropertiesModal() {
		ModalUtil.hide()
		unfreezeEditor(this.props.editor)
	}

	returnFocusOnTab(event) {
		if (event.key === 'Tab' && !event.shiftKey) {
			event.preventDefault()
			return ReactEditor.focus(this.props.editor)
		}
	}

	returnFocusOnShiftTab(event) {
		if (event.key === 'Tab' && event.shiftKey) {
			event.preventDefault()
			return ReactEditor.focus(this.props.editor)
		}
	}

	changeProperties(content) {
		this.onCloseImagePropertiesModal()
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
		const captionWidth = content.captionWidth || ImageCaptionWidthTypes.IMAGE_WIDTH

		const customStyle = {}
		const captionStyle = {}
		if (content.size === 'custom') {
			if (content.width) {
				customStyle.width = content.width + 'px'

				if (captionWidth === ImageCaptionWidthTypes.IMAGE_WIDTH) {
					captionStyle.width = content.width + 'px'
				}
			}

			customStyle['maxWidth'] = '100%'
		}

		const textWrapped = content.wrapText ?? false
		const captionText = textWrapped ? content.captionText : this.props.children

		const wrapTextRender = textWrapped ? (
			<div className={'text-chunk pad'}>{this.props.children}</div>
		) : null

		// prevent user selection in addition to 'contentEditable=false' below to quiet Slate errors
		if (textWrapped) {
			captionStyle.userSelect = 'none'
		}

		// store all of the classes to be applied to the figure's parent element, to be collapsed to a string below
		const figureContainerClasses = [
			'figure-parent',
			'viewer',
			isOrNot(textWrapped, 'wrapped-text'),
			`${content.float ?? 'left'}-float`,
			content.size,
			isSelected
		]

		return (
			<Node {...this.props}>
				<div className={`obojobo-draft--chunks--figure`}>
					<div ref={this.figureRef} className={figureContainerClasses.join(' ')}>
						{hasAltText ? null : (
							<div
								contentEditable={false}
								className="accessibility-warning"
								style={{ userSelect: 'none' }}
							>
								Accessibility Warning: No Alt Text!
							</div>
						)}
						<figure className={'container'}>
							<div
								className={`figure-box  ${isSelected}`}
								style={customStyle}
								contentEditable={false}
								onClick={this.focusFigure}
							>
								<Button
									className="delete-button"
									onClick={this.deleteNode}
									onKeyDown={this.returnFocusOnShiftTab}
									tabIndex={selected ? '0' : '-1'}
								>
									×
								</Button>
								<div className="image-toolbar">
									<Button
										className="properties-button"
										onClick={this.showImagePropertiesModal}
										onKeyDown={this.returnFocusOnTab}
										tabIndex={selected ? '0' : '-1'}
									>
										Image Properties
									</Button>
								</div>
								<Image
									style={customStyle}
									key={content.url + content.width + content.height + content.size}
									chunk={{ modelState: content }}
									lazyLoad={false}
								/>
							</div>
							<figcaption
								className={`align-center is-caption-width-${captionWidth}`}
								style={captionStyle}
								contentEditable={!textWrapped}
								suppressContentEditableWarning={true}
							>
								{captionText}
							</figcaption>
						</figure>
					</div>
					{wrapTextRender}
				</div>
			</Node>
		)
	}
}

export default withSlateWrapper(Figure)
