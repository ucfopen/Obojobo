import React from 'react'

import {
	EXACT_ANSWER,
	MARGIN_OF_ERROR,
	WITHIN_A_RANGE,
	PRECISE_RESPONSE,
	simplifedToFullText
} from '../../constants'

const NumericHeader = ({ requirement }) => {
	switch (simplifedToFullText[requirement]) {
		case MARGIN_OF_ERROR:
			return (
				<tr>
					<th>Requirement</th>
					<th>Type</th>
					<th>Answer</th>
					<th>Margin</th>
				</tr>
			)
		case WITHIN_A_RANGE:
			return (
				<tr>
					<th>Requirement</th>
					<th>Start</th>
					<th>End</th>
				</tr>
			)
		case PRECISE_RESPONSE:
			return (
				<tr>
					<th>Requirement</th>
					<th>Type</th>
					<th>Answer</th>
					<th>Precision</th>
				</tr>
			)
		default:
		case EXACT_ANSWER:
			return (
				<tr>
					<th>Requirement</th>
					<th>Answer</th>
				</tr>
			)
	}
}
export default NumericHeader
