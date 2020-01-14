import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const CODE_NODE = 'ObojoboDraft.Chunks.Code'
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'

/**
 * Generates an Obojobo Code Node from a Slate node.
 * Copies the id, type, triggers, and condenses CodeLine children and their 
 * text children (including marks) into a single textGroup
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Code node 
 */
const slateToObo = node => {
	const textGroup = node.children.map(line => {
		const textLine = {
			text: { value: "", styleList: [] },
			data: { indent: line.content.indent }
		}

		TextUtil.slateToOboText(line, textLine)

		return textLine
	})

	return {
		id: node.id,
		type: node.type,
		children: [],
		content: {
			triggers: node.content.triggers,
			textGroup
		}
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
	slateNode.children = node.content.textGroup.map(line => {
		const indent = line.data ? line.data.indent : 0
		return {
			type: CODE_NODE,
			subtype: CODE_LINE_NODE,
			content: { indent },
			children: TextUtil.parseMarkings(line)
		}
	})

	return slateNode
}

export default { slateToObo, oboToSlate }
