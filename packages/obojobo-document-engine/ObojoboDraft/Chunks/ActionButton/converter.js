const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = {}
	const nodeContent = node.data.get('content')
	json.content.label = nodeContent.label || ''
	json.content.triggers = [
		{
			type: 'onClick',
			actions: nodeContent.actions.map(action => {
				return {
					type: action.type,
					value: action.value !== '' ? JSON.parse(action.value) : {}
				}
			})
		}
	]

	json.children = []
	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type

	json.data = { content: {} }
	json.data.content.label = node.content.label
	if (!json.data.content.label && node.content.textGroup) {
		node.content.textGroup.forEach(line => {
			json.data.content.label = line.text.value
		})
	}

	json.data.content.actions = []
	if (node.content.triggers) {
		json.data.content.actions = node.content.triggers[0].actions.map(action => {
			return {
				type: action.type,
				value: action.value ? JSON.stringify(action.value) : ''
			}
		})
	}

	return json
}

export default { slateToObo, oboToSlate }
