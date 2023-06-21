require('./assessment-score-data-dialog.scss')

const React = require('react')
const ModuleImage = require('./module-image')
const Button = require('./button')
const Loading = require('./loading')
const CourseStats = require('./stats/course-stats')
// const AssessmentStats = require('./stats/assessment-stats')

const CourseScoreDataDialog = ({ draftId, title, onClose, isCoursesLoading, courses }) => {
	return (
		<div className="assessment-score-data-dialog">
			<div className="assessment-score-data-dialog--header">
				<ModuleImage id={draftId} />
				<div className="title">{title}</div>
				<Button className="close-button" onClick={onClose} ariaLabel="Close dialog">
					×
				</Button>
			</div>
			<div className="assessment-score-data-dialog--body">
				<Loading isLoading={isCoursesLoading} loadingText={'Loading course data...'}>
					{<CourseStats courses={courses} /> }
				</Loading>
			</div>
		</div>
	)
}

module.exports = CourseScoreDataDialog
