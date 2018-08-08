jest.mock('react-dom')

import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { shallow, mount, unmount } from 'enzyme'

import IFrame from '../../../../ObojoboDraft/Chunks/IFrame/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import Dispatcher from '../../../../src/scripts/common/flux/dispatcher'
import MediaUtil from '../../../../src/scripts/viewer/util/media-util'

const renderSettingsModule = require('../../../../ObojoboDraft/Chunks/IFrame/render-settings')
const originalGetRenderSettingsFn = renderSettingsModule.getRenderSettings

describe('IFrame', () => {
	let model
	let moduleData

	const fakeDOMNode = {
		getBoundingClientRect: () => {
			return {
				width: 500
			}
		}
	}

	const createRenderSettings = (isAtMinScale, isShowing, isControlsEnabled, scale) => {
		renderSettingsModule.getRenderSettings = jest.fn()
		renderSettingsModule.getRenderSettings.mockReturnValue({
			zoomValues: 'zoom-values',
			zoom: 1,
			displayedTitle: 'displayed-title',
			iframeStyle: {},
			afterStyle: {},
			isAtMinScale,
			isShowing,
			scaleDimensions: {
				scale,
				containerStyle: {}
			},
			controlsOpts: {
				isControlsEnabled
			}
		})
	}

	beforeEach(() => {
		jest.resetAllMocks()

		renderSettingsModule.getRenderSettings = originalGetRenderSettingsFn

		model = OboModel.create({
			id: 'mock-obo-id',
			type: 'ObojoboDraft.Chunks.IFrame',
			content: {
				src: 'http://www.example.com'
			}
		})

		OboModel.models.navTarget = {}

		moduleData = {
			model: {
				title: 'mocked-module-title'
			},
			navState: {
				itemsById: { navTarget: { id: 'navTarget' } },
				navTargetId: 'navTarget'
			},
			focusState: {},
			mediaState: {
				shown: {},
				zoomById: {}
			}
		}

		ReactDOM.findDOMNode = jest.fn(() => fakeDOMNode)

		window.getComputedStyle = jest.fn(() => {
			return {
				getPropertyValue: () => 20
			}
		})
	})

	afterEach(() => {
		renderSettingsModule.getRenderSettings = originalGetRenderSettingsFn
	})

	test('IFrame component renders', () => {
		let component

		createRenderSettings(true, true, true, 0.5)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(true, true, true, 1)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(true, true, true, 2)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(true, true, false, 0.5)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(true, true, false, 1)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(true, true, false, 2)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(true, false, true, 0.5)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(true, false, true, 1)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(true, false, true, 2)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(true, false, false, 0.5)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(true, false, false, 1)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(true, false, false, 2)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(false, true, true, 0.5)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(false, true, true, 1)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(false, true, true, 2)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(false, true, false, 0.5)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(false, true, false, 1)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(false, true, false, 2)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(false, false, true, 0.5)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(false, false, true, 1)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(false, false, true, 2)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(false, false, false, 0.5)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(false, false, false, 1)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		createRenderSettings(false, false, false, 2)
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()

		model = OboModel.create({
			id: 'mock-obo-id',
			type: 'ObojoboDraft.Chunks.IFrame',
			content: {
				newWindowSrc: 'mocked-new-window-src'
			}
		})
		component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('IFrame sets state when "viewer:contentAreaResized" is fired', () => {
		const component = shallow(<IFrame model={model} moduleData={moduleData} />)

		component.instance().getMeasuredDimensions = jest.fn()
		component.instance().getMeasuredDimensions.mockReturnValueOnce({
			width: 'mock-width',
			padding: 'mock-padding'
		})

		Dispatcher.trigger('viewer:contentAreaResized')

		expect(component.instance().state).toEqual({
			actualWidth: 'mock-width',
			padding: 'mock-padding'
		})
	})

	test('onClickContainer calls MediaUtil.show', () => {
		const component = shallow(<IFrame model={model} moduleData={moduleData} />)

		MediaUtil.show = jest.fn()

		component.instance().onClickContainer()

		expect(MediaUtil.show).toHaveBeenCalledTimes(1)
		expect(MediaUtil.show).toHaveBeenCalledWith('mock-obo-id')
	})

	test('onClickContainer called when container is clicked on (and iframe is not loaded the src is set)', () => {
		const component = mount(<IFrame model={model} moduleData={moduleData} />)
		const spy = jest.spyOn(component.instance(), 'boundOnClickContainer')
		component.instance().forceUpdate()

		component.find('.container').simulate('click')

		expect(spy).toHaveBeenCalledTimes(1)
	})

	test('onClickContainer not called if src is not set', () => {
		model = OboModel.create({
			id: 'mock-obo-id',
			type: 'ObojoboDraft.Chunks.IFrame'
		})

		const component = mount(<IFrame model={model} moduleData={moduleData} />)
		const spy = jest.spyOn(component.instance(), 'boundOnClickContainer')
		component.instance().forceUpdate()

		component.find('.container').simulate('click')

		expect(spy).toHaveBeenCalledTimes(0)
	})

	test('onClickContainer not called if iframe is loaded', () => {
		model = OboModel.create({
			id: 'mock-obo-id',
			type: 'ObojoboDraft.Chunks.IFrame',
			content: {
				src: 'mocked-src',
				autoload: true
			}
		})

		const component = mount(<IFrame model={model} moduleData={moduleData} />)
		const spy = jest.spyOn(component.instance(), 'boundOnClickContainer')
		component.instance().forceUpdate()

		component.find('.container').simulate('click')

		expect(spy).toHaveBeenCalledTimes(0)
	})

	test('onClickZoomReset calls MediaUtil.resetZoom', () => {
		const component = shallow(<IFrame model={model} moduleData={moduleData} />)

		MediaUtil.resetZoom = jest.fn()

		component.instance().onClickZoomReset()

		expect(MediaUtil.resetZoom).toHaveBeenCalledTimes(1)
		expect(MediaUtil.resetZoom).toHaveBeenCalledWith('mock-obo-id')
	})

	test('onClickSetZoom calls MediaUtil.setZoom', () => {
		const component = shallow(<IFrame model={model} moduleData={moduleData} />)

		MediaUtil.setZoom = jest.fn()

		component.instance().onClickSetZoom('mocked-zoom')

		expect(MediaUtil.setZoom).toHaveBeenCalledTimes(1)
		expect(MediaUtil.setZoom).toHaveBeenCalledWith('mock-obo-id', 'mocked-zoom')
	})

	test('onClickReload clears out the src of the iframe then sets it back', () => {
		model = OboModel.create({
			id: 'mock-obo-id',
			type: 'ObojoboDraft.Chunks.IFrame',
			content: {
				src: 'http://www.example.com/',
				autoload: true
			}
		})

		const component = mount(<IFrame model={model} moduleData={moduleData} />)
		const iframeRef = component.ref('iframe')

		expect(iframeRef.src).toEqual('http://www.example.com/')
		iframeRef.src = 'http://www.another-website.com/'
		expect(iframeRef.src).toEqual('http://www.another-website.com/')

		component.instance().onClickReload()

		expect(iframeRef.src).toEqual('http://www.example.com/')
	})

	test('componentDidMount sets state and (if possible) creates a ResizeObserver', () => {
		const nativeResizeObserver = window.ResizeObserver

		const component = mount(<IFrame model={model} moduleData={moduleData} />)

		const fakeConstructor = jest.fn()

		window.ResizeObserver = class FakeResizeObserver {
			constructor() {
				fakeConstructor.apply(this, arguments)
			}
		}
		window.ResizeObserver.prototype.observe = jest.fn()
		window.ResizeObserver.prototype.disconnect = jest.fn()
		Dispatcher.on = jest.fn()

		component.instance().getMeasuredDimensions = jest.fn()
		component.instance().getMeasuredDimensions.mockReturnValueOnce({
			width: 'mock-width',
			padding: 'mock-padding'
		})

		component.instance().componentDidMount()

		expect(component.instance().state).toEqual({
			actualWidth: 'mock-width',
			padding: 'mock-padding'
		})
		expect(fakeConstructor).toHaveBeenCalledTimes(1)
		expect(fakeConstructor).toHaveBeenCalledWith(
			component.instance().boundOnViewerContentAreaResized
		)
		expect(component.instance().resizeObserver).toBeInstanceOf(window.ResizeObserver)
		expect(window.ResizeObserver.prototype.observe).toHaveBeenCalledTimes(1)
		expect(window.ResizeObserver.prototype.observe).toHaveBeenCalledWith(fakeDOMNode)
		expect(window.ResizeObserver.prototype.disconnect).not.toHaveBeenCalled()
		expect(Dispatcher.on).not.toHaveBeenCalled()

		window.ResizeObserver = nativeResizeObserver
	})

	test('componentDidMount sets state and listens to resizeEvent if ResizeObserver not available', () => {
		const component = mount(<IFrame model={model} moduleData={moduleData} />)

		Dispatcher.on = jest.fn()

		component.instance().getMeasuredDimensions = jest.fn()
		component.instance().getMeasuredDimensions.mockReturnValueOnce({
			width: 'mock-width',
			padding: 'mock-padding'
		})

		component.instance().componentDidMount()

		expect(component.instance().state).toEqual({
			actualWidth: 'mock-width',
			padding: 'mock-padding'
		})
		expect(component.instance().resizeObserver).toBe(undefined)
		expect(Dispatcher.on).toHaveBeenCalledTimes(1)
		expect(Dispatcher.on).toHaveBeenCalledWith(
			'viewer:contentAreaResized',
			component.instance().boundOnViewerContentAreaResized
		)
	})

	test('isMediaNeedingToBeHidden returns true if !autoload and isShowingMedia', () => {
		let component

		component = shallow(
			<IFrame
				model={OboModel.create({
					id: 'mock-obo-id',
					type: 'ObojoboDraft.Chunks.IFrame',
					content: {
						src: 'http://www.example.com/',
						autoload: true
					}
				})}
				moduleData={moduleData}
			/>
		)
		MediaUtil.isShowingMedia = jest.fn()
		MediaUtil.isShowingMedia.mockReturnValueOnce(true)
		expect(component.instance().isMediaNeedingToBeHidden()).toBe(false)

		component = shallow(
			<IFrame
				model={OboModel.create({
					id: 'mock-obo-id',
					type: 'ObojoboDraft.Chunks.IFrame',
					content: {
						src: 'http://www.example.com/',
						autoload: false
					}
				})}
				moduleData={moduleData}
			/>
		)
		MediaUtil.isShowingMedia = jest.fn()
		MediaUtil.isShowingMedia.mockReturnValueOnce(true)
		expect(component.instance().isMediaNeedingToBeHidden()).toBe(true)

		component = shallow(
			<IFrame
				model={OboModel.create({
					id: 'mock-obo-id',
					type: 'ObojoboDraft.Chunks.IFrame',
					content: {
						src: 'http://www.example.com/',
						autoload: true
					}
				})}
				moduleData={moduleData}
			/>
		)
		MediaUtil.isShowingMedia = jest.fn()
		MediaUtil.isShowingMedia.mockReturnValueOnce(false)
		expect(component.instance().isMediaNeedingToBeHidden()).toBe(false)

		component = shallow(
			<IFrame
				model={OboModel.create({
					id: 'mock-obo-id',
					type: 'ObojoboDraft.Chunks.IFrame',
					content: {
						src: 'http://www.example.com/',
						autoload: false
					}
				})}
				moduleData={moduleData}
			/>
		)
		MediaUtil.isShowingMedia = jest.fn()
		MediaUtil.isShowingMedia.mockReturnValueOnce(false)
		expect(component.instance().isMediaNeedingToBeHidden()).toBe(false)
	})

	test('componentWillUnmount disconnects any resize observers and hides media if needed', () => {
		const component = shallow(<IFrame model={model} moduleData={moduleData} />)

		const resizeObserverDisconnect = jest.fn()
		Dispatcher.off = jest.fn()
		component.instance().isMediaNeedingToBeHidden = jest.fn()
		component.instance().isMediaNeedingToBeHidden.mockReturnValueOnce(true)
		MediaUtil.hide = jest.fn()
		component.instance().resizeObserver = {
			disconnect: resizeObserverDisconnect
		}

		component.instance().componentWillUnmount()

		expect(resizeObserverDisconnect).toHaveBeenCalledTimes(1)
		expect(Dispatcher.off).toHaveBeenCalledTimes(1)
		expect(Dispatcher.off).toHaveBeenCalledWith(
			'viewer:contentAreaResized',
			component.instance().boundOnViewerContentAreaResized
		)
		expect(MediaUtil.hide).toHaveBeenCalledTimes(1)
		expect(MediaUtil.hide).toHaveBeenCalledWith('mock-obo-id', 'viewerClient')
	})

	test('componentWillUnmount disconnects any resize observers and does not hide media if not needed', () => {
		const component = shallow(<IFrame model={model} moduleData={moduleData} />)

		const resizeObserverDisconnect = jest.fn()
		Dispatcher.off = jest.fn()
		component.instance().isMediaNeedingToBeHidden = jest.fn()
		component.instance().isMediaNeedingToBeHidden.mockReturnValueOnce(false)
		MediaUtil.hide = jest.fn()
		component.instance().resizeObserver = {
			disconnect: resizeObserverDisconnect
		}

		component.instance().componentWillUnmount()

		expect(resizeObserverDisconnect).toHaveBeenCalledTimes(1)
		expect(Dispatcher.off).toHaveBeenCalledTimes(1)
		expect(Dispatcher.off).toHaveBeenCalledWith(
			'viewer:contentAreaResized',
			component.instance().boundOnViewerContentAreaResized
		)
		expect(MediaUtil.hide).not.toHaveBeenCalled()
	})

	test('componentWillUnmount does not disconnect resizeObserver if it does not exist', () => {
		const component = shallow(<IFrame model={model} moduleData={moduleData} />)

		Dispatcher.off = jest.fn()
		component.instance().isMediaNeedingToBeHidden = jest.fn()
		component.instance().isMediaNeedingToBeHidden.mockReturnValueOnce(false)
		MediaUtil.hide = jest.fn()

		component.instance().componentWillUnmount()

		expect(Dispatcher.off).toHaveBeenCalledTimes(1)
		expect(Dispatcher.off).toHaveBeenCalledWith(
			'viewer:contentAreaResized',
			component.instance().boundOnViewerContentAreaResized
		)
		expect(MediaUtil.hide).not.toHaveBeenCalled()
	})

	test('src is prepended with // if no protocol is present', () => {
		let component
		let iframeRef

		model = OboModel.create({
			id: 'mock-obo-id',
			type: 'ObojoboDraft.Chunks.IFrame',
			content: {
				src: 'http://www.example.com/',
				autoload: true
			}
		})
		component = mount(<IFrame model={model} moduleData={moduleData} />)
		iframeRef = component.ref('iframe')
		expect(iframeRef.src).toEqual('http://www.example.com/')

		model = OboModel.create({
			id: 'mock-obo-id',
			type: 'ObojoboDraft.Chunks.IFrame',
			content: {
				src: 'https://www.example.com/',
				autoload: true
			}
		})
		component = mount(<IFrame model={model} moduleData={moduleData} />)
		iframeRef = component.ref('iframe')
		expect(iframeRef.src).toEqual('https://www.example.com/')

		model = OboModel.create({
			id: 'mock-obo-id',
			type: 'ObojoboDraft.Chunks.IFrame',
			content: {
				src: '//www.example.com/',
				autoload: true
			}
		})
		component = mount(<IFrame model={model} moduleData={moduleData} />)
		iframeRef = component.ref('iframe')
		expect(iframeRef.src).toEqual('http://www.example.com/')

		model = OboModel.create({
			id: 'mock-obo-id',
			type: 'ObojoboDraft.Chunks.IFrame',
			content: {
				src: 'www.example.com/',
				autoload: true
			}
		})
		component = mount(<IFrame model={model} moduleData={moduleData} />)
		iframeRef = component.ref('iframe')
		expect(iframeRef.src).toEqual('http://www.example.com/')
	})
})
