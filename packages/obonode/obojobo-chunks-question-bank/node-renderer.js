import AlignMarks from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/align-marks'
import BasicMarks from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/basic-marks'
import Common from 'obojobo-document-engine/src/scripts/common'
import IndentMarks from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/indent-marks'
import LinkMark from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/link-mark'
import ScriptMarks from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/script-marks'

import React from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

class NodeRenderer extends React.Component {
	constructor(props) {
		super(props)

		this.renderLeaf = this.renderLeaf.bind(this)
		this.renderElement = this.renderElement.bind(this)

		this.editor = this.withPlugins(withReact(createEditor()))
	}

	withPlugins(editor) {
		this.plugins = [
			BasicMarks.plugins,
			LinkMark.plugins,
			ScriptMarks.plugins,
			AlignMarks.plugins,
			IndentMarks.plugins
		]

		this.renderLeafPlugins = this.plugins.filter(plugins => plugins.renderLeaf)

		return editor
	}

	renderLeaf(props) {
		props = this.renderLeafPlugins.reduce((props, plugin) => plugin.renderLeaf(props), props)
		const { attributes, children } = props

		return <span {...attributes}>{children}</span>
	}

	renderElement(props) {
		if (props.element.type === 'a') return LinkMark.plugins.renderNode(props)

		const item = Common.Registry.getItemForType(props.element.type)
		if (item) {
			return item.plugins.renderNode(props)
		}
	}

	render() {
		return (
			<Slate editor={this.editor} value={this.props.value}>
				<Editable renderElement={this.renderElement} renderLeaf={this.renderLeaf} readOnly={true} />
			</Slate>
		)
	}
}

export default NodeRenderer
