import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const TABLE_ROW_NODE = 'ObojoboDraft.Chunks.Table.Row'
const TABLE_CELL_NODE = 'ObojoboDraft.Chunks.Table.Cell'

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || { textGroup: {} }
	json.content.header = node.nodes.get(0).data.get('content').header
	json.content.textGroup.textGroup = []

	node.nodes.forEach(row => {
		row.nodes.forEach(cell => {
			const cellLine = {
				text: { value: cell.text, styleList: [] }
			}

			cell.nodes.forEach(text => {
				TextUtil.slateToOboText(text, cellLine)
			})

			json.content.textGroup.textGroup.push(cellLine)
		})
	})
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: node.content }

	json.nodes = []
	const cols = node.content.textGroup.numCols
	const hasHeader = node.content.header
	let currRow

	node.content.textGroup.textGroup.forEach((line, index) => {
		if (index % cols === 0) {
			currRow = {
				object: 'block',
				type: TABLE_ROW_NODE,
				data: { content: { header: hasHeader && json.nodes.length === 0 } },
				nodes: []
			}
			json.nodes.push(currRow)
		}

		const tableCell = {
			object: 'block',
			type: TABLE_CELL_NODE,
			data: { content: { header: hasHeader && index < cols } },
			nodes: [
				{
					object: 'text',
					leaves: TextUtil.parseMarkings(line)
				}
			]
		}

		currRow.nodes.push(tableCell)
	})

	return json
}

export default { slateToObo, oboToSlate }
