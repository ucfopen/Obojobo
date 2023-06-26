const React = require('react')

const CourseScoreDataListItem = ({
	// isSelected,
	// onClick,
	// index,
	// createdAtDisplay,
	// username,
	// isLatestVersion,
	// versionNumber,

	courseTitle,
	courseLabel,
	courseUserCount,
	courseLastAccessed,
	onClick,
	isSelected,
	index,
}) => {
	const onClickHandler = React.useCallback(() => {
		onClick(index)
	}, [index])

	const className = 'course-score-data-list--item' + (isSelected ? ' is-selected' : '')

	const titleAndLabel = ( <div className="courseTitle">{courseTitle} ({courseLabel})</div> )
	const userCount = ( <div className="userCount">{courseUserCount} Learner{courseUserCount === 1 ? '' : 's'}</div>)
	const accessed = ( <div className="accessed">Last Accessed &nbsp; <span className="timestamp">{courseLastAccessed}</span></div> )
	return (
		<div className={className} onClick={onClickHandler}>
			{titleAndLabel}
			{userCount}
			{accessed}
		</div>
	)
}

module.exports = CourseScoreDataListItem
