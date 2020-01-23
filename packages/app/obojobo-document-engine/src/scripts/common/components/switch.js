import React from 'react'

import './switch.scss'

/* istanbul ignore next */
const noOp = () => {}

const Switch = ({ title = '', initialChecked = false, handleCheckChange = noOp }) => (
	<div className="obojobo-draft--components--switch">
		<span contentEditable={false}>{title}</span>
		<label className="switch">
			<input
				className="switch-slider"
				type="checkbox"
				checked={initialChecked}
				onChange={event => {
					handleCheckChange(event.target.checked)
				}}
			/>
			<div className="switch-slider round" />
		</label>
	</div>
)

export default Switch
