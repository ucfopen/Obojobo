import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

import BasicMarks from '../marks/basic-marks'
import LinkMark from '../marks/link-mark'
import ScriptMarks from '../marks/script-marks'
import AlignMarks from '../marks/align-marks'
import IndentMarks from '../marks/indent-marks'
import './content-toolbar.scss'


class ContentToolbar extends React.Component {
	render() {
		const editor = this.props.getEditor()

		return (
				<div className={`visual-editor--content-toolbar`}>
					{BasicMarks.marks.map(mark => {
						const Icon = mark.icon
						return (
							<button
								key={mark.name}
								onClick={() => mark.action(editor)}
								title={mark.name}
							>
								<Icon />
							</button>
						)
					})}
					{LinkMark.marks.map(mark => {
						const Icon = mark.icon
						return (
							<button
								key={mark.name}
								onClick={() => mark.action(editor)}
								title={mark.name}
							>
								<Icon />
							</button>
						)
					})}
					{ScriptMarks.marks.map(mark => {
						const Icon = mark.icon
						return (
							<button
								key={mark.name}
								onClick={() => mark.action(editor)}
								title={mark.name}
							>
								<Icon />
							</button>
						)
					})}
					{AlignMarks.marks.map(mark => {
						const Icon = mark.icon
						return (
							<button
								key={mark.name}
								onClick={() => mark.action(editor)}
								title={mark.name}
							>
								<Icon />
							</button>
						)
					})}
					{IndentMarks.marks.map(mark => {
						const Icon = mark.icon
						return (
							<button
								key={mark.name}
								onClick={() => mark.action(editor)}
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

export default ContentToolbar
