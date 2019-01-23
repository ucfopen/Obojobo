import React from 'react'

import ErrorUtil from '../../../src/scripts/common/util/error-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import ErrorDialog from '../../../src/scripts/common/components/modal/error-dialog'

jest.mock('../../../src/scripts/common/flux/dispatcher', () => {
	return {
		trigger: jest.fn(),
		on: jest.fn(),
		off: jest.fn()
	}
})
// jest.mock('../../../src/scripts/common/components/modal/error-dialog')

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
		ErrorUtil.errorResponse({ value: { type: 'input', message: 'The Message' } })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('modal:show', {
			value: {
				component: <ErrorDialog title="Bad Input">The Message</ErrorDialog>
			}
		})

		ErrorUtil.errorResponse({ value: { type: 'unexpected', message: 'The Message' } })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('modal:show', {
			value: {
				component: <ErrorDialog title="Unexpected Error">The Message</ErrorDialog>
			}
		})

		ErrorUtil.errorResponse({ value: { type: 'reject', message: 'The Message' } })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('modal:show', {
			value: {
				component: <ErrorDialog title="Rejected">The Message</ErrorDialog>
			}
		})
	})
})
