import Common from 'obojobo-document-engine/src/scripts/common'
import SelectParameter from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node/select-parameter'
import TextParameter from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node/text-parameter'
import ToggleParameter from 'obojobo-document-engine/src/scripts/oboeditor/components/parameter-node/toggle-parameter'
import ScoreActions from './post-assessment/editor-registration'
import Rubric from './components/rubric/editor-registration'
import {
	getTriggersWithActionsAdded,
	getTriggersWithActionsRemoved,
	hasTriggerTypeWithActionType
} from 'obojobo-document-engine/src/scripts/common/util/trigger-util'

const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

const slateToObo = node => {
	const content = node.data.get('content')
	// Remove rubric if it has been deleted
	delete content.rubric

	const children = []
	node.nodes.forEach(child => {
		switch (child.type) {
			case PAGE_NODE:
				const Page = Common.Registry.getItemForType(PAGE_NODE)
				children.push(Page.slateToObo(child))
				break
			case QUESTION_BANK_NODE:
				const QuestionBank = Common.Registry.getItemForType(QUESTION_BANK_NODE)
				children.push(QuestionBank.slateToObo(child))
				break
			case ACTIONS_NODE:
				content.scoreActions = ScoreActions.helpers.slateToObo(child)
				break
			case RUBRIC_NODE:
				content.rubric = Rubric.helpers.slateToObo(child)
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

	const startAttemptLock = hasTriggerTypeWithActionType(content.triggers, 'onNavEnter', 'nav:lock')
	const endAttemptUnlock =
		hasTriggerTypeWithActionType(content.triggers, 'onEndAttempt', 'nav:unlock') &&
		hasTriggerTypeWithActionType(content.triggers, 'onNavExit', 'nav:unlock')

	const nodes = [
		{
			object: 'block',
			type: SETTINGS_NODE,
			nodes: [
				TextParameter.helpers.oboToSlate('attempts', content.attempts + '', 'Attempts'),
				SelectParameter.helpers.oboToSlate('review', content.review, 'Review', [
					'always',
					'never',
					'no-attempts-remaining'
				]),
				ToggleParameter.helpers.oboToSlate(
					'assessment lock',
					startAttemptLock && endAttemptUnlock,
					'Lock Assessment on Start'
				)
			]
		}
	]

	node.attributes.children.forEach(child => {
		if (child.type === PAGE_NODE) {
			const Page = Common.Registry.getItemForType(PAGE_NODE)
			nodes.push(Page.oboToSlate(child))
		} else {
			const QuestionBank = Common.Registry.getItemForType(QUESTION_BANK_NODE)
			nodes.push(QuestionBank.oboToSlate(child))
		}
	})

	nodes.push(ScoreActions.helpers.oboToSlate(content.scoreActions))
	if (content.rubric) {
		nodes.push(Rubric.helpers.oboToSlate(content.rubric))
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
