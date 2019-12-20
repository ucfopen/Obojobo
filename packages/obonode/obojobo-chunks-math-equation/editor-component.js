import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import katex from 'katex'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import RestoreSelectionInput from './restore-selection-input'

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

		this.inputRef = React.createRef()
	}

	changeProperties(content) {
		const editor = this.props.editor

		editor.setNodeByKey(this.props.node.key, {
			data: { content }
		})
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
		const content = this.props.node.data.get('content')
		if (!content.latex && !content.label) return this.renderEmptyEquation()

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
			<div className="non-editable-chunk">
				<div
					className="katex-container"
					style={{ fontSize: content.size + 'em' }}
					dangerouslySetInnerHTML={{ __html: katexHtml }}
				/>
				{content.label === '' ? null : <div className="equation-label">{content.label}</div>}
			</div>
		)
	}

	onChangeContent(key, event) {
		event.stopPropagation()

		const newContent = {}
		newContent[key] = event.target.value

		const cursorPosition = event.target.selectionStart

		const content = this.props.node.data.get('content')

		this.props.editor.setNodeByKey(this.props.node.key, {
			data: { content: { ...content, ...newContent } }
		})
	}

	renderAttributes() {
		const content = this.props.node.data.get('content')
		return (
			<div className="attributes-box" contentEditable={false}>
				<div className="box-border">
					<div className="attributes-list">
						<div>
							<label>Latex:</label>
							<RestoreSelectionInput
								ref={this.inputRef}
								value={content.latex}
								onClick={event => event.stopPropagation()}
								onChange={this.onChangeContent.bind(this, 'latex')}
							/>
						</div>
						<div>
							<label>Optional Label:</label>
							<RestoreSelectionInput
								value={content.label}
								onClick={event => event.stopPropagation()}
								onChange={this.onChangeContent.bind(this, 'label')}
							/>
						</div>
						<div>
							<label>Alt Text:</label>
							<RestoreSelectionInput
								value={content.alt}
								onClick={event => event.stopPropagation()}
								onChange={this.onChangeContent.bind(this, 'alt')}
							/>
						</div>
						<div>
							<label>Size:</label>
							<RestoreSelectionInput
								value={content.size || 1}
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
		const { isSelected } = this.props
		const content = this.props.node.data.get('content')
		return (
			<Node {...this.props}>
				<div
					className={
						'component obojobo-draft--chunks--math-equation pad ' +
						'align-' +
						(content.align || 'center')
					}
				>
					{this.renderLatex()}
					{isSelected ? this.renderAttributes() : null}
				</div>
			</Node>
		)
	}
}

export default MathEquation
