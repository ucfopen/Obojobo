import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import { Editor, Element, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import ListStyles from './list-styles'
import Common from 'obojobo-document-engine/src/scripts/common'
const { Button } = Common.components

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const oppositeListType = type =>
	type === ListStyles.TYPE_ORDERED ? ListStyles.TYPE_UNORDERED : ListStyles.TYPE_ORDERED

const toggleType = props => {
	const currentContent = props.element.content

	const newType = oppositeListType(currentContent.listStyles.type)

	// get the bullet list
	const bulletList =
		newType === ListStyles.TYPE_UNORDERED
			? ListStyles.UNORDERED_LIST_BULLETS
			: ListStyles.ORDERED_LIST_BULLETS

	let listStyles = {
		type: newType,
		indents: {}
	}

	if (currentContent.listStyles.indents) {
		const keys = Object.keys(currentContent.listStyles.indents)
		keys.forEach(key => {
			const bulletStyle = bulletList[parseInt(key, 10) % bulletList.length]
			listStyles.indents[key] = { type: newType, bulletStyle }
		})
	}

	const newContent = { content: { ...currentContent, listStyles: listStyles } }

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

		for (const [levelNode, levelPath] of levelNodes) {
			Transforms.setNodes(props.editor, { content: { type: newType } }, { at: levelPath })
		}
	})
}

class List extends React.Component {
	render() {
		console.log(this.props)
		const otherType = oppositeListType(this.props.element.content.listStyles.type)
		return (
			<Node {...this.props}>
				<div className={'text-chunk obojobo-draft--chunks--list pad'}>
					{this.props.children}
					<Button
						altAction
						onClick={() => toggleType(this.props)}
					>{`Switch to ${otherType}`}</Button>
				</div>
			</Node>
		)
	}
}

export default withSlateWrapper(List)
