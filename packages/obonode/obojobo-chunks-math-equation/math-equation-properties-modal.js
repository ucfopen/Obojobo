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

		this.inputRef = React.createRef()

		this.state = ({
			content: this.props.content,
			error: ''
		})
	}

	handleLatexChange(event) {
		const latex = event.target.value

		this.setState({
			...this.state,
			content: {
				...this.state.content,
				latex,
			}
		})
	}

	handleAltChange(event) {
		const alt = event.target.value

		return this.setState({ alt })
	}

	handleLabelChange(event) {
		const label = event.target.value

		this.setState({
			...this.state,
			content: { 
				...this.state.content,
				label
			}
		})
	}

	focusOnFirstElement() {
		return this.inputRef.current.focus()
	}

	onConfirm() {
		const katexHtml = getLatexHtml(this.state.content.latex)

		if (katexHtml.error) {
			return this.setState({ error: katexHtml.error.message })
		}

		return this.props.onConfirm(this.state.content)
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
							ref={this.inputRef}
							value={this.state.content.latex || ''}
							onChange={this.handleLatexChange.bind(this)}
						/>
						<label>Alt:</label>
						<input
							type="text"
							id="obojobo-draft--chunks--math-equation--alt"
							value={this.state.alt || ''}
							onChange={this.handleAltChange.bind(this)}
						/>
						<label>Optional Equation Label:</label>
						<input
							type="text"
							id="obojobo-draft--chunks--math-equation--label"
							value={this.state.content.label || ''}
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
