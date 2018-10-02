import React from 'react'

const LatexIcon = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
			<defs>
				<style type="text/css">
					{`.icon{fill:#ffffff; font-family:'Times-Italic'; font-size:14px;}`}
				</style>
			</defs>
			<text transform="matrix(1 0 0 1 8.9279 18.4814)">
				<tspan x="0" y="0" className="icon">
					f
				</tspan>
				<tspan x="4.3" y="0" className="icon">
					(
				</tspan>
				<tspan x="7.3" y="0" className="icon">
					x
				</tspan>
				<tspan x="11.9" y="0" className="icon">
					)
				</tspan>
			</text>
		</svg>
	)
}

export default LatexIcon
