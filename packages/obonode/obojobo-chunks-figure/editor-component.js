import './viewer-component.scss'
import './editor-component.scss'

import {
	useEditor,
	useSelected,
	ReactEditor
} from 'slate-react'

import { Editor, Transforms } from 'slate'

import Common from 'obojobo-document-engine/src/scripts/common'
import EditorStore from 'obojobo-document-engine/src/scripts/oboeditor/stores/editor-store'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import Image from './image'
import ImageProperties from './image-properties-modal'
import React from 'react'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

const { ModalUtil } = Common.util
const { Button } = Common.components

const focusFigure = (editor, node, isSelected) => {
	if(!isSelected) {
		const path = ReactEditor.findPath(editor, node)
		const start = Editor.start(editor, path)
		Transforms.setSelection(editor, {
			focus: start,
			anchor: start
		})
	}
}

const deleteNode = (editor, node) => {
	const path = ReactEditor.findPath(editor, node)
	Transforms.removeNodes(editor, { at: path })
}

const showImagePropertiesModal = (editor, node) => {
	ModalUtil.show(
		<ImageProperties
			allowedUploadTypes={EditorStore.state.settings.allowedUploadTypes}
			content={node.content}
			onConfirm={changeProperties.bind(this, editor, node)}
		/>
	)
}

const changeProperties = (editor, node, content) => {
	ModalUtil.hide()
	const path = ReactEditor.findPath(editor, node)
	Transforms.setNodes(editor, { content: {...node.content, ...content} }, { at: path })
}

/**
 * Display an Obojobo Figure node.  Users can type below the figure to add a caption. 
 * When the node is selected, the figure is outlined, and a delete button and image properties
 * button appear.  The Image properties button opens up a modal that alows the user to 
 * select an image, and set its size and alt text. Clicking on the image when it is not selected
 * will move the cursor to the start of the figurecaption
 */
const Figure = props => {
	const { content } = props.element
	const hasAltText = content.alt && content.alt.length !== 0
	const selected = useSelected()
	const editor = useEditor()
	const isSelected = isOrNot(selected, 'selected')

	return (
		<Node {...props}>
			<div className={`obojobo-draft--chunks--figure viewer ${content.size} ${isSelected}`}>
				<figure className="container">
					{hasAltText ? null : (
						<div 
							contentEditable={false} 
							className="accessibility-warning"
							style={{ userSelect: "none" }}>
							Accessibility Warning: No Alt Text!
						</div>
					)}
					<div 
						className={`figure-box  ${isSelected}`} 
						contentEditable={false}
						onClick={focusFigure.bind(this, editor, props.element, selected)}>
						<Button 
							className="delete-button" 
							onClick={deleteNode.bind(this, editor, props.element)}>
							×
						</Button>
						<div className="image-toolbar">
							<Button
								className="properties-button"
								onClick={showImagePropertiesModal.bind(this, editor, props.element)}>
								Image Properties
							</Button>
						</div>
						<Image
							key={content.url + content.width + content.height + content.size}
							chunk={{ modelState: content }}
						/>
					</div>
					<figcaption className="align-center">{props.children}</figcaption>
				</figure>
			</div>
		</Node>
	)
}

export default Figure
