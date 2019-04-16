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

import './content-toolbar.scss'

const { Dispatcher } = Common.flux

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
	}
]

const ContentToolbar = props => {
	const toggleMark = (name, event) => {
		Dispatcher.trigger('editor:toggleMark', {
			event,
			name
		})
	}

	return (
		<div className={`visual-editor--content-toolbar`}>
			{markList.map(mark => {
				const Icon = mark.icon
				return (
					<button
						key={mark.name}
						onClick={toggleMark.bind(this, mark.name)}
						title={mark.name}
					>
						<Icon />
					</button>
				)
			})}
		</div>
	)
}

export default ContentToolbar
