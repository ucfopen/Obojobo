jest.mock('react-dom')
jest.mock('obojobo-chunks-iframe/viewer-component', () => require('obojobo-document-engine/__mocks__/mock-class-component').default)
jest.mock('obojobo-document-engine/src/scripts/common/chunk/text-chunk/text-group-el', () => require('obojobo-document-engine/__mocks__/mock-class-component').default)

import Materia from './viewer-component'
import OboModel from 'obojobo-document-engine/__mocks__/obo-model-mock'
import React from 'react'
import renderer from 'react-test-renderer'

require('./viewer') // used to register this oboModel

describe('Materia', () => {
	let model
	let moduleData

	beforeEach(() => {
		jest.resetAllMocks()

		OboModel.__setNextGeneratedLocalId('mock-uuid')
		model = OboModel.create({
			id: 'mock-obo-id',
			type: 'ObojoboDraft.Chunks.Materia',
			content: {
				src: 'http://www.example.com'
			}
		})

		moduleData = {
			model: {
				title: 'mocked-module-title'
			},
			navState: {
				visitId: 'mock-visit-id'
			}
		}
	})

	afterEach(() => {
	})

	test('Materia component renders', () => {
		const props = {
			model,
			moduleData
		}

		const component = renderer.create(<Materia {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

})
