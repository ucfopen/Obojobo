import React from 'react'
import IdleTimer from 'react-idle-timer'
import Dispatcher from '../flux/dispatcher'

const idleTimerRef = React.createRef()
let lastActiveTime

const onIdleWarn = () => {
	Dispatcher.trigger('window:inactiveWarning')
}

const onIdle = () => {
	lastActiveTime = new Date(idleTimerRef.current.getLastActiveTime())
	Dispatcher.trigger('window:inactive', { lastActiveTime })
}

const onReturnFromIdleWarn = () => {
	Dispatcher.trigger('window:returnFromInactiveWarning')
}

const onReturnFromIdle = () => {
	const inactiveDuration = Date.now() - lastActiveTime
	Dispatcher.trigger('window:returnFromInactive', { lastActiveTime, inactiveDuration })
	lastActiveTime = null
}

const ObojoboIdleTimer = ({ timeout, warning = false }) => (
	<React.Fragment>
		<IdleTimer
			ref={idleTimerRef}
			element={window}
			timeout={timeout}
			onIdle={onIdle}
			onActive={onReturnFromIdle}
		/>
		{warning ? (
			<IdleTimer
				element={window}
				timeout={warning}
				onIdle={onIdleWarn}
				onActive={onReturnFromIdleWarn}
			/>
		) : null}
	</React.Fragment>
)

export default ObojoboIdleTimer
