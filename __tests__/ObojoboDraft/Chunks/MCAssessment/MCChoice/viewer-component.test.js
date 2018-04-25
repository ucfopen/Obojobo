import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import MCChoice from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/viewer-component'
import OboModel from '../../../../../__mocks__/_obo-model-with-chunks.js'
import { moduleData, initModuleData } from '../../../../../__mocks__/viewer-state.mock'
import QuestionUtil from '../../../../../src/scripts/viewer/util/question-util'

jest.mock('../../../../../src/scripts/viewer/util/question-util', () => {
	return {
		getResponse: jest.fn(),
		getScoreForModel: jest.fn()
	}
})

describe('MCChoice viewer-component', () => {
	// TMCChoice looks at it's parent question model - so we need to build the whole question

	let questionModel = OboModel.create({
		id: 'pq1',
		type: 'ObojoboDraft.Chunks.Question',
		content: {
			title: 'title'
		},
		children: [
			{
				id: 'pq1.mca',
				type: 'ObojoboDraft.Chunks.MCAssessment',
				content: {
					responseType: 'pick-all'
				},
				children: [
					{
						id: 'pq1-mca-mc1',
						type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
						content: {
							score: 100
						},
						children: [
							{
								id: 'pq1-mca-mc1-ans',
								type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
								content: {},
								children: [
									{
										id: '21853c91-3d1a-4b36-acee-75fb764b743',

										type: 'ObojoboDraft.Chunks.Text',
										content: {
											textGroup: [
												{
													text: {
														value: 'yes',
														styleList: []
													},
													data: null
												}
											]
										},
										children: []
									}
								]
							}
						]
					},
					{
						id: 'pq1-mca-mc2',
						type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
						content: {
							score: 100
						},
						children: [
							{
								id: 'pq1-mca-mc2-ans',
								type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
								content: {},
								children: [
									{
										id: '21853c91-3d1a-4b36-acee-75fb764b74ca',
										type: 'ObojoboDraft.Chunks.Text',
										content: {
											textGroup: [
												{
													text: {
														value: 'yes',
														styleList: []
													},
													data: null
												}
											]
										},
										children: []
									}
								]
							}
						]
					}
				]
			}
		]
	})
	// choose one choice
	let model = OboModel.models['pq1-mca-mc1']

	// initialize model data stores
	initModuleData()

	test('pick-one questions render as expected', () => {
		let props = {
			model,
			moduleData,
			mode: 'mockMode',
			key: 'mockKey',
			responseType: 'pick-one',
			isShowingExplanation: false,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test.skip('question classNames update when selected', () => {})

	test.skip('question classNames update when correct', () => {})

	test('pick-one-multiple-correct questions render as expected', () => {
		initModuleData()

		let props = {
			model,
			moduleData,
			key: 'mockKey',
			responseType: 'pick-one-multiple-correct',
			isShowingExplanation: false,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	test('pick-all questions render as expected', () => {
		let props = {
			model,
			moduleData,
			key: 'mockKey',
			responseType: 'pick-all',
			isShowingExplanation: false,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		const component = renderer.create(<MCChoice {...props} />)

		expect(component).toMatchSnapshot()
	})

	// Review Tests
	test('flag is not rendered when not reviewing', () => {
		initModuleData()

		// Set up this answer to exist
		moduleData.questionState.scores[moduleData.navState.context] = 1

		// Set up this answer to be unselected
		QuestionUtil.getResponse.mockReturnValueOnce({
			ids: []
		})

		// set answer to incorrect
		model.get('content').score = 0

		let props = {
			model,
			moduleData,
			mode: 'review',
			key: 'mockKey',
			responseType: 'pick-one',
			label: 'mocklabel'
		}

		const component = renderer.create(<MCChoice {...props} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
		let el2 = document.createElement('div')
		el2.innerHTML = shallow(<MCChoice {...props} />).html()
		expect(el2.textContent).toBe('yes')
	})

	test('renderAnsFlag renders correct flag when user picks correct answer', () => {
		// Set up this answer to exist
		moduleData.questionState.scores[moduleData.navState.context] = 1

		// Set up this answer to be selected
		QuestionUtil.getResponse.mockReturnValueOnce({
			ids: ['pq1-mca-mc1']
		})

		// set answer to correct
		model.get('content').score = 100

		let props = {
			model,
			moduleData,
			mode: 'review',
			key: 'mockKey',
			responseType: 'pick-one',
			label: 'mocklabel'
		}

		let el2 = document.createElement('div')
		el2.innerHTML = shallow(<MCChoice {...props} />).html()
		expect(el2.textContent).toContain('Your Answer (Correct)')
	})
	test('renderAnsFlag renders incorrect flag when user picks incorrect answer', () => {
		// Set up this answer to exist
		moduleData.questionState.scores[moduleData.navState.context] = 1

		// Set up this answer to be selected
		QuestionUtil.getResponse.mockReturnValueOnce({
			ids: ['pq1-mca-mc1']
		})

		// set answer to incorrect
		model.get('content').score = 0

		let props = {
			model,
			moduleData,
			mode: 'review',
			key: 'mockKey',
			responseType: 'pick-one',
			label: 'mocklabel'
		}

		let el2 = document.createElement('div')
		el2.innerHTML = shallow(<MCChoice {...props} />).html()
		expect(el2.textContent).toContain('Your Answer (Incorrect)')
	})
	test('renderAnsFlag renders alt flag when user picks other correct answer', () => {
		// Set up this answer to exist
		moduleData.questionState.scores[moduleData.navState.context] = 1

		// Set up this answer to be unselected
		QuestionUtil.getResponse.mockReturnValueOnce({
			ids: []
		})

		// set answer to correct
		model.get('content').score = 100

		// set user to be correct
		QuestionUtil.getScoreForModel = jest.fn().mockReturnValueOnce(100)

		let props = {
			model,
			moduleData,
			mode: 'review',
			key: 'mockKey',
			responseType: 'pick-one',
			label: 'mocklabel'
		}

		let el2 = document.createElement('div')
		el2.innerHTML = shallow(<MCChoice {...props} />).html()
		expect(el2.textContent).toContain('Another Correct Answer')
	})
	test('renderAnsFlag renders correct flag when user picks incorrect answer', () => {
		// Set up this answer to exist
		moduleData.questionState.scores[moduleData.navState.context] = 1

		// Set up this answer to be unselected
		QuestionUtil.getResponse.mockReturnValueOnce({
			ids: []
		})

		// set answer to correct
		model.get('content').score = 100

		// set user to be incorrect
		QuestionUtil.getScoreForModel = jest.fn().mockReturnValueOnce(0)

		let props = {
			model,
			moduleData,
			mode: 'review',
			key: 'mockKey',
			responseType: 'pick-one',
			label: 'mocklabel'
		}

		let el2 = document.createElement('div')
		el2.innerHTML = shallow(<MCChoice {...props} />).html()
		expect(el2.textContent).toContain('Correct Answer')
	})
	test('renderAnsFlag renders no flag when answer is unpicked and incorrect', () => {
		// Set up this answer to exist
		moduleData.questionState.scores[moduleData.navState.context] = 1

		// Set up this answer to be unselected
		QuestionUtil.getResponse.mockReturnValueOnce({
			ids: []
		})

		// set answer to incorrect
		model.get('content').score = 0

		// set user to be incorrect
		QuestionUtil.getScoreForModel = jest.fn().mockReturnValueOnce(0)

		let props = {
			model,
			moduleData,
			mode: 'review',
			key: 'mockKey',
			responseType: 'pick-one',
			label: 'mocklabel'
		}

		let el2 = document.createElement('div')
		el2.innerHTML = shallow(<MCChoice {...props} />).html()
		expect(el2.textContent).toBe('yes')
	})
})
