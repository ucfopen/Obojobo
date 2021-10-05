import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import { Transforms, Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import debounce from 'obojobo-document-engine/src/scripts/common/util/debounce'
import {
	freezeEditor,
	unfreezeEditor
} from 'obojobo-document-engine/src/scripts/oboeditor/util/freeze-unfreeze-editor'

const { Button } = Common.components
const isOrNot = Common.util.isOrNot

const getLatexHtml = latex => {
	try {
		const html = window.katex.renderToString(latex, { displayMode: true })
		return { html }
	} catch (e) {
		return { error: e }
	}
}

const restrictSize = size => {
	return Math.min(20, Math.max(0.1, parseFloat(size) || 1))
}

class MathEquation extends React.Component {
	constructor(props) {
		super(props)

		// copy the attributes we want into state
		this.state = this.contentToStateObj(this.props.element.content)

		// used to reduce the speed/cost of changes so typing isn't slow
		// ALSO make sure changes are copied to slate after editing
		// in case the edit window doesnt close before clicking save or preview
		this.updateNodeFromStateAfterInput = debounce(200, this.updateNodeFromState)

		// This debounce is necessary to get slate to update the node data.
		// I've tried several ways to remove it but haven't been able to
		// get it work :(
		// If you have a solution please have at it!
		this.updateNodeFromState = debounce(1, this.updateNodeFromState)

		this.openAndFreezeEditor = this.openAndFreezeEditor.bind(this)
		this.closeAndUnfreezeEditor = this.closeAndUnfreezeEditor.bind(this)
		this.focusEquation = this.focusEquation.bind(this)
		this.returnFocusOnTab = this.returnFocusOnTab.bind(this)
		this.closeOnTabForwards = this.closeOnTabForwards.bind(this)
		this.closeOnTabBackwards = this.closeOnTabBackwards.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.equationInput = React.createRef()
		this.node = React.createRef()
	}

	componentDidUpdate(prevProps, prevState) {
		const isClosing = Boolean(prevState.open) && !this.state.open
		const isOpening = !prevState.open && Boolean(this.state.open)
		const isUnselecting = Boolean(prevProps.selected) && !this.props.selected

		if (isOpening) {
			document.addEventListener('mousedown', this.handleClick, false)
		}

		// This autofocuses the id input box when the node is opened
		// for easy use by keyboard users
		if (isClosing) {
			document.removeEventListener('mousedown', this.handleClick, false)
		}

		if (isClosing || isUnselecting) {
			this.updateNodeFromState()
		}

		if (isUnselecting) {
			this.closeAndUnfreezeEditor()
		}
	}

	handleClick(event) {
		if (!this.node.current || this.node.current.contains(event.target)) return

		// When the click is outside the box, close the box
		return this.closeAndUnfreezeEditor()
	}

	contentToStateObj(content) {
		return {
			latex: content.latex || '',
			alt: content.alt || '',
			label: content.label || '',
			size: restrictSize(content.size),
			open: false
		}
	}

	returnFocusOnTab(event) {
		// Since there is only one button when the dialog is closed,
		// return on both tab and shift-tab
		if (event.key === 'Tab') {
			event.preventDefault()
			return ReactEditor.focus(this.props.editor)
		}
	}

	// These two are used to return focus from the open dialog,
	// so they close the dialog before they return
	closeOnTabForwards(event) {
		if (event.key === 'Tab' && !event.shiftKey) {
			event.preventDefault()
			return this.closeAndUnfreezeEditor()
		}
	}

	closeOnTabBackwards(event) {
		if (event.key === 'Tab' && event.shiftKey) {
			event.preventDefault()
			return this.closeAndUnfreezeEditor()
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

	onBlurSize() {
		this.setState({
			size: restrictSize(this.state.size)
		})
	}

	updateNodeFromState() {
		const content = this.props.element.content
		delete this.state.open
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(this.props.editor, { content: { ...content, ...this.state } }, { at: path })
	}

	onChangeContent(key, event) {
		const newContent = { [key]: event.target.value }
		this.setState(newContent) // update the display now
	}

	openAndFreezeEditor() {
		this.setState({ open: true })
		freezeEditor(this.props.editor)
		// Waits for the readOnly state to percolate before focusing
		setTimeout(() => {
			this.equationInput.current.focus()
			this.equationInput.current.select()
		}, 200)
	}

	closeAndUnfreezeEditor() {
		this.setState({ open: false })
		unfreezeEditor(this.props.editor)
	}

	renderAttributes() {
		return (
			<div className="attributes-list">
				<div className="attribute">
					<label htmlFor="math-equation-latex">Latex:</label>
					<textarea
						id="math-equation-latex"
						value={this.state.latex}
						ref={this.equationInput}
						onClick={event => event.stopPropagation()}
						onChange={this.onChangeContent.bind(this, 'latex')}
						onKeyDown={this.closeOnTabBackwards}
					/>
				</div>
				<div className="attribute">
					<label htmlFor="math-equation-label">Optional Label:</label>
					<input
						id="math-equation-label"
						value={this.state.label}
						onClick={event => event.stopPropagation()}
						onChange={this.onChangeContent.bind(this, 'label')}
					/>
				</div>
				<div className="attribute">
					<label htmlFor="math-equation-alt">Alt Text:</label>
					<input
						id="math-equation-alt"
						value={this.state.alt}
						onClick={event => event.stopPropagation()}
						onChange={this.onChangeContent.bind(this, 'alt')}
					/>
				</div>
				<div className="attribute">
					<label htmlFor="math-equation-size">Size:</label>
					<input
						id="math-equation-size"
						value={this.state.size}
						type="number"
						step="0.1"
						max="20"
						min="0.1"
						onClick={event => event.stopPropagation()}
						onChange={this.onChangeContent.bind(this, 'size')}
						onBlur={() => {
							this.onBlurSize()
						}}
					/>
				</div>
				<div>
					<Button onClick={this.closeAndUnfreezeEditor} onKeyDown={this.closeOnTabForwards}>
						Done
					</Button>
				</div>
			</div>
		)
	}

	renderEditBox() {
		const className = 'attributes-box ' + isOrNot(this.state.open, 'open')

		return (
			<div className={className} contentEditable={false}>
				<div className="box-border">
					{!this.state.open ? (
						<Button onClick={this.openAndFreezeEditor} onKeyDown={this.returnFocusOnTab}>
							Edit
						</Button>
					) : (
						this.renderAttributes()
					)}
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

		// this is an attempt to detect when slate
		// has no selection and this node is the
		// first item to get clicked on
		// Slate doesn't end up selecting it, so we'll
		// do it manually.
		if (!this.props.editor.selection) {
			Transforms.select(this.props.editor, path)
		}
	}

	render() {
		const content = this.props.element.content
		return (
			<Node {...this.props}>
				<div
					ref={this.node}
					className={
						'component obojobo-draft--chunks--math-equation pad ' +
						'align-' +
						(content.align || 'center')
					}
					contentEditable={false}
					onClick={this.focusEquation}
				>
					{this.renderLatex()}
					{this.props.selected ? this.renderEditBox() : null}
				</div>
				{this.props.children}
			</Node>
		)
	}
}

export default withSlateWrapper(MathEquation)
