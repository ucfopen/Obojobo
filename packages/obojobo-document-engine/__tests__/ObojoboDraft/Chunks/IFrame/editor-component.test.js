import React from 'react'
import { shallow, mount } from 'enzyme'
import renderer from 'react-test-renderer'

import IFrame from 'ObojoboDraft/Chunks/IFrame/editor-component'

describe('IFrame Editor Node', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('IFrame component', () => {
		const component = renderer.create(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: '' })
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('IFrame component changes input', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = shallow(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: '' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('input')
			.at(0)
			.simulate('click', {
				stopPropagation: () => true
			})

		component
			.find('input')
			.at(0)
			.simulate('change', {
				target: { value: 'mockTitle' }
			})
		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()
	})

	test('IFrame component changes source', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = shallow(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: '' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('input')
			.at(1)
			.simulate('click', {
				stopPropagation: () => true
			})

		component
			.find('input')
			.at(1)
			.simulate('change', {
				target: { value: 'mockTitle' }
			})
		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()
	})

	test('IFrame component toggles border', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: '' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('input')
			.at(2)
			.simulate('change', {
				target: { checked: false }
			})

		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()
	})

	test('IFrame component changes fit', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: '' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component.find('select').simulate('click', { stopPropagation: jest.fn() })
		component.find('select').simulate('change', { target: { value: 'scroll' } })

		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()
	})

	test('IFrame component changes height', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = shallow(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: '' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('input')
			.at(2)
			.simulate('click', {
				stopPropagation: () => true
			})

		component
			.find('input')
			.at(2)
			.simulate('change', {
				target: { value: 'mockTitle' }
			})
		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()
	})

	test('IFrame component changes width', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = shallow(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: '' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('input')
			.at(3)
			.simulate('click', {
				stopPropagation: () => true
			})

		component
			.find('input')
			.at(3)
			.simulate('change', {
				target: { value: 'mockTitle' }
			})
		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()
	})

	test('IFrame component changes zoom', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = shallow(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: '' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('input')
			.at(4)
			.simulate('click', {
				stopPropagation: () => true
			})

		component
			.find('input')
			.at(4)
			.simulate('change', {
				target: { value: 'mockTitle' }
			})
		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()
	})

	test('IFrame component toggles autoload', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: '' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('input')
			.at(6)
			.simulate('change', {
				target: { checked: false }
			})

		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()
	})

	test('IFrame component toggles reload with no other controls', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: '' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('input')
			.at(7)
			.simulate('change', {
				target: { checked: false }
			})

		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()

		component
			.find('input')
			.at(7)
			.simulate('change', {
				target: { checked: true }
			})

		const tree2 = component.html()

		expect(tree2).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalledTimes(2)
	})

	test('IFrame component toggles reload with other controls', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: 'new-window,zoom' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('input')
			.at(7)
			.simulate('change', {
				target: { checked: false }
			})

		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()

		component
			.find('input')
			.at(7)
			.simulate('change', {
				target: { checked: true }
			})

		const tree2 = component.html()

		expect(tree2).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalledTimes(2)
	})

	test('IFrame component toggles new-window with no other controls', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: '' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('input')
			.at(8)
			.simulate('change', {
				target: { checked: false }
			})

		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()

		component
			.find('input')
			.at(8)
			.simulate('change', {
				target: { checked: true }
			})

		const tree2 = component.html()

		expect(tree2).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalledTimes(2)
	})

	test('IFrame component toggles new-window with other controls', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: 'reload,zoom' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('input')
			.at(8)
			.simulate('change', {
				target: { checked: false }
			})

		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()

		component
			.find('input')
			.at(8)
			.simulate('change', {
				target: { checked: true }
			})

		const tree2 = component.html()

		expect(tree2).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalledTimes(2)
	})

	test('IFrame component toggles zoom with no other controls', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: '' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('input')
			.at(9)
			.simulate('change', {
				target: { checked: false }
			})

		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()

		component
			.find('input')
			.at(9)
			.simulate('change', {
				target: { checked: true }
			})

		const tree2 = component.html()

		expect(tree2).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalledTimes(2)
	})

	test('IFrame component toggles zoom with other controls', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: 'reload,new-window,' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('input')
			.at(9)
			.simulate('change', {
				target: { checked: false }
			})

		const tree = component.html()

		expect(tree).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalled()

		component
			.find('input')
			.at(9)
			.simulate('change', {
				target: { checked: true }
			})

		const tree2 = component.html()

		expect(tree2).toMatchSnapshot()
		expect(change.setNodeByKey).toHaveBeenCalledTimes(2)
	})

	test('IFrame component toggles previewing', () => {
		const change = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<IFrame
				node={{
					data: {
						get: () => ({ controls: '' })
					}
				}}
				isFocused={true}
				isSelected={true}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})
})
