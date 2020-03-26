import React, { memo } from 'react'
import katex from 'katex'
import { Editor } from 'slate'
import { useSlate } from 'slate-react'
import isOrNot from '../../../common/util/isornot'

import './link.scss'

const Latex = props => {
	return (
		<div className={'latex-editor '}>
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
