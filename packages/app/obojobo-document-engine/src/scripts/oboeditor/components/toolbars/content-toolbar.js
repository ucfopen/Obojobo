import React from 'react'

import BasicMarks from '../marks/basic-marks'
import LinkMark from '../marks/link-mark'
import ScriptMarks from '../marks/script-marks'
import AlignMarks from '../marks/align-marks'
import IndentMarks from '../marks/indent-marks'
import ParagraphStyles from './paragraph-styles'
import './content-toolbar.scss'

const contentMarks = [
	...BasicMarks.marks,
	...LinkMark.marks,
	...ScriptMarks.marks,
	...AlignMarks.marks,
	...IndentMarks.marks
]

const ContentToolbar = props =>
	(
		<div className={`visual-editor--content-toolbar`}>
			<ParagraphStyles editor={props.editorRef} value={props.value}/>
			{contentMarks.map(mark => {
				const Icon = mark.icon
				return (
					<button
						key={mark.name}
						onClick={() => mark.action(props.editorRef.current)}
						title={mark.name}
					>
						<Icon />
					</button>
				)
			})}
		</div>
	)

export default ContentToolbar
