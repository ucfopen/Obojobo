import React from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'
import ClipboardUtil from '../../util/clipboard-util'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

import './link.scss'

const { Prompt } = Common.components.modal
const { ModalUtil } = Common.util

class Link extends React.Component {
	constructor(props) {
		super(props)
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

	createSrc(src) {
		src = '' + src

		const lcSrc = src.toLowerCase()
		if (
			!(
				lcSrc.indexOf('http://') === 0 ||
				lcSrc.indexOf('https://') === 0 ||
				lcSrc.indexOf('//') === 0
			)
		) {
			src = '//' + src
		}

		return src
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
				onConfirm={this.changeLinkValue.bind(this)}
			/>
		)
	}

	render() {
		return (
			<span className="editor--components--mark--link">
				<a href={this.props.element.href} title={this.props.element.href}>
					{this.props.children}
				</a>
				{this.props.selected ? (
					<span className="href-menu" contentEditable={false}>
						<a
							href={this.createSrc(this.props.element.href)}
							target="_blank"
							rel="noopener noreferrer"
						>
							Go to {this.props.element.href}
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
							title="Remove"
							aria-label="Remove"
							onClick={() => this.removeLink()}
						/>
					</span>
				) : null}
			</span>
		)
	}
}

export default withSlateWrapper(Link)
