import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import katex from 'katex'
import { Transforms, Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import debounce from 'obojobo-document-engine/src/scripts/common/util/debounce'

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

		this.updateNodeFromState = debounce(200, this.updateNodeFromState)

		// copy the attributes we want into state
		const content = this.props.element.content
		this.state = this.contentToStateObj(content)

		this.freezeEditor = this.freezeEditor.bind(this)
		this.unfreezeEditor = this.unfreezeEditor.bind(this)
		this.focusEquation = this.focusEquation.bind(this)
	}

	contentToStateObj(content) {
		return {
			latex: content.latex || '',
			alt: content.alt || '',
			label: content.label || '',
			size: content.size || 1
		}
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
		const content = this.props.element.content
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(
			this.props.editor, 
			{ content: {...content, ...this.state} }, 
			{ at: path }
		)
	}

	onChangeContent(key, event) {
		event.stopPropagation()
		const newContent = { [key]: event.target.value }
		this.setState(newContent) // update the display now
		this.updateNodeFromState() // debounced to reduce lag as it updates the document
	}

	freezeEditor() {
		this.props.editor.toggleEditable(false)
	}

	unfreezeEditor() {
		this.props.editor.toggleEditable(true)
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
								onFocus={this.freezeEditor}
								onBlur={this.unfreezeEditor}
							/>
						</div>
						<div>
							<label htmlFor="math-equation-label">Optional Label:</label>
							<input
								id="math-equation-label"
								value={this.state.label}
								onClick={event => event.stopPropagation()}
								onChange={this.onChangeContent.bind(this, 'label')}
								onFocus={this.freezeEditor}
								onBlur={this.unfreezeEditor}
							/>
						</div>
						<div>
							<label htmlFor="math-equation-alt">Alt Text:</label>
							<input
								id="math-equation-alt"
								value={this.state.alt}
								onClick={event => event.stopPropagation()}
								onChange={this.onChangeContent.bind(this, 'alt')}
								onFocus={this.freezeEditor}
								onBlur={this.unfreezeEditor}
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
								onFocus={this.freezeEditor}
								onBlur={this.unfreezeEditor}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}

	focusEquation(event) {
		event.preventDefault()
		event.stopPropagation()
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		const start = Editor.start(this.props.editor, path)
		Transforms.setSelection(this.props.editor, {
			focus: start,
			anchor: start
		})
	}

	render() {
		const content = this.props.element.content
		return (
			<Node {...this.props}>
				<div
					className={
						'component obojobo-draft--chunks--math-equation pad ' +
						'align-' +
						(content.align || 'center')
					}
					onClick={this.focusEquation}>
					{this.renderLatex()}
					{this.props.selected ? this.renderAttributes() : null}
				</div>
				{this.props.children}
			</Node>
		)
	}
}

export default withSlateWrapper(MathEquation)
