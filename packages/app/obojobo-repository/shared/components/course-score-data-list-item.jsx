const React = require('react')

// This component is the clickable list item for the "Course Stats" dialog. Each instance is a different available course.
const CourseScoreDataListItem = ({
	courseTitle,
	courseLabel,
	courseUserCount,
	courseLastAccessed,
	courseClick,
	isSelected,
	index
}) => {
	const onClickHandler = React.useCallback(() => {
		courseClick(index)
	}, [index])

	const className = 'course-score-data-list--item' + (isSelected ? ' is-selected' : '')

	const titleAndLabel = (
		<div className="courseTitle">
			{courseTitle} ({courseLabel})
		</div>
	)
	const userCount = (
		<div className="userCount">
			{courseUserCount} Learner{courseUserCount === 1 ? '' : 's'}
		</div>
	)
	const accessed = (
		<div className="accessed">
			Last Accessed &nbsp; <span className="timestamp">{courseLastAccessed}</span>
		</div>
	)
	return (
		<div className={className} onClick={onClickHandler}>
			{titleAndLabel}
			{userCount}
			{accessed}
		</div>
	)
}

module.exports = CourseScoreDataListItem
