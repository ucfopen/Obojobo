import React from 'react'
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

		// If href is empty, remove the link
		if (!href || !/[^\s]/.test(href)) {
			editor.removeMarkByKey(
				this.props.node.key,
				this.props.offset,
				this.props.text.length,
				this.props.mark
			)
		}

		return editor.setMarkByKey(
			this.props.node.key,
			this.props.offset,
			this.props.text.length,
			this.props.mark,
			{ data: { href } }
		)
	}

	showLinkModal() {
		ModalUtil.show(
			<Prompt
				title="Edit Link"
				message="Enter the link url:"
				value={this.props.mark.data.get('href')}
				onConfirm={this.changeLinkValue.bind(this)}
			/>
		)
	}

	render() {
		return (
			<span className="editor--components--mark--link">
				<a href={this.props.mark.data.get('href')} title={this.props.mark.data.get('href')}>
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
