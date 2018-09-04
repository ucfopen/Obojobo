import './viewer-component.scss'

import katex from 'katex'

import Common from 'Common'
let { OboComponent } = Common.components

const createMarkup = html => {
	let div = document.createElement('div')
	div.innerHTML = html

	let latexes = div.querySelectorAll('.latex')

	for (let el of Array.from(latexes)) {
		el.innerHTML = katex.renderToString(el.innerHTML)
	}

	return { __html: div.innerHTML }
}

export default props => (
	<OboComponent model={props.model} moduleData={props.moduleData}>
		<div
			className={`obojobo-draft--chunks--html viewer pad align-${props.model.modelState.align}`}
			dangerouslySetInnerHTML={createMarkup(props.model.modelState.html)}
		/>
	</OboComponent>
)
