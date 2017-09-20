import Common from 'Common'

let { Dispatcher } = Common.flux

let ScoreUtil = {
	getScoreForModel(state, model) {
		let score = state.scores[model.get('id')]
		if (typeof score === 'undefined' || score === null) {
			return null
		}

		return score
	},

	setScore(id, score) {
		return Dispatcher.trigger('score:set', {
			value: {
				id,
				score
			}
		})
	},

	clearScore(id) {
		return Dispatcher.trigger('score:clear', {
			value: {
				id
			}
		})
	}
}

export default ScoreUtil
