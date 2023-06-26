import Common from 'obojobo-document-engine/src/scripts/common'
import Component from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor'
import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const EXCERPT_NODE = 'ObojoboDraft.Chunks.Excerpt'
const EXCERPT_CONTENT_NODE = 'ObojoboDraft.Chunks.Excerpt.ExcerptContent'
const CITE_TEXT_NODE = 'ObojoboDraft.Chunks.Excerpt.CitationText'

/**
 * Generates an Obojobo Excerpt Node from a Slate node.
 * Copies the id, type, triggers, and condenses ExcerptLine children and their
 * text children (including marks) into a single textGroup
 * @param {Object} node A Slate Node
 * @returns {Object} An Obojobo Excerpt node
 */
const slateToObo = node => {
	const excerptContent = node.children[0].children

	// ideally the slate-ness of the citation node would be preserved
	// but it's only ever going to be a single line of centered text
	// so there's really no reason to go to the trouble here
	// this seems a bit magical, though - may be a convenience function somewhere?
	const citationText = node.children[1].children[0].text

	return {
		id: node.id,
		type: node.type,
		children: excerptContent.map(child =>
			Common.Registry.getItemForType(child.type).slateToObo(child)
		),
		content: withoutUndefined({
			triggers: node.content.triggers,
			objectives: node.content.objectives,
			citation: citationText,
			bodyStyle: node.content.bodyStyle,
			topEdge: node.content.topEdge,
			bottomEdge: node.content.bottomEdge,
			width: node.content.width,
			font: node.content.font,
			lineHeight: node.content.lineHeight,
			fontSize: node.content.fontSize,
			effect: node.content.effect
		})
	}
}

/**
 * Generates a Slate node from an Obojobo Excerpt node.
 * Copies all attributes, and converts a textGroup into Slate Text children
 * Each textItem in the textgroup becomes a separate ExcerptLine node in order
 * to properly leverage the Slate Editor's capabilities
 * @param {Object} node An Obojobo Excerpt node
 * @returns {Object} A Slate node
 */
const oboToSlate = node => {
	const slateNode = Object.assign({}, node)

	const parsedChildren = slateNode.children.map(child => Component.helpers.oboToSlate(child))

	slateNode.children = [
		{
			type: EXCERPT_NODE,
			subtype: EXCERPT_CONTENT_NODE,
			content: {
				...slateNode.content
			},

			children: parsedChildren
		}
	]

	slateNode.children.push({
		type: EXCERPT_NODE,
		subtype: CITE_TEXT_NODE,
		content: {},
		children: [{ text: node.content.citation }]
	})

	delete slateNode.content.excerpt
	delete slateNode.content.citation

	return slateNode
}

export default { slateToObo, oboToSlate }
