import './handle.scss'

import React from 'react'
import isOrNot from '../../util/isornot'

const Handle = ({
	domain: [min, max],
	handle: { id, updated, percent },
	disabled,
	getHandleProps
}) => {
	return (
		<button
			role="slider"
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={updated}
			className={'obojobo-draft--components--slider--handle ' + isOrNot(disabled, 'disabled')}
			style={{
				left: `${percent}%`
			}}
			{...getHandleProps(id)}
		/>
	)
}

export default Handle
