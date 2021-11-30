import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import { ReactEditor } from 'slate-react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import ListUtil from './list-util'
import Common from 'obojobo-document-engine/src/scripts/common'

const { Button } = Common.components

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
				onClick={() => ListUtil.toggleType(props.element, props.editor)}
				switchToType={ListUtil.oppositeListType(props.element.content.listStyles.type)}
			/>
		)
	}
	const contentDescription = [
		{
			name: 'spacing',
			description: 'List Spacing',
			type: 'select',
			values: [
				{
					value: 'compact',
					description: 'Compact'
				},
				{
					value: 'moderate',
					description: 'Moderate'
				},
				{
					value: 'generous',
					description: 'Generous'
				}
			]
		}
	]

	return (
		<Node {...props} contentDescription={contentDescription}>
			<div
				className={`text-chunk obojobo-draft--chunks--list pad is-spacing-${props.element.content.spacing}`}
			>
				{props.children}
				{switchButton}
			</div>
		</Node>
	)
}

export default withSlateWrapper(List)
