import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import ListStyles from './list-styles'

const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const oppositeListType = type =>
	type === ListStyles.TYPE_ORDERED ? ListStyles.TYPE_UNORDERED : ListStyles.TYPE_ORDERED

const toggleType = (element, editor) => {
	const currentContent = element.content

	const newType = oppositeListType(currentContent.listStyles.type)

	const newContent = {
		content: { ...element.content, listStyles: { type: newType, indents: {} } }
	}

	Editor.withoutNormalizing(editor, () => {
		const listPath = ReactEditor.findPath(editor, element)
		// update the list
		Transforms.setNodes(editor, newContent, { at: listPath })

		// search for all level nodes inside this list
		// so we can force them to redraw their bullets + li/ul tag
		// IDEA: we could limit this to only level nodes with a depth that changed?
		const levelNodes = Editor.nodes(editor, {
			mode: 'all',
			at: listPath,
			match: node => node.subtype === LIST_LEVEL_NODE
		})

		for (const [, levelPath] of levelNodes) {
			Transforms.setNodes(editor, { content: { type: newType } }, { at: levelPath })
		}
	})
}

export default {
	oppositeListType,
	toggleType
}
