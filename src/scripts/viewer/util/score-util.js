import Common from 'Common'

let { Dispatcher } = Common.flux

let ScoreUtil = {
	getScoreForModel(state, model) {
		let scoreItem = state.scores[model.get('id')]
		if (typeof scoreItem === 'undefined' || scoreItem === null) {
			return null
		}

		return scoreItem.score
	},

	setScore(itemId, score) {
		return Dispatcher.trigger('score:set', {
			value: {
				itemId,
				score
			}
		})
	},

	clearScore(itemId) {
		return Dispatcher.trigger('score:clear', {
			value: {
				itemId
			}
		})
	}
}

export default ScoreUtil
