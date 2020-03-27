import React from 'react'
import katex from 'katex'

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
