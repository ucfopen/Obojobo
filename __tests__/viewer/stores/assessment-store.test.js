import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import { Store } from '../../../src/scripts/common/store'
import AssessmentStore from '../../../src/scripts/viewer/stores/assessment-store'
import QuestionStore from '../../../src/scripts/viewer/stores/question-store'
import APIUtil from '../../../src/scripts/viewer/util/api-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import ModalUtil from '../../../src/scripts/common/util/modal-util'
import ErrorUtil from '../../../src/scripts/common/util/error-util'
import NavUtil from '../../../src/scripts/viewer/util/nav-util'
import QuestionUtil from '../../../src/scripts/viewer/util/question-util'

jest.mock('../../../src/scripts/common/util/modal-util', () => {
	return {
		show: jest.fn()
	}
})

jest.mock('../../../src/scripts/common/util/error-util', () => {
	return {
		show: jest.fn(),
		errorResponse: jest.fn()
	}
})

jest.mock('../../../src/scripts/viewer/util/api-util', () => {
	return {
		postEvent: jest.fn(),
		startAttempt: jest.fn()
	}
})

describe.skip('AssessmentStore', () => {
	let getExampleAssessment = () => {
		return {
			id: 'rootId',
			type: 'ObojoboDraft.Modules.Module',
			children: [
				{
					id: 'assessmentId',
					type: 'ObojoboDraft.Sections.Assessment',
					children: [
						{
							id: 'pageId',
							type: 'ObojoboDraft.Pages.Page'
						},
						{
							id: 'questionBankId',
							type: 'ObojoboDraft.Chunks.QuestionBank'
						}
					]
				}
			]
		}
	}

	let mockValidStartAttempt = () => {
		APIUtil.startAttempt.mockImplementationOnce(() => {
			return Promise.resolve({
				status: 'ok',
				value: {
					attemptId: 'attemptId',
					assessmentId: 'assessmentId',
					state: {
						questions: [
							{
								id: 'q1',
								type: 'ObojoboDraft.Chunks.Question',
								children: [
									{
										id: 'r1',
										type: 'ObojoboDraft.Chunks.MCAssessment'
									}
								]
							},
							{
								id: 'q2',
								type: 'ObojoboDraft.Chunks.Question',
								children: [
									{
										id: 'r2',
										type: 'ObojoboDraft.Chunks.MCAssessment'
									}
								]
							}
						]
					}
				}
			})
		})
	}

	beforeEach(done => {
		jest.resetAllMocks()

		AssessmentStore.init()
		AssessmentStore.triggerChange = jest.fn()
		QuestionStore.init()
		QuestionStore.triggerChange = jest.fn()

		// Need to make sure all the Obo components are loaded
		Store.getItems(items => {
			done()
		})
	})

	it('should init state with a specific structure and return it', () => {
		AssessmentStore.init()

		expect(AssessmentStore.getState()).toEqual({
			assessments: {}
		})
	})

	test.skip(
		'inits with history (populates models and state, shows dialog for unfinished attempt',
		() => {
			let q1 = OboModel.create({
				id: 'question1',
				type: 'ObojoboDraft.Chunks.Question'
			})
			let q2 = OboModel.create({
				id: 'question2',
				type: 'ObojoboDraft.Chunks.Question'
			})
			let history = [
				{
					assessmentId: 'assessmentId',
					startTime: '1/1/2017 00:05:00',
					endTime: '1/1/2017 0:05:20',
					state: {
						questions: [
							{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' },
							{ id: 'question2', type: 'ObojoboDraft.Chunks.Question' }
						]
					},
					result: {
						assessmentScore: 100
					}
				},
				{
					assessmentId: 'assessmentId',
					startTime: '1/2/2017 00:05:10',
					endTime: null,
					state: {
						questions: [
							{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' },
							{ id: 'questionNonExistant', type: 'ObojoboDraft.Chunks.Question' }
						]
					}
				}
			]

			AssessmentStore.init(history)

			expect(AssessmentStore.getState()).toEqual({
				assessments: {
					assessmentId: {
						id: 'assessmentId',
						current: null,
						currentResponses: [],
						attempts: [
							{
								assessmentId: 'assessmentId',
								startTime: '1/1/2017 00:05:00',
								endTime: '1/1/2017 0:05:20',
								state: {
									questions: [
										{ id: 'question1', type: 'ObojoboDraft.Chunks.Question' },
										{ id: 'question2', type: 'ObojoboDraft.Chunks.Question' }
									]
								},
								result: {
									assessmentScore: 100
								}
							}
						],
						score: 100,
						lti: null
					}
				}
			})

			expect(Object.keys(OboModel.models).length).toEqual(3)
			expect(OboModel.models.questionNonExistant.id).toEqual('questionNonExistant')
			expect(ModalUtil.show).toHaveBeenCalledTimes(1)
		}
	)

	test('resuming an unfinished attempt hides the modal, starts the attempt and triggers a change', () => {
		let originalStartAttempt = AssessmentStore.startAttempt
		let unfinishedAttempt = { a: 1 }

		AssessmentStore.startAttempt = jest.fn()
		ModalUtil.hide = jest.fn()

		AssessmentStore.onResumeAttemptConfirm(unfinishedAttempt)

		expect(ModalUtil.hide).toHaveBeenCalledTimes(1)
		expect(AssessmentStore.startAttempt).toHaveBeenCalledTimes(1)
		expect(AssessmentStore.startAttempt).toHaveBeenCalledWith(unfinishedAttempt)
		expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)

		AssessmentStore.startAttempt = originalStartAttempt
	})

	test('tryStartAttempt shows an error if no attempts are left and triggers a change', () => {
		OboModel.create(getExampleAssessment())

		APIUtil.startAttempt.mockImplementationOnce(() => {
			return Promise.resolve({
				status: 'error',
				value: {
					message: 'Attempt limit reached'
				}
			})
		})

		ErrorUtil.show = jest.fn()

		return AssessmentStore.tryStartAttempt('assessmentId').then(res => {
			expect(ErrorUtil.show).toHaveBeenCalledTimes(1)
			expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
		})
	})

	test('tryStartAttempt shows a generic error if an unrecognized error is thrown and triggers a change', () => {
		OboModel.create(getExampleAssessment())

		APIUtil.startAttempt.mockImplementationOnce(() => {
			return Promise.resolve({
				status: 'error',
				value: {
					message: 'Some unexpected error that was not accounted for'
				}
			})
		})

		ErrorUtil.show = jest.fn()

		return AssessmentStore.tryStartAttempt('assessmentId').then(res => {
			expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
			expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
		})
	})

	test('startAttempt injects question models, creates state, updates the nav and processes the onStartAttempt trigger', () => {
		mockValidStartAttempt()
		OboModel.create(getExampleAssessment())

		NavUtil.rebuildMenu = jest.fn()
		NavUtil.goto = jest.fn()

		let assessmentModel = OboModel.models.rootId.children.at(0)
		let qBank = assessmentModel.children.at(1)

		assessmentModel.processTrigger = jest.fn()

		return AssessmentStore.tryStartAttempt('assessmentId').then(res => {
			expect(assessmentModel.children.length).toBe(2)
			expect(qBank.children.length).toBe(2)
			expect(qBank.children.at(0).id).toBe('q1')
			expect(qBank.children.at(1).id).toBe('q2')
			expect(NavUtil.rebuildMenu).toHaveBeenCalledTimes(1)
			expect(NavUtil.goto).toHaveBeenCalledTimes(1)
			expect(NavUtil.goto).toHaveBeenCalledWith('assessmentId')
			expect(OboModel.models.assessmentId.processTrigger).toHaveBeenCalledWith('onStartAttempt')
			expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
		})
	})

	test('endAttempt shows an error if the endAttempt request fails and triggers a change', done => {
		mockValidStartAttempt()
		OboModel.create(getExampleAssessment())

		APIUtil.endAttempt = jest.fn()
		APIUtil.endAttempt.mockImplementationOnce(() => {
			return Promise.resolve({
				status: 'error',
				value: {
					message: 'Some unexpected error that was not accounted for'
				}
			})
		})

		ErrorUtil.errorResponse = jest.fn()

		return AssessmentStore.tryStartAttempt('assessmentId').then(() => {
			AssessmentStore.tryEndAttempt('assessmentId').then(res => {
				expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
				expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)
				done()
			})
		})
	})

	test.skip(
		'endAttempt hides questions, resets responses, updates state, processes onEndAttempt trigger and triggers a change',
		done => {
			mockValidStartAttempt()
			OboModel.create(getExampleAssessment())

			APIUtil.endAttempt = jest.fn()
			APIUtil.endAttempt.mockImplementationOnce(() => {
				return Promise.resolve({
					status: 'ok',
					value: {
						assessmentId: 'assessmentId',
						result: {
							assessmentScore: 100
						}
					}
				})
			})
			APIUtil.postEvent.mockImplementationOnce(() => {
				return Promise.resolve({
					status: 'ok',
					value: {
						someResponse: 'goesHere'
					}
				})
			})

			ErrorUtil.errorResponse = jest.fn()
			QuestionUtil.hideQuestion = jest.fn()
			QuestionUtil.clearResponse = jest.fn()
			OboModel.models.assessmentId.processTrigger = jest.fn()

			return AssessmentStore.tryStartAttempt('assessmentId').then(() => {
				AssessmentStore.trySetResponse('q1', { responseForR1: 'someValue' }).then(res => {
					AssessmentStore.tryEndAttempt('assessmentId')
						.then(res => {
							expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(0)
							expect(QuestionUtil.hideQuestion).toHaveBeenCalledTimes(2)
							expect(QuestionUtil.hideQuestion).toHaveBeenCalledWith('q1')
							expect(QuestionUtil.hideQuestion).toHaveBeenCalledWith('q2')
							expect(OboModel.models.assessmentId.processTrigger).toHaveBeenCalledWith(
								'onEndAttempt'
							)
							expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(3)

							done()
						})
						.catch(e => {
							console.log(e)
						})
				})
			})
		}
	)

	test('setResponse with a bad response will show an error message', done => {
		mockValidStartAttempt()
		OboModel.create(getExampleAssessment())

		APIUtil.postEvent.mockImplementationOnce(() => {
			return Promise.resolve({
				status: 'error',
				value: {
					someErrorInfo: 'goesHere'
				}
			})
		})

		ErrorUtil.errorResponse = jest.fn()

		return AssessmentStore.tryStartAttempt('assessmentId').then(() => {
			AssessmentStore.trySetResponse('q1', { responseForR1: 'someValue' }).then(res => {
				expect(ErrorUtil.errorResponse).toHaveBeenCalledWith({
					status: 'error',
					value: {
						someErrorInfo: 'goesHere'
					}
				})

				done()
			})
		})
	})

	test('setResponse will update state, post an event and trigger a change', done => {
		mockValidStartAttempt()
		OboModel.create(getExampleAssessment())

		APIUtil.postEvent.mockImplementationOnce(() => {
			return Promise.resolve({
				status: 'ok',
				value: {
					some: 'response'
				}
			})
		})

		NavUtil.rebuildMenu = jest.fn()
		NavUtil.goto = jest.fn()

		return AssessmentStore.tryStartAttempt('assessmentId').then(() => {
			AssessmentStore.trySetResponse('q1', ['some response']).then(res => {
				expect(APIUtil.postEvent).toHaveBeenCalledWith(
					OboModel.models.rootId,
					'assessment:setResponse',
					'2.0.0',
					{
						assessmentId: 'assessmentId',
						attemptId: 'attemptId',
						questionId: 'q1',
						response: ['some response']
					}
				)
				expect(AssessmentStore.getState().assessments.assessmentId.currentResponses).toEqual(['q1'])
				expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(2)

				done()
			})
		})
	})
})
