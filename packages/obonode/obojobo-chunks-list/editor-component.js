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

class List extends React.Component {
	isOnlyThisNodeSelected() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		const s = this.props.editor.selection

		return (
			s &&
			s.anchor.path.slice(0, path.length).toString() ===
				s.focus.path.slice(0, path.length).toString() &&
			this.props.selected
		)
	}

	renderButton() {
		const otherType = oppositeListType(this.props.element.content.listStyles.type)

		return (
			<div className="buttonbox-box" contentEditable={false}>
				<div className="box-border">
					<Button className="toggle-header" altAction onClick={() => toggleType(this.props)}>
						{`Switch to ${otherType}`}
					</Button>
				</div>
			</div>
		)
	}

	render() {
		return (
			<Node {...this.props}>
				<div className={'text-chunk obojobo-draft--chunks--list pad'}>
					{this.props.children}
					{this.isOnlyThisNodeSelected() ? this.renderButton() : null}
				</div>
			</Node>
		)
	}
}

export default withSlateWrapper(List)
