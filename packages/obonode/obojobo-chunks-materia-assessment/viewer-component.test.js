jest.mock('obojobo-document-engine/src/scripts/viewer/util/api', () => ({
	get: jest.fn(),
	processJsonResults: jest.fn()
}))

jest.mock('obojobo-document-engine/src/scripts/viewer', () => ({
	components: {
		OboQuestionAssessmentComponent: jest.requireActual(
			'obojobo-document-engine/src/scripts/viewer/components/obo-question-assessment-component'
		).default
	},
	util: {
		NavUtil: {
			getContext: jest.fn().mockReturnValue('mock:module:context')
		}
	}
}))

jest.mock('react-dom')
jest.mock(
	'obojobo-chunks-iframe/viewer-component',
	() => require('obojobo-document-engine/__mocks__/mock-class-component').default
)
jest.mock(
	'obojobo-document-engine/src/scripts/common/chunk/text-chunk/text-group-el',
	() => require('obojobo-document-engine/__mocks__/mock-class-component').default
)

import Materia from 'obojobo-chunks-materia/viewer-component'

import MateriaAssessment from './viewer-component'
import OboModel from 'obojobo-document-engine/__mocks__/obo-model-mock'
import React from 'react'
import renderer from 'react-test-renderer'

require('./viewer') // used to register this oboModel

describe('MateriaAssessment viewer component', () => {
	let model
	let moduleData
	let questionModel
	let onSaveAnswer

	const API = require('obojobo-document-engine/src/scripts/viewer/util/api')

	const Viewer = require('obojobo-document-engine/src/scripts/viewer')
	const { NavUtil } = Viewer.util

	const mockModuleTitle = 'mocked-module-title'
	const mockVisitId = 'mock-visit-id'
	const mockNodeId = 'mock-obo-id'
	const mockQuestionId = 'mock-question-id'

	beforeEach(() => {
		jest.resetAllMocks()
		jest.spyOn(window, 'addEventListener')
		jest.spyOn(window, 'removeEventListener')

		OboModel.__setNextGeneratedLocalId('mock-uuid')
		model = OboModel.create({
			id: mockNodeId,
			type: 'ObojoboDraft.Chunks.MateriaAssessment',
			content: {
				src: 'http://www.example.com'
			}
		})

		moduleData = {
			model: {
				title: mockModuleTitle
			},
			navState: {
				visitId: mockVisitId
			}
		}

		questionModel = {
			get: jest.fn().mockReturnValue(mockQuestionId)
		}

		onSaveAnswer = jest.fn()
	})

	afterEach(() => {})

	test('renders', () => {
		expect.hasAssertions()
		const props = {
			model,
			moduleData
		}
		const component = renderer.create(<MateriaAssessment {...props} />)
		expect(component.toJSON()).toMatchSnapshot()

		expect(component.root.children.length).toBe(1)
		expect(component.root.children[0].type).toBe(Materia)
	})

	test('handleScorePassback makes an API call to verify the score', () => {
		API.get = jest.fn().mockResolvedValue(true)
		API.processJsonResults = jest.fn().mockResolvedValue({ score: 100, success: true })

		NavUtil.getContext = jest.fn().mockReturnValue('mock:module:context')

		expect.hasAssertions()
		const props = {
			model,
			moduleData,
			questionModel,
			onSaveAnswer
		}

		const component = renderer.create(<MateriaAssessment {...props} />)
		const inst = component.getInstance()

		const mockData = {
			type: 'materiaScoreRecorded',
			score: 100,
			score_url: 'http://localhost/score'
		}
		const mockEvent = {
			origin: 'http://localhost',
			source: 'http://localhost/whatever',
			data: JSON.stringify(mockData)
		}

		return inst.handleScorePassback(mockEvent, mockData).then(() => {
			expect(API.get).toHaveBeenCalledTimes(1)
			expect(API.get).toHaveBeenCalledWith(
				`/materia-lti-score-verify?visitId=${mockVisitId}&nodeId=${mockNodeId}`,
				'json'
			)

			expect(inst.state).toHaveProperty('score', 100)
			expect(onSaveAnswer).toHaveBeenCalledTimes(1)
		})
	})

	test('isResponseEmpty returns true if the response score is not verified - does not exist', () => {
		expect(MateriaAssessment.isResponseEmpty({})).toBe(true)
		expect(MateriaAssessment.isResponseEmpty({ score: 100, verifiedScore: false })).toBe(true)
	})
	test('isResponseEmpty returns true if the response score is not verified - false value', () => {
		expect(MateriaAssessment.isResponseEmpty({ score: 100, verifiedScore: false })).toBe(true)
	})
	test('isResponseEmpty returns false if the response score is verified', () => {
		expect(MateriaAssessment.isResponseEmpty({ score: 100, verifiedScore: true })).toBe(false)
	})

	test('calculateScore returns null when no score is recorded', () => {
		const props = {
			model,
			moduleData
		}
		const component = renderer.create(<MateriaAssessment {...props} />)

		const inst = component.getInstance()
		expect(inst.calculateScore()).toBe(null)
	})

	test('calculateScore returns properly when a score is recorded', () => {
		const mockScore = 90
		const mockScoreUrl = 'url:to.score/screen'

		const props = {
			model,
			moduleData
		}
		const component = renderer.create(<MateriaAssessment {...props} />)

		const inst = component.getInstance()

		// Ordinarily we would never set this manually, it would be a product of the score verification
		// But we're only really checking this one function's reactions, so it should be fine.
		inst.state = {
			score: mockScore,
			verifiedScore: true,
			scoreUrl: mockScoreUrl
		}

		expect(inst.calculateScore()).toEqual({ score: mockScore, details: { scoreUrl: mockScoreUrl } })
	})

	test('getInstructions returns properly', () => {
		const props = {
			model,
			moduleData
		}
		const component = renderer.create(<MateriaAssessment {...props} />)

		const inst = component.getInstance()
		const instructionsFragment = renderer.create(inst.getInstructions())

		const fragmentRender = instructionsFragment.root.findByProps({
			className: 'for-screen-reader-only'
		})
		expect(fragmentRender.children[0]).toBe('Embedded Materia widget.')
		expect(fragmentRender.parent.children[1]).toBe(
			'Play the embedded Materia widget to receive a score. Your highest score will be saved.'
		)
	})

	test('handleFormChange returns the expected object', () => {
		let mockScore = 90
		let mockScoreUrl = 'url:to.score/screen'

		const props = {
			model,
			moduleData
		}
		const component = renderer.create(<MateriaAssessment {...props} />)

		const inst = component.getInstance()

		let mockNewState = {
			score: mockScore,
			verifiedScore: true,
			scoreUrl: mockScoreUrl
		}

		// Ordinarily we would never set this manually, it would be a product of the score verification
		// But we're only really checking this one function's reactions, so it should be fine.
		inst.state = mockNewState

		expect(inst.handleFormChange()).toEqual({
			state: mockNewState,
			targetId: null,
			sendResponseImmediately: true
		})

		mockScore = 100
		mockScoreUrl = 'url:to.some/other/score/screen'

		mockNewState = {
			score: mockScore,
			verifiedScore: true,
			scoreUrl: mockScoreUrl
		}

		inst.state = mockNewState

		expect(inst.handleFormChange()).toEqual({
			state: mockNewState,
			targetId: null,
			sendResponseImmediately: true
		})
	})
})
