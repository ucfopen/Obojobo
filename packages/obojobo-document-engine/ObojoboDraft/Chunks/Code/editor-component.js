import React from 'react'

const Code = props => {
	return (
		<div className={`text-chunk obojobo-draft--chunks--code pad`}>
			<pre>
				<code>{props.children}</code>
			</pre>
		</div>
	)
}

export default Code
