import './viewer-component.scss'

import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
// import katex from 'katex'

const { OboComponent } = Viewer.components

const createMarkup = html => {
	const div = document.createElement('div')
	div.innerHTML = html

	const latexes = div.querySelectorAll('.latex')

	for (const el of Array.from(latexes)) {
		el.innerHTML = window.katex.renderToString(el.innerHTML, { throwOnError: false })
	}

	return { __html: div.innerHTML }
}

const HTML = props => (
	<OboComponent model={props.model} moduleData={props.moduleData}>
		<div
			className={`obojobo-draft--chunks--html viewer pad align-${props.model.modelState.align}`}
			dangerouslySetInnerHTML={createMarkup(props.model.modelState.html)}
		/>
	</OboComponent>
)

export default HTML
