const slateToObo = node => {
	const content = node.data.get('content')
	const actions = content.actions.map(action => ({
		type: action.type,
		value: action.value === '' ? {} : JSON.parse(action.value)
	}))

	return {
		id: node.key,
		type: node.type,
		children: [],
		content: {
			label: content.label || '',
			triggers: [
				{
					type: 'onClick',
					actions
				}
			]
		}
	}
}

const oboToSlate = node => {
	let label = node.content.label
	if (!label && node.content.textGroup) {
		node.content.textGroup.forEach(line => {
			label = line.text.value
		})
	}

	let actions = []
	if (node.content.triggers) {
		actions = node.content.triggers[0].actions.map(action => ({
			type: action.type,
			value: action.value ? JSON.stringify(action.value) : ''
		}))
	}

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		data: {
			content: {
				label,
				actions
			}
		}
	}
}

export default { slateToObo, oboToSlate }
