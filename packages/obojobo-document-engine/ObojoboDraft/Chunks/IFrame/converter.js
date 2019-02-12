const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}
	json.children = []

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type

	// Set up the defaults for content in order to migrate safely from older versions
	const contentType = node.content.type || 'media'
	const defaultContent = {
		type: contentType,
		border: contentType !== 'media',
		fit: contentType === 'media' ? 'scale' : 'scroll',
		initalZoom: 1,
		autoload: false,
		controls: contentType === 'media' ? 'reload' : 'zoom,reload,new-window'
	}

	const finalContent = Object.assign(defaultContent, node.content)

	json.data = { content: finalContent }

	return json
}

export default { slateToObo, oboToSlate }
