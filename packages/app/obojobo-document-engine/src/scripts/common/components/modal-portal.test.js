import React from 'react'
import ReactDOM from 'react-dom'
import ModalPortal from './modal-portal'
import { create, act } from 'react-test-renderer'

// mock external deps
jest.mock('../util/wait-for-element')
jest.mock('./modal-container')

describe('ModalPortal', () => {
	beforeAll(() => {
		// mock createPortal to avoid having to send it a real dom el
		ReactDOM.createPortal = jest.fn().mockReturnValue('mock-portal')

		// mock getElementById to steamline things
		document.getElementById = jest.fn().mockReturnValue('mock-dom-element')
	})

	test('ModalPortal component', async () => {
		await act(async () => {
			create(<ModalPortal>test</ModalPortal>)
		})

		expect(ReactDOM.createPortal).toHaveBeenLastCalledWith('test', 'mock-dom-element')
	})
})
