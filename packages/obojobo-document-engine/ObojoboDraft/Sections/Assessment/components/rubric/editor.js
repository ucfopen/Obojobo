import React from 'react'
import { Block } from 'slate'

//import Node from './editor-component'
import Schema from './schema'
import Converter from './converter'

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const MOD_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.Mod'
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

class Mod extends React.Component {
	deleteNode() {
		const editor = this.props.editor

		const parent = editor.value.document.getDescendant(this.props.parent.key)

		const sibling = parent.nodes.get(1)

		// If this is the only row in the list, delete the list
		if (!sibling) {
			return editor.removeNodeByKey(parent.key)
		}

		return editor.removeNodeByKey(this.props.node.key)
	}

	render() {
		return (
			<div className={'mod pad'}>
				{this.props.children}
				<button
					className={'editor--page-editor--delete-node-button'}
					onClick={() => this.deleteNode()}
				>
					X
				</button>
			</div>
		)
	}
}

const ModList = props => {
	return (
		<div>
			<p contentEditable={false}>{'Mods:'}</p>
			{props.children}
		</div>
	)
}

class Node extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	addMod() {
		const editor = this.props.editor

		// If we are adding the first mod, we need to add a ModList
		if (this.props.node.nodes.size < 5) {
			const modlist = Block.create({ type: MOD_LIST_NODE })
			return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, modlist)
		}

		const modlist = this.props.node.nodes.get(4)

		const mod = Block.create({ type: MOD_NODE })
		return editor.insertNodeByKey(modlist.key, modlist.nodes.size, mod)
	}

	deleteNode() {
		const editor = this.props.editor

		return editor.removeNodeByKey(this.props.node.key)
	}

	render() {
		return (
			<div className={'rubric pad'}>
				<h1 contentEditable={false}>{'Rubric'}</h1>
				<div className={'parameter-node'} contentEditable={false}>
					{'Type: ' + this.state.type}
				</div>
				{this.props.children}
				<button className={'add-button'} onClick={() => this.addMod()}>
					{'Add Mod'}
				</button>
				<button
					className={'editor--page-editor--delete-node-button'}
					onClick={() => this.deleteNode()}
				>
					X
				</button>
			</div>
		)
	}
}

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case MOD_NODE:
				return <Mod {...props} {...props.attributes} />
			case MOD_LIST_NODE:
				return <ModList {...props} {...props.attributes} />
			case RUBRIC_NODE:
				return <Node {...props} {...props.attributes} />
			default:
				return next()
		}
	},
	schema: Schema
}

const Rubric = {
	components: {
		Node,
		ModList,
		Mod
	},
	helpers: {
		slateToObo: Converter.slateToObo,
		oboToSlate: Converter.oboToSlate
	},
	plugins
}

export default Rubric
