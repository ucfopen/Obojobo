require('./assessment-stats-filter-controls.scss')
const React = require('react')

function AssessmentStatsFilterControls({ filterSettings, onChangeFilterSettings }) {
	const onChangeShowIncompleteAttempts = event => {
		onChangeFilterSettings({
			showPreviewAttempts: filterSettings.showPreviewAttempts,
			showAdvancedFields: filterSettings.showAdvancedFields,
			showIncompleteAttempts: event.target.checked
		})
	}

	const onChangeShowPreviewAttempts = event => {
		onChangeFilterSettings({
			showIncompleteAttempts: filterSettings.showIncompleteAttempts,
			showAdvancedFields: filterSettings.showAdvancedFields,
			showPreviewAttempts: event.target.checked
		})
	}

	const onChangeShowAdvancedFields = event => {
		onChangeFilterSettings({
			showIncompleteAttempts: filterSettings.showIncompleteAttempts,
			showPreviewAttempts: filterSettings.showPreviewAttempts,
			showAdvancedFields: event.target.checked
		})
	}

	return (
		<div className="repository--assessment-stats-filter-controls">
			<div className="container">
				<label>
					<input
						type="checkbox"
						checked={filterSettings.showIncompleteAttempts}
						onChange={onChangeShowIncompleteAttempts}
					/>
					<span>Include incomplete attempt data</span>
				</label>
				<label>
					<input
						type="checkbox"
						checked={filterSettings.showPreviewAttempts}
						onChange={onChangeShowPreviewAttempts}
					/>
					<span>Include preview attempt data</span>
				</label>
				<hr />
				<label>
					<input
						type="checkbox"
						checked={filterSettings.showAdvancedFields}
						onChange={onChangeShowAdvancedFields}
					/>
					<span>Show advanced fields</span>
				</label>
			</div>
		</div>
	)
}

module.exports = AssessmentStatsFilterControls
