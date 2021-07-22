import Choice from './editor-registration'

import { CHOICE_NODE } from '../constants'

describe('Choice editor', () => {
	test('plugins.renderNode renders a choice', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: CHOICE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Choice.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})
})
