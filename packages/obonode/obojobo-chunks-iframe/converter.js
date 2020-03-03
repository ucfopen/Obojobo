import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'

const slateToObo = node => ({
	id: node.key,
	type: node.type,
	children: [],
	content: withoutUndefined(node.data.get('content') || {})
})

const oboToSlate = node => {
	// Set up the defaults for content in order to migrate safely from older versions
	const contentType = node.content.type || 'media'
	const defaultContent = {
		type: contentType,
		border: contentType !== 'media',
		fit: contentType === 'media' ? 'scale' : 'scroll',
		initialZoom: 1,
		autoload: false,
		controls: contentType === 'media' ? 'reload' : 'zoom,reload,new-window'
	}

	const finalContent = Object.assign(defaultContent, node.content)

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		data: { content: finalContent }
	}
}

export default { slateToObo, oboToSlate }
