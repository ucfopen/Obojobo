// import { Store } from '../../../src/scripts/common/store'
import AssessmentStore from '../../../src/scripts/viewer/stores/assessment-store'
import OboModel from '../../../src/scripts/common/models/obo-model'
import APIUtil from '../../../src/scripts/viewer/util/api-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import ModalUtil from '../../../src/scripts/common/util/modal-util'
import ErrorUtil from '../../../src/scripts/common/util/error-util'
import NavUtil from '../../../src/scripts/viewer/util/nav-util'

jest.mock('../../../src/scripts/common/models/obo-model', () => {
	return require('../../../__mocks__/obo-model-mock').default;
})

jest.mock('../../../src/scripts/common/util/modal-util', () => {
	return ({
		show: jest.fn()
	})
})

jest.mock('../../../src/scripts/common/util/error-util', () => {
	return ({
		show: jest.fn(),
		errorResponse: jest.fn()
	})
})

jest.mock('../../../src/scripts/viewer/util/api-util', () => {
	return {
		postEvent: jest.fn(),
		startAttempt: jest.fn()
	}
})

describe('AssessmentStore', () => {
	beforeEach(() => {
		jest.resetAllMocks()

		AssessmentStore.init()
		AssessmentStore.triggerChange = jest.fn()
	})

	it('should init state with a specific structure and return it', () => {
		AssessmentStore.init();

		expect(AssessmentStore.getState()).toEqual({
			assessments: {}
		})
	})

	test('inits with history (populates models and state, shows dialog for unfinished attempt', () => {
		let q1 = OboModel.__create({
			id: 'question1',
			type: 'question'
		})
		let q2 = OboModel.__create({
			id: 'question2',
			type: 'question'
		})
		let history = [
			{
				assessmentId: 'assessmentId',
				startTime: '1/1/2017 00:05:00',
				endTime: '1/1/2017 0:05:20',
				state: {
					questions: [
						{ id:'question1', type:'question' },
						{ id:'question2', type:'question' }
					]
				}
			},
			{
				assessmentId: 'assessmentId',
				startTime: '1/2/2017 00:05:10',
				endTime: null,
				state: {
					questions: [
						{ id:'question1', type:'question' },
						{ id:'questionNonExistant', type:'question' }
					]
				}
			}
		]

		AssessmentStore.init(history);

		expect(AssessmentStore.getState()).toEqual({
			assessments: {
				assessmentId: {
					current: null,
					currentResponses: [],
					attempts: [
						{
							assessmentId: 'assessmentId',
							startTime: '1/1/2017 00:05:00',
							endTime: '1/1/2017 0:05:20',
							state: {
								questions: [
									{ id:'question1', type:'question' },
									{ id:'question2', type:'question' }
								]
							}
						}
					]
				}
			}
		})

		expect(Object.keys(OboModel.models).length).toEqual(3)
		expect(OboModel.models.questionNonExistant.id).toEqual('questionNonExistant')
		expect(ModalUtil.show).toHaveBeenCalledTimes(1)
	})

	test("resuming an unfinished attempt hides the modal, starts the attempt and triggers a change", () => {
		let originalStartAttempt = AssessmentStore.startAttempt
		let unfinishedAttempt = {a:1}

		AssessmentStore.startAttempt = jest.fn()
		ModalUtil.hide = jest.fn()

		AssessmentStore.onResumeAttemptConfirm(unfinishedAttempt)

		expect(ModalUtil.hide).toHaveBeenCalledTimes(1)
		expect(AssessmentStore.startAttempt).toHaveBeenCalledTimes(1)
		expect(AssessmentStore.startAttempt).toHaveBeenCalledWith(unfinishedAttempt)
		expect(AssessmentStore.triggerChange).toHaveBeenCalledTimes(1)

		AssessmentStore.startAttempt = originalStartAttempt
	})

	test("tryStartAttempt shows an error if no attempts are left", () => {
		OboModel.__create({
			id: 'rootId',
			type: 'root',
			children: [
				{
					id: 'assessmentId',
					type: 'assessment'
				}
			]
		})

		APIUtil.startAttempt.mockImplementationOnce(() => {
			return (Promise.resolve({
				status: 'error',
				value: {
					message: 'Attempt limit reached'
				}
			}))
		})

		ErrorUtil.show = jest.fn()

		return AssessmentStore.tryStartAttempt(OboModel.models.assessmentId).then((res) => {
			expect(ErrorUtil.show).toHaveBeenCalledTimes(1)
		})
	})

	test("tryStartAttempt shows a generic error if an unrecognized error is thrown", () => {
		OboModel.__create({
			id: 'rootId',
			type: 'root',
			children: [
				{
					id: 'assessmentId',
					type: 'assessment'
				}
			]
		})

		APIUtil.startAttempt.mockImplementationOnce(() => {
			return (Promise.resolve({
				status: 'error',
				value: {
					message: 'Some unexpected error that was not accounted for'
				}
			}))
		})

		ErrorUtil.show = jest.fn()

		return AssessmentStore.tryStartAttempt(OboModel.models.assessmentId).then((res) => {
			expect(ErrorUtil.errorResponse).toHaveBeenCalledTimes(1)
		})
	})

	test("startAttempt injects question models, creates state, updates the nav and processes the onStartAttempt trigger", () => {
		NavUtil.rebuildMenu = jest.fn()
		NavUtil.goto = jest.fn()

		APIUtil.startAttempt.mockImplementationOnce(() => {
			return (Promise.resolve({
				status: 'ok',
				value: {
					assessmentId: 'assessmentId',
					state: {
						questions: [
							{
								id: 'q1',
								type: 'question'
							},
							{
								id: 'q2',
								type: 'question'
							}
						]
					}
				}
			}))
		})

		OboModel.__create({
			id: 'rootId',
			type: 'root',
			children: [
				{
					id: 'assessmentId',
					type: 'assessment',
					children: [
						{
							id: 'pageId',
							type: 'page'
						},
						{
							id: 'questionBankId',
							type: 'questionBank'
						}
					]
				}
			]
		})

		OboModel.__registerModel('question', { adapter:{} })

		let assessmentModel = OboModel.models.rootId.children.at(0)
		let qBank = assessmentModel.children.at(1)

		assessmentModel.processTrigger = jest.fn()

		return AssessmentStore.tryStartAttempt(OboModel.models.assessmentId).then((res) => {
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
})