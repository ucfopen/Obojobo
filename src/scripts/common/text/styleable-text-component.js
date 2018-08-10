import styleableTextRenderer from './styleable-text-renderer'
import { EMPTY_CHAR as emptyChar } from '../../common/text/text-constants'

import React from 'react'

export default class StyleableTextComponent extends React.Component {
	createChild(el, key) {
		const attrs = { key: key.counter++ }

		switch (el.type) {
			case 'a':
				if (el.attrs && el.attrs.href) {
					attrs.href = el.attrs.href
					attrs.target = '_blank'
				}
				break

			case 'span':
				if (el.attrs && el.attrs['class']) {
					attrs.className = el.attrs['class']
				}
				break
		}

		return React.createElement(
			el.type,
			attrs,
			el.children.map(child => {
				switch (child.nodeType) {
					case 'text':
						if (child.html) {
							return <span key={key.counter++} dangerouslySetInnerHTML={{ __html: child.html }} />
						} else if (child.text.length === 0) {
							return <span key={key.counter++}>{emptyChar}</span>
						} else if (child.text.charAt(child.text.length - 1) === '\n') {
							// Hack to force the display of a blank line that has no content
							return (
								<span key={key.counter++}>
									{child.text}
									{emptyChar}
								</span>
							)
						} else {
							return <span key={key.counter++}>{child.text}</span>
						}

					default:
						return this.createChild(child, key)
				}
			})
		)
	}

	render() {
		const key = { counter: 0 }
		const mockElement = styleableTextRenderer(this.props.text)

		return <span>{this.createChild(mockElement, key)}</span>
	}
}
