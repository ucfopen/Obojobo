import React from 'react'
import TestRenderer from 'react-test-renderer'
import Dispatcher from '../flux/dispatcher'
import IdleTimer from 'react-idle-timer'
jest.mock('../flux/dispatcher', () => ({
	trigger: jest.fn()
}))

import ObojoboIdleTimer from './obojobo-idle-timer'

jest.useFakeTimers()

beforeEach(() => {
	jest.clearAllMocks()
})

test('Dispatches inactive warning at correct time', () => {
	// setup
	expect.hasAssertions()

	// execute
	TestRenderer.create(<ObojoboIdleTimer timeout={3} warning={2} />)

	// verify no timers called after 1ms
	jest.advanceTimersByTime(1)
	expect(Dispatcher.trigger).not.toHaveBeenCalled()

	// verify warning dispatched at 2ms
	jest.advanceTimersByTime(1)
	expect(Dispatcher.trigger).toHaveBeenLastCalledWith('window:inactiveWarning')

	// verify idle dispatched at 3ms
	jest.advanceTimersByTime(1)
	expect(Dispatcher.trigger).toHaveBeenLastCalledWith('window:inactive', expect.any(Object))
})

test('Dispatches no warning when not requestd', () => {
	// setup
	expect.hasAssertions()

	// execute
	TestRenderer.create(<ObojoboIdleTimer timeout={3} />)

	// verify no timers called after 1ms
	jest.advanceTimersByTime(1)
	expect(Dispatcher.trigger).not.toHaveBeenCalled()

	// verify warning dispatched at 2ms
	jest.advanceTimersByTime(1)
	expect(Dispatcher.trigger).not.toHaveBeenCalled()

	// verify idle dispatched at 3ms
	jest.advanceTimersByTime(1)
	expect(Dispatcher.trigger).toHaveBeenLastCalledWith('window:inactive', expect.any(Object))
})

test('Dispatches return from warning event', () => {
	// setup
	expect.hasAssertions()
	const testRenderer = TestRenderer.create(<ObojoboIdleTimer timeout={3} warning={2} />)
	const warningTimer = testRenderer.root.findByProps({ timeout: 2 }).instance

	// advance past the warning timeout
	jest.advanceTimersByTime(2)
	Dispatcher.trigger.mockClear()

	// call idle timer class method to simulate idle state change
	warningTimer._toggleIdleState({})

	// verify events are fired
	expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
	expect(Dispatcher.trigger).toHaveBeenLastCalledWith('window:returnFromInactiveWarning')
})

test('Dispatches return from idle event', () => {
	// setup
	expect.hasAssertions()
	const testRenderer = TestRenderer.create(<ObojoboIdleTimer timeout={3} />)
	const idleTimer = testRenderer.root.findByType(IdleTimer).instance

	// advance past the idle timeout
	jest.advanceTimersByTime(3)
	Dispatcher.trigger.mockClear()
	// call idle timer class method to simulate idle state change
	idleTimer._toggleIdleState({})

	// verify events are fired
	expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
	expect(Dispatcher.trigger).toHaveBeenLastCalledWith(
		'window:returnFromInactive',
		expect.objectContaining({
			inactiveDuration: expect.any(Number),
			lastActiveTime: expect.any(Date)
		})
	)
})
