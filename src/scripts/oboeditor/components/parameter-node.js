import React from 'react'

const Node = props => {
	const handleSelectChange = event => {
		const editor = props.editor
		const change = editor.value.change()

		change.setNodeByKey(props.node.key, {
			data: {
				current: event.target.value,
				name: props.node.data.get('name'),
				display: props.node.data.get('display'),
				options: props.node.data.get('options'),
				isSelect: props.node.data.get('isSelect')
			}
		})
		editor.onChange(change)
	}

	if (props.node.data.get('isSelect')) {
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

	return (
		<div className={'parameter-node'} {...props.attributes}>
			<span contentEditable={false}>{props.node.data.get('display') + ': '}</span>
			<span>{props.children}</span>
		</div>
	)
}

const slateToObo = node => {
	const json = {}
	if (node.data.get('isSelect')) {
		json[node.data.get('name')] = node.data.get('current')
	} else {
		json[node.data.get('name')] = node.text
	}

	return json
}

const oboToSlate = (name, value, display, options) => {
	const json = {}
	json.object = 'block'
	json.type = 'Parameter'
	json.data = {
		name: name,
		display: display,
		options: options,
		isSelect: !!options
	}
	if (json.data.isSelect) {
		json.data.current = value
		json.isVoid = true
	} else {
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
	renderNode(props) {
		switch (props.node.type) {
			case 'Parameter':
				return <Node {...props} />
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
