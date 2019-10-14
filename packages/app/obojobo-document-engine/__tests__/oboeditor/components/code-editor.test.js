import renderer from 'react-test-renderer'
import PageEditor from 'src/scripts/oboeditor/components/page-editor'
import React from 'react'

describe('CodeEditor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetModules()
	})

	test('CodeEditor component', () => {
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}
		const component = renderer.create(<PageEditor {...props} />)
		expect(component.toJSON()).toMatchSnapshot()
	})
})
