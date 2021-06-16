require('./assessment-stats-search-controls.scss')

const React = require('react')

const AssessmentStatsSearchControls = ({ onChangeSearchSettings, onChangeSearchContent }) => {
	const [param, setParam] = React.useState('');
	const [textInput, setTextInput] = React.useState('');

	const handleSearchSettingsChange = (event) => {
		const value = event.target.value;
		setParam(value);
		onChangeSearchSettings(value)
	}

	const handleSearchContentChange = (event) => {
		const value = event.target.value;
		setTextInput(value);
		onChangeSearchContent(value);
	}

	const handleDateSearchStartDate = (event) => {
		console.log(event.target.value)
	}

	const handleDateSearchEndDate = (event) => {
		console.log(event.target.value)
	}

	const showTextInput =
		param === "course-title" ||
		param === "resource-link-title" ||
		param === "user-first-name" ||
		param === "user-last-name"

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
			<div className='search-by-date'>
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
