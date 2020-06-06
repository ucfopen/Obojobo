import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const TABLE_NODE = 'ObojoboDraft.Chunks.Table'
const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

/**
 * Generates an Obojobo Table Node from a Slate node.
 * Copies the id, type, triggers, and heading, and condenses
 * Rows and Columns (and their text children - including marks)
 * into a gridTextGroup
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Table node
 */
const slateToObo = node => {
	const textGroup = node.children.flatMap(row => {
		return row.children.map(cell => {
			const textLine = {
				text: { value: '', styleList: [] }
			}

			TextUtil.slateToOboText(cell, textLine)

			return textLine
		})
	})

	return {
		id: node.id,
		type: node.type,
		children: [],
		content: withoutUndefined({
			triggers: node.content.triggers,
			header: node.content.header,
			textGroup: {
				numRows: node.children.length,
				numCols: node.children[0].children.length,
				textGroup
			}
		})
	}
}

/**
 * Generates a Slate node from an Obojobo Code node.
 * Copies all attributes, and converts a textGroup into Slate Text children
 * Each textItem in the textgroup becomes a separate CodeLine node in order
 * to properly leverage the Slate Editor's capabilities
 * @param {Object} node An Obojobo Code node
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.content.numCols = node.content.textGroup.numCols
	slateNode.content.numRows = node.content.textGroup.numRows
	slateNode.children = []

	let currRow
	node.content.textGroup.textGroup.forEach((line, index) => {
		if (index % slateNode.content.numCols === 0) {
			currRow = {
				type: TABLE_NODE,
				subtype: TABLE_ROW_NODE,
				content: {
					header: node.content.header && slateNode.children.length === 0,
					numCols: slateNode.content.numCols
				},
				children: []
			}
			slateNode.children.push(currRow)
		}

		// create table cell
		currRow.children.push({
			type: TABLE_NODE,
			subtype: TABLE_CELL_NODE,
			content: { header: node.content.header && index < slateNode.content.numCols },
			children: TextUtil.parseMarkings(line)
		})
	})

	return slateNode
}

export default { slateToObo, oboToSlate }
