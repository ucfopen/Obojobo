import { Transforms, Node, Element, Text, Editor, Path } from 'slate'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'

const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

const normalizeNode = (entry, editor, next) => {
	const [node, path] = entry

	// If the element is a Table, make sure it only has rows
	if (Element.isElement(node) && node.type === TABLE_NODE && !node.subtype) {
		let index = 0
		for (const [child, childPath] of Node.children(editor, path)) {
			if(Element.isElement(child) && child.subtype !== TABLE_ROW_NODE){
				Transforms.removeNodes(
					editor,
					{ at: childPath }
				)
				return
			}

			// Wrap loose text children in a Row
			if (Text.isText(child)) {
				Transforms.wrapNodes(
					editor, 
					{
						type: TABLE_NODE,
						subtype: TABLE_ROW_NODE,
						content: { 
							header: node.content.header && index === 0,
							numCols: node.content.numCols
						},
					},
					{ at: childPath }
				)
				return
			}

			// Make sure row attributes are properly maintained
			if(child.content.numCols < node.content.numCols){
				Transforms.setNodes(editor, {
					content: { ...child.content, numCols: node.content.numCols}
				}, { at: childPath })
			}
			if(child.content.numCols > node.content.numCols){
				Transforms.setNodes(editor, {
					content: { ...node.content, numCols: child.content.numCols}
				}, { at: path })
			}
			if(index === 0 && child.content.header !== node.content.header){
				Transforms.setNodes(editor, {
					content: { ...child.content, header: node.content.header}
				}, { at: childPath })
			}
			if(index !== 0 && child.content.header){
				Transforms.setNodes(editor, {
					content: { ...child.content, header: false}
				}, { at: childPath })
			}

			index++
		}

		// Make sure that children.length and numRows are consistant
		if(node.children.length < node.content.numRows) {
			Transforms.insertNodes(
				editor, 
				{
					type: TABLE_NODE,
					subtype: TABLE_ROW_NODE,
					content: { 
						header: node.content.header && index === 0,
						numCols: node.content.numCols
					},
					children: [{ text: '' }]
				},
				{ at: path.concat(node.children.length) }
			)
			return
		}
		if(node.children.length > node.content.numRows) {
			Transforms.setNodes(editor, {
				content: { ...node.content, numRows: node.children.length }
			}, { at: path })
			return
		}
	}

	// If the element is a TableRow, make sure it only has cell children
	if (Element.isElement(node) && node.subtype === TABLE_ROW_NODE) {
		for (const [child, childPath] of Node.children(editor, path)) {
			if(Element.isElement(child) && child.subtype !== TABLE_CELL_NODE){
				if(child.subtype === TABLE_ROW_NODE){
					Transforms.moveNodes(editor, { at: childPath, to: Path.next(path)})
					return
				}
				Transforms.liftNodes(editor, { at: childPath })
				return
			}

			// Wrap loose text children in a Cell
			if (Text.isText(child)) {
				Transforms.wrapNodes(
					editor, 
					{
						type: TABLE_NODE,
						subtype: TABLE_CELL_NODE,
						content: { 
							header: node.content.header,
						},
					},
					{ at: childPath }
				)
				return
			}

			// Make sure cell attributes are properly maintained
			if(child.content.header !== node.content.header){
				Transforms.setNodes(editor, {
					content: { ...child.content, header: node.content.header}
				}, { at: childPath })
			}
		}

		// Make sure that children.length and numCols are consistant
		if(node.children.length < node.content.numCols) {
			Transforms.insertNodes(
				editor, 
				{
					type: TABLE_NODE,
					subtype: TABLE_CELL_NODE,
					content: { 
						header: node.content.header,
					},
					children: [{ text: '' }]
				},
				{ at: path.concat(node.children.length) }
			)
			return
		}
		if(node.children.length > node.content.numCols) {
			Transforms.setNodes(editor, {
				content: { ...node.content, numCols: node.children.length }
			}, { at: path })
			return
		}

		// TableRow parent normalization
		const [parent] = Editor.parent(editor, path)
		if(!Element.isElement(parent) || parent.type !== TABLE_NODE) {
			NormalizeUtil.wrapOrphanedSiblings(
				editor, 
				entry, 
				{ 
					type: TABLE_NODE,
					content: { 
						header: node.content.header, 
						numCols: node.content.numCols, 
						numRows: 1 
					},
					children: []
				}, 
				node => node.subtype === TABLE_ROW_NODE || node.subtype === TABLE_CELL_NODE
			)
			return
		}
	}

	// If the element is a TableCell, make sure it only has text children
	if (Element.isElement(node) && node.subtype === TABLE_CELL_NODE) {
		for (const [child, childPath] of Node.children(editor, path)) {
			if(Element.isElement(child)){
				Transforms.liftNodes(editor, { at: childPath })
				return
			}
		}

		// TableCell parent normalization
		const [parent] = Editor.parent(editor, path)
		if(!Element.isElement(parent) || parent.subtype !== TABLE_ROW_NODE) {
			NormalizeUtil.wrapOrphanedSiblings(
				editor, 
				entry, 
				{ 
					type: TABLE_NODE,
					subtype: TABLE_ROW_NODE, 
					content: { header: node.content.header, numCols: 1 },
					children: []
				}, 
				node => node.subtype === TABLE_CELL_NODE
			)
			return
		}
	}

	next(entry, editor)
}

export default normalizeNode