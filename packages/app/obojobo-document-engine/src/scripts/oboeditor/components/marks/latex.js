import React from 'react'
import katex from 'katex'
import { Editor } from 'slate'
import { useSlate } from 'slate-react'
import isOrNot from '../../../common/util/isornot'

import './link.scss'

const Latex = props => {
	const editor = useSlate()

	// Some of the nested properties don't deep equals properly
	// So a JSON stringify allows for proper comparison
	const leaf = Editor.leaf(editor, editor.selection || [], { edge: 'start' })
	const selected = JSON.stringify(leaf[0]) === JSON.stringify(props.leaf)

	const className = 'latex-editor ' + isOrNot(selected, 'selected')

	return (
		<div className={className}>
			{props.children}
			<div contentEditable={false} className="preview">
				<p>Preview:</p>
				<span
					className="preview-latex"
					dangerouslySetInnerHTML={{
						__html: katex.renderToString(props.leaf.text, {
							throwOnError: false
						})
					}}
				/>
			</div>
		</div>
	)
}

export default Latex
