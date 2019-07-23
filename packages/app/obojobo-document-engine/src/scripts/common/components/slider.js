import React from 'react'

import './slider.scss'

/* istanbul ignore next */
const noOp = () => {}

const Slider = ({title = '', initialChecked = false, handleCheckChange = noOp}) =>
	<div className='obojobo-draft--components--slider'>
		<span contentEditable={false} >{title + ': '}</span>
		<label className='switch'>
			<input
				className='slider'
				type='checkbox'
				checked={initialChecked}
				onChange={event => {handleCheckChange(event.target.checked)}}
			/>
			<div className="slider round" />
		</label>
	</div>

export default Slider
