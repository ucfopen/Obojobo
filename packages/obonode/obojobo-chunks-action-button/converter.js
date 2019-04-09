import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const slateToObo = node => {
	const content = node.data.get('content')

	const actions = content.actions.map(action => ({
		type: action.type,
		value: action.value === '' ? {} : JSON.parse(action.value)
	}))
	content.triggers = [
		{
			type: 'onClick',
			actions
		}
	]

	const labelLine = {
		text: { value: node.text, styleList: [] },
		data: null
	}
	node.nodes.forEach(text => {
		TextUtil.slateToOboText(text, labelLine)
	})
	content.textGroup = [labelLine]

	return {
		id: node.key,
		type: node.type,
		children: [],
		content
	}
}

const oboToSlate = node => {
	let nodes
	if (!node.content.textGroup) {
		// If there is currently no caption, add one
		nodes = [
			{
				object: 'text',
				leaves: [{ text: node.content.label }]
			}
		]
	} else {
		nodes = node.content.textGroup.map(line => ({
			object: 'text',
			leaves: TextUtil.parseMarkings(line)
		}))
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
				actions
			}
		},
		nodes
	}
}

export default { slateToObo, oboToSlate }
