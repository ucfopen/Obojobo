import { Editor, Transforms, Range, Element } from 'slate'
import { ReactEditor } from 'slate-react'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

const onBackspace = (node, editor, event) => {
	const nodePath = ReactEditor.findPath(editor, node)
	const nodeRange = Editor.range(editor, nodePath)
	const [startLine] = Array.from(Editor.nodes(editor, {
		at: Range.intersection(editor.selection, nodeRange),
		match: child => child.subtype === LIST_LINE_NODE
	}))
	const [lineNode, linePath] = startLine
	const startLineRange = Editor.range(editor, linePath)

	// If we are deleting multiple things or we are not at the start of the line, stop here
	// Returning before the preventDefault allows Slate to handle the backspace
	if (!Range.isCollapsed(editor.selection) || !Editor.isStart(editor, editor.selection.focus, startLineRange)) {
		return 
	}


	// Get the deepest level that contains this line
	const [listLevel, levelPath] = Editor.parent(editor, linePath)

	// If we are at the start of the list, we have to pop out the first line
	// If we don't do this, Slate deletes the entire list due to an unwrapping bug
	if(Editor.isStart(editor, editor.selection.focus, nodeRange)) {
		event.preventDefault()
		// Get the previous Element
		const before = Editor.before(editor, nodePath)
		if(!before) return

		const [prevElement] = Editor.nodes(editor, { 
			at: before, 
			match: child => Element.isElement(child), 
			mode: 'lowest'
		})
		const [prevNode, prevPath] = prevElement
		
		return Editor.withoutNormalizing(editor, () => {
			// Move the text nodes to the end of the previous element
			Transforms.moveNodes(editor, { 
				at: startLineRange, 
				match: child => lineNode.children.includes(child),
				to: prevPath.concat(prevNode.children.length)
			})

			// Remove listLine
			Transforms.removeNodes(editor, { at: linePath })

			// Remove all empty parents
			let parent = listLevel
			let parentPath = levelPath
			while(parent) {
				if(parent.type !== LIST_NODE || parent.children.length > 1) break
				
				const temp = parentPath;
				[parent, parentPath] = Editor.parent(editor, temp)
				Transforms.removeNodes(editor, { at: temp })
			}
		})
	}

	// levels with more than one child should delete normally
	if (listLevel.children.length > 1) return

	// At this point, we are definitely going to take a custom action,
	// so prevent the Slate editor from handling the button press
	event.preventDefault()

	// Get the deepest level that holds the listLevel
	const [oneLevelUp, oneLevelUpPath] = Editor.parent(editor, levelPath)

	// If it is a nested item, move it up one layer
	if (oneLevelUp.subtype === LIST_LEVEL_NODE) {
		return Transforms.liftNodes(editor, { at: linePath })
	}

	// If it is at the top level of an empty list, delete the whole list
	Transforms.removeNodes(editor, { at: oneLevelUpPath })
}

export default onBackspace
