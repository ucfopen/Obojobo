import React from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'
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
				<button
					className="link-edit"
					aria-label="Edit Link"
					onClick={this.showLinkModal.bind(this)}
				/>
			</span>
		)
	}
}

export default withSlateWrapper(Link)
