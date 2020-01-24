import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'
import ListStyles from './list-styles'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

/**
 * Recursively condenses the n-deep structure of a Slate List into
 * a textGroup array and its acompanying indents array.  ListLevels
 * save their styles in the indents array, and ListLines save thier
 * text in the textGroup array
 * @param {Object} node A Slate List Node
 * @param {Integer} currLevel The indent level that is being flattened
 * @param {Array} textGroup The array that the ListLine text will be saved to
 * @param {Array} indents The array that the ListLevel styles will be saved to
 * @returns {Object} An Obojobo List node 
 */
const flattenLevels = (node, currLevel, textGroup, indents) => {
	const indent = node.content

	node.children.forEach(child => {
		if (child.subtype === LIST_LEVEL_NODE) {
			flattenLevels(child, currLevel + 1, textGroup, indents)
			return
		}

		const listLine = {
			text: { value: '', styleList: [] },
			data: { indent: currLevel }
		}

		TextUtil.slateToOboText(child, listLine)

		textGroup.push(listLine)
	})

	indents['' + currLevel] = indent
}

/**
 * Generates an Obojobo List Node from a Slate node.
 * Copies the id, type, triggers, and condenses ListLine children and their 
 * text children (including marks) into a single textGroup.  ListLevels are
 * flattened into the listStyles of the Obojobo node
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo List node 
 */
const slateToObo = node => {
	const textGroup = []
	const indents = []

	node.children.forEach(level => {
		flattenLevels(level, 0, textGroup, indents)
	})

	return {
		id: node.id,
		type: node.type,
		children: [],
		content: {
			triggers: node.content.triggers,
			listStyles: {
				type: node.content.listStyles.type,
				indents
			},
			textGroup
		}
	}
}

/**
 * Combines adjacent ListLevel nodes in a Slate List node, at all depths
 * of the List node, to ensure that they display properly in the Visual Editor
 * @param {Object} node An unnormalized Slate List Node
 * @returns {Object} A normlized Slate list node
 */
const normalizeJSON = json => {
	// Do not consolidate lines
	if (json.subtype === LIST_LINE_NODE) return json

	// Consolidate levels that are next to each other
	let last = json.children[0]
	for (let i = 1; i < json.children.length; i++) {
		const next = json.children[i]
		if (last.subtype === LIST_LEVEL_NODE && next.subtype === LIST_LEVEL_NODE) {
			next.children = last.children.concat(next.children)
			json.children[i - 1] = false
		}
		last = next
	}

	// Filter out removed nodes and validate newly combined children
	json.children = json.children.filter(Boolean).map(node => normalizeJSON(node))
	return json
}

/**
 * Generates a Slate node from an Obojobo List node.
 * Copies all attributes, and converts a textGroup into Slate List children
 * Each textItem in the textgroup becomes a separate ListLine, and indents 
 * are turned into nested ListLevel parents of the ListLine to properly 
 * leverage the Slate Editor's capabilities.  The generated node is then normalized
 * to combine any adjacent ListLevel nodes
 * @param {Object} node An Obojobo Line node 
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	const type = node.content.listStyles.type
	const bulletList =
		type === 'unordered' ? ListStyles.UNORDERED_LIST_BULLETS : ListStyles.ORDERED_LIST_BULLETS

	// Make sure that indents exists
	if (!slateNode.content.listStyles.indents) slateNode.content.listStyles.indents = {}

	slateNode.children = node.content.textGroup.map(line => {
		let indent = line.data ? line.data.indent : 0
		let style = node.content.listStyles.indents[indent] || { type, bulletStyle: bulletList[indent] }
		let listLine = {
			type: LIST_NODE,
			subtype: LIST_LEVEL_NODE,
			content: style,
			children: [
				{
					type: LIST_NODE,
					subtype: LIST_LINE_NODE,
					children: TextUtil.parseMarkings(line)
				}
			]
		}

		while (indent > 0) {
			indent--
			style = node.content.listStyles.indents[indent] || { type, bulletStyle: bulletList[indent] }

			listLine = {
				type: LIST_NODE,
				subtype: LIST_LEVEL_NODE,
				content: style,
				children: [listLine]
			}
		}

		return listLine
	})

	return normalizeJSON(slateNode)
}

export default { slateToObo, oboToSlate }
