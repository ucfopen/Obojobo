import { EMPTY_CHAR as emptyChar } from 'ObojoboDraft/Common/text/text-constants';
import DOMUtil from 'ObojoboDraft/Common/page/dom-util';
import StyleableTextComponent from 'ObojoboDraft/Common/text/styleable-text-component';
import Dispatcher from 'ObojoboDraft/Common/flux/dispatcher';

let varRegex = /\{\{(.+?)\}\}/;

var TextGroupEl = React.createClass({
	statics: {
		getTextElement(chunk, groupIndex) {
			return chunk.getDomEl().querySelector(`*[data-group-index='${groupIndex}']`);
		},

		getTextElementAtCursor(virtualCursor) {
			return TextGroupEl.getTextElement(virtualCursor.chunk, virtualCursor.data.groupIndex);
		},

		getDomPosition(virtualCursor) {
			// console.log 'TGE.gDP', virtualCursor

			let textNode;
			let totalCharactersFromStart = 0;

			let element = TextGroupEl.getTextElementAtCursor(virtualCursor);

			// console.log 'element', element

			if (!element) { return null; }

			if (element != null) {
				// console.log 'tnodes', DOMUtil.getTextNodesInOrder(element), virtualCursor.data.offset
				for (textNode of Array.from(DOMUtil.getTextNodesInOrder(element))) {
					if ((totalCharactersFromStart + textNode.nodeValue.length) >= virtualCursor.data.offset) {
						return { textNode, offset:virtualCursor.data.offset - totalCharactersFromStart };
					}
					totalCharactersFromStart += textNode.nodeValue.length;
				}
			}

			// There are no text nodes or something went really wrong, so return 0! ¯\_(ツ)_/¯
			return { textNode:null, offset:0 };
		}
	},

	componentDidUpdate() {
		return console.timeEnd('textRender');
	},

	render() {
		console.time('textRender');

		let { text } = this.props.textItem;

		if (this.props.parentModel && text.value.indexOf('{{')) {
			let match = null;
			text = text.clone();

			while ((match = varRegex.exec(text.value)) !== null) {
				let variable = match[1];
				let event = { text: '' };
				// window.ObojoboDraft.Store.getTextForVariable(event, variable, @props.parentModel, this.props.moduleData)
				Dispatcher.trigger('getTextForVariable', event, variable, this.props.parentModel);
				if (event.text === null) { event.text = match[1]; }
				event.text = `${event.text}`;

				let startIndex = text.value.indexOf(match[0], varRegex.lastIndex);
				text.replaceText(startIndex, startIndex + match[0].length, event.text);
			}
		}

		return <span className={`text align-${this.props.textItem.data.align}`} data-group-index={this.props.groupIndex} data-indent={this.props.textItem.data.indent}>
			<StyleableTextComponent text={text} />
		</span>;
	}
});

window.__gdp = TextGroupEl.getDomPosition;

export default TextGroupEl;