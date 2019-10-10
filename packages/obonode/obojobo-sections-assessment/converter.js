import Common from 'obojobo-document-engine/src/scripts/common'

import {
	getTriggersWithActionsAdded,
	getTriggersWithActionsRemoved,
	hasTriggerTypeWithActionType
} from 'obojobo-document-engine/src/scripts/common/util/trigger-util'

const { OboModel } = Common.models

const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreAction'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'


const slateToObo = node => {
	let Page
	let QuestionBank

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
				Page = Common.Registry.getItemForType(PAGE_NODE)
				children.push(Page.slateToObo(child))
				break
			case QUESTION_BANK_NODE:
				QuestionBank = Common.Registry.getItemForType(QUESTION_BANK_NODE)
				children.push(QuestionBank.slateToObo(child))
				break
			case ACTIONS_NODE:
				content.scoreActions = ScoreActions.slateToObo(child)
				break
			case RUBRIC_NODE:
				const Rubric = Common.Registry.getItemForType(RUBRIC_NODE)
				content.rubric = Rubric.slateToObo(child)
				break
			case SETTINGS_NODE: {
				content.attempts = child.nodes.get(0).text
				content.review = child.nodes.get(1).data.get('current')
				const shouldLockAssessment = child.nodes.get(2).data.get('checked')

				if (shouldLockAssessment) {
					content.triggers = getTriggersWithActionsAdded(content.triggers || [], {
						onNavEnter: { type: 'nav:lock' },
						onEndAttempt: { type: 'nav:unlock' },
						onNavExit: { type: 'nav:unlock' }
					})
				} else if (content.triggers) {
					const updatedTriggers = getTriggersWithActionsRemoved(content.triggers, {
						onNavEnter: 'nav:lock',
						onEndAttempt: 'nav:unlock',
						onNavExit: 'nav:unlock'
					})
					content.triggers = updatedTriggers
					if (content.triggers.length === 0) delete content.triggers
				}
			}
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
			const Page = Common.Registry.getItemForType(PAGE_NODE)
			return Page.oboToSlate(child)
		} else {
			const QuestionBank = Common.Registry.getItemForType(QUESTION_BANK_NODE)
			return QuestionBank.oboToSlate(child)
		}
	})

	const ScoreActions = Common.Registry.getItemForType(ACTIONS_NODE)
	nodes.push(ScoreActions.oboToSlate(content.scoreActions))

	if (content.rubric) {
		const Rubric = Common.Registry.getItemForType(RUBRIC_NODE)
		nodes.push(Rubric.oboToSlate(content.rubric))
	}

	return {
		object: 'block',
		key: node.id,
		type: ASSESSMENT_NODE,
		data: { content },
		nodes
	}
}

export default { slateToObo, oboToSlate }
