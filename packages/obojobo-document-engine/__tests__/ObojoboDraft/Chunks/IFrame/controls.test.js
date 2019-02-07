import React from 'react'
import renderer from 'react-test-renderer'

import IFrameControls from '../../../../ObojoboDraft/Chunks/IFrame/controls'

describe('IFrame controls', () => {
	const createComponent = (
		newWindow,
		isZoomResettable,
		isZoomOutDisabled,
		isZoomInDisabled,
		zoom,
		reload
	) => {
		isZoomResettable = Boolean(isZoomResettable)
		isZoomOutDisabled = Boolean(isZoomOutDisabled)
		isZoomInDisabled = Boolean(isZoomOutDisabled)
		zoom = Boolean(zoom)
		reload = Boolean(reload)
		newWindow = Boolean(newWindow)

		return renderer.create(
			<IFrameControls
				isZoomResettable={isZoomResettable}
				isZoomOutDisabled={isZoomOutDisabled}
				isZoomInDisabled={isZoomInDisabled}
				controlsOptions={{
					zoom,
					reload,
					newWindow
				}}
			/>
		)
	}

	test('IFrame controls component renders', () => {
		const c = createComponent

		expect(c(0, 0, 0, 0, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 0, 0, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 0, 0, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 0, 0, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 0, 1, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 0, 1, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 0, 1, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 0, 1, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 1, 0, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 1, 0, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 1, 0, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 1, 0, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 1, 1, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 1, 1, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 1, 1, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 1, 1, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 0, 0, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 0, 0, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 0, 0, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 0, 0, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 0, 1, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 0, 1, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 0, 1, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 0, 1, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 1, 0, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 1, 0, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 1, 0, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 1, 0, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 1, 1, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 1, 1, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 1, 1, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 1, 1, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 0, 0, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 0, 0, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 0, 0, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 0, 0, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 0, 1, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 0, 1, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 0, 1, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 0, 1, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 1, 0, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 1, 0, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 1, 0, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 1, 0, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 1, 1, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 1, 1, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 1, 1, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 1, 1, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 0, 0, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 0, 0, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 0, 0, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 0, 0, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 0, 1, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 0, 1, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 0, 1, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 0, 1, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 1, 0, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 1, 0, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 1, 0, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 1, 0, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 1, 1, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 1, 1, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 1, 1, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 1, 1, 1, 1).toJSON()).toMatchSnapshot()
	})
})
