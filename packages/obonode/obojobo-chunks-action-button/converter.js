import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'
import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

/**
 * Generates an Obojobo Action Button from a Slate node.
 * Copies the id, type, triggers, align, and converts text children (including marks)
 * into a textGroup
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Action Bution node
 */
const slateToObo = node => {
	const labelLine = {
		text: { value: '', styleList: [] },
		data: null
	}
	TextUtil.slateToOboText(node, labelLine)

	return {
		id: node.id,
		type: node.type,
		children: [],
		content: withoutUndefined({
			triggers: node.content.triggers,
			objectives: node.content.objectives,
			variables: node.content.variables,
			textGroup: [labelLine],
			align: node.content.align
		})
	}
}

/**
 * Generates a Slate node from an Obojobo Action Button.
 * Copies all attributes, and converts a label or textGroup into Slate Text children
 * The conversion also ensures that the Slate node has an onClick trigger so that
 * the user can easily add onClick actions
 * @param {Object} node An Obojobo Action Button node
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)
	if (!node.content.textGroup) {
		// If there is currently no caption, add one
		slateNode.children = [{ text: node.content.label }]
	} else {
		slateNode.children = node.content.textGroup.flatMap(line => TextUtil.parseMarkings(line))
	}

	// Make sure that buttons have an onClick trigger
	const onClickTrigger = {
		type: 'onClick',
		actions: []
	}
	if (!node.content.triggers) {
		node.content.triggers = [onClickTrigger]
	} else {
		const hasOnClickTrigger =
			node.content.triggers.filter(trigger => trigger.type === 'onClick').length > 0
		if (!hasOnClickTrigger) node.content.triggers.push(onClickTrigger)
	}

	return slateNode
}

export default { slateToObo, oboToSlate }
