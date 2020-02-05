import React from 'react'
import { Transforms, Node, Editor, Path } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'

import './link.scss'

const { Prompt } = Common.components.modal
const { ModalUtil } = Common.util

class Link extends React.Component {
	constructor(props) {
		super(props)
	}

	changeLinkValue(href) {
		const editor = this.props.editor
		const key = ReactEditor.findKey(editor, this.props.leaf)
		console.log(key)
		const path = ReactEditor.findPath(editor, this.props.leaf)

		// If href is empty, remove the link
		if (!href || !/[^\s]/.test(href)) {
			Transforms.setNodes(this.props.editor, { a: false, href }, { at: path })
		}

		Transforms.setNodes(this.props.editor, { href }, { at: path })
	}

	showLinkModal() {
		ModalUtil.show(
			<Prompt
				title="Edit Link"
				message="Enter the link url:"
				value={this.props.leaf.href}
				onConfirm={this.changeLinkValue.bind(this)}
			/>
		)
	}

	render() {
		return (
			<span className="editor--components--mark--link">
				<a href={this.props.leaf.href} title={this.props.leaf.href}>
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

export default Link
