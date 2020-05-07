import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import ListStyles from './list-styles'
import Common from 'obojobo-document-engine/src/scripts/common'

const { Button } = Common.components

const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const oppositeListType = type =>
	type === ListStyles.TYPE_ORDERED ? ListStyles.TYPE_UNORDERED : ListStyles.TYPE_ORDERED

const toggleType = props => {
	const currentContent = props.element.content

	const newType = oppositeListType(currentContent.listStyles.type)

	const newContent = {
		content: { ...props.element.content, listStyles: { type: newType, indents: {} } }
	}

	Editor.withoutNormalizing(props.editor, () => {
		const listPath = ReactEditor.findPath(props.editor, props.element)
		// update the list
		Transforms.setNodes(props.editor, newContent, { at: listPath })

		// search for all level nodes inside this list
		// so we can force them to redraw their bullets + li/ul tag
		// IDEA: we could limit this to only level nodes with a depth that changed?
		const levelNodes = Editor.nodes(props.editor, {
			mode: 'all',
			at: listPath,
			match: node => node.subtype === LIST_LEVEL_NODE
		})

		for (const [, levelPath] of levelNodes) {
			Transforms.setNodes(props.editor, { content: { type: newType } }, { at: levelPath })
		}
	})
}

const isOnlyThisNodeSelected = ({ editor, element, selected }) => {
	// quick test before doing more work
	// is there a selection and am I selected?
	if (!selected || !editor.selection) {
		return false
	}

	// use the length of this elements path
	// to test the selection ends
	const thisElPathLength = ReactEditor.findPath(editor, element).length
	// make sure the start and end of the selection
	// are this element or children of this element.
	// No need to check if they match this path because
	// they must be equal to both be in this element.
	// If they are equal, but not in this element
	// this code won't be reached.
	return (
		editor.selection.anchor.path.slice(0, thisElPathLength).toString() ===
		editor.selection.focus.path.slice(0, thisElPathLength).toString()
	)
}

const ListTypeSwitchButton = ({ onClick, switchToType }) => {
	return (
		<div className="buttonbox-box" contentEditable={false}>
			<div className="box-border">
				<Button className="toggle-header" altAction onClick={onClick}>
					{`Switch to ${switchToType}`}
				</Button>
			</div>
		</div>
	)
}

const List = props => {
	let switchButton = null
	if (isOnlyThisNodeSelected(props)) {
		switchButton = (
			<ListTypeSwitchButton
				onClick={() => toggleType(props)}
				switchToType={oppositeListType(props.element.content.listStyles.type)}
			/>
		)
	}

	return (
		<Node {...props}>
			<div className={'text-chunk obojobo-draft--chunks--list pad'}>
				{props.children}
				{switchButton}
			</div>
		</Node>
	)
}

export default withSlateWrapper(List)
