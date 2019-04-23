const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

import Page from 'obojobo-pages-page/editor'
import QuestionBank from 'obojobo-chunks-question-bank/editor'
import ScoreActions from './post-assessment/editor-component'
import Rubric from './components/rubric/editor'
import ParameterNode from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node'

const slateToObo = node => {
	console.log(node)
	const content = node.data.get('content')
	// Remove rubric if it has been deleted
	delete content.rubric

	const children = []
	node.nodes.forEach(child => {
		switch (child.type) {
			case PAGE_NODE:
				children.push(Page.helpers.slateToObo(child))
				break
			case QUESTION_BANK_NODE:
				children.push(QuestionBank.helpers.slateToObo(child))
				break
			case ACTIONS_NODE:
				content.scoreActions = ScoreActions.helpers.slateToObo(child)
				break
			case RUBRIC_NODE:
				content.rubric = Rubric.helpers.slateToObo(child)
				break
			case SETTINGS_NODE:
				content.attempts = child.nodes.get(0).text
				content.review = child.nodes.get(1).data.get('current')
		}
	})

	return {
		id: node.key,
		type: node.type,
		content,
		children
	}
}

const oboToSlate = node => {
	const content = node.get('content')
	const nodes = [
		{
			object: 'block',
			type: SETTINGS_NODE,
			nodes: [
				ParameterNode.helpers.oboToSlate({
					name: 'attempts',
					value: content.attempts + '',
					display: 'Attempts'
				}),
				ParameterNode.helpers.oboToSlate({
					name: 'review',
					value: content.review,
					display: 'Review',
					options: ['always', 'never', 'no-attempts-remaining']
				})
			]
		}
	]

	node.attributes.children.forEach(child => {
		if (child.type === PAGE_NODE) {
			nodes.push(Page.helpers.oboToSlate(child))
		} else {
			nodes.push(QuestionBank.helpers.oboToSlate(child))
		}
	})

	nodes.push(ScoreActions.helpers.oboToSlate(content.scoreActions))
	if (content.rubric) nodes.push(Rubric.helpers.oboToSlate(content.rubric))

	return {
		object: 'block',
		key: node.id,
		type: ASSESSMENT_NODE,
		data: { content },
		nodes
	}
}

export default { slateToObo, oboToSlate }
