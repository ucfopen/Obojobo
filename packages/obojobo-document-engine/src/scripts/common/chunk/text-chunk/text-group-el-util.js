import DOMUtil from '../../../common/page/dom-util'

const getTextElement = (chunk, groupIndex) => {
	return chunk.getDomEl().querySelector(`*[data-group-index='${groupIndex}']`) || null
}

const getTextElementAtCursor = virtualCursor => {
	return getTextElement(virtualCursor.chunk, virtualCursor.data.groupIndex)
}

const getDomPosition = virtualCursor => {
	let textNode
	let totalCharactersFromStart = 0

	const element = getTextElementAtCursor(virtualCursor)

	if (!element) {
		return null
	}

	for (textNode of Array.from(DOMUtil.getTextNodesInOrder(element))) {
		if (totalCharactersFromStart + textNode.nodeValue.length >= virtualCursor.data.offset) {
			return { textNode, offset: virtualCursor.data.offset - totalCharactersFromStart }
		}
		totalCharactersFromStart += textNode.nodeValue.length
	}

	// There are no text nodes or something went really wrong, so return 0! ¯\_(ツ)_/¯
	return { textNode: null, offset: 0 }
}

export default { getDomPosition, getTextElement, getTextElementAtCursor }
