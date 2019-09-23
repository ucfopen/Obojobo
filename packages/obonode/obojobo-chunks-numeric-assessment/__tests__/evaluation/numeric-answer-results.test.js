import NumericAnswerResults from '../../evaluation/numeric-answer-results'

describe('NumericAnswerResults', () => {
	test('getSuggestions returns an array of suggestion objects', () => {
		const mockMatches = {
			getNumericTypesForMatches: () => {
				return {
					numericTypes: ['mockType1', 'mockType2']
				}
			},
			getInstance: type => {
				return {
					label: `label:${type}`,
					formattedString: `formattedString:${type}`
				}
			}
		}

		expect(NumericAnswerResults.getSuggestions(mockMatches)).toEqual([
			{ label: 'label:mockType1', stringValue: 'formattedString:mockType1' },
			{ label: 'label:mockType2', stringValue: 'formattedString:mockType2' }
		])
	})

	test.each`
		numericEntryStatus             | validationStatus     | scoreIs100 | expected
		${'inputMatchesMultipleTypes'} | ${'ruleMatched'}     | ${false}   | ${'inputMatchesMultipleTypes'}
		${'inputNotSafe'}              | ${'ruleMatched'}     | ${false}   | ${'inputNotSafe'}
		${'inputInvalid'}              | ${'ruleMatched'}     | ${false}   | ${'inputInvalid'}
		${'inputNotMatched'}           | ${'ruleMatched'}     | ${false}   | ${'inputNotMatched'}
		${'ok'}                        | ${'ruleMatched'}     | ${false}   | ${'failedValidation'}
		${'inputMatchesMultipleTypes'} | ${'noMatchingRules'} | ${false}   | ${'inputMatchesMultipleTypes'}
		${'inputNotSafe'}              | ${'noMatchingRules'} | ${false}   | ${'inputNotSafe'}
		${'inputInvalid'}              | ${'noMatchingRules'} | ${false}   | ${'inputInvalid'}
		${'inputNotMatched'}           | ${'noMatchingRules'} | ${false}   | ${'inputNotMatched'}
		${'ok'}                        | ${'noMatchingRules'} | ${false}   | ${'failed'}
		${'inputMatchesMultipleTypes'} | ${'noRules'}         | ${false}   | ${'inputMatchesMultipleTypes'}
		${'inputNotSafe'}              | ${'noRules'}         | ${false}   | ${'inputNotSafe'}
		${'inputInvalid'}              | ${'noRules'}         | ${false}   | ${'inputInvalid'}
		${'inputNotMatched'}           | ${'noRules'}         | ${false}   | ${'inputNotMatched'}
		${'ok'}                        | ${'noRules'}         | ${false}   | ${'failed'}
		${'inputMatchesMultipleTypes'} | ${'ruleMatched'}     | ${true}    | ${'inputMatchesMultipleTypes'}
		${'inputNotSafe'}              | ${'ruleMatched'}     | ${true}    | ${'inputNotSafe'}
		${'inputInvalid'}              | ${'ruleMatched'}     | ${true}    | ${'inputInvalid'}
		${'inputNotMatched'}           | ${'ruleMatched'}     | ${true}    | ${'inputNotMatched'}
		${'ok'}                        | ${'ruleMatched'}     | ${true}    | ${'failedValidation'}
		${'inputMatchesMultipleTypes'} | ${'noMatchingRules'} | ${true}    | ${'inputMatchesMultipleTypes'}
		${'inputNotSafe'}              | ${'noMatchingRules'} | ${true}    | ${'inputNotSafe'}
		${'inputInvalid'}              | ${'noMatchingRules'} | ${true}    | ${'inputInvalid'}
		${'inputNotMatched'}           | ${'noMatchingRules'} | ${true}    | ${'inputNotMatched'}
		${'ok'}                        | ${'noMatchingRules'} | ${true}    | ${'passed'}
		${'inputMatchesMultipleTypes'} | ${'noRules'}         | ${true}    | ${'inputMatchesMultipleTypes'}
		${'inputNotSafe'}              | ${'noRules'}         | ${true}    | ${'inputNotSafe'}
		${'inputInvalid'}              | ${'noRules'}         | ${true}    | ${'inputInvalid'}
		${'inputNotMatched'}           | ${'noRules'}         | ${true}    | ${'inputNotMatched'}
		${'ok'}                        | ${'noRules'}         | ${true}    | ${'passed'}
	`(
		'getStatus returns the expected status ($numericEntryStatus,$validationStatus,$scoreIs100 = $expected)',
		({ numericEntryStatus, validationStatus, scoreIs100, expected }) => {
			const numericEntry = {
				status: numericEntryStatus
			}
			const validationResult = {
				status: validationStatus
			}
			const scoreResult = {
				details: {
					score: scoreIs100 ? 100 : 0
				}
			}

			expect(
				NumericAnswerResults.getStatus(numericEntry, validationResult, scoreResult, expected)
			).toBe(expected)
		}
	)

	test('getResult returns expected result objects', () => {
		const spy = jest.spyOn(NumericAnswerResults, 'getStatus')
		const suggestionsSpy = jest.spyOn(NumericAnswerResults, 'getSuggestions').mockReturnValue([])

		let mockNumericEntry

		//inputMatchesMultipleTypes
		spy.mockReturnValueOnce('inputMatchesMultipleTypes')
		mockNumericEntry = { matches: jest.fn() }
		expect(NumericAnswerResults.getResult(mockNumericEntry, jest.fn(), jest.fn())).toEqual({
			status: 'inputMatchesMultipleTypes',
			entry: mockNumericEntry,
			details: {
				suggestions: []
			}
		})

		//inputNotSafe
		spy.mockReturnValueOnce('inputNotSafe')
		mockNumericEntry = jest.fn()
		expect(NumericAnswerResults.getResult(mockNumericEntry, jest.fn(), jest.fn())).toEqual({
			status: 'inputNotSafe',
			entry: mockNumericEntry,
			details: {
				maxNumber: Number.MAX_SAFE_INTEGER
			}
		})

		//inputInvalid
		spy.mockReturnValueOnce('inputInvalid')
		mockNumericEntry = jest.fn()
		expect(NumericAnswerResults.getResult(mockNumericEntry, jest.fn(), jest.fn())).toEqual({
			status: 'inputInvalid',
			entry: mockNumericEntry,
			details: {}
		})

		//inputNotMatched
		spy.mockReturnValueOnce('inputNotMatched')
		mockNumericEntry = jest.fn()
		expect(NumericAnswerResults.getResult(mockNumericEntry, jest.fn(), jest.fn())).toEqual({
			status: 'inputNotMatched',
			entry: mockNumericEntry,
			details: {}
		})

		//failedValidation
		spy.mockReturnValueOnce('failedValidation')
		mockNumericEntry = jest.fn()
		expect(
			NumericAnswerResults.getResult(
				mockNumericEntry,
				{
					details: {
						matchingOutcome: 'mockMatchingOutcome'
					}
				},
				jest.fn()
			)
		).toEqual({
			status: 'failedValidation',
			entry: mockNumericEntry,
			details: {
				matchingOutcome: 'mockMatchingOutcome'
			}
		})

		//failed (return matchingOutcome)
		spy.mockReturnValueOnce('failed')
		mockNumericEntry = jest.fn()
		expect(
			NumericAnswerResults.getResult(mockNumericEntry, jest.fn(), {
				details: {
					score: 'mockScore',
					matchingOutcome: 'mockMatchingOutcome'
				}
			})
		).toEqual({
			status: 'failed',
			entry: mockNumericEntry,
			details: {
				matchingOutcome: 'mockMatchingOutcome',
				score: 'mockScore'
			}
		})

		//failed (return null)
		spy.mockReturnValueOnce('failed')
		mockNumericEntry = jest.fn()
		expect(
			NumericAnswerResults.getResult(mockNumericEntry, jest.fn(), {
				details: {
					score: 'mockScore'
				}
			})
		).toEqual({
			status: 'failed',
			entry: mockNumericEntry,
			details: {
				matchingOutcome: null,
				score: 'mockScore'
			}
		})

		//passed
		spy.mockReturnValueOnce('passed')
		mockNumericEntry = jest.fn()
		expect(
			NumericAnswerResults.getResult(mockNumericEntry, jest.fn(), {
				details: {
					score: 'mockScore',
					matchingOutcome: 'mockMatchingOutcome'
				}
			})
		).toEqual({
			status: 'passed',
			entry: mockNumericEntry,
			details: {
				matchingOutcome: 'mockMatchingOutcome',
				score: 'mockScore'
			}
		})

		spy.mockRestore()
		suggestionsSpy.mockRestore()
	})
})
