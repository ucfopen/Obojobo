import React from 'react'

const Text = props => {
	return (
		<div className={'text-chunk obojobo-draft--chunks--single-text pad'}>
			{props.children}
		</div>
	)
}

export default Text
