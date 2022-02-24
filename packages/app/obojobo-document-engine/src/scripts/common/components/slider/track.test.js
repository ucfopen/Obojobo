import React from 'react'
import Track from './track'
import renderer from 'react-test-renderer'

describe('Track', () => {
	test('Track renders correctly', () => {
		const trackProps = jest.fn()
		const component = renderer.create(
			<Track
				source={{ percent: 10 }}
				target={{ percent: 10 }}
				disabled={false}
				getTrackProps={trackProps}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
		expect(trackProps).toHaveBeenCalled()
	})
})
