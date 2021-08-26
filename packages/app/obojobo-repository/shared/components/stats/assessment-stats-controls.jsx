require('./assessment-stats-controls.scss')

const { useDebouncedCallback } = require('use-debounce')
const React = require('react')
const Button = require('../button')
const HybridInputSelect = require('../hybrid-input-select')
const { convertHyphenBasedStringToCamelCase } = require('../../util/misc-stats-util')

const SEARCH_INPUT_DEBOUNCE_MS = 500

const AssessmentStatsControls = ({
	controls,
	onChangeControls,
	dateBounds,
	dropdownValues = [],
	setIsDebouncing
}) => {
	const [param, setParam] = React.useState('')
	const [endDate, setEndDate] = React.useState('')
	const [textInput, setTextInput] = React.useState('')
	const [startDate, setStartDate] = React.useState('')

	const debouncedOnChangeSearchContent = useDebouncedCallback(searchTerm => {
		setIsDebouncing(false)
		const oldControls = Object.assign({}, controls)

		onChangeControls(
			Object.assign(oldControls, {
				searchContent: {
					searchString: searchTerm,
					date: { start: startDate, end: endDate }
				}
			})
		)
	}, SEARCH_INPUT_DEBOUNCE_MS)

	const onChangeSearchSettings = event => {
		const oldControls = Object.assign({}, controls)

		const value = event.target.value

		setParam(value)

		onChangeControls(Object.assign(oldControls, { searchBy: value }))
	}

	const onChangeSearchContent = event => {
		const value = event.target.value

		setTextInput(value)
		debouncedOnChangeSearchContent(value)
		setIsDebouncing(true)

		// If the user clears out the input go ahead and update the search without a delay
		if (value.length === 0) {
			debouncedOnChangeSearchContent.flush()
		}
	}

	const onChangeStartDate = newDate => {
		const oldControls = Object.assign({}, controls)

		setStartDate(newDate)

		onChangeControls(
			Object.assign(oldControls, {
				searchContent: {
					searchString: textInput,
					date: { start: newDate, end: endDate }
				}
			})
		)
	}

	const onChangeEndDate = newDate => {
		const oldControls = Object.assign({}, controls)

		setEndDate(newDate)

		onChangeControls(
			Object.assign(oldControls, {
				searchContent: {
					searchString: textInput,
					date: { start: startDate, end: newDate }
				}
			})
		)
	}

	const onChangeShowIncompleteAttempts = event => {
		const oldControls = Object.assign({}, controls)

		onChangeControls(
			Object.assign(oldControls, {
				showPreviewAttempts: controls.showPreviewAttempts,
				showAdvancedFields: controls.showAdvancedFields,
				showIncompleteAttempts: event.target.checked
			})
		)
	}

	const onChangeShowPreviewAttempts = event => {
		const oldControls = Object.assign({}, controls)

		onChangeControls(
			Object.assign(oldControls, {
				showIncompleteAttempts: controls.showIncompleteAttempts,
				showAdvancedFields: controls.showAdvancedFields,
				showPreviewAttempts: event.target.checked
			})
		)
	}

	const onChangeShowAdvancedFields = event => {
		const oldControls = Object.assign({}, controls)

		onChangeControls(
			Object.assign(oldControls, {
				showIncompleteAttempts: controls.showIncompleteAttempts,
				showPreviewAttempts: controls.showPreviewAttempts,
				showAdvancedFields: event.target.checked
			})
		)
	}

	const valuesForHybridInput = dropdownValues.map(row =>
		row[convertHyphenBasedStringToCamelCase(param)])

	const showHybridInput = param !== ''

	const textPlaceholder = param
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.substring(1))
		.join(' ')

	return (
		<div className="repository--assessment-stats-controls">
			<div className="search-controls">
				<div className="search-by-text">
					<label htmlFor="repository--assessment-stats-search-controls--search-by">
						Search by:{' '}
					</label>
					<div className="controls">
						<select
							id="repository--assessment-stats-search-controls--search-by"
							onChange={onChangeSearchSettings}
						>
							<option value="">Select one...</option>
							<option value="course-title">Course title</option>
							<option value="resource-link-title">Resource link title</option>
							<option value="student-name">Student name</option>
						</select>
						{showHybridInput && (
							<HybridInputSelect
								placeholder={textPlaceholder}
								list={valuesForHybridInput}
								onChange={onChangeSearchContent}
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
								min={dateBounds.start}
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
								max={dateBounds.end}
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
			<hr />
			<div className="filter-controls">
				<label>
					<input
						className="show-incomplete-attempts"
						type="checkbox"
						checked={controls.showIncompleteAttempts}
						onChange={onChangeShowIncompleteAttempts}
					/>
					<span>Include incomplete attempt data</span>
				</label>
				<label>
					<input
						className="show-preview-attempts"
						type="checkbox"
						checked={controls.showPreviewAttempts}
						onChange={onChangeShowPreviewAttempts}
					/>
					<span>Include preview attempt data</span>
				</label>
				<hr />
				<label>
					<input
						className="show-advanced-fields"
						type="checkbox"
						checked={controls.showAdvancedFields}
						onChange={onChangeShowAdvancedFields}
					/>
					<span>Include advanced fields</span>
				</label>
			</div>
		</div>
	)
}

module.exports = AssessmentStatsControls
