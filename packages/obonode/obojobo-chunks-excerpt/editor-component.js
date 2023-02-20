import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import React from 'react'
import './editor-component.scss'
import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
const { Button } = Common.components

class Excerpt extends React.Component {
	constructor(props) {
		super(props)
	}

	delete() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.removeNodes(this.props.editor, { at: path })
	}

	render() {
		const content = this.props.element.content

		return (
			<Node {...this.props}>
				<div
					className={`text-chunk obojobo-draft--chunks--excerpt pad ${
						this.props.selected ? 'is-selected' : 'is-not-selected'
					} is-body-style-type-${content.bodyStyle} is-top-edge-type-${
						content.topEdge
					} is-bottom-edge-type-${content.bottomEdge} is-width-${content.width} is-font-${
						content.font
					} is-line-height-type-${content.lineHeight} is-font-size-${content.fontSize} ${
						content.effect ? 'is-showing-effect' : 'is-not-showing-effect'
					}`}
				>
					<blockquote>{this.props.children}</blockquote>
					<Button className="delete-button" onClick={() => this.delete()} contentEditable={false}>
						×
					</Button>
				</div>
			</Node>
		)
	}
}

export default withSlateWrapper(Excerpt)
