import React from 'react'

import StyleableTextComponent from '../../../common/text/styleable-text-component'
import Dispatcher from '../../../common/flux/dispatcher'

const varRegex = /\{\{(.+?)\}\}/

const getText = props => {
	let { text } = props.textItem

	if (props.parentModel && text.value.indexOf('{{') > -1) {
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
			console.log('replaceText', event.text)
			text.replaceText(startIndex, startIndex + match[0].length, event.text)
			if (event.style) {
				text.styleText(event.style, startIndex, startIndex + event.text.length)
			}
		}
	}

	return text
}

const TextGroupEl = props => (
	<span
		className={`text align-${props.textItem.data.align}`}
		data-group-index={props.groupIndex}
		data-indent={props.textItem.data.indent}
	>
		<StyleableTextComponent text={getText(props)} />
	</span>
)

export default TextGroupEl
