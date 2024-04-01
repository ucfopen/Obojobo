jest.mock('react-dom')
jest.mock(
	'obojobo-chunks-iframe/viewer-component',
	() => require('obojobo-document-engine/__mocks__/mock-class-component').default
)
jest.mock(
	'obojobo-document-engine/src/scripts/common/chunk/text-chunk/text-group-el',
	() => require('obojobo-document-engine/__mocks__/mock-class-component').default
)

import Materia from './viewer-component'
import OboModel from 'obojobo-document-engine/__mocks__/obo-model-mock'
import React from 'react'
import renderer from 'react-test-renderer'

require('./viewer') // used to register this oboModel

describe('Materia viewer component', () => {
	let model
	let moduleData
	let handleScorePassback

	let standardProps

	const mockModuleTitle = 'mocked-module-title'
	const mockVisitId = 'mock-visit-id'
	const mockNodeId = 'mock-obo-id'

	const standardPostMessageContent = {
		score: 100,
		score_url: 'url:to/score.screen'
	}

	beforeEach(() => {
		jest.resetAllMocks()
		jest.spyOn(window, 'addEventListener')
		jest.spyOn(window, 'removeEventListener')

		OboModel.__setNextGeneratedLocalId('mock-uuid')
		model = OboModel.create({
			id: mockNodeId,
			type: 'ObojoboDraft.Chunks.Materia',
			content: {
				src: 'http://www.example.com'
			}
		})

		moduleData = {
			model: {
				title: mockModuleTitle
			},
			navState: {
				visitId: mockVisitId
			}
		}

		handleScorePassback = jest.fn()

		standardProps = {
			model,
			moduleData,
			handleScorePassback
		}
	})

	afterEach(() => {})

	test('renders', () => {
		expect.hasAssertions()
		const props = standardProps
		const component = renderer.create(<Materia {...props} />)
		expect(component.toJSON()).toMatchSnapshot()

		const inst = component.getInstance()
		expect(inst.state.model.modelState.src).toBe(
			`http://localhost/materia-lti-launch?visitId=${mockVisitId}&nodeId=${mockNodeId}`
		)
	})

	test('adds and removes listener for postmessage when mounting and unmounting', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)

		const inst = component.getInstance()
		// make sure it's listening on mount
		expect(window.addEventListener).toHaveBeenCalledWith(
			'message',
			inst.onPostMessageFromMateria,
			false
		)
		expect(window.removeEventListener).not.toHaveBeenCalledWith(
			'message',
			inst.onPostMessageFromMateria,
			false
		)

		// make sure it's not listening when unmounted
		component.unmount()
		expect(window.removeEventListener).toHaveBeenCalledWith(
			'message',
			inst.onPostMessageFromMateria,
			false
		)
	})

	test('onPostMessageFromMateria does nothing if post message handler callback is not defined', () => {
		expect.hasAssertions()
		const props = {
			...standardProps
		}
		delete props.handleScorePassback

		const component = renderer.create(<Materia {...props} />)

		const inst = component.getInstance()
		inst.iframeRef = {}
		const event = { source: '', data: JSON.stringify(standardPostMessageContent) }
		inst.onPostMessageFromMateria(event)
		expect(handleScorePassback).toHaveBeenCalledTimes(0)
	})

	test('onPostMessageFromMateria with an empty iframe ref does not call post message handler callback', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)

		const inst = component.getInstance()
		inst.iframeRef = {}
		const event = { source: '', data: JSON.stringify(standardPostMessageContent) }
		inst.onPostMessageFromMateria(event)
		expect(handleScorePassback).toHaveBeenCalledTimes(0)
	})

	test('onPostMessageFromMateria without an iframe ref object does not call post message handler callback', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)

		const inst = component.getInstance()
		inst.iframeRef = null
		const event = { source: '', data: JSON.stringify(standardPostMessageContent) }
		inst.onPostMessageFromMateria(event)
		expect(handleScorePassback).toHaveBeenCalledTimes(0)
	})

	test('onPostMessageFromMateria without a matching iframe and event source does not call post message handler callback', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)

		const inst = component.getInstance()
		inst.iframeRef = { current: { refs: { iframe: { contentWindow: 'different-mock-window' } } } }
		const event = { source: 'mock-window', data: JSON.stringify(standardPostMessageContent) }
		inst.onPostMessageFromMateria(event)
		expect(handleScorePassback).toHaveBeenCalledTimes(0)
	})

	test('onPostMessageFromMateria blocks events not coming fom the src domain', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)

		const inst = component.getInstance()
		inst.iframeRef = {
			current: { refs: { iframe: { contentWindow: 'http://not-localhost/whatever' } } }
		}
		const event = {
			source: 'http://localhost/whatever',
			data: JSON.stringify(standardPostMessageContent)
		}
		inst.onPostMessageFromMateria(event)
		expect(handleScorePassback).toHaveBeenCalledTimes(0)
	})

	test('onPostMessageFromMateria blocks events with an origin that doesnt match modelState srcn', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)

		const inst = component.getInstance()
		inst.iframeRef = {
			current: { refs: { iframe: { contentWindow: 'http://localhost/whatever' } } }
		}
		const event = {
			origin: 'http://not-localhost',
			source: 'http://localhost/whatever',
			data: JSON.stringify(standardPostMessageContent)
		}
		inst.onPostMessageFromMateria(event)
		expect(handleScorePassback).toHaveBeenCalledTimes(0)
	})

	test('onPostMessageFromMateria ignores messages where data is not a string', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)

		const inst = component.getInstance()
		inst.iframeRef = {
			current: { refs: { iframe: { contentWindow: 'http://localhost/whatever' } } }
		}
		const event = {
			origin: 'http://localhost',
			source: 'http://localhost/whatever',
			data: standardPostMessageContent
		}
		inst.onPostMessageFromMateria(event)
		expect(handleScorePassback).toHaveBeenCalledTimes(0)
	})

	test('onPostMessageFromMateria ignores messages with a data type that isnt materiaScoreRecorded', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)

		const inst = component.getInstance()
		inst.iframeRef = {
			current: { refs: { iframe: { contentWindow: 'http://localhost/whatever' } } }
		}
		const event = {
			origin: 'http://localhost',
			source: 'http://localhost/whatever',
			data: JSON.stringify({ type: 'notmateriaScoreRecorded', score: 100 })
		}
		inst.onPostMessageFromMateria(event)
		expect(handleScorePassback).toHaveBeenCalledTimes(0)
	})

	test('onPostMessageFromMateria calls post message handler when all checks pass', () => {
		expect.hasAssertions()
		const props = standardProps
		const component = renderer.create(<Materia {...props} />)

		// While we're here, make sure the score dialog appears correctly.
		// It shouldn't exist by default
		expect(component.root.findAllByProps({ className: 'materia-score verified' }).length).toBe(0)

		const inst = component.getInstance()
		inst.iframeRef = {
			current: { refs: { iframe: { contentWindow: 'http://localhost/whatever' } } }
		}
		const event = {
			origin: 'http://localhost',
			source: 'http://localhost/whatever',
			data: JSON.stringify({
				type: 'materiaScoreRecorded',
				score: 100,
				score_url: 'http://localhost/score'
			})
		}
		inst.onPostMessageFromMateria(event)
		expect(handleScorePassback).toHaveBeenCalledTimes(1)
	})

	test('onPostMessageFromMateria handles json parsing errors', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)

		const inst = component.getInstance()
		inst.iframeRef = {
			current: { refs: { iframe: { contentWindow: 'http://localhost/whatever' } } }
		}
		const event = {
			origin: 'http://localhost',
			source: 'http://localhost/whatever',
			data: '!]&({}'
		}
		jest.spyOn(console, 'error')
		console.error.mockReturnValueOnce() // eslint-disable-line no-console
		inst.onPostMessageFromMateria(event)
		expect(handleScorePassback).toHaveBeenCalledTimes(0)
		expect(console.error).toHaveBeenCalled() // eslint-disable-line no-console
	})

	test('srcToLTILaunchUrl formats strings as expected', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)
		const inst = component.getInstance()
		expect(inst.srcToLTILaunchUrl('visit-id', 'node-id')).toBe(
			'http://localhost/materia-lti-launch?visitId=visit-id&nodeId=node-id'
		)
		expect(inst.srcToLTILaunchUrl('99-9999-999', 'fff-fff-fff')).toBe(
			'http://localhost/materia-lti-launch?visitId=99-9999-999&nodeId=fff-fff-fff'
		)
	})

	test('onShow changes state to open', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)
		const inst = component.getInstance()
		expect(inst.state).toHaveProperty('open', false)
		inst.onShow()
		expect(inst.state).toHaveProperty('open', true)
	})

	test('renderCaptionOrScore renders text but no score when score is not set', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)

		// find the textGroupEL by a unique prop
		// if it's found, it was rendered
		expect(component.root.findAllByProps({ groupIndex: '0' })).toHaveLength(1)
		expect(component.root.findAllByProps({ className: 'materia-score verified' }).length).toBe(0)
	})

	test('renderCaptionOrScore renders text and score when score is set', () => {
		expect.hasAssertions()
		const props = {
			...standardProps,
			score: 100,
			verifiedScore: true
		}

		const component = renderer.create(<Materia {...props} />)

		// find the textGroupEL by a unique prop
		// if it's found, it was rendered
		expect(component.root.findAllByProps({ groupIndex: '0' })).toHaveLength(1)
		const scoreRender = component.root.findByProps({ className: 'materia-score verified' })
		expect(scoreRender.children.join('')).toBe('Your highest score: 100%')
	})

	test('renderCaptionOrScore captures errors', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)

		const inst = component.getInstance()
		// set a value that'll cause a property of undefined error
		inst.state.model.modelState.textGroup = null
		// force it to redraw with the error
		inst.setState({ model: inst.state.model })

		// find the textGroupEL by a unique prop
		// it shouldn't render one
		expect(component.root.findAllByProps({ groupIndex: '0' })).toHaveLength(0)
	})

	test('renderTextCaption renders null when there is no textgroup text', () => {
		expect.hasAssertions()
		const props = standardProps

		const component = renderer.create(<Materia {...props} />)

		const inst = component.getInstance()
		// set a value that'll cause a property of undefined error
		inst.state.model.modelState.textGroup.first.text = ''
		// force it to redraw with the error
		inst.setState({ model: inst.state.model })

		// find the textGroupEL by a unique prop
		// it shouldn't render one
		expect(component.root.findAllByProps({ groupIndex: '0' })).toHaveLength(0)
	})

	test('rendering in review mode changes the iframe src', () => {
		const mockScoreUrl = 'http://localhost/url/to/score/screen'
		const props = {
			model,
			moduleData,
			mode: 'review',
			response: {
				scoreUrl: mockScoreUrl
			}
		}
		const component = renderer.create(<Materia {...props} />)

		const inst = component.getInstance()

		expect(inst.state.model.modelState.src).toBe(mockScoreUrl)
	})
})
