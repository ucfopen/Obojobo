import React from 'react'

import StyleableTextComponent from '../../../common/text/styleable-text-component'
import Dispatcher from '../../../common/flux/dispatcher'
import StyleableText from '../../../common/text/styleable-text'

const varRegex = /\{\{(.+?)\}\}/

const getText = props => {
	let { text } = props.textItem

	if (props.parentModel && text.value.indexOf('{{')) {
		let match = null
		text = text.clone()

		while ((match = varRegex.exec(text.value)) !== null) {
			const variable = match[1]
			const event = { text: '' }
			Dispatcher.trigger('getTextForVariable', event, variable, props.parentModel)
			if (event.text === null) {
				event.text = match[1]
			}
			event.text = `${event.text}`

			const startIndex = text.value.indexOf(match[0], varRegex.lastIndex)
			text.replaceText(startIndex, startIndex + match[0].length, event.text)
		}
	}

	return text
}

const TextGroupEl = props => {
	const textItem = props.textItem
	const text = new StyleableText.createFromObject(textItem)
	text.normalizeStyles()

	// console.log("textGroup", props.node.content.textGroup[0].text)
	// console.log("text", text)
	return (
	<span
		// className={`text align-${props.textItem.data.align}`}
		data-group-index={props.groupIndex}
		// data-indent={props.textItem.data.indent}
	>
		{/* <StyleableTextComponent text={getText(props)} /> */}
		<StyleableTextComponent text={text} />
	</span>
)}

export default TextGroupEl
