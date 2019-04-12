import React from 'react'

import KeyDownUtil from '../util/keydown-util'

import Common from 'Common'

const { Slider } = Common.components

import './parameter-node.scss'

const Node = props => {
	const handleSelectChange = event => {
		const editor = props.editor

		return editor.setNodeByKey(props.node.key, {
			data: {
				current: event.target.value,
				name: props.node.data.get('name'),
				display: props.node.data.get('display'),
				options: props.node.data.get('options'),
				type: props.node.data.get('type')
			}
		})
	}

	const handleCheckChange = checked => {
		const editor = props.editor

		return editor.setNodeByKey(props.node.key, {
			data: {
				checked,
				name: props.node.data.get('name'),
				display: props.node.data.get('display'),
				type: props.node.data.get('type')
			}
		})
	}

	switch (props.node.data.get('type')) {
		case 'type-select':
			return (
				<div className={'parameter-node'} {...props.attributes}>
					<span contentEditable={false}>{props.node.data.get('display') + ': '}</span>
					<select
						name={'Select'}
						value={props.node.data.get('current')}
						onChange={event => handleSelectChange(event)}
						contentEditable={false}
					>
						{props.node.data.get('options').map(item => {
							return (
								<option value={item} label={item} key={item}>
									{item}
								</option>
							)
						})}
					</select>
				</div>
			)
		case 'type-toggle':
			return (
				<div className={'parameter-node'} {...props.attributes} contentEditable={false}>
					<Slider
						title={props.node.data.get('display')}
						initialChecked={props.node.data.get('checked')}
						handleCheckChange={event => handleCheckChange(event)}
					/>
				</div>
			)

		// 'type-text'
		default:
			return (
				<div className={'parameter-node'} {...props.attributes}>
					<span contentEditable={false}>{props.node.data.get('display') + ': '}</span>
					<span>{props.children}</span>
				</div>
			)
	}
}

const isType = editor => {
	return editor.value.blocks.some(block => {
		return block.type === 'Parameter'
	})
}

const slateToObo = node => {
	const json = {}
	switch (node.data.get('type')) {
		case 'type-select':
			json[node.data.get('name')] = node.data.get('current')
			break
		case 'type-toggle':
			json[node.data.get('name')] = node.data.get('checked')
			break
		default:
			json[node.data.get('name')] = node.text
	}

	return json
}

const oboToSlate = ({ name, value, display, options, checked }) => {
	const json = {}
	json.object = 'block'
	json.type = 'Parameter'
	json.data = {
		name: name,
		display: display,
		options: options
	}
	if (options) {
		json.data.type = 'type-select'
		json.data.current = value
		json.isVoid = true
	} else if (checked) {
		json.data.type = 'type-toggle'
		json.data.checked = value
		json.isVoid = true
	} else {
		json.data.type = 'type-text'
		json.nodes = [
			{
				object: 'text',
				leaves: [
					{
						text: value
					}
				]
			}
		]
	}

	return json
}

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case 'Parameter':
				return <Node {...props} />
			default:
				return next()
		}
	},
	onKeyDown(event, editor, next) {
		// See if any of the selected nodes are a parameter
		const isParameter = isType(editor)
		if (!isParameter) return next()

		switch (event.key) {
			case 'Backspace':
			case 'Delete':
				return KeyDownUtil.deleteNodeContents(event, editor, next)

			case 'Enter':
				// Disallows enter
				event.preventDefault()
				return true

			default:
				return next()
		}
	}
}

const ParameterNode = {
	components: {
		Node
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

export default ParameterNode
