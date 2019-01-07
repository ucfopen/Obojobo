const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

import Page from '../../Pages/Page/editor'
import QuestionBank from '../../Chunks/QuestionBank/editor'
import ScoreActions from './post-assessment/editor'
import Rubric from './components/rubric/editor'
import ParameterNode from '../../../src/scripts/oboeditor/components/parameter-node'

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content')
	json.children = []

	// Remove rubric if it has been deleted
	delete json.content.rubric

	node.nodes.forEach(child => {
		switch (child.type) {
			case PAGE_NODE:
				json.children.push(Page.helpers.slateToObo(child))
				break
			case QUESTION_BANK_NODE:
				json.children.push(QuestionBank.helpers.slateToObo(child))
				break
			case ACTIONS_NODE:
				json.content.scoreActions = ScoreActions.helpers.slateToObo(child)
				break
			case RUBRIC_NODE:
				json.content.rubric = Rubric.helpers.slateToObo(child)
				break
			case SETTINGS_NODE:
				json.content.attempts = child.nodes.get(0).text
				json.content.review = child.nodes.get(1).data.get('current')
		}
	})

	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = ASSESSMENT_NODE
	json.data = { content: node.get('content') }
	json.nodes = []

	const settings = {
		object: 'block',
		type: SETTINGS_NODE,
		nodes: []
	}

	settings.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'attempts',
			value: json.data.content.attempts + '',
			display: 'Attempts'
		})
	)

	settings.nodes.push(
		ParameterNode.helpers.oboToSlate({
			name: 'review',
			value: json.data.content.review,
			display: 'Review',
			options: ['always', 'never', 'no-attempts-remaining']
		})
	)

	json.nodes.push(settings)

	node.attributes.children.forEach(child => {
		if (child.type === PAGE_NODE) {
			json.nodes.push(Page.helpers.oboToSlate(child))
		} else {
			json.nodes.push(QuestionBank.helpers.oboToSlate(child))
		}
	})

	json.nodes.push(ScoreActions.helpers.oboToSlate(json.data.content.scoreActions))
	if (json.data.content.rubric) json.nodes.push(Rubric.helpers.oboToSlate(json.data.content.rubric))

	return json
}

export default { slateToObo, oboToSlate }
