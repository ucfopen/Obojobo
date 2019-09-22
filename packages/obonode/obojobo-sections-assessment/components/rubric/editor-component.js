import React from 'react'
import { Block } from 'slate'
import './editor-component.scss'
import Common from 'obojobo-document-engine/src/scripts/common'
import emptyMod from './empty-mod.json'

const { Button } = Common.components
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

class Node extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	addMod() {
		const editor = this.props.editor

		// If we are adding the first mod, we need to add a ModList
		if (this.props.node.nodes.size < 5) {
			const modlist = Block.create({
				type: MOD_LIST_NODE,
				nodes: [emptyMod]
			})
			return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, modlist)
		}

		const modlist = this.props.node.nodes.get(4)

		const mod = Block.create(emptyMod)
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
				<Button className={'add-button'} onClick={() => this.addMod()}>
					{'Add Mod'}
				</Button>
				<Button className={'delete-button'} onClick={() => this.deleteNode()}>
					×
				</Button>
			</div>
		)
	}
}

export default Node
