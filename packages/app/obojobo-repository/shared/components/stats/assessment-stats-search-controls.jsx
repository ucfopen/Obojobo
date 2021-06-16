require('./assessment-stats-search-controls.scss')

const React = require('react')

const AssessmentStatsSearchControls = ({ onChangeSearchSettings, onChangeSearchContent }) => {
	const [param, setParam] = React.useState('');
	const [textInput, setTextInput] = React.useState('');
	const [startDate, setStartDate] = React.useState(null);
	const [endDate, setEndDate] = React.useState(null);

	const handleSearchSettingsChange = (event) => {
		const value = event.target.value;
		setParam(value);
		onChangeSearchSettings(value)
	}

	const handleSearchContentChange = (event) => {
		const value = event.target.value;
		setTextInput(value);
		onChangeSearchContent({
			text: value,
			date: { start: startDate, end: endDate }
		});
	}

	const handleDateSearchStartDate = (event) => {
		const date = event.target.value
		setStartDate(date)
		onChangeSearchContent({
			text: textInput,
			date: { start: date, end: endDate }
		});
	}

	const handleDateSearchEndDate = (event) => {
		const date = event.target.value;
		setEndDate(date)
		onChangeSearchContent({
			text: textInput,
			date: { start: startDate, end: date }
		});
	}

	const showTextInput = param !== ""

	const textPlaceholder =
		param.split("-").map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(" ")

	return (
		<div className="repository--assessment-stats-search-controls">
			<div className="search-by-text">
				<label htmlFor="search-by">Search by: </label>
				<select id='search-by' onChange={handleSearchSettingsChange}>
					<option value="">Select a search parameter</option>
					<option value="course-title">Course title</option>
					<option value="resource-link-title">Resource link title</option>
					<option value="user-first-name">First name</option>
					<option value="user-last-name">Last name</option>
				</select>
				{showTextInput && (
					<input
						type="text"
						value={textInput}
						onChange={handleSearchContentChange}
						placeholder={textPlaceholder}
					/>
				)}
			</div>
			<div className="search-by-date">
				<label htmlFor="date-range">Select a date range: </label>
				<div className="date-range">
					<input
						type="date"
						onChange={handleDateSearchStartDate}
					/>
					<input
						type="date"
						onChange={handleDateSearchEndDate}
					/>
				</div>
			</div>
		</div>
	)
}

module.exports = AssessmentStatsSearchControls;
