import './numeric-input-more-info-button.scss'

import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'

const { MoreInfoButton } = Common.components

const NumericInputMoreInfoButton = () => {
	return (
		<div className="obojobo-draft--chunks--numeric-assessment--input-more-info">
			<MoreInfoButton ariaLabel="Click to explain attempt score in detail">
				<div className="wrapper">
					<span className="about">How to input your answer - some examples:</span>
					<ul>
						<li>
							<b>Decimal:</b>
							<span>42</span>, <span>19.6</span>, <span>100.</span>
						</li>
						<li>
							<b>Fraction:</b>
							<span>99/13</span>, <span>7/8</span>, <span>14/16</span>
						</li>
						<li>
							<b>Scientific Notation:</b>
							<span>1.23e9</span>, <span>1.23*10^9</span>, <span>1.23x10^9</span>
						</li>
						<li>
							<b>Hexadecimal:</b>
							<span>0xF90F</span>, <span>#F90F</span>, <span>$F9OF</span>
						</li>
						<li>
							<b>Octal:</b>
							<span>0o644</span>
						</li>
						<li>
							<b>Binary:</b>
							<span>0b1101</span>
						</li>
					</ul>
				</div>
			</MoreInfoButton>
		</div>
	)
}

export default NumericInputMoreInfoButton
