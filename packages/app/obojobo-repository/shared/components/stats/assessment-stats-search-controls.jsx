require('./assessment-stats-search-controls.scss')

const debounce = require('obojobo-document-engine/src/scripts/common/util/debounce')
const React = require('react')
const Button = require('../button')

const SEARCH_INPUT_DEBOUNCE_MS = 500

const AssessmentStatsSearchControls = ({ onChangeSearchSettings, onChangeSearchContent }) => {
	const [param, setParam] = React.useState('')
	const [textInput, setTextInput] = React.useState('')
	const [startDate, setStartDate] = React.useState('')
	const [endDate, setEndDate] = React.useState('')

	const debouncedOnChangeSearchContent = debounce(SEARCH_INPUT_DEBOUNCE_MS, onChangeSearchContent)

	const handleSearchSettingsChange = event => {
		const value = event.target.value
		setParam(value)
		onChangeSearchSettings(value)
	}

	const handleSearchContentChange = event => {
		const value = event.target.value
		setTextInput(value)

		if (value.length === 0) {
			onChangeSearchContent({
				text: value,
				date: { start: startDate, end: endDate }
			})
		} else {
			debouncedOnChangeSearchContent({
				text: value,
				date: { start: startDate, end: endDate }
			})
		}
	}

	const handleDateSearchStartDate = event => {
		const date = event.target.value
		setStartDate(date)
		onChangeSearchContent({
			text: textInput,
			date: { start: date, end: endDate }
		})
	}

	const handleDateSearchEndDate = event => {
		const date = event.target.value
		setEndDate(date)
		onChangeSearchContent({
			text: textInput,
			date: { start: startDate, end: date }
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
						<input value={startDate} type="date" onChange={handleDateSearchStartDate} />
						<Button
							disabled={startDate === ''}
							onClick={() => setStartDate('')}
							className="secondary-button"
						>
							&times; Clear
						</Button>
					</div>
				</label>

				<label>
					<span>To:</span>
					<div className="date-range">
						<input value={endDate} type="date" onChange={handleDateSearchEndDate} />
						<Button
							disabled={endDate === ''}
							onClick={() => setEndDate('')}
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
