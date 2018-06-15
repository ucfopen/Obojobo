import './viewer-component.scss'

// katex = null #dynamically load
import katex from 'katex'

import Common from 'Common'
let { OboComponent } = Common.components
let { NonEditableChunk } = Common.chunk

let getLatexHtml = function(latex) {
	try {
		let html = katex.renderToString(latex, { displayMode: true })
		return { html }
	} catch (e) {
		return { error: e }
	}
}

export default props => {
	let katexHtml = getLatexHtml(props.model.modelState.latex)
	if (katexHtml.error != null) {
		katexHtml = ''
	} else {
		katexHtml = katexHtml.html
	}

	if (katexHtml.length === 0) {
		return null
	}

	return (
		<OboComponent
			model={props.model}
			moduleData={props.moduleData}
			className={`obojobo-draft--chunks--math-equation pad align-${props.model.modelState.align}`}
		>
			<NonEditableChunk>
				<div
					className="katex-container"
					style={{ fontSize: props.model.modelState.size }}
					dangerouslySetInnerHTML={{ __html: katexHtml }}
				/>
				{props.model.modelState.label === '' ? null : (
					<div className="equation-label">{props.model.modelState.label}</div>
				)}
			</NonEditableChunk>
		</OboComponent>
	)
}
