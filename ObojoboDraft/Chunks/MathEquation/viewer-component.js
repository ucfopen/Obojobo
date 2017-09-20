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

export default class MathEquation extends React.Component {
	constructor(props) {
		super(props)

		let katexHtml = getLatexHtml(this.props.model.modelState.latex)
		if (katexHtml.error != null) {
			katexHtml = ''
		} else {
			katexHtml = katexHtml.html
		}

		this.state = { katexHtml }
	}

	render() {
		if (this.state.katexHtml.length === 0) {
			return null
		}

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className={`obojobo-draft--chunks--math-equation pad align-${this.props.model.modelState
					.align}`}
			>
				<NonEditableChunk>
					<div
						className="katex-container"
						dangerouslySetInnerHTML={{ __html: this.state.katexHtml }}
					/>
					{this.props.model.modelState.label === ''
						? null
						: <div className="equation-label">
								{this.props.model.modelState.label}
							</div>}
				</NonEditableChunk>
			</OboComponent>
		)
	}
}
