import './handle.scss'

import React from 'react'
import isOrNot from '../../util/isornot'

const Handle = ({
	domain: [min, max],
	handle: { id, value, percent },
	disabled,
	getHandleProps
}) => {
	return (
		<button
			role="slider"
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value}
			className={'obojobo-draft--components--slider--handle ' + isOrNot(disabled, 'disabled')}
			style={{
				left: `${percent}%`
			}}
			{...getHandleProps(id)}
		/>
	)
}

export default Handle
