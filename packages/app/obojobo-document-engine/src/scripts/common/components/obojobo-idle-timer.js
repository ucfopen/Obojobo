import React from 'react'
import IdleTimer from 'react-idle-timer'
import Dispatcher from '../flux/dispatcher'

const idleTimerRef = React.createRef()
let lastActiveTime

const onIdle = () => {
	lastActiveTime = new Date(idleTimerRef.current.getLastActiveTime())
	Dispatcher.trigger('window:inactive', {lastActiveTime})
}

const onReturnFromIdle = () => {
	const inactiveDuration = Date.now() - lastActiveTime
	Dispatcher.trigger('window:returnFromInactive', {lastActiveTime, inactiveDuration})
	lastActiveTime = null
}

const ObojoboIdleTimer = ({timeout}) => (
	<IdleTimer
		ref={idleTimerRef}
		element={window}
		timeout={timeout}
		onIdle={onIdle}
		onActive={onReturnFromIdle}
	/>
)

export default ObojoboIdleTimer
