import StyleableTextRenderer from './styleable-text-renderer'
import { EMPTY_CHAR as emptyChar } from '../../common/text/text-constants'

export default class StyleableTextComponent extends React.Component {
	createChild(el, key) {
		let { createChild } = this
		let { groupIndex } = this.props

		let attrs = { key: key.counter++ }

		switch (el.type) {
			case 'a':
				if ((el.attrs != null ? el.attrs.href : undefined) != null) {
					attrs.href = el.attrs.href
					attrs.target = '_blank'
				}
				break

			case 'span':
				if ((el.attrs != null ? el.attrs['class'] : undefined) != null) {
					attrs.className = el.attrs['class']
				}
				break
		}

		return React.createElement(
			el.type,
			attrs,
			el.children.map((child, index) => {
				switch (child.nodeType) {
					case 'text':
						if (child.html != null) {
							// console.clear()
							// console.log('yes', child.html)
							return <span key={key.counter++} dangerouslySetInnerHTML={{ __html: child.html }} />
						} else if (child.text.length === 0) {
							return (
								<span key={key.counter++}>
									{emptyChar}
								</span>
							)
						} else if (child.text.charAt(child.text.length - 1) === '\n') {
							// Hack to force the display of a blank line that has no content
							return (
								<span key={key.counter++}>
									{child.text}
									{emptyChar}
								</span>
							)
						} else {
							return (
								<span key={key.counter++}>
									{child.text}
								</span>
							)
						}
					// child.text || emptyChar
					default:
						return this.createChild(child, key)
				}
			})
		)
	}

	render() {
		let key = { counter: 0 }
		let mockElement = StyleableTextRenderer(this.props.text)

		return (
			<span>
				{this.createChild(mockElement, key)}
			</span>
		)
	}
}
