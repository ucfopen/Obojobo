import numericChoicesToScoreRuleConfigs from './numeric-choices-to-score-rule-configs'

describe('numericChoicesToScoreRuleConfigs', () => {
	test('Converts range config as expected', () => {
		expect(
			numericChoicesToScoreRuleConfigs([
				{
					content: {
						score: 100
					},
					children: [
						{
							content: {
								requirement: 'exact',
								answer: '1'
							}
						},
						'mock-feedback'
					]
				},
				{
					content: {
						score: 0
					},
					children: [
						{
							content: {
								requirement: 'range',
								start: '-1',
								end: '1'
							}
						}
					]
				},
				{
					content: {
						score: 100
					},
					children: [
						{
							content: {
								requirement: 'margin',
								answer: '123',
								type: 'percent',
								margin: 5
							}
						}
					]
				},
				{
					content: {
						score: 0
					},
					children: [
						{
							content: {
								requirement: 'margin',
								answer: '987',
								type: 'absolute',
								margin: 2
							}
						},
						'mock-feedback-2'
					]
				},
				{
					content: {
						score: 0
					},
					children: [
						{
							content: {
								requirement: 'margin',
								answer: '987',
								type: 'unexpected-error-type',
								margin: 2
							}
						},
						'mock-feedback-2'
					]
				}
			])
		).toEqual([
			{
				value: '1',
				feedback: 'mock-feedback',
				score: 100
			},
			{
				value: '[-1,1]',
				feedback: null,
				score: 0
			},
			{
				value: '123',
				feedback: null,
				score: 100,
				percentError: 5
			},
			{
				value: '987',
				feedback: 'mock-feedback-2',
				score: 0,
				absoluteError: 2
			},
			null
		])
	})
})
