import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

/**
 * Generates an Obojobo Heading from a Slate node.
 * Copies the id, type, triggers, and converts text children (including marks)
 * into a textGroup.  The conversion also saves the headingLevel attribute
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Heading node 
 */
const slateToObo = node => {
	const line = {
		text: { value: "", styleList: [] },
		data: { align: node.content.align }
	}
	
	TextUtil.slateToOboText(node, line)

	return {
		id: node.id,
		type: node.type,
		children: [],
		content: withoutUndefined({
			triggers: node.content.triggers,
			headingLevel: node.content.headingLevel,
			textGroup: [line]
		})
	}
}

/**
 * Generates a Slate node from an Obojobo Heading.
 * Copies all attributes, and converts a textGroup into Slate Text children
 * @param {Object} node An Obojobo Heading node 
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)

	slateNode.children = node.content.textGroup.flatMap(line => {
		slateNode.content.align = line.data ? line.data.align : 'left'
		return TextUtil.parseMarkings(line)
	})

	return slateNode
}

export default { slateToObo, oboToSlate }
