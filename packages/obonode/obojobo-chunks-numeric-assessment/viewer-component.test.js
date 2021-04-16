import React from 'react'
import renderer from 'react-test-renderer'
import QuestionUtil from 'obojobo-document-engine/src/scripts/viewer/util/question-util'
import focus from 'obojobo-document-engine/src/scripts/common/page/focus'
import NumericAssessment from './viewer-component'
import TextGroup from 'obojobo-document-engine/src/scripts/common/text-group/text-group'
import NumericAnswerEvaluator from './evaluation/numeric-answer-evaluator'
import ValueRange from './range/value-range'
import NumericRule from './rule/numeric-rule'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

jest.mock('obojobo-document-engine/src/scripts/common/models/obo-model')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/question-util')
jest.mock('obojobo-document-engine/src/scripts/common/page/focus')

describe('NumericAssessment', () => {
	const getDefaultProps = () => ({
		model: {
			get: () => 'mock-id',
			getDomId: () => 'mock-id',
			processTrigger: jest.fn(),
			modelState: {
				units: TextGroup.fromDescriptor([{ text: { value: 'mock-units-text' } }]),
				scoreRules: [{ value: '6928', feedback: 'mock-feedback', score: 100 }]
			},
			children: {
				models: []
			}
		},
		questionModel: { get: () => 'mock-question-model-id', modelState: { type: 'default' } },
		moduleData: {
			navState: { context: 'mockContext' },
			questionState: { contexts: { mockContext: { data: {} } } },
			focusState: {}
		},
		score: null,
		scoreClass: 'mock-score-class',
		hasResponse: false,
		mode: 'mock-mode',
		type: 'default',
		isAnswerRevealed: 'mock-is-answer-revealed',
		feedbackText: 'mock-feedback-text',
		response: null
	})

	beforeAll(() => {})

	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('NumericAssessment renders', () => {
		const component = renderer.create(<NumericAssessment {...getDefaultProps()} />)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericAssessment renders a correct response', () => {
		OboModel.create.mockImplementation(() => {
			return {
				getComponentClass: () => {
					class C extends React.Component {
						render() {
							return <div>OboNode</div>
						}
					}

					return C
				}
			}
		})
		QuestionUtil.getData.mockReturnValue('mock-feedback')

		const component = renderer.create(
			<NumericAssessment
				{...getDefaultProps()}
				hasResponse={true}
				response={{ value: '6928' }}
				score={100}
			/>
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericAssessment renders a correct response in review', () => {
		OboModel.create.mockImplementation(() => {
			return {
				getComponentClass: () => {
					class C extends React.Component {
						render() {
							return <div>OboNode</div>
						}
					}

					return C
				}
			}
		})
		QuestionUtil.getData.mockReturnValue('mock-feedback')

		const component = renderer.create(
			<NumericAssessment
				{...getDefaultProps()}
				hasResponse={true}
				response={{ value: '6928' }}
				score={100}
				mode={'review'}
			/>
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericAssessment renders an incorrect response', () => {
		const component = renderer.create(
			<NumericAssessment
				{...getDefaultProps()}
				hasResponse={true}
				response={{ value: '22/7' }}
				score={0}
			/>
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericAssessment renders an incorrect response in review', () => {
		const component = renderer.create(
			<NumericAssessment
				{...getDefaultProps()}
				hasResponse={true}
				response={{ value: '22/7' }}
				score={0}
				mode={'review'}
			/>
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericAssessment renders an incorrect response in review (with multiple correct answers)', () => {
		const props = getDefaultProps()
		props.model.modelState.scoreRules.push({ value: '123', score: 100 })

		const component = renderer.create(
			<NumericAssessment
				{...props}
				hasResponse={true}
				response={{ value: '22/7' }}
				score={0}
				mode={'review'}
			/>
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericAssessment renders an incorrect response in review (with no correct answers)', () => {
		const props = getDefaultProps()
		props.model.modelState.scoreRules[0].score = 0

		const component = renderer.create(
			<NumericAssessment
				{...props}
				hasResponse={true}
				response={{ value: '22/7' }}
				score={0}
				mode={'review'}
			/>
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericAssessment renders a response correct within the allowed error', () => {
		const props = getDefaultProps()
		props.model.modelState.scoreRules[0].percentError = 1

		const component = renderer.create(
			<NumericAssessment {...props} hasResponse={true} response={{ value: '6929' }} score={100} />
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericAssessment still renders when NumericAnswerEvaluator cannot evaluate the response due to a fatal error', () => {
		const props = getDefaultProps()
		props.model.modelState.scoreRules[0].percentError = 1

		const evaluatorSpy = jest
			.spyOn(NumericAnswerEvaluator.prototype, 'evaluate')
			.mockImplementation(() => {
				throw 'Fatal error!'
			})

		const component = renderer.create(
			<NumericAssessment {...props} hasResponse={true} response={{ value: '6929' }} score={100} />
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		evaluatorSpy.mockRestore()
	})

	test('calculateScore does nothing if no response exists', () => {
		const component = renderer.create(<NumericAssessment {...getDefaultProps()} />)

		const evaluatorSpy = jest.spyOn(component.getInstance().evaluator, 'evaluate')

		expect(component.getInstance().calculateScore()).toBe(null)

		expect(evaluatorSpy).not.toHaveBeenCalled()

		evaluatorSpy.mockRestore()
	})

	test('calculateScore returns expected object when answered incorrectly', () => {
		const component = renderer.create(
			<NumericAssessment {...getDefaultProps()} hasResponse={true} response={{ value: '22/7' }} />
		)

		const validator = new NumericAnswerEvaluator({
			scoreRuleConfigs: [{ value: '6928', feedback: 'mock-feedback', score: 100 }]
		})
		const results = validator.evaluate('22/7')

		const evaluatorSpy = jest.spyOn(component.getInstance().evaluator, 'evaluate')

		expect(component.getInstance().calculateScore()).toEqual({
			score: 0,
			details: results.details
		})

		expect(evaluatorSpy).toHaveBeenCalled()
		expect(QuestionUtil.setData).toHaveBeenCalledWith('mock-id', 'mockContext', 'feedback', null)

		evaluatorSpy.mockRestore()
	})

	test('calculateScore returns expected object when answered correctly', () => {
		const component = renderer.create(
			<NumericAssessment {...getDefaultProps()} hasResponse={true} response={{ value: '6928' }} />
		)

		const validator = new NumericAnswerEvaluator({
			scoreRuleConfigs: [{ value: '6928', feedback: 'mock-feedback', score: 100 }]
		})
		const results = validator.evaluate('6928')

		const evaluatorSpy = jest.spyOn(component.getInstance().evaluator, 'evaluate')

		expect(component.getInstance().calculateScore()).toEqual({
			score: 100,
			details: results.details
		})

		expect(evaluatorSpy).toHaveBeenCalled()
		expect(QuestionUtil.setData).toHaveBeenCalledWith(
			'mock-id',
			'mockContext',
			'feedback',
			'mock-feedback'
		)

		evaluatorSpy.mockRestore()
	})

	test('checkIfResponseIsValid does nothing if no response exists', () => {
		const component = renderer.create(<NumericAssessment {...getDefaultProps()} />)

		const evaluatorSpy = jest.spyOn(component.getInstance().evaluator, 'evaluate')

		expect(component.getInstance().checkIfResponseIsValid()).toBe(false)

		expect(evaluatorSpy).not.toHaveBeenCalled()

		evaluatorSpy.mockRestore()
	})

	test('checkIfResponseIsValid returns true if response is valid and correct', () => {
		const component = renderer.create(
			<NumericAssessment {...getDefaultProps()} hasResponse={true} response={{ value: '6928' }} />
		)

		const evaluatorSpy = jest.spyOn(component.getInstance().evaluator, 'evaluate')

		expect(component.getInstance().checkIfResponseIsValid()).toEqual(true)

		expect(evaluatorSpy).toHaveBeenCalled()

		evaluatorSpy.mockRestore()
	})

	test('checkIfResponseIsValid returns true if response is valid and incorrect', () => {
		const component = renderer.create(
			<NumericAssessment {...getDefaultProps()} hasResponse={true} response={{ value: '$FF0F' }} />
		)

		const evaluatorSpy = jest.spyOn(component.getInstance().evaluator, 'evaluate')

		expect(component.getInstance().checkIfResponseIsValid()).toEqual(true)

		expect(evaluatorSpy).toHaveBeenCalled()

		evaluatorSpy.mockRestore()
	})

	test('checkIfResponseIsValid returns false, updates form validity, if input is invalid', () => {
		const component = renderer.create(
			<NumericAssessment {...getDefaultProps()} hasResponse={true} response={{ value: '***' }} />
		)

		const evaluatorSpy = jest.spyOn(component.getInstance().evaluator, 'evaluate')
		component.getInstance().inputRef = {
			current: {
				setCustomValidity: jest.fn()
			}
		}

		expect(component.getInstance().checkIfResponseIsValid()).toEqual(false)

		expect(evaluatorSpy).toHaveBeenCalled()
		expect(component.getInstance().inputRef.current.setCustomValidity).toHaveBeenCalledWith(
			'Please enter a valid numeric value'
		)

		evaluatorSpy.mockRestore()
	})

	test('checkIfResponseIsValid returns false, updates form validity, if input is unmatched', () => {
		const props = getDefaultProps()

		const component = renderer.create(
			<NumericAssessment {...props} hasResponse={true} response={{ value: '1/2' }} />
		)

		component.getInstance().evaluator = new NumericAnswerEvaluator({
			scoreRuleConfigs: props.model.modelState.scoreRules,
			types: 'decimal'
		})

		const evaluatorSpy = jest.spyOn(component.getInstance().evaluator, 'evaluate')
		component.getInstance().inputRef = {
			current: {
				setCustomValidity: jest.fn()
			}
		}

		expect(component.getInstance().checkIfResponseIsValid()).toEqual(false)

		expect(evaluatorSpy).toHaveBeenCalled()
		expect(component.getInstance().inputRef.current.setCustomValidity).toHaveBeenCalledWith(
			"Your answer didn't match one of the accepted numeric types"
		)

		evaluatorSpy.mockRestore()
	})

	test('checkIfResponseIsValid returns false, updates form validity, if input is not a safe number', () => {
		const props = getDefaultProps()

		const component = renderer.create(
			<NumericAssessment
				{...props}
				hasResponse={true}
				response={{ value: '0xFFFFFFFFFFFFFFFFFFFFFFFF' }}
			/>
		)

		component.getInstance().inputRef = {
			current: {
				setCustomValidity: jest.fn()
			}
		}

		expect(component.getInstance().checkIfResponseIsValid()).toEqual(false)

		expect(component.getInstance().inputRef.current.setCustomValidity).toHaveBeenCalledWith(
			'Your answer was too large of a number'
		)
	})

	test('checkIfResponseIsValid returns false, updates form validity, if input is matched against multiple types', () => {
		// In this test the expected answer is "0b1101", but both octal and binary are accepted.
		// The student answers with "1101", which _could_ be binary and _could_ be octal.
		// There is no exact obvious match, resulting in an error state

		const props = getDefaultProps()
		props.model.modelState.scoreRules[0].value = '0b1101'

		const component = renderer.create(
			<NumericAssessment {...props} hasResponse={true} response={{ value: '1101' }} />
		)

		component.getInstance().evaluator = new NumericAnswerEvaluator({
			scoreRuleConfigs: props.model.modelState.scoreRules,
			types: 'octal,binary'
		})

		const evaluatorSpy = jest.spyOn(component.getInstance().evaluator, 'evaluate')
		component.getInstance().inputRef = {
			current: {
				setCustomValidity: jest.fn()
			}
		}

		expect(component.getInstance().checkIfResponseIsValid()).toEqual(false)

		expect(evaluatorSpy).toHaveBeenCalled()
		expect(component.getInstance().inputRef.current.setCustomValidity).toHaveBeenCalledWith(
			'Your answer matched multiple types - Make sure to explicitly input your answer'
		)

		evaluatorSpy.mockRestore()
	})

	test('handleFormChange does not call retry if score is null, returns expected object', () => {
		const props = getDefaultProps()
		const component = renderer.create(<NumericAssessment {...props} />)

		expect(
			component.getInstance().handleFormChange({
				target: { value: '6928' }
			})
		).toEqual({
			state: {
				value: '6928'
			},
			targetId: null,
			sendResponseImmediately: false
		})

		expect(QuestionUtil.retryQuestion).not.toHaveBeenCalled()
	})

	test('handleFormChange calls retry if score is not null, returns expected object', () => {
		const props = getDefaultProps()
		const component = renderer.create(
			<NumericAssessment {...props} score={100} hasResponse={true} response={{ value: '6928 ' }} />
		)

		expect(
			component.getInstance().handleFormChange({
				target: { value: '6928' }
			})
		).toEqual({
			state: {
				value: '6928'
			},
			targetId: null,
			sendResponseImmediately: false
		})

		expect(QuestionUtil.retryQuestion).toHaveBeenCalled()
	})

	test.each`
		rangeString | expectedSummary                                                                                                              | expectedString
		${'1'}      | ${{ type: 'value', value: '1' }}                                                                                             | ${'1'}
		${'[-1,1]'} | ${{ type: 'range', min: '-1', conjunction: 'to', max: '1' }}                                                                 | ${'-1 to 1'}
		${'(-1,1]'} | ${{ type: 'range', minPrefix: 'Greater than', min: '-1', conjunction: 'and', maxPrefix: 'less than or equal to', max: '1' }} | ${'Greater than -1 and less than or equal to 1'}
		${'[-1,1)'} | ${{ type: 'range', minPrefix: 'Greater than or equal to', min: '-1', conjunction: 'and', maxPrefix: 'less than', max: '1' }} | ${'Greater than or equal to -1 and less than 1'}
		${'(-1,1)'} | ${{ type: 'range', minPrefix: 'Greater than', min: '-1', conjunction: 'and', maxPrefix: 'less than', max: '1' }}             | ${'Greater than -1 and less than 1'}
		${'(*,1]'}  | ${{ type: 'text-and-value', text: 'Less than or equal to', value: '1' }}                                                     | ${'Less than or equal to 1'}
		${'(*,1)'}  | ${{ type: 'text-and-value', text: 'Less than', value: '1' }}                                                                 | ${'Less than 1'}
		${'[-1,*)'} | ${{ type: 'text-and-value', text: 'Greater than or equal to', value: '-1' }}                                                 | ${'Greater than or equal to -1'}
		${'(-1,*)'} | ${{ type: 'text-and-value', text: 'Greater than', value: '-1' }}                                                             | ${'Greater than -1'}
		${'(*,*)'}  | ${{ type: 'text', text: 'Any value' }}                                                                                       | ${'Any value'}
		${''}       | ${{ type: 'text', text: 'Nothing' }}                                                                                         | ${'Nothing'}
	`(
		'getRangeSummary("$rangeString") = "$expectedSummary", getRangeSummaryString(...) = "$expectedString", matches snapshot',
		({ rangeString, expectedSummary, expectedString }) => {
			const range = new ValueRange(rangeString)
			const summary = NumericAssessment.prototype.getRangeSummary(range)
			const string = NumericAssessment.prototype.getRangeSummaryString(summary)

			expect(summary).toEqual(expectedSummary)
			expect(string).toEqual(expectedString)
			expect(NumericAssessment.prototype.renderRangeSummary(summary)).toMatchSnapshot()
		}
	)

	test.each`
		mods               | expectedString
		${[]}              | ${''}
		${['a']}           | ${' (a)'}
		${['a', 'b']}      | ${' (a and b)'}
		${['a', 'b', 'c']} | ${' (a, b, and c)'}
	`('renderRuleModSummaries("$mods") = "$expectedString"', ({ mods, expectedString }) => {
		expect(NumericAssessment.prototype.renderRuleModSummaries(mods)).toBe(expectedString)
	})

	test.each`
		isSurvey | hasResponse | score         | unitsText  | expectedString
		${false} | ${false}    | ${null}       | ${''}      | ${'Input your answer.'}
		${false} | ${false}    | ${null}       | ${'grams'} | ${'Input your answer in grams.'}
		${false} | ${false}    | ${'no-score'} | ${''}      | ${'Input your answer.'}
		${false} | ${false}    | ${'no-score'} | ${'grams'} | ${'Input your answer in grams.'}
		${false} | ${false}    | ${0}          | ${''}      | ${'Input your answer.'}
		${false} | ${false}    | ${0}          | ${'grams'} | ${'Input your answer in grams.'}
		${false} | ${false}    | ${100}        | ${''}      | ${'Input your answer.'}
		${false} | ${false}    | ${100}        | ${'grams'} | ${'Input your answer in grams.'}
		${false} | ${true}     | ${null}       | ${''}      | ${'Your current answer'}
		${false} | ${true}     | ${null}       | ${'grams'} | ${'Your current answer'}
		${false} | ${true}     | ${'no-score'} | ${''}      | ${'Your answer'}
		${false} | ${true}     | ${'no-score'} | ${'grams'} | ${'Your answer'}
		${false} | ${true}     | ${0}          | ${''}      | ${'Your incorrect answer'}
		${false} | ${true}     | ${0}          | ${'grams'} | ${'Your incorrect answer'}
		${false} | ${true}     | ${100}        | ${''}      | ${'Your correct answer'}
		${false} | ${true}     | ${100}        | ${'grams'} | ${'Your correct answer'}
		${true}  | ${false}    | ${null}       | ${''}      | ${'Input your response.'}
		${true}  | ${false}    | ${null}       | ${'grams'} | ${'Input your response in grams.'}
		${true}  | ${false}    | ${'no-score'} | ${''}      | ${'Input your response.'}
		${true}  | ${false}    | ${'no-score'} | ${'grams'} | ${'Input your response in grams.'}
		${true}  | ${false}    | ${0}          | ${''}      | ${'Input your response.'}
		${true}  | ${false}    | ${0}          | ${'grams'} | ${'Input your response in grams.'}
		${true}  | ${false}    | ${100}        | ${''}      | ${'Input your response.'}
		${true}  | ${false}    | ${100}        | ${'grams'} | ${'Input your response in grams.'}
		${true}  | ${true}     | ${null}       | ${''}      | ${'Your current response'}
		${true}  | ${true}     | ${null}       | ${'grams'} | ${'Your current response'}
		${true}  | ${true}     | ${'no-score'} | ${''}      | ${'Your response'}
		${true}  | ${true}     | ${'no-score'} | ${'grams'} | ${'Your response'}
		${true}  | ${true}     | ${0}          | ${''}      | ${'Your incorrect response'}
		${true}  | ${true}     | ${0}          | ${'grams'} | ${'Your incorrect response'}
		${true}  | ${true}     | ${100}        | ${''}      | ${'Your correct response'}
		${true}  | ${true}     | ${100}        | ${'grams'} | ${'Your correct response'}
	`(
		'getScreenReaderInputDescription($isSurvey, $hasResponse, $score, $unitsText) = "$expectedString"',
		({ isSurvey, hasResponse, score, unitsText, expectedString }) => {
			expect(
				NumericAssessment.prototype.getScreenReaderInputDescription(
					isSurvey,
					hasResponse,
					score,
					unitsText
				)
			).toBe(expectedString)
		}
	)

	test.each`
		isReview | isSurvey | expectedString
		${false} | ${false} | ${'Your answer...'}
		${false} | ${true}  | ${'Your response...'}
		${true}  | ${false} | ${'(No answer given)'}
		${true}  | ${true}  | ${'(No response given)'}
	`(
		'getPlaceholderText($isReview, $isSurvey) = "$expectedString"',
		({ isReview, isSurvey, expectedString }) => {
			expect(NumericAssessment.prototype.getPlaceholderText(isReview, isSurvey)).toBe(
				expectedString
			)
		}
	)

	test.each`
		ruleConfig                                                           | expectedMods
		${{ types: 'decimal' }}                                              | ${[]}
		${{ types: 'decimal', absoluteError: '1' }}                          | ${['±1 Error accepted']}
		${{ types: 'decimal', percentError: '1' }}                           | ${['1% Error accepted']}
		${{ types: 'decimal', sigFigs: '4' }}                                | ${['With 4 significant figures']}
		${{ types: 'decimal', sigFigs: '[1,2]' }}                            | ${['With 1 to 2 significant figures']}
		${{ types: 'decimal', sigFigs: '[1,3)' }}                            | ${['With greater than or equal to 1 and less than 3 significant figures']}
		${{ types: 'decimal', sigFigs: '[1,*)' }}                            | ${['With greater than or equal to 1 significant figures']}
		${{ types: 'fractional', isFractionReduced: true }}                  | ${['Must be in reduced form']}
		${{ types: 'fractional', isFractionReduced: false }}                 | ${['Not in reduced form']}
		${{ types: 'fractional', isFractionReduced: true, percentError: 2 }} | ${['2% Error accepted', 'Must be in reduced form']}
	`('getRuleModSummaries($ruleConfig) = "$expectedMods"', ({ ruleConfig, expectedMods }) => {
		expect(NumericAssessment.prototype.getRuleModSummaries(new NumericRule(ruleConfig))).toEqual(
			expectedMods
		)
	})

	test('getRevealAnswerDefault returns when-incorrect', () => {
		expect(NumericAssessment.getRevealAnswerDefault()).toBe('when-incorrect')
	})

	test('getInstructions returns expected JSX when not survey question', () => {
		expect(
			NumericAssessment.getInstructions({
				modelState: {
					type: 'default'
				}
			})
		).toEqual(
			<React.Fragment>
				<span className="for-screen-reader-only">Form with one input. </span>Input your answer
			</React.Fragment>
		)
	})

	test('getInstructions returns expected JSX when survey question', () => {
		expect(
			NumericAssessment.getInstructions({
				modelState: {
					type: 'survey'
				}
			})
		).toEqual(
			<React.Fragment>
				<span className="for-screen-reader-only">Form with one input. </span>Input your response
			</React.Fragment>
		)
	})

	test('isResponseEmpty returns true if response object has empty value string', () => {
		expect(NumericAssessment.isResponseEmpty({ value: 'a' })).toBe(false)
		expect(NumericAssessment.isResponseEmpty({ value: '' })).toBe(true)
	})

	test('getFeedback calls QuestionUtil.getData', () => {
		const thisValue = {
			props: {
				model: jest.fn(),
				moduleData: {
					questionState: jest.fn(),
					navState: { context: 'mockContext' }
				}
			}
		}

		NumericAssessment.prototype.getFeedback.bind(thisValue)()

		expect(QuestionUtil.getData).toHaveBeenCalledWith(
			thisValue.props.moduleData.questionState,
			thisValue.props.model,
			'mockContext',
			'feedback'
		)
	})

	test('retry calls QuestionUtil.retryQuestion', () => {
		const thisValue = {
			props: {
				questionModel: {
					get: () => 'mock-id'
				},
				moduleData: {
					navState: { context: 'mockContext' }
				}
			}
		}

		NumericAssessment.prototype.retry.bind(thisValue)()

		expect(QuestionUtil.retryQuestion).toHaveBeenCalledWith('mock-id', 'mockContext')
	})

	test('onInputBlur calls QuestionUtil.sendResponse', () => {
		const thisValue = {
			props: {
				questionModel: {
					get: () => 'mock-id'
				},
				moduleData: {
					navState: { context: 'mockContext' }
				}
			}
		}

		NumericAssessment.prototype.onInputBlur.bind(thisValue)()

		expect(QuestionUtil.sendResponse).toHaveBeenCalledWith('mock-id', 'mockContext')
	})

	test('clearCustomValidity clears the event targets validity string', () => {
		const event = { target: { setCustomValidity: jest.fn() } }
		NumericAssessment.prototype.clearCustomValidity(event)

		expect(event.target.setCustomValidity).toHaveBeenCalledWith('')
	})

	test('focusOnContent does nothing if it cannot find the dom element', () => {
		const model = {
			getDomEl: () => null
		}

		expect(NumericAssessment.focusOnContent(model)).toBe(false)
		expect(focus).not.toHaveBeenCalled()
	})

	test('focusOnContent does nothing if it cannot find the dom element, with region', () => {
		const model = {
			getDomEl: () => ({ querySelector: () => null })
		}

		expect(NumericAssessment.focusOnContent(model, { region: 'answers' })).toBe(false)
		expect(focus).not.toHaveBeenCalled()
	})

	test('focusOnContent focuses on dom element', () => {
		const el = jest.fn()
		const model = {
			getDomEl: () => el
		}

		expect(NumericAssessment.focusOnContent(model, { scroll: 'mock-scroll-value' })).toBe(true)
		expect(focus).toHaveBeenCalledWith(el, 'mock-scroll-value')
	})

	test('focusOnContent focuses on dom element with region', () => {
		const el = jest.fn()
		const model = {
			getDomEl: () => ({ querySelector: () => el })
		}

		expect(
			NumericAssessment.focusOnContent(model, { region: 'answers', scroll: 'mock-scroll-value' })
		).toBe(true)
		expect(focus).toHaveBeenCalledWith(el, 'mock-scroll-value')
	})
})
