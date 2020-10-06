jest.mock(
	'obojobo-document-engine/src/scripts/common/components/modal/settings-dialog',
	() => props => {
		return <mock-SettingsDialog {...props}></mock-SettingsDialog>
	}
)
jest.mock(
	'obojobo-document-engine/src/scripts/common/components/modal/settings-dialog-form',
	() => props => {
		return <mock-SettingsDialogForm {...props}></mock-SettingsDialogForm>
	}
)
jest.mock(
	'obojobo-document-engine/src/scripts/common/components/modal/settings-dialog-row',
	() => props => {
		return <mock-SettingsDialogRow {...props}></mock-SettingsDialogRow>
	}
)

jest.mock('./materia-picker-dialog', () =>
	global.mockForwardRefComponent(this, 'MateriaPickerDialog')
)

import React from 'react'
import { mount } from 'enzyme'
// import TestRenderer from 'react-test-renderer'
import MateriaSettingsDialog from './materia-settings-dialog'
import SettingsDialogForm from 'obojobo-document-engine/src/scripts/common/components/modal/settings-dialog-form'
import MateriaPickerDialog from './materia-picker-dialog'
import SettingsDialog from 'obojobo-document-engine/src/scripts/common/components/modal/settings-dialog'
const consoleError = console.error

describe('MateriaSettingsDialog', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})
	afterEach(() => {
		console.error = consoleError
	})

	test('component with icon and src', () => {
		expect.hasAssertions()
		const props = {
			draftId: 'mock-draft-id',
			contentId: 'mock-content-id',
			nodeId: 'mock-node-id',
			caption: 'mock-caption',
			materiaHost: 'mock-materia-host',
			onConfirm: jest.fn(),
			onCancel: jest.fn(),
			content: {
				icon: 'mock-icon',
				src: 'mock-src',
				widgetEngine: 'mock-engine'
			}
		}

		const component = mount(<MateriaSettingsDialog {...props} />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('MateriaSettingsDialog component without caption', () => {
		expect.hasAssertions()
		const props = {
			content: {
				icon: 'mock-icon',
				src: 'mock-src',
				widgetEngine: 'mock-engine'
			}
		}

		const component = mount(<MateriaSettingsDialog {...props} />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('component without icon, with src', () => {
		expect.hasAssertions()
		const props = {
			content: {
				src: 'mock-src',
				caption: 'mock-caption',
				widgetEngine: 'mock-engine'
			}
		}

		const component = mount(<MateriaSettingsDialog {...props} />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('component displays MateriaPickerDialog', () => {
		expect.hasAssertions()
		const props = {
			content: {
				icon: 'mock-icon',
				src: 'mock-src',
				caption: 'mock-caption',
				widgetEngine: 'mock-engine'
			}
		}

		const component = mount(<MateriaSettingsDialog {...props} />)
		component.instance().openPicker()
		// call update due to state updating after
		component.update()

		expect(component.find(MateriaPickerDialog)).toHaveLength(1)
	})

	test('component displays SettingsDialogForm', () => {
		expect.hasAssertions()
		const props = {
			content: {
				src: 'mock-src',
				caption: 'mock-caption',
				widgetEngine: 'mock-engine'
			}
		}
		// SettingsDialogForm should be displayed if there's no icon and a src is set

		const component = mount(<MateriaSettingsDialog {...props} />)

		expect(component.find(SettingsDialogForm)).toHaveLength(1)
	})

	test('component displays Select a Widget... button', () => {
		expect.hasAssertions()
		const props = {
			content: {
				caption: 'mock-caption',
				widgetEngine: 'mock-engine'
			}
		}

		const component = mount(<MateriaSettingsDialog {...props} />)

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('component displays caption from content', () => {
		expect.hasAssertions()
		const props = {
			content: {
				caption: 'mock-caption',
				widgetEngine: 'mock-engine'
			}
		}

		const component = mount(<MateriaSettingsDialog {...props} />)

		const tree = component.html()
		expect(tree).toContain('mock-caption')
	})

	test('component displays caption from props', () => {
		expect.hasAssertions()
		const props = {
			caption: 'mock-caption-from-props',
			content: {
				widgetEngine: 'mock-engine'
			}
		}

		// SettingsDialogForm should be displayed if there's no icon and a src is set
		const component = mount(<MateriaSettingsDialog {...props} />)

		const tree = component.html()
		expect(tree).toContain('mock-caption-from-props')
	})

	test('component displays caption prefers content caption over props.caption', () => {
		expect.hasAssertions()
		const props = {
			caption: 'mock-caption-from-props',
			content: {
				caption: 'mock-caption-from-content',
				widgetEngine: 'mock-engine'
			}
		}

		const component = mount(<MateriaSettingsDialog {...props} />)

		const tree = component.html()
		expect(tree).toContain('mock-caption-from-content')
	})

	test('SettingsDialogForm onChange calls onSettingsChange', () => {
		expect.hasAssertions()

		const props = {
			content: {
				src: 'mock-src',
				caption: 'mock-caption',
				widgetEngine: 'mock-engine'
			}
		}

		const component = mount(<MateriaSettingsDialog {...props} />)

		const onSettingChange = component.instance().onSettingChange
		// make sure the onChange handler is the function were testing
		expect(component.find(SettingsDialogForm).props().onChange).toBe(onSettingChange)

		// changes caption
		onSettingChange({ prop: 'caption' }, { target: { value: 'new-caption' } })
		expect(component.state()).toHaveProperty('caption', 'new-caption')

		// changes src
		onSettingChange({ prop: 'src' }, { target: { value: 'new-src' } })
		expect(component.state()).toHaveProperty('src', 'new-src')

		// manually set state so we can check it gets cleared
		component.setState({ icon: 'mock-icon', widgetEngine: 'mock-engine' })
		// empty src clears icon and widgetEngine
		onSettingChange({ prop: 'src' }, { target: { value: '' } })
		expect(component.state()).toHaveProperty('src', '')
		expect(component.state()).toHaveProperty('icon', '')
		expect(component.state()).toHaveProperty('widgetEngine', '')
	})

	test('passes expected vars to SettingsDialog', () => {
		expect.hasAssertions()
		const props = {
			onCancel: jest.fn(),
			content: {
				src: 'mock-src',
				caption: 'mock-caption',
				widgetEngine: 'mock-engine'
			}
		}

		const component = mount(<MateriaSettingsDialog {...props} />)

		const dialogProps = component.find(SettingsDialog).props()
		const inst = component.instance()
		// make sure the onChange handler is the function were testing
		expect(dialogProps).toHaveProperty('title', 'Materia Widget Settings')
		expect(dialogProps).toHaveProperty('onConfirm', inst.onConfirm)
		expect(dialogProps).toHaveProperty('onCancel', props.onCancel)
		expect(dialogProps).toHaveProperty('focusOnFirstElement', inst.focusOnFirstElement)
	})

	test('focusOnFirstElement focuses on the open picker button', () => {
		expect.hasAssertions()
		const props = {
			onCancel: jest.fn(),
			content: {
				src: 'mock-src',
				caption: 'mock-caption',
				widgetEngine: 'mock-engine'
			}
		}

		const component = mount(<MateriaSettingsDialog {...props} />)

		const inst = component.instance()

		// replace inputRef with a mock
		inst.inputRef = { current: { focus: jest.fn() } }

		inst.focusOnFirstElement()

		// make sure focus is called
		expect(inst.inputRef.current.focus).toHaveBeenCalled()

		// to add coverage when inputRef.current isn't set
		// replace inputRef with a ref w/ no current focus
		inst.inputRef = {}
		inst.focusOnFirstElement()
	})

	test('standardizeIconUrl acts as expected', () => {
		expect.hasAssertions()
		const props = {
			content: {}
		}

		const component = mount(<MateriaSettingsDialog {...props} />)

		const inst = component.instance()

		expect(inst.standardizeIconUrl('https://ucf.edu/mock/icon-2934@2x.png')).toBe(
			'https://ucf.edu/mock/icon-92@2x.png'
		)
		expect(inst.standardizeIconUrl('https://ucf.edu/mock/t/icon-24.png')).toBe(
			'https://ucf.edu/mock/t/icon-92@2x.png'
		)
		expect(inst.standardizeIconUrl('http://ucf.edu/mock/icon-xx4.png')).toBe(
			'http://ucf.edu/mock/icon-92@2x.png'
		)
	})

	test('onPick handles cancel click', () => {
		expect.hasAssertions()
		const props = { content: {} }
		const component = mount(<MateriaSettingsDialog {...props} />)
		const inst = component.instance()
		component.setState({ pickerOpen: true })
		inst.onPick({ type: 'click' })
		expect(component.state()).toHaveProperty('pickerOpen', false)
	})

	test('onPick returns on unsupported events', () => {
		expect.hasAssertions()
		const props = { content: {} }
		const component = mount(<MateriaSettingsDialog {...props} />)
		const inst = component.instance()
		component.setState({ pickerOpen: true })
		inst.onPick({ type: 'mouseover' })
		expect(component.state()).toHaveProperty('pickerOpen', true)
	})

	test('onPick handles postmessages from other hosts without doing anything', () => {
		expect.hasAssertions()
		const props = {
			materiaHost: 'mock-host',
			content: {}
		}
		const component = mount(<MateriaSettingsDialog {...props} />)
		const inst = component.instance()
		component.setState({ pickerOpen: true })
		inst.onPick({ type: 'message', origin: 'some-other-host' })
		expect(component.state()).toHaveProperty('pickerOpen', true)
	})

	test('onPick handles postmessages from materia without data', () => {
		expect.hasAssertions()
		const props = {
			materiaHost: 'mock-host',
			content: {}
		}
		const component = mount(<MateriaSettingsDialog {...props} />)
		const inst = component.instance()
		component.setState({ pickerOpen: true })
		inst.onPick({ type: 'message', origin: 'mock-host' })
		expect(component.state()).toHaveProperty('pickerOpen', true)
	})

	test('onPick handles postmessages from materia with data', () => {
		expect.hasAssertions()
		const props = {
			materiaHost: 'mock-host',
			content: {}
		}
		const component = mount(<MateriaSettingsDialog {...props} />)
		const inst = component.instance()
		component.setState({ pickerOpen: true })
		const data = JSON.stringify({
			name: 'mock-name',
			embed_url: 'mock-embed-url',
			img: 'mock-icon',
			widget: {
				width: '1002.2',
				height: '505.3',
				name: 'widget-name'
			}
		})
		inst.onPick({ type: 'message', origin: props.materiaHost, data })
		expect(component.state()).toHaveProperty('pickerOpen', false)
		expect(component.state()).toMatchInlineSnapshot(`
		Object {
		  "caption": "mock-name",
		  "height": 505,
		  "icon": "mock-icon",
		  "pickerOpen": false,
		  "showCustomize": false,
		  "src": "mock-embed-url",
		  "widgetEngine": "widget-name",
		  "width": 1002,
		}
	`)
	})

	test('onPick handles errors in json', () => {
		expect.hasAssertions()
		const props = {
			materiaHost: 'mock-host',
			content: {}
		}
		const component = mount(<MateriaSettingsDialog {...props} />)
		console.error = jest.fn()
		const inst = component.instance()
		component.setState({ pickerOpen: true })
		const data = '{/]bad-json)'
		inst.onPick({ type: 'message', origin: props.materiaHost, data })
		expect(console.error).toHaveBeenCalledWith('Error parsing Materia resource selection.')
		// doesn't close
		expect(component.state()).toHaveProperty('pickerOpen', true)
	})

	test('toggleEditLock ... does', () => {
		expect.hasAssertions()
		const props = {
			materiaHost: 'mock-host',
			content: {}
		}
		const component = mount(<MateriaSettingsDialog {...props} />)
		const inst = component.instance()
		component.setState({ showCustomize: false })
		inst.toggleEditLock()
		expect(component.state()).toHaveProperty('showCustomize', true)
		inst.toggleEditLock()
		expect(component.state()).toHaveProperty('showCustomize', false)
	})

	test('onConfirm calls confirm with state props', () => {
		expect.hasAssertions()
		const props = {
			draftId: 'mock-draft-id',
			contentId: 'mock-content-id',
			nodeId: 'mock-node-id',
			caption: 'mock-caption',
			materiaHost: 'mock-materia-host',
			onConfirm: jest.fn(),
			onCancel: jest.fn(),
			content: {
				icon: 'mock-icon',
				src: 'mock-src',
				widgetEngine: 'mock-engine'
			}
		}
		const component = mount(<MateriaSettingsDialog {...props} />)
		const inst = component.instance()

		inst.onConfirm()
		expect(props.onConfirm).toHaveBeenCalledWith({
			caption: 'mock-caption',
			height: 0,
			icon: 'mock-icon',
			src: 'mock-src',
			widgetEngine: 'mock-engine',
			width: 0
		})
	})
})
