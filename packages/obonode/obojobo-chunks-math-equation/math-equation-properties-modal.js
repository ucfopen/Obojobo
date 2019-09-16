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

		this.state = {
			content: this.props.content,
			error: ''
		}
	}

	handleLatexChange(event) {
		const latex = event.target.value

		this.setState({
			...this.state,
			error: '',
			content: {
				...this.state.content,
				latex
			}
		})
	}

	handleAltChange(event) {
		const alt = event.target.value

		this.setState({
			...this.state,
			content: {
				...this.state.content,
				alt
			}
		})
	}

	handleSizeChange(event) {
		const size = event.target.value

		this.setState({
			...this.state,
			content: {
				...this.state.content,
				size
			}
		})
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

	getEquationHTML() {
		let katexHtml = getLatexHtml(this.state.content.latex)
		if (katexHtml.error) {
			katexHtml = ''
		} else {
			katexHtml = katexHtml.html
		}

		if (katexHtml.length === 0) {
			return null
		} else {
			return katexHtml
		}
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
						<span className="error">{this.state.error}</span>
						<label>Alt:</label>
						<input
							type="text"
							id="obojobo-draft--chunks--math-equation--alt"
							value={this.state.content.alt || ''}
							onChange={this.handleAltChange.bind(this)}
						/>
						<label>Optional Equation Label:</label>
						<input
							type="text"
							id="obojobo-draft--chunks--math-equation--label"
							value={this.state.content.label || ''}
							onChange={this.handleLabelChange.bind(this)}
						/>
						<label>Size: (1 is the default font size)</label>
						<input
							type="number"
							step="0.1"
							min="0.5"
							max="10"
							id="obojobo-draft--chunks--math-equation--size"
							value={this.state.content.size || 1}
							onChange={this.handleSizeChange.bind(this)}
						/>
					</div>
					<div className={'preview-container'}>
						<span className="preview-title">Equation Preview</span>
						<div className="katex-container">
							<div
								style={{ fontSize: this.state.content.size + 'em' }}
								aria-hidden
								className={'katex-preview'}
								dangerouslySetInnerHTML={{ __html: this.getEquationHTML() }}
							/>
						</div>
					</div>
				</div>
			</SimpleDialog>
		)
	}
}

export default MathEquationProperties
