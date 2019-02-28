import React from 'react'
import { Block } from 'slate'
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations'

import ParameterNode from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node'

import './editor-component.scss'

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const MOD_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.Mod'
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

class Mod extends React.Component {
	deleteNode() {
		const editor = this.props.editor
		const change = editor.value.change()

		const parent = editor.value.document.getDescendant(this.props.parent.key)

		const sibling = parent.nodes.get(1)

		// If this is the only row in the table, delete the table
		if (!sibling) {
			change.removeNodeByKey(parent.key)
			editor.onChange(change)
			return
		}

		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
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
		const change = editor.value.change()

		// If we are adding the first mod, we need to add a ModList
		if (this.props.node.nodes.size < 5) {
			const modlist = Block.create({ type: MOD_LIST_NODE })
			change.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, modlist)

			editor.onChange(change)
			return
		}

		const modlist = this.props.node.nodes.get(4)

		const mod = Block.create({ type: MOD_NODE })
		change.insertNodeByKey(modlist.key, modlist.nodes.size, mod)

		editor.onChange(change)
	}

	deleteNode() {
		const editor = this.props.editor
		const change = editor.value.change()

		change.removeNodeByKey(this.props.node.key)

		editor.onChange(change)
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

const slateToObo = node => {
	const json = {}
	json.type = 'pass-fail'
	json.mods = []

	node.nodes.forEach(parameter => {
		if (parameter.type === MOD_LIST_NODE) {
			parameter.nodes.forEach(mod => {
				const oboMod = {
					attemptCondition: mod.nodes.get(0).text,
					reward: mod.nodes.get(1).text
				}

				json.mods.push(oboMod)
			})
		} else if (parameter.text !== '') {
			json[parameter.data.get('name')] = parameter.text
		}
	})

	if (json.mods.length === 0) delete json.mods

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.type = RUBRIC_NODE
	json.data = { content: node }

	json.nodes = []

	json.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'passingAttemptScore',
			value: node.passingAttemptScore,
			display: 'Passing Score'
		})
	)
	json.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'passedResult',
			value: node.passedResult,
			display: 'Passed Result'
		})
	)
	json.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'failedResult',
			value: node.failedResult,
			display: 'Failed Result'
		})
	)
	json.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'unableToPassResult',
			value: node.unableToPassResult,
			display: 'Unable to Pass Result'
		})
	)

	if (node.mods) {
		const modList = {
			object: 'block',
			type: MOD_LIST_NODE,
			nodes: []
		}

		node.mods.forEach(mod => {
			const slateMod = {
				object: 'block',
				type: MOD_NODE,
				nodes: []
			}

			slateMod.nodes.push(
				ParameterNode.helpers.oboToSlate({
					name: 'attemptCondition',
					value: mod.attemptCondition,
					display: 'Attempt Condition'
				})
			)
			slateMod.nodes.push(
				ParameterNode.helpers.oboToSlate({
					name: 'reward',
					value: mod.reward,
					display: 'Reward'
				})
			)

			modList.nodes.push(slateMod)
		})

		json.nodes.push(modList)
	}
	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case MOD_NODE:
				return <Mod {...props} {...props.attributes} />
			case MOD_LIST_NODE:
				return <ModList {...props} {...props.attributes} />
			case RUBRIC_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Sections.Assessment.Rubric': {
				nodes: [
					{ match: [{ type: 'Parameter' }], min: 4, max: 4 },
					{ match: [{ type: MOD_LIST_NODE }], max: 1 }
				],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_REQUIRED: {
							let block
							switch (index) {
								case 0:
									block = Block.create(
										ParameterNode.helpers.oboToSlate({
											name: 'passingAttemptScore',
											value: '100',
											display: 'Passing Score'
										})
									)
									break
								case 1:
									block = Block.create(
										ParameterNode.helpers.oboToSlate({
											name: 'passedResult',
											value: '100',
											display: 'Passed Result'
										})
									)
									break
								case 2:
									block = Block.create(
										ParameterNode.helpers.oboToSlate({
											name: 'failedResult',
											value: '0',
											display: 'Failed Result'
										})
									)
									break
								case 3:
									block = Block.create(
										ParameterNode.helpers.oboToSlate({
											name: 'unableToPassResult',
											value: '',
											display: 'Unable to Pass Result'
										})
									)
									break
							}
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.withoutNormalization(c => {
								c.removeNodeByKey(child.key)
								let block
								switch (index) {
									case 0:
										block = Block.create(
											ParameterNode.helpers.oboToSlate({
												name: 'passingAttemptScore',
												value: '100',
												display: 'Passing Score'
											})
										)
										break
									case 1:
										block = Block.create(
											ParameterNode.helpers.oboToSlate({
												name: 'passedResult',
												value: '100',
												display: 'Passed Result'
											})
										)
										break
									case 2:
										block = Block.create(
											ParameterNode.helpers.oboToSlate({
												name: 'failedResult',
												value: '0',
												display: 'Failed Result'
											})
										)
										break
									case 3:
										block = Block.create(
											ParameterNode.helpers.oboToSlate({
												name: 'unableToPassResult',
												value: '',
												display: 'Unable to Pass Result'
											})
										)
										break
								}
								return change.insertNodeByKey(node.key, index, block)
							})
						}
					}
				}
			},
			'ObojoboDraft.Sections.Assessment.Rubric.ModList': {
				nodes: [{ match: [{ type: MOD_NODE }], min: 1, max: 20 }],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_REQUIRED: {
							const block = Block.create({
								type: MOD_NODE
							})
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.wrapBlockByKey(child.key, {
								type: MOD_NODE
							})
						}
					}
				}
			},
			'ObojoboDraft.Sections.Assessment.Rubric.Mod': {
				nodes: [{ match: [{ type: 'Parameter' }], min: 2, max: 2 }],
				normalize: (change, error) => {
					const { node, child, index } = error
					switch (error.code) {
						case CHILD_REQUIRED: {
							if (index === 0) {
								const block = Block.create(
									ParameterNode.helpers.oboToSlate({
										name: 'attemptCondition',
										value: '[1,$last_attempt]',
										display: 'Attempt Condition'
									})
								)
								return change.insertNodeByKey(node.key, index, block)
							}
							const block = Block.create(
								ParameterNode.helpers.oboToSlate({
									name: 'reward',
									value: '0',
									display: 'Reward'
								})
							)
							return change.insertNodeByKey(node.key, index, block)
						}
						case CHILD_TYPE_INVALID: {
							return change.withoutNormalization(c => {
								c.removeNodeByKey(child.key)
								if (index === 0) {
									const block = Block.create(
										ParameterNode.helpers.oboToSlate({
											name: 'attemptCondition',
											value: '[1,$last_attempt]',
											display: 'Attempt Condition'
										})
									)
									return c.insertNodeByKey(node.key, index, block)
								}
								const block = Block.create(
									ParameterNode.helpers.oboToSlate({
										name: 'reward',
										value: '0',
										display: 'Reward'
									})
								)
								return c.insertNodeByKey(node.key, index, block)
							})
						}
					}
				}
			}
		}
	}
}

const Rubric = {
	components: {
		Node,
		ModList,
		Mod
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

export default Rubric
