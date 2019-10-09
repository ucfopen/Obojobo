const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

import Common from 'obojobo-document-engine/src/scripts/common'
import Page from 'obojobo-pages-page/editor'
import QuestionBank from 'obojobo-chunks-question-bank/editor'
import Rubric from './components/rubric/editor'
import ScoreActions from './post-assessment/editor-component'

const { OboModel } = Common.models

const slateToObo = node => {
	// Mix the model.content and the node.content to make sure that
	// all settings are properly preserved
	const model = OboModel.models[node.key]
	const content = { ...node.data.get('content'), ...model.get('content') }

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

	const nodes = node.attributes.children.map(child => {
		if (child.type === PAGE_NODE) {
			return Page.helpers.oboToSlate(child)
		} else {
			return QuestionBank.helpers.oboToSlate(child)
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
