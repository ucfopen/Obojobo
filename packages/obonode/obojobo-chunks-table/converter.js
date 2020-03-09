import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'
const TABLE_CAPTION_NODE = 'ObojoboDraft.Chunks.Table.Caption'

const slateToObo = node => {
	const content = node.data.get('content') || { textGroup: {} }
	content.header = node.nodes.get(0).data.get('content').header

	content.textGroup.numRows = node.nodes.size - 1
	content.textGroup.numCols = node.nodes.get(1).data.get('content').numCols
	content.textGroup.textGroup = []

	node.nodes.forEach(row => {
		if (row.type === TABLE_CAPTION_NODE) {
			const cellLine = {
				text: { value: row.text, styleList: [] }
			}

			row.nodes.forEach(text => {
				TextUtil.slateToOboText(text, cellLine)
			})

			content.textGroup.caption = cellLine
			return
		}

		row.nodes.forEach(cell => {
			const cellLine = {
				text: { value: cell.text, styleList: [] }
			}

			cell.nodes.forEach(text => {
				TextUtil.slateToOboText(text, cellLine)
			})

			content.textGroup.textGroup.push(cellLine)
		})
	})

	return {
		id: node.key,
		type: node.type,
		children: [],
		content: withoutUndefined(content)
	}
}

const oboToSlate = node => {
	const nodes = []
	const content = node.content
	const numCols = node.content.textGroup.numCols
	const numRows = node.content.textGroup.numRows
	const hasHeader = node.content.header
	let currRow

	// Add the numCols and NumRows to the content, for more efficent normalization
	content.numCols = numCols
	content.numRows = numRows

	if (node.content.textGroup.caption) {
		nodes.push({
			object: 'block',
			type: TABLE_CAPTION_NODE,
			data: { content: { header: hasHeader && nodes.length === 0, numCols } },
			nodes: [
				{
					object: 'text',
					leaves: TextUtil.parseMarkings(node.content.textGroup.caption)
				}
			]
		})
	}

	node.content.textGroup.textGroup.forEach((line, index) => {
		// create a new row every numCols
		if (index % numCols === 0) {
			currRow = {
				object: 'block',
				type: TABLE_ROW_NODE,
				data: { content: { header: hasHeader && nodes.length === 1, numCols } },
				nodes: []
			}
			nodes.push(currRow)
		}

		// create table cell
		currRow.nodes.push({
			object: 'block',
			type: TABLE_CELL_NODE,
			data: { content: { header: hasHeader && index < numCols } },
			nodes: [
				{
					object: 'text',
					leaves: TextUtil.parseMarkings(line)
				}
			]
		})
	})

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		nodes,
		data: {
			content
		}
	}
}

export default { slateToObo, oboToSlate }
