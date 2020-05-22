import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

const { Button } = Common.components

class MCFeedback extends React.Component {
	constructor(props){
		super(props)
		this.delete = this.delete.bind(this)
	}

	delete() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.removeNodes(this.props.editor, { at: path })
	}

	render() {
		return (
			<div className="component obojobo-draft--chunks--mc-assessment--mc-feedback editor-feedback">
				<Button className="delete-button" onClick={this.delete}>
					×
				</Button>
				<span className="label" contentEditable={false}>
					Feedback
				</span>
				{this.props.children}
			</div>
		)
	}
}

export default withSlateWrapper(MCFeedback)
