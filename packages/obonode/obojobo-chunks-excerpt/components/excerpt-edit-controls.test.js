import ExcerptEditControls from './excerpt-edit-controls'
import renderer from 'react-test-renderer'
import React from 'react'
import { mount } from 'enzyme'

import Button from 'obojobo-document-engine/src/scripts/common/components/button'

describe('Excerpt Edit Controls', () => {
	// Helper function that navigates to and clicks the 'Advanced options...' button in the excerpt dialog
	const openMoreOptions = component => {
		component
			.find('Button')
			.at(0)
			.find('button')
			.simulate('click')
	}

	const content = {
		bodyStyle: 'none',
		width: 'medium',
		font: 'serif',
		lineHeight: 'moderate',
		fontSize: 'smaller',
		topEdge: 'normal',
		bottomEdge: 'normal',
		effect: false
	}

	const onChangeProp = jest.fn()
	const onChangePreset = jest.fn()

	afterEach(() => {
		jest.clearAllMocks()
	})

	test('Node builds the expected component', () => {
		const component = renderer.create(
			<ExcerptEditControls
				content={content}
				onChangeProp={onChangeProp}
				onChangePreset={onChangePreset}
			/>
		)

		expect(component.root.children[0].props.className.trim()).toBe('excerpt--excerpt-edit-controls')
		expect(component.root.children[0].children.length).toBe(2)
		expect(component.root.children[0].children[0].props.className).toBe('attributes-list')
		expect(component.root.children[0].children[1].type).toBe(Button)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node builds the expected component using preset and handles change', () => {
		const content = {
			preset: 'excerpt'
		}

		const component = mount(
			<ExcerptEditControls
				content={content}
				onChangeProp={onChangeProp}
				onChangePreset={onChangePreset}
			/>
		)

		const presetOptions = component.find('li')
		for (let p = 0; p < presetOptions.length; p++) {
			const presetOption = presetOptions.at(p)
			if (presetOption.key() === 'excerpt') {
				expect(presetOption.prop('className')).toBe('is-selected')
			} else {
				expect(presetOption.prop('className')).toBe('is-not-selected')
			}
		}

		presetOptions
			.at(0)
			.find('button')
			.simulate('click')

		// we happen to know that the first option is 'minimal'
		// may want to consider putting the list of presets in a separate file for reference
		expect(onChangePreset).toHaveBeenCalledWith('minimal')

		expect(component.html()).toMatchSnapshot()
	})

	describe('More options', () => {
		test('Node builds the expected component with more options showing', () => {
			const component = mount(
				<ExcerptEditControls
					content={content}
					onChangeProp={onChangeProp}
					onChangePreset={onChangePreset}
				/>
			)

			expect(
				component
					.children()
					.at(0)
					.prop('className')
					.trim()
			).toBe('excerpt--excerpt-edit-controls')

			openMoreOptions(component)

			expect(
				component
					.children()
					.at(0)
					.prop('className')
					.trim()
			).toBe('excerpt--excerpt-edit-controls extra-width')

			// default styling will not have an effect - this input should be disabled
			expect(
				component
					.find({ type: 'checkbox' })
					.at(0)
					.prop('disabled')
			).toBe(true)

			expect(component.html()).toMatchSnapshot()
		})

		// ideally we'd be able to click the 'white-paper' preset and then check to make sure the
		//  preset's properties are applied - but clicking a preset calls a function in the parent
		//  component which resets this component's props, so instead we have to simulate it by
		//  setting the props ourselves which correspond to the preset
		test('Node renders selected options accordingly when choosing "white-paper" preset', () => {
			// copied verbatim from get-preset-props
			// should probably import that and get this object naturally
			const customContent = {
				bodyStyle: 'white-paper',
				width: 'medium',
				font: 'times-new-roman',
				lineHeight: 'moderate',
				fontSize: 'regular',
				effect: false
			}

			const component = mount(
				<ExcerptEditControls
					content={customContent}
					onChangeProp={onChangeProp}
					onChangePreset={onChangePreset}
				/>
			)

			openMoreOptions(component)

			// we kind of just know which element corresponds to which property
			// would be nice if we could use class names or something more predictable here
			const effectInput = component.find({ type: 'checkbox' }).at(0)
			expect(
				component
					.find('select')
					.at(0)
					.prop('value')
			).toBe('white-paper')
			expect(
				component
					.find('select')
					.at(1)
					.prop('value')
			).toBe('times-new-roman')
			expect(effectInput.prop('disabled')).toBe(false)
			expect(effectInput.prop('checked')).toBe(false)
			expect(
				effectInput
					.closest('label')
					.find('span')
					.text()
			).toBe('Paper background')
			expect(
				component
					.find('RadioIcons')
					.at(0)
					.prop('selectedOption')
			).toBe('medium')
			expect(
				component
					.find('RadioIcons')
					.at(1)
					.prop('selectedOption')
			).toBe('regular')
			expect(
				component
					.find('RadioIcons')
					.at(2)
					.prop('selectedOption')
			).toBe('moderate')

			expect(component.html()).toMatchSnapshot()
		})

		test('Node builds the expected component with terminal bodyStyle', () => {
			const customContent = {
				...content,
				bodyStyle: 'term-white'
			}

			const component = mount(
				<ExcerptEditControls
					content={customContent}
					onChangeProp={onChangeProp}
					onChangePreset={onChangePreset}
				/>
			)

			openMoreOptions(component)

			const effectInput = component.find({ type: 'checkbox' }).at(0)
			expect(
				effectInput
					.closest('label')
					.find('span')
					.text()
			).toBe('Screen / glow effects')

			expect(component.html()).toMatchSnapshot()
		})

		test('Node builds the expected component with text-file bodyStyle', () => {
			const customContent = {
				...content,
				bodyStyle: 'modern-text-file'
			}

			const component = mount(
				<ExcerptEditControls
					content={customContent}
					onChangeProp={onChangeProp}
					onChangePreset={onChangePreset}
				/>
			)

			openMoreOptions(component)

			const effectInput = component.find({ type: 'checkbox' }).at(0)
			expect(
				effectInput
					.closest('label')
					.find('span')
					.text()
			).toBe('Drop shadow')

			expect(component.html()).toMatchSnapshot()
		})

		test('Node handles bodyStyle change', () => {
			const component = mount(
				<ExcerptEditControls
					content={content}
					onChangeProp={onChangeProp}
					onChangePreset={onChangePreset}
				/>
			)

			openMoreOptions(component)

			component
				.find('select')
				.at(0)
				.simulate('change', {
					target: { value: 'term-white' }
				})

			expect(onChangeProp).toHaveBeenCalledWith('bodyStyle', 'term-white')
		})

		test('Node handles font change', () => {
			const component = mount(
				<ExcerptEditControls
					content={content}
					onChangeProp={onChangeProp}
					onChangePreset={onChangePreset}
				/>
			)

			openMoreOptions(component)

			component
				.find('select')
				.at(1)
				.simulate('change', {
					target: { value: 'palatino' }
				})

			expect(onChangeProp).toHaveBeenCalledWith('font', 'palatino')
		})

		test('Node handles width change', () => {
			const component = mount(
				<ExcerptEditControls
					content={content}
					onChangeProp={onChangeProp}
					onChangePreset={onChangePreset}
				/>
			)

			openMoreOptions(component)

			component
				.find('RadioIcons')
				.at(0)
				.find('input')
				.at(0)
				.simulate('change')

			expect(onChangeProp).toHaveBeenCalledWith('width', 'large')
		})

		test('Node handles fontSize change', () => {
			const component = mount(
				<ExcerptEditControls
					content={content}
					onChangeProp={onChangeProp}
					onChangePreset={onChangePreset}
				/>
			)

			openMoreOptions(component)

			component
				.find('RadioIcons')
				.at(1)
				.find('input')
				.at(0)
				.simulate('change')

			expect(onChangeProp).toHaveBeenCalledWith('fontSize', 'smaller')
		})

		test('Node handles lineHeight change', () => {
			const component = mount(
				<ExcerptEditControls
					content={content}
					onChangeProp={onChangeProp}
					onChangePreset={onChangePreset}
				/>
			)

			openMoreOptions(component)

			component
				.find('RadioIcons')
				.at(2)
				.find('input')
				.at(0)
				.simulate('change')

			expect(onChangeProp).toHaveBeenCalledWith('lineHeight', 'compact')
		})

		test('Node handles effect click', () => {
			const customContent = {
				preset: 'excerpt'
			}
			const component = mount(
				<ExcerptEditControls
					content={customContent}
					onChangeProp={onChangeProp}
					onChangePreset={onChangePreset}
				/>
			)

			openMoreOptions(component)

			component
				.find('.effect-settings')
				.at(0)
				.find('input')
				.at(0)
				.simulate('change', {
					target: { checked: true }
				})

			expect(onChangeProp).toHaveBeenCalledWith('effect', true)
		})
	})

	test('Node handles mousedown event on attributes box from dropdowns and checkboxes', () => {
		const component = mount(
			<ExcerptEditControls
				content={content}
				onChangeProp={onChangeProp}
				onChangePreset={onChangePreset}
			/>
		)

		const mockPreventDefault = jest.fn()

		// open the 'advanced options' dialog so we can reach the select/input elements
		openMoreOptions(component)

		component
			.find('select')
			.at(0)
			.simulate('mousedown', {
				preventDefault: mockPreventDefault
			})
		expect(mockPreventDefault).not.toHaveBeenCalled()

		component
			.find({ type: 'checkbox' })
			.at(0)
			.simulate('mousedown', {
				preventDefault: mockPreventDefault
			})
		expect(mockPreventDefault).not.toHaveBeenCalled()
	})

	test('Node handles other mousedown events on attributes box', () => {
		const component = mount(
			<ExcerptEditControls
				content={content}
				onChangeProp={onChangeProp}
				onChangePreset={onChangePreset}
			/>
		)

		const mockPreventDefault = jest.fn()

		component
			.find('li')
			.at(0)
			.find('button')
			.simulate('mousedown', {
				preventDefault: mockPreventDefault
			})
		expect(mockPreventDefault).toHaveBeenCalled()
	})
})
