import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import katex from 'katex'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import debounce from 'obojobo-document-engine/src/scripts/common/util/debounce'
import EditableHiddenText from 'obojobo-document-engine/src/scripts/oboeditor/components/editable-hidden-text'

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

		// This debounce is necessary to get slate to update the node data.
		// I've tried several ways to remove it but haven't been able to
		// get it work :(
		// If you have a solution please have at it!
		this.updateNodeFromState = debounce(1, this.updateNodeFromState)

		// copy the attributes we want into state
		const content = this.props.node.data.get('content')
		this.state = this.contentToStateObj(content)
	}

	contentToStateObj(content) {
		return {
			latex: content.latex || '',
			alt: content.alt || '',
			label: content.label || '',
			size: content.size || 1
		}
	}

	changeProperties(content) {
		const editor = this.props.editor

		editor.setNodeByKey(this.props.node.key, {
			data: { content }
		})

		this.setState(this.contentToStateObj(content))
	}

	renderEmptyEquation() {
		return (
			<div className="non-editable-chunk">
				<div className="katex-display">
					<span className="no-equation">No Equation (Click to edit)</span>
				</div>
			</div>
		)
	}

	renderLatex() {
		if (!this.state.latex && !this.state.label) return this.renderEmptyEquation()

		let katexHtml = getLatexHtml(this.state.latex)
		if (katexHtml.error) {
			return (
				<div className={'katex-container katex-error'}>
					<p>{katexHtml.error.message}</p>
				</div>
			)
		}

		katexHtml = katexHtml.html

		return (
			<div className="non-editable-chunk">
				<div
					className="katex-container"
					style={{ fontSize: this.state.size + 'em' }}
					dangerouslySetInnerHTML={{ __html: katexHtml }}
				/>
				{this.state.label === '' ? null : <div className="equation-label">{this.state.label}</div>}
			</div>
		)
	}

	updateNodeFromState() {
		const content = this.props.node.data.get('content')
		this.props.editor.setNodeByKey(this.props.node.key, {
			data: { content: { ...content, ...this.state } }
		})
	}

	onChangeContent(key, event) {
		const newContent = { [key]: event.target.value }
		this.setState(newContent) // update the display now
	}

	componentDidUpdate(prevProps) {
		if (prevProps.isSelected && !this.props.isSelected) {
			this.updateNodeFromState()
		} else if (!prevProps.isSelected && this.props.isSelected) {
			setTimeout(() => {
				document.getElementById('math-equation-latex').focus()
			}, 1)
		}
	}

	renderAttributes() {
		return (
			<div className="attributes-box" contentEditable={false}>
				<div className="box-border">
					<div className="attributes-list">
						<div>
							<label htmlFor="math-equation-latex">Latex:</label>
							<input
								id="math-equation-latex"
								value={this.state.latex}
								onClick={event => event.stopPropagation()}
								onChange={this.onChangeContent.bind(this, 'latex')}
							/>
						</div>
						<div>
							<label htmlFor="math-equation-label">Optional Label:</label>
							<input
								id="math-equation-label"
								value={this.state.label}
								onClick={event => event.stopPropagation()}
								onChange={this.onChangeContent.bind(this, 'label')}
							/>
						</div>
						<div>
							<label htmlFor="math-equation-alt">Alt Text:</label>
							<input
								id="math-equation-alt"
								value={this.state.alt}
								onClick={event => event.stopPropagation()}
								onChange={this.onChangeContent.bind(this, 'alt')}
							/>
						</div>
						<div>
							<label htmlFor="math-equation-size">Size:</label>
							<input
								id="math-equation-size"
								value={this.state.size}
								type="number"
								step="0.1"
								onClick={event => event.stopPropagation()}
								onChange={this.onChangeContent.bind(this, 'size')}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}

	render() {
		const { isSelected, node } = this.props
		const content = node.data.get('content')
		return (
			<Node {...this.props}>
				<div
					className={
						'component obojobo-draft--chunks--math-equation pad ' +
						'align-' +
						(content.align || 'center')
					}
					contentEditable={false}
				>
					{this.renderLatex()}
					{isSelected ? this.renderAttributes() : null}
					<EditableHiddenText>{this.props.children}</EditableHiddenText>
				</div>
			</Node>
		)
	}
}

export default MathEquation
