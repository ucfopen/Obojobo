import './link.scss'

import React from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'
import ClipboardUtil from '../../util/clipboard-util'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

const { Prompt } = Common.components.modal
const { ModalUtil, withProtocol } = Common.util

class Link extends React.Component {
	constructor(props) {
		super(props)

		this.hrefMenuRef = React.createRef()
		this.changeLinkValue = this.changeLinkValue.bind(this)
		this.onIntersectionChange = this.onIntersectionChange.bind(this)
		this.startObservingForIntersectionChanges = this.startObservingForIntersectionChanges.bind(this)
		this.stopObserveringForIntersectionChanges = this.stopObserveringForIntersectionChanges.bind(
			this
		)

		this.state = {
			// This property is for how many pixels to push the menu towards the left, ensuring
			// that it stays completely visible by reamining inside the viewport
			menuTranslateX: 0
		}
	}

	changeLinkValue(href) {
		ModalUtil.hide()
		const editor = this.props.editor
		const path = ReactEditor.findPath(editor, this.props.element)

		// If href is empty, remove the link
		if (!href || !/[^\s]/.test(href)) {
			return Transforms.unwrapNodes(editor, { at: path })
		}

		Transforms.setNodes(editor, { href }, { at: path })
	}

	removeLink() {
		const editor = this.props.editor
		const path = ReactEditor.findPath(editor, this.props.element)
		return Transforms.unwrapNodes(editor, { at: path })
	}

	showLinkModal() {
		ModalUtil.show(
			<Prompt
				title="Edit Link"
				message="Enter the link url:"
				value={this.props.element.href}
				onConfirm={this.changeLinkValue}
			/>
		)
	}

	componentDidUpdate(prevProps) {
		if (this.props.selected === prevProps.selected) return

		if (this.props.selected) {
			this.startObservingForIntersectionChanges()
			return
		}

		// If this component is no longer "selected" stop the Intersection Observer and reset
		this.stopObserveringForIntersectionChanges()
		this.setState({ menuTranslateX: 0 })
	}

	startObservingForIntersectionChanges() {
		this.observer = new IntersectionObserver(this.onIntersectionChange, {
			root: null,
			rootMargin: '0px',
			threshold: 1
		})

		this.observer.observe(this.hrefMenuRef.current)
	}

	stopObserveringForIntersectionChanges() {
		if (!this.observer) return false

		this.observer.disconnect()
		delete this.observer

		return true
	}

	onIntersectionChange(changes) {
		// If we need to move the element we stop checking, otherwise we can get in an infinite
		// loop of moving the menu over and over again
		if (this.state.menuTranslateX > 0) {
			return false
		}

		// We only have a single threshold so we should only have one change entry
		const change = changes[0]

		if (change.intersectionRatio < 1) {
			// Element is at least partially outside of the viewport
			this.setState({
				menuTranslateX:
					(1 - change.intersectionRatio) * this.hrefMenuRef.current.getBoundingClientRect().width +
					1
			})
		} else {
			// Element is completely within the viewport
			this.setState({
				menuTranslateX: 0
			})
		}

		return true
	}

	render() {
		return (
			<span className="editor--components--mark--link">
				<a href={this.props.element.href} title={this.props.element.href}>
					{this.props.children}
				</a>
				{this.props.selected ? (
					<span
						className="href-menu"
						contentEditable={false}
						ref={this.hrefMenuRef}
						style={{
							transform: `translate(-${this.state.menuTranslateX}px, 0px)`
						}}
					>
						<a
							href={withProtocol(this.props.element.href)}
							target="_blank"
							rel="noopener noreferrer"
						>
							Open {this.props.element.href}
						</a>
						<button
							className="link-copy"
							title="Copy"
							aria-label="Copy"
							onClick={() => ClipboardUtil.copyToClipboard(this.props.element.href)}
						/>
						<button
							className="link-edit"
							title="Edit"
							aria-label="Edit"
							onClick={() => this.showLinkModal()}
						/>
						<button
							className="link-remove"
							title="Remove link"
							aria-label="Remove link"
							onClick={() => this.removeLink()}
						/>
					</span>
				) : null}
			</span>
		)
	}
}

export default withSlateWrapper(Link)
