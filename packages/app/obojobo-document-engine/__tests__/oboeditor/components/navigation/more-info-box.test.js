import React from 'react'
import { mount } from 'enzyme'

import MoreInfoBox from 'src/scripts/oboeditor/components/navigation/more-info-box'

import ClipboardUtil from 'src/scripts/oboeditor/util/clipboard-util'
jest.mock('src/scripts/oboeditor/util/clipboard-util')
import ModalUtil from 'src/scripts/common/util/modal-util'
jest.mock('src/scripts/common/util/modal-util')

describe('MoreInfoBox', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		jest.restoreAllMocks()
		jest.useFakeTimers()
	})

	test('More Info Box renders properly', () => {
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={jest.fn()}
				saveContent={jest.fn()}
				markUnsaved={jest.fn()}
				contentDescription={[]}
			/>
		)
		expect(component.html()).toMatchSnapshot()
	})

	test('More Info Box for assessment', () => {
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={jest.fn()}
				saveContent={jest.fn()}
				markUnsaved={jest.fn()}
				contentDescription={[]}
				isAssessment
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	test('More Info Box opens and closes', () => {
		const saveId = jest.fn()
		const saveContent = jest.fn()
		const markUnsaved = jest.fn()
		const onOpen = jest.fn()
		const onBlur = jest.fn()
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={saveId}
				saveContent={saveContent}
				markUnsaved={markUnsaved}
				contentDescription={[]}
				onOpen={onOpen}
				onBlur={onBlur}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(onOpen).toHaveBeenCalled()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(saveId).not.toHaveBeenCalled()
		expect(saveContent).not.toHaveBeenCalled()
		expect(markUnsaved).not.toHaveBeenCalled()
		expect(onBlur).toHaveBeenCalled()

		component.unmount()
	})

	test('More Info Box with triggers', () => {
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{
					triggers: [
						{
							type: 'mockTrigger'
						},
						{
							type: 'mockSecondTrigger'
						}
					]
				}}
				saveId={jest.fn()}
				saveContent={jest.fn()}
				markUnsaved={jest.fn()}
				contentDescription={[]}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	test('More Info Box with contentDescriptions', () => {
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{
					mockInput: 'value1',
					mockSelect: 'value2',
					mockToggle: false
				}}
				saveId={jest.fn()}
				saveContent={jest.fn()}
				markUnsaved={jest.fn()}
				contentDescription={[
					{
						type: 'input',
						description: 'Mock Input',
						name: 'mockInput'
					},
					{
						type: 'select',
						description: 'Mock Select',
						name: 'mockSelect',
						values: [
							{
								value: 'value1',
								description: 'Value One'
							},
							{
								value: 'value2',
								description: 'Value Two'
							}
						]
					},
					{
						type: 'toggle',
						description: 'Mock Toggle',
						name: 'mockToggle'
					},
					{
						type: 'abstract-toggle',
						description: 'Mock Abstract Toggle',
						name: 'mockAbstractToggle',
						value: () => false,
						onChange: () => true
					}
				]}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	test('More Info Box edits values', () => {
		jest.spyOn(React, 'createRef').mockReturnValue({
			current: {
				select: jest.fn()
			}
		})
		// mocks extracting custom content prop for value
		const abstractValue = jest.fn().mockImplementation(contentState => contentState.abstractValue)
		// mocks using checked to change custom content prop
		const abstractOnChangeFn = jest.fn().mockImplementation((prevContentState, checked) => ({
			...prevContentState,
			abstractValue: checked
		}))

		const saveId = jest.fn()
		const saveContent = jest.fn()
		const markUnsaved = jest.fn()
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{
					mockInput: 'mockInputValue1',
					mockSelect: 'mockSelectValue2',
					mockToggle: false,
					abstractValue: false
				}}
				saveId={saveId}
				saveContent={saveContent}
				markUnsaved={markUnsaved}
				contentDescription={[
					{
						type: 'input',
						description: 'Mock Input',
						name: 'mockInput'
					},
					{
						type: 'select',
						description: 'Mock Select',
						name: 'mockSelect',
						values: [
							{
								value: 'mockSelectValue1',
								description: 'Value One'
							},
							{
								value: 'mockSelectValue2',
								description: 'Value Two'
							}
						]
					},
					{
						type: 'toggle',
						description: 'Mock Toggle',
						name: 'mockToggle'
					},
					{
						type: 'abstract-toggle',
						description: 'Mock Abstract Toggle',
						name: 'mockAbstractToggle',
						value: abstractValue,
						onChange: abstractOnChangeFn
					}
				]}
			/>
		)

		// click to open
		expect(component.state()).toHaveProperty('isOpen', false)
		component
			.find('button')
			.at(0)
			.simulate('click')
		expect(component.state()).toHaveProperty('isOpen', true)

		// Change the current id
		expect(component.state()).toHaveProperty('currentId', 'mock-id')
		const idInputBox = component.find({ id: 'oboeditor--components--more-info-box--id-input' })
		idInputBox.simulate('change', {
			target: { value: 'new-mock-id' }
		})
		idInputBox.simulate('click') // used to cover internal onClick Handler
		expect(component.state()).toHaveProperty('currentId', 'new-mock-id')
		expect(component.html()).toMatchSnapshot()

		// Change mockInput
		expect(component.state()).toHaveProperty('content.mockInput', 'mockInputValue1')
		const mockInput = component.find({ value: 'mockInputValue1' }) // value of content['mockInput']
		mockInput.simulate('change', {
			target: { value: 'changed value' }
		})
		mockInput.simulate('click') // used to cover internal onClick Handler
		expect(component.state()).toHaveProperty('content.mockInput', 'changed value')
		expect(component.html()).toMatchSnapshot()

		// Change mockSelect
		expect(component.state()).toHaveProperty('content.mockSelect', 'mockSelectValue2')
		const selectItem = component.find({ className: 'select-item' })
		selectItem.simulate('change', {
			target: { value: 'mockSelectValue1' }
		})
		selectItem.simulate('click') // used to cover internal onClick Handler
		expect(component.state()).toHaveProperty('content.mockSelect', 'mockSelectValue1')
		expect(component.html()).toMatchSnapshot()

		// Change mockToggle
		expect(component.state()).toHaveProperty('content.mockToggle', false)
		const mockToggle = component.find({ title: 'Mock Toggle' })
		mockToggle.find('input').simulate('change', {
			target: { checked: true }
		})
		expect(component.state()).toHaveProperty('content.mockToggle', true)
		expect(component.html()).toMatchSnapshot()

		// Change the Mock Abstract Toggle
		expect(abstractOnChangeFn).not.toHaveBeenCalled()
		expect(abstractValue).toHaveLastReturnedWith(false)
		const abstractToggle = component.find({ title: 'Mock Abstract Toggle' })
		abstractToggle.find('input').simulate('change', {
			target: { checked: true }
		})
		expect(abstractValue).toHaveLastReturnedWith(true)
		expect(abstractOnChangeFn).toHaveBeenLastCalledWith(
			{
				abstractValue: false,
				mockInput: 'changed value',
				mockSelect: 'mockSelectValue1',
				mockToggle: true
			},
			true
		)
		expect(component.html()).toMatchSnapshot()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(saveId).toHaveBeenCalled()
		expect(saveContent).toHaveBeenCalled()
		expect(markUnsaved).toHaveBeenCalled()
	})

	test('More Info Box tries to save with error', () => {
		const saveId = jest.fn().mockReturnValue('A simple Error')
		const saveContent = jest.fn()
		const markUnsaved = jest.fn()
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={saveId}
				saveContent={saveContent}
				markUnsaved={markUnsaved}
				contentDescription={[]}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		component
			.find('input')
			.at(0)
			.simulate('change', {
				target: { value: 'changed value' }
			})

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(saveId).toHaveBeenCalled()
		expect(saveContent).toHaveBeenCalled()
		expect(markUnsaved).not.toHaveBeenCalled()
	})

	test('More Info Box runs select on Timeout', () => {
		const saveId = jest.fn()
		const saveContent = jest.fn()
		const markUnsaved = jest.fn()
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={saveId}
				saveContent={saveContent}
				markUnsaved={markUnsaved}
				contentDescription={[]}
				hideButtonBar
			/>
		)
		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(jest.runAllTimers).toThrow()
	})

	test('More Info Box with no button bar', () => {
		const saveId = jest.fn()
		const saveContent = jest.fn()
		const markUnsaved = jest.fn()
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={saveId}
				saveContent={saveContent}
				markUnsaved={markUnsaved}
				contentDescription={[]}
				hideButtonBar
			/>
		)
		component.setState({ isOpen: true })

		expect(component.html()).toMatchSnapshot()
	})

	test('More Info Box changes to open', () => {
		const saveId = jest.fn()
		const saveContent = jest.fn()
		const markUnsaved = jest.fn()
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={saveId}
				saveContent={saveContent}
				markUnsaved={markUnsaved}
				contentDescription={[]}
				hideButtonBar
				open={false}
			/>
		)
		component.setProps({ open: true })

		expect(component.html()).toMatchSnapshot()
	})

	test('More Info Box moves up and down', () => {
		const saveId = jest.fn()
		const saveContent = jest.fn()
		const markUnsaved = jest.fn()
		const moveNode = jest.fn()
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={saveId}
				saveContent={saveContent}
				markUnsaved={markUnsaved}
				contentDescription={[]}
				moveNode={moveNode}
			/>
		)
		component.setState({ isOpen: true })

		component
			.find('button')
			.at(5)
			.simulate('click')
		component
			.find('button')
			.at(6)
			.simulate('click')

		expect(moveNode).toHaveBeenCalledTimes(2)
	})

	test('More Info Box with no move buttons', () => {
		const saveId = jest.fn()
		const saveContent = jest.fn()
		const markUnsaved = jest.fn()
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={saveId}
				saveContent={saveContent}
				markUnsaved={markUnsaved}
				contentDescription={[]}
				isFirst
				isLast
			/>
		)
		component.setState({ isOpen: true })

		expect(component.html()).toMatchSnapshot()
	})

	test('More Info Box copies the id', () => {
		const saveId = jest.fn().mockReturnValue('A simple Error')
		const saveContent = jest.fn()
		const markUnsaved = jest.fn()
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={saveId}
				saveContent={saveContent}
				markUnsaved={markUnsaved}
				contentDescription={[]}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(ClipboardUtil.copyToClipboard).toHaveBeenCalled()
	})

	test('More Info Box opens the showTriggersModal', () => {
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={jest.fn()}
				saveContent={jest.fn()}
				markUnsaved={jest.fn()}
				contentDescription={[]}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('More Info Box handles escape click', () => {
		const saveId = jest.fn()
		const saveContent = jest.fn()

		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={saveId}
				saveContent={saveContent}
				markUnsaved={jest.fn()}
				contentDescription={[]}
			/>
		)

		component.instance().onKeyDown({
			preventDefault: jest.fn(),
			key: 'k'
		})

		component.instance().onKeyDown({
			preventDefault: jest.fn(),
			key: 'Escape'
		})

		expect(saveId).toHaveBeenCalled()
		expect(saveContent).toHaveBeenCalled()
	})

	test('More Info Box closes the TriggersModal', () => {
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={jest.fn()}
				saveContent={jest.fn()}
				markUnsaved={jest.fn()}
				contentDescription={[]}
			/>
		)

		component.instance().closeModal({ triggers: [] })

		expect(ModalUtil.hide).toHaveBeenCalled()
	})

	test('More Info Box handles clicks', () => {
		React.createRef = jest.fn()
		const saveId = jest.fn()
		const saveContent = jest.fn()
		const markUnsaved = jest.fn()
		const component = mount(
			<MoreInfoBox
				id="mock-id"
				content={{}}
				saveId={saveId}
				saveContent={saveContent}
				markUnsaved={markUnsaved}
				contentDescription={[]}
			/>
		)

		const nodeInstance = component.instance()
		nodeInstance.node = {
			current: {
				contains: value => value
			}
		}

		nodeInstance.handleClick({ target: true }) // click inside
		let tree = component.html()
		expect(tree).toMatchSnapshot()

		nodeInstance.node.current = { contains: value => value }
		nodeInstance.state.needsUpdate = true
		nodeInstance.handleClick({ target: false }) // click outside and save
		tree = component.html()
		expect(tree).toMatchSnapshot()
		expect(saveId).toHaveBeenCalled()

		nodeInstance.node.current = null
		nodeInstance.handleClick() // click without node
		tree = component.html()
		expect(tree).toMatchSnapshot()
	})
})
