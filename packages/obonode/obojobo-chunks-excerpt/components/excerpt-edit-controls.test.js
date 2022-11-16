import ExcerptEditControls from './excerpt-edit-controls'
import renderer from 'react-test-renderer'
import React from 'react'
import { mount } from 'enzyme'

describe('Excerpt Edit Controls', () => {
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

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	describe('More options', () => {
		// Helper function that navigates to and clicks the 'Advanced options...' button in the excerpt dialog
		const openMoreOptions = component => {
			component
				.find('Button')
				.at(0)
				.find('button')
				.simulate('click')
		}

		test('Node builds the expected component with more options showing', () => {
			const component = mount(
				<ExcerptEditControls
					content={content}
					onChangeProp={onChangeProp}
					onChangePreset={onChangePreset}
				/>
			)

			component
				.find('Button')
				.at(0)
				.find('button')
				.simulate('click')

			expect(component.html()).toMatchSnapshot()
		})

		test('Node builds the expected component with paper bodyStyle', () => {
			const customContent = {
				...content,
				bodyStyle: 'white-paper'
			}

			const component = mount(
				<ExcerptEditControls
					content={customContent}
					onChangeProp={onChangeProp}
					onChangePreset={onChangePreset}
				/>
			)

			openMoreOptions(component)

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

			component
				.find('Button')
				.at(0)
				.find('button')
				.simulate('click')

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

	test('Node handles INPUT mousedown event on attributes box', () => {
		const component = mount(
			<ExcerptEditControls
				content={content}
				onChangeProp={onChangeProp}
				onChangePreset={onChangePreset}
			/>
		)

		component
			.find('Button')
			.at(0)
			.find('button')
			.simulate('mousedown', {
				target: { tagName: 'INPUT' }
			})

		expect(component.html()).toMatchSnapshot()
	})

	test('Node handles other mousedown event on attributes box', () => {
		const component = mount(
			<ExcerptEditControls
				content={content}
				onChangeProp={onChangeProp}
				onChangePreset={onChangePreset}
			/>
		)

		component
			.find('Button')
			.at(0)
			.find('button')
			.simulate('mousedown', {
				target: { tagName: 'foo' }
			})

		expect(component.html()).toMatchSnapshot()
	})
})
