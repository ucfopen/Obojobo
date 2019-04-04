import React from 'react'

const TextChunk = props => (
	<div className={`text-chunk${props.className ? ` ${props.className}` : ''}`}>
		{props.children}
	</div>
)

export default TextChunk
