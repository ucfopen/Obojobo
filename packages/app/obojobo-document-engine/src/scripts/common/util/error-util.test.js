import React from 'react'

import ErrorUtil from './error-util'
import Dispatcher from '../flux/dispatcher'
import ErrorDialog from '../components/modal/error-dialog'

jest.mock('../flux/dispatcher', () => {
	return {
		trigger: jest.fn(),
		on: jest.fn(),
		off: jest.fn()
	}
})
// jest.mock('../components/modal/error-dialog')

describe('ErrorUtil', () => {
	test('show will show a modal error dialog', () => {
		ErrorUtil.show('The Title', 'The Error Message')

		expect(Dispatcher.trigger).toHaveBeenCalledWith('modal:show', {
			value: {
				component: <ErrorDialog title="The Title">The Error Message</ErrorDialog>
			}
		})
	})

	test('errorResponse will show a modal dialog with expected error responses', () => {
		ErrorUtil.errorResponse({
			value: { type: 'input', message: 'The Message' }
		})

		expect(Dispatcher.trigger).toHaveBeenCalledWith('modal:show', {
			value: {
				component: <ErrorDialog title="Bad Input">The Message</ErrorDialog>
			}
		})

		ErrorUtil.errorResponse({
			value: { type: 'unexpected', message: 'The Message' }
		})

		expect(Dispatcher.trigger).toHaveBeenCalledWith('modal:show', {
			value: {
				component: <ErrorDialog title="Unexpected Error">The Message</ErrorDialog>
			}
		})

		ErrorUtil.errorResponse({
			value: { type: 'reject', message: 'The Message' }
		})

		expect(Dispatcher.trigger).toHaveBeenCalledWith('modal:show', {
			value: {
				component: <ErrorDialog title="Rejected">The Message</ErrorDialog>
			}
		})
	})
})
