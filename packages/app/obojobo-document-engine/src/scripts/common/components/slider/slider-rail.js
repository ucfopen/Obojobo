import './slider-rail.scss'

import React, { Fragment } from 'react'

const SliderRail = ({ getRailProps }) => {
	return (
		<Fragment>
			<div 
				className="obojobo-draft--components--slider--slider-rail-outer" 
				{...getRailProps()}/>
			<div 
				className="obojobo-draft--components--slider--slider-rail-inner"/>
		</Fragment>
	)
}

export default SliderRail