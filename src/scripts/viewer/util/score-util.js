import Common from 'Common'

let { Dispatcher } = Common.flux

let ScoreUtil = {
	getScoreForModel(state, model, context = 'practice') {
		let scoreItem
		if (state.scores[context] != null) scoreItem = state.scores[context][model.get('id')]
		if (scoreItem == null) {
			return null
		}
		return scoreItem.score
	},

	setScore(itemId, score, context = 'practice') {
		return Dispatcher.trigger('score:set', {
			value: {
				itemId,
				score,
				context
			}
		})
	},

	clearScore(itemId, context = 'practice') {
		return Dispatcher.trigger('score:clear', {
			value: {
				itemId,
				context
			}
		})
	}
}

export default ScoreUtil
