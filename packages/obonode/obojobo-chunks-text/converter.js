import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

/**
 * Generates an Obojobo Text Node from a Slate node.
 * Copies the id, type, triggers, and condenses TextLine children and their 
 * text children (including marks) into a single textGroup
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Text node 
 */
const slateToObo = node => {
	const textGroup = node.children.map(line => {
		const textLine = {
			text: { value: "", styleList: [] },
			data: { indent: line.content.indent, align: line.content.align }
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
 * Generates a Slate node from an Obojobo Text node.
 * Copies all attributes, and converts a textGroup into Slate Text children
 * Each textItem in the textgroup becomes a separate TextLine node in order
 * to properly leverage the Slate Editor's capabilities
 * @param {Object} node An Obojobo Text node 
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	slateNode.children = node.content.textGroup.map(line => {
		const indent = line.data ? line.data.indent : 0
		const align = line.data ? line.data.align : 'left'
		return {
			type: TEXT_NODE,
			subtype: TEXT_LINE_NODE,
			content: { indent, align },
			children: TextUtil.parseMarkings(line)
		}
	})

	return slateNode
}

export default { slateToObo, oboToSlate }
