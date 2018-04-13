import renderer from 'react-test-renderer'

import MCChoice from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/viewer-component'
import OboModel from '../../../../../__mocks__/_obo-model-with-chunks.js'
import { moduleData, initModuleData } from '../../../../../__mocks__/viewer-state.mock'

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
			key: 'mockKey',
			responseType: 'pick-one',
			isShowingExplanation: false,
			questionSubmitted: false,
			label: 'mocklabel'
		}

		const component = renderer.create(
			<MCChoice {...props} />
		)

		expect(component).toMatchSnapshot()
	})

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

		const component = renderer.create(
			<MCChoice {...props} />
		)

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

		const component = renderer.create(
			<MCChoice {...props} />
		)

		expect(component).toMatchSnapshot()
	})
})
