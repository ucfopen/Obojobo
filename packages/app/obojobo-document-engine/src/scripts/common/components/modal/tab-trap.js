import './tab-trap.scss'

import React from 'react'

const TabTrap = props => (
	<div className="obojobo-draft--components--modal--tab-trap">
		<input className="first-tab" type="text" onFocus={props.focusOnFirstElement} />
		{props.children}
		<input className="last-tab" type="text" onFocus={props.focusOnFirstElement} />
	</div>
)

export default TabTrap
