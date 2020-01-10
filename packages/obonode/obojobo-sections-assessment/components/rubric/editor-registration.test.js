jest.mock('./editor-component', () => global.mockReactComponent(this, 'Rubric'))
jest.mock('./schema', () => ({ mock: 'schema' }))
jest.mock('./converter', () => ({ mock: 'converter' }))

import Rubric from './editor-registration'

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'

describe('Rubric editor', () => {
	test('plugins.renderNode renders the rubric when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: RUBRIC_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: 'mockNode',
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		const next = jest.fn()

		expect(Rubric.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})
})
