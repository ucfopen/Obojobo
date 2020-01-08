import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import {
	useEditor,
	useSelected,
	ReactEditor
} from 'slate-react'
import { Transforms } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

const { Button } = Common.components

const toggleSize = (editor, element) => {
	const width = element.content.width === 'normal' ? 'large' : 'normal'
	const path = ReactEditor.findPath(editor, element)
	Transforms.setNodes(editor, { content: {...element.content, width} }, { at: path })
}

const renderButton = (editor, element) => {
	return (
		<div className="buttonbox-box" contentEditable={false}>
			<div className="box-border">
				<Button className="toggle-size" onClick={toggleSize.bind(this, editor, element)}>
					Toggle Size
				</Button>
			</div>
		</div>
	)
}

const Break = props => {
	const selected = useSelected()
	const editor = useEditor()
	return (
		<Node {...props}>
			<div
				className={`non-editable-chunk obojobo-draft--chunks--break viewer width-${
					props.element.content.width
				}`}>
				<hr />
				{props.children}
				{selected ? renderButton(editor, props.element) : null}
			</div>
		</Node>
	)
}

export default Break
