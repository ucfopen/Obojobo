import React from 'react'
import katex from 'katex'
import Common from 'obojobo-document-engine/src/scripts/common'

const { SimpleDialog } = Common.components.modal

import './math-equation-properties-modal.scss'

const getLatexHtml = latex => {
	try {
		const html = katex.renderToString(latex, { displayMode: true })
		return { html }
	} catch (e) {
		return { error: e }
	}
}

class MathEquationProperties extends React.Component {
	constructor(props) {
		super(props)

		this.state = this.props.content
		this.state.error = ''
	}

	handleLatexChange(event) {
		const latex = event.target.value

		return this.setState({ latex })
	}

	handleLabelChange(event) {
		const label = event.target.value

		return this.setState({ label })
	}

	focusOnFirstElement() {
		return this.refs.input.focus()
	}

	onConfirm() {
		const katexHtml = getLatexHtml(this.state.latex)

		if (katexHtml.error) {
			return this.setState({ error: katexHtml.error.message })
		}

		return this.props.onConfirm(this.state)
	}

	render() {
		return (
			<SimpleDialog
				cancelOk
				title="Edit Latex Equation"
				onConfirm={this.onConfirm.bind(this)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}
			>
				<div className={`math-equation-properties`}>
					<div>
						<label>Latex Equation:</label>
						<input
							type="text"
							id="obojobo-draft--chunks--math-equation--latex"
							ref={'input'}
							value={this.state.latex || ''}
							onChange={this.handleLatexChange.bind(this)}
						/>
						<label>Optional Equation Label:</label>
						<input
							type="text"
							id="obojobo-draft--chunks--math-equation--label"
							value={this.state.label || ''}
							onChange={this.handleLabelChange.bind(this)}
						/>
					</div>
					<span>{this.state.error}</span>
				</div>
			</SimpleDialog>
		)
	}
}

export default MathEquationProperties
