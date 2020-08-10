import React from 'react'

import BasicMarks from '../marks/basic-marks'
import LinkMark from '../marks/link-mark'
import ScriptMarks from '../marks/script-marks'
import AlignMarks from '../marks/align-marks'
import IndentMarks from '../marks/indent-marks'
import ColorMark from '../marks/color-marks'
import ParagraphStyles from './paragraph-styles'
import ListDropper from './list-dropper'
import './content-toolbar.scss'

const contentMarks = [
	...ColorMark.marks,
	...BasicMarks.marks,
	...LinkMark.marks,
	...ScriptMarks.marks,
	...AlignMarks.marks,
	...IndentMarks.marks
]

const unorderedList = [
	{ bulletStyle: 'disc', display: '●' },
	{ bulletStyle: 'circle', display: '○' },
	{ bulletStyle: 'square', display: '■' }
]

const orderedList = [
	{ bulletStyle: 'decimal', display: '1.' },
	{ bulletStyle: 'lower-alpha', display: 'a.' },
	{ bulletStyle: 'lower-roman', display: 'i.' },
	{ bulletStyle: 'upper-alpha', display: 'A.' },
	{ bulletStyle: 'upper-roman', display: 'I.' }
]

const ContentToolbar = props => {
	const isMac = navigator.platform.indexOf('Mac') !== -1

	return (
		<div className={`visual-editor--content-toolbar`}>
			<ParagraphStyles editor={props.editor} />
			{contentMarks.map(mark => {
				const Icon = mark.icon

				// Decide whether or not to use the mac shortcut
				// Note - users can spoof their appVersion, but anyone who is tech-savvy enough
				// to do that is probably tech-savvy enough to know whether they use CTRL or ⌘
				// for keyboard shortcuts
				const hotKey = isMac ? '⌘+' : 'Ctrl+'
				const shortcut = mark.shortcut ? '\n' + hotKey + mark.shortcut : ''

				return (
					<button
						key={mark.name}
						onClick={() => mark.action(props.editor)}
						title={mark.name + shortcut}
						aria-label={mark.name + shortcut}
					>
						<Icon editor={props.editor} />
					</button>
				)
			})}
			<ListDropper
				editor={props.editor}
				type="unordered"
				bullets={unorderedList}
				defaultStyle="disc"
				shortcut="Shift+K"
			/>
			<ListDropper
				editor={props.editor}
				type="ordered"
				bullets={orderedList}
				defaultStyle="decimal"
				shortcut="Shift+L"
			/>
		</div>
	)
}

export default ContentToolbar
