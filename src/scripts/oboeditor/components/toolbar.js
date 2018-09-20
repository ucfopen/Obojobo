import React from 'react'
import basicMark from './marks/basic-mark'
import linkMark from './marks/link-mark'
import superMark from './marks/super-mark'
import alignMark from './marks/align-mark'

const BOLD_MARK = 'b'
const ITALIC_MARK = 'i'
const STRIKE_MARK = 'del'
const QUOTE_MARK = 'q'
const MONOSPACE_MARK = 'monospace'
const LATEX_MARK = '_latex'

const SUPERSCRIPT_MARK = 'sup'
const LINK_MARK = 'a'

const ALIGN_RIGHT = 'right'
const ALIGN_CENTER = 'center'
const ALIGN_LEFT = 'left'

const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const Bold = props => {
	return <strong>{props.children}</strong>
}
const Italics = props => {
	return <em>{props.children}</em>
}
const Strike = props => {
	return <del>{props.children}</del>
}
const Quote = props => {
	return <q>{props.children}</q>
}
const Monospace = props => {
	return <code>{props.children}</code>
}
const Latex = props => {
	return <span className={'latex-editor'}>{props.children}</span>
}
const Link = props => {
	return <a href={props.mark.data.get('href')}>{props.children}</a>
}
const Superscript = props => {
	if (props.mark.data.get('num') === 1) {
		return <sup>{props.children}</sup>
	} else {
		return <sub>{props.children}</sub>
	}
}

class Node extends React.Component {
	toggleMark(mark, event) {
		event.preventDefault()

		if (mark.plugin === alignMark) return this.changeAlign(mark)

		if (mark.name === 'Superscript') return this.toggleScript(1)
		if (mark.name === 'Subscript') return this.toggleScript(-1)
		if (mark.name === 'Link') return this.toggleLink()

		const value = this.props.value
		const change = value.change().toggleMark(mark.type)
		this.props.onChange(change)
	}

	changeAlign(mark) {
		const value = this.props.value
		const change = value.change()

		value.blocks.forEach(block => {
			const dataJSON = block.data.toJSON()
			if (block.type === TEXT_LINE_NODE) {
				dataJSON.align = mark.align
			} else {
				dataJSON.content.align = mark.align
			}

			change.setNodeByKey(block.key, { data: dataJSON })
		})

		this.props.onChange(change)
	}

	toggleScript(amount) {
		const value = this.props.value
		const change = value.change()
		const hasScript = value.marks.some(mark => {
			if (mark.type === SUPERSCRIPT_MARK) {
				return mark.data.get('num') === amount
			}
			return false
		})

		if (hasScript) {
			change.removeMark({
				type: SUPERSCRIPT_MARK,
				data: { num: amount }
			})
		} else {
			change.addMark({
				type: SUPERSCRIPT_MARK,
				data: { num: amount }
			})
		}

		this.props.onChange(change)
	}

	toggleLink() {
		const value = this.props.value
		const change = value.change()

		value.marks.forEach(mark => {
			if (mark.type === LINK_MARK) {
				change.removeMark({
					type: LINK_MARK,
					data: mark.data.toJSON()
				})
			}
			return false
		})

		const href = window.prompt('Link address:') || null

		change.addMark({
			type: LINK_MARK,
			data: { href }
		})

		this.props.onChange(change)
	}

	render() {
		return (
			<div>
				{markList.map(mark => {
					return (
						<button key={mark.name} onClick={event => this.toggleMark(mark, event)}>
							{mark.name}
						</button>
					)
				})}
			</div>
		)
	}
}

const markList = [
	{
		name: 'Bold',
		type: BOLD_MARK,
		key: 'b',
		render: Bold,
		plugin: basicMark
	},
	{
		name: 'Italic',
		type: ITALIC_MARK,
		key: 'i',
		render: Italics,
		plugin: basicMark
	},
	{
		name: 'Strikethrough',
		type: STRIKE_MARK,
		key: 'd',
		render: Strike,
		plugin: basicMark
	},
	{
		name: 'Quote',
		type: QUOTE_MARK,
		key: 'q',
		render: Quote,
		plugin: basicMark
	},
	{
		name: 'Monospace',
		type: MONOSPACE_MARK,
		key: 'm',
		render: Monospace,
		plugin: basicMark
	},
	{
		name: 'Latex',
		type: LATEX_MARK,
		key: 'q',
		render: Latex,
		plugin: basicMark
	},
	{
		name: 'Link',
		type: LINK_MARK,
		key: 'k',
		render: Link,
		plugin: linkMark
	},
	{
		name: 'Superscript',
		type: SUPERSCRIPT_MARK,
		key: '.',
		modifier: 1,
		render: Superscript,
		plugin: superMark
	},
	{
		name: 'Subscript',
		type: SUPERSCRIPT_MARK,
		key: ',',
		modifier: -1,
		render: Superscript,
		plugin: superMark
	},
	{
		name: 'Right',
		align: ALIGN_RIGHT,
		key: 'r',
		plugin: alignMark
	},
	{
		name: 'Center',
		align: ALIGN_CENTER,
		key: 'e',
		plugin: alignMark
	},
	{
		name: 'Left',
		align: ALIGN_LEFT,
		key: 'l',
		plugin: alignMark
	}
]

const ToolBar = {
	components: {
		Node,
		Bold,
		Italics,
		Strike,
		Quote,
		Monospace,
		Latex,
		Link,
		Superscript
	},
	plugins: markList.map(mark => {
		return mark.plugin(mark)
	})
}

export default ToolBar
