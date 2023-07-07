require('./course-stats-search-controls.scss')

const React = require('react')
const Button = require('../button')

const SEARCH_INPUT_DEBOUNCE_MS = 500

const CourseStatsSearchControls = ({
	searchSettings,
	onChangeSearchSettings,
	onChangeSearchContent,
	debounceSearch = true
}) => {
	const [textInput, setTextInput] = React.useState('')
	const [startDate, setStartDate] = React.useState('')
	const [endDate, setEndDate] = React.useState('')
	const [timerId, setTimerId] = React.useState(null)

	// The oldTimerId is just the timerId, but I have to pass it for the unit tests to work properly
	const clearOldTimer = oldTimerId => {
		clearTimeout(oldTimerId)
		setTimerId(null)
	}

	const debouncedOnChangeSearchContent = (searchTerm, timerId) => {
		clearOldTimer(timerId)
		const newTimerId = setTimeout(
			() =>
				onChangeSearchContent({
					text: searchTerm,
					date: { start: startDate, end: endDate }
				}),
			SEARCH_INPUT_DEBOUNCE_MS
		)
		setTimerId(newTimerId)
	}

	const handleSearchSettingsChange = event => {
		const value = event.target.value
		onChangeSearchSettings(value)
	}

	const handleSearchContentChange = event => {
		const value = event.target.value.trim()
		setTextInput(value)

		// If the user clears out the input (length == 0) go ahead and update the search without a delay
		if (!debounceSearch || value.length == 0) {
			clearOldTimer(timerId)
			onChangeSearchContent({
				text: value,
				date: { start: startDate, end: endDate }
			})
		} else {
			debouncedOnChangeSearchContent(value, timerId)
		}
	}

	const clearFilter = () => {
		setTextInput('')
		clearOldTimer(timerId)
		onChangeSearchContent({
			text: '',
			date: { start: startDate, end: endDate }
		})
	}

	const onChangeStartDate = newDate => {
		setStartDate(newDate)
		clearOldTimer(timerId)
		onChangeSearchContent({
			text: textInput,
			date: { start: newDate, end: endDate }
		})
	}

	const onChangeEndDate = newDate => {
		setEndDate(newDate)
		clearOldTimer(timerId)
		onChangeSearchContent({
			text: textInput,
			date: { start: startDate, end: newDate }
		})
	}

	const showTextInput = searchSettings !== ''

	const textPlaceholder = searchSettings
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.substring(1))
		.join(' ')

	const searchFilterActive = showTextInput && textInput !== ''

	return (
		<div className="repository--course-stats-search-controls">
			<div className="search-by-text">
				<label htmlFor="repository--course-stats-search-controls--search-by">Filter by: </label>
				<div className="controls">
					<select
						id="repository--course-stats-search-controls--search-by"
						onChange={handleSearchSettingsChange}
						className={searchFilterActive ? 'filter-active' : ''}
					>
						<option value="">Select one...</option>
						{/* <option value="course-title">Course title</option> */}
						<option value="resource-link-title">Resource link title</option>
						<option value="user-first-name">First name</option>
						<option value="user-last-name">Last name</option>
					</select>
					{showTextInput && (
						<input
							className={'text-input' + (searchFilterActive ? ' filter-active' : '')}
							type="text"
							value={textInput}
							onChange={handleSearchContentChange}
							placeholder={textPlaceholder}
						/>
					)}
				</div>
				<div className="clear-button-container">
					<Button
						alt="Clear Filter"
						title="Clear Filter"
						disabled={!searchFilterActive}
						onClick={() => clearFilter()}
						className="clear-button"
					>
						&times;
					</Button>
				</div>
			</div>
			<div className="search-by-date">
				<label>
					<span>From:</span>
					<div className="date-range">
						<input
							value={startDate}
							type="date"
							onChange={event => onChangeStartDate(event.target.value)}
						/>
					</div>
					<div className="clear-button-container">
						<Button
							alt="Clear Start Date"
							disabled={startDate === ''}
							onClick={() => onChangeStartDate('')}
							className="clear-button"
						>
							&times;
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
					</div>
					<div className="clear-button-container">
						<Button
							alt="Clear End Date"
							disabled={endDate === ''}
							onClick={() => onChangeEndDate('')}
							className="clear-button"
						>
							&times;
						</Button>
					</div>
				</label>
			</div>
		</div>
	)
}

module.exports = CourseStatsSearchControls
