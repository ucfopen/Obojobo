import React from 'react'

import './parameter-node.scss'

const SELECT_PARAMETER = 'oboeditor.select-parameter'

const Node = props => {
	const handleSelectChange = event => {
		const editor = props.editor

		return editor.setNodeByKey(props.node.key, {
			data: {
				current: event.target.value,
				name: props.node.data.get('name'),
				display: props.node.data.get('display'),
				options: props.node.data.get('options')
			}
		})
	}

	console.log(props.node.toJSON())

	return (
		<div className={'parameter-node'} {...props.attributes}>
			<span contentEditable={false}>{props.node.data.get('display') + ': '}</span>
			<select
				name={'Select'}
				value={props.node.data.get('current')}
				onChange={event => handleSelectChange(event)}
				onClick={event => event.stopPropagation()}
			>
				{props.node.data.get('options').map(item => {
					return (
						<option value={item} key={item}>
							{item}
						</option>
					)
				})}
			</select>
		</div>
	)
}

const slateToObo = node => {
	const json = {}
	json[node.data.get('name')] = node.data.get('current')

	return json
}

const oboToSlate = (name, value, display, options) => ({
	object: 'block',
	type: SELECT_PARAMETER,
	data: {
		name: name,
		display: display,
		options: options,
		current: value
	}
})

const plugins = {
	renderNode(props, editor, next) {
		switch (props.node.type) {
			case SELECT_PARAMETER:
				return <Node {...props} />
			default:
				return next()
		}
	},
	schema : {
		blocks: {
			'oboeditor.select-parameter': {
				isVoid: true
			}
		}
	}
}

const SelectParameter = {
	components: {
		Node
	},
	helpers: {
		slateToObo,
		oboToSlate
	},
	plugins
}

export default SelectParameter
