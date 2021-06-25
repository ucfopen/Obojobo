require('./assessment-stats-search-controls.scss')

const { useDebouncedCallback } = require('use-debounce')
const React = require('react')
const Button = require('../button')

const SEARCH_INPUT_DEBOUNCE_MS = 500

const AssessmentStatsSearchControls = ({ onChangeSearchSettings, onChangeSearchContent }) => {
	const [param, setParam] = React.useState('')
	const [textInput, setTextInput] = React.useState('')
	const [startDate, setStartDate] = React.useState('')
	const [endDate, setEndDate] = React.useState('')

	const debouncedOnChangeSearchContent = useDebouncedCallback(searchTerm => {
		onChangeSearchContent({
			text: searchTerm,
			date: { start: startDate, end: endDate }
		})
	}, SEARCH_INPUT_DEBOUNCE_MS)

	const handleSearchSettingsChange = event => {
		const value = event.target.value

		setParam(value)
		onChangeSearchSettings(value)
	}

	const handleSearchContentChange = event => {
		const value = event.target.value

		setTextInput(value)
		debouncedOnChangeSearchContent(value)

		// If the user clears out the input go ahead and update the search without a delay
		if (value.length === 0) {
			debouncedOnChangeSearchContent.flush()
		}
	}

	const onChangeStartDate = newDate => {
		setStartDate(newDate)
		onChangeSearchContent({
			text: textInput,
			date: { start: newDate, end: endDate }
		})
	}

	const onChangeEndDate = newDate => {
		setEndDate(newDate)
		onChangeSearchContent({
			text: textInput,
			date: { start: startDate, end: newDate }
		})
	}

	const showTextInput = param !== ''

	const textPlaceholder = param
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.substring(1))
		.join(' ')

	return (
		<div className="repository--assessment-stats-search-controls">
			<div className="search-by-text">
				<label htmlFor="repository--assessment-stats-search-controls--search-by">Search by: </label>
				<div className="controls">
					<select
						id="repository--assessment-stats-search-controls--search-by"
						onChange={handleSearchSettingsChange}
					>
						<option value="">Select one...</option>
						<option value="course-title">Course title</option>
						<option value="resource-link-title">Resource link title</option>
						<option value="user-first-name">First name</option>
						<option value="user-last-name">Last name</option>
					</select>
					{showTextInput && (
						<input
							className="text-input"
							type="text"
							value={textInput}
							onChange={handleSearchContentChange}
							placeholder={textPlaceholder}
						/>
					)}
				</div>
			</div>
			<hr />
			<div className="search-by-date">
				<span className="label">Filter attempts by date range:</span>
				<label>
					<span>From:</span>
					<div className="date-range">
						<input
							value={startDate}
							type="date"
							onChange={event => onChangeStartDate(event.target.value)}
						/>
						<Button
							disabled={startDate === ''}
							onClick={() => onChangeStartDate('')}
							className="secondary-button"
						>
							&times; Clear
						</Button>
					</div>
				</label>

				<label>
					<span>To:</span>
					<div className="date-range">
						<input
							value={endDate}
							type="date"
							onChange={event => onChangeEndDate(event.target.value)}
						/>
						<Button
							disabled={endDate === ''}
							onClick={() => onChangeEndDate('')}
							className="secondary-button"
						>
							&times; Clear
						</Button>
					</div>
				</label>
			</div>
		</div>
	)
}

module.exports = AssessmentStatsSearchControls
