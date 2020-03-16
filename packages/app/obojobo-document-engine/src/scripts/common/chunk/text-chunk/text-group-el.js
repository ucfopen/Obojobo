import React from 'react'

import StyleableTextComponent from '../../text/styleable-text-component'
import Dispatcher from '../../flux/dispatcher'

const varRegex = /\{\{(.+?)\}\}/g

const getText = props => {
	let { text } = props.textItem

	// Quickly exit if the text has no double brackets, since we
	// know there are no variables to substitue:
	if (!props.parentModel || text.value.indexOf('{{') === -1) {
		return text
	}

	const substitutions = []
	let match = null

	text = text.clone()

	// Collect all of the potential variables:
	while ((match = varRegex.exec(text.value)) !== null) {
		const variableText = match[1]
		const event = { text: '' }

		// Ask the system if anything is aware of `variableText`:
		Dispatcher.trigger('getTextForVariable', event, variableText, props.parentModel)

		// If there is a substitution add it to our list (in backwards order so text
		// replacement doesn't mangle the original text)
		if (event.text !== null) {
			substitutions.unshift({
				index: match.index,
				length: match[0].length,
				replacementText: '' + event.text
			})
		}
	}

	// Loop through the text, replacing every substitution in substitutions
	substitutions.forEach(sub => {
		text.replaceText(sub.index, sub.index + sub.length, sub.replacementText)
	})

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
