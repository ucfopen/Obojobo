// import '../../viewer-component.scss'

import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import React from 'react'
import { Editor, Range, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import getPresetProps from '../../get-preset-props'
import EdgeControls from '../edge-controls'
import ExcerptEditControls from '../excerpt-edit-controls'

import Common from 'obojobo-document-engine/src/scripts/common'
const { Button } = Common.components

const getEdgeOptionsForBodyStyle = bodyStyle => {
	switch (bodyStyle) {
		case 'callout-try-it':
		case 'callout-practice':
		case 'callout-do-this':
		case 'callout-example':
		case 'callout-hint':
		case 'none':
			return []

		case 'filled-box':
		case 'bordered-box':
		case 'card':
		case 'white-paper':
		case 'modern-paper':
		case 'light-yellow-paper':
		case 'dark-yellow-paper':
		case 'aged-paper':
			return ['normal', 'fade', 'jagged']

		default:
			return ['normal', 'fade']
	}
}

const ExcerptContent = props => {
	const onChangePreset = presetValue => {
		const [, parentPath] = Editor.parent(
			props.editor,
			ReactEditor.findPath(props.editor, props.element)
		)
		const newContent = {
			...props.element.content,
			...getPresetProps(presetValue),
			preset: presetValue
		}

		const path = ReactEditor.findPath(props.editor, props.element)

		// We copy props on ExcerptContent - this is done to force ExcerptContent to update
		Transforms.setNodes(props.editor, { content: { ...newContent } }, { at: path })
		Transforms.setNodes(props.editor, { content: { ...newContent } }, { at: parentPath })
	}

	const onChangeContentValue = (contentValueName, value) => {
		const [, parentPath] = Editor.parent(
			props.editor,
			ReactEditor.findPath(props.editor, props.element)
		)
		const path = ReactEditor.findPath(props.editor, props.element)

		const newContent = { ...props.element.content, [contentValueName]: value }

		Transforms.setNodes(props.editor, { content: { ...newContent } }, { at: path })
		Transforms.setNodes(props.editor, { content: { ...newContent } }, { at: parentPath })
	}

	const deleteExcerpt = () => {
		const [, parentPath] = Editor.parent(
			props.editor,
			ReactEditor.findPath(props.editor, props.element)
		)
		return Transforms.removeNodes(props.editor, { at: parentPath })
	}

	const edgeOptions = getEdgeOptionsForBodyStyle(props.element.content.bodyStyle)

	const shouldShowEdgeControls = props.selected && Range.isCollapsed(props.editor.selection)

	return (
		<div className="excerpt-content">
			{shouldShowEdgeControls ? (
				<React.Fragment>
					<EdgeControls
						position="top"
						edges={edgeOptions}
						selectedEdge={props.element.content.topEdge}
						onChangeEdge={edgeType => onChangeContentValue('topEdge', edgeType)}
					/>
					<EdgeControls
						position="bottom"
						edges={edgeOptions}
						selectedEdge={props.element.content.bottomEdge}
						onChangeEdge={edgeType => onChangeContentValue('bottomEdge', edgeType)}
					/>
					<ExcerptEditControls
						content={props.element.content}
						onChangeProp={(propName, propValue) => onChangeContentValue(propName, propValue)}
						onChangePreset={onChangePreset}
					/>
				</React.Fragment>
			) : null}

			<div className="wrapper">{props.children}</div>
			<div className="overlay" />
			<Button className="delete-button" onClick={deleteExcerpt} contentEditable={false}>
				×
			</Button>
		</div>
	)
}

export default withSlateWrapper(ExcerptContent)
