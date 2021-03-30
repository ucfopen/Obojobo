import React from 'react'
import ReactDOM from 'react-dom'
import ModalPortal from '../../../src/scripts/common/components/modal-portal'
import { create, act } from 'react-test-renderer'

// mock external deps
jest.mock('../../../src/scripts/common/util/wait-for-element')
jest.mock('../../../src/scripts/common/components/modal-container')

describe('ModalPortal', () => {
	beforeAll(() => {
		// mock createPortal to avoid having to send it a real dom el
		ReactDOM.createPortal = jest.fn().mockReturnValue('mock-portal')

		// mock getElementById to steamline things
		document.getElementById = jest.fn().mockReturnValue('mock-dom-element')
	})

	test('ModalPortal component', async () => {
		await act( async () => {
			create(<ModalPortal>test</ModalPortal>)
		})

		expect(ReactDOM.createPortal).toHaveBeenLastCalledWith('test', 'mock-dom-element')
	})
})
