import './viewer-component.scss'

import React from 'react'
import {
	useEditor,
	useSelected,
	ReactEditor
} from 'slate-react'
import { Editor, Transforms } from 'slate'

import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

import IframeProperties from './iframe-properties-modal'

import './editor-component.scss'

const { ModalUtil } = Common.util
const { Button } = Common.components
const isOrNot = Common.util.isOrNot

const focusIframe = (editor, node) => {
	const path = ReactEditor.findPath(editor, node)
	const start = Editor.start(editor, path)
	Transforms.setSelection(editor, {
		focus: start,
		anchor: start
	})
}

const showIFramePropertiesModal = (editor, node) => {
	ModalUtil.show(
		<IframeProperties
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

const getTitle = (src, title) => {
	if (src === null) {
		return 'IFrame missing src attribute'
	} else if (title) {
		return title
	}

	return src.replace(/^https?:\/\//, '')
}

const deleteNode = (editor, node) => {
	const path = ReactEditor.findPath(editor, node)
	Transforms.removeNodes(editor, { at: path })
}

const IFrame = props => {
	const content = props.element.content
	const selected = useSelected()
	const editor = useEditor()

	const previewStyle = {
		height: (content.height || '500') + 'px',
		userSelect: 'none'
	}

	const className =
		'obojobo-draft--chunks--iframe viewer pad is-previewing ' +
		isOrNot(content.border, 'bordered') +
		' is-not-showing ' +
		' is-controls-enabled ' +
		isOrNot(!content.src, 'missing-src') +
		isOrNot(content.initialZoom > 1, 'scaled-up')

	const isSelected = isOrNot(selected, 'selected')

	return (
		<Node {...props}>
			<div className={className}>
				<div 
					className={`editor-container  ${isSelected}`} 
					style={previewStyle}
					onClick={focusIframe.bind(this, editor, props.element)}>
					<Button className="delete-button" onClick={deleteNode.bind(this, editor, props.element)}>
						×
					</Button>
					<div className="iframe-toolbar">
						<span className="title" aria-hidden>
							{getTitle(content.src || null, content.title)}
						</span>
						<Button
							className="properties-button"
							onClick={showIFramePropertiesModal.bind(this, editor, props.element)}>
							IFrame Properties
						</Button>
					</div>
				</div>
			</div>
			{props.children}
		</Node>
	)
}

export default IFrame
