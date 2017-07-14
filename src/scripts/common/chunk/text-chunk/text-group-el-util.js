import { EMPTY_CHAR as emptyChar } from '../../../common/text/text-constants'
import DOMUtil from '../../../common/page/dom-util'

let getTextElement = (chunk, groupIndex) => {
	return chunk.getDomEl().querySelector(`*[data-group-index='${groupIndex}']`)
}

let getTextElementAtCursor = virtualCursor => {
	return getTextElement(virtualCursor.chunk, virtualCursor.data.groupIndex)
}

let getDomPosition = virtualCursor => {
	// console.log 'TGE.gDP', virtualCursor

	let textNode
	let totalCharactersFromStart = 0

	let element = getTextElementAtCursor(virtualCursor)

	// console.log 'element', element

	if (!element) {
		return null
	}

	if (element != null) {
		// console.log 'tnodes', DOMUtil.getTextNodesInOrder(element), virtualCursor.data.offset
		for (textNode of Array.from(DOMUtil.getTextNodesInOrder(element))) {
			if (totalCharactersFromStart + textNode.nodeValue.length >= virtualCursor.data.offset) {
				return { textNode, offset: virtualCursor.data.offset - totalCharactersFromStart }
			}
			totalCharactersFromStart += textNode.nodeValue.length
		}
	}

	// There are no text nodes or something went really wrong, so return 0! ¯\_(ツ)_/¯
	return { textNode: null, offset: 0 }
}

export default { getDomPosition, getTextElement, getTextElementAtCursor }
