import { Editor, Transforms, Node, Element } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

import generateId from '../generate-ids'

const { OboModel } = Common.models

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

const resetNodeId = (node, deep) => {
	node = JSON.parse(JSON.stringify(node))

	// Create the obomodel to check if we need to set the key
	// if node.type is undefined, model will be null
	const model = OboModel.create(node.type)

	// Only nodes with valid models need to be reset
	// Setting the id on the model prevents duplicate keys
	// in the MoreInfoBox
	if (model) {
		node.id = generateId()
		model.setId(node.id)
	}

	if (deep && node.children) {
		node.children = node.children.map(child => resetNodeId(child, deep))
	}

	return node
}

const OboNodePlugin = {
	normalizeNode(entry, editor, next) {
		const [node, path] = entry

		// Normalization that apply to the base level editor
		if (Editor.isEditor(node)) {
			// Require that the editor always has at least a text node
			if (node.children.length === 0) {
				return Transforms.insertNodes(editor, {
					type: TEXT_NODE,
					content: {},
					children: [
						{
							type: TEXT_NODE,
							subtype: TEXT_LINE_NODE,
							content: { align: 'left', indent: 0 },
							children: [{ text: '' }]
						}
					]
				})
			}

			for (const [child, childPath] of Node.children(editor, path)) {
				// Unwrap non-Obojobo children
				if (
					!Common.Registry.insertableItems.some(item => item.type === child.type) &&
					child.type !== ASSESSMENT_NODE
				) {
					Transforms.unwrapNodes(editor, { at: childPath })
					return
				}
			}
		}

		next(entry, editor)
	},
	apply(op, editor, next) {
		// If we are not altering a node, apply the operation as normal
		if (!op.path) return next(op)

		// If we are altering an Obonode, adjust the ids accordingly
		let node
		switch (op.type) {
			case 'insert_node':
				// Only update the ids if the inserted node is a core Obojobo node
				if (!Element.isElement(op.node) || editor.isInline(op.node) || op.node.subtype) break

				// create new id
				op.node = resetNodeId(op.node, true)
				break
			case 'split_node':
				// Only update the ids if the node that will be split is a core Obojobo node
				node = Node.get(editor, op.path)
				if (!Element.isElement(node) || editor.isInline(node) || node.subtype) break

				op.properties = resetNodeId(op.properties)

				break
			case 'merge_node':
			case 'remove_node':
				// Only update the ids if the node that will be removed is a core Obojobo node
				node = Node.get(editor, op.path)
				if (!Element.isElement(node) || editor.isInline(node) || node.subtype) break

				// remove old id on delete
				delete OboModel.models[node.id]
		}

		next(op, editor)
	}
}

export default OboNodePlugin
