import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import basicMark from './marks/basic-mark'
import linkMark from './marks/link-mark'
import superMark from './marks/super-mark'
import alignMark from './marks/align-mark'

import LinkNode from './marks/link'

import BoldIcon from '../assets/bold-icon'
import ItalicIcon from '../assets/italic-icon'
import StrikeIcon from '../assets/strike-icon'
import QuoteIcon from '../assets/quote-icon'
import MonoIcon from '../assets/mono-icon'
import LatexIcon from '../assets/latex-icon'
import LinkIcon from '../assets/link-icon'
import SupIcon from '../assets/sup-icon'
import SubIcon from '../assets/sub-icon'
import IndentIcon from '../assets/indent-icon'
import LeftIcon from '../assets/left-icon'
import RightIcon from '../assets/right-icon'
import CenterIcon from '../assets/center-icon'
import UnindentIcon from '../assets/unindent-icon'
import HangingIndentIcon from '../assets/hanging-indent-icon'

const { Prompt } = Common.components.modal
const { ModalUtil } = Common.util
import './toolbar.scss'

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
const CODE_LINE_NODE = 'ObojoboDraft.Chunks.Code.CodeLine'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'

const unorderedBullets = ['disc', 'circle', 'square']
const orderedBullets = ['decimal', 'upper-alpha', 'upper-roman', 'lower-alpha', 'lower-roman']

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
const Link = props => {
	return (
		<LinkNode
			mark={props.mark}
			node={props.node}
			offset={props.offset}
			editor={props.editor}
			text={props.text}
		>
			{props.children}
		</LinkNode>
	)
}
const Latex = props => {
	return <span className={'latex-editor'}>{props.children}</span>
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

		const editor = this.props.getEditor()

		if (mark.plugin === alignMark) return this.changeAlign(mark)

		if (mark.name === 'Superscript') return this.toggleScript(1)
		if (mark.name === 'Subscript') return this.toggleScript(-1)
		if (mark.name === 'Link') return this.toggleLink()
		if (mark.name === 'Indent') return this.indent()
		if (mark.name === 'Unindent') return this.unindent()
		if (mark.name === 'Hanging Indent') return this.hangingIndent()

		return editor.toggleMark(mark.type)
	}

	changeAlign(mark) {
		const editor = this.props.getEditor()

		editor.value.blocks.forEach(block => {
			const dataJSON = block.data.toJSON()
			if (block.type === TEXT_LINE_NODE) {
				dataJSON.align = mark.align
			} else {
				dataJSON.content.align = mark.align
			}

			editor.setNodeByKey(block.key, { data: dataJSON })
		})
	}

	toggleScript(amount) {
		const editor = this.props.getEditor()

		const hasScript = editor.value.marks.some(mark => {
			if (mark.type === SUPERSCRIPT_MARK) {
				return mark.data.get('num') === amount
			}
			return false
		})

		if (hasScript) {
			editor.removeMark({
				type: SUPERSCRIPT_MARK,
				data: { num: amount }
			})
		} else {
			editor.addMark({
				type: SUPERSCRIPT_MARK,
				data: { num: amount }
			})
		}
	}

	changeLinkValue(href) {
		const editor = this.props.getEditor()

		editor.value.marks.forEach(mark => {
			if (mark.type === LINK_MARK) {
				editor.removeMark({
					type: LINK_MARK,
					data: mark.data.toJSON()
				})
			}
		})

		// If href is empty, don't add a link
		if (!href || !/[^\s]/.test(href)) return true

		editor.addMark({
			type: LINK_MARK,
			data: { href }
		})
	}

	toggleLink() {
		ModalUtil.show(
			<Prompt
				title="Insert Link"
				message="Enter the link url:"
				onConfirm={this.changeLinkValue.bind(this)}
			/>
		)
	}

	indentList(value, block, editor) {
		let bullet = 'disc'
		let type = 'unordered'

		// get the bullet and type of the closest parent level
		const level = value.document.getClosest(block.key, parent => parent.type === LIST_LEVEL_NODE)
		const content = level.data.get('content')
		bullet = content.bulletStyle
		type = content.type

		// get the proper bullet for the next level
		const bulletList = type === 'unordered' ? unorderedBullets : orderedBullets
		const nextBullet = bulletList[(bulletList.indexOf(bullet) + 1) % bulletList.length]

		return editor.wrapBlockByKey(block.key, {
			type: LIST_LEVEL_NODE,
			data: { content: { type: type, bulletStyle: nextBullet } }
		})
	}

	indent() {
		const editor = this.props.getEditor()

		editor.value.blocks.forEach(block => {
			const dataJSON = block.data.toJSON()

			switch (block.type) {
				case TEXT_LINE_NODE:
					dataJSON.indent = Math.min(dataJSON.indent + 1, 20)
					return editor.setNodeByKey(block.key, { data: dataJSON })

				case CODE_LINE_NODE:
					dataJSON.content.indent = dataJSON.content.indent + 1
					return editor.setNodeByKey(block.key, { data: dataJSON })

				case LIST_LINE_NODE:
					return this.indentList(editor.value, block, editor)
			}
		})
	}

	hangingIndent() {
		const editor = this.props.getEditor()
		editor.value.blocks.forEach(block => {
			const dataJSON = block.data.toJSON()

			switch (block.type) {
				case TEXT_LINE_NODE:
					case TEXT_LINE_NODE:
					dataJSON.hangingIndent = (dataJSON.hangingIndent == true) ? false : true
					return editor.setNodeByKey(block.key, { data: dataJSON })

				case CODE_LINE_NODE:
					dataJSON.content.indent = dataJSON.content.indent + 1
					return editor.setNodeByKey(block.key, { data: dataJSON })

				case LIST_LINE_NODE:
					dataJSON.hangingIndent = (dataJSON.hangingIndent == true) ? false : true
					return editor.setNodeByKey(block.key, { data: dataJSON })
			}
		})
	}

	unindent() {
		const editor = this.props.getEditor()

		editor.value.blocks.forEach(block => {
			const dataJSON = block.data.toJSON()

			switch (block.type) {
				case TEXT_LINE_NODE:
					dataJSON.indent = Math.max(dataJSON.indent - 1, 0)
					return editor.setNodeByKey(block.key, { data: dataJSON })

				case CODE_LINE_NODE:
					dataJSON.content.indent = Math.max(dataJSON.indent - 1, 0)
					return editor.setNodeByKey(block.key, { data: dataJSON })

				case LIST_LINE_NODE:
					return editor.unwrapNodeByKey(block.key, LIST_LEVEL_NODE)
			}
		})
	}

	render() {
		return (
			<div>
				{markList.map(mark => {
					const Icon = mark.icon
					return (
						<button
							key={mark.name}
							onClick={event => this.toggleMark(mark, event)}
							title={mark.name}
						>
							<Icon />
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
		plugin: basicMark,
		icon: BoldIcon
	},
	{
		name: 'Italic',
		type: ITALIC_MARK,
		key: 'i',
		render: Italics,
		plugin: basicMark,
		icon: ItalicIcon
	},
	{
		name: 'Strikethrough',
		type: STRIKE_MARK,
		key: 'd',
		render: Strike,
		plugin: basicMark,
		icon: StrikeIcon
	},
	{
		name: 'Quote',
		type: QUOTE_MARK,
		key: "'",
		render: Quote,
		plugin: basicMark,
		icon: QuoteIcon
	},
	{
		name: 'Monospace',
		type: MONOSPACE_MARK,
		key: 'm',
		render: Monospace,
		plugin: basicMark,
		icon: MonoIcon
	},
	{
		name: 'Latex',
		type: LATEX_MARK,
		key: 'q',
		render: Latex,
		plugin: basicMark,
		icon: LatexIcon
	},
	{
		name: 'Link',
		type: LINK_MARK,
		key: 'k',
		render: Link,
		plugin: linkMark,
		icon: LinkIcon
	},
	{
		name: 'Superscript',
		type: SUPERSCRIPT_MARK,
		key: '.',
		modifier: 1,
		render: Superscript,
		plugin: superMark,
		icon: SupIcon
	},
	{
		name: 'Subscript',
		type: SUPERSCRIPT_MARK,
		key: ',',
		modifier: -1,
		render: Superscript,
		plugin: superMark,
		icon: SubIcon
	},
	{
		name: 'Left',
		align: ALIGN_LEFT,
		key: 'l',
		plugin: alignMark,
		icon: LeftIcon
	},
	{
		name: 'Right',
		align: ALIGN_RIGHT,
		key: 'r',
		plugin: alignMark,
		icon: RightIcon
	},
	{
		name: 'Center',
		align: ALIGN_CENTER,
		key: 'e',
		plugin: alignMark,
		icon: CenterIcon
	},
	{
		name: 'Indent',
		type: ITALIC_MARK,
		plugin: () => ({}),
		icon: IndentIcon
	},
	{
		name: 'Unindent',
		type: ITALIC_MARK,
		plugin: () => ({}),
		icon: UnindentIcon
	},
	{
		name: 'Hanging Indent',
		type: ITALIC_MARK,
		plugin: () => ({}),
		icon: HangingIndentIcon
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
