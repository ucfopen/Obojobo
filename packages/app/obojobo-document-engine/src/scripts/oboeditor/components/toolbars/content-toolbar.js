import React from 'react'
import { Editor } from 'slate'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

import BasicMarks from '../marks/basic-marks'
import LinkMark from '../marks/link-mark'
import ScriptMarks from '../marks/script-marks'
import AlignMarks from '../marks/align-marks'
import IndentMarks from '../marks/indent-marks'
import ParagraphStyles from './paragraph-styles'
import ListDropper from './list-dropper'
import './content-toolbar.scss'

const contentMarks = [
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
	const marks = Editor.marks(props.editor)
	return (
		<div className={`visual-editor--content-toolbar`}>
			<ParagraphStyles editor={props.editor} />
			{contentMarks.map(mark => {
				const Icon = mark.icon
				const isSelected = marks && mark && marks[mark.type]
				const className = isOrNot(isSelected, 'selected')

				return (
					<button
						className={className}
						key={mark.name}
						onClick={() => mark.action(props.editor)}
						title={mark.name}
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
			/>
			<ListDropper
				editor={props.editor}
				type="ordered"
				bullets={orderedList}
				defaultStyle="decimal"
			/>
		</div>
	)
}
export default ContentToolbar
