import withoutUndefined from 'obojobo-document-engine/src/scripts/common/util/without-undefined'
import TextUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/text-util'

const slateToObo = node => {
	const content = node.data.get('content')

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
		content: withoutUndefined(content)
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

	// Make sure that buttons have an onClick trigger
	const onClickTrigger = {
		type: 'onClick',
		actions: []
	}
	if (!node.content.triggers) {
		node.content.triggers = [onClickTrigger]
	} else {
		const hasOnClickTrigger =
			node.content.triggers.filter(trigger => trigger.type === 'onClick').length > 0
		if (!hasOnClickTrigger) node.content.triggers.push(onClickTrigger)
	}

	return {
		object: 'block',
		key: node.id,
		type: node.type,
		data: {
			content: node.content
		},
		nodes
	}
}

export default { slateToObo, oboToSlate }
