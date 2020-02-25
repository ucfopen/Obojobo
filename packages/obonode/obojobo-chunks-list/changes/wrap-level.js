import { Editor, Transforms, Range } from 'slate'
import ListStyles from '../list-styles'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'


const wrapLevel = (entry, editor, event) => {
	event.preventDefault()
	const [, nodePath] = entry
	const nodeRange = Editor.range(editor, nodePath)

	const list = Array.from(Editor.nodes(editor, {
		at: Range.intersection(editor.selection, nodeRange),
		mode: 'lowest',
		match: child => child.subtype === LIST_LINE_NODE
	}))

	// Normalization will merge consecutive ListLevels into a single node,
	// which can change the paths of subsequent ListLines. To keep the paths consistant,
	// prevent normalization until all Lines have been indented
	Editor.withoutNormalizing(editor, () => {
		for(const [, path] of list) {
			// Do not allow indenting past 20 (18 levels), because it will cause display errors
			if(path.length >= 20) continue
				
			const [parent,] = Editor.parent(editor, path)

			const bulletList =
			parent.content.type === 'unordered' ? ListStyles.UNORDERED_LIST_BULLETS : ListStyles.ORDERED_LIST_BULLETS
			const bulletStyle = bulletList[(bulletList.indexOf(parent.content.bulletStyle) + 1) % bulletList.length]
			
			Transforms.wrapNodes(
				editor, 
				{
					type: LIST_NODE,
					subtype: LIST_LEVEL_NODE,
					content: { type: parent.content.type, bulletStyle }
				},
				{
					at: path,
				}
			)
		}
	})
}

export default wrapLevel
