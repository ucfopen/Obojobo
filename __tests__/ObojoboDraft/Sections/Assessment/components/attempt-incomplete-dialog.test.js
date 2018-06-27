import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import AttemptIncompleteDialog from '../../../../../ObojoboDraft/Sections/Assessment/components/attempt-incomplete-dialog'
import ModalUtil from '../../../../../src/scripts/common/util/modal-util'

jest.mock('../../../../../src/scripts/common/util/modal-util', () => {
	return {
		hide: jest.fn()
	}
})

describe('AttemptIncompleteDialog', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('AttemptIncompleteDialog component', () => {
		let onSubmit = jest.fn()
		const component = renderer.create(<AttemptIncompleteDialog onSubmit={onSubmit} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('AttemptIncompleteDialog component cancels', () => {
		let onSubmit = jest.fn()
		const component = mount(<AttemptIncompleteDialog onSubmit={onSubmit} />)

		expect(ModalUtil.hide).not.toHaveBeenCalled()
		expect(onSubmit).not.toHaveBeenCalled()

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(ModalUtil.hide).toHaveBeenCalled()
		expect(onSubmit).not.toHaveBeenCalled()
	})

	test('AttemptIncompleteDialog component submits', () => {
		let onSubmit = jest.fn()
		const component = mount(<AttemptIncompleteDialog onSubmit={onSubmit} />)

		expect(ModalUtil.hide).not.toHaveBeenCalled()
		expect(onSubmit).not.toHaveBeenCalled()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(ModalUtil.hide).toHaveBeenCalled()
		expect(onSubmit).toHaveBeenCalled()
	})
})
