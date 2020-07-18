jest.mock('../../../src/scripts/oboeditor/components/visual-editor')
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
		APIUtil = require('../../../src/scripts/viewer/util/api-util')
		EditorStore = require('../../../src/scripts/oboeditor/stores/editor-store').default
		ModalStore = require('../../../src/scripts/common/stores/modal-store').default
		ModalUtil = require('../../../src/scripts/common/util/modal-util').default
		Common = require('../../../src/scripts/common').default
		EditorApp = require('../../../src/scripts/oboeditor/components/editor-app').default

		defaultModel = {
			modelState: { start: 'mockStart' },
			get: jest.fn(),
			set: jest.fn()
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

		// mock some plugins
		const spyGetItems = jest.spyOn(Common.Registry, 'getItems')
		spyGetItems.mockImplementationOnce(cb => {
			cb([{ plugins: 'mock-plugin' }, { noplugins: 'mock-plugin' }])
		})

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

	test('component should request null draft when draftid not in pathname', () => {
		expect.hasAssertions()

		// mock api calls
		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)
		// update document.location to cause no draftId
		window.history.pushState({}, null, '/pathname?k=v')

		// mount
		const component = mount(<EditorApp {...defaultProps} />)

		// verify
		return global.flushPromises().then(() => {
			component.update()
			expect(APIUtil.getFullDraft).toHaveBeenCalledWith(null, 'json')
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

	test('onEditorStoreChange calls Editor.getState', () => {
		expect.hasAssertions()

		ModalUtil.getCurrentModal.mockReturnValueOnce({
			component: 'mock component'
		})

		APIUtil.getFullDraft.mockResolvedValueOnce(JSON.stringify({ value: testObject }))
		EditorStore.getState.mockReturnValueOnce({}).mockReturnValueOnce({})

		const component = mount(<EditorApp {...defaultProps} />)
		const instance = component.instance()

		return global.flushPromises().then(() => {
			component.update()
			EditorStore.getState.mockClear()
			component.instance().onEditorStoreChange()
			expect(EditorStore.getState).toHaveBeenCalled()
			expect(instance.state).toHaveProperty('requestStatus', null)
			expect(instance.state).toHaveProperty('requestError', null)
			// eslint-disable-next-line no-console
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
		const instance = component.instance()
		console.error = jest.fn() // eslint-disable-line no-console

		return global.flushPromises().then(() => {
			component.update()
			const html = component.html()
			expect(html).toContain('Error')
			expect(html).toContain('Error')
			expect(console.error).toHaveBeenCalled() // eslint-disable-line no-console
			expect(instance.state).toHaveProperty('requestStatus', 'invalid')
			expect(instance.state).toHaveProperty('requestError.type', 'someType')
			expect(instance.state).toHaveProperty('requestError.message', 'someMessage')
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
		const instance = component.instance()

		return global.flushPromises().then(() => {
			component.update()
			expect(component.html()).toMatchSnapshot()
			expect(instance.state).toHaveProperty('requestStatus', null)
			expect(instance.state).toHaveProperty('requestError', null)
			// eslint-disable-next-line no-console
			component.unmount()
		})
	})

	test('EditorApp calls displayLockedModal when module is locked', () => {
		expect.hasAssertions()
		APIUtil.requestEditLock.mockResolvedValue({
			status: 'error',
			value: { message: 'mock-message' }
		})

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)

		const component = mount(<EditorApp {...defaultProps} />)
		const instance = component.instance()
		return global.flushPromises().then(() => {
			component.update()
			// make sure the error is displayed
			expect(component.html()).toContain('Unable to Edit Module')
			expect(component.html()).toContain('mock-message')

			// make sure state has the error message
			expect(instance.state).toHaveProperty('requestStatus', 'invalid')
			expect(instance.state).toHaveProperty('requestError')
			expect(instance.state.requestError).toMatchInlineSnapshot(`
			Object {
			  "message": "mock-message",
			  "title": "Unable to Edit Module",
			}
		`)

			component.unmount()
		})
	})

	test('EditorApp calls displayLockedModal when locking throws an error', () => {
		expect.hasAssertions()
		APIUtil.requestEditLock.mockResolvedValue({ status: 'error' })

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)

		const component = mount(<EditorApp {...defaultProps} />)
		const instance = component.instance()
		return global.flushPromises().then(() => {
			component.update()
			// make sure the error is displayed
			expect(component.html()).toContain('Unable to Edit Module')
			expect(component.html()).toContain('Unable to lock module.')

			// make sure state has the error message
			expect(instance.state).toHaveProperty('requestStatus', 'invalid')
			expect(instance.state).toHaveProperty('requestError')
			expect(instance.state.requestError).toMatchInlineSnapshot(`
			Object {
			  "message": "Unable to lock module.",
			  "title": "Unable to Edit Module",
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

	test('startRenewEditLockInterval skips createEditLock when already locking', () => {
		expect.hasAssertions()
		jest.useFakeTimers()
		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)
		const component = mount(<EditorApp {...defaultProps} />)
		const instance = component.instance()
		// mock reloadDraft just to simplify the test
		jest.spyOn(instance, 'reloadDraft').mockResolvedValueOnce()
		jest.spyOn(instance, 'createEditLock').mockResolvedValueOnce()
		instance._isCreatingRenewableEditLock = true

		return global.flushPromises().then(() => {
			expect(instance.createEditLock).not.toHaveBeenCalled()

			// now turn it off and call the function directy to test that it does get called
			instance._isCreatingRenewableEditLock = false
			instance.startRenewEditLockInterval('test')
			expect(instance.createEditLock).toHaveBeenCalled()
		})
	})

	test('component loads draft revision', () => {
		expect.hasAssertions()
		jest.useFakeTimers()
		APIUtil.getDraftRevision.mockResolvedValueOnce({ value: { json: testObject } })
		EditorStore.getState.mockReturnValueOnce({})

		defaultProps.settings.revisionId = 'mockId'
		const spy = jest.spyOn(EditorApp.prototype, 'loadDraftRevision')
		const component = mount(<EditorApp {...defaultProps} />)

		// eslint-disable-next-line no-undef
		return flushPromises().then(() => {
			component.update()

			expect(spy).toHaveBeenCalled()
			expect(component.state().mode).toEqual('visual')
			expect(component.state().draft).toEqual(testObject)

			component.unmount()
		})
	})

	test('startRenewEditLockInterval displays error when interval is unable to secure lock', () => {
		expect.hasAssertions()
		jest.useFakeTimers()
		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)
		const component = mount(<EditorApp {...defaultProps} />)
		const instance = component.instance()
		// mock reloadDraft just to simplify the test
		jest.spyOn(instance, 'reloadDraft').mockResolvedValueOnce()

		return global.flushPromises().then(() => {
			// now simulate not being able to obtain a lock
			APIUtil.requestEditLock.mockResolvedValueOnce({ status: 'error' })

			// make sure we're not in an error state
			expect(instance.state).toHaveProperty('requestStatus', null)

			//move forward to the next timeout
			jest.advanceTimersByTime(msPerSec * 1 * 0.9)
			expect(APIUtil.requestEditLock).toHaveBeenCalledTimes(2)

			return global.flushPromises().then(() => {
				// make sure state has the error message
				expect(instance.state).toHaveProperty('requestStatus', 'invalid')
				expect(instance.state).toHaveProperty('requestError')
				expect(instance.state.requestError).toMatchInlineSnapshot(`
				Object {
				  "message": "Unable to lock module.",
				  "title": "Unable to Edit Module",
				}
			`)
				component.unmount()
			})
		})
	})

	test('saveDraft updates the models content id', () => {
		expect.hasAssertions()

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)
		APIUtil.postDraft.mockResolvedValueOnce({
			status: 'ok',
			value: {
				id: 'mock-content-id'
			}
		})

		// mount
		const component = mount(<EditorApp {...defaultProps} />)
		const instance = component.instance()
		instance.state.model = defaultModel

		// verify
		return instance.saveDraft('mock-draft-id', 'mock-data-src').then(success => {
			expect(success).toBe(true)
			expect(defaultModel.set).toHaveBeenCalledWith('contentId', 'mock-content-id')
			expect(APIUtil.postDraft).toHaveBeenCalledWith(
				'mock-draft-id',
				'mock-data-src',
				'application/json'
			)
			component.unmount()
		})
	})

	test('saveDraft shows dialog on ', () => {
		expect.hasAssertions()

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)
		APIUtil.postDraft.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'mock-error-message'
			}
		})

		// mount
		const component = mount(<EditorApp {...defaultProps} />)
		const instance = component.instance()
		instance.state.model = defaultModel

		// verify
		return instance.saveDraft('mock-draft-id', 'mock-data-src', 'json').then(success => {
			expect(success).toBe(false)
			expect(defaultModel.set).not.toHaveBeenCalled()
			expect(ModalUtil.show).toHaveBeenCalled()
			component.unmount()
		})
	})

	test('saveDraft sends correct mode to postDraft for xml', () => {
		expect.hasAssertions()

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)
		APIUtil.postDraft.mockResolvedValueOnce({
			status: 'error',
			value: {
				message: 'mock-error-message'
			}
		})

		// mount
		const component = mount(<EditorApp {...defaultProps} />)
		const instance = component.instance()

		// verify
		return instance.saveDraft('mock-draft-id', 'mock-data-src', 'xml').then(() => {
			expect(APIUtil.postDraft).toHaveBeenCalledWith('mock-draft-id', 'mock-data-src', 'text/plain')
			component.unmount()
		})
	})

	test('onWindowClose sends becon', () => {
		expect.hasAssertions()

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)

		// mount
		const component = mount(<EditorApp {...defaultProps} />)
		const instance = component.instance()
		instance.state.draftId = 'mock-draft-id'

		// verify
		instance.onWindowClose()
		expect(APIUtil.deleteLockBeacon).toHaveBeenCalledWith('mock-draft-id')
	})

	test('onWindowInactive sends becon, hides modal and shows expiration modal', () => {
		expect.hasAssertions()

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)

		// mount
		const component = mount(<EditorApp {...defaultProps} />)
		const instance = component.instance()
		instance.state.draftId = 'mock-draft-id'

		// verify
		instance.onWindowInactive()
		expect(APIUtil.deleteLockBeacon).toHaveBeenCalledWith('mock-draft-id')
		expect(ModalUtil.hide).toHaveBeenCalled()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('onWindowInactiveWarning shows a modal', () => {
		expect.hasAssertions()

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)

		// mount
		const component = mount(<EditorApp {...defaultProps} />)
		const instance = component.instance()
		instance.state.draftId = 'mock-draft-id'

		// verify
		instance.onWindowInactiveWarning()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('onWindowReturnFromInactive renews lock interval and hides modals', () => {
		expect.hasAssertions()

		APIUtil.getFullDraft.mockResolvedValueOnce(testObjectString)

		// mount
		const component = mount(<EditorApp {...defaultProps} />)
		const instance = component.instance()
		jest.spyOn(instance, 'startRenewEditLockInterval')
		instance.startRenewEditLockInterval.mockResolvedValueOnce()
		instance.state.draftId = 'mock-draft-id'

		// verify
		return instance.onWindowReturnFromInactive().then(() => {
			expect(instance.startRenewEditLockInterval).toHaveBeenCalledWith('mock-draft-id')
			expect(ModalUtil.hide).toHaveBeenCalled()
		})
	})

	test('EditorApp renders error when loading draft revision', () => {
		expect.assertions(5)
		jest.useFakeTimers()
		APIUtil.getDraftRevision.mockResolvedValueOnce({
			status: 'error',
			value: { type: 'mock-type', message: 'mock-message' }
		})
		EditorStore.getState.mockReturnValueOnce({})
		defaultProps.settings.revisionId = 'mockId'
		console.error = jest.fn() // eslint-disable-line no-console
		const spy = jest.spyOn(EditorApp.prototype, 'loadDraftRevision')
		const component = mount(<EditorApp {...defaultProps} />)

		return global.flushPromises().then(() => {
			component.update()

			expect(spy).toHaveBeenCalled()
			expect(component.state().requestStatus).toEqual('invalid')
			expect(component.state()).toHaveProperty('requestError.message', 'mock-message')
			expect(component.state()).toHaveProperty('requestError.type', 'mock-type')
			expect(component.state().mode).toEqual('visual')

			component.unmount()
		})
	})
})
