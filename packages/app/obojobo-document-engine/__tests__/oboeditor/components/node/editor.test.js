import Component from 'src/scripts/oboeditor/components/node/editor'
const COMPONENT_NODE = 'oboeditor.component'

describe('Component editor', () => {
	test('renderNode renders a component when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: COMPONENT_NODE,
				data: {
					get: () => ({})
				}
			}
		}

		expect(Component.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: 'mockNode',
				data: {
					get: () => ({})
				}
			}
		}

		const next = jest.fn()

		expect(Component.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})
})
