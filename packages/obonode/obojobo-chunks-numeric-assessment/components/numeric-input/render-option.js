import constant from '../../constant'

const {
	EXACT_ANSWER,
	MARGIN_OF_ERROR,
	WITHIN_A_RANGE,
	PRECISE_RESPONSE,

	marginDropdown,
	precisionDropdown
} = constant

const renderOption = (scoreRule, onInputChange, onClickDropdown) => {
	const {
		requirement,
		answerInput,
		startInput,
		endInput,
		marginInput,
		precisionInput,
		marginType,
		precisionType
	} = scoreRule

	switch (requirement) {
		case EXACT_ANSWER:
			return (
				<td>
					<input
						className="input-item"
						name="answerInput"
						value={answerInput}
						onChange={() => onInputChange(event)}
					/>
				</td>
			)
		case PRECISE_RESPONSE:
			return (
				<>
					<td>
						<select
							className="select-item"
							name="precisionType"
							value={precisionType}
							onChange={() => onClickDropdown(event)}
						>
							{precisionDropdown.map(requirement => (
								<option>{requirement}</option>
							))}
						</select>
					</td>
					<td>
						<input
							className="input-item"
							name="answerInput"
							value={answerInput}
							onChange={event => onInputChange(event)}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="precisionInput"
							value={precisionInput}
							onChange={() => onInputChange(event)}
						/>
					</td>
				</>
			)
		case WITHIN_A_RANGE:
			return (
				<>
					<td>
						<input
							className="input-item"
							name="startInput"
							value={startInput}
							onChange={() => onInputChange(event)}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="endInput"
							value={endInput}
							onChange={() => onInputChange(event)}
						/>
					</td>
				</>
			)
		case MARGIN_OF_ERROR:
			return (
				<>
					<td>
						<select
							className="select-item"
							name="marginType"
							value={marginType}
							onChange={event => onClickDropdown(event)}
						>
							{marginDropdown.map(requirement => (
								<option>{requirement}</option>
							))}
						</select>
					</td>
					<td>
						<input
							className="input-item"
							name="answerInput"
							value={answerInput}
							onChange={() => onInputChange(event)}
						/>
					</td>
					<td>
						<input
							className="input-item"
							name="marginInput"
							value={marginInput}
							onChange={() => onInputChange(event)}
						/>
					</td>
				</>
			)
	}
}

export default renderOption
