jest.mock('../../../src/scripts/oboeditor/components/page-editor')
jest.mock('../../../src/scripts/oboeditor/components/code-editor')
jest.mock('../../../src/scripts/viewer/util/api-util')
jest.mock('../../../src/scripts/oboeditor/stores/editor-store')
jest.mock('../../../src/scripts/common/stores/modal-store')
jest.mock('../../../src/scripts/common/util/modal-util')
jest.mock('../../../src/scripts/common/models/obo-model')
jest.mock('../../../src/scripts/oboeditor/util/editor-util')

import React from 'react'
import { mount } from 'enzyme'

describe('EditorApp', () => {
	const XML_MODE = 'xml'
	const testObject = require('test-object.json')
	const testObjectString = JSON.stringify({ value: testObject })
	const msPerSec = 60000
	const ogConsoleError = console.error // eslint-disable-line no-console

	let defaultProps
	let APIUtil
	let EditorStore
	let ModalStore
	let ModalUtil
	let EditorUtil
	let Common
	let EditorApp
	let defaultModel
	let defaultEditorState

	beforeEach(() => {
		jest.resetAllMocks()
		jest.resetModules()

		EditorUtil = require('../../../src/scripts/oboeditor/util/editor-util').default
		APIUtil = require('../../../src/scripts/viewer/util/api-util').default
		EditorStore = require('../../../src/scripts/oboeditor/stores/editor-store').default
		ModalStore = require('../../../src/scripts/common/stores/modal-store').default
		ModalUtil = require('../../../src/scripts/common/util/modal-util').default
		Common = require('../../../src/scripts/common').default
		EditorApp = require('../../../src/scripts/oboeditor/components/editor-app').default

		defaultModel = {
			modelState: { start: 'mockStart' },
			get: jest.fn()
		}

		defaultProps = {
			settings: {
				editLocks: {
					autoExpireMinutes: 1,
					warnMinutes: 2,
					idleMinutes: 3
				}
			}
		}

		defaultEditorState = {
			currentPageModel: {},
			context: {}
		}

		APIUtil.requestEditLock.mockResolvedValue({ status: 'ok' })
		Common.models.OboModel.create.mockReturnValue(defaultModel)
		EditorStore.getState.mockReturnValue(defaultEditorState)
		ModalStore.getState.mockReturnValue({})
		EditorUtil.getTitleFromString.mockReturnValue('mock-title-from-string')
	})

	afterEach(() => {
		jest.clearAllTimers()
		jest.clearAllMocks()
		console.error = ogConsoleError // eslint-disable-line no-console
	})

	test('component renders', () => {
		expect.hasAssertions()

		// mock api calls
		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)

		// mount
		const component = mount(<EditorApp {...defaultProps} />)

		// verify
		return global.flushPromises().then(() => {
			component.update()

			expect(component.html()).toMatchSnapshot()

			component.unmount()
		})
	})

	test('EditorApp component displays xml in xml mode', () => {
		expect.hasAssertions()

		const mockXMLDraft = '<?xml version="1.0" encoding="utf-8"?><ObojoboDraftDoc></ObojoboDraftDoc>'

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString).mockResolvedValueOnce(mockXMLDraft)

		const component = mount(<EditorApp {...defaultProps} />)
		component.instance().switchMode(XML_MODE)

		return global.flushPromises().then(() => {
			component.update()
			expect(component.html()).toMatchSnapshot()
			component.unmount()
		})
	})


	test('onEditorStoreChange calls Editor.getState', () => {
		expect.hasAssertions()

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)

		const component = mount(<EditorApp {...defaultProps} />)
		return global.flushPromises().then(() => {
			component.update()

			component.instance().onEditorStoreChange()
			expect(EditorStore.getState).toHaveBeenCalled()

			component.unmount()
		})
	})

	test('onModalStoreChange calls ModalStore.getState', () => {
		expect.hasAssertions()

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)

		const component = mount(<EditorApp {...defaultProps} />)
		return global.flushPromises().then(() => {
			component.update()

			component.instance().onModalStoreChange()
			expect(ModalStore.getState).toHaveBeenCalled()

			component.unmount()
		})
	})

	test('EditorApp component renders error messsage', () => {
		expect.hasAssertions()

		const mockError = { type: 'someType', message: 'someMessage' }
		APIUtil.getFullDraft.mockResolvedValueOnce(
			JSON.stringify({
				status: 'error',
				value: mockError
			})
		)

		const component = mount(<EditorApp {...defaultProps} />)
		console.error = jest.fn() // eslint-disable-line no-console

		return global.flushPromises().then(() => {
			component.update()
			expect(component.html()).toMatchSnapshot()
			expect(console.error).toHaveBeenCalled() // eslint-disable-line no-console
			expect(component.instance().state).toHaveProperty('requestStatus', 'invalid')
			expect(component.instance().state).toHaveProperty('requestError', mockError)
			component.unmount()
		})
	})

	test('EditorApp component renders modal', () => {
		expect.hasAssertions()

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)

		ModalUtil.getCurrentModal.mockReturnValueOnce({
			component: 'mock component'
		})

		const component = mount(<EditorApp {...defaultProps} />)

		return global.flushPromises().then(() => {
			component.update()
			expect(component.html()).toMatchSnapshot()
			expect(component.instance().state).toHaveProperty('requestStatus', null)
			expect(component.instance().state).toHaveProperty('requestError', null)
			// eslint-disable-next-line no-console
			component.unmount()
		})
	})

	test('EditorApp calls displayLockedModal when module is locked', () => {
		expect.hasAssertions()
		APIUtil.requestEditLock.mockResolvedValue({ status: 'error' })

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)

		const component = mount(<EditorApp {...defaultProps} />)
		return global.flushPromises().then(() => {
			component.update()
			// make sure the error is displayed
			expect(component.html()).toContain('Module is Being Edited')

			// make sure state has the error message
			expect(component.instance().state).toHaveProperty('requestStatus', 'invalid')
			expect(component.instance().state).toHaveProperty('requestError')
			expect(component.instance().state.requestError).toMatchInlineSnapshot(`
			Object {
			  "message": "Someone else is currently editing this module. Try reloading this tab in a few minutes (1 or more).",
			  "title": "Module is Being Edited.",
			}
		`)

			component.unmount()
		})
	})

	test('startRenewEditLockInterval is called when on mount', () => {
		expect.hasAssertions()

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)

		const component = mount(<EditorApp {...defaultProps} />)
		const instance = component.instance()

		// we can spy on this method because the promise hasn't resolved yet
		const startRenewEditLockInterval = jest.spyOn(instance, 'startRenewEditLockInterval')
		startRenewEditLockInterval.mockReturnValueOnce()
		jest.spyOn(instance, 'reloadDraft').mockResolvedValueOnce()

		return global.flushPromises().then(() => {
			expect(startRenewEditLockInterval).toHaveBeenCalledTimes(1)
			component.unmount()
		})
	})

	test('startRenewEditLockInterval calls requestEditLock', () => {
		expect.hasAssertions()
		jest.useFakeTimers()
		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)
		const component = mount(<EditorApp {...defaultProps} />)
		// mock reloadDraft just to simplify the test
		jest.spyOn(component.instance(), 'reloadDraft').mockResolvedValueOnce()

		return global.flushPromises().then(() => {
			expect(APIUtil.requestEditLock).toHaveBeenCalledTimes(1)

			// move forward to just before the timeout
			jest.advanceTimersByTime(msPerSec * 1 * 0.89)
			expect(APIUtil.requestEditLock).toHaveBeenCalledTimes(1)

			// move forward to the timeout
			jest.advanceTimersByTime(msPerSec * 1 * 0.01)
			expect(APIUtil.requestEditLock).toHaveBeenCalledTimes(2)

			// move forward to the next timeout
			jest.advanceTimersByTime(msPerSec * 1 * 0.9)
			expect(APIUtil.requestEditLock).toHaveBeenCalledTimes(3)

			component.unmount()
		})
	})

	test('startRenewEditLockInterval displays error when unable to secure lock', () => {
		expect.hasAssertions()
		jest.useFakeTimers()
		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)
		const component = mount(<EditorApp {...defaultProps} />)
		// mock reloadDraft just to simplify the test
		jest.spyOn(component.instance(), 'reloadDraft').mockResolvedValueOnce()

		return global.flushPromises().then(() => {
			// now simulate not being able to obtain a lock
			APIUtil.requestEditLock.mockResolvedValueOnce({ status: 'error' })

			// make sure we're not in an error state
			expect(component.instance().state).toHaveProperty('requestStatus', null)

			//move forward to the next timeout
			jest.advanceTimersByTime(msPerSec * 1 * 0.9)
			expect(APIUtil.requestEditLock).toHaveBeenCalledTimes(2)

			return global.flushPromises().then(() => {
				// make sure state has the error message
				expect(component.instance().state).toHaveProperty('requestStatus', 'invalid')
				expect(component.instance().state).toHaveProperty('requestError')
				expect(component.instance().state.requestError).toMatchInlineSnapshot(`
				Object {
				  "message": "Someone else is currently editing this module. Try reloading this tab in a few minutes (1 or more).",
				  "title": "Module is Being Edited.",
				}
			`)
				component.unmount()
			})
		})
	})
})
