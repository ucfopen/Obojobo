import React from 'react'
import { mount } from 'enzyme'

import AddActionModal from './new-action-modal'

describe('ActionButton Properties Modal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('AddActionModal component', () => {
		const component = mount(<AddActionModal />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('AddActionModal component checks the value before confirming', () => {
		const onConfirm = jest.fn()

		const component = mount(<AddActionModal onConfirm={onConfirm} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
	})

	test('AddActionModal component changes the value and confirms', () => {
		const onConfirm = jest.fn()

		const component = mount(<AddActionModal onConfirm={onConfirm} />)

		component
			.find('textarea')
			.at(0)
			.simulate('change', { target: { value: '{"id":"mockId"}' } })

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('AddActionModal component changes the type to nav:prev', () => {
		const onConfirm = jest.fn()

		const component = mount(<AddActionModal onConfirm={onConfirm} />)

		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'nav:prev' } })

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('AddActionModal component changes the type to nav:openExternalLink and fails to verify', () => {
		const onConfirm = jest.fn()

		const component = mount(<AddActionModal onConfirm={onConfirm} />)

		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'nav:openExternalLink' } })

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
	})

	test('AddActionModal component changes the type to nav:openExternalLink and verifys', () => {
		const onConfirm = jest.fn()

		const component = mount(<AddActionModal onConfirm={onConfirm} />)

		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'nav:openExternalLink' } })

		component
			.find('textarea')
			.at(0)
			.simulate('change', { target: { value: '{"url":"mockURL"}' } })

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('AddActionModal component changes the type to assessment:startAttempt and fails to verify', () => {
		const onConfirm = jest.fn()

		const component = mount(<AddActionModal onConfirm={onConfirm} />)

		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'assessment:startAttempt' } })

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
	})

	test('AddActionModal component changes the type to assessment:startAttempt and verifys', () => {
		const onConfirm = jest.fn()

		const component = mount(<AddActionModal onConfirm={onConfirm} />)

		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'assessment:startAttempt' } })

		component
			.find('textarea')
			.at(0)
			.simulate('change', { target: { value: '{"id":"mockID"}' } })

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('AddActionModal component changes the type to assessment:endAttempt and fails to verify', () => {
		const onConfirm = jest.fn()

		const component = mount(<AddActionModal onConfirm={onConfirm} />)

		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'assessment:endAttempt' } })

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
	})

	test('AddActionModal component changes the type to assessment:endAttempt and verifys', () => {
		const onConfirm = jest.fn()

		const component = mount(<AddActionModal onConfirm={onConfirm} />)

		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'assessment:endAttempt' } })

		component
			.find('textarea')
			.at(0)
			.simulate('change', { target: { value: '{"id":"mockID"}' } })

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('AddActionModal component changes the type to viewer:alert and fails to verify', () => {
		const onConfirm = jest.fn()

		const component = mount(<AddActionModal onConfirm={onConfirm} />)

		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'viewer:alert' } })

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
	})

	test('AddActionModal component changes the type to viewer:alert and verifys', () => {
		const onConfirm = jest.fn()

		const component = mount(<AddActionModal onConfirm={onConfirm} />)

		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'viewer:alert' } })

		component
			.find('textarea')
			.at(0)
			.simulate('change', { target: { value: '{"title":"mockTitle", "message":"mockMessage"}' } })

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('AddActionModal component focuses on first element', () => {
		const component = mount(<AddActionModal content={{}} />)

		component.instance().focusOnFirstElement()

		expect(component.html()).toMatchSnapshot()
	})
})
