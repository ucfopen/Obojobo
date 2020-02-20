import Common from 'Common'

const { Dispatcher } = Common.flux

const QuestionUtil = {
	setResponse(id, response, targetId, context, assessmentId, attemptId) {
		return Dispatcher.trigger('question:setResponse', {
			value: {
				id,
				response,
				targetId,
				context,
				assessmentId,
				attemptId
			}
		})
	},

	clearResponse(id, context) {
		return Dispatcher.trigger('question:clearResponse', {
			value: {
				id,
				context
			}
		})
	},

	setData(id, context, key, value) {
		return Dispatcher.trigger('question:setData', {
			value: {
				context,
				key: id + ':' + key,
				value
			}
		})
	},

	clearData(id, context, key) {
		return Dispatcher.trigger('question:clearData', {
			value: {
				context,
				key: id + ':' + key
			}
		})
	},

	showExplanation(id, context) {
		return Dispatcher.trigger('question:showExplanation', {
			value: { id, context }
		})
	},

	hideExplanation(id, context, actor) {
		return Dispatcher.trigger('question:hideExplanation', {
			value: { id, context, actor }
		})
	},

	viewQuestion(id, context) {
		return Dispatcher.trigger('question:view', {
			value: {
				id,
				context
			}
		})
	},

	hideQuestion(id, context) {
		return Dispatcher.trigger('question:hide', {
			value: {
				id,
				context
			}
		})
	},

	submitResponse(id, context) {
		return Dispatcher.trigger('question:submitResponse', {
			value: {
				id,
				context
			}
		})
	},

	checkAnswer(id, context) {
		return Dispatcher.trigger('question:checkAnswer', {
			value: {
				id,
				context
			}
		})
	},

	retryQuestion(id, context) {
		return Dispatcher.trigger('question:retry', {
			value: {
				id,
				context
			}
		})
	},

	revealAnswer(id, context) {
		return Dispatcher.trigger('question:revealAnswer', {
			value: {
				id,
				context
			}
		})
	},

	setScore(itemId, score, details, feedbackText, detailedText, context) {
		return Dispatcher.trigger('question:scoreSet', {
			value: {
				itemId,
				score,
				details,
				feedbackText,
				detailedText,
				context
			}
		})
	},

	clearScore(itemId, context) {
		return Dispatcher.trigger('question:scoreClear', {
			value: {
				itemId,
				context
			}
		})
	},

	getStateForContext(state, context) {
		return state.contexts[context] || null
	},

	getViewState(state, model, context) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return null

		const id = model.get('id')

		if (contextState.viewing === id) {
			return 'active'
		}
		if (contextState.viewedQuestions[id]) {
			return 'viewed'
		}
		return 'hidden'
	},

	getResponse(state, model, context) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return null

		return contextState.responses[model.get('id')] || null
	},

	hasResponse(state, model, context) {
		return QuestionUtil.getResponse(state, model, context) !== null
	},

	isAnswerRevealed(state, model, context) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return false

		return contextState.revealedQuestions[model.get('id')] || false
	},

	isScored(state, model, context) {
		return QuestionUtil.getScoreForModel(state, model, context) !== null
	},

	hasUnscoredResponse(state, model, context) {
		return (
			QuestionUtil.hasResponse(state, model, context) &&
			!QuestionUtil.isScored(state, model, context)
		)
	},

	getData(state, model, context, key) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return null

		return contextState.data[model.get('id') + ':' + key] || null
	},

	isShowingExplanation(state, model, context) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return false

		return contextState.data[model.get('id') + ':showingExplanation'] || false
	},

	getScoreDataForModel(state, model, context) {
		const contextState = QuestionUtil.getStateForContext(state, context)
		if (!contextState) return null

		const scoreItem = contextState.scores[model.get('id')] || null

		return scoreItem || null
	},

	getScoreForModel(state, model, context) {
		const scoreData = QuestionUtil.getScoreDataForModel(state, model, context)
		return scoreData ? scoreData.score : null
	},

	getFeedbackTextForModel(state, model, context) {
		const scoreData = QuestionUtil.getScoreDataForModel(state, model, context)
		return scoreData ? scoreData.feedbackText : null
	},

	getDetailedTextForModel(state, model, context) {
		const scoreData = QuestionUtil.getScoreDataForModel(state, model, context)
		return scoreData ? scoreData.detailedText : null
	},

	getScoreClass(score) {
		switch (score) {
			case null:
				return 'is-not-scored'

			case 'no-score':
				return 'is-no-score'

			case 100:
				return 'is-correct'

			default:
				return 'is-not-correct'
		}
	}
}

export default QuestionUtil

// x = {
// 	id: '0a4c69dd-2931-4140-8796-a9dd297413d8',
// 	score: 100,
// 	itemId: '65940371-51c3-44c1-bfc7-517ba0f64389',
// 	context: 'practice',
// 	details: {
// 		score: 100,
// 		matchingOutcome: {
// 			rule: {
// 				round: 'none',
// 				score: 100,
// 				value: {
// 					max: '12',
// 					min: '12',
// 					unit: '',
// 					isEmpty: false,
// 					isMaxInclusive: true,
// 					isMinInclusive: true
// 				},
// 				sigFigs: {
// 					max: null,
// 					min: null,
// 					isEmpty: false,
// 					isMaxInclusive: null,
// 					isMinInclusive: null
// 				},
// 				allUnits: [''],
// 				decimals: {
// 					max: null,
// 					min: null,
// 					isEmpty: false,
// 					isMaxInclusive: null,
// 					isMinInclusive: null
// 				},
// 				feedback: {
// 					id: 'e04737d6-ec2e-4a11-8a2f-27b40e1fe035',
// 					type: 'ObojoboDraft.Chunks.NumericAssessment.NumericFeedback',
// 					content: {},
// 					children: [
// 						{
// 							id: '7c71cd13-608a-4950-8e47-6e8619ae0717',
// 							type: 'ObojoboDraft.Chunks.Text',
// 							content: {
// 								textGroup: [{ data: { indent: 0 }, text: { value: 'cool', styleList: [] } }]
// 							},
// 							children: []
// 						}
// 					]
// 				},
// 				errorType: 'percent',
// 				isInteger: null,
// 				errorValue: 5,
// 				unitsMatch: 'matches-unit',
// 				allowedTypes: ['scientific', 'decimal', 'fractional', 'hex', 'octal', 'binary'],
// 				scientificTypes: ['apos', 'asterisk', 'e', 'ee', 'x'],
// 				isFractionReduced: null,
// 				isValidScientific: null,
// 				unitsAreCaseSensitive: false
// 			},
// 			isMatched: true,
// 			scoreOutcome: { errorType: 'percent', isWithinError: true, isExactlyCorrect: true },
// 			isExpectedType: true,
// 			isExpectedUnits: true,
// 			isExpectedInteger: true,
// 			isExpectedNumSigFigs: true,
// 			isExpectedScientific: true,
// 			isExpectedFractionReduced: true
// 		}
// 	}
// }
