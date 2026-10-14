import React from 'react'
import Handle from './handle'
import renderer from 'react-test-renderer'

describe('Handle', () => {
	test('Handle renders correctly', () => {
		const handleProps = jest.fn()
		const component = renderer.create(
			<Handle
				domain={[1, 5]}
				handle={{ id: 'mockId', value: 10, percent: 10 }}
				disabled={false}
				getHandleProps={handleProps}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
		expect(handleProps).toHaveBeenCalled()
	})
})
