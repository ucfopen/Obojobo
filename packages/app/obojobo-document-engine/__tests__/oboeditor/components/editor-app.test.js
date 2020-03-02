import React from 'react'
import { mount } from 'enzyme'

import EditorApp from 'src/scripts/oboeditor/components/editor-app'

jest.mock('src/scripts/oboeditor/components/page-editor')
jest.mock('src/scripts/oboeditor/components/code-editor')

import APIUtil from 'src/scripts/viewer/util/api-util'
jest.mock('src/scripts/viewer/util/api-util')
import EditorStore from 'src/scripts/oboeditor/stores/editor-store'
jest.mock('src/scripts/oboeditor/stores/editor-store')
import ModalStore from 'src/scripts/common/stores/modal-store'
jest.mock('src/scripts/common/stores/modal-store')
import ModalUtil from 'src/scripts/common/util/modal-util'
jest.mock('src/scripts/common/util/modal-util')
import Common from 'src/scripts/common'
import testObject from 'test-object.json'
import mockConsole from 'jest-mock-console'
let restoreConsole

const CLASSIC_MODE = 'classic'
const XML_MODE = 'xml'

describe('EditorApp', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		jest.restoreAllMocks()
		restoreConsole = mockConsole('error')
		APIUtil.requestEditLock.mockResolvedValue({ status: 'ok' })
	})

	afterEach(() => {
		restoreConsole()
		jest.clearAllTimers()
	})

	test('component renders', () => {
		expect.hasAssertions()

		const spyGetItems = jest.spyOn(Common.Registry, 'getItems')
		spyGetItems.mockImplementationOnce(cb => {
			cb([{ plugins: 'mock-plugin' }, { noplugins: 'mock-plugin' }])
		})

		const spyModelCreate = jest.spyOn(Common.models.OboModel, 'create')
		spyModelCreate.mockReturnValueOnce({
			modelState: { start: 'mockStart' }
		})

		APIUtil.getFullDraft.mockResolvedValueOnce(JSON.stringify({ value: testObject }))
		EditorStore.getState.mockReturnValueOnce({})

		const component = mount(<EditorApp />)
		return global.flushPromises().then(() => {
			component.update()

			expect(component.html()).toMatchSnapshot()

			component.unmount()
		})
	})

	test('EditorApp component displays xml in xml mode', () => {
		expect.hasAssertions()

		jest.spyOn(Common.models.OboModel, 'create')
		Common.models.OboModel.create.mockReturnValueOnce({
			modelState: { start: 'mockStart' }
		})

		APIUtil.getFullDraft
			.mockResolvedValueOnce(JSON.stringify({ value: testObject }))
			.mockResolvedValueOnce(
				'<?xml version="1.0" encoding="utf-8"?><ObojoboDraftDoc></ObojoboDraftDoc>'
			)
		EditorStore.getState.mockReturnValueOnce({})

		const component = mount(<EditorApp />)
		component.instance().switchMode(XML_MODE)

		return global.flushPromises().then(() => {
			component.update()
			expect(component.html()).toMatchSnapshot()
			component.unmount()
		})
	})

	test('EditorApp component displays xml', () => {
		expect.hasAssertions()

		jest.spyOn(Common.models.OboModel, 'create')
		Common.models.OboModel.create.mockReturnValueOnce({
			modelState: { start: 'mockStart' }
		})

		APIUtil.getFullDraft
			.mockResolvedValueOnce(JSON.stringify({ value: testObject }))
			.mockResolvedValueOnce(
				'<?xml version="1.0" encoding="utf-8"?><ObojoboDraftDoc></ObojoboDraftDoc>'
			)
		EditorStore.getState.mockReturnValueOnce({})

		const component = mount(<EditorApp />)
		component.instance().switchMode(XML_MODE)

		return global.flushPromises().then(() => {
			component.update()
			expect(component.html()).toMatchSnapshot()
			component.unmount()
		})
	})

	test('EditorApp component with no draft', () => {
		expect.hasAssertions()

		// No visit or draft id
		jest.spyOn(String.prototype, 'split').mockReturnValueOnce([])

		jest.spyOn(Common.models.OboModel, 'create')
		Common.models.OboModel.create.mockReturnValueOnce({
			modelState: { start: 'mockStart' }
		})

		APIUtil.getFullDraft.mockResolvedValueOnce(JSON.stringify({ value: testObject }))
		EditorStore.getState.mockReturnValueOnce({})

		const component = mount(<EditorApp />)
		return global.flushPromises().then(() => {
			component.update()

			expect(component.html()).toMatchSnapshot()

			component.unmount()
		})
	})

	test('EditorApp component with classic mode in url', () => {
		expect.hasAssertions()

		// No visit or draft id
		jest.spyOn(String.prototype, 'split').mockReturnValueOnce(['', '', CLASSIC_MODE])

		jest.spyOn(Common.models.OboModel, 'create')
		Common.models.OboModel.create.mockReturnValueOnce({
			modelState: { start: 'mockStart' }
		})

		APIUtil.getFullDraft.mockResolvedValueOnce(JSON.stringify({ value: testObject }))
		EditorStore.getState.mockReturnValueOnce({})

		const component = mount(<EditorApp />)
		return global.flushPromises().then(() => {
			component.update()
			expect(component.html()).toContain('visual-editor--editor-app')
			expect(component.html()).toMatchSnapshot()

			component.unmount()
		})
	})

	test('onEditorStoreChange calls Editor.getState', () => {
		expect.hasAssertions()

		jest.spyOn(Common.models.OboModel, 'create')
		Common.models.OboModel.create.mockReturnValueOnce({
			modelState: { start: 'mockStart' }
		})

		APIUtil.getFullDraft.mockResolvedValueOnce(JSON.stringify({ value: testObject }))
		EditorStore.getState.mockReturnValueOnce({}).mockReturnValueOnce({})

		const component = mount(<EditorApp />)
		return global.flushPromises().then(() => {
			component.update()

			component.instance().onEditorStoreChange()
			expect(EditorStore.getState).toHaveBeenCalled()

			component.unmount()
		})
	})

	test('onModalStoreChange calls ModalStore.getState', () => {
		expect.hasAssertions()

		jest.spyOn(Common.models.OboModel, 'create')
		Common.models.OboModel.create.mockReturnValueOnce({
			modelState: { start: 'mockStart' }
		})

		APIUtil.getFullDraft.mockResolvedValueOnce(JSON.stringify({ value: testObject }))
		EditorStore.getState.mockReturnValueOnce({}).mockReturnValueOnce({})
		ModalStore.getState.mockReturnValueOnce({}).mockReturnValueOnce({})

		const component = mount(<EditorApp />)
		return global.flushPromises().then(() => {
			component.update()

			component.instance().onModalStoreChange()
			expect(ModalStore.getState).toHaveBeenCalled()

			component.unmount()
		})
	})

	test('EditorApp component renders error messsage', () => {
		expect.hasAssertions()

		jest.spyOn(Common.models.OboModel, 'create')
		Common.models.OboModel.create.mockReturnValueOnce({
			modelState: { start: 'mockStart' }
		})

		const mockError = { type: 'someType', message: 'someMessage' }
		APIUtil.getFullDraft.mockResolvedValueOnce(
			JSON.stringify({
				status: 'error',
				value: mockError
			})
		)

		const component = mount(<EditorApp />)

		// eslint-disable-next-line no-undef
		return global.flushPromises().then(() => {
			component.update()
			expect(component.html()).toMatchSnapshot()
			// eslint-disable-next-line no-console
			expect(console.error).toHaveBeenCalledWith(mockError)
			component.unmount()
		})
	})

	test('EditorApp component renders modal', () => {
		expect.hasAssertions()

		jest.spyOn(Common.models.OboModel, 'create')
		Common.models.OboModel.create.mockReturnValueOnce({
			modelState: { start: 'mockStart' }
		})

		APIUtil.getFullDraft.mockResolvedValueOnce(JSON.stringify({ value: testObject }))
		EditorStore.getState.mockReturnValueOnce({})

		ModalUtil.getCurrentModal.mockReturnValueOnce({
			component: 'mock component'
		})

		const component = mount(<EditorApp />)

		// eslint-disable-next-line no-undef
		return global.flushPromises().then(() => {
			component.update()
			expect(component.html()).toMatchSnapshot()
			// eslint-disable-next-line no-console
			expect(console.error).not.toHaveBeenCalled()
			component.unmount()
		})
	})

	test('EditorApp calls displayLockedModal when module is locked', () => {
		expect.hasAssertions()
		APIUtil.requestEditLock.mockResolvedValue({ status: 'error' })

		const spyGetItems = jest.spyOn(Common.Registry, 'getItems')
		spyGetItems.mockImplementationOnce(cb => {
			cb([{ plugins: 'mock-plugin' }, { noplugins: 'mock-plugin' }])
		})

		const spyModelCreate = jest.spyOn(Common.models.OboModel, 'create')
		spyModelCreate.mockReturnValueOnce({
			modelState: { start: 'mockStart' }
		})

		APIUtil.getFullDraft.mockResolvedValueOnce(JSON.stringify({ value: testObject }))
		EditorStore.getState.mockReturnValueOnce({})

		const component = mount(<EditorApp />)
		return global.flushPromises().then(() => {
			component.update()
			// make sure the error is displayed
			expect(component.html()).toContain('Module is Being Edited')

			// make sure state has the error message
			expect(component.instance().state).toHaveProperty('requestStatus', 'invalid')
			expect(component.instance().state).toHaveProperty('requestError')
			expect(component.instance().state.requestError).toMatchInlineSnapshot(`
			Object {
			  "message": "Someone else is currently editing this module, please try again later.",
			  "title": "Module is Being Edited.",
			}
		`)

			component.unmount()
		})
	})

	test.only('startRenewEditLockInterval is called when ', () => {
		expect.hasAssertions()

		const component = mount(<EditorApp />)
		const instance = component.instance()
		const renewInterval = jest.spyOn(instance, 'startRenewEditLockInterval')
		// mock reloadDraft just to simplify the test
		jest.spyOn(instance, 'reloadDraft').mockResolvedValueOnce()

		return global.flushPromises().then(() => {
			// make sure the error is displayed
			expect(renewInterval).toHaveBeenCalledTimes(1)
			component.unmount()
		})
	})

	test('startRenewEditLockInterval calls requestEditLock', () => {
		expect.hasAssertions()
		jest.useFakeTimers()
		const component = mount(<EditorApp />)
		// mock reloadDraft just to simplify the test
		jest.spyOn(component.instance(), 'reloadDraft').mockResolvedValueOnce()

		return global.flushPromises().then(() => {
			// move forward to just before the timeout
			jest.advanceTimersByTime(60000 * 4)
			expect(APIUtil.requestEditLock).toHaveBeenCalledTimes(1)

			// move past the timeout
			jest.advanceTimersByTime(60000 * 1)

			// make sure requestEditLock is called at 5 minutes
			expect(APIUtil.requestEditLock).toHaveBeenCalledTimes(2)

			// check again in another 5 minutes
			jest.advanceTimersByTime(60000 * 5)
			expect(APIUtil.requestEditLock).toHaveBeenCalledTimes(3)
			component.unmount()
		})
	})

	test('startRenewEditLockInterval displays error when unable to secure lock', () => {
		expect.hasAssertions()
		jest.useFakeTimers()
		const component = mount(<EditorApp />)
		// mock reloadDraft just to simplify the test
		jest.spyOn(component.instance(), 'reloadDraft').mockResolvedValueOnce()

		return global.flushPromises().then(() => {
			// now simulate not being able to obtain a lock
			APIUtil.requestEditLock.mockResolvedValueOnce({ status: 'error' })

			// make sure we're not in an error state
			expect(component.instance().state).toHaveProperty('requestStatus', null)

			// move forward to just before the timeout
			jest.advanceTimersByTime(60000 * 5)
			expect(APIUtil.requestEditLock).toHaveBeenCalledTimes(2)

			return global.flushPromises().then(() => {
				// make sure state has the error message
				expect(component.instance().state).toHaveProperty('requestStatus', 'invalid')
				expect(component.instance().state).toHaveProperty('requestError')
				expect(component.instance().state.requestError).toMatchInlineSnapshot(`
				Object {
				  "message": "Someone else is currently editing this module, please try again later.",
				  "title": "Module is Being Edited.",
				}
			`)
				component.unmount()
			})
		})
	})
})
