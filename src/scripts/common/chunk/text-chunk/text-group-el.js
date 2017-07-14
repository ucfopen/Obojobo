import StyleableTextComponent from '../../../common/text/styleable-text-component'
import Dispatcher from '../../../common/flux/dispatcher'

let varRegex = /\{\{(.+?)\}\}/

export default class TextGroupEl extends React.Component {
	render() {
		// console.time('textRender');

		let { text } = this.props.textItem

		if (this.props.parentModel && text.value.indexOf('{{')) {
			let match = null
			text = text.clone()

			while ((match = varRegex.exec(text.value)) !== null) {
				let variable = match[1]
				let event = { text: '' }
				// window.Common.Store.getTextForVariable(event, variable, @props.parentModel, this.props.moduleData)
				Dispatcher.trigger('getTextForVariable', event, variable, this.props.parentModel)
				if (event.text === null) {
					event.text = match[1]
				}
				event.text = `${event.text}`

				let startIndex = text.value.indexOf(match[0], varRegex.lastIndex)
				text.replaceText(startIndex, startIndex + match[0].length, event.text)
			}
		}

		return (
			<span
				className={`text align-${this.props.textItem.data.align}`}
				data-group-index={this.props.groupIndex}
				data-indent={this.props.textItem.data.indent}
			>
				<StyleableTextComponent text={text} />
			</span>
		)
	}
}
