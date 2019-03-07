import React from 'react'
import katex from 'katex'

const getLatexHtml = latex => {
	try {
		const html = katex.renderToString(latex, { displayMode: true })
		return { html }
	} catch (e) {
		return { error: e }
	}
}

class MathEquation extends React.Component {
	constructor(props) {
		super(props)
	}

	handleLatexChange(event) {
		const editor = this.props.editor
		const change = editor.value.change()
		const content = this.props.node.data.get('content')

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					label: content.label,
					latex: event.target.value,
					align: content.align
				}
			}
		})
		editor.onChange(change)
	}

	handleLabelChange(event) {
		const editor = this.props.editor
		const change = editor.value.change()
		const content = this.props.node.data.get('content')

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					label: event.target.value,
					latex: content.latex,
					align: content.align
				}
			}
		})
		editor.onChange(change)
	}

	renderLatex() {
		const content = this.props.node.data.get('content')
		let katexHtml = getLatexHtml(content.latex)
		if (katexHtml.error) {
			return (
				<div className={'katex-container katex-error'}>
					<p>{katexHtml.error.message}</p>
				</div>
			)
		}

		katexHtml = katexHtml.html

		return (
			<div className={'non-editable-chunk'}>
				<div className="katex-container" dangerouslySetInnerHTML={{ __html: katexHtml }} />
				{content.label === '' ? null : <div className="equation-label">{content.label}</div>}
			</div>
		)
	}

	renderEquationEditor() {
		const content = this.props.node.data.get('content')
		return (
			<div className={'equation-editor'}>
				<div>
					<p>Latex Equation</p>
					<input
						name={'Latex Equation'}
						value={content.latex}
						onChange={event => this.handleLatexChange(event)}
						onClick={event => event.stopPropagation()}
						frameBorder="0"
					/>
				</div>
				<div>
					<p>Equation Label</p>
					<input
						name={'Equation Label'}
						value={content.label}
						onChange={event => this.handleLabelChange(event)}
						onClick={event => event.stopPropagation()}
						frameBorder="0"
					/>
				</div>
			</div>
		)
	}

	render() {
		const content = this.props.node.data.get('content')
		return (
			<div
				className={'component obojobo-draft--chunks--math-equation pad ' + 'align-' + content.align}
			>
				{this.renderLatex()}
				{this.renderEquationEditor()}
			</div>
		)
	}
}

export default MathEquation
