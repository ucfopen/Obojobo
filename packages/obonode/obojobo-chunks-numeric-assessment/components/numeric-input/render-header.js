import constant from '../../constant'

const { EXACT_ANSWER, MARGIN_OF_ERROR, WITHIN_A_RANGE, PRECISE_RESPONSE } = constant

const renderHeader = requirement => {
	switch (requirement) {
		case EXACT_ANSWER:
			return (
				<>
					<th>Answer</th>
				</>
			)
		case MARGIN_OF_ERROR:
			return (
				<>
					<th>Type</th>
					<th>Answer</th>
					<th>Margin</th>
				</>
			)
		case WITHIN_A_RANGE:
			return (
				<>
					<th>Start</th>
					<th>End</th>
				</>
			)
		case PRECISE_RESPONSE:
			return (
				<>
					<th>Type</th>
					<th>Answer</th>
					<th>Precision</th>
				</>
			)
	}
}

export default renderHeader
