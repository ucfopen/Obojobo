import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'
import ListStyles from './list-styles'

const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const flattenLevels = (node, currLevel, textGroup, indents) => {
	const indent = node.data.get('content')

	node.nodes.forEach(child => {
		if (child.type === LIST_LEVEL_NODE) {
			flattenLevels(child, currLevel + 1, textGroup, indents)
			return
		}

		const listLine = {
			text: { value: child.text, styleList: [] },
			data: { indent: currLevel }
		}

		child.nodes.forEach(text => {
			TextUtil.slateToOboText(text, listLine)
		})

		textGroup.push(listLine)
	})

	indents['' + currLevel] = indent
}

const slateToObo = node => {
	const content = node.data.get('content')
	content.textGroup = []
	content.listStyles.indents = []

	node.nodes.forEach(level => {
		flattenLevels(level, 0, content.textGroup, content.listStyles.indents)
	})

	return {
		id: node.key,
		type: node.type,
		children: [],
		content
	}
}

const validateJSON = json => {
	// Do not consolidate lines
	if (json.type === LIST_LINE_NODE) return json

	// Consolidate levels that are next to each other
	let last = json.nodes[0]
	for (let i = 1; i < json.nodes.length; i++) {
		const next = json.nodes[i]
		if (last.type === LIST_LEVEL_NODE && next.type === LIST_LEVEL_NODE) {
			next.nodes = last.nodes.concat(next.nodes)
			json.nodes[i - 1] = false
		}
		last = next
	}

	// Filter out removed nodes and validate newly combined children
	json.nodes = json.nodes.filter(Boolean).map(node => validateJSON(node))
	return json
}

const oboToSlate = node => {
	const type = node.content.listStyles.type
	const bulletList =
		type === 'unordered' ? ListStyles.UNORDERED_LIST_BULLETS : ListStyles.ORDERED_LIST_BULLETS

	// make sure that indents exists
	if (!node.content.listStyles.indents) node.content.listStyles.indents = {}

	const nodes = node.content.textGroup.map(line => {
		let indent = line.data ? line.data.indent : 0
		let style = node.content.listStyles.indents[indent] || { type, bulletStyle: bulletList[indent] }
		let listLine = {
			object: 'block',
			type: LIST_LEVEL_NODE,
			data: { content: style },
			nodes: [
				{
					object: 'block',
					type: LIST_LINE_NODE,
					nodes: [
						{
							object: 'text',
							leaves: TextUtil.parseMarkings(line)
						}
					]
				}
			]
		}

		while (indent > 0) {
			indent--
			style = node.content.listStyles.indents[indent] || { type, bulletStyle: bulletList[indent] }

			listLine = {
				object: 'block',
				type: LIST_LEVEL_NODE,
				data: { content: style },
				nodes: [listLine]
			}
		}

		return listLine
	})

	return validateJSON({
		object: 'block',
		key: node.id,
		type: node.type,
		data: {
			content: node.content
		},
		nodes
	})
}

export default { slateToObo, oboToSlate }
