import React from 'react'
import renderer from 'react-test-renderer'

import IFrameControls from '../../../../ObojoboDraft/Chunks/IFrame/controls'

describe('IFrame controls', () => {
	const createComponent = (newWindow, isZoomAbleToBeReset, isUnableToZoomOut, zoom, reload) => {
		isZoomAbleToBeReset = Boolean(isZoomAbleToBeReset)
		isUnableToZoomOut = Boolean(isUnableToZoomOut)
		zoom = Boolean(zoom)
		reload = Boolean(reload)
		newWindow = Boolean(newWindow)

		return renderer.create(
			<IFrameControls
				isZoomAbleToBeReset={isZoomAbleToBeReset}
				isUnableToZoomOut={isUnableToZoomOut}
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

		expect(c(0, 0, 0, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 0, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 0, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 0, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 1, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 1, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 1, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 0, 1, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 0, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 0, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 0, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 0, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 1, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 1, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 1, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(0, 1, 1, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 0, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 0, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 0, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 0, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 1, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 1, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 1, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 0, 1, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 0, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 0, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 0, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 0, 1, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 1, 0, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 1, 0, 1).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 1, 1, 0).toJSON()).toMatchSnapshot()
		expect(c(1, 1, 1, 1, 1).toJSON()).toMatchSnapshot()
	})
})
