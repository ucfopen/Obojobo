import React from 'react'
import katex from 'katex'

const MATH_NODE = 'ObojoboDraft.Chunks.MathEquation'

class Node extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	handleLatexChange(event) {
		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ latex: event.target.value })

		change.setNodeByKey(this.props.node.key, { data: { content: {
			latex: event.target.value,
			label: this.state.latex
		}}})
		editor.onChange(change)
	}

	handleLabelChange(event) {
		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ label: event.target.value })

		change.setNodeByKey(this.props.node.key, { data: { content: {
			label: event.target.value,
			latex: this.state.latex
		}}})
		editor.onChange(change)
	}

	renderLatex() {
		let katexHtml = getLatexHtml(this.state.latex)
		if (katexHtml.error) {
			console.log(katexHtml)
			return (
				<div className={'katex-container katex-error'}>
					<p>{katexHtml.error.message}</p>
				</div>
			)
		}

		katexHtml = katexHtml.html
		if (katexHtml.length === 0) {
			return null
		}

		return (
			<div className={'non-editable-chunk'}>
				<div
					className="katex-container"
					dangerouslySetInnerHTML={{ __html: katexHtml }}
				/>
				{this.state.label === '' ? null : (<div className="equation-label">{this.state.label}</div>)}
			</div>
		)
	}

	renderEquationEditor() {
		const { isFocused } = this.props

		return (
			<div className={'equation-editor'}>
				<div>
					<p>Latex Equation</p>
					<input
						name={'Latex Equation'}
						value={this.state.latex}
						onChange={event => this.handleLatexChange(event)}
						onClick={event => event.stopPropagation()}
						frameBorder="0"/>
				</div>
				<div>
					<p>Equation Label</p>
					<input
						name={'Equation Label'}
						value={this.state.label}
						onChange={event => this.handleLabelChange(event)}
						onClick={event => event.stopPropagation()}
						frameBorder="0"/>
				</div>
			</div>
		)
	}

	render() {
		return (
			<div className={'component obojobo-draft--chunks--math-equation pad align-center'} {...this.props.attributes} >
				{this.renderLatex()}
				{this.renderEquationEditor()}
			</div>
		)
	}
}

const getLatexHtml = latex => {
	try {
		let html = katex.renderToString(latex, { displayMode: true })
		return { html }
	} catch (e) {
		return { error: e }
	}
}

const insertNode = change => {
	change
		.insertBlock({
			type: MATH_NODE,
			data: { content: { latex: '', label: ''} },
			isVoid: true
		})
		.collapseToStartOfNextText()
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case MATH_NODE:
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.MathEquation': {
				isVoid: true
			}
		}
	}
}

const MathEquation = {
	components: {
		Node,
	},
	helpers: {
		insertNode,
		slateToObo
	},
	plugins
}

export default MathEquation
