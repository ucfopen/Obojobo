const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = {
		width: node.data.get('content').width
	}
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type
	json.data = { content: node.content }

	if (!json.data.content.width) json.data.content.width = 'normal'

	return json
}

export default { slateToObo, oboToSlate }
