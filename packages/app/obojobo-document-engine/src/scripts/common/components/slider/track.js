import './track.scss'

import React from 'react'
import isOrNot from '../../util/isornot'

const Track = ({ source, target, getTrackProps, disabled }) => {
	return (
		<div
			style={{
				left: `${source.percent}%`,
				width: `${target.percent - source.percent}%`,
			}}
			className={'obojobo-draft--components--slider--track ' + isOrNot(disabled, 'disabled')}
			{...getTrackProps()}
		/>
	)
}

export default Track